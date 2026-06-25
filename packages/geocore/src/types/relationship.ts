export type KnowledgeRelationshipType =
  | "related_to"
  | "parent_of"
  | "child_of"
  | "part_of"
  | "requires"
  | "explains"
  | "cites"
  | "authored_by"
  | "mentions"
  | "uses_media"
  | "translation_of"
  | "alternative_to"
  | "contrasts_with"
  | "example_of"
  | "classified_as"
  | "reviewed_by"
  | "supports"
  | "verifies";

export type KnowledgeRelationshipStrength =
  | "weak"
  | "medium"
  | "strong"
  | "canonical";

export type KnowledgeRelationshipConfidence =
  | "low"
  | "medium"
  | "high";

export type KnowledgeRelationship = {
  id: string;
  sourceId: string;
  targetId: string;
  type: KnowledgeRelationshipType;
  strength: KnowledgeRelationshipStrength;
  confidence?: KnowledgeRelationshipConfidence;
  reason?: string;
  createdAt: string;
  updatedAt: string;
};
