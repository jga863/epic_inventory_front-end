import { useRef } from "react";
import { FaThLarge, FaTable } from "react-icons/fa";
import { cn } from "../utils/cn";

const OPTIONS = [
  { value: "table", icon: <FaTable size={12} />, label: "Table" },
  { value: "cards", icon: <FaThLarge size={12} />, label: "Cards" },
];

function ViewModeToggle({ mode, onChange, className = "" }) {
  const groupRef = useRef(null);

  function handleKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const buttons = groupRef.current?.querySelectorAll("[role='radio']") || [];
    if (buttons.length === 0) return;
    const currentIndex = Array.from(buttons).findIndex((btn) => btn === document.activeElement);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = currentIndex >= 0 ? (currentIndex + 1) % buttons.length : 0;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = currentIndex >= 0 ? (currentIndex - 1 + buttons.length) % buttons.length : 0;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    }
    const next = buttons[nextIndex];
    next?.focus();
    const value = next?.dataset.value;
    if (value) onChange(value);
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="View mode"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-1",
        className
      )}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === mode;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            data-value={opt.value}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ViewModeToggle;
