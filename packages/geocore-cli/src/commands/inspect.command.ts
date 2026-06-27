import { loadConfig } from "../config/load-config.js";
import { discoverKnowledgeFiles } from "../fs/discover-files.js";
import { readKnowledgeFiles } from "../fs/read-knowledge-files.js";
import { loadKnowledgeDataset } from "@mormox2/geocore";
import { formatInspectOutput } from "../output/format-inspect-output.js";

export async function inspectCommand(flags: {
  config?: string;
  knowledgeDir?: string;
  json?: boolean;
}): Promise<any> {
  const config = loadConfig(flags.config, {
    knowledgeDir: flags.knowledgeDir,
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

  if (flags.json) {
    const summary = {
      objects: dataset.objects?.length ?? 0,
      entities: dataset.entities?.length ?? 0,
      relationships: dataset.relationships?.length ?? 0,
      collections: dataset.collections?.length ?? 0,
      taxonomyTerms: dataset.taxonomyTerms?.length ?? 0,
      glossaryEntries: dataset.glossaryEntries?.length ?? 0,
      sources: dataset.sources?.length ?? 0,
      citations: dataset.citations?.length ?? 0,
      media: dataset.media?.length ?? 0,
      diagnostics: dataset.diagnostics?.length ?? 0,
    };
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(formatInspectOutput(dataset));
  }

  return dataset;
}
