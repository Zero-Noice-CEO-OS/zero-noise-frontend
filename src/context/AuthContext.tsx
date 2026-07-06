'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User, authService } from '@/services/auth-service';
import { setAccessToken, apiClient } from '@/services/api-client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 400 || status === 401 || status === 404) {
          return false;
        }
        if (status >= 500) {
          return failureCount < 2;
        }
        return failureCount < 1;
      },
    },
  },
});

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  authReady: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const login = (accessToken: string, user: User) => {
    setAccessToken(accessToken);
    setUserState(user);
    setAuthReady(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Error logging out from backend', e);
    } finally {
      setAccessToken(null);
      setUserState(null);
      setAuthReady(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    let active = true;
    const initAuth = async () => {
      try {
        console.log('[Auth] Starting session initialization...');
        const refreshRes = await authService.refresh();
        console.log('[Auth] Refresh successful.');
        if (active) {
          setAccessToken(refreshRes.accessToken);
          const meRes = await apiClient.get<User>('/users/me');
          setUserState(meRes.data);
          console.log('[Auth] Session restored.');
        }
      } catch (err: any) {
        if (active) {
          setAccessToken(null);
          setUserState(null);
        }

        const status = err?.response?.status;
        const errorMessage = err?.response?.data?.message || err?.message || '';

        const isNormalUnauthenticated =
          status === 400 ||
          status === 401 ||
          errorMessage.includes('NO_REFRESH_TOKEN') ||
          err === 'NO_REFRESH_TOKEN';

        if (isNormalUnauthenticated) {
          console.log('[Auth] No existing session found.');
        } else {
          console.error('Failed to initialize session', err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
          setAuthReady(true);
        }
      }
    };

    initAuth();
    return () => {
      active = false;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading, authReady, login, logout, setUser }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
