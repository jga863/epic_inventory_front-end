import { apiClient } from "./apiClient";

export const listAssignments = ({ page = 0, size = 20, search, office } = {}) =>
  apiClient.get("/assignments", { params: { page, size, search, office } });

export const getEmployeeAssignmentSummary = (employeeId) =>
  apiClient.get(`/assignments/employees/${employeeId}`);

export const deleteEmployeeAssignment = (employeeId) =>
  apiClient.delete(`/assignments/${employeeId}`);