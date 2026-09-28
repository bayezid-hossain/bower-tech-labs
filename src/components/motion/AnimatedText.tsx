"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Fragment } from "react";

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span } as const;

const word: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 1.2 } },
};

type AnimatedTextProps = {
  text: string;
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  trigger?: "inView" | "mount";
  /** Same semantics as LineBreaks: "\n" breaks only at lg+ by default. */
  breakOn?: "lg" | "always";
};

/**
 * Word-by-word reveal (trexalab.com style): each word fades 0→1 and rises 10px→0, 50ms apart.
 * Screen readers get the full sentence from an sr-only copy; the animated words are aria-hidden.
 */
export function AnimatedText({ text, as = "span", id, className, delay = 0, trigger = "inView", breakOn = "lg" }: AnimatedTextProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: delay } } };
  const play = trigger === "mount" ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, amount: 0.3 } };

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
                <motion.span aria-hidden="true" className="inline-block" variants={word}>
                  {w}
                </motion.span>
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            ))}
        </Fragment>
      ))}
    </Tag>
  );
}
