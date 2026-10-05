import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Menjalankan fetcher({ signal }) yang mengembalikan { data, meta }.
 * Request lama dibatalkan saat deps berubah atau komponen dilepas,
 * dan data terakhir tetap ditampilkan selama memuat ulang.
 */
export function useData(fetcher, deps = [], { enabled = true } = {}) {
  const fetcherRef = useRef(fetcher);
  useEffect(() => { fetcherRef.current = fetcher; });

  const [state, setState] = useState({ data: null, meta: null, loading: enabled, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, loading: false }));
      return undefined;
    }
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcherRef.current({ signal: controller.signal })
      .then((res) => {
        if (controller.signal.aborted) return;
        setState({ data: res?.data ?? null, meta: res?.meta ?? null, loading: false, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.kind === 'aborted') return;
        setState((s) => ({ ...s, loading: false, error }));
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, reload };
}

/** Membungkus operasi tulis (POST/PUT/PATCH/DELETE) dengan status loading & error. */
export function useMutation(mutator) {
  const mutatorRef = useRef(mutator);
  useEffect(() => { mutatorRef.current = mutator; });

  const [state, setState] = useState({ loading: false, error: null });

  const mutate = useCallback(async (...args) => {
    setState({ loading: true, error: null });
    try {
      const res = await mutatorRef.current(...args);
      setState({ loading: false, error: null });
      return res;
    } catch (error) {
      setState({ loading: false, error });
      throw error;
    }
  }, []);

  const reset = useCallback(() => setState({ loading: false, error: null }), []);

  return { ...state, mutate, reset };
}
