import { describe, it, expect } from "vitest";
import { filterLlmsPublicObjects } from "../src/llms/llms-filter.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";

describe("LLMs Filter Tests", () => {
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

  it("should include published public object and exclude draft/private/internal/hidden objects", () => {
    const input = {
      id: "input_1",
      siteName: "Test Site",
      objects: [pubKO, draftKO, privateKO],
    };
    const result = filterLlmsPublicObjects(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ko_pub");
  });

  it("should filter by language when provided", () => {
    const input = {
      id: "input_2",
      siteName: "Test Site",
      language: "fr",
      objects: [pubKO, frKO],
    };
    const result = filterLlmsPublicObjects(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ko_fr");
  });

  it("should not mutate input objects list", () => {
    const input = {
      id: "input_3",
      siteName: "Test Site",
      objects: [pubKO, frKO],
    };
    const objectsCopy = [...input.objects];
    filterLlmsPublicObjects(input);
    expect(input.objects).toEqual(objectsCopy);
  });
});
