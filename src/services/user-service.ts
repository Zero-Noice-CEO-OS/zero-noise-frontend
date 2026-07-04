import { apiClient } from './api-client';
import { User } from './auth-service';

export interface UserPreference {
  timezone: string;
  theme: string;
  dayStart: string;
  dayEnd: string;
  reminderEnabled: boolean;
  notificationEnabled: boolean;
  aiEnabled: boolean;
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string; timezone?: string; mobileNumber?: string; role?: string }): Promise<User> {
    const response = await apiClient.patch<User>('/users/me', data);
    return response.data;
  },

  async changePassword(data: any): Promise<any> {
    const response = await apiClient.patch('/users/change-password', data);
    return response.data;
  },

  async verifyChangePassword(code: string): Promise<any> {
    const response = await apiClient.patch('/users/verify-change-password', { code });
    return response.data;
  },

  async changeEmailRequest(newEmail: string): Promise<any> {
    const response = await apiClient.patch('/users/change-email-request', { newEmail });
    return response.data;
  },

  async verifyChangeEmail(newEmail: string, code: string): Promise<any> {
    const response = await apiClient.patch('/users/verify-change-email', { newEmail, code });
    return response.data;
  },

  async getPreferences(): Promise<UserPreference> {
    const response = await apiClient.get<UserPreference>('/users/preferences');
    return response.data;
  },

  async updatePreferences(data: Partial<UserPreference>): Promise<UserPreference> {
    const response = await apiClient.patch<UserPreference>('/users/preferences', data);
    return response.data;
  },
};
