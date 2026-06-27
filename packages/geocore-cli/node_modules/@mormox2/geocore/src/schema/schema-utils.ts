import { MediaAsset } from "../types/media.js";

/**
 * Recursively omits keys with undefined values from an object or array.
 * Does not mutate the input.
 */
export function omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  const result: any = {};
  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) {
      continue;
    }
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      result[key] = omitUndefined(val as Record<string, unknown>);
    } else if (Array.isArray(val)) {
      result[key] = val.map((item) => {
        if (item !== null && typeof item === "object" && !Array.isArray(item)) {
          return omitUndefined(item as Record<string, unknown>);
        }
        return item;
      });
    } else {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Creates a deterministic SchemaOutput ID.
 */
export function createSchemaOutputId(sourceType: string, sourceId: string, schemaType: string): string {
  return `schema_${sourceType}_${sourceId}_${schemaType.toLowerCase()}`;
}

/**
 * Safely stringifies schema content.
 */
export function safeStringifySchemaContent(content: unknown): string {
  if (content === undefined || content === null) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  try {
    return JSON.stringify(content);
  } catch {
    return String(content);
  }
}

/**
 * Returns true if the MediaAsset is public.
 */
export function isPublicMediaAsset(media: MediaAsset): boolean {
  return media.visibility === "public";
}

/**
 * Maps a media type string to a Schema.org type string.
 */
export function mapMediaTypeToSchemaType(mediaType: string): string {
  const normalized = mediaType.toLowerCase();
  if (["image", "diagram", "screenshot", "infographic"].includes(normalized)) {
    return "ImageObject";
  }
  if (normalized === "video") {
    return "VideoObject";
  }
  if (["audio", "pdf", "document", "transcript", "presentation"].includes(normalized)) {
    return "MediaObject";
  }
  return "CreativeWork";
}
