import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useProfiles, useDeleteProfile } from '../../hooks/useProfiles';

export default function ProfileManage() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: profiles = [], isLoading } = useProfiles();
  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
        <div className="flex items-center mb-10">
          <Link to="/profiles" className="text-white hover:text-gray-300 transition mr-4">
            <ArrowLeft size={28} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-medium">Quản lý hồ sơ</h1>
        </div>

        {isLoading ? (
          <div className="text-gray-400 text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between bg-neutral-900/50 rounded-lg p-4 hover:bg-neutral-800/50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-700 flex-shrink-0">
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl text-gray-200 group-hover:text-white transition">
                    {profile.name}
                    {profile.isKid && (
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
              Hồ sơ <span className="text-white font-medium">"{deleteTarget.name}"</span>
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
    </div>
  );
}
