import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from '../../components/layouts/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', code: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Registering user:', data);
      // Giả lập gọi API
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      alert('Đăng ký thành công!');
      navigate('/login');
    },
    onError: (error) => {
      alert('Đăng ký thất bại: ' + error.message);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    registerMutation.mutate(formData);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] mt-24 transform transition-all hover:border-white/20">
        <h1 className="text-3xl font-black text-center mb-10 text-white tracking-tight uppercase">Đăng ký để trải nghiệm</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input 
            type="text" name="username" placeholder="Tên người dùng" required
            className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
            onChange={handleChange}
          />
          <input 
            type="email" name="email" placeholder="Email/SĐT" required
            className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
            onChange={handleChange}
          />
          <input 
            type="password" name="password" placeholder="Nhập mật khẩu" required
            className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
            onChange={handleChange}
          />
          <input 
            type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required
            className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all"
            onChange={handleChange}
          />
          
          <div className="relative">
            <input 
              type="text" name="code" placeholder="Code" required
              className="w-full bg-black/50 text-sm text-gray-200 px-5 py-4 rounded-lg outline-none border border-white/5 focus:border-red-600/50 focus:bg-black/70 transition-all pr-24"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-red-600 font-black hover:text-red-500 transition-all uppercase tracking-tighter bg-red-600/10 px-2 py-1 rounded">
              Gửi mã
            </button>
          </div>

          <button 
            type="submit" disabled={registerMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-lg mt-4 transition-all active:scale-[0.97] disabled:opacity-50 shadow-[0_10px_20px_rgba(220,38,38,0.3)] uppercase tracking-widest text-sm"
          >
            {registerMutation.isPending ? 'Đang khởi tạo...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Bạn đã có tài khoản ? <Link to="/login" className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4">Đăng nhập</Link>
        </p>
      </div>
    </AuthLayout>
  );
}