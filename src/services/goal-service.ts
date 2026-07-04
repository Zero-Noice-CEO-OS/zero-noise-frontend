import { apiClient } from './api-client';

export type GoalLevel = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Vision12Year';
export type GoalStatus = 'Active' | 'Completed' | 'Archived';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  level: GoalLevel;
  metric: string;
  baseline: number;
  target: number;
  currentValue: number;
  progress: number; // calculated by backend
  status: GoalStatus;
  deadline: string;
  nextAction: string | null;
  createdAt: string;
  updatedAt: string;
  activities?: any[]; // optional list of linked activities
}

export interface PaginatedGoals {
  data: Goal[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const goalService = {
  async getGoals(params?: {
    page?: number;
    limit?: number;
    level?: string;
    status?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedGoals> {
    const response = await apiClient.get<PaginatedGoals>('/goals', { params });
    return response.data;
  },

  async getGoal(id: string): Promise<Goal> {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  async createGoal(data: {
    title: string;
    level: string;
    metric: string;
    baseline: number;
    target: number;
    deadline: string;
    nextAction?: string;
  }): Promise<Goal> {
    // Map level from 'Yearly' (frontend) to 'Annual' (backend) and '12-Year' to 'Vision12Year'
    let backendLevel = data.level;
    if (data.level === 'Yearly') backendLevel = 'Annual';
    if (data.level === '12-Year') backendLevel = 'Vision12Year';

    const response = await apiClient.post<Goal>('/goals', {
      ...data,
      level: backendLevel,
    });
    return response.data;
  },

  async updateGoal(
    id: string,
    data: {
      title?: string;
      level?: string;
      metric?: string;
      baseline?: number;
      target?: number;
      deadline?: string;
      nextAction?: string;
      status?: string;
    }
  ): Promise<Goal> {
    const updatePayload: any = { ...data };
    if (data.level) {
      if (data.level === 'Yearly') updatePayload.level = 'Annual';
      if (data.level === '12-Year') updatePayload.level = 'Vision12Year';
    }
    const response = await apiClient.patch<Goal>(`/goals/${id}`, updatePayload);
    return response.data;
  },

  async updateProgress(id: string, currentValue: number): Promise<Goal> {
    const response = await apiClient.patch<Goal>(`/goals/${id}/progress`, { currentValue });
    return response.data;
  },

  async archiveGoal(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/goals/${id}`);
    return response.data;
  },
};
