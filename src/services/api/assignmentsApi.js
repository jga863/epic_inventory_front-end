import { apiClient } from "./apiClient";

export const listAssignments = ({ page = 0, size = 20, search, office } = {}) =>
  apiClient.get("/assignments", { params: { page, size, search, office } });

export const createAssignment = (payload) =>
  apiClient.post("/assignments", payload);

export const getEmployeeAssignmentSummary = (employeeId) =>
  apiClient.get(`/assignments/employees/${employeeId}`);

export const deleteEmployeeAssignment = (employeeId) =>
  apiClient.delete(`/assignments/${employeeId}`);

export const listAssetAssignments = ({
  page = 0,
  size = 20,
  search,
  employeeId,
  computerId,
  targetType,
  targetId,
  holderType,
  holderId,
  status,
  activeOnly = true,
} = {}) =>
  apiClient.get("/asset-assignments", {
    params: {
      page,
      size,
      search,
      employeeId,
      computerId,
      targetType,
      targetId,
      holderType,
      holderId,
      status,
      activeOnly,
    },
  });

export const listAssetAssignmentHistory = ({
  page = 0,
  size = 20,
  search,
  employeeId,
  computerId,
  targetType,
  targetId,
  holderType,
  holderId,
} = {}) =>
  apiClient.get("/asset-assignments/history", {
    params: {
      page,
      size,
      search,
      employeeId,
      computerId,
      targetType,
      targetId,
      holderType,
      holderId,
    },
  });

export const createAssetAssignment = (payload) =>
  apiClient.post("/asset-assignments", payload);

export const endAssetAssignment = (payload) =>
  apiClient.post("/asset-assignments/end", payload);

export const reassignAssetAssignment = (payload) =>
  apiClient.post("/asset-assignments/reassign", payload);
