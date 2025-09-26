import { useState, useEffect } from 'react';
import { createComputer } from '../services/computersApi';

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

const useComputerForm = (isOpen, onClose, onSuccess) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm(initialFormState);
      setErrors({});
      setFormError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return undefined;

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
      if (!prev[field]) return prev;
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
    if (isSubmitting) return;

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

  return {
    form,
    errors,
    formError,
    isSubmitting,
    handleChange,
    handleSubmit,
    officeOptions,
  };
};

export default useComputerForm;