import { z } from "zod";

export const searchDocumentTypeSchema = z.enum([
  "knowledge-object",
  "entity",
  "collection",
  "glossary-entry",
  "documentation",
  "media",
  "citation",
]);

export const searchDocumentStatusSchema = z.enum(["draft", "review", "published", "archived"]);

export const searchDocumentVisibilitySchema = z.enum(["public", "internal", "private", "hidden"]);

export const searchDocumentSchema = z.object({
  id: z.string({ required_error: "GC_SEARCH_DOCUMENT_ID_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_ID_MISSING"),
  type: searchDocumentTypeSchema,
  sourceId: z.string({ required_error: "GC_SEARCH_DOCUMENT_SOURCE_ID_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_SOURCE_ID_MISSING"),
  sourceType: z.string({ required_error: "GC_SEARCH_DOCUMENT_SOURCE_TYPE_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_SOURCE_TYPE_MISSING"),
  sourceVersion: z.string().optional(),
  title: z.string({ required_error: "GC_SEARCH_DOCUMENT_TITLE_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_TITLE_MISSING"),
  summary: z.string().optional(),
  body: z.string().optional(),
  language: z.string({ required_error: "GC_SEARCH_DOCUMENT_LANGUAGE_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_LANGUAGE_MISSING"),
  status: searchDocumentStatusSchema,
  visibility: searchDocumentVisibilitySchema,
  slug: z.string().optional(),
  canonicalUrl: z.string().optional(),
  entities: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  collections: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  citations: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  media: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  taxonomy: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  keywords: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  aliases: z.array(z.string(), { invalid_type_error: "GC_SEARCH_DOCUMENT_ARRAY_INVALID" }),
  text: z.string({ required_error: "GC_SEARCH_DOCUMENT_TEXT_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_TEXT_MISSING"),
  metadata: z.object({
    author: z.string().optional(),
    reviewer: z.string().optional(),
    owner: z.string().optional(),
    trustLevel: z.string().optional(),
    freshness: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    publishedAt: z.string().optional(),
    reviewedAt: z.string().optional(),
  }),
  generatedAt: z.string({ required_error: "GC_SEARCH_DOCUMENT_GENERATED_AT_MISSING" }).min(1, "GC_SEARCH_DOCUMENT_GENERATED_AT_MISSING"),
});
