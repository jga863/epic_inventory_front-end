const LEGACY_ROLE_ALIASES = {
  EMPLOYEE: "ROLE_USER",
  ROLE_EMPLOYEE: "ROLE_USER",
  USER: "ROLE_USER",
  ROLE_USER: "ROLE_USER",
  MANAGER: "ROLE_MANAGER",
  ROLE_MANAGER: "ROLE_MANAGER",
  ADMIN: "ROLE_ADMIN",
  ROLE_ADMIN: "ROLE_ADMIN",
};

export function normalizeRoleValue(role) {
  if (!role) {
    return "";
  }

  const normalized = String(role).trim().toUpperCase();
  return LEGACY_ROLE_ALIASES[normalized] || normalized;
}

export function normalizeRolesList(roles = []) {
  return Array.from(new Set(roles.map(normalizeRoleValue).filter(Boolean)));
}

export function buildPermissionKey(module, action) {
  if (!module || !action) {
    return "";
  }

  return `${String(module).trim().toLowerCase()}:${String(action).trim().toLowerCase()}`;
}

export function normalizePermissionList(permissions = []) {
  return Array.from(new Set(permissions.map((permission) => String(permission).trim().toLowerCase()).filter(Boolean)));
}
