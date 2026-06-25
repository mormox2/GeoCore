import { z } from "zod";
export declare const knowledgeRelationshipTypeSchema: z.ZodEnum<["related_to", "parent_of", "child_of", "part_of", "requires", "explains", "cites", "authored_by", "mentions", "uses_media", "translation_of", "alternative_to", "contrasts_with", "example_of"]>;
export declare const knowledgeRelationshipStrengthSchema: z.ZodEnum<["weak", "medium", "strong", "canonical"]>;
export declare const knowledgeRelationshipSchema: z.ZodObject<{
    id: z.ZodString;
    sourceId: z.ZodString;
    targetId: z.ZodString;
    type: z.ZodEnum<["related_to", "parent_of", "child_of", "part_of", "requires", "explains", "cites", "authored_by", "mentions", "uses_media", "translation_of", "alternative_to", "contrasts_with", "example_of"]>;
    strength: z.ZodEnum<["weak", "medium", "strong", "canonical"]>;
    reason: z.ZodOptional<z.ZodString>;
    confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of";
    id: string;
    createdAt: string;
    updatedAt: string;
    sourceId: string;
    targetId: string;
    strength: "medium" | "weak" | "strong" | "canonical";
    confidence?: "low" | "medium" | "high" | undefined;
    reason?: string | undefined;
}, {
    type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of";
    id: string;
    createdAt: string;
    updatedAt: string;
    sourceId: string;
    targetId: string;
    strength: "medium" | "weak" | "strong" | "canonical";
    confidence?: "low" | "medium" | "high" | undefined;
    reason?: string | undefined;
}>;
