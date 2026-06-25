import { describe, it, expect } from "vitest";
import { createFaqSchema } from "../src/schema/faq-schema.js";
import { KnowledgeObject } from "../src/types/knowledge-object.js";

describe("FAQ Schema Tests", () => {
  const baseKO: KnowledgeObject = {
    id: "ko_faq",
    slug: "faq-slug",
    title: "FAQ Title",
    summary: "FAQ summary",
    body: "This is the answer body.",
    language: "en",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_test",
  };

  it("should fall back to title as question and body as answer when no explicit faq items exist", () => {
    const schema = createFaqSchema({ object: baseKO });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "FAQ Title",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This is the answer body.",
      },
    });
  });

  it("should safely stringify object bodies", () => {
    const objectBodyKO = {
      ...baseKO,
      body: { details: "complex answer content" },
    };
    const schema = createFaqSchema({ object: objectBodyKO as any });
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(JSON.stringify({ details: "complex answer content" }));
  });

  it("should map explicit FAQ items when available", () => {
    const explicitKO = {
      ...baseKO,
      faqItems: [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: { text: "A2" } },
      ],
    };

    const schema = createFaqSchema({ object: explicitKO as any });
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q1",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A1",
      },
    });
    expect(schema.mainEntity[1]).toEqual({
      "@type": "Question",
      name: "Q2",
      acceptedAnswer: {
        "@type": "Answer",
        text: JSON.stringify({ text: "A2" }),
      },
    });
  });
});
