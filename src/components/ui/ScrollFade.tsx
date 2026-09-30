"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ScrollFadeProps = {
  /** Put the height cap here, e.g. "max-h-[9.5rem] lg:max-h-none". */
  className?: string;
  /** Background the fade blends into (a bg-* token class for the gradient's start color). */
  fadeClassName?: string;
  /** Accessible label for the "scroll for more" caret button. */
  moreLabel: string;
  children: ReactNode;
};

/**
 * Vertically scrollable region that hints at hidden content: while more is below, a soft fade and a small
 * caret sit at the bottom edge (tapping the caret scrolls on); both disappear once scrolled to the end.
 */
export function ScrollFade({ className, fadeClassName = "from-surface", moreLabel, children }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = el.scrollHeight - el.scrollTop - el.clientHeight > 2;
    setMore((current) => (current === next ? current : next));
  }, []);

  const scrollMore = () => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ top: el.clientHeight * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  const { scrollY } = useScroll({ container: ref });
  useMotionValueEvent(scrollY, "change", check);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frame = requestAnimationFrame(check);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [check]);

  return (
    <div className="relative">
      <div ref={ref} className={cn("relative overflow-y-auto overscroll-contain scrollbar-none", className)}>
        {children}
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-end justify-center bg-gradient-to-t to-transparent text-body transition-opacity duration-200",
          fadeClassName,
          more ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Only the caret is clickable; the fade itself never blocks scrolling or taps on the list. */}
        <button
          type="button"
          aria-label={moreLabel}
          tabIndex={more ? 0 : -1}
          aria-hidden={more ? undefined : true}
          onClick={scrollMore}
          className={cn(
            "flex size-8 items-center justify-center rounded-full transition-transform active:scale-90 focus-visible:outline-2 focus-visible:outline-navy",
            more && "pointer-events-auto",
          )}
        >
          <CaretDownIcon size={16} weight="bold" className="animate-bounce" />
        </button>
      </div>
    </div>
  );
}
