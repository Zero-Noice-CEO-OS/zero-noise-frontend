'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
  '/documentation',
  '/help',
  '/faq',
  '/blog',
  '/release-notes',
  '/features',
  '/bug-report',
  '/status',
  '/roadmap'
];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );
    const isLoginOrSignup = pathname === '/login' || pathname === '/signup';

    if (!user && !isPublicPath) {
      // Redirect unauthenticated to login
      router.push('/login');
    } else if (user && isLoginOrSignup) {
      // Redirect authenticated away from login/signup to dashboard
      router.push('/dashboard');
    }

    // Request browser notification permission once user is authenticated
    if (user && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(console.error);
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <span className="absolute text-xs font-bold text-primary">ZN</span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-textSecondary animate-pulse">
          Initializing Workspace...
        </p>
      </div>
    );
  }

  const isPublicPath = PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  const isLoginOrSignup = pathname === '/login' || pathname === '/signup';

  if (!user && !isPublicPath) {
    // Avoid flash of content during redirect
    return null;
  }

  if (user && isLoginOrSignup) {
    // Avoid flash of login page if already logged in
    return null;
  }

  return <>{children}</>;
}
