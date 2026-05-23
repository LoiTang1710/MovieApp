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
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 py-16 px-10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] mt-24 transform transition-all hover:border-white/20">
        <h1 className="text-3xl font-black text-center mb-10 text-white tracking-tight uppercase">Đăng nhập</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <input 
            type="text" name="email" placeholder="Email/SĐT" required
            className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
            onChange={handleChange}
          />

          <div className="flex flex-col gap-2">
            <input 
              type="password" name="password" placeholder="Nhập mật khẩu" required
              className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
              onChange={handleChange}
            />
            <div className="flex justify-start">
              <Link to="/forgot-password" className="text-xs text-red-600 hover:text-red-500 font-black transition-all underline decoration-red-600/30 underline-offset-4">
                Quên mật khẩu ?
              </Link>
            </div>
          </div>

          <button 
            type="submit" disabled={loginMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-lg mt-4 transition-all active:scale-[0.97] disabled:opacity-50 shadow-[0_10px_20px_rgba(220,38,38,0.3)] uppercase tracking-widest text-sm"
          >
            {loginMutation.isPending ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Bạn chưa có tài khoản ? <Link to="/register" className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4">Đăng ký</Link>
        </p>
      </div>
    </AuthLayout>
  );
}