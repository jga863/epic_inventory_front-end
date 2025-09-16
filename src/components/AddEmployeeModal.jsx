import React, { useEffect, useState } from "react";
import { createEmployee } from "../services/employeeApi";

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const extensionPattern = /^[0-9\s-]+$/;
const cellPhonePattern = /^[0-9()\s-]+$/;

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const statusOptions = ["Active", "Inactive"];

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState);
      setErrors({});
      setFormError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
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
      status: trimmed.status || undefined,
      extension: trimmed.extension || undefined,
      cellPhone: trimmed.cellPhone || undefined,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const created = await createEmployee(sanitizePayload());
      onSuccess?.(created);
    } catch (error) {
      console.error("Error creating employee", error);
      if (error.code === "VALIDATION_ERROR" && error.details) {
        const backendErrors = {};
        Object.entries(error.details).forEach(([field, message]) => {
          backendErrors[field] = Array.isArray(message)
            ? message.join(" ")
            : message;
        });
        setErrors(backendErrors);
      } else if (error.code === "EMAIL_ALREADY_EXISTS") {
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
      } else if (
        error.code === "DATA_INTEGRITY_ERROR" ||
        error.code === "INTERNAL_ERROR" ||
        (typeof error.status === "number" && error.status >= 500)
      ) {
        setFormError("We couldn?t create the employee. Try again in a few minutes.");
      } else {
        setFormError(error.message || "We couldn?t create the employee. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const submitLabel = isSubmitting ? "Saving..." : "Add employee";

  return (
    <section className="px-8 pb-12 text-gray-800">
      <div className="mx-auto w-full max-w-4xl mt-6">
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add employee</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete the information to add a new team member.
          </p>
        </header>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                First name*
              </label>
              <input
                id="firstName"
                name="firstName"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.firstName}
                onChange={handleChange("firstName")}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                Last name*
              </label>
              <input
                id="lastName"
                name="lastName"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.lastName}
                onChange={handleChange("lastName")}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.email}
                onChange={handleChange("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="office">
                Office*
              </label>
              <select
                id="office"
                name="office"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.office}
                onChange={handleChange("office")}
                disabled={isSubmitting}
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
              <label className="block text-sm font-medium text-gray-700" htmlFor="department">
                Department*
              </label>
              <input
                id="department"
                name="department"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.department}
                onChange={handleChange("department")}
                disabled={isSubmitting}
              />
              {errors.department && (
                <p className="mt-1 text-xs text-red-600">{errors.department}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.status}
                onChange={handleChange("status")}
                disabled={isSubmitting}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="extension">
                Extension
              </label>
              <input
                id="extension"
                name="extension"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.extension}
                onChange={handleChange("extension")}
                disabled={isSubmitting}
              />
              {errors.extension && (
                <p className="mt-1 text-xs text-red-600">{errors.extension}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="cellPhone">
                Phone
              </label>
              <input
                id="cellPhone"
                name="cellPhone"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.cellPhone}
                onChange={handleChange("cellPhone")}
                disabled={isSubmitting}
              />
              {errors.cellPhone && (
                <p className="mt-1 text-xs text-red-600">{errors.cellPhone}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-yellow-400 px-5 py-2 text-sm font-semibold text-yellow-900 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddEmployeeModal;

