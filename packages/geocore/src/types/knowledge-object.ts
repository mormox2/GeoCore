import { KnowledgeStatus } from "./metadata.js";

export type KnowledgeObject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  language: string;
  status: KnowledgeStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
  author: string;

  // Optional Properties
  aliases?: string[];
  tags?: string[];
  categories?: string[];
  media?: string[];
  citations?: string[];
  attachments?: string[];
  glossaryReferences?: string[];
  externalResources?: string[];
  translations?: Record<string, string>;
  relatedObjects?: string[];
};
