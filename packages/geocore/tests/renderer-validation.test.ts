import { describe, it, expect } from "vitest";
import { textRenderer, jsonRendererPlaceholder } from "../src/fixtures/renderer.fixture.js";
import { validateRendererOutput } from "../src/renderer/validate-renderer-output.js";
import { RendererInput } from "../src/types/renderer-input.js";

describe("Renderer Fixture Implementation Tests", () => {
  const input: RendererInput = {
    objectId: "ko_detartrage_abime_dents",
    objectVersion: "1.0.0",
    language: "fr",
    content: "Le detartrage n'abime pas les dents.",
    metadata: {
      id: "ko_detartrage_abime_dents",
      slug: "detartrage-abime-t-il-les-dents",
      title: "Le détartrage abîme-t-il les dents ?",
      summary: "Réponse claire sur les effets du détartrage.",
      language: "fr",
      version: "1.0.0",
      status: "published",
      author: "author_dr_mossaab_rtimi",
      createdAt: "2026-06-25T10:00:00Z",
      updatedAt: "2026-06-25T10:00:00Z",
      resolvedAt: "2026-06-25T10:05:00Z",
      resolvedFrom: {
        object: true,
        defaults: true,
        graph: false,
        collections: false,
        entities: false,
        citations: false,
      },
    },
  };

  it("should render and validate output for the basic text renderer fixture", () => {
    const output = textRenderer.render(input);
    expect(output.rendererId).toBe("renderer_text_basic");
    expect(output.format).toBe("text");
    expect(output.content).toBe("Le detartrage n'abime pas les dents.");

    const validation = validateRendererOutput(output);
    expect(validation.valid).toBe(true);
    expect(validation.issues).toHaveLength(0);
  });

  it("should render and validate output for the JSON placeholder renderer fixture", () => {
    const output = jsonRendererPlaceholder.render(input);
    expect(output.rendererId).toBe("renderer_json_placeholder");
    expect(output.format).toBe("json");
    expect(output.content).toEqual({
      objectId: "ko_detartrage_abime_dents",
      title: "Le détartrage abîme-t-il les dents ?",
      summary: "Réponse claire sur les effets du détartrage.",
    });

    const validation = validateRendererOutput(output);
    expect(validation.valid).toBe(true);
    expect(validation.issues).toHaveLength(0);
  });
});
