import { authClient } from './axiosClient'

export const listComments = (params) =>
  authClient.get('/comments', { params })

export const createComment = (body) =>
  authClient.post('/comments', body)

export const createReply = (parentId, content) =>
  authClient.post(`/comments/${parentId}/replies`, { content })

export const toggleCommentLike = (commentId) =>
  authClient.post(`/comments/${commentId}/like`)
