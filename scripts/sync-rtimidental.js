#!/usr/bin/env node
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../packages/geocore-cli/dist/config/load-config.js";
import { discoverKnowledgeFiles } from "../packages/geocore-cli/dist/fs/discover-files.js";
import { readKnowledgeFiles } from "../packages/geocore-cli/dist/fs/read-knowledge-files.js";
import {
  loadKnowledgeDataset,
  runValidationPipeline,
  generateStaticExport,
} from "../packages/geocore/dist/index.js";
import {
  vectorizeDataset,
  MemoryVectorStore,
  DeterministicEmbeddingProvider,
} from "../packages/geocore-vector/dist/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncRtimiDental() {
  console.log(`\n🏥 GeoCore Production Exporter ➔ RTimi Dental`);
  console.log(`==============================================`);

  const configPath = path.resolve(__dirname, "../examples/rtimidental/geocore.config.json");
  const config = loadConfig(configPath);
  const baseDir = path.dirname(configPath);
  const effectiveKnowledgeDir = path.resolve(baseDir, config.knowledgeDir);

  // 1. Load Repository Files
  console.log(`📂 Lecture des fichiers de connaissances: ${effectiveKnowledgeDir}`);
  const files = await discoverKnowledgeFiles({
    knowledgeDir: effectiveKnowledgeDir,
    include: config.include,
    exclude: config.exclude,
  });
  const rawInputs = await readKnowledgeFiles(files);
  const dataset = loadKnowledgeDataset({
    id: "dataset_rtimidental_prod",
    name: config.siteName,
    inputs: rawInputs,
  });

  // 2. Validate Quality & Guardrails
  console.log(`🔍 Exécution du diagnostic de validation (10 étapes)...`);
  const report = runValidationPipeline({ dataset, config: { mode: "public" } });
  if (!report.valid) {
    console.error(`❌ Échec de validation pour RTimi Dental:`);
    report.issues.forEach((issue) => console.error(`  - [${issue.severity}] ${issue.message}`));
    process.exit(1);
  }
  console.log(`✅ Validation réussie: 0 erreur, dataset publiable à 100%.`);

  // 3. Generate Static Web & AI Assets
  const outputDir = path.resolve(__dirname, "../dist/rtimidental");
  fs.mkdirSync(outputDir, { recursive: true });

  const exportResult = generateStaticExport({
    id: `export_${dataset.id}`,
    siteName: config.siteName,
    siteUrl: config.siteUrl,
    objects: dataset.objects,
    relationships: dataset.relationships,
    entities: dataset.entities,
    citations: dataset.citations,
    sources: dataset.sources,
    media: dataset.media,
    visibility: "public",
  });

  for (const asset of exportResult.assets) {
    const assetPath = path.join(outputDir, asset.path);
    fs.mkdirSync(path.dirname(assetPath), { recursive: true });
    const contentStr = typeof asset.content === "string" ? asset.content : JSON.stringify(asset.content, null, 2);
    fs.writeFileSync(assetPath, contentStr, "utf-8");
  }
  console.log(`📦 ${exportResult.assets.length} assets statiques générés dans: ${outputDir}`);

  // 4. Pre-compute Semantic Vector Embeddings Cache
  console.log(`🧠 Vectorisation sémantique et génération de l'index dense...`);
  const store = new MemoryVectorStore();
  const provider = new DeterministicEmbeddingProvider(64);
  const vecReport = await vectorizeDataset(dataset, store, provider);

  const vectorCache = {
    datasetId: dataset.id,
    generatedAt: new Date().toISOString(),
    dimension: provider.getDimension(),
    chunksIndexed: vecReport.vectorsIndexed,
  };
  fs.writeFileSync(path.join(outputDir, "vector-index.json"), JSON.stringify(vectorCache, null, 2), "utf-8");
  console.log(`⚡ Index vectoriel pré-calculé (${vecReport.vectorsIndexed} vecteurs générés).`);

  // 5. Optional Direct Sync to Destination Directory
  const destDir = process.env.RTIMIDENTAL_DEST_DIR;
  if (destDir && fs.existsSync(destDir)) {
    console.log(`🚀 Synchronisation vers le répertoire cible: ${destDir}`);
    fs.cpSync(outputDir, destDir, { recursive: true });
    console.log(`✨ Déploiement en production terminé avec succès !`);
  }

  console.log(`==============================================\n`);
}

syncRtimiDental().catch((err) => {
  console.error("Erreur fatale de synchronisation:", err);
  process.exit(1);
});
