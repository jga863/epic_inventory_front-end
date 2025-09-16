import React, { useEffect, useRef, useState } from "react";
import InventoryCard from "./InventoryCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { listComputersPage, searchComputers } from "../services/computersApi";
import { listEmployeesPage } from "../services/employeeApi";
import epicComputer from "../assets/epic_computer.png";
import epicEmployee from "../assets/epic_employee.png";

const PAGE_SIZE = 12;

const mapEmployeeToGridItem = (employee) => {
  if (!employee) {
    return null;
  }
  const fullName =
    employee.fullName || [employee.firstName, employee.lastName].filter(Boolean).join(" ");
  return {
    id: employee.id,
    fullName,
    email: employee.email,
    office: employee.office,
    department: employee.department,
    role: employee.role,
    status: employee.status,
    name: fullName || employee.name,
    model: employee.department,
  };
};

const mapComputerToGridItem = (computer) => {
  if (!computer) {
    return null;
  }
  return {
    id: computer.id,
    name: computer.name,
    model: computer.model,
    office: computer.office,
    division: computer.division,
    serialNo: computer.serialNo,
    ram: computer.ram,
    processor: computer.processor,
    os: computer.os,
  };
};

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
  newEmployeeEvent,
  newComputerEvent,
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const previousCategory = useRef(category);
  const previousSearch = useRef((searchTerm || "").trim());
  const requestCounter = useRef(0);
  const lastAddEmployee = useRef(null);
  const lastAddComputer = useRef(null);

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
            setItems((response?.content || []).map(mapComputerToGridItem).filter(Boolean));
            setTotalPages(response?.totalPages ?? 0);
          }
        } else if (category === "Employee") {
          const response = await listEmployeesPage({
            page,
            size: PAGE_SIZE,
            search: normalizedSearch || undefined,
          });
          if (!cancelled && requestCounter.current === requestId) {
            setItems((response?.content || []).map(mapEmployeeToGridItem).filter(Boolean));
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

  useEffect(() => {
    if (!newEmployeeEvent || category !== "Employee") {
      return;
    }
    if (lastAddEmployee.current === newEmployeeEvent.ts) {
      return;
    }
    lastAddEmployee.current = newEmployeeEvent.ts;
    const mapped = mapEmployeeToGridItem(newEmployeeEvent.employee);
    if (!mapped) {
      return;
    }
    const normalized = normalizedSearch.toLowerCase();
    if (normalized) {
      const nameMatch = mapped.name?.toLowerCase().includes(normalized);
      const emailMatch = mapped.email?.toLowerCase().includes(normalized);
      if (!nameMatch && !emailMatch) {
        return;
      }
    }
    setItems((prev) => {
      const alreadyPresent = prev.some((item) => item.id === mapped.id);
      if (alreadyPresent) {
        return prev;
      }
      const next = [mapped, ...prev];
      return next.length > PAGE_SIZE ? next.slice(0, PAGE_SIZE) : next;
    });
    setTotalPages((prev) => (prev === 0 ? 1 : prev));
  }, [newEmployeeEvent, category, normalizedSearch]);

  useEffect(() => {
    if (!newComputerEvent || category !== "Computers") {
      return;
    }
    if (lastAddComputer.current === newComputerEvent.ts) {
      return;
    }
    lastAddComputer.current = newComputerEvent.ts;
    const mapped = mapComputerToGridItem(newComputerEvent.computer);
    if (!mapped) {
      return;
    }
    const normalized = normalizedSearch.toLowerCase();
    if (normalized) {
      const nameMatch = mapped.name?.toLowerCase().includes(normalized);
      const modelMatch = mapped.model?.toLowerCase().includes(normalized);
      const serialMatch = mapped.serialNo?.toLowerCase().includes(normalized);
      if (!nameMatch && !modelMatch && !serialMatch) {
        return;
      }
    }
    setItems((prev) => {
      const alreadyPresent = prev.some((item) => item.id === mapped.id);
      if (alreadyPresent) {
        return prev;
      }
      const next = [mapped, ...prev];
      return next.length > PAGE_SIZE ? next.slice(0, PAGE_SIZE) : next;
    });
    setTotalPages((prev) => (prev === 0 ? 1 : prev));
  }, [newComputerEvent, category, normalizedSearch]);

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
          Loading results...
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500">
          {normalizedSearch
            ? `No results found for "${normalizedSearch}".`
            : "No items to display."}
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

