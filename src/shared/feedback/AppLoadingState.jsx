import { cn } from "../utils/cn";

function AppLoadingState({ label = "Loading...", compact = false, className = "" }) {
  return (
    <div className={cn("app-loading-state", compact && "app-loading-state--compact", className)}>
      <span className="app-loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default AppLoadingState;
