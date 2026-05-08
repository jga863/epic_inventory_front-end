import { NavLink } from "react-router-dom";
import { PRIMARY_NAV_ITEMS } from "../../shared/constants/navigation";
import usePermissions from "../../shared/hooks/usePermissions";

const baseTabClass =
  "relative inline-flex shrink-0 items-center whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors";
const inactiveClass =
  "text-[var(--color-text-muted)] hover:text-[var(--color-text)]";
const activeClass =
  "text-[var(--color-primary)]";

function PrimaryNav() {
  const { hasPermission, hasAnyPermission } = usePermissions();
  const visibleItems = PRIMARY_NAV_ITEMS.filter((item) => {
    if (item.permission) {
      return hasPermission(item.permission.module, item.permission.action);
    }
    if (item.permissions?.length) {
      return item.requireAny
        ? hasAnyPermission(item.permissions)
        : item.permissions.every(({ module, action }) => hasPermission(module, action));
    }
    return true;
  });

  return (
    <nav
      className="app-surface hidden border-b md:block"
      aria-label="Primary navigation"
    >
      <div className="overflow-x-auto px-4 md:px-8">
        <div className="flex min-w-min items-stretch gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/inventory"}
              className={({ isActive }) =>
                `${baseTabClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)] opacity-100"
                        : "bg-transparent opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default PrimaryNav;
