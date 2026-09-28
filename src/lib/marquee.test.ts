import { describe, expect, it } from "vitest";
import { easeOutCubic, snapOffset, wrapOffset } from "./marquee";

describe("wrapOffset", () => {
  it("keeps offsets already in (-period, 0]", () => {
    expect(wrapOffset(0, 1000)).toBe(0);
    expect(wrapOffset(-250, 1000)).toBe(-250);
    expect(wrapOffset(-999.5, 1000)).toBe(-999.5);
  });

  it("wraps exactly one period back to 0", () => {
    expect(wrapOffset(-1000, 1000)).toBe(0);
  });

  it("wraps positive offsets into range", () => {
    expect(wrapOffset(250, 1000)).toBe(-750);
    expect(wrapOffset(1000, 1000)).toBe(0);
  });

  it("handles large positive and negative values", () => {
    expect(wrapOffset(-10_250, 1000)).toBe(-250);
    expect(wrapOffset(10_250, 1000)).toBe(-750);
  });

  it("never returns -0", () => {
    expect(Object.is(wrapOffset(-2000, 1000), -0)).toBe(false);
  });

  it("returns 0 for non-positive periods", () => {
    expect(wrapOffset(-250, 0)).toBe(0);
    expect(wrapOffset(-250, -5)).toBe(0);
  });
});

describe("snapOffset", () => {
  it("rounds to the nearest multiple of pitch", () => {
    expect(snapOffset(-300, 560)).toBe(-560);
    expect(snapOffset(-200, 560)).toBe(0);
    expect(snapOffset(-1200, 560)).toBe(-1120);
    expect(snapOffset(300, 560)).toBe(560);
  });

  it("never returns -0", () => {
    expect(Object.is(snapOffset(-100, 560), -0)).toBe(false);
  });

  it("returns the offset unchanged for non-positive pitch", () => {
    expect(snapOffset(-123, 0)).toBe(-123);
    expect(snapOffset(-123, -1)).toBe(-123);
  });
});

describe("easeOutCubic", () => {
  it("maps endpoints", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });

  it("eases out (ahead of linear midway)", () => {
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875);
  });

  it("clamps outside 0..1", () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(2)).toBe(1);
  });
});
