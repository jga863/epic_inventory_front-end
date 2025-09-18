import React from "react";

const DeletePlaceholder = ({ title, description, onBack }) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        ) : null}
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-8 py-10 text-sm text-gray-500">
          This section is ready for your delete workflow integration.
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-yellow-400 bg-white px-6 py-3 text-sm font-semibold text-yellow-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-yellow-50"
        >
          Back to delete options
        </button>
      </div>
    </div>
  );
};

export default DeletePlaceholder;
