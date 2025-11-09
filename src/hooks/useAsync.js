import { useCallback, useEffect, useRef, useState } from "react";

export function useAsync(asyncFn, deps = [], { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(immediate));
  const callIdRef = useRef(0);

  const execute = useCallback(async () => {
    const callId = ++callIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (callId === callIdRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (callId === callIdRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (callId === callIdRef.current) {
        setIsLoading(false);
      }
    }
  }, deps);

  useEffect(() => {
    if (!immediate) return;
    let cancelled = false;
    execute().catch(() => {
      if (!cancelled) {
        // error already stored
      }
    });
    return () => {
      cancelled = true;
    };
  }, [execute, immediate]);

  return { data, error, isLoading, refetch: execute };
}

export default useAsync;