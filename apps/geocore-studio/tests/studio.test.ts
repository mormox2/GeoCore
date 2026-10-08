import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { verifyAnswerGrounding, contentTokens as aiContentTokens } from "@mormo_mossaab/geocore-ai";
import { DeterministicEmbeddingProvider } from "@mormo_mossaab/geocore-vector";
import { apiDatasetFixture, getAiContext } from "@mormo_mossaab/geocore";
import {
  contentTokens,
  verifyGrounding,
  embedText,
  hybridSearch,
  validateKnowledgeMarkdown,
} from "../engine.js";

describe("GeoCore Visual Studio Web Application", () => {
  const studioDir = path.resolve(__dirname, "..");

  it("contains valid index.html with all required studio tabs including Live Vector Chat", () => {
    const html = fs.readFileSync(path.join(studioDir, "index.html"), "utf-8");
    expect(html).toContain("GeoCore Studio");
    expect(html).toContain('data-tab="graph"');
    expect(html).toContain('data-tab="editor"');
    expect(html).toContain('data-tab="chat"');
    expect(html).toContain('data-tab="rag"');
    expect(html).toContain('data-tab="health"');
    expect(html).toContain('id="graphCanvas"');
    expect(html).toContain('id="markdownEditor"');
    expect(html).toContain('id="chatInput"');
    expect(html).toContain('id="vectorInspectorContent"');
  });

  it("contains curated CSS design system with chat and vector inspector styles", () => {
    const css = fs.readFileSync(path.join(studioDir, "styles.css"), "utf-8");
    expect(css).toContain("--bg-dark");
    expect(css).toContain("--accent-cyan");
    expect(css).toContain("--bg-card");
    expect(css).toContain(".glass-panel");
    expect(css).toContain(".chat-layout");
    expect(css).toContain(".vector-inspector");
    expect(css).toContain(".chat-bubble");
  });

  it("contains the JavaScript app wired to the studio engine", () => {
    const js = fs.readFileSync(path.join(studioDir, "app.js"), "utf-8");
    expect(js).toContain("DATASETS");
    expect(js).toContain("rtimidental");
    expect(js).toContain("dawajinpro");
    expect(js).toContain("renderGraph");
    expect(js).toContain("runLiveValidation");
    expect(js).toContain("setupLiveChat");
    expect(js).toContain("calculateGrounding");
    expect(js).toContain('from "./engine.js"');
    // No fixed scores may be displayed: every score comes from the engine.
    expect(js).not.toMatch(/groundingScore:\s*\d/);
    expect(js).not.toContain("85%");
  });

  describe("engine parity with the GeoCore packages", () => {
    const samples = [
      "Le détartrage n'abîme pas les dents lorsqu'il est réalisé par un dentiste.",
      "Professional dental scaling does not damage healthy enamel.",
      "Comment gérer les créances clients et les plateaux d'œufs ?",
    ];

    it("tokenises exactly like geocore-ai", () => {
      for (const text of samples) {
        expect(contentTokens(text)).toEqual(aiContentTokens(text));
      }
    });

    it("embeds exactly like DeterministicEmbeddingProvider", async () => {
      const provider = new DeterministicEmbeddingProvider(64);
      for (const text of samples) {
        const expected = await provider.embedText(text);
        embedText(text).forEach((v: number, i: number) => expect(v).toBeCloseTo(expected[i], 12));
      }
    });

    it("scores grounding exactly like verifyAnswerGrounding", () => {
      const ctx = getAiContext(apiDatasetFixture, { objectId: "ko_detartrage_abime_dents" }).data!;
      const evidence = {
        texts: [
          ctx.object.title,
          ctx.object.summary,
          ctx.object.body,
          ...ctx.entities.flatMap((e) => [e.canonicalName, e.definition, ...(e.aliases ?? [])]),
          ...ctx.citations.flatMap((c) => [c.quote ?? "", c.paraphrase ?? ""]),
          ...ctx.sources.flatMap((s) => [s.title, s.publisher ?? "", ...(s.authors ?? [])]),
        ],
        entities: ctx.entities.map((e) => ({ id: e.id, label: e.canonicalName })),
      };
      for (const answer of [
        ctx.object.body,
        ctx.object.body + " Le détartrage guérit définitivement le cancer.",
        "Les fusées de la NASA utilisent de l'hydrogène liquide.",
      ]) {
        const expected = verifyAnswerGrounding(answer, ctx);
        const actual = verifyGrounding(answer, evidence);
        expect(actual.score).toBe(expected.score);
        expect(actual.hallucinationRisk).toBe(expected.hallucinationRisk);
        expect(actual.unsupportedClaims).toEqual(expected.unsupportedClaims);
      }
    });
  });

  describe("engine behaviour", () => {
    const objects = [
      { id: "ko_a", title: "Le détartrage abîme-t-il les dents ?", summary: "Non, le détartrage n'abîme pas l'émail." },
      { id: "ko_b", title: "Gestion des créances clients", summary: "Suivi des impayés et relances." },
    ];

    it("ranks the relevant object first and reports real lexical matches", () => {
      const [top] = hybridSearch("Est-ce que le détartrage abîme l'émail ?", objects);
      expect(top.objectId).toBe("ko_a");
      expect(top.matchedQueryTerms).toBeGreaterThan(0);
      expect(hybridSearch("capitale de la France", objects).every((r) => r.matchedQueryTerms === 0)).toBe(true);
    });

    it("validates editor frontmatter instead of always passing", () => {
      const dataset = { name: "d", entities: [{ id: "entity_scaling" }], citations: [] };
      const valid = `---
id: "ko_a"
slug: "a"
title: "A"
summary: "S"
language: "fr"
status: "published"
version: "1"
author: "x"
createdAt: "2026-01-01"
updatedAt: "2026-01-01"
entities:
  - "entity_scaling"
---
Corps.`;
      expect(validateKnowledgeMarkdown(valid, dataset).every((s) => s.status === "passed")).toBe(true);

      const broken = valid.replace('status: "published"', 'status: "live"').replace('slug: "a"', 'slug: "A B"').replace('"entity_scaling"\n---', '"entity_unknown"\n---');
      const byName = Object.fromEntries(validateKnowledgeMarkdown(broken, dataset).map((s) => [s.name, s.status]));
      expect(byName["Statut & visibilité"]).toBe("error");
      expect(byName["Slug"]).toBe("error");
      expect(byName["Références"]).toBe("warning");
      expect(validateKnowledgeMarkdown("pas de frontmatter", dataset)[0].status).toBe("error");
    });
  });
});
