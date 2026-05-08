import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCompass, FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { UIContext } from "../../context/uiContext";
import epicLogo from "../../assets/Epic-Logo-square.png";
import { ROUTE_TITLES } from "../../shared/constants/navigation";
import AppButton from "../../shared/components/AppButton";
import TopNavDrawer from "./TopNavDrawer";

const Header = () => {
  const { username, logout } = useAuth();
  const { theme, toggleTheme } = React.useContext(UIContext);
  const location = useLocation();
  const [topNavOpen, setTopNavOpen] = useState(false);

  const pageTitle =
    ROUTE_TITLES.find((item) => location.pathname === item.match || location.pathname.startsWith(`${item.match}/`))
      ?.title || "Inventory";

  return (
    <>
      <header className="app-surface border-b px-4 py-4 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-text)] md:hidden"
              onClick={() => setTopNavOpen(true)}
              type="button"
              aria-label="Open sections menu"
            >
              <FaCompass size={20} />
            </button>
            <img src={epicLogo} alt="Epic Engineering Logo" className="h-12 w-auto object-contain md:h-16" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">Epic Inventory</p>
              <h1 className="truncate text-2xl font-semibold text-[var(--color-text)] md:text-3xl">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <span className="truncate text-sm font-medium text-[var(--color-text-muted)]">{username}</span>
            <AppButton variant="secondary" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
              {theme === "dark" ? "Light" : "Dark"}
            </AppButton>
            <AppButton variant="ghost" size="sm" onClick={logout} title="Logout">
              <FaSignOutAlt size={16} />
              Logout
            </AppButton>
          </div>
        </div>
      </header>
      <TopNavDrawer open={topNavOpen} onClose={() => setTopNavOpen(false)} />
    </>
  );
};

export default Header;
