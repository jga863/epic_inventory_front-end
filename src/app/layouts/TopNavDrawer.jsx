import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { PRIMARY_NAV_ITEMS } from "../../shared/constants/navigation";
import usePermissions from "../../shared/hooks/usePermissions";

/**
 * Mobile-only slide-over drawer that mirrors the desktop top navigation. Open from the
 * dedicated hamburger in Header on screens narrower than `md`.
 */
function TopNavDrawer({ open, onClose }) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event) => { if (event.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

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
    <div
      className="fixed inset-0 z-[65] flex md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Sections"
    >
      <button
        type="button"
        className="flex-1 bg-[var(--color-overlay)]"
        aria-label="Close navigation"
        onClick={onClose}
      />
      <aside className="flex h-full w-72 max-w-[85vw] flex-col border-l border-[var(--color-border)] bg-[var(--color-surface-strong)] shadow-[var(--shadow-strong)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-4 py-4">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">Sections</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)]"
            aria-label="Close navigation"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/inventory"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default TopNavDrawer;
