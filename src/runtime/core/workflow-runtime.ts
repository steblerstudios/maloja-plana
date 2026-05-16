import type {
  WorkflowDefinition,
  WorkflowState,
  RuntimeEvent,
} from "../types";

import { EventBus } from "../events/event-bus";

export class WorkflowRuntime {
  private workflows = new Map<string, WorkflowDefinition>();

  constructor(private readonly eventBus: EventBus) {}

  registerWorkflow(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);

    this.publish({
      type: "WORKFLOW_REGISTERED",
      actor: "system",
      workflowId: workflow.id,
      timestamp: new Date().toISOString(),
    });
  }

  updateState(workflowId: string, state: WorkflowState): void {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    workflow.state = state;

    this.publish({
      type: "WORKFLOW_STATE_CHANGED",
      actor: "system",
      workflowId,
      timestamp: new Date().toISOString(),
      metadata: {
        state,
      },
    });
  }

  getWorkflow(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  private publish(event: RuntimeEvent): void {
    this.eventBus.publish(event);
  }
}
