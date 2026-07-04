import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, UserPreference } from '@/services/user-service';
import { useAuth } from '@/context/AuthContext';

export function useProfile() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
    enabled: authReady && !!user,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (data: { name?: string; email?: string; timezone?: string; mobileNumber?: string; role?: string }) =>
      userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
      setUser(updatedUser); // Update in global auth context
    },
  });
}

export function usePreferences() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['preferences'],
    queryFn: () => userService.getPreferences(),
    enabled: authReady && !!user,
  });
}

export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserPreference>) =>
      userService.updatePreferences(data),
    onSuccess: (updatedPrefs) => {
      queryClient.setQueryData(['preferences'], updatedPrefs);
      // Sync theme with local storage/theme state
      if (updatedPrefs.theme) {
        document.documentElement.classList.toggle('dark', updatedPrefs.theme === 'dark');
        localStorage.setItem('theme', updatedPrefs.theme);
      }
    },
  });
}
