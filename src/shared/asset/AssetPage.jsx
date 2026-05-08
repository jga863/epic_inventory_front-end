import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import usePermissions from "../hooks/usePermissions";
import AppButton from "../components/AppButton";
import { apiClient } from "../../services/api/apiClient";
import { getOwnerType } from "./images/defaultImages";
import { useAssetCrud } from "./hooks/useAssetCrud";
import { useAssetFilters } from "./hooks/useAssetFilters";
import { useAssetViewMode } from "./hooks/useAssetViewMode";
import AssetHero from "./AssetHero";
import AssetToolbar from "./AssetToolbar";
import AssetView from "./AssetView";
import AssetDetailPanel from "./AssetDetailPanel";
import AssetFormModal from "./AssetFormModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

/**
 * Single entrypoint for an entity's CRUD page. Driven entirely by `config`.
 * Layout: Hero, Toolbar, two-column (View + DetailPanel), modals for create/edit/delete.
 */
function AssetPage({ config }) {
  const { canCreate, canEdit, canDelete, canAssign } = usePermissions();
  const canCreateRec = canCreate(config.permissionsModule);
  const canEditRec = canEdit(config.permissionsModule);
  const canDeleteRec = canDelete(config.permissionsModule);
  const canAssignRec = typeof canAssign === "function" ? canAssign(config.permissionsModule) : false;
  const permissions = {
    canCreate: canCreateRec,
    canEdit: canEditRec,
    canDelete: canDeleteRec,
    canAssign: canAssignRec,
  };

  const initialFilters = useMemo(
    () => (config.filters || []).reduce((acc, f) => {
      acc[f.name] = f.type === "boolean" ? false : "";
      return acc;
    }, {}),
    [config.filters]
  );

  const filtersHook = useAssetFilters(initialFilters);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useAssetViewMode(config.entityKey);
  const [dialogMode, setDialogMode] = useState(null); // 'create' | 'edit' | null
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [serverError, setServerError] = useState("");

  // Reset page on filter change.
  useEffect(() => { setPage(0); }, [filtersHook.effective]);

  const crud = useAssetCrud(config, { page, filters: filtersHook.effective });

  // ── Deep linking: ?selected=<id> + router state preselection ────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSelectionAppliedRef = useRef(false);
  const { select: selectRecord, selectedId } = crud;

  useEffect(() => {
    if (initialSelectionAppliedRef.current) return;
    const fromState = location.state?.selectedId;
    const fromQueryRaw = searchParams.get("selected");
    const fromQuery = fromQueryRaw != null ? Number(fromQueryRaw) : null;
    const seed = fromState ?? (Number.isFinite(fromQuery) ? fromQuery : null);
    if (seed != null) {
      selectRecord(seed);
    }
    initialSelectionAppliedRef.current = true;
    if (fromState != null) {
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location, navigate, searchParams, selectRecord]);

  useEffect(() => {
    if (!initialSelectionAppliedRef.current) return;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (selectedId != null) {
        next.set("selected", String(selectedId));
      } else {
        next.delete("selected");
      }
      return next;
    }, { replace: true });
  }, [selectedId, setSearchParams]);

  // Async options (e.g. assignedComputerId loader). One useQuery per asyncSelect field.
  const asyncFields = (config.formFields || []).filter((f) => f.type === "asyncSelect" && typeof f.loader === "function");
  const asyncFilters = (config.filters || []).filter((f) => f.type === "asyncSelect" && typeof f.loader === "function");
  const asyncInputs = [...asyncFields, ...asyncFilters];
  const asyncQueries = useQueries({
    queries: asyncInputs.map((field) => ({
      queryKey: [config.entityKey, "options", field.name],
      queryFn: () => field.loader(),
      staleTime: 60_000,
    })),
  });
  const dynamicOptions = {};
  asyncFields.forEach((field, idx) => {
    const data = asyncQueries[idx]?.data || [];
    dynamicOptions[field.name] = data.map((item) =>
      field.mapOption ? field.mapOption(item) : { value: item.id, label: item.name || item.label }
    );
  });
  const dynamicFilterOptions = {};
  asyncFilters.forEach((field, idx) => {
    const data = asyncQueries[asyncFields.length + idx]?.data || [];
    dynamicFilterOptions[field.name] = data.map((item) =>
      field.mapOption ? field.mapOption(item) : { value: item.id, label: item.name || item.label }
    );
  });

  function openCreate() {
    setEditingRecord(null);
    setDialogMode("create");
    setServerError("");
  }
  function openEdit(record) {
    setEditingRecord(record);
    setDialogMode("edit");
    setServerError("");
  }
  function closeDialog() {
    setDialogMode(null);
    setEditingRecord(null);
    setServerError("");
  }

  async function uploadImageIfPresent(itemId, imageFile) {
    if (!imageFile) return;
    const ownerType = getOwnerType(config.entityKey);
    if (!ownerType) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    await apiClient.upload(`/images/${ownerType}/${itemId}`, formData);
  }

  async function handleSubmit(values, { imageFile }) {
    setServerError("");
    const payload = config.transformPayload
      ? config.transformPayload(values, { permissions })
      : normalizePayload(values, config.formFields);
    try {
      if (dialogMode === "edit" && editingRecord?.id) {
        const updated = await crud.update.mutateAsync({ id: editingRecord.id, payload });
        if (imageFile) {
          await uploadImageIfPresent(editingRecord.id, imageFile);
          crud.invalidate();
        }
        crud.select(updated.id);
      } else {
        const created = await crud.create.mutateAsync(payload);
        if (imageFile && created?.id) {
          await uploadImageIfPresent(created.id, imageFile);
          crud.invalidate();
        }
        if (created?.id) crud.select(created.id);
      }
      closeDialog();
    } catch (error) {
      setServerError(error.message || "Could not save record.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await crud.remove.mutateAsync(deleteTarget.id);
      if (crud.selectedId === deleteTarget.id) crud.clearSelection();
      setDeleteTarget(null);
    } catch (error) {
      setServerError(error.message || "Could not delete record.");
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <AssetHero
        title={config.labels?.plural || "Records"}
        description={config.description}
        action={canCreateRec ? <AppButton onClick={openCreate}>Add {config.labels?.singular?.toLowerCase() || "record"}</AppButton> : null}
        stats={[
          { label: "Records in view", value: crud.items.length },
          { label: "Page", value: `${page + 1} / ${Math.max(crud.totalPages, 1)}` },
          { label: "Active filters", value: filtersHook.activeCount },
          { label: "View", value: viewMode === "cards" ? "Cards" : "Table" },
        ]}
      />

      <AssetToolbar
        filters={config.filters || []}
        values={filtersHook.values}
        onFilterChange={filtersHook.setFilter}
        dynamicOptions={dynamicFilterOptions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        primaryAction={canCreateRec ? { label: `Add ${config.labels?.singular?.toLowerCase() || "record"}`, onClick: openCreate } : null}
      />

      {crud.isError ? (
        <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "var(--color-danger)", background: "var(--color-danger-soft)", color: "var(--color-danger)" }}>
          {crud.error?.message || "Could not load records."}
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="app-card overflow-hidden">
          <AssetView
            mode={viewMode}
            items={crud.items}
            config={config}
            loading={crud.isLoading || crud.isFetching}
            selectedId={crud.selectedId}
            onSelect={crud.select}
            onEdit={openEdit}
            onDelete={(row) => setDeleteTarget(row)}
            canEdit={canEditRec}
            canDelete={canDeleteRec}
          />
          <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-4 text-sm text-[var(--color-text-muted)]">
            <span>Page {page + 1} of {Math.max(crud.totalPages, 1)}</span>
            <div className="flex gap-2">
              <AppButton variant="secondary" size="sm" onClick={() => setPage((current) => Math.max(current - 1, 0))} disabled={page === 0}>
                Previous
              </AppButton>
              <AppButton
                variant="secondary"
                size="sm"
                onClick={() => setPage((current) => (current + 1 < crud.totalPages ? current + 1 : current))}
                disabled={page + 1 >= crud.totalPages}
              >
                Next
              </AppButton>
            </div>
          </div>
        </section>

        <div className="xl:sticky xl:top-6">
          <AssetDetailPanel
            config={config}
            record={crud.selectedRecord}
            loading={crud.selectedLoading}
            canEdit={canEditRec}
            canDelete={canDeleteRec}
            onEdit={openEdit}
            onDelete={(row) => setDeleteTarget(row)}
          />
        </div>
      </div>

      <AssetFormModal
        open={Boolean(dialogMode)}
        mode={dialogMode}
        config={config}
        initialValues={editingRecord}
        dynamicOptions={dynamicOptions}
        permissions={permissions}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        submitting={crud.create.isPending || crud.update.isPending}
        serverError={serverError}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        target={deleteTarget ? { id: deleteTarget.id, label: buildLabel(deleteTarget, config) } : null}
        label={config.labels?.singular?.toLowerCase() || "record"}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        busy={crud.remove.isPending}
      />
    </div>
  );
}

function buildLabel(record, config) {
  const layout = config.cardLayout || {};
  const title = record[layout.titleField || "name"] || record[config.columns?.[0]?.key];
  const subtitle = layout.subtitleField ? record[layout.subtitleField] : null;
  return [title, subtitle].filter(Boolean).join(" ");
}

function normalizePayload(values, formFields) {
  const out = {};
  formFields.forEach((field) => {
    if (field.name === "image" || field.type === "custom") return;
    const raw = values[field.name];
    if (field.type === "number") {
      out[field.name] = raw === "" || raw == null ? null : Number(raw);
    } else if (field.type === "date") {
      out[field.name] = raw || null;
    } else if (field.type === "boolean") {
      out[field.name] = Boolean(raw);
    } else {
      out[field.name] = raw === "" || raw == null ? null : raw;
    }
  });
  return out;
}

export default AssetPage;
