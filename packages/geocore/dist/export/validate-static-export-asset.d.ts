import type { StaticExportAsset } from "../types/static-export-asset.js";
import type { ValidationResult } from "../validation/validation-result.js";
/**
 * Validate a single static export asset for structural correctness.
 */
export declare function validateStaticExportAsset(asset: StaticExportAsset): ValidationResult;
