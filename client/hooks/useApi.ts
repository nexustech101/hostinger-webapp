import { useState, useCallback } from "react";
import { apiClient, type ApiResponse } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for making API calls with loading and error states
 * 
 * @example
 * const { data, loading, error, execute } = useApi<WalletData>();
 * 
 * const fetchWallet = useCallback(() => {
 *   execute(async () => apiClient.getWallet('wallet-id'));
 * }, [execute]);
 */
export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
          return response.data;
        } else {
          const error = response.error || "An error occurred";
          setState({ data: null, loading: false, error });
          throw new Error(error);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown error";
        setState({ data: null, loading: false, error });
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}

/**
 * Custom hook for list data with pagination
 */
export function useApiList<T = unknown>() {
  const [state, setState] = useState<
    UseApiState<T[]> & { total: number; page: number }
  >({
    data: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T[]>>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiCall();

        if (response.success && Array.isArray(response.data)) {
          setState((prev) => ({
            ...prev,
            data: response.data as T[],
            loading: false,
            error: null,
          }));
          return response.data;
        } else {
          const error = response.error || "An error occurred";
          setState((prev) => ({ ...prev, loading: false, error }));
          throw new Error(error);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown error";
        setState((prev) => ({ ...prev, loading: false, error }));
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    execute,
    reset: () => ({
      data: null,
      loading: false,
      error: null,
      total: 0,
      page: 1,
    }),
  };
}
