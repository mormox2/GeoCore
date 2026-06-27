export type KnowledgeStatus = "draft" | "review" | "published" | "archived";

export type MetadataConfidence = "low" | "medium" | "high";

export type FreshnessLevel = "stable" | "periodic" | "frequent" | "live";

export type GeoCoreMetadata = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  language: string;
  version: string;
  status: KnowledgeStatus;

  author: string;
  reviewer?: string;
  owner?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedAt?: string;
  archivedAt?: string;

  canonicalUrl?: string;

  entities?: string[];
  topics?: string[];
  domains?: string[];
  audiences?: string[];
  collections?: string[];
  citations?: string[];

  trustLevel?: string;
  freshness?: FreshnessLevel;

  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    robots?: string;
    keywords?: string[];
  };

  ai?: {
    summaryShort?: string;
    summaryMedium?: string;
    summaryLong?: string;
    canonicalAnswer?: string;
    keyTakeaways?: string[];
    confidence?: MetadataConfidence;
    answerableQuestions?: string[];
    freshness?: FreshnessLevel;
  };

  technical?: {
    sourceFormat?: string;
    renderTargets?: string[];
    contentHash?: string;
    schemaVersion?: string;
    validationStatus?: string;
    indexingStatus?: string;
  };
};

export type ResolvedMetadata = GeoCoreMetadata & {
  resolvedAt: string;

  resolvedFrom: {
    object: boolean;
    defaults: boolean;
    graph: boolean;
    collections: boolean;
    entities: boolean;
    citations: boolean;
  };

  diagnostics?: string[];
};
