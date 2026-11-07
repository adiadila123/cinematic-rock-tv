"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LOCALES, LOCALE_COOKIE, otherLocale, type Locale } from "@/i18n/config";
import { useLocale } from "@/context/LocaleContext";

function useSwitchLocale() {
  const router = useRouter();
  return (e: React.MouseEvent<HTMLAnchorElement>, next: Locale) => {
    // Let modified clicks (new tab, etc.) behave like a normal link
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${next}`, { scroll: false });
  };
}

/** Segmented RO | EN control for the desktop header. */
export function LanguageSegmented() {
  const { locale, dict } = useLocale();
  const switchLocale = useSwitchLocale();

  return (
    <div
      role="group"
      aria-label={dict.a11y.languageSwitch}
      className="glass glass-thin relative flex items-center rounded-full p-1"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}`}
            hrefLang={code}
            scroll={false}
            aria-current={active ? "true" : undefined}
            aria-label={active ? undefined : dict.a11y.switchTo}
            onClick={(e) => {
              if (active) e.preventDefault();
              else switchLocale(e, code);
            }}
            className={`relative z-10 inline-flex h-8 min-w-[2.75rem] items-center justify-center rounded-full px-3 font-condensed text-sm font-bold uppercase tracking-wider transition-colors ${
              active ? "text-chalk" : "text-bone hover:text-chalk"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {code}
          </Link>
        );
      })}
    </div>
  );
}

/** Circular glass button that sits beside the iOS-style tab bar. */
export function LanguageOrb({ compact }: { compact: boolean }) {
  const { locale, dict } = useLocale();
  const next = otherLocale(locale);
  const switchLocale = useSwitchLocale();

  return (
    <Link
      href={`/${next}`}
      hrefLang={next}
      scroll={false}
      aria-label={dict.a11y.switchTo}
      onClick={(e) => switchLocale(e, next)}
      className={`glass glass-thick glass-refract glass-press flex shrink-0 flex-col items-center justify-center rounded-full text-chalk transition-[width,height] duration-300 ${
        compact ? "h-12 w-12" : "h-[62px] w-[62px]"
      }`}
    >
      <span className="font-condensed text-base font-bold uppercase leading-none tracking-wider">
        {next}
      </span>
      {!compact && (
        <span className="mt-0.5 text-[10px] font-medium uppercase leading-none text-bone">
          {locale}
        </span>
      )}
    </Link>
  );
}
