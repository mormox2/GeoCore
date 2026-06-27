import { JsonLdObject } from "../types/json-ld.js";
import { omitUndefined } from "./schema-utils.js";

export type BreadcrumbItem = {
  name: string;
  url?: string;
};

/**
 * Creates a Schema.org BreadcrumbList JSON-LD object.
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  const itemListElement = items.map((item, index) => {
    return omitUndefined({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url || undefined,
    });
  });

  const base: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return omitUndefined(base) as JsonLdObject;
}
