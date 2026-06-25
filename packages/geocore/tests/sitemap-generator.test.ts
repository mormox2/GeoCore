import { describe, it, expect } from "vitest";
import { generateSitemap } from "../src/sitemap/sitemap-generator.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";

describe("Sitemap Generator Tests", () => {
  const pubKO: KnowledgeObject = {
    id: "ko_1",
    slug: "ko-1",
    title: "Title One",
    summary: "Summary One",
    body: "Body content one.",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_1",
  };

  const draftKO: KnowledgeObject = {
    ...pubKO,
    id: "ko_draft",
    status: "draft",
    slug: "ko-draft",
  };

  const metadata: Record<string, ResolvedMetadata> = {
    ko_1: {
      id: "ko_1",
      slug: "ko-1",
      title: "Title One",
      summary: "Summary One",
      language: "en",
      version: "1.0.0",
      status: "published",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      canonicalUrl: "https://example.com/ko-1",
      resolvedAt: "2026-06-25T10:05:00Z",
      resolvedFrom: {
        object: true,
        defaults: false,
        graph: false,
        collections: false,
        entities: false,
        citations: false,
      },
      entities: [],
    },
  };

  it("should generate a sitemap with one entry for a public object", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      siteUrl: "https://example.com",
      objects: [pubKO],
      metadata,
    });

    expect(output.type).toBe("urlset");
    expect(output.entries).toHaveLength(1);
    expect(output.entries[0].url).toBe("https://example.com/ko-1");
    expect(output.entries[0].sourceId).toBe("ko_1");
  });

  it("should exclude draft objects", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      siteUrl: "https://example.com",
      objects: [pubKO, draftKO],
      metadata,
    });

    expect(output.entries).toHaveLength(1);
    expect(output.entries[0].sourceId).toBe("ko_1");
  });

  it("should emit an info diagnostic for excluded objects", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [pubKO, draftKO],
      metadata,
      explicitUrls: { ko_1: "https://example.com/ko-1" },
    });

    const excludedDiag = output.diagnostics.find((d) => d.sourceId === "ko_draft");
    expect(excludedDiag).toBeDefined();
    expect(excludedDiag?.severity).toBe("info");
  });

  it("should emit a warning when object lacks a URL", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [{ ...pubKO, id: "ko_no_url" }],
    });

    const warn = output.diagnostics.find((d) => d.sourceId === "ko_no_url");
    expect(warn).toBeDefined();
    expect(warn?.severity).toBe("warning");
  });

  it("should resolve URL from explicit overrides", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [pubKO],
      explicitUrls: { ko_1: "https://explicit.com/custom-url" },
    });

    expect(output.entries[0].url).toBe("https://explicit.com/custom-url");
  });

  it("should resolve URL from siteUrl + slug fallback", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      siteUrl: "https://example.com",
      objects: [pubKO],
    });

    expect(output.entries[0].url).toBe("https://example.com/ko-1");
  });

  it("should apply defaultChangeFrequency and defaultPriority to entries", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [pubKO],
      explicitUrls: { ko_1: "https://example.com/ko-1" },
      defaultChangeFrequency: "weekly",
      defaultPriority: 0.9,
    });

    expect(output.entries[0].changeFrequency).toBe("weekly");
    expect(output.entries[0].priority).toBe(0.9);
  });

  it("should deduplicate entries by ID", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [pubKO, { ...pubKO, id: "ko_1" }],
      explicitUrls: { ko_1: "https://example.com/ko-1" },
    });

    expect(output.entries).toHaveLength(1);
    const dupDiag = output.diagnostics.find((d) => d.code === "GC_SITEMAP_ENTRY_ID_DUPLICATE");
    expect(dupDiag).toBeDefined();
  });

  it("should emit a warning when sitemap has no public entries", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [draftKO],
    });

    const emptyDiag = output.diagnostics.find((d) => d.code === "GC_SITEMAP_EMPTY");
    expect(emptyDiag).toBeDefined();
    expect(emptyDiag?.severity).toBe("warning");
  });

  it("should produce valid XML in output", () => {
    const output = generateSitemap({
      id: "sitemap_test",
      objects: [pubKO],
      explicitUrls: { ko_1: "https://example.com/ko-1" },
    });

    expect(output.xml).toContain("<?xml");
    expect(output.xml).toContain("<urlset");
    expect(output.xml).toContain("<loc>https://example.com/ko-1</loc>");
  });
});
