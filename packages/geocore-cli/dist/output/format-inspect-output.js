export function formatInspectOutput(dataset) {
    const lines = [];
    lines.push(`Objects: ${dataset.objects?.length ?? 0}`);
    lines.push(`Entities: ${dataset.entities?.length ?? 0}`);
    lines.push(`Relationships: ${dataset.relationships?.length ?? 0}`);
    lines.push(`Collections: ${dataset.collections?.length ?? 0}`);
    lines.push(`Taxonomy Terms: ${dataset.taxonomyTerms?.length ?? 0}`);
    lines.push(`Glossary Entries: ${dataset.glossaryEntries?.length ?? 0}`);
    lines.push(`Sources: ${dataset.sources?.length ?? 0}`);
    lines.push(`Citations: ${dataset.citations?.length ?? 0}`);
    lines.push(`Media: ${dataset.media?.length ?? 0}`);
    lines.push(`Diagnostics: ${dataset.diagnostics?.length ?? 0}`);
    return lines.join("\n");
}
