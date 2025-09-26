import React, { useMemo } from 'react';

const EmployeeList = ({
  employees,
  listLoading,
  listError,
  selectedId,
  onSelectEmployee,
  onRefresh,
  onBack
}) => {
  const listContent = useMemo(() => {
    if (listLoading) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading employees...
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
    if (!employees.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No employees available.
        </div>
      );
    }
    return employees.map((employee) => {
      const isSelected = selectedId === employee.id;
      return (
        <button
          key={employee.id}
          type="button"
          onClick={() => onSelectEmployee(employee)}
          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
            isSelected
              ? "border-yellow-500 bg-yellow-50"
              : "border-white bg-white hover:border-gray-200"
          }`}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-yellow-500">
            ID: {employee.id}
          </div>
          <div className="text-sm font-semibold text-gray-800">
            {employee.fullName || `${employee.firstName} ${employee.lastName}`}
          </div>
          <div className="text-xs text-gray-500">{employee.email}</div>
        </button>
      );
    });
  }, [employees, listLoading, listError, selectedId, onSelectEmployee]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700">Employees</h3>
      <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "360px" }}>
        {listContent}
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

export default EmployeeList;