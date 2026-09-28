"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCarouselState, type CarouselState } from "@/lib/carousel";

/** Scroll-snap carousel controller. Steps by one item (first child width + track column gap). */
export function useCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CarouselState>({ canPrev: false, canNext: true });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (el) setState(getCarouselState(el.scrollLeft, el.scrollWidth, el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const step = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  }, []);

  return {
    trackRef,
    canPrev: state.canPrev,
    canNext: state.canNext,
    prev: () => step(-1),
    next: () => step(1),
  };
}
