import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyLogsService, CreateMorningCheckIn, UpdateEveningReview } from '@/services/daily-logs-service';
import { useAuth } from '@/context/AuthContext';

export function useDailyLogsHistory(params?: { page?: number; limit?: number; from?: string; to?: string }) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dailyLogsHistory', params],
    queryFn: () => dailyLogsService.getLogs(params),
    enabled: authReady && !!user,
  });
}

export function useDailyLogByDate(dateStr: string) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dailyLog', dateStr],
    queryFn: () => dailyLogsService.getLogByDate(dateStr),
    enabled: authReady && !!user && !!dateStr,
  });
}

export function useMorningCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMorningCheckIn) => dailyLogsService.submitMorningCheckIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLog'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLogsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
    },
  });
}

export function useEveningReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dateStr, data }: { dateStr: string; data: UpdateEveningReview }) =>
      dailyLogsService.submitEveningReview(dateStr, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyLog'] });
      queryClient.invalidateQueries({ queryKey: ['dailyLogsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
    },
  });
}
