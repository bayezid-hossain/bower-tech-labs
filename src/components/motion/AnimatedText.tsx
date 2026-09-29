"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Fragment } from "react";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

const word: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

/** Letter rolls up from below a clipped baseline, like the button label roll. */
const letter: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

type AnimatedTextProps = {
  text: string;
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  /** Seconds before the first word/letter starts. */
  delay?: number;
  trigger?: "inView" | "mount";
  /** Same semantics as LineBreaks: "\n" breaks only at lg+ by default. */
  breakOn?: "lg" | "always";
  /** "fade": words fade and rise (body/subtitles). "roll": letters roll up into place (section headings). */
  effect?: "fade" | "roll";
};

/**
 * Text reveal that replays each time the text enters the viewport.
 * Screen readers get the full sentence from an sr-only copy; the animated pieces are aria-hidden.
 */
export function AnimatedText({
  text,
  as = "span",
  id,
  className,
  delay = 0,
  trigger = "inView",
  breakOn = "lg",
  effect = "fade",
}: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const stagger = effect === "roll" ? 0.022 : 0.03;
  const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  // Replays every time the element re-enters the viewport. "mount" content (hero) is already in view on load,
  // so it plays immediately and stays shown until it has fully left the screen.
  const play = { whileInView: "visible", viewport: { once: false, amount: trigger === "mount" ? 0 : 0.3 } };

  const renderWord = (w: string) =>
    effect === "roll" ? (
      // clip-path (not overflow) hides letters below the line without changing the baseline; the negative
      // insets leave room for ascenders/descenders so nothing is cut at rest.
      <span aria-hidden="true" className="inline-block [clip-path:inset(-0.3em_-0.1em_-0.28em_-0.1em)]">
        {Array.from(w).map((ch, ci) => (
          <motion.span key={ci} className="inline-block" variants={letter}>
            {ch}
          </motion.span>
        ))}
      </span>
    ) : (
      <motion.span aria-hidden="true" className="inline-block" variants={word}>
        {w}
      </motion.span>
    );

  return (
    <Tag id={id} className={className} variants={container} initial={reduce ? false : "hidden"} {...play}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && (
            <>
              {" "}
              <br aria-hidden="true" className={breakOn === "lg" ? "hidden lg:inline" : undefined} />
            </>
          )}
          {line
            .split(" ")
            .filter(Boolean)
            .map((w, wi, words) => (
              <Fragment key={wi}>
                {renderWord(w)}
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            ))}
        </Fragment>
      ))}
    </Tag>
  );
}
