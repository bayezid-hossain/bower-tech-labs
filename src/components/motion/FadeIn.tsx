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
  /** Both replay on every viewport entry; "mount" (above-the-fold) triggers as soon as any part is visible. */
  trigger?: "inView" | "mount";
  className?: string;
  children: ReactNode;
};

/** Spring fade-up (trexalab.com style: opacity 0→1, y→0, spring bounce 0, 1.6s). Resting state = final layout. */
export function FadeIn({ as = "div", delay = 0, y = 20, trigger = "inView", className, children }: FadeInProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const shown = { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 1.6, delay } };
  // Replays every time the element re-enters the viewport. "mount" content (hero) is already in view on load,
  // so it plays immediately and stays shown until it has fully left the screen.
  const play = { whileInView: shown, viewport: { once: false, amount: trigger === "mount" ? 0 : 0.2 } };
  return (
    <Tag className={className} initial={reduce ? false : { opacity: 0, y }} {...play}>
      {children}
    </Tag>
  );
}
