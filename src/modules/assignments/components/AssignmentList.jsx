import React, { useMemo } from 'react';
import AssignmentFilters from './AssignmentFilters';
import AssignmentItem from './AssignmentItem';

const AssignmentList = ({
  assignments,
  listLoading,
  listError,
  searchInput,
  onSearchInputChange,
  officeFilter,
  onOfficeFilterChange,
  onSearchSubmit,
  onClearFilters,
  officeOptions,
  selectedEmployeeId,
  onSelectAssignment,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onRefresh,
  onBack
}) => {
  const hasActiveFilters = searchInput.trim() || officeFilter;

  const assignmentItems = useMemo(() => {
    if (listLoading) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading assignments...
        </div>
      );
    }
    if (listError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
          {listError}
        </div>
      );
    }
    if (!assignments.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No assignments found.
        </div>
      );
    }
    return assignments.map((assignment) => (
      <AssignmentItem
        key={`${assignment.assignmentId}-${assignment.employee?.id}`}
        assignment={assignment}
        isSelected={selectedEmployeeId === assignment.employee?.id}
        onClick={onSelectAssignment}
      />
    ));
  }, [assignments, listLoading, listError, selectedEmployeeId, onSelectAssignment]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700">Employees with a computer</h3>

      <AssignmentFilters
        searchInput={searchInput}
        onSearchInputChange={onSearchInputChange}
        officeFilter={officeFilter}
        onOfficeFilterChange={onOfficeFilterChange}
        onSearchSubmit={onSearchSubmit}
        onClearFilters={onClearFilters}
        officeOptions={officeOptions}
        hasActiveFilters={hasActiveFilters}
      />

      <div
        className="mt-4 space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: "360px" }}
      >
        {assignmentItems}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <button
          type="button"
          onClick={onPrevPage}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page === 0 || totalPages <= 1}
        >
          Prev
        </button>
        <span>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
        </span>
        <button
          type="button"
          onClick={onNextPage}
          className="rounded-full border border-gray-300 bg-white px-3 py-1 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="mt-4 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
        disabled={listLoading}
      >
        {listLoading ? "Refreshing..." : "Refresh list"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
      >
        Back
      </button>
    </div>
  );
};

export default AssignmentList;