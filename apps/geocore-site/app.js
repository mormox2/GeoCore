/* ═══════════════════════════════════════════════════════════════════════════════
   GeoCore Landing Page — Interactive Behaviors
   ═══════════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initSmoothLinks();
  initRevealOnScroll();
  initCliTabs();
  initCopyButton();
  initCtaTracking();
  initPrivacyModal();
});

/* ─── Navbar background on scroll ──────────────────────────────────────────── */

function initNavScroll() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  const update = () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ─── Smooth anchor scrolling ──────────────────────────────────────────────── */

function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ─── Intersection Observer — reveal on scroll ─────────────────────────────── */

function initRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation based on position within its parent
          const siblings = entry.target.parentElement?.querySelectorAll(".reveal") || [];
          const siblingIndex = Array.from(siblings).indexOf(entry.target);
          const delay = siblingIndex * 80;

          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ─── CLI Tab Switcher ─────────────────────────────────────────────────────── */

function initCliTabs() {
  const tabs = document.querySelectorAll(".cli-tab");
  const panels = document.querySelectorAll(".cli-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.cli;

      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const panel = document.getElementById(`cli-${target}`);
      if (panel) panel.classList.add("active");

      trackVercelEvent("cli_tab_select", { command: target });
    });
  });
}

/* ─── Copy Button ──────────────────────────────────────────────────────────── */

function initCopyButton() {
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const codeEl = btn.closest(".terminal-body")?.querySelector("code");
      const commandText = codeEl ? codeEl.innerText.trim() : "";

      if (commandText && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(commandText).catch(() => {});
      }

      trackVercelEvent("copy_command", { command: commandText || "cli" });

      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.style.color = "var(--accent-emerald)";
      setTimeout(() => {
        btn.textContent = original;
        btn.style.color = "";
      }, 2000);
    });
  });
}

/* ─── Call to Action (CTA) Tracking ────────────────────────────────────────── */

function initCtaTracking() {
  document.querySelectorAll(".btn-primary, .btn-secondary, .nav-cta").forEach(link => {
    link.addEventListener("click", () => {
      const text = link.textContent.replace(/[^\w\s-]/gi, "").trim();
      trackVercelEvent("cta_click", {
        label: text || "action",
        href: link.getAttribute("href") || "#",
      });
    });
  });
}

/* ─── Vercel Web Analytics Event Dispatcher ────────────────────────────────── */

function trackVercelEvent(eventName, data = {}) {
  if (typeof window !== "undefined" && typeof window.va === "function") {
    window.va("event", { name: eventName, data });
  }
}

/* ─── Privacy & Cookies Modal Controller ──────────────────────────────────── */

function initPrivacyModal() {
  const modal = document.getElementById("privacyModal");
  const openLink = document.getElementById("privacyLink");
  const closeBtn = document.getElementById("privacyModalClose");
  const okBtn = document.getElementById("privacyModalOk");

  if (!modal || !openLink) return;

  const open = (e) => {
    if (e) e.preventDefault();
    modal.hidden = false;
    void modal.offsetWidth; // Trigger reflow for animation
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    trackVercelEvent("privacy_modal_open");
  };

  const close = () => {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = "";
    }, 250);
  };

  openLink.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (okBtn) okBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      close();
    }
  });
}
