import { ValidationPipelineStageId } from "./validation-stage.js";
import { ValidationPipelineMode } from "./validation-report.js";
import { KnowledgeDataset } from "./knowledge-dataset.js";
import { ResolvedMetadata } from "./metadata.js";
import { RouteRegistry } from "./route.js";
import { StaticExportBundle } from "./static-export.js";
export type ValidationPipelineConfig = {
    mode?: ValidationPipelineMode;
    stages?: Partial<Record<ValidationPipelineStageId, boolean>>;
    requiredStages?: ValidationPipelineStageId[];
    failFast?: boolean;
    language?: string;
    siteName?: string;
    siteUrl?: string;
};
export type RunValidationPipelineInput = {
    dataset: KnowledgeDataset;
    config?: ValidationPipelineConfig;
    metadata?: Record<string, ResolvedMetadata>;
    routes?: RouteRegistry;
    staticExport?: StaticExportBundle;
};
