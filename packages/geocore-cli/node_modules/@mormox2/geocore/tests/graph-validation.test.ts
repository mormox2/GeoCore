import { describe, it, expect } from "vitest";
import { validateRelationships } from "../src/graph/validate-relationships.js";
import { GraphRegistry } from "../src/types/graph.js";
import { rtimiDentalGraphRegistry, dawajinProGraphRegistry } from "../src/fixtures/graph.fixture.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Graph Validation Tests", () => {
  it("should pass validation for a valid graph", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object", label: "Object A" },
        { id: "entity_b", type: "entity", label: "Entity B" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_a",
          targetId: "entity_b",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if a relationship references an unknown source node", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "entity_b", type: "entity", label: "Entity B" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_unknown",
          targetId: "entity_b",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_SOURCE_UNKNOWN)).toBe(true);
  });

  it("should fail validation if a relationship references an unknown target node", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object", label: "Object A" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_a",
          targetId: "entity_unknown",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_TARGET_UNKNOWN)).toBe(true);
  });

  it("should fail validation if relationship IDs are duplicated", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object", label: "Object A" },
        { id: "entity_b", type: "entity", label: "Entity B" },
      ],
      relationships: [
        {
          id: "duplicate_id",
          sourceId: "ko_a",
          targetId: "entity_b",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "duplicate_id",
          sourceId: "ko_a",
          targetId: "entity_b",
          type: "mentions",
          strength: "medium",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_ID_DUPLICATE)).toBe(true);
  });

  it("should fail validation if relationship content (source + target + type) is duplicated", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_a", type: "knowledge-object", label: "Object A" },
        { id: "entity_b", type: "entity", label: "Entity B" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_a",
          targetId: "entity_b",
          type: "explains",
          strength: "canonical",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
        {
          id: "rel_2",
          sourceId: "ko_a",
          targetId: "entity_b",
          type: "explains", // same source, target, type
          strength: "weak",
          createdAt: "2026-06-25T10:00:00Z",
          updatedAt: "2026-06-25T10:00:00Z",
        },
      ],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === codes.GC_RELATIONSHIP_DUPLICATE)).toBe(true);
  });

  it("should pass validation for the RTimi Dental graph fixture", () => {
    const result = validateRelationships(rtimiDentalGraphRegistry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should pass validation for the Dawajin Pro graph fixture", () => {
    const result = validateRelationships(dawajinProGraphRegistry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });
});
