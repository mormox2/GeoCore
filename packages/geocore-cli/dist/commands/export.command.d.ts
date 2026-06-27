export declare function exportCommand(flags: {
    config?: string;
    knowledgeDir?: string;
    outputDir?: string;
    siteUrl?: string;
    language?: string;
    mode?: "public" | "internal";
    force?: boolean;
    json?: boolean;
}): Promise<any>;
