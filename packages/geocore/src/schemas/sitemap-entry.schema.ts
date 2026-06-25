import { z } from "zod";

export const sitemapChangeFrequencySchema = z.enum([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

export const sitemapVisibilitySchema = z.enum(["public", "internal", "private", "hidden"]);

export const sitemapAlternateLinkSchema = z.object({
  language: z.string().min(1),
  url: z.string().url(),
});

export const sitemapImageSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  caption: z.string().optional(),
});

export const sitemapEntrySchema = z.object({
  id: z.string({ required_error: "GC_SITEMAP_ENTRY_ID_MISSING" }).min(1, "GC_SITEMAP_ENTRY_ID_MISSING"),
  sourceId: z.string({ required_error: "GC_SITEMAP_SOURCE_ID_MISSING" }).min(1, "GC_SITEMAP_SOURCE_ID_MISSING"),
  sourceType: z.string({ required_error: "GC_SITEMAP_SOURCE_TYPE_MISSING" }).min(1, "GC_SITEMAP_SOURCE_TYPE_MISSING"),
  url: z.string({ required_error: "GC_SITEMAP_URL_MISSING" }).url("GC_SITEMAP_URL_INVALID"),
  language: z.string().optional(),
  lastModified: z.string().optional(),
  changeFrequency: sitemapChangeFrequencySchema.optional(),
  priority: z.number().min(0, "GC_SITEMAP_PRIORITY_INVALID").max(1, "GC_SITEMAP_PRIORITY_INVALID").optional(),
  visibility: sitemapVisibilitySchema,
  status: z.string({ required_error: "GC_SITEMAP_STATUS_MISSING" }).min(1, "GC_SITEMAP_STATUS_MISSING"),
  alternates: z.array(sitemapAlternateLinkSchema, { invalid_type_error: "GC_SITEMAP_ALTERNATES_INVALID" }),
  images: z.array(sitemapImageSchema, { invalid_type_error: "GC_SITEMAP_IMAGES_INVALID" }),
  generatedAt: z.string({ required_error: "GC_SITEMAP_GENERATED_AT_MISSING" }).min(1, "GC_SITEMAP_GENERATED_AT_MISSING"),
});
