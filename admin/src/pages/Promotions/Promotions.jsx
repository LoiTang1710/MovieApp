import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, TicketPercent } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { promotionsApi } from '../../apis/admin.api'
import { formatDate } from '../../utils/formatters'

const emptyForm = {
  code: '',
  name: '',
  description: '',
  discountPercent: '10',
  maxUses: '',
  status: 'ACTIVE',
  startAt: '',
  endAt: '',
}

const inputClass =
  'w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-red-500/50 outline-none'

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

export default function Promotions() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-promotions', page, search],
    queryFn: () => promotionsApi.list({ page, limit: 10, search: search || undefined }),
  })

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editing ? promotionsApi.update(editing.id, payload) : promotionsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      closeModal()
    },
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu khuyến mãi'),
  })

  const deleteMutation = useMutation({
    mutationFn: promotionsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-promotions'] }),
  })

  const openCreate = () => {
    setEditing(null)
    const today = new Date().toISOString().slice(0, 10)
    setForm({ ...emptyForm, startAt: today, endAt: today })
    setModalOpen(true)
  }

  const openEdit = (promo) => {
    setEditing(promo)
    setForm({
      code: promo.code,
      name: promo.name,
      description: promo.description || '',
      discountPercent: promo.discountPercent?.toString(),
      maxUses: promo.maxUses?.toString() || '',
      status: promo.status,
      startAt: toInputDate(promo.startAt),
      endAt: toInputDate(promo.endAt),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Quản lý khuyến mãi"
        subtitle="Mã giảm giá và chiến dịch Premium"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold"
          >
            <Plus size={18} /> Tạo khuyến mãi
          </button>
        }
      />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          className={inputClass + ' pl-10 max-w-md'}
          placeholder="Tìm mã hoặc tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-gray-500 col-span-full py-12 text-center">Đang tải...</p>
        ) : data?.items?.length ? (
          data.items.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#121212] border border-white/5 rounded-2xl p-6 hover:border-red-600/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <TicketPercent className="text-red-500" size={20} />
                  <code className="text-red-400 font-bold text-sm">{promo.code}</code>
                </div>
                <StatusBadge status={promo.status} />
              </div>
              <h3 className="font-bold text-white mb-1">{promo.name}</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{promo.description}</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-white">{promo.discountPercent}%</span>
                <span className="text-xs text-gray-500">giảm</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <p>
                  {formatDate(promo.startAt)} → {formatDate(promo.endAt)}
                </p>
                <p>
                  Đã dùng: {promo.usedCount}
                  {promo.maxUses ? ` / ${promo.maxUses}` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(promo)}
                  className="flex-1 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Xóa khuyến mãi này?')) deleteMutation.mutate(promo.id)
                  }}
                  className="px-3 py-2 text-xs rounded-lg text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full py-12 text-center">Chưa có khuyến mãi</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi'} wide>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            saveMutation.mutate(form)
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mã *</label>
            <input className={inputClass} required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên *</label>
            <input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">% Giảm</label>
            <input type="number" min="1" max="100" className={inputClass} value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Giới hạn lượt dùng</label>
            <input className={inputClass} placeholder="Không giới hạn" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
            <input type="date" required className={inputClass} value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
            <input type="date" required className={inputClass} value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="text-sm text-gray-400">
              Hủy
            </button>
            <button type="submit" disabled={saveMutation.isPending} className="px-6 py-2 bg-red-600 rounded-lg text-sm font-bold disabled:opacity-50">
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
