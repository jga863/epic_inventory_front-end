import React, { useEffect, useMemo, useState } from "react";
import { fetchSyncStatus } from "../services/syncApi";
import { deleteEmployee } from "../services/employeeApi";

const initialSelection = {
  employee: null,
};

const DeleteEmployeePanel = ({ onBack, onSuccess }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selection, setSelection] = useState(initialSelection);

  const fetchStatus = async () => {
    setLoadingStatus(true);
    setStatusError("");
    try {
      const response = await fetchSyncStatus();
      setEmployees(response?.employeesWithoutComputer || []);
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
    setSelection({ employee });
    setSaveError("");
  };

  const handleDelete = async () => {
    if (!selection.employee || saving) {
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      await deleteEmployee(selection.employee.id);
      setEmployees((prev) => prev.filter((item) => item.id !== selection.employee.id));
      setSelection(initialSelection);
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting employee", error);
      if (error.code === "VALIDATION_ERROR" && error.details) {
        const combined = Object.values(error.details)
          .flat()
          .join(" ");
        setSaveError(combined || "Please review the selected employee.");
      } else if (error.code === "NOT_FOUND") {
        setSaveError("The selected employee was not found.");
        fetchStatus();
      } else if (
        error.code === "INTERNAL_ERROR" ||
        (typeof error.status === "number" && error.status >= 500)
      ) {
        setSaveError("We couldn't delete the employee. Try again in a few minutes.");
      } else {
        setSaveError(error.message || "Unable to delete employee. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const isSubmitDisabled = !selection.employee || saving;

  const employeesEmpty = employees.length === 0;

  const deleteLabel = useMemo(
    () => (saving ? "Deleting employee..." : "Delete employee"),
    [saving]
  );

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Delete Employee</h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose an employee from the list to delete.
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

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Employees without computer</h3>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "400px" }}>
              {employeesEmpty ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  No employees available for deletion.
                </div>
              ) : (
                employees.map((employee) => {
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

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Selection</h3>
              <div className="mt-4">
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">Selected employee</p>
                  {selection.employee ? (
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {selection.employee.fullName || `${selection.employee.firstName} ${selection.employee.lastName}`}
                      </div>
                      <div className="text-xs text-gray-500">ID: {selection.employee.id}</div>
                      <div className="text-xs text-gray-500">{selection.employee.email}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Choose an employee from the left column.</p>
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
                onClick={handleDelete}
                disabled={isSubmitDisabled}
                className="w-full rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-gray-600  transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLabel}
              </button>
              <button
                type="button"
                onClick={onBack}
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

export default DeleteEmployeePanel;