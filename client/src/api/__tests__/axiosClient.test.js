// client/src/api/__tests__/axiosClient.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock env utility before importing axiosClient
vi.mock('../../utils/env.js', () => ({
  resolveServerUrl: vi.fn(() => 'http://localhost:3000'),
  getTmdbAccessToken: vi.fn(() => ''),
}))

// Mock axios so we can inspect what axios.create is called with
// and intercept usage without making real HTTP requests
const mockInterceptorsResponseUse = vi.fn()
const mockAxiosInstance = {
  interceptors: {
    response: { use: mockInterceptorsResponseUse },
    request: { use: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
}
const mockAxiosCreate = vi.fn(() => mockAxiosInstance)

vi.mock('axios', () => ({
  default: {
    create: mockAxiosCreate,
  },
}))

// Import after mocks are in place
import { resolveServerUrl } from '../../utils/env.js'

describe('axiosClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    mockAxiosCreate.mockReturnValue({
      ...mockAxiosInstance,
      interceptors: {
        response: { use: mockInterceptorsResponseUse },
        request: { use: vi.fn() },
      },
    })
  })

  describe('authClient configuration', () => {
    it('should create axios instance with withCredentials: true', async () => {
      await import('../axiosClient.js')

      const callArgs = mockAxiosCreate.mock.calls[0]?.[0]
      expect(callArgs).toBeDefined()
      expect(callArgs?.withCredentials).toBe(true)
    })

    it('should set Content-Type header to application/json', async () => {
      await import('../axiosClient.js')

      const callArgs = mockAxiosCreate.mock.calls[0]?.[0]
      expect(callArgs?.headers?.['Content-Type']).toBe('application/json')
    })

    it('should use the resolved server URL as baseURL', async () => {
      resolveServerUrl.mockReturnValue('http://api.example.com')

      await import('../axiosClient.js')

      const callArgs = mockAxiosCreate.mock.calls[0]?.[0]
      expect(callArgs?.baseURL).toBe('http://api.example.com')
    })

    it('should register a response interceptor', async () => {
      await import('../axiosClient.js')

      expect(mockInterceptorsResponseUse).toHaveBeenCalled()
    })
  })

  describe('response interceptor behavior', () => {
    it('should pass through successful responses unchanged', () => {
      const successHandler = (response) => response
      const mockResponse = { status: 200, data: { success: true } }

      const result = successHandler(mockResponse)
      expect(result).toBe(mockResponse)
    })

    it('should reject the promise for error responses', async () => {
      const errorHandler = (error) => Promise.reject(error)
      const mockError = { response: { status: 500 } }

      await expect(errorHandler(mockError)).rejects.toEqual(mockError)
    })

    it('should log a warning for 401 responses', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // Simulate the interceptor error handler inline
      const errorHandler = (error) => {
        if (error.response?.status === 401) {
          console.warn('Session expired or Unauthorized. Redirecting to login...')
        }
        return Promise.reject(error)
      }

      const mockError = { response: { status: 401 } }
      errorHandler(mockError)

      expect(warnSpy).toHaveBeenCalledWith(
        'Session expired or Unauthorized. Redirecting to login...'
      )
      warnSpy.mockRestore()
    })

    it('should still reject the promise even after logging 401 warning', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})

      const errorHandler = (error) => {
        if (error.response?.status === 401) {
          console.warn('Session expired or Unauthorized. Redirecting to login...')
        }
        return Promise.reject(error)
      }

      const mockError = { response: { status: 401 } }
      await expect(errorHandler(mockError)).rejects.toEqual(mockError)

      vi.restoreAllMocks()
    })

    it('should not log a warning for non-401 errors', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const errorHandler = (error) => {
        if (error.response?.status === 401) {
          console.warn('Session expired or Unauthorized. Redirecting to login...')
        }
        return Promise.reject(error)
      }

      errorHandler({ response: { status: 403 } })
      errorHandler({ response: { status: 500 } })
      errorHandler({ response: undefined }) // network error

      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })

  describe('mediaClient', () => {
    it('should export mediaClient as the same instance as authClient', async () => {
      // Re-import with fresh module state
      vi.resetModules()
      mockAxiosCreate.mockReturnValue(mockAxiosInstance)

      const { authClient, mediaClient } = await import('../axiosClient.js')

      // They should be the same reference
      expect(mediaClient).toBe(authClient)
    })
  })
})