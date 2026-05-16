import type { WorkflowDefinition, WorkflowStep } from "../types";
import { InMemoryRuntimeStore } from "../persistence/in-memory-runtime-store";
import { RuntimeEventBus } from "../events/event-bus";

export class RuntimeExecutionEngine {
  constructor(
    private readonly store = new InMemoryRuntimeStore(),
    private readonly eventBus = new RuntimeEventBus(),
  ) {}

  async start(workflow: WorkflowDefinition): Promise<void> {
    await this.store.save(workflow);

    this.eventBus.publish({
      id: crypto.randomUUID(),
      type: "WORKFLOW_STARTED",
      actor: "system",
      workflowId: workflow.id,
      timestamp: new Date().toISOString(),
    });
  }

  async completeStep(
    workflowId: string,
    step: WorkflowStep,
    actor = "system",
  ): Promise<void> {
    this.eventBus.publish({
      id: crypto.randomUUID(),
      type: "STEP_COMPLETED",
      actor,
      workflowId,
      stepId: step.id,
      timestamp: new Date().toISOString(),
    });
  }
}
