import { apiClient } from "./apiClient";

export const listMonitorsPage = ({
  page = 0,
  size = 10,
  search,
  office,
  status,
  available,
} = {}) =>
  apiClient.get("/monitors", {
    params: { page, size, search, office, status, available },
  });

export const getMonitorById = (id) => apiClient.get(`/monitors/${id}`);

export const createMonitor = (payload) => apiClient.post("/monitors", payload);

export const updateMonitor = (id, payload) => apiClient.put(`/monitors/${id}`, payload);

export const deleteMonitor = (id) => apiClient.delete(`/monitors/${id}`);

export const listAvailableMonitors = () => apiClient.get("/monitors/available");
