import { describe, it, expect } from "vitest";
import { validateRelationships } from "../src/graph/validate-relationships.js";
import { GraphRegistry } from "../src/types/graph.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Parent-Child Cycle Detection Tests", () => {
  it("should fail validation if there is a cycle via parent_of relationships", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object" },
        { id: "ko_b", type: "knowledge-object" },
      ],
      relationships: [
        {
          id: "rel_ab",
          sourceId: "ko_a",
          targetId: "ko_b",
          type: "parent_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_ba",
          sourceId: "ko_b",
          targetId: "ko_a",
          type: "parent_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_PARENT_CYCLE)).toBe(true);
    expect(result.issues.find((i) => i.code === codes.GC_RELATIONSHIP_PARENT_CYCLE)?.severity).toBe("critical");
  });

  it("should fail validation if there is a cycle via child_of relationships", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object" },
        { id: "ko_b", type: "knowledge-object" },
      ],
      relationships: [
        {
          id: "rel_ab",
          sourceId: "ko_a",
          targetId: "ko_b",
          type: "child_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_ba",
          sourceId: "ko_b",
          targetId: "ko_a",
          type: "child_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_PARENT_CYCLE)).toBe(true);
  });

  it("should fail validation if there is a cycle using a combination of parent_of and child_of", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object" },
        { id: "ko_b", type: "knowledge-object" },
      ],
      relationships: [
        {
          id: "rel_ab",
          sourceId: "ko_a",
          targetId: "ko_b",
          type: "parent_of", // ko_a -> ko_b
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_ba",
          sourceId: "ko_a",
          targetId: "ko_b",
          type: "child_of", // ko_b -> ko_a (so parent-to-child is ko_b -> ko_a)
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_PARENT_CYCLE)).toBe(true);
  });

  it("should pass validation for a linear chain of parent-child relationships", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object" },
        { id: "ko_b", type: "knowledge-object" },
        { id: "ko_c", type: "knowledge-object" },
      ],
      relationships: [
        {
          id: "rel_ab",
          sourceId: "ko_a",
          targetId: "ko_b",
          type: "parent_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_bc",
          sourceId: "ko_b",
          targetId: "ko_c",
          type: "parent_of",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});
