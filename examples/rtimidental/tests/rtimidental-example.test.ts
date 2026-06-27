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

describe("RTimi Dental GeoCore Integration Example Tests", () => {
  const configPath = path.resolve(__dirname, "../geocore.config.json");
  const knowledgeDir = path.resolve(__dirname, "../knowledge");
  const expectedOutputDir = path.resolve(__dirname, "../expected-output");

  describe("Config Tests", () => {
    it("geocore.config.json exists and loads correctly", () => {
      expect(fs.existsSync(configPath)).toBe(true);
      
      const config = loadConfig(configPath);
      expect(config.siteName).toBe("RTimi Dental");
      expect(config.siteUrl).toBe("https://rtimidental.tn");
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
      // - 3 md files (detartrage, implant, gingivite)
      // - 5 entities json files
      // - 1 relationships json file
      // - 1 professional-review json file
      // - 1 citations json file
      // - 1 media json file
      // Total: 12 files
      expect(files.length).toBe(12);

      // Verify sorted order
      const sorted = [...files].sort();
      expect(files).toEqual(sorted);
    });

    it("reads knowledge files into RawKnowledgeInput format", async () => {
      const files = await discoverKnowledgeFiles({
        knowledgeDir,
      });
      const rawInputs = await readKnowledgeFiles(files);

      // Since citations, media, and relationships are arrays, they get flat-mapped:
      // - citations.json contains 3 citations -> 3 raw inputs
      // - media.json contains 1 media -> 1 raw input
      // - relationships.json contains 6 relationships -> 6 raw inputs
      // - 3 md files -> 3 raw inputs
      // - 5 entity files -> 5 raw inputs
      // - 1 professional-review source file -> 1 raw input
      // Total: 3 + 1 + 6 + 3 + 5 + 1 = 19 raw inputs
      expect(rawInputs.length).toBe(19);

      // Verify that markdown files are parsed as type "markdown"
      const mdInputs = rawInputs.filter(r => r.type === "markdown");
      expect(mdInputs.length).toBe(3);
      mdInputs.forEach(md => {
        expect(md.content).toContain("---");
      });

      // Verify that JSON inputs have sourcePath and payload
      const entityInputs = rawInputs.filter(r => r.type === "entity");
      expect(entityInputs.length).toBe(5);
      entityInputs.forEach(entity => {
        expect(entity.id).toBeDefined();
        expect(typeof entity.content).toBe("object");
      });
    });
  });

  describe("Dataset and Graph Tests", () => {
    it("loads raw inputs into a valid KnowledgeDataset in memory", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "rtimi_dental_dataset",
        name: "RTimi Dental",
        inputs: rawInputs,
      });

      expect(dataset.objects.length).toBe(3);
      expect(dataset.entities.length).toBe(5);
      expect(dataset.relationships.length).toBe(6);
      expect(dataset.sources.length).toBe(1);
      expect(dataset.citations.length).toBe(3);
      expect(dataset.media.length).toBe(1);

      // No critical diagnostics in loading stage
      const criticalErrors = dataset.diagnostics.filter(d => d.severity === "critical" || d.severity === "error");
      expect(criticalErrors.length).toBe(0);

      // Verify objects
      const detartrage = dataset.objects.find(o => o.id === "ko_detartrage_abime_dents");
      expect(detartrage).toBeDefined();
      expect(detartrage?.trustLevel).toBe("medical");
      expect(detartrage?.author).toBe("author_dr_mossaab_rtimi");
      expect(detartrage?.reviewer).toBe("author_dr_mossaab_rtimi");

      // Verify entities
      const scaling = dataset.entities.find(e => e.id === "entity_scaling");
      expect(scaling).toBeDefined();
      expect(scaling?.canonicalName).toBe("Détartrage");

      // Verify relationships
      const authoredBy = dataset.relationships.find(r => r.id === "rel_detartrage_authored_by_dr");
      expect(authoredBy).toBeDefined();
      expect(authoredBy?.sourceId).toBe("ko_detartrage_abime_dents");
      expect(authoredBy?.targetId).toBe("author_dr_mossaab_rtimi");
      expect(authoredBy?.type).toBe("authored_by");
    });
  });

  describe("Validation Pipeline and Safety Rules Tests", () => {
    it("runs the validation pipeline successfully and meets safety rules", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "rtimi_dental_dataset",
        name: "RTimi Dental",
        inputs: rawInputs,
      });

      const report = runValidationPipeline({
        dataset,
        config: {
          siteName: "RTimi Dental",
          siteUrl: "https://rtimidental.tn",
          mode: "public",
          language: "fr",
        },
      });

      console.log("Validation Issues:", JSON.stringify(report.issues, null, 2));

      // It must be valid and publishable (no errors or critical issues)
      expect(report.valid).toBe(true);
      expect(report.publishable).toBe(true);

      const errors = report.issues.filter(i => i.severity === "error" || i.severity === "critical");
      expect(errors.length).toBe(0);

      // Cautious language check: disclaimers and caution notes must exist
      dataset.objects.forEach(obj => {
        expect(obj.body.toLowerCase()).toMatch(/(ne remplace pas|consultation|examen clinique)/);
        expect(obj.trustLevel).toBe("medical");
        expect(obj.author).toBe("author_dr_mossaab_rtimi");
        expect(obj.reviewer).toBe("author_dr_mossaab_rtimi");
      });

      // No real patient photos or identifiable patient media
      dataset.media.forEach(m => {
        expect(m.consentStatus).toBe("not-required");
        expect(m.privacyLevel).toBe("public");
        expect(m.id).not.toMatch(/(patient_photo|patient_name)/);
      });
    });
  });

  describe("Export and Output Content Tests", () => {
    it("generates correct static export bundle with snapshots", async () => {
      const files = await discoverKnowledgeFiles({ knowledgeDir });
      const rawInputs = await readKnowledgeFiles(files);
      const dataset = loadKnowledgeDataset({
        id: "rtimi_dental_dataset",
        name: "RTimi Dental",
        inputs: rawInputs,
      });

      const bundle = generateStaticExport({
        id: "rtimi_dental_export",
        siteName: "RTimi Dental",
        siteUrl: "https://rtimidental.tn",
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

      // Check generated files list
      const paths = bundle.assets.map(a => a.path);
      
      expect(paths).toContain("fr/detartrage-abime-t-il-les-dents.md");
      expect(paths).toContain("fr/detartrage-abime-t-il-les-dents.json");
      expect(paths).toContain("fr/detartrage-abime-t-il-les-dents.schema.json");
      expect(paths).toContain("fr/implant-dentaire-definition.md");
      expect(paths).toContain("fr/implant-dentaire-definition.json");
      expect(paths).toContain("fr/implant-dentaire-definition.schema.json");
      expect(paths).toContain("fr/gingivite-definition.md");
      expect(paths).toContain("fr/gingivite-definition.json");
      expect(paths).toContain("fr/gingivite-definition.schema.json");
      expect(paths).toContain("search-index.json");
      expect(paths).toContain("llms.txt");
      expect(paths).toContain("llms-full.txt");
      expect(paths).toContain("sitemap.xml");
      expect(paths).toContain("manifest.json");

      // Verify llms.txt content
      const llmsTxt = bundle.assets.find(a => a.path === "llms.txt")?.content as string;
      expect(llmsTxt).toContain("# RTimi Dental");
      expect(llmsTxt).toContain("Le détartrage abîme-t-il les dents ?");
      expect(llmsTxt).toContain("Qu’est-ce qu’un implant dentaire ?");
      expect(llmsTxt).toContain("Qu’est-ce que la gingivite ?");
      expect(llmsTxt).toContain("entity_scaling");
      expect(llmsTxt).toContain("entity_tartar");

      // Verify sitemap.xml content
      const sitemapXml = bundle.assets.find(a => a.path === "sitemap.xml")?.content as string;
      expect(sitemapXml).toContain("https://rtimidental.tn/fr/questions/detartrage-abime-t-il-les-dents");
      expect(sitemapXml).toContain("https://rtimidental.tn/fr/guides/implant-dentaire-definition");
      expect(sitemapXml).toContain("https://rtimidental.tn/fr/guides/gingivite-definition");

      // Verify search index content
      const searchIndex = bundle.assets.find(a => a.path === "search-index.json")?.content as any;
      const indexObj = typeof searchIndex === "string" ? JSON.parse(searchIndex) : searchIndex;
      expect(indexObj.documents).toBeDefined();
      const sourceIds = indexObj.documents.map((d: any) => d.sourceId);
      expect(sourceIds).toContain("ko_detartrage_abime_dents");
      expect(sourceIds).toContain("ko_implant_dentaire_definition");
      expect(sourceIds).toContain("ko_gingivite_definition");

      // Verify JSON-LD Schema.org context
      const detartrageSchema = bundle.assets.find(a => a.path === "fr/detartrage-abime-t-il-les-dents.schema.json")?.content as any;
      const schemaObj = typeof detartrageSchema === "string" ? JSON.parse(detartrageSchema) : detartrageSchema;
      expect(schemaObj["@context"]).toBe("https://schema.org");
      expect(schemaObj["@type"]).toBe("Article");
      expect(schemaObj["author"]["@type"]).toBe("Person");
      expect(schemaObj["author"]["name"]).toBe("author_dr_mossaab_rtimi");

      // Verify disclaimer sentence in generated Markdown
      const detartrageMd = bundle.assets.find(a => a.path === "fr/detartrage-abime-t-il-les-dents.md")?.content as string;
      expect(detartrageMd).toContain("Ce contenu est informatif et ne remplace pas un examen clinique personnalisé.");
    });
  });
});
