import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import {
  createMonitor,
  deleteMonitor,
  getMonitorById,
  listMonitorsPage,
  updateMonitor,
} from "../../services/api/monitorsApi";
import { listAllComputers } from "../../services/api/computersApi";

const statusOptions = ["Available", "In Use", "Maintenance", "Retired"];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);

export const monitorsConfig = {
  entityKey: "monitors",
  labels: {
    singular: "Monitor",
    plural: "Monitors",
  },
  description:
    "Manage monitor inventory and connect monitors to specific computers for clear asset traceability.",
  api: {
    listPaged: listMonitorsPage,
    getById: getMonitorById,
    create: createMonitor,
    update: updateMonitor,
    remove: deleteMonitor,
  },
  columns: [
    { key: "brand", header: "Brand", type: "emphasis" },
    { key: "model", header: "Model", type: "text" },
    { key: "office", header: "Office", type: "text" },
    { key: "status", header: "Status", type: "badge" },
    {
      key: "assignedComputerName",
      header: "Computer",
      type: "fallback",
      fallback: "Unassigned",
    },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search brand, model, serial, computer or employee",
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
      name: "available",
      label: "Unassigned only",
      type: "boolean",
    },
  ],
  detailSections: [
    {
      title: "Overview",
      fields: [
        {
          key: "identity",
          label: "Identity",
          type: "text",
          accessor: (record) => `${record.brand} ${record.model}`.trim(),
        },
        { key: "serial", label: "Serial", type: "text" },
        { key: "size", label: "Size", type: "text" },
        { key: "office", label: "Office", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
    },
    {
      title: "Assignment",
      fields: [
        {
          key: "assignedComputerName",
          label: "Assigned computer",
          type: "fallback",
          fallback: "Unassigned",
        },
        {
          key: "assignedEmployeeName",
          label: "Computer owner",
          type: "fallback",
          fallback: "No employee linked",
        },
      ],
    },
    {
      title: "Lifecycle",
      fields: [
        { key: "purchaseDate", label: "Purchase date", type: "date" },
        { key: "notes", label: "Notes", type: "longtext" },
      ],
    },
  ],
  formFields: [
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
      name: "size",
      label: "Size",
      type: "text",
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
      required: true,
      options: statusOptions,
      validation: z.enum(statusOptions, {
        errorMap: () => ({ message: "Status is required." }),
      }),
    },
    {
      name: "assignedComputerId",
      label: "Assigned computer",
      type: "asyncSelect",
      span: "full",
      searchable: true,
      placeholder: "No assigned computer",
      searchPlaceholder: "Search computers",
      emptyLabel: "No computers found",
      loader: listAllComputers,
      mapOption: (computer) => ({
        value: String(computer.id),
        label: `${computer.name}${computer.serialNo ? ` - ${computer.serialNo}` : ""}`,
      }),
      validation: z.string().optional().nullable(),
    },
    {
      name: "purchaseDate",
      label: "Purchase date",
      type: "date",
      validation: z.string().optional().nullable(),
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
    "In Use": "primary",
    Maintenance: "warning",
    Retired: "danger",
  },
  defaultImage: getDefaultImage("monitors"),
  cardLayout: {
    titleField: "brand",
    subtitleField: "model",
    metaFields: [
      { key: "office", label: "Office" },
      { key: "serial", label: "Serial" },
      {
        key: "assignedComputerName",
        label: "Computer",
        accessor: (record) => record.assignedComputerName || "Unassigned",
      },
    ],
    gridClassName: "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]",
  },
  permissionsModule: MODULES.MONITORS,
  transformPayload: (values) => ({
    brand: values.brand?.trim() || "",
    model: values.model?.trim() || "",
    size: values.size?.trim() || null,
    serial: values.serial?.trim() || "",
    office: values.office?.trim() || "",
    status: values.status || "Available",
    assignedComputerId: values.assignedComputerId ? Number(values.assignedComputerId) : null,
    purchaseDate: values.purchaseDate || null,
    notes: values.notes?.trim() || null,
  }),
};
