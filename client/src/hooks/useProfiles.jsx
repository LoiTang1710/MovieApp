import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProfilesApi,
  getProfileApi,
  createProfileApi,
  updateProfileApi,
  deleteProfileApi,
  getAvatarsApi,
} from '../services/profileApi';

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: getProfilesApi,
  });
}

export function useProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileApi(id),
    enabled: !!id,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useAvatars() {
  return useQuery({
    queryKey: ['avatars'],
    queryFn: getAvatarsApi,
  });
}
