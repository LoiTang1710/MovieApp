import { authClient } from './axiosClient'

export const getProfilesApi = () =>
  authClient.get('/api/profiles').then((res) => res.data.data)

export const getProfileApi = (id) =>
  authClient.get(`/api/profiles/${id}`).then((res) => res.data.data)

export const createProfileApi = (data) =>
  authClient.post('/api/profiles', data).then((res) => res.data.data)

export const updateProfileApi = ({ id, ...data }) =>
  authClient.put(`/api/profiles/${id}`, data).then((res) => res.data.data)

export const deleteProfileApi = (id) =>
  authClient.delete(`/api/profiles/${id}`).then((res) => res.data.data)
