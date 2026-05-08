import { apiClient } from "./apiClient";

export const listPeripheralsPage = ({
  page = 0,
  size = 10,
  search,
  office,
  status,
  type,
  available,
} = {}) =>
  apiClient.get("/peripherals", {
    params: { page, size, search, office, status, type, available },
  });

export const getPeripheralById = (id) => apiClient.get(`/peripherals/${id}`);

export const createPeripheral = (payload) => apiClient.post("/peripherals", payload);

export const updatePeripheral = (id, payload) => apiClient.put(`/peripherals/${id}`, payload);

export const deletePeripheral = (id) => apiClient.delete(`/peripherals/${id}`);

export const listPeripheralTypes = () => apiClient.get("/peripherals/types");
