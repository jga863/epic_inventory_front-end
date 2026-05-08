import { createElement } from "react";
import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import AssignmentEmbeddedSection from "../assignments/components/AssignmentEmbeddedSection";
import {
  createComputer,
  deleteComputer,
  getComputerById,
  listComputersPaged,
  updateComputer,
} from "../../services/api/computersApi";

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);

const serialValidation = z
  .string()
  .trim()
  .min(1, "Serial number is required.")
  .regex(/^[A-Za-z0-9-]+$/u, "Use only letters, numbers or dashes.");

export const computersConfig = {
  entityKey: "computers",
  labels: {
    singular: "Computer",
    plural: "Computers",
  },
  description:
    "Track laptops and workstations across offices, monitor hardware specs and link computers to employees through assignments.",
  api: {
    listPaged: listComputersPaged,
    getById: getComputerById,
    create: createComputer,
    update: (id, payload) => updateComputer(id, payload),
    remove: deleteComputer,
  },
  columns: [
    { key: "name", header: "Name", type: "emphasis" },
    { key: "model", header: "Model", type: "text" },
    { key: "serialNo", header: "Serial", type: "text" },
    { key: "office", header: "Office", type: "text" },
    { key: "division", header: "Division", type: "fallback", fallback: "—" },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search by computer name",
    },
    {
      name: "office",
      label: "Office",
      type: "select",
      placeholder: "All offices",
      options: officeOptions,
    },
    {
      name: "division",
      label: "Division",
      type: "text",
      placeholder: "Division",
    },
    {
      name: "available",
      label: "Unassigned only",
      type: "boolean",
    },
  ],
  detailSections: [
    {
      title: "Identity",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "model", label: "Model", type: "text" },
        { key: "serialNo", label: "Serial", type: "text" },
      ],
    },
    {
      title: "Location",
      fields: [
        { key: "office", label: "Office", type: "text" },
        { key: "division", label: "Division", type: "fallback", fallback: "Not provided" },
      ],
    },
    {
      title: "Hardware",
      fields: [
        { key: "ram", label: "RAM", type: "fallback", fallback: "Not provided" },
        { key: "processor", label: "Processor", type: "fallback", fallback: "Not provided" },
        { key: "os", label: "Operating system", type: "fallback", fallback: "Not provided" },
      ],
    },
    {
      title: "Assignments",
      fields: [
        {
          key: "currentAssignment",
          label: "Assigned employee",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "computer", recordId: record.id, type: "current" }),
        },
        {
          key: "assignmentHistory",
          label: "Recent history",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "computer", recordId: record.id, type: "history" }),
        },
        {
          key: "assignmentCta",
          label: "Manage",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "computer", recordId: record.id, type: "cta" }),
        },
      ],
    },
  ],
  formFields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      validation: requiredText("Name"),
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      required: true,
      validation: requiredText("Model"),
    },
    {
      name: "serialNo",
      label: "Serial number",
      type: "text",
      required: true,
      validation: serialValidation,
    },
    {
      name: "office",
      label: "Office",
      type: "select",
      options: officeOptions,
      required: true,
      validation: requiredText("Office"),
    },
    {
      name: "division",
      label: "Division",
      type: "text",
      validation: z.string().optional().nullable(),
    },
    {
      name: "ram",
      label: "RAM",
      type: "text",
      validation: z.string().optional().nullable(),
    },
    {
      name: "processor",
      label: "Processor",
      type: "text",
      validation: z.string().optional().nullable(),
    },
    {
      name: "os",
      label: "Operating system",
      type: "text",
      validation: z.string().optional().nullable(),
    },
    {
      name: "image",
      label: "Photo",
      type: "image",
      span: "full",
    },
  ],
  defaultImage: getDefaultImage("computers"),
  cardLayout: {
    titleField: "name",
    subtitleField: "model",
    metaFields: [
      { key: "serialNo", label: "Serial" },
      { key: "office", label: "Office" },
      {
        key: "division",
        label: "Division",
        accessor: (record) => record.division || "—",
      },
    ],
  },
  permissionsModule: MODULES.COMPUTERS,
  transformPayload: (values) => ({
    model: values.model?.trim() || "",
    name: values.name?.trim() || "",
    serialNo: (values.serialNo || "").trim().toUpperCase(),
    office: values.office?.trim() || "",
    division: values.division?.trim() || null,
    ram: values.ram?.trim() || null,
    processor: values.processor?.trim() || null,
    os: values.os?.trim() || null,
  }),
};
