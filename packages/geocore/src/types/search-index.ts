import { SearchDocument } from "./search-document.js";
import { SearchIndexDiagnostic } from "./search.js";

export type SearchIndex = {
  id: string;
  name: string;
  language?: string;
  documents: SearchDocument[];
  generatedAt: string;
  diagnostics: SearchIndexDiagnostic[];
};
