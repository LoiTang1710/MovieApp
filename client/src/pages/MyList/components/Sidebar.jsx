import { Plus, Zap, LogOut, Trash2 } from "lucide-react";
import CollectionIcon from "./CollectionIcon";

export default function Sidebar({
  collections,
  activeCollectionId,
  onSelectCollection,
  onDeleteCollection,
  onOpenCreate,
}) {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#1a1a1a] rounded-2xl p-5 flex flex-col gap-1.5 self-start">
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
        Bộ Sưu Tập
      </p>

      {collections.map((col) => {
        const isActive = col.id === activeCollectionId;
        return (
          <div
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
              isActive ? "bg-red-600" : "hover:bg-[#252525]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={isActive ? "text-white" : "text-gray-400"}>
                <CollectionIcon iconKey={col.iconKey} />
              </span>
              <div>
                <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-300"}`}>
                  {col.displayName}
                </p>
                <p className={`text-[11px] ${isActive ? "text-red-200" : "text-gray-600"}`}>
                  {col.count} phim{col.isDefault ? " · Mặc định" : ""}
                </p>
              </div>
            </div>

            {!col.isDefault && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteCollection(col); }}
                className="text-gray-600 hover:text-gray-300 transition-colors p-0.5"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={onOpenCreate}
        className="mt-2 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
      >
        <Plus size={15} /> Tạo Danh Sách Mới
      </button>

      <div className="mt-auto pt-8 flex flex-col gap-2">
        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
          <Zap size={14} /> Nâng Cấp Lên PRO
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors px-1 py-1">
          <LogOut size={14} /> Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
