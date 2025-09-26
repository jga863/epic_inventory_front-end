import React from 'react';

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const AssignmentDetail = ({
  summaryEmployee,
  assignedComputer,
  assignmentInfo,
  detailLoading,
  detailError,
  unassigning,
  unassignError,
  onUnassign
}) => {
  if (detailLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6">
        <h3 className="text-sm font-semibold text-gray-700">Assignment details</h3>
        <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading assignment information...
        </div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6">
        <h3 className="text-sm font-semibold text-gray-700">Assignment details</h3>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
          {detailError}
        </div>
      </div>
    );
  }

  if (!summaryEmployee) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6">
        <h3 className="text-sm font-semibold text-gray-700">Assignment details</h3>
        <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Select an employee from the list to review the assignment.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6">
      <h3 className="text-sm font-semibold text-gray-700">Assignment details</h3>
      <div className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Computer
            </span>
            {assignedComputer ? (
              <>
                <h4 className="mt-3 text-base font-semibold text-gray-800">
                  {assignedComputer.name || "Unnamed computer"}
                </h4>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
                  ID: {assignedComputer.id}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-500">
                  {assignedComputer.serialNo && (
                    <li>Serial: {assignedComputer.serialNo}</li>
                  )}
                  {assignedComputer.model && (
                    <li>Model: {assignedComputer.model}</li>
                  )}
                  {assignedComputer.processor && (
                    <li>CPU: {assignedComputer.processor}</li>
                  )}
                  {assignedComputer.ram && <li>RAM: {assignedComputer.ram}</li>}
                  {assignedComputer.os && <li>OS: {assignedComputer.os}</li>}
                  {assignedComputer.office && (
                    <li>Office: {assignedComputer.office}</li>
                  )}
                  {assignedComputer.division && (
                    <li>Division: {assignedComputer.division}</li>
                  )}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                This employee does not have a computer assigned.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-white bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Employee
            </span>
            <h4 className="mt-3 text-base font-semibold text-gray-800">
              {summaryEmployee.fullName ||
                `${summaryEmployee.firstName || ""} ${
                  summaryEmployee.lastName || ""
                }`.trim() ||
                "Unnamed employee"}
            </h4>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-yellow-500">
              ID: {summaryEmployee.id}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-gray-500">
              {summaryEmployee.email && <li>{summaryEmployee.email}</li>}
              {summaryEmployee.office && <li>Office: {summaryEmployee.office}</li>}
              {summaryEmployee.department && (
                <li>Department: {summaryEmployee.department}</li>
              )}
              {summaryEmployee.status && <li>Status: {summaryEmployee.status}</li>}
              {summaryEmployee.cellPhone && (
                <li>Cell: {summaryEmployee.cellPhone}</li>
              )}
              {summaryEmployee.extension && (
                <li>Extension: {summaryEmployee.extension}</li>
              )}
            </ul>
          </div>
        </div>
        {assignmentInfo?.assignedAt && (
          <div className="rounded-xl border border-white bg-white px-5 py-3 text-xs text-gray-500 shadow-sm">
            Assigned on {formatDate(assignmentInfo.assignedAt)}
          </div>
        )}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center justify-center">
          <button
            type="button"
            onClick={onUnassign}
            className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-700 font-medium
                      transition hover:bg-gray-100 hover:text-yellow-500
                      disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={unassigning || !assignedComputer}
          >
            {unassigning ? "Removing..." : "Unassign computer"}
          </button>
          {unassignError && (
            <p className="text-xs text-red-600">{unassignError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;