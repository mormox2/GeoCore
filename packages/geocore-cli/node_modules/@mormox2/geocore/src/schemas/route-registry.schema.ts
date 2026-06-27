import { z } from "zod";
import { routeEntrySchema } from "./route-entry.schema.js";

export const routeDiagnosticSeveritySchema = z.enum(["info", "warning", "error", "critical"]);

export const routeDiagnosticSchema = z.object({
  id: z.string().min(1),
  severity: routeDiagnosticSeveritySchema,
  code: z.string().min(1),
  message: z.string().min(1),
  sourceId: z.string().optional(),
  routeId: z.string().optional(),
  path: z.string().optional(),
  field: z.string().optional(),
  recommendation: z.string().optional(),
});

export const routeRegistrySchema = z.object({
  id: z.string({ required_error: "GC_ROUTE_REGISTRY_ID_MISSING" }).min(1, "GC_ROUTE_REGISTRY_ID_MISSING"),
  siteUrl: z.string().optional(),
  routes: z.array(routeEntrySchema, { invalid_type_error: "GC_ROUTE_REGISTRY_ROUTES_INVALID" }),
  generatedAt: z
    .string({ required_error: "GC_ROUTE_REGISTRY_GENERATED_AT_MISSING" })
    .min(1, "GC_ROUTE_REGISTRY_GENERATED_AT_MISSING"),
  diagnostics: z.array(routeDiagnosticSchema, { invalid_type_error: "GC_ROUTE_REGISTRY_DIAGNOSTICS_INVALID" }),
});
