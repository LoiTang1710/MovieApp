import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient, mediaClient } from '../api/axiosClient'

export function usePremiumPlans() {
  return useQuery({
    queryKey: ['premium', 'plans'],
    queryFn: async () => {
      const response = await mediaClient.get('/premium/plans')
      return response.data
    },
    staleTime: 60 * 1000,
  })
}

export function useCreateSubscription() {
  return useMutation({
    mutationFn: async ({ planId, paymentProvider }) => {
      const response = await authClient.post(
        '/premium/subscriptions',
        { planId, paymentProvider },
      )
      return response.data
    },
  })
}

export function useMyPremiumSubscription({ enabled = true } = {}) {
  return useQuery({
    queryKey: ['premium', 'me'],
    queryFn: async () => {
      const response = await authClient.get('/premium/me')
      return response.data.subscription
    },
    enabled,
  })
}

export function useConfirmDevPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentId) => {
      const response = await authClient.post(
        `/premium/payments/${paymentId}/simulate-success`,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium', 'me'] })
    },
  })
}
