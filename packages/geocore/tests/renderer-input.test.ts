import { describe, it, expect } from "vitest";
import { validateRendererInput } from "../src/renderer/validate-renderer-input.js";
import { RendererInput } from "../src/types/renderer-input.js";
import * as codes from "../src/validation/validation-codes.js";

describe("Renderer Input Validation Tests", () => {
  const baseInput: RendererInput = {
    objectId: "ko_test",
    objectVersion: "1.0.0",
    language: "en",
    content: "Sample content",
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

  it("should pass for valid renderer input", () => {
    const result = validateRendererInput(baseInput);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("should fail validation if objectId is missing", () => {
    const invalid = { ...baseInput, objectId: "" };
    const result = validateRendererInput(invalid);
    expect(result.valid).toBe(false);
    expect(result.publishable).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_INPUT_OBJECT_ID_MISSING)).toBe(true);
  });

  it("should fail validation if objectVersion is missing", () => {
    const invalid = { ...baseInput, objectVersion: "" };
    const result = validateRendererInput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_INPUT_OBJECT_VERSION_MISSING)).toBe(true);
  });

  it("should fail validation if language is missing", () => {
    const invalid = { ...baseInput, language: "" };
    const result = validateRendererInput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_INPUT_LANGUAGE_MISSING)).toBe(true);
  });

  it("should fail validation if content is missing", () => {
    const invalid = { ...baseInput, content: undefined as any };
    const result = validateRendererInput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_INPUT_CONTENT_MISSING)).toBe(true);
  });

  it("should fail validation if metadata is missing", () => {
    const invalid = { ...baseInput, metadata: undefined as any };
    const result = validateRendererInput(invalid);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === codes.GC_RENDERER_INPUT_METADATA_MISSING)).toBe(true);
  });

  it("should warn (but remain valid) if metadata objectId does not match objectId", () => {
    const mismatched = {
      ...baseInput,
      metadata: {
        ...baseInput.metadata,
        id: "ko_different",
      },
    };
    const result = validateRendererInput(mismatched);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe(codes.GC_RENDERER_INPUT_METADATA_OBJECT_MISMATCH);
    expect(result.issues[0].severity).toBe("warning");
  });

  it("should warn (but remain valid) if metadata version does not match objectVersion", () => {
    const mismatched = {
      ...baseInput,
      metadata: {
        ...baseInput.metadata,
        version: "2.0.0",
      },
    };
    const result = validateRendererInput(mismatched);
    expect(result.valid).toBe(true);
    expect(result.publishable).toBe(true);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].code).toBe(codes.GC_RENDERER_INPUT_METADATA_VERSION_MISMATCH);
    expect(result.issues[0].severity).toBe("warning");
  });
});
