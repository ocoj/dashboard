"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";

/** Supported locales. */
export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Human-readable label for each locale. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_COOKIE_MAX_AGE_DAYS = 365;

type LocaleContextValue = {
  locale: Locale;
  mounted: boolean;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  mounted: false,
  setLocale: () => {},
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

// ---- helpers ----------------------------------------------------------

function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

function matchLocale(tag: string | undefined): Locale | undefined {
  if (!tag) return undefined;
  const lower = tag.toLowerCase();
  if (isSupportedLocale(lower)) return lower;
  const primary = lower.split(/[-_]/)[0];
  if (isSupportedLocale(primary)) return primary;
  return undefined;
}

function detectLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;

  // 1. Cookie (user's last choice)
  const cookie = Cookies.get(LOCALE_COOKIE);
  if (cookie) {
    const matched = matchLocale(cookie);
    if (matched) return matched;
  }

  // 2. Browser language
  const candidates = [...(window.navigator?.languages ?? [])];
  if (window.navigator?.language) candidates.push(window.navigator.language);
  for (const c of candidates) {
    const matched = matchLocale(c);
    if (matched) return matched;
  }

  return defaultLocale;
}

// ---- provider ----------------------------------------------------------

type Props = { children: React.ReactNode };

export default function LocaleProvider({ children }: Props) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  // 在 render 阶段同步设置 dayjs locale，确保子组件（如 LastTimeRow）在
  // 同一次 render 就能拿到正确的 locale，避免 SSR 后英文相对时间不刷新。
  if (locale === "zh") {
    dayjs.locale("zh-cn");
  } else {
    dayjs.locale("en");
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    Cookies.set(LOCALE_COOKIE, next, {
      expires: LOCALE_COOKIE_MAX_AGE_DAYS,
      sameSite: "lax",
      path: "/",
    });
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, mounted, setLocale }),
    [locale, mounted, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}
