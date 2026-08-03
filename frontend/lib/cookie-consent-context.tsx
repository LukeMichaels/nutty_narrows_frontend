"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
};

const STORAGE_KEY = "nn_cookie_consent";

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
};

type CookieConsentContextValue = {
  consent: CookieConsent;
  hasChosen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Omit<CookieConsent, "necessary">) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

const listeners = new Set<() => void>();

// useSyncExternalStore requires getSnapshot to return a stable reference
// until the store actually changes, so the parsed value is cached and only
// recomputed when persist() (this tab) or a "storage" event (another tab)
// invalidates it.
let cachedSnapshot: CookieConsent | null | undefined;

function computeSnapshot(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONSENT, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

function getSnapshot(): CookieConsent | null {
  if (cachedSnapshot === undefined) {
    cachedSnapshot = computeSnapshot();
  }
  return cachedSnapshot;
}

// No stored consent yet at request time, so the server always renders the
// "not chosen" state; the client corrects this on mount via getSnapshot.
function getServerSnapshot(): CookieConsent | null {
  return null;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cachedSnapshot = undefined;
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  listeners.add(onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    listeners.delete(onStoreChange);
  };
}

function persist(next: CookieConsent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cachedSnapshot = next;
  listeners.forEach((listener) => listener());
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  function acceptAll() {
    persist({ necessary: true, analytics: true });
  }

  function rejectNonEssential() {
    persist({ necessary: true, analytics: false });
  }

  function savePreferences(prefs: Omit<CookieConsent, "necessary">) {
    persist({ necessary: true, ...prefs });
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent: stored ?? DEFAULT_CONSENT,
        hasChosen: stored !== null,
        acceptAll,
        rejectNonEssential,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
