import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deepWorkService } from '@/services/deep-work-service';
import { useAuth } from '@/context/AuthContext';

export function useActiveSession() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['activeDeepWorkSession'],
    queryFn: () => deepWorkService.getActiveSession(),
    refetchOnWindowFocus: true,
    enabled: authReady && !!user,
  });
}

export function useDeepWorkHistory(params?: { page?: number; limit?: number }) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['deepWorkHistory', params],
    queryFn: () => deepWorkService.getHistory(params),
    enabled: authReady && !!user,
  });
}

export function useDeepWorkAnalytics() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['deepWorkAnalytics'],
    queryFn: () => deepWorkService.getAnalytics(),
    enabled: authReady && !!user,
  });
}

export function useStartDeepWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { goalId?: string; plannedDurationMinutes: number; output?: string }) =>
      deepWorkService.startSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeepWorkSession'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkHistory'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardWeek'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAnalytics'] });
    },
  });
}

export function usePauseDeepWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      deepWorkService.pauseSession(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeepWorkSession'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkHistory'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkAnalytics'] });
    },
  });
}

export function useResumeDeepWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deepWorkService.resumeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeepWorkSession'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkHistory'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkAnalytics'] });
    },
  });
}

export function useCompleteDeepWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { output: string; interruptions: number } }) =>
      deepWorkService.completeSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeepWorkSession'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkHistory'] });
      queryClient.invalidateQueries({ queryKey: ['deepWorkAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardWeek'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardAnalytics'] });
    },
  });
}

export function useUpdateDeepWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        output?: string;
        goalId?: string;
        plannedDurationMinutes?: number;
        interruptions?: number;
      };
    }) => deepWorkService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeepWorkSession'] });
    },
  });
}

export function useDeepWorkWeeklyHistory(params?: {
  goalId?: string;
  week?: string;
  from?: string;
  to?: string;
  minDuration?: string;
}) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['deepWorkWeeklyHistory', params],
    queryFn: () => deepWorkService.getWeeklyHistory(params),
    enabled: authReady && !!user,
  });
}
