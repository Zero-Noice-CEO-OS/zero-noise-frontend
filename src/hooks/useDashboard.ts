import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard-service';
import { useAuth } from '@/context/AuthContext';

export function useDashboardSummary() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => dashboardService.getSummary(),
    enabled: authReady && !!user,
  });
}

export function useDashboardToday() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dashboardToday'],
    queryFn: () => dashboardService.getTodayOverview(),
    enabled: authReady && !!user,
  });
}

export function useDashboardWeek() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dashboardWeek'],
    queryFn: () => dashboardService.getWeeklyOverview(),
    enabled: authReady && !!user,
  });
}

export function useDashboardAnalytics() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: () => dashboardService.getAnalytics(),
    enabled: authReady && !!user,
  });
}
