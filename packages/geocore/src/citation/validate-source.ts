import { knowledgeSourceSchema } from "../schemas/citation.schema.js";
import { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import * as codes from "../validation/validation-codes.js";
import type { KnowledgeSource } from "../types/citation.js";

/**
 * Validates a KnowledgeSource using the Zod schema and business rules.
 * Returns a ValidationResult with zero or more issues.
 */
export function validateSource(source: unknown): ValidationResult {
  const checkedAt = new Date().toISOString();

  if (!source || typeof source !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: "GC_CITATION_SOURCE_NULL",
          severity: "error",
          code: codes.GC_CITATION_SOURCE_ID_MISSING,
          message: "Source must be a non-null object.",
        },
      ],
    };
  }

  const parsed = knowledgeSourceSchema.safeParse(source);
  const issues: ValidationIssue[] = [];

  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      issues.push({
        id: `GC_CITATION_SOURCE_${field.toUpperCase()}_INVALID`,
        severity: "error",
        code: err.message.startsWith("GC_") ? err.message : codes.GC_CITATION_SOURCE_ID_MISSING,
        message: err.message,
        field,
        objectId: (source as any).id,
      });
    }
    return { valid: false, publishable: false, checkedAt, issues };
  }

  const s = parsed.data as KnowledgeSource;

  // Business rules
  if (s.status === "deprecated" || s.status === "archived") {
    issues.push({
      id: `GC_CITATION_SOURCE_DEPRECATED_${s.id}`,
      severity: "warning",
      code: codes.GC_CITATION_SOURCE_DEPRECATED,
      message: `Source '${s.id}' has status '${s.status}' and should not be used in new citations.`,
      objectId: s.id,
    });
  }

  const valid = issues.filter((i) => i.severity === "error").length === 0;
  const publishable = valid;

  return { valid, publishable, checkedAt, issues };
}
