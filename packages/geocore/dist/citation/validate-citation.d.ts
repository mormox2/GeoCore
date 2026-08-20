import { ValidationResult } from "../validation/validation-result.js";
import type { KnowledgeSource } from "../types/citation.js";
/**
 * Validates a KnowledgeCitation using the Zod schema and business rules.
 * Optionally cross-references against the provided source map.
 */
export declare function validateCitation(citation: unknown, sourceMap?: Map<string, KnowledgeSource>, knownTargetIds?: Set<string>): ValidationResult;
