import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-brand-dark flex justify-center items-center z-[200]">
      <div className="w-16 h-16 border-4 border-t-brand-purple border-gray-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
