import { authClient } from './axiosClient'

export const fetchDevToken = (email = 'user@test.com') =>
  authClient.post('/api/dev/token', { email })
