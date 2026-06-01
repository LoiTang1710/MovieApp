import { useState } from "react";
import { X, Link } from "lucide-react";
import Modal from "./Modal";

const SHARE_OPTIONS = [
//   { key: "facebook",  label: "Facebook",  Icon: Facebook,  action: () => {} },
//   { key: "twitter",   label: "Twitter",   Icon: Twitter,   action: () => {} },
//   { key: "instagram", label: "Instagram", Icon: Instagram, action: () => {} },
];

export default function ShareModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal onClose={onClose}>
      <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
        <X size={20} />
      </button>
      <h2 className="text-xl font-bold text-white text-center mb-8">Chia Sẻ Danh Sách</h2>
      <div className="flex justify-center gap-6">
        {SHARE_OPTIONS.map(({ key, label, Icon, action }) => (
          <button type="button" key={key} onClick={action} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-2xl bg-[#333] flex items-center justify-center text-white group-hover:bg-[#444] transition-colors">
              <Icon size={28} />
            </div>
            <span className="text-xs text-gray-400">{label}</span>
          </button>
        ))}

        {/* Copy link — separate because label changes */}
        <button type="button" onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
          <div className="w-16 h-16 rounded-2xl bg-[#333] flex items-center justify-center text-white group-hover:bg-[#444] transition-colors">
            <Link size={28} />
          </div>
          <span className="text-xs text-gray-400">{copied ? "Đã sao chép!" : "Sao Chép"}</span>
        </button>
      </div>
    </Modal>
  );
}
