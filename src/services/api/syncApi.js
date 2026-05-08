import { apiClient } from "./apiClient";

export const fetchSyncStatus = () => apiClient.get("/sync-status");

export const createAssignment = ({ employeeId, computerId }) =>
  apiClient.post("/assignments", { employeeId, computerId });
