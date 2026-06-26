import type { KnowledgeObject } from "./knowledge-object.js";
import type { KnowledgeEntity } from "./entity.js";
import type { KnowledgeRelationship } from "./relationship.js";
import type { KnowledgeCollection } from "./collection.js";
import type { TaxonomyTerm } from "./taxonomy.js";
import type { GlossaryEntry } from "./glossary.js";
import type { KnowledgeSource, KnowledgeCitation } from "./citation.js";
import type { MediaAsset } from "./media.js";
import type { LoaderDiagnostic } from "./loader-diagnostic.js";

export type KnowledgeDataset = {
  id: string;
  name: string;

  objects: KnowledgeObject[];
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  collections: KnowledgeCollection[];
  taxonomyTerms: TaxonomyTerm[];
  glossaryEntries: GlossaryEntry[];
  sources: KnowledgeSource[];
  citations: KnowledgeCitation[];
  media: MediaAsset[];

  loadedAt: string;

  diagnostics: LoaderDiagnostic[];
};
