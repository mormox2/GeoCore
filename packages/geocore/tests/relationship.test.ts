import { describe, it, expect } from "vitest";
import { knowledgeRelationshipSchema } from "../src/schemas/relationship.schema.js";

describe("Relationship Schema Tests", () => {
  it("should validate a complete and valid relationship", () => {
    const validRel = {
      id: "rel_1",
      sourceId: "ko_a",
      targetId: "ko_b",
      type: "explains",
      strength: "canonical",
      confidence: "high",
      reason: "Explains everything",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(validRel);
    expect(parsed.success).toBe(true);
  });

  it("should fail if id is missing or empty", () => {
    const invalidRel = {
      sourceId: "ko_a",
      targetId: "ko_b",
      type: "explains",
      strength: "canonical",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(invalidRel);
    expect(parsed.success).toBe(false);

    const emptyRel = {
      id: "",
      sourceId: "ko_a",
      targetId: "ko_b",
      type: "explains",
      strength: "canonical",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsedEmpty = knowledgeRelationshipSchema.safeParse(emptyRel);
    expect(parsedEmpty.success).toBe(false);
  });

  it("should fail if sourceId is missing or empty", () => {
    const invalidRel = {
      id: "rel_1",
      targetId: "ko_b",
      type: "explains",
      strength: "canonical",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(invalidRel);
    expect(parsed.success).toBe(false);
  });

  it("should fail if targetId is missing or empty", () => {
    const invalidRel = {
      id: "rel_1",
      sourceId: "ko_a",
      type: "explains",
      strength: "canonical",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(invalidRel);
    expect(parsed.success).toBe(false);
  });

  it("should fail if relationship type is invalid", () => {
    const invalidRel = {
      id: "rel_1",
      sourceId: "ko_a",
      targetId: "ko_b",
      type: "invalid_type_here",
      strength: "canonical",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(invalidRel);
    expect(parsed.success).toBe(false);
  });

  it("should fail if relationship strength is invalid", () => {
    const invalidRel = {
      id: "rel_1",
      sourceId: "ko_a",
      targetId: "ko_b",
      type: "explains",
      strength: "super_strong",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeRelationshipSchema.safeParse(invalidRel);
    expect(parsed.success).toBe(false);
  });
});
