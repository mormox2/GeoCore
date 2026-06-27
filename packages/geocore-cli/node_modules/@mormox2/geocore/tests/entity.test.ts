import { describe, it, expect } from "vitest";
import { knowledgeEntitySchema } from "../src/schemas/entity.schema.js";
import { KnowledgeEntity } from "../src/types/entity.js";

describe("Entity Type and Schema Tests", () => {
  it("should validate a complete and valid KnowledgeEntity", () => {
    const validEntity: KnowledgeEntity = {
      id: "entity_scaling",
      type: "dental_concept",
      canonicalName: "Détartrage",
      definition: "Procedure that removes tartar.",
      language: "fr",
      status: "published",
      aliases: ["nettoyage dentaire"],
      domain: ["dentistry"],
      audience: ["patient"],
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
    };
    const parsed = knowledgeEntitySchema.safeParse(validEntity);
    expect(parsed.success).toBe(true);
  });
});
