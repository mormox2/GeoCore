import type { KnowledgeDataset } from "../types/knowledge-dataset.js";
import type { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { knowledgeDatasetSchema } from "../schemas/knowledge-dataset.schema.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Validates a normalized KnowledgeDataset.
 */
export function validateKnowledgeDataset(dataset: KnowledgeDataset): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!dataset || typeof dataset !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [{
        id: `${codes.GC_DATASET_ID_MISSING}_root`,
        severity: "critical",
        code: codes.GC_DATASET_ID_MISSING,
        message: "Dataset must be a non-null object.",
      }],
    };
  }

  // 1. dataset id
  if (!dataset.id || typeof dataset.id !== "string" || dataset.id.trim() === "") {
    issues.push({
      id: `${codes.GC_DATASET_ID_MISSING}_id`,
      severity: "critical",
      code: codes.GC_DATASET_ID_MISSING,
      message: "Dataset id is missing or empty.",
      field: "id",
    });
  }

  // 2. dataset name
  if (!dataset.name || typeof dataset.name !== "string" || dataset.name.trim() === "") {
    issues.push({
      id: `${codes.GC_DATASET_NAME_MISSING}_name`,
      severity: "critical",
      code: codes.GC_DATASET_NAME_MISSING,
      message: "Dataset name is missing or empty.",
      field: "name",
    });
  }

  // 3. arrays exist
  const arrayFields = [
    "objects",
    "entities",
    "relationships",
    "collections",
    "taxonomyTerms",
    "glossaryEntries",
    "sources",
    "citations",
    "media",
  ];
  arrayFields.forEach((field) => {
    if (!Array.isArray((dataset as any)[field])) {
      issues.push({
        id: `${codes.GC_DATASET_ARRAY_INVALID}_${field}`,
        severity: "critical",
        code: codes.GC_DATASET_ARRAY_INVALID,
        message: `Dataset field '${field}' must be an array.`,
        field,
      });
    }
  });

  // 4. loadedAt
  if (!dataset.loadedAt || typeof dataset.loadedAt !== "string" || dataset.loadedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_DATASET_LOADED_AT_MISSING}_loadedAt`,
      severity: "critical",
      code: codes.GC_DATASET_LOADED_AT_MISSING,
      message: "Dataset loadedAt is missing or empty.",
      field: "loadedAt",
    });
  }

  // 5. diagnostics array
  if (!Array.isArray(dataset.diagnostics)) {
    issues.push({
      id: `${codes.GC_DATASET_DIAGNOSTICS_INVALID}_diagnostics`,
      severity: "critical",
      code: codes.GC_DATASET_DIAGNOSTICS_INVALID,
      message: "Dataset diagnostics must be an array.",
      field: "diagnostics",
    });
  } else {
    // Map diagnostics to validation issues
    dataset.diagnostics.forEach((diag) => {
      let severity: ValidationIssue["severity"];
      switch (diag.severity) {
        case "critical":
          severity = "critical";
          break;
        case "error":
          severity = "error";
          break;
        case "warning":
          severity = "warning";
          break;
        default:
          severity = "info";
      }
      issues.push({
        id: diag.id,
        severity,
        code: diag.code,
        message: diag.message,
        objectId: diag.inputId,
        field: diag.field,
        recommendation: diag.recommendation,
      });
    });
  }

  // 6. At least one Knowledge Object should exist
  if (Array.isArray(dataset.objects) && dataset.objects.length === 0) {
    issues.push({
      id: `${codes.GC_DATASET_EMPTY}_objects`,
      severity: "warning",
      code: codes.GC_DATASET_EMPTY,
      message: "Dataset contains no Knowledge Objects.",
      field: "objects",
    });
  }

  // Run Zod schema validation if basic structure has no critical/error issues
  const basicErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");
  if (!basicErrors) {
    const zodResult = knowledgeDatasetSchema.safeParse(dataset);
    if (!zodResult.success) {
      zodResult.error.issues.forEach((zodIssue, index) => {
        const field = zodIssue.path.join(".");
        issues.push({
          id: `GC_DATASET_ZOD_${field || "field"}_${index}`,
          severity: "error",
          code: codes.GC_DATASET_ARRAY_INVALID,
          message: zodIssue.message,
          field: field || undefined,
        });
      });
    }
  }

  const hasCriticals = issues.some((i) => i.severity === "critical");
  const hasErrors = issues.some((i) => i.severity === "error");

  return {
    valid: !hasCriticals,
    publishable: !hasCriticals && !hasErrors,
    issues,
    checkedAt,
  };
}
