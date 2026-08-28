import { StaticExportBundle } from "@mormo_mossaab/geocore";
export declare function writeExportBundle(input: {
    bundle: StaticExportBundle;
    outputDir: string;
}): Promise<{
    writtenFiles: string[];
}>;
