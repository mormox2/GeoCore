export type EntityStatus = "draft" | "review" | "published" | "deprecated";
export type EntityType = "concept" | "person" | "organization" | "place" | "product" | "feature" | "workflow" | "medical_concept" | "dental_concept" | "business_concept" | "technical_concept" | "document_type" | "unit" | "metric" | "condition" | "treatment" | "procedure" | "dental_procedure" | "dental_condition" | "dental_treatment" | "tool" | "material" | "role" | "business_document" | "business_event" | "business_workflow" | "user_role" | "inventory_concept" | "product_concept" | "payment_status";
export type KnowledgeEntity = {
    id: string;
    type: EntityType;
    canonicalName: string;
    definition: string;
    language: string;
    status: EntityStatus;
    aliases?: string[];
    synonyms?: string[];
    translations?: Record<string, {
        canonicalName: string;
        aliases?: string[];
        definition?: string;
    }>;
    domain?: string[];
    audience?: string[];
    parentId?: string;
    childIds?: string[];
    relatedEntityIds?: string[];
    externalIds?: Record<string, string>;
    citations?: string[];
    media?: string[];
    disambiguation?: string;
    usageNotes?: string;
    createdAt: string;
    updatedAt: string;
};
