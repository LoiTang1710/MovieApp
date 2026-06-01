import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, ArrowLeft, User } from 'lucide-react';
import { getProfilesApi, deleteProfileApi } from '../../api/profileApi';
import Footer from '../../components/layouts/Footer';

/**
 * Render the profile management interface for viewing, editing, and deleting user profiles.
 *
 * Shows a loading screen while profiles load, an error screen if fetching fails, an empty-state with a link to add a profile when none exist, and a list of profiles with edit and delete actions. Deleting a profile opens a confirmation modal; deletion errors are displayed as an alert.
 * @returns {JSX.Element} The profile management page UI.
 */
export default function ProfileManage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: profiles = [], isLoading, isError, error } = useQuery({
    queryKey: ['userProfiles'],
    queryFn: getProfilesApi,
  });

  const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
    mutationFn: deleteProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      setDeleteTarget(null);
      setErrorMessage('');
    },
    onError: (err) => {
      setErrorMessage(err?.response?.data?.message || 'Xóa hồ sơ thất bại');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col text-white"
        style={{background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #1a0000 40%, #0d0000 100%)'}}>
        <main className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
            <h1 className="text-3xl md:text-4xl font-medium mb-10">Quản lý hồ sơ</h1>
            <div className="text-gray-400 text-center py-8">Đang tải...</div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col text-white"
        style={{background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #1a0000 40%, #0d0000 100%)'}}>
        <main className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
            <div className="flex items-center mb-10">
              <Link to="/profiles" className="text-white hover:text-gray-300 transition mr-4">
                <ArrowLeft size={28} />
              </Link>
              <h1 className="text-3xl md:text-4xl font-medium">Quản lý hồ sơ</h1>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-400 mb-2">Không thể tải danh sách hồ sơ</h2>
              <p className="text-sm text-white/60 max-w-md mx-auto">
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
    <div className="min-h-screen flex flex-col text-white"
      style={{background: 'radial-gradient(ellipse at 50% 0%, #3d0000 0%, #1a0000 40%, #0d0000 100%)'}}>
      <main className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
        <div className="flex items-center mb-10">
          <Link to="/profiles" className="text-white hover:text-gray-300 transition mr-4">
            <ArrowLeft size={28} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-medium">Quản lý hồ sơ</h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/30 border border-red-600/40 text-red-300 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Chưa có hồ sơ nào.</p>
            <Link
              to="/profiles/add"
              className="inline-block mt-4 border border-gray-400 text-white px-6 py-2 text-lg hover:border-white transition"
            >
              Thêm hồ sơ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-700 flex-shrink-0 bg-neutral-800 flex items-center justify-center">
                    <User size={32} className="text-gray-500" />
                  </div>
                  <span className="text-xl text-gray-200 group-hover:text-white transition">
                    {profile.name}
                    {profile.type === 'KID' && (
                      <span className="ml-3 text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">Trẻ em</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/profiles/edit/${profile.id}`)}
                    className="text-gray-400 hover:text-white transition p-2 hover:bg-neutral-700 rounded-full"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(profile)}
                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-neutral-700 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/profiles"
            className="inline-block border border-gray-400 text-white px-8 py-2 text-lg hover:border-white hover:text-white transition tracking-wide"
          >
            Xong
          </Link>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-neutral-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-3xl font-medium mb-4 text-white">Xóa hồ sơ này?</h2>
            <p className="text-gray-400 mb-2 text-lg">
              Hồ sơ <span className="text-white font-medium">&ldquo;{deleteTarget.name}&rdquo;</span>
            </p>
            <p className="text-gray-400 mb-8 text-lg px-2">
              sẽ bị xóa vĩnh viễn cùng lịch sử và cài đặt, không thể khôi phục
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                disabled={isDeleting}
                className="flex-1 bg-[#b81d24] text-white py-3 rounded-md text-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => deleteProfile(deleteTarget.id)}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                className="flex-1 bg-[#2b2b2b] text-white py-3 rounded-md text-xl font-medium hover:bg-neutral-700 transition"
                onClick={() => setDeleteTarget(null)}
              >
                Giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
}
