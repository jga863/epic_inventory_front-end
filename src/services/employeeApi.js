import { apiClient } from "./apiClient";

// Lista paginada: /api/employees
// Backend acepta ?page, ?size, ?search, ?office
export const listEmployeesPage = ({
  page = 0,
  size = 12,
  search,
  office,
} = {}) =>
  apiClient.get("/employees", {
    params: { page, size, search, office },
  });

// Obtener empleado especifico por ID
export const getEmployeeById = (id) => apiClient.get(`/employees/${id}`);

// Obtener resumen de empleado con computadora asignada
export const getEmployeeSummary = (id) => apiClient.get(`/summary/${id}`);

// Crear un empleado
export const createEmployee = (employee) =>
  apiClient.post("/employees", employee);

// Actualizar un empleado
export const updateEmployee = (id, employee) =>
  apiClient.put(`/employees/${id}`, employee);

// Lista completa (no paginada)
// Trae todos los empleados recorriendo todas las paginas
export const listAllEmployees = async () => {
  let page = 0;
  const size = 100; // limite razonable por request
  let all = [];
  let done = false;

  while (!done) {
    const resp = await listEmployeesPage({ page, size });
    if (resp?.content?.length) {
      all = [...all, ...resp.content];
      page++;
      done = resp.last === true; // backend indica si es la ultima pagina
    } else {
      done = true;
    }
  }

  return all;
};
