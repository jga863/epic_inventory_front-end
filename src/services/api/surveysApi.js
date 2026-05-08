import { apiClient } from "./apiClient";

export const listSurveysPage = ({
  page = 0,
  size = 10,
  search,
  office,
  status,
  equipmentType,
} = {}) =>
  apiClient.get("/surveys", {
    params: { page, size, search, office, status, equipmentType },
  });

export const getSurveyById = (id) => apiClient.get(`/surveys/${id}`);

export const createSurvey = (payload) => apiClient.post("/surveys", payload);

export const updateSurvey = (id, payload) => apiClient.put(`/surveys/${id}`, payload);

export const deleteSurvey = (id) => apiClient.delete(`/surveys/${id}`);
