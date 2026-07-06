import { apiClient } from './api-client';

export interface Activity {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  category: 'Build' | 'Sell' | 'Lead' | 'Learn' | 'Maintain' | 'Waste';
  durationMinutes: number;
  valueScore: number; // 1-5 in backend, mapped to 1-10 in frontend
  startedAt: string;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedActivities {
  data: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ActivitySummary {
  totalHours: number;
  totalDurationMinutes: number;
  timeAllocation: Record<string, number>;
  categoryAllocation: Record<string, number>;
  averageValueScore: number;
  noiseAlertsCount: number;
  noiseAlerts: {
    noiseDetected: boolean;
    noisePercentage: number;
    recommendation: string;
  };
}

export const activityService = {
  async getActivities(params?: {
    page?: number;
    limit?: number;
    category?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    searchQuery?: string;
  }): Promise<PaginatedActivities> {
    const response = await apiClient.get<PaginatedActivities>('/activities', { params });
    return response.data;
  },

  async createActivity(data: {
    title: string;
    category: string;
    durationMinutes: number;
    valueScore: number;
    goalId?: string | null;
    startedAt?: string;
    endedAt?: string;
  }): Promise<Activity> {
    const started = data.startedAt || new Date().toISOString();
    const ended = data.endedAt || new Date(new Date(started).getTime() + data.durationMinutes * 60000).toISOString();
    
    // Map valueScore from 1-10 (frontend) to 1-5 (backend)
    const backendValueScore = Math.max(1, Math.min(5, Math.round(data.valueScore / 2)));

    const response = await apiClient.post<Activity>('/activities', {
      ...data,
      valueScore: backendValueScore,
      startedAt: started,
      endedAt: ended,
    });
    return response.data;
  },

  async updateActivity(
    id: string,
    data: {
      title?: string;
      category?: string;
      durationMinutes?: number;
      valueScore?: number;
      goalId?: string | null;
    }
  ): Promise<Activity> {
    const updatePayload: any = { ...data };
    if (data.valueScore !== undefined) {
      updatePayload.valueScore = Math.max(1, Math.min(5, Math.round(data.valueScore / 2)));
    }
    const response = await apiClient.patch<Activity>(`/activities/${id}`, updatePayload);
    return response.data;
  },

  async deleteActivity(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/activities/${id}`);
    return response.data;
  },

  async getSummary(params?: { from?: string; to?: string }): Promise<ActivitySummary> {
    const from = params?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = params?.to || new Date().toISOString().split('T')[0];
    const response = await apiClient.get<ActivitySummary>('/activities/summary', { params: { from, to } });
    return response.data;
  },
};
