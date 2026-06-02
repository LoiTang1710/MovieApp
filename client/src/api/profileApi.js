import { authClient } from './axiosClient'

export const getProfilesApi = () =>
  authClient.get('/profiles').then((res) => res.data.data)

export const getProfileApi = (id) =>
  authClient.get(`/profiles/${id}`).then((res) => res.data.data)

export const createProfileApi = (data) =>
  authClient.post('/profiles', data).then((res) => res.data.data)

export const updateProfileApi = ({ id, ...data }) =>
  authClient.put(`/profiles/${id}`, data).then((res) => res.data.data)

export const deleteProfileApi = (id) =>
  authClient.delete(`/profiles/${id}`).then((res) => res.data.data)
