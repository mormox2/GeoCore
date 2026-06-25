import { describe, it, expect } from "vitest";
import { validateKnowledgeObject } from "../src/validation/validate-knowledge-object.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";
import { dawajinproFixture } from "../src/fixtures/dawajinpro.fixture.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Validation Tests", () => {
  it("should pass validation for a valid KnowledgeObject", () => {
    const validKO = {
      id: "ko_valid_id",
      slug: "valid-slug",
      title: "Valid Title",
      summary: "Valid summary.",
      body: "Valid body.",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_valid",
    };
    const result = validateKnowledgeObject(validKO);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if id is missing", () => {
    const invalidKO = {
      slug: "valid-slug",
      title: "Valid Title",
      summary: "Valid summary.",
      body: "Valid body.",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_valid",
    } as any;
    const result = validateKnowledgeObject(invalidKO);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some(issue => issue.code === codes.GC_ID_MISSING)).toBe(true);
  });

  it("should fail validation if title is missing", () => {
    const invalidKO = {
      id: "ko_valid_id",
      slug: "valid-slug",
      summary: "Valid summary.",
      body: "Valid body.",
      language: "en",
      status: "published",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_valid",
    } as any;
    const result = validateKnowledgeObject(invalidKO);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some(issue => issue.code === codes.GC_TITLE_MISSING)).toBe(true);
  });

  it("should fail validation if status is invalid", () => {
    const invalidKO = {
      id: "ko_valid_id",
      slug: "valid-slug",
      title: "Valid Title",
      summary: "Valid summary.",
      body: "Valid body.",
      language: "en",
      status: "invalid-status-value",
      version: "1.0.0",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      author: "author_valid",
    } as any;
    const result = validateKnowledgeObject(invalidKO);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some(issue => issue.code === codes.GC_STATUS_INVALID)).toBe(true);
  });

  it("should pass validation for the RTimi Dental fixture", () => {
    const result = validateKnowledgeObject(rtimidentalFixture);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should pass validation for the Dawajin Pro fixture", () => {
    const result = validateKnowledgeObject(dawajinproFixture);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});
