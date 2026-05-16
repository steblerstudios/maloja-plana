// src/runtime/types.ts

export type RiskClass =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type WorkflowState =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "RUNNING"
  | "PAUSED"
  | "FAILED"
  | "ROLLED_BACK"
  | "COMPLETED";

export type WorkflowStepType =
  | "INGESTION"
  | "VALIDATION"
  | "TRANSFORMATION"
  | "APPROVAL"
  | "EXECUTION"
  | "AUDIT"
  | "NOTIFICATION";

export interface RuntimeEvent {
  id: string;
  workflowId: string;
  stepId: string;
  type: string;
  timestamp: string;
  actor: string;
  payload: Record<string, unknown>;
}

export interface AuditEvent {
  id: string;
  eventType: string;
  timestamp: string;
  actor: string;
  workflowId: string;
  evidence?: string[];
  metadata?: Record<string, unknown>;
}

export interface ValidationRule {
  id: string;
  name: string;
  description?: string;
  severity: RiskClass;
  enabled: boolean;
}

export interface ValidationResult {
  ruleId: string;
  passed: boolean;
  message?: string;
  evidence?: string[];
}

export interface ApprovalRecord {
  id: string;
  approver: string;
  decision: "APPROVED" | "REJECTED";
  timestamp: string;
  comments?: string;
}

export interface RollbackStrategy {
  id: string;
  name: string;
  description?: string;
  automated: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  risk: RiskClass;
  requiredApprovals?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  state: WorkflowState;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}
