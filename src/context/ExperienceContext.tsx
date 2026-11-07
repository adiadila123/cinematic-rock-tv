"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Decides how much of the experience a device gets:
 * - `reduceMotion`: the OS asks for reduced motion and the visitor has not
 *   explicitly turned animations back on from the site's prompt.
 * - `lite`: the device can't render the glass material well (no backdrop
 *   blur, or no GPU acceleration). Lite drops blur/refraction and the video
 *   scrub but keeps the layout and the light reveal animations.
 * Both are mirrored onto <html> as classes so CSS can follow.
 * Testing: `?lite=1` / `?lite=0` force lite mode on or off for the session.
 */
const MOTION_KEY = "rocktv-motion";

interface ExperienceValue {
  ready: boolean;
  systemReducedMotion: boolean;
  motionOverride: boolean;
  reduceMotion: boolean;
  lite: boolean;
  setMotionOverride: (on: boolean) => void;
}

const ExperienceContext = createContext<ExperienceValue | undefined>(undefined);

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode, policy) — preference lasts this visit only
  }
}

function detectLite(): boolean {
  const forced = new URLSearchParams(window.location.search).get("lite");
  if (forced === "1") return true;
  if (forced === "0") return false;

  const blur =
    CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)");
  if (!blur) return true;

  // A WebGL context that refuses `failIfMajorPerformanceCaveat` means the
  // browser is software-rendering — typical when GPU acceleration is off.
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return true;
  } catch {
    return true;
  }

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

function isChromium() {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData
    ?.brands;
  return Boolean(brands?.some((b) => b.brand === "Chromium"));
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [motionOverride, setOverrideState] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    setOverrideState(readStorage(MOTION_KEY) === "on");
    setLite(detectLite());
    setReady(true);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setMotionOverride = useCallback((on: boolean) => {
    setOverrideState(on);
    writeStorage(MOTION_KEY, on ? "on" : null);
  }, []);

  const reduceMotion = systemReducedMotion && !motionOverride;

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("force-motion", motionOverride);
    root.classList.toggle("lite", lite);
    root.classList.toggle("lg-refract", isChromium() && !lite && !reduceMotion);
  }, [ready, motionOverride, lite, reduceMotion]);

  const value = useMemo(
    () => ({ ready, systemReducedMotion, motionOverride, reduceMotion, lite, setMotionOverride }),
    [ready, systemReducedMotion, motionOverride, reduceMotion, lite, setMotionOverride]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {/* framer-motion follows the same decision, including the visitor's override */}
      <MotionConfig reducedMotion={motionOverride ? "never" : "user"}>{children}</MotionConfig>
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error("useExperience must be used within an ExperienceProvider");
  return context;
}

/** Drop-in for framer's useReducedMotion that honours the site override. */
export function useReduceMotion() {
  return useExperience().reduceMotion;
}
