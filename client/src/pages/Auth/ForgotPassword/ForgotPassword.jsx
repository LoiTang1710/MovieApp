import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from "../../../components/layouts/AuthLayout";
export default function ForgotPassword() {
  const formData = useRef({
    identifier: '',
    newPassword: '',
    confirmNewPassword: '',
    code: '',
  })

  const resetMutation = useMutation({
    mutationFn: async () => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMutation.mutate(formData.current);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">
          Khôi phục mật khẩu
        </h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Email/SĐT"
              aria-label='Email hoặc số điện thoại'
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={(e) => (formData.current.identifier = e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              aria-label='Nhập mật khẩu mới'
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={(e) => (formData.current.newPassword = e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              aria-label='Nhập lại mật khẩu'
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={(e) =>
                (formData.current.confirmNewPassword = e.target.value)
              }
            />

            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Mã xác nhận"
                aria-label='Mã xác nhận'
                required
                className="w-60 bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all"
                onChange={(e) =>
                  (formData.current.code = e.target.value)
                }
              />
              <button
                type="button"
                className="whitespace-nowrap text-xs text-red-600 hover:text-red-500 font-bold transition-all cursor-pointer underline ml-[25px]"
              >
                Lấy mã
              </button>
            </div>

            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-6 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
            >
              {resetMutation.isPending ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Quay lại trang{' '}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}