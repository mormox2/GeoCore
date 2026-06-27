import * as fs from "fs";
import * as path from "path";
import { StaticExportBundle } from "@mormox2/geocore";
import { CliError } from "../utils/cli-error.js";

export async function writeExportBundle(input: {
  bundle: StaticExportBundle;
  outputDir: string;
}): Promise<{
  writtenFiles: string[];
}> {
  const { bundle, outputDir } = input;
  const writtenFiles: string[] = [];

  const resolvedOutputDir = path.resolve(outputDir);

  for (const asset of bundle.assets) {
    const resolvedAssetPath = path.resolve(resolvedOutputDir, asset.path);

    if (!resolvedAssetPath.startsWith(resolvedOutputDir)) {
      throw new CliError(
        "FILESYSTEM_ERROR",
        `Path traversal detected: "${asset.path}" resolves outside of output directory "${outputDir}"`
      );
    }

    const parentDir = path.dirname(resolvedAssetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    let fileContent: string;
    if (typeof asset.content === "string") {
      fileContent = asset.content;
    } else {
      fileContent = JSON.stringify(asset.content, null, 2);
    }

    try {
      fs.writeFileSync(resolvedAssetPath, fileContent, "utf8");
    } catch (err: any) {
      throw new CliError(
        "FILESYSTEM_ERROR",
        `Failed to write asset file ${resolvedAssetPath}: ${err.message}`
      );
    }

    writtenFiles.push(resolvedAssetPath);
  }

  return {
    writtenFiles: writtenFiles.sort(),
  };
}
