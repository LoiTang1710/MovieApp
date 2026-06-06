import { apiClient } from "./axiosClient.js"

export const moviesApi = {
  incrementView: async (payload) => {
    // payload bao gồm: { tmdbId, mediaType, title, posterUrl }
    return apiClient.post('/medias/view', payload)
  },
}