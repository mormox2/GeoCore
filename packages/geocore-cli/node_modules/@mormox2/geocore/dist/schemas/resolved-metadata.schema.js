import { z } from "zod";
import { geoCoreMetadataSchema } from "./metadata.schema.js";
export const resolvedMetadataSchema = geoCoreMetadataSchema.extend({
    resolvedAt: z.string().min(1),
    resolvedFrom: z.object({
        object: z.boolean(),
        defaults: z.boolean(),
        graph: z.boolean(),
        collections: z.boolean(),
        entities: z.boolean(),
        citations: z.boolean(),
    }),
    diagnostics: z.array(z.string()).optional(),
});
