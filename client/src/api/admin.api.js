import { authClient } from './axiosClient'

export const adminDeleteComment = (commentId) =>
  authClient.delete(`/api/admin/comments/${commentId}`)
