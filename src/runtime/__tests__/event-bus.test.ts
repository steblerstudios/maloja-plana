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
type RuntimeEventHandler = (event: unknown) => void;

export class RuntimeEventBus {
  private readonly handlers: RuntimeEventHandler[] = [];

  subscribe(handler: RuntimeEventHandler): void {
    this.handlers.push(handler);
  }

  publish(event: unknown): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
