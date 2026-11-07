"use client";

import { useEffect, useState } from "react";

export const SECTION_IDS = ["intro", "live-tv", "experience", "discover", "legends", "about"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("intro");

  // The active section is the last one whose top has crossed a line 35% down
  // the viewport (or the final one once the page bottoms out).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: SectionId = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && (el.getBoundingClientRect().top <= line || (atBottom && id === "about"))) {
          current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}
