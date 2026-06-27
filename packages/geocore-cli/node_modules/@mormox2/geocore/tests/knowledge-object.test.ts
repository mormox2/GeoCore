import { describe, it, expect } from "vitest";
import { validateKnowledgeObject } from "../src/validation/validate-knowledge-object.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";

describe("KnowledgeObject Type and Validation Tests", () => {
  it("should validate a complete and valid KnowledgeObject", () => {
    const validKO: KnowledgeObject = {
      id: "ko_test_id",
      slug: "test-slug",
      title: "Test Title",
      summary: "Test summary description.",
      body: "Test body content.",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_test",
    };
    const result = validateKnowledgeObject(validKO);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});
