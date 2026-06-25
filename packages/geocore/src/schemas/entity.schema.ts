import { z } from "zod";

export const entityStatusSchema = z.enum(["draft", "review", "published", "deprecated"]);

export const entityTypeSchema = z.enum([
  "concept",
  "person",
  "organization",
  "place",
  "product",
  "feature",
  "workflow",
  "medical_concept",
  "dental_concept",
  "business_concept",
  "technical_concept",
  "document_type",
  "unit",
  "metric",
  "condition",
  "treatment",
  "procedure",
  "tool",
  "material",
  "role",
]);

export const knowledgeEntitySchema = z.object({
  id: z.string(),
  type: entityTypeSchema,
  canonicalName: z.string(),
  definition: z.string(),
  language: z.string(),
  status: entityStatusSchema,

  aliases: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
  translations: z.record(
    z.string(),
    z.object({
      canonicalName: z.string(),
      aliases: z.array(z.string()).optional(),
      definition: z.string().optional(),
    })
  ).optional(),

  domain: z.array(z.string()).optional(),
  audience: z.array(z.string()).optional(),

  parentId: z.string().optional(),
  childIds: z.array(z.string()).optional(),
  relatedEntityIds: z.array(z.string()).optional(),

  externalIds: z.record(z.string(), z.string()).optional(),

  citations: z.array(z.string()).optional(),
  media: z.array(z.string()).optional(),

  disambiguation: z.string().optional(),
  usageNotes: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});
