import { useQuery } from '@tanstack/react-query'
import { Loader, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { getSubscriptionHistoryApi } from '../../api/userApi'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'SUCCEEDED':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'FAILED':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'REFUNDED':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    default:
      return 'bg-white/10 text-white/70 border-white/20'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'SUCCEEDED':
      return <CheckCircle className="w-4 h-4" />
    case 'FAILED':
      return <AlertCircle className="w-4 h-4" />
    default:
      return null
  }
}

export default function SubscriptionHistory() {
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscriptionHistory'],
    queryFn: getSubscriptionHistoryApi,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  const { currentPlan, history = [] } = subscriptionData || {}

  return (
    <div className="space-y-8 max-w-4xl">
      {currentPlan && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Gói dịch vụ hiện tại</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
              <p className="text-sm text-white/60 mb-1">Gói</p>
              <p className="text-lg font-semibold text-white">{currentPlan.name}</p>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
              <p className="text-sm text-white/60 mb-1">Giá</p>
              <p className="text-lg font-semibold text-white">
                {formatCurrency(currentPlan.price)}
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-4 border border-white/5">
              <p className="text-sm text-white/60 mb-1">Trạng thái</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  new Date(currentPlan.endAt) > new Date() ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <p className="text-lg font-semibold text-white capitalize">
                  {new Date(currentPlan.endAt) > new Date() ? 'Hoạt động' : 'Đã hết hạn'}
                </p>
              </div>
            </div>
          </div>

          {currentPlan.endAt && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Hạn dùng</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {formatDate(currentPlan.endAt)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Lịch sử giao dịch</h3>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-white/70 uppercase tracking-wider py-3 px-4">
                    Mã giao dịch
                  </th>
                  <th className="text-left text-xs font-semibold text-white/70 uppercase tracking-wider py-3 px-4">
                    Ngày thanh toán
                  </th>
                  <th className="text-right text-xs font-semibold text-white/70 uppercase tracking-wider py-3 px-4">
                    Số tiền
                  </th>
                  <th className="text-center text-xs font-semibold text-white/70 uppercase tracking-wider py-3 px-4">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="py-4 px-4">
                      <p className="text-sm font-mono text-white/80">
                        {payment.providerTransactionId || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-white/80">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                            payment.status,
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          <span className="capitalize">
                            {payment.status === 'SUCCEEDED'
                              ? 'Thành công'
                              : payment.status === 'PENDING'
                                ? 'Đang xử lý'
                                : payment.status === 'FAILED'
                                  ? 'Thất bại'
                                  : 'Hoàn tiền'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Chưa có giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  )
}
