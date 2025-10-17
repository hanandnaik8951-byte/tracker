import React from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-300 mb-6">Are you sure you want to remove this item from your log?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="py-2 px-4 bg-base-300 text-neutral rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;