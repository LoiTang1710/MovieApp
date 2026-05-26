import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, Film } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { moviesApi } from '../../apis/admin.api'

const emptyForm = {
  title: '',
  description: '',
  releaseYear: new Date().getFullYear(),
  country: '',
  duration: '',
  posterUrl: '',
  trailerUrl: '',
  videoUrl: '',
  status: 'AVAILABLE',
  rating: '0',
  views: '0',
  genres: '',
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
      editing ? moviesApi.update(editing.id, payload) : moviesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] })
      closeModal()
    },
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu phim'),
  })

  const deleteMutation = useMutation({
    mutationFn: moviesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-movies'] }),
    onError: (err) => alert(err.response?.data?.message || 'Không thể xóa'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (movie) => {
    setEditing(movie)
    setForm({
      title: movie.title,
      description: movie.description,
      releaseYear: movie.releaseYear,
      country: movie.country || '',
      duration: movie.duration?.toString() || '',
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || '',
      videoUrl: movie.videoUrl || '',
      status: movie.status,
      rating: movie.rating?.toString() || '0',
      views: movie.views?.toString() || '0',
      genres: movie.genres?.map((g) => g.name).join(', ') || '',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveMutation.mutate({
      ...form,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
    })
  }

  const handleDelete = (id, title) => {
    if (window.confirm(`Xóa phim "${title}"?`)) deleteMutation.mutate(id)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý phim"
        subtitle="Thêm, sửa, ẩn phim trong thư viện nội bộ"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            className={`${inputClass} pl-10`}
            placeholder="Tìm theo tên, quốc gia..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          className={inputClass + ' sm:w-40'}
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
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/5">
                <th className="px-6 py-4 font-semibold">Phim</th>
                <th className="px-4 py-4 font-semibold">Năm</th>
                <th className="px-4 py-4 font-semibold">Lượt xem</th>
                <th className="px-4 py-4 font-semibold">Đánh giá</th>
                <th className="px-4 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : data?.items?.length ? (
                data.items.map((movie) => (
                  <tr key={movie.id} className="border-b border-white/5 hover:bg-white/[0.02]">
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
                          <p className="font-semibold text-white">{movie.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {movie.genres?.map((g) => g.name).join(', ') || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{movie.releaseYear}</td>
                    <td className="px-4 py-4 text-gray-300">
                      {movie.views?.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-4 text-yellow-400">{movie.rating}</td>
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
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Tên phim *</label>
            <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea className={inputClass + ' min-h-20'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Năm phát hành</label>
            <input type="number" className={inputClass} value={form.releaseYear} onChange={(e) => setForm({ ...form, releaseYear: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Quốc gia</label>
            <input className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Thời lượng (phút)</label>
            <input className={inputClass} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Điểm đánh giá</label>
            <input className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Lượt xem</label>
            <input className={inputClass} value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Thể loại (phân cách bằng dấu phẩy)</label>
            <input className={inputClass} placeholder="Hành động, Tình cảm" value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">URL Poster</label>
            <input className={inputClass} value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
              Hủy
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-6 py-2 bg-red-600 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
