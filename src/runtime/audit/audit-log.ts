import type { RuntimeEvent } from "../types";

export class RuntimeAuditLog {
  private readonly events: RuntimeEvent[] = [];

  record(event: RuntimeEvent): void {
    this.events.push(event);
  }

  all(): RuntimeEvent[] {
    return [...this.events];
  }

  byWorkflow(workflowId: string): RuntimeEvent[] {
    return this.events.filter((event) => event.workflowId === workflowId);
  }
}
