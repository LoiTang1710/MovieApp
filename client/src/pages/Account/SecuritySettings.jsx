import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader } from 'lucide-react'
import { changePasswordApi } from '../../api/userApi'
import { toast } from 'react-toastify'

export default function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [errors, setErrors] = useState({})

  const { mutate: changePassword, isPending: isChanging } = useMutation({
    mutationFn: (data) => changePasswordApi({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setErrors({})
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || 'Đổi mật khẩu thất bại'
      toast.error(errorMsg)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp'
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    changePassword(formData)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-bg-secondary backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          Bảo mật tài khoản
        </h3>
        <p className="text-sm text-white/60 mb-6">
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu hiện tại"
                className={`w-full px-4 py-2.5 pr-12 bg-bg-default/50 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors duration-200 ${
                  errors.currentPassword
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-sm text-red-400">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                className={`w-full px-4 py-2.5 pr-12 bg-bg-default/50 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors duration-200 ${
                  errors.newPassword
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-400">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full px-4 py-2.5 pr-12 bg-bg-default/50 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors duration-200 ${
                  errors.confirmPassword
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isChanging}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {isChanging && <Loader className="w-4 h-4 animate-spin" />}
              {isChanging ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-bg-secondary backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          Các phiên đăng nhập khác
        </h3>
        <p className="text-sm text-white/60 mb-4">
          Nếu bạn không nhận ra một phiên đăng nhập, bạn có thể đăng xuất khỏi
          tất cả các phiên khác.
        </p>
        <button
          type="button"
          className="px-4 py-2 border border-white/20 hover:border-red-500/50 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          Đăng xuất khỏi các thiết bị khác
        </button>
      </div>
    </div>
  )
}
