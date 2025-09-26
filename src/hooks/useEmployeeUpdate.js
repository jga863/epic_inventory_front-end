import { useState, useEffect } from 'react';
import { listEmployeesPage, getEmployeeById, updateEmployee } from '../services/employeesApi';

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

const useEmployeeUpdate = (onSuccess) => {
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
    if (!employee?.id || saving) return;
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

  return {
    // List state
    employees,
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
    statusOptions,

    // Handlers
    fetchEmployees,
    handleSelect,
    handleChange,
    handleSubmit,
  };
};

export default useEmployeeUpdate;