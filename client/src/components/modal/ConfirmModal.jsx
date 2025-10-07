import React from 'react';
import Modal from './index';
import { Button } from '../index';

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  cancelVariant = "ghost"
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      showCloseButton={false}
      closeOnBackdropClick={false}
    >
      <div className="p-6">
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancel}
            variant={cancelVariant}
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={confirmVariant}
            className="px-4 py-2"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
