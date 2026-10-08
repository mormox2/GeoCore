import { describe, it, expect } from "vitest";
import {
  createWidgetStyles,
  GeoCoreWidgetElement,
  initGeoCoreWidget,
  buildAnswerUrl,
  fetchWidgetAnswer,
  formatGroundingLabel,
} from "../src/widget/geocore-widget.js";

const groundedAnswer = {
  query: "q",
  answer: "Non, le détartrage n'abîme pas les dents.",
  objectId: "ko_detartrage_abime_dents",
  title: "Le détartrage abîme-t-il les dents ?",
  grounding: { score: 0.92, hallucinationRisk: "low", isGrounded: true, unsupportedClaims: [], matchedEntities: [] },
  sources: [{ id: "src_who", title: "WHO", url: "https://www.who.int", trustLevel: "authoritative" }],
};

function fakeFetch(status: number, body: unknown): typeof fetch {
  return (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}

describe("GeoCore Web Widget Engine", () => {
  it("generates scoped CSS rules for dark and light themes", () => {
    const darkCss = createWidgetStyles("dark", "#38bdf8");
    expect(darkCss).toContain(".gc-fab");
    expect(darkCss).toContain(".gc-window");
    expect(darkCss).toContain("#0d121f");
    expect(darkCss).toContain("#38bdf8");

    const lightCss = createWidgetStyles("light", "#2563eb");
    expect(lightCss).toContain("#ffffff");
    expect(lightCss).toContain("#2563eb");
  });

  it("exports custom element class and initialization helper", () => {
    expect(typeof GeoCoreWidgetElement).toBe("function");
    expect(typeof initGeoCoreWidget).toBe("function");
  });

  describe("API client", () => {
    it("builds the answer URL from absolute and relative API bases", () => {
      expect(buildAnswerUrl("https://api.example.com/api/", "Le tartre ?")).toBe(
        "https://api.example.com/api/answer?q=Le+tartre+%3F"
      );
      expect(buildAnswerUrl("/api", "x", "fr")).toBe("/api/answer?q=x&language=fr");
    });

    it("returns grounded answers from the API", async () => {
      const result = await fetchWidgetAnswer("/api", "q", {
        fetchImpl: fakeFetch(200, { status: "ok", data: groundedAnswer }),
      });
      expect(result.kind).toBe("answer");
      if (result.kind === "answer") expect(result.data.objectId).toBe("ko_detartrage_abime_dents");
    });

    it("refuses answers the server did not verify as grounded", async () => {
      const ungrounded = { ...groundedAnswer, grounding: { ...groundedAnswer.grounding, isGrounded: false } };
      const result = await fetchWidgetAnswer("/api", "q", {
        fetchImpl: fakeFetch(200, { status: "ok", data: ungrounded }),
      });
      expect(result.kind).toBe("no-answer");
    });

    it("maps no-answer, HTTP errors, malformed bodies and network failures", async () => {
      expect((await fetchWidgetAnswer("/api", "q", { fetchImpl: fakeFetch(200, { status: "no-answer", data: null }) })).kind).toBe("no-answer");
      expect((await fetchWidgetAnswer("/api", "q", { fetchImpl: fakeFetch(500, { status: "error" }) })).kind).toBe("error");
      expect((await fetchWidgetAnswer("/api", "q", { fetchImpl: fakeFetch(200, { status: "weird" }) })).kind).toBe("error");
      const failing = (async () => {
        throw new TypeError("network down");
      }) as typeof fetch;
      expect((await fetchWidgetAnswer("/api", "q", { fetchImpl: failing })).kind).toBe("error");
    });

    it("times out slow APIs", async () => {
      const hanging = ((_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        })) as typeof fetch;
      const result = await fetchWidgetAnswer("/api", "q", { fetchImpl: hanging, timeoutMs: 20 });
      expect(result.kind).toBe("error");
    });

    it("formats the grounding badge from the server score only", () => {
      expect(formatGroundingLabel(groundedAnswer.grounding as never)).toBe("🛡️ Ancrage 92% — risque faible");
    });
  });
});
