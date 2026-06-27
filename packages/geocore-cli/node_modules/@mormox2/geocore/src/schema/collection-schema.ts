import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeObject } from "../types/knowledge-object.js";
import { JsonLdObject } from "../types/json-ld.js";
import { omitUndefined } from "./schema-utils.js";

/**
 * Creates a Schema.org CollectionPage JSON-LD object.
 */
export function createCollectionSchema(input: {
  collection: KnowledgeCollection;
  objects?: KnowledgeObject[];
}): JsonLdObject {
  const { collection, objects = [] } = input;

  const itemListElement = collection.items.map((item, index) => {
    const matchedObj = objects.find((o) => o.id === item.objectId);
    const name = item.label || matchedObj?.title || `Item ${item.objectId}`;
    const description = item.description || matchedObj?.summary || undefined;
    const url = matchedObj?.slug ? `/ko/${matchedObj.slug}` : undefined;

    return omitUndefined({
      "@type": "ListItem",
      position: item.order !== undefined ? item.order : index + 1,
      name,
      description,
      url,
      item: matchedObj
        ? {
            "@type": "CreativeWork",
            id: matchedObj.id,
            name: matchedObj.title,
          }
        : undefined,
    });
  });

  const base: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.summary,
    mainEntity: {
      "@type": "ItemList",
      itemListElement,
    },
  };

  return omitUndefined(base) as JsonLdObject;
}
