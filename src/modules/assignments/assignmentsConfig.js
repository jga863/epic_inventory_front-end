export const ASSIGNMENT_STATUS_OPTIONS = ["ACTIVE", "RETURNED", "LOST", "MAINTENANCE", "RETIRED"];

export const assignmentsConfig = {
  entityKey: "assignments",
  labels: {
    singular: "Assignment",
    plural: "Assignments",
  },
  description:
    "Dedicated view for current and historical computer-to-employee assignments, backed by asset_assignment reads and safe legacy writes.",
  columns: [
    { key: "holderLabel", header: "Employee", type: "emphasis" },
    { key: "targetLabel", header: "Computer", type: "text" },
    { key: "status", header: "Status", type: "badge" },
    { key: "startedAt", header: "Started", type: "date" },
    { key: "endedAt", header: "Ended", type: "date" },
    { key: "notes", header: "Notes", type: "longtext" },
  ],
  filters: [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search employee, computer or notes",
    },
    {
      name: "employeeId",
      label: "Employee",
      type: "asyncSelect",
      placeholder: "All employees",
      searchPlaceholder: "Search employees",
      emptyLabel: "No employees found",
    },
    {
      name: "computerId",
      label: "Computer",
      type: "asyncSelect",
      placeholder: "All computers",
      searchPlaceholder: "Search computers",
      emptyLabel: "No computers found",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "All statuses",
      options: ASSIGNMENT_STATUS_OPTIONS,
    },
    {
      name: "activeOnly",
      label: "Active only",
      type: "boolean",
    },
  ],
  statusField: "status",
  statusVariants: {
    ACTIVE: "primary",
    RETURNED: "success",
    LOST: "danger",
    MAINTENANCE: "warning",
    RETIRED: "neutral",
  },
  cardLayout: {
    imageEntityKey: "computers",
    imageIdField: "targetId",
    titleField: "holderLabel",
    subtitleField: "targetLabel",
    metaFields: [
      { key: "status", label: "Status" },
      { key: "startedAt", label: "Started", accessor: (record) => String(record.startedAt || "").slice(0, 10) || "—" },
      { key: "endedAt", label: "Ended", accessor: (record) => String(record.endedAt || "").slice(0, 10) || "Still active" },
      { key: "notes", label: "Notes", accessor: (record) => record.notes || "No notes recorded." },
    ],
    gridClassName: "grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
  },
};
