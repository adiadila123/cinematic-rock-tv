"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Tv,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Power,
  Volume2,
  Copy,
  Check,
  AlertCircle,
  Sliders,
  Sparkles,
  MonitorPlay,
  PauseCircle,
} from "lucide-react";
import { STREAM_SOURCE_URL } from "@/data/rockTvData";
import { useLocale } from "@/context/LocaleContext";
import { useMedia } from "@/context/MediaContext";

type DeckMode = "embed" | "fallback";
type StageWashMode = "crimson" | "tungsten" | "blackout";
type DeckStatus = "waiting" | "connecting" | "ready" | "standby" | "fallback";

export function LiveTelevisionDeck() {
  const { dict } = useLocale();
  const t = dict.live;
  const { liveOn, livePauseReason, setLivePlaying, pauseLive, resumeLive } = useMedia();

  const [deckMode, setDeckMode] = useState<DeckMode>("embed");
  const [connecting, setConnecting] = useState(true);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [stageWash, setStageWash] = useState<StageWashMode>("crimson");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [connectionTimestamp, setConnectionTimestamp] = useState("--:--:--");

  const playerStageRef = useRef<HTMLDivElement>(null);

  const iframeMounted = hasEnteredView && liveOn && deckMode === "embed";

  useEffect(() => {
    setLivePlaying(iframeMounted);
  }, [iframeMounted, setLivePlaying]);

  const status: DeckStatus = !hasEnteredView
    ? "waiting"
    : deckMode === "fallback"
    ? "fallback"
    : !liveOn
    ? "standby"
    : connecting
    ? "connecting"
    : "ready";

  // Mount the iframe only once the player is on screen, and stop it
  // (unmount = no audio, no bandwidth) as soon as the viewer scrolls past it.
  useEffect(() => {
    const el = playerStageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          return;
        }
        if (!document.fullscreenElement) pauseLive("scroll");
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pauseLive]);

  useEffect(() => {
    setConnectionTimestamp(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    );
  }, [iframeKey, status]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Cross-origin onLoad can fire early or not at all; never stay stuck connecting.
  useEffect(() => {
    if (!connecting || !iframeMounted) return;
    const timer = window.setTimeout(() => setConnecting(false), 2500);
    return () => window.clearTimeout(timer);
  }, [connecting, iframeMounted, iframeKey]);

  const reconnect = useCallback(() => {
    setConnecting(true);
    setIframeKey((k) => k + 1);
  }, []);

  const handleResume = useCallback(() => {
    setDeckMode("embed");
    reconnect();
    resumeLive();
  }, [reconnect, resumeLive]);

  const handleToggleStandby = () => {
    if (liveOn) pauseLive("manual");
    else handleResume();
  };

  const handleToggleFullscreen = async () => {
    if (!playerStageRef.current) return;
    try {
      if (!document.fullscreenElement) await playerStageRef.current.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      setIsTheaterMode((prev) => !prev);
    }
  };

  const handleCopyStreamUrl = async () => {
    try {
      await navigator.clipboard.writeText(STREAM_SOURCE_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      setCopiedUrl(false);
    }
  };

  const washShadow =
    stageWash === "crimson"
      ? "0 40px 110px -24px rgba(220, 20, 60, 0.45), 0 24px 64px -16px rgba(0, 0, 0, 0.9)"
      : stageWash === "tungsten"
      ? "0 40px 110px -24px rgba(255, 98, 0, 0.38), 0 24px 64px -16px rgba(0, 0, 0, 0.9)"
      : "0 28px 70px -12px rgba(0, 0, 0, 0.96)";

  const standbyReason =
    livePauseReason === "scroll"
      ? t.standbyReasonScroll
      : livePauseReason === "modal"
      ? t.standbyReasonModal
      : t.standbyReasonManual;

  const statusLabel = {
    waiting: t.statusWaiting,
    connecting: t.statusConnecting,
    ready: t.statusReady,
    standby: t.statusStandby,
    fallback: t.statusFallback,
  }[status];

  const lampClass =
    status === "ready" ? "bg-crimson" : status === "connecting" ? "bg-tungsten" : "bg-ash";

  const washes: { id: StageWashMode; label: string; active: string }[] = [
    { id: "crimson", label: t.washCrimson, active: "bg-crimson text-chalk" },
    { id: "tungsten", label: t.washTungsten, active: "bg-tungsten text-void" },
    { id: "blackout", label: t.washBlackout, active: "bg-white/20 text-chalk" },
  ];

  const secondaryBtn =
    "glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wider text-chalk";

  return (
    <section id="live-tv" aria-labelledby="live-tv-heading" className="relative py-20 sm:py-28">
      <div
        className={`relative z-10 mx-auto w-full px-4 transition-all duration-300 sm:px-8 lg:px-12 ${
          isTheaterMode ? "max-w-[1680px]" : "max-w-[1440px]"
        }`}
      >
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2
              id="live-tv-heading"
              className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] uppercase leading-[1.1] tracking-[-0.02em] text-chalk"
            >
              {t.heading}
            </h2>
            <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-bone">{t.lead}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            <div role="status" aria-live="polite" className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${lampClass}`} aria-hidden="true" />
              <span className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">{statusLabel}</span>
            </div>
            <div className="glass glass-thin rounded-full px-3.5 py-2.5 font-mono text-xs text-bone tabular-data">
              {t.sync}: {connectionTimestamp}
            </div>
          </div>
        </div>

        {/* Player frame */}
        <div
          ref={playerStageRef}
          style={{ boxShadow: washShadow, borderRadius: isFullscreen ? 0 : 28 }}
          className="glass glass-thick relative flex flex-col gap-2 p-2 transition-shadow duration-500"
        >
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4">
            <div className="flex items-center gap-3">
              <Tv className="h-4 w-4 text-crimson" aria-hidden="true" />
              <span className="font-condensed text-base font-bold uppercase tracking-wider text-chalk">{t.monitor}</span>
              <span className="hidden rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] text-bone tabular-data sm:inline-block">
                {t.hdBadge}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div role="group" aria-label={t.washGroup} className="hidden items-center gap-0.5 rounded-full bg-white/[0.05] p-1 sm:flex">
                {washes.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setStageWash(w.id)}
                    aria-pressed={stageWash === w.id}
                    className={`rounded-full px-3 py-1 font-condensed text-xs font-bold uppercase tracking-wider transition-colors ${
                      stageWash === w.id ? w.active : "text-bone hover:text-chalk"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsTheaterMode((prev) => !prev)}
                aria-pressed={isTheaterMode}
                className="glass glass-thin glass-press hidden items-center gap-1.5 rounded-full px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-wider text-chalk md:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5 text-tungsten" aria-hidden="true" />
                <span>{isTheaterMode ? t.wideOff : t.wideOn}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="glass glass-thin glass-press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-wider text-chalk"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5 text-crimson" aria-hidden="true" />
                )}
                <span>{isFullscreen ? t.exitFullscreen : t.fullscreen}</span>
              </button>
            </div>
          </div>

          {/* 16:9 viewport */}
          <div className="relative aspect-video w-full overflow-hidden rounded-glass-sm bg-void shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            {iframeMounted && (
              <iframe
                key={iframeKey}
                src={STREAM_SOURCE_URL}
                title={t.iframeTitle}
                className="h-full w-full border-0 bg-void"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setConnecting(false)}
                onError={() => setDeckMode("fallback")}
              />
            )}

            {(status === "waiting" || status === "connecting") && (
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-void/80 p-6 text-center backdrop-blur-md">
                <div className="glass rounded-full p-4">
                  <RotateCw className="h-7 w-7 animate-spin text-crimson" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-condensed text-xl font-bold uppercase tracking-wider text-chalk sm:text-2xl">
                  {t.connectingTitle}
                </h3>
                <p className="mt-2 hidden max-w-[50ch] text-sm text-bone sm:block">{t.connectingBody}</p>
              </div>
            )}

            {status === "standby" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
                <img
                  src="/images/hero-arena-stage.webp"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div className="glass glass-thick glass-refract relative z-10 max-w-lg rounded-glass p-5 text-center sm:p-8">
                  <PauseCircle className="mx-auto hidden h-9 w-9 text-crimson sm:block" aria-hidden="true" />
                  <h3 className="font-display text-2xl uppercase tracking-wide text-chalk sm:mt-3 sm:text-3xl">
                    {t.standbyTitle}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-bone sm:mt-3 sm:text-sm">{standbyReason}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleResume}
                      className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk sm:px-6 sm:py-3 sm:text-base"
                    >
                      <MonitorPlay className="h-4 w-4" aria-hidden="true" />
                      <span>{t.resume}</span>
                    </button>
                    <a
                      href={STREAM_SOURCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass glass-press hidden items-center gap-2 rounded-full px-5 py-3 font-condensed text-base font-bold uppercase tracking-wider text-chalk sm:inline-flex"
                    >
                      <span>{t.openExternal}</span>
                      <ExternalLink className="h-4 w-4 text-tungsten" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {status === "fallback" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                <img
                  src="/images/experience-valve-amp.webp"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="glass glass-thick relative z-10 max-w-xl rounded-glass p-5 text-center sm:p-8">
                  <AlertCircle className="mx-auto hidden h-8 w-8 text-crimson sm:block" aria-hidden="true" />
                  <h3 className="font-display text-2xl uppercase tracking-wide text-chalk sm:mt-3 sm:text-3xl">
                    {t.fallbackTitle}
                  </h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-bone sm:block">{t.fallbackBody}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6">
                    <a
                      href={STREAM_SOURCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-condensed text-sm font-bold uppercase tracking-wider text-chalk sm:py-3 sm:text-base"
                    >
                      <span>{t.launchDirect}</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <button type="button" onClick={handleCopyStreamUrl} className={secondaryBtn}>
                      {copiedUrl ? (
                        <Check className="h-4 w-4 text-tungsten" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4 text-bone" aria-hidden="true" />
                      )}
                      <span>{copiedUrl ? t.copied : t.copyUrl}</span>
                    </button>
                    <button type="button" onClick={handleResume} className={secondaryBtn}>
                      <RotateCw className="h-4 w-4" aria-hidden="true" />
                      <span>{t.backToEmbed}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom console */}
          <div className="flex flex-col justify-between gap-3 px-2 py-2 sm:px-3 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleToggleStandby}
                disabled={liveOn && !iframeMounted}
                className={
                  liveOn
                    ? `${secondaryBtn} disabled:opacity-50`
                    : "glass glass-tint-tungsten glass-press inline-flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wider text-void"
                }
              >
                <Power className="h-4 w-4" aria-hidden="true" />
                <span>{liveOn ? t.standbyButton : t.powerOn}</span>
              </button>

              <button type="button" onClick={reconnect} disabled={!iframeMounted} className={`${secondaryBtn} disabled:opacity-50`}>
                <RotateCw className="h-4 w-4 text-crimson" aria-hidden="true" />
                <span>{t.resync}</span>
              </button>

              <div className="flex items-center gap-2 px-1 text-xs text-bone">
                <Volume2 className="h-4 w-4 shrink-0 text-tungsten" aria-hidden="true" />
                <span>{t.volumeHint}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => (deckMode === "fallback" ? handleResume() : setDeckMode("fallback"))}
                className="glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-condensed text-xs font-bold uppercase tracking-wider text-bone hover:text-chalk"
              >
                <Sliders className="h-3.5 w-3.5 text-tungsten" aria-hidden="true" />
                <span>{deckMode === "fallback" ? t.showEmbed : t.useFallback}</span>
              </button>

              <a
                href={STREAM_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wider text-chalk"
              >
                <span>{t.openStream}</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Spec bar */}
        <div className="glass mt-6 grid grid-cols-1 gap-4 rounded-glass p-5 sm:grid-cols-3 sm:p-6">
          <div className="glass-divider border-b pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-chalk">{t.specSourceTitle}</h3>
            <p className="mt-1 break-all font-mono text-xs text-bone">{STREAM_SOURCE_URL}</p>
          </div>
          <div className="glass-divider border-b pb-4 sm:border-b-0 sm:border-r sm:px-4 sm:pb-0">
            <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-chalk">{t.specFormatTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed text-bone">{t.specFormatBody}</p>
          </div>
          <div className="sm:pl-4">
            <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-chalk">{t.specCompatTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed text-bone">{t.specCompatBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
