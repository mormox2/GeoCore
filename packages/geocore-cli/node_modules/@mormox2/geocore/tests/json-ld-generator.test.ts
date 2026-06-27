import { describe, it, expect } from "vitest";
import { generateJsonLd } from "../src/schema/json-ld-generator.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";
import * as codes from "../src/validation/validation-codes.js";

describe("JSON-LD Generator Orchestrator Tests", () => {
  const baseKO: KnowledgeObject = {
    id: "ko_test",
    slug: "test-slug",
    title: "Test Article Title",
    summary: "Brief Summary",
    body: "Main body content.",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
    metadata: {},
  };

  const metadata: ResolvedMetadata = {
    id: "ko_test",
    slug: "test-slug",
    title: "Test Article Title",
    summary: "Brief Summary",
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
      graph: false,
      collections: false,
      entities: false,
      citations: false,
    },
  };

  it("should generate a valid Article schema output by default", () => {
    const output = generateJsonLd({ object: baseKO, metadata });
    expect(output.id).toBe("schema_knowledge-object_ko_test_article");
    expect(output.schemaType).toBe("Article");
    expect(output.jsonLd["@type"]).toBe("Article");
    expect(output.generatedAt).toBeDefined();
    expect(output.diagnostics).toEqual([
      expect.objectContaining({
        code: codes.GC_SCHEMA_CANONICAL_URL_MISSING,
        severity: "warning",
      }),
    ]);
  });

  it("should trigger validation errors when referencing private sources in a public schema", () => {
    const privateSource = {
      id: "src_private",
      type: "internal-document" as const,
      title: "Secret File",
      status: "active" as const,
      visibility: "private" as const,
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };

    const output = generateJsonLd({
      object: baseKO,
      metadata,
      sources: [privateSource],
    });

    const errorDiagnostics = output.diagnostics.filter(
      (d) => d.code === codes.GC_SCHEMA_CITATION_PRIVATE_SOURCE
    );
    expect(errorDiagnostics).toHaveLength(1);
    expect(errorDiagnostics[0].severity).toBe("error");
  });

  it("should trigger validation errors when referencing private media assets in a public schema", () => {
    const privateMedia = {
      id: "media_private",
      type: "video" as const,
      title: "Secret Recording",
      status: "active" as const,
      visibility: "private" as const,
      source: "local_source",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };

    const output = generateJsonLd({
      object: baseKO,
      metadata,
      media: [privateMedia],
    });

    const errorDiagnostics = output.diagnostics.filter(
      (d) => d.code === codes.GC_SCHEMA_MEDIA_PRIVATE_OUTPUT
    );
    expect(errorDiagnostics).toHaveLength(1);
    expect(errorDiagnostics[0].severity).toBe("error");
  });
});

import { createMediaSchema } from "../src/schema/media-schema.js";
import { MediaAsset } from "../src/types/media.js";

describe("Media Schema Tests", () => {
  it("should map image to ImageObject", () => {
    const imageMedia: MediaAsset = {
      id: "media_img",
      type: "image",
      title: "My Image",
      status: "active",
      visibility: "public",
      source: "img.png",
      canonicalUrl: "https://example.com/img.png",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const schema = createMediaSchema(imageMedia);
    expect(schema["@type"]).toBe("ImageObject");
    expect(schema.name).toBe("My Image");
    expect(schema.contentUrl).toBe("https://example.com/img.png");
  });

  it("should map video to VideoObject", () => {
    const videoMedia: MediaAsset = {
      id: "media_vid",
      type: "video",
      title: "My Video",
      status: "active",
      visibility: "public",
      source: "vid.mp4",
      duration: 120,
      thumbnailId: "thumb1",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const schema = createMediaSchema(videoMedia);
    expect(schema["@type"]).toBe("VideoObject");
    expect(schema.name).toBe("My Video");
    expect(schema.contentUrl).toBe("vid.mp4");
    expect((schema as any).duration).toBe("PT120S");
    expect((schema as any).thumbnailUrl).toBe("/media/thumb1");
  });

  it("should not expose private media details as public URLs", () => {
    const privateMedia: MediaAsset = {
      id: "media_priv",
      type: "image",
      title: "Private Image",
      status: "active",
      visibility: "private",
      source: "priv.png",
      canonicalUrl: "https://example.com/priv.png",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const schema = createMediaSchema(privateMedia);
    expect(schema.contentUrl).toBeUndefined();
  });
});

