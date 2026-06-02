import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import { getProfilesApi } from '../../api/profileApi';
import Footer from '../../components/layouts/Footer';

/**
 * Render the profile selection page and its loading/error states.
 *
 * Fetches the current user's profiles and displays a selection UI: a loading screen while fetching,
 * an error screen when the query fails (showing the error message), an empty-state message when
 * there are no profiles, or a grid of profile tiles (with a "Trẻ em" badge for kid profiles) plus
 * controls to add or manage profiles.
 * @returns {JSX.Element} The profile selection React element.
 */
export default function ProfileSelection() {
  const { data: profiles = [], isLoading, isError, error } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: getProfilesApi,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-bg-default">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <main className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-medium mb-12">Ai đang xem?</h1>
            <div className="text-gray-400">Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-bg-default">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <main className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-medium mb-6">Ai đang xem?</h1>
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-400 mb-2">Không thể tải danh sách hồ sơ</h2>
              <p className="text-sm text-white/60 max-w-md">
                Cần chạy backend server: mở terminal riêng,{' '}
                <code className="text-red-400">cd server</code> rồi{' '}
                <code className="text-red-400">npm run dev</code>
              </p>
              <p className="text-xs text-white/40 mt-2">{error?.message}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-bg-default">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <main className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-medium mb-12">Ai đang xem?</h1>

          {profiles.length === 0 ? (
          <div className="text-center mb-16">
            <p className="text-gray-400 text-lg">Chưa có hồ sơ nào.</p>
            <p className="text-gray-500 text-sm mt-1">Thêm hồ sơ mới để bắt đầu.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {profiles.map((profile) => (
              <div key={profile.id} className="group flex flex-col items-center cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white transition-all bg-neutral-800 flex items-center justify-center">
                  <User size={64} className="text-gray-500" />
                </div>
                <span className="mt-4 text-gray-400 group-hover:text-white transition">
                  {profile.name}
                  {profile.type === 'KID' && (
                    <span className="ml-2 text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">Trẻ em</span>
                  )}
                </span>
              </div>
            ))}

            <Link to="/profiles/add" className="group flex flex-col items-center cursor-pointer">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-gray-500 flex items-center justify-center bg-transparent group-hover:bg-gray-800 transition-colors">
                <Plus size={64} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <span className="mt-4 text-gray-400 group-hover:text-white transition text-lg">
                Thêm hồ sơ
              </span>
            </Link>
          </div>
        )}

        <Link
          to="/profiles/manage"
          className="border border-gray-400 text-white px-6 py-2 text-lg hover:border-white hover:text-white transition tracking-wide"
        >
          Quản lý hồ sơ
        </Link>
      </div>
      </main>
      <Footer />
    </div>
  );
}
