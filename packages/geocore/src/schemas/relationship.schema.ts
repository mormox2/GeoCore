import { z } from "zod";

export const knowledgeRelationshipTypeSchema = z.enum([
  "related_to",
  "parent_of",
  "child_of",
  "part_of",
  "requires",
  "explains",
  "cites",
  "authored_by",
  "mentions",
  "uses_media",
  "translation_of",
  "alternative_to",
  "contrasts_with",
  "example_of",
]);

export const knowledgeRelationshipStrengthSchema = z.enum([
  "weak",
  "medium",
  "strong",
  "canonical",
]);

export const knowledgeRelationshipSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  type: knowledgeRelationshipTypeSchema,
  strength: knowledgeRelationshipStrengthSchema,
  reason: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
