import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates a MediaAsset using the Zod schema and business rules.
 * Returns a ValidationResult with zero or more issues.
 */
export declare function validateMediaAsset(asset: unknown): ValidationResult;
