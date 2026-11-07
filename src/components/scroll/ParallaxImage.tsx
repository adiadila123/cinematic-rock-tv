"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/context/ExperienceContext";

/**
 * Image that drifts slower than its frame while the frame scrolls through the
 * viewport (parallax), optionally easing in from a slight zoom.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 9,
  zoom = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Max vertical drift, in % of the frame height. */
  strength?: number;
  zoom?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReduceMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : [`-${strength}%`, `${strength}%`]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [1.2, 1.2, 1.2] : zoom ? [1.35, 1.2, 1.2] : [1.2, 1.2, 1.2]
  );

  return (
    <div ref={frameRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        width={1376}
        height={768}
        style={{ y, scale }}
        className="h-full w-full object-cover object-center will-change-transform"
      />
    </div>
  );
}
