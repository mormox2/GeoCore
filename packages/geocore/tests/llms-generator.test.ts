import { describe, it, expect } from "vitest";
import { generateLlmsTxt } from "../src/llms/llms-generator.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";
import { ResolvedMetadata } from "../src/types/metadata.js";

describe("Compact llms.txt Generation Tests", () => {
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
    {
      id: "ko_no_url",
      slug: "ko-no-url",
      title: "Title No URL",
      summary: "Summary two",
      body: "Body content two.",
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
    },
  };

  it("should generate llms.txt envelope and format sections correctly", () => {
    const output = generateLlmsTxt({
      id: "llms_gen",
      siteName: "My Repository",
      siteDescription: "Overview of repository.",
      siteUrl: "https://example.com",
      objects,
      metadata,
    });

    expect(output.type).toBe("llms.txt");
    expect(output.siteName).toBe("My Repository");
    expect(output.sourceObjectIds).toEqual(["ko_1", "ko_no_url"]);
    
    expect(output.content).toContain("# My Repository");
    expect(output.content).toContain("Overview of repository.");
    expect(output.content).toContain("Website: https://example.com");
    
    // Markdown link with canonical url
    expect(output.content).toContain("- [Title One](https://example.com/ko-1) — Summary One");
    // Plain title when canonical URL is missing
    expect(output.content).toContain("- Title No URL — Summary two");

    // Important Entities
    expect(output.content).toContain("## Important Entities");
    expect(output.content).toContain("- entity_x");

    // Body content must not be included
    expect(output.content).not.toContain("Body content one.");
  });
});
