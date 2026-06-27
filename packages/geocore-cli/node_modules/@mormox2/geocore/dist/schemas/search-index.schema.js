import { z } from "zod";
import { searchDocumentSchema } from "./search-document.schema.js";
export const searchIndexDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
export const searchIndexDiagnosticSchema = z.object({
    id: z.string().min(1),
    severity: searchIndexDiagnosticSeveritySchema,
    code: z.string().min(1),
    message: z.string().min(1),
    documentId: z.string().optional(),
    sourceId: z.string().optional(),
    field: z.string().optional(),
    recommendation: z.string().optional(),
});
export const searchIndexSchema = z.object({
    id: z.string({ required_error: "GC_SEARCH_INDEX_ID_MISSING" }).min(1, "GC_SEARCH_INDEX_ID_MISSING"),
    name: z.string({ required_error: "GC_SEARCH_INDEX_NAME_MISSING" }).min(1, "GC_SEARCH_INDEX_NAME_MISSING"),
    language: z.string().optional(),
    documents: z.array(searchDocumentSchema),
    generatedAt: z.string().min(1),
    diagnostics: z.array(searchIndexDiagnosticSchema),
});
