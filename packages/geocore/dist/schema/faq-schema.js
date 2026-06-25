import { omitUndefined, safeStringifySchemaContent } from "./schema-utils.js";
/**
 * Creates a Schema.org FAQPage JSON-LD object.
 */
export function createFaqSchema(input) {
    const { object } = input;
    const mainEntity = [];
    const explicitFaq = object.faqItems || object.questions;
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
    }
    else {
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
    const base = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity,
    };
    return omitUndefined(base);
}
