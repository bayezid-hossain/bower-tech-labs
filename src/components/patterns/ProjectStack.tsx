"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { activeStackIndex, stackOffsets, stackScrollTarget, stackSnapTarget } from "@/lib/project-stack";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import type { Project } from "@/types/content";

type ProjectStackProps = { projects: Project[]; className?: string };

/** How long one card step "owns" the scroll: long enough to swallow trackpad/wheel momentum. */
const STEP_LOCK_MS = 900;
const SCROLL_KEYS: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };

/**
 * Sticky stacking project list. While the stack is engaged, each scroll gesture (wheel, trackpad, keys)
 * moves exactly one card; tabs bring any card back to the top of the stack.
 */
export function ProjectStack({ projects, className }: ProjectStackProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const geometry = useCallback(() => {
    const list = listRef.current;
    if (!list || list.children.length === 0) return null;
    const items = Array.from(list.children) as HTMLElement[];
    const top = parseFloat(getComputedStyle(items[0]).top);
    return {
      listTop: list.getBoundingClientRect().top + window.scrollY,
      offsets: stackOffsets(
        items.map((el) => el.offsetHeight),
        parseFloat(getComputedStyle(list).rowGap) || 0,
      ),
      // "auto" when stacking is off (short viewports) -> scroll to the card's top.
      stickyTop: Number.isFinite(top) ? top : 0,
      sticky: Number.isFinite(top),
    };
  }, []);

  const update = useCallback(() => {
    const g = geometry();
    if (!g) return;
    const next = activeStackIndex(window.scrollY, g.listTop, g.offsets, g.stickyTop);
    setActive((current) => (current === next ? current : next));
  }, [geometry]);

  // Page scroll via Motion's useScroll (no raw scroll listeners); state changes only when the top card does.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  // One card per gesture. Wheel/key/touch listeners (not scroll listeners) so the gesture can be cancelled before it moves the page.
  useEffect(() => {
    let lockedUntil = 0;
    const snapPoints = () => {
      const g = geometry();
      if (!g || !g.sticky) return null;
      return g.offsets.map((_, i) => stackScrollTarget(g.listTop, g.offsets, i, g.stickyTop));
    };
    const step = (delta: number): boolean => {
      const points = snapPoints();
      if (!points) return false;
      const y = window.scrollY;
      if (performance.now() < lockedUntil) {
        // Mid-step: swallow momentum inside the stack so one flick can't carry past the next card.
        return y >= points[0] - 2 && y <= points[points.length - 1] + 2;
      }
      const target = stackSnapTarget(y, delta, points);
      if (target === null) return false;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      lockedUntil = performance.now() + (reduce ? 80 : STEP_LOCK_MS);
      window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return; // pinch-zoom / horizontal swipes
      if (step(event.deltaY)) event.preventDefault();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = SCROLL_KEYS[event.key];
      const target = event.target as HTMLElement | null;
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
      if (target?.closest("input, textarea, select, [contenteditable='true'], [role='dialog']")) return;
      const sign = event.key === " " && event.shiftKey ? -1 : direction;
      if (step(sign * window.innerHeight * 0.8)) event.preventDefault();
    };
    // Touch: one swipe = one card. The swipe is held (no native scroll) once it would move within/into the stack,
    // then committed on release if it travelled far enough.
    let touchStartY: number | null = null;
    let touchHeld = false;
    const SWIPE_MIN = 30;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches.length === 1 ? event.touches[0].clientY : null;
      touchHeld = false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const delta = touchStartY - event.touches[0].clientY; // > 0 = swiping up = scrolling down
      if (touchHeld) {
        event.preventDefault();
        return;
      }
      const points = snapPoints();
      if (!points || performance.now() < lockedUntil) {
        if (points && performance.now() < lockedUntil) event.preventDefault();
        return;
      }
      if (stackSnapTarget(window.scrollY, delta, points) !== null) {
        touchHeld = true;
        event.preventDefault();
      }
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY !== null && touchHeld) {
        const delta = touchStartY - event.changedTouches[0].clientY;
        if (Math.abs(delta) >= SWIPE_MIN) step(delta);
      }
      touchStartY = null;
      touchHeld = false;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [geometry]);

  const select = useCallback(
    (index: number) => {
      const g = geometry();
      if (!g) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: stackScrollTarget(g.listTop, g.offsets, index, g.stickyTop), behavior: reduce ? "auto" : "smooth" });
    },
    [geometry],
  );

  return (
    <ol ref={listRef} className={cn("flex flex-col gap-6", className)}>
      {projects.map((project, i) => (
        // The li/wrapper boxes span the transparent tab strip too; only the tab and card body take pointer events,
        // so tabs of cards stacked beneath stay clickable.
        <li key={project.number} className="project-stack-item pointer-events-none">
          <ProjectCard project={project} index={i} active={i === active} onSelect={() => select(i)} />
        </li>
      ))}
    </ol>
  );
}
