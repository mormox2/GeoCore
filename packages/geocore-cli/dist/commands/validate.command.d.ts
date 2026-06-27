export declare function validateCommand(flags: {
    config?: string;
    knowledgeDir?: string;
    mode?: "public" | "internal";
    language?: string;
    failFast?: boolean;
    json?: boolean;
}): Promise<any>;
