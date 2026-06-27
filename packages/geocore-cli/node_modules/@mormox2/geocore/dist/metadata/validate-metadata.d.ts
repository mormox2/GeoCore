import { ResolvedMetadata } from "../types/metadata.js";
import { ValidationResult } from "../validation/validation-result.js";
export declare function validateMetadata(metadata: ResolvedMetadata, context?: {
    entities?: string[];
    collections?: string[];
    citations?: string[];
}): ValidationResult;
