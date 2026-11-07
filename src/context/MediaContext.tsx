"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/**
 * Single source of truth for everything that can make sound on the page.
 * Only one audio source may be active: the live broadcast iframe or a
 * music video in the legends modal — never both.
 */
export type LivePauseReason = "scroll" | "modal" | "manual" | null;

interface VideoModalState {
  legendId: string;
  index: number;
}

interface MediaContextValue {
  liveOn: boolean;
  livePauseReason: LivePauseReason;
  /** The deck reports whether its iframe is actually mounted (i.e. can make sound). */
  setLivePlaying: (playing: boolean) => void;
  pauseLive: (reason: Exclude<LivePauseReason, null>) => void;
  resumeLive: () => void;
  videoModal: VideoModalState | null;
  openVideo: (legendId: string, index?: number) => void;
  selectVideo: (legendId: string, index: number) => void;
  closeVideo: () => void;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [liveOn, setLiveOn] = useState(true);
  const [livePauseReason, setLivePauseReason] = useState<LivePauseReason>(null);
  const [videoModal, setVideoModal] = useState<VideoModalState | null>(null);
  const livePlayingRef = useRef(false);

  const setLivePlaying = useCallback((playing: boolean) => {
    livePlayingRef.current = playing;
  }, []);

  const pauseLive = useCallback((reason: Exclude<LivePauseReason, null>) => {
    if (!livePlayingRef.current) return;
    livePlayingRef.current = false;
    setLivePauseReason(reason);
    setLiveOn(false);
  }, []);

  const resumeLive = useCallback(() => {
    setVideoModal(null);
    setLivePauseReason(null);
    setLiveOn(true);
  }, []);

  const openVideo = useCallback(
    (legendId: string, index = 0) => {
      pauseLive("modal");
      setVideoModal({ legendId, index });
    },
    [pauseLive]
  );

  const selectVideo = useCallback((legendId: string, index: number) => {
    setVideoModal({ legendId, index });
  }, []);

  const closeVideo = useCallback(() => setVideoModal(null), []);

  const value = useMemo(
    () => ({
      liveOn,
      livePauseReason,
      setLivePlaying,
      pauseLive,
      resumeLive,
      videoModal,
      openVideo,
      selectVideo,
      closeVideo,
    }),
    [liveOn, livePauseReason, setLivePlaying, pauseLive, resumeLive, videoModal, openVideo, selectVideo, closeVideo]
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
}
