import React, { useEffect, useMemo, useState } from "react";
import {
  listAssignments,
  getEmployeeAssignmentSummary,
  deleteEmployeeAssignment,
} from "../services/assignmentsApi";

const PAGE_SIZE = 12;
const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const UpdateAssignmentPanel = ({ onBack, onSuccess }) => {
  const [assignments, setAssignments] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [officeFilter, setOfficeFilter] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [unassigning, setUnassigning] = useState(false);
  const [unassignError, setUnassignError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      setListLoading(true);
      setListError("");
      try {
        const response = await listAssignments({
          page,
          size: PAGE_SIZE,
          search: searchTerm || undefined,
          office: officeFilter || undefined,
        });
        if (cancelled) {
          return;
        }
        setAssignments(response?.content || []);
        setTotalPages(response?.totalPages ?? 0);
      } catch (error) {
        console.error("Error loading assignments", error);
        if (cancelled) {
          return;
        }
        setAssignments([]);
        setTotalPages(0);
        setListError(
          error.message || "We couldn't load the assignments. Please try again."
        );
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [page, searchTerm, officeFilter, refreshToken]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setDetail(null);
      setDetailError("");
      setUnassignError("");
      return undefined;
    }

    let cancelled = false;
    setDetailLoading(true);
    setDetailError("");
    setUnassignError("");

    getEmployeeAssignmentSummary(selectedEmployeeId)
      .then((summary) => {
        if (cancelled) {
          return;
        }
        setDetail(summary);
      })
      .catch((error) => {
        console.error("Error loading assignment summary", error);
        if (cancelled) {
          return;
        }
        setDetail(null);
        setDetailError(
          error.message || "We couldn't load the assignment information."
        );
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedEmployeeId]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setOfficeFilter("");
    setPage(0);
  };

  const handleSelectAssignment = (assignment) => {
    if (!assignment?.employee?.id) {
      return;
    }
    const employeeId = assignment.employee.id;
    setSelectedEmployeeId(employeeId);
    setSelectedAssignment(assignment);
  };

  const handleUnassign = async () => {
    if (!selectedEmployeeId) {
      return;
    }
    setUnassigning(true);
    setUnassignError("");
    try {
      const summary = await deleteEmployeeAssignment(selectedEmployeeId);
      setDetail(summary);
      setSelectedEmployeeId(null);
      setSelectedAssignment(null);
      setRefreshToken(Date.now());
      setPage(0);
      onSuccess?.({ type: "assignment", summary });
    } catch (error) {
      console.error("Error removing assignment", error);
      setUnassignError(
        error.message || "We couldn't remove the assignment. Please try again."
      );
    } finally {
      setUnassigning(false);
    }
  };

  const assignmentList = useMemo(() => {
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
    return assignments.map((assignment) => {
      const employee = assignment.employee || {};
      const computer = assignment.computer || {};
      const isSelected = selectedEmployeeId === employee.id;
      return (
        <button
          key={`${assignment.assignmentId}-${employee.id}`}
          type="button"
          onClick={() => handleSelectAssignment(assignment)}
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
            {employee.fullName || employee.name || "Unnamed"}
          </div>
          {employee.email && (
            <div className="text-xs text-gray-500">{employee.email}</div>
          )}
          {computer && computer.name ? (
            <div className="mt-2 text-xs text-gray-400">
              Computer: {computer.name}
            </div>
          ) : null}
        </button>
      );
    });
  }, [assignments, listLoading, listError, selectedEmployeeId]);

  const summaryEmployee = detail?.employee || selectedAssignment?.employee || null;
  const assignedComputer = detail?.computer || selectedAssignment?.computer || null;
  const assignmentInfo = detail?.assignment || selectedAssignment?.assignment || null;

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
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Employees with a computer</h3>
            <form className="mt-3 space-y-3" onSubmit={handleSearchSubmit}>
              <input
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name, email, or serial"
              />
              <div className="flex items-center gap-2">
                <select
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  value={officeFilter}
                  onChange={(event) => {
                    setOfficeFilter(event.target.value);
                    setPage(0);
                  }}
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
              {(searchTerm || officeFilter) && (
                <button
                  type="button"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  onClick={handleClearSearch}
                >
                  Clear filters
                </button>
              )}
            </form>
            <div
              className="mt-4 space-y-3 overflow-y-auto pr-1"
              style={{ maxHeight: "360px" }}
            >
              {assignmentList}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 0));
                }}
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
                onClick={() => {
                  setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
                }}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={page + 1 >= totalPages}
              >
                Next
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRefreshToken(Date.now())}
              className="mt-4 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
              disabled={listLoading}
            >
              {listLoading ? "Refreshing..." : "Refresh list"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="mt-4 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
              disabled={unassigning}
            >
              Back
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6">
              <h3 className="text-sm font-semibold text-gray-700">Assignment details</h3>
              {detailLoading ? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  Loading assignment information...
                </div>
              ) : detailError ? (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
                  {detailError}
                </div>
              ) : !summaryEmployee ? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  Select an employee from the list to review the assignment.
                </div>
              ) : (
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
                      onClick={handleUnassign}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAssignmentPanel;
