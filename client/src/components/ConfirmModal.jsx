import React, { useEffect } from "react";

function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) {
    return null;
  }

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-gray-800 p-6 text-white shadow-xl"
        onClick={handlePanelClick}
      >
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="mb-6 text-sm text-gray-300">{children}</div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded cursor-pointer transition-colors"
          >
            Odustani
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded cursor-pointer transition-colors"
          >
            Potvrdi
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
