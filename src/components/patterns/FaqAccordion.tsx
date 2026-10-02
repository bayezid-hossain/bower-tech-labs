"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { FaqItem } from "@/types/content";

type FaqAccordionProps = { items: FaqItem[]; className?: string };

/** One answer open at a time (the first by default); answers expand/collapse smoothly. */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <ul className={cn("flex flex-col gap-3 lg:gap-4", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li key={item.question} className="rounded-2xl bg-surface">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy lg:py-[18px]"
              >
                <span className="text-[15px] font-medium leading-6 tracking-[-0.02em] text-ink lg:text-base">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-200",
                    isOpen ? "bg-page text-ink" : "text-body",
                  )}
                >
                  {isOpen ? <MinusIcon size={14} weight="bold" /> : <PlusIcon size={14} weight="bold" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] } }}
                  exit={reduce ? { height: 0, opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0, transition: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[780px] px-5 pb-5 text-sm leading-[1.6] text-body lg:-mt-1 lg:pr-16">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
