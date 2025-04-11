// components/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box bg-[#1A2526] text-white max-w-md mx-auto p-4 sm:p-6">
        <h3 className="font-bold text-lg sm:text-xl mb-4">{title}</h3>
        <p className="text-sm sm:text-base mb-6">{message}</p>
        <div className="modal-action flex justify-between">
          <button
            onClick={onConfirm}
            className="btn bg-highlight-teal border-none hover:bg-teal-600 text-sm sm:text-base"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="btn btn-ghost text-sm sm:text-base"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;