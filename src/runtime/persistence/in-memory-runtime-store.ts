import type { WorkflowDefinition } from "../types";

export class InMemoryRuntimeStore {
  private readonly workflows = new Map<string, WorkflowDefinition>();

  async save(workflow: WorkflowDefinition): Promise<void> {
    this.workflows.set(workflow.id, workflow);
  }

  async get(workflowId: string): Promise<WorkflowDefinition | undefined> {
    return this.workflows.get(workflowId);
  }

  async list(): Promise<WorkflowDefinition[]> {
    return Array.from(this.workflows.values());
  }

  async delete(workflowId: string): Promise<void> {
    this.workflows.delete(workflowId);
  }

  clear(): void {
    this.workflows.clear();
  }
}
async findByWorkflowId(workflowId: string) {
  return this.states.get(workflowId);
}
export class InMemoryRuntimeStore {
  private states = new Map<string, unknown>();

  async save(state: { workflowId: string }) {
    this.states.set(state.workflowId, state);
  }

  async findByWorkflowId(workflowId: string) {
    return this.states.get(workflowId);
  }
}

