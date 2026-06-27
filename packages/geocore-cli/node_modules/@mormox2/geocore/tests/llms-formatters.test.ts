import { describe, it, expect } from "vitest";
import {
  formatLlmsLink,
  formatLlmsList,
  formatLlmsMetadataBlock,
  stringifyLlmsContent,
} from "../src/llms/llms-formatters.js";

describe("LLMs Formatters Tests", () => {
  it("should format links correctly", () => {
    expect(formatLlmsLink("Title", "https://example.com")).toBe("[Title](https://example.com)");
    expect(formatLlmsLink("Title")).toBe("Title");
  });

  it("should format lists correctly", () => {
    expect(formatLlmsList(["a", "b"])).toBe("- a\n- b");
    expect(formatLlmsList([])).toBe("");
  });

  it("should format metadata blocks and omit undefined properties", () => {
    const block = formatLlmsMetadataBlock({
      id: "ko_1",
      language: "en",
      version: "1.0.0",
      canonicalUrl: "https://example.com",
    });
    expect(block).toContain("ID: ko_1");
    expect(block).toContain("Language: en");
    expect(block).toContain("Version: 1.0.0");
    expect(block).toContain("Canonical URL: https://example.com");
    expect(block).not.toContain("Author:");
    expect(block).not.toContain("Trust Level:");
  });

  it("should format strings directly and format objects as fenced JSON blocks", () => {
    expect(stringifyLlmsContent("Simple text")).toBe("Simple text");
    const jsonStr = stringifyLlmsContent({ a: 1 });
    expect(jsonStr).toContain("```json");
    expect(jsonStr).toContain('"a": 1');
  });
});
