import { describe, it, expect } from "vitest";
import { createValidationStageResult } from "../src/pipeline/pipeline-utils.js";
import { ValidationIssue } from "../src/validation/validation-result.js";

describe("Validation Stage Result Tests", () => {
  it("creates passed stage when no issues", () => {
    const stage = createValidationStageResult({
      id: "dataset",
      issues: [],
    });

    expect(stage.status).toBe("passed");
    expect(stage.valid).toBe(true);
    expect(stage.publishable).toBe(true);
    expect(stage.summary.info).toBe(0);
    expect(stage.summary.warnings).toBe(0);
    expect(stage.summary.errors).toBe(0);
    expect(stage.summary.critical).toBe(0);
  });

  it("creates warning stage when warnings exist", () => {
    const issues: ValidationIssue[] = [
      {
        id: "warn-1",
        severity: "warning",
        code: "TEST_WARN",
        message: "This is a warning",
      },
    ];

    const stage = createValidationStageResult({
      id: "metadata",
      issues,
    });

    expect(stage.status).toBe("warning");
    expect(stage.valid).toBe(true);
    expect(stage.publishable).toBe(true);
    expect(stage.summary.warnings).toBe(1);
  });

  it("creates failed stage when errors exist", () => {
    const issues: ValidationIssue[] = [
      {
        id: "err-1",
        severity: "error",
        code: "TEST_ERR",
        message: "This is an error",
      },
    ];

    const stage = createValidationStageResult({
      id: "routes",
      issues,
    });

    expect(stage.status).toBe("failed");
    expect(stage.valid).toBe(false);
    expect(stage.publishable).toBe(false);
    expect(stage.summary.errors).toBe(1);
  });

  it("creates failed stage when critical issues exist", () => {
    const issues: ValidationIssue[] = [
      {
        id: "crit-1",
        severity: "critical",
        code: "TEST_CRIT",
        message: "This is critical",
      },
    ];

    const stage = createValidationStageResult({
      id: "relationships",
      issues,
    });

    expect(stage.status).toBe("failed");
    expect(stage.valid).toBe(false);
    expect(stage.publishable).toBe(false);
    expect(stage.summary.critical).toBe(1);
  });

  it("skipped stage has skipped status", () => {
    const stage = createValidationStageResult({
      id: "sitemap",
      skipped: true,
    });

    expect(stage.status).toBe("skipped");
    expect(stage.valid).toBe(true);
    expect(stage.publishable).toBe(true);
  });

  it("warning stage remains publishable", () => {
    const issues: ValidationIssue[] = [
      {
        id: "warn-1",
        severity: "warning",
        code: "TEST_WARN",
        message: "Warning",
      },
    ];
    const stage = createValidationStageResult({
      id: "search",
      issues,
    });
    expect(stage.publishable).toBe(true);
  });

  it("error stage is not publishable", () => {
    const issues: ValidationIssue[] = [
      {
        id: "err-1",
        severity: "error",
        code: "TEST_ERR",
        message: "Error",
      },
    ];
    const stage = createValidationStageResult({
      id: "schema",
      issues,
    });
    expect(stage.publishable).toBe(false);
  });
});
