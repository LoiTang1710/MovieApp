import { useState } from 'react'
import { User, Shield, CreditCard, Users } from 'lucide-react'
import PersonalInfo from './PersonalInfo'
import SecuritySettings from './SecuritySettings'
import SubscriptionHistory from './SubscriptionHistory'
import ProfilesManagement from './ProfilesManagement'

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('personal')

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'subscription', label: 'Gói dịch vụ', icon: CreditCard },
    { id: 'profiles', label: 'Hồ sơ xem chung', icon: Users },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo />
      case 'security':
        return <SecuritySettings />
      case 'subscription':
        return <SubscriptionHistory />
      case 'profiles':
        return <ProfilesManagement />
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="min-h-screen bg-bg-default text-slate-200 pt-7 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cài đặt tài khoản</h1>
          <p className="text-white/50">Quản lý thông tin, bảo mật và các gói dịch vụ của bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 whitespace-nowrap lg:whitespace-normal
                      ${
                        isActive
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'text-white/40 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-white/40'}`}
                    />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
