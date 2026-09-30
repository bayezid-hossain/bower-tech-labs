"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

type StickyHeaderProps = {
  className?: string;
  /** Section after which the desktop header pins itself. */
  heroSelector?: string;
  children: ReactNode;
};

/**
 * Sticky page header. Below lg it is always pinned. From lg it scrolls away with the hero like a normal header,
 * then slides back in and stays pinned once the hero has been scrolled past (and hides again inside the hero).
 */
export function StickyHeader({ className, heroSelector = '[aria-labelledby="hero-title"]', children }: StickyHeaderProps) {
  const ref = useRef<HTMLElement>(null);

  const apply = useCallback(
    (y: number) => {
      const el = ref.current;
      if (!el) return;
      if (!window.matchMedia("(min-width: 64rem)").matches) {
        el.style.transform = "";
        el.style.transition = "";
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hero = document.querySelector<HTMLElement>(heroSelector);
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
      const height = el.offsetHeight;
      if (y >= heroBottom - height) {
        // Past the hero: slide in and stay.
        el.style.transition = reduce ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "translateY(0)";
      } else if (y > height) {
        // Inside the hero, already scrolled off: stay hidden.
        el.style.transition = reduce ? "none" : "transform 0.25s ease-out";
        el.style.transform = "translateY(-100%)";
      } else {
        // At the very top: move with the page, exactly like a non-sticky header.
        el.style.transition = "none";
        el.style.transform = `translateY(${-y}px)`;
      }
    },
    [heroSelector],
  );

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", apply);

  useEffect(() => {
    const sync = () => apply(window.scrollY);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [apply]);

  return (
    <header ref={ref} className={className}>
      {children}
    </header>
  );
}
