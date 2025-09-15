import React, { useEffect, useRef, useState } from "react";
import InventoryCard from "./InventoryCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { listComputersPage, searchComputers } from "../services/computersApi";
import { listEmployeesPage } from "../services/employeeApi";
import epicComputer from "../assets/epic_computer.png";
import epicEmployee from "../assets/epic_employee.png";

const PAGE_SIZE = 12;

const InventoryGrid = ({
  category = "Computers",
  onEmployeeClick,
  onComputerClick,
  searchTerm = "",
  isSearchVisible = false,
  searchInput = "",
  onSearchInputChange,
  onSearchSubmit,
  onSearchClear,
  onSearchClose,
  searchPlaceholder,
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const previousCategory = useRef(category);
  const previousSearch = useRef((searchTerm || "").trim());
  const requestCounter = useRef(0);

  const normalizedSearch = (searchTerm || "").trim();

  const imageMap = {
    Computers: epicComputer,
    Employee: epicEmployee,
    Monitors: "/monitor.png",
    "Battery Backup": "/battery.png",
    Periferal: "/periferal.png",
    Survey: "/survey.png",
  };

  useEffect(() => {
    const categoryChanged = previousCategory.current !== category;
    const searchChanged = previousSearch.current !== normalizedSearch;

    if (categoryChanged) {
      previousCategory.current = category;
    }
    if (searchChanged) {
      previousSearch.current = normalizedSearch;
    }

    if ((categoryChanged || searchChanged) && page !== 0) {
      setPage(0);
      return;
    }

    let cancelled = false;
    const requestId = ++requestCounter.current;

    async function load() {
      setLoading(true);
      try {
        if (category === "Computers") {
          const response = normalizedSearch
            ? await searchComputers({ name: normalizedSearch, page, size: PAGE_SIZE })
            : await listComputersPage({ page, size: PAGE_SIZE });
          if (!cancelled && requestCounter.current === requestId) {
            setItems(
              (response?.content || []).map((c) => ({
                id: c.id,
                name: c.name,
                model: c.model,
                office: c.office,
                division: c.division,
                serialNo: c.serialNo,
                ram: c.ram,
                processor: c.processor,
                os: c.os,
              }))
            );
            setTotalPages(response?.totalPages ?? 0);
          }
        } else if (category === "Employee") {
          const response = await listEmployeesPage({
            page,
            size: PAGE_SIZE,
            search: normalizedSearch || undefined,
          });
          if (!cancelled && requestCounter.current === requestId) {
            setItems(
              (response?.content || []).map((e) => ({
                id: e.id,
                fullName: e.fullName,
                email: e.email,
                office: e.office,
                department: e.department,
                role: e.role,
                status: e.status,
                name: e.fullName,
                model: e.department,
              }))
            );
            setTotalPages(response?.totalPages ?? 0);
          }
        } else {
          if (!cancelled && requestCounter.current === requestId) {
            setItems([]);
            setTotalPages(0);
          }
        }
      } catch (error) {
        console.error("Error loading items", error);
        if (!cancelled && requestCounter.current === requestId) {
          setItems([]);
          setTotalPages(0);
        }
      } finally {
        if (!cancelled && requestCounter.current === requestId) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [category, normalizedSearch, page]);

  const topBarClass = isSearchVisible
    ? "mb-3 flex items-stretch gap-4"
    : "mb-3 flex items-center gap-4 justify-end";

  return (
    <div className="px-8 py-4 text-gray-800">
      <div className={topBarClass}>
        {isSearchVisible && (
          <div className="flex-1">
            <SearchBar
              value={searchInput}
              onValueChange={onSearchInputChange}
              onSearch={onSearchSubmit}
              onClear={onSearchClear}
              onClose={onSearchClose}
              placeholder={searchPlaceholder}
              isLoading={loading}
            />
          </div>
        )}
        <div className={isSearchVisible ? "" : "ml-auto"}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(p - 1, 0))}
            onNext={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Cargando resultados...
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          {normalizedSearch
            ? `No se encontraron resultados para "${normalizedSearch}".`
            : "No hay elementos para mostrar."}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <InventoryCard
              key={item.id ?? item.name}
              id={item.id}
              name={item.name}
              model={item.model}
              image={imageMap[category]}
              onClick={() => {
                if (category === "Employee" && onEmployeeClick) {
                  onEmployeeClick(item);
                }
                if (category === "Computers" && onComputerClick) {
                  onComputerClick(item);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
