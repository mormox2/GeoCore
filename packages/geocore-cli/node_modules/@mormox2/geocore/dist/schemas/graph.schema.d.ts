import { z } from "zod";
export declare const graphNodeTypeSchema: z.ZodEnum<["knowledge-object", "entity", "author", "source", "citation", "media", "collection", "taxonomy-term", "glossary-entry", "external-reference"]>;
export declare const graphNodeSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["knowledge-object", "entity", "author", "source", "citation", "media", "collection", "taxonomy-term", "glossary-entry", "external-reference"]>;
    label: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
    id: string;
    label?: string | undefined;
    data?: any;
}, {
    type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
    id: string;
    label?: string | undefined;
    data?: any;
}>;
export declare const graphRegistrySchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["knowledge-object", "entity", "author", "source", "citation", "media", "collection", "taxonomy-term", "glossary-entry", "external-reference"]>;
        label: z.ZodOptional<z.ZodString>;
        data: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
        id: string;
        label?: string | undefined;
        data?: any;
    }, {
        type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
        id: string;
        label?: string | undefined;
        data?: any;
    }>, "many">;
    relationships: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sourceId: z.ZodString;
        targetId: z.ZodString;
        type: z.ZodEnum<["related_to", "parent_of", "child_of", "part_of", "requires", "explains", "cites", "authored_by", "mentions", "uses_media", "translation_of", "alternative_to", "contrasts_with", "example_of", "classified_as", "reviewed_by", "supports", "verifies"]>;
        strength: z.ZodEnum<["weak", "medium", "strong", "canonical"]>;
        reason: z.ZodOptional<z.ZodString>;
        confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of" | "classified_as" | "reviewed_by" | "supports" | "verifies";
        id: string;
        createdAt: string;
        updatedAt: string;
        sourceId: string;
        targetId: string;
        strength: "medium" | "weak" | "strong" | "canonical";
        confidence?: "low" | "medium" | "high" | undefined;
        reason?: string | undefined;
    }, {
        type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of" | "classified_as" | "reviewed_by" | "supports" | "verifies";
        id: string;
        createdAt: string;
        updatedAt: string;
        sourceId: string;
        targetId: string;
        strength: "medium" | "weak" | "strong" | "canonical";
        confidence?: "low" | "medium" | "high" | undefined;
        reason?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
        id: string;
        label?: string | undefined;
        data?: any;
    }[];
    relationships: {
        type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of" | "classified_as" | "reviewed_by" | "supports" | "verifies";
        id: string;
        createdAt: string;
        updatedAt: string;
        sourceId: string;
        targetId: string;
        strength: "medium" | "weak" | "strong" | "canonical";
        confidence?: "low" | "medium" | "high" | undefined;
        reason?: string | undefined;
    }[];
}, {
    nodes: {
        type: "knowledge-object" | "entity" | "author" | "source" | "citation" | "media" | "collection" | "taxonomy-term" | "glossary-entry" | "external-reference";
        id: string;
        label?: string | undefined;
        data?: any;
    }[];
    relationships: {
        type: "related_to" | "parent_of" | "child_of" | "part_of" | "requires" | "explains" | "cites" | "authored_by" | "mentions" | "uses_media" | "translation_of" | "alternative_to" | "contrasts_with" | "example_of" | "classified_as" | "reviewed_by" | "supports" | "verifies";
        id: string;
        createdAt: string;
        updatedAt: string;
        sourceId: string;
        targetId: string;
        strength: "medium" | "weak" | "strong" | "canonical";
        confidence?: "low" | "medium" | "high" | undefined;
        reason?: string | undefined;
    }[];
}>;
