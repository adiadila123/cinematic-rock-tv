"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Compact glass title bar that pins under the header while its section is on
 * screen. It is sticky inside its own <section>, so the next section's bar
 * naturally pushes it away — headers relay one another as sections change.
 * Zero height, so it never shifts layout; it fades in once the real heading
 * has scrolled out of view and shows how far through the section you are.
 */
export function StickySectionBar({
  sectionRef,
  title,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  title: string;
}) {
  // The section ref belongs to the parent and is attached after this child
  // mounts, so useScroll({ target }) would bind to the page instead. Derive
  // "start start → end start" progress from the live section rect.
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, (y) => {
    const el = sectionRef.current;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + y;
    return Math.min(1, Math.max(0, (y - top) / el.offsetHeight));
  });
  const opacity = useTransform(scrollYProgress, [0.04, 0.09, 0.93, 0.98], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.04, 0.09], [-8, 0]);
  const fill = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <div aria-hidden="true" className="pointer-events-none sticky top-[84px] z-30 h-0 sm:top-[96px]">
      <motion.div style={{ opacity, y }} className="mx-auto flex max-w-[1440px] justify-center px-4 sm:px-8 lg:px-12">
        <div className="glass glass-thick relative overflow-hidden rounded-full px-4 py-2">
          <span className="font-condensed text-sm font-bold uppercase tracking-wider text-chalk">{title}</span>
          <motion.span
            style={{ scaleX: fill }}
            className="absolute inset-x-3 bottom-0 h-[2px] origin-left rounded-full bg-crimson"
          />
        </div>
      </motion.div>
    </div>
  );
}
