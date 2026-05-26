/** Biểu đồ CSS thuần — tránh lỗi bundle recharts + Vite 8 */

export function BarChartSimple({
  data = [],
  valueKey = 'revenue',
  labelKey = 'name',
  color = '#dc2626',
  formatValue,
}) {
  if (!data.length) {
    return <p className="text-gray-500 text-sm text-center py-12">Chưa có dữ liệu</p>
  }

  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1)
  const fmt =
    formatValue ||
    ((v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)))

  return (
    <div className="flex items-end justify-between gap-2 h-56 pt-4">
      {data.map((item, i) => {
        const value = Number(item[valueKey]) || 0
        const height = `${(value / max) * 100}%`
        return (
          <div key={i} className="flex flex-col items-center flex-1 min-w-0 h-full">
            <span className="text-[10px] text-white/80 mb-1 truncate w-full text-center font-semibold" title={String(value)}>
              {fmt(value)}
            </span>
            <div className="flex-1 w-full flex items-end justify-center">
              <div
                className="w-full max-w-10 rounded-t-md transition-all"
                style={{ height, backgroundColor: color, minHeight: value > 0 ? '4px' : 0 }}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">
              {item[labelKey]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function HorizontalBarChart({ data = [], valueKey = 'views', labelKey = 'name', color = '#3b82f6' }) {
  if (!data.length) {
    return <p className="text-gray-500 text-sm text-center py-12">Chưa có dữ liệu</p>
  }

  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1)

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const value = Number(item[valueKey]) || 0
        const width = `${(value / max) * 100}%`
        const label = item[labelKey] || item.title?.slice(0, 20) || `Item ${i + 1}`
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 truncate pr-2">{label}</span>
              <span className="text-gray-500 shrink-0">{value.toLocaleString('vi-VN')}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width, backgroundColor: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function LineChartSimple({ data = [], valueKey = 'users', labelKey = 'name', color = '#3b82f6' }) {
  if (!data.length) {
    return <p className="text-gray-500 text-sm text-center py-12">Chưa có dữ liệu</p>
  }

  const values = data.map((d) => Number(d[valueKey]) || 0)
  const max = Math.max(...values, 1)
  const points = values
    .map((v, i) => {
      const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100
      const y = 100 - (v / max) * 80 - 10
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="h-56 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          points={points}
        />
        {values.map((v, i) => {
          const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100
          const y = 100 - (v / max) * 80 - 10
          return <circle key={i} cx={x} cy={y} r="2" fill={color} vectorEffect="non-scaling-stroke" />
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((item, i) => (
          <span key={i} className="text-[10px] text-gray-500 truncate">
            {item[labelKey]}
          </span>
        ))}
      </div>
    </div>
  )
}
