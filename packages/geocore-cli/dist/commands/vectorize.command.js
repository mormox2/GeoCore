import * as path from "node:path";
import { loadConfig } from "../config/load-config.js";
import { discoverKnowledgeFiles } from "../fs/discover-files.js";
import { readKnowledgeFiles } from "../fs/read-knowledge-files.js";
import { loadKnowledgeDataset } from "@mormox2/geocore";
import { vectorizeDataset, MemoryVectorStore, DeterministicEmbeddingProvider, OpenAiEmbeddingProvider, } from "@mormox2/geocore-vector";
export async function vectorizeCommand(options = {}) {
    const config = loadConfig(options.config, {
        knowledgeDir: options.knowledgeDir,
    });
    const baseDir = options.config ? path.dirname(path.resolve(options.config)) : process.cwd();
    const effectiveKnowledgeDir = path.isAbsolute(config.knowledgeDir)
        ? config.knowledgeDir
        : path.resolve(baseDir, config.knowledgeDir);
    const files = await discoverKnowledgeFiles({
        knowledgeDir: effectiveKnowledgeDir,
        include: config.include,
        exclude: config.exclude,
    });
    const rawInputs = await readKnowledgeFiles(files);
    const dataset = loadKnowledgeDataset({
        id: "cli-dataset",
        name: config.siteName,
        inputs: rawInputs,
    });
    const store = new MemoryVectorStore();
    const dimension = options.dim ?? 64;
    let provider;
    if (options.apiKey || process.env.OPENAI_API_KEY) {
        const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        provider = new OpenAiEmbeddingProvider({ apiKey });
    }
    else {
        provider = new DeterministicEmbeddingProvider(dimension);
    }
    const report = await vectorizeDataset(dataset, store, provider);
    if (options.json) {
        console.log(JSON.stringify({
            status: "ok",
            datasetId: dataset.id,
            dimension: provider.getDimension(),
            ...report,
        }, null, 2));
    }
    else {
        console.log(`\n🧠 GeoCore Vectorization Complete!`);
        console.log(`-----------------------------------`);
        console.log(`📚 Dataset:          ${dataset.name}`);
        console.log(`📐 Dimensions:       ${provider.getDimension()}D`);
        console.log(`📄 Objects vectorisés: ${report.objectsProcessed}`);
        console.log(`🧩 Chunks générés:   ${report.chunksGenerated}`);
        console.log(`⚡ Vecteurs indexés: ${report.vectorsIndexed}`);
        console.log(`⏱️  Durée:            ${report.durationMs}ms`);
        console.log(`-----------------------------------\n`);
    }
}
