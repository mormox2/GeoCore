/**
 * Escapes a value for safe interpolation into HTML text content or a quoted attribute.
 */
export declare function escapeHtml(value: string | number | undefined | null): string;
/**
 * Returns the URL when it is relative or uses an allowed protocol (http, https, mailto),
 * and undefined otherwise (e.g. `javascript:` or `data:` URLs).
 * The result is not HTML-escaped; pass it through escapeHtml before embedding it.
 */
export declare function sanitizeUrl(url: string | undefined | null): string | undefined;
