"use client";

import React from "react";
import translations from "./trans-map";
import { useLocale } from "./locale-context";

type TransTextProps = {
  /** The English text to translate. */
  children: string;
  /**
   * When provided, this text is displayed in the English locale instead of
   * `children`.  Useful when the English version displayed should differ
   * from the lookup key (e.g. a longer description).
   */
  en?: string;
};

/**
 * Inline translation component.  Wraps any English UI string and renders its
 * Chinese counterpart when the active locale is `zh`, falling back to the
 * English source text otherwise.
 *
 * @example
 *   <Button><TransText>Add Peer</TransText></Button>
 *   // zh → "添加节点"
 *   // en → "Add Peer"
 *
 * The component uses exact string matching against the auto-generated
 * translation map (`trans-map.ts`).  If a translation is not found it
 * renders the English source text unchanged.
 */
export function TransText({ children, en }: TransTextProps) {
  const { locale, mounted } = useLocale();

  // During SSR / pre-hydration, render the English source to avoid a flash
  // of untranslated content.
  if (!mounted) return <>{children}</>;

  if (locale === "zh") {
    const key = children;
    const translated = translations[key];
    if (translated) {
      // ICU plural forms: next-intl style `{count, plural, ...}` — we pass
      // them through as-is since the upstream dials handle plural logic
      // elsewhere (e.g. in `useMemo`-driven column headers).  Pure text
      // replacements happen here.
      return <>{translated}</>;
    }
    // Missing translation — render the English source with a debug marker
    // in development so missing entries are easy to spot.
    if (process.env.NODE_ENV === "development") {
      return (
        <span title={`MISSING: "${children}"`} className="!border !border-dashed !border-orange-500">
          {children}
        </span>
      );
    }
  }

  // English locale (or fallback): use the explicit `en` prop if provided,
  // otherwise the children text.
  return <>{en ?? children}</>;
}

/**
 * Convenience component that forces Chinese rendering regardless of locale.
 * Useful for debugging or for content that should always be in Chinese.
 */
export function TransTextZh({ children }: { children: string }) {
  const translated = translations[children];
  return <>{translated ?? children}</>;
}

export default TransText;
