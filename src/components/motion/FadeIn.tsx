"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const tags = { div: motion.div, p: motion.p, li: motion.li, span: motion.span } as const;

type FadeInProps = {
  as?: keyof typeof tags;
  /** Seconds. */
  delay?: number;
  /** Starting offset in px (trexalab uses 10–20). */
  y?: number;
  /** "mount" plays on load (above-the-fold); "inView" plays once when scrolled into view. */
  trigger?: "inView" | "mount";
  className?: string;
  children: ReactNode;
};

/** Spring fade-up (trexalab.com style: opacity 0→1, y→0, spring bounce 0, 1.6s). Resting state = final layout. */
export function FadeIn({ as = "div", delay = 0, y = 20, trigger = "inView", className, children }: FadeInProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const shown = { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 1.6, delay } };
  const play = trigger === "mount" ? { animate: shown } : { whileInView: shown, viewport: { once: true, amount: 0.2 } };
  return (
    <Tag className={className} initial={reduce ? false : { opacity: 0, y }} {...play}>
      {children}
    </Tag>
  );
}
