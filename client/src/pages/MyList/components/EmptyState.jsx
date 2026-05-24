import { Film, Play } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Film size={80} className="text-[#444] mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Danh Sách Phim Còn Trống</h2>
      <p className="text-gray-500 text-sm mb-8">
        Hãy thêm những bộ phim yêu thích của bạn vào đây
      </p>
      <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3 rounded-full transition-colors">
        Khám Phá Ngay <Play size={16} fill="white" />
      </button>
    </div>
  );
}
