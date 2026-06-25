import { z } from "zod";

export const rendererDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);

export const rendererDiagnosticSchema = z.object({
  id: z.string().min(1),
  severity: rendererDiagnosticSeveritySchema,
  code: z.string().min(1),
  message: z.string().min(1),
  objectId: z.string().optional(),
  rendererId: z.string().optional(),
  field: z.string().optional(),
  recommendation: z.string().optional(),
});
