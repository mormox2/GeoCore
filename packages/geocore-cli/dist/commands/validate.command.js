import * as path from "path";
import { loadConfig } from "../config/load-config.js";
import { discoverKnowledgeFiles } from "../fs/discover-files.js";
import { readKnowledgeFiles } from "../fs/read-knowledge-files.js";
import { loadKnowledgeDataset, runValidationPipeline } from "@mormo_mossaab/geocore";
import { formatValidationReport } from "../output/format-validation-report.js";
import { CliError } from "../utils/cli-error.js";
export async function validateCommand(flags) {
    const config = loadConfig(flags.config, {
        knowledgeDir: flags.knowledgeDir,
        mode: flags.mode,
        language: flags.language,
        failFast: flags.failFast,
    });
    const baseDir = flags.config ? path.dirname(path.resolve(flags.config)) : process.cwd();
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
    const report = runValidationPipeline({
        dataset,
        config: {
            mode: config.validation?.mode,
            failFast: config.validation?.failFast,
            language: config.language,
            siteName: config.siteName,
            siteUrl: config.siteUrl,
        },
    });
    if (flags.json) {
        console.log(JSON.stringify(report, null, 2));
    }
    else {
        console.log(formatValidationReport(report));
    }
    if (!report.valid) {
        throw new CliError("VALIDATION_FAILED", "Validation failed with errors.");
    }
    return report;
}
