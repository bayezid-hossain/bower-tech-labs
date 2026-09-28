import { describe, expect, it } from "vitest";
import { activeStackIndex, stackOffsets, stackScrollTarget, stackSnapTarget } from "./project-stack";

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

// Snap points = scroll positions where each card is on top of the stack.
const points = [1000, 1624, 2248, 2872];

describe("stackSnapTarget", () => {
  it("steps exactly one card down per gesture, however hard the scroll", () => {
    expect(stackSnapTarget(1000, 40, points)).toBe(1624);
    expect(stackSnapTarget(1000, 3000, points)).toBe(1624);
  });
  it("steps exactly one card up per gesture", () => {
    expect(stackSnapTarget(2248, -40, points)).toBe(1624);
    expect(stackSnapTarget(2248, -3000, points)).toBe(1624);
  });
  it("releases the page past the last card (down) and before the first card (up)", () => {
    expect(stackSnapTarget(2872, 120, points)).toBeNull();
    expect(stackSnapTarget(1000, -120, points)).toBeNull();
  });
  it("lets the page scroll freely outside the stack until a gesture would cross into it", () => {
    expect(stackSnapTarget(300, 100, points)).toBeNull();
    expect(stackSnapTarget(950, 100, points)).toBe(1000);
    expect(stackSnapTarget(4000, -100, points)).toBeNull();
    expect(stackSnapTarget(2900, -100, points)).toBe(2872);
  });
  it("realigns from an in-between position to the next card in the gesture's direction", () => {
    expect(stackSnapTarget(1300, 10, points)).toBe(1624);
    expect(stackSnapTarget(1300, -10, points)).toBe(1000);
  });
  it("tolerates 1–2px rounding at a snap point", () => {
    expect(stackSnapTarget(1623, 40, points)).toBe(2248);
  });
  it("ignores empty stacks and zero deltas", () => {
    expect(stackSnapTarget(1000, 40, [])).toBeNull();
    expect(stackSnapTarget(1000, 0, points)).toBeNull();
  });
});
