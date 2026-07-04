import { apiClient } from './api-client';

export interface Skill {
  id: string;
  userId: string;
  name: string;
  baselineScore: number;
  currentScore: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  entries?: SkillEntry[];
}

export interface SkillEntry {
  id: string;
  skillId: string;
  date: string;
  speed: number;
  quality: number;
  consistency: number;
  depth: number;
  retention: number;
  application: number;
  confidence: number;
  notes: string | null;
  createdAt: string;
}

export interface SkillSummary {
  averageScore: number;
  totalTracked: number;
  monthlyGrowth: number;
  topSkills: Array<{ name: string; score: number }>;
  weakestSkills: Array<{ name: string; score: number }>;
}

export interface RadarData {
  dimensions: string[];
  scores: Record<string, number>;
}

export const skillService = {
  async getSkills(params?: { page?: number; limit?: number }): Promise<{ data: Skill[] }> {
    const response = await apiClient.get<{ data: Skill[] }>('/skills', { params });
    return response.data;
  },

  async getSkill(id: string): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/skills/${id}`);
    return response.data;
  },

  async createSkill(data: { name: string; baselineScore: number }): Promise<Skill> {
    const response = await apiClient.post<Skill>('/skills', data);
    return response.data;
  },

  async updateSkill(id: string, data: { name: string }): Promise<Skill> {
    const response = await apiClient.patch<Skill>(`/skills/${id}`, data);
    return response.data;
  },

  async deleteSkill(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/skills/${id}`);
    return response.data;
  },

  async logEntry(
    id: string,
    data: {
      speed: number;
      quality: number;
      consistency: number;
      depth: number;
      retention: number;
      application: number;
      confidence: number;
      notes?: string;
    }
  ): Promise<SkillEntry> {
    const response = await apiClient.post<SkillEntry>(`/skills/${id}/entries`, {
      ...data,
      skillId: id,
      date: new Date().toISOString().split('T')[0],
    });
    return response.data;
  },

  async getEntries(id: string, params?: { page?: number; limit?: number }): Promise<{ data: SkillEntry[] }> {
    const response = await apiClient.get<{ data: SkillEntry[] }>(`/skills/${id}/entries`, { params });
    return response.data;
  },

  async getSummary(params?: { from?: string; to?: string }): Promise<SkillSummary> {
    const from = params?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = params?.to || new Date().toISOString().split('T')[0];
    const response = await apiClient.get<SkillSummary>('/skills/summary', { params: { from, to } });
    return response.data;
  },
};
