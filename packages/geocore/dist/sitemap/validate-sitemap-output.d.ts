import { SitemapOutput } from "../types/sitemap.js";
import { ValidationResult } from "../validation/validation-result.js";
/**
 * Validates the complete SitemapOutput for structural correctness.
 * Checks required fields, duplicate entries/URLs, XML presence, and Zod schema.
 */
export declare function validateSitemapOutput(output: SitemapOutput): ValidationResult;
