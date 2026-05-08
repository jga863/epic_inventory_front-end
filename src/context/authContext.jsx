/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api/authApi.js";
import { buildPermissionKey, normalizePermissionList, normalizeRolesList, normalizeRoleValue } from "../shared/utils/permissions.js";
import { ACTIONS, MODULES } from "../shared/constants/permissions.js";

export const AuthContext = createContext();

const ROLE_PERMISSION_FALLBACKS = {
  ROLE_USER: [
    buildPermissionKey(MODULES.EMPLOYEES, ACTIONS.VIEW),
    buildPermissionKey(MODULES.COMPUTERS, ACTIONS.VIEW),
    buildPermissionKey(MODULES.ASSIGNMENTS, ACTIONS.VIEW),
    buildPermissionKey(MODULES.MONITORS, ACTIONS.VIEW),
    buildPermissionKey(MODULES.BATTERY_BACKUPS, ACTIONS.VIEW),
    buildPermissionKey(MODULES.PERIPHERALS, ACTIONS.VIEW),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.VIEW),
  ],
  ROLE_MANAGER: [
    buildPermissionKey(MODULES.EMPLOYEES, ACTIONS.CREATE),
    buildPermissionKey(MODULES.EMPLOYEES, ACTIONS.EDIT),
    buildPermissionKey(MODULES.COMPUTERS, ACTIONS.CREATE),
    buildPermissionKey(MODULES.COMPUTERS, ACTIONS.EDIT),
    buildPermissionKey(MODULES.COMPUTERS, ACTIONS.ASSIGN),
    buildPermissionKey(MODULES.ASSIGNMENTS, ACTIONS.ASSIGN),
    buildPermissionKey(MODULES.MONITORS, ACTIONS.CREATE),
    buildPermissionKey(MODULES.MONITORS, ACTIONS.EDIT),
    buildPermissionKey(MODULES.MONITORS, ACTIONS.ASSIGN),
    buildPermissionKey(MODULES.BATTERY_BACKUPS, ACTIONS.CREATE),
    buildPermissionKey(MODULES.BATTERY_BACKUPS, ACTIONS.EDIT),
    buildPermissionKey(MODULES.PERIPHERALS, ACTIONS.CREATE),
    buildPermissionKey(MODULES.PERIPHERALS, ACTIONS.EDIT),
    buildPermissionKey(MODULES.PERIPHERALS, ACTIONS.ASSIGN),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.CREATE),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.REVIEW),
  ],
  ROLE_ADMIN: [
    buildPermissionKey(MODULES.EMPLOYEES, ACTIONS.DELETE),
    buildPermissionKey(MODULES.COMPUTERS, ACTIONS.DELETE),
    buildPermissionKey(MODULES.MONITORS, ACTIONS.DELETE),
    buildPermissionKey(MODULES.BATTERY_BACKUPS, ACTIONS.DELETE),
    buildPermissionKey(MODULES.BATTERY_BACKUPS, ACTIONS.ASSIGN),
    buildPermissionKey(MODULES.PERIPHERALS, ACTIONS.DELETE),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.EDIT),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.DELETE),
    buildPermissionKey(MODULES.SURVEYS, ACTIONS.ASSIGN),
  ],
};

function derivePermissionsFromRoles(roles = []) {
  const derivedPermissions = roles.flatMap((role) => ROLE_PERMISSION_FALLBACKS[role] || []);
  return normalizePermissionList(derivedPermissions);
}

function clearStoredSession() {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("roles");
  sessionStorage.removeItem("permissions");
  sessionStorage.removeItem("primaryRole");
}

export const AuthProvider = ({ children }) => {
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [primaryRole, setPrimaryRole] = useState("");

  const applyAuthState = useCallback((payload, authToken) => {
    const normalizedRoles = normalizeRolesList(payload.roles || []);
    const normalizedPermissions = normalizePermissionList(
      payload.permissions?.length ? payload.permissions : derivePermissionsFromRoles(normalizedRoles)
    );
    const normalizedPrimaryRole = normalizeRoleValue(payload.primaryRole || normalizedRoles[0] || "");

    setIsAuthenticated(true);
    setUsername(payload.username || "");
    setRoles(normalizedRoles);
    setPermissions(normalizedPermissions);
    setPrimaryRole(normalizedPrimaryRole);

    if (authToken) {
      sessionStorage.setItem("authToken", authToken);
    }
    sessionStorage.setItem("username", payload.username || "");
    sessionStorage.setItem("roles", JSON.stringify(normalizedRoles));
    sessionStorage.setItem("permissions", JSON.stringify(normalizedPermissions));
    sessionStorage.setItem("primaryRole", normalizedPrimaryRole);
  }, []);

  const resetAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUsername("");
    setRoles([]);
    setPermissions([]);
    setPrimaryRole("");
    clearStoredSession();
  }, []);

  useEffect(() => {
    const restoreAuth = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setIsAuthResolved(true);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        applyAuthState(data, token);
      } catch {
        resetAuthState();
      } finally {
        setIsAuthResolved(true);
      }
    };

    restoreAuth();
  }, [applyAuthState, resetAuthState]);

  const login = async (inputUsername, password) => {
    const credentials = btoa(`${inputUsername}:${password}`);
    const authHeader = `Basic ${credentials}`;

    try {
      const data = await getCurrentUser(authHeader);
      applyAuthState(data, authHeader);
      setIsAuthResolved(true);
      return { success: true };
    } catch (error) {
      if (error.status === 401) {
        return { success: false, error: "Invalid credentials" };
      }
      if (error.status === 403) {
        return { success: false, error: "Access denied for this account" };
      }
      return { success: false, error: "Login failed" };
    }
  };

  const logout = useCallback(() => {
    resetAuthState();
    setIsAuthResolved(true);
  }, [resetAuthState]);

  const hasRole = useCallback((role) => roles.includes(normalizeRoleValue(role)), [roles]);

  const hasPermission = useCallback(
    (module, action) => permissions.includes(buildPermissionKey(module, action)),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (requestedPermissions = []) =>
      requestedPermissions.some(({ module, action }) => hasPermission(module, action)),
    [hasPermission]
  );

  const value = {
    isAuthResolved,
    isAuthenticated,
    username,
    roles,
    permissions,
    primaryRole,
    login,
    logout,
    hasRole,
    hasPermission,
    hasAnyPermission,
    canView: (module) => hasPermission(module, "view"),
    canCreate: (module) => hasPermission(module, "create"),
    canEdit: (module) => hasPermission(module, "edit"),
    canDelete: (module) => hasPermission(module, "delete"),
    canAssign: (module) => hasPermission(module, "assign"),
    canReview: (module) => hasPermission(module, "review"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
