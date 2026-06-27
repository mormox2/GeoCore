import { ResolvedMetadata } from "../types/metadata.js";
import { ValidationResult, ValidationIssue, ValidationSeverity } from "../validation/validation-result.js";
import { resolvedMetadataSchema } from "../schemas/resolved-metadata.schema.js";
import { hasCanonicalUrl } from "./metadata-utils.js";
import * as codes from "../validation/validation-codes.js";

export function validateMetadata(
  metadata: ResolvedMetadata,
  context?: {
    entities?: string[];
    collections?: string[];
    citations?: string[];
  }
): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!metadata || typeof metadata !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_METADATA_INVALID}_ROOT`,
          severity: "critical",
          code: codes.GC_METADATA_INVALID,
          message: "ResolvedMetadata must be a non-null object",
        },
      ],
    };
  }

  // 1. Zod Schema Validation
  const zodResult = resolvedMetadataSchema.safeParse(metadata);
  if (!zodResult.success) {
    zodResult.error.issues.forEach((zodIssue, index) => {
      const field = zodIssue.path.join(".");
      let code = codes.GC_METADATA_INVALID;
      let severity: ValidationSeverity = "error";
      let message = zodIssue.message;

      if (field === "id") {
        code = codes.GC_METADATA_ID_MISSING;
      } else if (field === "slug") {
        code = codes.GC_METADATA_SLUG_MISSING;
      } else if (field === "title") {
        code = codes.GC_METADATA_TITLE_MISSING;
      } else if (field === "summary") {
        code = codes.GC_METADATA_SUMMARY_MISSING;
      } else if (field === "language") {
        code = codes.GC_METADATA_LANGUAGE_MISSING;
      } else if (field === "version") {
        code = codes.GC_METADATA_VERSION_MISSING;
      } else if (field === "status") {
        code = codes.GC_METADATA_STATUS_INVALID;
      } else if (field === "createdAt") {
        code = codes.GC_METADATA_CREATED_AT_MISSING;
      } else if (field === "updatedAt") {
        code = codes.GC_METADATA_UPDATED_AT_MISSING;
      } else if (field === "author") {
        code = codes.GC_METADATA_AUTHOR_MISSING;
      } else if (field === "freshness" || field === "ai.freshness") {
        code = codes.GC_METADATA_INVALID_FRESHNESS;
      } else if (field === "ai.confidence") {
        code = codes.GC_METADATA_INVALID_CONFIDENCE;
      }

      issues.push({
        id: `${code}_${field || "field"}_${index}`,
        severity,
        code,
        message: `Metadata field '${field}' is invalid: ${message}`,
        objectId: metadata.id,
        field: field || undefined,
      });
    });
  }

  // 2. Published Canonical URL Check
  if (metadata.status === "published" && !hasCanonicalUrl(metadata)) {
    issues.push({
      id: `${codes.GC_METADATA_CANONICAL_URL_MISSING}_${metadata.id}`,
      severity: "warning",
      code: codes.GC_METADATA_CANONICAL_URL_MISSING,
      message: "Published metadata is missing canonical URL.",
      objectId: metadata.id,
      field: "canonicalUrl",
      recommendation: "Provide a canonical URL for published objects to help with routing and search indexing.",
    });
  }

  // 3. Duplicate Entity Check
  if (metadata.entities && Array.isArray(metadata.entities)) {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const eId of metadata.entities) {
      if (seen.has(eId)) {
        duplicates.add(eId);
      } else {
        seen.add(eId);
      }
    }
    duplicates.forEach((dupId) => {
      issues.push({
        id: `${codes.GC_METADATA_DUPLICATE_ENTITY}_${dupId}`,
        severity: "warning",
        code: codes.GC_METADATA_DUPLICATE_ENTITY,
        message: `Entity ID '${dupId}' is duplicated in entities list.`,
        objectId: metadata.id,
        field: "entities",
      });
    });
  }

  // 4. Context validation (unknown references)
  if (context) {
    if (context.entities && metadata.entities) {
      metadata.entities.forEach((entityId) => {
        if (!context.entities!.includes(entityId)) {
          issues.push({
            id: `${codes.GC_METADATA_ENTITY_UNKNOWN}_${entityId}`,
            severity: "error",
            code: codes.GC_METADATA_ENTITY_UNKNOWN,
            message: `Referenced entity '${entityId}' is unknown.`,
            objectId: metadata.id,
            field: "entities",
          });
        }
      });
    }

    if (context.collections && metadata.collections) {
      metadata.collections.forEach((colId) => {
        if (!context.collections!.includes(colId)) {
          issues.push({
            id: `${codes.GC_METADATA_COLLECTION_UNKNOWN}_${colId}`,
            severity: "error",
            code: codes.GC_METADATA_COLLECTION_UNKNOWN,
            message: `Referenced collection '${colId}' is unknown.`,
            objectId: metadata.id,
            field: "collections",
          });
        }
      });
    }

    if (context.citations && metadata.citations) {
      metadata.citations.forEach((citId) => {
        if (!context.citations!.includes(citId)) {
          issues.push({
            id: `${codes.GC_METADATA_CITATION_UNKNOWN}_${citId}`,
            severity: "error",
            code: codes.GC_METADATA_CITATION_UNKNOWN,
            message: `Referenced citation '${citId}' is unknown.`,
            objectId: metadata.id,
            field: "citations",
          });
        }
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
