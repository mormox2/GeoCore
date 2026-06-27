import { ValidationPipelineReport, ValidationPipelineMode } from "../types/validation-report.js";
import { ValidationPipelineStageResult } from "../types/validation-stage.js";
export declare function createValidationPipelineReport(input: {
    datasetId: string;
    mode: ValidationPipelineMode;
    stages: ValidationPipelineStageResult[];
    startedAt: string;
    finishedAt: string;
    language?: string;
}): ValidationPipelineReport;
