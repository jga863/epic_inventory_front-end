import React from 'react';

const AssignmentFilters = ({
  searchInput,
  onSearchInputChange,
  officeFilter,
  onOfficeFilterChange,
  onSearchSubmit,
  onClearFilters,
  officeOptions,
  hasActiveFilters
}) => {
  return (
    <form className="mt-3 space-y-3" onSubmit={onSearchSubmit}>
      <input
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
        placeholder="Search by name, email, or serial"
      />
      <div className="flex items-center gap-2">
        <select
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          value={officeFilter}
          onChange={(event) => onOfficeFilterChange(event.target.value)}
        >
          <option value="">All offices</option>
          {officeOptions.map((office) => (
            <option key={office} value={office}>
              {office}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-yellow-900 transition hover:bg-yellow-300"
        >
          Apply
        </button>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          className="text-xs font-medium text-gray-500 hover:text-gray-700"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </form>
  );
};

export default AssignmentFilters;