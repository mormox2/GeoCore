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
  "classified_as",
  "reviewed_by",
  "supports",
  "verifies",
]);

export const knowledgeRelationshipStrengthSchema = z.enum([
  "weak",
  "medium",
  "strong",
  "canonical",
]);

export const knowledgeRelationshipConfidenceSchema = z.enum([
  "low",
  "medium",
  "high",
]);

export const knowledgeRelationshipSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  type: knowledgeRelationshipTypeSchema,
  strength: knowledgeRelationshipStrengthSchema,
  reason: z.string().optional(),
  confidence: knowledgeRelationshipConfidenceSchema.optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
