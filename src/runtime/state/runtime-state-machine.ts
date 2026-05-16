import type { WorkflowState } from "../types";

const allowedTransitions: Record<WorkflowState, WorkflowState[]> = {
  DRAFT: ["ACTIVE"],
  ACTIVE: ["PAUSED", "COMPLETED", "FAILED"],
  PAUSED: ["ACTIVE", "FAILED"],
  COMPLETED: [],
  FAILED: [],
};

export function canTransition(
  from: WorkflowState,
  to: WorkflowState,
): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function assertTransition(
  from: WorkflowState,
  to: WorkflowState,
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid workflow transition: ${from} -> ${to}`);
  }
}
