import { ValidationPipelineStageResult } from "../types/validation-stage.js";
import { ValidationPipelineMode } from "../types/validation-report.js";
import { KnowledgeDataset } from "../types/knowledge-dataset.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { RouteRegistry } from "../types/route.js";
import { StaticExportBundle } from "../types/static-export.js";
export declare function runDatasetValidationStage(dataset: KnowledgeDataset): ValidationPipelineStageResult;
export declare function runKnowledgeObjectsValidationStage(dataset: KnowledgeDataset): ValidationPipelineStageResult;
export declare function runRelationshipsValidationStage(dataset: KnowledgeDataset): ValidationPipelineStageResult;
export declare function runMetadataValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
}): ValidationPipelineStageResult;
export declare function runRoutesValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    routes?: RouteRegistry;
    siteUrl?: string;
    language?: string;
    mode?: ValidationPipelineMode;
}): ValidationPipelineStageResult;
export declare function runSearchValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    language?: string;
    mode?: ValidationPipelineMode;
}): ValidationPipelineStageResult;
export declare function runSchemaValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    mode?: ValidationPipelineMode;
}): ValidationPipelineStageResult;
export declare function runLlmsValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    siteName?: string;
    siteUrl?: string;
    language?: string;
}): ValidationPipelineStageResult;
export declare function runSitemapValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    siteUrl?: string;
    language?: string;
}): ValidationPipelineStageResult;
export declare function runStaticExportValidationStage(input: {
    dataset: KnowledgeDataset;
    metadata?: Record<string, ResolvedMetadata>;
    routes?: RouteRegistry;
    staticExport?: StaticExportBundle;
    siteName?: string;
    siteUrl?: string;
    language?: string;
    mode?: ValidationPipelineMode;
}): ValidationPipelineStageResult;
