import { cn } from "../utils/cn";

const toneMap = {
  success: "app-toast--success",
  error: "app-toast--error",
  warning: "app-toast--warning",
  info: "app-toast--info",
};

function AppToast({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className="app-toast-stack" aria-live="polite" aria-atomic="true">
      <div className={cn("app-toast", toneMap[toast.type] || toneMap.info)}>
        <span className="app-toast-title">{toast.type || "info"}</span>
        <span className="app-toast-message">{toast.message}</span>
      </div>
    </div>
  );
}

export default AppToast;
