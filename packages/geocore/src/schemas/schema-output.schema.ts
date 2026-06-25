import { z } from "zod";
import { jsonLdObjectSchema } from "./json-ld.schema.js";

export const schemaDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);

export const schemaDiagnosticSchema = z.object({
  id: z.string().min(1),
  severity: schemaDiagnosticSeveritySchema,
  code: z.string().min(1),
  message: z.string().min(1),
  sourceId: z.string().optional(),
  schemaType: z.string().optional(),
  field: z.string().optional(),
  recommendation: z.string().optional(),
});

export const schemaOutputSchema = z.object({
  id: z.string({ required_error: "GC_SCHEMA_OUTPUT_ID_MISSING" }).min(1, "GC_SCHEMA_OUTPUT_ID_MISSING"),
  sourceId: z.string({ required_error: "GC_SCHEMA_SOURCE_ID_MISSING" }).min(1, "GC_SCHEMA_SOURCE_ID_MISSING"),
  sourceType: z.string({ required_error: "GC_SCHEMA_SOURCE_TYPE_MISSING" }).min(1, "GC_SCHEMA_SOURCE_TYPE_MISSING"),
  schemaType: z.string({ required_error: "GC_SCHEMA_TYPE_MISSING" }).min(1, "GC_SCHEMA_TYPE_MISSING"),
  jsonLd: jsonLdObjectSchema,
  generatedAt: z.string({ required_error: "GC_SCHEMA_GENERATED_AT_MISSING" }).min(1, "GC_SCHEMA_GENERATED_AT_MISSING"),
  diagnostics: z.array(schemaDiagnosticSchema, { invalid_type_error: "GC_SCHEMA_DIAGNOSTICS_INVALID" }),
});
