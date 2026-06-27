import { describe, it, expect } from "vitest";
import {
  createRendererRegistry,
  registerRenderer,
  findRendererById,
  findRenderersByFormat,
  hasRenderer,
  validateRendererRegistry,
} from "../src/renderer/renderer-registry.js";
import { KnowledgeRenderer } from "../src/types/renderer.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Renderer Registry Tests", () => {
  const dummyRenderer: KnowledgeRenderer = {
    id: "renderer_dummy",
    name: "Dummy Renderer",
    format: "text",
    status: "experimental",
    render: (input) => ({
      rendererId: "renderer_dummy",
      format: "text",
      content: "Rendered",
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceObjectId: input.objectId,
        sourceObjectVersion: input.objectVersion,
        language: input.language,
      },
      diagnostics: [],
    }),
  };

  it("should validate an empty registry", () => {
    const registry = createRendererRegistry();
    const result = validateRendererRegistry(registry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should register a renderer and find it by id and format", () => {
    const registry = createRendererRegistry();
    const updated = registerRenderer(registry, dummyRenderer);

    expect(hasRenderer(registry, "renderer_dummy")).toBe(false); // original registry is not mutated
    expect(hasRenderer(updated, "renderer_dummy")).toBe(true);

    const found = findRendererById(updated, "renderer_dummy");
    expect(found).toBeDefined();
    expect(found?.name).toBe("Dummy Renderer");

    const formatList = findRenderersByFormat(updated, "text");
    expect(formatList).toHaveLength(1);
    expect(formatList[0].id).toBe("renderer_dummy");
  });

  it("should fail validation if there are duplicate renderer IDs", () => {
    const registry = createRendererRegistry([dummyRenderer, dummyRenderer]);
    const result = validateRendererRegistry(registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_ID_DUPLICATE)).toBe(true);
  });

  it("should fail validation if status or format is invalid", () => {
    const invalidRenderer: KnowledgeRenderer = {
      ...dummyRenderer,
      id: "renderer_invalid",
      format: "invalid-format" as any,
      status: "invalid-status" as any,
    };

    const registry = createRendererRegistry([invalidRenderer]);
    const result = validateRendererRegistry(registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_FORMAT_INVALID)).toBe(true);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_STATUS_INVALID)).toBe(true);
  });

  it("should fail validation if render function is missing", () => {
    const invalidRenderer = {
      id: "renderer_no_render",
      name: "No Render Function",
      format: "text",
      status: "stable",
    } as any;

    const registry = createRendererRegistry([invalidRenderer]);
    const result = validateRendererRegistry(registry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_RENDER_FUNCTION_MISSING)).toBe(true);
  });
});
