import { describe, it, expect } from "vitest";
import { searchDocumentSchema } from "../src/schemas/search-document.schema.js";
import { SearchDocument } from "../src/types/search-document.js";

describe("SearchDocument Schema Tests", () => {
  const validDoc: SearchDocument = {
    id: "searchdoc_knowledge-object_ko_test",
    type: "knowledge-object",
    sourceId: "ko_test",
    sourceType: "knowledge-object",
    sourceVersion: "1.0.0",
    title: "Test Title",
    summary: "Test summary",
    body: "Test body",
    language: "en",
    status: "published",
    visibility: "public",
    slug: "test-title",
    canonicalUrl: "https://example.com/test",
    entities: ["entity_1", "entity_2"],
    collections: ["col_1"],
    citations: ["source_1"],
    media: ["media_1"],
    taxonomy: ["tax_1"],
    keywords: ["kw1"],
    aliases: ["alias1"],
    text: "Test Title Test summary Test body entity_1 entity_2 kw1 alias1",
    metadata: {
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    },
    generatedAt: "2026-06-25T11:00:00Z",
  };

  it("should validate a complete and valid SearchDocument", () => {
    const parsed = searchDocumentSchema.safeParse(validDoc);
    expect(parsed.success).toBe(true);
  });

  it("should fail validation if status is invalid", () => {
    const invalidDoc = { ...validDoc, status: "invalid_status" };
    const parsed = searchDocumentSchema.safeParse(invalidDoc);
    expect(parsed.success).toBe(false);
  });

  it("should fail validation if visibility is invalid", () => {
    const invalidDoc = { ...validDoc, visibility: "invalid_visibility" };
    const parsed = searchDocumentSchema.safeParse(invalidDoc);
    expect(parsed.success).toBe(false);
  });

  it("should fail validation if missing required fields", () => {
    const invalidDoc = { ...validDoc };
    // @ts-ignore
    delete invalidDoc.id;
    const parsed = searchDocumentSchema.safeParse(invalidDoc);
    expect(parsed.success).toBe(false);
  });
});
