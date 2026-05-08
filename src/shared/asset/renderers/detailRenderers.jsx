import AppBadge from "../../components/AppBadge";

function formatDate(value) {
  if (!value) return "Not provided";
  return String(value).slice(0, 10);
}

const renderers = {
  text: (value) => <span className="text-[var(--color-text-muted)]">{value || "Not provided"}</span>,
  date: (value) => <span className="text-[var(--color-text-muted)]">{formatDate(value)}</span>,
  number: (value) => <span className="text-[var(--color-text-muted)]">{value ?? "Not provided"}</span>,
  longtext: (value) => (
    <span className="whitespace-pre-wrap text-[var(--color-text-muted)]">{value || "No notes."}</span>
  ),
  badge: (value, { variants = {} } = {}) =>
    value ? <AppBadge variant={variants[value] || "neutral"}>{value}</AppBadge> : <span className="text-[var(--color-text-soft)]">Not provided</span>,
  boolean: (value) => <span className="text-[var(--color-text-muted)]">{value ? "Yes" : "No"}</span>,
  fallback: (value, { fallback = "Unassigned" } = {}) => (
    <span className="text-[var(--color-text-muted)]">{value || fallback}</span>
  ),
};

export function renderDetailValue(field, record) {
  if (field.render) return field.render(record);
  const type = field.type || "text";
  const renderer = renderers[type] || renderers.text;
  const value = field.accessor ? field.accessor(record) : record?.[field.key];
  return renderer(value, field);
}

export default renderers;
