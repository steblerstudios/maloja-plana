// src/runtime/validation/workflow-validator.ts

import type {
  WorkflowDefinition,
  WorkflowState,
  WorkflowStep,
} from "../types";

export interface WorkflowValidationIssue {
  code: string;
  message: string;
  severity: "info" | "warning" | "blocking";
}

export interface WorkflowValidationResult {
  valid: boolean;
  issues: WorkflowValidationIssue[];
}

const terminalStates: WorkflowState[] = [
  "COMPLETED",
  "FAILED",
  "ROLLED_BACK",
];

export function validateWorkflowDefinition(
  workflow: WorkflowDefinition,
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = [];

  if (!workflow.id.trim()) {
    issues.push({
      code: "workflow_id_missing",
      message: "Workflow id is required.",
      severity: "blocking",
    });
  }

  if (!workflow.name.trim()) {
    issues.push({
      code: "workflow_name_missing",
      message: "Workflow name is required.",
      severity: "blocking",
    });
  }

  if (!workflow.version.trim()) {
    issues.push({
      code: "workflow_version_missing",
      message: "Workflow version is required.",
      severity: "blocking",
    });
  }

  if (workflow.steps.length === 0) {
    issues.push({
      code: "workflow_steps_missing",
      message: "Workflow must define at least one step.",
      severity: "blocking",
    });
  }

  workflow.steps.forEach((step) => {
    validateWorkflowStep(step).issues.forEach((issue) => issues.push(issue));
  });

  return {
    valid: !issues.some((issue) => issue.severity === "blocking"),
    issues,
  };
}

export function validateWorkflowStep(
  step: WorkflowStep,
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = [];

  if (!step.id.trim()) {
    issues.push({
      code: "step_id_missing",
      message: "Workflow step id is required.",
      severity: "blocking",
    });
  }

  if (!step.name.trim()) {
    issues.push({
      code: "step_name_missing",
      message: "Workflow step name is required.",
      severity: "blocking",
    });
  }

  if (step.requiredApprovals !== undefined && step.requiredApprovals < 0) {
    issues.push({
      code: "step_required_approvals_invalid",
      message: "Required approvals cannot be negative.",
      severity: "blocking",
    });
  }

  return {
    valid: !issues.some((issue) => issue.severity === "blocking"),
    issues,
  };
}

export function canTransitionToState(
  currentState: WorkflowState,
  nextState: WorkflowState,
): boolean {
  if (terminalStates.includes(currentState)) {
    return false;
  }

  if (currentState === nextState) {
    return true;
  }

  const allowedTransitions: Record<WorkflowState, WorkflowState[]> = {
    DRAFT: ["PENDING_APPROVAL", "FAILED"],
    PENDING_APPROVAL: ["APPROVED", "FAILED"],
    APPROVED: ["RUNNING", "FAILED"],
    RUNNING: ["PAUSED", "FAILED", "COMPLETED"],
    PAUSED: ["RUNNING", "FAILED", "ROLLED_BACK"],
    FAILED: [],
    ROLLED_BACK: [],
    COMPLETED: [],
  };

  return allowedTransitions[currentState]?.includes(nextState) ?? false;
}
