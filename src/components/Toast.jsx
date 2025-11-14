import React from 'react';
import { CheckIcon, XIcon } from './Icons';

const Toast = ({ toast, onClose }) => {
  const icons = {
    success: <CheckIcon className="w-5 h-5 text-success-green" />,
    error: <XIcon className="w-5 h-5 text-error-red" />,
    info: <CheckIcon className="w-5 h-5 text-primary-blue" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-success-green',
    error: 'bg-red-50 border-error-red',
    info: 'bg-blue-50 border-primary-blue',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 bg-white border-l-4 ${bgColors[toast.type]} rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-down`}
    >
      {icons[toast.type]}
      <span className="text-sm font-medium text-gray-900 flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onRemove} />
      ))}
    </div>
  );
};
