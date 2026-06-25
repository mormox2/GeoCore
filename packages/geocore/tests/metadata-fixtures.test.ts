import { describe, it, expect } from "vitest";
import { resolveMetadata } from "../src/metadata/resolve-metadata.js";
import { validateMetadata } from "../src/metadata/validate-metadata.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";
import { rtimiDentalGraphRegistry, dawajinProGraphRegistry } from "../src/fixtures/graph.fixture.js";
import { dawajinproFixture } from "../src/fixtures/dawajinpro.fixture.js";
import { collectionsFixture, entitiesFixture } from "../src/fixtures/metadata.fixture.js";

describe("Metadata Fixtures Resolution Tests", () => {
  it("should correctly resolve and validate RTimi Dental fixture metadata", () => {
    const resolved = resolveMetadata({
      object: rtimidentalFixture,
      graph: rtimiDentalGraphRegistry,
      collections: collectionsFixture,
      entities: entitiesFixture,
    });

    expect(resolved.id).toBe("ko_detartrage_abime_dents");
    expect(resolved.slug).toBe("detartrage-abime-t-il-les-dents");
    expect(resolved.title).toBe("Le détartrage abîme-t-il les dents ?");
    expect(resolved.language).toBe("fr");
    expect(resolved.status).toBe("published");
    expect(resolved.author).toBe("author_dr_mossaab_rtimi");

    // Check entities extracted from graph
    expect(resolved.entities).toContain("entity_scaling");
    expect(resolved.entities).toContain("entity_tartar");

    // Validate the resolved metadata
    const validationResult = validateMetadata(resolved, {
      entities: ["entity_scaling", "entity_tartar"],
      collections: ["col_rtimi_dental_faq"],
    });

    // Valid because missing canonicalUrl on published objects generates a warning, not an error
    expect(validationResult.valid).toBe(true);
    expect(validationResult.publishable).toBe(true);
    expect(validationResult.issues).toHaveLength(1);
    expect(validationResult.issues[0].severity).toBe("warning");
  });

  it("should correctly resolve and validate Dawajin Pro fixture metadata", () => {
    const resolved = resolveMetadata({
      object: dawajinproFixture,
      graph: dawajinProGraphRegistry,
      collections: collectionsFixture,
      entities: entitiesFixture,
    });

    expect(resolved.id).toBe("ko_customer_balance_management");
    expect(resolved.slug).toBe("gestion-creances-clients");
    expect(resolved.title).toBe("Gestion des créances clients");
    expect(resolved.language).toBe("fr");
    expect(resolved.status).toBe("published");
    expect(resolved.author).toBe("author_dawajin_team");

    // Check entities extracted from graph
    expect(resolved.entities).toContain("entity_customer_balance");
    expect(resolved.entities).toContain("entity_invoice");
    expect(resolved.entities).toContain("entity_payment");

    // Validate the resolved metadata
    const validationResult = validateMetadata(resolved, {
      entities: ["entity_customer_balance", "entity_invoice", "entity_payment"],
      collections: ["col_dawajin_academy_balances"],
    });

    expect(validationResult.valid).toBe(true);
    expect(validationResult.publishable).toBe(true);
    expect(validationResult.issues).toHaveLength(1);
    expect(validationResult.issues[0].severity).toBe("warning");
  });
});
