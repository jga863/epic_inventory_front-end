import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-4">
      {/* Prev */}
      <button
        className={`px-4 py-2 rounded-md border border-gray-400 bg-white text-gray-700 font-medium 
                    transition hover:bg-gray-100 hover:text-yellow-500 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={onPrev}
        disabled={page === 0}
      >
        Prev
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page {page + 1} of {Math.max(totalPages, 1)}
      </span>

      {/* Next */}
      <button
        className={`px-4 py-2 rounded-md border border-gray-400 bg-white text-gray-700 font-medium 
                    transition hover:bg-gray-100 hover:text-yellow-500 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={onNext}
        disabled={page + 1 >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
