"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tv, Flame, Compass, Crown, Info, type LucideIcon } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";
import { scrollToSection, useActiveSection, type SectionId } from "@/lib/sections";
import { LanguageOrb } from "@/components/LanguageSwitcher";

interface Tab {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

/**
 * Floating iOS-style tab bar (Liquid Glass): a capsule of tabs plus a
 * detached circular control, minimizing while scrolling down like Safari.
 */
export function MobileTabBar() {
  const { dict } = useLocale();
  const { videoModal } = useMedia();
  const activeSection = useActiveSection();
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);

  const tabs: Tab[] = [
    { id: "live-tv", label: dict.nav.live, icon: Tv },
    { id: "experience", label: dict.nav.experience, icon: Flame },
    { id: "discover", label: dict.nav.discover, icon: Compass },
    { id: "legends", label: dict.nav.legends, icon: Crown },
    { id: "about", label: dict.nav.about, icon: Info },
  ];

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setCompact(delta > 0 && y > 160);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] transition-opacity duration-300 md:hidden ${
        videoModal ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Soft scrim so the bar stays legible over bright imagery */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void/70 to-transparent"
      />
      <div className="relative mx-auto flex max-w-md items-end gap-2.5">
        <nav
          aria-label={dict.a11y.tabBar}
          className={`glass glass-thick glass-refract flex flex-1 items-stretch rounded-full p-1 transition-[height] duration-300 ${
            compact ? "h-12" : "h-[62px]"
          }`}
        >
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                aria-current={active ? "location" : undefined}
                aria-label={compact ? label : undefined}
                className="glass-press relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full"
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.13] shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                    transition={{ type: "spring", stiffness: 460, damping: 36 }}
                  />
                )}
                <Icon
                  className={`h-[22px] w-[22px] transition-colors ${
                    active ? "text-crimson-bright" : "text-bone"
                  }`}
                  strokeWidth={active ? 2.3 : 1.9}
                  aria-hidden="true"
                />
                {!compact && (
                  <span
                    className={`max-w-full truncate px-1 text-[10px] font-semibold leading-tight tracking-tight ${
                      active ? "text-chalk" : "text-bone"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
        <LanguageOrb compact={compact} />
      </div>
    </div>
  );
}
