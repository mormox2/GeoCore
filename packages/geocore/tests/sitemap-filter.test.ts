import { describe, it, expect } from "vitest";
import { filterSitemapPublicObjects, filterSitemapExcludedObjects } from "../src/sitemap/sitemap-filter.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";

describe("Sitemap Filter Tests", () => {
  const pubKO: KnowledgeObject = {
    id: "ko_pub",
    slug: "pub-slug",
    title: "Published Object",
    summary: "Summary",
    body: "Body",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  const draftKO: KnowledgeObject = {
    ...pubKO,
    id: "ko_draft",
    status: "draft",
  };

  const privateKO: KnowledgeObject = {
    ...pubKO,
    id: "ko_private",
    metadata: { visibility: "private" as any },
  };

  const frKO: KnowledgeObject = {
    ...pubKO,
    id: "ko_fr",
    language: "fr",
  };

  it("should include published public objects", () => {
    const result = filterSitemapPublicObjects({
      id: "test",
      objects: [pubKO, draftKO, privateKO],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ko_pub");
  });

  it("should filter by language when provided", () => {
    const result = filterSitemapPublicObjects({
      id: "test",
      language: "fr",
      objects: [pubKO, frKO],
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ko_fr");
  });

  it("should return all objects without language filter", () => {
    const result = filterSitemapPublicObjects({
      id: "test",
      objects: [pubKO, frKO],
    });
    expect(result).toHaveLength(2);
  });

  it("should not mutate the input objects list", () => {
    const input = {
      id: "test",
      objects: [pubKO, frKO],
    };
    const copy = [...input.objects];
    filterSitemapPublicObjects(input);
    expect(input.objects).toEqual(copy);
  });

  it("should return excluded objects via filterSitemapExcludedObjects", () => {
    const excluded = filterSitemapExcludedObjects({
      id: "test",
      objects: [pubKO, draftKO, privateKO],
    });
    expect(excluded.map((o) => o.id)).toContain("ko_draft");
    expect(excluded.map((o) => o.id)).toContain("ko_private");
    expect(excluded.map((o) => o.id)).not.toContain("ko_pub");
  });

  it("should return empty array if all objects are public", () => {
    const excluded = filterSitemapExcludedObjects({
      id: "test",
      objects: [pubKO],
    });
    expect(excluded).toHaveLength(0);
  });
});
