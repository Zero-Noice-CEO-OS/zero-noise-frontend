import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for cookies containing HTTP-only refresh tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;
let refreshPromise: Promise<{ accessToken: string }> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('has_token', 'true');
    } else {
      localStorage.removeItem('has_token');
    }
  }
};

export const getAccessToken = () => accessToken;

// A single unified lock for any refresh operations
export const executeRefreshToken = async (): Promise<{ accessToken: string }> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      console.log('[Auth] Initiating single startup token refresh...');
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('No access token returned from refresh endpoint');
      }
      setAccessToken(newAccessToken);
      return { accessToken: newAccessToken };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and envelope unwrapping
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken: newAccessToken } = await executeRefreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        const status = refreshError.response?.status;
        if (status === 401) {
          setAccessToken(null);
          // Redirect to login if in browser
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/login') &&
            !window.location.pathname.startsWith('/signup')
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
