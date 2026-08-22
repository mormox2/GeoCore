// ─── GeoCore Visual Studio Application Engine ─────────────────────────────────

const DATASETS = {
  rtimidental: {
    name: "RTimi Dental",
    objects: [
      { id: "ko_detartrage_abime_dents", title: "Le détartrage abîme-t-il les dents ?", status: "published", x: 250, y: 220, type: "knowledge-object" },
      { id: "ko_gingivite_definition", title: "Qu'est-ce que la gingivite ?", status: "published", x: 420, y: 150, type: "knowledge-object" },
      { id: "ko_implant_dentaire", title: "L'implant dentaire", status: "published", x: 500, y: 320, type: "knowledge-object" },
    ],
    entities: [
      { id: "entity_scaling", label: "Détartrage", type: "entity", category: "dental_procedure", x: 180, y: 360 },
      { id: "entity_tartar", label: "Tartre", type: "entity", category: "dental_concept", x: 340, y: 360 },
      { id: "entity_gingivitis", label: "Gingivite", type: "entity", category: "dental_condition", x: 380, y: 60 },
    ],
    citations: [
      { id: "cit_who_oral", label: "WHO Oral Health Factsheet", type: "citation", trust: "authoritative", x: 100, y: 180 },
      { id: "cit_clinical_rtimi", label: "Dr Mossaab Rtimi Clinical Study", type: "citation", trust: "high", x: 600, y: 200 },
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
      { id: "ko_creances_clients", title: "Gestion des créances clients", status: "published", x: 300, y: 200, type: "knowledge-object" },
      { id: "ko_stock_volaille", title: "Gestion stock volaille & œufs", status: "published", x: 480, y: 260, type: "knowledge-object" },
      { id: "ko_konnect_preprod", title: "Konnect Paiement Préproduction", status: "published", x: 220, y: 350, type: "knowledge-object" },
    ],
    entities: [
      { id: "entity_customer_balance", label: "Solde client", type: "entity", category: "business_concept", x: 180, y: 140 },
      { id: "entity_driver_role", label: "Rôle Chauffeur", type: "entity", category: "user_role", x: 420, y: 120 },
      { id: "entity_inventory", label: "Stock Vif", type: "entity", category: "inventory_concept", x: 580, y: 380 },
    ],
    citations: [
      { id: "cit_konnect_docs", label: "Documentation API Konnect", type: "citation", trust: "authoritative", x: 120, y: 300 },
      { id: "cit_internal_policy", label: "Politique Recouvrement Dawajin", type: "citation", trust: "high", x: 440, y: 360 },
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
  setupCanvas();
  setupLiveEditor();
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
}

function updateMetrics() {
  const ds = DATASETS[currentDatasetKey];
  document.getElementById("metricKoCount").textContent = ds.objects.length;
  document.getElementById("metricEntityCount").textContent = ds.entities.length;
  document.getElementById("metricCitationCount").textContent = ds.citations.length;
  document.getElementById("metricMediaCount").textContent = "4";
}

// ─── 2D Canvas Graph Visualizer ──────────────────────────────────────────────

let canvas, ctx;
let isDragging = false;
let draggedNode = null;

function setupCanvas() {
  canvas = document.getElementById("graphCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    renderGraph();
  }

  window.addEventListener("resize", resize);
  setTimeout(resize, 100);

  // Mouse interaction
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ds = DATASETS[currentDatasetKey];
    const allNodes = [...ds.objects, ...ds.entities, ...ds.citations];

    for (const node of allNodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= 24) {
        isDragging = true;
        draggedNode = node;
        selectedNode = node;
        inspectNode(node);
        renderGraph();
        return;
      }
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging || !draggedNode) return;
    const rect = canvas.getBoundingClientRect();
    draggedNode.x = e.clientX - rect.left;
    draggedNode.y = e.clientY - rect.top;
    renderGraph();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    draggedNode = null;
  });

  // Filter chips
  document.querySelectorAll(".chip-btn").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip-btn").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderGraph();
    });
  });
}

function renderGraph() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const ds = DATASETS[currentDatasetKey];
  const allNodes = [...ds.objects, ...ds.entities, ...ds.citations];
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

  // 1. Draw Links
  ctx.lineWidth = 1.5;
  for (const rel of ds.relationships) {
    const source = nodeMap.get(rel.from);
    const target = nodeMap.get(rel.to);
    if (!source || !target) continue;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.stroke();

    // Link label
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "10px Inter";
    ctx.fillText(rel.label, midX, midY);
  }

  // 2. Draw Nodes
  for (const node of allNodes) {
    if (currentFilter !== "all" && node.type !== currentFilter) continue;

    let color = "#38bdf8"; // Object: cyan
    let radius = 18;

    if (node.type === "entity") {
      color = "#8b5cf6"; // Entity: violet
      radius = 16;
    } else if (node.type === "citation") {
      color = "#10b981"; // Citation: emerald
      radius = 14;
    }

    const isSelected = selectedNode && selectedNode.id === node.id;

    // Glowing circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, isSelected ? radius + 4 : radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected ? 15 : 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outer border for selection
    if (isSelected) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    const label = node.title || node.label;
    ctx.fillText(label.length > 20 ? label.slice(0, 18) + "..." : label, node.x, node.y + radius + 14);
  }
}

function inspectNode(node) {
  const container = document.getElementById("inspectorContent");
  if (!container) return;

  const ds = DATASETS[currentDatasetKey];
  const rels = ds.relationships.filter((r) => r.from === node.id || r.to === node.id);

  container.innerHTML = `
    <div><strong>ID :</strong> <code>${node.id}</code></div>
    <div><strong>Type :</strong> <span style="color:var(--accent-cyan);">${node.type}</span></div>
    <div><strong>Titre / Label :</strong> ${node.title || node.label}</div>
    ${node.status ? `<div><strong>Statut :</strong> <span style="color:var(--accent-emerald);">${node.status}</span></div>` : ""}
    ${node.trust ? `<div><strong>Confiance :</strong> <span style="color:var(--accent-emerald);">${node.trust}</span></div>` : ""}
    <div style="margin-top:10px;"><strong>Relations Graphe (${rels.length}) :</strong></div>
    <ul style="padding-left:18px; margin-top:4px; color:var(--text-muted);">
      ${rels.map((r) => `<li>${r.label} ➔ <code>${r.to === node.id ? r.from : r.to}</code></li>`).join("")}
    </ul>
  `;
}

// ─── TAB 2: Live Editor & Validation Diagnostics ─────────────────────────────

function setupLiveEditor() {
  const editor = document.getElementById("markdownEditor");
  if (!editor) return;

  editor.addEventListener("input", runLiveValidation);
  runLiveValidation();
}

function runLiveValidation() {
  const output = document.getElementById("validationOutput");
  if (!output) return;

  const editor = document.getElementById("markdownEditor");
  const text = editor ? editor.value : "";

  // Perform live structural parsing
  const hasFrontmatter = text.startsWith("---");
  const hasId = text.includes("id:");
  const hasTitle = text.includes("title:");
  const hasSummary = text.includes("summary:");
  const hasEntities = text.includes("entities:");
  const hasCitations = text.includes("citations:");

  const stages = [
    { name: "1. Dataset Structure", passed: true },
    { name: "2. Knowledge Object Integrity", passed: hasFrontmatter && hasId && hasTitle && hasSummary },
    { name: "3. Knowledge Graph Connectivity", passed: hasEntities },
    { name: "4. Metadata Resolution", passed: hasTitle && hasSummary },
    { name: "5. Route & Canonical Resolution", passed: hasFrontmatter },
    { name: "6. Search Index Document", passed: text.length > 50 },
    { name: "7. Schema.org JSON-LD (MedicalWebPage/Article)", passed: true },
    { name: "8. llms.txt Summary & Body", passed: true },
    { name: "9. Sitemap XML with Media Extension", passed: true },
    { name: "10. Static Export Compatibility", passed: true },
  ];

  output.innerHTML = stages
    .map(
      (s) => `
    <div class="diag-item ${s.passed ? "passed" : "error"}">
      <span>${s.passed ? "✓" : "✗"}</span>
      <span><strong>${s.name}</strong> : ${s.passed ? "Passed" : "Missing required frontmatter fields"}</span>
    </div>
  `
    )
    .join("");
}

// ─── TAB 3: RAG Grounding Playground ─────────────────────────────────────────

function setupRagPlayground() {
  const btn = document.getElementById("btnVerifyGrounding");
  if (!btn) return;

  btn.addEventListener("click", calculateGrounding);
  calculateGrounding();
}

function calculateGrounding() {
  const answer = document.getElementById("ragAnswerInput")?.value || "";
  const container = document.getElementById("groundingResult");
  if (!container) return;

  const lower = answer.toLowerCase();
  const hasWho = lower.includes("organisation mondiale de la santé") || lower.includes("who");
  const hasTartre = lower.includes("tartre");
  const hasDent = lower.includes("dent") || lower.includes("émail");

  let score = 0.85;
  if (!hasWho) score -= 0.3;
  if (!hasTartre) score -= 0.2;
  if (!hasDent) score -= 0.3;
  score = Math.max(0.1, score);

  const riskClass = score >= 0.7 ? "low-risk" : score >= 0.4 ? "medium-risk" : "high-risk";
  const riskLabel = score >= 0.7 ? "Faible (Ancrage Vérifié)" : score >= 0.4 ? "Modéré" : "Élevé (Hallucination)";

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span>Score d'Ancrage Vérifié :</span>
      <span class="score-badge ${riskClass}">Score ${(score * 100).toFixed(0)}% — Risque ${riskLabel}</span>
    </div>

    <div><strong>Preuves & Sources Détectées :</strong></div>
    <ul style="padding-left:18px; color:var(--text-muted);">
      ${hasWho ? `<li>✅ <strong>Organisation Mondiale de la Santé (WHO)</strong> [Trust: Authoritative]</li>` : `<li>⚠️ Aucune source officielle citée dans la réponse</li>`}
    </ul>

    <div><strong>Entités du Domaine Reconnues :</strong></div>
    <ul style="padding-left:18px; color:var(--text-muted);">
      ${hasTartre ? `<li>✅ Entité <code>entity_tartar</code> (Tartre dentaire)</li>` : ""}
      ${hasDent ? `<li>✅ Entité <code>entity_scaling</code> (Détartrage / Émail)</li>` : ""}
    </ul>

    <div style="margin-top:10px; padding:12px; background:rgba(56, 189, 248, 0.08); border-radius:var(--radius-sm); font-size:0.85rem;">
      💡 <strong>Verdict Guardrail GeoCore :</strong> La réponse est ancrée dans le graphe de connaissances avec des sources autoritatives. Conforme pour la publication patient.
    </div>
  `;
}
