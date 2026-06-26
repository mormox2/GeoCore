import type { StaticExportBundle } from "../types/static-export.js";
import type { StaticExportDiagnostic } from "../types/static-export-diagnostic.js";
import type { ValidationResult, ValidationIssue } from "../validation/validation-result.js";
import { validateStaticExportAsset } from "./validate-static-export-asset.js";
import { staticExportBundleSchema } from "../schemas/static-export-bundle.schema.js";
import * as codes from "../validation/validation-codes.js";

function diagnosticToIssue(diagnostic: StaticExportDiagnostic, index: number): ValidationIssue {
  let severity: ValidationIssue["severity"];
  switch (diagnostic.severity) {
    case "critical": severity = "critical"; break;
    case "error": severity = "error"; break;
    case "warning": severity = "warning"; break;
    default: severity = "info";
  }
  return {
    id: diagnostic.id || `export-issue-${index}`,
    severity,
    code: diagnostic.code,
    message: diagnostic.message,
    objectId: diagnostic.sourceId,
    field: diagnostic.field,
    recommendation: diagnostic.recommendation,
  };
}
import { isValidExportPath } from "./export-utils.js";

/**
 * Validate a full static export bundle: structural shape, per-asset validation,
 * manifest consistency, and cross-asset conflict detection.
 */
export function validateStaticExportBundle(bundle: StaticExportBundle): ValidationResult {
  const checkedAt = new Date().toISOString();
  const issues: ValidationIssue[] = [];

  if (!bundle || typeof bundle !== "object") {
    return {
      valid: false,
      publishable: false,
      checkedAt,
      issues: [{
        id: `${codes.GC_EXPORT_BUNDLE_ID_MISSING}_root`,
        severity: "critical",
        code: codes.GC_EXPORT_BUNDLE_ID_MISSING,
        message: "StaticExportBundle must be a non-null object.",
      }],
    };
  }

  // 1. bundle id
  if (!bundle.id || typeof bundle.id !== "string" || bundle.id.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_ID_MISSING}_id`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_ID_MISSING,
      message: "Bundle id is missing.",
      field: "id",
    });
  }

  // 2. siteName
  if (!bundle.siteName || typeof bundle.siteName !== "string" || bundle.siteName.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_SITE_NAME_MISSING}_${bundle.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_SITE_NAME_MISSING,
      message: "Bundle siteName is missing.",
      field: "siteName",
    });
  }

  // 3. assets array
  if (!Array.isArray(bundle.assets)) {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_ASSETS_INVALID}_${bundle.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_ASSETS_INVALID,
      message: "Bundle assets must be an array.",
      field: "assets",
    });
  }

  // 4. manifest
  if (!bundle.manifest || typeof bundle.manifest !== "object") {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_MANIFEST_MISSING}_${bundle.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_MANIFEST_MISSING,
      message: "Bundle manifest is missing.",
      field: "manifest",
    });
  }

  // 5. generatedAt
  if (!bundle.generatedAt || typeof bundle.generatedAt !== "string" || bundle.generatedAt.trim() === "") {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_GENERATED_AT_MISSING}_${bundle.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_GENERATED_AT_MISSING,
      message: "Bundle generatedAt is missing.",
      field: "generatedAt",
    });
  }

  // 6. diagnostics array
  if (!Array.isArray(bundle.diagnostics)) {
    issues.push({
      id: `${codes.GC_EXPORT_BUNDLE_DIAGNOSTICS_INVALID}_${bundle.id || "unknown"}`,
      severity: "error",
      code: codes.GC_EXPORT_BUNDLE_DIAGNOSTICS_INVALID,
      message: "Bundle diagnostics must be an array.",
      field: "diagnostics",
    });
  }

  // Per-asset validation + cross-asset checks
  if (Array.isArray(bundle.assets)) {
    for (const asset of bundle.assets) {
      const result = validateStaticExportAsset(asset);
      issues.push(...result.issues);
    }

    // Duplicate IDs
    const idCounts = new Map<string, number>();
    const pathCounts = new Map<string, number>();
    for (const asset of bundle.assets) {
      if (asset?.id) idCounts.set(asset.id, (idCounts.get(asset.id) ?? 0) + 1);
      if (asset?.path) pathCounts.set(asset.path, (pathCounts.get(asset.path) ?? 0) + 1);
    }
    for (const [id, count] of idCounts) {
      if (count > 1) {
        issues.push({
          id: `${codes.GC_EXPORT_ASSET_ID_DUPLICATE}_${id}`,
          severity: "error",
          code: codes.GC_EXPORT_ASSET_ID_DUPLICATE,
          message: `Duplicate asset id "${id}" found ${count} times.`,
          field: "id",
        });
      }
    }
    for (const [path, count] of pathCounts) {
      if (count > 1) {
        issues.push({
          id: `${codes.GC_EXPORT_ASSET_PATH_DUPLICATE}_${path}`,
          severity: "error",
          code: codes.GC_EXPORT_ASSET_PATH_DUPLICATE,
          message: `Duplicate asset path "${path}" found ${count} times.`,
          field: "path",
        });
      }
    }

    // Manifest consistency: every manifest entry must point to an existing asset.
    if (bundle.manifest) {
      const assetIds = new Set(bundle.assets.map((a) => a.id));
      for (const entry of bundle.manifest.assets) {
        if (!assetIds.has(entry.id)) {
          issues.push({
            id: `${codes.GC_EXPORT_MANIFEST_ASSET_MISSING}_${entry.id}`,
            severity: "error",
            code: codes.GC_EXPORT_MANIFEST_ASSET_MISSING,
            message: `Manifest entry "${entry.id}" does not point to an existing asset.`,
            field: "manifest",
          });
        }
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error" || i.severity === "critical");
  return { valid: !hasErrors, publishable: !hasErrors, issues, checkedAt };
}
