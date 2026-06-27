import type { GenerateStaticExportInput } from "../types/static-export.js";
import type { StaticExportAsset } from "../types/static-export-asset.js";
/**
 * RTimi Dental static export input.
 */
export declare const rtimiDentalExportInput: GenerateStaticExportInput;
/**
 * Dawajin Pro static export input.
 */
export declare const dawajinProExportInput: GenerateStaticExportInput;
/**
 * A minimal valid asset used as baseline by schema/validation tests.
 */
export declare const sampleExportAsset: StaticExportAsset;
/**
 * Expected asset paths for the RTimi Dental fixture.
 */
export declare const rtimiDentalExpectedPaths: {
    readonly markdown: "fr/detartrage-abime-t-il-les-dents.md";
    readonly json: "fr/detartrage-abime-t-il-les-dents.json";
    readonly jsonLd: "fr/detartrage-abime-t-il-les-dents.schema.json";
    readonly searchIndex: "search-index.json";
    readonly llms: "llms.txt";
    readonly llmsFull: "llms-full.txt";
    readonly sitemap: "sitemap.xml";
    readonly manifest: "manifest.json";
};
/**
 * Expected asset paths for the Dawajin Pro fixture.
 */
export declare const dawajinProExpectedPaths: {
    readonly markdown: "fr/gestion-creances-clients.md";
    readonly json: "fr/gestion-creances-clients.json";
    readonly jsonLd: "fr/gestion-creances-clients.schema.json";
    readonly searchIndex: "search-index.json";
    readonly llms: "llms.txt";
    readonly llmsFull: "llms-full.txt";
    readonly sitemap: "sitemap.xml";
    readonly manifest: "manifest.json";
};
