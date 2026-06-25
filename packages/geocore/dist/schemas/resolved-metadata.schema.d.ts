import { z } from "zod";
export declare const resolvedMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    title: z.ZodString;
    summary: z.ZodString;
    language: z.ZodString;
    version: z.ZodString;
    status: z.ZodEnum<["draft", "review", "published", "archived"]>;
    author: z.ZodString;
    reviewer: z.ZodOptional<z.ZodString>;
    owner: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    publishedAt: z.ZodOptional<z.ZodString>;
    reviewedAt: z.ZodOptional<z.ZodString>;
    archivedAt: z.ZodOptional<z.ZodString>;
    canonicalUrl: z.ZodOptional<z.ZodString>;
    entities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    audiences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    collections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    citations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    trustLevel: z.ZodOptional<z.ZodString>;
    freshness: z.ZodOptional<z.ZodEnum<["stable", "periodic", "frequent", "live"]>>;
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        canonicalUrl: z.ZodOptional<z.ZodString>;
        robots: z.ZodOptional<z.ZodString>;
        keywords: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        description?: string | undefined;
        canonicalUrl?: string | undefined;
        robots?: string | undefined;
        keywords?: string[] | undefined;
    }, {
        title?: string | undefined;
        description?: string | undefined;
        canonicalUrl?: string | undefined;
        robots?: string | undefined;
        keywords?: string[] | undefined;
    }>>;
    ai: z.ZodOptional<z.ZodObject<{
        summaryShort: z.ZodOptional<z.ZodString>;
        summaryMedium: z.ZodOptional<z.ZodString>;
        summaryLong: z.ZodOptional<z.ZodString>;
        canonicalAnswer: z.ZodOptional<z.ZodString>;
        keyTakeaways: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        answerableQuestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        freshness: z.ZodOptional<z.ZodEnum<["stable", "periodic", "frequent", "live"]>>;
    }, "strip", z.ZodTypeAny, {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    }, {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    }>>;
    technical: z.ZodOptional<z.ZodObject<{
        sourceFormat: z.ZodOptional<z.ZodString>;
        renderTargets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        contentHash: z.ZodOptional<z.ZodString>;
        schemaVersion: z.ZodOptional<z.ZodString>;
        validationStatus: z.ZodOptional<z.ZodString>;
        indexingStatus: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    }, {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    }>>;
} & {
    resolvedAt: z.ZodString;
    resolvedFrom: z.ZodObject<{
        object: z.ZodBoolean;
        defaults: z.ZodBoolean;
        graph: z.ZodBoolean;
        collections: z.ZodBoolean;
        entities: z.ZodBoolean;
        citations: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        object: boolean;
        entities: boolean;
        collections: boolean;
        citations: boolean;
        defaults: boolean;
        graph: boolean;
    }, {
        object: boolean;
        entities: boolean;
        collections: boolean;
        citations: boolean;
        defaults: boolean;
        graph: boolean;
    }>;
    diagnostics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    language: string;
    author: string;
    title: string;
    status: "draft" | "review" | "published" | "archived";
    id: string;
    slug: string;
    summary: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string;
    resolvedFrom: {
        object: boolean;
        entities: boolean;
        collections: boolean;
        citations: boolean;
        defaults: boolean;
        graph: boolean;
    };
    canonicalUrl?: string | undefined;
    freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    reviewer?: string | undefined;
    owner?: string | undefined;
    publishedAt?: string | undefined;
    reviewedAt?: string | undefined;
    archivedAt?: string | undefined;
    entities?: string[] | undefined;
    topics?: string[] | undefined;
    domains?: string[] | undefined;
    audiences?: string[] | undefined;
    collections?: string[] | undefined;
    citations?: string[] | undefined;
    trustLevel?: string | undefined;
    seo?: {
        title?: string | undefined;
        description?: string | undefined;
        canonicalUrl?: string | undefined;
        robots?: string | undefined;
        keywords?: string[] | undefined;
    } | undefined;
    ai?: {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    } | undefined;
    technical?: {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    } | undefined;
    diagnostics?: string[] | undefined;
}, {
    language: string;
    author: string;
    title: string;
    status: "draft" | "review" | "published" | "archived";
    id: string;
    slug: string;
    summary: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string;
    resolvedFrom: {
        object: boolean;
        entities: boolean;
        collections: boolean;
        citations: boolean;
        defaults: boolean;
        graph: boolean;
    };
    canonicalUrl?: string | undefined;
    freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    reviewer?: string | undefined;
    owner?: string | undefined;
    publishedAt?: string | undefined;
    reviewedAt?: string | undefined;
    archivedAt?: string | undefined;
    entities?: string[] | undefined;
    topics?: string[] | undefined;
    domains?: string[] | undefined;
    audiences?: string[] | undefined;
    collections?: string[] | undefined;
    citations?: string[] | undefined;
    trustLevel?: string | undefined;
    seo?: {
        title?: string | undefined;
        description?: string | undefined;
        canonicalUrl?: string | undefined;
        robots?: string | undefined;
        keywords?: string[] | undefined;
    } | undefined;
    ai?: {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | "live" | undefined;
    } | undefined;
    technical?: {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    } | undefined;
    diagnostics?: string[] | undefined;
}>;
