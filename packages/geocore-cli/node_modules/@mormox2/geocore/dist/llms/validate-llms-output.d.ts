import { LlmsOutput } from "../types/llms-output.js";
import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates the generated LLMs output structure, checking for empty strings
 * and internal leakage indicators.
 */
export declare function validateLlmsOutput(output: LlmsOutput): ValidationResult;
