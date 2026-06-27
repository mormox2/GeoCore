import { SitemapEntry } from "../types/sitemap-entry.js";
import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates a single SitemapEntry for structural correctness.
 * Returns a ValidationResult with any issues found.
 */
export declare function validateSitemapEntry(entry: SitemapEntry): ValidationResult;
