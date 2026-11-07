"use client";

import React from "react";
import { Tv, ArrowUp, ExternalLink } from "lucide-react";
import { STREAM_SOURCE_URL } from "@/data/rockTvData";
import { useLocale } from "@/context/LocaleContext";
import { scrollToSection } from "@/lib/sections";
import { BrandMark } from "@/components/Navbar";
import { ExperienceControls } from "@/components/MotionPrompt";

export function FinalExperienceFooter() {
  const { dict } = useLocale();
  const t = dict.footer;

  const links = [
    { id: "intro", label: t.linkIntro },
    { id: "live-tv", label: t.linkLive },
    { id: "experience", label: t.linkExperience },
    { id: "discover", label: t.linkDiscover },
    { id: "legends", label: t.linkLegends },
  ];

  return (
    <footer id="about" aria-labelledby="final-statement-heading" className="pb-tabbar relative text-chalk">
      <div className="relative overflow-hidden py-24 sm:py-32">
        <img
          src="/images/hero-arena-stage.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-30"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,6,8,1) 0%, rgba(6,6,8,0.6) 45%, rgba(6,6,8,0.95) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2
                id="final-statement-heading"
                className="font-display text-[clamp(2.8rem,7.5vw,5.75rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk"
              >
                {t.heading} <span className="text-crimson">{t.headingAccent}</span>
              </h2>
              <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-bone sm:text-lg">{t.lead}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection("live-tv")}
                  className="glass glass-tint-crimson glass-press inline-flex items-center gap-3 rounded-full px-7 py-4 font-condensed text-lg font-bold uppercase tracking-wider text-chalk"
                >
                  <Tv className="h-5 w-5" aria-hidden="true" />
                  <span>{t.backToLive}</span>
                </button>
                <a
                  href={STREAM_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-press inline-flex items-center gap-2.5 rounded-full px-6 py-4 font-condensed text-lg font-bold uppercase tracking-wider text-chalk"
                >
                  <span>{t.standalone}</span>
                  <ExternalLink className="h-4 w-4 text-tungsten" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="glass glass-thick glass-refract rounded-glass p-6">
                <h3 className="font-condensed text-xl font-bold uppercase tracking-wider text-chalk">{t.integrityTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone">{t.integrityBody}</p>
                <div className="glass-divider mt-4 break-all border-t pt-3 font-mono text-xs text-ash tabular-data">
                  {t.verified}: {STREAM_SOURCE_URL}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-8 lg:px-12">
        <div className="glass grid grid-cols-1 gap-10 rounded-glass p-6 sm:p-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark size="sm" />
              <span className="font-display text-2xl tracking-wider text-chalk">ROCK TV</span>
            </div>
            <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-bone">{t.blurb}</p>
          </div>

          <nav aria-label={t.sections} className="md:col-span-4">
            <h3 className="font-condensed text-base font-bold uppercase tracking-wider text-chalk">{t.sections}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 font-condensed text-sm font-bold uppercase tracking-wider text-bone">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className="hover:text-crimson-bright"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={STREAM_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-tungsten">
                  {t.linkDirect}
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start justify-between md:col-span-3 md:items-end">
            <button
              type="button"
              onClick={() => scrollToSection("intro")}
              className="glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
            >
              <span>{t.top}</span>
              <ArrowUp className="h-4 w-4 text-crimson" aria-hidden="true" />
            </button>
            <p className="mt-4 font-mono text-xs text-ash tabular-data md:text-right">CH-01 · 16:9</p>
            <ExperienceControls />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 px-2 font-mono text-xs text-ash tabular-data sm:flex-row sm:items-center">
          <p>{t.rights}</p>
          <p>{t.sourceLine}</p>
        </div>
      </div>
    </footer>
  );
}
