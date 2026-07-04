import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, ReviewType } from '@/services/review-service';
import { useAuth } from '@/context/AuthContext';

export function useReviews(params?: { page?: number; limit?: number; type?: ReviewType }) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewService.getReviews(params),
    enabled: authReady && !!user,
  });
}

export function useReview(id: string) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => reviewService.getReview(id),
    enabled: authReady && !!user && !!id,
  });
}

export function useGenerateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, date }: { type: ReviewType; date: string }) =>
      reviewService.generateReview(type, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      reviewService.updateReview(id, notes),
    onSuccess: (updatedReview) => {
      queryClient.invalidateQueries({ queryKey: ['review', updatedReview.id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
