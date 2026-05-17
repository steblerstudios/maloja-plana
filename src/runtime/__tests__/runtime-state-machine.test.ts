import { describe, expect, it } from "vitest";
import {
  assertTransition,
  canTransition,
  isTerminalState,
} from "../state/runtime-state-machine";

describe("runtime state machine", () => {
  it("allows valid workflow transitions", () => {
    expect(canTransition("DRAFT", "PENDING_APPROVAL")).toBe(true);
    expect(canTransition("PENDING_APPROVAL", "APPROVED")).toBe(true);
    expect(canTransition("APPROVED", "RUNNING")).toBe(true);
    expect(canTransition("RUNNING", "PAUSED")).toBe(true);
    expect(canTransition("PAUSED", "RUNNING")).toBe(true);
    expect(canTransition("RUNNING", "COMPLETED")).toBe(true);
    expect(canTransition("RUNNING", "FAILED")).toBe(true);
    expect(canTransition("PAUSED", "ROLLED_BACK")).toBe(true);
  });

  it("blocks invalid workflow transitions", () => {
    expect(canTransition("COMPLETED", "RUNNING")).toBe(false);
    expect(canTransition("FAILED", "RUNNING")).toBe(false);
    expect(canTransition("ROLLED_BACK", "RUNNING")).toBe(false);
    expect(canTransition("DRAFT", "COMPLETED")).toBe(false);
    expect(canTransition("DRAFT", "RUNNING")).toBe(false);
    expect(canTransition("APPROVED", "PAUSED")).toBe(false);
  });

  it("allows failing from any non-terminal state", () => {
    expect(canTransition("DRAFT", "FAILED")).toBe(true);
    expect(canTransition("PENDING_APPROVAL", "FAILED")).toBe(true);
    expect(canTransition("APPROVED", "FAILED")).toBe(true);
    expect(canTransition("RUNNING", "FAILED")).toBe(true);
    expect(canTransition("PAUSED", "FAILED")).toBe(true);
  });

  it("throws on invalid transitions", () => {
    expect(() => assertTransition("COMPLETED", "RUNNING")).toThrow(
      "Invalid workflow transition: COMPLETED -> RUNNING",
    );
  });

  it("identifies terminal states", () => {
    expect(isTerminalState("COMPLETED")).toBe(true);
    expect(isTerminalState("FAILED")).toBe(true);
    expect(isTerminalState("ROLLED_BACK")).toBe(true);
    expect(isTerminalState("DRAFT")).toBe(false);
    expect(isTerminalState("RUNNING")).toBe(false);
  });
});
