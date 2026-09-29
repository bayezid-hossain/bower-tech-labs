"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { activeStackIndex, isNewGesture, stackOffsets, stackScrollTarget, stackSnapTarget } from "@/lib/project-stack";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import type { Project } from "@/types/content";

type SkipLinks = {
  navLabel: string;
  prev: { label: string; href: string };
  next: { label: string; href: string };
};

type ProjectStackProps = { projects: Project[]; skip?: SkipLinks; className?: string };

const skipLinkClasses =
  "inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-[-0.02em] text-white transition-[background-color,transform] duration-150 hover:bg-white/15 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Minimum time a card step owns the scroll (lets the smooth scroll land). */
const STEP_MIN_MS = 650;

const SCROLL_KEYS: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };

/**
 * Sticky stacking project list. While the stack is engaged, each scroll gesture (wheel, trackpad, keys)
 * moves exactly one card; tabs bring any card back to the top of the stack.
 */
export function ProjectStack({ projects, skip, className }: ProjectStackProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const reduceMotion = useReducedMotion();

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
    const y = window.scrollY;
    const next = activeStackIndex(y, g.listTop, g.offsets, g.stickyTop);
    setActive((current) => (current === next ? current : next));
    // The skip shortcut shows from when the cards reach mid-screen until the last card has been shown.
    const first = stackScrollTarget(g.listTop, g.offsets, 0, g.stickyTop);
    const last = stackScrollTarget(g.listTop, g.offsets, g.offsets.length - 1, g.stickyTop);
    const inStack = g.sticky && y >= first - window.innerHeight / 2 && y <= last + 60;
    setEngaged((current) => (current === inStack ? current : inStack));
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

  // The last card reserves a full screen (so the pinned stack can't drift on the final step), but that reserve
  // is empty space below the card. Pull the next section up over it so there's no extra gap after the stack.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const tuck = () => {
      const last = list.lastElementChild as HTMLElement | null;
      const card = last?.firstElementChild as HTMLElement | null;
      if (!last || !card) return;
      const sticky = getComputedStyle(last).position === "sticky";
      list.style.marginBottom = sticky ? `${card.offsetHeight - last.offsetHeight}px` : "";
    };
    tuck();
    const observer = new ResizeObserver(tuck);
    observer.observe(list);
    window.addEventListener("resize", tuck);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", tuck);
    };
  }, []);

  // One card per gesture. Wheel/key/touch listeners (not scroll listeners) so the gesture can be cancelled before it moves the page.
  useEffect(() => {
    let stepping = false;
    let stepStartedAt = 0;
    let lastInputAt = 0;
    let lastDelta = 0;
    let minMs = STEP_MIN_MS;
    const isLocked = (now: number) => stepping && now - stepStartedAt < minMs;
    const snapPoints = () => {
      const g = geometry();
      if (!g || !g.sticky) return null;
      return g.offsets.map((_, i) => stackScrollTarget(g.listTop, g.offsets, i, g.stickyTop));
    };
    const step = (delta: number): boolean => {
      const points = snapPoints();
      if (!points) return false;
      const y = window.scrollY;
      const now = performance.now();
      const silence = now - lastInputAt;
      const previousDelta = lastDelta;
      lastInputAt = now;
      lastDelta = delta;
      const target = stackSnapTarget(y, delta, points);
      if (stepping) {
        // The card is still animating into place: swallow input inside the stack.
        if (now - stepStartedAt < minMs) return y >= points[0] - 2 && y <= points[points.length - 1] + 2;
        // Settled. Scrolling outward past the first/last card always releases the page, even mid-gesture.
        if (target === null) {
          stepping = false;
          return false;
        }
        // Momentum from the gesture that caused the step: swallow it so one flick can't carry past the next card.
        if (!isNewGesture(delta, previousDelta, silence)) return true;
        stepping = false;
      }
      if (target === null) return false;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stepping = true;
      stepStartedAt = now;
      minMs = reduce ? 80 : STEP_MIN_MS;
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
      if (!points || isLocked(performance.now())) {
        if (points && isLocked(performance.now())) event.preventDefault();
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

  const jump = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    history.replaceState(null, "", href);
  };

  return (
    <>
      <ol ref={listRef} className={cn("flex flex-col gap-6", className)}>
      {projects.map((project, i) => (
        // The li/wrapper boxes span the transparent tab strip too; only the tab and card body take pointer events,
        // so tabs of cards stacked beneath stay clickable.
        <li key={project.number} className="project-stack-item pointer-events-none">
          <ProjectCard project={project} index={i} active={i === active} onSelect={() => select(i)} />
        </li>
      ))}
      </ol>
      {skip && (
        <AnimatePresence>
          {engaged && (
            <motion.nav
              aria-label={skip.navLabel}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.4 } }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 12, transition: { duration: 0.2 } }}
              className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-navy-gradient p-1 shadow-button"
            >
              <a href={skip.prev.href} onClick={(event) => jump(event, skip.prev.href)} className={skipLinkClasses}>
                <ArrowUpIcon size={15} weight="bold" aria-hidden="true" />
                {skip.prev.label}
              </a>
              <span aria-hidden="true" className="h-5 w-px bg-white/25" />
              <a href={skip.next.href} onClick={(event) => jump(event, skip.next.href)} className={skipLinkClasses}>
                {skip.next.label}
                <ArrowDownIcon size={15} weight="bold" aria-hidden="true" />
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
