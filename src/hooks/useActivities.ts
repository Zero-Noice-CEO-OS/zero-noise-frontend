import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activity-service';
import { useAuth } from '@/context/AuthContext';

export function useActivities(params?: {
  page?: number;
  limit?: number;
  category?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  searchQuery?: string;
}) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => activityService.getActivities(params),
    enabled: authReady && !!user,
  });
}

export function useCreateActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      category: string;
      durationMinutes: number;
      valueScore: number;
      goalId?: string | null;
      startedAt?: string;
      endedAt?: string;
    }) => activityService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activitySummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
    },
  });
}

export function useUpdateActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        category?: string;
        durationMinutes?: number;
        valueScore?: number;
        goalId?: string | null;
      };
    }) => activityService.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activitySummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
    },
  });
}

export function useDeleteActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activitySummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardToday'] });
    },
  });
}

export function useActivitySummary(params?: { from?: string; to?: string }) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['activitySummary', params],
    queryFn: () => activityService.getSummary(params),
    enabled: authReady && !!user,
  });
}
