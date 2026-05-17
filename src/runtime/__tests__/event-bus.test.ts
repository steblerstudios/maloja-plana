import { describe, expect, it } from "vitest";
import { RuntimeEventBus } from "../events/event-bus";
import type { AuditEvent } from "../types";

const makeEvent = (type: string): AuditEvent => ({
  id: "evt-1",
  eventType: type,
  timestamp: new Date().toISOString(),
  actor: "test",
  workflowId: "workflow-1",
});

describe("RuntimeEventBus", () => {
  it("stores published events in the log", () => {
    const bus = new RuntimeEventBus();
    const event = makeEvent("WORKFLOW_STARTED");

    bus.publish(event);

    expect(bus.getEvents()).toEqual([event]);
  });

  it("notifies subscribers on publish", () => {
    const bus = new RuntimeEventBus();
    const received: AuditEvent[] = [];

    bus.subscribe((event) => received.push(event));

    const event = makeEvent("WORKFLOW_STARTED");
    bus.publish(event);

    expect(received).toEqual([event]);
  });

  it("stops notifying after unsubscribe", () => {
    const bus = new RuntimeEventBus();
    const received: AuditEvent[] = [];
    const listener = (event: AuditEvent) => received.push(event);

    bus.subscribe(listener);
    bus.publish(makeEvent("FIRST"));

    bus.unsubscribe(listener);
    bus.publish(makeEvent("SECOND"));

    expect(received).toHaveLength(1);
    expect(received[0].eventType).toBe("FIRST");
  });

  it("clears the event log", () => {
    const bus = new RuntimeEventBus();
    bus.publish(makeEvent("WORKFLOW_STARTED"));

    bus.clear();

    expect(bus.getEvents()).toEqual([]);
  });
});
