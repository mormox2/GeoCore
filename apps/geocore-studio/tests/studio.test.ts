import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

describe("GeoCore Visual Studio Web Application", () => {
  const studioDir = path.resolve(__dirname, "..");

  it("contains valid index.html with all required studio tabs including Live Vector Chat", () => {
    const html = fs.readFileSync(path.join(studioDir, "index.html"), "utf-8");
    expect(html).toContain("GeoCore Studio");
    expect(html).toContain('data-tab="graph"');
    expect(html).toContain('data-tab="editor"');
    expect(html).toContain('data-tab="chat"');
    expect(html).toContain('data-tab="rag"');
    expect(html).toContain('data-tab="health"');
    expect(html).toContain('id="graphCanvas"');
    expect(html).toContain('id="markdownEditor"');
    expect(html).toContain('id="chatInput"');
    expect(html).toContain('id="vectorInspectorContent"');
  });

  it("contains curated CSS design system with chat and vector inspector styles", () => {
    const css = fs.readFileSync(path.join(studioDir, "styles.css"), "utf-8");
    expect(css).toContain("--bg-dark");
    expect(css).toContain("--accent-cyan");
    expect(css).toContain("--bg-card");
    expect(css).toContain(".glass-panel");
    expect(css).toContain(".chat-layout");
    expect(css).toContain(".vector-inspector");
    expect(css).toContain(".chat-bubble");
  });

  it("contains working JavaScript engine with hybrid vector RRF simulation and chat handlers", () => {
    const js = fs.readFileSync(path.join(studioDir, "app.js"), "utf-8");
    expect(js).toContain("DATASETS");
    expect(js).toContain("rtimidental");
    expect(js).toContain("dawajinpro");
    expect(js).toContain("renderGraph");
    expect(js).toContain("runLiveValidation");
    expect(js).toContain("setupLiveChat");
    expect(js).toContain("simulateHybridSearchAndRAG");
    expect(js).toContain("calculateGrounding");
  });
});
