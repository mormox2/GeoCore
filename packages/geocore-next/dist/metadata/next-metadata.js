import { resolveMetadata } from "@mormox2/geocore";
/**
 * Generates a full Next.js App Router `Metadata` object from a KnowledgeObject
 * and its KnowledgeDataset.
 */
export function generateNextMetadata(object, dataset, options = {}) {
    const { siteName, defaultLocale = "fr_FR", fallbackSiteUrl } = options;
    // Resolve metadata for the object
    const metadata = resolveMetadata({
        object,
        entities: dataset.entities,
        collections: dataset.collections,
        defaults: options.customDefaults ?? {},
    });
    const title = metadata.seo?.title || object.title;
    const description = metadata.seo?.description || metadata.summary || object.summary;
    const canonicalUrl = metadata.canonicalUrl || (fallbackSiteUrl ? `${fallbackSiteUrl}/${object.slug}` : undefined);
    // Alternate links
    const alternates = {};
    if (canonicalUrl) {
        alternates.canonical = canonicalUrl;
    }
    if (object.translations) {
        alternates.languages = object.translations;
    }
    // OpenGraph images from attached media
    const ogImages = [];
    if (dataset.media) {
        const linkedMedia = dataset.media.filter((m) => m.relatedObjectIds?.includes(object.id) &&
            m.status === "active" &&
            m.visibility === "public" &&
            (m.type === "image" || m.type === "diagram" || m.type === "screenshot"));
        for (const media of linkedMedia) {
            const url = media.canonicalUrl || media.source;
            if (url) {
                ogImages.push({
                    url,
                    width: media.width,
                    height: media.height,
                    alt: media.altText || media.title,
                });
            }
        }
    }
    const openGraph = {
        title,
        description,
        url: canonicalUrl,
        siteName,
        locale: object.language ? `${object.language}_${object.language.toUpperCase()}` : defaultLocale,
        type: "article",
        images: ogImages.length > 0 ? ogImages : undefined,
    };
    // Robots
    const isPublished = object.status === "published";
    const robots = {
        index: isPublished,
        follow: isPublished,
    };
    // Authors
    const authors = [];
    if (object.author) {
        authors.push({ name: object.author });
    }
    // Keywords
    const keywords = metadata.seo?.keywords || object.tags || [];
    return {
        title,
        description,
        alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
        openGraph,
        robots,
        keywords: keywords.length > 0 ? keywords : undefined,
        authors: authors.length > 0 ? authors : undefined,
    };
}
