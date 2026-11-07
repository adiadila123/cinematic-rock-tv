"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Tv, ArrowDown, ShieldCheck, ChevronDown } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { scrollToSection } from "@/lib/sections";
import { useExperience } from "@/context/ExperienceContext";

const VIDEO_HD = "/videos/hero-arena-stage-scrub.mp4";
const VIDEO_SM = "/videos/hero-arena-stage-scrub-sm.mp4";
const POSTER = "/images/hero-arena-poster.webp";

/*
 * Story beats, as fractions of the hero's scroll track. Only one beat is in
 * motion at a time; each enters rising (decelerate) and leaves rising further
 * (accelerate), so the eye always travels the same direction as the camera.
 *   0.00–0.22  Arena   — wide shot, title holds then lifts away
 *   0.26–0.54  Live    — push-in on the guitarist
 *   0.56–0.80  Canon   — reverse angle onto the crowd
 *   0.82–1.00  On air  — fist raised, CTAs land, hand-off to Live TV
 */
const BEATS = {
  intro: [0, 0.12, 0.22],
  live: [0.26, 0.34, 0.46, 0.54],
  canon: [0.56, 0.64, 0.72, 0.8],
  finale: [0.82, 0.92],
} as const;

function useBeat(progress: MotionValue<number>, [a, b, c, d]: readonly number[]) {
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [48, 0, 0, -48]);
  const pointerEvents = useTransform(progress, (v) => (v > a && v < d ? "auto" : "none"));
  return { opacity, y, pointerEvents };
}

function CtaRow({ size = "lg" }: { size?: "lg" | "md" }) {
  const { dict } = useLocale();
  const pad = size === "lg" ? "px-7 py-4 text-lg" : "px-5 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base";
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={() => scrollToSection("live-tv")}
        className={`glass glass-tint-crimson glass-press group inline-flex items-center gap-3 rounded-full font-condensed font-bold uppercase tracking-wider text-chalk ${pad}`}
      >
        <Tv className="h-5 w-5" aria-hidden="true" />
        <span>{dict.hero.ctaWatch}</span>
        <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scrollToSection("discover")}
        className={`glass glass-press inline-flex items-center gap-3 rounded-full font-condensed font-bold uppercase tracking-wider text-chalk ${pad}`}
      >
        {dict.hero.ctaExplore}
      </button>
    </div>
  );
}

function SpecCard() {
  const { dict } = useLocale();
  const t = dict.hero;
  const specs = [
    { k: t.specTransmission, v: t.specTransmissionValue, tone: "text-chalk" },
    { k: t.specAudio, v: t.specAudioValue, tone: "text-tungsten" },
    { k: t.specArchive, v: t.specArchiveValue, tone: "text-chalk" },
    { k: t.specSource, v: t.specSourceValue, tone: "text-chalk", icon: true },
  ];
  return (
    <div className="glass glass-thick glass-refract rounded-glass p-5 sm:p-6">
      <h2 className="font-condensed text-xl font-bold uppercase tracking-wide text-chalk sm:text-2xl">{t.specTitle}</h2>
      <p className="mt-2 hidden text-sm leading-relaxed text-bone sm:block">{t.specBody}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs tabular-data sm:mt-5 sm:gap-2.5">
        {specs.map((s) => (
          <div key={s.k} className="rounded-glass-xs bg-white/[0.05] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-3">
            <dt className="uppercase text-ash">{s.k}</dt>
            <dd className={`mt-1 flex items-center gap-1.5 font-medium uppercase ${s.tone}`}>
              {s.icon && <ShieldCheck className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />}
              {s.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Reduced-motion hero: the same content on a still frame, no scrubbing. */
function StaticHero() {
  const { dict } = useLocale();
  const t = dict.hero;
  return (
    <section
      id="intro"
      aria-label={t.ariaLabel}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-10 pt-28 sm:pt-32"
    >
      <img src={POSTER} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/30 to-void" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-10 sm:px-8 lg:grid-cols-12 lg:items-end lg:px-12">
        <div className="lg:col-span-8">
          <h1 className="font-display text-[length:clamp(2.25rem,min(5.6vw,7.5vh),4.75rem)] uppercase leading-[1.18] tracking-[-0.02em] text-chalk">
            {t.titleA} <span className="text-crimson">{t.titleB}</span> {t.titleC}
          </h1>
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-bone sm:text-lg">{t.lead}</p>
          <div className="mt-8">
            <CtaRow />
          </div>
        </div>
        <div className="lg:col-span-4">
          <SpecCard />
        </div>
      </div>
    </section>
  );
}

export function HeroIntro() {
  // Device capabilities are client-only; match the server render until known.
  // Reduced motion and lite devices both get the still-frame hero.
  const { ready, reduceMotion, lite } = useExperience();
  if (ready && (reduceMotion || lite)) return <StaticHero />;
  return <CinematicHero />;
}

function CinematicHero() {
  const { dict } = useLocale();
  const t = dict.hero;
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: progress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Scroll → video time. A lerp gives the scrub a dolly-like inertia instead
  // of stepping frame by frame; the loop only runs while the hero is visible.
  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track) return;

    video.src = window.matchMedia("(max-width: 767px)").matches ? VIDEO_SM : VIDEO_HD;
    video.load();
    // iOS only allows seeking once the element has been "played" once
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => undefined);
    };
    video.addEventListener("loadedmetadata", prime, { once: true });

    let frame = 0;
    let current = 0;
    const tick = () => {
      const duration = video.duration;
      if (duration && video.readyState >= 1) {
        const target = progress.get() * (duration - 0.05);
        current += (target - current) * 0.14;
        if (!video.seeking && Math.abs(video.currentTime - current) > 1 / 48) {
          video.currentTime = current;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    visibility.observe(track);

    return () => {
      visibility.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", prime);
    };
  }, [progress]);

  // Primary layer: video framing + light that dims as copy needs contrast
  const videoScale = useTransform(progress, [0, 1], [1.08, 1]);
  const dim = useTransform(progress, [0, 0.2, 0.3, 0.8, 1], [0.25, 0.45, 0.3, 0.35, 0.65]);

  // Ambient layer: a crimson sweep in counter-motion to the camera push
  const sweepX = useTransform(progress, [0, 1], ["-28%", "28%"]);
  const sweepOpacity = useTransform(progress, [0, 0.5, 1], [0.55, 0.9, 0.5]);

  // Beat 1: title lifts, softens and releases
  const introOpacity = useTransform(progress, [BEATS.intro[1], BEATS.intro[2]], [1, 0]);
  const introY = useTransform(progress, [0, BEATS.intro[2]], [0, -90]);
  const introBlurPx = useTransform(progress, [BEATS.intro[1], BEATS.intro[2]], [0, 10]);
  const introFilter = useMotionTemplate`blur(${introBlurPx}px)`;
  const introPointer = useTransform(progress, (v) => (v < BEATS.intro[2] ? "auto" : "none"));

  const live = useBeat(progress, BEATS.live);
  const canon = useBeat(progress, BEATS.canon);

  const finaleOpacity = useTransform(progress, [BEATS.finale[0], BEATS.finale[1]], [0, 1]);
  const finaleY = useTransform(progress, [BEATS.finale[0], BEATS.finale[1]], [56, 0]);
  const finalePointer = useTransform(progress, (v) => (v > BEATS.finale[0] ? "auto" : "none"));

  const cueOpacity = useTransform(progress, [0, 0.05], [1, 0]);

  // Secondary layer: chapter rail
  const chapterRanges: [number, number][] = [
    [0, BEATS.intro[2]],
    [BEATS.live[0], BEATS.live[3]],
    [BEATS.canon[0], BEATS.canon[3]],
    [BEATS.finale[0], 1.01],
  ];

  // Keyboard users tabbing into the (still hidden) finale get scrolled to it
  const revealFinale = () => {
    const track = trackRef.current;
    if (!track || progress.get() >= BEATS.finale[1]) return;
    window.scrollTo({ top: track.offsetTop + track.offsetHeight - window.innerHeight, behavior: "smooth" });
  };

  return (
    <section id="intro" ref={trackRef} aria-label={t.ariaLabel} className="relative h-[320vh]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Video stage */}
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <video
            ref={videoRef}
            poster={POSTER}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="absolute inset-0 bg-void" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,6,8,0.75) 0%, rgba(6,6,8,0) 26%, rgba(6,6,8,0) 55%, rgba(6,6,8,0.92) 100%)",
          }}
        />
        <motion.div
          aria-hidden="true"
          style={{ x: sweepX, opacity: sweepOpacity }}
          className="pointer-events-none absolute inset-y-0 -inset-x-1/4 mix-blend-screen"
        >
          <div
            className="h-full w-full"
            style={{ background: "radial-gradient(40% 55% at 50% 60%, rgba(220,20,60,0.22), transparent 70%)" }}
          />
        </motion.div>
        <div aria-hidden="true" className="stage-film-grain absolute inset-0" />

        {/* Chapter rail */}
        <ol
          aria-hidden="true"
          className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex xl:right-10"
        >
          {t.chapters.map((label, i) => (
            <ChapterMark key={label} label={label} progress={progress} range={chapterRanges[i]} />
          ))}
        </ol>

        {/* Beats share one stage area */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-14">
          <div className="relative mx-auto grid w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 lg:pr-40">
            {/* Beat 1 — Arena */}
            <motion.div
              style={{ opacity: introOpacity, y: introY, filter: introFilter, pointerEvents: introPointer }}
              className="col-start-1 row-start-1 self-end"
            >
              <h1 className="max-w-[18ch] font-display text-[length:clamp(2.1rem,min(5.4vw,7vh),4.5rem)] uppercase leading-[1.18] tracking-[-0.02em] text-chalk">
                {t.titleA} <span className="text-crimson">{t.titleB}</span> {t.titleC}
              </h1>
              {/* Phones keep the opening to title + actions; the lead returns in the static hero */}
              <p className="mt-5 hidden max-w-[60ch] text-base leading-relaxed text-bone sm:block sm:text-lg">{t.lead}</p>
              <div className="mt-6 sm:mt-7">
                <CtaRow size="md" />
              </div>
            </motion.div>

            {/* Beat 2 — Live */}
            <motion.div style={live} className="col-start-1 row-start-1 self-end">
              <StoryCard title={t.beatLiveTitle} body={t.beatLiveBody} />
            </motion.div>

            {/* Beat 3 — Canon */}
            <motion.div style={canon} className="col-start-1 row-start-1 self-end justify-self-end">
              <StoryCard title={t.beatCanonTitle} body={t.beatCanonBody} align="right" />
            </motion.div>

            {/* Beat 4 — On air */}
            <motion.div
              style={{ opacity: finaleOpacity, y: finaleY, pointerEvents: finalePointer }}
              onFocusCapture={revealFinale}
              className="col-start-1 row-start-1 grid grid-cols-1 gap-6 self-end lg:grid-cols-12 lg:items-end"
            >
              <div className="lg:col-span-7">
                <p className="font-display text-[length:clamp(2rem,min(5vw,7vh),4rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk">
                  {t.finaleTitle}
                </p>
                <div className="mt-6">
                  <CtaRow size="md" />
                </div>
              </div>
              <div className="hidden sm:block lg:col-span-5">
                <SpecCard />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.button
          type="button"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })}
          style={{ opacity: cueOpacity }}
          className="absolute bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-bone md:bottom-5 md:flex"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider">{t.scrollCue}</span>
          <ChevronDown className="h-5 w-5 animate-bounce text-crimson" aria-hidden="true" />
        </motion.button>
      </div>
    </section>
  );
}

function StoryCard({ title, body, align = "left" }: { title: string; body: string; align?: "left" | "right" }) {
  return (
    <div
      className={`glass glass-refract max-w-xl rounded-glass p-6 sm:p-8 ${align === "right" ? "sm:text-right" : ""}`}
    >
      <p className="font-display text-[length:clamp(1.9rem,min(4.5vw,6.5vh),3.25rem)] uppercase leading-[1.1] tracking-[-0.01em] text-chalk">
        {title}
      </p>
      <p className="mt-3 text-base leading-relaxed text-bone sm:text-lg">{body}</p>
    </div>
  );
}

function ChapterMark({
  label,
  progress,
  range: [start, end],
}: {
  label: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const active = useTransform(progress, (v): number => (v >= start && v < end ? 1 : 0));
  const opacity = useTransform(active, [0, 1], [0.45, 1]);
  const width = useTransform(active, [0, 1], [12, 36]);
  return (
    <li className="flex items-center gap-3">
      <motion.span style={{ opacity }} className="font-mono text-[11px] uppercase tracking-wider text-chalk">
        {label}
      </motion.span>
      <motion.span style={{ width }} className="h-[2px] rounded-full bg-crimson transition-[width] duration-500" />
    </li>
  );
}
