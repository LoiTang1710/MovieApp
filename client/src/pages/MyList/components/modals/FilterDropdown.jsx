import { useEffect, useRef, useState } from "react";
import { SORT_OPTIONS } from "../../../../hooks/useMyList";

export default function FilterDropdown({ currentSort, onApply, onClose }) {
  const [selected, setSelected] = useState(currentSort);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 z-30 bg-[#2a2a2a] rounded-2xl p-5 shadow-2xl min-w-[260px]"
    >
      <p className="text-sm font-semibold text-white mb-3">Phân Loại</p>

      <div className="flex gap-2 mb-5">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selected === value
                ? "bg-red-600 text-white"
                : "bg-[#3a3a3a] text-gray-300 hover:bg-[#444]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <hr className="border-[#3a3a3a] mb-4" />

      <button
        onClick={() => onApply(selected)}
        className="px-6 py-2 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
      >
        Áp Dụng
      </button>
    </div>
  );
}
