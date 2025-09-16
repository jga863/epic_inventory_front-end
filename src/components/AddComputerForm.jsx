import React, { useEffect, useState } from "react";
import { createComputer } from "../services/computersApi";

const initialFormState = {
  model: "",
  name: "",
  serialNo: "",
  office: "",
  division: "",
  ram: "",
  processor: "",
  os: "",
};

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const serialPattern = /^[A-Za-z0-9-]+$/;

const AddComputerForm = ({ isOpen, onClose, onSuccess }) => {
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

    if (!form.model.trim()) {
      validationErrors.model = "Enter the model.";
    }
    if (!form.name.trim()) {
      validationErrors.name = "Enter the computer name.";
    }
    const serialValue = form.serialNo.trim();
    if (!serialValue) {
      validationErrors.serialNo = "Enter the serial number.";
    } else if (!serialPattern.test(serialValue)) {
      validationErrors.serialNo = "Use only letters, numbers, or dashes.";
    }
    if (!form.office.trim()) {
      validationErrors.office = "Select an office.";
    }

    return validationErrors;
  };

  const sanitizePayload = () => {
    const trimmed = Object.entries(form).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value.trim() : value;
      return acc;
    }, {});

    return {
      model: trimmed.model,
      name: trimmed.name,
      serialNo: trimmed.serialNo.toUpperCase(),
      office: trimmed.office,
      division: trimmed.division || undefined,
      ram: trimmed.ram || undefined,
      processor: trimmed.processor || undefined,
      os: trimmed.os || undefined,
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
      const created = await createComputer(sanitizePayload());
      setForm(initialFormState);
      setErrors({});
      setFormError("");
      onSuccess?.(created);
    } catch (error) {
      console.error("Error creating computer", error);
      if (error.code === "VALIDATION_ERROR" && error.details) {
        const backendErrors = {};
        Object.entries(error.details).forEach(([field, message]) => {
          backendErrors[field] = Array.isArray(message)
            ? message.join(" ")
            : message;
        });
        setErrors(backendErrors);
      } else if (
        error.code === "SERIAL_ALREADY_EXISTS" ||
        error.code === "DATA_INTEGRITY_ERROR"
      ) {
        setErrors((prev) => ({
          ...prev,
          serialNo: "This serial number is already registered.",
        }));
      } else if (
        error.code === "INTERNAL_ERROR" ||
        (typeof error.status === "number" && error.status >= 500)
      ) {
        setFormError("We couldn't create the computer. Try again in a few minutes.");
      } else {
        setFormError(error.message || "We couldn't create the computer. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const submitLabel = isSubmitting ? "Saving..." : "Add computer";

  return (
    <section className="px-8 pb-12 text-gray-800 mt-6">
      <div className="mx-auto w-full max-w-4xl">
        <header className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add computer</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete the information to register a new computer.
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
              <label className="block text-sm font-medium text-gray-700" htmlFor="model">
                Model*
              </label>
              <input
                id="model"
                name="model"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.model}
                onChange={handleChange("model")}
                disabled={isSubmitting}
              />
              {errors.model && (
                <p className="mt-1 text-xs text-red-600">{errors.model}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Name*
              </label>
              <input
                id="name"
                name="name"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.name}
                onChange={handleChange("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="serialNo">
                Serial number*
              </label>
              <input
                id="serialNo"
                name="serialNo"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm uppercase focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.serialNo}
                onChange={handleChange("serialNo")}
                disabled={isSubmitting}
              />
              {errors.serialNo && (
                <p className="mt-1 text-xs text-red-600">{errors.serialNo}</p>
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
              <label className="block text-sm font-medium text-gray-700" htmlFor="division">
                Division
              </label>
              <input
                id="division"
                name="division"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.division}
                onChange={handleChange("division")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="ram">
                RAM
              </label>
              <input
                id="ram"
                name="ram"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.ram}
                onChange={handleChange("ram")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="processor">
                Processor
              </label>
              <input
                id="processor"
                name="processor"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.processor}
                onChange={handleChange("processor")}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="os">
                Operating system
              </label>
              <input
                id="os"
                name="os"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={form.os}
                onChange={handleChange("os")}
                disabled={isSubmitting}
              />
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

export default AddComputerForm;
