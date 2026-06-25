import { describe, it, expect } from "vitest";
import { validateRelationships } from "../src/graph/validate-relationships.js";
import { GraphRegistry } from "../src/types/graph.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Orphan Detection Tests", () => {
  it("should warn for knowledge objects without relationships but remain valid", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_orphan", type: "knowledge-object", label: "Orphan KO" },
        { id: "entity_other", type: "entity", label: "Other Entity" },
      ],
      relationships: [],
    };

    const result = validateRelationships(registry);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    
    // We expect a warning for ko_orphan
    expect(result.issues).toHaveLength(1);
    const issue = result.issues[0];
    expect(issue.code).toBe(codes.GC_GRAPH_ORPHAN_OBJECT);
    expect(issue.severity).toBe("warning");
    expect(issue.objectId).toBe("ko_orphan");
  });

  it("should not warn if knowledge object is connected", () => {
    const registry: GraphRegistry = {
      nodes: [
        { id: "ko_connected", type: "knowledge-object", label: "Connected KO" },
        { id: "entity_other", type: "entity", label: "Other Entity" },
      ],
      relationships: [
        {
          id: "rel_1",
          sourceId: "ko_connected",
          targetId: "entity_other",
          type: "mentions",
          strength: "medium",
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
});
