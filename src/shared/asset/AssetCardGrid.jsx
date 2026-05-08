import AssetCard from "./AssetCard";
import AppEmptyState from "../feedback/AppEmptyState";
import AppSkeleton from "../feedback/AppSkeleton";

function AssetCardGrid({ items, config, loading, selectedId, onSelect }) {
  const gridClassName =
    config.cardLayout?.gridClassName ||
    "grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[repeat(auto-fit,minmax(17rem,1fr))]";

  if (loading && items.length === 0) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <AppSkeleton key={idx} variant="card" />
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <AppEmptyState
        title={`No ${config.labels?.plural?.toLowerCase() || "records"} found`}
        description="Try adjusting your filters or create a new record."
      />
    );
  }

  return (
    <div className={gridClassName}>
      {items.map((record) => (
        <AssetCard
          key={record.id}
          record={record}
          config={config}
          isSelected={selectedId === record.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default AssetCardGrid;
