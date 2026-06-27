import { StaticExportBundle } from "@mormox2/geocore";
export declare function writeExportBundle(input: {
    bundle: StaticExportBundle;
    outputDir: string;
}): Promise<{
    writtenFiles: string[];
}>;
