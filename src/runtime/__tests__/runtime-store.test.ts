import { describe, expect, it } from "vitest";
import { InMemoryRuntimeStore } from "../persistence/in-memory-runtime-store";

describe("InMemoryRuntimeStore", () => {
  it("saves and returns workflow state by workflow id", async () => {
    const store = new InMemoryRuntimeStore();

    await store.save({
      workflowId: "workflow-1",
      status: "running",
      currentStepId: "step-1",
    });

    expect(await store.findByWorkflowId("workflow-1")).toEqual({
      workflowId: "workflow-1",
      status: "running",
      currentStepId: "step-1",
    });
  });

  it("returns undefined for unknown workflow ids", async () => {
    const store = new InMemoryRuntimeStore();

    expect(await store.findByWorkflowId("missing")).toBeUndefined();
  });
});
