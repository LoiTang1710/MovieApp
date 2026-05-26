import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, User, Upload } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { usersApi, uploadAvatar } from '../../apis/admin.api'
import { formatGender, formatDateOnly } from '../../utils/formatters'

const emptyForm = {
  email: '',
  password: '',
  role: 'USER',
  fullName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  avatarUrl: '',
}

const inputClass =
  'w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-red-500/50 outline-none'

export default function Users() {
  const queryClient = useQueryClient()
  const fileRef = useRef(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () =>
      usersApi.list({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  })

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      let avatarUrl = payload.avatarUrl
      if (avatarFile) {
        const uploaded = await uploadAvatar(avatarFile)
        avatarUrl = uploaded.url
      }
      const body = { ...payload, avatarUrl }
      if (editing && !body.password) delete body.password
      return editing ? usersApi.update(editing.id, body) : usersApi.create(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      closeModal()
    },
    onError: (err) => alert(err.response?.data?.message || 'Lỗi lưu người dùng'),
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    onError: (err) => alert(err.response?.data?.message || 'Không thể xóa'),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setAvatarFile(null)
    setAvatarPreview('')
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    setForm({
      email: user.email,
      password: '',
      role: user.role,
      fullName: user.fullName || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : '',
      gender: user.gender || '',
      avatarUrl: user.avatarUrl || '',
    })
    setAvatarFile(null)
    setAvatarPreview(user.avatarUrl || '')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setAvatarFile(null)
    setAvatarPreview('')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Ảnh tối đa 2MB')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const rowIndex = (i) => (data.page - 1) * data.limit + i + 1

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Tài khoản, hồ sơ cá nhân và phân quyền"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold"
          >
            <Plus size={18} /> Thêm người dùng
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            className={inputClass + ' pl-10'}
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <select
          className={inputClass + ' sm:w-40'}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">Tất cả vai trò</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/10">
                <th className="px-4 py-4 w-12">#</th>
                <th className="px-3 py-4 w-16">Ảnh</th>
                <th className="px-3 py-4">Họ và tên</th>
                <th className="px-3 py-4">Email</th>
                <th className="px-3 py-4">Số điện thoại</th>
                <th className="px-3 py-4">Vai trò</th>
                <th className="px-3 py-4">Ngày sinh</th>
                <th className="px-3 py-4">Giới tính</th>
                <th className="px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : data?.items?.length ? (
                data.items.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3.5 text-gray-500 font-medium">{rowIndex(i)}</td>
                    <td className="px-3 py-3.5">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <User size={18} className="text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-white whitespace-nowrap">
                      {user.fullName || '—'}
                    </td>
                    <td className="px-3 py-3.5 text-gray-300">{user.email}</td>
                    <td className="px-3 py-3.5 text-gray-400 whitespace-nowrap">
                      {user.phone || '—'}
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={user.role} />
                    </td>
                    <td className="px-3 py-3.5 text-gray-400 whitespace-nowrap">
                      {formatDateOnly(user.dateOfBirth)}
                    </td>
                    <td className="px-3 py-3.5 text-gray-300">
                      {formatGender(user.gender)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa ${user.fullName || user.email}?`))
                              deleteMutation.mutate(user.id)
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Không có người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.totalPages > 1 && (
          <div className="flex justify-between px-6 py-4 border-t border-white/5 text-xs text-gray-500">
            <span>
              Trang {data.page}/{data.totalPages} · {data.total} người dùng
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-white/5 disabled:opacity-30"
              >
                Trước
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-white/5 disabled:opacity-30"
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
        title={editing ? 'Sửa người dùng' : 'Thêm người dùng'}
        wide
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            saveMutation.mutate(form)
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2 flex flex-col items-center gap-3 pb-2">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt=""
                className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                <User size={40} className="text-gray-600" />
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-4 py-2 rounded-lg"
            >
              <Upload size={14} />
              Tải ảnh đại diện
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Họ và tên *</label>
            <input
              required
              className={inputClass}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Số điện thoại</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0901234567"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Email *</label>
            <input
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Mật khẩu {editing ? '(để trống nếu không đổi)' : '*'}
            </label>
            <input
              type="password"
              className={inputClass}
              required={!editing}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ngày sinh</label>
            <input
              type="date"
              className={inputClass}
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Giới tính</label>
            <select
              className={inputClass}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Vai trò</label>
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="text-sm text-gray-400">
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
