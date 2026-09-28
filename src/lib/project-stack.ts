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
