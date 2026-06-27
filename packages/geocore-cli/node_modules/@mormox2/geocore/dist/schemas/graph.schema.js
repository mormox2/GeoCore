import { z } from "zod";
import { knowledgeRelationshipSchema } from "./relationship.schema.js";
export const graphNodeTypeSchema = z.enum([
    "knowledge-object",
    "entity",
    "author",
    "source",
    "citation",
    "media",
    "collection",
    "taxonomy-term",
    "glossary-entry",
    "external-reference",
]);
export const graphNodeSchema = z.object({
    id: z.string().min(1),
    type: graphNodeTypeSchema,
    label: z.string().optional(),
    data: z.any().optional(),
});
export const graphRegistrySchema = z.object({
    nodes: z.array(graphNodeSchema),
    relationships: z.array(knowledgeRelationshipSchema),
});
