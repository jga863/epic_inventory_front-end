import { apiClient } from "./apiClient";

// Lista paginada: /api/computers/page
export const listComputersPage = ({ page = 0, size = 12, sort = "updatedAt,desc" } = {}) =>
  apiClient.get("/computers/page", { params: { page, size, sort } });

// B?squeda compuesta: /api/computers/search
// NOTA: backend espera "name" (no "search") para filtrar por nombre en Computers.
export const searchComputers = ({
  name, // cadena para name LIKE
  office,
  division,
  page = 0,
  size = 12,
  sort = "updatedAt,desc",
} = {}) =>
  apiClient.get("/computers/search", {
    params: { name, office, division, page, size, sort },
  });

// Crear computadora
export const createComputer = (computer) =>
  apiClient.post("/computers", computer);

// Lista completa (no paginada)
export const listAllComputers = () => apiClient.get("/computers");

// Buscar por serie
export const getBySerial = (serialNo) =>
  apiClient.get(`/computers/by-serial/${encodeURIComponent(serialNo)}`);

// (OPCI?N B - redirigir a /search):
export const searchByOffice = (
  office,
  { page = 0, size = 12, sort = "updatedAt,desc" } = {}
) => apiClient.get("/computers/search", { params: { office, page, size, sort } });

// Por prioridad de reemplazo
export const getByReplacePriority = (priority) =>
  apiClient.get(`/computers/by-priority/${priority}`);

// Obtener resumen de computadora con empleado asignado
export const getComputerSummary = (id) =>
  apiClient.get(`/summary/computer/${id}`);
