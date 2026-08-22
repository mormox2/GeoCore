import type { ChatResponsePayload } from "../app/api/chat/route.js";

/**
 * ChatWidget helper to format and render RAG AI assistant responses with citation badges.
 */
export function formatChatWidgetResponse(payload: ChatResponsePayload): string {
  const badgeColor =
    payload.hallucinationRisk === "low"
      ? "#10b981"
      : payload.hallucinationRisk === "medium"
      ? "#f59e0b"
      : "#f43f5e";

  const sourcesList = payload.sourcesCited
    .map(
      (s) =>
        `<li><a href="${s.url || '#'}" target="_blank" rel="noopener">📄 ${s.title}</a> <span style="font-size:0.75rem; color:#38bdf8;">[Trust: ${s.trustLevel}]</span></li>`
    )
    .join("\n");

  return `
<div class="geocore-chat-bubble" style="background:#1e293b; border-radius:12px; padding:16px; color:#f8fafc; font-family:sans-serif;">
  <div class="chat-answer" style="font-size:0.95rem; line-height:1.6; margin-bottom:12px;">
    ${payload.answer}
  </div>

  <div class="chat-grounding-bar" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px; font-size:0.8rem;">
    <span>Score d'ancrage : <strong>${(payload.groundingScore * 100).toFixed(0)}%</strong></span>
    <span style="color:${badgeColor}; font-weight:600;">Risque: ${payload.hallucinationRisk.toUpperCase()}</span>
  </div>

  ${
    payload.sourcesCited.length > 0
      ? `
  <div class="chat-sources" style="margin-top:8px; font-size:0.8rem;">
    <span style="color:#94a3b8;">Sources vérifiées :</span>
    <ul style="padding-left:18px; margin-top:4px; color:#cbd5e1;">
      ${sourcesList}
    </ul>
  </div>
  `
      : ""
  }
</div>
`.trim();
}
