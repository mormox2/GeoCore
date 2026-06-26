import { ValidationPipelineStageId, ValidationPipelineStageResult } from "../types/validation-stage.js";
import { ValidationPipelineMode } from "../types/validation-report.js";
import { ValidationIssue } from "../validation/validation-result.js";
export declare function createValidationPipelineReportId(input: {
    datasetId: string;
    mode?: ValidationPipelineMode;
    language?: string;
}): string;
export declare function summarizeValidationIssues(issues: ValidationIssue[]): {
    info: number;
    warnings: number;
    errors: number;
    critical: number;
};
export declare function hasBlockingIssues(issues: ValidationIssue[]): boolean;
export declare function isStagePublishable(issues: ValidationIssue[]): boolean;
export declare function isReportPublishable(stages: ValidationPipelineStageResult[]): boolean;
export declare function isReportValid(stages: ValidationPipelineStageResult[]): boolean;
export declare function createValidationStageResult(input: {
    id: ValidationPipelineStageId;
    issues?: ValidationIssue[];
    startedAt?: string;
    finishedAt?: string;
    skipped?: boolean;
}): ValidationPipelineStageResult;
