import { describe, it, expect } from "vitest";
import { generateLlmsTxt } from "../src/llms/llms-generator.js";
import { generateLlmsFullTxt } from "../src/llms/llms-full-generator.js";
import { validateLlmsOutput } from "../src/llms/validate-llms-output.js";
import { rtimiDentalLlmsInput, dawajinProLlmsInput } from "../src/fixtures/llms.fixture.js";

describe("LLMs Fixtures Integration Tests", () => {
  it("should generate valid RTimi Dental outputs", () => {
    // Compact
    const compact = generateLlmsTxt(rtimiDentalLlmsInput);
    const compactValidation = validateLlmsOutput(compact);
    expect(compactValidation.valid).toBe(true);
    expect(compact.content).toContain("# RTimi Dental");
    expect(compact.content).toContain("Le détartrage abîme-t-il les dents ?");
    expect(compact.content).toContain("entity_scaling");
    expect(compact.content).toContain("entity_tartar");

    // Full
    const full = generateLlmsFullTxt(rtimiDentalLlmsInput);
    const fullValidation = validateLlmsOutput(full);
    expect(fullValidation.valid).toBe(true);
    expect(full.content).toContain("## Document: Le détartrage abîme-t-il les dents ?");
    expect(full.content).toContain("ID: ko_detartrage_abime_dents");
    expect(full.content).toContain("Language: fr");
    expect(full.content).toContain("Author: author_dr_mossaab_rtimi");
  });

  it("should generate valid Dawajin Pro outputs", () => {
    // Compact
    const compact = generateLlmsTxt(dawajinProLlmsInput);
    const compactValidation = validateLlmsOutput(compact);
    expect(compactValidation.valid).toBe(true);
    expect(compact.content).toContain("# Dawajin Pro");
    expect(compact.content).toContain("Gestion des créances clients");
    expect(compact.content).toContain("entity_customer_balance");
    expect(compact.content).toContain("entity_invoice");
    expect(compact.content).toContain("entity_payment");

    // Full
    const full = generateLlmsFullTxt(dawajinProLlmsInput);
    const fullValidation = validateLlmsOutput(full);
    expect(fullValidation.valid).toBe(true);
    expect(full.content).toContain("## Document: Gestion des créances clients");
    expect(full.content).toContain("ID: ko_customer_balance_management");
    expect(full.content).toContain("Language: fr");
    expect(full.content).toContain("Author: author_dawajin_team");
  });
});
