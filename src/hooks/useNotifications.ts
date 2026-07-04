import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification-service';
import { useAuth } from '@/context/AuthContext';

export function useNotificationsList(params?: { page?: number; limit?: number }) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['notificationsList', params],
    queryFn: () => notificationService.getNotifications(params),
    enabled: authReady && !!user,
  });
}

export function useUnreadNotificationsCount() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
    enabled: authReady && !!user,
  });
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationsList'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });
}
