import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Holds filter values for an asset module, resetting page to 0 on any change.
 * `searchKey` is debounced (250ms) so typing doesn't refire the query on every keystroke.
 */
export function useAssetFilters(initial = {}, { searchKey = "search", debounceMs = 250 } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const resolvedInitial = useMemo(() => readInitialValues(initial, searchParams), [initial, searchParams]);
  const [values, setValues] = useState(resolvedInitial);
  const [debouncedSearch, setDebouncedSearch] = useState(resolvedInitial[searchKey] || "");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(values[searchKey] || ""), debounceMs);
    return () => clearTimeout(handle);
  }, [values, searchKey, debounceMs]);

  const setFilter = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const reset = useCallback(() => setValues(initial), [initial]);

  const effective = useMemo(() => ({ ...values, [searchKey]: debouncedSearch }), [values, searchKey, debouncedSearch]);

  useEffect(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.keys(initial).forEach((key) => next.delete(key));
      Object.entries(effective).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === false) {
          return;
        }
        next.set(key, typeof value === "boolean" ? String(value) : value);
      });
      return next;
    }, { replace: true });
  }, [effective, initial, setSearchParams]);

  const activeCount = useMemo(
    () => Object.values(effective).filter((v) => v !== undefined && v !== null && v !== "" && v !== false).length,
    [effective]
  );

  return { values, effective, setFilter, reset, activeCount };
}

function readInitialValues(initial, searchParams) {
  const resolved = { ...initial };

  Object.entries(initial).forEach(([key, fallback]) => {
    const raw = searchParams.get(key);
    if (raw == null) {
      return;
    }
    if (typeof fallback === "boolean") {
      resolved[key] = raw === "true";
    } else {
      resolved[key] = raw;
    }
  });

  return resolved;
}
