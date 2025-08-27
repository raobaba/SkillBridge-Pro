import React from "react";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 w-96 max-w-sm text-gray-300 shadow-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        <p className="mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4 w-full">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-500 hover:bg-gray-700 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
