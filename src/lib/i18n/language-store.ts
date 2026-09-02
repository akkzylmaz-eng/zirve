import { DEFAULT_LANGUAGE, type Language } from "./config";

/**
 * The language preference is external state: it lives in localStorage, it can
 * change from another tab, and the server cannot see it. That makes it a job
 * for `useSyncExternalStore` rather than for `useState` + an effect. React
 * reads the server snapshot during SSR, swaps to the client snapshot on
 * hydration, and re-reads whenever we publish a change. No cascading render,
 * and no window of wrong markup.
 */

const STORAGE_KEY = "zirve.language";

type Listener = () => void;
const listeners = new Set<Listener>();

let snapshot: Language = DEFAULT_LANGUAGE;
let hydrated = false;

function read(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "tr" || stored === "en" ? stored : DEFAULT_LANGUAGE;
  } catch {
    // Private browsing and some embedded webviews throw on access.
    return DEFAULT_LANGUAGE;
  }
}

export function subscribe(listener: Listener): () => void {
  // The first subscriber pulls the persisted value in. Doing it here rather
  // than at module scope keeps the module import-safe on the server.
  if (!hydrated) {
    hydrated = true;
    const stored = read();
    if (stored !== snapshot) {
      snapshot = stored;
      document.documentElement.lang = stored;
    }
  }

  listeners.add(listener);
  // Another tab changing the preference should move this one too.
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  const next = event.newValue;
  if (next === "tr" || next === "en") publish(next);
}

/** Client snapshot: must be referentially stable between renders. */
export function getSnapshot(): Language {
  return snapshot;
}

/** Server snapshot: there is no storage, so it is always the default. */
export function getServerSnapshot(): Language {
  return DEFAULT_LANGUAGE;
}

export function setLanguage(next: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Persisting is best-effort; the in-memory switch still works.
  }
  publish(next);
}

function publish(next: Language): void {
  if (next === snapshot) return;
  snapshot = next;
  document.documentElement.lang = next;
  for (const listener of listeners) listener();
}
