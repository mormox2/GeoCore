import { describe, it, expect } from "vitest";
import { parseSimpleFrontmatter } from "../src/loader/frontmatter-parser.js";

describe("Frontmatter Parser Tests", () => {
  it("parses simple frontmatter", () => {
    const markdown = `---
id: ko_test
slug: test-slug
title: Test Title
---
Body content here`;

    const { data, body, diagnostics } = parseSimpleFrontmatter(markdown);
    expect(diagnostics).toHaveLength(0);
    expect(data.id).toBe("ko_test");
    expect(data.slug).toBe("test-slug");
    expect(data.title).toBe("Test Title");
    expect(body).toBe("Body content here");
  });

  it("parses comma-separated arrays for known array fields", () => {
    const markdown = `---
id: ko_test
entities: entity_one, entity_two
tags: one, two, three
non_array: val1, val2
---
Body`;

    const { data } = parseSimpleFrontmatter(markdown);
    expect(data.entities).toEqual(["entity_one", "entity_two"]);
    expect(data.tags).toEqual(["one", "two", "three"]);
    expect(data.non_array).toBe("val1, val2");
  });

  it("trims whitespace", () => {
    const markdown = `---
  id   :   ko_test  
  title : Test   
---
Body`;

    const { data } = parseSimpleFrontmatter(markdown);
    expect(data.id).toBe("ko_test");
    expect(data.title).toBe("Test");
  });

  it("returns error when frontmatter is missing", () => {
    const markdown = "No frontmatter here.";
    const { diagnostics } = parseSimpleFrontmatter(markdown);
    expect(diagnostics.some((d) => d.severity === "error" && d.code === "GC_LOADER_FRONTMATTER_MISSING")).toBe(true);
  });

  it("returns warning when frontmatter is empty", () => {
    const markdown = `---
---
Body`;
    const { diagnostics } = parseSimpleFrontmatter(markdown);
    expect(diagnostics.some((d) => d.severity === "warning" && d.code === "GC_LOADER_FRONTMATTER_EMPTY")).toBe(true);
  });

  it("returns error when frontmatter is malformed (no colon)", () => {
    const markdown = `---
id ko_test
---
Body`;
    const { diagnostics } = parseSimpleFrontmatter(markdown);
    expect(diagnostics.some((d) => d.severity === "error" && d.code === "GC_LOADER_FRONTMATTER_MALFORMED")).toBe(true);
  });

  it("does not mutate input", () => {
    const markdown = "---\nid: test\n---\nBody";
    const original = markdown;
    parseSimpleFrontmatter(markdown);
    expect(markdown).toBe(original);
  });
});
