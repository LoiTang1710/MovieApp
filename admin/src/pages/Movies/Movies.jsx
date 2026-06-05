import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, Film, ChevronDown } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import adminApi, { moviesApi } from '../../apis/admin.api'

const emptyForm = {
  tmdbId: '',
  mediaType: 'movie',
  title: '',
  posterUrl: '',
  isPremium: false,
  status: 'AVAILABLE',
}

const inputClass =
  'w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-red-500/50 outline-none'

export default function Movies() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [fetchingTmdb, setFetchingTmdb] = useState(false)

  const handleFetchTmdb = async () => {
    if (!form.tmdbId) return alert('Vui lòng nhập TMDB ID')
    try {
      setFetchingTmdb(true)
      const res = await adminApi.get('/admin/movies/tmdb/info', {
        params: { tmdbId: form.tmdbId, mediaType: form.mediaType },
      })
      setForm((prev) => ({
        ...prev,
        title: res.data.data.title || '',
        posterUrl: res.data.data.posterUrl || '',
      }))
    } catch (err) {
      alert('Không tìm thấy phim trên TMDB với ID này!')
      console.log(err)
    } finally {
      setFetchingTmdb(false)
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin-movies', page, search, statusFilter],
    queryFn: () =>
      moviesApi.list({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing
        ? moviesApi.update(editing.id, payload)
        : moviesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] })
      closeModal()
    },
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu phim'),
  })

  const deleteMutation = useMutation({
    mutationFn: moviesApi.remove,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] }),
    onError: (err) => alert(err.response?.data?.message || 'Không thể xóa'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  // ✅ Đã dọn dẹp các trường cũ, chỉ map dữ liệu đúng với Schema hiện tại
  const openEdit = (movie) => {
    setEditing(movie)
    setForm({
      tmdbId: movie.tmdbId?.toString() || '',
      mediaType: movie.mediaType || 'movie',
      title: movie.title || '',
      posterUrl: movie.posterUrl || '',
      isPremium: movie.isPremium || false,
      status: movie.status || 'AVAILABLE',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  // ✅ Đã sửa lỗi sập form: Không còn code xử lý genres nữa
  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  const handleDelete = (id, title) => {
    if (window.confirm(`Xóa phim "${title}"?`)) deleteMutation.mutate(id)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý phim"
        subtitle="Quản lý thư viện phim (Tích hợp TMDB & Vidsrc)"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
          >
            <Plus size={18} /> Thêm phim
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            className={`${inputClass} pl-10`}
            placeholder="Tìm theo tên phim..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        {/* ✅ Select Filter đã được bọc lại và đổi Icon */}
        <div className="relative sm:w-40">
          <select
            className={`${inputClass} appearance-none pr-10`}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="HIDDEN">HIDDEN</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/5">
                <th className="px-6 py-4 font-semibold">Phim</th>
                <th className="px-4 py-4 font-semibold">Loại</th>
                <th className="px-4 py-4 font-semibold">Lượt xem</th>
                <th className="px-4 py-4 font-semibold">Phân quyền</th>
                <th className="px-4 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : data?.items?.length ? (
                data.items.map((movie) => (
                  <tr
                    key={movie.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt=""
                            className="w-10 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-800 rounded flex items-center justify-center">
                            <Film size={16} className="text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-white">
                            {movie.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            TMDB ID: {movie.tmdbId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {movie.mediaType === 'movie' ? 'Phim lẻ' : 'Phim bộ'}
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {movie.views?.toLocaleString('vi-VN') || 0}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${movie.isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}
                      >
                        {movie.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={movie.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(movie)}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id, movie.title)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Chưa có phim nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-xs text-gray-500">
              Trang {data.page}/{data.totalPages} · {data.total} phim
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs rounded bg-white/5 disabled:opacity-30"
              >
                Trước
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs rounded bg-white/5 disabled:opacity-30"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Sửa phim' : 'Thêm phim mới'}
        wide
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                TMDB ID *
              </label>
              <input
                type="number"
                required
                className={inputClass}
                value={form.tmdbId}
                onChange={(e) => setForm({ ...form, tmdbId: e.target.value })}
                disabled={!!editing}
              />
            </div>

            {/* ✅ Select Loại hình đã được bọc lại */}
            <div className="w-1/3">
              <label className="text-xs text-gray-500 mb-1 block">
                Loại hình
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.mediaType}
                  onChange={(e) =>
                    setForm({ ...form, mediaType: e.target.value })
                  }
                  disabled={!!editing}
                >
                  <option value="movie">Phim lẻ (Movie)</option>
                  <option value="tv">Phim bộ (TV Show)</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleFetchTmdb}
                disabled={fetchingTmdb}
                className="px-4 py-2.5 h-[42px] bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white transition-colors"
              >
                {fetchingTmdb ? 'Đang dò...' : 'Lấy thông tin'}
              </button>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Tên phim (Tự động)
            </label>
            <input
              className={inputClass}
              placeholder="Bấm nút 'Lấy thông tin' ở trên..."
              value={form.title}
              readOnly
            />
          </div>

          <div className="flex gap-4 border-t border-white/10 pt-4 mt-2">
            {/* ✅ Select Phân quyền xem đã được bọc lại */}
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Phân quyền xem
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.isPremium}
                  onChange={(e) =>
                    setForm({ ...form, isPremium: e.target.value === 'true' })
                  }
                >
                  <option value={false}>Miễn phí (Free)</option>
                  <option value={true}>Tài khoản Premium (VIP)</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* ✅ Select Trạng thái phát sóng đã được bọc lại */}
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Trạng thái phát sóng
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="AVAILABLE">Đang chiếu</option>
                  <option value="HIDDEN">Đã ẩn</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || (!editing && !form.title)}
              className="px-6 py-2 bg-red-600 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu phim'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
