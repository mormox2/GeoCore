import { z } from "zod";

export const jsonLdObjectSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.string().min(1),
}).passthrough();
