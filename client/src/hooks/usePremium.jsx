import { useMutation, useQuery } from '@tanstack/react-query'
import { authClient, mediaClient } from '../api/axiosClient'

export function usePremiumPlans() {
  return useQuery({
    queryKey: ['premium', 'plans'],
    queryFn: async () => {
      const response = await mediaClient.get('/api/premium/plans')
      return response.data
    },
    staleTime: 60 * 1000,
  })
}

export function useCreateSubscription() {
  return useMutation({
    mutationFn: async (planId) => {
      const response = await authClient.post(
        '/api/premium/subscriptions',
        { planId },
        { withCredentials: false },
      )
      return response.data
    },
  })
}
