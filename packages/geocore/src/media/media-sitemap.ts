import type { MediaAsset } from "../types/media.js";

export type MediaSitemapImage = {
  url: string;
  title: string;
  caption?: string;
  license?: string;
};

export type MediaSitemapVideo = {
  contentUrl: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
};

export type MediaSitemapEntries = {
  images: MediaSitemapImage[];
  videos: MediaSitemapVideo[];
};

/**
 * Converts a public image MediaAsset into a sitemap image entry.
 */
export function toSitemapImage(asset: MediaAsset): MediaSitemapImage | undefined {
  const url = asset.canonicalUrl ?? asset.source;
  if (!url) return undefined;

  return {
    url,
    title: asset.title,
    caption: asset.caption ?? asset.description,
    license: asset.license,
  };
}

/**
 * Converts a public video MediaAsset into a sitemap video entry.
 */
export function toSitemapVideo(asset: MediaAsset): MediaSitemapVideo | undefined {
  const contentUrl = asset.canonicalUrl ?? asset.source;
  if (!contentUrl) return undefined;

  return {
    contentUrl,
    title: asset.title,
    description: asset.description,
    thumbnailUrl: asset.thumbnailId ?? undefined,
    duration: asset.duration,
  };
}

/**
 * Generates a complete XML sitemap extension for image and video media.
 * Should be embedded inside a <url> element in an XML sitemap.
 */
export function generateMediaSitemapXmlExtension(
  images: MediaSitemapImage[],
  videos: MediaSitemapVideo[]
): string {
  const lines: string[] = [];

  for (const img of images) {
    lines.push(`  <image:image>`);
    lines.push(`    <image:loc>${img.url}</image:loc>`);
    lines.push(`    <image:title>${escapeXml(img.title)}</image:title>`);
    if (img.caption) {
      lines.push(`    <image:caption>${escapeXml(img.caption)}</image:caption>`);
    }
    if (img.license) {
      lines.push(`    <image:license>${escapeXml(img.license)}</image:license>`);
    }
    lines.push(`  </image:image>`);
  }

  for (const vid of videos) {
    lines.push(`  <video:video>`);
    if (vid.thumbnailUrl) {
      lines.push(`    <video:thumbnail_loc>${vid.thumbnailUrl}</video:thumbnail_loc>`);
    }
    lines.push(`    <video:title>${escapeXml(vid.title)}</video:title>`);
    if (vid.description) {
      lines.push(`    <video:description>${escapeXml(vid.description)}</video:description>`);
    }
    lines.push(`    <video:content_loc>${vid.contentUrl}</video:content_loc>`);
    if (vid.duration !== undefined) {
      lines.push(`    <video:duration>${vid.duration}</video:duration>`);
    }
    lines.push(`  </video:video>`);
  }

  return lines.join("\n");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
