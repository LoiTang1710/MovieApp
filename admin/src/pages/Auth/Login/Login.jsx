import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import AuthLayout from '../../../components/layouts/AuthLayout'

import { loginApi } from '../../../apis/auth.api'
import { useAuth } from '../../../contexts/AuthContext.jsx'


export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (userData) => {
      if (userData.role?.toUpperCase() !== 'ADMIN') {
        alert('Tài khoản không có quyền admin')
        return
      }
      login(userData)
      navigate('/admin/dashboard')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Đăng nhập thất bại')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold text-center mb-2 text-white/80 tracking-tight">
          Admin Panel
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Đăng nhập để quản trị hệ thống
        </p>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-10 px-8 rounded-md shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder="admin@cinevibe.com"
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30"
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30"
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
            />
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-2 disabled:opacity-50 uppercase text-sm"
            >
              {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4 text-center">
            Demo: admin@cinevibe.com / admin123 (sau khi chạy seed)
          </p>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/" className="text-red-600 hover:text-red-500 font-bold">
            ← Về trang chủ
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
