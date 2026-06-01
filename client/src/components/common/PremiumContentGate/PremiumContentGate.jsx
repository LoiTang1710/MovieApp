import { Link, useLocation } from 'react-router-dom'
import { Crown, Loader2, LockKeyhole } from 'lucide-react'

import { useAuth } from '../../../hooks/useAuth.jsx'
import { useMyPremiumSubscription } from '../../../hooks/usePremium.jsx'

const PremiumContentGate = ({ children, required = false }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const {
    data: premiumSubscription,
    isLoading: isPremiumLoading,
  } = useMyPremiumSubscription({
    enabled: required && isAuthenticated,
  })

  if (!required) {
    return children
  }

  if (isAuthLoading || (isAuthenticated && isPremiumLoading)) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <AccessMessage
        actionLabel="Đăng nhập để tiếp tục"
        actionState={{ from: location.pathname, fromState: location.state }}
        actionTo="/login"
        description="Bạn cần đăng nhập và có gói Premium đang hoạt động để xem nội dung này."
        icon={LockKeyhole}
        title="Nội dung dành cho thành viên Premium"
      />
    )
  }

  if (!premiumSubscription) {
    return (
      <AccessMessage
        actionLabel="Chọn gói Premium"
        actionTo="/premium"
        description="Tài khoản của bạn chưa có gói Premium đang hoạt động."
        icon={Crown}
        title="Nâng cấp để bắt đầu xem"
      />
    )
  }

  return children
}

const AccessMessage = ({
  actionLabel,
  actionState,
  actionTo,
  description,
  icon: Icon,
  title,
}) => (
  <div className="flex min-h-[28rem] items-center justify-center px-5 py-12">
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#1d1d1d] p-8 text-center shadow-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 text-red-400">
        <Icon className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
      <Link
        className="mt-7 inline-flex rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500"
        state={actionState}
        to={actionTo}
      >
        {actionLabel}
      </Link>
    </div>
  </div>
)

export default PremiumContentGate
