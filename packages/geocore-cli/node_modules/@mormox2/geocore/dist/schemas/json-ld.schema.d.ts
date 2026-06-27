import { z } from "zod";
export declare const jsonLdObjectSchema: z.ZodObject<{
    "@context": z.ZodLiteral<"https://schema.org">;
    "@type": z.ZodString;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    "@context": z.ZodLiteral<"https://schema.org">;
    "@type": z.ZodString;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    "@context": z.ZodLiteral<"https://schema.org">;
    "@type": z.ZodString;
}, z.ZodTypeAny, "passthrough">>;
