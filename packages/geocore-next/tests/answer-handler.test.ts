import { describe, it, expect } from "vitest";
import { apiDatasetFixture, fetchWidgetAnswer } from "@mormo_mossaab/geocore";
import { handleAnswerApi } from "../src/handlers/answer-handler.js";

const ask = (q: string, extra = "") =>
  handleAnswerApi(apiDatasetFixture, new Request(`https://site.example/api/geocore/answer?q=${encodeURIComponent(q)}${extra}`));

describe("handleAnswerApi", () => {
  it("answers with sentences extracted from a published object", async () => {
    const res = await ask("Est-ce que le détartrage abîme l'émail ?");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");

    const object = apiDatasetFixture.objects.find((o) => o.id === body.data.objectId)!;
    expect(object.status).toBe("published");
    expect(object.body).toContain(body.data.answer);
    expect(body.data.grounding.isGrounded).toBe(true);
  });

  it("returns no-answer for unrelated questions", async () => {
    const body = await (await ask("Quelle est la capitale de la France ?")).json();
    expect(body).toEqual({ status: "no-answer", data: null });
  });

  it("never answers from draft objects", async () => {
    const draft = apiDatasetFixture.objects.find((o) => o.status !== "published")!;
    const body = await (await ask(draft.title)).json();
    expect(body.data?.objectId).not.toBe(draft.id);
  });

  it("validates the q parameter", async () => {
    expect((await handleAnswerApi(apiDatasetFixture, new URL("https://site.example/api/answer"))).status).toBe(400);
    expect((await ask("a".repeat(501))).status).toBe(400);
  });

  it("serves the embeddable widget contract", async () => {
    const fetchImpl = (async (input: string | URL | Request) =>
      handleAnswerApi(apiDatasetFixture, new URL(String(input), "https://site.example"))) as typeof fetch;

    const result = await fetchWidgetAnswer("/api/geocore", "Le détartrage abîme-t-il les dents ?", { fetchImpl });
    expect(result.kind).toBe("answer");
  });
});
