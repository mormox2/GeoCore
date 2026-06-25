import { describe, it, expect } from "vitest";
import { createArticleSchema } from "../src/schema/article-schema.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";

describe("Article Schema Tests", () => {
  const baseKO: KnowledgeObject = {
    id: "ko_test",
    slug: "test-slug",
    title: "Article Headline",
    summary: "Article description",
    body: "Body",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  it("should generate core schema properties", () => {
    const schema = createArticleSchema({ object: baseKO });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("Article Headline");
    expect(schema.description).toBe("Article description");
    expect(schema.author).toEqual({
      "@type": "Person",
      name: "author_test",
    });
    expect(schema.dateCreated).toBe("2026-06-25T10:00:00Z");
    expect(schema.dateModified).toBe("2026-06-25T10:00:00Z");
  });

  it("should enrich with resolved metadata properties", () => {
    const metadata: ResolvedMetadata = {
      id: "ko_test",
      slug: "test-slug",
      title: "Overridden Headline",
      summary: "Overridden description",
      language: "en",
      version: "1.0.0",
      status: "published",
      author: "author_metadata",
      createdAt: "2026-06-25T09:00:00Z",
      updatedAt: "2026-06-25T11:00:00Z",
      publishedAt: "2026-06-25T11:05:00Z",
      canonicalUrl: "https://example.com/canonical",
      resolvedAt: "2026-06-25T12:00:00Z",
      resolvedFrom: {
        object: true,
        defaults: false,
        graph: false,
        collections: false,
        entities: false,
        citations: false,
      },
    };

    const schema = createArticleSchema({ object: baseKO, metadata });
    expect(schema.headline).toBe("Overridden Headline");
    expect(schema.description).toBe("Overridden description");
    expect(schema.author).toEqual({
      "@type": "Person",
      name: "author_metadata",
    });
    expect(schema.dateCreated).toBe("2026-06-25T09:00:00Z");
    expect(schema.dateModified).toBe("2026-06-25T11:00:00Z");
    expect(schema.datePublished).toBe("2026-06-25T11:05:00Z");
    expect(schema.url).toBe("https://example.com/canonical");
  });

  it("should omit undefined properties", () => {
    const minimalKO: KnowledgeObject = {
      id: "ko_min",
      slug: "min-slug",
      title: "Minimal",
      summary: "",
      body: "Body",
      language: "en",
      status: "draft",
      version: "1.0.0",
      createdAt: "",
      updatedAt: "",
      author: "",
    };

    const schema = createArticleSchema({ object: minimalKO });
    expect(schema.description).toBeUndefined();
    expect(schema.author).toBeUndefined();
    expect(schema.dateCreated).toBeUndefined();
    expect(schema.dateModified).toBeUndefined();
  });
});
