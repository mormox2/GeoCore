import { z } from "zod";
import {
  validationPipelineStageResultSchema,
  validationIssueSchema,
} from "./validation-stage.schema.js";

export const validationPipelineModeSchema = z.enum(["public", "internal"]);

export const validationPipelineReportSchema = z.object({
  id: z.string().min(1),
  mode: validationPipelineModeSchema,
  valid: z.boolean(),
  publishable: z.boolean(),
  startedAt: z.string().min(1),
  finishedAt: z.string().min(1),
  stages: z.array(validationPipelineStageResultSchema),
  issues: z.array(validationIssueSchema),
  summary: z.object({
    stagesTotal: z.number().int().nonnegative(),
    stagesPassed: z.number().int().nonnegative(),
    stagesWarning: z.number().int().nonnegative(),
    stagesFailed: z.number().int().nonnegative(),
    stagesSkipped: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
    warnings: z.number().int().nonnegative(),
    errors: z.number().int().nonnegative(),
    critical: z.number().int().nonnegative(),
  }),
});
