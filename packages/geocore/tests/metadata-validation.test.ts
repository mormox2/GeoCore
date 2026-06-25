import { describe, it, expect } from "vitest";
import { validateMetadata } from "../src/metadata/validate-metadata.js";
import { ResolvedMetadata } from "../types/metadata.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Metadata Validation Tests", () => {
  const baseResolved: ResolvedMetadata = {
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

  it("should pass for valid resolved metadata", () => {
    const result = validateMetadata(baseResolved);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if ID is missing", () => {
    const invalid = { ...baseResolved, id: "" };
    const result = validateMetadata(invalid);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_METADATA_ID_MISSING)).toBe(true);
  });

  it("should fail validation if title is missing", () => {
    const invalid = { ...baseResolved, title: "" };
    const result = validateMetadata(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_METADATA_TITLE_MISSING)).toBe(true);
  });

  it("should fail validation if author is missing", () => {
    const invalid = { ...baseResolved, author: "" };
    const result = validateMetadata(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_METADATA_AUTHOR_MISSING)).toBe(true);
  });

  it("should fail validation if status is invalid", () => {
    const invalid = { ...baseResolved, status: "unknown-status" as any };
    const result = validateMetadata(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_METADATA_STATUS_INVALID)).toBe(true);
  });

  it("should produce a warning (but remain publishable/valid) if published object lacks canonical URL", () => {
    const publishedNoCanonical = {
      ...baseResolved,
      status: "published" as const,
    };
    const result = validateMetadata(publishedNoCanonical);
    expect(result.valid).toBe(true); // Warnings do not make it invalid
    expect(result.publishable).toBe(true); // Warnings do not block publication
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe(codes.GC_METADATA_CANONICAL_URL_MISSING);
    expect(result.issues[0].severity).toBe("warning");
  });

  it("should support context checks for unknown entities", () => {
    const withEntities = {
      ...baseResolved,
      entities: ["entity_existing", "entity_missing"],
    };
    const result = validateMetadata(withEntities, {
      entities: ["entity_existing"],
    });

    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_METADATA_ENTITY_UNKNOWN)).toBe(true);
  });
});
