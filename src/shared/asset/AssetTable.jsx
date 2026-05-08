import AppTable from "../table/AppTable";
import AppButton from "../components/AppButton";
import { renderCell } from "./renderers/cellRenderers";

/**
 * Schema-driven table view. Reads `config.columns` and renders cells via cellRenderers.
 */
function AssetTable({
  config,
  rows,
  loading,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) {
  const columns = config.columns.map((column) => ({
    key: column.key,
    header: column.header,
    align: column.align,
    skeletonWidth: column.skeletonWidth || (
      column.type === "badge" ? "4rem"
      : column.type === "emphasis" ? "70%"
      : column.type === "number" ? "30%"
      : column.type === "date" ? "5rem"
      : "80%"
    ),
    skeletonVariant: column.skeletonVariant,
    render: (row) => renderCell({ ...column, variants: column.type === "badge" ? config.statusVariants : column.variants }, row),
  }));

  const showRowActions = canEdit || canDelete;

  return (
    <AppTable
      columns={columns}
      rows={rows}
      loading={loading}
      loadingLabel={`Loading ${config.labels?.plural?.toLowerCase() || "records"}...`}
      emptyTitle={`No ${config.labels?.plural?.toLowerCase() || "records"} found`}
      emptyDescription="Try adjusting your filters or create a new record."
      selectedRowId={selectedId}
      onRowClick={onSelect ? (row) => onSelect(row.id) : undefined}
      renderActions={
        showRowActions
          ? (row) => (
              <div className="flex justify-end gap-2">
                {canEdit ? (
                  <AppButton
                    variant="secondary"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit?.(row);
                    }}
                  >
                    Edit
                  </AppButton>
                ) : null}
                {canDelete ? (
                  <AppButton
                    variant="danger"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete?.(row);
                    }}
                  >
                    Delete
                  </AppButton>
                ) : null}
              </div>
            )
          : undefined
      }
    />
  );
}

export default AssetTable;
