/**
 * GeoCore Next.js 14+ App Router Reference Application
 * Root Layout with Vercel Web Analytics integration
 *
 * In standard Next.js TSX applications with React:
 * ```tsx
 * import { Analytics } from "@vercel/analytics/next";
 *
 * export default function RootLayout({
 *   children,
 *   params,
 * }: {
 *   children: React.ReactNode;
 *   params: { lang?: string };
 * }) {
 *   return (
 *     <html lang={params?.lang || "fr"}>
 *       <head />
 *       <body>
 *         {children}
 *         <Analytics />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

export interface RootLayoutProps {
  children?: unknown;
  params?: {
    lang?: string;
  };
}

export interface RootLayoutResult {
  lang: string;
  hasAnalytics: boolean;
  analyticsScript: string;
  children: unknown;
}

/**
 * Generates the Vercel Web Analytics tracking snippet for Next.js and static export.
 */
export function getVercelAnalyticsSnippet(): string {
  return `<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script><script defer src="/_vercel/insights/script.js"></script>`;
}

/**
 * Next.js 14+ App Router Root Layout component.
 */
export default async function RootLayout({
  children,
  params,
}: RootLayoutProps): Promise<RootLayoutResult> {
  const lang = params?.lang || "fr";

  return {
    lang,
    hasAnalytics: true,
    analyticsScript: getVercelAnalyticsSnippet(),
    children,
  };
}

/**
 * Universal HTML renderer for the Root Layout.
 */
export function renderRootLayoutHtml({
  lang = "fr",
  title = "GeoCore Knowledge Platform",
  bodyContent = "",
  includeAnalytics = true,
}: {
  lang?: string;
  title?: string;
  bodyContent?: string;
  includeAnalytics?: boolean;
} = {}): string {
  const analytics = includeAnalytics ? `\n    ${getVercelAnalyticsSnippet()}` : "";
  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>${analytics}
  </head>
  <body>
    ${bodyContent}
  </body>
</html>`;
}
