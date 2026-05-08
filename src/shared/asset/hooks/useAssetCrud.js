import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DEFAULT_PAGE_SIZE = 10;

/**
 * Centralizes server state, mutations and selection for an asset module.
 *
 * Required from `config`:
 *  - entityKey  string used to scope query cache keys
 *  - api        object with { listPaged({page,size,...filters}), getById(id), create(payload), update(id, payload), remove(id) }
 *
 * Returns:
 *  - items, totalPages, isLoading, isError, error, refetch
 *  - selectedId, selectedRecord, select, clearSelection
 *  - page, setPage, pageSize
 *  - create.mutate, update.mutate, remove.mutate (TanStack mutation objects)
 */
export function useAssetCrud(config, { page, pageSize = DEFAULT_PAGE_SIZE, filters = {} } = {}) {
  const queryClient = useQueryClient();
  const { entityKey, api } = config;
  const [selectedId, setSelectedId] = useState(null);

  const listKey = [entityKey, "list", { page, pageSize, ...filters }];
  const list = useQuery({
    queryKey: listKey,
    queryFn: ({ signal }) => api.listPaged({ page, size: pageSize, ...filters, signal }),
    placeholderData: (previous) => previous,
  });

  const detail = useQuery({
    queryKey: [entityKey, "detail", selectedId],
    queryFn: ({ signal }) => api.getById(selectedId, { signal }),
    enabled: selectedId != null,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [entityKey] });
  }, [queryClient, entityKey]);

  const createMutation = useMutation({
    mutationFn: (payload) => api.create(payload),
    onSuccess: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.update(id, payload),
    onSuccess: () => invalidate(),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => invalidate(),
  });

  const items = list.data?.content || [];
  const totalPages = list.data?.totalPages || 0;

  return {
    items,
    totalPages,
    isLoading: list.isLoading,
    isFetching: list.isFetching,
    isError: list.isError,
    error: list.error,
    refetch: list.refetch,
    selectedId,
    selectedRecord: detail.data || null,
    selectedLoading: detail.isLoading,
    select: setSelectedId,
    clearSelection: () => setSelectedId(null),
    create: createMutation,
    update: updateMutation,
    remove: removeMutation,
    invalidate,
  };
}
