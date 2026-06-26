import { describe, it, expect } from "vitest";
import { normalizeValidationIssues } from "../src/pipeline/normalize-validation-issues.js";
import { ValidationIssue } from "../src/validation/validation-result.js";

describe("Validation Issue Normalization Tests", () => {
  const originalIssue: ValidationIssue = {
    id: "original-id",
    severity: "error",
    code: "GC_TEST_CODE",
    message: "Original message",
  };

  it("preserves issue code, severity, and message", () => {
    const normalized = normalizeValidationIssues([originalIssue]);

    expect(normalized[0].code).toBe(originalIssue.code);
    expect(normalized[0].severity).toBe(originalIssue.severity);
    expect(normalized[0].message).toBe(originalIssue.message);
  });

  it("adds stage context when provided", () => {
    const normalized = normalizeValidationIssues([originalIssue], {
      stageId: "metadata",
    });

    expect(normalized[0].id).toBe("metadata_original-id");
  });

  it("adds source context when provided", () => {
    const normalized = normalizeValidationIssues([originalIssue], {
      sourceId: "ko_test_source",
    });

    expect(normalized[0].objectId).toBe("ko_test_source");
  });

  it("does not mutate original issues", () => {
    const orig = { ...originalIssue };
    const normalized = normalizeValidationIssues([orig], {
      stageId: "dataset",
      sourceId: "src-1",
    });

    expect(orig.id).toBe("original-id");
    expect(orig.objectId).toBeUndefined();
    expect(normalized[0].id).toBe("dataset_original-id");
    expect(normalized[0].objectId).toBe("src-1");
  });
});
