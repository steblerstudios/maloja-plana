import { describe, expect, it } from "vitest";
import { runtimeEventBus } from "../singleton";
import { RuntimeEventBus } from "../events/event-bus";

describe("runtime singleton", () => {
  it("exports a RuntimeEventBus instance", () => {
    expect(runtimeEventBus).toBeInstanceOf(RuntimeEventBus);
  });

  it("is the same instance on repeated imports", async () => {
    const { runtimeEventBus: second } = await import("../singleton");
    expect(second).toBe(runtimeEventBus);
  });
});
