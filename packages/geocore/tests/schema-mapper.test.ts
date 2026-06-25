import { describe, it, expect } from "vitest";
import { mapKnowledgeObjectToSchemaType } from "../src/schema/schema-mapper.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";

describe("Schema Mapper Tests", () => {
  const baseKO: KnowledgeObject = {
    id: "ko_test",
    slug: "test-slug",
    title: "Test KO",
    summary: "Test Summary",
    body: "Test Body",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
    metadata: {},
  };

  it("should map default object to Article", () => {
    const type = mapKnowledgeObjectToSchemaType({ object: baseKO });
    expect(type).toBe("Article");
  });

  it("should map FAQ-like object to FAQPage", () => {
    const faqKO = {
      ...baseKO,
      metadata: { contentType: "faq" },
    };
    const type = mapKnowledgeObjectToSchemaType({ object: faqKO });
    expect(type).toBe("FAQPage");
  });

  it("should map glossary-like object to DefinedTerm", () => {
    const glossaryKO = {
      ...baseKO,
      metadata: { contentType: "glossary" },
    };
    const type = mapKnowledgeObjectToSchemaType({ object: glossaryKO });
    expect(type).toBe("DefinedTerm");
  });

  it("should allow explicit schema type overrides", () => {
    const type = mapKnowledgeObjectToSchemaType({
      object: baseKO,
      objectType: "FAQPage",
    });
    expect(type).toBe("FAQPage");
  });
});
