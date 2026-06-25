export type TaxonomyStatus = "draft" | "published" | "deprecated";
export type TaxonomyType = "domain" | "category" | "tag" | "topic" | "audience" | "industry" | "language" | "difficulty" | "product-area" | "content-type" | "trust-level" | "freshness-level" | "region" | "role" | "workflow";
export type TaxonomyTerm = {
    id: string;
    type: TaxonomyType;
    slug: string;
    label: string | Record<string, string>;
    description: string | Record<string, string>;
    status: TaxonomyStatus;
    parentId?: string;
    childIds?: string[];
    aliases?: string[];
    translations?: Record<string, {
        label: string;
        description?: string;
        aliases?: string[];
    }>;
    order?: number;
    visibility?: "public" | "internal" | "hidden";
    replacedBy?: string;
    createdAt: string;
    updatedAt: string;
};
