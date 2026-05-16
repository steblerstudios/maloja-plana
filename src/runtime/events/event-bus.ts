import type { RuntimeEvent } from "../types";

export type EventHandler = (event: RuntimeEvent) => void;

export class EventBus {
  private handlers: EventHandler[] = [];

  subscribe(handler: EventHandler): void {
    this.handlers.push(handler);
  }

  publish(event: RuntimeEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
