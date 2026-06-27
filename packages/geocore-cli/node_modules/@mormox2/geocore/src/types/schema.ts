import { JsonLdObject } from "./json-ld.js";
import { SchemaDiagnostic } from "./schema-diagnostic.js";

export type SchemaOutput = {
  id: string;
  sourceId: string;
  sourceType: string;
  schemaType: string;
  jsonLd: JsonLdObject;
  generatedAt: string;
  diagnostics: SchemaDiagnostic[];
};
