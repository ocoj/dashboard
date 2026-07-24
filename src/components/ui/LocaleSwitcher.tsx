"use client";

import Button from "@components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@components/DropdownMenu";
import { cn } from "@utils/helpers";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import {
  useLocale,
  locales,
  type Locale,
  LOCALE_LABELS,
} from "@/i18n/locale-context";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

/**
 * Language switcher for the header.  Uses the lightweight {@link TransText}
 * component and standalone locale context — no `next-intl` dependency.
 */
export default function LocaleSwitcher() {
  const { locale, setLocale, mounted } = useLocale();
  const [open, setOpen] = useState(false);

  if (!mounted) {
    return (
      <Button
        size={"xs"}
        variant={"default-outline"}
        className={cn("!rounded-full h-[38px] w-[38px] !p-0")}
        aria-label={zhMap["Select Language"]}
        disabled
      >
        <GlobeIcon size={18} />
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild={true}>
        <Button
          size={"xs"}
          variant={"default-outline"}
          className={cn(
            "!rounded-full h-[38px] w-[38px] !p-0",
            open && "text-white",
          )}
          aria-label={zhMap["Select Language"]}
        >
          <GlobeIcon size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="text-sm font-normal leading-none text-nb-gray-200 py-1 px-1">
            <TransText>Language</TransText>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((option) => {
          const active = option === locale;
          return (
            <DropdownMenuItem
              key={option}
              onSelect={() => {
                setLocale(option);
                setOpen(false);
              }}
            >
              <div className={"flex gap-3 items-center"}>
                {LOCALE_LABELS[option]}
              </div>
              {active && (
                <DropdownMenuShortcut>
                  <CheckIcon size={16} />
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
