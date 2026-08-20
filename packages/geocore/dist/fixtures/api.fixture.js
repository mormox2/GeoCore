import { rtimidentalFixture, rtimiDentalRelationships } from "./rtimidental.fixture.js";
import { dawajinProObjectContent } from "./loader.fixture.js";
import { allSourcesFixture, allCitationsFixture } from "./citation.fixture.js";
import { allMediaFixture } from "./media.fixture.js";
export const apiEntitiesFixture = [
    {
        id: "entity_scaling",
        type: "dental_procedure",
        canonicalName: "Détartrage",
        definition: "Action d'éliminer le tartre dentaire.",
        language: "fr",
        status: "published",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
    },
    {
        id: "entity_tartar",
        type: "dental_concept",
        canonicalName: "Tartre",
        definition: "Plaque dentaire minéralisée.",
        language: "fr",
        status: "published",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
    },
    {
        id: "entity_draft",
        type: "concept",
        canonicalName: "Brouillon",
        definition: "Concept non publié.",
        language: "fr",
        status: "draft",
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
    },
];
export const draftKnowledgeObject = {
    id: "ko_draft_internal_note",
    slug: "note-interne-brouillon",
    title: "Note interne confidentielle",
    summary: "Document de travail interne.",
    body: "Contenu confidentiel de travail non destiné à la publication.",
    language: "fr",
    status: "draft",
    version: "0.1.0",
    author: "author_internal",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const archivedKnowledgeObject = {
    id: "ko_archived_record",
    slug: "archived-record",
    title: "Archived Knowledge Record",
    summary: "Archived historical document.",
    body: "Archived content no longer active.",
    language: "fr",
    status: "archived",
    version: "0.1.0",
    author: "author_admin",
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
};
export const apiKnowledgeObjectsFixture = [
    rtimidentalFixture,
    {
        ...dawajinProObjectContent,
        createdAt: "2026-06-25T10:00:00Z",
        updatedAt: "2026-06-25T10:00:00Z",
    },
    draftKnowledgeObject,
    archivedKnowledgeObject,
];
export const apiDatasetFixture = {
    id: "dataset_test_api",
    name: "API Test Dataset",
    objects: apiKnowledgeObjectsFixture,
    entities: apiEntitiesFixture,
    relationships: rtimiDentalRelationships,
    collections: [],
    taxonomyTerms: [],
    glossaryEntries: [],
    sources: allSourcesFixture,
    citations: allCitationsFixture,
    media: allMediaFixture,
    loadedAt: "2026-06-25T10:00:00Z",
    diagnostics: [],
};
