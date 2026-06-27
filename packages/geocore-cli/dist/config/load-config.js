import * as fs from "fs";
import { DEFAULT_CONFIG } from "./default-config.js";
import { CliError } from "../utils/cli-error.js";
export function loadConfig(configPath, flags) {
    let fileConfig = {};
    if (configPath) {
        if (!fs.existsSync(configPath)) {
            throw new CliError("CONFIG_ERROR", `Configuration file not found: ${configPath}`);
        }
        try {
            const content = fs.readFileSync(configPath, "utf8");
            fileConfig = JSON.parse(content);
        }
        catch (err) {
            throw new CliError("CONFIG_ERROR", `Failed to parse configuration file: ${err.message}`);
        }
    }
    else {
        const defaultFile = "geocore.config.json";
        if (fs.existsSync(defaultFile)) {
            try {
                const content = fs.readFileSync(defaultFile, "utf8");
                fileConfig = JSON.parse(content);
            }
            catch (err) {
                throw new CliError("CONFIG_ERROR", `Failed to parse default configuration file: ${err.message}`);
            }
        }
    }
    const siteName = fileConfig.siteName || DEFAULT_CONFIG.siteName;
    const merged = {
        siteName,
        siteUrl: flags?.siteUrl ?? fileConfig.siteUrl,
        language: flags?.language ?? fileConfig.language,
        knowledgeDir: flags?.knowledgeDir ?? fileConfig.knowledgeDir ?? DEFAULT_CONFIG.knowledgeDir,
        outputDir: flags?.outputDir ?? fileConfig.outputDir ?? DEFAULT_CONFIG.outputDir,
        include: fileConfig.include ?? DEFAULT_CONFIG.include,
        exclude: fileConfig.exclude ?? DEFAULT_CONFIG.exclude,
        validation: {
            mode: flags?.mode ?? fileConfig.validation?.mode ?? DEFAULT_CONFIG.validation.mode,
            failFast: flags?.failFast ?? fileConfig.validation?.failFast ?? DEFAULT_CONFIG.validation.failFast,
        },
        export: {
            ...DEFAULT_CONFIG.export,
            ...fileConfig.export,
        },
    };
    return merged;
}
