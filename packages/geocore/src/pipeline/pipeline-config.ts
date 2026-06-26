import { ValidationPipelineConfig } from "../types/validation-pipeline.js";

export const DEFAULT_VALIDATION_PIPELINE_CONFIG: Required<Pick<ValidationPipelineConfig, "mode" | "failFast" | "requiredStages" | "stages">> & ValidationPipelineConfig = {
  mode: "public",
  failFast: false,
  requiredStages: [
    "dataset",
    "knowledge-objects",
    "relationships",
    "metadata",
  ],
  stages: {
    "dataset": true,
    "knowledge-objects": true,
    "relationships": true,
    "metadata": true,
    "routes": true,
    "search": true,
    "schema": true,
    "llms": true,
    "sitemap": true,
    "static-export": true,
  },
};
