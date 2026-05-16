import type { AuditEvent, ValidationResult } from "../types";

export interface WorkflowStartedEvent extends AuditEvent {
  type: "WORKFLOW_STARTED";
}

export interface StepCompletedEvent extends AuditEvent {
  type: "STEP_COMPLETED";
  stepId: string;
}

export interface ValidationFailedEvent extends AuditEvent {
  type: "VALIDATION_FAILED";
  results: ValidationResult[];
}

export interface ApprovalRequiredEvent extends AuditEvent {
  type: "APPROVAL_REQUIRED";
  stepId: string;
  requiredApprovals: number;
}

export interface RollbackTriggeredEvent extends AuditEvent {
  type: "ROLLBACK_TRIGGERED";
  reason: string;
}

export type RuntimeDomainEvent =
  | WorkflowStartedEvent
  | StepCompletedEvent
  | ValidationFailedEvent
  | ApprovalRequiredEvent
  | RollbackTriggeredEvent;
