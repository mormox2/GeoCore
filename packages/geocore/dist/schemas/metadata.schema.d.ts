import { z } from "zod";
export declare const knowledgeStatusSchema: z.ZodEnum<["draft", "review", "published", "archived"]>;
export declare const metadataConfidenceSchema: z.ZodEnum<["low", "medium", "high"]>;
export declare const seoMetadataSchema: z.ZodOptional<z.ZodObject<{
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
export declare const aiMetadataSchema: z.ZodOptional<z.ZodObject<{
    summaryShort: z.ZodOptional<z.ZodString>;
    summaryMedium: z.ZodOptional<z.ZodString>;
    summaryLong: z.ZodOptional<z.ZodString>;
    canonicalAnswer: z.ZodOptional<z.ZodString>;
    keyTakeaways: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    answerableQuestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    freshness: z.ZodOptional<z.ZodEnum<["stable", "periodic", "frequent"]>>;
}, "strip", z.ZodTypeAny, {
    summaryShort?: string | undefined;
    summaryMedium?: string | undefined;
    summaryLong?: string | undefined;
    canonicalAnswer?: string | undefined;
    keyTakeaways?: string[] | undefined;
    confidence?: "low" | "medium" | "high" | undefined;
    answerableQuestions?: string[] | undefined;
    freshness?: "stable" | "periodic" | "frequent" | undefined;
}, {
    summaryShort?: string | undefined;
    summaryMedium?: string | undefined;
    summaryLong?: string | undefined;
    canonicalAnswer?: string | undefined;
    keyTakeaways?: string[] | undefined;
    confidence?: "low" | "medium" | "high" | undefined;
    answerableQuestions?: string[] | undefined;
    freshness?: "stable" | "periodic" | "frequent" | undefined;
}>>;
export declare const technicalMetadataSchema: z.ZodOptional<z.ZodObject<{
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
export declare const geoCoreMetadataSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    type: z.ZodString;
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
    entities: z.ZodArray<z.ZodString, "many">;
    topics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    domains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    audiences: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    collections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    citations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
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
        freshness: z.ZodOptional<z.ZodEnum<["stable", "periodic", "frequent"]>>;
    }, "strip", z.ZodTypeAny, {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | undefined;
    }, {
        summaryShort?: string | undefined;
        summaryMedium?: string | undefined;
        summaryLong?: string | undefined;
        canonicalAnswer?: string | undefined;
        keyTakeaways?: string[] | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        answerableQuestions?: string[] | undefined;
        freshness?: "stable" | "periodic" | "frequent" | undefined;
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
}, "strip", z.ZodTypeAny, {
    language: string;
    title: string;
    type: string;
    status: "draft" | "review" | "published" | "archived";
    id: string;
    slug: string;
    summary: string;
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    entities: string[];
    canonicalUrl?: string | undefined;
    reviewer?: string | undefined;
    owner?: string | undefined;
    publishedAt?: string | undefined;
    reviewedAt?: string | undefined;
    archivedAt?: string | undefined;
    topics?: string[] | undefined;
    domains?: string[] | undefined;
    audiences?: string[] | undefined;
    collections?: string[] | undefined;
    citations?: string[] | undefined;
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
        freshness?: "stable" | "periodic" | "frequent" | undefined;
    } | undefined;
    technical?: {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    } | undefined;
}, {
    language: string;
    title: string;
    type: string;
    status: "draft" | "review" | "published" | "archived";
    id: string;
    slug: string;
    summary: string;
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    entities: string[];
    canonicalUrl?: string | undefined;
    reviewer?: string | undefined;
    owner?: string | undefined;
    publishedAt?: string | undefined;
    reviewedAt?: string | undefined;
    archivedAt?: string | undefined;
    topics?: string[] | undefined;
    domains?: string[] | undefined;
    audiences?: string[] | undefined;
    collections?: string[] | undefined;
    citations?: string[] | undefined;
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
        freshness?: "stable" | "periodic" | "frequent" | undefined;
    } | undefined;
    technical?: {
        sourceFormat?: string | undefined;
        renderTargets?: string[] | undefined;
        contentHash?: string | undefined;
        schemaVersion?: string | undefined;
        validationStatus?: string | undefined;
        indexingStatus?: string | undefined;
    } | undefined;
}>;
