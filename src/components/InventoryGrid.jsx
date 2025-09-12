import React, { useEffect, useState } from "react";
import InventoryCard from "./InventoryCard";
import Pagination from "./Pagination";
import { listComputersPage } from "../services/computersApi";
import { listEmployeesPage } from "../services/employeeApi";
import epicComputer from "../assets/epic_computer.png";
import epicEmployee from "../assets/epic_employee.png";

const InventoryGrid = ({ category = "Computers" }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const size = 12;
  const [totalPages, setTotalPages] = useState(0);

  // 🔹 mapa de imágenes por categoría (importadas desde assets)
  const imageMap = {
    Computers: epicComputer,
    Employee: epicEmployee,
    Monitors: "/monitor.png",
    "Battery Backup": "/battery.png",
    Periferal: "/periferal.png",
    Survey: "/survey.png",
  };

  // resetear página cuando cambia la categoría
  useEffect(() => {
    setPage(0);
  }, [category]);

  useEffect(() => {
    async function load() {
      try {
        if (category === "Computers") {
          const resp = await listComputersPage({ page, size });
          setItems(
            (resp?.content || []).map((c) => ({
              id: c.id,
              name: c.name,
              model: c.model,
            }))
          );
          setTotalPages(resp?.totalPages ?? 0);
        } else if (category === "Employee") {
          const resp = await listEmployeesPage({ page, size });
          setItems(
            (resp?.content || []).map((e) => ({
              id: e.id,
              name: e.fullName,
              model: e.department,
            }))
          );
          setTotalPages(resp?.totalPages ?? 0);
        } else {
          setItems([]);
          setTotalPages(0);
        }
      } catch (e) {
        console.error("Error loading items", e);
        setItems([]);
        setTotalPages(0);
      }
    }
    load();
  }, [page, category]);

  return (
    <div className="px-8 py-4 text-gray-800">
      <div className="flex justify-end mb-3">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 0))}
          onNext={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <InventoryCard
            key={item.id ?? item.name}
            id={item.id}
            name={item.name}
            model={item.model}
            image={imageMap[category]}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryGrid;