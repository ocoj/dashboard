"use client";

import { useEffect, useRef } from "react";
import zhMap from "./zh-map";
import { useLocale } from "./locale-context";

/**
 * Translates the browser tab title while the locale is Chinese.
 *
 * Page titles come from Next.js `metadata` (`"Peers - NetBird Dashboard"`),
 * which is rendered outside React's reach, so they cannot use `<TransText>`.
 * We split the title on " - " and look each segment up in `zh-map`; segments
 * without an entry (a peer name, an IP) are left as-is.
 */
const translateTitle = (title: string): string =>
  title
    .split(" - ")
    .map((segment) => {
      const trimmed = segment.trim();
      return zhMap[trimmed] ?? trimmed;
    })
    .join(" - ");

export default function TitleTranslator() {
  const { locale, mounted } = useLocale();
  const originalTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;

    const apply = () => {
      const current = document.title;
      if (!current) return;

      if (locale === "zh") {
        const translated = translateTitle(current);
        if (translated !== current) {
          originalTitle.current = current;
          document.title = translated;
        }
        return;
      }

      // Back to English: restore the title Next.js last wrote.
      if (originalTitle.current && current !== originalTitle.current) {
        document.title = originalTitle.current;
        originalTitle.current = undefined;
      }
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [locale, mounted]);

  return null;
}
