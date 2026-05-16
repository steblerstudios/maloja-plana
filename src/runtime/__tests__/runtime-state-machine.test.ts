import { describe, expect, it } from "vitest";
import { assertTransition, canTransition } from "../state/runtime-state-machine";

describe("runtime state machine", () => {
  it("allows valid workflow transitions", () => {
    expect(canTransition("DRAFT", "ACTIVE")).toBe(true);
    expect(canTransition("ACTIVE", "PAUSED")).toBe(true);
    expect(canTransition("PAUSED", "ACTIVE")).toBe(true);
    expect(canTransition("ACTIVE", "COMPLETED")).toBe(true);
    expect(canTransition("ACTIVE", "FAILED")).toBe(true);
  });

  it("blocks invalid workflow transitions", () => {
    expect(canTransition("COMPLETED", "ACTIVE")).toBe(false);
    expect(canTransition("FAILED", "ACTIVE")).toBe(false);
    expect(canTransition("DRAFT", "COMPLETED")).toBe(false);
  });

  it("throws on invalid transitions", () => {
    expect(() => assertTransition("COMPLETED", "ACTIVE")).toThrow(
      "Invalid workflow transition: COMPLETED -> ACTIVE",
    );
  });
});
