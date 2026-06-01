import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { loginApi, logoutApi } from '../../../api/auth.api';
import { LogIn, Loader2 } from 'lucide-react';
import AuthLayout from '../../../components/layouts/AuthLayout';
import { useAuth } from '../../../hooks/useAuth.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      // loginApi returns the user object directly
      const userData = response;
      
      //  Kiểm tra nếu là ADMIN thì không cho đăng nhập
      if (userData.role?.toUpperCase() === 'ADMIN') {
        // Hủy session vừa được tạo ở server để chặn đăng nhập admin tại đây
        await logoutApi().catch(() => {});
        setErrorMsg('Tài khoản Admin không thể đăng nhập tại đây. Vui lòng sử dụng trang Admin.');
        return;
      }
      
      //  Gọi login từ AuthContext để lưu user vào state
      login(userData);
      
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(
        () =>
          navigate(location.state?.from || '/', {
            state: location.state?.fromState,
          }),
        1500,
      );
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      setErrorMsg(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    loginMutation.mutate(formData);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-5">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">
          Đăng nhập
        </h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">
          {errorMsg && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 px-4 py-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <LogIn size={20} />
              )}
              {loginMutation.isPending ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-xs text-red-500">
            <Link to="/forgot-password" size={20} className="hover:underline">Quên mật khẩu?</Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Mới sử dụng MovieApp?{' '}
          <Link to="/register" className="text-red-500 hover:text-red-400 font-black transition-all ml-1 underline underline-offset-4">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
