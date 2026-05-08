import { Controller } from "react-hook-form";
import AppInput from "../../forms/AppInput";
import AppSelect from "../../forms/AppSelect";
import AppTextarea from "../../forms/AppTextarea";
import SearchableSelect from "../../forms/SearchableSelect";

/**
 * Render a single form field for AssetForm. Each field is wired through react-hook-form's
 * Controller so the existing AppInput/AppSelect/AppTextarea components work without needing
 * forwardRef refactors.
 *
 * Supported `type` values:
 *  text | number | date | textarea | select | asyncSelect | boolean
 *
 * Field shape:
 *  { name, label, type, required, placeholder, options, asyncOptions, searchable }
 *
 * `searchable`:
 *  - asyncSelect → defaults to `true` (loaders typically return long lists; combobox UX wins)
 *  - select      → defaults to `false` (static lists are usually short; native select is fine)
 *  - explicitly set the prop to override either default.
 */
export function renderFormField({ field, control, errors, dynamicOptions }) {
  const errorMessage = errors?.[field.name]?.message;

  if (field.type === "select" || field.type === "asyncSelect") {
    const options = field.type === "asyncSelect"
      ? (dynamicOptions?.[field.name] || [])
      : (field.options || []);
    const searchable = field.searchable ?? (field.type === "asyncSelect");

    if (searchable) {
      return (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: ctl }) => (
            <SearchableSelect
              label={field.label}
              value={ctl.value ?? ""}
              onChange={(next) => ctl.onChange(next)}
              options={options}
              placeholder={field.placeholder}
              searchPlaceholder={field.searchPlaceholder}
              emptyLabel={field.emptyLabel}
              includePlaceholderOption={!field.required}
              required={field.required}
              error={errorMessage}
            />
          )}
        />
      );
    }

    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <AppSelect
            label={field.label}
            value={ctl.value ?? ""}
            onChange={(event) => ctl.onChange(event.target.value)}
            options={options}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMessage}
          />
        )}
      />
    );
  }

  if (field.type === "textarea" || field.type === "longtext") {
    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <AppTextarea
            label={field.label}
            value={ctl.value ?? ""}
            onChange={(event) => ctl.onChange(event.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errorMessage}
          />
        )}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: ctl }) => (
          <label className="app-surface-muted flex min-h-[2.9rem] items-center gap-3 rounded-2xl px-4 text-sm text-[var(--color-text-muted)]">
            <input
              type="checkbox"
              checked={Boolean(ctl.value)}
              onChange={(event) => ctl.onChange(event.target.checked)}
            />
            {field.label}
          </label>
        )}
      />
    );
  }

  // text | number | date (HTML5 input types)
  const inputType = field.type === "number" ? "number"
    : field.type === "date" ? "date"
    : "text";

  return (
    <Controller
      key={field.name}
      name={field.name}
      control={control}
      render={({ field: ctl }) => (
        <AppInput
          label={field.label}
          type={inputType}
          value={ctl.value ?? ""}
          onChange={(event) => ctl.onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          error={errorMessage}
        />
      )}
    />
  );
}
