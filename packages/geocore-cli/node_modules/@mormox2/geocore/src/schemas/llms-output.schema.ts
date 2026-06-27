import { z } from "zod";
import { llmsDiagnosticSchema } from "./llms-diagnostic.schema.js";

export const llmsOutputTypeSchema = z.enum(["llms.txt", "llms-full.txt"]);

export const llmsOutputSchema = z.object({
  id: z.string({ required_error: "GC_LLMS_OUTPUT_ID_MISSING" }).min(1, "GC_LLMS_OUTPUT_ID_MISSING"),
  type: llmsOutputTypeSchema,
  siteName: z.string({ required_error: "GC_LLMS_SITE_NAME_MISSING" }).min(1, "GC_LLMS_SITE_NAME_MISSING"),
  language: z.string().optional(),
  content: z.string({ required_error: "GC_LLMS_CONTENT_MISSING" }).min(1, "GC_LLMS_CONTENT_MISSING"),
  sourceObjectIds: z.array(z.string(), { invalid_type_error: "GC_LLMS_SOURCE_OBJECT_IDS_INVALID" }),
  generatedAt: z.string({ required_error: "GC_LLMS_GENERATED_AT_MISSING" }).min(1, "GC_LLMS_GENERATED_AT_MISSING"),
  diagnostics: z.array(llmsDiagnosticSchema, { invalid_type_error: "GC_LLMS_DIAGNOSTICS_INVALID" }),
});
