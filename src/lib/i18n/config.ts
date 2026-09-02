/**
 * Zirve ships every user-facing string in Turkish and English side by side.
 * A `Localized` value is the atom of that system; `resolve` reads the active
 * side out of it. The active language lives in a React context
 * (`components/i18n/language-provider`) and is persisted to localStorage.
 */
export const LANGUAGES = ["tr", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

/** Language used for SSR and on a visitor's first paint. */
export const DEFAULT_LANGUAGE: Language = "tr";

export const LANGUAGE_LABEL: Record<Language, string> = { tr: "TR", en: "EN" };

/** A string that exists in both supported languages. */
export interface Localized {
  tr: string;
  en: string;
}

/** Read the active side of a Localized, falling back to the other language. */
export function resolve(value: Localized, language: Language): string {
  return value[language] || value[language === "tr" ? "en" : "tr"];
}

/** Type guard, useful when data may hold either a plain string or a Localized. */
export function isLocalized(value: unknown): value is Localized {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Localized).tr === "string" &&
    typeof (value as Localized).en === "string"
  );
}
