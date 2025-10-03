import { useState, useEffect } from 'react';
import { listComputersPage, getComputerById, updateComputer } from '../services/computersApi';

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const serialPattern = /^[A-Za-z0-9-]+$/;

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

const useComputerUpdate = (onSuccess) => {
  const [computers, setComputers] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchComputers = async () => {
    setListLoading(true);
    setListError("");
    try {
      const response = await listComputersPage({ page: 0, size: 100, sort: "name,asc" });
      setComputers(response?.content || []);
    } catch (error) {
      console.error("Error loading computers", error);
      setListError(error.message || "We couldn't load computers. Try again in a few minutes.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handleSelect = async (computer) => {
    if (!computer?.id || saving) return;
    setSelectedId(computer.id);
    setFormLoading(true);
    setFormError("");
    setErrors({});
    try {
      const detail = await getComputerById(computer.id);
      setForm({
        model: detail?.model || "",
        name: detail?.name || "",
        serialNo: detail?.serialNo || "",
        office: detail?.office || "",
        division: detail?.division || "",
        ram: detail?.ram || "",
        processor: detail?.processor || "",
        os: detail?.os || "",
      });
    } catch (error) {
      console.error("Error loading computer detail", error);
      setFormError(error.message || "We couldn't load the computer information.");
    } finally {
      setFormLoading(false);
    }
  };

  const clearFieldError = (field) => {
    if (!errors[field]) return;
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
      return { form: "Select a computer first." };
    }
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
    if (saving) return;
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
      const updated = await updateComputer(selectedId, payload);
      setComputers((prev) =>
        prev.map((computer) =>
          computer.id === selectedId ? { ...computer, ...updated } : computer
        )
      );
      const normalized = {
        model: updated?.model || "",
        name: updated?.name || "",
        serialNo: updated?.serialNo || "",
        office: updated?.office || "",
        division: updated?.division || "",
        ram: updated?.ram || "",
        processor: updated?.processor || "",
        os: updated?.os || "",
      };
      setForm(normalized);
      setErrors({});
      setFormError("");
      onSuccess?.({ type: "computer", record: updated });
    } catch (error) {
      console.error("Error updating computer", error);
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
          error.message || "We couldn't update the computer. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    // List state
    computers,
    listLoading,
    listError,

    // Form state
    selectedId,
    form,
    formLoading,
    errors,
    formError,
    saving,

    // Options
    officeOptions,

    // Handlers
    fetchComputers,
    handleSelect,
    handleChange,
    handleSubmit,
  };
};

export default useComputerUpdate;