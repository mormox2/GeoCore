import { knowledgeCitationSchema } from "../schemas/citation.schema.js";
import { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import * as codes from "../validation/validation-codes.js";
import type { KnowledgeCitation, KnowledgeSource } from "../types/citation.js";

/**
 * Validates a KnowledgeCitation using the Zod schema and business rules.
 * Optionally cross-references against the provided source map.
 */
export function validateCitation(
  citation: unknown,
  sourceMap?: Map<string, KnowledgeSource>,
  knownTargetIds?: Set<string>
): ValidationResult {
  const checkedAt = new Date().toISOString();

  if (!citation || typeof citation !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: "GC_CITATION_NULL",
          severity: "error",
          code: codes.GC_CITATION_ID_MISSING,
          message: "Citation must be a non-null object.",
        },
      ],
    };
  }

  const parsed = knowledgeCitationSchema.safeParse(citation);
  const issues: ValidationIssue[] = [];

  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      issues.push({
        id: `GC_CITATION_${field.toUpperCase()}_INVALID`,
        severity: "error",
        code: err.message.startsWith("GC_") ? err.message : codes.GC_CITATION_ID_MISSING,
        message: err.message,
        field,
        objectId: (citation as any).id,
      });
    }
    return { valid: false, publishable: false, checkedAt, issues };
  }

  const c = parsed.data as KnowledgeCitation;

  // Business rule: removed citations are not publishable
  if (c.status === "removed") {
    issues.push({
      id: `GC_CITATION_REMOVED_${c.id}`,
      severity: "error",
      code: codes.GC_CITATION_REMOVED,
      message: `Citation '${c.id}' has been removed and must not be used in published outputs.`,
      objectId: c.id,
    });
  }

  // Business rule: deprecated citations emit a warning
  if (c.status === "deprecated") {
    issues.push({
      id: `GC_CITATION_DEPRECATED_${c.id}`,
      severity: "warning",
      code: codes.GC_CITATION_STATUS_INVALID,
      message: `Citation '${c.id}' is deprecated and should be replaced.`,
      objectId: c.id,
    });
  }

  // Business rule: source must exist if a source map is provided
  if (sourceMap !== undefined && !sourceMap.has(c.sourceId)) {
    issues.push({
      id: `GC_CITATION_SOURCE_NOT_FOUND_${c.id}`,
      severity: "error",
      code: codes.GC_CITATION_SOURCE_NOT_FOUND,
      message: `Citation '${c.id}' references unknown source '${c.sourceId}'.`,
      objectId: c.id,
      field: "sourceId",
    });
  }

  // Business rule: target must exist if known target IDs are provided
  if (knownTargetIds !== undefined && !knownTargetIds.has(c.targetId)) {
    issues.push({
      id: `GC_CITATION_TARGET_NOT_FOUND_${c.id}`,
      severity: "warning",
      code: codes.GC_CITATION_TARGET_NOT_FOUND,
      message: `Citation '${c.id}' references target '${c.targetId}' which is not in the dataset.`,
      objectId: c.id,
      field: "targetId",
    });
  }

  const valid = issues.filter((i) => i.severity === "error").length === 0;
  const publishable = valid;

  return { valid, publishable, checkedAt, issues };
}
