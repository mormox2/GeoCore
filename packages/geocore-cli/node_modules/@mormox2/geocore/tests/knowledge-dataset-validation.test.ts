import { describe, it, expect } from "vitest";
import { validateKnowledgeDataset } from "../src/loader/validate-knowledge-dataset.js";
import { loadKnowledgeDataset } from "../src/loader/knowledge-loader.js";

describe("Dataset Validation Tests", () => {
  const validDataset = loadKnowledgeDataset({
    id: "load_valid",
    name: "Valid Name",
    inputs: [
      {
        type: "knowledge-object" as const,
        content: {
          id: "ko_test",
          slug: "test-slug",
          title: "Test Title",
          summary: "Summary",
          body: "Body text",
          language: "en",
          author: "author_test",
        },
      },
    ],
  });

  it("passes for a valid dataset", () => {
    const result = validateKnowledgeDataset(validDataset);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("fails when dataset id is missing", () => {
    const invalid = { ...validDataset, id: "" };
    const result = validateKnowledgeDataset(invalid);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === "GC_DATASET_ID_MISSING")).toBe(true);
  });

  it("fails when dataset name is missing", () => {
    const invalid = { ...validDataset, name: "" };
    const result = validateKnowledgeDataset(invalid);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === "GC_DATASET_NAME_MISSING")).toBe(true);
  });

  it("fails for invalid array structures", () => {
    const invalid = { ...validDataset, objects: "not-an-array" as any };
    const result = validateKnowledgeDataset(invalid);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === "GC_DATASET_ARRAY_INVALID")).toBe(true);
  });

  it("produces warning only for an empty dataset", () => {
    const emptyDataset = loadKnowledgeDataset({
      id: "load_empty",
      name: "Empty Name",
      inputs: [],
    });
    const result = validateKnowledgeDataset(emptyDataset);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues.some((i) => i.code === "GC_DATASET_EMPTY" && i.severity === "warning")).toBe(true);
  });

  it("makes dataset not publishable if there are loader errors", () => {
    const datasetWithErrors = loadKnowledgeDataset({
      id: "load_errors",
      name: "Error Name",
      inputs: [
        {
          type: "knowledge-object" as const,
          content: {
            // Missing ID and slug
            title: "Title Only",
          },
        },
      ],
    });
    const result = validateKnowledgeDataset(datasetWithErrors);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(false);
  });
});
