import { useCallback, useEffect, useRef } from 'react';

export function useStoryRuntime() {
  const runIdRef = useRef(1);
  const timersRef = useRef<number[]>([]);
  const restoreOnceRef = useRef<Record<string, true>>({});

  const bumpRun = useCallback(() => {
    runIdRef.current += 1;
    return runIdRef.current;
  }, []);

  const isActive = useCallback((id: number) => {
    return id === runIdRef.current;
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((x) => x !== id);
      fn();
    }, ms);

    timersRef.current.push(id);
    return id;
  }, []);

  const cancel = useCallback((id: number) => {
    window.clearTimeout(id);
    timersRef.current = timersRef.current.filter((x) => x !== id);
  }, []);

  const cancelAll = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const sleep = useCallback(
    (ms: number, runId: number) =>
      new Promise<boolean>((resolve) => {
        schedule(() => resolve(isActive(runId)), ms);
      }),
    [schedule, isActive]
  );

  useEffect(() => {
    return () => {
      cancelAll();
    };
  }, [cancelAll]);

  return {
    runIdRef,
    bumpRun,
    isActive,
    schedule,
    cancel,
    cancelAll,
    sleep,
    restoreOnceRef,
  };
}