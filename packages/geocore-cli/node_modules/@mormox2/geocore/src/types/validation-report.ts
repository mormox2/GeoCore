import { ValidationPipelineStageResult } from "./validation-stage.js";
import { ValidationIssue } from "../validation/validation-result.js";

export type ValidationPipelineMode = "public" | "internal";

export type ValidationPipelineReport = {
  id: string;

  mode: ValidationPipelineMode;

  valid: boolean;
  publishable: boolean;

  startedAt: string;
  finishedAt: string;

  stages: ValidationPipelineStageResult[];

  issues: ValidationIssue[];

  summary: {
    stagesTotal: number;
    stagesPassed: number;
    stagesWarning: number;
    stagesFailed: number;
    stagesSkipped: number;

    info: number;
    warnings: number;
    errors: number;
    critical: number;
  };
};
