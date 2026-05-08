import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import {
  createSurvey,
  deleteSurvey,
  getSurveyById,
  listSurveysPage,
  updateSurvey,
} from "../../services/api/surveysApi";

const statusOptions = ["Available", "In Use", "In Calibration", "Maintenance", "Retired"];
const equipmentTypeOptions = [
  "Total Station",
  "GNSS Receiver",
  "Laser Scanner",
  "Auto Level",
  "Digital Level",
  "Tripod",
  "Data Collector",
  "Prism Pole",
];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);

export const surveysConfig = {
  entityKey: "surveys",
  labels: {
    singular: "Survey Equipment",
    plural: "Survey Equipment",
  },
  description:
    "Track field and survey equipment by office, calibration status and equipment type.",
  api: {
    listPaged: listSurveysPage,
    getById: getSurveyById,
    create: createSurvey,
    update: updateSurvey,
    remove: deleteSurvey,
  },
  columns: [
    { key: "equipmentType", header: "Type", type: "emphasis" },
    { key: "brand", header: "Brand", type: "text" },
    { key: "model", header: "Model", type: "text" },
    { key: "office", header: "Office", type: "text" },
    { key: "status", header: "Status", type: "badge" },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search type, brand, model or serial",
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
      name: "equipmentType",
      label: "Equipment type",
      type: "select",
      placeholder: "All equipment types",
      options: equipmentTypeOptions,
    },
  ],
  detailSections: [
    {
      title: "Overview",
      fields: [
        { key: "equipmentType", label: "Equipment type", type: "text" },
        {
          key: "identity",
          label: "Brand / Model",
          type: "text",
          accessor: (record) => `${record.brand} ${record.model}`.trim(),
        },
        { key: "serial", label: "Serial", type: "text" },
        { key: "office", label: "Office", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
    },
    {
      title: "Lifecycle",
      fields: [
        { key: "purchaseDate", label: "Purchase date", type: "date" },
        { key: "lastCalibrationDate", label: "Last calibration", type: "date" },
        { key: "notes", label: "Notes", type: "longtext" },
      ],
    },
  ],
  formFields: [
    {
      name: "equipmentType",
      label: "Equipment type",
      type: "select",
      options: equipmentTypeOptions,
      required: true,
      validation: requiredText("Equipment type"),
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
      name: "purchaseDate",
      label: "Purchase date",
      type: "date",
      validation: z.string().optional().nullable(),
    },
    {
      name: "lastCalibrationDate",
      label: "Last calibration",
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
    "In Calibration": "warning",
    Maintenance: "warning",
    Retired: "danger",
  },
  defaultImage: getDefaultImage("surveys"),
  cardLayout: {
    titleField: "equipmentType",
    subtitleField: "brand",
    metaFields: [
      { key: "model", label: "Model" },
      { key: "office", label: "Office" },
      { key: "lastCalibrationDate", label: "Calibration", accessor: (record) => record.lastCalibrationDate || "Not scheduled" },
    ],
  },
  permissionsModule: MODULES.SURVEYS,
  transformPayload: (values) => ({
    equipmentType: values.equipmentType || "Total Station",
    brand: values.brand?.trim() || "",
    model: values.model?.trim() || "",
    serial: values.serial?.trim() || "",
    office: values.office?.trim() || "",
    status: values.status || "Available",
    purchaseDate: values.purchaseDate || null,
    lastCalibrationDate: values.lastCalibrationDate || null,
    notes: values.notes?.trim() || null,
  }),
};
