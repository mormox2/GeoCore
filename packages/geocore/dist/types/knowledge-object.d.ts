import { KnowledgeStatus, GeoCoreMetadata } from "./metadata.js";
export type KnowledgeObjectVisibility = "public" | "internal" | "private" | "hidden";
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
    /** Restricts exposure of a published object; omitted means public once published. */
    visibility?: KnowledgeObjectVisibility;
    metadata?: Partial<GeoCoreMetadata>;
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
