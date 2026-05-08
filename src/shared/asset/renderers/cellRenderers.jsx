import AppBadge from "../../components/AppBadge";

function formatDate(value) {
  if (!value) return "—";
  // value can be a LocalDate (yyyy-mm-dd) or LocalDateTime; render the date portion only.
  return String(value).slice(0, 10);
}

const renderers = {
  text: (value) => (
    <span className="text-[var(--color-text-muted)]">{value || "—"}</span>
  ),
  emphasis: (value) => (
    <span className="font-semibold text-[var(--color-text)]">{value || "—"}</span>
  ),
  number: (value) => (
    <span className="font-mono text-[var(--color-text-muted)]">{value ?? "—"}</span>
  ),
  date: (value) => (
    <span className="text-[var(--color-text-muted)]">{formatDate(value)}</span>
  ),
  longtext: (value) => (
    <span className="line-clamp-2 text-[var(--color-text-muted)]">{value || "—"}</span>
  ),
  badge: (value, { variants = {} } = {}) => (
    value ? <AppBadge variant={variants[value] || "neutral"}>{value}</AppBadge> : <span className="text-[var(--color-text-soft)]">—</span>
  ),
  fallback: (value, { fallback = "Unassigned" } = {}) => (
    <span className="text-[var(--color-text-muted)]">{value || fallback}</span>
  ),
  boolean: (value) => (
    <span className="text-[var(--color-text-muted)]">{value ? "Yes" : "No"}</span>
  ),
};

export function renderCell(column, row) {
  if (column.render) return column.render(row);
  const type = column.type || "text";
  const renderer = renderers[type] || renderers.text;
  const value = column.accessor ? column.accessor(row) : row[column.key];
  return renderer(value, column);
}

export default renderers;
