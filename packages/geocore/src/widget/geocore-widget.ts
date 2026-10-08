/**
 * GeoCore Universal Web Widget (Embeddable Vanilla JS & Shadow DOM)
 * Plug-and-play semantic search and RAG assistant for WordPress, Shopify, Webflow, and HTML sites.
 */

import { escapeHtml, sanitizeUrl } from "../renderer/html-safety.js";

export interface GeoCoreWidgetConfig {
  /** Base URL of a GeoCore API (geocore serve), e.g. "https://api.example.com/api". Default "/api". */
  apiUrl?: string;
  datasetId?: string;
  /** Restricts answers to one language (e.g. "fr"). */
  language?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  theme?: "dark" | "light";
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left";
  autoOpen?: boolean;
}

export type WidgetAnswerSource = {
  id: string;
  title: string;
  url?: string;
  publisher?: string;
  trustLevel: string;
};

export type WidgetAnswerGrounding = {
  score: number;
  hallucinationRisk: "low" | "medium" | "high";
  isGrounded: boolean;
  unsupportedClaims: string[];
  matchedEntities: string[];
};

export type WidgetAnswer = {
  query: string;
  answer: string;
  objectId: string;
  title: string;
  slug?: string;
  language?: string;
  grounding: WidgetAnswerGrounding;
  sources: WidgetAnswerSource[];
};

export type WidgetAnswerResult =
  | { kind: "answer"; data: WidgetAnswer }
  | { kind: "no-answer"; message: string }
  | { kind: "error"; message: string };

export type FetchWidgetAnswerOptions = {
  language?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

const NO_ANSWER_MESSAGE =
  "Je n'ai pas trouvé de réponse vérifiée dans la base de connaissances pour cette question.";
const ERROR_MESSAGE = "Le service de connaissances est momentanément indisponible. Veuillez réessayer.";

/** Builds the /answer endpoint URL for a GeoCore API base URL (absolute or relative). */
export function buildAnswerUrl(apiUrl: string, question: string, language?: string): string {
  const params = new URLSearchParams({ q: question });
  if (language) params.set("language", language);
  return `${apiUrl.replace(/\/+$/, "")}/answer?${params.toString()}`;
}

function isWidgetAnswer(value: unknown): value is WidgetAnswer {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const grounding = v.grounding as Record<string, unknown> | undefined;
  return (
    typeof v.answer === "string" &&
    typeof v.objectId === "string" &&
    typeof v.title === "string" &&
    Array.isArray(v.sources) &&
    !!grounding &&
    typeof grounding.score === "number" &&
    typeof grounding.isGrounded === "boolean"
  );
}

/**
 * Asks a GeoCore API for a grounded answer. Never throws: network failures, timeouts and
 * malformed responses are returned as { kind: "error" }, and an answer is only accepted
 * when the server reports it as grounded.
 */
export async function fetchWidgetAnswer(
  apiUrl: string,
  question: string,
  options: FetchWidgetAnswerOptions = {}
): Promise<WidgetAnswerResult> {
  const fetchImpl = options.fetchImpl ?? (typeof fetch === "function" ? fetch : undefined);
  if (!fetchImpl) return { kind: "error", message: ERROR_MESSAGE };

  const controller = typeof AbortController === "function" ? new AbortController() : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), options.timeoutMs ?? 15000) : undefined;

  try {
    const res = await fetchImpl(buildAnswerUrl(apiUrl, question, options.language), {
      headers: { Accept: "application/json" },
      signal: controller?.signal,
    });
    if (!res.ok) return { kind: "error", message: ERROR_MESSAGE };

    const body = (await res.json()) as { status?: string; data?: unknown };
    if (body.status === "ok" && isWidgetAnswer(body.data) && body.data.grounding.isGrounded) {
      return { kind: "answer", data: body.data };
    }
    if (body.status === "no-answer" || body.status === "ok") {
      return { kind: "no-answer", message: NO_ANSWER_MESSAGE };
    }
    return { kind: "error", message: ERROR_MESSAGE };
  } catch {
    return { kind: "error", message: ERROR_MESSAGE };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Human-readable grounding badge, computed from the server's verification result only. */
export function formatGroundingLabel(grounding: WidgetAnswerGrounding): string {
  const risk = { low: "faible", medium: "moyen", high: "élevé" }[grounding.hallucinationRisk];
  return `🛡️ Ancrage ${Math.round(grounding.score * 100)}% — risque ${risk}`;
}

export function createWidgetStyles(theme: "dark" | "light" = "dark", primaryColor = "#38bdf8"): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#0d121f" : "#ffffff";
  const text = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const cardBg = isDark ? "#121826" : "#f8fafc";
  const border = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  return `
    :host {
      all: initial;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
      z-index: 999999;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Floating Action Button */
    .gc-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${primaryColor}, #3b82f6);
      color: #fff;
      border: none;
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 1000000;
    }

    .gc-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(56, 189, 248, 0.6);
    }

    /* Modal / Drawer Window */
    .gc-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 540px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: ${bg};
      color: ${text};
      border: 1px solid ${border};
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
      z-index: 1000000;
    }

    .gc-window.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    .gc-header {
      padding: 16px;
      background: ${cardBg};
      border-bottom: 1px solid ${border};
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .gc-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .gc-badge {
      background: ${primaryColor};
      color: #fff;
      font-weight: bold;
      font-size: 11px;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gc-title {
      font-size: 14px;
      font-weight: 600;
    }

    .gc-subtitle {
      font-size: 11px;
      color: ${textMuted};
    }

    .gc-close-btn {
      background: transparent;
      border: none;
      color: ${textMuted};
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .gc-close-btn:hover {
      color: ${text};
    }

    /* Messages Area */
    .gc-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .gc-msg {
      display: flex;
      gap: 8px;
      max-width: 85%;
      font-size: 13px;
      line-height: 1.5;
    }

    .gc-msg.bot {
      align-self: flex-start;
    }

    .gc-msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .gc-bubble {
      padding: 10px 14px;
      border-radius: 12px;
    }

    .gc-msg.bot .gc-bubble {
      background: ${cardBg};
      border: 1px solid ${border};
    }

    .gc-msg.user .gc-bubble {
      background: ${primaryColor};
      color: #fff;
    }

    .gc-guardrail-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      padding: 2px 6px;
      border-radius: 8px;
      margin-top: 6px;
      font-weight: 600;
    }

    /* Input Footer */
    .gc-guardrail-tag.risk-medium {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .gc-answer-title {
      font-size: 11px;
      color: ${textMuted};
      margin-bottom: 4px;
    }

    .gc-sources {
      margin-top: 6px;
      padding-left: 16px;
      font-size: 11px;
      color: ${textMuted};
    }

    .gc-sources a {
      color: ${primaryColor};
    }

    .gc-msg.bot.error .gc-bubble,
    .gc-msg.bot.pending .gc-bubble {
      color: ${textMuted};
      font-style: italic;
    }

    .gc-footer {
      padding: 12px 16px;
      background: ${cardBg};
      border-top: 1px solid ${border};
      display: flex;
      gap: 8px;
    }

    .gc-input {
      flex: 1;
      background: ${bg};
      border: 1px solid ${border};
      color: ${text};
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
    }

    .gc-input:focus {
      border-color: ${primaryColor};
    }

    .gc-send-btn {
      background: ${primaryColor};
      color: #fff;
      border: none;
      padding: 0 14px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
  `;
}

// Universal base class support for both browser and SSR / Node environments
const CustomElementBase: { new(): HTMLElement } =
  typeof HTMLElement !== "undefined" ? HTMLElement : (class {} as unknown as { new(): HTMLElement });

export class GeoCoreWidgetElement extends CustomElementBase {
  private config: GeoCoreWidgetConfig = {};
  private isOpen = false;

  constructor() {
    super();
    if (typeof this.attachShadow === "function") {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback(): void {
    this.readAttributes();
    this.render();
    this.bindEvents();
  }

  private readAttributes(): void {
    if (typeof this.getAttribute !== "function") return;
    this.config = {
      apiUrl: this.getAttribute("data-api-url") || "/api",
      datasetId: this.getAttribute("data-dataset") || "default",
      language: this.getAttribute("data-language") || undefined,
      title: this.getAttribute("data-title") || "GeoCore Assistant",
      subtitle: this.getAttribute("data-subtitle") || "Knowledge OS & RAG",
      placeholder: this.getAttribute("data-placeholder") || "Posez une question...",
      theme: (this.getAttribute("data-theme") as "dark" | "light") || "dark",
      primaryColor: this.getAttribute("data-primary-color") || "#38bdf8",
      autoOpen: this.hasAttribute("data-auto-open"),
    };
  }

  public setConfig(customConfig: Partial<GeoCoreWidgetConfig>): void {
    this.config = { ...this.config, ...customConfig };
    this.render();
    this.bindEvents();
  }

  private render(): void {
    if (!this.shadowRoot) return;

    const styleEl = document.createElement("style");
    styleEl.textContent = createWidgetStyles(this.config.theme, this.config.primaryColor);

    const container = document.createElement("div");
    container.innerHTML = `
      <button class="gc-fab" id="gcFab">💬</button>
      <div class="gc-window ${this.config.autoOpen ? "open" : ""}" id="gcWindow">
        <header class="gc-header">
          <div class="gc-brand">
            <div class="gc-badge">GC</div>
            <div>
              <div class="gc-title">${escapeHtml(this.config.title || "GeoCore")}</div>
              <div class="gc-subtitle">${escapeHtml(this.config.subtitle || "")}</div>
            </div>
          </div>
          <button class="gc-close-btn" id="gcClose">✕</button>
        </header>

        <div class="gc-messages" id="gcMessages">
          <div class="gc-msg bot">
            <div class="gc-bubble">
              Bonjour ! Je suis l'assistant propulsé par GeoCore. Comment puis-je vous renseigner aujourd'hui ?
            </div>
          </div>
        </div>

        <div class="gc-footer">
          <input type="text" class="gc-input" id="gcInput" placeholder="${escapeHtml(this.config.placeholder || "Posez une question...")}" />
          <button class="gc-send-btn" id="gcSend">Envoyer</button>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(container);
  }

  private bindEvents(): void {
    if (!this.shadowRoot) return;

    const fab = this.shadowRoot.getElementById("gcFab");
    const closeBtn = this.shadowRoot.getElementById("gcClose");
    const windowEl = this.shadowRoot.getElementById("gcWindow");
    const input = this.shadowRoot.getElementById("gcInput") as HTMLInputElement | null;
    const sendBtn = this.shadowRoot.getElementById("gcSend");
    const messagesBox = this.shadowRoot.getElementById("gcMessages");

    fab?.addEventListener("click", () => {
      this.isOpen = !this.isOpen;
      windowEl?.classList.toggle("open", this.isOpen);
      if (this.isOpen && input) input.focus();
    });

    closeBtn?.addEventListener("click", () => {
      this.isOpen = false;
      windowEl?.classList.remove("open");
    });

    let pending = false;

    const handleSend = async () => {
      if (pending || !input || !input.value.trim() || !messagesBox) return;
      const text = input.value.trim();
      pending = true;

      const userMsg = document.createElement("div");
      userMsg.className = "gc-msg user";
      const userBubble = document.createElement("div");
      userBubble.className = "gc-bubble";
      userBubble.textContent = text;
      userMsg.appendChild(userBubble);
      messagesBox.appendChild(userMsg);
      input.value = "";

      const botMsg = document.createElement("div");
      botMsg.className = "gc-msg bot pending";
      const botBubble = document.createElement("div");
      botBubble.className = "gc-bubble";
      botBubble.textContent = "Recherche dans la base de connaissances…";
      botMsg.appendChild(botBubble);
      messagesBox.appendChild(botMsg);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      try {
        const result = await fetchWidgetAnswer(this.config.apiUrl || "/api", text, {
          language: this.config.language,
        });
        botMsg.className = result.kind === "error" ? "gc-msg bot error" : "gc-msg bot";
        botBubble.replaceChildren(...renderAnswerNodes(result));
      } finally {
        pending = false;
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    };

    sendBtn?.addEventListener("click", () => void handleSend());
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") void handleSend();
    });
  }
}

/** Builds the bot bubble content with DOM APIs only (no innerHTML), so server data cannot inject markup. */
function renderAnswerNodes(result: WidgetAnswerResult): Node[] {
  if (result.kind !== "answer") {
    return [document.createTextNode(result.message)];
  }

  const { data } = result;
  const nodes: Node[] = [];

  const title = document.createElement("div");
  title.className = "gc-answer-title";
  title.textContent = `📄 ${data.title}`;
  nodes.push(title);

  const answer = document.createElement("p");
  answer.textContent = data.answer;
  nodes.push(answer);

  if (data.sources.length > 0) {
    const list = document.createElement("ul");
    list.className = "gc-sources";
    for (const source of data.sources) {
      const item = document.createElement("li");
      const url = sanitizeUrl(source.url);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = source.title;
        item.appendChild(link);
      } else {
        item.textContent = source.title;
      }
      list.appendChild(item);
    }
    nodes.push(list);
  }

  const badge = document.createElement("div");
  badge.className = `gc-guardrail-tag risk-${data.grounding.hallucinationRisk}`;
  badge.textContent = formatGroundingLabel(data.grounding);
  nodes.push(badge);

  return nodes;
}

// Auto-register custom element in browser environment
if (typeof customElements !== "undefined" && !customElements.get("geocore-widget")) {
  customElements.define("geocore-widget", GeoCoreWidgetElement);
}

export function initGeoCoreWidget(config: GeoCoreWidgetConfig = {}): GeoCoreWidgetElement | null {
  if (typeof document === "undefined") return null;
  let widget = document.querySelector("geocore-widget") as GeoCoreWidgetElement | null;
  if (!widget) {
    widget = document.createElement("geocore-widget") as GeoCoreWidgetElement;
    document.body.appendChild(widget);
  }
  widget.setConfig(config);
  return widget;
}
