/* =========================================================
   Juno Park — Portfolio
   - Custom cursor (dot + contextual label)
   - Hover image previews on work list
   - Scroll reveal
   - Tweaks panel
   ========================================================= */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ————————————————— CURSOR ————————————————— */
  let cursorEnabled = hasFinePointer;
  const dot = document.createElement("div");
  dot.className = "cursor__dot";
  const label = document.createElement("div");
  label.className = "cursor__label";
  if (cursorEnabled) {
    document.body.appendChild(dot);
    document.body.appendChild(label);
  }

  let mx = -100, my = -100, tx = -100, ty = -100;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    // label sticks tighter than dot
    label.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -180%) scale(${label.classList.contains("active") ? 1 : 0.7})`;
  }, { passive: true });

  function tick() {
    // smoothly trail
    tx += (mx - tx) * 0.32;
    ty += (my - ty) * 0.32;
    dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  if (cursorEnabled) tick();

  // expand cursor + show contextual label on interactive elements
  function bindCursorTargets() {
    if (!cursorEnabled) return;
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.classList.add("expanded");
        const txt = el.dataset.cursor;
        if (txt) {
          label.textContent = txt;
          label.classList.add("active");
        }
      });
      el.addEventListener("mouseleave", () => {
        dot.classList.remove("expanded");
        label.classList.remove("active");
      });
    });
    // auto-bind links/buttons that don't have explicit data-cursor
    document.querySelectorAll("a, button, .chip, input, textarea, select").forEach((el) => {
      if (el.hasAttribute("data-cursor")) return;
      el.addEventListener("mouseenter", () => dot.classList.add("expanded"));
      el.addEventListener("mouseleave", () => dot.classList.remove("expanded"));
    });
  }

  /* ————————————————— HOVER PREVIEW ————————————————— */
  const preview = document.createElement("div");
  preview.className = "preview-img";
  preview.innerHTML = `<div class="preview-img__inner" data-num="">—</div>`;
  document.body.appendChild(preview);
  const previewInner = preview.querySelector(".preview-img__inner");

  let previewX = -300, previewY = -300, currentX = -300, currentY = -300;
  function followPreview() {
    currentX += (previewX - currentX) * 0.18;
    currentY += (previewY - currentY) * 0.18;
    preview.style.left = currentX + "px";
    preview.style.top = currentY + "px";
    requestAnimationFrame(followPreview);
  }
  if (hasFinePointer) followPreview();

  function bindWorkPreviews() {
    document.querySelectorAll(".work-row__link").forEach((row) => {
      const color = row.dataset.color || "var(--accent)";
      const title = row.dataset.preview || row.querySelector(".work-row__title")?.textContent || "";
      const num = row.dataset.num || "";
      row.addEventListener("mouseenter", () => {
        if (!hasFinePointer) return;
        previewInner.style.background = color;
        previewInner.textContent = title;
        previewInner.dataset.num = num;
        preview.classList.add("active");
      });
      row.addEventListener("mouseleave", () => preview.classList.remove("active"));
    });
    window.addEventListener("mousemove", (e) => {
      previewX = e.clientX;
      previewY = e.clientY;
    }, { passive: true });
  }

  /* ————————————————— SCROLL REVEAL ————————————————— */
  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ————————————————— TIME ————————————————— */
  function updateTime() {
    const el = document.querySelector("[data-time]");
    if (!el) return;
    const now = new Date();
    // Pretend Lisbon (UTC+0 / +1 with DST — keep simple, use system tz)
    const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Lisbon" };
    try {
      el.textContent = new Intl.DateTimeFormat("en-GB", opts).format(now);
    } catch (e) {
      el.textContent = now.toLocaleTimeString();
    }
  }
  setInterval(updateTime, 1000);

  /* ————————————————— SMART FORM ————————————————— */
  function setupSmartForm() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    // smart defaults: prefill subject based on selected chips
    const chips = form.querySelectorAll(".chip input");
    const subject = form.querySelector("#subject");
    chips.forEach((c) => c.addEventListener("change", () => {
      const selected = [...chips].filter((x) => x.checked).map((x) => x.value);
      if (selected.length && subject && !subject.dataset.dirty) {
        subject.value = "New project — " + selected.join(" + ");
      }
    }));
    subject?.addEventListener("input", () => { subject.dataset.dirty = "true"; });

    // Forgiving email: trim, lowercase
    const email = form.querySelector("#email");
    email?.addEventListener("blur", () => { email.value = email.value.trim().toLowerCase(); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submit = form.querySelector('[type="submit"]');
      const original = submit.innerHTML;
      submit.innerHTML = `Sending… <span class="arrow">→</span>`;
      submit.disabled = true;
      setTimeout(() => {
        submit.innerHTML = `Sent. Talk soon. <span class="arrow">✓</span>`;
        submit.style.background = "var(--accent)";
        setTimeout(() => {
          form.reset();
          submit.innerHTML = original;
          submit.disabled = false;
          submit.style.background = "";
        }, 2400);
      }, 900);
    });
  }

  /* ————————————————— TWEAKS PANEL ————————————————— */
  const TWEAKS = /*EDITMODE-BEGIN*/{
    "accent": "#FF4D1F",
    "notes_visible": true,
    "cursor_on": true
  }/*EDITMODE-END*/;

  const ACCENT_OPTIONS = [
    { hex: "#FF4D1F", deep: "#C8340B", label: "Vermillion" },
    { hex: "#1A30E8", deep: "#0E1E9C", label: "Cobalt" },
    { hex: "#C6FF3D", deep: "#88B824", label: "Acid Lime" },
    { hex: "#E91E63", deep: "#A8124A", label: "Hot Pink" }
  ];

  function applyAccent(hex) {
    const opt = ACCENT_OPTIONS.find((o) => o.hex === hex) || ACCENT_OPTIONS[0];
    document.documentElement.style.setProperty("--accent", opt.hex);
    document.documentElement.style.setProperty("--accent-deep", opt.deep);
    // for white text contrast on lime — use ink text instead
    if (opt.hex === "#C6FF3D") {
      document.documentElement.style.setProperty("--paper", "#F2EFE6");
    }
  }

  function applyNotes(v) {
    document.body.classList.toggle("notes-off", !v);
  }
  function applyCursor(v) {
    cursorEnabled = v && hasFinePointer;
    dot.style.display = cursorEnabled ? "" : "none";
    label.style.display = cursorEnabled ? "" : "none";
  }

  function buildTweaks() {
    const panel = document.createElement("div");
    panel.id = "tweaks-panel";
    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h4>Tweaks</h4>
        <button id="tweaks-close" style="font-family:var(--mono);font-size:11px;color:var(--muted-on-dark);background:none;border:0;cursor:pointer;letter-spacing:0.06em;">CLOSE ×</button>
      </div>
      <div class="tweak-row">
        <label>Accent</label>
        <div class="swatch-row" id="accent-swatches"></div>
      </div>
      <div class="tweak-row">
        <label>UX notes</label>
        <button class="toggle" id="tweak-notes" aria-pressed="${TWEAKS.notes_visible}"></button>
      </div>
      <div class="tweak-row">
        <label>Custom cursor</label>
        <button class="toggle" id="tweak-cursor" aria-pressed="${TWEAKS.cursor_on}"></button>
      </div>
    `;
    document.body.appendChild(panel);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "tweaks-toggle";
    toggleBtn.innerHTML = `<span class="dot"></span>Tweaks`;
    document.body.appendChild(toggleBtn);

    const sw = panel.querySelector("#accent-swatches");
    ACCENT_OPTIONS.forEach((o) => {
      const b = document.createElement("button");
      b.className = "swatch";
      b.style.background = o.hex;
      b.setAttribute("aria-pressed", o.hex === TWEAKS.accent);
      b.setAttribute("aria-label", o.label);
      b.title = o.label;
      b.addEventListener("click", () => {
        TWEAKS.accent = o.hex;
        applyAccent(o.hex);
        sw.querySelectorAll(".swatch").forEach((x) => x.setAttribute("aria-pressed", x === b));
        try {
          window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { accent: o.hex } }, "*");
        } catch (e) {}
      });
      sw.appendChild(b);
    });

    panel.querySelector("#tweak-notes").addEventListener("click", (e) => {
      const v = e.currentTarget.getAttribute("aria-pressed") !== "true";
      e.currentTarget.setAttribute("aria-pressed", v);
      TWEAKS.notes_visible = v;
      applyNotes(v);
      try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { notes_visible: v } }, "*"); } catch (e) {}
    });
    panel.querySelector("#tweak-cursor").addEventListener("click", (e) => {
      const v = e.currentTarget.getAttribute("aria-pressed") !== "true";
      e.currentTarget.setAttribute("aria-pressed", v);
      TWEAKS.cursor_on = v;
      applyCursor(v);
      try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { cursor_on: v } }, "*"); } catch (e) {}
    });

    panel.querySelector("#tweaks-close").addEventListener("click", () => {
      panel.classList.remove("open");
      toggleBtn.classList.add("visible");
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });
    toggleBtn.addEventListener("click", () => {
      panel.classList.add("open");
      toggleBtn.classList.remove("visible");
    });

    // host protocol — register handler BEFORE announcing
    window.addEventListener("message", (e) => {
      const d = e.data;
      if (!d || typeof d !== "object") return;
      if (d.type === "__activate_edit_mode") {
        panel.classList.add("open");
        toggleBtn.classList.remove("visible");
      } else if (d.type === "__deactivate_edit_mode") {
        panel.classList.remove("open");
        toggleBtn.classList.remove("visible");
      }
    });
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}

    // apply defaults
    applyAccent(TWEAKS.accent);
    applyNotes(TWEAKS.notes_visible);
    applyCursor(TWEAKS.cursor_on);
  }

  /* ————————————————— INIT ————————————————— */
  document.addEventListener("DOMContentLoaded", () => {
    bindCursorTargets();
    bindWorkPreviews();
    setupReveal();
    updateTime();
    setupSmartForm();
    buildTweaks();

    // re-bind dynamic content if any (idempotent)
    setTimeout(bindCursorTargets, 200);
  });
})();
