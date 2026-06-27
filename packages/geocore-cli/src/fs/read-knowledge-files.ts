import * as fs from "fs";
import * as path from "path";
import { RawKnowledgeInput } from "@mormox2/geocore";
import { CliError } from "../utils/cli-error.js";

export async function readKnowledgeFiles(files: string[]): Promise<RawKnowledgeInput[]> {
  const rawInputs: RawKnowledgeInput[] = [];

  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new CliError("FILESYSTEM_ERROR", `File not found: ${file}`);
    }

    let content: string;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (err: any) {
      throw new CliError("FILESYSTEM_ERROR", `Failed to read file ${file}: ${err.message}`);
    }

    const ext = path.extname(file).toLowerCase();
    if (ext === ".md") {
      rawInputs.push({
        type: "markdown",
        sourcePath: file,
        content: content,
      });
    } else if (ext === ".json") {
      let json: any;
      try {
        json = JSON.parse(content);
      } catch (err: any) {
        throw new CliError("FILESYSTEM_ERROR", `Invalid JSON in file ${file}: ${err.message}`);
      }

      const type = json.type ?? "knowledge-object";

      if (Array.isArray(json.content) && (type === "citation" || type === "media" || type === "relationship")) {
        for (const item of json.content) {
          rawInputs.push({
            id: item.id,
            type: type,
            sourcePath: file,
            content: item,
          });
        }
      } else {
        const inputContent = json.content !== undefined ? json.content : json;
        const inputId = (typeof inputContent === "object" && inputContent !== null ? (inputContent.id || json.id) : json.id);
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
