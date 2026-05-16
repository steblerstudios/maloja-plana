import type { AuditEvent, WorkflowDefinition } from "../types";

export class InMemoryRuntimeStore {
  private workflows = new Map<string, WorkflowDefinition>();
  private auditEvents: AuditEvent[] = [];

  saveWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  appendAuditEvent(event: AuditEvent): void {
    this.auditEvents.push(event);
  }

  listAuditEvents(): AuditEvent[] {
    return [...this.auditEvents];
  }

  clear(): void {
    this.workflows.clear();
    this.auditEvents = [];
  }
}
