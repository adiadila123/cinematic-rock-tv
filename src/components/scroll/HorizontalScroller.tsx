"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/context/ExperienceContext";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Horizontal scroll. On large screens the row pins and vertical scrolling
 * slides it sideways; the track is exactly as tall as the sideways distance,
 * so wheel speed maps 1:1 to card movement. Phones, tablets and reduced
 * motion get a native swipeable row with snap points instead.
 */
export function HorizontalScroller({ header, children }: { header?: React.ReactNode; children: React.ReactNode }) {
  const reduceMotion = useReduceMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches && !reduceMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  if (pinned) return <PinnedRow header={header}>{children}</PinnedRow>;

  return (
    <>
    {header}
    <div className="mt-6 no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8">
      {React.Children.map(children, (child) => (
        <div className="w-[86vw] max-w-[520px] shrink-0 snap-start">{child}</div>
      ))}
    </div>
    </>
  );
}

// Separate component so the track ref exists when useScroll binds to it
function PinnedRow({ header, children }: { header?: React.ReactNode; children: React.ReactNode }) {
  const [distance, setDistance] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () =>
      setDistance(Math.max(0, row.scrollWidth - (row.parentElement?.clientWidth ?? window.innerWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={trackRef} className="relative -mx-12" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {header && <div className="mb-8 px-12">{header}</div>}
        <motion.div ref={rowRef} style={{ x }} className="flex w-max gap-6 px-12">
          {React.Children.map(children, (child) => (
            <div className="w-[min(560px,42vw)] shrink-0">{child}</div>
          ))}
        </motion.div>
        <div className="mx-12 mt-8 h-[2px] overflow-hidden rounded-full bg-white/10">
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-crimson" />
        </div>
      </div>
    </div>
  );
}
