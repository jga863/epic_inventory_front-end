import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import { listAllComputers } from "../../services/api/computersApi";
import {
  createBatteryBackup,
  deleteBatteryBackup,
  getBatteryBackupById,
  listBatteryBackupsPage,
  updateBatteryBackup,
} from "../../services/api/batteryBackupsApi";

const statusOptions = ["Installed", "Available", "Needs Replacement", "Retired"];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);

export const batteryBackupConfig = {
  entityKey: "battery-backups",
  labels: {
    singular: "Battery Backup",
    plural: "Battery Backup",
  },
  description:
    "Track UPS units, linked computers and the employee who currently owns each protected workstation.",
  api: {
    listPaged: listBatteryBackupsPage,
    getById: getBatteryBackupById,
    create: createBatteryBackup,
    update: updateBatteryBackup,
    remove: deleteBatteryBackup,
  },
  columns: [
    { key: "brand", header: "Brand", type: "emphasis" },
    { key: "model", header: "Model", type: "text" },
    { key: "capacity", header: "Capacity", type: "fallback", fallback: "N/A" },
    { key: "office", header: "Office", type: "text" },
    {
      key: "associatedComputerName",
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
      name: "associatedComputerId",
      label: "Computer",
      type: "asyncSelect",
      searchable: true,
      placeholder: "All computers",
      searchPlaceholder: "Search computers",
      emptyLabel: "No computers found",
      loader: listAllComputers,
      mapOption: (computer) => ({
        value: String(computer.id),
        label: `${computer.name}${computer.serialNo ? ` - ${computer.serialNo}` : ""}`,
      }),
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
          label: "Brand / Model",
          type: "text",
          accessor: (record) => `${record.brand} ${record.model}`.trim(),
        },
        { key: "serial", label: "Serial", type: "text" },
        { key: "capacity", label: "Capacity", type: "fallback", fallback: "Not provided" },
        { key: "status", label: "Status", type: "badge" },
        { key: "office", label: "Office", type: "text" },
      ],
    },
    {
      title: "Assignment",
      fields: [
        {
          key: "associatedComputerName",
          label: "Assigned computer",
          type: "fallback",
          fallback: "Unassigned",
        },
        {
          key: "associatedEmployeeName",
          label: "Computer owner",
          type: "fallback",
          fallback: "No employee linked",
        },
      ],
    },
    {
      title: "Lifecycle",
      fields: [
        { key: "installationDate", label: "Installation date", type: "date" },
        { key: "replacementDate", label: "Replacement date", type: "date" },
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
      name: "serial",
      label: "Serial",
      type: "text",
      required: true,
      validation: requiredText("Serial"),
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "text",
      validation: z.string().optional().nullable(),
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
      name: "associatedComputerId",
      label: "Associated computer",
      type: "asyncSelect",
      span: "full",
      searchable: true,
      placeholder: "No associated computer",
      searchPlaceholder: "Search computers",
      emptyLabel: "No computers found",
      loader: listAllComputers,
      mapOption: (computer) => ({
        value: String(computer.id),
        label: `${computer.name}${computer.serialNo ? ` - ${computer.serialNo}` : ""}`,
      }),
      visibleWhen: (_, context) => context.permissions?.canAssign,
      validation: z.string().optional().nullable(),
    },
    {
      name: "installationDate",
      label: "Installation date",
      type: "date",
      validation: z.string().optional().nullable(),
    },
    {
      name: "replacementDate",
      label: "Replacement date",
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
    Installed: "primary",
    Available: "success",
    "Needs Replacement": "warning",
    Retired: "danger",
  },
  defaultImage: getDefaultImage("battery-backups"),
  cardLayout: {
    titleField: "brand",
    subtitleField: "model",
    metaFields: [
      { key: "capacity", label: "Capacity", accessor: (record) => record.capacity || "N/A" },
      { key: "office", label: "Office" },
      {
        key: "associatedComputerName",
        label: "Computer",
        accessor: (record) => record.associatedComputerName || "Unassigned",
      },
    ],
  },
  permissionsModule: MODULES.BATTERY_BACKUPS,
  transformPayload: (values, { permissions } = {}) => {
    const payload = {
      brand: values.brand?.trim() || "",
      model: values.model?.trim() || "",
      serial: values.serial?.trim() || "",
      capacity: values.capacity?.trim() || null,
      office: values.office?.trim() || "",
      status: values.status || "Installed",
      installationDate: values.installationDate || null,
      replacementDate: values.replacementDate || null,
      notes: values.notes?.trim() || null,
    };
    if (permissions?.canAssign) {
      payload.associatedComputerId = values.associatedComputerId ? Number(values.associatedComputerId) : null;
    }
    return payload;
  },
};
