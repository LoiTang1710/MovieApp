import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export function useFavouriteMovie(movie) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve({ isAdded: !movie.liked }), 5000),
      )
    },
    onSuccess: (data) => {
      if (data.isAdded) {
        toast.success(`Đã thêm "${movie.title}" vào danh sách yêu thích! 🍿`, {
          position: 'bottom-right',
          autoClose: 3000,
        })
      } else {
        toast.info(`Đã bỏ "${movie.title}" khỏi danh sách yêu thích.`, {
          position: 'bottom-right',
          autoClose: 3000,
        })
      }

      // QUAN TRỌNG: Báo cho TanStack Query biết dữ liệu đã cũ,
      // yêu cầu tải lại ngầm API của trang MyList
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau!')
    },
  })
}
