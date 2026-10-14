import * as fs from "fs";
import * as path from "path";
import { RawKnowledgeInput } from "@mormo_mossaab/geocore";
import { CliError, errorMessage } from "../utils/cli-error.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function idOf(value: unknown): string | undefined {
  return isRecord(value) && typeof value.id === "string" ? value.id : undefined;
}

export async function readKnowledgeFiles(files: string[]): Promise<RawKnowledgeInput[]> {
  const rawInputs: RawKnowledgeInput[] = [];

  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new CliError("FILESYSTEM_ERROR", `File not found: ${file}`);
    }

    let content: string;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (err) {
      throw new CliError("FILESYSTEM_ERROR", `Failed to read file ${file}: ${errorMessage(err)}`);
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === ".md") {
      rawInputs.push({
        type: "markdown",
        sourcePath: file,
        content: content,
      });
    } else if (ext === ".json") {
      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        throw new CliError("FILESYSTEM_ERROR", `Invalid JSON in file ${file}: ${errorMessage(err)}`);
      }
      if (!isRecord(parsed)) {
        throw new CliError("FILESYSTEM_ERROR", `Invalid knowledge file ${file}: expected a JSON object.`);
      }
      const json = parsed;

      // Unknown types are reported by the loader as GC_LOADER_INPUT_TYPE_INVALID.
      const type = (typeof json.type === "string" ? json.type : "knowledge-object") as RawKnowledgeInput["type"];

      if (Array.isArray(json.content) && (type === "citation" || type === "media" || type === "relationship")) {
        for (const item of json.content) {
          rawInputs.push({
            id: idOf(item),
            type: type,
            sourcePath: file,
            content: item,
          });
        }
      } else {
        const inputContent = json.content !== undefined ? json.content : json;
        const inputId = idOf(inputContent) ?? idOf(json);
        rawInputs.push({
          id: inputId,
          type: type,
          sourcePath: file,
          content: inputContent,
        });
      }
    }
  }

  return rawInputs;
}
