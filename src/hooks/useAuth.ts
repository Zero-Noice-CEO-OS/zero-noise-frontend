import { useMutation } from '@tanstack/react-query';
import { authService, User } from '@/services/auth-service';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function useLoginMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: any) => authService.login(credentials),
    onSuccess: (data) => {
      login(data.accessToken, data.user);
      router.push('/dashboard');
    },
  });
}

export function useSignupMutation() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: any) => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const user = await authService.signup({ ...data, timezone });
      
      // Direct auto login
      const loginRes = await authService.login({ email: data.email, password: data.password });
      
      // Attach bearer token temporarily to API client to allow subscription creation
      const { setAccessToken } = require('@/services/api-client');
      setAccessToken(loginRes.accessToken);

      // Auto-assign Free Plan
      const { subscriptionService } = require('@/services/subscription-service');
      await subscriptionService.purchase({
        planName: 'Free',
        billingCycle: 'lifetime',
        name: data.name,
        email: data.email,
        mobileNumber: 'N/A',
        autoRenew: false,
        method: 'cod',
      });

      return loginRes;
    },
    onSuccess: (loginRes) => {
      login(loginRes.accessToken, loginRes.user);
      router.push('/dashboard');
    },
  });
}
