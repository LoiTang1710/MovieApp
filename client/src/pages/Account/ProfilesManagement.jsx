import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Loader, Edit2, Trash2, User } from 'lucide-react'
import {
  getProfilesApi,
  createProfileApi,
  deleteProfileApi,
} from '../../api/profileApi'
import { toast } from 'react-toastify'

export default function ProfilesManagement() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileType, setProfileType] = useState('ADULT')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: getProfilesApi,
  })

  const { mutate: createProfile, isPending: isCreating } = useMutation({
    mutationFn: (data) => createProfileApi(data),
    onSuccess: () => {
      toast.success('Tạo hồ sơ thành công')
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] })
      setShowModal(false)
      setProfileName('')
      setProfileType('ADULT')
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || 'Tạo hồ sơ thất bại'
      toast.error(errorMsg)
    },
  })

  const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteProfileApi(id),
    onSuccess: () => {
      toast.success('Xóa hồ sơ thành công')
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] })
      setDeleteConfirm(null)
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || 'Xóa hồ sơ thất bại'
      toast.error(errorMsg)
    },
  })

  const handleCreateProfile = (e) => {
    e.preventDefault()
    if (!profileName.trim()) {
      toast.error('Vui lòng nhập tên hồ sơ')
      return
    }
    createProfile({
      name: profileName.trim(),
      type: profileType,
    })
  }

  const handleDelete = (id) => {
    deleteProfile(id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  const canAddMore = profiles.length < 5

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-bg-secondary backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            Hồ sơ xem chung ({profiles.length}/5)
          </h3>
          <p className="text-sm text-white/60">
            Tối đa 5 hồ sơ trên một tài khoản
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="relative group">
              <div className="aspect-square rounded-lg bg-bg-default/20 border border-white/10 p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover mb-3"
                  />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-transparent hover:border-red-600 transition-colors">
                      <User className="w-8 h-8 text-gray-300 stroke-1" />
                    </div>
                  </>
                )}

                <p className="text-sm mt-5 font-medium text-white truncate w-full">
                  {profile.name}
                </p>
                <p
                  className={`text-xs mt-2 px-2 py-1 rounded-full ${
                    profile.type === 'KID'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {profile.type === 'KID' ? 'Trẻ em' : 'Người lớn'}
                </p>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                  <button
                    onClick={() =>
                      (window.location.href = `/profiles/edit/${profile.id}`)
                    }
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(profile.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {canAddMore && (
            <button
              onClick={() => setShowModal(true)}
              className="aspect-square rounded-lg bg-white/10 border-2 border-dashed border-white/20 hover:border-red-500/50 flex flex-col items-center justify-center text-center transition-all duration-200 group"
            >
              <Plus className="w-8 h-8 text-white/40 group-hover:text-red-500 transition-colors mb-2" />
              <p className="text-xs text-white/40 group-hover:text-red-500 transition-colors font-medium">
                Thêm hồ sơ
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Modal Thêm Hồ Sơ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Tạo hồ sơ mới
              </h2>

              <form onSubmit={handleCreateProfile} className="space-y-6">
                <div>
                  <label
                    htmlFor="profileName"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Tên hồ sơ
                  </label>
                  <input
                    id="profileName"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Nhập tên hồ sơ"
                    maxLength={50}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duration-200"
                    disabled={isCreating}
                  />
                </div>

                <div>
                  <label
                    htmlFor="profileType"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Loại hồ sơ
                  </label>
                  <select
                    id="profileType"
                    value={profileType}
                    onChange={(e) => setProfileType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duration-200"
                    disabled={isCreating}
                  >
                    <option value="ADULT">Người lớn</option>
                    <option value="KID">Trẻ em</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setProfileName('')
                      setProfileType('ADULT')
                    }}
                    disabled={isCreating}
                    className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors duration-200 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !profileName.trim()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    {isCreating && <Loader className="w-4 h-4 animate-spin" />}
                    {isCreating ? 'Đang tạo...' : 'Tạo hồ sơ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-2">
                Xóa hồ sơ?
              </h2>
              <p className="text-sm text-white/60 mb-6">
                Hành động này không thể hoàn tác. Hồ sơ này và tất cả dữ liệu
                liên quan sẽ bị xóa vĩnh viễn.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors duration-200 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
                >
                  {isDeleting && <Loader className="w-4 h-4 animate-spin" />}
                  {isDeleting ? 'Đang xóa...' : 'Xóa hồ sơ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
