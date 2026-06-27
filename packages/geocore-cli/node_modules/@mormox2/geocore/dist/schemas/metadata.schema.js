import { z } from "zod";
export const knowledgeStatusSchema = z.enum(["draft", "review", "published", "archived"]);
export const metadataConfidenceSchema = z.enum(["low", "medium", "high"]);
export const freshnessLevelSchema = z.enum(["stable", "periodic", "frequent", "live"]);
export const seoMetadataSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    canonicalUrl: z.string().optional(),
    robots: z.string().optional(),
    keywords: z.array(z.string()).optional(),
}).optional();
export const aiMetadataSchema = z.object({
    summaryShort: z.string().optional(),
    summaryMedium: z.string().optional(),
    summaryLong: z.string().optional(),
    canonicalAnswer: z.string().optional(),
    keyTakeaways: z.array(z.string()).optional(),
    confidence: metadataConfidenceSchema.optional(),
    answerableQuestions: z.array(z.string()).optional(),
    freshness: freshnessLevelSchema.optional(),
}).optional();
export const technicalMetadataSchema = z.object({
    sourceFormat: z.string().optional(),
    renderTargets: z.array(z.string()).optional(),
    contentHash: z.string().optional(),
    schemaVersion: z.string().optional(),
    validationStatus: z.string().optional(),
    indexingStatus: z.string().optional(),
}).optional();
export const geoCoreMetadataSchema = z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    language: z.string().min(1),
    version: z.string().min(1),
    status: knowledgeStatusSchema,
    author: z.string().min(1),
    reviewer: z.string().optional(),
    owner: z.string().optional(),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    publishedAt: z.string().optional(),
    reviewedAt: z.string().optional(),
    archivedAt: z.string().optional(),
    canonicalUrl: z.string().optional(),
    entities: z.array(z.string()).optional(),
    topics: z.array(z.string()).optional(),
    domains: z.array(z.string()).optional(),
    audiences: z.array(z.string()).optional(),
    collections: z.array(z.string()).optional(),
    citations: z.array(z.string()).optional(),
    trustLevel: z.string().optional(),
    freshness: freshnessLevelSchema.optional(),
    seo: seoMetadataSchema,
    ai: aiMetadataSchema,
    technical: technicalMetadataSchema,
});
