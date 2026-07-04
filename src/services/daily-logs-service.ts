import { apiClient } from './api-client';

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  energy: number;
  topPriorities: string[];
  mainSkill: string | null;
  risks: string | null;
  wins: string | null;
  misses: string | null;
  lessons: string | null;
  tomorrowPriorities: string | null;
  ceoScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDailyLogs {
  data: DailyLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMorningCheckIn {
  date: string;
  energy: number;
  topPriorities: string[];
  mainSkill: string;
  risks?: string;
}

export interface UpdateEveningReview {
  wins?: string;
  misses?: string;
  lessons?: string;
  tomorrowPriorities?: string;
}

export const dailyLogsService = {
  async getLogs(params?: { page?: number; limit?: number; from?: string; to?: string }): Promise<PaginatedDailyLogs> {
    const response = await apiClient.get<PaginatedDailyLogs>('/daily-logs', { params });
    return response.data;
  },

  async getLogByDate(dateStr: string): Promise<DailyLog | null> {
    try {
      const response = await apiClient.get<DailyLog>(`/daily-logs/${dateStr}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async submitMorningCheckIn(data: CreateMorningCheckIn): Promise<DailyLog> {
    const response = await apiClient.post<DailyLog>('/daily-logs', data);
    return response.data;
  },

  async submitEveningReview(dateStr: string, data: UpdateEveningReview): Promise<DailyLog> {
    const response = await apiClient.patch<DailyLog>(`/daily-logs/${dateStr}`, data);
    return response.data;
  },
};
