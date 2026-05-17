import type { WorkflowState } from "../types";

const TERMINAL_STATES: ReadonlySet<WorkflowState> = new Set([
  "COMPLETED",
  "FAILED",
  "ROLLED_BACK",
]);

const allowedTransitions: Record<WorkflowState, WorkflowState[]> = {
  DRAFT: ["PENDING_APPROVAL", "FAILED"],
  PENDING_APPROVAL: ["APPROVED", "FAILED"],
  APPROVED: ["RUNNING", "FAILED"],
  RUNNING: ["PAUSED", "FAILED", "COMPLETED"],
  PAUSED: ["RUNNING", "FAILED", "ROLLED_BACK"],
  COMPLETED: [],
  FAILED: [],
  ROLLED_BACK: [],
};

export function isTerminalState(state: WorkflowState): boolean {
  return TERMINAL_STATES.has(state);
}

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
