"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Locale, Localized } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  /** Pick the current-locale string from a localized record. */
  l: (value: Localized) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dict: getDictionary(locale),
      l: (v) => v[locale],
    }),
    [locale]
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
