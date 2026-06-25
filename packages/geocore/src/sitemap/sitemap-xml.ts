import { SitemapEntry } from "../types/sitemap-entry.js";
import { SitemapAlternateLink, SitemapImage } from "../types/sitemap.js";

/**
 * Escapes XML special characters to prevent injection.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Formats a single sitemap <url> element for a urlset sitemap.
 */
function formatUrlElement(entry: SitemapEntry): string {
  const lines: string[] = [];
  lines.push("  <url>");
  lines.push(`    <loc>${escapeXml(entry.url)}</loc>`);

  if (entry.lastModified) {
    lines.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
  }

  if (entry.changeFrequency) {
    lines.push(`    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`);
  }

  if (entry.priority !== undefined) {
    lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }

  // Alternate links (hreflang)
  for (const alt of entry.alternates) {
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.language)}" href="${escapeXml(alt.url)}"/>`
    );
  }

  // Image extensions
  for (const img of entry.images) {
    lines.push("    <image:image>");
    lines.push(`      <image:loc>${escapeXml(img.url)}</image:loc>`);
    if (img.title) {
      lines.push(`      <image:title>${escapeXml(img.title)}</image:title>`);
    }
    if (img.caption) {
      lines.push(`      <image:caption>${escapeXml(img.caption)}</image:caption>`);
    }
    lines.push("    </image:image>");
  }

  lines.push("  </url>");
  return lines.join("\n");
}

/**
 * Builds the XML declaration and namespace header for a urlset sitemap.
 */
function buildUrlsetHeader(hasAlternates: boolean, hasImages: boolean): string {
  const namespaces: string[] = [
    `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  ];
  if (hasAlternates) {
    namespaces.push(`xmlns:xhtml="http://www.w3.org/1999/xhtml"`);
  }
  if (hasImages) {
    namespaces.push(`xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${namespaces.join("\n        ")}>`;
}

/**
 * Generates a complete XML urlset sitemap string from a list of public entries.
 * Only entries with visibility === "public" are included.
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const publicEntries = entries.filter((e) => e.visibility === "public");

  const hasAlternates = publicEntries.some((e) => e.alternates.length > 0);
  const hasImages = publicEntries.some((e) => e.images.length > 0);

  const header = buildUrlsetHeader(hasAlternates, hasImages);
  const urlElements = publicEntries.map(formatUrlElement).join("\n");
  return `${header}\n${urlElements}\n</urlset>`;
}

/**
 * Generates an XML sitemap index string from a set of child sitemap URLs.
 */
export function generateSitemapIndexXml(
  sitemapUrls: Array<{ loc: string; lastmod?: string }>
): string {
  const lines: string[] = [];
  lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  lines.push(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  for (const { loc, lastmod } of sitemapUrls) {
    lines.push("  <sitemap>");
    lines.push(`    <loc>${escapeXml(loc)}</loc>`);
    if (lastmod) {
      lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
    }
    lines.push("  </sitemap>");
  }

  lines.push("</sitemapindex>");
  return lines.join("\n");
}
