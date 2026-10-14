import type { SchemaOutput } from "@mormo_mossaab/geocore";

function isSchemaOutput(value: SchemaOutput | object): value is SchemaOutput {
  return "jsonLd" in value && "schemaType" in value;
}

/**
 * Generates a safe JSON string for embedding inside `<script type="application/ld+json">`.
 * Sanitizes against XSS / HTML injection in script contexts.
 */
export function formatJsonLdScript(schema: SchemaOutput | object): string {
  // A SchemaOutput (from generateJsonLd) wraps the JSON-LD document in `jsonLd`;
  // only that document belongs in the script tag, not the diagnostics around it.
  const json = JSON.stringify(isSchemaOutput(schema) ? schema.jsonLd : schema);

  // Prevent </script> tag breakout attacks
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

/**
 * Returns an HTML script tag string for SSR / static generation.
 */
export function renderJsonLdTag(schema: SchemaOutput | object): string {
  const sanitized = formatJsonLdScript(schema);
  return `<script type="application/ld+json">${sanitized}</script>`;
}
