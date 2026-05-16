import type { AuditEvent } from "../types";

export class RuntimeEventBus {
  private readonly events: AuditEvent[] = [];

  publish(event: AuditEvent): void {
    this.events.push(event);
  }

  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events.length = 0;
  }
}
