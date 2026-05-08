import { createElement } from "react";
import { z } from "zod";
import { MODULES } from "../../shared/constants/permissions";
import { getDefaultImage } from "../../shared/asset/images/defaultImages";
import AssignmentEmbeddedSection from "../assignments/components/AssignmentEmbeddedSection";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployeesPage,
  updateEmployee,
} from "../../services/api/employeesApi";

const statusOptions = ["Active", "Inactive"];

const officeOptions = [
  "Heber City Office",
  "West Valley Office",
  "So. Idaho",
  "Utah Valley",
];

const requiredText = (label) => z.string().trim().min(1, `${label} is required.`);

const emailValidation = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Email must be valid.");

const extensionValidation = z
  .string()
  .trim()
  .regex(/^[0-9\-\s]*$/u, "Extension must contain digits, spaces or hyphens only.")
  .optional()
  .nullable();

const cellPhoneValidation = z
  .string()
  .trim()
  .regex(/^[0-9\-\s()+]*$/u, "Phone must contain digits, spaces, parentheses or hyphens only.")
  .optional()
  .nullable();

export const employeesConfig = {
  entityKey: "employees",
  labels: {
    singular: "Employee",
    plural: "Employees",
  },
  description:
    "Manage employee records, contact information and office assignments across all Epic Engineering locations.",
  api: {
    listPaged: listEmployeesPage,
    getById: getEmployeeById,
    create: createEmployee,
    update: (id, payload) => updateEmployee(id, payload),
    remove: deleteEmployee,
  },
  columns: [
    { key: "fullName", header: "Name", type: "emphasis" },
    { key: "email", header: "Email", type: "text" },
    { key: "department", header: "Department", type: "text" },
    { key: "office", header: "Office", type: "text" },
    { key: "status", header: "Status", type: "badge" },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search name, email or department",
    },
    {
      name: "office",
      label: "Office",
      type: "select",
      placeholder: "All offices",
      options: officeOptions,
    },
  ],
  detailSections: [
    {
      title: "Identity",
      fields: [
        { key: "fullName", label: "Full name", type: "text" },
        { key: "email", label: "Email", type: "text" },
        { key: "status", label: "Status", type: "badge" },
      ],
    },
    {
      title: "Workplace",
      fields: [
        { key: "department", label: "Department", type: "text" },
        { key: "office", label: "Office", type: "text" },
        { key: "role", label: "Role", type: "fallback", fallback: "Not provided" },
      ],
    },
    {
      title: "Contact",
      fields: [
        { key: "extension", label: "Extension", type: "fallback", fallback: "Not provided" },
        { key: "cellPhone", label: "Phone", type: "fallback", fallback: "Not provided" },
      ],
    },
    {
      title: "Assignments",
      fields: [
        {
          key: "currentAssignment",
          label: "Current computer",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "employee", recordId: record.id, type: "current" }),
        },
        {
          key: "assignmentHistory",
          label: "Recent history",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "employee", recordId: record.id, type: "history" }),
        },
        {
          key: "assignmentCta",
          label: "Manage",
          render: (record) => createElement(AssignmentEmbeddedSection, { mode: "employee", recordId: record.id, type: "cta" }),
        },
      ],
    },
  ],
  formFields: [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      required: true,
      validation: requiredText("First name"),
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      required: true,
      validation: requiredText("Last name"),
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      span: "full",
      validation: emailValidation,
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
      name: "department",
      label: "Department",
      type: "text",
      required: true,
      validation: requiredText("Department"),
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
      name: "extension",
      label: "Extension",
      type: "text",
      validation: extensionValidation,
    },
    {
      name: "cellPhone",
      label: "Phone",
      type: "text",
      validation: cellPhoneValidation,
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
    Active: "success",
    Inactive: "danger",
  },
  defaultImage: getDefaultImage("employees"),
  cardLayout: {
    titleField: "fullName",
    subtitleField: "department",
    metaFields: [
      { key: "email", label: "Email" },
      { key: "office", label: "Office" },
      {
        key: "cellPhone",
        label: "Phone",
        accessor: (record) => record.cellPhone || record.extension || "—",
      },
    ],
  },
  permissionsModule: MODULES.EMPLOYEES,
  transformPayload: (values) => ({
    firstName: values.firstName?.trim() || "",
    lastName: values.lastName?.trim() || "",
    email: values.email?.trim() || "",
    office: values.office?.trim() || "",
    department: values.department?.trim() || "",
    status: values.status || "Active",
    extension: values.extension?.trim() || null,
    cellPhone: values.cellPhone?.trim() || null,
  }),
};
