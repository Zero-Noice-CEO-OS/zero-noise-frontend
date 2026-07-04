import { apiClient, executeRefreshToken } from './api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  async signup(data: any): Promise<User> {
    const response = await apiClient.post<User>('/auth/signup', data);
    return response.data;
  },

  async login(data: any): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    // Body is empty or optional as cookie handles it
    const response = await apiClient.post<{ message: string }>('/auth/logout', {});
    return response.data;
  },

  async refresh(): Promise<RefreshResponse> {
    return executeRefreshToken();
  },

  async forgotPassword(email: string): Promise<any> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async verifyOtp(email: string, code: string): Promise<any> {
    const response = await apiClient.post('/auth/verify-otp', { email, code });
    return response.data;
  },

  async resetPassword(data: any): Promise<any> {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};
