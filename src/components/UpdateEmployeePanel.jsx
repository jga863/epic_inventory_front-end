import React, { useEffect, useMemo, useState } from "react";
import {
  listEmployeesPage,
  getEmployeeById,
  updateEmployee,
} from "../services/employeeApi";

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const statusOptions = ["Active", "Inactive"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const extensionPattern = /^[0-9\s-]+$/;
const cellPhonePattern = /^[0-9()\s-]+$/;

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  office: "",
  department: "",
  status: "Active",
  extension: "",
  cellPhone: "",
};

const UpdateEmployeePanel = ({ onBack, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    setListLoading(true);
    setListError("");
    try {
      const response = await listEmployeesPage({ page: 0, size: 100, sort: "firstName,asc" });
      setEmployees(response?.content || []);
    } catch (error) {
      console.error("Error loading employees", error);
      setListError(error.message || "We couldn't load employees. Try again in a few minutes.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSelect = async (employee) => {
    if (!employee?.id || saving) {
      return;
    }
    setSelectedId(employee.id);
    setFormLoading(true);
    setFormError("");
    setErrors({});
    try {
      const detail = await getEmployeeById(employee.id);
      setForm({
        firstName: detail?.firstName || "",
        lastName: detail?.lastName || "",
        email: detail?.email || "",
        office: detail?.office || "",
        department: detail?.department || "",
        status: detail?.status || "Active",
        extension: detail?.extension || "",
        cellPhone: detail?.cellPhone || "",
      });
    } catch (error) {
      console.error("Error loading employee detail", error);
      setFormError(error.message || "We couldn't load the employee information.");
    } finally {
      setFormLoading(false);
    }
  };

  const clearFieldError = (field) => {
    if (!errors[field]) {
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const validate = () => {
    if (!selectedId) {
      return { form: "Select an employee first." };
    }
    const validationErrors = {};
    if (!form.firstName.trim()) {
      validationErrors.firstName = "Please enter the first name.";
    }
    if (!form.lastName.trim()) {
      validationErrors.lastName = "Please enter the last name.";
    }
    if (!form.email.trim()) {
      validationErrors.email = "Please enter the email address.";
    } else if (!emailPattern.test(form.email.trim())) {
      validationErrors.email = "Enter a valid email.";
    }
    if (!form.office.trim()) {
      validationErrors.office = "Select an office.";
    }
    if (!form.department.trim()) {
      validationErrors.department = "Enter a department.";
    }
    if (form.extension.trim() && !extensionPattern.test(form.extension.trim())) {
      validationErrors.extension = "Use only numbers, spaces, or dashes.";
    }
    if (form.cellPhone.trim() && !cellPhonePattern.test(form.cellPhone.trim())) {
      validationErrors.cellPhone = "Use only numbers, spaces, parentheses, or dashes.";
    }
    return validationErrors;
  };

  const sanitizePayload = () => {
    const trimmed = Object.entries(form).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value.trim() : value;
      return acc;
    }, {});
    return {
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      email: trimmed.email,
      office: trimmed.office,
      department: trimmed.department,
      status: trimmed.status || "Active",
      extension: trimmed.extension || undefined,
      cellPhone: trimmed.cellPhone || undefined,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormError(validationErrors.form || "");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const payload = sanitizePayload();
      const updated = await updateEmployee(selectedId, payload);
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === selectedId ? { ...employee, ...updated } : employee
        )
      );
      const normalized = {
        firstName: updated?.firstName || "",
        lastName: updated?.lastName || "",
        email: updated?.email || "",
        office: updated?.office || "",
        department: updated?.department || "",
        status: updated?.status || "Active",
        extension: updated?.extension || "",
        cellPhone: updated?.cellPhone || "",
      };
      setForm(normalized);
      setErrors({});
      setFormError("");
      onSuccess?.({ type: "employee", record: updated });
    } catch (error) {
      console.error("Error updating employee", error);
      if (error.code === "VALIDATION_ERROR" && error.details) {
        const backendErrors = {};
        Object.entries(error.details).forEach(([field, message]) => {
          backendErrors[field] = Array.isArray(message)
            ? message.join(" ")
            : message;
        });
        setErrors(backendErrors);
      } else {
        setFormError(
          error.message || "We couldn't update the employee. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

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
          onClick={() => handleSelect(employee)}
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
  }, [employees, listLoading, listError, selectedId]);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Updated
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Select an employee to edit</h2>
          <p className="mt-1 text-sm text-gray-500">Choose a record from the list and adjust the information on the right.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Employees</h3>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "360px" }}>
              {listContent}
            </div>
            <button
              type="button"
              onClick={fetchEmployees}
              className="mt-4 w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
              disabled={listLoading}
            >
              {listLoading ? "Refreshing..." : "Refresh list"}
            </button>
          </div>

          <div className="lg:col-span-2">
            <form
              className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-6"
              onSubmit={handleSubmit}
            >
              <h3 className="text-sm font-semibold text-gray-700">Edit information</h3>
              {formLoading ? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
                  Loading employee information...
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      First name*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      disabled={!selectedId || saving}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Last name*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      disabled={!selectedId || saving}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Email*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.email}
                      onChange={handleChange("email")}
                      disabled={!selectedId || saving}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Office*
                    </label>
                    <select
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.office}
                      onChange={handleChange("office")}
                      disabled={!selectedId || saving}
                    >
                      <option value="">Select an office</option>
                      {officeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.office && (
                      <p className="mt-1 text-xs text-red-600">{errors.office}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Department*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.department}
                      onChange={handleChange("department")}
                      disabled={!selectedId || saving}
                    />
                    {errors.department && (
                      <p className="mt-1 text-xs text-red-600">{errors.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Status
                    </label>
                    <select
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.status}
                      onChange={handleChange("status")}
                      disabled={!selectedId || saving}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Extension
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.extension}
                      onChange={handleChange("extension")}
                      disabled={!selectedId || saving}
                    />
                    {errors.extension && (
                      <p className="mt-1 text-xs text-red-600">{errors.extension}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Phone
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.cellPhone}
                      onChange={handleChange("cellPhone")}
                      disabled={!selectedId || saving}
                    />
                    {errors.cellPhone && (
                      <p className="mt-1 text-xs text-red-600">{errors.cellPhone}</p>
                    )}
                  </div>
                </div>
              )}

              {formError && (
                <p className="mt-4 text-sm text-red-600">{formError}</p>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                  disabled={saving}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!selectedId || saving || formLoading}
                  className="rounded-full bg-yellow-400 px-6 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployeePanel;


