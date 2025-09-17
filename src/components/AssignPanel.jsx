import React, { useEffect, useMemo, useState } from "react";
import { fetchSyncStatus, createAssignment } from "../services/syncApi";

const initialSelection = {
  employee: null,
  computer: null,
};

const AssignPanel = ({ onClose, onAssignmentCreated }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lists, setLists] = useState({
    employees: [],
    computers: [],
  });
  const [selection, setSelection] = useState(initialSelection);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setStatusError("");
    try {
      const response = await fetchSyncStatus();
      setLists({
        employees: response?.employeesWithoutComputer || [],
        computers: response?.computersWithoutEmployee || [],
      });
    } catch (error) {
      console.error("Error fetching sync status", error);
      setStatusError(
        error.message || "We couldn't retrieve the current status. Try again shortly."
      );
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleEmployeeSelect = (employee) => {
    setSelection((prev) => ({ ...prev, employee }));
    setSaveError("");
  };

  const handleComputerSelect = (computer) => {
    setSelection((prev) => ({ ...prev, computer }));
    setSaveError("");
  };

  const handleAssignment = async () => {
    if (!selection.employee || !selection.computer || saving) {
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      const payload = {
        employeeId: selection.employee.id,
        computerId: selection.computer.id,
      };
      const result = await createAssignment(payload);
      setLists((prev) => ({
        employees: prev.employees.filter((item) => item.id !== payload.employeeId),
        computers: prev.computers.filter((item) => item.id !== payload.computerId),
      }));
      setSelection(initialSelection);
      onAssignmentCreated?.(result);
    } catch (error) {
      console.error("Error creating assignment", error);
      if (error.code === "VALIDATION_ERROR" && error.details) {
        const combined = Object.values(error.details)
          .flat()
          .join(" ");
        setSaveError(combined || "Please review the selected records.");
      } else if (error.code === "ALREADY_ASSIGNED") {
        setSaveError("One of the selected records is no longer available.");
        fetchStatus();
      } else if (
        error.code === "INTERNAL_ERROR" ||
        (typeof error.status === "number" && error.status >= 500)
      ) {
        setSaveError("We couldn't create the assignment. Try again in a few minutes.");
      } else {
        setSaveError(error.message || "Unable to create assignment. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isSubmitDisabled = !selection.employee || !selection.computer || saving;

  const employeesEmpty = lists.employees.length === 0;
  const computersEmpty = lists.computers.length === 0;

  const assignmentLabel = useMemo(
    () => (saving ? "Creating assignment..." : "Create assignment"),
    [saving]
  );

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Assign Computer to an Employee</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose one employee and one computer from the lists. Then confirm the assignment.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="rounded-full border border-yellow-400 px-6 py-2 text-sm font-semibold text-yellow-700 transition hover:-translate-y-0.5 hover:bg-yellow-50"
              onClick={fetchStatus}
              disabled={loadingStatus}
            >
              {loadingStatus ? "Syncing..." : "Sync"}
            </button>
          </div>
          {statusError && (
            <p className="mt-3 text-sm text-red-600">{statusError}</p>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Employee with no computer</h3>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "320px" }}>
              {employeesEmpty ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  No pending employees.
                </div>
              ) : (
                lists.employees.map((employee) => {
                  const isSelected = selection.employee?.id === employee.id;
                  return (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => handleEmployeeSelect(employee)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-white bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-500">ID: {employee.id}</div>
                      <div className="text-sm font-semibold text-gray-800">{employee.fullName || `${employee.firstName} ${employee.lastName}`}</div>
                      <div className="text-xs text-gray-500">{employee.email}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Computer with no employee</h3>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "320px" }}>
              {computersEmpty ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  No pending computers.
                </div>
              ) : (
                lists.computers.map((computer) => {
                  const isSelected = selection.computer?.id === computer.id;
                  return (
                    <button
                      key={computer.id}
                      type="button"
                      onClick={() => handleComputerSelect(computer)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-white bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="text-xs text-gray-500">ID: {computer.id}</div>
                      <div className="text-sm font-semibold text-gray-800">{computer.name}</div>
                      <div className="text-xs text-gray-500">Serial: {computer.serialNo}</div>
                      <div className="text-xs text-gray-500">Office: {computer.office}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Selection</h3>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">Selected employee</p>
                  {selection.employee ? (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {selection.employee.fullName || `${selection.employee.firstName} ${selection.employee.lastName}`}
                      </div>
                      <div className="text-xs text-gray-500">ID: {selection.employee.id}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Choose an employee from the left column.</p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">Selected computer</p>
                  {selection.computer ? (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{selection.computer.name}</div>
                      <div className="text-xs text-gray-500">Serial: {selection.computer.serialNo}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Choose a computer from the middle column.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {saveError && (
                <p className="text-sm text-red-600">{saveError}</p>
              )}
              <button
                type="button"
                onClick={handleAssignment}
                disabled={isSubmitDisabled}
                className="w-full rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assignmentLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignPanel;
