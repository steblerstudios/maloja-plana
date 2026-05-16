import { describe, expect, it } from "vitest";
import { RuntimeEventBus } from "../events/event-bus";

describe("RuntimeEventBus", () => {
  it("publishes events to subscribers", () => {
    const bus = new RuntimeEventBus();
    const received: unknown[] = [];

    bus.subscribe((event) => {
      received.push(event);
    });

    const event = { type: "WorkflowStarted", workflowId: "workflow-1" };

    bus.publish(event);

    expect(received).toEqual([event]);
  });
});
