import { describe, it, expect } from "vitest";
import { filterSearchDocuments } from "../src/search/search-filter.js";
import { SearchDocument } from "../src/types/search-document.js";

describe("SearchFilter Tests", () => {
  const docs: SearchDocument[] = [
    {
      id: "doc_pub_fr",
      type: "knowledge-object",
      sourceId: "ko_pub_fr",
      sourceType: "knowledge-object",
      title: "Title 1",
      language: "fr",
      status: "published",
      visibility: "public",
      entities: [],
      collections: [],
      citations: [],
      media: [],
      taxonomy: [],
      keywords: [],
      aliases: [],
      text: "Text 1",
      metadata: {},
      generatedAt: "2026-06-25T11:00:00Z",
    },
    {
      id: "doc_draft_fr",
      type: "knowledge-object",
      sourceId: "ko_draft_fr",
      sourceType: "knowledge-object",
      title: "Title 2",
      language: "fr",
      status: "draft",
      visibility: "internal",
      entities: [],
      collections: [],
      citations: [],
      media: [],
      taxonomy: [],
      keywords: [],
      aliases: [],
      text: "Text 2",
      metadata: {},
      generatedAt: "2026-06-25T11:00:00Z",
    },
    {
      id: "doc_pub_en",
      type: "knowledge-object",
      sourceId: "ko_pub_en",
      sourceType: "knowledge-object",
      title: "Title 3",
      language: "en",
      status: "published",
      visibility: "public",
      entities: [],
      collections: [],
      citations: [],
      media: [],
      taxonomy: [],
      keywords: [],
      aliases: [],
      text: "Text 3",
      metadata: {},
      generatedAt: "2026-06-25T11:00:00Z",
    },
    {
      id: "doc_internal_en",
      type: "knowledge-object",
      sourceId: "ko_internal_en",
      sourceType: "knowledge-object",
      title: "Title 4",
      language: "en",
      status: "published",
      visibility: "internal",
      entities: [],
      collections: [],
      citations: [],
      media: [],
      taxonomy: [],
      keywords: [],
      aliases: [],
      text: "Text 4",
      metadata: {},
      generatedAt: "2026-06-25T11:00:00Z",
    },
    {
      id: "doc_private_en",
      type: "knowledge-object",
      sourceId: "ko_private_en",
      sourceType: "knowledge-object",
      title: "Title 5",
      language: "en",
      status: "published",
      visibility: "private",
      entities: [],
      collections: [],
      citations: [],
      media: [],
      taxonomy: [],
      keywords: [],
      aliases: [],
      text: "Text 5",
      metadata: {},
      generatedAt: "2026-06-25T11:00:00Z",
    },
  ];

  it("should filter by public visibility correctly", () => {
    const result = filterSearchDocuments(docs, { visibility: "public" });
    // Should only keep doc_pub_fr and doc_pub_en
    expect(result).toHaveLength(2);
    const ids = result.map((r) => r.id);
    expect(ids).toContain("doc_pub_fr");
    expect(ids).toContain("doc_pub_en");
  });

  it("should filter by internal visibility correctly", () => {
    const result = filterSearchDocuments(docs, { visibility: "internal" });
    // Should keep: doc_pub_fr, doc_draft_fr, doc_pub_en, doc_internal_en. (excludes private)
    expect(result).toHaveLength(4);
    const ids = result.map((r) => r.id);
    expect(ids).toContain("doc_pub_fr");
    expect(ids).toContain("doc_draft_fr");
    expect(ids).toContain("doc_pub_en");
    expect(ids).toContain("doc_internal_en");
    expect(ids).not.toContain("doc_private_en");
  });

  it("should filter by language correctly", () => {
    const result = filterSearchDocuments(docs, { language: "fr" });
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["doc_pub_fr", "doc_draft_fr"]);
  });

  it("should filter by status correctly", () => {
    const result = filterSearchDocuments(docs, { status: "draft" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("doc_draft_fr");
  });
});
