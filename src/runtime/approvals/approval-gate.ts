import type { ApprovalRecord, WorkflowStep } from "../types";

export class ApprovalGate {
  isApprovalRequired(step: WorkflowStep): boolean {
    return (step.requiredApprovals ?? 0) > 0;
  }

  hasEnoughApprovals(
    step: WorkflowStep,
    approvals: ApprovalRecord[]
  ): boolean {
    const required = step.requiredApprovals ?? 0;

    if (required === 0) {
      return true;
    }

    const approvedCount = approvals.filter(
      (approval) => approval.decision === "APPROVED"
    ).length;

    return approvedCount >= required;
  }
}
