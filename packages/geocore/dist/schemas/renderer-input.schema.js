import { z } from "zod";
import { resolvedMetadataSchema } from "./resolved-metadata.schema.js";
export const rendererInputSchema = z.object({
    objectId: z.string().min(1),
    objectVersion: z.string().min(1),
    viewId: z.string().optional(),
    viewType: z.string().optional(),
    language: z.string().min(1),
    content: z.union([z.string(), z.record(z.any())]),
    metadata: resolvedMetadataSchema,
    relationships: z.array(z.any()).optional(),
    entities: z.array(z.any()).optional(),
    citations: z.array(z.any()).optional(),
    collections: z.array(z.any()).optional(),
    media: z.array(z.any()).optional(),
    options: z.record(z.any()).optional(),
});
