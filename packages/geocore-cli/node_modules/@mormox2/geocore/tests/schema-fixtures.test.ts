import { describe, it, expect } from "vitest";
import { generateJsonLd } from "../src/schema/json-ld-generator.js";
import { validateJsonLd } from "../src/schema/validate-json-ld.js";
import {
  rtimiDentalSchemaInput,
  dawajinProSchemaInput,
} from "../src/fixtures/schema.fixture.js";

describe("Schema Fixture Integration Tests", () => {
  it("should generate and validate RTimi Dental JSON-LD fixture", () => {
    const output = generateJsonLd(rtimiDentalSchemaInput);
    
    // Validate schema output properties
    const validationResult = validateJsonLd(output);
    expect(validationResult.valid).toBe(true);

    expect(output.sourceId).toBe("ko_detartrage_abime_dents");
    expect(output.jsonLd["@context"]).toBe("https://schema.org");
    expect(output.jsonLd["@type"]).toBe("Article");
    expect(output.jsonLd.headline).toBe("Le détartrage abîme-t-il les dents ?");
    expect(output.jsonLd.description).toContain("effets du détartrage sur l'émail");
    
    const author = output.jsonLd.author as any;
    expect(author?.name).toBe("author_dr_mossaab_rtimi");
  });

  it("should generate and validate Dawajin Pro JSON-LD fixture", () => {
    const output = generateJsonLd(dawajinProSchemaInput);

    // Validate schema output properties
    const validationResult = validateJsonLd(output);
    expect(validationResult.valid).toBe(true);

    expect(output.sourceId).toBe("ko_customer_balance_management");
    expect(output.jsonLd["@context"]).toBe("https://schema.org");
    expect(output.jsonLd["@type"]).toBe("Article");
    expect(output.jsonLd.headline).toBe("Gestion des créances clients");
    expect(output.jsonLd.description).toContain("Guide pour comprendre et suivre les soldes clients");
    
    const author = output.jsonLd.author as any;
    expect(author?.name).toBe("author_dawajin_team");
  });
});
