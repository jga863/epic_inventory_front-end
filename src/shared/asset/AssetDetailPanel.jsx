import AppButton from "../components/AppButton";
import AppSkeleton from "../feedback/AppSkeleton";
import AssetImage from "./images/AssetImage";
import { renderDetailValue } from "./renderers/detailRenderers";

/**
 * Right-side detail panel. Shows the selected record split into sections of fields.
 * Sections come from `config.detailSections = [{ title, fields: [{ key, label, type }] }]`.
 */
function AssetDetailPanel({ config, record, loading, canEdit, canDelete, onEdit, onDelete }) {
  if (loading && !record) {
    return (
      <aside
        className="app-card flex min-h-[24rem] flex-col gap-5 p-6"
        aria-busy="true"
        aria-label={`${config.labels?.singular || "Record"} detail loading`}
      >
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {config.labels?.singular || "Record"} detail
        </h2>
        <div className="flex items-center gap-4">
          <AppSkeleton variant="card" width="9rem" height="9rem" />
          <AppSkeleton variant="text" width="40%" />
        </div>
        <div className="space-y-3">
          <AppSkeleton variant="title" width="35%" />
          <AppSkeleton variant="text" width="80%" />
          <AppSkeleton variant="text" width="60%" />
          <AppSkeleton variant="text" width="70%" />
        </div>
      </aside>
    );
  }

  if (!record) {
    return (
      <aside className="app-card p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{config.labels?.singular || "Record"} detail</h2>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          Select a {config.labels?.singular?.toLowerCase() || "record"} from the list to see its details.
        </p>
      </aside>
    );
  }

  const sections = config.detailSections || [];
  const variantsByKey = config.statusField
    ? { [config.statusField]: { ...config.statusVariants } }
    : {};

  return (
    <aside
      className="app-card flex min-h-[24rem] flex-col gap-5 p-6"
      aria-live="polite"
      aria-label={`${config.labels?.singular || "Record"} detail`}
    >
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{config.labels?.singular || "Record"} detail</h2>
        <div className="flex gap-2">
          {canEdit ? (
            <AppButton variant="secondary" size="sm" onClick={() => onEdit?.(record)}>Edit</AppButton>
          ) : null}
          {canDelete ? (
            <AppButton variant="danger" size="sm" onClick={() => onDelete?.(record)}>Delete</AppButton>
          ) : null}
        </div>
      </header>

      <div key={record.id} className="app-detail-content flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <AssetImage
            entityKey={config.entityKey}
            itemId={record.id}
            version={record.updatedAt}
            size="lg"
            alt={`${config.labels?.singular || "Record"} ${record.id} image`}
          />
          <div className="text-xs text-[var(--color-text-soft)]">ID #{record.id}</div>
        </div>

        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              {section.title}
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <dt className="text-[var(--color-text-soft)]">{field.label || field.key}</dt>
                  <dd className="mt-1">
                    {renderDetailValue(
                      {
                        ...field,
                        variants: variantsByKey[field.key]?.[record[field.key]]
                          ? variantsByKey[field.key]
                          : field.variants,
                      },
                      record
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </aside>
  );
}

export default AssetDetailPanel;
