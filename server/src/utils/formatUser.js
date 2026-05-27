export const formatUserPublic = (user) => {
  if (!user) return null
  const displayName = user.email?.split('@')[0] || 'Người dùng'
  return {
    id: user.id,
    displayName,
  }
}
