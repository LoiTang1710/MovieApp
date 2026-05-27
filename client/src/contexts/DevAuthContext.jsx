import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { fetchDevToken } from '../api/dev.api'
import { getTokenPayload } from '../utils/authToken'

const DevAuthContext = createContext(null)

export function DevAuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(() => getTokenPayload())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const refreshCommunityQueries = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: (q) => q.queryKey[0] === 'comments' || q.queryKey[0] === 'reviews',
    })
  }, [queryClient])

  const login = useCallback(
    async (email) => {
      setLoading(true)
      setError('')
      try {
        const res = await fetchDevToken(email)
        localStorage.setItem('token', res.data.token)
        setUser(getTokenPayload())
        await refreshCommunityQueries()
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          'Không lấy được token. Kiểm tra server (ALLOW_DEV_AUTH=true) và chạy npm run db:seed.'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [refreshCommunityQueries],
  )

  const logout = useCallback(async () => {
    localStorage.removeItem('token')
    setUser(null)
    setError('')
    await refreshCommunityQueries()
  }, [refreshCommunityQueries])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role?.toUpperCase() === 'ADMIN',
      loading,
      error,
      login,
      logout,
    }),
    [user, loading, error, login, logout],
  )

  return <DevAuthContext.Provider value={value}>{children}</DevAuthContext.Provider>
}

export function useDevAuth() {
  const ctx = useContext(DevAuthContext)
  if (!ctx) {
    throw new Error('useDevAuth phải dùng trong DevAuthProvider')
  }
  return ctx
}
