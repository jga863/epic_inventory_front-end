import AppEmptyState from "../feedback/AppEmptyState";
import AppSkeleton from "../feedback/AppSkeleton";
import { cn } from "../utils/cn";

const SKELETON_ROW_COUNT = 5;

function AppTable({
  columns,
  rows,
  loading = false,
  loadingLabel = "Loading records",
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your filters or create a new record.",
  selectedRowId,
  onRowClick,
  getRowKey = (row) => row.id,
  renderActions,
  actionsLabel = "Actions",
  className = "",
}) {
  const totalColumns = columns.length + (renderActions ? 1 : 0);
  const showSkeleton = loading && (!rows || rows.length === 0);

  return (
    <div className={cn("app-table-wrapper", className)}>
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.align === "right" ? "text-right" : "text-left"}
              >
                {column.header}
              </th>
            ))}
            {renderActions ? (
              <th scope="col" className="text-right">
                {actionsLabel}
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody aria-busy={loading ? "true" : "false"} aria-label={loading ? loadingLabel : undefined}>
          {showSkeleton ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} aria-hidden="true">
                {columns.map((column) => (
                  <td key={column.key} className={column.align === "right" ? "text-right" : "text-left"}>
                    <AppSkeleton
                      variant={column.skeletonVariant || "text"}
                      width={column.skeletonWidth || "80%"}
                    />
                  </td>
                ))}
                {renderActions ? (
                  <td className="text-right">
                    <AppSkeleton variant="text" width="3.5rem" />
                  </td>
                ) : null}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={totalColumns}>
                <AppEmptyState title={emptyTitle} description={emptyDescription} compact />
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const rowKey = getRowKey(row);
              const isSelected = selectedRowId === rowKey;
              return (
                <tr
                  key={rowKey}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && "app-table-row--interactive", isSelected && "app-table-row--selected")}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.align === "right" ? "text-right" : "text-left"}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {renderActions ? <td className="text-right">{renderActions(row)}</td> : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AppTable;
