import { loadConfig } from "../config/load-config.js";
import { discoverKnowledgeFiles } from "../fs/discover-files.js";
import { readKnowledgeFiles } from "../fs/read-knowledge-files.js";
import { writeExportBundle } from "../fs/write-export-bundle.js";
import { loadKnowledgeDataset, runValidationPipeline, generateStaticExport } from "@mormox2/geocore";
import { formatExportSummary } from "../output/format-export-summary.js";
import { CliError } from "../utils/cli-error.js";

export async function exportCommand(flags: {
  config?: string;
  knowledgeDir?: string;
  outputDir?: string;
  siteUrl?: string;
  language?: string;
  mode?: "public" | "internal";
  force?: boolean;
  json?: boolean;
}): Promise<any> {
  const config = loadConfig(flags.config, {
    knowledgeDir: flags.knowledgeDir,
    outputDir: flags.outputDir,
    siteUrl: flags.siteUrl,
    language: flags.language,
    mode: flags.mode,
  });

  const files = await discoverKnowledgeFiles({
    knowledgeDir: config.knowledgeDir,
    include: config.include,
    exclude: config.exclude,
  });

  const rawInputs = await readKnowledgeFiles(files);

  const dataset = loadKnowledgeDataset({
    id: "cli-dataset",
    name: config.siteName,
    inputs: rawInputs,
  });

  const report = runValidationPipeline({
    dataset,
    config: {
      mode: config.validation?.mode,
      failFast: config.validation?.failFast,
      language: config.language,
      siteName: config.siteName,
      siteUrl: config.siteUrl,
    },
  });

  if (!report.publishable && !flags.force) {
    throw new CliError("VALIDATION_FAILED", "Export failed: dataset is not publishable.");
  }

  const bundle = generateStaticExport({
    id: "cli-export-bundle",
    siteName: config.siteName,
    siteUrl: config.siteUrl,
    language: config.language,
    objects: dataset.objects,
    relationships: dataset.relationships,
    entities: dataset.entities,
    collections: dataset.collections,
    citations: dataset.citations,
    sources: dataset.sources,
    media: dataset.media,
    visibility: config.validation?.mode,
    includeMarkdown: config.export?.includeMarkdown,
    includeJson: config.export?.includeJson,
    includeJsonLd: config.export?.includeJsonLd,
    includeSearchIndex: config.export?.includeSearchIndex,
    includeLlmsTxt: config.export?.includeLlmsTxt,
    includeLlmsFullTxt: config.export?.includeLlmsFullTxt,
    includeSitemap: config.export?.includeSitemap,
  });

  const { writtenFiles } = await writeExportBundle({
    bundle,
    outputDir: config.outputDir,
  });

  if (flags.json) {
    console.log(
      JSON.stringify(
        {
          id: bundle.id,
          siteName: bundle.siteName,
          siteUrl: bundle.siteUrl,
          language: bundle.language,
          writtenFiles,
        },
        null,
        2
      )
    );
  } else {
    console.log(formatExportSummary({ bundle, writtenFiles }));
  }

  return { bundle, writtenFiles };
}
