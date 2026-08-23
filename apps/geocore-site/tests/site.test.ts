import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");

describe("GeoCore Site — Landing Page Tests", () => {

  describe("File Structure", () => {
    it("has index.html", () => {
      expect(existsSync(join(root, "index.html"))).toBe(true);
    });

    it("has styles.css", () => {
      expect(existsSync(join(root, "styles.css"))).toBe(true);
    });

    it("has app.js", () => {
      expect(existsSync(join(root, "app.js"))).toBe(true);
    });

    it("has serve.js", () => {
      expect(existsSync(join(root, "serve.js"))).toBe(true);
    });
  });

  describe("HTML Content", () => {
    const html = readFileSync(join(root, "index.html"), "utf-8");

    it("contains required SEO meta tags", () => {
      expect(html).toContain('<meta name="description"');
      expect(html).toContain('<meta property="og:title"');
      expect(html).toContain('<title>GeoCore');
    });

    it("contains all major sections", () => {
      expect(html).toContain('id="hero"');
      expect(html).toContain('id="features"');
      expect(html).toContain('id="pipeline"');
      expect(html).toContain('id="architecture"');
      expect(html).toContain('id="cli"');
      expect(html).toContain('id="cases"');
      expect(html).toContain('id="integration"');
      expect(html).toContain('id="cta"');
    });

    it("references all 7 packages", () => {
      expect(html).toContain("@mormox2/geocore");
      expect(html).toContain("@mormox2/geocore-cli");
      expect(html).toContain("@mormox2/geocore-server");
      expect(html).toContain("@mormox2/geocore-db");
      expect(html).toContain("@mormox2/geocore-vector");
      expect(html).toContain("@mormox2/geocore-next");
      expect(html).toContain("@mormox2/geocore-ai");
    });

    it("mentions both case studies", () => {
      expect(html).toContain("RTimi Dental");
      expect(html).toContain("Dawajin Pro");
    });

    it("has 10 pipeline stages", () => {
      const stageMatches = html.match(/pipeline-stage/g);
      expect(stageMatches).not.toBeNull();
      expect(stageMatches.length).toBeGreaterThanOrEqual(10);
    });

    it("contains all 6 CLI commands in tabs", () => {
      expect(html).toContain('data-cli="validate"');
      expect(html).toContain('data-cli="export"');
      expect(html).toContain('data-cli="inspect"');
      expect(html).toContain('data-cli="vectorize"');
      expect(html).toContain('data-cli="serve"');
      expect(html).toContain('data-cli="studio"');
    });

    it("links to GitHub repository", () => {
      expect(html).toContain("https://github.com/mormox2/GeoCore");
    });
  });

  describe("CSS Design System", () => {
    const css = readFileSync(join(root, "styles.css"), "utf-8");

    it("imports Inter font", () => {
      expect(css).toContain("Inter");
    });

    it("defines core design tokens", () => {
      expect(css).toContain("--bg-void");
      expect(css).toContain("--accent-cyan");
      expect(css).toContain("--grad-hero");
      expect(css).toContain("--font-mono");
    });

    it("includes responsive breakpoints", () => {
      expect(css).toContain("@media");
      expect(css).toContain("max-width: 768px");
    });

    it("has reveal animation classes", () => {
      expect(css).toContain(".reveal");
      expect(css).toContain(".reveal.visible");
      expect(css).toContain("@keyframes fadeUp");
    });
  });

  describe("JavaScript Interactions", () => {
    const js = readFileSync(join(root, "app.js"), "utf-8");

    it("initializes navbar scroll handler", () => {
      expect(js).toContain("initNavScroll");
    });

    it("initializes reveal on scroll", () => {
      expect(js).toContain("IntersectionObserver");
    });

    it("initializes CLI tab switcher", () => {
      expect(js).toContain("initCliTabs");
    });

    it("includes copy button handler", () => {
      expect(js).toContain("initCopyButton");
    });
  });
});
