import { describe, expect, it } from "vitest";
import { pageCount, pageFromScroll, pageScrollLeft, spacerCount } from "./carousel";

describe("pageCount", () => {
  it("rounds partial pages up", () => {
    expect(pageCount(5, 3)).toBe(2);
    expect(pageCount(4, 2)).toBe(2);
    expect(pageCount(5, 1)).toBe(5);
  });
  it("never returns fewer than one page", () => {
    expect(pageCount(0, 3)).toBe(1);
    expect(pageCount(4, 0)).toBe(1);
  });
});

describe("spacerCount", () => {
  it("fills the last page's empty slots", () => {
    expect(spacerCount(5, 3)).toBe(1);
    expect(spacerCount(7, 3)).toBe(2);
  });
  it("is zero when pages divide evenly or perPage is 1", () => {
    expect(spacerCount(4, 2)).toBe(0);
    expect(spacerCount(5, 1)).toBe(0);
  });
});

// Pricing at 1440: 3 cards per page, 384px + 24px gap -> page width 1224.
describe("pageFromScroll", () => {
  it("maps scroll positions to the nearest page", () => {
    expect(pageFromScroll(0, 1224, 2)).toBe(0);
    expect(pageFromScroll(1224, 1224, 2)).toBe(1);
    expect(pageFromScroll(700, 1224, 2)).toBe(1);
    expect(pageFromScroll(500, 1224, 2)).toBe(0);
  });
  it("clamps to the valid range", () => {
    expect(pageFromScroll(5000, 1224, 2)).toBe(1);
    expect(pageFromScroll(-10, 1224, 2)).toBe(0);
  });
  it("handles an unmeasured track", () => {
    expect(pageFromScroll(300, 0, 2)).toBe(0);
  });
});

describe("pageScrollLeft", () => {
  it("returns the page's start offset", () => {
    expect(pageScrollLeft(1, 1224)).toBe(1224);
    expect(pageScrollLeft(0, 1224)).toBe(0);
  });
  it("never goes negative", () => {
    expect(pageScrollLeft(-1, 1224)).toBe(0);
  });
});
