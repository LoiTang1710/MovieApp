import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createComment,
  createReply,
  listComments,
  toggleCommentLike,
} from '../api/comment.api'
import { adminDeleteComment } from '../api/admin.api'

const toTmdbId = (id) => Number(id)

export function useComments(tmdbId, mediaType, page = 1) {
  return useQuery({
    queryKey: ['comments', tmdbId, mediaType, page],
    queryFn: async () => {
      const res = await listComments({
        tmdbId: toTmdbId(tmdbId),
        mediaType,
        page,
        limit: 20,
      })
      return res.data.data
    },
    enabled: !!tmdbId && !!mediaType,
  })
}

export function useCreateComment(tmdbId, mediaType) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content) =>
      createComment({ tmdbId: toTmdbId(tmdbId), mediaType, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', tmdbId, mediaType] })
    },
  })
}

export function useCreateReply(tmdbId, mediaType) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ parentId, content }) => createReply(parentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', tmdbId, mediaType] })
    },
  })
}

export function useToggleLike(tmdbId, mediaType) {
  const queryClient = useQueryClient()
  const queryKey = ['comments', tmdbId, mediaType]

  return useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })

      const patchComment = (items) =>
        items?.map((item) => {
          if (item.id === commentId) {
            const liked = !item.likedByMe
            return {
              ...item,
              likedByMe: liked,
              likeCount: Math.max(0, item.likeCount + (liked ? 1 : -1)),
            }
          }
          if (item.replies?.length) {
            return { ...item, replies: patchComment(item.replies) }
          }
          return item
        })

      queryClient.setQueriesData({ queryKey }, (old) => {
        if (!old?.items) return old
        return { ...old, items: patchComment(old.items) }
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export function useAdminDeleteComment(tmdbId, mediaType) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId) => adminDeleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', tmdbId, mediaType] })
    },
  })
}
