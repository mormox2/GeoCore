import * as fs from "fs";
import { DEFAULT_CONFIG } from "../config/default-config.js";

export async function initCommand(flags?: { force?: boolean }): Promise<void> {
  const configFile = "geocore.config.json";

  if (fs.existsSync(configFile) && !flags?.force) {
    console.log("geocore.config.json already exists. Use --force to overwrite.");
  } else {
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, null, 2), "utf8");
    console.log("Initialized geocore.config.json");
  }

  const knowledgeDir = DEFAULT_CONFIG.knowledgeDir;
  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
    console.log(`Created directory: ${knowledgeDir}`);
  }

  const outputDir = DEFAULT_CONFIG.outputDir;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  console.log("GeoCore project initialized successfully.");
}
