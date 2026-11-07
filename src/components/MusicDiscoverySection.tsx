"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useReduceMotion } from "@/context/ExperienceContext";
import { ChevronLeft, ChevronRight, Play, Sliders, Tv, X } from "lucide-react";
import { ROCK_GENRES, RockGenreDestination, genrePlaylistId } from "@/data/rockTvData";
import { youtubeThumb } from "@/lib/site";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";
import { scrollToSection } from "@/lib/sections";
import { StickySectionBar } from "@/components/scroll/StickySectionBar";
import { GenreLegends } from "@/components/discover/GenreLegends";

/* ── Family-tree geometry ─────────────────────────────────────────────────
   One horizontal line per genre, like a metro map. x is the real year, so a
   line starts when the movement was born and runs until it faded (or, for
   movements still alive, out to the present). Lanes are ordered so branches
   cross as little as possible. */

const YEAR_START = 1960;
const YEAR_END = 2026;
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
const LANES = [
  "heavy-metal",
  "hard-rock",
  "classic-rock",
  "progressive-rock",
  "punk-rock",
  "grunge",
  "alternative-rock",
  "indie-rock",
];
/** SVG user space; the map stretches it to its box. */
const VIEW_W = 1000;
const VIEW_H = 480;
/** How many years before a child's birth its branch leaves the parent line. */
const BRANCH_LEAD = 3;
const EASE = [0.16, 1, 0.3, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const xPct = (year: number) => 3 + ((year - YEAR_START) / (YEAR_END - YEAR_START)) * 94;
const yPct = (lane: number) => 8 + (lane / (LANES.length - 1)) * 84;
const xView = (year: number) => (xPct(year) / 100) * VIEW_W;
const yView = (lane: number) => (yPct(lane) / 100) * VIEW_H;

/** "1968 — PRESENT" → { start: 1968, end: 2026, open: true } */
function genreEra(genre: RockGenreDestination) {
  const [start, end] = genre.yearsOrigin.en.split("—").map((s) => s.trim());
  const open = !/^\d+$/.test(end);
  return { start: Number(start), end: open ? YEAR_END : Number(end), open };
}

const byId = (id: string) => ROCK_GENRES.find((g) => g.id === id)!;
const childrenOf = (id: string) => ROCK_GENRES.filter((g) => g.influences.includes(id));

/** Every genre upstream (ancestors) or downstream (descendants) of `id`, plus itself. */
function lineage(id: string) {
  const up = new Set<string>([id]);
  const down = new Set<string>([id]);
  const climb = (g: string) => byId(g).influences.forEach((p) => !up.has(p) && (up.add(p), climb(p)));
  const descend = (g: string) => childrenOf(g).forEach((c) => !down.has(c.id) && (down.add(c.id), descend(c.id)));
  climb(id);
  descend(id);
  return { up, down };
}

/** Map and panel sit side by side from here up; below it the panel opens as a bottom sheet. */
const WIDE_QUERY = "(min-width: 1280px)";

const DETAIL_TABS = ["story", "sound", "records", "legends"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

/** Chronological order: how the tree reads, and the keyboard order of its nodes. */
const CHRONO = [...ROCK_GENRES].sort((a, b) => genreEra(a).start - genreEra(b).start);

/* ── Vertical tree (phones, portrait tablets) ─────────────────────────────
   A branch graph read top to bottom: one row per genre in order of birth, one
   column per genre in the gutter. Time runs down the gutter through the rows
   (and on to the present below the last one), so lines still start and end in
   their real years and branches leave the parent just before the child is born. */

const V_ROW = 64;
const V_TOP = 18;
const V_TAIL = 70;
const V_COL = 12;
const V_GUTTER = 8 * V_COL + 14;
/** Gutter columns, ordered so branches cross as little as possible. */
const V_COLUMNS = [
  "classic-rock",
  "hard-rock",
  "heavy-metal",
  "progressive-rock",
  "punk-rock",
  "grunge",
  "alternative-rock",
  "indie-rock",
];

const vRowY = (i: number) => V_TOP + i * V_ROW + V_ROW / 2;
const vColX = (id: string) => 8 + V_COLUMNS.indexOf(id) * V_COL;
/** Year → y, piecewise between the rows' birth years, then on to the present. */
function vYearY(year: number) {
  const starts = CHRONO.map((g) => genreEra(g).start);
  if (year <= starts[0]) return vRowY(0);
  for (let i = 0; i < starts.length - 1; i++) {
    if (year <= starts[i + 1]) {
      const f = (year - starts[i]) / (starts[i + 1] - starts[i]);
      return vRowY(i) + f * V_ROW;
    }
  }
  const last = starts[starts.length - 1];
  return vRowY(starts.length - 1) + ((year - last) / (YEAR_END - last)) * (V_ROW / 2 + V_TAIL);
}

function VerticalTree({
  activeId,
  up,
  down,
  onPick,
}: {
  activeId: string;
  up: Set<string>;
  down: Set<string>;
  onPick: (id: string) => void;
}) {
  const { dict, l } = useLocale();
  const t = dict.discover;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const inFamily = (id: string) => up.has(id) || down.has(id);
  const height = vRowY(CHRONO.length - 1) + V_ROW / 2 + V_TAIL;
  const index = CHRONO.findIndex((g) => g.id === activeId);

  const onKey = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = CHRONO[(index + delta + CHRONO.length) % CHRONO.length].id;
    refs.current[next]?.focus();
  };

  return (
    <div className="glass glass-refract rounded-glass p-2 lg:hidden">
      <p className="px-3 pb-1 pt-2 font-mono text-[11px] text-ash">{t.mapHint}</p>
      <div className="relative" style={{ height }}>
        <svg aria-hidden="true" width={V_GUTTER} height={height} className="absolute left-0 top-0 overflow-visible">
          <defs>
            <linearGradient id="vtree-line" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2={height}>
              <stop offset="0" stopColor="#F01E46" />
              <stop offset="1" stopColor="#FF6200" />
            </linearGradient>
          </defs>
          {/* Era lines */}
          {CHRONO.map((g, i) => {
            const era = genreEra(g);
            const lit = inFamily(g.id);
            const x = vColX(g.id);
            const y0 = vRowY(i);
            const y1 = vYearY(era.end);
            return (
              <g key={g.id}>
                <line
                  x1={x}
                  x2={x}
                  y1={y0}
                  y2={era.open ? y1 - 26 : y1}
                  stroke={lit ? "url(#vtree-line)" : "rgba(255,255,255,0.18)"}
                  strokeWidth={g.id === activeId ? 3.5 : lit ? 2.5 : 1.5}
                  strokeLinecap="round"
                />
                {era.open ? (
                  <line
                    x1={x}
                    x2={x}
                    y1={y1 - 26}
                    y2={y1}
                    stroke={lit ? "#FF6200" : "rgba(255,255,255,0.18)"}
                    strokeWidth={1.5}
                    strokeDasharray="2 4"
                  />
                ) : (
                  <circle cx={x} cy={y1} r={2.5} fill={lit ? "#FF6200" : "rgba(255,255,255,0.3)"} />
                )}
                {/* Connector from the station to its row */}
                <line
                  x1={x}
                  x2={V_GUTTER}
                  y1={y0}
                  y2={y0}
                  stroke={lit ? "rgba(255,98,0,0.45)" : "rgba(255,255,255,0.08)"}
                  strokeWidth={1}
                />
              </g>
            );
          })}
          {/* Branches */}
          {CHRONO.flatMap((child, ci) =>
            child.influences.map((parentId) => {
              const parentRow = CHRONO.findIndex((g) => g.id === parentId);
              const y1 = vRowY(ci);
              const y0 = Math.min(
                y1 - 14,
                Math.max(vYearY(genreEra(child).start - BRANCH_LEAD), vRowY(parentRow) + 10),
              );
              const x0 = vColX(parentId);
              const x1 = vColX(child.id);
              const ym = (y0 + y1) / 2;
              const lit = (up.has(child.id) && up.has(parentId)) || (down.has(parentId) && down.has(child.id));
              return (
                <path
                  key={`${parentId}-${child.id}`}
                  d={`M ${x0} ${y0} C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${y1}`}
                  fill="none"
                  stroke={lit ? "url(#vtree-line)" : "rgba(255,255,255,0.14)"}
                  strokeWidth={lit ? 2 : 1.25}
                />
              );
            }),
          )}
          {/* Stations */}
          {CHRONO.map((g, i) => {
            const isActive = g.id === activeId;
            const lit = inFamily(g.id);
            return (
              <circle
                key={g.id}
                cx={vColX(g.id)}
                cy={vRowY(i)}
                r={isActive ? 6 : 4.5}
                fill={isActive ? "#F6F5F2" : lit ? "#FF6200" : "#5b5b63"}
                stroke={isActive ? "#F01E46" : "rgba(0,0,0,0.6)"}
                strokeWidth={isActive ? 3 : 1.5}
              />
            );
          })}
        </svg>

        <div
          role="tablist"
          aria-label={t.mapLabel}
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="absolute right-0 top-0"
          style={{ left: V_GUTTER }}
        >
          {CHRONO.map((g, i) => {
            const era = genreEra(g);
            const isActive = g.id === activeId;
            const lit = inFamily(g.id);
            return (
              <button
                key={g.id}
                ref={(el) => {
                  refs.current[g.id] = el;
                }}
                role="tab"
                type="button"
                id={`vtab-${g.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onPick(g.id)}
                style={{ top: vRowY(i) - (V_ROW - 8) / 2, height: V_ROW - 8 }}
                className={`absolute inset-x-0 flex flex-col justify-center gap-1.5 rounded-[18px] px-3.5 text-left transition-colors ${
                  isActive
                    ? "glass glass-tint-crimson text-chalk"
                    : lit
                      ? "bg-white/[0.06] text-chalk"
                      : "text-ash hover:bg-white/[0.04] hover:text-chalk"
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-condensed text-[15px] font-bold uppercase leading-none tracking-wide">
                    {l(g.name)}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[10px] tabular-data ${isActive ? "text-chalk" : "text-ash"}`}
                  >
                    {l(g.yearsOrigin)}
                  </span>
                </span>
                {/* Its era on the real 1960 → now scale */}
                <span aria-hidden="true" className="relative h-1 rounded-full bg-white/[0.07]">
                  <span
                    className={`absolute inset-y-0 rounded-full ${isActive || lit ? "bg-gradient-to-r from-crimson-bright to-tungsten" : "bg-white/25"}`}
                    style={{ left: `${xPct(era.start)}%`, right: `${100 - xPct(era.end)}%` }}
                  />
                </span>
              </button>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-0 font-mono text-[10px] text-tungsten"
          style={{ width: V_GUTTER, textAlign: "center" }}
        >
          {t.present}
        </span>
      </div>
    </div>
  );
}

/**
 * Scrolls with a slim custom rail instead of the browser's bar (which phones
 * hide), plus a fade at the bottom while there is more to read, so it is
 * always clear how much content is left.
 */
function ScrollArea({ children, className, watch }: { children: React.ReactNode; className: string; watch: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState({ top: 0, size: 1, more: false, scrollable: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const range = scrollHeight - clientHeight;
      const size = clientHeight / scrollHeight;
      setRail({
        size,
        top: range > 0 ? (scrollTop / range) * (1 - size) : 0,
        more: scrollTop < range - 4,
        scrollable: range > 1,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    // Content changes height when the genre or tab changes, and as images load
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [watch]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={ref} className={`no-scrollbar h-full overflow-y-auto overscroll-contain ${className}`}>
        {children}
      </div>
      {rail.scrollable && (
        <>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060608] to-transparent transition-opacity duration-300 ${
              rail.more ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-1 top-3 w-[3px] rounded-full bg-white/[0.08]"
          >
            <div
              className="absolute inset-x-0 rounded-full bg-gradient-to-b from-crimson-bright to-tungsten"
              style={{ top: `${rail.top * 100}%`, height: `${rail.size * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function MusicDiscoverySection() {
  const { dict, l } = useLocale();
  const t = dict.discover;
  const sectionRef = useRef<HTMLElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const sheetDrag = useDragControls();
  const { videoModal, openVideo } = useMedia();
  const [isWide, setIsWide] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chosenTab, setDetailTab] = useState<DetailTab>("story");
  const reduceMotion = useReduceMotion();
  const [activeId, setActiveId] = useState(CHRONO[0].id);
  // +1 when moving forward in time, -1 backward — drives the image slide direction
  const [direction, setDirection] = useState(1);

  const activeGenre = byId(activeId);
  const chronoIndex = CHRONO.findIndex((g) => g.id === activeId);
  const { up, down } = useMemo(() => lineage(activeId), [activeId]);
  const inFamily = (id: string) => up.has(id) || down.has(id);
  // Indie and punk have no legends in the gallery yet, so they get no Legends tab
  const visibleTabs = DETAIL_TABS.filter((tab) => tab !== "legends" || activeGenre.legendIds.length > 0);
  const detailTab = visibleTabs.includes(chosenTab) ? chosenTab : "story";

  const select = (id: string, { focus = false, fromMap = false } = {}) => {
    const next = CHRONO.findIndex((g) => g.id === id);
    setDirection(next >= chronoIndex ? 1 : -1);
    setActiveId(id);
    if (focus) nodeRefs.current[id]?.focus();
    if (!isWide) {
      // Narrow: the details open full screen
      if (fromMap) setSheetOpen(true);
      return;
    }
    // Wide: if the visitor has scrolled down the panel, bring its top back
    const panel = panelRef.current;
    if (fromMap && panel) {
      const top = panel.getBoundingClientRect().top;
      if (top < 100) {
        window.scrollTo({ top: window.scrollY + top - 140, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
  };
  const step = (delta: number) => select(CHRONO[(chronoIndex + delta + CHRONO.length) % CHRONO.length].id);

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const update = () => {
      setIsWide(mq.matches);
      if (mq.matches) setSheetOpen(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The sheet steps aside for the video gallery
  useEffect(() => {
    if (videoModal) setSheetOpen(false);
  }, [videoModal]);

  const closeSheet = () => {
    setSheetOpen(false);
    nodeRefs.current[activeId]?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!sheetOpen) return;
    sheetCloseRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The page underneath stays put while the full-screen details are open
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  // Arrow keys walk the tree in time order, as the WAI-ARIA tabs pattern expects
  const onNodeKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: chronoIndex + 1,
      ArrowDown: chronoIndex + 1,
      ArrowLeft: chronoIndex - 1,
      ArrowUp: chronoIndex - 1,
      Home: 0,
      End: CHRONO.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const i = (keys[e.key] + CHRONO.length) % CHRONO.length;
    select(CHRONO[i].id, { focus: true });
  };

  // Lines and branches draw themselves in the order the movements were born
  const drawDelay = (year: number) => (reduceMotion ? 0 : 0.15 + (year - 1965) * 0.05);

  const specs = [
    { k: t.tempo, v: activeGenre.bpmRange },
    { k: t.harmonic, v: activeGenre.harmonicSignature },
    { k: t.gain, v: activeGenre.gainProfile },
  ];

  const panelBody = (
    <>
      {/* Image plate */}
      <div className="relative min-h-[260px] overflow-hidden rounded-glass-sm bg-void sm:min-h-[340px] xl:col-span-5 xl:min-h-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={activeId}
            src={activeGenre.image}
            alt={`${l(activeGenre.name)} — ${t.imageAlt}`}
            loading="lazy"
            width={1376}
            height={768}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.12, x: direction * 40 }}
            animate={{ opacity: 1, scale: 1.02, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimatePresence>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,6,8,0.35) 0%, rgba(6,6,8,0) 30%, rgba(6,6,8,0.2) 55%, rgba(6,6,8,0.92) 100%)",
          }}
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <span className="glass glass-thin rounded-full px-3.5 py-1.5 font-mono text-[11px] text-chalk tabular-data sm:text-xs">
            {pad(chronoIndex + 1)}{" "}
            <span className="text-ash">
              {t.of} {pad(CHRONO.length)}
            </span>
          </span>
          <span className="flex gap-1.5">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.prev}
              className="glass glass-thin glass-press flex h-9 w-9 items-center justify-center rounded-full text-chalk"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.next}
              className="glass glass-thin glass-press flex h-9 w-9 items-center justify-center rounded-full text-chalk"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7"
          >
            <p className="inline-block rounded-full bg-black/45 px-2.5 py-1 font-mono text-xs text-chalk tabular-data">
              {l(activeGenre.yearsOrigin)}
            </p>
            <h3 className="mt-1 font-display text-[clamp(2.4rem,4.5vw,4rem)] uppercase leading-[1.05] tracking-wide text-chalk">
              {l(activeGenre.name)}
            </h3>
            <p className="mt-1 font-condensed text-base font-bold uppercase tracking-wide text-tungsten sm:text-lg">
              {l(activeGenre.headline)}
            </p>
            <p className="mt-3 font-mono text-[11px] text-bone">{l(activeGenre.broadcastSlot)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Details, split into three short tabs so the panel stays as tall as the map */}
      <div className="flex flex-col xl:col-span-7 xl:min-h-0">
        <div role="tablist" aria-label={t.detailTabs} className="flex gap-1 p-3 pb-0">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              type="button"
              aria-selected={detailTab === tab}
              onClick={() => setDetailTab(tab)}
              className={`relative rounded-full px-3.5 py-2 font-condensed text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm ${
                detailTab === tab ? "text-chalk" : "text-ash hover:text-chalk"
              }`}
            >
              {detailTab === tab && (
                <motion.span
                  layoutId={`detail-pill-${isWide ? "panel" : "sheet"}`}
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {t.detailTab[tab]}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeId}-${detailTab}`}
            role="tabpanel"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex flex-col gap-5 p-5 sm:p-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
          >
            {detailTab === "story" && (
              <div className="space-y-4">
                {activeGenre.history.map((paragraph) => (
                  <p key={paragraph.en} className="max-w-[68ch] text-[15px] leading-relaxed text-bone">
                    {l(paragraph)}
                  </p>
                ))}
              </div>
            )}
            {/* Essential records, each with a real track that plays in the video gallery */}
            {detailTab === "records" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">
                    {t.landmarksTitle}
                  </h4>
                  <span className="font-mono text-[10px] text-ash tabular-data">{t.listenNote}</span>
                </div>
                <ul className="mt-2.5 space-y-1.5">
                  {activeGenre.essentialLandmarks.map((record, i) => (
                    <li key={record.work}>
                      <button
                        type="button"
                        onClick={() => openVideo(genrePlaylistId(activeId), i)}
                        aria-haspopup="dialog"
                        aria-label={`${t.listenTitle}: ${record.artist} — ${record.track}`}
                        className="glass-press group flex w-full items-center gap-3 rounded-glass-xs bg-white/[0.05] p-1.5 pr-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/[0.09]"
                      >
                        <span className="relative h-11 w-[72px] shrink-0 overflow-hidden rounded-[10px] bg-void">
                          <img
                            src={youtubeThumb(record.youtubeId, "mq")}
                            alt=""
                            loading="lazy"
                            width={320}
                            height={180}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-crimson/50">
                            <Play className="h-4 w-4 fill-current text-chalk" aria-hidden="true" />
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-condensed text-sm font-bold uppercase tracking-wide text-chalk">
                            {record.track}
                          </span>
                          <span className="block truncate text-xs text-bone">
                            {record.artist} · <span className="italic">{record.work}</span>
                          </span>
                        </span>
                        <span className="font-mono text-xs text-tungsten tabular-data">{record.year}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detailTab === "sound" && (
              <>
                <dl className="grid grid-cols-1 gap-3 font-mono text-xs tabular-data">
                  {specs.map((row) => (
                    <div key={row.k}>
                      <dt className="uppercase text-ash">{row.k}</dt>
                      <dd className="mt-0.5 font-medium text-chalk">{row.v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="glass-divider border-t pt-5">
                  <h4 className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">
                    {t.traitsTitle}
                  </h4>
                  <ul className="mt-2.5 space-y-2">
                    {activeGenre.sonicCharacteristics.map((trait) => (
                      <li key={trait.en} className="flex items-start gap-2.5 text-sm leading-relaxed text-bone">
                        <Sliders className="mt-1 h-3.5 w-3.5 shrink-0 text-crimson" aria-hidden="true" />
                        <span>{l(trait)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            {detailTab === "legends" && (
              <>
                <GenreLegends genre={activeGenre} />
                <a
                  href="#live-tv"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("live-tv");
                  }}
                  className="mt-auto inline-flex items-center gap-2 self-start font-condensed text-sm font-bold uppercase tracking-wider text-crimson-bright hover:text-tungsten"
                >
                  <Tv className="h-4 w-4" aria-hidden="true" />
                  <span>{t.backToLive}</span>
                </a>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="discover"
      aria-labelledby="music-discovery-heading"
      className="relative py-24 sm:py-32"
    >
      <StickySectionBar sectionRef={sectionRef} title={t.heading} />
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2
              id="music-discovery-heading"
              className="font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk"
            >
              {t.heading}
            </h2>
            <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-bone sm:text-lg">{t.lead}</p>
          </div>
          <div className="glass glass-thin self-start rounded-full px-4 py-2.5 font-mono text-xs text-bone tabular-data lg:self-end">
            {t.archiveBadge}
          </div>
        </div>

        {/* Map on the left, pinned while the panel on the right changes with each pick */}
        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* ── Family tree ── */}
          {/* Phones and portrait tablets: the same tree drawn top to bottom, so it fits the width */}
          <VerticalTree activeId={activeId} up={up} down={down} onPick={(id) => select(id, { fromMap: true })} />

          <div className="glass glass-refract hidden rounded-glass p-2 lg:block xl:col-span-5">
            <div>
              <div className="relative px-2">
                <div
                  role="tablist"
                  aria-label={t.mapLabel}
                  onKeyDown={onNodeKey}
                  className="relative h-[460px] sm:h-[500px] xl:h-[clamp(400px,calc(100dvh-260px),540px)]"
                >
                  {/* Decade grid */}
                  {DECADES.map((year) => (
                    <span
                      key={year}
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-white/[0.05]"
                      style={{ left: `${xPct(year)}%` }}
                    />
                  ))}

                  <svg
                    aria-hidden="true"
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="family-line" gradientUnits="userSpaceOnUse" x1="0" x2={VIEW_W} y1="0" y2="0">
                        <stop offset="0" stopColor="#F01E46" />
                        <stop offset="1" stopColor="#FF6200" />
                      </linearGradient>
                    </defs>

                    {/* Era lines */}
                    {LANES.map((id, lane) => {
                      const era = genreEra(byId(id));
                      const lit = inFamily(id);
                      const y = yView(lane);
                      // Movements still alive fade off into the present with a dotted tail
                      const solidEnd = era.open ? YEAR_END - 6 : era.end;
                      return (
                        <g key={id}>
                          <motion.line
                            x1={xView(era.start)}
                            x2={xView(solidEnd)}
                            y1={y}
                            y2={y}
                            stroke={lit ? "url(#family-line)" : "rgba(255,255,255,0.18)"}
                            strokeWidth={id === activeId ? 4 : lit ? 3 : 2}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            // Grow x2 rather than pathLength: pathLength miscounts on a stretched viewBox
                            initial={reduceMotion ? false : { x2: xView(era.start) }}
                            whileInView={{ x2: xView(solidEnd) }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                              duration: 1.1,
                              delay: drawDelay(era.start),
                              ease: EASE,
                            }}
                          />
                          {era.open && (
                            <line
                              x1={xView(solidEnd)}
                              x2={xView(YEAR_END)}
                              y1={y}
                              y2={y}
                              stroke={lit ? "#FF6200" : "rgba(255,255,255,0.18)"}
                              strokeWidth={2}
                              strokeDasharray="2 6"
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Branches: leave the parent line just before the child is born */}
                    {ROCK_GENRES.flatMap((child) =>
                      child.influences.map((parentId) => {
                        const born = genreEra(child).start;
                        const x0 = xView(born - BRANCH_LEAD);
                        const x1 = xView(born);
                        const y0 = yView(LANES.indexOf(parentId));
                        const y1 = yView(LANES.indexOf(child.id));
                        const xm = (x0 + x1) / 2;
                        const lit =
                          (up.has(child.id) && up.has(parentId)) || (down.has(parentId) && down.has(child.id));
                        return (
                          <motion.path
                            key={`${parentId}-${child.id}`}
                            d={`M ${x0} ${y0} C ${xm} ${y0}, ${xm} ${y1}, ${x1} ${y1}`}
                            fill="none"
                            stroke={lit ? "url(#family-line)" : "rgba(255,255,255,0.14)"}
                            strokeWidth={lit ? 2.5 : 1.5}
                            vectorEffect="non-scaling-stroke"
                            initial={reduceMotion ? false : { opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                              duration: 0.6,
                              delay: drawDelay(born - BRANCH_LEAD),
                              ease: EASE,
                            }}
                          />
                        );
                      }),
                    )}
                  </svg>

                  {/* Ends of movements that faded: a small terminus dot (HTML, so it stays round) */}
                  {LANES.map((id, lane) => {
                    const era = genreEra(byId(id));
                    if (era.open) return null;
                    return (
                      <span
                        key={id}
                        aria-hidden="true"
                        className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                          inFamily(id) ? "bg-tungsten" : "bg-white/30"
                        }`}
                        style={{
                          left: `${xPct(era.end)}%`,
                          top: `${yPct(lane)}%`,
                        }}
                      />
                    );
                  })}

                  {/* Stations: one button per genre, sitting where its line begins */}
                  {LANES.map((id, lane) => {
                    const genre = byId(id);
                    const era = genreEra(genre);
                    const isActive = id === activeId;
                    const lit = inFamily(id);
                    return (
                      <motion.button
                        key={id}
                        ref={(el) => {
                          nodeRefs.current[id] = el;
                        }}
                        role="tab"
                        type="button"
                        id={`tab-${id}`}
                        aria-selected={isActive}
                        aria-controls="genre-monograph-stage"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => select(id, { fromMap: true })}
                        initial={reduceMotion ? false : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.5,
                          delay: drawDelay(era.start),
                          ease: EASE,
                        }}
                        style={{
                          left: `${xPct(era.start)}%`,
                          top: `${yPct(lane)}%`,
                        }}
                        className={`absolute -ml-[9px] flex -translate-y-1/2 items-center gap-2.5 rounded-full py-1 pl-1 pr-3.5 text-left transition-colors duration-300 ${
                          isActive
                            ? "glass glass-tint-crimson text-chalk"
                            : lit
                              ? "glass glass-thick text-chalk"
                              : "glass glass-thin text-ash hover:text-chalk"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 shrink-0 rounded-full ring-2 ${
                            isActive
                              ? "bg-chalk ring-crimson-bright"
                              : lit
                                ? "bg-tungsten ring-tungsten/40"
                                : "bg-white/40 ring-white/10"
                          }`}
                        />
                        <span className="whitespace-nowrap font-condensed text-sm font-bold uppercase tracking-wide">
                          {l(genre.name)}
                        </span>
                        <span className={`font-mono text-[10px] tabular-data ${isActive ? "text-chalk" : "text-ash"}`}>
                          {era.start}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Axis */}
                <div aria-hidden="true" className="relative h-7 font-mono text-[10px] text-ash tabular-data">
                  {DECADES.map((year) => (
                    <span key={year} className="absolute top-1.5 -translate-x-1/2" style={{ left: `${xPct(year)}%` }}>
                      {year}
                    </span>
                  ))}
                  <span className="absolute right-2 top-1.5 text-tungsten">{t.present}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Selected genre (wide screens) ──
              Its content is laid out absolutely, so the row takes the map's height
              and the panel matches it exactly instead of growing downwards. */}
          <div
            id="genre-monograph-stage"
            role="tabpanel"
            aria-labelledby={`tab-${activeId}`}
            ref={panelRef}
            className="glass glass-thick relative hidden rounded-glass xl:col-span-7 xl:block"
          >
            <div className="absolute inset-0 grid grid-cols-12 gap-2 p-2">{panelBody}</div>
          </div>
        </div>
      </div>

      {/* ── Selected genre (narrow screens): full-screen details ── */}
      <AnimatePresence>
        {sheetOpen && !isWide && (
          <motion.div
            key="genre-details"
            role="dialog"
            aria-modal="true"
            aria-label={l(activeGenre.name)}
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 36 }}
            drag="y"
            dragListener={false}
            dragControls={sheetDrag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && closeSheet()}
            className="fixed inset-0 z-[71] flex flex-col bg-[#060608] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
          >
            {/* Header: drag down from here to close, so the content below still scrolls */}
            <div
              onPointerDown={(e) => sheetDrag.start(e)}
              className="relative flex shrink-0 touch-none items-center justify-between gap-3 px-4 pb-2 pt-3"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/25"
              />
              <p className="font-mono text-[11px] uppercase text-ash">{t.heading}</p>
              <button
                ref={sheetCloseRef}
                type="button"
                onClick={closeSheet}
                aria-label={t.closeSheet}
                className="glass glass-thin glass-press flex h-10 w-10 items-center justify-center rounded-full text-chalk"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <ScrollArea watch={`${activeId}-${detailTab}`} className="grid grid-cols-1 content-start gap-2 px-2 pb-12">
              {panelBody}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
