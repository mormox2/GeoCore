import { z } from "zod";

export const validationPipelineStageIdSchema = z.enum([
  "dataset",
  "knowledge-objects",
  "relationships",
  "metadata",
  "routes",
  "search",
  "schema",
  "llms",
  "sitemap",
  "static-export",
]);

export const validationPipelineStageStatusSchema = z.enum([
  "pending",
  "passed",
  "warning",
  "failed",
  "skipped",
]);

export const validationSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
  "critical",
]);

export const validationIssueSchema = z.object({
  id: z.string().min(1),
  severity: validationSeveritySchema,
  code: z.string().min(1),
  message: z.string().min(1),
  objectId: z.string().optional(),
  field: z.string().optional(),
  recommendation: z.string().optional(),
});

export const validationPipelineStageResultSchema = z.object({
  id: validationPipelineStageIdSchema,
  status: validationPipelineStageStatusSchema,
  valid: z.boolean(),
  publishable: z.boolean(),
  startedAt: z.string().min(1),
  finishedAt: z.string().min(1),
  issues: z.array(validationIssueSchema),
  summary: z.object({
    info: z.number().int().nonnegative(),
    warnings: z.number().int().nonnegative(),
    errors: z.number().int().nonnegative(),
    critical: z.number().int().nonnegative(),
  }),
});
