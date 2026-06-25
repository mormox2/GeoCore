import { describe, it, expect } from "vitest";
import { jsonRenderer } from "../src/renderers/json-renderer.js";
import { markdownRenderer } from "../src/renderers/markdown-renderer.js";
import { validateRendererOutput } from "../src/renderer/validate-renderer-output.js";
import { resolveMetadata } from "../src/metadata/resolve-metadata.js";
import { rtimidentalFixture } from "../src/fixtures/rtimidental.fixture.js";
import { dawajinproFixture } from "../src/fixtures/dawajinpro.fixture.js";
import { rtimiDentalGraphRegistry, dawajinProGraphRegistry } from "../src/fixtures/graph.fixture.js";
import { collectionsFixture, entitiesFixture } from "../src/fixtures/metadata.fixture.js";
import { RendererInput } from "../src/types/renderer-input.js";

describe("Renderer Fixtures Validation Tests", () => {
  it("should render RTimi Dental fixture into valid JSON and Markdown outputs", () => {
    const resolvedMetadata = resolveMetadata({
      object: rtimidentalFixture,
      graph: rtimiDentalGraphRegistry,
      collections: collectionsFixture,
      entities: entitiesFixture,
    });

    const input: RendererInput = {
      objectId: rtimidentalFixture.id,
      objectVersion: rtimidentalFixture.version,
      language: rtimidentalFixture.language,
      content: rtimidentalFixture.body,
      metadata: resolvedMetadata,
      relationships: rtimiDentalGraphRegistry.relationships,
      entities: entitiesFixture.filter(e => resolvedMetadata.entities?.includes(e.id)),
      collections: collectionsFixture.filter(c => resolvedMetadata.collections?.includes(c.id)),
    };

    // 1. Render JSON
    const jsonOutput = jsonRenderer.render(input);
    const jsonVal = validateRendererOutput(jsonOutput);
    expect(jsonVal.valid).toBe(true);

    const jsonContent = jsonOutput.content as any;
    expect(jsonContent.id).toBe("ko_detartrage_abime_dents");
    expect(jsonContent.title).toBe("Le détartrage abîme-t-il les dents ?");
    expect(jsonContent.language).toBe("fr");
    expect(jsonContent.metadata.author).toBe("author_dr_mossaab_rtimi");
    expect(jsonContent.metadata.entities).toContain("entity_scaling");
    expect(jsonContent.metadata.entities).toContain("entity_tartar");

    // 2. Render Markdown
    const mdOutput = markdownRenderer.render(input);
    const mdVal = validateRendererOutput(mdOutput);
    expect(mdVal.valid).toBe(true);

    const mdContent = mdOutput.content as string;
    expect(mdContent).toContain("# Le détartrage abîme-t-il les dents ?");
    expect(mdContent).toContain("- ID: ko_detartrage_abime_dents");
    expect(mdContent).toContain("- Language: fr");
    expect(mdContent).toContain("- Author: author_dr_mossaab_rtimi");
    expect(mdContent).toContain("- entity_scaling");
    expect(mdContent).toContain("- entity_tartar");
  });

  it("should render Dawajin Pro fixture into valid JSON and Markdown outputs", () => {
    const resolvedMetadata = resolveMetadata({
      object: dawajinproFixture,
      graph: dawajinProGraphRegistry,
      collections: collectionsFixture,
      entities: entitiesFixture,
    });

    const input: RendererInput = {
      objectId: dawajinproFixture.id,
      objectVersion: dawajinproFixture.version,
      language: dawajinproFixture.language,
      content: dawajinproFixture.body,
      metadata: resolvedMetadata,
      relationships: dawajinProGraphRegistry.relationships,
      entities: entitiesFixture.filter(e => resolvedMetadata.entities?.includes(e.id)),
      collections: collectionsFixture.filter(c => resolvedMetadata.collections?.includes(c.id)),
    };

    // 1. Render JSON
    const jsonOutput = jsonRenderer.render(input);
    const jsonVal = validateRendererOutput(jsonOutput);
    expect(jsonVal.valid).toBe(true);

    const jsonContent = jsonOutput.content as any;
    expect(jsonContent.id).toBe("ko_customer_balance_management");
    expect(jsonContent.title).toBe("Gestion des créances clients");
    expect(jsonContent.language).toBe("fr");
    expect(jsonContent.metadata.author).toBe("author_dawajin_team");
    expect(jsonContent.metadata.entities).toContain("entity_customer_balance");
    expect(jsonContent.metadata.entities).toContain("entity_invoice");
    expect(jsonContent.metadata.entities).toContain("entity_payment");

    // 2. Render Markdown
    const mdOutput = markdownRenderer.render(input);
    const mdVal = validateRendererOutput(mdOutput);
    expect(mdVal.valid).toBe(true);

    const mdContent = mdOutput.content as string;
    expect(mdContent).toContain("# Gestion des créances clients");
    expect(mdContent).toContain("- ID: ko_customer_balance_management");
    expect(mdContent).toContain("- Language: fr");
    expect(mdContent).toContain("- Author: author_dawajin_team");
    expect(mdContent).toContain("- entity_customer_balance");
    expect(mdContent).toContain("- entity_invoice");
    expect(mdContent).toContain("- entity_payment");
  });
});
