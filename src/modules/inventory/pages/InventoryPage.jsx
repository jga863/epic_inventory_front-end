import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AssetHero from "../../../shared/asset/AssetHero";
import AssetCardGrid from "../../../shared/asset/AssetCardGrid";
import AppInput from "../../../shared/forms/AppInput";
import AppButton from "../../../shared/components/AppButton";
import { listEmployeesPage } from "../../../services/api/employeesApi";
import { listComputersPaged } from "../../../services/api/computersApi";
import { employeesConfig } from "../../employees/employeesConfig";
import { computersConfig } from "../../computers/computersConfig";
import usePermissions from "../../../shared/hooks/usePermissions";
import { MODULES } from "../../../shared/constants/permissions";

const PAGE_SIZE = 12;

const CATEGORIES = [
  { id: "employees", label: "Employees", config: employeesConfig, route: "/employees", module: MODULES.EMPLOYEES },
  { id: "computers", label: "Computers", config: computersConfig, route: "/computers", module: MODULES.COMPUTERS },
];

function InventoryPage() {
  const navigate = useNavigate();
  const { canView } = usePermissions();

  const visibleCategories = useMemo(
    () => CATEGORIES.filter((category) => canView(category.module)),
    [canView]
  );

  const [activeId, setActiveId] = useState(visibleCategories[0]?.id || "employees");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!visibleCategories.find((category) => category.id === activeId) && visibleCategories.length) {
      setActiveId(visibleCategories[0].id);
    }
  }, [visibleCategories, activeId]);

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [activeId, search]);

  const active = visibleCategories.find((category) => category.id === activeId) || visibleCategories[0];

  const query = useQuery({
    queryKey: [active?.id || "inventory", "dashboard", { page, search }],
    queryFn: ({ signal }) => {
      const params = { page, size: PAGE_SIZE, search: search || undefined, signal };
      return active?.id === "computers" ? listComputersPaged(params) : listEmployeesPage(params);
    },
    enabled: Boolean(active),
    placeholderData: (previous) => previous,
  });

  const items = query.data?.content || [];
  const totalPages = query.data?.totalPages || 0;

  function handleCardSelect(id) {
    if (!active || !id) return;
    navigate(`${active.route}?selected=${encodeURIComponent(id)}`, {
      state: { selectedId: id },
    });
  }

  if (!active) {
    return (
      <div className="space-y-6 px-4 py-6 md:px-8">
        <AssetHero
          title="Inventory"
          description="You do not have access to any inventory category."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <AssetHero
        title="Inventory"
        description="Browse employees and computers across offices. Pick a category, search, then jump to the dedicated page for full CRUD."
        stats={[
          { label: "Records in view", value: items.length },
          { label: "Page", value: `${page + 1} / ${Math.max(totalPages, 1)}` },
          { label: "Category", value: active.label },
        ]}
      />

      <section className="app-card flex flex-col gap-4 p-5">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Inventory categories"
          onKeyDown={(event) => {
            if (!visibleCategories.length) return;
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const idx = visibleCategories.findIndex((category) => category.id === active.id);
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const next = visibleCategories[(idx + direction + visibleCategories.length) % visibleCategories.length];
            setActiveId(next.id);
          }}
        >
          {visibleCategories.map((category) => {
            const isActive = category.id === active.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveId(category.id)}
                className={
                  isActive
                    ? "app-button app-button--primary app-button--sm"
                    : "app-button app-button--secondary app-button--sm"
                }
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <AppInput
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={`Search ${active.label.toLowerCase()}...`}
          />
          <AppButton variant="secondary" onClick={() => navigate(active.route)}>
            Open {active.label} page
          </AppButton>
        </div>
      </section>

      {query.isError ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--color-danger)",
            background: "var(--color-danger-soft)",
            color: "var(--color-danger)",
          }}
        >
          {query.error?.message || "Could not load records."}
        </div>
      ) : null}

      <section className="app-card overflow-hidden">
        <div className="p-4 sm:p-5">
          <AssetCardGrid
            items={items}
            config={active.config}
            loading={query.isLoading || query.isFetching}
            selectedId={null}
            onSelect={handleCardSelect}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-4 text-sm text-[var(--color-text-muted)]">
          <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
          <div className="flex gap-2">
            <AppButton
              variant="secondary"
              size="sm"
              onClick={() => setPage((current) => Math.max(current - 1, 0))}
              disabled={page === 0}
            >
              Previous
            </AppButton>
            <AppButton
              variant="secondary"
              size="sm"
              onClick={() => setPage((current) => (current + 1 < totalPages ? current + 1 : current))}
              disabled={page + 1 >= totalPages}
            >
              Next
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InventoryPage;
