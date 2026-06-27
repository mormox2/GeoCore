import { describe, it, expect } from "vitest";
import { markdownRenderer } from "../src/renderers/markdown-renderer.js";
import { RendererInput } from "../src/types/renderer-input.js";
import { validateRendererOutput } from "../src/renderer/validate-renderer-output.js";

describe("Markdown Renderer Tests", () => {
  const baseInput: RendererInput = {
    objectId: "ko_test",
    objectVersion: "1.0.0",
    language: "en",
    content: "This is the text content body.",
    metadata: {
      id: "ko_test",
      slug: "test-slug",
      title: "Test Title",
      summary: "Test summary text.",
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
    expect(markdownRenderer.id).toBe("renderer_markdown_basic");
    expect(markdownRenderer.format).toBe("markdown");
  });

  it("should render valid Markdown output and pass validation", () => {
    const output = markdownRenderer.render(baseInput);
    expect(output.rendererId).toBe("renderer_markdown_basic");
    expect(output.format).toBe("markdown");

    const validation = validateRendererOutput(output);
    expect(validation.valid).toBe(true);
  });

  it("should produce a clean Markdown structure with title, summary, content, and metadata", () => {
    const output = markdownRenderer.render(baseInput);
    const content = output.content as string;

    expect(content.startsWith("# Test Title")).toBe(true);
    expect(content).toContain("Test summary text.");
    expect(content).toContain("This is the text content body.");
    expect(content).toContain("## Metadata");
    expect(content).toContain("- ID: ko_test");
    expect(content).toContain("- Slug: test-slug");
    expect(content).toContain("- Language: en");
    expect(content).toContain("- Version: 1.0.0");
    expect(content).toContain("- Status: draft");
    expect(content).toContain("- Author: author_1");
  });

  it("should render object content as fenced JSON blocks", () => {
    const objectInput = {
      ...baseInput,
      content: { nested: "value", num: 123 },
    };
    const output = markdownRenderer.render(objectInput);
    const content = output.content as string;

    expect(content).toContain("```json");
    expect(content).toContain('"nested": "value"');
    expect(content).toContain('"num": 123');
    expect(content).toContain("```");
    expect(output.diagnostics.some((d) => d.severity === "info")).toBe(true);
  });

  it("should render entities, collections, and citations when present", () => {
    const complexInput = {
      ...baseInput,
      metadata: {
        ...baseInput.metadata,
        entities: ["entity_1", "entity_2"],
        collections: ["collection_a"],
        citations: ["citation_x"],
      },
    };
    const output = markdownRenderer.render(complexInput);
    const content = output.content as string;

    expect(content).toContain("## Entities");
    expect(content).toContain("- entity_1");
    expect(content).toContain("- entity_2");
    expect(content).toContain("## Collections");
    expect(content).toContain("- collection_a");
    expect(content).toContain("## Citations");
    expect(content).toContain("- citation_x");
  });

  it("should not mutate the input", () => {
    const inputCopy = JSON.parse(JSON.stringify(baseInput));
    markdownRenderer.render(baseInput);
    expect(baseInput).toEqual(inputCopy);
  });
});
