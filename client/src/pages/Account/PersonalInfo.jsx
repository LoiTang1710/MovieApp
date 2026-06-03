import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, Loader, User } from 'lucide-react'
import { getUserProfileApi, updateUserProfileApi } from '../../api/userApi'
import { toast } from 'react-toastify'

export default function PersonalInfo() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfileApi,
  })

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
  })

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data) => updateUserProfileApi(data),
    onSuccess: (data) => {
      toast.success('Cập nhật thông tin thành công')
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      setSelectedFile(null)
      setAvatarPreview(null)
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message || 'Cập nhật thông tin thất bại'
      toast.error(errorMsg)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updateData = {
      ...formData,
    }
    if (selectedFile) {
      updateData.avatar = selectedFile
    }
    updateProfile(updateData)
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  const displayAvatar = avatarPreview || user?.avatarUrl
  const displayName = user?.fullName || ''
  const displayPhone = user?.phone || ''
  const displayDateOfBirth = user?.dateOfBirth
    ? user.dateOfBirth.split('T')[0]
    : ''
  const displayGender = user?.gender || 'MALE'

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-bg-secondary backdrop-blur-sm border border-white/10 rounded p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Ảnh đại diện</h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            onClick={handleAvatarClick}
            className="relative cursor-pointer group"
          >
            {displayAvatar ? (
              <>
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-red-500/30 group-hover:border-red-500 transition-colors duration-300"
                />
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-transparent hover:border-red-600 transition-colors">
                  <User className="w-14 h-14 text-gray-300 stroke-1" />
                </div>
              </>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="flex-1">
            <p className="text-sm text-white/70 mb-2">Hình ảnh hồ sơ của bạn</p>
            <p className="text-xs text-white/50 mb-3">
              Chấp nhận: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </p>
            <button
              onClick={handleAvatarClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Chọn ảnh
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-bg-secondary backdrop-blur-sm border border-white/10 rounded p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-6">
            Thông tin cá nhân
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-white mb-2"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName || displayName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-2.5 bg-bg-default/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duron-200"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-white mb-2"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone || displayPhone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-2.5 bg-bg-default/50 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-white mb-2"
              >
                Ngày sinh
              </label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth || displayDateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-bg-default/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-white mb-2"
              >
                Giới tính
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || displayGender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-bg-default/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors duration-200"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isUpdating && <Loader className="w-4 h-4 animate-spin" />}
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
