import { z } from "zod";
import { rendererDiagnosticSchema } from "./renderer-diagnostic.schema.js";

export const rendererFormatSchema = z.enum([
  "html",
  "markdown",
  "json",
  "json-ld",
  "xml",
  "rss",
  "pdf",
  "llm",
  "search",
  "api",
  "text",
]);

export const rendererOutputSchema = z.object({
  rendererId: z.string().min(1),
  format: rendererFormatSchema,
  content: z.union([z.string(), z.record(z.any())]),
  metadata: z.object({
    generatedAt: z.string().min(1),
    sourceObjectId: z.string().min(1),
    sourceObjectVersion: z.string().min(1),
    language: z.string().min(1),
  }),
  diagnostics: z.array(rendererDiagnosticSchema),
});
