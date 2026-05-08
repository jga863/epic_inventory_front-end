import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import AppButton from "../../../shared/components/AppButton";
import AppBadge from "../../../shared/components/AppBadge";
import ResourceModal from "../../../shared/components/ResourceModal";
import SearchableSelect from "../../../shared/forms/SearchableSelect";
import usePermissions from "../../../shared/hooks/usePermissions";
import AssetHero from "../../../shared/asset/AssetHero";
import AssetToolbar from "../../../shared/asset/AssetToolbar";
import AssetView from "../../../shared/asset/AssetView";
import { useAssetViewMode } from "../../../shared/asset/hooks/useAssetViewMode";
import { listAllEmployees } from "../../../services/api/employeesApi";
import { listAllComputers } from "../../../services/api/computersApi";
import {
  createAssignment,
  deleteEmployeeAssignment,
  listAssetAssignmentHistory,
  listAssetAssignments,
} from "../../../services/api/assignmentsApi";
import { ACTIONS, MODULES } from "../../../shared/constants/permissions";
import { assignmentsConfig } from "../assignmentsConfig";

const PAGE_SIZE = 12;

function AssignmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const permissions = usePermissions();
  const [viewMode, setViewMode] = useAssetViewMode(assignmentsConfig.entityKey);

  const search = searchParams.get("search") || "";
  const employeeId = searchParams.get("employeeId") || "";
  const computerId = searchParams.get("computerId") || "";
  const status = searchParams.get("status") || "";
  const activeOnly = searchParams.get("activeOnly") !== "false";
  const page = Math.max(Number(searchParams.get("page") || "0"), 0);
  const selectedId = searchParams.get("selectedId") || "";

  const [assignModal, setAssignModal] = useState({ open: false, employeeId, computerId });
  const [endModal, setEndModal] = useState({ open: false });
  const [serverError, setServerError] = useState("");

  const [employeesQuery, computersQuery] = useQueries({
    queries: [
      { queryKey: ["assignments", "employees-options"], queryFn: listAllEmployees, staleTime: 60_000 },
      { queryKey: ["assignments", "computers-options"], queryFn: listAllComputers, staleTime: 60_000 },
    ],
  });

  const listQuery = useQuery({
    queryKey: ["asset-assignments", "list", { page, search, employeeId, computerId, status, activeOnly }],
    queryFn: () =>
      listAssetAssignments({
        page,
        size: PAGE_SIZE,
        search: search || undefined,
        employeeId: employeeId || undefined,
        computerId: computerId || undefined,
        status: status || undefined,
        activeOnly,
      }),
    placeholderData: (previous) => previous,
  });

  const rows = useMemo(() => listQuery.data?.content || [], [listQuery.data]);
  const selectedRow = rows.find((row) => String(row.id) === selectedId) || null;
  const listErrorMessage = listQuery.error?.message || "Could not load assignments from /api/asset-assignments.";

  const employeeOptions = useMemo(
    () => (employeesQuery.data || []).map((employee) => ({
      value: String(employee.id),
      label: employee.fullName || [employee.firstName, employee.lastName].filter(Boolean).join(" "),
    })),
    [employeesQuery.data]
  );

  const computerOptions = useMemo(
    () => (computersQuery.data || []).map((computer) => ({
      value: String(computer.id),
      label: `${computer.name || computer.model || "Computer"}${computer.serialNo ? ` - ${computer.serialNo}` : ""}`,
    })),
    [computersQuery.data]
  );

  const filterValues = useMemo(
    () => ({ search, employeeId, computerId, status, activeOnly }),
    [search, employeeId, computerId, status, activeOnly]
  );

  const dynamicFilterOptions = useMemo(
    () => ({ employeeId: employeeOptions, computerId: computerOptions }),
    [employeeOptions, computerOptions]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count += 1;
    if (employeeId) count += 1;
    if (computerId) count += 1;
    if (status) count += 1;
    if (!activeOnly) count += 1;
    return count;
  }, [search, employeeId, computerId, status, activeOnly]);

  const canAssign = permissions.hasPermission(MODULES.ASSIGNMENTS, ACTIONS.ASSIGN)
    || permissions.hasPermission(MODULES.COMPUTERS, ACTIONS.ASSIGN);

  const updateParams = useCallback((updates) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value == null || value === "" || value === false) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    if (!rows.length) {
      if (selectedId) {
        updateParams({ selectedId: null });
      }
      return;
    }
    if (!selectedId || !selectedRow) {
      updateParams({ selectedId: String(rows[0].id) });
    }
  }, [rows, selectedId, selectedRow, updateParams]);

  const historyQuery = useQuery({
    queryKey: ["asset-assignments", "history", selectedRow?.targetType, selectedRow?.targetId],
    queryFn: () =>
      listAssetAssignmentHistory({
        page: 0,
        size: 10,
        targetType: selectedRow?.targetType,
        targetId: selectedRow?.targetId,
      }),
    enabled: Boolean(selectedRow?.targetType && selectedRow?.targetId),
  });

  const createMutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => invalidateAssignmentViews(queryClient),
  });

  const endMutation = useMutation({
    mutationFn: deleteEmployeeAssignment,
    onSuccess: () => invalidateAssignmentViews(queryClient),
  });

  async function handleAssignSubmit(event) {
    event.preventDefault();
    setServerError("");
    try {
      await createMutation.mutateAsync({
        employeeId: Number(assignModal.employeeId),
        computerId: Number(assignModal.computerId),
      });
      setAssignModal({ open: false, employeeId: "", computerId: "" });
    } catch (error) {
      setServerError(error.message || "Could not create the assignment.");
    }
  }

  async function handleEndSubmit(event) {
    event.preventDefault();
    if (!selectedRow) return;
    setServerError("");
    try {
      await endMutation.mutateAsync(selectedRow.holderId);
      setEndModal({ open: false });
    } catch (error) {
      setServerError(error.message || "Could not end the assignment.");
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <AssetHero
        title="Computer Assignments"
        description={assignmentsConfig.description}
        action={canAssign ? (
          <AppButton
            onClick={() => setAssignModal({
              open: true,
              employeeId: employeeId || selectedRow?.holderId || "",
              computerId: computerId || selectedRow?.targetId || "",
            })}
          >
            Assign computer
          </AppButton>
        ) : null}
        stats={[
          { label: "Records in view", value: rows.length },
          { label: "Page", value: `${page + 1} / ${Math.max(listQuery.data?.totalPages || 1, 1)}` },
          { label: "Active filters", value: activeFilterCount },
          { label: "View", value: viewMode === "cards" ? "Cards" : "Table" },
        ]}
      />

      <AssetToolbar
        filters={assignmentsConfig.filters}
        values={filterValues}
        onFilterChange={(name, next) => {
          if (name === "activeOnly") {
            updateParams({ activeOnly: next ? null : "false", page: null });
            return;
          }
          updateParams({ [name]: next || null, page: null });
        }}
        dynamicOptions={dynamicFilterOptions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        primaryAction={canAssign ? {
          label: "Assign computer",
          onClick: () => setAssignModal({
            open: true,
            employeeId: employeeId || selectedRow?.holderId || "",
            computerId: computerId || selectedRow?.targetId || "",
          }),
        } : null}
      />

      {serverError ? (
        <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "var(--color-danger)", background: "var(--color-danger-soft)", color: "var(--color-danger)" }}>
          {serverError}
        </div>
      ) : null}

      {listQuery.isError ? (
        <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "var(--color-danger)", background: "var(--color-danger-soft)", color: "var(--color-danger)" }}>
          {listErrorMessage}
        </div>
      ) : null}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="app-card overflow-hidden">
          {listQuery.isError ? (
            <div className="px-6 py-10 text-sm text-[var(--color-text-muted)]">
              The assignments API returned an error. The table is hidden so the page does not fall back to a misleading empty state.
            </div>
          ) : (
            <AssetView
              mode={viewMode}
              items={rows}
              config={assignmentsConfig}
              loading={listQuery.isLoading || listQuery.isFetching}
              selectedId={selectedRow?.id}
              onSelect={(id) => updateParams({ selectedId: id })}
              canEdit={false}
              canDelete={false}
            />
          )}
          <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] px-6 py-4 text-sm text-[var(--color-text-muted)]">
            <span>Page {page + 1} of {Math.max(listQuery.data?.totalPages || 1, 1)}</span>
            <div className="flex gap-2">
              <AppButton variant="secondary" size="sm" disabled={page === 0} onClick={() => updateParams({ page: page - 1 })}>
                Previous
              </AppButton>
              <AppButton
                variant="secondary"
                size="sm"
                disabled={page + 1 >= (listQuery.data?.totalPages || 1)}
                onClick={() => updateParams({ page: page + 1 })}
              >
                Next
              </AppButton>
            </div>
          </div>
        </section>

        <aside className="app-card min-h-[24rem] p-6 xl:sticky xl:top-6">
          {!selectedRow ? (
            <p className="text-sm text-[var(--color-text-muted)]">Select an assignment to inspect current details and history.</p>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">Current</p>
                  <h2 className="mt-2 text-lg font-semibold text-[var(--color-text)]">{selectedRow.holderLabel}</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">{selectedRow.targetLabel}</p>
                </div>
                <AppBadge variant={assignmentsConfig.statusVariants[selectedRow.status] || "neutral"}>
                  {selectedRow.status}
                </AppBadge>
              </div>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">Assignment details</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="text-[var(--color-text-soft)]">Started</dt>
                    <dd className="mt-1 text-[var(--color-text-muted)]">{(selectedRow.startedAt || "").slice(0, 10) || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-text-soft)]">Ended</dt>
                    <dd className="mt-1 text-[var(--color-text-muted)]">{(selectedRow.endedAt || "").slice(0, 10) || "Still active"}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-text-soft)]">Notes</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-[var(--color-text-muted)]">{selectedRow.notes || "No notes recorded."}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">History</h3>
                  <AppButton variant="secondary" size="sm" onClick={() => updateParams({ activeOnly: "false" })}>
                    View history
                  </AppButton>
                </div>
                <div className="mt-3 space-y-2">
                  {(historyQuery.data?.content || []).map((item) => (
                    <div key={item.id} className="rounded-xl border border-[var(--color-border-subtle)] px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-[var(--color-text)]">{item.holderLabel}</span>
                        <AppBadge variant={assignmentsConfig.statusVariants[item.status] || "neutral"}>{item.status}</AppBadge>
                      </div>
                      <div className="mt-1 text-xs text-[var(--color-text-soft)]">
                        {(item.startedAt || "").slice(0, 10)} {item.endedAt ? `to ${(item.endedAt || "").slice(0, 10)}` : "to present"}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {canAssign && selectedRow.status === "ACTIVE" ? (
                <div className="flex flex-wrap gap-2">
                  <AppButton variant="danger" size="sm" onClick={() => setEndModal({ open: true })}>
                    End assignment
                  </AppButton>
                  <AppButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setAssignModal({
                      open: true,
                      employeeId: "",
                      computerId: String(selectedRow.targetId),
                    })}
                  >
                    Assign another computer
                  </AppButton>
                </div>
              ) : null}
            </div>
          )}
        </aside>
      </div>

      <ResourceModal
        open={assignModal.open}
        title="Assign computer to employee"
        subtitle="This uses the legacy assignment write path so dual-write remains intact while reads move progressively."
        onClose={() => setAssignModal({ open: false, employeeId: "", computerId: "" })}
        width="max-w-2xl"
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAssignSubmit}>
          <SearchableSelect
            label="Employee"
            required
            options={employeeOptions}
            value={assignModal.employeeId}
            placeholder="Select employee"
            searchPlaceholder="Search employees"
            emptyLabel="No employees found"
            onChange={(next) => setAssignModal((current) => ({ ...current, employeeId: next }))}
          />
          <SearchableSelect
            label="Computer"
            required
            options={computerOptions}
            value={assignModal.computerId}
            placeholder="Select computer"
            searchPlaceholder="Search computers"
            emptyLabel="No computers found"
            onChange={(next) => setAssignModal((current) => ({ ...current, computerId: next }))}
          />
          <div className="md:col-span-2 flex justify-end gap-2">
            <AppButton variant="secondary" onClick={() => setAssignModal({ open: false, employeeId: "", computerId: "" })}>
              Cancel
            </AppButton>
            <AppButton type="submit" loading={createMutation.isPending} disabled={!assignModal.employeeId || !assignModal.computerId}>
              Save assignment
            </AppButton>
          </div>
        </form>
      </ResourceModal>

      <ResourceModal
        open={endModal.open}
        title="End assignment"
        subtitle="Safe mode uses the legacy end-assignment path so the current experience stays synchronized while reads switch progressively."
        onClose={() => setEndModal({ open: false })}
        width="max-w-xl"
      >
        <form className="grid gap-4" onSubmit={handleEndSubmit}>
          <p className="text-sm text-[var(--color-text-muted)]">
            The active computer assignment for <span className="font-medium text-[var(--color-text)]">{selectedRow?.holderLabel}</span> will be closed and preserved in assignment history.
          </p>
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={() => setEndModal({ open: false })}>
              Cancel
            </AppButton>
            <AppButton type="submit" variant="danger" loading={endMutation.isPending}>
              End assignment
            </AppButton>
          </div>
        </form>
      </ResourceModal>
    </div>
  );
}

function invalidateAssignmentViews(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["asset-assignments"] });
  queryClient.invalidateQueries({ queryKey: ["assignments"] });
  queryClient.invalidateQueries({ queryKey: ["assignment-embed"] });
  queryClient.invalidateQueries({ queryKey: ["employees"] });
  queryClient.invalidateQueries({ queryKey: ["computers"] });
}

export default AssignmentsPage;
