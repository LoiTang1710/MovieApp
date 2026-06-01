import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useProfiles } from '../../hooks/useProfiles';

/**
 * Render a centered profile selection UI that lists fetched profiles and provides actions to add or manage profiles.
 *
 * When profile data is loading, displays a loading message. Otherwise, renders a grid of profile cards showing each
 * profile's avatar and name, a card linking to /profiles/add to create a new profile, and a link to /profiles/manage.
 *
 * @returns {JSX.Element} The rendered profile selection interface.
 */
export default function ProfileSelection() {
  const { data: profiles = [], isLoading } = useProfiles();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.1)] p-10 md:p-14 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-12">Ai đang xem?</h1>

        {isLoading ? (
          <div className="text-gray-400">Đang tải...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {profiles.map((profile) => (
              <div key={profile.id} className="group flex flex-col items-center cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <span className="mt-4 text-gray-400 group-hover:text-white transition">{profile.name}</span>
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
    </div>
  );
}
