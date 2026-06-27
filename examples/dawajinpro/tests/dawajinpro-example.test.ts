import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import {
  loadConfig,
  discoverKnowledgeFiles,
  readKnowledgeFiles,
} from "../../../packages/geocore-cli/src/index.js";
import {
  loadKnowledgeDataset,
  runValidationPipeline,
  generateStaticExport,
} from "../../../packages/geocore/src/index.js";

describe("Dawajin Pro GeoCore Integration Example Tests", () => {
  const configPath = path.resolve(__dirname, "../geocore.config.json");
  const knowledgeDir = path.resolve(__dirname, "../knowledge");
  const expectedOutputDir = path.resolve(__dirname, "../expected-output");

  describe("Config Tests", () => {
    it("geocore.config.json exists and loads correctly", () => {
      expect(fs.existsSync(configPath)).toBe(true);

      const config = loadConfig(configPath);
      expect(config.siteName).toBe("Dawajin Pro");
      expect(config.siteUrl).toBe("https://dawajinpro.tn");
      expect(config.knowledgeDir).toBe("knowledge");
      expect(config.outputDir).toBe("dist/geocore");
      expect(config.language).toBe("fr");
      expect(config.validation?.mode).toBe("public");
    });
  });

  describe("Loader Tests", () => {
    it("discovers all knowledge files recursively", async () => {
      const files = await discoverKnowledgeFiles({
        knowledgeDir,
        include: ["**/*.md", "**/*.json"],
        exclude: ["**/*.draft.md"],
      });

      // We expect:
      // - 5 md files
      // - 9 entity json files
      // - 3 glossary json files
      // - 1 relationships json file
      // - 1 product-review source json file
      // - 1 citations json file
      // - 1 media json file
      // Total: 21 files
      expect(files.length).toBe(21);

      const sorted = [...files].sort();
      expect(files).toEqual(sorted);
    });

    it("reads knowledge files into RawKnowledgeInput format", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);

      // Raw inputs flat-mapped:
      // 5 md + 9 entities + 3 glossary + 11 relationships + 1 source + 5 citations + 1 media = 35 inputs
      expect(rawInputs.length).toBe(35);

      const mdInputs = rawInputs.filter((r) => r.type === "markdown");
      expect(mdInputs.length).toBe(5);
      mdInputs.forEach((md) => {
        expect(md.content).toContain("---");
      });

      const entityInputs = rawInputs.filter((r) => r.type === "entity");
      expect(entityInputs.length).toBe(9);
      entityInputs.forEach((entity) => {
        expect(entity.id).toBeDefined();
        expect(typeof entity.content).toBe("object");
      });
    });
  });

  describe("Dataset Tests", () => {
    it("loads raw inputs into a valid KnowledgeDataset in memory", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      expect(dataset.objects.length).toBe(5);
      expect(dataset.entities.length).toBe(9);
      expect(dataset.glossaryEntries.length).toBe(3);
      expect(dataset.relationships.length).toBe(11);
      expect(dataset.sources.length).toBe(1);
      expect(dataset.citations.length).toBe(5);
      expect(dataset.media.length).toBe(1);

      const criticalErrors = dataset.diagnostics.filter(
        (d) => d.severity === "critical" || d.severity === "error"
      );
      expect(criticalErrors.length).toBe(0);

      // Verify specific entities exist
      const customerBalance = dataset.entities.find(
        (e) => e.id === "entity_customer_balance"
      );
      expect(customerBalance).toBeDefined();
      expect(customerBalance?.canonicalName).toBe("Créance client");

      // Verify product review source
      const reviewSource = dataset.sources.find(
        (s) => s.id === "source_dawajin_product_review_001"
      );
      expect(reviewSource).toBeDefined();
      expect(reviewSource?.title).toBe("Dawajin Pro product documentation review");
    });
  });

  describe("Validation Pipeline Tests", () => {
    it("runs validation pipeline with no critical safety issues", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      const report = runValidationPipeline({
        dataset,
        config: {
          siteName: "Dawajin Pro",
          siteUrl: "https://dawajinpro.tn",
          mode: "public",
          language: "fr",
        },
      });

      expect(report.valid).toBe(true);
      expect(report.publishable).toBe(true);

      const errors = report.issues.filter(
        (i) => i.severity === "error" || i.severity === "critical"
      );
      expect(errors.length).toBe(0);

      dataset.objects.forEach((obj) => {
        expect(obj.trustLevel).toBe("product-critical");
        expect(obj.author).toBe("author_dawajin_team");
        expect(obj.reviewer).toBe("author_dawajin_team");
      });
    });
  });

  describe("Export Tests", () => {
    it("generates complete static export bundle", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      const bundle = generateStaticExport({
        id: "dawajin_pro_export",
        siteName: "Dawajin Pro",
        siteUrl: "https://dawajinpro.tn",
        language: "fr",
        objects: dataset.objects,
        entities: dataset.entities,
        relationships: dataset.relationships,
        sources: dataset.sources,
        citations: dataset.citations,
        media: dataset.media,
        visibility: "public",
        includeMarkdown: true,
        includeJson: true,
        includeJsonLd: true,
        includeSearchIndex: true,
        includeLlmsTxt: true,
        includeLlmsFullTxt: true,
        includeSitemap: true,
      });

      const paths = bundle.assets.map((a) => a.path);

      expect(paths).toContain("fr/gestion-creances-clients.md");
      expect(paths).toContain("fr/gestion-creances-clients.json");
      expect(paths).toContain("fr/gestion-creances-clients.schema.json");
      expect(paths).toContain("fr/suivi-livraisons.md");
      expect(paths).toContain("fr/gestion-stock-volaille-oeufs.md");
      expect(paths).toContain("fr/role-chauffeur.md");
      expect(paths).toContain("fr/konnect-preproduction.md");
      expect(paths).toContain("search-index.json");
      expect(paths).toContain("llms.txt");
      expect(paths).toContain("llms-full.txt");
      expect(paths).toContain("sitemap.xml");
      expect(paths).toContain("manifest.json");
    });
  });

  describe("Output Content Tests", () => {
    it("verifies generated outputs match expectations", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      const bundle = generateStaticExport({
        id: "dawajin_pro_export",
        siteName: "Dawajin Pro",
        siteUrl: "https://dawajinpro.tn",
        language: "fr",
        objects: dataset.objects,
        entities: dataset.entities,
        relationships: dataset.relationships,
        sources: dataset.sources,
        citations: dataset.citations,
        media: dataset.media,
        visibility: "public",
        includeMarkdown: true,
        includeJson: true,
        includeJsonLd: true,
        includeSearchIndex: true,
        includeLlmsTxt: true,
        includeLlmsFullTxt: true,
        includeSitemap: true,
      });

      const llmsTxt = bundle.assets.find((a) => a.path === "llms.txt")?.content as string;
      expect(llmsTxt).toContain("Dawajin Pro");
      expect(llmsTxt).toContain("Gestion des créances clients");
      expect(llmsTxt).toContain("Suivi des livraisons");
      expect(llmsTxt).toContain("Gestion du stock volaille et œufs");
      expect(llmsTxt).toContain("Rôle chauffeur");
      expect(llmsTxt).toContain("Paiement Konnect en pré-production");
      expect(llmsTxt).toContain("entity_customer_balance");
      expect(llmsTxt).toContain("entity_konnect_preproduction");

      const sitemapXml = bundle.assets.find((a) => a.path === "sitemap.xml")?.content as string;
      expect(sitemapXml).toContain("https://dawajinpro.tn/fr/help/gestion-creances-clients");
      expect(sitemapXml).toContain("https://dawajinpro.tn/fr/help/suivi-livraisons");
      expect(sitemapXml).toContain("https://dawajinpro.tn/fr/help/gestion-stock-volaille-oeufs");
      expect(sitemapXml).toContain("https://dawajinpro.tn/fr/help/role-chauffeur");
      expect(sitemapXml).toContain("https://dawajinpro.tn/fr/help/konnect-preproduction");

      const searchIndexRaw = bundle.assets.find((a) => a.path === "search-index.json")?.content;
      const searchIndex = typeof searchIndexRaw === "string" ? JSON.parse(searchIndexRaw) : searchIndexRaw;
      const sourceIds = searchIndex.documents.map((d: any) => d.sourceId);
      expect(sourceIds).toContain("ko_customer_balance_management");
      expect(sourceIds).toContain("ko_delivery_tracking");
      expect(sourceIds).toContain("ko_stock_management_poultry_eggs");
      expect(sourceIds).toContain("ko_driver_role");
      expect(sourceIds).toContain("ko_konnect_preproduction");

      const schemaRaw = bundle.assets.find((a) => a.path === "fr/gestion-creances-clients.schema.json")?.content;
      const schemaObj = typeof schemaRaw === "string" ? JSON.parse(schemaRaw) : schemaRaw;
      expect(schemaObj["@context"]).toBe("https://schema.org");
    });
  });

  describe("Konnect Safety Tests", () => {
    it("ensures Konnect is documented as pre-production with no availability claims", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      const konnectObj = dataset.objects.find((o) => o.id === "ko_konnect_preproduction");
      expect(konnectObj).toBeDefined();
      expect(konnectObj?.body).toContain("pré-production");

      const bundle = generateStaticExport({
        id: "dawajin_pro_export",
        siteName: "Dawajin Pro",
        siteUrl: "https://dawajinpro.tn",
        language: "fr",
        objects: dataset.objects,
        entities: dataset.entities,
        relationships: dataset.relationships,
        sources: dataset.sources,
        citations: dataset.citations,
        media: dataset.media,
        visibility: "public",
        includeLlmsTxt: true,
        includeLlmsFullTxt: true,
      });

      const llmsTxt = bundle.assets.find((a) => a.path === "llms.txt")?.content as string;
      const llmsFull = bundle.assets.find((a) => a.path === "llms-full.txt")?.content as string;

      expect(llmsTxt.toLowerCase()).not.toContain("konnect production ready");
      expect(llmsFull.toLowerCase()).not.toContain("konnect production ready");
    });
  });

  describe("Privacy Tests", () => {
    it("verifies no sensitive credentials or private tenant data exist", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "dawajin_pro_dataset",
        name: "Dawajin Pro",
        inputs: rawInputs,
      });

      const allStringified = JSON.stringify(dataset);
      expect(allStringified).not.toMatch(/sb_secret_/);
      expect(allStringified).not.toMatch(/konnect_api_key/i);
      expect(allStringified).not.toMatch(/service_role_key/i);

      dataset.media.forEach((m) => {
        expect(m.description?.toLowerCase()).toMatch(/(démonstration|fictif|demo)/);
      });
    });
  });
});
