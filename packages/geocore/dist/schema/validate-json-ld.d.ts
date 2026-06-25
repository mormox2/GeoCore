import { SchemaOutput } from "../types/schema.js";
import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates a SchemaOutput JSON-LD structure.
 */
export declare function validateJsonLd(output: SchemaOutput): ValidationResult;
