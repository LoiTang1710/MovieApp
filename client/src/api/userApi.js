import { apiClient } from './axiosClient'

export const getUserProfileApi = () =>
  apiClient.get('/users/profile').then((res) => res.data.data)

export const updateUserProfileApi = (data) => {
  const formData = new FormData()
  if (data.fullName) formData.append('fullName', data.fullName)
  if (data.phone) formData.append('phone', data.phone)
  if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth)
  if (data.gender) formData.append('gender', data.gender)
  if (data.avatar) formData.append('avatar', data.avatar)

  return apiClient.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => res.data.data)
}

export const changePasswordApi = (data) =>
  apiClient.post('/users/change-password', data).then((res) => res.data.data)

export const getSubscriptionHistoryApi = () =>
  apiClient.get('/users/subscription-history').then((res) => res.data.data)
