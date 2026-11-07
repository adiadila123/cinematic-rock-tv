"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Radio } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { scrollToSection, useActiveSection } from "@/lib/sections";
import { LanguageSegmented } from "@/components/LanguageSwitcher";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-9 w-9 rounded-[12px]" : "h-10 w-10 rounded-[14px]";
  return (
    <span
      className={`glass glass-tint-crimson relative flex ${box} items-center justify-center`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-chalk">
        <path
          d="M13 2L4 14H11L10 22L20 10H13L13 2Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Navbar() {
  const { dict } = useLocale();
  const activeSection = useActiveSection();
  const [isScrolled, setIsScrolled] = useState(false);
  // Page progress, drawn along the bottom edge of the bar. A light spring
  // tracks scroll speed but irons out mouse-wheel stepping.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 400, damping: 50, mass: 0.2 });

  const navItems = [
    { id: "live-tv", label: dict.nav.live },
    { id: "experience", label: dict.nav.experience },
    { id: "discover", label: dict.nav.discover },
    { id: "legends", label: dict.nav.legends },
    { id: "about", label: dict.nav.about },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-4">
      <div
        className={`glass glass-refract pointer-events-auto mx-auto flex max-w-[1240px] items-center justify-between gap-3 rounded-full py-2 pl-2 pr-2 transition-[background-color,box-shadow,padding] duration-500 sm:pl-3 ${
          isScrolled ? "glass-thick" : "glass-thin"
        }`}
      >
        {/* Inset to the capsule's straight edge so the line never crosses the rounded ends */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
          <motion.span
            style={{ scaleX: progress }}
            className="block h-full origin-left rounded-full bg-gradient-to-r from-crimson via-crimson-bright to-tungsten shadow-[0_0_10px_rgba(220,20,60,0.7)]"
          />
        </span>
        <a
          href="#intro"
          onClick={(e) => handleNavClick(e, "intro")}
          className="group flex items-center gap-3 rounded-full pr-2 text-chalk"
          aria-label={dict.a11y.homeLabel}
        >
          <BrandMark />
          <span className="flex flex-col">
            <span className="font-display text-xl leading-none tracking-wider text-chalk sm:text-2xl">
              ROCK TV
            </span>
            <span className="font-mono text-[10px] font-medium tracking-wider text-bone tabular-data sm:text-[11px]">
              {dict.nav.tagline}
            </span>
          </span>
        </a>

        <nav aria-label={dict.a11y.primaryNav} className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-full px-3.5 py-2 font-condensed text-[15px] font-bold uppercase tracking-wider transition-colors duration-200 lg:px-4 ${
                  isActive ? "text-chalk" : "text-bone hover:text-chalk"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.11] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSegmented />
          </div>
          <a
            href="#live-tv"
            onClick={(e) => handleNavClick(e, "live-tv")}
            className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk sm:px-5 sm:text-base"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chalk/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-chalk" />
            </span>
            <Radio className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            <span>{dict.nav.onAir}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
