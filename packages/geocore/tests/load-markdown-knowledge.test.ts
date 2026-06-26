import { describe, it, expect } from "vitest";
import { loadMarkdownKnowledge } from "../src/loader/load-markdown-knowledge.js";

describe("Load Markdown Knowledge Tests", () => {
  it("loads valid Markdown knowledge", () => {
    const raw = {
      type: "markdown" as const,
      content: `---
id: ko_md_test
slug: md-test
title: MD Title
summary: MD Summary
language: en
status: published
version: 1.0.0
author: author_md
---
Markdown body content here.`,
    };

    const { object, diagnostics } = loadMarkdownKnowledge(raw);
    expect(diagnostics).toHaveLength(0);
    expect(object).toBeDefined();
    expect(object!.id).toBe("ko_md_test");
    expect(object!.body).toBe("Markdown body content here.");
  });

  it("frontmatter becomes object fields and entities becomes array under metadata", () => {
    const raw = {
      type: "markdown" as const,
      content: `---
id: ko_md_test
slug: md-test
title: MD Title
summary: MD Summary
language: en
status: published
version: 1.0.0
author: author_md
entities: entity_one, entity_two
---
Body`,
    };

    const { object } = loadMarkdownKnowledge(raw);
    expect(object!.metadata).toBeDefined();
    expect(object!.metadata!.entities).toEqual(["entity_one", "entity_two"]);
  });

  it("missing frontmatter fails", () => {
    const raw = {
      type: "markdown" as const,
      content: "Just plain text without frontmatter.",
    };

    const { object, diagnostics } = loadMarkdownKnowledge(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_FRONTMATTER_MISSING")).toBe(true);
  });

  it("malformed frontmatter fails", () => {
    const raw = {
      type: "markdown" as const,
      content: `---
id ko_md_test
---
Body`,
    };

    const { object, diagnostics } = loadMarkdownKnowledge(raw);
    expect(object).toBeUndefined();
    expect(diagnostics.some((d) => d.code === "GC_LOADER_FRONTMATTER_MALFORMED")).toBe(true);
  });

  it("missing body produces error according to existing validation rules", () => {
    const raw = {
      type: "markdown" as const,
      content: `---
id: ko_md_test
slug: md-test
title: MD Title
summary: MD Summary
language: en
status: published
version: 1.0.0
author: author_md
---`,
    };

    const { object, diagnostics } = loadMarkdownKnowledge(raw);
    expect(object).toBeUndefined();
    // Missing body triggers GC_LOADER_OBJECT_MISSING_BODY or GC_BODY_MISSING
    expect(
      diagnostics.some((d) => d.code === "GC_LOADER_OBJECT_MISSING_BODY" || d.code === "GC_BODY_MISSING")
    ).toBe(true);
  });
});
