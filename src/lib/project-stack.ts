/** Geometry for the sticky stacking project list. All values are in px, document coordinates. */

/** Natural offset of each card inside the list (cards stacked vertically with `gap`). */
export function stackOffsets(heights: number[], gap: number): number[] {
  const offsets: number[] = [];
  let y = 0;
  for (const h of heights) {
    offsets.push(y);
    y += h + gap;
  }
  return offsets;
}

/** Index of the card currently on top of the stack: the last one whose sticky point has been reached. */
export function activeStackIndex(scrollY: number, listTop: number, offsets: number[], stickyTop: number): number {
  let active = 0;
  offsets.forEach((offset, i) => {
    if (scrollY + stickyTop >= listTop + offset - 1) active = i;
  });
  return active;
}

/** Window scroll position that puts card `index` exactly at its sticky top (on top of the stack). */
export function stackScrollTarget(listTop: number, offsets: number[], index: number, stickyTop: number): number {
  return Math.max(0, listTop + (offsets[index] ?? 0) - stickyTop);
}

/**
 * One-card-per-gesture snapping. `points` are the scroll positions where each card sits on top of the stack.
 * Returns where a scroll gesture of `delta` px (sign = direction) should land, or null to let the page scroll normally.
 * Inside the stack every gesture moves exactly one card; outside it the page scrolls freely until a gesture would
 * cross into the stack; past the first/last card it releases so the section can be left.
 */
export function stackSnapTarget(scrollY: number, delta: number, points: number[], tolerance = 2): number | null {
  if (points.length === 0 || delta === 0) return null;
  const first = points[0];
  const last = points[points.length - 1];
  if (delta > 0) {
    const next = points.find((p) => p > scrollY + tolerance);
    if (next === undefined) return null;
    return scrollY >= first - tolerance || scrollY + delta >= next ? next : null;
  }
  const prev = [...points].reverse().find((p) => p < scrollY - tolerance);
  if (prev === undefined) return null;
  return scrollY <= last + tolerance || scrollY + delta <= prev ? prev : null;
}

/** Silence that ends a scroll gesture, so trackpad/smooth-wheel momentum (often 1.5s+) can't trigger a second step. */
export const GESTURE_QUIET_MS = 200;

/**
 * Whether a scroll input starts a new gesture rather than continuing momentum. Momentum keeps its direction and
 * decays; a pause, a direction change or a noticeably stronger push is the user asking again.
 */
export function isNewGesture(delta: number, previousDelta: number, silenceMs: number): boolean {
  if (silenceMs >= GESTURE_QUIET_MS) return true;
  if (Math.sign(delta) !== Math.sign(previousDelta)) return true;
  return Math.abs(delta) > Math.abs(previousDelta) * 1.5 + 4;
}
