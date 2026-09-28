/** Equivalent offset in (-period, 0], so a duplicated track can loop seamlessly. */
export function wrapOffset(offset: number, period: number): number {
  if (!(period > 0)) return 0;
  const r = offset % period; // (-period, period)
  const wrapped = r > 0 ? r - period : r;
  return wrapped === 0 ? 0 : wrapped;
}

/** Offset rounded to the nearest multiple of pitch (panel-aligned). */
export function snapOffset(offset: number, pitch: number): number {
  if (!(pitch > 0)) return offset;
  const snapped = Math.round(offset / pitch) * pitch;
  return snapped === 0 ? 0 : snapped;
}

/** Cubic ease-out, input clamped to 0..1. */
export function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}
