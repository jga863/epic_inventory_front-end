import React from 'react';

const FormError = ({ error, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 ${className}`}>
      {error}
    </div>
  );
};

export default FormError;