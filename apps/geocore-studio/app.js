// ─── GeoCore Visual Studio Application Engine ─────────────────────────────────

import { hybridSearch, verifyGrounding, validateKnowledgeMarkdown } from "./engine.js";

const DATASETS = {
  rtimidental: {
    name: "RTimi Dental",
    objects: [
      { id: "ko_detartrage_abime_dents", title: "Le détartrage abîme-t-il les dents ?", status: "published", x: 250, y: 220, type: "knowledge-object", summary: "Non, le détartrage n'abîme pas l'émail lorsqu'il est réalisé avec des ultrasons professionnels." },
      { id: "ko_gingivite_definition", title: "Qu'est-ce que la gingivite ?", status: "published", x: 420, y: 150, type: "knowledge-object", summary: "La gingivite est une inflammation réversible de la gencive provoquée par la plaque bactérienne." },
      { id: "ko_implant_dentaire", title: "L'implant dentaire", status: "published", x: 500, y: 320, type: "knowledge-object", summary: "Une racine artificielle en titane ou zircone ancrée dans l'os pour remplacer une dent manquante." },
    ],
    entities: [
      { id: "entity_scaling", label: "Détartrage", type: "entity", category: "dental_procedure", x: 180, y: 360 },
      { id: "entity_tartar", label: "Tartre", type: "entity", category: "dental_concept", x: 340, y: 360 },
      { id: "entity_gingivitis", label: "Gingivite", type: "entity", category: "dental_condition", x: 380, y: 60 },
    ],
    citations: [
      { id: "cit_who_oral", label: "WHO Oral Health Factsheet", type: "citation", trust: "authoritative", x: 100, y: 180, source: "Organisation Mondiale de la Santé (2023)" },
      { id: "cit_clinical_rtimi", label: "Dr Mossaab Rtimi Clinical Study", type: "citation", trust: "high", x: 600, y: 200, source: "Étude Clinique RTimi Dental (2024)" },
    ],
    relationships: [
      { from: "ko_detartrage_abime_dents", to: "entity_scaling", label: "explains" },
      { from: "ko_detartrage_abime_dents", to: "entity_tartar", label: "mentions" },
      { from: "ko_detartrage_abime_dents", to: "cit_who_oral", label: "cites" },
      { from: "ko_gingivite_definition", to: "entity_gingivitis", label: "explains" },
      { from: "ko_implant_dentaire", to: "cit_clinical_rtimi", label: "cites" },
    ],
  },
  dawajinpro: {
    name: "Dawajin Pro",
    objects: [
      { id: "ko_creances_clients", title: "Gestion des créances clients", status: "published", x: 300, y: 200, type: "knowledge-object", summary: "Suivi des impayés, relances automatisées et limites de crédit pour les éleveurs et distributeurs." },
      { id: "ko_stock_volaille", title: "Gestion stock volaille & œufs", status: "published", x: 480, y: 260, type: "knowledge-object", summary: "Traçabilité des lots de poulets de chair, ponte quotidienne et alertes de mortalité." },
      { id: "ko_konnect_preprod", title: "Konnect Paiement Préproduction", status: "published", x: 220, y: 350, type: "knowledge-object", summary: "Guide d'intégration de la passerelle de paiement en ligne Konnect pour les transactions B2B." },
    ],
    entities: [
      { id: "entity_customer_balance", label: "Solde client", type: "entity", category: "business_concept", x: 180, y: 140 },
      { id: "entity_driver_role", label: "Rôle Chauffeur", type: "entity", category: "user_role", x: 420, y: 120 },
      { id: "entity_inventory", label: "Stock Vif", type: "entity", category: "inventory_concept", x: 580, y: 380 },
    ],
    citations: [
      { id: "cit_konnect_docs", label: "Documentation API Konnect", type: "citation", trust: "authoritative", x: 120, y: 300, source: "Spécification API Konnect v1" },
      { id: "cit_internal_policy", label: "Politique Recouvrement Dawajin", type: "citation", trust: "high", x: 440, y: 360, source: "Manuel d'exploitation financière Dawajin Pro" },
    ],
    relationships: [
      { from: "ko_creances_clients", to: "entity_customer_balance", label: "explains" },
      { from: "ko_creances_clients", to: "cit_internal_policy", label: "cites" },
      { from: "ko_konnect_preprod", to: "cit_konnect_docs", label: "cites" },
      { from: "ko_stock_volaille", to: "entity_inventory", label: "explains" },
    ],
  },
};

let currentDatasetKey = "rtimidental";
let selectedNode = null;
let currentFilter = "all";

// ─── Initialization ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupDatasetSwitch();
  updateMetrics();
  setupCanvas();
  setupLiveEditor();
  setupLiveChat();
  setupRagPlayground();
});

// ─── Tabs ────────────────────────────────────────────────────────────────────

function setupTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.remove("active");
      });
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) activePanel.classList.add("active");

      if (targetTab === "graph") {
        renderGraph();
      }
    });
  });
}

// ─── Dataset Switcher ────────────────────────────────────────────────────────

function setupDatasetSwitch() {
  const select = document.getElementById("datasetSelect");
  if (!select) return;

  select.addEventListener("change", (e) => {
    currentDatasetKey = e.target.value;
    selectedNode = null;
    updateMetrics();
    renderGraph();
    runLiveValidation();
  });

  const exportBtn = document.getElementById("btnExport");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      alert(
        `Le Studio est une prévisualisation : l'export statique du dataset "${DATASETS[currentDatasetKey].name}" ` +
          `se génère en ligne de commande avec « geocore export --config geocore.config.json ».`
      );
    });
  }
}

function updateMetrics() {
  const dataset = DATASETS[currentDatasetKey];
  document.getElementById("metricKoCount").textContent = dataset.objects.length;
  document.getElementById("metricEntityCount").textContent = dataset.entities.length;
  document.getElementById("metricCitationCount").textContent = dataset.citations.length;
  const mediaCount = document.getElementById("metricMediaCount");
  if (mediaCount) mediaCount.textContent = (dataset.media ?? []).length;

  // Health metrics computed from the loaded dataset (no fixed values).
  const linked = new Set(dataset.relationships.flatMap((r) => [r.from, r.to]));
  const orphans = dataset.objects.filter((o) => !linked.has(o.id));
  const published = dataset.objects.filter((o) => o.status === "published");
  const cited = dataset.objects.filter((o) =>
    dataset.relationships.some((r) => r.from === o.id && r.label === "cites")
  );
  setText("healthOrphans", orphans.length);
  setText("healthOrphansSub", orphans.length === 0 ? "Tous reliés au graphe" : orphans.map((o) => o.id).join(", "));
  setText("healthPublished", `${published.length}/${dataset.objects.length}`);
  setText("healthCited", `${cited.length}/${dataset.objects.length}`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

// ─── Canvas Visualizer ───────────────────────────────────────────────────────

let canvas, ctx;

function setupCanvas() {
  canvas = document.getElementById("graphCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 550;
    renderGraph();
  }

  window.addEventListener("resize", resizeCanvas);
  setTimeout(resizeCanvas, 50);

  // Filter chips
  document.querySelectorAll(".chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-btn").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderGraph();
    });
  });

  // Canvas click interaction
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dataset = DATASETS[currentDatasetKey];
    const allNodes = [...dataset.objects, ...dataset.entities, ...dataset.citations];

    let clicked = null;
    for (const node of allNodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < 22) {
        clicked = node;
        break;
      }
    }

    selectedNode = clicked;
    renderGraph();
    updateInspector();
  });
}

function renderGraph() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dataset = DATASETS[currentDatasetKey];

  // Draw Relationships
  dataset.relationships.forEach((rel) => {
    const fromNode = dataset.objects.find((o) => o.id === rel.from);
    const toNode =
      dataset.entities.find((e) => e.id === rel.to) ||
      dataset.citations.find((c) => c.id === rel.to);

    if (fromNode && toNode) {
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Relationship label
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = "#64748b";
      ctx.font = "10px system-ui";
      ctx.fillText(rel.label, midX - 10, midY - 4);
    }
  });

  // Draw Nodes
  const allNodes = [...dataset.objects, ...dataset.entities, ...dataset.citations];

  allNodes.forEach((node) => {
    if (currentFilter !== "all" && node.type !== currentFilter) return;

    const isSelected = selectedNode && selectedNode.id === node.id;
    ctx.beginPath();
    ctx.arc(node.x, node.y, isSelected ? 20 : 16, 0, Math.PI * 2);

    if (node.type === "knowledge-object") {
      ctx.fillStyle = "#0284c7"; // Cyan
    } else if (node.type === "entity") {
      ctx.fillStyle = "#8b5cf6"; // Purple
    } else {
      ctx.fillStyle = "#10b981"; // Emerald
    }

    ctx.fill();
    ctx.strokeStyle = isSelected ? "#fff" : "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.stroke();

    // Node Title / Label
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "11px system-ui";
    const label = node.title || node.label || node.id;
    ctx.fillText(label.slice(0, 24), node.x - 30, node.y + 30);
  });
}

function updateInspector() {
  const container = document.getElementById("inspectorContent");
  if (!container) return;

  if (!selectedNode) {
    container.innerHTML = `<p style="color: var(--text-dim);">Cliquez sur un nœud dans le graphe pour inspecter ses relations, métadonnées et citations.</p>`;
    return;
  }

  const dataset = DATASETS[currentDatasetKey];
  const relatedRels = dataset.relationships.filter(
    (r) => r.from === selectedNode.id || r.to === selectedNode.id
  );

  container.innerHTML = `
    <div style="background:#0b0f19; border:1px solid var(--border-glass); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:6px;">
      <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">${selectedNode.type}</span>
      <strong style="font-size:0.95rem; color:#fff;">${selectedNode.title || selectedNode.label}</strong>
      <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">${selectedNode.id}</span>
      ${selectedNode.summary ? `<p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${selectedNode.summary}</p>` : ""}
    </div>

    <div>
      <h4 style="font-size:0.85rem; margin-bottom:8px;">Relations (${relatedRels.length})</h4>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${relatedRels
          .map(
            (r) => `
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:6px 10px; border-radius:6px; font-size:0.75rem; display:flex; justify-content:space-between;">
            <span style="color:var(--accent-cyan);">${r.label}</span>
            <span style="color:var(--text-muted); font-family:var(--font-mono);">${r.to === selectedNode.id ? r.from : r.to}</span>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

// ─── Live Editor & Diagnostics ──────────────────────────────────────────────

function setupLiveEditor() {
  const editor = document.getElementById("markdownEditor");
  if (!editor) return;

  editor.addEventListener("input", () => {
    runLiveValidation();
  });

  runLiveValidation();
}

function runLiveValidation() {
  const out = document.getElementById("validationOutput");
  const editor = document.getElementById("markdownEditor");
  if (!out || !editor) return;

  const stages = validateKnowledgeMarkdown(editor.value, DATASETS[currentDatasetKey]);
  const icon = { passed: "✅ OK", warning: "⚠️ Avertissement", error: "❌ Erreur" };

  out.innerHTML =
    stages
      .map(
        (s, i) => `
    <div class="diag-item ${s.status}">
      <span><strong>${i + 1}. ${escapeHtml(s.name)}</strong> — ${escapeHtml(s.msg)}</span>
      <span>${icon[s.status]}</span>
    </div>`
      )
      .join("") +
    `<p style="font-size:0.75rem; color:var(--text-dim);">Contrôles locaux uniquement. Le pipeline complet en 10 étapes s'exécute avec « geocore validate ».</p>`;
}

// ─── Live Vector Chat & RRF Inspector ────────────────────────────────────────

function setupLiveChat() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("btnSendChat");
  const messagesBox = document.getElementById("chatMessages");
  const presets = document.querySelectorAll(".preset-btn");

  if (!input || !sendBtn || !messagesBox) return;

  function handleSend(userText) {
    if (!userText.trim()) return;

    // Append User Message
    const userMsg = document.createElement("div");
    userMsg.className = "chat-message user";
    userMsg.innerHTML = `
      <div class="chat-avatar">ME</div>
      <div class="chat-bubble">${escapeHtml(userText)}</div>
    `;
    messagesBox.appendChild(userMsg);
    input.value = "";
    messagesBox.scrollTop = messagesBox.scrollHeight;

    const { results, answer, top, grounding, sources } = answerFromDataset(userText);

    const botMsg = document.createElement("div");
    botMsg.className = "chat-message bot";
    botMsg.innerHTML = answer
      ? `
        <div class="chat-avatar">AI</div>
        <div class="chat-bubble">
          <p style="font-size:0.75rem; color:var(--text-muted);">📄 ${escapeHtml(top.title)}</p>
          <p>${escapeHtml(answer)}</p>
          <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
            <span class="score-badge ${grounding.hallucinationRisk}-risk">🛡️ Ancrage ${Math.round(grounding.score * 100)}%</span>
            ${sources.map((s) => `<span style="font-size:0.7rem; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:10px; color:var(--text-muted);">📚 ${escapeHtml(s)}</span>`).join("")}
          </div>
        </div>
      `
      : `
        <div class="chat-avatar">AI</div>
        <div class="chat-bubble"><p>Aucune réponse vérifiée dans le dataset « ${escapeHtml(DATASETS[currentDatasetKey].name)} » pour cette question.</p></div>
      `;
    messagesBox.appendChild(botMsg);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    updateVectorInspector(userText, results);
  }

  sendBtn.addEventListener("click", () => handleSend(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend(input.value);
  });

  presets.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-query");
      if (q) handleSend(q);
    });
  });
}

/** Evidence certified for an object: its own text plus linked entities and citations. */
function evidenceFor(dataset, obj) {
  const linkedIds = new Set(dataset.relationships.filter((r) => r.from === obj.id).map((r) => r.to));
  const entities = dataset.entities.filter((e) => linkedIds.has(e.id));
  const citations = dataset.citations.filter((c) => linkedIds.has(c.id));
  return {
    texts: [obj.title, obj.summary, ...entities.map((e) => e.label), ...citations.flatMap((c) => [c.label, c.source])],
    entities: entities.map((e) => ({ id: e.id, label: e.label })),
    sources: citations.map((c) => c.source || c.label),
  };
}

/**
 * Hybrid search over the embedded dataset, then an extractive answer: the summary of the
 * best object sharing terms with the question, verified with the grounding check.
 */
function answerFromDataset(query) {
  const dataset = DATASETS[currentDatasetKey];
  const results = hybridSearch(query, dataset.objects, { limit: 3 });
  const top = results.find((r) => r.matchedQueryTerms > 0);
  if (!top) return { results, answer: null };

  const obj = dataset.objects.find((o) => o.id === top.objectId);
  const evidence = evidenceFor(dataset, obj);
  const grounding = verifyGrounding(obj.summary, evidence);
  if (!grounding.isGrounded) return { results, answer: null };

  return { results, answer: obj.summary, top, grounding, sources: evidence.sources };
}

function updateVectorInspector(query, results) {
  const container = document.getElementById("vectorInspectorContent");
  if (!container) return;

  container.innerHTML = `
    <div style="background:#0b0f19; border:1px solid var(--border-glass); border-radius:8px; padding:10px;">
      <span style="font-size:0.75rem; color:var(--text-muted);">Requête analysée :</span>
      <p style="font-size:0.85rem; color:#fff; font-weight:600; margin-top:2px;">"${escapeHtml(query)}"</p>
    </div>

    <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">
      Classement Hybride RRF (Top Hits)
    </h4>

    <div style="display:flex; flex-direction:column; gap:8px;">
      ${results.length === 0 ? `<p style="color:var(--text-dim); font-size:0.8rem;">Aucun objet ne correspond.</p>` : ""}
      ${results
        .map(
          (hit, i) => `
        <div style="background:${i === 0 ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.02)"}; border:1px solid ${i === 0 ? "rgba(56,189,248,0.3)" : "var(--border-glass)"}; border-radius:8px; padding:10px; display:flex; flex-direction:column; gap:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:0.85rem; color:${i === 0 ? "var(--accent-cyan)" : "#fff"};">#${i + 1} ${escapeHtml(hit.title)}</strong>
            <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--accent-emerald);">RRF: ${hit.rrfScore}</span>
          </div>
          <div style="display:flex; gap:8px; font-size:0.75rem; color:var(--text-dim);">
            <span>📐 Cosinus: ${(hit.vectorSimilarity * 100).toFixed(0)}%</span>
            <span>📝 Lexical: ${hit.lexicalRank ? `Rang #${hit.lexicalRank}` : "Non trouvé"}</span>
            <span>⚡ Canal: ${hit.matchType}</span>
          </div>
        </div>`
        )
        .join("")}
    </div>
  `;
}

// ─── RAG & Grounding Playground ──────────────────────────────────────────────

function setupRagPlayground() {
  const btn = document.getElementById("btnVerifyGrounding");
  if (!btn) return;

  btn.addEventListener("click", () => {
    calculateGrounding();
  });

  calculateGrounding();
}

function calculateGrounding() {
  const resultDiv = document.getElementById("groundingResult");
  const queryInput = document.getElementById("ragQueryInput");
  const answerInput = document.getElementById("ragAnswerInput");
  if (!resultDiv || !queryInput || !answerInput) return;

  const dataset = DATASETS[currentDatasetKey];
  const top = hybridSearch(queryInput.value, dataset.objects, { limit: 1 }).find((r) => r.matchedQueryTerms > 0);
  if (!top) {
    resultDiv.innerHTML = `<p style="color:var(--text-muted);">Aucun objet du dataset « ${escapeHtml(dataset.name)} » ne correspond à la question : impossible de vérifier l'ancrage.</p>`;
    return;
  }

  const obj = dataset.objects.find((o) => o.id === top.objectId);
  const evidence = evidenceFor(dataset, obj);
  const result = verifyGrounding(answerInput.value, evidence);
  const riskLabel = { low: "Faible", medium: "Moyen", high: "Élevé" }[result.hallucinationRisk];
  const scoreColor = { low: "var(--accent-emerald)", medium: "#f59e0b", high: "#f43f5e" }[result.hallucinationRisk];

  resultDiv.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div style="background:#0b0f19; border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:12px;">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Score d'Ancrage</span>
        <strong style="font-size:1.4rem; color:${scoreColor};">${Math.round(result.score * 100)}%</strong>
      </div>
      <div style="background:#0b0f19; border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:12px;">
        <span style="font-size:0.75rem; color:var(--text-muted); display:block;">Risque d'Hallucination</span>
        <span class="score-badge ${result.hallucinationRisk}-risk" style="margin-top:4px;">${riskLabel}</span>
      </div>
    </div>

    <div style="background:#0b0f19; border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:12px; font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
      <strong style="color:var(--accent-cyan);">Preuve de référence : ${escapeHtml(obj.title)}</strong>
      <ul style="padding-left:18px; color:var(--text-muted); display:flex; flex-direction:column; gap:4px;">
        ${result.matchedEntities.map((id) => `<li>✅ Entité reconnue : <code>${escapeHtml(id)}</code></li>`).join("")}
        ${evidence.sources.map((s) => `<li>📚 Source liée : <em>${escapeHtml(s)}</em></li>`).join("")}
        ${
          result.unsupportedClaims.length === 0
            ? `<li>✅ Toutes les affirmations sont présentes dans la preuve</li>`
            : result.unsupportedClaims.map((c) => `<li>⚠️ Affirmation non étayée : « ${escapeHtml(c)} »</li>`).join("")
        }
      </ul>
    </div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
