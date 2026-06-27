import { ValidationPipelineStageId } from "../types/validation-stage.js";
import { ValidationIssue } from "../validation/validation-result.js";
export declare function normalizeValidationIssues(issues: ValidationIssue[], context?: {
    stageId?: ValidationPipelineStageId;
    sourceId?: string;
}): ValidationIssue[];
