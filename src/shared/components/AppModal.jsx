import { useEffect, useRef } from "react";
import AppButton from "./AppButton";
import { cn } from "../utils/cn";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function AppModal({
  open = false,
  title,
  subtitle,
  children,
  onClose,
  footer,
  width = "max-w-3xl",
}) {
  const shellRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const shell = shellRef.current;
      if (!shell) return;
      const focusables = shell.querySelectorAll(FOCUSABLE_SELECTOR);
      const initial = Array.from(focusables).find((el) => !el.hasAttribute("data-modal-close"));
      (initial || focusables[0] || shell).focus?.();
    };

    const raf = window.requestAnimationFrame(focusFirst);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }
      if (event.key !== "Tab") return;

      const shell = shellRef.current;
      if (!shell) return;
      const focusables = Array.from(shell.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
      if (focusables.length === 0) {
        event.preventDefault();
        shell.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      const previous = previouslyFocusedRef.current;
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="app-modal-backdrop" onMouseDown={onClose} aria-hidden="false">
      <div
        ref={shellRef}
        className={cn("app-modal-shell", width)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="app-modal-header">
          <div>
            <h2 className="app-modal-title">{title}</h2>
            {subtitle ? <p className="app-modal-subtitle">{subtitle}</p> : null}
          </div>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-modal-close="true"
            aria-label="Close dialog"
          >
            Close
          </AppButton>
        </div>
        <div className="app-modal-content">{children}</div>
        {footer ? <div className="app-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export default AppModal;
