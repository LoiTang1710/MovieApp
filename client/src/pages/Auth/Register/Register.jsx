import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import AuthLayout from '../../../components/layouts/AuthLayout'
import { useAuth } from '../../../contexts/AuthContext'
import { registerApi, sendVerificationCodeApi } from '../../../api/auth.api'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')

  const formData = useRef({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  })

  // Mutation gọi API đăng ký thực tế
  const registerMutation = useMutation({
    mutationFn: (data) =>
      registerApi({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        code: data.code,
      }),
    onSuccess: (response) => {
      //  Tự động đăng nhập sau khi đăng ký
      // registerApi returns the user object directly
      const userData = response;
      login(userData);
      
      setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...')
      setTimeout(() => navigate('/'), 2000)
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    },
  })

  // Mutation gọi API gửi OTP
  const sendCodeMutation = useMutation({
    mutationFn: (email) => sendVerificationCodeApi({ email, type: 'REGISTER' }),
    onSuccess: (response) => {
      console.log('Send code success:', response)
      setCodeSent(true)
      setError('')
    },
    onError: (err) => {
      console.error('Send code error:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Gửi mã thất bại. Vui lòng thử lại.'
      setError(errorMessage)
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    formData.current[name] = value
    if (name === 'email') {
      setEmail(value)
    }
    if (error) setError('')
  }

  const handleSendCode = () => {
    const email = formData.current.email
    if (!email) {
      setError('Vui lòng nhập địa chỉ email trước khi gửi mã.')
      return
    }
    sendCodeMutation.mutate(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.current.password !== formData.current.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    registerMutation.mutate(formData.current)
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-5">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">
          Tạo tài khoản
        </h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">

          {/* Thông báo lỗi */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Thông báo đăng ký thành công */}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              ✓ {success}
            </div>
          )}

          {/* Thông báo gửi mã thành công */}
          {codeSent && !error && !success && (
            <div className="mb-5 px-4 py-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              ✓ Mã xác nhận đã được gửi! Hãy kiểm tra Terminal backend để lấy mã.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="fullName"
              placeholder="Username"
              required
              aria-label="Username"
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email"
              required
              aria-label="Địa chỉ Email"
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              required
              aria-label="Mật khẩu"
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              required
              aria-label="Nhập lại mật khẩu"
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={handleChange}
            />

            {/* Ô nhập mã + nút gửi */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="code"
                placeholder="Mã xác nhận"
                required
                aria-label="Mã xác nhận"
                className="flex-1 bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendCodeMutation.isPending || !email}
                className="shrink-0 text-xs text-red-500 hover:text-red-400 font-bold transition-all cursor-pointer underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {sendCodeMutation.isPending ? 'Đang gửi...' : 'Gửi mã'}
              </button>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
            >
              {registerMutation.isPending ? 'Đang tạo tài khoản...' : 'ĐĂNG KÝ NGAY'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-400 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
