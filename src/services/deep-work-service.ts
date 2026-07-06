import { apiClient } from './api-client';

export interface DeepWorkSession {
  id: string;
  userId: string;
  goalId: string | null;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  plannedDurationMinutes: number;
  actualDurationMinutes: number | null;
  interruptions: number;
  output: string | null;
  startedAt: string;
  endedAt: string | null;
  pausedDurationMinutes: number;
  lastPausedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDeepWork {
  data: DeepWorkSession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeepWorkAnalytics {
  todayTotalMinutes: number;
  weeklyTotalMinutes: number;
  averageSessionMinutes: number;
  streakDays: number;
  weeklyHistory: Array<{ day: string; dateStr?: string; minutes: number; isFuture?: boolean }>;
}

export const deepWorkService = {
  async startSession(data: {
    goalId?: string;
    plannedDurationMinutes: number;
    output?: string;
  }): Promise<DeepWorkSession> {
    const response = await apiClient.post<DeepWorkSession>('/deep-work/start', data);
    return response.data;
  },

  async pauseSession(id: string, reason?: string): Promise<DeepWorkSession> {
    const response = await apiClient.post<DeepWorkSession>(`/deep-work/${id}/pause`, { reason });
    return response.data;
  },

  async resumeSession(id: string): Promise<DeepWorkSession> {
    const response = await apiClient.post<DeepWorkSession>(`/deep-work/${id}/resume`);
    return response.data;
  },

  async completeSession(
    id: string,
    data: {
      output: string;
      interruptions: number;
    }
  ): Promise<DeepWorkSession> {
    const response = await apiClient.post<DeepWorkSession>(`/deep-work/${id}/complete`, data);
    return response.data;
  },

  async updateSession(
    id: string,
    data: {
      output?: string;
      goalId?: string;
      plannedDurationMinutes?: number;
      interruptions?: number;
    }
  ): Promise<DeepWorkSession> {
    const response = await apiClient.patch<DeepWorkSession>(`/deep-work/${id}`, data);
    return response.data;
  },

  async getActiveSession(): Promise<DeepWorkSession | null> {
    try {
      const response = await apiClient.get<{ active: boolean; session: DeepWorkSession | null }>('/deep-work/active');
      return response.data?.session || null;
    } catch (e: any) {
      return null;
    }
  },

  async getHistory(params?: { page?: number; limit?: number; from?: string; to?: string }): Promise<PaginatedDeepWork> {
    const response = await apiClient.get<PaginatedDeepWork>('/deep-work', { params });
    return response.data;
  },

  async getAnalytics(): Promise<DeepWorkAnalytics> {
    const response = await apiClient.get<DeepWorkAnalytics>('/deep-work/analytics');
    return response.data;
  },

  async getWeeklyHistory(params?: {
    goalId?: string;
    week?: string;
    from?: string;
    to?: string;
    minDuration?: string;
  }): Promise<{
    weeks: Array<{ weekNumber: number; label: string; startDate: string; endDate: string }>;
    selectedWeek: {
      weekNumber: number;
      label: string;
      startDate: string;
      endDate: string;
      days: Array<{
        date: string;
        dayName: string;
        dateStr: string;
        minutes: number;
        isFuture: boolean;
      }>;
      sessions: DeepWorkSession[];
    } | null;
  }> {
    const response = await apiClient.get('/deep-work/weekly-history', { params });
    return response.data;
  },
};
