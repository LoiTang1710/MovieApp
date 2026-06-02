import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { getProfileApi, createProfileApi, updateProfileApi, deleteProfileApi } from '../../api/profileApi';
import Footer from '../../components/layouts/Footer';

/**
 * Render a form for creating, editing, and deleting a user profile.
 *
 * When an `id` route param is present the component loads the existing profile
 * and pre-fills the form fields. The form lets the user edit the profile name
 * and toggle a kid/adult type, save changes (create or update), and delete the
 * profile after confirming in a modal. On successful create/update/delete the
 * component invalidates the cached `userProfiles` query and navigates to
 * `/profiles`. Load and save errors are displayed in the UI.
 *
 * @returns {JSX.Element} The profile form UI.
 */
export default function ProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { data: profileData, isError: isLoadError, error: loadError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => getProfileApi(id),
    enabled: isEditMode,
  });

  const [profileName, setProfileName] = useState('');
  const [profileType, setProfileType] = useState('ADULT');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name);
      setProfileType(profileData.type);
    }
  }, [profileData]);

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: isEditMode
      ? (data) => updateProfileApi({ id, ...data })
      : createProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      navigate('/profiles');
    },
    onError: (err) => {
      setSaveError(err?.response?.data?.message || 'Lưu hồ sơ thất bại');
    },
  });

  const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
    mutationFn: deleteProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      setShowDeleteModal(false);
      navigate('/profiles');
    },
    onError: (err) => {
      setSaveError(err?.response?.data?.message || 'Xóa hồ sơ thất bại');
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaveError('');
    if (!profileName.trim()) return;
    saveProfile({ name: profileName.trim(), type: profileType });
  };

  if (isEditMode && isLoadError) {
    return (
      <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-bg-default">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <main className="grow flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Không thể tải thông tin hồ sơ</h2>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              Cần chạy backend server: mở terminal riêng,{' '}
              <code className="text-red-400">cd server</code> rồi{' '}
              <code className="text-red-400">npm run dev</code>
            </p>
            <p className="text-xs text-white/40 mt-2">{loadError?.message}</p>
            <Link
              to="/profiles"
              className="inline-block mt-6 border border-gray-400 text-white px-6 py-2 hover:border-white transition"
            >
              Quay lại
            </Link>
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
      <main className="grow flex items-center justify-center p-4 relative">
        <div className="absolute top-0 left-0">
          <Link to="/profiles" className="text-white hover:text-gray-300 transition inline-block">
            <ArrowLeft size={36} />
          </Link>
        </div>

        <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-[200px] h-[200px] rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <span className="text-6xl text-gray-500 font-medium">
              {profileName ? profileName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px bg-neutral-600"></div>

        <div className="flex flex-col justify-center flex-grow w-full space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xl text-gray-300">Tên hồ sơ :</label>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(true); setSaveError(''); }}
                  className="text-gray-400 hover:text-white transition p-1"
                >
                  <Trash2 size={28} />
                </button>
              )}
            </div>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-700 text-white px-4 py-3 rounded-md text-lg outline-none focus:border-gray-500 transition"
              placeholder="Nhập tên hồ sơ"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl text-gray-300">Hồ sơ trẻ em :</span>
            <button
              type="button"
              onClick={() => setProfileType(profileType === 'KID' ? 'ADULT' : 'KID')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors border border-gray-600 ${
                profileType === 'KID' ? 'bg-red-600 border-red-600' : 'bg-transparent'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-gray-300 transition-transform ${
                  profileType === 'KID' ? 'translate-x-7 bg-white' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {saveError && (
            <p className="text-red-400 text-sm text-center">{saveError}</p>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-[#2b2b2b] hover:bg-white hover:text-black text-white py-3 rounded-md text-lg font-medium transition disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : isEditMode ? 'Lưu' : 'Thêm'}
            </button>
            <Link
              to="/profiles"
              className="flex-1 bg-[#2b2b2b] hover:bg-neutral-700 text-white py-3 rounded-md text-lg font-medium transition text-center block"
            >
              Hủy
            </Link>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#141414] border border-neutral-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <h2 className="text-3xl font-medium mb-4 text-white">Xóa hồ sơ này?</h2>
            <p className="text-gray-400 mb-8 text-lg px-2">
              Hồ sơ này cùng lịch sử và cài đặt của nó sẽ bị xóa vĩnh viễn, không khôi phục
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                disabled={isDeleting}
                className="flex-1 bg-[#b81d24] text-white py-3 rounded-md text-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                onClick={() => deleteProfile(id)}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                className="flex-1 bg-[#2b2b2b] text-white py-3 rounded-md text-xl font-medium hover:bg-neutral-700 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
