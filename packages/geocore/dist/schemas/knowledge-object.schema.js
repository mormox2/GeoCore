import { z } from "zod";
import { knowledgeStatusSchema } from "./metadata.schema.js";
export const knowledgeObjectSchema = z.object({
    id: z.string({ required_error: "GC_ID_MISSING" }).min(1, "GC_ID_MISSING"),
    slug: z.string({ required_error: "GC_SLUG_MISSING" }).min(1, "GC_SLUG_MISSING"),
    title: z.string({ required_error: "GC_TITLE_MISSING" }).min(1, "GC_TITLE_MISSING"),
    summary: z.string({ required_error: "GC_SUMMARY_MISSING" }).min(1, "GC_SUMMARY_MISSING"),
    body: z.string({ required_error: "GC_BODY_MISSING" }).min(1, "GC_BODY_MISSING"),
    language: z.string({ required_error: "GC_LANGUAGE_MISSING" }).min(1, "GC_LANGUAGE_MISSING"),
    status: knowledgeStatusSchema,
    version: z.string({ required_error: "GC_VERSION_MISSING" }).min(1, "GC_VERSION_MISSING"),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    author: z.string({ required_error: "GC_AUTHOR_MISSING" }).min(1, "GC_AUTHOR_MISSING"),
    // Optional Properties
    aliases: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    media: z.array(z.string()).optional(),
    citations: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),
    glossaryReferences: z.array(z.string()).optional(),
    externalResources: z.array(z.string()).optional(),
    translations: z.record(z.string(), z.string()).optional(),
    relatedObjects: z.array(z.string()).optional(),
});
