import { apiClient } from './api-client';

export interface DashboardSummary {
  currentCeoScore: number;
  energy: number;
  topPriorities: string[] | any;
  todayActivitiesCount: number;
  todayDeepWorkSessionsCount: number;
  currentGoalsCount: number;
  currentCapability: number;
  currentStreak: number;
  latestReview: any;
  aiReady: boolean;
}

export interface TodayOverview {
  morningCheckIn: {
    energy: number;
    topPriorities: string[] | any;
    mainSkill: string | null;
    risks: string | null;
  } | null;
  activitiesSummary: {
    count: number;
    totalMinutes: number;
  };
  deepWorkSummary: {
    count: number;
    totalMinutes: number;
  };
  skillPractice: Array<{
    skillName: string;
    notes: string;
    score: number;
  }>;
  ceoScore: number;
}

export interface WeeklyOverview {
  weeklyCeoScore: number;
  weeklyActivities: {
    count: number;
    totalMinutes: number;
  };
  weeklyFocusTime: number;
  weeklySkillPracticeCount: number;
  weeklyGoalProgress: Array<{
    title: string;
    progress: number;
  }>;
  weeklyReview: any;
}

export interface DashboardAnalytics {
  ceoScoreTrend: Array<{ date: string; score: number }>;
  capabilityTrend: Array<{ date: string; score: number }>;
  goalTrend: Array<{ title: string; progress: number }>;
  deepWorkTrend: Array<{ date: string; minutes: number }>;
  activityDistribution: Record<string, number>;
  skillDistribution: Array<{ name: string; currentScore: number }>;
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>('/dashboard');
    return response.data;
  },

  async getTodayOverview(): Promise<TodayOverview> {
    const response = await apiClient.get<TodayOverview>('/dashboard/today');
    return response.data;
  },

  async getWeeklyOverview(): Promise<WeeklyOverview> {
    const response = await apiClient.get<WeeklyOverview>('/dashboard/week');
    return response.data;
  },

  async getAnalytics(): Promise<DashboardAnalytics> {
    const response = await apiClient.get<DashboardAnalytics>('/dashboard/analytics');
    return response.data;
  },
};
