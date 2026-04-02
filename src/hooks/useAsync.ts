import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<TResult, TArgs extends unknown[]>(
  asyncFn: (...args: TArgs) => Promise<TResult>
) {
  const [state, setState] = useState<AsyncState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "Something went wrong";
        setState({ data: null, loading: false, error: message });
        throw err;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
}
