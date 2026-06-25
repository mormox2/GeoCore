import { KnowledgeObject } from "../types/knowledge-object.js";
import { ResolvedMetadata } from "../types/metadata.js";
import { KnowledgeRelationship } from "../types/relationship.js";
import { KnowledgeEntity } from "../types/entity.js";
import { KnowledgeCollection } from "../types/collection.js";
import { KnowledgeCitation } from "../types/citation.js";
import { KnowledgeSource } from "../types/citation.js";
import { MediaAsset } from "../types/media.js";
import { BreadcrumbItem } from "./breadcrumb-schema.js";
import { SchemaOutput } from "../types/schema.js";
import { SchemaDiagnostic } from "../types/schema-diagnostic.js";
import { mapKnowledgeObjectToSchemaType } from "./schema-mapper.js";
import { createArticleSchema } from "./article-schema.js";
import { createFaqSchema } from "./faq-schema.js";
import { createDefinedTermSchema } from "./defined-term-schema.js";
import { createCollectionSchema } from "./collection-schema.js";
import { createSchemaOutputId } from "./schema-utils.js";
import { validateJsonLd } from "./validate-json-ld.js";
import * as codes from "../validation/validation-codes.js";

export type GenerateJsonLdInput = {
  object: KnowledgeObject;
  metadata?: ResolvedMetadata;
  relationships?: KnowledgeRelationship[];
  entities?: KnowledgeEntity[];
  collections?: KnowledgeCollection[];
  citations?: KnowledgeCitation[];
  sources?: KnowledgeSource[];
  media?: MediaAsset[];
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: string;
};

/**
 * Generates SchemaOutput containing a JSON-LD object for a KnowledgeObject and its dependencies.
 */
export function generateJsonLd(input: GenerateJsonLdInput): SchemaOutput {
  const {
    object,
    metadata,
    media = [],
    sources = [],
  } = input;

  const diagnostics: SchemaDiagnostic[] = [];

  // 1. Determine schema type
  const schemaType = input.schemaType || mapKnowledgeObjectToSchemaType({
    object,
    metadata,
  });

  // 2. Generate JSON-LD object depending on schema type
  let jsonLd: any = {
    "@context": "https://schema.org",
    "@type": schemaType,
  };

  if (schemaType === "FAQPage") {
    jsonLd = createFaqSchema(input);
  } else if (schemaType === "DefinedTerm") {
    const glossaryEntry = (object as any).term
      ? (object as any)
      : {
          id: object.id,
          term: object.title,
          slug: object.slug,
          definition: object.body,
          language: object.language,
          status: object.status,
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
        };
    jsonLd = createDefinedTermSchema({ glossary: glossaryEntry, metadata });
  } else if (schemaType === "CollectionPage") {
    const collection = (input as any).collection || {
      id: object.id,
      slug: object.slug,
      title: object.title,
      summary: object.summary,
      type: "guide",
      language: object.language,
      status: object.status,
      visibility: "public",
      version: object.version,
      items: [],
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
    jsonLd = createCollectionSchema({ collection, objects: [object] });
  } else {
    jsonLd = createArticleSchema(input);
  }

  // 3. Check for private source/media referenced in public schema
  const isPublicSchema = metadata?.status === "published" || object.status === "published";

  if (isPublicSchema) {
    if (sources) {
      for (const src of sources) {
        if (src.visibility === "private" || src.visibility === "internal") {
          diagnostics.push({
            id: `${codes.GC_SCHEMA_CITATION_PRIVATE_SOURCE}_${src.id}`,
            severity: "error",
            code: codes.GC_SCHEMA_CITATION_PRIVATE_SOURCE,
            message: `Public schema references private/internal source: ${src.id}`,
            sourceId: object.id,
            schemaType,
          });
        }
      }
    }

    if (media) {
      for (const m of media) {
        if (m.visibility === "private" || m.visibility === "internal" || m.visibility === "hidden") {
          diagnostics.push({
            id: `${codes.GC_SCHEMA_MEDIA_PRIVATE_OUTPUT}_${m.id}`,
            severity: "error",
            code: codes.GC_SCHEMA_MEDIA_PRIVATE_OUTPUT,
            message: `Public schema references private/internal media asset: ${m.id}`,
            sourceId: object.id,
            schemaType,
          });
        }
      }
    }
  }

  const generatedAt = new Date().toISOString();
  const id = createSchemaOutputId("knowledge-object", object.id, schemaType);

  const output: SchemaOutput = {
    id,
    sourceId: object.id,
    sourceType: "knowledge-object",
    schemaType,
    jsonLd,
    generatedAt,
    diagnostics,
  };

  // 4. Validate output
  const validation = validateJsonLd(output);
  if (!validation.valid || validation.issues.length > 0) {
    for (const issue of validation.issues) {
      // Do not duplicate duplicate diagnostics
      const exists = diagnostics.some((d) => d.code === issue.code && d.field === issue.field);
      if (!exists) {
        diagnostics.push({
          id: issue.id,
          severity: issue.severity,
          code: issue.code,
          message: issue.message,
          sourceId: object.id,
          schemaType,
          field: issue.field,
          recommendation: issue.recommendation,
        });
      }
    }
  }

  return output;
}
