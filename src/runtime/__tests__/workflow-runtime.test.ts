import { describe, expect, it } from "vitest";
import { WorkflowRuntime } from "../core/workflow-runtime";
import type { WorkflowDefinition } from "../types";

const workflow: WorkflowDefinition = {
  id: "wf-1",
  name: "Test Workflow",
  version: "1.0.0",
  state: "DRAFT",
  steps: [
    {
      id: "step-1",
      name: "First Step",
      type: "MANUAL",
      risk: "LOW",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("WorkflowRuntime", () => {
  it("creates a runtime for a workflow definition", () => {
    const runtime = new WorkflowRuntime(workflow);

    expect(runtime).toBeDefined();
  });
});
