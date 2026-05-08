import { useCallback, useEffect, useState } from "react";

const VALID = new Set(["table", "cards"]);

function storageKey(entityKey) {
  return `epic-inventory-view-mode-${entityKey}`;
}

/**
 * Persisted toggle between table and card grid. Default is "table".
 */
export function useAssetViewMode(entityKey, initial = "table") {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return initial;
    const stored = window.localStorage.getItem(storageKey(entityKey));
    return VALID.has(stored) ? stored : initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey(entityKey), mode);
    }
  }, [entityKey, mode]);

  const setSafe = useCallback((next) => {
    if (VALID.has(next)) setMode(next);
  }, []);

  return [mode, setSafe];
}
