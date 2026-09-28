import { describe, expect, it } from "vitest";
import { getStepTarget } from "./carousel";

// Track: scrollWidth 1500, clientWidth 800 -> maxScroll 700. Step 400.
describe("getStepTarget", () => {
  it("steps forward from the start", () => {
    expect(getStepTarget(0, 1500, 800, 400, 1)).toBe(400);
  });

  it("steps back from the middle", () => {
    expect(getStepTarget(400, 1500, 800, 400, -1)).toBe(0);
  });

  it("clamps a forward step to the end", () => {
    expect(getStepTarget(400, 1500, 800, 400, 1)).toBe(700);
  });

  it("clamps a backward step to the start", () => {
    expect(getStepTarget(300, 1500, 800, 400, -1)).toBe(0);
  });

  it("wraps to the start when stepping forward at the end", () => {
    expect(getStepTarget(700, 1500, 800, 400, 1)).toBe(0);
  });

  it("wraps to the end when stepping back at the start", () => {
    expect(getStepTarget(0, 1500, 800, 400, -1)).toBe(700);
  });

  it("tolerates sub-pixel rounding at both ends", () => {
    expect(getStepTarget(698.6, 1500, 800, 400, 1)).toBe(0);
    expect(getStepTarget(1.4, 1500, 800, 400, -1)).toBe(700);
  });

  it("content that fits: stays at 0", () => {
    expect(getStepTarget(0, 800, 800, 400, 1)).toBe(0);
    expect(getStepTarget(0, 800, 800, 400, -1)).toBe(0);
  });
});
