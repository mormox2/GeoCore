import { omitUndefined } from "./schema-utils.js";
/**
 * Creates a Schema.org Article JSON-LD object.
 */
export function createArticleSchema(input) {
    const { object, metadata } = input;
    const headline = metadata?.title || object.title;
    const description = metadata?.summary || object.summary || undefined;
    // Author
    const authorName = metadata?.author || object.author;
    const author = authorName
        ? {
            "@type": "Person",
            name: authorName,
        }
        : undefined;
    // Dates
    const dateCreated = metadata?.createdAt || object.createdAt || undefined;
    const dateModified = metadata?.updatedAt || object.updatedAt || undefined;
    const datePublished = metadata?.publishedAt || undefined;
    // URL
    const url = metadata?.canonicalUrl || metadata?.seo?.canonicalUrl || undefined;
    // Citations mapping
    const citationList = [];
    if (input.citations) {
        for (const cite of input.citations) {
            const source = input.sources?.find((s) => s.id === cite.sourceId);
            // Skip if private source
            if (source && (source.visibility === "private" || source.visibility === "internal")) {
                continue;
            }
            if (cite.url) {
                citationList.push(cite.url);
            }
            else if (source?.url) {
                citationList.push(source.url);
            }
            else {
                citationList.push(cite.id);
            }
        }
    }
    const base = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        author,
        dateCreated,
        dateModified,
        datePublished,
        url,
        citation: citationList.length > 0 ? citationList : undefined,
    };
    return omitUndefined(base);
}
