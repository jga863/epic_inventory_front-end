import { forwardRef } from "react";
import { cn } from "../utils/cn";

const AppInput = forwardRef(function AppInput({
  label,
  id,
  error,
  helperText,
  required = false,
  className = "",
  inputClassName = "",
  ...props
}, ref) {
  const inputId = id || props.name;

  return (
    <div className={cn("app-field", className)}>
      {label ? (
        <label className="app-field-label" htmlFor={inputId}>
          {label}
          {required ? <span className="app-field-required"> *</span> : null}
        </label>
      ) : null}
      <input ref={ref} id={inputId} className={cn("app-input", error && "app-input--error", inputClassName)} {...props} />
      {helperText ? <p className="app-field-helper">{helperText}</p> : null}
      {error ? <p className="app-field-error">{error}</p> : null}
    </div>
  );
});

export default AppInput;
