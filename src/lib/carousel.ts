/**
 * scrollLeft to move a looping carousel to after one step in `direction`.
 * A normal step is clamped to [0, maxScroll]; stepping forward at the end wraps to the start,
 * and stepping back at the start wraps to the end.
 */
export function getStepTarget(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  step: number,
  direction: 1 | -1,
  tolerance = 2,
): number {
  const maxScroll = Math.max(0, scrollWidth - clientWidth);
  if (direction === 1 && scrollLeft >= maxScroll - tolerance) return 0;
  if (direction === -1 && scrollLeft <= tolerance) return maxScroll;
  return Math.min(maxScroll, Math.max(0, scrollLeft + direction * step));
}
