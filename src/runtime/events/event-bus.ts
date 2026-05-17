import type { AuditEvent } from "../types";

export type EventListener = (event: AuditEvent) => void;

export class RuntimeEventBus {
  private readonly events: AuditEvent[] = [];
  private readonly listeners: Set<EventListener> = new Set();

  publish(event: AuditEvent): void {
    this.events.push(event);
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  subscribe(listener: EventListener): void {
    this.listeners.add(listener);
  }

  unsubscribe(listener: EventListener): void {
    this.listeners.delete(listener);
  }

  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events.length = 0;
  }
}
