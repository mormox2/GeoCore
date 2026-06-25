import { describe, it, expect } from "vitest";
import { createBreadcrumbSchema } from "../src/schema/breadcrumb-schema.js";

describe("Breadcrumb Schema Tests", () => {
  it("should create BreadcrumbList with positions starting at 1", () => {
    const items = [
      { name: "Home", url: "https://example.com/" },
      { name: "Articles", url: "https://example.com/articles" },
      { name: "Current" },
    ];

    const schema = createBreadcrumbSchema(items);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);

    expect(schema.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://example.com/",
    });

    expect(schema.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "Articles",
      item: "https://example.com/articles",
    });

    expect(schema.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Current",
    });
  });

  it("should handle empty breadcrumb lists", () => {
    const schema = createBreadcrumbSchema([]);
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toEqual([]);
  });
});
