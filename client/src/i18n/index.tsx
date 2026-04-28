/**
 * AI Sprint — Internationalization (i18n) System
 *
 * Exports:
 *  - LanguageProvider  — wrap your app with this
 *  - useLanguage       — access language state and helpers
 *  - t()               — convenience alias (after calling useLanguage)
 *
 * Usage:
 *   const { t, language, setLanguage } = useLanguage();
 *   t("nav.journey")                       → "28-Day Journey"
 *   t("home.pctComplete", { pct: 75 })    → "75% complete"
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { apiRequest } from "@/lib/queryClient";

// ─── Translation file imports ────────────────────────────────────────────────
import en from "./translations/en";
import zhTW from "./translations/zh-TW";
import zhCN from "./translations/zh-CN";
import es from "./translations/es";
import fr from "./translations/fr";
import pt from "./translations/pt";
import ja from "./translations/ja";
import ko from "./translations/ko";
import ar from "./translations/ar";

// ─── Types ───────────────────────────────────────────────────────────────────
export type LanguageCode =
  | "en"
  | "zh-TW"
  | "zh-CN"
  | "es"
  | "fr"
  | "pt"
  | "ja"
  | "ko"
  | "ar";

export type TranslationMap = Record<string, string>;

export interface LanguageContextValue {
  /** Active language code, e.g. "en" or "zh-TW" */
  language: LanguageCode;
  /**
   * Change the active language.
   * If `isLoggedIn` is true, persists the choice to the backend.
   */
  setLanguage: (code: LanguageCode) => Promise<void>;
  /**
   * Translate a dot-notation key, with optional template interpolation.
   * Falls back to English if the key is missing in the current language.
   * Returns the key itself if it's missing in both.
   *
   * @example
   * t("nav.journey")                          // "28-Day Journey"
   * t("home.pctComplete", { pct: 42 })        // "42% complete"
   */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Whether the initial language has been loaded (from API or default) */
  ready: boolean;
}

// ─── Translation catalogue ───────────────────────────────────────────────────
const catalogue: Record<LanguageCode, TranslationMap> = {
  en,
  "zh-TW": zhTW,
  "zh-CN": zhCN,
  es,
  fr,
  pt,
  ja,
  ko,
  ar,
};

// ─── Context ─────────────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Interpolation helper ────────────────────────────────────────────────────
/**
 * Replaces {key} placeholders in a string with the corresponding values.
 * e.g. interpolate("Hello {name}!", { name: "Alex" }) → "Hello Alex!"
 */
function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

// ─── Core translate function (not React-dependent) ───────────────────────────
function translate(
  language: LanguageCode,
  key: string,
  vars?: Record<string, string | number>
): string {
  const langMap = catalogue[language];
  const enMap = catalogue["en"];

  const raw = langMap?.[key] ?? enMap?.[key] ?? key;
  return interpolate(raw, vars);
}

// ─── LanguageProvider ────────────────────────────────────────────────────────
interface LanguageProviderProps {
  children: ReactNode;
  /** Pass `true` when a user session is active so the provider fetches/saves to the API */
  isLoggedIn?: boolean;
}

export function LanguageProvider({
  children,
  isLoggedIn = false,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [ready, setReady] = useState(false);

  // On mount: load saved language from backend (if logged in) or default to "en"
  useEffect(() => {
    if (!isLoggedIn) {
      setReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest("GET", "/api/settings/language");
        if (!cancelled && res.ok) {
          const data = (await res.json()) as { language: LanguageCode };
          if (data?.language && catalogue[data.language]) {
            setLanguageState(data.language);
          }
        }
      } catch {
        // Network error — silently fall back to "en"
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const setLanguage = useCallback(
    async (code: LanguageCode) => {
      if (!catalogue[code]) {
        console.warn(`[i18n] Unknown language code: "${code}"`);
        return;
      }
      setLanguageState(code);

      if (!isLoggedIn) return;

      try {
        await apiRequest("POST", "/api/settings/language", { language: code });
      } catch {
        // Non-fatal — the UI is already updated optimistically
        console.warn("[i18n] Failed to persist language preference to server.");
      }
    },
    [isLoggedIn]
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language]
  );

  const value: LanguageContextValue = { language, setLanguage, t, ready };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── useLanguage hook ────────────────────────────────────────────────────────
/**
 * Returns the language context: { language, setLanguage, t, ready }
 * Must be used inside a <LanguageProvider>.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a <LanguageProvider>");
  }
  return ctx;
}

// ─── Exports ─────────────────────────────────────────────────────────────────
export { LanguageProvider as default };
export type { LanguageProviderProps };

/**
 * List of all supported language codes with their display names.
 * Useful for building a language-switcher UI.
 */
export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en",    label: "English" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "es",    label: "Español" },
  { code: "fr",    label: "Français" },
  { code: "pt",    label: "Português" },
  { code: "ja",    label: "日本語" },
  { code: "ko",    label: "한국어" },
  { code: "ar",    label: "العربية" },
];
