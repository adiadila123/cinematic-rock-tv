"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Disc, Flame, Play, Clapperboard } from "lucide-react";
import { ROCK_LEGENDS, type RockLegendFeature } from "@/data/rockTvData";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";
import { useReduceMotion } from "@/context/ExperienceContext";
import { youtubeThumb } from "@/lib/site";
import { StickySectionBar } from "@/components/scroll/StickySectionBar";
import { ParallaxImage } from "@/components/scroll/ParallaxImage";
import { HorizontalScroller } from "@/components/scroll/HorizontalScroller";

function WatchVideosButton({ legend, className = "" }: { legend: RockLegendFeature; className?: string }) {
  const { dict } = useLocale();
  const { openVideo } = useMedia();
  const t = dict.legends;

  return (
    <button
      type="button"
      onClick={() => openVideo(legend.id, 0)}
      aria-haspopup="dialog"
      className={`glass glass-press group inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-left ${className}`}
    >
      <span className="flex -space-x-3" aria-hidden="true">
        {legend.videos.slice(0, 3).map((v) => (
          <img
            key={v.youtubeId}
            src={youtubeThumb(v.youtubeId, "mq")}
            alt=""
            loading="lazy"
            width={320}
            height={180}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-void"
          />
        ))}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="inline-flex items-center gap-1.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk">
          <Play className="h-3.5 w-3.5 fill-current text-crimson-bright" aria-hidden="true" />
          {t.watchVideos}
        </span>
        <span className="font-mono text-[11px] text-bone tabular-data">{t.videosCount(legend.videos.length)}</span>
      </span>
    </button>
  );
}

/** Gap between pinned cards so the edges of the cards beneath stay visible. */
const STACK_PEEK = 18;
/** Where the first card pins: below the header and the section's title chip. */
const STACK_TOP = 150;
/** Space kept free under a pinned card. */
const STACK_BOTTOM_GAP = 24;
/** Below this height pinned cards would have to shrink too far to stay readable. */
const STACK_QUERY = "(min-width: 1024px) and (min-height: 680px)";

function SpotlightStack({ legends }: { legends: RockLegendFeature[] }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReduceMotion();
  const [canStack, setCanStack] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(STACK_QUERY);
    const update = () => setCanStack(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const stacked = canStack && !reduceMotion;
  // Owned here (not by a parent) so the target is attached when useScroll binds.
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  // Every card gets the same size: the height of the tallest one, and one
  // shared scale so the deepest pinned card still shows in full on screen.
  const fit = useMotionValue(1);
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>("[data-stack-card]")];
    const update = () => {
      cards.forEach((c) => (c.style.minHeight = ""));
      if (!stacked) {
        fit.set(1);
        return;
      }
      const tallest = Math.max(...cards.map((c) => c.offsetHeight));
      cards.forEach((c) => (c.style.minHeight = `${tallest}px`));
      const lastTop = STACK_TOP + (cards.length - 1) * STACK_PEEK;
      fit.set(Math.min(1, (window.innerHeight - lastTop - STACK_BOTTOM_GAP) / tallest));
    };
    update();
    window.addEventListener("resize", update);
    document.fonts?.ready.then(update);
    return () => window.removeEventListener("resize", update);
  }, [stacked, fit]);

  return (
    <div ref={stackRef} className={`mt-12 space-y-10 sm:space-y-14 ${stacked ? "lg:space-y-[18vh]" : ""}`}>
      {legends.map((legend, index) => (
        <SpotlightCard
          key={legend.id}
          legend={legend}
          index={index}
          total={legends.length}
          progress={scrollYProgress}
          fit={fit}
          stacked={stacked}
        />
      ))}
    </div>
  );
}

function SpotlightCard({
  legend,
  index,
  total,
  progress,
  fit,
  stacked,
}: {
  legend: RockLegendFeature;
  index: number;
  total: number;
  progress: MotionValue<number>;
  fit: MotionValue<number>;
  stacked: boolean;
}) {
  const { dict, l } = useLocale();
  const t = dict.legends;
  const isReversed = index % 2 === 1;
  // Cards keep one size; a card dims as the cards after it cover it, more for
  // each card stacked on top, and the peeking edges show the depth.
  const depth = total - 1 - index;
  const dim = useTransform(progress, [(index + 0.5) / total, 1], [0, stacked ? Math.min(0.55, depth * 0.18) : 0]);
  const top = STACK_TOP + index * STACK_PEEK;

  return (
    <div className={stacked ? "sticky" : undefined} style={stacked ? { top } : undefined}>
      <motion.article
        data-stack-card
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: fit, transformOrigin: "50% 0%" }}
        className="glass glass-thick relative grid grid-cols-1 gap-2 rounded-glass p-2 lg:grid-cols-12"
      >
        <div
          className={`relative min-h-[300px] overflow-hidden rounded-glass-sm bg-void lg:col-span-7 lg:min-h-[460px] ${
            isReversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <ParallaxImage src={legend.image} alt={l(legend.imageAlt)} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(6,6,8,0.05) 0%, rgba(6,6,8,0.8) 100%)" }}
          />
          <div className="glass glass-thin absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-full px-4 py-2 font-mono text-xs text-chalk tabular-data">
            <span>{l(legend.originCity)}</span>
            <span className="text-tungsten">{l(legend.activeYears)}</span>
          </div>
        </div>

        <div
          className={`flex flex-col justify-between p-5 sm:p-8 lg:col-span-5 ${
            isReversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div>
            <h3 className="font-display text-4xl uppercase leading-none tracking-wide text-chalk sm:text-5xl">
              {legend.name}
            </h3>
            <p className="mt-2 font-condensed text-lg font-bold uppercase tracking-wider text-crimson-bright">
              {l(legend.moniker)}
            </p>
            <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-bone">{l(legend.editorialPortrait)}</p>

            <div className="mt-6 rounded-glass-xs bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <h4 className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">{t.impact}</h4>
              <p className="mt-1 text-sm leading-relaxed text-bone">{l(legend.influenceStatement)}</p>
            </div>

            <WatchVideosButton legend={legend} className="mt-5" />
          </div>

          <dl className="glass-divider mt-8 space-y-3 border-t pt-5 font-mono text-xs tabular-data">
            <div className="flex flex-col justify-between gap-1 sm:flex-row">
              <dt className="uppercase text-ash">{t.rig}</dt>
              <dd className="font-medium text-chalk sm:text-right">{legend.signatureGear}</dd>
            </div>
            <div className="flex flex-col justify-between gap-1 sm:flex-row">
              <dt className="uppercase text-ash">{t.anthem}</dt>
              <dd className="flex items-center gap-1.5 font-medium text-tungsten">
                <Disc className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />
                <span>{legend.rotationAnthem}</span>
              </dd>
            </div>
          </dl>
        </div>
        <motion.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 rounded-glass bg-void"
        />
      </motion.article>
    </div>
  );
}

export function RockLegendsSection() {
  const { dict, l } = useLocale();
  const { openVideo } = useMedia();
  const t = dict.legends;
  const spotlightLegends = ROCK_LEGENDS.slice(0, 4);
  const chronicleLegends = ROCK_LEGENDS.slice(4);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="legends" aria-labelledby="rock-legends-heading" className="relative py-24 sm:py-32">
      <StickySectionBar sectionRef={sectionRef} title={t.heading} />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 pb-4 lg:flex-row lg:items-end">
          <div>
            <h2
              id="rock-legends-heading"
              className="font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk"
            >
              {t.heading}
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-bone sm:text-lg">{t.lead}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            <span className="glass glass-thin rounded-full px-4 py-2.5 font-mono text-xs text-bone tabular-data">
              {t.badge}
            </span>
            <button
              type="button"
              onClick={() => openVideo(ROCK_LEGENDS[0].id, 0)}
              aria-haspopup="dialog"
              className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
            >
              <Clapperboard className="h-4 w-4" aria-hidden="true" />
              {t.openGallery}
            </button>
          </div>
        </div>

        {/* Spotlight spreads, stacked: each card pins under the header and the
            next one slides over it while the ones beneath recede (desktop). */}
        <SpotlightStack legends={spotlightLegends} />

        {/* Pantheon */}
        <div className="mt-20">
          <HorizontalScroller
            header={
              <div>
                <h3 className="font-display text-3xl uppercase tracking-wide text-chalk sm:text-4xl">{t.pantheonTitle}</h3>
                <p className="mt-2 max-w-[65ch] text-sm text-bone sm:text-base">{t.pantheonLead}</p>
              </div>
            }
          >
            {chronicleLegends.map((legend) => (
              <article key={legend.id} className="glass flex h-full flex-col justify-between rounded-glass p-6 sm:p-8">
                <div>
                  <div className="glass-divider flex flex-wrap items-baseline justify-between gap-3 border-b pb-4">
                    <h4 className="font-display text-3xl uppercase leading-none tracking-wide text-chalk">{legend.name}</h4>
                    <span className="font-mono text-xs text-tungsten tabular-data">{l(legend.activeYears)}</span>
                  </div>
                  <p className="mt-3 font-condensed text-base font-bold uppercase tracking-wider text-crimson-bright">
                    {l(legend.moniker)} · {l(legend.originCity)}
                  </p>
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-bone sm:text-base">
                    {l(legend.editorialPortrait)}
                  </p>
                  <WatchVideosButton legend={legend} className="mt-5" />
                </div>

                <div className="glass-divider mt-6 border-t pt-4 font-mono text-xs tabular-data">
                  <div className="flex items-center justify-between gap-2 text-bone">
                    <span className="uppercase text-ash">{t.rotationAnthem}</span>
                    <span className="flex items-center gap-1.5 text-right font-medium text-chalk">
                      <Flame className="h-3.5 w-3.5 shrink-0 text-crimson" aria-hidden="true" />
                      {legend.rotationAnthem}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-bone">
                    <span className="uppercase text-ash">{t.stageRig}</span>
                    <span className="text-right text-bone">{legend.signatureGear}</span>
                  </div>
                </div>
              </article>
            ))}
          </HorizontalScroller>
        </div>

      </div>
    </section>
  );
}
