export type VectorizeCommandOptions = {
    config?: string;
    knowledgeDir?: string;
    dim?: number;
    apiKey?: string;
    json?: boolean;
};
export declare function vectorizeCommand(options?: VectorizeCommandOptions): Promise<void>;
