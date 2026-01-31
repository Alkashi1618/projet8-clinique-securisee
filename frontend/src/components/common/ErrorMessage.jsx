import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({
  message,
  onClose,
  type = 'error',
}) => {
  const types = {
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${types[type]}`}
    >
      <AlertCircle size={20} />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose}>
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
