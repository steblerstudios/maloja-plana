import { describe, expect, it } from "vitest";
import { ApprovalGate } from "../approvals/approval-gate";

describe("ApprovalGate", () => {
  it("requires approval when required approvals are greater than zero", () => {
    const gate = new ApprovalGate();

    expect(gate.requiresApproval({ requiredApprovals: 1 })).toBe(true);
  });

  it("does not require approval when no approvals are required", () => {
    const gate = new ApprovalGate();

    expect(gate.requiresApproval({ requiredApprovals: 0 })).toBe(false);
  });
});
