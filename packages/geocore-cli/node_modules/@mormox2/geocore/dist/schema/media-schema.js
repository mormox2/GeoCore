import { omitUndefined, mapMediaTypeToSchemaType } from "./schema-utils.js";
/**
 * Creates a Schema.org Media JSON-LD object.
 */
export function createMediaSchema(media) {
    const schemaType = mapMediaTypeToSchemaType(media.type);
    const isPublic = media.visibility === "public";
    const contentUrl = isPublic ? (media.canonicalUrl || media.source) : undefined;
    const base = {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: media.title,
        description: media.description || undefined,
        caption: media.caption || undefined,
        contentUrl,
    };
    if (schemaType === "VideoObject") {
        base.thumbnailUrl = isPublic && media.thumbnailId ? `/media/${media.thumbnailId}` : undefined;
        base.duration = media.duration ? `PT${media.duration}S` : undefined;
    }
    return omitUndefined(base);
}
