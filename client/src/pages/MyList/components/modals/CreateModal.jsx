import { useState } from "react";
import { X,/*Facebook, Twitter, Instagram, */ Heart, Star, Video, ThumbsUp, Flame, Ticket } from "lucide-react";
import Modal from "./Modal";
import { ICON_OPTIONS } from "../../../../hooks/useMyList";

const ICON_COMPONENTS = { heart: Heart, star: Star, video: Video, thumbs: ThumbsUp, flame: Flame, ticket: Ticket };

export default function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [selectedIconKey, setSelectedIconKey] = useState("heart");

  function handleSubmit() {
    if (!name.trim()) return;
    onCreate(name.trim(), selectedIconKey);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold text-white mb-6">Tạo Danh Sách Mới</h2>

      {/* Icon picker */}
      <div className="flex gap-3 mb-6">
        {ICON_OPTIONS.map(({ key }) => {
          const Icon = ICON_COMPONENTS[key];
          return (
            <button
              key={key}
              onClick={() => setSelectedIconKey(key)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                selectedIconKey === key ? "bg-red-600 text-white" : "bg-[#333] text-gray-300 hover:bg-[#444]"
              }`}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <label className="block text-sm text-gray-400 mb-2">Tên Danh Sách</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Nhập tên bộ sưu tập ..."
        className="w-full bg-[#1a1a1a] border border-[#444] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-red-600 transition-colors mb-6"
      />

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Tạo Danh Sách
      </button>
    </Modal>
  );
}
