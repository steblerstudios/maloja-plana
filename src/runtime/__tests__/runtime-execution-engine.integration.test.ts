import { describe, expect, it } from "vitest";
import { RuntimeExecutionEngine } from "../execution/runtime-execution-engine";

describe("RuntimeExecutionEngine integration", () => {
  it("starts and completes a workflow", async () => {
    const engine = new RuntimeExecutionEngine();

    await expect(
      engine.start({
        id: "workflow-1",
        steps: [{ id: "step-1", type: "task" }],
      }),
    ).resolves.toBeUndefined();

    await expect(engine.completeStep("workflow-1", "step-1")).resolves.toBeUndefined();
  });
});
