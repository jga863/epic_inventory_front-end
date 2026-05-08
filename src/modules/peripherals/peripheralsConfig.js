import { createElement } from "react";
import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import { listAllComputers } from "../../services/api/computersApi";
import { listAllEmployees } from "../../services/api/employeesApi";
import {
  createPeripheral,
  deletePeripheral,
  getPeripheralById,
  listPeripheralTypes,
  listPeripheralsPage,
  updatePeripheral,
} from "../../services/api/peripheralsApi";

const statusOptions = ["Available", "Assigned", "In Storage", "Retired"];
const typeOptions = ["Keyboard", "Mouse", "Dock", "Headset", "Adapter", "Other"];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);
const loadPeripheralTypeOptions = async () => Array.from(new Set([...typeOptions, ...(await listPeripheralTypes().catch(() => []))]));

export const peripheralsConfig = {
  entityKey: "peripherals",
  labels: {
    singular: "Peripheral",
    plural: "Peripherals",
  },
  description:
    "Manage keyboards, docks and other peripherals with assignment visibility.",
  api: {
    listPaged: listPeripheralsPage,
    getById: getPeripheralById,
    create: createPeripheral,
    update: updatePeripheral,
    remove: deletePeripheral,
  },
  columns: [
    { key: "type", header: "Type", type: "emphasis" },
    {
      key: "brandModel",
      header: "Brand",
      type: "text",
      accessor: (record) => `${record.brand} ${record.model}`.trim(),
    },
    { key: "office", header: "Office", type: "text" },
    { key: "quantity", header: "Quantity", type: "number" },
    {
      key: "assignment",
      header: "Assigned to",
      type: "fallback",
      accessor: (record) => record.assignedEmployeeName || record.assignedComputerName,
      fallback: "Unassigned",
    },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search brand, model or assignment",
    },
    {
      name: "office",
      label: "Office",
      type: "text",
      placeholder: "Office",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "All statuses",
      options: statusOptions,
    },
    {
      name: "type",
      label: "Type",
      type: "asyncSelect",
      placeholder: "All types",
      searchPlaceholder: "Search types",
      emptyLabel: "No types found",
      loader: loadPeripheralTypeOptions,
      mapOption: (type) => ({ value: type, label: type }),
    },
    {
      name: "available",
      label: "Unassigned only",
      type: "boolean",
    },
  ],
  detailSections: [
    {
      title: "Overview",
      fields: [
        { key: "type", label: "Type", type: "text" },
        {
          key: "brandModel",
          label: "Brand / Model",
          type: "text",
          accessor: (record) => `${record.brand} ${record.model}`.trim(),
        },
        { key: "serial", label: "Serial", type: "text" },
        { key: "status", label: "Status", type: "badge" },
        { key: "office", label: "Office", type: "text" },
      ],
    },
    {
      title: "Assignment",
      fields: [
        { key: "quantity", label: "Quantity", type: "number" },
        {
          key: "assignment",
          label: "Assigned to",
          type: "fallback",
          accessor: (record) => record.assignedEmployeeName || record.assignedComputerName,
          fallback: "Unassigned",
        },
        {
          key: "assignmentType",
          label: "Assignment type",
          type: "fallback",
          accessor: (record) => {
            if (record.assignedEmployeeName) return "Employee";
            if (record.assignedComputerName) return "Computer";
            return "";
          },
          fallback: "Unassigned",
        },
      ],
    },
    {
      title: "Notes",
      fields: [
        { key: "notes", label: "Notes", type: "longtext" },
      ],
    },
  ],
  formFields: [
    {
      name: "type",
      label: "Type",
      type: "asyncSelect",
      searchable: true,
      searchPlaceholder: "Search types",
      emptyLabel: "No types found",
      loader: loadPeripheralTypeOptions,
      mapOption: (type) => ({ value: type, label: type }),
      required: true,
      validation: requiredText("Type"),
    },
    {
      name: "brand",
      label: "Brand",
      type: "text",
      required: true,
      validation: requiredText("Brand"),
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      required: true,
      validation: requiredText("Model"),
    },
    {
      name: "serial",
      label: "Serial",
      type: "text",
      required: true,
      validation: requiredText("Serial"),
    },
    {
      name: "office",
      label: "Office",
      type: "text",
      required: true,
      validation: requiredText("Office"),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
      required: true,
      validation: z.enum(statusOptions, {
        errorMap: () => ({ message: "Status is required." }),
      }),
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      required: true,
      validation: z.coerce.number().int().min(1, "Quantity must be at least 1."),
    },
    {
      name: "assignmentMode",
      label: "Assignment mode",
      type: "select",
      options: [
        { value: "none", label: "Unassigned" },
        { value: "employee", label: "Assign to employee" },
        { value: "computer", label: "Assign to computer" },
      ],
      validation: z.enum(["none", "employee", "computer"]).optional(),
    },
    {
      name: "assignedEmployeeId",
      label: "Employee",
      type: "asyncSelect",
      span: "full",
      searchable: true,
      placeholder: "Select employee",
      searchPlaceholder: "Search employees",
      emptyLabel: "No employees found",
      loader: listAllEmployees,
      mapOption: (employee) => ({
        value: String(employee.id),
        label: employee.fullName || `${employee.firstName} ${employee.lastName}`.trim(),
      }),
      visibleWhen: (values) => values.assignmentMode === "employee",
      validation: z.string().optional().nullable(),
    },
    {
      name: "assignedComputerId",
      label: "Computer",
      type: "asyncSelect",
      span: "full",
      searchable: true,
      placeholder: "Select computer",
      searchPlaceholder: "Search computers",
      emptyLabel: "No computers found",
      loader: listAllComputers,
      mapOption: (computer) => ({
        value: String(computer.id),
        label: `${computer.name}${computer.serialNo ? ` - ${computer.serialNo}` : ""}`,
      }),
      visibleWhen: (values) => values.assignmentMode === "computer",
      validation: z.string().optional().nullable(),
    },
    {
      name: "assignmentHint",
      type: "custom",
      span: "full",
      visibleWhen: (values) => values.assignmentMode === "none",
      renderField: () => createElement(
        "div",
        { className: "app-empty-state app-empty-state--compact" },
        createElement(
          "p",
          { className: "app-empty-state-description" },
          "No assignment target selected."
        )
      ),
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      span: "full",
      validation: z.string().optional().nullable(),
    },
    {
      name: "image",
      label: "Photo",
      type: "image",
      span: "full",
    },
  ],
  statusField: "status",
  statusVariants: {
    Available: "success",
    Assigned: "primary",
    "In Storage": "warning",
    Retired: "danger",
  },
  defaultImage: getDefaultImage("peripherals"),
  cardLayout: {
    titleField: "type",
    subtitleField: "brand",
    metaFields: [
      { key: "model", label: "Model" },
      { key: "quantity", label: "Quantity", accessor: (record) => String(record.quantity ?? 0) },
      {
        key: "assignment",
        label: "Assigned to",
        accessor: (record) => record.assignedEmployeeName || record.assignedComputerName || "Unassigned",
      },
    ],
  },
  permissionsModule: MODULES.PERIPHERALS,
  transformPayload: (values) => ({
    type: values.type || "Keyboard",
    brand: values.brand?.trim() || "",
    model: values.model?.trim() || "",
    serial: values.serial?.trim() || "",
    office: values.office?.trim() || "",
    status: values.status || "Available",
    assignedEmployeeId: values.assignmentMode === "employee" && values.assignedEmployeeId ? Number(values.assignedEmployeeId) : null,
    assignedComputerId: values.assignmentMode === "computer" && values.assignedComputerId ? Number(values.assignedComputerId) : null,
    quantity: Number(values.quantity || 1),
    notes: values.notes?.trim() || null,
  }),
};
