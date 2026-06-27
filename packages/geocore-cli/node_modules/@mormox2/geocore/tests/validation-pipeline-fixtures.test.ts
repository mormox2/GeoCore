import { describe, it, expect } from "vitest";
import { runValidationPipeline } from "../src/pipeline/validation-pipeline.js";
import { validatePipelineReport } from "../src/pipeline/validate-pipeline-report.js";
import { rtimiDentalDataset, dawajinProDataset } from "../src/fixtures/validation-pipeline.fixture.js";

describe("Validation Pipeline Fixtures Tests", () => {
  it("RTimi Dental validation pipeline runs and produces expected report", () => {
    const report = runValidationPipeline({
      dataset: rtimiDentalDataset,
    });

    expect(report.valid).toBe(true);
    expect(report.summary.stagesTotal).toBe(10);
    expect(report.summary.stagesFailed).toBe(0);
    expect(report.summary.stagesPassed + report.summary.stagesWarning).toBe(10);
    expect(report.summary.critical).toBe(0);

    // Verify it contains expected stages
    const stageIds = report.stages.map((s) => s.id);
    expect(stageIds).toContain("dataset");
    expect(stageIds).toContain("knowledge-objects");
    expect(stageIds).toContain("relationships");
    expect(stageIds).toContain("metadata");

    // Both reports validate
    const validation = validatePipelineReport(report);
    expect(validation.valid).toBe(true);
  });

  it("Dawajin Pro validation pipeline runs and produces expected report", () => {
    const report = runValidationPipeline({
      dataset: dawajinProDataset,
    });

    expect(report.valid).toBe(true);
    expect(report.summary.stagesTotal).toBe(10);
    expect(report.summary.stagesFailed).toBe(0);
    expect(report.summary.stagesPassed + report.summary.stagesWarning).toBe(10);
    expect(report.summary.critical).toBe(0);

    // Verify it contains expected stages
    const stageIds = report.stages.map((s) => s.id);
    expect(stageIds).toContain("dataset");
    expect(stageIds).toContain("knowledge-objects");

    // Both reports validate
    const validation = validatePipelineReport(report);
    expect(validation.valid).toBe(true);
  });
});
