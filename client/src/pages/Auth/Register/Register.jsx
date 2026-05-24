import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import AuthLayout from "../../../components/layouts/AuthLayout";

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
      <div className="w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">Đăng ký để trải nghiệm</h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="text" name="username" placeholder="Tên người dùng" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={handleChange}
          />
          <input 
            type="email" name="email" placeholder="Email/SĐT" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={handleChange}
          />
          <input 
            type="password" name="password" placeholder="Nhập mật khẩu" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={handleChange}
          />
          <input 
            type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={handleChange}
          />
          
          <div className="flex items-center gap-4">
            <input 
              type="text" name="code" placeholder="Mã xác nhận" required
              className="w-60 bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all"
              onChange={handleChange}
            />
            <button type="button" className="whitespace-nowrap text-xs text-red-600 hover:text-red-500 font-bold transition-all cursor-pointer underline ml-[25px]">
              Gửi mã
            </button>
          </div>

          <button 
            type="submit" disabled={registerMutation.isPending}
            className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-6 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
          >
            {registerMutation.isPending ? 'Đang khởi tạo...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Bạn đã có tài khoản ? <Link to="/login" className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4">Đăng nhập</Link>
      </p>
      </div>
    </AuthLayout>
  );
}