import type { WorkflowDefinition, WorkflowState } from "../types";
import { InMemoryRuntimeStore } from "../persistence/in-memory-runtime-store";
import { AuditLog } from "../audit/audit-log";

export class WorkflowController {
  constructor(
    private readonly store = new InMemoryRuntimeStore(),
    private readonly auditLog = new AuditLog()
  ) {}

  createWorkflow(workflow: WorkflowDefinition): WorkflowDefinition {
    this.store.saveWorkflow(workflow);

    this.auditLog.record({
      id: crypto.randomUUID(),
      type: "WORKFLOW_CREATED",
      actor: "system",
      workflowId: workflow.id,
      timestamp: new Date().toISOString(),
      metadata: {
        version: workflow.version,
        state: workflow.state,
      },
    });

    return workflow;
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.store.getWorkflow(id);
  }

  updateWorkflowState(id: string, state: WorkflowState): WorkflowDefinition {
    const workflow = this.store.getWorkflow(id);

    if (!workflow) {
      throw new Error(`Workflow not found: ${id}`);
    }

    const updated: WorkflowDefinition = {
      ...workflow,
      state,
      updatedAt: new Date().toISOString(),
    };

    this.store.saveWorkflow(updated);

    this.auditLog.record({
      id: crypto.randomUUID(),
      type: "WORKFLOW_STATE_UPDATED",
      actor: "system",
      workflowId: id,
      timestamp: new Date().toISOString(),
      metadata: {
        previousState: workflow.state,
        nextState: state,
      },
    });

    return updated;
  }

  listAuditEvents() {
    return this.auditLog.list();
  }
}
