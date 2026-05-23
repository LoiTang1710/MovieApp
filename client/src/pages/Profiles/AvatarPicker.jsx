import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { getAvatarsApi } from '../../api/profileApi';

export default function AvatarPicker({ currentAvatar, onSelect, onClose }) {
  const { data: avatars = [] } = useQuery({
    queryKey: ['avatars'],
    queryFn: getAvatarsApi,
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#141414] border border-neutral-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-white">Chọn avatar</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.seed}
              onClick={() => onSelect(avatar.url)}
              className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${
                currentAvatar === avatar.url
                  ? 'border-white scale-110'
                  : 'border-transparent hover:border-gray-500'
              }`}
            >
              <img
                src={avatar.url}
                alt={avatar.seed}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
