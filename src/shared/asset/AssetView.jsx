import AssetTable from "./AssetTable";
import AssetCardGrid from "./AssetCardGrid";

/**
 * Switches between table and card grid based on `mode`.
 */
function AssetView({ mode, items, config, loading, selectedId, onSelect, onEdit, onDelete, canEdit, canDelete }) {
  if (mode === "cards") {
    return (
      <AssetCardGrid
        items={items}
        config={config}
        loading={loading}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    );
  }
  return (
    <AssetTable
      config={config}
      rows={items}
      loading={loading}
      selectedId={selectedId}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}

export default AssetView;
