import { describe, it, expect } from "vitest";
import { createDefaultRendererRegistry, DEFAULT_RENDERERS } from "../src/renderers/renderer-presets.js";
import { findRendererById, findRenderersByFormat, validateRendererRegistry } from "../src/renderer/renderer-registry.js";

describe("Renderer Presets Tests", () => {
  it("should contain the basic renderers in DEFAULT_RENDERERS list", () => {
    expect(DEFAULT_RENDERERS).toHaveLength(2);
    expect(DEFAULT_RENDERERS.some((r) => r.id === "renderer_json_basic")).toBe(true);
    expect(DEFAULT_RENDERERS.some((r) => r.id === "renderer_markdown_basic")).toBe(true);
  });

  it("should create a valid default registry", () => {
    const registry = createDefaultRendererRegistry();
    const validation = validateRendererRegistry(registry);
    expect(validation.valid).toBe(true);
    expect(validation.issues).toHaveLength(0);
  });

  it("should lookup renderers by format and id", () => {
    const registry = createDefaultRendererRegistry();

    const jsonR = findRendererById(registry, "renderer_json_basic");
    expect(jsonR).toBeDefined();
    expect(jsonR?.format).toBe("json");

    const mdR = findRendererById(registry, "renderer_markdown_basic");
    expect(mdR).toBeDefined();
    expect(mdR?.format).toBe("markdown");

    const jsonList = findRenderersByFormat(registry, "json");
    expect(jsonList).toHaveLength(1);
    expect(jsonList[0].id).toBe("renderer_json_basic");

    const mdList = findRenderersByFormat(registry, "markdown");
    expect(mdList).toHaveLength(1);
    expect(mdList[0].id).toBe("renderer_markdown_basic");
  });
});
