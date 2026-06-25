import { describe, it, expect } from "vitest";
import { validateJsonLd } from "../src/schema/validate-json-ld.js";
import { SchemaOutput } from "../src/types/schema.js";
import * as codes from "../src/validation/validation-codes.js";

describe("JSON-LD Schema Validation Tests", () => {
  const validOutput: SchemaOutput = {
    id: "schema_knowledge-object_ko_test_article",
    sourceId: "ko_test",
    sourceType: "knowledge-object",
    schemaType: "Article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Valid Article Headline",
      url: "https://example.com/canonical",
    },
    generatedAt: "2026-06-25T11:00:00Z",
    diagnostics: [],
  };

  it("should pass validation for a fully valid SchemaOutput", () => {
    const result = validateJsonLd(validOutput);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if @context is missing or incorrect", () => {
    const invalid = {
      ...validOutput,
      jsonLd: {
        ...validOutput.jsonLd,
        "@context": "http://invalid.org" as any,
      },
    };
    const result = validateJsonLd(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_CONTEXT_MISSING)).toBe(true);
  });

  it("should fail validation if @type is missing", () => {
    const invalid = {
      ...validOutput,
      jsonLd: {
        "@context": "https://schema.org" as any,
      },
    };
    const result = validateJsonLd(invalid as any);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_AT_TYPE_MISSING)).toBe(true);
  });

  it("should fail validation if Article has no headline or name", () => {
    const invalid = {
      ...validOutput,
      jsonLd: {
        "@context": "https://schema.org" as any,
        "@type": "Article",
      },
    };
    const result = validateJsonLd(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_ARTICLE_HEADLINE_MISSING)).toBe(true);
  });

  it("should raise a warning warning but remain valid if canonical URL is missing on Article", () => {
    const invalid = {
      ...validOutput,
      jsonLd: {
        "@context": "https://schema.org" as any,
        "@type": "Article",
        headline: "A headline",
      },
    };
    const result = validateJsonLd(invalid);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_CANONICAL_URL_MISSING)).toBe(true);
  });

  it("should fail validation if FAQPage lacks mainEntity array", () => {
    const invalid = {
      ...validOutput,
      schemaType: "FAQPage",
      jsonLd: {
        "@context": "https://schema.org" as any,
        "@type": "FAQPage",
      },
    };
    const result = validateJsonLd(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_FAQ_MAIN_ENTITY_MISSING)).toBe(true);
  });

  it("should fail validation if DefinedTerm lacks name or description", () => {
    const invalid = {
      ...validOutput,
      schemaType: "DefinedTerm",
      jsonLd: {
        "@context": "https://schema.org" as any,
        "@type": "DefinedTerm",
      },
    };
    const result = validateJsonLd(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_DEFINED_TERM_NAME_MISSING)).toBe(true);
    expect(result.issues.some((i) => i.code === codes.GC_SCHEMA_DEFINED_TERM_DESCRIPTION_MISSING)).toBe(true);
  });
});
