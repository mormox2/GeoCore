import { describe, it, expect } from "vitest";
import { validateRendererOutput } from "../src/renderer/validate-renderer-output.js";
import { createRendererOutput } from "../src/renderer/create-renderer-output.js";
import { RendererOutput } from "../src/types/renderer-output.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Renderer Output Validation Tests", () => {
  const baseOutput: RendererOutput = {
    rendererId: "renderer_basic_text",
    format: "text",
    content: "Output string content",
    metadata: {
      generatedAt: "2026-06-25T10:00:00Z",
      sourceObjectId: "ko_test",
      sourceObjectVersion: "1.0.0",
      language: "en",
    },
    diagnostics: [],
  };

  it("should pass for valid renderer output", () => {
    const result = validateRendererOutput(baseOutput);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if rendererId is missing", () => {
    const invalid = { ...baseOutput, rendererId: "" };
    const result = validateRendererOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_OUTPUT_RENDERER_ID_MISSING)).toBe(true);
  });

  it("should fail validation if format is invalid", () => {
    const invalid = { ...baseOutput, format: "ultra-html" as any };
    const result = validateRendererOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_OUTPUT_FORMAT_INVALID)).toBe(true);
  });

  it("should fail validation if content is missing", () => {
    const invalid = { ...baseOutput, content: undefined as any };
    const result = validateRendererOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_OUTPUT_CONTENT_MISSING)).toBe(true);
  });

  it("should fail validation if sourceObjectId is missing", () => {
    const invalid = {
      ...baseOutput,
      metadata: {
        ...baseOutput.metadata,
        sourceObjectId: "",
      },
    };
    const result = validateRendererOutput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_OUTPUT_SOURCE_OBJECT_ID_MISSING)).toBe(true);
  });

  it("should correctly build output via factory, automatically defaulting diagnostics and generatedAt", () => {
    const factoryOutput = createRendererOutput({
      rendererId: "test_renderer",
      format: "json",
      content: { hello: "world" },
      sourceObjectId: "ko_test",
      sourceObjectVersion: "1.0.0",
      language: "en",
    });

    expect(factoryOutput.diagnostics).toEqual([]);
    expect(factoryOutput.metadata.generatedAt).toBeDefined();
    expect(validateRendererOutput(factoryOutput).valid).toBe(true);
  });
});
