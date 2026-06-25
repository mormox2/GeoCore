export const rtimidentalFixture = {
    id: "ko_detartrage_abime_dents",
    slug: "detartrage-abime-t-il-les-dents",
    title: "Le détartrage abîme-t-il les dents ?",
    summary: "Réponse claire sur les effets du détartrage sur l'émail et les gencives.",
    body: "Non, le détartrage n'abîme pas les dents. Il permet d'éliminer le tartre accumulé.",
    language: "fr",
    status: "published",
    version: "1.0.0",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
    author: "author_dr_mossaab_rtimi",
};
export const rtimiDentalNodes = [
    { id: "ko_detartrage_abime_dents", type: "knowledge-object", label: "Le détartrage abîme-t-il les dents ?" },
    { id: "entity_scaling", type: "entity", label: "Detartrage" },
    { id: "entity_tartar", type: "entity", label: "Tartre" },
    { id: "author_dr_mossaab_rtimi", type: "author", label: "Dr Mossaab Rtimi" }
];
export const rtimiDentalRelationships = [
    {
        id: "rel_rtimi_explains",
        sourceId: "ko_detartrage_abime_dents",
        targetId: "entity_scaling",
        type: "explains",
        strength: "canonical",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z"
    },
    {
        id: "rel_rtimi_mentions",
        sourceId: "ko_detartrage_abime_dents",
        targetId: "entity_tartar",
        type: "mentions",
        strength: "medium",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z"
    },
    {
        id: "rel_rtimi_authored_by",
        sourceId: "ko_detartrage_abime_dents",
        targetId: "author_dr_mossaab_rtimi",
        type: "authored_by",
        strength: "canonical",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z"
    }
];
