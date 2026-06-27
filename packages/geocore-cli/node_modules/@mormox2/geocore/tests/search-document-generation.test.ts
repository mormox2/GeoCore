import { describe, it, expect } from "vitest";
import { createSearchDocumentFromKnowledgeObject } from "../src/search/search-document.js";
import { validateSearchDocument } from "../src/search/validate-search-document.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";
import { KnowledgeRelationship } from "../src/types/relationship.js";

describe("SearchDocument Generation Tests", () => {
  const baseKO: KnowledgeObject = {
    id: "ko_test_id",
    slug: "test-slug",
    title: "Test Title",
    summary: "Test summary.",
    body: "Test body content.",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  it("should create SearchDocument from valid KnowledgeObject with correct fields", () => {
    const doc = createSearchDocumentFromKnowledgeObject({ object: baseKO });
    expect(doc.id).toBe("searchdoc_knowledge-object_ko_test_id");
    expect(doc.sourceId).toBe("ko_test_id");
    expect(doc.sourceType).toBe("knowledge-object");
    expect(doc.sourceVersion).toBe("1.0.0");
    expect(doc.title).toBe("Test Title");
    expect(doc.summary).toBe("Test summary.");
    expect(doc.body).toBe("Test body content.");
    expect(doc.language).toBe("en");
    expect(doc.status).toBe("published");
    expect(doc.visibility).toBe("public"); // Default for published
    expect(doc.text).toContain("Test Title");
    expect(doc.text).toContain("Test summary");
    expect(doc.text).toContain("Test body content");
    expect(doc.metadata.author).toBe("author_test");
    expect(doc.metadata.createdAt).toBe("2026-06-25T10:00:00Z");
    expect(doc.metadata.updatedAt).toBe("2026-06-25T10:00:00Z");
    expect(doc.generatedAt).toBeDefined();

    const validationResult = validateSearchDocument(doc);
    expect(validationResult.valid).toBe(true);
  });

  it("should default draft object to internal visibility", () => {
    const draftKO = { ...baseKO, status: "draft" as const };
    const doc = createSearchDocumentFromKnowledgeObject({ object: draftKO });
    expect(doc.visibility).toBe("internal");
  });

  it("should include metadata entities and relationship-derived entities, and deduplicate them", () => {
    const metadata: ResolvedMetadata = {
      id: "ko_test_id",
      slug: "test-slug",
      title: "Test Title",
      summary: "Test summary.",
      language: "en",
      version: "1.0.0",
      status: "published",
      author: "author_test",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      resolvedAt: "2026-06-25T10:05:00Z",
      resolvedFrom: {
        object: true,
        defaults: false,
        graph: true,
        collections: false,
        entities: true,
        citations: false,
      },
      entities: ["entity_1", "entity_2"],
    };

    const relationships: KnowledgeRelationship[] = [
      {
        id: "rel_1",
        sourceId: "ko_test_id",
        targetId: "entity_2",
        type: "explains",
        strength: "canonical",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
      },
      {
        id: "rel_2",
        sourceId: "ko_test_id",
        targetId: "entity_3",
        type: "mentions",
        strength: "medium",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
      },
      {
        id: "rel_other",
        sourceId: "ko_other",
        targetId: "entity_4",
        type: "mentions",
        strength: "medium",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
      },
    ];

    const doc = createSearchDocumentFromKnowledgeObject({
      object: baseKO,
      metadata,
      relationships,
    });

    expect(doc.entities).toEqual(["entity_1", "entity_2", "entity_3"]);
  });
});
