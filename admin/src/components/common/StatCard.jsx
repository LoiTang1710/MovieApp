export default function StatCard({ title, value, trend, icon: Icon, color }) {
  return (
    <div className="bg-[#121212] border border-white/5 p-6 rounded-xl hover:border-white/20 transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-red-500 transition-colors">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  trend.startsWith('+')
                    ? 'bg-green-500/10 text-green-500'
                    : trend.startsWith('-')
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-gray-500/10 text-gray-400'
                }`}
              >
                {trend}
              </span>
              <span className="text-gray-500 text-[10px]">vs tháng trước</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  )
}
