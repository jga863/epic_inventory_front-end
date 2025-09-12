import { apiClient } from './apiClient';

// Lista paginada: /api/employees
// Backend acepta ?page, ?size, ?search, ?office
export const listEmployeesPage = ({
  page = 0,
  size = 12,
  search,
  office,
} = {}) =>
  apiClient.get('/employees', {
    params: { page, size, search, office },
  });

// Lista completa (no paginada)
// Trae todos los empleados recorriendo todas las páginas
export const listAllEmployees = async () => {
  let page = 0;
  const size = 100; // límite razonable por request
  let all = [];
  let done = false;

  while (!done) {
    const resp = await listEmployeesPage({ page, size });
    if (resp?.content?.length) {
      all = [...all, ...resp.content];
      page++;
      done = resp.last === true; // backend dice si es la última página
    } else {
      done = true;
    }
  }

  return all;
};
