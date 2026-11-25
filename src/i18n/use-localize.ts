"use client";

import zhMap from "./zh-map";
import { localizeByPattern } from "./localize-patterns";
import { useLocale } from "./locale-context";

/**
 * Locale-aware lookup for strings rendered outside JSX text nodes
 * (confirm()/notify() payloads, option labels, page titles).
 *
 * Unlike `<TransText>`, this can be called with any string and returns
 * the English source in the English locale, so both languages stay correct.
 *
 * @example
 *   const localize = useLocalize();
 *   confirm({ title: localize("Delete Peers") });
 */
export function useLocalize() {
  const { locale, mounted } = useLocale();

  return function localize<T>(value: T): T {
    if (!mounted || locale !== "zh" || typeof value !== "string") return value;
    return (zhMap[value] ?? localizeByPattern(value) ?? value) as T;
  };
}

/** Non-hook variant for module-scope code that already knows it is in zh. */
export function localizeText(text: string): string {
  return zhMap[text] ?? localizeByPattern(text) ?? text;
}
