import { omitUndefined } from "./schema-utils.js";
/**
 * Creates a Schema.org BreadcrumbList JSON-LD object.
 */
export function createBreadcrumbSchema(items) {
    const itemListElement = items.map((item, index) => {
        return omitUndefined({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url || undefined,
        });
    });
    const base = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
    };
    return omitUndefined(base);
}
