// client/src/components/layouts/AuthLayout.jsx


import Header from './Header'; // Tái sử dụng Header của bạn
import Footer from './Footer'; // Tái sử dụng Footer của bạn

export default function AuthLayout({ children }) {
  return (
    // Bọc toàn bộ trang, flex-col để đẩy footer xuống đáy và header lên đầu
    <div className="min-h-screen bg-[#0a0000] text-white flex flex-col font-sans">
      
      {/* 1. Header có sẵn của bạn */}
      <Header />

      {/* 2. Phần Main Content (Chứa form Login / Register / Forgot Password) */}
      {/* flex-grow giúp phần này tự động giãn ra chiếm khoảng trống ở giữa */}
      {/* items-center justify-center giúp form luôn nằm ở giữa màn hình */}
      <main className="grow flex  items-center justify-center p-4">
        {children}
      </main>

      {/* 3. Footer có sẵn của bạn */}
      <Footer />
      
    </div>
  );
}