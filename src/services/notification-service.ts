import { apiClient } from './api-client';

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'REMINDER' | 'NUDGE' | 'SUMMARY' | 'ALERT';
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  readAt: string | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const notificationService = {
  async getNotifications(params?: { page?: number; limit?: number }): Promise<PaginatedNotifications> {
    const response = await apiClient.get<PaginatedNotifications>('/notifications', { params });
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  async markAllRead(): Promise<{ count: number }> {
    const response = await apiClient.patch<{ count: number }>('/notifications/read-all');
    return response.data;
  },

  async markRead(id: string): Promise<NotificationItem> {
    const response = await apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
    return response.data;
  },
};
