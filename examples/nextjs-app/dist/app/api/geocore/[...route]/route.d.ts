export type RouteParams = {
    params: {
        route?: string[];
    };
};
/**
 * Universal Next.js 14+ App Router Catch-All Route Handler.
 */
export declare function GET(req: Request, { params }: RouteParams): Promise<Response>;
export declare function OPTIONS(): Promise<Response>;
