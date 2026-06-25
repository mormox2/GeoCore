import { describe, it, expect } from "vitest";
import { createDefinedTermSchema } from "../src/schema/defined-term-schema.js";
import { GlossaryEntry } from "../src/types/glossary.js";

describe("DefinedTerm Schema Tests", () => {
  const baseGlossary: GlossaryEntry = {
    id: "glossary_1",
    term: "Term Name",
    slug: "term-name",
    definition: "Detailed term definition.",
    language: "en",
    audience: "patient",
    status: "published",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  };

  it("should create DefinedTerm JSON-LD with valid mapping properties", () => {
    const schema = createDefinedTermSchema({ glossary: baseGlossary });
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("DefinedTerm");
    expect(schema.name).toBe("Term Name");
    expect(schema.description).toBe("Detailed term definition.");
    expect(schema.termCode).toBe("glossary_1");
  });

  it("should include entity ID as identifier and sameAs when available", () => {
    const glossaryWithEntity = {
      ...baseGlossary,
      entityId: "entity_term",
    };
    const schema = createDefinedTermSchema({ glossary: glossaryWithEntity });
    expect(schema.identifier).toBe("entity_term");
    expect(schema.sameAs).toBe("entity:entity_term");
  });
});
