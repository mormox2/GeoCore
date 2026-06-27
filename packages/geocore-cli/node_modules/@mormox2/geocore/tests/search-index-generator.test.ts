import { describe, it, expect } from "vitest";
import { generateSearchIndex } from "../src/search/search-index-generator.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import * as codes from "../src/validation/validation-codes.js";

describe("SearchIndex Generator Tests", () => {
  const publishedKO: KnowledgeObject = {
    id: "ko_pub",
    slug: "pub-slug",
    title: "Published Object",
    summary: "Pub Summary",
    body: "Pub Body",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  const draftKO: KnowledgeObject = {
    id: "ko_draft",
    slug: "draft-slug",
    title: "Draft Object",
    summary: "Draft Summary",
    body: "Draft Body",
    language: "en",
    status: "draft",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  const frKO: KnowledgeObject = {
    id: "ko_fr",
    slug: "fr-slug",
    title: "Objet en Français",
    summary: "Sommaire",
    body: "Corps de texte",
    language: "fr",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  it("should generate index with generatedAt and deterministic output", () => {
    const index1 = generateSearchIndex({
      id: "idx_test",
      name: "Test Index",
      objects: [publishedKO],
    });

    const index2 = generateSearchIndex({
      id: "idx_test",
      name: "Test Index",
      objects: [publishedKO],
    });

    expect(index1.generatedAt).toBeDefined();
    
    const docs1 = index1.documents.map((d) => ({ ...d, generatedAt: "" }));
    const docs2 = index2.documents.map((d) => ({ ...d, generatedAt: "" }));
    expect(docs1).toEqual(docs2);
  });

  it("should filter for public index (only published + public)", () => {
    const index = generateSearchIndex({
      id: "idx_public",
      name: "Public Index",
      objects: [publishedKO, draftKO],
      visibility: "public",
    });

    expect(index.documents).toHaveLength(1);
    expect(index.documents[0].id).toBe("searchdoc_knowledge-object_ko_pub");
  });

  it("should filter for internal index (drafts included, but excludes private/hidden if applicable)", () => {
    const index = generateSearchIndex({
      id: "idx_internal",
      name: "Internal Index",
      objects: [publishedKO, draftKO],
      visibility: "internal",
    });

    expect(index.documents).toHaveLength(2);
    const ids = index.documents.map((d) => d.sourceId);
    expect(ids).toContain("ko_pub");
    expect(ids).toContain("ko_draft");
  });

  it("should apply language filter correctly", () => {
    const index = generateSearchIndex({
      id: "idx_fr",
      name: "French Index",
      objects: [publishedKO, frKO],
      language: "fr",
    });

    expect(index.documents).toHaveLength(1);
    expect(index.documents[0].sourceId).toBe("ko_fr");
  });

  it("should produce warning diagnostic if the index is empty", () => {
    const index = generateSearchIndex({
      id: "idx_empty",
      name: "Empty Index",
      objects: [],
    });

    expect(index.documents).toHaveLength(0);
    const warnings = index.diagnostics.filter((d) => d.code === codes.GC_SEARCH_INDEX_EMPTY);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].severity).toBe("warning");
  });

  it("should produce error diagnostic if duplicate document IDs exist", () => {
    const index = generateSearchIndex({
      id: "idx_dup",
      name: "Duplicate Index",
      objects: [publishedKO, publishedKO], // Duplicate objects will produce duplicate search doc IDs
    });

    const dupErrors = index.diagnostics.filter((d) => d.code === codes.GC_SEARCH_INDEX_DOCUMENT_DUPLICATE);
    expect(dupErrors).toHaveLength(1);
    expect(dupErrors[0].severity).toBe("error");
  });
});
