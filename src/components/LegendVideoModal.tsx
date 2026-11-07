"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReduceMotion } from "@/context/ExperienceContext";
import { ChevronLeft, ChevronRight, ExternalLink, X, Radio, AlertCircle } from "lucide-react";
import { GENRE_PLAYLISTS, LEGEND_PLAYLISTS } from "@/data/rockTvData";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";
import { youtubeEmbed, youtubeThumb, youtubeWatch } from "@/lib/site";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
const EASE = [0.16, 1, 0.3, 1] as const;
const YOUTUBE_ORIGIN = /^https:\/\/www\.youtube(-nocookie)?\.com$/;

/**
 * Full-screen video gallery. Opening it pauses the live broadcast
 * (MediaContext.openVideo) and only one YouTube iframe ever exists, so two
 * audio sources can never play at once. The player has no glass ancestor or
 * overlay — controls sit beside and below it, never on top.
 */
export function LegendVideoModal() {
  const { dict, l } = useLocale();
  const t = dict.modal;
  const { videoModal, selectVideo, closeVideo, livePauseReason } = useMedia();
  const reduceMotion = useReduceMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Clips the player reported as unplayable (removed, private, embed-blocked)
  const [unavailable, setUnavailable] = useState<Set<string>>(() => new Set());

  const open = videoModal !== null;
  // A genre's records play with the other genres in the switcher; a legend's videos with the other legends
  const isGenre = videoModal?.legendId.startsWith("genre:") ?? false;
  const playlists = isGenre ? GENRE_PLAYLISTS : LEGEND_PLAYLISTS;
  const nameOf = (p: (typeof playlists)[number]) => (typeof p.name === "string" ? p.name : l(p.name));
  const legend = open ? (playlists.find((x) => x.id === videoModal.legendId) ?? playlists[0]) : null;
  const legendName = legend ? nameOf(legend) : "";
  const index = legend ? Math.min(videoModal?.index ?? 0, legend.videos.length - 1) : 0;
  const video = legend?.videos[index];
  const multiple = (legend?.videos.length ?? 0) > 1;
  const videoId = video?.youtubeId;
  const isUnavailable = videoId ? unavailable.has(videoId) : false;

  // The embed (enablejsapi) posts JSON events once we say we're listening;
  // `onError` (100 removed, 101/150 embedding blocked) marks the clip unavailable.
  useEffect(() => {
    if (!videoId) return;
    const onMessage = (e: MessageEvent) => {
      if (!YOUTUBE_ORIGIN.test(e.origin) || e.source !== iframeRef.current?.contentWindow) return;
      let data: { event?: string } | null = null;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event === "onError") {
        setUnavailable((prev) => new Set(prev).add(videoId));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [videoId]);

  // The handshake is repeated briefly because the player may not be ready on load
  const listenToPlayer = () => {
    let tries = 0;
    const timer = window.setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: videoId, channel: "widget" }),
        "*",
      );
      if (++tries >= 8) window.clearInterval(timer);
    }, 400);
  };

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!legend) return;
      const n = legend.videos.length;
      selectVideo(legend.id, (index + dir + n) % n);
    },
    [legend, index, selectVideo],
  );

  // Focus management + scroll lock
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = overflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  // Keyboard: Esc closes, arrows step, Tab is trapped in the dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeVideo();
      } else if (e.key === "ArrowRight") {
        step(1);
      } else if (e.key === "ArrowLeft") {
        step(-1);
      } else if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, closeVideo]);

  // Center the active thumbnail horizontally without scrolling the dialog
  useEffect(() => {
    const thumb = activeThumbRef.current;
    const strip = thumb?.parentElement;
    if (!thumb || !strip) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [videoModal, reduceMotion]);

  const navButton = "glass glass-press flex shrink-0 items-center justify-center rounded-full text-chalk";

  return (
    <AnimatePresence>
      {open && legend && video && (
        <motion.div
          key="video-modal"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.dialogLabel(legendName)}
          className="fixed inset-0 z-[80] flex flex-col bg-[#050507] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] [--modal-chrome:310px] md:[--modal-chrome:290px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
        >
          {/* Stage light around the screen — behind everything, never over the video */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(60% 50% at 50% 42%, rgba(220,20,60,0.14), transparent 70%)" }}
          />

          <header className="relative flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <h2 className="truncate font-display text-2xl uppercase leading-none tracking-wide text-chalk sm:text-3xl">
                {legendName}
              </h2>
              <p className="mt-1 truncate font-mono text-[11px] text-bone tabular-data">
                {index + 1} {t.of} {legend.videos.length} · {l(legend.subtitle)}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={closeVideo}
              aria-label={t.close}
              className={`${navButton} h-11 w-11`}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          {/* Stage: the player takes all remaining space at 16:9 */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-4 px-2 sm:px-6">
            {multiple && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.prev}
                className={`${navButton} hidden h-12 w-12 md:flex`}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            <motion.div
              key={video.youtubeId}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative aspect-video overflow-hidden rounded-[18px] bg-black shadow-[0_40px_120px_-30px_rgba(220,20,60,0.45)] sm:rounded-[22px]"
              style={{ width: "min(100%, calc((100dvh - var(--modal-chrome)) * 16 / 9))" }}
            >
              {isUnavailable ? (
                <div
                  role="alert"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
                >
                  <AlertCircle className="h-8 w-8 text-crimson" aria-hidden="true" />
                  <p className="font-display text-2xl uppercase tracking-wide text-chalk sm:text-3xl">
                    {t.unavailableTitle}
                  </p>
                  <p className="max-w-[46ch] text-sm text-bone">{t.unavailableBody}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {multiple && (
                      <button
                        type="button"
                        onClick={() => step(1)}
                        className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
                      >
                        {t.next}
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    <a
                      href={youtubeWatch(video.youtubeId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
                    >
                      {t.openOnYoutube}
                      <ExternalLink className="h-3.5 w-3.5 text-tungsten" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={youtubeEmbed(video.youtubeId, { origin: window.location.origin })}
                  title={`${legendName} — ${video.title}`}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={listenToPlayer}
                />
              )}
            </motion.div>

            {multiple && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.next}
                className={`${navButton} hidden h-12 w-12 md:flex`}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Bottom dock */}
          <div className="relative mx-auto w-full max-w-[1280px] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-condensed text-lg font-bold uppercase tracking-wide text-chalk sm:text-xl">
                  <span className="mr-2 font-mono text-[11px] font-normal text-crimson-bright">{t.nowPlaying}</span>
                  {video.title}
                </p>
                <p className="truncate text-xs text-bone">
                  {l(video.note)}
                  {livePauseReason === "modal" && (
                    <span className="ml-3 hidden items-center gap-1 text-ash sm:inline-flex">
                      <Radio className="h-3 w-3 text-crimson" aria-hidden="true" />
                      {t.liveNotice}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {multiple && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={t.prev}
                      className={`${navButton} h-10 w-10 md:hidden`}
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={t.next}
                      className={`${navButton} h-10 w-10 md:hidden`}
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </>
                )}
                <a
                  href={youtubeWatch(video.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
                >
                  <span>{t.openOnYoutube}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-tungsten" aria-hidden="true" />
                </a>
              </div>
            </div>

            {multiple && (
              <div
                role="group"
                aria-label={t.playlist}
                className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1"
              >
                {legend.videos.map((v, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={v.youtubeId}
                      ref={active ? activeThumbRef : undefined}
                      type="button"
                      onClick={() => selectVideo(legend.id, i)}
                      aria-current={active ? "true" : undefined}
                      className={`glass-press flex w-[230px] shrink-0 snap-start items-center gap-2.5 rounded-[14px] p-1.5 pr-3 text-left transition-colors ${
                        active
                          ? "bg-white/[0.1] shadow-[inset_0_0_0_1.5px_rgba(220,20,60,0.85)]"
                          : "bg-white/[0.04] hover:bg-white/[0.08]"
                      }`}
                    >
                      <img
                        src={youtubeThumb(v.youtubeId, "mq")}
                        alt=""
                        loading="lazy"
                        width={320}
                        height={180}
                        className="aspect-video w-[88px] shrink-0 rounded-[10px] object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-condensed text-sm font-bold uppercase tracking-wide text-chalk">
                          {v.title}
                        </span>
                        <span className="block truncate text-[11px] text-bone">
                          {unavailable.has(v.youtubeId) ? (
                            <span className="text-crimson-bright">{t.unavailableTag}</span>
                          ) : (
                            l(v.note)
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div
              role="group"
              aria-label={isGenre ? t.genres : t.bands}
              className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1"
            >
              {playlists.map((x) => {
                const active = x.id === legend.id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => selectVideo(x.id, 0)}
                    aria-pressed={active}
                    className={`glass-press inline-flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-3.5 font-condensed text-sm font-bold uppercase tracking-wider ${
                      active ? "glass glass-tint-crimson text-chalk" : "bg-white/[0.05] text-bone hover:text-chalk"
                    }`}
                  >
                    <img
                      src={youtubeThumb(x.videos[0].youtubeId, "mq")}
                      alt=""
                      loading="lazy"
                      width={320}
                      height={180}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    {nameOf(x)}
                  </button>
                );
              })}
            </div>

            <p className="mt-1 hidden text-right font-mono text-[11px] text-ash md:block">{t.keyboardHint}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
