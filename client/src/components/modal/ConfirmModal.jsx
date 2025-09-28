import React, { useEffect } from "react";
import {Button,Input} from "../../components"

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-black/90 backdrop-blur-sm rounded-lg p-6 w-96 max-w-sm text-gray-300 shadow-lg flex flex-col items-center'>
        <h2 className='text-xl font-semibold mb-4 text-center'>{title}</h2>
        <p className='mb-6 text-center'>{message}</p>
        <div className='flex justify-center gap-4 w-full'>
          <Button
            onClick={onCancel}
            variant='outline'
            size='md'
            className='w-full'
          >
            No
          </Button>
          <Button
            onClick={onConfirm}
            variant='default'
            size='md'
            className='w-full'
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
