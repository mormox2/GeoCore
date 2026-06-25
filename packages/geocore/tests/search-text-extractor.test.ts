import { describe, it, expect } from "vitest";
import { extractSearchText } from "../src/search/search-text-extractor.js";

describe("SearchTextExtractor Tests", () => {
  it("should extract and concatenate title and summary", () => {
    const text = extractSearchText({
      title: "My Title",
      summary: "My Summary",
    });
    expect(text).toBe("My Title My Summary");
  });

  it("should extract string body", () => {
    const text = extractSearchText({
      title: "Title",
      body: "This is body text.",
    });
    expect(text).toBe("Title This is body text.");
  });

  it("should extract object body as JSON string", () => {
    const bodyObj = { section: "introduction", nested: { value: 123 } };
    const text = extractSearchText({
      title: "Title",
      body: bodyObj,
    });
    expect(text).toContain("Title");
    expect(text).toContain(JSON.stringify(bodyObj));
  });

  it("should include entities, aliases, and keywords", () => {
    const text = extractSearchText({
      title: "Title",
      entities: ["entity_1", "entity_2"],
      aliases: ["alias_1"],
      keywords: ["kw_1"],
    });
    expect(text).toBe("Title entity_1 entity_2 alias_1 kw_1");
  });

  it("should normalize whitespace and trim", () => {
    const text = extractSearchText({
      title: "  Title  \n  with \t extra   spaces  ",
      summary: "  Summary   ",
    });
    expect(text).toBe("Title with extra spaces Summary");
  });

  it("should ignore undefined/null values", () => {
    const text = extractSearchText({
      title: "Title",
      summary: undefined,
      body: undefined,
      entities: undefined,
    });
    expect(text).toBe("Title");
  });

  it("should not mutate input object", () => {
    const input = {
      title: "Title",
      entities: ["e1"],
    };
    const inputCopy = JSON.parse(JSON.stringify(input));
    extractSearchText(input);
    expect(input).toEqual(inputCopy);
  });
});
