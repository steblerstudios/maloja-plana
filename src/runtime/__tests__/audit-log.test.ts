import { describe, expect, it } from "vitest";
import { RuntimeAuditLog } from "../audit/audit-log";
import type { RuntimeEvent } from "../types";

const event: RuntimeEvent = {
  id: "event-1",
  type: "WORKFLOW_STARTED",
  timestamp: "2026-05-16T15:00:00.000Z",
  actor: "test-user",
  workflowId: "workflow-1",
};

describe("RuntimeAuditLog", () => {
  it("records runtime events", () => {
    const auditLog = new RuntimeAuditLog();

    auditLog.record(event);

    expect(auditLog.all()).toEqual([event]);
  });

  it("returns events by workflow id", () => {
    const auditLog = new RuntimeAuditLog();

    auditLog.record(event);

    expect(auditLog.byWorkflow("workflow-1")).toEqual([event]);
    expect(auditLog.byWorkflow("other-workflow")).toEqual([]);
  });
});
