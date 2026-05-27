import { useDevAuth } from '../../../contexts/DevAuthContext'

const DevQuickLogin = ({ compact = false }) => {
  const { user, isLoggedIn, isAdmin, loading, error, login, logout } = useDevAuth()

  if (isLoggedIn) {
    return (
      <div
        className={`rounded-lg border border-emerald-500/30 bg-emerald-500/10 ${compact ? 'p-2' : 'p-3'} text-sm`}
      >
        <p className="text-emerald-200">
          Đã đăng nhập: <strong>{user.email}</strong>
          {isAdmin ? ' (Admin)' : ' (User)'}
        </p>
        <button
          type="button"
          onClick={logout}
          disabled={loading}
          className="mt-2 text-xs text-white/60 underline hover:text-white disabled:opacity-50"
        >
          Đăng xuất
        </button>
      </div>
    )
  }

  return (
    <div
      className={`rounded-lg border border-amber-500/40 bg-amber-500/10 ${compact ? 'p-2' : 'p-3'} text-sm`}
    >
      <p className="text-amber-200 mb-2">
        {compact
          ? 'Đăng nhập để đánh giá & bình luận:'
          : 'Chưa đăng nhập — chọn tài khoản dev để dùng đánh giá, bình luận, trả lời:'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => login('user@test.com')}
          disabled={loading}
          className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold hover:bg-amber-500 disabled:opacity-50"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập User'}
        </button>
        <button
          type="button"
          onClick={() => login('admin@test.com')}
          disabled={loading}
          className="rounded-lg bg-red-700 px-4 py-2 text-xs font-semibold hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập Admin'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default DevQuickLogin
