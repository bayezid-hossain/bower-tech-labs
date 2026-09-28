"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pageCount, pageFromScroll, pageScrollLeft } from "@/lib/carousel";

/**
 * Paged scroll-snap carousel. Items per page is read from the track's CSS `--per-page`
 * (responsive, see .carousel-track in globals.css), so breakpoints stay in CSS.
 */
export function usePagedCarousel(itemCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ page: 0, pages: 1 });

  const metrics = useCallback(() => {
    const el = trackRef.current;
    const item = el?.firstElementChild as HTMLElement | null;
    if (!el || !item) return null;
    const styles = getComputedStyle(el);
    const perPage = parseInt(styles.getPropertyValue("--per-page"), 10) || 1;
    const gap = parseFloat(styles.columnGap) || 0;
    return { el, pages: pageCount(itemCount, perPage), pageWidth: perPage * (item.offsetWidth + gap) };
  }, [itemCount]);

  const update = useCallback(() => {
    const m = metrics();
    if (!m) return;
    const page = pageFromScroll(m.el.scrollLeft, m.pageWidth, m.pages);
    setState((s) => (s.page === page && s.pages === m.pages ? s : { page, pages: m.pages }));
  }, [metrics]);

  // Scroll tracking via Motion (no raw scroll listeners); state only changes when the page does.
  const { scrollX } = useScroll({ container: trackRef });
  useMotionValueEvent(scrollX, "change", update);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [update]);

  const goTo = useCallback(
    (page: number) => {
      const m = metrics();
      if (!m) return;
      const target = Math.min(m.pages - 1, Math.max(0, page));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      m.el.scrollTo({ left: pageScrollLeft(target, m.pageWidth), behavior: reduce ? "auto" : "smooth" });
    },
    [metrics],
  );

  const { page, pages } = state;
  return {
    trackRef,
    page,
    pages,
    canPrev: page > 0,
    canNext: page < pages - 1,
    prev: () => goTo(page - 1),
    next: () => goTo(page + 1),
    goTo,
  };
}
