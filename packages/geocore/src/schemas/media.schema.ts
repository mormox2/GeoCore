import { z } from "zod";

// ─── Media Enums ──────────────────────────────────────────────────────────────

export const mediaStatusSchema = z.enum(["draft", "active", "deprecated", "archived"]);

export const mediaVisibilitySchema = z.enum(["public", "internal", "private", "hidden"]);

export const mediaTypeSchema = z.enum([
  "image",
  "video",
  "audio",
  "diagram",
  "screenshot",
  "infographic",
  "pdf",
  "document",
  "thumbnail",
  "transcript",
  "subtitle",
  "presentation",
  "download",
  "source-file",
]);

export const consentStatusSchema = z.enum([
  "not-required",
  "required",
  "granted",
  "denied",
  "unknown",
]);

// ─── Media Schema ─────────────────────────────────────────────────────────────

export const mediaAssetFullSchema = z.object({
  id: z
    .string({ required_error: "GC_MEDIA_ID_MISSING" })
    .min(1, "GC_MEDIA_ID_MISSING"),
  type: mediaTypeSchema,
  title: z
    .string({ required_error: "GC_MEDIA_TITLE_MISSING" })
    .min(1, "GC_MEDIA_TITLE_MISSING"),
  status: mediaStatusSchema,
  visibility: mediaVisibilitySchema,

  source: z
    .string({ required_error: "GC_MEDIA_SOURCE_MISSING" })
    .min(1, "GC_MEDIA_SOURCE_MISSING"),
  canonicalUrl: z.string().optional(),

  description: z.string().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  language: z.string().optional(),

  fileName: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().positive().optional(),

  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  duration: z.number().positive().optional(),

  thumbnailId: z.string().optional(),
  transcriptId: z.string().optional(),
  subtitleIds: z.array(z.string()).optional(),

  author: z.string().optional(),
  creator: z.string().optional(),
  owner: z.string().optional(),

  license: z.string().optional(),
  copyright: z.string().optional(),
  credit: z.string().optional(),

  relatedObjectIds: z.array(z.string()).optional(),
  relatedEntityIds: z.array(z.string()).optional(),
  citationIds: z.array(z.string()).optional(),

  consentStatus: consentStatusSchema.optional(),
  privacyLevel: z.enum(["public", "sensitive", "confidential"]).optional(),

  createdAt: z
    .string({ required_error: "GC_MEDIA_CREATED_AT_MISSING" })
    .min(1, "GC_MEDIA_CREATED_AT_MISSING"),
  updatedAt: z
    .string({ required_error: "GC_MEDIA_UPDATED_AT_MISSING" })
    .min(1, "GC_MEDIA_UPDATED_AT_MISSING"),
});
