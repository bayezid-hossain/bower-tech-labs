import { describe, expect, it } from "vitest";
import { getCarouselState } from "./carousel";

describe("getCarouselState", () => {
  it("at the start: cannot go back, can go forward", () => {
    expect(getCarouselState(0, 1500, 800)).toEqual({ canPrev: false, canNext: true });
  });

  it("in the middle: both directions", () => {
    expect(getCarouselState(300, 1500, 800)).toEqual({ canPrev: true, canNext: true });
  });

  it("at the end: can go back, cannot go forward", () => {
    expect(getCarouselState(700, 1500, 800)).toEqual({ canPrev: true, canNext: false });
  });

  it("tolerates sub-pixel rounding at both ends", () => {
    expect(getCarouselState(1.4, 1500, 800).canPrev).toBe(false);
    expect(getCarouselState(698.6, 1500, 800).canNext).toBe(false);
  });

  it("content that fits: no navigation", () => {
    expect(getCarouselState(0, 800, 800)).toEqual({ canPrev: false, canNext: false });
  });
});
