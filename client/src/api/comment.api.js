import { authClient } from './axiosClient'

export const listComments = (params) =>
  authClient.get('/api/comments', { params })

export const createComment = (body) =>
  authClient.post('/api/comments', body)

export const createReply = (parentId, content) =>
  authClient.post(`/api/comments/${parentId}/replies`, { content })

export const toggleCommentLike = (commentId) =>
  authClient.post(`/api/comments/${commentId}/like`)
