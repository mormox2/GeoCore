import { describe, it, expect } from "vitest";
import { createCollectionSchema } from "../src/schema/collection-schema.js";
import { KnowledgeCollection } from "../src/types/collection.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";

describe("Collection Schema Tests", () => {
  const collection: KnowledgeCollection = {
    id: "col_1",
    slug: "col-1-slug",
    title: "Collection Title",
    summary: "Collection Description",
    type: "guide",
    language: "en",
    status: "published",
    visibility: "public",
    version: "1.0.0",
    items: [
      { objectId: "ko_1", order: 1, label: "Custom Label 1" },
      { objectId: "ko_2", order: 2 },
    ],
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  };

  const objects: KnowledgeObject[] = [
    {
      id: "ko_1",
      slug: "ko-1",
      title: "Title 1",
      summary: "Summary 1",
      body: "Body 1",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_1",
    },
    {
      id: "ko_2",
      slug: "ko-2",
      title: "Title 2",
      summary: "Summary 2",
      body: "Body 2",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_2",
    },
  ];

  it("should generate CollectionPage JSON-LD and preserve item orders", () => {
    const schema = createCollectionSchema({ collection, objects });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("CollectionPage");
    expect(schema.name).toBe("Collection Title");
    expect(schema.description).toBe("Collection Description");

    const itemList = schema.mainEntity as any;
    expect(itemList["@type"]).toBe("ItemList");
    expect(itemList.itemListElement).toHaveLength(2);

    expect(itemList.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Custom Label 1",
      description: "Summary 1",
      url: "/ko/ko-1",
      item: {
        "@type": "CreativeWork",
        id: "ko_1",
        name: "Title 1",
      },
    });

    expect(itemList.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Title 2",
      description: "Summary 2",
      url: "/ko/ko-2",
      item: {
        "@type": "CreativeWork",
        id: "ko_2",
        name: "Title 2",
      },
    });
  });
});
