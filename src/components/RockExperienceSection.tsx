"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CULTURE_CHAPTERS } from "@/data/rockTvData";
import type { Localized } from "@/i18n/config";
import { useLocale } from "@/context/LocaleContext";
import { useReduceMotion } from "@/context/ExperienceContext";
import { StickySectionBar } from "@/components/scroll/StickySectionBar";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Every moment in reading order, tagged with its chapter. */
const MOMENTS = CULTURE_CHAPTERS.flatMap((chapter, c) => chapter.moments.map((moment) => ({ ...moment, chapter: c })));

/**
 * A scrollytelling chronicle: the moments scroll on the right while a pinned
 * screen on the left shows the current chapter's image, the moment's year and
 * its headline figure. On small screens the screen is dropped and each chapter
 * carries its own image.
 */
export function RockExperienceSection() {
  const { dict, l } = useLocale();
  const t = dict.experience;
  const reduceMotion = useReduceMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const statValue = (v: string | Localized) => (typeof v === "string" ? v : l(v));
  const moment = MOMENTS[active];
  const chapter = CULTURE_CHAPTERS[moment.chapter];

  // The active moment is the card crossing a line just above the middle of the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goToChapter = (c: number) => {
    const first = MOMENTS.findIndex((m) => m.chapter === c);
    const card = cardRefs.current[first];
    if (!card) return;
    const top = card.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.42 + 40;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="rock-experience-heading"
      className="relative py-24 sm:py-32"
    >
      <StickySectionBar sectionRef={sectionRef} title={t.heading} />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2
              id="rock-experience-heading"
              className="font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk"
            >
              {t.heading}
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-bone sm:text-lg">{t.lead}</p>
          </div>
          <div className="glass glass-thin self-start rounded-full px-4 py-2.5 font-mono text-xs text-bone tabular-data lg:self-end">
            {t.badge}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ── Pinned screen (large screens) ── */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="glass glass-thick sticky top-[150px] flex h-[min(680px,calc(100dvh-190px))] flex-col gap-2 rounded-glass p-2">
              <div className="relative flex-1 overflow-hidden rounded-glass-sm bg-void">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={chapter.id}
                    src={chapter.image}
                    alt={l(chapter.imageAlt)}
                    loading="lazy"
                    width={1376}
                    height={768}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1.03 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: EASE }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,6,8,0.55) 0%, rgba(6,6,8,0.05) 30%, rgba(6,6,8,0.35) 55%, rgba(6,6,8,0.95) 100%)",
                  }}
                />

                {/* Chapter switcher */}
                <nav aria-label={t.chaptersLabel} className="absolute inset-x-3 top-3 flex flex-wrap gap-1">
                  {CULTURE_CHAPTERS.map((c, i) => {
                    const isActive = i === moment.chapter;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => goToChapter(i)}
                        aria-current={isActive ? "step" : undefined}
                        className={`relative rounded-full px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-wider transition-colors ${
                          isActive ? "text-chalk" : "text-bone hover:text-chalk"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="culture-chapter-pill"
                            className="glass glass-tint-crimson absolute inset-0 -z-10 rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        {l(c.title)}
                      </button>
                    );
                  })}
                </nav>

                {/* The moment's year and figure */}
                <div className="absolute inset-x-6 bottom-6">
                  <p className="font-mono text-xs text-bone tabular-data">
                    {pad(moment.chapter + 1)} {t.of} {pad(CULTURE_CHAPTERS.length)} · {l(chapter.title)}
                  </p>
                  <div className="relative mt-1 h-[clamp(5rem,9vw,8.5rem)] overflow-hidden">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.p
                        key={moment.year + active}
                        aria-hidden="true"
                        initial={reduceMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="absolute inset-0 font-display text-[clamp(5rem,9vw,8.5rem)] leading-none tracking-tight text-chalk tabular-data"
                      >
                        {moment.year}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="mt-2 flex items-baseline gap-3"
                    >
                      <span className="font-display text-4xl leading-none text-tungsten">{statValue(moment.stat.value)}</span>
                      <span className="font-mono text-xs uppercase text-bone">{l(moment.stat.label)}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress through all twelve moments, grouped by chapter */}
              <div aria-hidden="true" className="flex gap-3 px-3 py-2.5">
                {CULTURE_CHAPTERS.map((c, ci) => (
                  <div key={c.id} className="flex flex-1 gap-1">
                    {c.moments.map((m) => {
                      const index = MOMENTS.findIndex((x) => x.year === m.year && x.chapter === ci);
                      return (
                        <span
                          key={m.year}
                          className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                            index < active ? "bg-crimson" : index === active ? "bg-tungsten" : "bg-white/[0.12]"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── The chronicle ── */}
          <ol className="flex flex-col gap-16 lg:col-span-7 lg:gap-24 lg:py-[8vh]">
            {CULTURE_CHAPTERS.map((c, ci) => (
              <li key={c.id}>
                <header className="mb-5">
                  {/* Small screens: each chapter carries its own image */}
                  <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-glass bg-void lg:hidden">
                    <img
                      src={c.image}
                      alt={l(c.imageAlt)}
                      loading="lazy"
                      width={1376}
                      height={768}
                      className="h-full w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(180deg, rgba(6,6,8,0) 40%, rgba(6,6,8,0.85) 100%)" }}
                    />
                  </div>
                  <p className="font-mono text-xs text-crimson-bright tabular-data">
                    {pad(ci + 1)} {t.of} {pad(CULTURE_CHAPTERS.length)}
                  </p>
                  <h3 className="mt-1 font-display text-4xl uppercase leading-none tracking-wide text-chalk sm:text-5xl">
                    {l(c.title)}
                  </h3>
                  <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-bone">{l(c.intro)}</p>
                </header>

                <ol className="flex flex-col gap-4">
                  {c.moments.map((m) => {
                    const index = MOMENTS.findIndex((x) => x.year === m.year && x.chapter === ci);
                    const isActive = index === active;
                    return (
                      <motion.li
                        key={m.year}
                        ref={(el) => {
                          cardRefs.current[index] = el;
                        }}
                        data-index={index}
                        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className={`glass rounded-glass p-5 transition-[box-shadow] duration-500 sm:p-7 ${
                          isActive ? "glass-thick shadow-[inset_0_0_0_1px_rgba(220,20,60,0.55)]" : "glass-thin"
                        }`}
                      >
                        <article>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <span className="font-display text-3xl leading-none text-tungsten tabular-data lg:hidden">
                              {m.year}
                            </span>
                            <p className="font-mono text-xs text-ash tabular-data">{l(m.where)}</p>
                          </div>
                          <h4 className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-chalk sm:text-3xl">
                            {l(m.title)}
                          </h4>
                          <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-bone">{l(m.body)}</p>
                          <div className="glass-divider mt-5 flex flex-wrap items-end justify-between gap-3 border-t pt-4">
                            <p className="flex items-baseline gap-2.5">
                              <span className="font-display text-3xl leading-none text-chalk">{statValue(m.stat.value)}</span>
                              <span className="font-mono text-xs uppercase text-bone">{l(m.stat.label)}</span>
                            </p>
                            {m.source && (
                              <span className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase text-ash">
                                {t.source}: {m.source}
                              </span>
                            )}
                          </div>
                        </article>
                      </motion.li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
