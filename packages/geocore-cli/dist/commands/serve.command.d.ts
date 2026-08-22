export type ServeCommandOptions = {
    config?: string;
    knowledgeDir?: string;
    port?: number;
    host?: string;
    siteUrl?: string;
    apiKey?: string;
    json?: boolean;
};
export declare function serveCommand(options?: ServeCommandOptions): Promise<void>;
