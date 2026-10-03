"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import { Label } from "@components/Label";
import {
  SelectDropdown,
  SelectOption,
} from "@components/select/SelectDropdown";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import * as Tabs from "@radix-ui/react-tabs";
import { LanguagesIcon } from "lucide-react";
import React from "react";
import {
  useLocale,
  locales,
  type Locale,
  LOCALE_LABELS,
} from "@/i18n/locale-context";
import { TransText } from "@/i18n/trans-text";

const options: SelectOption[] = locales.map((locale) => ({
  value: locale,
  label: LOCALE_LABELS[locale],
}));

/**
 * Settings tab for the user's display language.  Uses the lightweight
 * {@link TransText} component and standalone locale context — no `next-intl`.
 */
export default function LanguageTab() {
  const { locale, setLocale } = useLocale();
  const isZh = locale === "zh";

  return (
    <Tabs.Content value={"language"}>
      <div className={"p-default py-6 max-w-2xl"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={isZh ? "设置" : "Settings"}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=language"}
            label={isZh ? "语言" : "Language"}
            icon={<LanguagesIcon size={14} />}
            active
          />
        </Breadcrumbs>
        <h1><TransText>Language</TransText></h1>

        <div className={"flex flex-col gap-4 w-full mt-8"}>
          <div className={"flex flex-col gap-2"}>
            <Label><TransText>Current Language</TransText></Label>
            <SelectDropdown
              value={locale}
              onChange={(value) => setLocale(value as Locale)}
              options={options}
            />
          </div>
          <p className={"text-sm text-nb-gray-400"}>
            <TransText>Choose your preferred language for the dashboard interface.</TransText>
          </p>
        </div>
      </div>
    </Tabs.Content>
  );
}
