import { RendererFormat, RendererStatus } from "../types/renderer.js";
import { RendererDiagnosticSeverity } from "../types/renderer-diagnostic.js";

const FORMATS = new Set<RendererFormat>([
  "html",
  "markdown",
  "json",
  "json-ld",
  "xml",
  "rss",
  "pdf",
  "llm",
  "search",
  "api",
  "text",
]);

const STATUSES = new Set<RendererStatus>([
  "experimental",
  "beta",
  "stable",
  "deprecated",
]);

const SEVERITIES = new Set<RendererDiagnosticSeverity>([
  "info",
  "warning",
  "error",
  "critical",
]);

export function isRendererFormat(value: unknown): value is RendererFormat {
  return typeof value === "string" && FORMATS.has(value as RendererFormat);
}

export function isRendererStatus(value: unknown): value is RendererStatus {
  return typeof value === "string" && STATUSES.has(value as RendererStatus);
}

export function isRendererDiagnosticSeverity(value: unknown): value is RendererDiagnosticSeverity {
  return typeof value === "string" && SEVERITIES.has(value as RendererDiagnosticSeverity);
}
