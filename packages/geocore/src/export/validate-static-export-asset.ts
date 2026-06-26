import type { StaticExportAsset } from "../types/static-export-asset.js";
import type { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { staticExportAssetSchema } from "../schemas/static-export-asset.schema.js";
import * as codes from "../validation/validation-codes.js";
import { isValidExportPath } from "./export-utils.js";

const VALID_TYPES = new Set([
  "markdown", "json", "json-ld", "search-index", "llms",
  "llms-full", "sitemap", "manifest", "text", "xml",
]);
const VALID_VISIBILITIES = new Set(["public", "internal"]);

/**
 * Validate a single static export asset for structural correctness.
 */
export function validateStaticExportAsset(asset: StaticExportAsset): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!asset || typeof asset !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [{
        id: `${codes.GC_EXPORT_ASSET_ID_MISSING}_root`,
        severity: "critical",
        code: codes.GC_EXPORT_ASSET_ID_MISSING,
        message: "StaticExportAsset must be a non-null object.",
      }],
    };
  }

  // 1. id
  if (!asset.id || typeof asset.id !== "string" || asset.id.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_ID_MISSING,
      message: "StaticExportAsset id is missing.",
      field: "id",
    });
  }

  // 2. type
  if (!VALID_TYPES.has(asset.type)) {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_TYPE_INVALID}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_TYPE_INVALID,
      message: `Asset type "${asset.type}" is not valid.`,
      field: "type",
    });
  }

  // 3. path present
  if (!asset.path || typeof asset.path !== "string" || asset.path.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_PATH_MISSING}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_PATH_MISSING,
      message: "Asset path is missing.",
      field: "path",
    });
  } else if (!isValidExportPath(asset.path)) {
    // 4. path shape
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_PATH_INVALID}_${asset.id}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_PATH_INVALID,
      message: `Asset path "${asset.path}" is not valid (must be relative, no .. or query/hash).`,
      field: "path",
    });
  }

  // 5. content
  if (asset.content === undefined || asset.content === null) {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_CONTENT_MISSING}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_CONTENT_MISSING,
      message: "Asset content is missing.",
      field: "content",
    });
  }

  // 6. mimeType
  if (!asset.mimeType || typeof asset.mimeType !== "string" || asset.mimeType.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_MIME_TYPE_MISSING}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_MIME_TYPE_MISSING,
      message: "Asset mimeType is missing.",
      field: "mimeType",
    });
  }

  // 7. encoding
  if (asset.encoding !== "utf-8") {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_ENCODING_INVALID}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_ENCODING_INVALID,
      message: `Asset encoding "${asset.encoding}" is not valid (must be utf-8).`,
      field: "encoding",
    });
  }

  // 8. sourceIds
  if (!Array.isArray(asset.sourceIds)) {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_SOURCE_IDS_INVALID}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_SOURCE_IDS_INVALID,
      message: "Asset sourceIds must be an array.",
      field: "sourceIds",
    });
  }

  // 9. visibility
  if (!VALID_VISIBILITIES.has(asset.visibility)) {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_VISIBILITY_INVALID}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_VISIBILITY_INVALID,
      message: `Asset visibility "${asset.visibility}" is not valid.`,
      field: "visibility",
    });
  }

  // 10. generatedAt
  if (!asset.generatedAt || typeof asset.generatedAt !== "string" || asset.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_GENERATED_AT_MISSING}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_GENERATED_AT_MISSING,
      message: "Asset generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 11. diagnostics array
  if (!Array.isArray(asset.diagnostics)) {
    issues.push({
      id: `${codes.GC_EXPORT_ASSET_DIAGNOSTICS_INVALID}_${asset.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_ASSET_DIAGNOSTICS_INVALID,
      message: "Asset diagnostics must be an array.",
      field: "diagnostics",
    });
  }

  // 12. Zod catch-all
  const zodResult = staticExportAssetSchema.safeParse(asset);
  if (!zodResult.success) {
    for (const zodIssue of zodResult.error.issues) {
      const field = zodIssue.path.join(".");
      if (!issues.some((i) => i.field === field)) {
        issues.push({
          id: `GC_EXPORT_ZOD_${field || "field"}_${issues.length}`,
          severity: "error",
          code: codes.GC_EXPORT_ASSET_TYPE_INVALID,
          message: zodIssue.message,
          field: field || undefined,
        });
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");
  return { valid: !hasErrors, publishable: !hasErrors, issues, checkedAt };
}
