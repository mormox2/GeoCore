import * as fs from "fs";
import * as path from "path";
import { DEFAULT_CONFIG } from "../config/default-config.js";
import { CliError } from "../utils/cli-error.js";

export type InitCommandOptions = {
  /** Directory to initialize; created if missing. Defaults to the current directory. */
  dir?: string;
  force?: boolean;
};

export async function initCommand(options: InitCommandOptions = {}): Promise<void> {
  const targetDir = path.resolve(options.dir ?? ".");

  if (fs.existsSync(targetDir) && !fs.statSync(targetDir).isDirectory()) {
    throw new CliError("FILESYSTEM_ERROR", `Cannot initialize '${options.dir}': it exists and is not a directory.`);
  }
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${options.dir}`);
  }

  const configFile = path.join(targetDir, "geocore.config.json");
  if (fs.existsSync(configFile) && !options.force) {
    console.log("geocore.config.json already exists. Use --force to overwrite.");
  } else {
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf8");
    console.log("Initialized geocore.config.json");
  }

  for (const dir of [DEFAULT_CONFIG.knowledgeDir, DEFAULT_CONFIG.outputDir]) {
    const absolute = path.join(targetDir, dir);
    if (!fs.existsSync(absolute)) {
      fs.mkdirSync(absolute, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }

  console.log("GeoCore project initialized successfully.");
  if (options.dir) {
    console.log(`Next: cd ${options.dir}`);
  }
}
