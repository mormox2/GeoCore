import { z } from "zod";
import { knowledgeObjectSchema } from "./knowledge-object.schema.js";
import { knowledgeEntitySchema } from "./entity.schema.js";
import { knowledgeRelationshipSchema } from "./relationship.schema.js";
import { loaderDiagnosticSchema } from "./loader-diagnostic.schema.js";
export const rawKnowledgeInputTypeSchema = z.enum([
    "knowledge-object",
    "markdown",
    "entity",
    "collection",
    "taxonomy-term",
    "glossary-entry",
    "citation",
    "source",
    "media",
]);
export const rawKnowledgeInputSchema = z.object({
    id: z.string().optional(),
    type: rawKnowledgeInputTypeSchema,
    sourcePath: z.string().optional(),
    content: z.unknown(),
});
export const collectionItemSchema = z.object({
    objectId: z.string().min(1),
    order: z.number().optional(),
    section: z.string().optional(),
    required: z.boolean().optional(),
    label: z.string().optional(),
    description: z.string().optional(),
});
export const collectionSchema = z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    type: z.string().min(1),
    language: z.string().min(1),
    status: z.string().min(1),
    version: z.string().min(1),
    items: z.array(collectionItemSchema),
});
export const taxonomyTermSchema = z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    slug: z.string().min(1),
    label: z.union([z.string().min(1), z.record(z.string())]),
    description: z.union([z.string().min(1), z.record(z.string())]),
    status: z.string().min(1),
});
export const glossaryEntrySchema = z.object({
    id: z.string().min(1),
    term: z.string().min(1),
    slug: z.string().min(1),
    definition: z.string().min(1),
    language: z.string().min(1),
    status: z.string().min(1),
    audience: z.string().min(1),
});
export const sourceSchema = z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    title: z.string().min(1),
    status: z.string().min(1),
});
export const citationSchema = z.object({
    id: z.string().min(1),
    sourceId: z.string().min(1),
    targetId: z.string().min(1),
    purpose: z.string().min(1),
    status: z.string().min(1),
});
export const mediaAssetSchema = z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    title: z.string().min(1),
    status: z.string().min(1),
    source: z.string().min(1),
    visibility: z.string().min(1),
});
export const knowledgeDatasetSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    objects: z.array(knowledgeObjectSchema),
    entities: z.array(knowledgeEntitySchema),
    relationships: z.array(knowledgeRelationshipSchema),
    collections: z.array(collectionSchema),
    taxonomyTerms: z.array(taxonomyTermSchema),
    glossaryEntries: z.array(glossaryEntrySchema),
    sources: z.array(sourceSchema),
    citations: z.array(citationSchema),
    media: z.array(mediaAssetSchema),
    loadedAt: z.string().min(1),
    diagnostics: z.array(loaderDiagnosticSchema),
});
