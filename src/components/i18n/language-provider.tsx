"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { resolve, type Language, type Localized } from "@/lib/i18n/config";
import { ui, type UIDictionary } from "@/lib/i18n/dict";
import {
  getServerSnapshot,
  getSnapshot,
  setLanguage as persistLanguage,
  subscribe,
} from "@/lib/i18n/language-store";

interface LanguageContextValue {
  language: Language;
  setLanguage: (next: Language) => void;
  toggle: () => void;
  /** Chrome strings for the active language. */
  ui: UIDictionary;
  /** Resolve a `Localized` value to the active language. */
  t: (value: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((next: Language) => persistLanguage(next), []);
  const toggle = useCallback(
    () => persistLanguage(language === "tr" ? "en" : "tr"),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggle,
      ui: ui[language],
      t: (localized: Localized) => resolve(localized, language),
    }),
    [language, setLanguage, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}
