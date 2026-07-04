import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillService } from '@/services/skill-service';
import { useAuth } from '@/context/AuthContext';

export function useSkills() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => skillService.getSkills(),
    enabled: authReady && !!user,
  });
}

export function useSkill(id: string) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['skill', id],
    queryFn: () => skillService.getSkill(id),
    enabled: authReady && !!user && !!id,
  });
}

export function useSkillEntries(id: string) {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['skillEntries', id],
    queryFn: () => skillService.getEntries(id),
    enabled: authReady && !!user && !!id,
  });
}

export function useSkillsSummary() {
  const { authReady, user } = useAuth();
  return useQuery({
    queryKey: ['skillsSummary'],
    queryFn: () => skillService.getSummary(),
    enabled: authReady && !!user,
  });
}

export function useCreateSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; baselineScore: number }) => skillService.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skillsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useLogSkillEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        speed: number;
        quality: number;
        consistency: number;
        depth: number;
        retention: number;
        application: number;
        confidence: number;
        notes?: string;
      };
    }) => skillService.logEntry(id, data),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: ['skill', newEntry.skillId] });
      queryClient.invalidateQueries({ queryKey: ['skillEntries', newEntry.skillId] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skillsSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
  });
}

export function useUpdateSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => skillService.updateSkill(id, { name }),
    onSuccess: (updatedSkill) => {
      queryClient.invalidateQueries({ queryKey: ['skill', updatedSkill.id] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useArchiveSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => skillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skillsSummary'] });
    },
  });
}
