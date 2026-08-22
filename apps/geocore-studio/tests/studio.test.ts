import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

describe("GeoCore Visual Studio Web Application", () => {
  const studioDir = path.resolve(__dirname, "..");

  it("contains valid index.html with all required studio tabs and semantic elements", () => {
    const html = fs.readFileSync(path.join(studioDir, "index.html"), "utf-8");
    expect(html).toContain("GeoCore Studio");
    expect(html).toContain('data-tab="graph"');
    expect(html).toContain('data-tab="editor"');
    expect(html).toContain('data-tab="rag"');
    expect(html).toContain('data-tab="health"');
    expect(html).toContain('id="graphCanvas"');
    expect(html).toContain('id="markdownEditor"');
    expect(html).toContain('id="ragQueryInput"');
  });

  it("contains curated CSS design system with custom properties and responsive layout", () => {
    const css = fs.readFileSync(path.join(studioDir, "styles.css"), "utf-8");
    expect(css).toContain("--bg-dark");
    expect(css).toContain("--accent-cyan");
    expect(css).toContain("--bg-card");
    expect(css).toContain(".glass-panel");
    expect(css).toContain(".graph-layout");
  });

  it("contains working JavaScript engine with dataset models and algorithms", () => {
    const js = fs.readFileSync(path.join(studioDir, "app.js"), "utf-8");
    expect(js).toContain("DATASETS");
    expect(js).toContain("rtimidental");
    expect(js).toContain("dawajinpro");
    expect(js).toContain("renderGraph");
    expect(js).toContain("runLiveValidation");
    expect(js).toContain("calculateGrounding");
  });
});
