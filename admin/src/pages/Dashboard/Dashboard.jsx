import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview } from '../../apis/admin.api';
import { Users, Film, TrendingUp, DollarSign, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-[#121212] border border-white/5 p-6 rounded-xl hover:border-white/20 transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-red-500 transition-colors">
          {value}
        </h3>
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {trend}
            </span>
            <span className="text-gray-500 text-[10px]">vs tháng trước</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: fetchAdminOverview
  });

  if (isLoading) {
    return <div className="p-8 text-gray-400 animate-pulse">Đang tải dữ liệu tổng quan...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Không thể tải dữ liệu từ server.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">OVERVIEW</h1>
          <p className="text-gray-500 text-sm mt-1">Dữ liệu phân tích hệ thống thời gian thực.</p>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-md text-xs font-bold hover:bg-gray-200 transition-all uppercase">
          Xuất báo cáo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Lượt xem" 
          value={data?.monthlyViews} 
          trend={data?.trends?.views} 
          icon={Activity} 
          color="bg-red-600/10 text-red-600" 
        />
        <StatCard 
          title="Doanh thu" 
          value={`$${data?.totalRevenue?.toLocaleString()}`} 
          trend={data?.trends?.revenue} 
          icon={DollarSign} 
          color="bg-green-600/10 text-green-600" 
        />
        <StatCard 
          title="Người dùng" 
          value={data?.newUsersCount} 
          trend={data?.trends?.users} 
          icon={Users} 
          color="bg-blue-600/10 text-blue-600" 
        />
        <StatCard 
          title="Phim hoạt động" 
          value={data?.activeMovies} 
          icon={Film} 
          color="bg-yellow-600/10 text-yellow-600" 
        />
      </div>

      {/* Charts & Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-8 h-80 flex flex-col items-center justify-center text-center">
          <TrendingUp size={48} className="text-white/10 mb-4" />
          <h3 className="text-white font-bold">Biểu đồ tăng trưởng</h3>
          <p className="text-gray-500 text-sm max-w-xs mt-2">Tính năng đang phát triển. Sẽ tích hợp Recharts để hiển thị biến động doanh thu.</p>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold">Lối tắt quản lý</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Quản lý phim', path: '/admin/movies' },
              { label: 'Danh sách người dùng', path: '/admin/users' },
              { label: 'Khuyến mãi đang chạy', path: '/admin/promotions' }
            ].map((link, i) => (
              <Link 
                key={i} 
                to={link.path} 
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-red-600 transition-all group"
              >
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{link.label}</span>
                <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}