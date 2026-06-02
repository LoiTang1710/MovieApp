// client/src/components/layouts/AuthLayout.jsx


import Header from './Header'; // Tái sử dụng Header của bạn
import Footer from './Footer'; // Tái sử dụng Footer của bạn

export default function AuthLayout({ children }) {
  return (
    // Bọc toàn bộ trang, flex-col để đẩy footer xuống đáy và header lên đầu
    <div className="min-h-screen text-white flex flex-col font-sans bg-bg-default relative overflow-hidden">
      {/* Background glow effects to match global glassmorphism style */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* 1. Header có sẵn của bạn */}
      <Header />

      {/* 2. Phần Main Content (Chứa form Login / Register / Forgot Password) */}
      {/* flex-grow giúp phần này tự động giãn ra chiếm khoảng trống ở giữa */}
      {/* items-center justify-center giúp form luôn nằm ở giữa màn hình */}
      <main className="grow flex items-center justify-center p-4 pb-16">
        {children}
      </main>

      {/* 3. Footer có sẵn của bạn */}
      <div className="mt-16">
        <Footer />
      </div>
      
    </div>
  );
}