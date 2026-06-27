import { ValidationIssue } from "../validation/validation-result.js";

export type ValidationPipelineStageId =
  | "dataset"
  | "knowledge-objects"
  | "relationships"
  | "metadata"
  | "routes"
  | "search"
  | "schema"
  | "llms"
  | "sitemap"
  | "static-export";

export type ValidationPipelineStageStatus =
  | "pending"
  | "passed"
  | "warning"
  | "failed"
  | "skipped";

export type ValidationPipelineStageResult = {
  id: ValidationPipelineStageId;
  status: ValidationPipelineStageStatus;

  valid: boolean;
  publishable: boolean;

  startedAt: string;
  finishedAt: string;

  issues: ValidationIssue[];

  summary: {
    info: number;
    warnings: number;
    errors: number;
    critical: number;
  };
};
