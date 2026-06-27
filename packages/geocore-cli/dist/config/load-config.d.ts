import { GeoCoreCliConfig } from "./geocore-config.js";
export declare function loadConfig(configPath?: string, flags?: {
    knowledgeDir?: string;
    outputDir?: string;
    siteUrl?: string;
    language?: string;
    mode?: "public" | "internal";
    failFast?: boolean;
}): GeoCoreCliConfig;
