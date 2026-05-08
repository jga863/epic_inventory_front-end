import { forwardRef } from "react";
import { cn } from "../utils/cn";

const AppTextarea = forwardRef(function AppTextarea({
  label,
  id,
  error,
  helperText,
  required = false,
  className = "",
  textareaClassName = "",
  ...props
}, ref) {
  const textareaId = id || props.name;

  return (
    <div className={cn("app-field", className)}>
      {label ? (
        <label className="app-field-label" htmlFor={textareaId}>
          {label}
          {required ? <span className="app-field-required"> *</span> : null}
        </label>
      ) : null}
      <textarea ref={ref} id={textareaId} className={cn("app-input app-textarea", error && "app-input--error", textareaClassName)} {...props} />
      {helperText ? <p className="app-field-helper">{helperText}</p> : null}
      {error ? <p className="app-field-error">{error}</p> : null}
    </div>
  );
});

export default AppTextarea;
