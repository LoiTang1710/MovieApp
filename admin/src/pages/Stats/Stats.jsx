import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Film, Eye } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { BarChartSimple, HorizontalBarChart, LineChartSimple } from '../../components/common/SimpleCharts'
import { fetchAdminOverview, fetchViewsReport, exportReport } from '../../apis/admin.api'
import { formatCurrency } from '../../utils/formatters'

export default function Stats() {
  const [viewType, setViewType] = useState('by_movie')
  const [exporting, setExporting] = useState(false)

  const { data: overview } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: fetchAdminOverview,
  })

  const { data: viewsData, isLoading } = useQuery({
    queryKey: ['admin-views', viewType],
    queryFn: () => fetchViewsReport(viewType),
  })

  const handleExport = async () => {
    try {
      setExporting(true)
      await exportReport()
    } catch {
      alert('Xuất báo cáo thất bại. Kiểm tra đăng nhập admin.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Thống kê & Báo cáo"
        subtitle="Phân tích lượt xem, doanh thu và xuất dữ liệu"
        action={
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 disabled:opacity-50"
          >
            <Download size={18} />
            {exporting ? 'Đang xuất...' : 'Xuất CSV'}
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng người dùng', value: overview?.totalUsers },
          { label: 'Tổng phim', value: overview?.totalMovies },
          { label: 'KM đang chạy', value: overview?.activePromotions },
          {
            label: 'Doanh thu tháng',
            value: formatCurrency(overview?.totalRevenue),
          },
        ].map((item) => (
          <div key={item.label} className="bg-[#121212] border border-white/5 rounded-xl p-5">
            <p className="text-xs text-gray-500 uppercase">{item.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{item.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-6">Doanh thu theo tháng</h3>
        <BarChartSimple data={overview?.monthlyChartData || []} valueKey="revenue" />
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Eye size={20} className="text-red-500" />
            Báo cáo lượt xem
          </h3>
          <div className="flex gap-2">
            {[
              { id: 'by_movie', label: 'Theo phim' },
              { id: 'by_day', label: 'Theo ngày' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewType(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  viewType === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center py-12">Đang tải...</p>
        ) : viewType === 'by_movie' ? (
          <HorizontalBarChart
            data={(viewsData || []).map((m) => ({
              name: m.title?.slice(0, 25),
              views: m.views,
            }))}
          />
        ) : (
          <LineChartSimple
            data={(viewsData || []).map((m, i) => ({
              name: m.title?.slice(0, 8) || `P${i + 1}`,
              views: m.views,
            }))}
            valueKey="views"
            color="#dc2626"
          />
        )}
      </div>

      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Film size={20} className="text-yellow-500" />
          Top phim xem nhiều
        </h3>
        <div className="space-y-3">
          {(overview?.popularMovies || []).map((movie, i) => (
            <div
              key={movie.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <span className="text-2xl font-black text-red-600/50 w-8">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{movie.title}</p>
                <p className="text-xs text-gray-500">{movie.views?.toLocaleString('vi-VN')} lượt xem</p>
              </div>
              <span className="text-yellow-400 text-sm font-bold">★ {movie.rating}</span>
            </div>
          ))}
          {!overview?.popularMovies?.length && (
            <p className="text-gray-500 text-sm">Chưa có dữ liệu phim</p>
          )}
        </div>
      </div>
    </div>
  )
}
