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

    it("has robots.txt", () => {
      expect(existsSync(join(root, "robots.txt"))).toBe(true);
    });

    it("has sitemap.xml", () => {
      expect(existsSync(join(root, "sitemap.xml"))).toBe(true);
    });

    it("has llms.txt", () => {
      expect(existsSync(join(root, "llms.txt"))).toBe(true);
    });

    it("has og-image.png social preview card", () => {
      expect(existsSync(join(root, "og-image.png"))).toBe(true);
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

    it("initializes CTA tracking", () => {
      expect(js).toContain("initCtaTracking");
    });

    it("dispatches Vercel Web Analytics events", () => {
      expect(js).toContain("trackVercelEvent");
      expect(js).toContain("cli_tab_select");
      expect(js).toContain("copy_command");
      expect(js).toContain("cta_click");
    });
  });

  describe("Vercel Web Analytics Setup", () => {
    const html = readFileSync(join(root, "index.html"), "utf-8");

    it("embeds Vercel Analytics queue initialization snippet", () => {
      expect(html).toContain("window.va = window.va || function ()");
    });

    it("loads defer insights script from /_vercel/insights/script.js", () => {
      expect(html).toContain('<script defer src="/_vercel/insights/script.js"></script>');
    });
  });

  describe("SEO, Schema.org & Generative Engine Optimization (GEO)", () => {
    const html = readFileSync(join(root, "index.html"), "utf-8");
    const robots = readFileSync(join(root, "robots.txt"), "utf-8");
    const sitemap = readFileSync(join(root, "sitemap.xml"), "utf-8");
    const llms = readFileSync(join(root, "llms.txt"), "utf-8");

    it("has canonical URL tag", () => {
      expect(html).toContain('<link rel="canonical" href="https://geocore.vercel.app/"');
    });

    it("has complete Open Graph metadata with image and locale", () => {
      expect(html).toContain('<meta property="og:url" content="https://geocore.vercel.app/"');
      expect(html).toContain('<meta property="og:site_name" content="GeoCore"');
      expect(html).toContain('<meta property="og:locale" content="en_US"');
      expect(html).toContain('<meta property="og:image"');
    });

    it("has Twitter Cards metadata with creator attribution", () => {
      expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
      expect(html).toContain('<meta name="twitter:creator" content="@mormox2"');
      expect(html).toContain('<meta name="twitter:title"');
    });

    it("has Schema.org JSON-LD Structured Data with valid author attribution", () => {
      expect(html).toContain('<script type="application/ld+json">');
      expect(html).toContain('"@type": "SoftwareApplication"');
      expect(html).toContain("Dr. Mossaab Rtimi");
      expect(html).toContain("Chirurgien-Dentiste / Doctor of Dental Surgery (DDS) & Software Developer (Développeur de logiciels)");
      expect(html).toContain('"@type": "WebSite"');
    });

    it("robots.txt declares canonical sitemap and allows AI crawlers", () => {
      expect(robots).toContain("Sitemap: https://geocore.vercel.app/sitemap.xml");
      expect(robots).toContain("User-agent: GPTBot");
      expect(robots).toContain("User-agent: PerplexityBot");
      expect(robots).toContain("User-agent: ClaudeBot");
    });

    it("sitemap.xml defines XML schema and primary URLs", () => {
      expect(sitemap).toContain("<urlset");
      expect(sitemap).toContain("<loc>https://geocore.vercel.app/</loc>");
      expect(sitemap).toContain("<loc>https://geocore.vercel.app/studio/</loc>");
      expect(sitemap).toContain("<loc>https://geocore.vercel.app/llms.txt</loc>");
    });

    it("llms.txt adheres to llmstxt.org specification", () => {
      expect(llms).toContain("# GeoCore — AI-Native Knowledge Operating System");
      expect(llms).toContain("Dr. Mossaab Rtimi");
      expect(llms).toContain("@mormox2/geocore");
      expect(llms).toContain("Hybrid Search");
    });
  });

  describe("Privacy & Zero Cookie Transparency", () => {
    const html = readFileSync(join(root, "index.html"), "utf-8");
    const js = readFileSync(join(root, "app.js"), "utf-8");
    const css = readFileSync(join(root, "styles.css"), "utf-8");

    it("has privacy link in footer", () => {
      expect(html).toContain('id="privacyLink"');
      expect(html).toContain("Privacy &amp; Cookies");
    });

    it("has privacy transparency modal with Zero Cookie badge", () => {
      expect(html).toContain('id="privacyModal"');
      expect(html).toContain("Zero Cookie • 100% Privacy by Design");
      expect(html).toContain("Dr. Mossaab Rtimi");
      expect(html).toContain("Chirurgien-Dentiste / Doctor of Dental Surgery");
      expect(html).toContain("Développeur de logiciels / Software Developer");
    });

    it("initializes privacy modal controller in JavaScript", () => {
      expect(js).toContain("initPrivacyModal");
      expect(js).toContain("privacy_modal_open");
    });

    it("defines styles for privacy modal and badge", () => {
      expect(css).toContain(".privacy-modal-backdrop");
      expect(css).toContain(".privacy-modal-card");
      expect(css).toContain(".privacy-badge");
    });
  });
});
