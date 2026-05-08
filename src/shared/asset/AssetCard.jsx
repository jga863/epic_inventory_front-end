import AppBadge from "../components/AppBadge";
import AssetImage from "./images/AssetImage";
import { cn } from "../utils/cn";

/**
 * Visual card for a single asset record. Used inside AssetCardGrid.
 */
function AssetCard({ record, config, isSelected, onSelect }) {
  const layout = config.cardLayout || {};
  const title = record[layout.titleField || "name"] || record[config.columns?.[0]?.key];
  const subtitle = layout.subtitleField ? record[layout.subtitleField] : null;
  const imageEntityKey = layout.imageEntityKey || config.entityKey;
  const imageId = layout.imageIdAccessor
    ? layout.imageIdAccessor(record)
    : layout.imageIdField
      ? record[layout.imageIdField]
      : record.id;
  const imageVersion = layout.imageVersionAccessor
    ? layout.imageVersionAccessor(record)
    : layout.imageVersionField
      ? record[layout.imageVersionField]
      : record.updatedAt;
  const imageAlt = layout.imageAltAccessor ? layout.imageAltAccessor(record) : title;
  const hideImage = layout.hideImage === true;
  const meta = (layout.metaFields || []).map((field) => {
    if (typeof field === "string") {
      return { key: field, label: field, value: record[field] };
    }

    return {
      key: field.key,
      label: field.label || field.key,
      value: field.accessor ? field.accessor(record) : record[field.key],
    };
  });
  const statusKey = config.statusField || "status";
  const statusValue = record[statusKey];
  const statusVariant = config.statusVariants?.[statusValue] || "neutral";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(record.id)}
      aria-pressed={isSelected ? "true" : "false"}
      aria-label={`Select ${title || `record ${record.id}`}`}
      data-selected={isSelected ? "true" : undefined}
      className={cn(
        "app-asset-card group flex h-full min-h-[12.5rem] min-w-0 flex-col items-stretch overflow-hidden rounded-3xl border bg-[var(--color-surface-strong)] p-4 text-left transition sm:p-5",
        isSelected
          ? "border-[var(--color-primary)] shadow-[var(--shadow-md)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]"
      )}
    >
      <div className="mb-4 flex items-start gap-3 sm:gap-4">
        {hideImage ? null : (
          <AssetImage
            entityKey={imageEntityKey}
            itemId={imageId}
            version={imageVersion}
            alt={imageAlt}
            size="sm"
            className="shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            ID: {record.id ?? "-"}
          </div>
          <h3 className="truncate pt-1 font-semibold text-[var(--color-text)]">{title || `#${record.id}`}</h3>
          {subtitle ? (
            <p className="truncate text-sm text-[var(--color-text-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {statusValue ? (
          <AppBadge variant={statusVariant} className="shrink-0 self-start">
            {statusValue}
          </AppBadge>
        ) : null}
      </div>

      {meta.length ? (
        <dl className="mt-auto grid gap-2.5 text-sm">
          {meta.map(({ key, label, value }) => (
            <div key={key} className="grid gap-1">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-soft)]">{label}</dt>
              <dd className="truncate text-sm text-[var(--color-text-muted)]">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </button>
  );
}

export default AssetCard;
