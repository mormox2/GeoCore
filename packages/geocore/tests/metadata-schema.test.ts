import { describe, it, expect } from "vitest";
import { geoCoreMetadataSchema } from "../src/schemas/metadata.schema.js";
import { resolvedMetadataSchema } from "../src/schemas/resolved-metadata.schema.js";

describe("Metadata Schema Tests", () => {
  it("should validate a complete and valid GeoCoreMetadata", () => {
    const validMetadata = {
      id: "ko_1",
      slug: "slug-1",
      title: "Title 1",
      summary: "Summary 1",
      language: "en",
      version: "1.0.0",
      status: "draft",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      freshness: "stable",
      trustLevel: "expert",
      entities: ["entity_1"],
      seo: {
        title: "SEO Title",
        description: "SEO Desc",
      },
      ai: {
        summaryShort: "Short",
        confidence: "high",
        freshness: "live",
      },
      technical: {
        sourceFormat: "markdown",
      },
    };
    const parsed = geoCoreMetadataSchema.safeParse(validMetadata);
    expect(parsed.success).toBe(true);
  });

  it("should validate a complete and valid ResolvedMetadata", () => {
    const validResolved = {
      id: "ko_1",
      slug: "slug-1",
      title: "Title 1",
      summary: "Summary 1",
      language: "en",
      version: "1.0.0",
      status: "draft",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      resolvedAt: "2026-06-25T10:05:00Z",
      resolvedFrom: {
        object: true,
        defaults: true,
        graph: false,
        collections: false,
        entities: false,
        citations: false,
      },
    };
    const parsed = resolvedMetadataSchema.safeParse(validResolved);
    expect(parsed.success).toBe(true);
  });

  it("should fail if status is invalid", () => {
    const invalidMetadata = {
      id: "ko_1",
      slug: "slug-1",
      title: "Title 1",
      summary: "Summary 1",
      language: "en",
      version: "1.0.0",
      status: "invalid-status-value",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = geoCoreMetadataSchema.safeParse(invalidMetadata);
    expect(parsed.success).toBe(false);
  });

  it("should fail if freshness is invalid", () => {
    const invalidMetadata = {
      id: "ko_1",
      slug: "slug-1",
      title: "Title 1",
      summary: "Summary 1",
      language: "en",
      version: "1.0.0",
      status: "draft",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      freshness: "ultra-fresh",
    };
    const parsed = geoCoreMetadataSchema.safeParse(invalidMetadata);
    expect(parsed.success).toBe(false);
  });

  it("should fail if AI confidence is invalid", () => {
    const invalidMetadata = {
      id: "ko_1",
      slug: "slug-1",
      title: "Title 1",
      summary: "Summary 1",
      language: "en",
      version: "1.0.0",
      status: "draft",
      author: "author_1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      ai: {
        confidence: "very-high",
      },
    };
    const parsed = geoCoreMetadataSchema.safeParse(invalidMetadata);
    expect(parsed.success).toBe(false);
  });
});
