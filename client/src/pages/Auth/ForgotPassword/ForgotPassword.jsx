import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authClient } from '../../../api/axiosClient';
import AuthLayout from "../../../components/layouts/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', newPassword: '', confirmNewPassword: '', code: ''
  });
  const [otpSent, setOtpSent] = useState(false);

  // Mutation gửi OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (email) => {
      const response = await authClient.post('/auth/send-otp', {
        email,
        type: 'forgot-password'
      });
      return response.data;
    },
    onSuccess: () => {
      setOtpSent(true);
      alert('Đã gửi mã OTP! Vui lòng kiểm tra terminal backend để lấy mã.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      alert('Gửi mã thất bại: ' + errorMessage);
    }
  });

  const resetMutation = useMutation({
    mutationFn: async (data) => {
      const response = await authClient.post('/auth/forgot-password', {
        email: data.email,
        newPassword: data.newPassword,
        code: data.code
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Đặt lại mật khẩu thành công!');
      navigate('/login');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      alert('Đặt lại mật khẩu thất bại: ' + errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    if (!otpSent) {
      alert('Vui lòng gửi mã OTP trước!');
      return;
    }
    resetMutation.mutate(formData);
  };

  const handleSendOtp = () => {
    if (!formData.email) {
      alert('Vui lòng nhập email trước!');
      return;
    }
    sendOtpMutation.mutate(formData.email);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mt-24">
        <h1 className="text-4xl font-bold text-center mb-10 text-white/60 tracking-tight">Khôi phục mật khẩu</h1>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/20 py-14 px-10 rounded-md shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input 
            type="email" name="email" placeholder="Email/SĐT" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" name="newPassword" placeholder="Nhập mật khẩu mới" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          />
          <input 
            type="password" name="confirmNewPassword" placeholder="Nhập lại mật khẩu" required
            className="w-full bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all placeholder:text-gray-500"
            onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})}
          />
          
          <div className="flex items-center gap-4">
            <input 
              type="text" name="code" placeholder="Mã xác nhận" required
              className="w-60 bg-[#0f0f0f] text-sm text-gray-200 px-5 py-4 rounded-md outline-none border border-white/15 focus:border-white/30 transition-all"
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
            <button 
              type="button" 
              onClick={handleSendOtp}
              disabled={sendOtpMutation.isPending || otpSent}
              className="whitespace-nowrap text-xs text-red-600 hover:text-red-500 font-bold transition-all cursor-pointer underline ml-[25px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendOtpMutation.isPending ? 'Đang gửi...' : otpSent ? 'Đã gửi ✓' : 'Lấy mã'}
            </button>
          </div>

          <button 
            type="submit" disabled={resetMutation.isPending}
            className="w-full bg-[#e50914] hover:bg-[#ff0f1a] text-white font-bold py-4 rounded-md mt-6 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
          >
            {resetMutation.isPending ? 'Đang xử lý...' : 'ĐẶT LẠI MẬT KHẨU'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        Quay lại trang <Link to="/login" className="text-red-600 hover:text-red-500 font-black transition-all ml-1 underline decoration-red-600/30 underline-offset-4">Đăng nhập</Link>
      </p>
      </div>
    </AuthLayout>
  );
}
