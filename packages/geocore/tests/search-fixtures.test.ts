import { describe, it, expect } from "vitest";
import { createSearchDocumentFromKnowledgeObject } from "../src/search/search-document.js";
import { validateSearchDocument } from "../src/search/validate-search-document.js";
import {
  rtimiDentalSearchDocumentInput,
  dawajinProSearchDocumentInput,
} from "../src/fixtures/search.fixture.js";

describe("Search Fixture Integration Tests", () => {
  it("should validate RTimi Dental SearchDocument and verify its expected properties", () => {
    const doc = createSearchDocumentFromKnowledgeObject(rtimiDentalSearchDocumentInput);
    
    // Validate document schema and business logic
    const validationResult = validateSearchDocument(doc);
    expect(validationResult.valid).toBe(true);

    // Verify expected properties
    expect(doc.sourceId).toBe("ko_detartrage_abime_dents");
    expect(doc.type).toBe("knowledge-object");
    expect(doc.title).toBe("Le détartrage abîme-t-il les dents ?");
    expect(doc.language).toBe("fr");
    expect(doc.status).toBe("published");
    expect(doc.visibility).toBe("public");
    
    // Verify entities are resolved
    expect(doc.entities).toContain("entity_scaling");
    expect(doc.entities).toContain("entity_tartar");

    // Verify searchable text includes title and keywords
    expect(doc.text).toContain("Le détartrage abîme-t-il les dents ?");
    expect(doc.text).toContain("détartrage");
  });

  it("should validate Dawajin Pro SearchDocument and verify its expected properties", () => {
    const doc = createSearchDocumentFromKnowledgeObject(dawajinProSearchDocumentInput);

    // Validate document schema and business logic
    const validationResult = validateSearchDocument(doc);
    expect(validationResult.valid).toBe(true);

    // Verify expected properties
    expect(doc.sourceId).toBe("ko_customer_balance_management");
    expect(doc.type).toBe("knowledge-object");
    expect(doc.title).toBe("Gestion des créances clients");
    expect(doc.language).toBe("fr");
    expect(doc.status).toBe("published");
    expect(doc.visibility).toBe("public");

    // Verify entities are resolved
    expect(doc.entities).toContain("entity_customer_balance");
    expect(doc.entities).toContain("entity_invoice");
    expect(doc.entities).toContain("entity_payment");

    // Verify searchable text includes title and keywords
    expect(doc.text).toContain("Gestion des créances clients");
    expect(doc.text).toContain("créances");
  });
});
