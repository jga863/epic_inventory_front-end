import { cn } from "../utils/cn";

const variantClasses = {
  primary: "app-button app-button--primary",
  secondary: "app-button app-button--secondary",
  ghost: "app-button app-button--ghost",
  danger: "app-button app-button--danger",
};

const sizeClasses = {
  sm: "app-button--sm",
  md: "app-button--md",
  lg: "app-button--lg",
};

function AppButton({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        block && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default AppButton;
