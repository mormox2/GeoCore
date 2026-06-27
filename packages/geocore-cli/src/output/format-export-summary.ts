import { StaticExportBundle } from "@mormox2/geocore";

export function formatExportSummary(input: {
  bundle: StaticExportBundle;
  writtenFiles?: string[];
}): string {
  const { bundle, writtenFiles = [] } = input;
  const lines: string[] = [];

  lines.push("GeoCore Export Summary");
  lines.push("");
  lines.push(`Assets: ${bundle.assets.length}`);
  lines.push(`Written files: ${writtenFiles.length}`);
  lines.push("");

  for (const asset of bundle.assets) {
    lines.push(`- ${asset.path}`);
  }

  return lines.join("\n");
}
