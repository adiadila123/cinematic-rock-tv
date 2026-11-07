"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useExperience } from "@/context/ExperienceContext";
import { useLocale } from "@/context/LocaleContext";

const DISMISS_KEY = "rocktv-motion-prompt-dismissed";

/**
 * Shown only when the operating system asks for reduced motion. Offers an
 * explicit opt-in; nothing changes unless the visitor presses the button.
 * Dismissal lasts for the browser session.
 */
export function MotionPrompt() {
  const { dict } = useLocale();
  const t = dict.motion;
  const { ready, systemReducedMotion, motionOverride, setMotionOverride } = useExperience();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // session storage blocked — the prompt just reappears next visit
    }
  };

  if (!ready || !systemReducedMotion || motionOverride || dismissed) return null;

  return (
    <aside
      aria-labelledby="motion-prompt-title"
      className="glass glass-thick fixed inset-x-3 bottom-[calc(92px+env(safe-area-inset-bottom))] z-[55] rounded-glass p-4 sm:left-auto sm:right-5 sm:max-w-sm md:bottom-5"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.dismiss}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-bone hover:bg-white/10 hover:text-chalk"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <h2 id="motion-prompt-title" className="pr-8 font-condensed text-lg font-bold uppercase tracking-wide text-chalk">
        {t.promptTitle}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-bone">{t.promptBody}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMotionOverride(true)}
          className="glass glass-tint-crimson glass-press inline-flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-sm font-bold uppercase tracking-wider text-chalk"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t.enable}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full px-3 py-2 font-condensed text-sm font-bold uppercase tracking-wider text-bone hover:text-chalk"
        >
          {t.dismiss}
        </button>
      </div>
    </aside>
  );
}

/** Small footer control: lets visitors flip the choice back, and notes lite mode. */
export function ExperienceControls() {
  const { dict } = useLocale();
  const t = dict.motion;
  const { ready, systemReducedMotion, motionOverride, setMotionOverride, lite } = useExperience();
  if (!ready || (!systemReducedMotion && !lite)) return null;

  return (
    <div className="mt-4 flex flex-col items-start gap-2 md:items-end">
      {systemReducedMotion && (
        <button
          type="button"
          onClick={() => setMotionOverride(!motionOverride)}
          aria-pressed={motionOverride}
          className="glass glass-thin glass-press inline-flex items-center gap-2 rounded-full px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wider text-chalk"
        >
          <Sparkles className="h-3.5 w-3.5 text-tungsten" aria-hidden="true" />
          {motionOverride ? t.footerReduce : t.footerEnable}
        </button>
      )}
      {lite && <p className="font-mono text-[11px] text-ash md:text-right">{t.liteNote}</p>}
    </div>
  );
}
