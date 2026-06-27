import { describe, it, expect } from "vitest";
import { jsonRenderer } from "../src/renderers/json-renderer.js";
import { RendererInput } from "../src/types/renderer-input.js";
import { validateRendererOutput } from "../src/renderer/validate-renderer-output.js";

describe("JSON Renderer Tests", () => {
  const baseInput: RendererInput = {
    objectId: "ko_test",
    objectVersion: "1.0.0",
    language: "en",
    content: { key: "value" },
    metadata: {
      id: "ko_test",
      slug: "test-slug",
      title: "Test Title",
      summary: "Test summary",
      language: "en",
      version: "1.0.0",
      status: "draft",
      author: "author_1",
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

  it("should have correct metadata properties", () => {
    expect(jsonRenderer.id).toBe("renderer_json_basic");
    expect(jsonRenderer.format).toBe("json");
    expect(jsonRenderer.status).toBe("experimental");
  });

  it("should render valid JSON output and pass validation", () => {
    const output = jsonRenderer.render(baseInput);
    expect(output.rendererId).toBe("renderer_json_basic");
    expect(output.format).toBe("json");
    expect(output.metadata.sourceObjectId).toBe("ko_test");
    expect(output.metadata.sourceObjectVersion).toBe("1.0.0");
    expect(output.metadata.language).toBe("en");

    const validation = validateRendererOutput(output);
    expect(validation.valid).toBe(true);
  });

  it("should preserve input fields and handle content structure correctly", () => {
    const output = jsonRenderer.render(baseInput);
    const content = output.content as any;

    expect(content.id).toBe("ko_test");
    expect(content.title).toBe("Test Title");
    expect(content.summary).toBe("Test summary");
    expect(content.language).toBe("en");
    expect(content.version).toBe("1.0.0");
    expect(content.body).toEqual({ key: "value" });

    // Arrays should default to empty
    expect(content.relationships).toEqual([]);
    expect(content.entities).toEqual([]);
    expect(content.citations).toEqual([]);
  });

  it("should not mutate the input object", () => {
    const inputCopy = JSON.parse(JSON.stringify(baseInput));
    jsonRenderer.render(baseInput);
    expect(baseInput).toEqual(inputCopy);
  });
});
