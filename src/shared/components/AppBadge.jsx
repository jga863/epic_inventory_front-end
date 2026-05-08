import { cn } from "../utils/cn";

const variantMap = {
  neutral: "app-badge--neutral",
  primary: "app-badge--primary",
  success: "app-badge--success",
  warning: "app-badge--warning",
  danger: "app-badge--danger",
};

function AppBadge({ children, variant = "neutral", className = "" }) {
  return <span className={cn("app-badge", variantMap[variant] || variantMap.neutral, className)}>{children}</span>;
}

export default AppBadge;
