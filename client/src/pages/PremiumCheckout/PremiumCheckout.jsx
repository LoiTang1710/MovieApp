import { useState } from 'react'
import { Check, QrCode, ShieldCheck, Smartphone, WalletCards } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  useConfirmDevPayment,
  useCreateSubscription,
  usePremiumPlans,
} from '../../hooks/usePremium'
import { useAuth } from '../../hooks/useAuth.jsx'

const paymentMethods = [
  { id: 'momo', label: 'Ví MoMo', icon: WalletCards },
  { id: 'vietqr', label: 'VietQR', icon: QrCode },
]

const planFeatures = [
  'Chất lượng 4K + HDR',
  'Xem trên 4 thiết bị cùng lúc',
  'Có thể tải xuống',
  'Không giới hạn phim và chương trình TV',
]

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN').format(price || 0)

const getErrorMessage = (error) =>
  error?.response?.data?.message || 'Không thể đăng ký gói lúc này. Vui lòng thử lại.'

export default function PremiumCheckout() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data: plans = [], isLoading, isError } = usePremiumPlans()
  const subscriptionMutation = useCreateSubscription()
  const confirmPaymentMutation = useConfirmDevPayment()
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('momo')

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) || plans[0]

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/premium' } })
      return
    }

    if (selectedPlan) {
      subscriptionMutation.mutate({
        planId: selectedPlan.id,
        paymentProvider: paymentMethod.toUpperCase(),
      })
    }
  }

  return (
    <section className="min-h-[calc(100vh-15rem)] bg-[#171717] px-5 py-12 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            Hoàn tất đăng ký của bạn
          </h1>
          <p className="mt-4 text-sm text-white/45">
            Chọn phương thức thanh toán và bắt đầu xem ngay.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-lg border border-white/10 bg-[#232323] p-12 text-center text-white/60">
            Đang tải các gói premium...
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-600/40 bg-red-950/20 p-6 text-center text-red-200">
            Không thể tải danh sách gói premium. Vui lòng thử lại sau.
          </div>
        )}

        {!isLoading && !isError && plans.length > 0 && (
          <form
            className="grid items-start gap-6 lg:grid-cols-[21rem_1fr]"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id

                return (
                  <button
                    className={`relative w-full rounded-xl border p-6 text-left transition ${
                      isSelected
                        ? 'border-red-500 bg-[#303030]'
                        : 'border-white/10 bg-[#232323] hover:border-white/25'
                    }`}
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlanId(plan.id)
                      subscriptionMutation.reset()
                      confirmPaymentMutation.reset()
                    }}
                    type="button"
                  >
                    {isSelected && (
                      <span className="absolute right-0 top-0 rounded-bl-md rounded-tr-xl bg-[#e52a2a] px-3 py-1 text-[10px] font-bold uppercase">
                        Đã chọn
                      </span>
                    )}
                    <h2 className="pr-16 text-lg font-semibold">{plan.name}</h2>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="text-3xl font-black">
                        {formatPrice(plan.price)}đ
                      </span>
                      <span className="mb-1 text-xs text-white/45">
                        /{plan.durationDays === 30 ? 'tháng' : 'năm'}
                      </span>
                    </div>
                    {isSelected && (
                      <>
                        <ul className="mt-6 space-y-4 text-sm text-white/80">
                          {planFeatures.map((feature) => (
                            <li className="flex items-center gap-3" key={feature}>
                              <Check className="h-4 w-4 text-red-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-5 text-white/40">
                          Bạn có thể hủy gói đăng ký bất kỳ lúc nào. Gói đăng ký
                          sẽ tự động gia hạn mỗi kỳ.
                        </p>
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <div>
              <div className="mb-5 grid grid-cols-2 rounded-lg bg-[#0f0f0f] p-1">
                {paymentMethods.map(({ id, icon: Icon, label }) => (
                  <button
                    className={`flex items-center justify-center gap-2 rounded-md py-3 text-sm transition ${
                      paymentMethod === id
                        ? 'bg-[#383838] text-white'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                    key={id}
                    onClick={() => {
                      setPaymentMethod(id)
                      subscriptionMutation.reset()
                      confirmPaymentMutation.reset()
                    }}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-white/5 bg-[#242424] p-7">
                {paymentMethod === 'momo' ? (
                  <div className="flex h-52 flex-col items-center justify-center rounded-lg border border-white/5 bg-[#1b1b1b] px-6 text-center">
                    <div className="mb-5 rounded-full bg-[#a50064]/20 p-4 text-[#dc3286]">
                      <Smartphone className="h-10 w-10" />
                    </div>
                    <p className="text-base font-semibold">Thanh toán với Ví MoMo</p>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
                      Bạn sẽ được chuyển sang MoMo để xác nhận thanh toán an toàn
                      sau khi tạo yêu cầu đăng ký.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-52 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#1b1b1b] px-6 text-center">
                    <QrCode className="mb-4 h-12 w-12 text-red-400" />
                    <p className="text-base font-semibold">Thanh toán bằng VietQR</p>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
                      Mã QR chuyển khoản theo số tiền và nội dung thanh toán sẽ
                      được tạo sau khi bạn xác nhận gói.
                    </p>
                  </div>
                )}

                <button
                  className="mt-7 w-full rounded-md bg-[#e72626] py-4 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    !selectedPlan ||
                    subscriptionMutation.isPending ||
                    subscriptionMutation.isSuccess
                  }
                  type="submit"
                >
                  {subscriptionMutation.isPending
                    ? 'ĐANG XỬ LÝ...'
                    : subscriptionMutation.isSuccess
                      ? 'ĐÃ GỬI YÊU CẦU'
                      : paymentMethod === 'momo'
                        ? 'THANH TOÁN VỚI MOMO'
                        : 'TẠO MÃ VIETQR'}
                </button>

                {subscriptionMutation.isSuccess && (
                  <>
                    <p className="mt-4 text-center text-sm text-green-400">
                      Đã tạo thanh toán{' '}
                      {subscriptionMutation.data.payment.provider} trị giá{' '}
                      {formatPrice(subscriptionMutation.data.payment.amount)}đ.
                      Giao dịch đang chờ xử lý.
                    </p>
                    {!confirmPaymentMutation.isSuccess && (
                      <button
                        className="mt-4 w-full rounded-md border border-amber-400/40 bg-amber-400/10 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={confirmPaymentMutation.isPending}
                        onClick={() =>
                          confirmPaymentMutation.mutate(
                            subscriptionMutation.data.payment.id,
                          )
                        }
                        type="button"
                      >
                        {confirmPaymentMutation.isPending
                          ? 'ĐANG XÁC NHẬN...'
                          : 'DEV: MÔ PHỎNG THANH TOÁN THÀNH CÔNG'}
                      </button>
                    )}
                  </>
                )}
                {confirmPaymentMutation.isSuccess && (
                  <p className="mt-4 text-center text-sm font-semibold text-green-400">
                    Thanh toán thành công. Gói premium đã được kích hoạt.
                  </p>
                )}
                {confirmPaymentMutation.isError && (
                  <p className="mt-4 text-center text-sm text-red-400">
                    {getErrorMessage(confirmPaymentMutation.error)}
                  </p>
                )}
                {subscriptionMutation.isError && (
                  <p className="mt-4 text-center text-sm text-red-400">
                    {getErrorMessage(subscriptionMutation.error)}
                  </p>
                )}
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-white/35">
                <ShieldCheck className="h-4 w-4" />
                Thanh toán sẽ được xác nhận an toàn sau khi tích hợp nhà cung cấp.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
