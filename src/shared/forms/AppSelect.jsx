import { forwardRef } from "react";
import { cn } from "../utils/cn";

const AppSelect = forwardRef(function AppSelect({
  label,
  id,
  options = [],
  error,
  helperText,
  required = false,
  placeholder,
  className = "",
  selectClassName = "",
  ...props
}, ref) {
  const selectId = id || props.name;

  return (
    <div className={cn("app-field", className)}>
      {label ? (
        <label className="app-field-label" htmlFor={selectId}>
          {label}
          {required ? <span className="app-field-required"> *</span> : null}
        </label>
      ) : null}
      <select ref={ref} id={selectId} className={cn("app-input", error && "app-input--error", selectClassName)} {...props}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {helperText ? <p className="app-field-helper">{helperText}</p> : null}
      {error ? <p className="app-field-error">{error}</p> : null}
    </div>
  );
});

export default AppSelect;
