export type StudioCommandOptions = {
    port?: number;
    host?: string;
    json?: boolean;
};
export declare function studioCommand(options?: StudioCommandOptions): Promise<void>;
