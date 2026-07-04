import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '@/services/goal-service';
import { useAuth } from '@/context/AuthContext';

export function useGoals(params?: {
  page?: number;
  limit?: number;
  level?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => goalService.getGoals(params),
    enabled: authReady && !!user,
  });
}

export function useGoal(id: string) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['goal', id],
    queryFn: () => goalService.getGoal(id),
    enabled: authReady && !!user && !!id,
  });
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      level: string;
      metric: string;
      baseline: number;
      target: number;
      deadline: string;
      nextAction?: string;
    }) => goalService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        level?: string;
        metric?: string;
        baseline?: number;
        target?: number;
        deadline?: string;
        nextAction?: string;
        status?: string;
      };
    }) => goalService.updateGoal(id, data),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: ['goal', updatedGoal.id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useUpdateGoalProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentValue }: { id: string; currentValue: number }) =>
      goalService.updateProgress(id, currentValue),
    onSuccess: (updatedGoal) => {
      queryClient.invalidateQueries({ queryKey: ['goal', updatedGoal.id] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useArchiveGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalService.archiveGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}
