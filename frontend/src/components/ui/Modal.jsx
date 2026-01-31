import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full ${sizes[size]}`}>
        <Card>
          {(title || showCloseButton) && (
            <div className="flex justify-between items-center mb-4">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              {showCloseButton && (
                <button onClick={onClose}>
                  <X />
                </button>
              )}
            </div>
          )}

          {children}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
