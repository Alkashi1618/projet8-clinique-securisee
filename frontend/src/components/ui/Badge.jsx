import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-700',
    success: 'bg-green-200 text-green-700',
    danger: 'bg-red-200 text-red-700',
    info: 'bg-blue-200 text-blue-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
