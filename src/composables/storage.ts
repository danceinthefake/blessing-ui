/**
 * `localStorage` that never throws. Private windows, blocked site data, and a full disk all make
 * the real one throw, and a component must work without it. Read after mount, never during
 * server rendering, so the server and the first client render agree.
 */
export function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns `false` when the value could not be saved. */
export function writeStore(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStore(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* nothing to remove, or blocked */
  }
}

/** A stored JSON value, or `null` when it is missing, damaged, or blocked. */
export function readJson<T = unknown>(key: string): T | null {
  const raw = readStore(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const writeJson = (key: string, value: unknown) => writeStore(key, JSON.stringify(value));
