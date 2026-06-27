export type SearchDocumentType =
  | "knowledge-object"
  | "entity"
  | "collection"
  | "glossary-entry"
  | "documentation"
  | "media"
  | "citation";

export type SearchDocumentStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

export type SearchDocumentVisibility =
  | "public"
  | "internal"
  | "private"
  | "hidden";

export type SearchIndexDiagnosticSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type SearchIndexDiagnostic = {
  id: string;
  severity: SearchIndexDiagnosticSeverity;
  code: string;
  message: string;
  documentId?: string;
  sourceId?: string;
  field?: string;
  recommendation?: string;
};
