import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from "../../../components/layouts/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Logging in user:', data);
      // Giả lập gọi API đăng nhập
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      alert('Đăng nhập thành công!');
      navigate('/');
    },
    onError: (error) => {
      alert('Đăng nhập thất bại: ' + error.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">Đăng nhập</h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="text" name="email" placeholder="Email/SĐT" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={handleChange}
          />

          <div className="flex flex-col gap-4">
            <input 
              type="password" name="password" placeholder="Nhập mật khẩu" required
              className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
              onChange={handleChange}
            />
            <div className="flex justify-start">
              <Link to="/forgot-password" university-offset-4 className="text-xs text-red-600 hover:text-red-500 font-bold transition-all">
                Quên mật khẩu ?
              </Link>
            </div>
          </div>

          <button 
            type="submit" disabled={loginMutation.isPending}
            className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-6 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
          >
            {loginMutation.isPending ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Bạn chưa có tài khoản ? <Link to="/register" className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4">Đăng ký</Link>
      </p>
      </div>
    </AuthLayout>
  );
}