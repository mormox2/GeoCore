import type { StaticExportBundle } from "../types/static-export.js";
import type { ValidationResult } from "../validation/validation-result.js";
/**
 * Validate a full static export bundle: structural shape, per-asset validation,
 * manifest consistency, and cross-asset conflict detection.
 */
export declare function validateStaticExportBundle(bundle: StaticExportBundle, visibility?: "public" | "internal"): ValidationResult;
