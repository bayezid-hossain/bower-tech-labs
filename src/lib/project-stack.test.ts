import { describe, expect, it } from "vitest";
import { activeStackIndex, stackOffsets, stackScrollTarget } from "./project-stack";

// Four cards 600px tall with a 24px gap; the list starts at y=4000; cards stick at top 40px.
const offsets = stackOffsets([600, 600, 600, 600], 24);

describe("stackOffsets", () => {
  it("returns each card's natural offset within the list", () => {
    expect(offsets).toEqual([0, 624, 1248, 1872]);
  });
  it("handles an empty list", () => {
    expect(stackOffsets([], 24)).toEqual([]);
  });
});

describe("activeStackIndex", () => {
  it("is the first card before the list is reached", () => {
    expect(activeStackIndex(0, 4000, offsets, 40)).toBe(0);
  });
  it("is the last card whose sticky point has been reached", () => {
    expect(activeStackIndex(4000 + 624 - 40, 4000, offsets, 40)).toBe(1);
    expect(activeStackIndex(4000 + 1300, 4000, offsets, 40)).toBe(2);
    expect(activeStackIndex(99999, 4000, offsets, 40)).toBe(3);
  });
  it("tolerates a 1px rounding shortfall", () => {
    expect(activeStackIndex(4000 + 624 - 40 - 0.6, 4000, offsets, 40)).toBe(1);
  });
});

describe("stackScrollTarget", () => {
  it("scrolls so the card sits exactly at its sticky top", () => {
    expect(stackScrollTarget(4000, offsets, 2, 40)).toBe(4000 + 1248 - 40);
  });
  it("never scrolls above the page top", () => {
    expect(stackScrollTarget(10, offsets, 0, 40)).toBe(0);
  });
  it("treats an unknown index as the first card", () => {
    expect(stackScrollTarget(4000, offsets, 9, 40)).toBe(4000 - 40);
  });
});
