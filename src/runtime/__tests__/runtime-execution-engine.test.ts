import { describe, expect, it } from "vitest";
import { RuntimeExecutionEngine } from "../execution/runtime-execution-engine";
import type { WorkflowDefinition } from "../types";

const workflow: WorkflowDefinition = {
  id: "workflow-exec-test",
  name: "Execution Test Workflow",
  version: "0.1.0",
  state: "DRAFT",
  steps: [
    {
      id: "step-1",
      name: "First step",
      type: "MANUAL",
      risk: "LOW",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("RuntimeExecutionEngine", () => {
  it("starts a workflow without throwing", async () => {
    const engine = new RuntimeExecutionEngine();

    await expect(engine.start(workflow)).resolves.toBeUndefined();
  });

  it("completes a workflow step without throwing", async () => {
    const engine = new RuntimeExecutionEngine();

    await expect(
      engine.completeStep(workflow.id, workflow.steps[0]),
    ).resolves.toBeUndefined();
  });
});
