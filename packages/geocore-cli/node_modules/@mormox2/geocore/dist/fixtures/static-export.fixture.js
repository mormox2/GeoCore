import { rtimidentalFixture, rtimiDentalSiteUrl, } from "./rtimidental.fixture.js";
import { dawajinproFixture, dawajinProSiteUrl, } from "./dawajinpro.fixture.js";
const GENERATED_AT = "2026-06-25T10:00:00Z";
/**
 * RTimi Dental static export input.
 */
export const rtimiDentalExportInput = {
    id: "export_rtimidental",
    siteName: "RTimi Dental",
    siteUrl: rtimiDentalSiteUrl,
    language: "fr",
    objects: [rtimidentalFixture],
};
/**
 * Dawajin Pro static export input.
 */
export const dawajinProExportInput = {
    id: "export_dawajinpro",
    siteName: "Dawajin Pro",
    siteUrl: dawajinProSiteUrl,
    language: "fr",
    objects: [dawajinproFixture],
};
/**
 * A minimal valid asset used as baseline by schema/validation tests.
 */
export const sampleExportAsset = {
    id: "exportasset_markdown_fr-sample-article-md",
    type: "markdown",
    path: "fr/sample-article.md",
    content: "# Sample\n\nBody text here.",
    mimeType: "text/markdown",
    encoding: "utf-8",
    sourceIds: ["ko_sample"],
    visibility: "public",
    generatedAt: GENERATED_AT,
    diagnostics: [],
};
/**
 * Expected asset paths for the RTimi Dental fixture.
 */
export const rtimiDentalExpectedPaths = {
    markdown: "fr/detartrage-abime-t-il-les-dents.md",
    json: "fr/detartrage-abime-t-il-les-dents.json",
    jsonLd: "fr/detartrage-abime-t-il-les-dents.schema.json",
    searchIndex: "search-index.json",
    llms: "llms.txt",
    llmsFull: "llms-full.txt",
    sitemap: "sitemap.xml",
    manifest: "manifest.json",
};
/**
 * Expected asset paths for the Dawajin Pro fixture.
 */
export const dawajinProExpectedPaths = {
    markdown: "fr/gestion-creances-clients.md",
    json: "fr/gestion-creances-clients.json",
    jsonLd: "fr/gestion-creances-clients.schema.json",
    searchIndex: "search-index.json",
    llms: "llms.txt",
    llmsFull: "llms-full.txt",
    sitemap: "sitemap.xml",
    manifest: "manifest.json",
};
