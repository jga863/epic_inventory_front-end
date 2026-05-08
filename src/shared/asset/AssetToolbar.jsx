import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import SearchableSelect from "../forms/SearchableSelect";
import AppButton from "../components/AppButton";
import ViewModeToggle from "./ViewModeToggle";

function renderFilterControl(filter, value, onChange, dynamicOptions) {
  const handleEvent = (event) => {
    if (filter.type === "boolean") {
      onChange(event.target.checked);
    } else {
      onChange(event.target.value);
    }
  };

  if (filter.type === "select" || filter.type === "asyncSelect") {
    const options = filter.type === "asyncSelect"
      ? (dynamicOptions?.[filter.name] || [])
      : (filter.options || []);
    const searchable = filter.searchable ?? (filter.type === "asyncSelect");

    if (searchable) {
      return (
        <SearchableSelect
          key={filter.name}
          value={value || ""}
          onChange={onChange}
          options={options}
          placeholder={filter.placeholder || `All ${filter.name}`}
          searchPlaceholder={filter.searchPlaceholder}
          emptyLabel={filter.emptyLabel}
          includePlaceholderOption
        />
      );
    }

    return (
      <AppSelect
        key={filter.name}
        value={value || ""}
        onChange={handleEvent}
        options={options}
        placeholder={filter.placeholder || `All ${filter.name}`}
      />
    );
  }
  if (filter.type === "boolean") {
    return (
      <label
        key={filter.name}
        className="app-surface-muted flex min-h-[2.9rem] items-center gap-3 rounded-2xl px-4 text-sm text-[var(--color-text-muted)]"
      >
        <input type="checkbox" checked={Boolean(value)} onChange={handleEvent} />
        {filter.label || filter.name}
      </label>
    );
  }
  return (
    <AppInput
      key={filter.name}
      value={value || ""}
      onChange={handleEvent}
      placeholder={filter.placeholder || filter.label || filter.name}
      type={filter.type === "search" ? "search" : "text"}
    />
  );
}

function AssetToolbar({ filters, values, onFilterChange, dynamicOptions, viewMode, onViewModeChange, primaryAction }) {
  return (
    <section className="app-card p-5">
      <div className="grid gap-3 md:grid-cols-4">
        {(filters || []).map((filter) => renderFilterControl(filter, values[filter.name], (next) => onFilterChange(filter.name, next), dynamicOptions))}
      </div>
      <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ViewModeToggle mode={viewMode} onChange={onViewModeChange} />
        {primaryAction ? (
          <AppButton onClick={primaryAction.onClick}>{primaryAction.label}</AppButton>
        ) : null}
      </div>
    </section>
  );
}

export default AssetToolbar;
