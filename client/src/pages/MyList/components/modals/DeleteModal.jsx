import { Trash2 } from "lucide-react";
import Modal from "./Modal";

export default function DeleteModal({ collection, onClose, onConfirm }) {
  function handleConfirm() {
    onConfirm(collection.id);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <Trash2 size={52} className="text-gray-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-3">Xóa Danh Sách ?</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-7">
          Bạn có chắc muốn xóa{" "}
          <strong className="text-white">{collection.displayName}</strong> ?<br />
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#3a3a3a] hover:bg-[#444] transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </Modal>
  );
}
