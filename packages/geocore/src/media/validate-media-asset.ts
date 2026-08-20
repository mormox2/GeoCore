import { mediaAssetFullSchema } from "../schemas/media.schema.js";
import { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import * as codes from "../validation/validation-codes.js";
import type { MediaAsset } from "../types/media.js";

/**
 * Validates a MediaAsset using the Zod schema and business rules.
 * Returns a ValidationResult with zero or more issues.
 */
export function validateMediaAsset(asset: unknown): ValidationResult {
  const checkedAt = new Date().toISOString();

  if (!asset || typeof asset !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [
        {
          id: "GC_MEDIA_NULL",
          severity: "error",
          code: codes.GC_MEDIA_ID_MISSING,
          message: "Media asset must be a non-null object.",
        },
      ],
    };
  }

  const parsed = mediaAssetFullSchema.safeParse(asset);
  const issues: ValidationIssue[] = [];

  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      const field = err.path.join(".");
      issues.push({
        id: `GC_MEDIA_${field.toUpperCase()}_INVALID`,
        severity: "error",
        code: err.message.startsWith("GC_") ? err.message : codes.GC_MEDIA_ID_MISSING,
        message: err.message,
        field,
        objectId: (asset as any).id,
      });
    }
    return { valid: false, publishable: false, checkedAt, issues };
  }

  const a = parsed.data as MediaAsset;

  // Business rule: public active images should have alt text
  if (
    a.visibility === "public" &&
    a.status === "active" &&
    (a.type === "image" || a.type === "diagram" || a.type === "infographic" || a.type === "screenshot") &&
    !a.altText
  ) {
    issues.push({
      id: `GC_MEDIA_ALT_TEXT_MISSING_${a.id}`,
      severity: "warning",
      code: codes.GC_MEDIA_ALT_TEXT_MISSING,
      message: `Public image media asset '${a.id}' is missing altText for accessibility.`,
      objectId: a.id,
      field: "altText",
    });
  }

  // Business rule: private media must not have a canonicalUrl
  if ((a.visibility === "private" || a.visibility === "hidden") && a.canonicalUrl) {
    issues.push({
      id: `GC_MEDIA_PRIVATE_EXPOSED_${a.id}`,
      severity: "error",
      code: codes.GC_MEDIA_PRIVATE_EXPOSED,
      message: `Media asset '${a.id}' is private/hidden but has a canonicalUrl — this could expose private media publicly.`,
      objectId: a.id,
      field: "canonicalUrl",
    });
  }

  // Business rule: consent required but not granted is a warning for active public media
  if (
    a.status === "active" &&
    a.visibility === "public" &&
    a.consentStatus === "required"
  ) {
    issues.push({
      id: `GC_MEDIA_CONSENT_REQUIRED_${a.id}`,
      severity: "warning",
      code: codes.GC_MEDIA_CONSENT_REQUIRED,
      message: `Media asset '${a.id}' requires consent that has not been confirmed as granted.`,
      objectId: a.id,
      field: "consentStatus",
    });
  }

  const valid = issues.filter((i) => i.severity === "error").length === 0;
  const publishable = valid;

  return { valid, publishable, checkedAt, issues };
}
