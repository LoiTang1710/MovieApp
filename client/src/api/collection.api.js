import { apiClient as axiosInstance } from './axiosClient' // Trỏ đến file axiosInstance của bạn (đã có withCredentials: true)

export const fetchCollectionsApi = async () => {
  const res = await axiosInstance.get('/collections')
  return res.data
}

export const fetchMoviesByCollectionApi = async (collectionId) => {
  const res = await axiosInstance.get(`/collections/${collectionId}/movies`)
  return res.data
}

export const createCollectionApi = async (data) => {
  // data gồm { displayName, iconKey }
  const res = await axiosInstance.post('/collections', data)
  return res.data
}

export const deleteCollectionApi = async (collectionId) => {
  const res = await axiosInstance.delete(`/collections/${collectionId}`)
  return res.data
}

export const toggleFavoriteApi = async (movieId, movieData) => {
  // Đảm bảo không bị lặp /api nếu apiClient đã có baseURL là .../api
  const res = await axiosInstance.post(
    `/collections/movies/${movieId}/favourite`,
    movieData,
  )
  return res.data
}
