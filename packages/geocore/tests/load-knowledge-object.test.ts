import { describe, it, expect } from "vitest";
import { loadKnowledgeObject } from "../src/loader/load-knowledge-object.js";

describe("Load Knowledge Object Tests", () => {
  it("loads valid object input", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body text",
        language: "en",
        author: "author_test",
        status: "published",
        version: "1.2.3",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    };

    const { object, diagnostics } = loadKnowledgeObject(raw);
    expect(diagnostics).toHaveLength(0);
    expect(object).toBeDefined();
    expect(object!.id).toBe("ko_test");
    expect(object!.version).toBe("1.2.3");
  });

  it("defaults missing status to draft", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
      },
    };
    const { object } = loadKnowledgeObject(raw);
    expect(object!.status).toBe("draft");
  });

  it("defaults missing version to 1.0.0", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
      },
    };
    const { object } = loadKnowledgeObject(raw);
    expect(object!.version).toBe("1.0.0");
  });

  it("defaults missing dates", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
      },
    };
    const { object } = loadKnowledgeObject(raw);
    expect(object!.createdAt).toBeDefined();
    expect(object!.updatedAt).toBeDefined();
  });

  it("missing ID produces error", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
      },
    };
    const { object, diagnostics } = loadKnowledgeObject(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_OBJECT_MISSING_ID")).toBe(true);
  });

  it("missing title produces error", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
      },
    };
    const { object, diagnostics } = loadKnowledgeObject(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_OBJECT_MISSING_TITLE")).toBe(true);
  });

  it("missing body produces error", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        language: "en",
        author: "author_test",
      },
    };
    const { object, diagnostics } = loadKnowledgeObject(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_OBJECT_MISSING_BODY")).toBe(true);
  });

  it("invalid content type produces error", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: "not-an-object",
    };
    const { object, diagnostics } = loadKnowledgeObject(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_INPUT_CONTENT_INVALID")).toBe(true);
  });

  it("preserves custom metadata", () => {
    const raw = {
      type: "knowledge-object" as const,
      content: {
        id: "ko_test",
        slug: "test-slug",
        title: "Test",
        summary: "Summary",
        body: "Body",
        language: "en",
        author: "author_test",
        metadata: {
          entities: ["entity_one"],
          customField: "customVal",
        },
      },
    };
    const { object } = loadKnowledgeObject(raw);
    expect(object!.metadata).toBeDefined();
    expect(object!.metadata!.entities).toEqual(["entity_one"]);
    expect((object!.metadata as any).customField).toBe("customVal");
  });

  it("warns when timestamps are missing instead of silently using the load time", () => {
    const { object, diagnostics } = loadKnowledgeObject({
      type: "knowledge-object" as const,
      content: {
        id: "ko_no_dates",
        slug: "no-dates",
        title: "T",
        summary: "S",
        body: "B",
        language: "fr",
        author: "a",
        status: "published",
        version: "1.0.0",
      },
    });
    expect(object).toBeDefined();
    expect(diagnostics.map((d) => [d.severity, d.code])).toEqual([["warning", "GC_LOADER_TIMESTAMP_DEFAULTED"]]);
  });
});
