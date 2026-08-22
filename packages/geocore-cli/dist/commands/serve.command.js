import * as path from "node:path";
import { loadConfig } from "../config/load-config.js";
import { discoverKnowledgeFiles } from "../fs/discover-files.js";
import { readKnowledgeFiles } from "../fs/read-knowledge-files.js";
import { loadKnowledgeDataset } from "@mormox2/geocore";
import { createGeoCoreServer } from "@mormox2/geocore-server";
export async function serveCommand(options = {}) {
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
    const port = options.port ?? 3000;
    const host = options.host ?? "0.0.0.0";
    const siteUrl = options.siteUrl ?? config.siteUrl;
    const authOptions = options.apiKey
        ? { apiKeys: [options.apiKey] }
        : undefined;
    const serverInstance = createGeoCoreServer({
        dataset,
        port,
        host,
        siteUrl,
        auth: authOptions,
    });
    const { url } = await serverInstance.listen(port, host);
    if (options.json) {
        console.log(JSON.stringify({
            status: "running",
            url,
            port,
            host,
            datasetId: dataset.id,
            objectsCount: dataset.objects.length,
            openapiUrl: `${url}/api/openapi.json`,
            healthUrl: `${url}/api/health`,
        }, null, 2));
    }
    else {
        console.log(`\n🚀 GeoCore HTTP REST Server started successfully!`);
        console.log(`--------------------------------------------------`);
        console.log(`📡 URL:          ${url}`);
        console.log(`📚 Dataset:      ${dataset.name} (${dataset.id})`);
        console.log(`📄 Objects:      ${dataset.objects.length} published`);
        console.log(`📑 OpenAPI Docs: ${url}/api/openapi.json`);
        console.log(`🩺 Health check: ${url}/api/health`);
        console.log(`🔍 Search API:   ${url}/api/search?q=...`);
        console.log(`🧠 Hybrid Search:${url}/api/search/hybrid?q=...`);
        console.log(`🤖 AI Context:   ${url}/api/context/:id`);
        console.log(`--------------------------------------------------\n`);
    }
    // Graceful shutdown handlers
    const shutdown = async () => {
        await serverInstance.close();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
