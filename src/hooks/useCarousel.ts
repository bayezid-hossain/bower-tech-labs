"use client";

import { useCallback, useRef } from "react";
import { getStepTarget } from "@/lib/carousel";

/**
 * Looping scroll-snap carousel controller. Steps by one item (first child width + track column gap);
 * next at the end wraps to the first item, prev at the start wraps to the last.
 */
export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const left = getStepTarget(el.scrollLeft, el.scrollWidth, el.clientWidth, item.offsetWidth + gap, direction);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  return { trackRef, prev, next };
}
