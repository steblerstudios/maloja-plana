import type { RuntimeEvent } from "../types";

export class AuditLog {
  private readonly events: RuntimeEvent[] = [];

  append(event: RuntimeEvent): void {
    this.events.push(event);
  }

  list(): RuntimeEvent[] {
    return [...this.events];
  }

  findByWorkflowId(workflowId: string): RuntimeEvent[] {
    return this.events.filter((event) => event.workflowId === workflowId);
  }

  clear(): void {
    this.events.length = 0;
  }
}
