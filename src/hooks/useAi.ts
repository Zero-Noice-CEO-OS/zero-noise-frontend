import { useMutation, useQuery } from '@tanstack/react-query';
import { aiService } from '@/services/ai-service';
import { useAuth } from '@/context/AuthContext';

export function useChatCoachMutation() {
  return useMutation({
    mutationFn: ({ message, history, chatId }: { message: string; history?: string[]; chatId?: string }) =>
      aiService.getChatCoach(message, history, chatId),
  });
}

export function useMorningCoachQuery() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['morningCoachAdvice'],
    queryFn: () => aiService.getMorningCoachAdvice(),
    staleTime: 60000, // keep stale for 1 minute
    enabled: authReady && !!user,
  });
}

export function useStrategicCoachMutation() {
  return useMutation({
    mutationFn: (customQuestion: string) => aiService.getStrategicAdvice(customQuestion),
  });
}
