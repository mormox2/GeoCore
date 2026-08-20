import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates a KnowledgeSource using the Zod schema and business rules.
 * Returns a ValidationResult with zero or more issues.
 */
export declare function validateSource(source: unknown): ValidationResult;
