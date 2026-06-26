import { z } from "zod";
import { validationPipelineStageIdSchema } from "./validation-stage.schema.js";
import { validationPipelineModeSchema } from "./validation-report.schema.js";

export const validationPipelineConfigSchema = z.object({
  mode: validationPipelineModeSchema.optional(),
  stages: z.record(validationPipelineStageIdSchema, z.boolean()).optional(),
  requiredStages: z.array(validationPipelineStageIdSchema).optional(),
  failFast: z.boolean().optional(),
  language: z.string().optional(),
  siteName: z.string().optional(),
  siteUrl: z.string().optional(),
});
