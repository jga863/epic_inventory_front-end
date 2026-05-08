import { apiClient } from "./apiClient";

export const listBatteryBackupsPage = ({
  page = 0,
  size = 10,
  search,
  office,
  status,
  associatedComputerId,
  available,
} = {}) =>
  apiClient.get("/battery-backups", {
    params: { page, size, search, office, status, associatedComputerId, available },
  });

export const getBatteryBackupById = (id) => apiClient.get(`/battery-backups/${id}`);

export const createBatteryBackup = (payload) => apiClient.post("/battery-backups", payload);

export const updateBatteryBackup = (id, payload) =>
  apiClient.put(`/battery-backups/${id}`, payload);

export const deleteBatteryBackup = (id) => apiClient.delete(`/battery-backups/${id}`);
