export type CollectionStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

export type CollectionVisibility =
  | "public"
  | "private"
  | "internal"
  | "hidden";

export type CollectionType =
  | "guide"
  | "course"
  | "documentation"
  | "help-center"
  | "topic-cluster"
  | "glossary-set"
  | "faq-set"
  | "academy"
  | "manual"
  | "playbook"
  | "roadmap"
  | "specification-set"
  | "case-study-set"
  | "media-series";

export type CollectionItem = {
  objectId: string;
  order?: number;
  section?: string;
  required?: boolean;
  label?: string;
  description?: string;
};

export type KnowledgeCollection = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  type: CollectionType;
  language: string;
  status: CollectionStatus;
  visibility: CollectionVisibility;
  version: string;

  items: CollectionItem[];

  audience?: string[];
  domain?: string[];
  relatedEntities?: string[];
  relatedCollections?: string[];

  owner?: string;
  author?: string;
  reviewer?: string;

  canonicalUrl?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
};
