import type { KnowledgeObject } from "./knowledge-object.js";
import type { ResolvedMetadata } from "./metadata.js";
import type { KnowledgeCollection } from "./collection.js";
import type { GlossaryEntry } from "./glossary.js";
import type { MediaAsset } from "./media.js";
import type { RouteEntry, RouteAlternate, RouteRedirect } from "./route-entry.js";
import type { RouteDiagnostic } from "./route-diagnostic.js";

/**
 * The kind of source object a route points at.
 * Routes are output projections — they never become the source of truth.
 */
export type RouteType =
  | "knowledge-object"
  | "collection"
  | "glossary-entry"
  | "documentation"
  | "media"
  | "api"
  | "llms"
  | "sitemap"
  | "static";

/**
 * Who may see a route. Only public routes are eligible for public outputs.
 */
export type RouteVisibility =
  | "public"
  | "internal"
  | "private"
  | "hidden";

/**
 * Lifecycle status of a route, mirrored from the source object.
 */
export type RouteStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

/**
 * A language alternate for a route. Alternates must always be explicit —
 * the resolver never invents translated routes.
 */
export type { RouteAlternate, RouteRedirect } from "./route-entry.js";

/**
 * Pattern configuration for generating paths from source objects.
 * Placeholders supported: :language, :slug, :type
 */
export type RoutePatternConfig = {
  knowledgeObject?: string;
  collection?: string;
  glossaryEntry?: string;
  documentation?: string;
  media?: string;
};

/**
 * Input to resolveRoutes(). Objects are required; everything else is optional.
 * The resolver must not mutate this input.
 */
export type ResolveRoutesInput = {
  id: string;
  siteUrl?: string;

  objects: KnowledgeObject[];
  metadata?: Record<string, ResolvedMetadata>;
  collections?: KnowledgeCollection[];
  glossaryEntries?: GlossaryEntry[];
  media?: MediaAsset[];

  patterns?: RoutePatternConfig;

  explicitPaths?: Record<string, string>;
  explicitCanonicalUrls?: Record<string, string>;

  alternates?: Record<string, RouteAlternate[]>;
  redirects?: Record<string, RouteRedirect[]>;

  language?: string;
  visibility?: "public" | "internal";
};

/**
 * A registry of resolved routes plus the diagnostics produced while resolving.
 */
export type RouteRegistry = {
  id: string;
  siteUrl?: string;
  routes: RouteEntry[];
  generatedAt: string;
  diagnostics: RouteDiagnostic[];
};
