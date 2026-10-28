import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useSessionState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    try {
      const stored = window.sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The in-memory state remains usable when storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}
