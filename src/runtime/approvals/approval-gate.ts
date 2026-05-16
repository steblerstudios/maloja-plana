export interface ApprovalGateInput {
  requiredApprovals?: number;
}

export class ApprovalGate {
  requiresApproval(input: ApprovalGateInput): boolean {
    return (input.requiredApprovals ?? 0) > 0;
  }
}
