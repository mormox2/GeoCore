/**
 * Escapes a value for safe interpolation into HTML text content or a quoted attribute.
 */
export function escapeHtml(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

/**
 * Returns the URL when it is relative or uses an allowed protocol (http, https, mailto),
 * and undefined otherwise (e.g. `javascript:` or `data:` URLs).
 * The result is not HTML-escaped; pass it through escapeHtml before embedding it.
 */
export function sanitizeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  // Browsers ignore control characters and whitespace when parsing a scheme.
  const compact = url.replace(/[\u0000- \u007f]/g, "");
  const scheme = compact.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!scheme) return url.trim();
  return SAFE_URL_PROTOCOLS.has(scheme[1].toLowerCase() + ":") ? url.trim() : undefined;
}
