import type { KnowledgeObject, KnowledgeDataset, ResolvedMetadata } from "@mormox2/geocore";
/**
 * Next.js compatible Metadata interface (App Router).
 */
export type NextMetadata = {
    title?: string;
    description?: string;
    alternates?: {
        canonical?: string;
        languages?: Record<string, string>;
    };
    openGraph?: {
        title?: string;
        description?: string;
        url?: string;
        siteName?: string;
        locale?: string;
        type?: string;
        images?: Array<{
            url: string;
            width?: number;
            height?: number;
            alt?: string;
        }>;
    };
    robots?: {
        index?: boolean;
        follow?: boolean;
    };
    keywords?: string[];
    authors?: Array<{
        name: string;
        url?: string;
    }>;
    other?: Record<string, string | number | boolean>;
};
export type GenerateNextMetadataOptions = {
    siteName?: string;
    defaultLocale?: string;
    fallbackSiteUrl?: string;
    customDefaults?: Partial<ResolvedMetadata>;
};
/**
 * Generates a full Next.js App Router `Metadata` object from a KnowledgeObject
 * and its KnowledgeDataset.
 */
export declare function generateNextMetadata(object: KnowledgeObject, dataset: KnowledgeDataset, options?: GenerateNextMetadataOptions): NextMetadata;
