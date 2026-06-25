import { describe, it, expect } from "vitest";
import { generateLlmsFullTxt } from "../src/llms/llms-full-generator.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";

describe("Expanded llms-full.txt Generation Tests", () => {
  const objects: KnowledgeObject[] = [
    {
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
    },
  ];

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
      entities: ["entity_x"],
      collections: ["collection_a"],
    },
  };

  it("should generate llms-full.txt and include full content/meta details", () => {
    const output = generateLlmsFullTxt({
      id: "llms_full_gen",
      siteName: "My Repository",
      siteDescription: "Overview of repository.",
      siteUrl: "https://example.com",
      objects,
      metadata,
    });

    expect(output.type).toBe("llms-full.txt");
    expect(output.content).toContain("# My Repository — Full Knowledge Context");
    expect(output.content).toContain("## Document: Title One");
    expect(output.content).toContain("ID: ko_1");
    expect(output.content).toContain("Language: en");
    expect(output.content).toContain("Version: 1.0.0");
    expect(output.content).toContain("Author: author_1");
    expect(output.content).toContain("Canonical URL: https://example.com/ko-1");
    expect(output.content).toContain("Summary:\nSummary One");
    expect(output.content).toContain("Content:\nBody content one.");
    expect(output.content).toContain("Entities:\n- entity_x");
    expect(output.content).toContain("Collections:\n- collection_a");
  });
});
