import { RendererInput } from "../types/renderer-input.js";
import { ValidationResult, ValidationIssue, ValidationSeverity } from "../validation/validation-result.js";
import { rendererInputSchema } from "../schemas/renderer-input.schema.js";
import * as codes from "../validation/validation-codes.js";

export function validateRendererInput(input: RendererInput): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_METADATA_INVALID}_INPUT_ROOT`,
          severity: "critical",
          code: codes.GC_METADATA_INVALID,
          message: "RendererInput must be a non-null object",
        },
      ],
    };
  }

  // 1. Zod Validation
  const zodResult = rendererInputSchema.safeParse(input);
  if (!zodResult.success) {
    zodResult.error.issues.forEach((zodIssue, index) => {
      const field = zodIssue.path.join(".");
      let code = codes.GC_METADATA_INVALID;
      let severity: ValidationSeverity = "error";

      if (field === "objectId") {
        code = codes.GC_RENDERER_INPUT_OBJECT_ID_MISSING;
      } else if (field === "objectVersion") {
        code = codes.GC_RENDERER_INPUT_OBJECT_VERSION_MISSING;
      } else if (field === "language") {
        code = codes.GC_RENDERER_INPUT_LANGUAGE_MISSING;
      } else if (field === "content") {
        code = codes.GC_RENDERER_INPUT_CONTENT_MISSING;
      } else if (field === "metadata") {
        code = codes.GC_RENDERER_INPUT_METADATA_MISSING;
      }

      issues.push({
        id: `${code}_${field || "field"}_${index}`,
        severity,
        code,
        message: `Renderer input field '${field}' is invalid: ${zodIssue.message}`,
        objectId: input.objectId,
        field: field || undefined,
      });
    });
  }

  // Check manual fields
  if (input.objectId && input.metadata) {
    if (input.metadata.id && input.metadata.id !== input.objectId) {
      issues.push({
        id: `${codes.GC_RENDERER_INPUT_METADATA_OBJECT_MISMATCH}_${input.objectId}`,
        severity: "warning",
        code: codes.GC_RENDERER_INPUT_METADATA_OBJECT_MISMATCH,
        message: `Metadata ID '${input.metadata.id}' does not match objectId '${input.objectId}'.`,
        objectId: input.objectId,
        field: "metadata.id",
      });
    }
  }

  if (input.objectVersion && input.metadata) {
    if (input.metadata.version && input.metadata.version !== input.objectVersion) {
      issues.push({
        id: `${codes.GC_RENDERER_INPUT_METADATA_VERSION_MISMATCH}_${input.objectId}`,
        severity: "warning",
        code: codes.GC_RENDERER_INPUT_METADATA_VERSION_MISMATCH,
        message: `Metadata version '${input.metadata.version}' does not match objectVersion '${input.objectVersion}'.`,
        objectId: input.objectId,
        field: "metadata.version",
      });
    }
  }

  const hasErrorsOrCritical = issues.some(
    (issue) => issue.severity === "error" || issue.severity === "critical"
  );

  return {
    valid: !hasErrorsOrCritical,
    publishable: !hasErrorsOrCritical,
    issues,
    checkedAt,
  };
}
