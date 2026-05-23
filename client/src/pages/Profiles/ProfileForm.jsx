import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { getProfileApi, createProfileApi, updateProfileApi, deleteProfileApi } from '../../api/profileApi';
import AvatarPicker from './AvatarPicker';

export default function ProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { data: profileData } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => getProfileApi(id),
    enabled: isEditMode,
  });

  const [profileName, setProfileName] = useState('');
  const [isKidProfile, setIsKidProfile] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name);
      setIsKidProfile(profileData.isKid);
      setSelectedAvatar(profileData.avatar);
    }
  }, [profileData]);

  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: isEditMode ? (data) => updateProfileApi({ id, ...data }) : createProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      navigate('/profiles');
    },
  });

  const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
    mutationFn: deleteProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      setShowDeleteModal(false);
      navigate('/profiles');
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    saveProfile({ name: profileName.trim(), isKid: isKidProfile, avatar: selectedAvatar });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      <div className="absolute top-0 left-0">
        <Link to="/profiles" className="text-white hover:text-gray-300 transition inline-block">
          <ArrowLeft size={36} />
        </Link>
      </div>

      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14">
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            onClick={() => setShowAvatarPicker(true)}
            className="w-[200px] h-[200px] rounded-full overflow-hidden bg-neutral-800 relative group cursor-pointer border border-neutral-700"
          >
            <img
              src={selectedAvatar || 'https://via.placeholder.com/200/5c5c5c/ffffff?text=200x200px'}
              alt="Avatar"
              className="w-full h-full object-cover group-hover:opacity-70 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Pencil size={32} className="text-white" />
            </div>
          </div>
          <span className="text-xl text-gray-300 cursor-pointer hover:text-white transition" onClick={() => setShowAvatarPicker(true)}>Đổi ảnh</span>
        </div>

        <div className="hidden md:block w-px bg-neutral-600"></div>

        <div className="flex flex-col justify-center flex-grow w-full space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xl text-gray-300">Tên hồ sơ :</label>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
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
              onClick={() => setIsKidProfile(!isKidProfile)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors border border-gray-600 ${
                isKidProfile ? 'bg-red-600 border-red-600' : 'bg-transparent'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-gray-300 transition-transform ${
                  isKidProfile ? 'translate-x-7 bg-white' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

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

      {showAvatarPicker && (
        <AvatarPicker
          currentAvatar={selectedAvatar}
          onSelect={(url) => {
            setSelectedAvatar(url);
            setShowAvatarPicker(false);
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
}
