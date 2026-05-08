import { ACTIONS, MODULES } from "./permissions";

export const PRIMARY_NAV_ITEMS = [
  {
    to: "/inventory",
    label: "Inventory",
    permissions: [
      { module: MODULES.EMPLOYEES, action: ACTIONS.VIEW },
      { module: MODULES.COMPUTERS, action: ACTIONS.VIEW },
      { module: MODULES.ASSIGNMENTS, action: ACTIONS.VIEW },
    ],
    requireAny: true,
  },
  { to: "/employees", label: "Employees", permission: { module: MODULES.EMPLOYEES, action: ACTIONS.VIEW } },
  { to: "/computers", label: "Computers", permission: { module: MODULES.COMPUTERS, action: ACTIONS.VIEW } },
  { to: "/assignments", label: "Assignments", permission: { module: MODULES.ASSIGNMENTS, action: ACTIONS.VIEW } },
  { to: "/monitors", label: "Monitors", permission: { module: MODULES.MONITORS, action: ACTIONS.VIEW } },
  { to: "/battery-backups", label: "Battery Backup", permission: { module: MODULES.BATTERY_BACKUPS, action: ACTIONS.VIEW } },
  { to: "/peripherals", label: "Peripherals", permission: { module: MODULES.PERIPHERALS, action: ACTIONS.VIEW } },
  { to: "/surveys", label: "Survey Equipment", permission: { module: MODULES.SURVEYS, action: ACTIONS.VIEW } },
];

export const ROUTE_TITLES = [
  { match: "/inventory", title: "Inventory" },
  { match: "/employees", title: "Employees" },
  { match: "/computers", title: "Computers" },
  { match: "/assignments", title: "Assignments" },
  { match: "/monitors", title: "Monitors" },
  { match: "/battery-backups", title: "Battery Backup" },
  { match: "/peripherals", title: "Peripherals" },
  { match: "/surveys", title: "Survey Equipment" },
];
