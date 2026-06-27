import { describe, it, expect } from "vitest";
import { validatePipelineReport } from "../src/pipeline/validate-pipeline-report.js";
import { ValidationPipelineReport } from "../src/types/validation-report.js";

const validReport: ValidationPipelineReport = {
  id: "report-test-ds-public",
  mode: "public",
  valid: true,
  publishable: true,
  startedAt: "2026-06-25T10:00:00Z",
  finishedAt: "2026-06-25T10:05:00Z",
  stages: [
    {
      id: "dataset",
      status: "passed",
      valid: true,
      publishable: true,
      startedAt: "2026-06-25T10:00:00Z",
      finishedAt: "2026-06-25T10:00:10Z",
      issues: [],
      summary: { info: 0, warnings: 0, errors: 0, critical: 0 },
    },
    {
      id: "knowledge-objects",
      status: "passed",
      valid: true,
      publishable: true,
      startedAt: "2026-06-25T10:00:10Z",
      finishedAt: "2026-06-25T10:00:20Z",
      issues: [],
      summary: { info: 0, warnings: 0, errors: 0, critical: 0 },
    },
    {
      id: "relationships",
      status: "passed",
      valid: true,
      publishable: true,
      startedAt: "2026-06-25T10:00:20Z",
      finishedAt: "2026-06-25T10:00:30Z",
      issues: [],
      summary: { info: 0, warnings: 0, errors: 0, critical: 0 },
    },
    {
      id: "metadata",
      status: "passed",
      valid: true,
      publishable: true,
      startedAt: "2026-06-25T10:00:30Z",
      finishedAt: "2026-06-25T10:00:40Z",
      issues: [],
      summary: { info: 0, warnings: 0, errors: 0, critical: 0 },
    },
  ],
  issues: [],
  summary: {
    stagesTotal: 4,
    stagesPassed: 4,
    stagesWarning: 0,
    stagesFailed: 0,
    stagesSkipped: 0,
    info: 0,
    warnings: 0,
    errors: 0,
    critical: 0,
  },
};

describe("Validation Report Validation Tests", () => {
  it("valid report passes validation", () => {
    const res = validatePipelineReport(validReport);
    expect(res.valid).toBe(true);
    expect(res.issues.length).toBe(0);
  });

  it("missing report ID fails validation", () => {
    const invalidReport = { ...validReport, id: "" };
    const res = validatePipelineReport(invalidReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_REPORT_ID_MISSING")).toBe(true);
  });

  it("invalid mode fails validation", () => {
    const invalidReport = { ...validReport, mode: "draft" as any };
    const res = validatePipelineReport(invalidReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_MODE_INVALID")).toBe(true);
  });

  it("invalid stage ID fails validation", () => {
    const invalidReport = {
      ...validReport,
      stages: [
        {
          ...validReport.stages[0],
          id: "invalid-id" as any,
        },
      ],
    };
    const res = validatePipelineReport(invalidReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_STAGE_ID_INVALID")).toBe(true);
  });

  it("invalid stage status fails validation", () => {
    const invalidReport = {
      ...validReport,
      stages: [
        {
          ...validReport.stages[0],
          status: "unknown" as any,
        },
      ],
    };
    const res = validatePipelineReport(invalidReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_STAGE_STATUS_INVALID")).toBe(true);
  });

  it("inconsistent summary fails validation", () => {
    const inconsistentReport = {
      ...validReport,
      summary: {
        ...validReport.summary,
        stagesTotal: 10, // should be 4
      },
    };
    const res = validatePipelineReport(inconsistentReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_SUMMARY_INVALID")).toBe(true);
  });

  it("required skipped stage fails validation", () => {
    const invalidReport = {
      ...validReport,
      stages: [
        {
          ...validReport.stages[0],
          status: "skipped" as any, // dataset is required
        },
        ...validReport.stages.slice(1),
      ],
    };
    const res = validatePipelineReport(invalidReport);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.code === "GC_PIPELINE_STAGE_REQUIRED_SKIPPED")).toBe(true);
  });
});
