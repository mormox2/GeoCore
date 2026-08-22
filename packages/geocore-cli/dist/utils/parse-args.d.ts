export type ParsedArgs = {
    command?: string;
    flags: {
        config?: string;
        knowledgeDir?: string;
        outputDir?: string;
        siteUrl?: string;
        language?: string;
        mode?: "public" | "internal";
        port?: number;
        host?: string;
        dim?: number;
        apiKey?: string;
        json?: boolean;
        force?: boolean;
        failFast?: boolean;
        help?: boolean;
    };
    unknownArgs: string[];
};
export declare function parseArgs(args: string[]): ParsedArgs;
