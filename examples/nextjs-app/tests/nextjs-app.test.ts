import { describe, it, expect } from "vitest";
import { generateMetadata, default as KnowledgePage } from "../src/app/[lang]/[slug]/page.js";
import { GET } from "../src/app/api/geocore/[...route]/route.js";
import { POST as ChatPost } from "../src/app/api/chat/route.js";
import { formatChatWidgetResponse } from "../src/components/chat-widget.js";

describe("Next.js 14+ App Router Reference Application", () => {
  describe("Dynamic Knowledge Page & Metadata", () => {
    it("generates rich Next.js Metadata for knowledge object", async () => {
      const metadata = await generateMetadata({
        params: { lang: "fr", slug: "detartrage-abime-t-il-les-dents" },
      });

      expect(metadata.title).toBe("Le détartrage abîme-t-il les dents ?");
      expect(metadata.description).toContain("Réponse claire sur les effets du détartrage");
      expect(metadata.openGraph?.title).toBe("Le détartrage abîme-t-il les dents ?");
      expect(metadata.openGraph?.url).toBe("https://rtimidental.tn/detartrage-abime-t-il-les-dents");
      expect(metadata.alternates?.canonical).toBe("https://rtimidental.tn/detartrage-abime-t-il-les-dents");
    });

    it("renders page with JSON-LD Schema, Citations and Media views", async () => {
      const pageResult = await KnowledgePage({
        params: { lang: "fr", slug: "detartrage-abime-t-il-les-dents" },
      });

      expect(pageResult.status).toBe(200);
      expect(pageResult.title).toBe("Le détartrage abîme-t-il les dents ?");
      expect(pageResult.jsonLdHtml).toContain('<script type="application/ld+json"');
      expect(pageResult.jsonLdHtml).toContain("MedicalWebPage");
      expect(pageResult.citationBadges.length).toBeGreaterThan(0);
      expect(pageResult.citationBadges[0]).toContain("WHO");
      expect(pageResult.mediaViews.length).toBeGreaterThan(0);
      expect(pageResult.mediaViews[0]).toContain("<figure");
    });

    it("returns 404 status when knowledge object slug is invalid", async () => {
      const pageResult = await KnowledgePage({
        params: { lang: "fr", slug: "unknown-slug-xyz" },
      });
      expect(pageResult.status).toBe(404);
    });
  });

  describe("Universal Catch-All Route Handlers", () => {
    it("handles /api/geocore/llms.txt", async () => {
      const req = new Request("https://rtimidental.tn/api/geocore/llms.txt");
      const res = await GET(req, { params: { route: ["llms.txt"] } });
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain("# GeoCore Next.js Reference Knowledge Platform");
    });

    it("handles /api/geocore/sitemap.xml", async () => {
      const req = new Request("https://rtimidental.tn/api/geocore/sitemap.xml");
      const res = await GET(req, { params: { route: ["sitemap.xml"] } });
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/xml");
      const xml = await res.text();
      expect(xml).toContain("<urlset");
    });

    it("handles /api/geocore/search?q=détartrage", async () => {
      const req = new Request("https://rtimidental.tn/api/geocore/search?q=détartrage");
      const res = await GET(req, { params: { route: ["search"] } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("ok");
      expect(data.data.length).toBeGreaterThan(0);
    });

    it("handles /api/geocore/context/:id", async () => {
      const req = new Request("https://rtimidental.tn/api/geocore/context/ko_detartrage_abime_dents");
      const res = await GET(req, { params: { route: ["context", "ko_detartrage_abime_dents"] } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe("ok");
      expect(data.data.object.id).toBe("ko_detartrage_abime_dents");
    });
  });

  describe("RAG Chatbot API & Widget", () => {
    it("POST /api/chat generates grounded response with citations and risk score", async () => {
      const req = new Request("https://rtimidental.tn/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Est-ce que le détartrage abîme l'émail dentaire ?",
          objectId: "ko_detartrage_abime_dents",
        }),
      });

      const res = await ChatPost(req);
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.answer).toContain("n'abîme en aucun cas l'émail dentaire");
      expect(data.groundingScore).toBeGreaterThanOrEqual(0.7);
      expect(data.hallucinationRisk).toBe("low");
      expect(data.sourcesCited.length).toBeGreaterThan(0);
      expect(data.sourcesCited[0].title).toContain("World Health Organization");
    });

    it("formats chat widget response bubble with HTML and trust badges", () => {
      const html = formatChatWidgetResponse({
        answer: "Le détartrage protège les gencives.",
        groundingScore: 0.95,
        hallucinationRisk: "low",
        groundedEntities: ["Détartrage", "Tartre"],
        sourcesCited: [{ title: "OMS Rapport", trustLevel: "authoritative", url: "https://who.int" }],
        promptContextPreview: "...",
      });

      expect(html).toContain("geocore-chat-bubble");
      expect(html).toContain("Score d'ancrage : <strong>95%</strong>");
      expect(html).toContain("Risque: LOW");
      expect(html).toContain("OMS Rapport");
    });
  });
});
