export function createRendererOutput(input) {
    return {
        rendererId: input.rendererId,
        format: input.format,
        content: input.content,
        metadata: {
            generatedAt: new Date().toISOString(),
            sourceObjectId: input.sourceObjectId,
            sourceObjectVersion: input.sourceObjectVersion,
            language: input.language,
        },
        diagnostics: input.diagnostics || [],
    };
}
