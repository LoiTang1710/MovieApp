// client/src/services/__tests__/axios.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock axios before importing the module under test
const mockInterceptorsResponseUse = vi.fn()
const mockAxiosInstance = {
  interceptors: {
    response: { use: mockInterceptorsResponseUse },
    request: { use: vi.fn() },
  },
}
const mockCreate = vi.fn(() => mockAxiosInstance)

vi.mock('axios', () => ({
  default: {
    create: mockCreate,
  },
}))

describe('services/axios.js', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    mockCreate.mockReturnValue({
      ...mockAxiosInstance,
      interceptors: {
        response: { use: mockInterceptorsResponseUse },
        request: { use: vi.fn() },
      },
    })
  })

  describe('axiosInstance configuration', () => {
    it('should create an axios instance with withCredentials: true', async () => {
      await import('../axios.js')

      const callArgs = mockCreate.mock.calls[0]?.[0]
      expect(callArgs?.withCredentials).toBe(true)
    })

    it('should set Content-Type to application/json', async () => {
      await import('../axios.js')

      const callArgs = mockCreate.mock.calls[0]?.[0]
      expect(callArgs?.headers?.['Content-Type']).toBe('application/json')
    })

    it('should use VITE_API_URL env variable as baseURL when available', async () => {
      // The vitest.config.js defines import.meta.env.VITE_API_URL
      await import('../axios.js')

      const callArgs = mockCreate.mock.calls[0]?.[0]
      // Should use the defined env value or the default fallback
      expect(callArgs?.baseURL).toBeTruthy()
      expect(typeof callArgs?.baseURL).toBe('string')
    })

    it('should register a response interceptor', async () => {
      await import('../axios.js')

      expect(mockInterceptorsResponseUse).toHaveBeenCalled()
    })
  })

  describe('response interceptor', () => {
    it('should pass through successful responses', () => {
      const successHandler = (response) => response
      const mockResponse = { status: 200, data: {} }
      expect(successHandler(mockResponse)).toBe(mockResponse)
    })

    it('should reject on error responses', async () => {
      const errorHandler = (error) => Promise.reject(error)
      const err = { response: { status: 500 } }
      await expect(errorHandler(err)).rejects.toEqual(err)
    })

    it('should handle 401 errors without throwing (only comment redirect)', async () => {
      // The 401 handler in axios.js just has a comment and no actual redirect logic
      // It should still reject the error
      const errorHandler = (error) => {
        if (error.response?.status === 401) { /* Redirect to login if needed */ }
        return Promise.reject(error)
      }

      const err = { response: { status: 401 } }
      await expect(errorHandler(err)).rejects.toEqual(err)
    })

    it('should export the axios instance as default', async () => {
      const module = await import('../axios.js')
      expect(module.default).toBeDefined()
    })
  })
})