import { ValidationPipelineReport, ValidationPipelineMode } from "../types/validation-report.js";
import { ValidationPipelineStageResult } from "../types/validation-stage.js";
import { ValidationIssue } from "../validation/validation-result.js";
import { createValidationPipelineReportId } from "./pipeline-utils.js";

export function createValidationPipelineReport(input: {
  datasetId: string;
  mode: ValidationPipelineMode;
  stages: ValidationPipelineStageResult[];
  startedAt: string;
  finishedAt: string;
  language?: string;
}): ValidationPipelineReport {
  const { datasetId, mode, stages, startedAt, finishedAt, language } = input;

  const id = createValidationPipelineReportId({ datasetId, mode, language });

  const issues: ValidationIssue[] = [];
  const summary = {
    stagesTotal: stages.length,
    stagesPassed: 0,
    stagesWarning: 0,
    stagesFailed: 0,
    stagesSkipped: 0,
    info: 0,
    warnings: 0,
    errors: 0,
    critical: 0,
  };

  for (const stage of stages) {
    issues.push(...stage.issues);

    if (stage.status === "passed") {
      summary.stagesPassed++;
    } else if (stage.status === "warning") {
      summary.stagesWarning++;
    } else if (stage.status === "failed") {
      summary.stagesFailed++;
    } else if (stage.status === "skipped") {
      summary.stagesSkipped++;
    }

    summary.info += stage.summary.info;
    summary.warnings += stage.summary.warnings;
    summary.errors += stage.summary.errors;
    summary.critical += stage.summary.critical;
  }

  const valid = stages.every((s) => s.valid);
  const publishable = stages.every((s) => s.publishable);

  return {
    id,
    mode,
    valid,
    publishable,
    startedAt,
    finishedAt,
    stages,
    issues,
    summary,
  };
}
