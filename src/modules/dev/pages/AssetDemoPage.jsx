import AssetPage from "../../../shared/asset/AssetPage";
import { z } from "zod";

const ownerOptions = [
  { id: 101, name: "Denver Lab" },
  { id: 102, name: "Austin Office" },
  { id: 103, name: "Phoenix Trailer" },
];

let records = [
  {
    id: 1,
    name: "Demo Asset Alpha",
    category: "hardware",
    status: "Active",
    office: "Denver",
    ownerId: 101,
    ownerName: "Denver Lab",
    notes: "First seeded asset for the shared asset system demo.",
    available: true,
    quantity: 4,
    purchaseDate: "2026-01-12",
    createdAt: "2026-01-12T09:00:00",
    updatedAt: "2026-04-05T14:30:00",
  },
  {
    id: 2,
    name: "Demo Asset Bravo",
    category: "software",
    status: "Repair",
    office: "Austin",
    ownerId: 102,
    ownerName: "Austin Office",
    notes: "Exercises long text, select filters and card rendering.",
    available: false,
    quantity: 1,
    purchaseDate: "2025-11-03",
    createdAt: "2025-11-03T11:15:00",
    updatedAt: "2026-03-02T08:05:00",
  },
];

function simulateLatency(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 120));
}

function filterRecords({ page = 0, size = 10, search, status, available }) {
  let filtered = [...records];

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter((item) =>
      [item.name, item.office, item.ownerName, item.notes].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }

  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }

  if (available !== undefined && available !== null && available !== "") {
    const normalized = available === true || available === "true";
    filtered = filtered.filter((item) => item.available === normalized);
  }

  const start = page * size;
  const content = filtered.slice(start, start + size);

  return {
    content,
    totalPages: Math.max(1, Math.ceil(filtered.length / size)),
    totalElements: filtered.length,
  };
}

const demoApi = {
  listPaged: (params) => simulateLatency(filterRecords(params)),
  getById: (id) => simulateLatency(records.find((item) => item.id === id) || null),
  create: async (payload) => {
    const owner = ownerOptions.find((option) => option.id === Number(payload.ownerId));
    const created = {
      id: Math.max(0, ...records.map((item) => item.id)) + 1,
      ...payload,
      ownerId: owner?.id ?? null,
      ownerName: owner?.name ?? "Unassigned",
      quantity: Number(payload.quantity || 0),
      available: Boolean(payload.available),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    records = [created, ...records];
    return simulateLatency(created);
  },
  update: async (id, payload) => {
    const owner = ownerOptions.find((option) => option.id === Number(payload.ownerId));
    let updatedRecord = null;
    records = records.map((item) => {
      if (item.id !== id) {
        return item;
      }
      updatedRecord = {
        ...item,
        ...payload,
        ownerId: owner?.id ?? null,
        ownerName: owner?.name ?? "Unassigned",
        quantity: Number(payload.quantity || 0),
        available: Boolean(payload.available),
        updatedAt: new Date().toISOString(),
      };
      return updatedRecord;
    });
    return simulateLatency(updatedRecord);
  },
  remove: async (id) => {
    records = records.filter((item) => item.id !== id);
    return simulateLatency(null);
  },
};

const assetDemoConfig = {
  entityKey: "demo-assets",
  routePath: "/dev/asset-demo",
  labels: { singular: "Demo Asset", plural: "Asset Demo" },
  description: "Sandbox for the shared asset infrastructure introduced in phase 7.",
  api: demoApi,
  permissionsModule: "MONITORS",
  filters: [
    { name: "search", type: "search", label: "Search", placeholder: "Search demo assets" },
    {
      name: "status",
      type: "select",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Repair", label: "Repair" },
        { value: "Retired", label: "Retired" },
      ],
      placeholder: "All statuses",
    },
    { name: "available", type: "boolean", label: "Available only" },
  ],
  columns: [
    { key: "name", header: "Name", type: "emphasis" },
    { key: "status", header: "Status", type: "badge", variants: { Active: "success", Repair: "warning", Retired: "danger" } },
    { key: "office", header: "Office" },
    { key: "ownerName", header: "Owner" },
    { key: "quantity", header: "Qty", type: "number" },
    { key: "purchaseDate", header: "Purchased", type: "date" },
  ],
  cardLayout: {
    titleField: "name",
    subtitleField: "office",
    metaFields: [
      { key: "ownerName", label: "Owner" },
      { key: "status", label: "Status" },
      { key: "quantity", label: "Qty" },
    ],
  },
  detailSections: [
    {
      title: "Overview",
      fields: [
        { key: "status", label: "Status", type: "badge", variants: { Active: "success", Repair: "warning", Retired: "danger" } },
        { key: "office", label: "Office" },
        { key: "ownerName", label: "Owner" },
        { key: "purchaseDate", label: "Purchase date", type: "date" },
      ],
    },
    {
      title: "Notes",
      fields: [{ key: "notes", label: "Notes", type: "longtext" }],
    },
  ],
  formFields: [
    { name: "name", label: "Name", type: "text", required: true, validation: z.string().min(2, "Name is required") },
    { name: "status", label: "Status", type: "select", required: true, validation: z.string().min(1, "Status is required"), options: [
      { value: "Active", label: "Active" },
      { value: "Repair", label: "Repair" },
      { value: "Retired", label: "Retired" },
    ] },
    { name: "office", label: "Office", type: "text", validation: z.string().min(2, "Office is required") },
    {
      name: "ownerId",
      label: "Owner",
      type: "asyncSelect",
      loader: () => simulateLatency(ownerOptions),
      mapOption: (item) => ({ value: String(item.id), label: item.name }),
      validation: z.string().min(1, "Owner is required"),
    },
    { name: "quantity", label: "Quantity", type: "number", validation: z.coerce.number().min(0, "Quantity must be 0 or more") },
    { name: "purchaseDate", label: "Purchase date", type: "date" },
    { name: "available", label: "Available", type: "boolean" },
    { name: "notes", label: "Notes", type: "longtext", span: "full" },
  ],
  transformPayload: (values) => ({
    ...values,
    ownerId: values.ownerId ? Number(values.ownerId) : null,
  }),
};

function AssetDemoPage() {
  return <AssetPage config={assetDemoConfig} />;
}

export default AssetDemoPage;
