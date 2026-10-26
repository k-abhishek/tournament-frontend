import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  tournamentApi,
  gameApi,
  userApi,
  TournamentListParams,
  UserListParams,
} from '@/services/api.service';
import { toast } from '@/hooks/use-toast';

// ── Lightweight Reactive Query Bus for Cache Invalidation ─────────────
type InvalidationListener = () => void;
const queryBus = new Map<string, Set<InvalidationListener>>();

/**
 * Triggers re-fetch for any active Axios hooks subscribed to keys starting with prefix.
 */
export const invalidateQueries = (keyPrefix: string) => {
  for (const [key, listeners] of queryBus.entries()) {
    if (key.startsWith(keyPrefix)) {
      listeners.forEach((listener) => listener());
    }
  }
};

/**
 * Generic Axios Query Hook
 * Replaces @tanstack/react-query useQuery with native React state & Axios.
 */
function useAxiosQuery<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  enabled: boolean = true
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [enabled, fetchFn]);

  // Subscribe to query bus invalidation events
  useEffect(() => {
    if (!queryBus.has(cacheKey)) {
      queryBus.set(cacheKey, new Set());
    }
    const listenerSet = queryBus.get(cacheKey)!;
    listenerSet.add(refetch);

    return () => {
      listenerSet.delete(refetch);
      if (listenerSet.size === 0) {
        queryBus.delete(cacheKey);
      }
    };
  }, [cacheKey, refetch]);

  // Initial and reactive fetch on dependency change
  useEffect(() => {
    if (!enabled) return;

    let ignore = false;
    // oxlint-disable-next-line react/set-state-in-effect
    setIsLoading(true);

    fetchFn()
      .then((result) => {
        if (!ignore) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [enabled, fetchFn]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Generic Axios Mutation Hook
 * Replaces @tanstack/react-query useMutation with native async state.
 */
function useAxiosMutation<TPayload, TResult>(
  mutationFn: (payload: TPayload) => Promise<TResult>,
  options?: {
    onSuccess?: (data: TResult, variables: TPayload) => void;
    onError?: (error: unknown, variables: TPayload) => void;
  }
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<TResult | undefined>(undefined);

  const mutateAsync = useCallback(
    async (variables?: TPayload): Promise<TResult> => {
      setIsPending(true);
      setError(null);
      try {
        const result = await mutationFn(variables as TPayload);
        setData(result);
        options?.onSuccess?.(result, variables as TPayload);
        return result;
      } catch (err) {
        setError(err);
        options?.onError?.(err, variables as TPayload);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, options]
  );

  const mutate = useCallback(
    (variables?: TPayload) => {
      mutateAsync(variables).catch(() => {});
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    isPending,
    error,
    data,
  };
}

// ── Tournaments Queries ───────────────────────────────────────────────

export const useTournaments = (params?: TournamentListParams) => {
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const fetchFn = useCallback(() => tournamentApi.list(params), [paramsKey]);

  return useAxiosQuery(`tournaments:${paramsKey}`, fetchFn, true);
};

export const useTournament = (slug?: string) => {
  const fetchFn = useCallback(() => tournamentApi.getBySlug(slug!), [slug]);
  return useAxiosQuery(`tournament:${slug}`, fetchFn, Boolean(slug));
};

export const useBracket = (slug?: string) => {
  const fetchFn = useCallback(() => tournamentApi.getBracket(slug!), [slug]);
  return useAxiosQuery(`bracket:${slug}`, fetchFn, Boolean(slug));
};

export const useParticipants = (slug?: string) => {
  const fetchFn = useCallback(() => tournamentApi.getParticipants(slug!), [slug]);
  return useAxiosQuery(`participants:${slug}`, fetchFn, Boolean(slug));
};

// ── Tournaments Mutations ─────────────────────────────────────────────

export const useCreateTournament = () => {
  return useAxiosMutation(
    (payload: Record<string, unknown>) => tournamentApi.create(payload),
    {
      onSuccess: () => {
        invalidateQueries('tournaments');
        toast.success('Tournament created successfully!');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.error ?? 'Failed to create tournament'
        );
      },
    }
  );
};

export const useRegisterForTournament = (id?: string) => {
  return useAxiosMutation(
    () => tournamentApi.register(id!),
    {
      onSuccess: () => {
        invalidateQueries('participants');
        invalidateQueries('tournament');
        toast.success('Registered successfully!');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.error ?? 'Registration failed'
        );
      },
    }
  );
};

export const useUpdateTournament = () => {
  return useAxiosMutation(
    ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      tournamentApi.update(id, payload),
    {
      onSuccess: (data: any) => {
        invalidateQueries('tournaments');
        if (data?.tournament?.slug) {
          invalidateQueries(`tournament:${data.tournament.slug}`);
        } else {
          invalidateQueries('tournament');
        }
        toast.success('Tournament updated!');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ??
            err.response?.data?.error ??
            'Failed to update tournament'
        );
      },
    }
  );
};

export const useDeleteTournament = () => {
  return useAxiosMutation(
    (id: string) => tournamentApi.remove(id),
    {
      onSuccess: () => {
        invalidateQueries('tournaments');
        toast.success('Tournament deleted successfully');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ??
            err.response?.data?.error ??
            'Failed to delete tournament'
        );
      },
    }
  );
};

export const useAddModerator = (tournamentSlug: string) => {
  return useAxiosMutation(
    ({ id, userId }: { id: string; userId: string }) =>
      tournamentApi.addModerator(id, userId),
    {
      onSuccess: () => {
        invalidateQueries(`tournament:${tournamentSlug}`);
        toast.success('Moderator added successfully');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ??
            err.response?.data?.error ??
            'Failed to add moderator'
        );
      },
    }
  );
};

export const useRemoveModerator = (tournamentSlug: string) => {
  return useAxiosMutation(
    ({ id, userId }: { id: string; userId: string }) =>
      tournamentApi.removeModerator(id, userId),
    {
      onSuccess: () => {
        invalidateQueries(`tournament:${tournamentSlug}`);
        toast.success('Moderator removed');
      },
      onError: (err: any) => {
        toast.error(
          err.response?.data?.message ??
            err.response?.data?.error ??
            'Failed to remove moderator'
        );
      },
    }
  );
};

// ── Games ─────────────────────────────────────────────────────────────

export const useGames = () => {
  const fetchFn = useCallback(() => gameApi.list(), []);
  return useAxiosQuery('games', fetchFn, true);
};

// ── Users ─────────────────────────────────────────────────────────────

export const useUsers = (params?: UserListParams) => {
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const fetchFn = useCallback(() => userApi.list(params), [paramsKey]);
  return useAxiosQuery(`users:${paramsKey}`, fetchFn, true);
};
