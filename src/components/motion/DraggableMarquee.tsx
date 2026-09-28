"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { easeOutCubic, snapOffset, wrapOffset } from "@/lib/marquee";

type DraggableMarqueeProps = {
  children: ReactNode;
  /** Accessible name for the carousel region. */
  label: string;
  /** Auto-scroll speed in px/s. */
  speed?: number;
  className?: string;
  innerClassName?: string;
  trackClassName?: string;
};

const SNAP_MS = 350;
const DRAG_THRESHOLD = 3;
const MAX_DT = 0.1;

/**
 * Infinite horizontal auto-scroll (right to left) that can be dragged or stepped with the arrow keys.
 * Content is duplicated once. Offset starts at 0, so the first paint is the unmoved layout.
 * Auto-scroll pauses on mouse hover, while dragging or snapping, while keyboard-focused,
 * when the tab is hidden, and never runs under prefers-reduced-motion.
 */
export function DraggableMarquee({
  children,
  label,
  speed = 40,
  className,
  innerClassName,
  trackClassName,
}: DraggableMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const track = trackRef.current;
    if (!root || !inner || !track) return;

    let offset = 0;
    let period = 0;
    let pitch = 0;
    let hovered = false;
    let keyboardFocus = false;
    let hidden = document.visibilityState === "hidden";
    let drag: { id: number; startX: number; startOffset: number; moved: boolean } | null = null;
    let snap: { from: number; to: number; start: number } | null = null;
    let last: number | null = null;
    let raf = 0;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;

    const measure = () => {
      period = track.offsetWidth;
      const first = track.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      pitch = first ? first.offsetWidth + gap : 0;
    };

    const render = () => {
      const x = wrapOffset(offset, period);
      inner.style.transform = x === 0 ? "" : `translate3d(${x}px,0,0)`;
    };

    const startSnap = (to: number, now: number) => {
      if (reduced) {
        offset = wrapOffset(to, period);
        snap = null;
        render();
        return;
      }
      snap = { from: offset, to, start: now };
    };

    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, MAX_DT);
      last = now;
      if (snap) {
        const t = (now - snap.start) / SNAP_MS;
        offset = snap.from + (snap.to - snap.from) * easeOutCubic(t);
        if (t >= 1) {
          offset = wrapOffset(snap.to, period);
          snap = null;
        }
        render();
      } else if (!drag && !hovered && !keyboardFocus && !hidden && !reduced && period > 0) {
        offset = wrapOffset(offset - speed * dt, period);
        render();
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      snap = null;
      drag = { id: e.pointerId, startX: e.clientX, startOffset: offset, moved: false };
      root.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
      drag.moved = true;
      offset = drag.startOffset + dx;
      render();
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
      if (moved) startSnap(snapOffset(offset, pitch), performance.now());
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = true;
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovered = false;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      keyboardFocus = true;
      const base = snap ? snap.to : offset;
      const step = e.key === "ArrowRight" ? -pitch : pitch;
      startSnap(snapOffset(base, pitch) + step, performance.now());
    };

    const onFocus = () => {
      if (root.matches(":focus-visible")) keyboardFocus = true;
    };
    const onBlur = () => {
      keyboardFocus = false;
    };

    const onDragStart = (e: DragEvent) => e.preventDefault();
    const onVisibility = () => {
      hidden = document.visibilityState === "hidden";
    };
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced && snap) startSnap(snap.to, performance.now());
    };

    measure();
    const resizeObserver = new ResizeObserver(() => {
      measure();
      render();
    });
    resizeObserver.observe(track);

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerEnd);
    root.addEventListener("pointercancel", onPointerEnd);
    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("keydown", onKeyDown);
    root.addEventListener("focus", onFocus);
    root.addEventListener("blur", onBlur);
    root.addEventListener("dragstart", onDragStart);
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerEnd);
      root.removeEventListener("pointercancel", onPointerEnd);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("focus", onFocus);
      root.removeEventListener("blur", onBlur);
      root.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [speed]);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn(
        "relative cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy",
        className,
      )}
    >
      <div ref={innerRef} className={cn("flex w-max will-change-transform", innerClassName)}>
        <div ref={trackRef} className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
        <div aria-hidden="true" className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
