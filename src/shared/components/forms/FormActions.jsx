import React from 'react';

const FormActions = ({
  onCancel,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  className = '',
  submitDisabled = false
}) => {
  return (
    <div className={`flex justify-end gap-4 pt-2 ${className}`}>
      <button
        type="button"
        className="text-sm font-medium text-gray-600 hover:text-gray-800 disabled:text-gray-400"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        className="rounded bg-yellow-400 px-5 py-2 text-sm font-semibold text-yellow-900 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || submitDisabled}
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
};

export default FormActions;