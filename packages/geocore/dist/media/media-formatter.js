import { escapeHtml, sanitizeUrl } from "../renderer/html-safety.js";
/**
 * Returns a plain-text alt text string for a media asset.
 * Falls back to the title if no altText is set.
 */
export function getMediaAltText(asset) {
    return asset.altText ?? asset.title;
}
/**
 * Returns a plain-text caption for a media asset.
 * Falls back to description, then title.
 */
export function getMediaCaption(asset) {
    return asset.caption ?? asset.description ?? asset.title;
}
/**
 * Formats a media asset as an HTML img tag string.
 * Only valid for image-type media.
 */
export function formatImageHtml(asset) {
    const src = sanitizeUrl(asset.canonicalUrl ?? asset.source) ?? "";
    const alt = getMediaAltText(asset);
    const width = asset.width ? ` width="${escapeHtml(asset.width)}"` : "";
    const height = asset.height ? ` height="${escapeHtml(asset.height)}"` : "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${width}${height} loading="lazy">`;
}
/**
 * Formats a media asset as a Markdown image string.
 */
export function formatImageMarkdown(asset) {
    const src = asset.canonicalUrl ?? asset.source;
    const alt = getMediaAltText(asset);
    const caption = asset.caption ? `\n*${asset.caption}*` : "";
    return `![${alt}](${src})${caption}`;
}
/**
 * Formats a media asset as an HTML video tag.
 * Only valid for video-type media.
 */
export function formatVideoHtml(asset) {
    const src = sanitizeUrl(asset.canonicalUrl ?? asset.source) ?? "";
    const mimeType = asset.mimeType ?? "video/mp4";
    const width = asset.width ? ` width="${escapeHtml(asset.width)}"` : "";
    const height = asset.height ? ` height="${escapeHtml(asset.height)}"` : "";
    const posterUrl = sanitizeUrl(asset.thumbnailId);
    const poster = posterUrl ? ` poster="${escapeHtml(posterUrl)}"` : "";
    return `<video${width}${height}${poster} controls>\n  <source src="${escapeHtml(src)}" type="${escapeHtml(mimeType)}">\n</video>`;
}
/**
 * Formats a media asset attribution line.
 * e.g. "Photo by Dr Mossaab Rtimi — © RTimi Dental 2026"
 */
export function formatMediaAttribution(asset) {
    const parts = [];
    if (asset.credit) {
        parts.push(asset.credit);
    }
    else if (asset.author) {
        parts.push(`Photo by ${asset.author}`);
    }
    if (asset.copyright) {
        parts.push(`© ${asset.copyright}`);
    }
    if (asset.license) {
        parts.push(`License: ${asset.license}`);
    }
    return parts.join(" — ");
}
/**
 * Returns the display label for a media asset.
 */
export function formatMediaLabel(asset) {
    return `[${asset.type}] ${asset.title}`;
}
/**
 * Returns a compact metadata summary for a media asset (for inspection/CLI).
 */
export function formatMediaSummary(asset) {
    const lines = [
        `ID: ${asset.id}`,
        `Type: ${asset.type}`,
        `Status: ${asset.status}`,
        `Visibility: ${asset.visibility}`,
        `Source: ${asset.source}`,
    ];
    if (asset.altText)
        lines.push(`Alt Text: ${asset.altText}`);
    if (asset.canonicalUrl)
        lines.push(`URL: ${asset.canonicalUrl}`);
    return lines.join("\n");
}
