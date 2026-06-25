import { SitemapEntry } from "../types/sitemap-entry.js";
import { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { sitemapEntrySchema } from "../schemas/sitemap-entry.schema.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Validates a single SitemapEntry for structural correctness.
 * Returns a ValidationResult with any issues found.
 */
export function validateSitemapEntry(entry: SitemapEntry): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!entry || typeof entry !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: `${codes.GC_SITEMAP_ENTRY_ID_MISSING}_root`,
          severity: "critical",
          code: codes.GC_SITEMAP_ENTRY_ID_MISSING,
          message: "SitemapEntry must be a non-null object.",
        },
      ],
    };
  }

  // 1. ID
  if (!entry.id || typeof entry.id !== "string" || entry.id.trim() === "") {
    issues.push({
      id: `${codes.GC_SITEMAP_ENTRY_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_SITEMAP_ENTRY_ID_MISSING,
      message: "SitemapEntry ID is missing.",
      field: "id",
    });
  }

  // 2. Source ID
  if (!entry.sourceId || typeof entry.sourceId !== "string" || entry.sourceId.trim() === "") {
    issues.push({
      id: `${codes.GC_SITEMAP_SOURCE_ID_MISSING}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_SOURCE_ID_MISSING,
      message: "SitemapEntry sourceId is missing.",
      field: "sourceId",
    });
  }

  // 3. Source Type
  if (!entry.sourceType || typeof entry.sourceType !== "string" || entry.sourceType.trim() === "") {
    issues.push({
      id: `${codes.GC_SITEMAP_SOURCE_TYPE_MISSING}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_SOURCE_TYPE_MISSING,
      message: "SitemapEntry sourceType is missing.",
      field: "sourceType",
    });
  }

  // 4. URL
  if (!entry.url || typeof entry.url !== "string" || entry.url.trim() === "") {
    issues.push({
      id: `${codes.GC_SITEMAP_URL_MISSING}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_URL_MISSING,
      message: "SitemapEntry URL is missing.",
      field: "url",
    });
  } else {
    try {
      new URL(entry.url);
    } catch {
      issues.push({
        id: `${codes.GC_SITEMAP_URL_INVALID}_${entry.id}`,
        severity: "error",
        code: codes.GC_SITEMAP_URL_INVALID,
        message: `SitemapEntry URL is not a valid absolute URL: "${entry.url}"`,
        field: "url",
      });
    }
  }

  // 5. Visibility
  const validVisibilities = ["public", "internal", "private", "hidden"];
  if (!validVisibilities.includes(entry.visibility)) {
    issues.push({
      id: `${codes.GC_SITEMAP_VISIBILITY_INVALID}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_VISIBILITY_INVALID,
      message: `SitemapEntry visibility "${entry.visibility}" is not valid.`,
      field: "visibility",
    });
  }

  // 6. Priority range
  if (entry.priority !== undefined) {
    if (typeof entry.priority !== "number" || entry.priority < 0 || entry.priority > 1) {
      issues.push({
        id: `${codes.GC_SITEMAP_PRIORITY_INVALID}_${entry.id || "unknown"}`,
        severity: "error",
        code: codes.GC_SITEMAP_PRIORITY_INVALID,
        message: "SitemapEntry priority must be a number between 0.0 and 1.0.",
        field: "priority",
      });
    }
  }

  // 7. Generated At
  if (!entry.generatedAt || typeof entry.generatedAt !== "string" || entry.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_SITEMAP_GENERATED_AT_MISSING}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_GENERATED_AT_MISSING,
      message: "SitemapEntry generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 8. Alternates array
  if (!Array.isArray(entry.alternates)) {
    issues.push({
      id: `${codes.GC_SITEMAP_ALTERNATES_INVALID}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_ALTERNATES_INVALID,
      message: "SitemapEntry alternates must be an array.",
      field: "alternates",
    });
  }

  // 9. Images array
  if (!Array.isArray(entry.images)) {
    issues.push({
      id: `${codes.GC_SITEMAP_IMAGES_INVALID}_${entry.id || "unknown"}`,
      severity: "error",
      code: codes.GC_SITEMAP_IMAGES_INVALID,
      message: "SitemapEntry images must be an array.",
      field: "images",
    });
  }

  // 10. Zod schema validation
  const zodResult = sitemapEntrySchema.safeParse(entry);
  if (!zodResult.success) {
    for (const zodIssue of zodResult.error.issues) {
      const field = zodIssue.path.join(".");
      const alreadyExists = issues.some((i) => i.field === field);
      if (!alreadyExists) {
        issues.push({
          id: `GC_SITEMAP_ZOD_${field || "field"}_${issues.length}`,
          severity: "error",
          code: codes.GC_SITEMAP_ENTRIES_INVALID,
          message: zodIssue.message,
          field: field || undefined,
        });
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");

  return {
    valid: !hasErrors,
    publishable: !hasErrors,
    issues,
    checkedAt,
  };
}
