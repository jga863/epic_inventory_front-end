import React from 'react';
import AssignmentList from './AssignmentList';
import AssignmentDetail from './AssignmentDetail';
import useAssignmentManagement from '../hooks/useAssignmentManagement';

const UpdateAssignmentPanel = ({ onBack, onSuccess }) => {
  const {
    // List state
    assignments,
    listLoading,
    listError,
    page,
    totalPages,
    searchInput,
    officeFilter,
    officeOptions,

    // Detail state
    summaryEmployee,
    assignedComputer,
    assignmentInfo,
    detailLoading,
    detailError,
    unassigning,
    unassignError,

    // Handlers
    setSearchInput,
    handleSearchSubmit,
    handleClearSearch,
    handleOfficeFilterChange,
    handleSelectAssignment,
    handleUnassign,
    handlePrevPage,
    handleNextPage,
    handleRefresh,
  } = useAssignmentManagement(onSuccess);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-6xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Updated
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            Edit computer assignment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose an employee with a computer. Review the details and remove the assignment if needed.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <AssignmentList
            assignments={assignments}
            listLoading={listLoading}
            listError={listError}
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            officeFilter={officeFilter}
            onOfficeFilterChange={handleOfficeFilterChange}
            onSearchSubmit={handleSearchSubmit}
            onClearFilters={handleClearSearch}
            officeOptions={officeOptions}
            selectedEmployeeId={summaryEmployee?.id}
            onSelectAssignment={handleSelectAssignment}
            page={page}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onRefresh={handleRefresh}
            onBack={onBack}
          />

          <div className="lg:col-span-2">
            <AssignmentDetail
              summaryEmployee={summaryEmployee}
              assignedComputer={assignedComputer}
              assignmentInfo={assignmentInfo}
              detailLoading={detailLoading}
              detailError={detailError}
              unassigning={unassigning}
              unassignError={unassignError}
              onUnassign={handleUnassign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAssignmentPanel;
