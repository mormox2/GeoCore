import type { MediaAsset } from "../types/media.js";

export type MediaSchemaOutput = {
  "@context": "https://schema.org";
  "@type": "ImageObject" | "VideoObject" | "AudioObject" | "MediaObject";
  name: string;
  description?: string;
  url?: string;
  contentUrl?: string;
  encodingFormat?: string;
  width?: string;
  height?: string;
  duration?: string;
  caption?: string;
  license?: string;
  creditText?: string;
  thumbnailUrl?: string;
  inLanguage?: string;
};

/**
 * Generates a Schema.org ImageObject for an image media asset.
 */
export function generateImageObjectSchema(asset: MediaAsset): MediaSchemaOutput {
  const output: MediaSchemaOutput = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: asset.title,
  };

  if (asset.description) output.description = asset.description;
  if (asset.canonicalUrl) output.url = asset.canonicalUrl;
  if (asset.source) output.contentUrl = asset.source;
  if (asset.mimeType) output.encodingFormat = asset.mimeType;
  if (asset.width) output.width = `${asset.width}px`;
  if (asset.height) output.height = `${asset.height}px`;
  if (asset.caption) output.caption = asset.caption;
  if (asset.license) output.license = asset.license;
  if (asset.credit) output.creditText = asset.credit;
  if (asset.language) output.inLanguage = asset.language;

  return output;
}

/**
 * Generates a Schema.org VideoObject for a video media asset.
 */
export function generateVideoObjectSchema(asset: MediaAsset): MediaSchemaOutput {
  const output: MediaSchemaOutput = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: asset.title,
  };

  if (asset.description) output.description = asset.description;
  if (asset.canonicalUrl) output.url = asset.canonicalUrl;
  if (asset.source) output.contentUrl = asset.source;
  if (asset.mimeType) output.encodingFormat = asset.mimeType;
  if (asset.width) output.width = `${asset.width}px`;
  if (asset.height) output.height = `${asset.height}px`;
  if (asset.duration) {
    // ISO 8601 duration for Schema.org: PT{seconds}S
    output.duration = `PT${asset.duration}S`;
  }
  if (asset.thumbnailId) output.thumbnailUrl = asset.thumbnailId;
  if (asset.language) output.inLanguage = asset.language;

  return output;
}

/**
 * Generates the appropriate Schema.org media schema based on the asset type.
 */
export function generateMediaSchema(asset: MediaAsset): MediaSchemaOutput | undefined {
  if (
    asset.type === "image" ||
    asset.type === "diagram" ||
    asset.type === "screenshot" ||
    asset.type === "infographic"
  ) {
    return generateImageObjectSchema(asset);
  }

  if (asset.type === "video") {
    return generateVideoObjectSchema(asset);
  }

  // For other types, generate a generic MediaObject
  const output: MediaSchemaOutput = {
    "@context": "https://schema.org",
    "@type": "MediaObject",
    name: asset.title,
  };
  if (asset.description) output.description = asset.description;
  if (asset.canonicalUrl) output.url = asset.canonicalUrl;
  if (asset.source) output.contentUrl = asset.source;
  if (asset.mimeType) output.encodingFormat = asset.mimeType;

  return output;
}
