import type { WorkflowState } from "../types";

export type RuntimeState = {
  workflowId: string;
  status?: WorkflowState;
  currentStepId?: string;
};

export class InMemoryRuntimeStore {
  private readonly workflows = new Map<string, RuntimeState>();

  async save(state: RuntimeState): Promise<void> {
    this.workflows.set(state.workflowId, state);
  }

  async get(workflowId: string): Promise<RuntimeState | undefined> {
    return this.workflows.get(workflowId);
  }

  async findByWorkflowId(workflowId: string): Promise<RuntimeState | undefined> {
    return this.get(workflowId);
  }

  async list(): Promise<RuntimeState[]> {
    return Array.from(this.workflows.values());
  }

  async delete(workflowId: string): Promise<void> {
    this.workflows.delete(workflowId);
  }

  clear(): void {
    this.workflows.clear();
  }
}
