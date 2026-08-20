import { z } from "zod";
// ─── Source Enums ────────────────────────────────────────────────────────────
export const sourceStatusSchema = z.enum(["draft", "active", "deprecated", "archived"]);
export const sourceTypeSchema = z.enum([
    "research-paper",
    "clinical-guideline",
    "book",
    "official-documentation",
    "official-website",
    "technical-documentation",
    "product-documentation",
    "internal-document",
    "regulatory-source",
    "news-source",
    "dataset",
    "standard",
    "manual",
    "expert-review",
    "professional-review",
    "user-provided-source",
]);
export const sourceTrustLevelSchema = z.enum([
    "unknown",
    "low",
    "medium",
    "high",
    "authoritative",
]);
// ─── Source Schema ────────────────────────────────────────────────────────────
export const knowledgeSourceSchema = z.object({
    id: z
        .string({ required_error: "GC_CITATION_SOURCE_ID_MISSING" })
        .min(1, "GC_CITATION_SOURCE_ID_MISSING"),
    type: sourceTypeSchema,
    title: z
        .string({ required_error: "GC_CITATION_SOURCE_TITLE_MISSING" })
        .min(1, "GC_CITATION_SOURCE_TITLE_MISSING"),
    status: sourceStatusSchema,
    authors: z.array(z.string()).optional(),
    publisher: z.string().optional(),
    url: z.string().optional(),
    doi: z.string().optional(),
    isbn: z.string().optional(),
    publicationDate: z.string().optional(),
    accessedAt: z.string().optional(),
    language: z.string().optional(),
    version: z.string().optional(),
    summary: z.string().optional(),
    trustLevel: sourceTrustLevelSchema.optional(),
    freshness: z
        .enum(["stable", "periodic", "time-sensitive", "outdated"])
        .optional(),
    visibility: z.enum(["public", "internal", "private"]).optional(),
    createdAt: z
        .string({ required_error: "GC_CITATION_SOURCE_CREATED_AT_MISSING" })
        .min(1, "GC_CITATION_SOURCE_CREATED_AT_MISSING"),
    updatedAt: z
        .string({ required_error: "GC_CITATION_SOURCE_UPDATED_AT_MISSING" })
        .min(1, "GC_CITATION_SOURCE_UPDATED_AT_MISSING"),
});
// ─── Citation Enums ───────────────────────────────────────────────────────────
export const citationStatusSchema = z.enum(["draft", "active", "deprecated", "removed"]);
export const citationPurposeSchema = z.enum([
    "supports",
    "explains",
    "defines",
    "contrasts",
    "updates",
    "corrects",
    "reviews",
    "verifies",
    "credits",
    "references",
]);
export const citationConfidenceSchema = z.enum(["low", "medium", "high", "authoritative"]);
// ─── Citation Schema ──────────────────────────────────────────────────────────
export const knowledgeCitationSchema = z.object({
    id: z
        .string({ required_error: "GC_CITATION_ID_MISSING" })
        .min(1, "GC_CITATION_ID_MISSING"),
    sourceId: z
        .string({ required_error: "GC_CITATION_SOURCE_ID_MISSING" })
        .min(1, "GC_CITATION_SOURCE_ID_MISSING"),
    targetId: z
        .string({ required_error: "GC_CITATION_TARGET_ID_MISSING" })
        .min(1, "GC_CITATION_TARGET_ID_MISSING"),
    claimId: z.string().optional(),
    purpose: citationPurposeSchema,
    status: citationStatusSchema,
    quote: z.string().optional(),
    paraphrase: z.string().optional(),
    page: z.string().optional(),
    section: z.string().optional(),
    url: z.string().optional(),
    confidence: citationConfidenceSchema.optional(),
    relevance: z.enum(["low", "medium", "high"]).optional(),
    addedBy: z.string().optional(),
    reviewedBy: z.string().optional(),
    reviewedAt: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z
        .string({ required_error: "GC_CITATION_CREATED_AT_MISSING" })
        .min(1, "GC_CITATION_CREATED_AT_MISSING"),
    updatedAt: z
        .string({ required_error: "GC_CITATION_UPDATED_AT_MISSING" })
        .min(1, "GC_CITATION_UPDATED_AT_MISSING"),
});
