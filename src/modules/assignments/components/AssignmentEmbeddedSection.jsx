import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AppBadge from "../../../shared/components/AppBadge";
import { getComputerSummary } from "../../../services/api/computersApi";
import { getEmployeeSummary } from "../../../services/api/employeesApi";
import { listAssetAssignmentHistory } from "../../../services/api/assignmentsApi";

function AssignmentEmbeddedSection({ mode, recordId, type = "current" }) {
  const isEmployee = mode === "employee";

  const summaryQuery = useQuery({
    queryKey: ["assignment-embed", mode, recordId, "summary"],
    queryFn: () => (isEmployee ? getEmployeeSummary(recordId) : getComputerSummary(recordId)),
    enabled: recordId != null,
    staleTime: 30_000,
  });

  const historyQuery = useQuery({
    queryKey: ["assignment-embed", mode, recordId, "history"],
    queryFn: () =>
      listAssetAssignmentHistory({
        page: 0,
        size: 3,
        employeeId: isEmployee ? recordId : undefined,
        computerId: isEmployee ? undefined : recordId,
      }),
    enabled: recordId != null && type !== "current",
    staleTime: 30_000,
  });

  if (type === "cta") {
    return (
      <Link
        className="inline-flex text-sm font-medium text-[var(--color-primary)] transition hover:opacity-80"
        to={isEmployee ? `/assignments?employeeId=${recordId}` : `/assignments?computerId=${recordId}`}
      >
        Manage assignment
      </Link>
    );
  }

  if (type === "current") {
    if (summaryQuery.isLoading) {
      return <span className="text-[var(--color-text-soft)]">Loading assignment...</span>;
    }

    const summary = summaryQuery.data;
    const current = isEmployee ? summary?.computer : summary?.employee;
    if (!current) {
      return <span className="text-[var(--color-text-muted)]">No active computer assignment.</span>;
    }

    const label = isEmployee
      ? `${current.name || current.model || "Computer"}${current.serialNo ? ` - ${current.serialNo}` : ""}`
      : current.fullName || [current.firstName, current.lastName].filter(Boolean).join(" ");

    return (
      <div className="flex flex-col gap-2">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        {summary?.assignment ? <AppBadge variant="primary">Active</AppBadge> : null}
      </div>
    );
  }

  if (historyQuery.isLoading) {
    return <span className="text-[var(--color-text-soft)]">Loading history...</span>;
  }

  const items = historyQuery.data?.content || [];
  if (items.length === 0) {
    return <span className="text-[var(--color-text-muted)]">No assignment history yet.</span>;
  }

  return (
    <div className="space-y-2">
      {items.slice(0, 3).map((item) => (
        <div key={item.id} className="rounded-xl border border-[var(--color-border-subtle)] px-3 py-2">
          <div className="text-sm text-[var(--color-text)]">
            {isEmployee ? item.targetLabel : item.holderLabel}
          </div>
          <div className="mt-1 text-xs text-[var(--color-text-soft)]">
            {(item.startedAt || "").slice(0, 10)} {item.endedAt ? `to ${(item.endedAt || "").slice(0, 10)}` : "to present"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssignmentEmbeddedSection;
