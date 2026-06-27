/**
 * Recursively omits keys with undefined values from an object or array.
 * Does not mutate the input.
 */
export function omitUndefined(value) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
        if (val === undefined) {
            continue;
        }
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
            result[key] = omitUndefined(val);
        }
        else if (Array.isArray(val)) {
            result[key] = val.map((item) => {
                if (item !== null && typeof item === "object" && !Array.isArray(item)) {
                    return omitUndefined(item);
                }
                return item;
            });
        }
        else {
            result[key] = val;
        }
    }
    return result;
}
/**
 * Creates a deterministic SchemaOutput ID.
 */
export function createSchemaOutputId(sourceType, sourceId, schemaType) {
    return `schema_${sourceType}_${sourceId}_${schemaType.toLowerCase()}`;
}
/**
 * Safely stringifies schema content.
 */
export function safeStringifySchemaContent(content) {
    if (content === undefined || content === null) {
        return "";
    }
    if (typeof content === "string") {
        return content;
    }
    try {
        return JSON.stringify(content);
    }
    catch {
        return String(content);
    }
}
/**
 * Returns true if the MediaAsset is public.
 */
export function isPublicMediaAsset(media) {
    return media.visibility === "public";
}
/**
 * Maps a media type string to a Schema.org type string.
 */
export function mapMediaTypeToSchemaType(mediaType) {
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
