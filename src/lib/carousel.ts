export type CarouselState = { canPrev: boolean; canNext: boolean };

export function getCarouselState(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
  tolerance = 2,
): CarouselState {
  return {
    canPrev: scrollLeft > tolerance,
    canNext: scrollLeft + clientWidth < scrollWidth - tolerance,
  };
}
