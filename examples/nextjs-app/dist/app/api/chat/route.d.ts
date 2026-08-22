export type ChatRequestBody = {
    message: string;
    objectId?: string;
};
export type ChatResponsePayload = {
    answer: string;
    groundingScore: number;
    hallucinationRisk: "low" | "medium" | "high";
    groundedEntities: string[];
    sourcesCited: Array<{
        title: string;
        trustLevel: string;
        url?: string;
    }>;
    promptContextPreview: string;
};
/**
 * Next.js 14+ POST handler for AI / RAG conversational queries.
 */
export declare function POST(req: Request): Promise<Response>;
