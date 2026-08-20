// ─── Sources ─────────────────────────────────────────────────────────────────
export const whoOralHealthSource = {
    id: "source_who_oral_health_2024",
    type: "official-documentation",
    title: "WHO Oral Health Fact Sheet",
    status: "active",
    visibility: "public",
    publisher: "World Health Organization",
    publicationDate: "2024-03-15",
    url: "https://www.who.int/news-room/fact-sheets/detail/oral-health",
    trustLevel: "authoritative",
    freshness: "stable",
    language: "en",
    summary: "WHO fact sheet on global oral health data and preventive strategies.",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const drMossaabProfessionalReview = {
    id: "source_dr_mossaab_professional_review_001",
    type: "professional-review",
    title: "Professional Dental Review by Dr Mossaab Rtimi",
    status: "active",
    visibility: "public",
    authors: ["Dr Mossaab Rtimi"],
    trustLevel: "high",
    freshness: "stable",
    language: "fr",
    summary: "Peer review of the RTimi Dental knowledge base by the lead dentist.",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const dawajinInternalReleaseNotes = {
    id: "source_dawajin_internal_release_notes_001",
    type: "internal-document",
    title: "Dawajin Pro Release Notes v1.0",
    status: "active",
    visibility: "internal",
    publisher: "Dawajin Team",
    publicationDate: "2026-01-10",
    trustLevel: "medium",
    freshness: "periodic",
    language: "fr",
    summary: "Internal release notes for the Dawajin Pro v1.0 launch.",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const deprecatedSource = {
    id: "source_deprecated_001",
    type: "news-source",
    title: "Old News Article (Deprecated)",
    status: "deprecated",
    visibility: "public",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
};
// ─── Citations ────────────────────────────────────────────────────────────────
export const scalingCitation = {
    id: "citation_scaling_safety_001",
    sourceId: "source_who_oral_health_2024",
    targetId: "ko_detartrage_abime_dents",
    purpose: "supports",
    status: "active",
    confidence: "authoritative",
    relevance: "high",
    paraphrase: "Professional dental scaling does not damage healthy enamel when performed correctly.",
    reviewedBy: "Dr Mossaab Rtimi",
    reviewedAt: "2026-06-25T10:00:00Z",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const professionalReviewCitation = {
    id: "citation_professional_review_001",
    sourceId: "source_dr_mossaab_professional_review_001",
    targetId: "ko_detartrage_abime_dents",
    purpose: "reviews",
    status: "active",
    confidence: "high",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const dawajinInternalCitation = {
    id: "citation_customer_balance_workflow_001",
    sourceId: "source_dawajin_internal_release_notes_001",
    targetId: "ko_customer_balance_management",
    purpose: "explains",
    status: "active",
    confidence: "medium",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const removedCitation = {
    id: "citation_removed_001",
    sourceId: "source_deprecated_001",
    targetId: "ko_detartrage_abime_dents",
    purpose: "references",
    status: "removed",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-06-01T00:00:00Z",
};
export const allSourcesFixture = [
    whoOralHealthSource,
    drMossaabProfessionalReview,
    dawajinInternalReleaseNotes,
];
export const allCitationsFixture = [
    scalingCitation,
    professionalReviewCitation,
    dawajinInternalCitation,
];
