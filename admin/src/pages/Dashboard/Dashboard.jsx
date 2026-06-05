import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users,
  Film,
  Activity,
  DollarSign,
  ChevronRight,
  TicketPercent,
  BarChart3,
  Download,
} from 'lucide-react'
import { fetchAdminOverview, exportReport } from '../../apis/admin.api'
import StatCard from '../../components/common/StatCard'
import MonthYearFilter from '../../components/common/MonthYearFilter'
import { BarChartSimple } from '../../components/common/SimpleCharts'
import { formatCurrency, formatViews } from '../../utils/formatters'

const now = new Date()

export default function Dashboard() {
  const [filter, setFilter] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['admin-overview', filter.month, filter.year],
    queryFn: () => fetchAdminOverview({ month: filter.month, year: filter.year }),
  })

  const handleExport = () => {
    exportReport().catch(() => alert('Xuất báo cáo thất bại'))
  }

  if (isLoading) {
    return <div className="text-gray-400 animate-pulse">Đang tải dữ liệu tổng quan...</div>
  }

  if (isError) {
    return (
      <div className="text-red-500 p-8">
        Không thể tải dữ liệu. Đảm bảo server đang chạy và bạn đã đăng nhập admin.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header + bộ lọc + xuất báo cáo */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">TỔNG QUAN</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dashboard quản trị MovieApp
            {isFetching && <span className="text-red-500 ml-2">· Đang cập nhật...</span>}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <MonthYearFilter
            month={filter.month}
            year={filter.year}
            onChange={setFilter}
          />
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-200 uppercase shrink-0"
          >
            <Download size={16} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI cards */}
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
          value={formatCurrency(data?.totalRevenue)}
          trend={data?.trends?.revenue}
          icon={DollarSign}
          color="bg-green-600/10 text-green-600"
        />
        <StatCard
          title="User mới"
          value={data?.newUsersCount}
          trend={data?.trends?.users}
          icon={Users}
          color="bg-blue-600/10 text-blue-600"
        />
        <StatCard
          title="Phim đang chiếu"
          value={data?.activeMovies}
          icon={Film}
          color="bg-yellow-600/10 text-yellow-600"
        />
      </div>

      {/* Doanh thu + Lượt xem 7 ngày */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Doanh thu 6 tháng</h3>
            <span className="text-xs text-red-400 font-medium">{data?.periodLabel}</span>
          </div>
          <BarChartSimple data={data?.monthlyChartData || []} valueKey="revenue" />
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Lượt xem 7 ngày</h3>
          <BarChartSimple
            data={data?.dailyViewsData || []}
            valueKey="views"
            labelKey="name"
            color="#f97316"
            formatValue={formatViews}
          />
        </div>
      </div>

      {/* Bảng phim phổ biến + lối tắt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-white font-bold">Phim phổ biến</h3>
            <span className="text-xs text-red-400 font-semibold">{data?.filterLabel || 'Tháng này'}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/10">
                  <th className="pb-3 pr-4 w-10">#</th>
                  <th className="pb-3 pr-4">Tên phim</th>
                  <th className="pb-3 pr-4 text-right">Lượt xem</th>
                  <th className="pb-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {(data?.popularMovies || []).slice(0, 8).map((movie, i) => (
                  <tr
                    key={movie.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <span className="text-red-500 font-black text-sm">{i + 1}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            alt=""
                            className="w-8 h-11 object-cover rounded hidden sm:block"
                          />
                        ) : (
                          <div className="w-8 h-11 bg-white/5 rounded hidden sm:flex items-center justify-center">
                            <Film size={14} className="text-gray-600" />
                          </div>
                        )}
                        <span className="text-white font-medium truncate">{movie.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-right text-gray-300 tabular-nums">
                      {formatViews(movie.views)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="text-yellow-400 font-semibold">
                        {Number(movie.rating).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {!data?.popularMovies?.length && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">
                      Chưa có dữ liệu phim trong kỳ này
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">Lối tắt quản lý</h3>
          <div className="space-y-2">
            {[
              { label: 'Quản lý phim', path: 'movies', icon: Film },
              { label: 'Người dùng', path: 'users', icon: Users },
              { label: 'Khuyến mãi', path: 'promotions', icon: TicketPercent },
              { label: 'Thống kê chi tiết', path: 'stats', icon: BarChart3 },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-red-600 transition-all group"
              >
                <span className="flex items-center gap-3 text-sm text-gray-300 group-hover:text-white">
                  <link.icon size={18} />
                  {link.label}
                </span>
                <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
