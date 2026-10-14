import { GenerateJsonLdInput } from "./json-ld-generator.js";
import { JsonLdObject } from "../types/json-ld.js";
import { omitUndefined, safeStringifySchemaContent } from "./schema-utils.js";
import { readField } from "../internal/read-field.js";

/**
 * Creates a Schema.org FAQPage JSON-LD object.
 */
export function createFaqSchema(input: GenerateJsonLdInput): JsonLdObject {
  const { object } = input;

  const mainEntity: Record<string, unknown>[] = [];

  const explicitFaq = readField(object, "faqItems") || readField(object, "questions");
  if (Array.isArray(explicitFaq)) {
    for (const item of explicitFaq) {
      if (item && typeof item === "object") {
        mainEntity.push({
          "@type": "Question",
          name: item.question || item.name,
          acceptedAnswer: {
            "@type": "Answer",
            text: safeStringifySchemaContent(item.answer || item.text),
          },
        });
      }
    }
  } else {
    // default question and answer
    mainEntity.push({
      "@type": "Question",
      name: object.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: safeStringifySchemaContent(object.body),
      },
    });
  }

  const base: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return omitUndefined(base) as JsonLdObject;
}
