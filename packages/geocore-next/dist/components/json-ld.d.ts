import type { SchemaOutput } from "@mormox2/geocore";
/**
 * Generates a safe JSON string for embedding inside `<script type="application/ld+json">`.
 * Sanitizes against XSS / HTML injection in script contexts.
 */
export declare function formatJsonLdScript(schema: SchemaOutput | object): string;
/**
 * Returns an HTML script tag string for SSR / static generation.
 */
export declare function renderJsonLdTag(schema: SchemaOutput | object): string;
