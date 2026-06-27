import { ValidationPipelineStageId } from "../types/validation-stage.js";
import { ValidationIssue } from "../validation/validation-result.js";

export function normalizeValidationIssues(
  issues: ValidationIssue[],
  context?: {
    stageId?: ValidationPipelineStageId;
    sourceId?: string;
  }
): ValidationIssue[] {
  return issues.map((issue) => {
    const normalized = { ...issue };
    if (context?.stageId && !normalized.id.startsWith(context.stageId)) {
      normalized.id = `${context.stageId}_${normalized.id}`;
    }
    if (context?.sourceId && !normalized.objectId) {
      normalized.objectId = context.sourceId;
    }
    return normalized;
  });
}
