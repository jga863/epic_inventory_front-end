import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

function SearchableSelect({
  value,
  onChange,
  options = [],
  label,
  required = false,
  placeholder = "Select an option",
  searchPlaceholder = "Type to search...",
  emptyLabel = "No matches",
  error,
  helperText,
  disabled = false,
  autoFocusSearch = true,
  includePlaceholderOption = false,
  className = "",
  name,
  id,
  ...rest
}) {
  const reactId = useId();
  const buttonId = id || name || `searchable-${reactId}`;
  const listboxId = `${buttonId}-listbox`;
  const searchInputId = `${buttonId}-search`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelStyle, setPanelStyle] = useState(null);

  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const optionRefs = useRef([]);

  const normalized = useMemo(
    () => options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)),
    [options]
  );

  const optionsWithPlaceholder = useMemo(() => {
    if (!includePlaceholderOption || !placeholder) return normalized;
    return [{ value: "", label: placeholder }, ...normalized];
  }, [includePlaceholderOption, normalized, placeholder]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return optionsWithPlaceholder;
    return normalized.filter((opt) => String(opt.label || opt.value || "").toLowerCase().includes(q));
  }, [normalized, optionsWithPlaceholder, query]);

  const selectedOption = useMemo(
    () => optionsWithPlaceholder.find((opt) => String(opt.value) === String(value)),
    [optionsWithPlaceholder, value]
  );

  useEffect(() => {
    if (!open) return undefined;
    function handleDown(event) {
      const withinTrigger = wrapperRef.current?.contains(event.target);
      const withinPanel = panelRef.current?.contains(event.target);
      if (!withinTrigger && !withinPanel) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
      return undefined;
    }
    const seedIndex = filtered.findIndex((opt) => String(opt.value) === String(value));
    setActiveIndex(seedIndex >= 0 ? seedIndex : (filtered.length > 0 ? 0 : -1));
    if (autoFocusSearch) {
      const raf = window.requestAnimationFrame(() => searchRef.current?.focus());
      return () => window.cancelAnimationFrame(raf);
    }
    return undefined;
  }, [autoFocusSearch, filtered, open, value]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex((current) => {
      if (filtered.length === 0) return -1;
      if (current < 0 || current >= filtered.length) return 0;
      return current;
    });
  }, [filtered, open]);

  useEffect(() => {
    if (!open) return;
    const el = optionRefs.current[activeIndex];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) {
      setPanelStyle(null);
      return undefined;
    }

    function updatePanelPosition() {
      const trigger = buttonRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const gap = 8;
      const edge = 12;
      const estimatedHeight = Math.min(Math.max(filtered.length, 1) * 40 + 64, 320);
      const spaceBelow = viewportHeight - rect.bottom - edge;
      const spaceAbove = rect.top - edge;
      const openUpward = spaceBelow < Math.min(estimatedHeight, 220) && spaceAbove > spaceBelow;
      const maxHeight = Math.max(Math.min(openUpward ? spaceAbove - gap : spaceBelow - gap, 320), 120);
      const width = Math.min(rect.width, viewportWidth - edge * 2);
      const left = Math.min(Math.max(rect.left, edge), viewportWidth - width - edge);

      setPanelStyle({
        position: "fixed",
        left,
        width,
        maxHeight,
        top: openUpward ? "auto" : rect.bottom + gap,
        bottom: openUpward ? viewportHeight - rect.top + gap : "auto",
      });
    }

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [filtered.length, open]);

  function commit(option) {
    if (!option) return;
    onChange?.(option.value);
    setOpen(false);
    window.requestAnimationFrame(() => buttonRef.current?.focus());
  }

  function handleTriggerKey(event) {
    if (disabled) return;
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleSearchKey(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % Math.max(filtered.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(filtered.length - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) commit(option);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className={cn("app-field relative", className)}>
      {label ? (
        <label htmlFor={buttonId} className="app-field-label">
          {label}
          {required ? <span className="app-field-required"> *</span> : null}
        </label>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        id={buttonId}
        name={name}
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={handleTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-required={required}
        aria-invalid={Boolean(error)}
        className={cn(
          "app-input flex w-full items-center justify-between gap-3 text-left",
          error && "app-input--error",
          disabled && "cursor-not-allowed opacity-60"
        )}
        {...rest}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selectedOption && "text-[var(--color-text-soft)]")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span aria-hidden="true" className="text-[var(--color-text-soft)]">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && panelStyle ? createPortal(
        <div
          ref={panelRef}
          className="z-[80] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-strong)] shadow-[var(--shadow-strong)]"
          style={panelStyle}
        >
          <div className="border-b border-[var(--color-border-subtle)] p-2">
            <input
              ref={searchRef}
              id={searchInputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKey}
              placeholder={searchPlaceholder}
              className="app-input"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 && filtered[activeIndex]
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label || placeholder}
            className="overflow-y-auto py-1"
            style={{ maxHeight: Math.max((panelStyle.maxHeight || 120) - 64, 56) }}
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-[var(--color-text-soft)]" role="presentation">
                {emptyLabel}
              </li>
            ) : (
              filtered.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = String(option.value) === String(value);
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    ref={(el) => { optionRefs.current[index] = el; }}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      commit(option);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm transition",
                      isActive && "bg-[var(--color-primary-soft)] text-[var(--color-text)]",
                      !isActive && "text-[var(--color-text-muted)]"
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected ? <span aria-hidden="true">✓</span> : null}
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      ) : null}

      {helperText ? <p className="app-field-helper">{helperText}</p> : null}
      {error ? <p className="app-field-error">{error}</p> : null}
    </div>
  );
}

export default SearchableSelect;
