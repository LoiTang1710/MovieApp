import { apiClient } from '../api/axiosClient'

export const moviesApi = {
  /**
   * Gửi yêu cầu cập nhật lượt xem phim lên server
   * @param {string|number} movieId - ID của phim hoặc TV show
   */
  incrementView: (movieId) =>
    apiClient.patch(`/movies/${movieId}/view`).then((res) => res.data.data)
}