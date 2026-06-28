import type { AuditEvent } from "../types";

export type EventListener = (event: AuditEvent) => void;

export class RuntimeEventBus {
  private readonly events: AuditEvent[] = [];
  private readonly listeners: Set<EventListener> = new Set();
  private readonly maxEvents = 500;

  publish(event: AuditEvent): void {
    this.events.push(event);
    // Ring-Buffer: in einer jahrelangen Sitzung darf der Verlauf nicht
    // unbegrenzt wachsen (langsames Speicherleck).
    if (this.events.length > this.maxEvents) {
      this.events.splice(0, this.events.length - this.maxEvents);
    }
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        // Ein fehlerhafter Subscriber darf weder den Bus noch andere
        // Subscriber noch den Publisher (z.B. Auto-Save) blockieren.
        if (typeof console !== "undefined") console.warn("EventBus listener error:", err);
      }
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
