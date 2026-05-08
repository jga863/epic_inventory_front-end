import { cn } from "../utils/cn";

/**
 * Empty-state block. Optionally render an `illustration` (icon, image, or arbitrary node)
 * inside a soft circular container above the title.
 */
function AppEmptyState({ title, description, action, illustration, compact = false, className = "" }) {
  return (
    <div className={cn("app-empty-state", compact && "app-empty-state--compact", className)}>
      {illustration ? (
        <span className="app-empty-state-illustration" aria-hidden="true">
          {illustration}
        </span>
      ) : null}
      <p className="app-empty-state-title">{title}</p>
      {description ? <p className="app-empty-state-description">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default AppEmptyState;
