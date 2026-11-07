export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ro";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export type Localized = Record<Locale, string>;

export const OG_LOCALE: Record<Locale, string> = {
  ro: "ro_RO",
  en: "en_US",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ro" || value === "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ro" ? "en" : "ro";
}
