import React, { useEffect, useMemo, useState } from "react";
import {
  listComputersPage,
  getComputerById,
  updateComputer,
} from "../services/computersApi";

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

const UpdateComputerPanel = ({ onBack, onSuccess }) => {
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
    if (!computer?.id || saving) {
      return;
    }
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

  const listContent = useMemo(() => {
    if (listLoading) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Loading computers...
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
    if (!computers.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No computers available.
        </div>
      );
    }
    return computers.map((computer) => {
      const isSelected = selectedId === computer.id;
      return (
        <button
          key={computer.id}
          type="button"
          onClick={() => handleSelect(computer)}
          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
            isSelected
              ? "border-yellow-500 bg-yellow-50"
              : "border-white bg-white hover:border-gray-200"
          }`}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-yellow-500">
            ID: {computer.id}
          </div>
          <div className="text-sm font-semibold text-gray-800">{computer.name}</div>
          <div className="text-xs text-gray-500">Serial: {computer.serialNo}</div>
        </button>
      );
    });
  }, [computers, listLoading, listError, selectedId]);

  return (
    <div className="flex h-full w-full items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="absolute -left-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-r-3xl border border-gray-200 bg-white lg:block" />
        <div className="absolute -right-6 top-1/2 hidden h-28 w-5 -translate-y-1/2 rounded-l-3xl border border-gray-200 bg-white lg:block" />

        <header className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-yellow-500">
            Updated
          </span>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Select a computer to edit</h2>
          <p className="mt-1 text-sm text-gray-500">Choose a record from the list and adjust the information on the right.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Computers</h3>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "360px" }}>
              {listContent}
            </div>
            <button
              type="button"
              onClick={fetchComputers}
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
                  Loading computer information...
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Model*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.model}
                      onChange={handleChange("model")}
                      disabled={!selectedId || saving}
                    />
                    {errors.model && (
                      <p className="mt-1 text-xs text-red-600">{errors.model}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Name*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.name}
                      onChange={handleChange("name")}
                      disabled={!selectedId || saving}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Serial number*
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 uppercase focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.serialNo}
                      onChange={handleChange("serialNo")}
                      disabled={!selectedId || saving}
                    />
                    {errors.serialNo && (
                      <p className="mt-1 text-xs text-red-600">{errors.serialNo}</p>
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
                      Division
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.division}
                      onChange={handleChange("division")}
                      disabled={!selectedId || saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      RAM
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.ram}
                      onChange={handleChange("ram")}
                      disabled={!selectedId || saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Processor
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.processor}
                      onChange={handleChange("processor")}
                      disabled={!selectedId || saving}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Operating system
                    </label>
                    <input
                      className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                      value={form.os}
                      onChange={handleChange("os")}
                      disabled={!selectedId || saving}
                    />
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

export default UpdateComputerPanel;


