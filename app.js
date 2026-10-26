/* ═══════════════════════════════════════════════════════════════════════════
   HAIRLINE — CSS Platform Playground  ·  app.js
   ───────────────────────────────────────────────────────────────────────────
   SECTIONS
     1. EXAMPLES DATA
     2. RENDER ENGINE
     3. SYNTAX HIGHLIGHTER
     4. TABS & COPY
     5. PLAYGROUND
     6. SUPPORT DETECTION & FEATURE CHIPS
     7. NAV RAIL
     8. INIT
   ═══════════════════════════════════════════════════════════════════════════ */

"use strict";

/* ══════════════════════════════════════════════════════════════════════════
   § 1 · EXAMPLES DATA
   ══════════════════════════════════════════════════════════════════════════
   Each example is defined once. The demo is rendered from these same strings.
   Rules:
     - No backticks inside the template strings below (use single/double quotes)
     - No ${ sequences inside html/css/js string values
     - js: '// No JavaScript needed'  when the example has no JS
     - Prefix every class and custom property with the example id
*/

const GROUPS = [
  {
    letter: "A",
    id: "scroll",
    title: "Scroll-Driven Animations",
    desc: "@scroll-timeline  ·  animation-timeline  ·  animation-range",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex01",
        num: "01",
        title: "Reading Progress Bar",
        tags: ["scroll()", "animation-timeline"],
        support:
          "Fallback: bar is hidden when scroll timelines are not supported.",
        html: '<div class="ex01-page-content">\n  <p class="ex01-para">This specimen contains a mini article so the scroll bar is visible. Scroll this demo area to see the progress bar animate along the top edge.</p>\n  <p class="ex01-para">Scroll-driven animations attach an animation to the scroll position of a scroll container, using no JavaScript. The <code>animation-timeline: scroll()</code> function targets the nearest scrolling ancestor by default.</p>\n  <p class="ex01-para">The progress bar below the specimen header is driven by the page scroll. This inner demo shows the same mechanic on a local scroll container.</p>\n  <p class="ex01-para">More paragraph text to create scrollable content. The transform scales from 0 to 1 on the X axis, and the transform origin is set to the left edge so it grows left-to-right.</p>\n  <p class="ex01-para">Animation specification: <code>animation-timeline: scroll(self block)</code> targets the self container on the block axis.</p>\n</div>',
        css: ".ex01-stage {\n  position: relative;\n  overflow: hidden;\n}\n\n.ex01-bar-wrap {\n  position: sticky;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 4px;\n  background: #e5e3dc;\n  z-index: 1;\n}\n\n@supports (animation-timeline: scroll()) {\n  .ex01-bar {\n    height: 100%;\n    background: #1B37FF;\n    transform-origin: left;\n    transform: scaleX(0);\n    animation: ex01-grow linear;\n    animation-timeline: scroll(nearest block);\n  }\n}\n\n@supports not (animation-timeline: scroll()) {\n  .ex01-bar { display: none; }\n}\n\n@keyframes ex01-grow {\n  from { transform: scaleX(0); }\n  to   { transform: scaleX(1); }\n}\n\n.ex01-page-content {\n  height: 220px;\n  overflow-y: auto;\n  padding: 12px 16px;\n  scroll-behavior: smooth;\n}\n\n.ex01-para {\n  margin-bottom: 12px;\n  font-size: 0.85rem;\n  line-height: 1.6;\n  color: #333;\n}",
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex02",
        num: "02",
        title: "Reveal on Scroll",
        tags: ["view()", "animation-range"],
        support:
          "Fallback: items are always visible (opacity:1, transform:none) when view timelines are not supported.",
        html: '<ul class="ex02-list" aria-label="Scroll reveal demo list">\n  <li class="ex02-item">Platform CSS Feature 01</li>\n  <li class="ex02-item">Platform CSS Feature 02</li>\n  <li class="ex02-item">Platform CSS Feature 03</li>\n  <li class="ex02-item">Platform CSS Feature 04</li>\n  <li class="ex02-item">Platform CSS Feature 05</li>\n  <li class="ex02-item">Platform CSS Feature 06</li>\n</ul>',
        css: '.ex02-list {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  height: 260px;\n  overflow-y: auto;\n  padding: 12px 16px;\n}\n\n.ex02-item {\n  padding: 14px 18px;\n  border: 1.5px solid #111;\n  background: #fff;\n  font-size: 0.85rem;\n  font-family: "IBM Plex Mono", monospace;\n  font-weight: 500;\n  letter-spacing: 0.04em;\n}\n\n@supports (animation-timeline: view()) {\n  .ex02-item {\n    opacity: 0;\n    transform: translateY(16px);\n    animation: ex02-reveal linear both;\n    animation-timeline: view(block);\n    animation-range: entry 0% entry 35%;\n  }\n}\n\n@supports not (animation-timeline: view()) {\n  .ex02-item { opacity: 1; transform: none; }\n}\n\n@keyframes ex02-reveal {\n  from { opacity: 0; transform: translateY(16px); }\n  to   { opacity: 1; transform: translateY(0);   }\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex03",
        num: "03",
        title: "Parallax Layers",
        tags: ["scroll()", "animation-timeline"],
        support:
          "Fallback: layers are static when scroll timelines are not supported.",
        html: '<div class="ex03-scene" aria-label="Parallax scroll demo">\n  <div class="ex03-layer ex03-layer--back" aria-hidden="true">BG</div>\n  <div class="ex03-layer ex03-layer--mid" aria-hidden="true">MID</div>\n  <div class="ex03-layer ex03-layer--front" aria-hidden="true">FG</div>\n  <div class="ex03-scroll-area">\n    <p>Scroll inside this box</p>\n    <p>Layer one</p>\n    <p>Layer two</p>\n    <p>Layer three</p>\n    <p>Layer four</p>\n    <p>Bottom</p>\n  </div>\n</div>',
        css: '.ex03-scene {\n  position: relative;\n  height: 260px;\n  overflow: hidden;\n  background: #F3F1EA;\n  border: 1.5px solid #111;\n}\n\n.ex03-scroll-area {\n  position: relative;\n  z-index: 3;\n  height: 100%;\n  overflow-y: auto;\n  padding: 16px 20px;\n  display: flex;\n  flex-direction: column;\n  gap: 40px;\n}\n\n.ex03-scroll-area p {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  letter-spacing: 0.08em;\n  opacity: 0.6;\n}\n\n.ex03-layer {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: "IBM Plex Mono", monospace;\n  font-weight: 500;\n  font-size: 4rem;\n  letter-spacing: 0.12em;\n  pointer-events: none;\n  user-select: none;\n}\n\n.ex03-layer--back  { color: rgba(27,55,255,0.06);  font-size: 6rem;  z-index: 0; }\n.ex03-layer--mid   { color: rgba(27,55,255,0.10);  font-size: 3rem;  z-index: 1; }\n.ex03-layer--front { color: rgba(27,55,255,0.18);  font-size: 1.6rem; z-index: 2; }\n\n@supports (animation-timeline: scroll()) {\n  .ex03-layer--back {\n    animation: ex03-parallax-back linear both;\n    animation-timeline: scroll(.ex03-scroll-area block);\n  }\n  .ex03-layer--mid {\n    animation: ex03-parallax-mid linear both;\n    animation-timeline: scroll(.ex03-scroll-area block);\n  }\n  .ex03-layer--front {\n    animation: ex03-parallax-front linear both;\n    animation-timeline: scroll(.ex03-scroll-area block);\n  }\n}\n\n@keyframes ex03-parallax-back  { to { transform: translateY(-60px); } }\n@keyframes ex03-parallax-mid   { to { transform: translateY(-30px); } }\n@keyframes ex03-parallax-front { to { transform: translateY(-12px); } }',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex04",
        num: "04",
        title: "Sticky Header That Shrinks",
        tags: ["scroll()", "animation-timeline"],
        support:
          "Fallback: header stays at full size when scroll timelines are not supported.",
        html: '<div class="ex04-outer" aria-label="Sticky shrinking header demo">\n  <header class="ex04-header">\n    <span class="ex04-logo">HAIRLINE</span>\n    <nav class="ex04-nav" aria-label="Demo nav">\n      <a href="#" class="ex04-link">Work</a>\n      <a href="#" class="ex04-link">About</a>\n      <a href="#" class="ex04-link">Contact</a>\n    </nav>\n  </header>\n  <div class="ex04-body">\n    <p>Scroll down inside this box to see the header shrink. The animation is driven by the scroll position of this container via <code>animation-timeline: scroll()</code>.</p>\n    <p style="margin-top:40px">The header height, font-size and padding all animate simultaneously as a single scroll-linked animation — no JavaScript, no intersection observers.</p>\n    <p style="margin-top:40px">Scroll further down.</p>\n    <p style="margin-top:40px">End of content.</p>\n  </div>\n</div>',
        css: '.ex04-outer {\n  position: relative;\n  height: 280px;\n  overflow-y: auto;\n  border: 1.5px solid #111;\n  background: #F3F1EA;\n  scroll-timeline-name: --ex04-scroller;\n  scroll-timeline-axis: block;\n}\n\n.ex04-header {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  background: #111;\n  color: #fff;\n  border-bottom: 1.5px solid #111;\n  height: 64px;\n}\n\n@supports (animation-timeline: scroll()) {\n  .ex04-header {\n    animation: ex04-shrink linear both;\n    animation-timeline: --ex04-scroller;\n    animation-range: 0px 80px;\n  }\n}\n\n@keyframes ex04-shrink {\n  from { height: 64px; padding: 16px 20px; }\n  to   { height: 40px; padding:  6px 20px; }\n}\n\n.ex04-logo {\n  font-weight: 900;\n  font-size: 1rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\n.ex04-nav { display: flex; gap: 20px; }\n.ex04-link { color: #C8FF00; font-family: "IBM Plex Mono", monospace; font-size: 0.75rem; text-decoration: none; letter-spacing: 0.06em; }\n\n.ex04-body {\n  padding: 20px;\n}\n.ex04-body p {\n  font-size: 0.82rem;\n  line-height: 1.6;\n  color: #333;\n  max-width: 520px;\n}',
        js: "// No JavaScript needed",
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "B",
    id: "property",
    title: "@property",
    desc: "@property  ·  typed custom properties  ·  animatable tokens",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex05",
        num: "05",
        title: "Rotating Conic-Gradient Border",
        tags: ["@property", "conic-gradient"],
        support:
          "Fallback: static accent border when @property is not supported.",
        html: '<div class="ex05-card">\n  <span class="ex05-label">Hover me</span>\n</div>',
        css: '@supports (syntax: "<angle>") {\n  @property --ex05-angle {\n    syntax: "<angle>";\n    inherits: false;\n    initial-value: 0deg;\n  }\n}\n\n.ex05-card {\n  --ex05-angle: 0deg;\n  width: 160px;\n  height: 120px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: conic-gradient(from var(--ex05-angle), #1B37FF 0%, #C8FF00 30%, #111 60%, #1B37FF 100%);\n  padding: 3px;\n  cursor: pointer;\n  transition: --ex05-angle 0.8s ease;\n}\n\n.ex05-card:hover {\n  --ex05-angle: 360deg;\n}\n\n@supports not (syntax: "<angle>") {\n  .ex05-card {\n    border: 3px solid #1B37FF;\n    background: none;\n    padding: 3px;\n  }\n}\n\n.ex05-inner {\n  background: #fff;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ex05-label {\n  background: #fff;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.8rem;\n  letter-spacing: 0.08em;\n  font-weight: 500;\n  color: #111;\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex06",
        num: "06",
        title: "Animated Integer Counter",
        tags: ["@property", "counter()", "integer"],
        support:
          "Fallback: counter shows static 100 when @property integer animation is not supported.",
        html: '<div class="ex06-demo">\n  <div class="ex06-counter" aria-live="polite" aria-label="Animated counter">0</div>\n  <button class="ex06-btn" id="ex06-trigger" type="button">Animate</button>\n</div>',
        css: '@supports (syntax: "<integer>") {\n  @property --ex06-n {\n    syntax: "<integer>";\n    inherits: false;\n    initial-value: 0;\n  }\n}\n\n.ex06-demo {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n}\n\n.ex06-counter {\n  --ex06-n: 0;\n  font-size: 4rem;\n  font-weight: 900;\n  font-family: "IBM Plex Mono", monospace;\n  color: #1B37FF;\n  counter-reset: ex06-cnt var(--ex06-n);\n  display: block;\n  line-height: 1;\n  min-width: 160px;\n  text-align: center;\n}\n\n@supports (syntax: "<integer>") {\n  .ex06-counter::after {\n    content: counter(ex06-cnt);\n    color: #111;\n    font-size: 4rem;\n  }\n  .ex06-counter { color: transparent; }\n\n  .ex06-counter.is-running {\n    animation: ex06-count 1.4s ease-out forwards;\n  }\n\n  @keyframes ex06-count {\n    from { --ex06-n: 0; }\n    to   { --ex06-n: 100; }\n  }\n}\n\n.ex06-btn {\n  padding: 10px 28px;\n  background: #111;\n  color: #C8FF00;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n.ex06-btn:hover { background: #1B37FF; border-color: #1B37FF; color: #fff; }',
        js: 'var btn = document.getElementById("ex06-trigger");\nvar counter = document.querySelector(".ex06-counter");\nif (btn && counter) {\n  btn.addEventListener("click", function() {\n    counter.classList.remove("is-running");\n    void counter.offsetWidth;\n    counter.classList.add("is-running");\n  });\n}',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex07",
        num: "07",
        title: "Conic Progress Ring",
        tags: ["@property", "conic-gradient", "range input"],
        support: "Fallback: solid accent ring when @property is not supported.",
        html: '<div class="ex07-demo">\n  <div class="ex07-ring-wrap">\n    <div class="ex07-ring" id="ex07-ring" aria-hidden="true"></div>\n    <span class="ex07-ring-label" id="ex07-ring-val" aria-live="polite">50%</span>\n  </div>\n  <label class="ex07-range-label" for="ex07-range">Drag to set progress</label>\n  <input type="range" id="ex07-range" class="ex07-range" min="0" max="100" value="50" aria-label="Progress value">\n</div>',
        css: '@supports (syntax: "<percentage>") {\n  @property --ex07-p {\n    syntax: "<percentage>";\n    inherits: false;\n    initial-value: 50%;\n  }\n}\n\n.ex07-demo {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 20px;\n}\n\n.ex07-ring-wrap {\n  position: relative;\n  width: 140px;\n  height: 140px;\n}\n\n.ex07-ring {\n  --ex07-p: 50%;\n  width: 140px;\n  height: 140px;\n  border-radius: 50%;\n  background: conic-gradient(#1B37FF 0% var(--ex07-p), #e5e3dc var(--ex07-p) 100%);\n  transition: --ex07-p 0.15s ease;\n}\n\n@supports (syntax: "<percentage>") {\n  .ex07-ring {\n    -webkit-mask: radial-gradient(circle, transparent 52px, #000 52px);\n    mask: radial-gradient(circle, transparent 52px, #000 52px);\n  }\n}\n\n@supports not (syntax: "<percentage>") {\n  .ex07-ring {\n    border-radius: 50%;\n    background: none;\n    border: 12px solid #1B37FF;\n  }\n}\n\n.ex07-ring-label {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: #111;\n  pointer-events: none;\n}\n\n.ex07-range-label {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  color: #555;\n}\n\n.ex07-range {\n  width: 200px;\n  accent-color: #1B37FF;\n  cursor: pointer;\n}',
        js: 'var ring  = document.getElementById("ex07-ring");\nvar label = document.getElementById("ex07-ring-val");\nvar range = document.getElementById("ex07-range");\nif (ring && label && range) {\n  range.addEventListener("input", function() {\n    var v = range.value;\n    ring.style.setProperty("--ex07-p", v + "%");\n    label.textContent = v + "%";\n  });\n}',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex08",
        num: "08",
        title: "Hard-Edge Gradient Sweep on Hover",
        tags: ["@property", "gradient stops"],
        support:
          "Fallback: solid accent background on hover when @property is not supported.",
        html: '<div class="ex08-demo">\n  <button class="ex08-btn" type="button">Hover for sweep</button>\n  <button class="ex08-btn" type="button">Another button</button>\n  <button class="ex08-btn" type="button">Third one</button>\n</div>',
        css: '@supports (syntax: "<percentage>") {\n  @property --ex08-stop {\n    syntax: "<percentage>";\n    inherits: false;\n    initial-value: 0%;\n  }\n}\n\n.ex08-demo {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  align-items: flex-start;\n}\n\n.ex08-btn {\n  --ex08-stop: 0%;\n  position: relative;\n  padding: 14px 32px;\n  border: 1.5px solid #111;\n  background: linear-gradient(90deg, #1B37FF 0% var(--ex08-stop), #F3F1EA var(--ex08-stop) 100%);\n  color: #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.8rem;\n  font-weight: 500;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  cursor: pointer;\n  transition: --ex08-stop 0.45s ease, color 0.45s ease;\n}\n\n.ex08-btn:hover {\n  --ex08-stop: 100%;\n  color: #fff;\n}\n\n@supports not (syntax: "<percentage>") {\n  .ex08-btn:hover {\n    background: #1B37FF;\n    color: #fff;\n  }\n}',
        js: "// No JavaScript needed",
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "C",
    id: "container",
    title: "Container Queries",
    desc: "@container  ·  cqi / cqw  ·  style()",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex09",
        num: "09",
        title: "Card That Switches Layout",
        tags: ["@container", "container-type"],
        support:
          "Fallback: stacked layout always when container queries are not supported.",
        html: '<div class="ex09-wrapper">\n  <article class="ex09-card">\n    <div class="ex09-thumb" aria-hidden="true"></div>\n    <div class="ex09-body">\n      <p class="ex09-eyebrow">Container Queries</p>\n      <h3 class="ex09-title">This card changes layout</h3>\n      <p class="ex09-desc">Drag the right edge of the playground preview to make the container narrower. The card collapses from a row into a column layout automatically — no media query, driven by the container width.</p>\n    </div>\n  </article>\n</div>',
        css: '.ex09-wrapper {\n  container-type: inline-size;\n  container-name: ex09-wrap;\n  width: 100%;\n}\n\n.ex09-card {\n  border: 1.5px solid #111;\n  background: #fff;\n  box-shadow: 4px 4px 0 #111;\n  display: flex;\n  gap: 0;\n  flex-direction: column;\n}\n\n@container ex09-wrap (min-width: 420px) {\n  .ex09-card {\n    flex-direction: row;\n    align-items: stretch;\n  }\n  .ex09-thumb {\n    width: 160px;\n    flex-shrink: 0;\n  }\n}\n\n.ex09-thumb {\n  width: 100%;\n  height: 120px;\n  background: repeating-linear-gradient(45deg, #1B37FF, #1B37FF 2px, transparent 2px, transparent 12px);\n  background-color: #F3F1EA;\n  border-bottom: 1.5px solid #111;\n}\n\n@container ex09-wrap (min-width: 420px) {\n  .ex09-thumb {\n    height: auto;\n    border-bottom: none;\n    border-right: 1.5px solid #111;\n  }\n}\n\n.ex09-body { padding: 18px 20px; }\n\n.ex09-eyebrow {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.62rem;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n  color: #1B37FF;\n  margin-bottom: 6px;\n}\n\n.ex09-title {\n  font-size: 1rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n\n.ex09-desc { font-size: 0.8rem; line-height: 1.5; color: #555; }',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex10",
        num: "10",
        title: "Fluid Typography with cqi",
        tags: ["@container", "cqi"],
        support:
          "Fallback: static font size when container query length units are not supported.",
        html: '<div class="ex10-wrapper">\n  <div class="ex10-card">\n    <h2 class="ex10-heading">Container<br>Fluid Type</h2>\n    <p class="ex10-body">This heading scales with the container width using <code>cqi</code> units — not the viewport. Resize the preview.</p>\n  </div>\n</div>',
        css: ".ex10-wrapper {\n  container-type: inline-size;\n  container-name: ex10-wrap;\n  width: 100%;\n}\n\n.ex10-card {\n  border: 1.5px solid #111;\n  background: #fff;\n  padding: 24px;\n  box-shadow: 4px 4px 0 #111;\n}\n\n.ex10-heading {\n  font-size: clamp(1.2rem, 6cqi, 3rem);\n  font-weight: 900;\n  letter-spacing: -0.03em;\n  line-height: 1.05;\n  margin-bottom: 12px;\n}\n\n@supports not (font-size: 1cqi) {\n  .ex10-heading { font-size: clamp(1.2rem, 4vw, 3rem); }\n}\n\n.ex10-body {\n  font-size: clamp(0.75rem, 2cqi, 1rem);\n  color: #555;\n  line-height: 1.6;\n  max-width: 40ch;\n}\n\n@supports not (font-size: 1cqi) {\n  .ex10-body { font-size: 0.85rem; }\n}",
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex11",
        num: "11",
        title: "Toolbar That Collapses to Icons",
        tags: ["@container", "container-type"],
        support:
          "Fallback: labels always shown when container queries are not supported.",
        html: '<div class="ex11-wrapper">\n  <div class="ex11-toolbar" role="toolbar" aria-label="Demo toolbar">\n    <button class="ex11-tool" type="button" title="Bold">\n      <span class="ex11-icon" aria-hidden="true">B</span>\n      <span class="ex11-lbl">Bold</span>\n    </button>\n    <button class="ex11-tool" type="button" title="Italic">\n      <span class="ex11-icon" aria-hidden="true"><em>I</em></span>\n      <span class="ex11-lbl">Italic</span>\n    </button>\n    <button class="ex11-tool" type="button" title="Link">\n      <span class="ex11-icon" aria-hidden="true">#</span>\n      <span class="ex11-lbl">Link</span>\n    </button>\n    <button class="ex11-tool" type="button" title="Image">\n      <span class="ex11-icon" aria-hidden="true">&#9974;</span>\n      <span class="ex11-lbl">Image</span>\n    </button>\n    <button class="ex11-tool" type="button" title="Code">\n      <span class="ex11-icon" aria-hidden="true">&lt;&gt;</span>\n      <span class="ex11-lbl">Code</span>\n    </button>\n  </div>\n</div>',
        css: '.ex11-wrapper {\n  container-type: inline-size;\n  container-name: ex11-wrap;\n  width: 100%;\n}\n\n.ex11-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  border: 1.5px solid #111;\n  padding: 6px;\n  background: #F3F1EA;\n}\n\n.ex11-tool {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 14px;\n  background: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  font-weight: 500;\n  cursor: pointer;\n  letter-spacing: 0.04em;\n  white-space: nowrap;\n}\n.ex11-tool:hover { background: #111; color: #fff; }\n\n.ex11-icon { font-style: normal; }\n\n@container ex11-wrap (max-width: 400px) {\n  .ex11-lbl { display: none; }\n  .ex11-tool { padding: 10px 12px; }\n}\n\n@supports not (container-type: inline-size) {\n  .ex11-lbl { display: inline; }\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex12",
        num: "12",
        title: "Stat Tile with Style Query",
        tags: ["@container style()", "custom property"],
        support:
          "Fallback: default teal colour applied when container style() queries are not supported.",
        html: '<div class="ex12-wrapper">\n  <div class="ex12-tile ex12-tile--up">\n    <span class="ex12-number">+24%</span>\n    <span class="ex12-label">Revenue</span>\n  </div>\n  <div class="ex12-tile ex12-tile--down">\n    <span class="ex12-number">-11%</span>\n    <span class="ex12-label">Churn</span>\n  </div>\n  <div class="ex12-tile ex12-tile--neutral">\n    <span class="ex12-number">0%</span>\n    <span class="ex12-label">Latency</span>\n  </div>\n</div>',
        css: '.ex12-wrapper {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  container-type: inline-size;\n  container-name: ex12-wrap;\n}\n\n.ex12-tile {\n  container-type: style;\n  flex: 1;\n  min-width: 100px;\n  border: 1.5px solid #111;\n  background: #fff;\n  box-shadow: 4px 4px 0 #111;\n  padding: 20px 18px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.ex12-tile--up    { --ex12-trend: up;      }\n.ex12-tile--down  { --ex12-trend: down;    }\n.ex12-tile--neutral { --ex12-trend: neutral; }\n\n/* Style query — supported in Chrome 111+, other browsers fall back */\n@supports (container-type: style) {\n  @container style(--ex12-trend: up) {\n    .ex12-number { color: #1B7B1B; }\n  }\n  @container style(--ex12-trend: down) {\n    .ex12-number { color: #cc0000; }\n  }\n  @container style(--ex12-trend: neutral) {\n    .ex12-number { color: #555; }\n  }\n}\n\n@supports not (container-type: style) {\n  .ex12-number { color: #1B7B1B; }\n}\n\n.ex12-number {\n  font-size: 1.6rem;\n  font-weight: 900;\n  font-family: "IBM Plex Mono", monospace;\n  line-height: 1;\n}\n\n.ex12-label {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.65rem;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: #555;\n}',
        js: "// No JavaScript needed",
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "D",
    id: "viewtransitions",
    title: "View Transitions",
    desc: "document.startViewTransition()  ·  view-transition-name  ·  ::view-transition-*",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex13",
        num: "13",
        title: "Filter & Sort Grid",
        tags: ["view transitions", "view-transition-name"],
        support:
          "Fallback: instant reorder without animation when View Transitions API is not supported.",
        html: '<div class="ex13-demo">\n  <div class="ex13-toolbar">\n    <button class="ex13-filter-btn is-active" data-filter="all" type="button">All</button>\n    <button class="ex13-filter-btn" data-filter="blue" type="button">Blue</button>\n    <button class="ex13-filter-btn" data-filter="lime" type="button">Lime</button>\n    <button class="ex13-filter-btn" data-filter="ink" type="button">Ink</button>\n  </div>\n  <div class="ex13-grid" id="ex13-grid">\n    <div class="ex13-item" data-cat="blue" data-id="1">01</div>\n    <div class="ex13-item" data-cat="lime" data-id="2">02</div>\n    <div class="ex13-item" data-cat="ink"  data-id="3">03</div>\n    <div class="ex13-item" data-cat="blue" data-id="4">04</div>\n    <div class="ex13-item" data-cat="lime" data-id="5">05</div>\n    <div class="ex13-item" data-cat="ink"  data-id="6">06</div>\n    <div class="ex13-item" data-cat="blue" data-id="7">07</div>\n    <div class="ex13-item" data-cat="lime" data-id="8">08</div>\n  </div>\n</div>',
        css: '.ex13-toolbar {\n  display: flex;\n  gap: 6px;\n  margin-bottom: 14px;\n}\n\n.ex13-filter-btn {\n  padding: 6px 16px;\n  border: 1.5px solid #111;\n  background: #F3F1EA;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.7rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  cursor: pointer;\n  transition: background 0.1s;\n}\n.ex13-filter-btn.is-active,\n.ex13-filter-btn:hover {\n  background: #111;\n  color: #fff;\n}\n\n.ex13-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 8px;\n}\n\n.ex13-item {\n  aspect-ratio: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: "IBM Plex Mono", monospace;\n  font-weight: 700;\n  font-size: 1rem;\n  border: 1.5px solid #111;\n}\n\n.ex13-item[data-cat="blue"] { background: #1B37FF; color: #fff; }\n.ex13-item[data-cat="lime"] { background: #C8FF00; color: #111; }\n.ex13-item[data-cat="ink"]  { background: #111;    color: #fff; }\n\n@supports (view-transition-name: none) {\n  .ex13-item { view-transition-name: none; }\n}',
        js: 'var btns = document.querySelectorAll(".ex13-filter-btn");\nvar grid = document.getElementById("ex13-grid");\nvar currentFilter = "all";\n\nfunction applyFilter(f) {\n  currentFilter = f;\n  btns.forEach(function(b) {\n    b.classList.toggle("is-active", b.dataset.filter === f);\n  });\n  var items = Array.from(grid.querySelectorAll(".ex13-item"));\n  items.forEach(function(item, i) {\n    var id = "ex13-item-" + item.dataset.id;\n    item.style.viewTransitionName = id;\n  });\n  function doUpdate() {\n    items.forEach(function(item) {\n      item.style.display = (f === "all" || item.dataset.cat === f) ? "" : "none";\n    });\n  }\n  if (document.startViewTransition) {\n    document.startViewTransition(doUpdate);\n  } else {\n    doUpdate();\n  }\n}\n\nbtns.forEach(function(btn) {\n  btn.addEventListener("click", function() { applyFilter(btn.dataset.filter); });\n});',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex14",
        num: "14",
        title: "Tab Indicator That Morphs",
        tags: ["view transitions", "view-transition-name"],
        support:
          "Fallback: instant tab switch without morph animation when View Transitions API is not supported.",
        html: '<div class="ex14-tabs" id="ex14-tabs">\n  <div class="ex14-tab-list" role="tablist">\n    <button class="ex14-tab is-active" role="tab" aria-selected="true"  data-tab="a">Overview</button>\n    <button class="ex14-tab"           role="tab" aria-selected="false" data-tab="b">Details</button>\n    <button class="ex14-tab"           role="tab" aria-selected="false" data-tab="c">Settings</button>\n  </div>\n  <div class="ex14-panels">\n    <div class="ex14-panel" id="ex14-panel-a" role="tabpanel">Overview content: view-transition-name is assigned to the active tab button so the indicator morphs between tabs.</div>\n    <div class="ex14-panel" id="ex14-panel-b" role="tabpanel" hidden>Details content: each button gets the transition name while active, removed when inactive.</div>\n    <div class="ex14-panel" id="ex14-panel-c" role="tabpanel" hidden>Settings content: the browser captures old and new positions and animates the difference.</div>\n  </div>\n</div>',
        css: '.ex14-tabs {\n  border: 1.5px solid #111;\n  background: #fff;\n}\n\n.ex14-tab-list {\n  display: flex;\n  border-bottom: 1.5px solid #111;\n  background: #F3F1EA;\n}\n\n.ex14-tab {\n  padding: 12px 20px;\n  background: none;\n  border: none;\n  border-right: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.05em;\n  cursor: pointer;\n  color: #555;\n  position: relative;\n}\n.ex14-tab:last-child { border-right: none; }\n.ex14-tab:hover { background: rgba(0,0,0,0.04); color: #111; }\n\n.ex14-tab.is-active {\n  background: #fff;\n  color: #1B37FF;\n  font-weight: 700;\n  border-bottom: 2.5px solid #1B37FF;\n  margin-bottom: -1.5px;\n}\n\n@supports (view-transition-name: none) {\n  .ex14-tab.is-active {\n    view-transition-name: ex14-indicator;\n  }\n}\n\n.ex14-panels { padding: 20px; }\n\n.ex14-panel {\n  font-size: 0.85rem;\n  line-height: 1.6;\n  color: #333;\n}',
        js: 'var tabs = document.querySelectorAll(".ex14-tab");\n\ntabs.forEach(function(tab) {\n  tab.addEventListener("click", function() {\n    var targetId = "ex14-panel-" + tab.dataset.tab;\n    function doSwitch() {\n      document.querySelectorAll(".ex14-tab").forEach(function(t) {\n        var wasActive = t.classList.contains("is-active");\n        t.classList.remove("is-active");\n        t.setAttribute("aria-selected", "false");\n        if (wasActive) t.style.viewTransitionName = "";\n      });\n      document.querySelectorAll(".ex14-panel").forEach(function(p) {\n        p.hidden = (p.id !== targetId);\n      });\n      tab.classList.add("is-active");\n      tab.setAttribute("aria-selected", "true");\n      tab.style.viewTransitionName = "ex14-indicator";\n    }\n    if (document.startViewTransition) {\n      document.startViewTransition(doSwitch);\n    } else {\n      doSwitch();\n    }\n  });\n});',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex15",
        num: "15",
        title: "Thumbnail Expands to Detail Card",
        tags: ["view transitions", "view-transition-name"],
        support:
          "Fallback: instant show/hide without expand animation when View Transitions API is not supported.",
        html: '<div class="ex15-demo" id="ex15-demo">\n  <div class="ex15-grid">\n    <button class="ex15-thumb" data-item="1" type="button" aria-label="Expand item 1">\n      <span class="ex15-thumb-label">Item 01</span>\n    </button>\n    <button class="ex15-thumb" data-item="2" type="button" aria-label="Expand item 2">\n      <span class="ex15-thumb-label">Item 02</span>\n    </button>\n    <button class="ex15-thumb" data-item="3" type="button" aria-label="Expand item 3">\n      <span class="ex15-thumb-label">Item 03</span>\n    </button>\n  </div>\n  <div class="ex15-detail" id="ex15-detail" hidden>\n    <button class="ex15-close" id="ex15-close" type="button" aria-label="Close detail">&#x2715; Close</button>\n    <p class="ex15-detail-id" id="ex15-detail-id"></p>\n    <p class="ex15-detail-body">This detail card morphed from the thumbnail using <code>startViewTransition()</code> and <code>view-transition-name</code> on matched elements.</p>\n  </div>\n</div>',
        css: '.ex15-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n\n.ex15-thumb {\n  aspect-ratio: 4/3;\n  background: repeating-linear-gradient(-45deg, #1B37FF 0, #1B37FF 2px, #F3F1EA 2px, #F3F1EA 12px);\n  border: 1.5px solid #111;\n  cursor: pointer;\n  display: flex;\n  align-items: flex-end;\n  padding: 8px;\n  transition: box-shadow 0.15s;\n}\n.ex15-thumb:hover { box-shadow: 4px 4px 0 #111; }\n\n.ex15-thumb-label {\n  background: #111;\n  color: #fff;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.65rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  padding: 3px 8px;\n  pointer-events: none;\n}\n\n@supports (view-transition-name: none) {\n  .ex15-thumb[data-active="true"] {\n    view-transition-name: ex15-card;\n  }\n  .ex15-detail {\n    view-transition-name: ex15-card;\n  }\n}\n\n.ex15-detail {\n  background: #fff;\n  border: 1.5px solid #111;\n  box-shadow: 6px 6px 0 #111;\n  padding: 24px;\n}\n\n.ex15-close {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  background: none;\n  border: 1.5px solid #111;\n  padding: 6px 14px;\n  cursor: pointer;\n  margin-bottom: 14px;\n}\n.ex15-close:hover { background: #111; color: #fff; }\n\n.ex15-detail-id {\n  font-size: 2rem;\n  font-weight: 900;\n  color: #1B37FF;\n  margin-bottom: 10px;\n}\n\n.ex15-detail-body {\n  font-size: 0.85rem;\n  line-height: 1.6;\n  color: #555;\n}',
        js: 'var thumbs  = document.querySelectorAll(".ex15-thumb");\nvar detail  = document.getElementById("ex15-detail");\nvar detailId= document.getElementById("ex15-detail-id");\nvar closeBtn= document.getElementById("ex15-close");\nvar current = null;\n\nfunction expand(item) {\n  if (current) current.removeAttribute("data-active");\n  item.setAttribute("data-active", "true");\n  current = item;\n  detailId.textContent = "Item " + item.dataset.item.padStart(2,"0");\n  function doExpand() {\n    item.style.viewTransitionName = "ex15-card";\n    detail.hidden = false;\n  }\n  if (document.startViewTransition) {\n    document.startViewTransition(doExpand);\n  } else {\n    doExpand();\n  }\n}\n\nfunction collapse() {\n  function doCollapse() {\n    detail.hidden = true;\n    if (current) { current.removeAttribute("data-active"); current.style.viewTransitionName = ""; current = null; }\n  }\n  if (document.startViewTransition) {\n    document.startViewTransition(doCollapse);\n  } else {\n    doCollapse();\n  }\n}\n\nthumbs.forEach(function(t) { t.addEventListener("click", function() { expand(t); }); });\nif (closeBtn) closeBtn.addEventListener("click", collapse);',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex16",
        num: "16",
        title: "List Shuffle with Animated Reordering",
        tags: ["view transitions", "view-transition-name"],
        support:
          "Fallback: instant shuffle without animation when View Transitions API is not supported.",
        html: '<div class="ex16-demo">\n  <button class="ex16-shuffle-btn" id="ex16-shuffle" type="button">Shuffle</button>\n  <ul class="ex16-list" id="ex16-list">\n    <li class="ex16-item" data-id="a">Alpha</li>\n    <li class="ex16-item" data-id="b">Beta</li>\n    <li class="ex16-item" data-id="c">Gamma</li>\n    <li class="ex16-item" data-id="d">Delta</li>\n    <li class="ex16-item" data-id="e">Epsilon</li>\n  </ul>\n</div>',
        css: '.ex16-shuffle-btn {\n  margin-bottom: 14px;\n  padding: 10px 24px;\n  background: #111;\n  color: #C8FF00;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n.ex16-shuffle-btn:hover { background: #1B37FF; border-color: #1B37FF; color: #fff; }\n\n.ex16-list {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.ex16-item {\n  padding: 14px 20px;\n  background: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.85rem;\n  font-weight: 500;\n  letter-spacing: 0.04em;\n}',
        js: 'var list    = document.getElementById("ex16-list");\nvar shuffleBtn = document.getElementById("ex16-shuffle");\n\nfunction shuffle() {\n  var items = Array.from(list.querySelectorAll(".ex16-item"));\n  items.forEach(function(item) {\n    item.style.viewTransitionName = "ex16-item-" + item.dataset.id;\n  });\n  function doShuffle() {\n    for (var i = items.length - 1; i > 0; i--) {\n      var j = Math.floor(Math.random() * (i + 1));\n      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;\n    }\n    items.forEach(function(item) { list.appendChild(item); });\n  }\n  if (document.startViewTransition) {\n    document.startViewTransition(doShuffle);\n  } else {\n    doShuffle();\n  }\n}\n\nif (shuffleBtn) shuffleBtn.addEventListener("click", shuffle);',
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "E",
    id: "anchor",
    title: "Anchor Positioning",
    desc: "anchor-name  ·  position-anchor  ·  position-try-fallbacks",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex17",
        num: "17",
        title: "Tooltip with position-try Fallbacks",
        tags: ["anchor-name", "position-try-fallbacks"],
        support:
          "Fallback: tooltip positioned with absolute/transform when anchor positioning is not supported.",
        html: '<div class="ex17-demo">\n  <p class="ex17-hint">Hover a button. The tooltip uses CSS anchor positioning to avoid clipping.</p>\n  <div class="ex17-btns">\n    <button class="ex17-trigger" id="ex17-btn1" type="button" aria-describedby="ex17-tip1">Left button</button>\n    <button class="ex17-trigger" id="ex17-btn2" type="button" aria-describedby="ex17-tip2">Middle button</button>\n    <button class="ex17-trigger" id="ex17-btn3" type="button" aria-describedby="ex17-tip3">Right button</button>\n  </div>\n  <div class="ex17-tooltip" id="ex17-tip1" role="tooltip">Anchored to left button</div>\n  <div class="ex17-tooltip" id="ex17-tip2" role="tooltip">Anchored to middle</div>\n  <div class="ex17-tooltip" id="ex17-tip3" role="tooltip">Anchored to right button</div>\n</div>',
        css: '.ex17-demo {\n  position: relative;\n  padding: 60px 20px 20px;\n}\n\n.ex17-hint {\n  font-size: 0.78rem;\n  color: #555;\n  margin-bottom: 20px;\n  font-family: "IBM Plex Mono", monospace;\n}\n\n.ex17-btns {\n  display: flex;\n  gap: 8px;\n  justify-content: space-between;\n}\n\n.ex17-trigger {\n  padding: 10px 16px;\n  border: 1.5px solid #111;\n  background: #F3F1EA;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n.ex17-trigger:hover { background: #111; color: #fff; }\n\n/* Anchor positioning */\n#ex17-btn1  { anchor-name: --ex17-a1; }\n#ex17-btn2  { anchor-name: --ex17-a2; }\n#ex17-btn3  { anchor-name: --ex17-a3; }\n\n.ex17-tooltip {\n  position: absolute;\n  background: #111;\n  color: #fff;\n  padding: 6px 12px;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.68rem;\n  letter-spacing: 0.05em;\n  white-space: nowrap;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.15s;\n  z-index: 10;\n}\n\n#ex17-tip1 {\n  position-anchor: --ex17-a1;\n  bottom: anchor(top);\n  left: anchor(left);\n}\n#ex17-tip2 {\n  position-anchor: --ex17-a2;\n  bottom: anchor(top);\n  left: anchor(center);\n  translate: -50% 0;\n}\n#ex17-tip3 {\n  position-anchor: --ex17-a3;\n  bottom: anchor(top);\n  right: anchor(right);\n  translate: 0 0;\n}\n\n@supports not (anchor-name: --x) {\n  .ex17-tooltip {\n    position: absolute;\n    bottom: calc(100% + 8px);\n    left: 50%;\n    translate: -50% 0;\n  }\n}\n\n.ex17-trigger:hover + .ex17-tooltip,\n.ex17-trigger:focus + .ex17-tooltip {\n  opacity: 1;\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex18",
        num: "18",
        title: "Popover Menu with Anchor",
        tags: ["popover", "anchor-name", "position-anchor"],
        support:
          "Fallback: JS toggles visibility when popover attribute is not supported.",
        html: '<div class="ex18-demo">\n  <button class="ex18-trigger" id="ex18-trigger" popovertarget="ex18-menu" type="button" aria-haspopup="menu">Open Menu &#9660;</button>\n  <div class="ex18-menu" id="ex18-menu" popover="auto" role="menu" aria-labelledby="ex18-trigger">\n    <button class="ex18-item" role="menuitem" type="button">Edit</button>\n    <button class="ex18-item" role="menuitem" type="button">Duplicate</button>\n    <button class="ex18-item" role="menuitem" type="button">Archive</button>\n    <hr class="ex18-divider">\n    <button class="ex18-item ex18-item--danger" role="menuitem" type="button">Delete</button>\n  </div>\n</div>',
        css: '.ex18-demo {\n  position: relative;\n  min-height: 180px;\n  padding: 20px;\n}\n\n.ex18-trigger {\n  anchor-name: --ex18-btn;\n  padding: 10px 20px;\n  background: #111;\n  color: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n.ex18-trigger:hover { background: #1B37FF; border-color: #1B37FF; }\n\n.ex18-menu {\n  position-anchor: --ex18-btn;\n  position: absolute;\n  top: anchor(bottom);\n  left: anchor(left);\n  margin-top: 4px;\n  background: #fff;\n  border: 1.5px solid #111;\n  box-shadow: 4px 4px 0 #111;\n  min-width: 160px;\n  padding: 4px 0;\n}\n\n@supports not (anchor-name: --x) {\n  .ex18-menu {\n    position: absolute;\n    top: 52px;\n    left: 20px;\n  }\n}\n\n.ex18-menu:not(:popover-open) { display: none; }\n\n.ex18-item {\n  display: block;\n  width: 100%;\n  text-align: left;\n  padding: 10px 16px;\n  background: none;\n  border: none;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  cursor: pointer;\n  color: #111;\n  letter-spacing: 0.04em;\n}\n.ex18-item:hover { background: #F3F1EA; }\n\n.ex18-item--danger { color: #cc0000; }\n.ex18-item--danger:hover { background: #fff0f0; }\n\n.ex18-divider {\n  border: none;\n  border-top: 1px solid #ddd;\n  margin: 4px 0;\n}',
        js: '// Native popover attribute handles open/close.\n// JS fallback for browsers without popover support.\n(function() {\n  var trigger = document.getElementById("ex18-trigger");\n  var menu    = document.getElementById("ex18-menu");\n  if (!trigger || !menu) return;\n  if (typeof menu.showPopover === "function") return; // native\n  // Fallback\n  menu.style.display = "none";\n  trigger.addEventListener("click", function() {\n    var isOpen = menu.style.display !== "none";\n    menu.style.display = isOpen ? "none" : "block";\n  });\n  document.addEventListener("click", function(e) {\n    if (!menu.contains(e.target) && e.target !== trigger) {\n      menu.style.display = "none";\n    }\n  });\n}());',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex19",
        num: "19",
        title: "Annotation Callouts on a Diagram",
        tags: ["anchor-name", "position-anchor"],
        support:
          "Fallback: callouts use static absolute positioning when anchor positioning is not supported.",
        html: '<div class="ex19-diagram" aria-label="Annotated architecture diagram">\n  <div class="ex19-node" id="ex19-node1" aria-describedby="ex19-ann1">Client</div>\n  <div class="ex19-node" id="ex19-node2" aria-describedby="ex19-ann2">API</div>\n  <div class="ex19-node" id="ex19-node3" aria-describedby="ex19-ann3">DB</div>\n  <div class="ex19-annotation" id="ex19-ann1" role="note">Browser sends<br>HTTP request</div>\n  <div class="ex19-annotation" id="ex19-ann2" role="note">Gateway routes<br>and validates</div>\n  <div class="ex19-annotation" id="ex19-ann3" role="note">PostgreSQL<br>primary node</div>\n</div>',
        css: '.ex19-diagram {\n  position: relative;\n  height: 220px;\n  background: #fff;\n  border: 1.5px solid #111;\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  padding: 0 30px;\n}\n\n.ex19-node {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 80px;\n  height: 80px;\n  background: #F3F1EA;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  box-shadow: 3px 3px 0 #111;\n}\n\n#ex19-node1 { anchor-name: --ex19-n1; }\n#ex19-node2 { anchor-name: --ex19-n2; }\n#ex19-node3 { anchor-name: --ex19-n3; }\n\n.ex19-annotation {\n  position: absolute;\n  background: #111;\n  color: #C8FF00;\n  padding: 6px 10px;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.6rem;\n  letter-spacing: 0.06em;\n  line-height: 1.5;\n  white-space: nowrap;\n  pointer-events: none;\n}\n\n#ex19-ann1 {\n  position-anchor: --ex19-n1;\n  top: anchor(bottom);\n  left: anchor(center);\n  translate: -50% 8px;\n}\n#ex19-ann2 {\n  position-anchor: --ex19-n2;\n  bottom: anchor(top);\n  left: anchor(center);\n  translate: -50% -8px;\n}\n#ex19-ann3 {\n  position-anchor: --ex19-n3;\n  top: anchor(bottom);\n  left: anchor(center);\n  translate: -50% 8px;\n}\n\n@supports not (anchor-name: --x) {\n  #ex19-ann1 { top: 66%;  left: 8%;  translate: none; }\n  #ex19-ann2 { top: 5%;   left: 40%; translate: -50% 0; }\n  #ex19-ann3 { top: 66%;  left: 68%; translate: none; }\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex20",
        num: "20",
        title: "Hover Indicator That Follows Nav",
        tags: ["anchor-name", "position-anchor"],
        support:
          "Fallback: standard background highlight on hover when anchor positioning is not supported.",
        html: '<nav class="ex20-nav" aria-label="Anchor-following nav demo">\n  <a class="ex20-link" id="ex20-l1" href="#">Home</a>\n  <a class="ex20-link" id="ex20-l2" href="#">Work</a>\n  <a class="ex20-link" id="ex20-l3" href="#">About</a>\n  <a class="ex20-link" id="ex20-l4" href="#">Contact</a>\n  <div class="ex20-indicator" aria-hidden="true"></div>\n</nav>',
        css: '.ex20-nav {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  position: relative;\n  padding: 6px;\n  background: #F3F1EA;\n  border: 1.5px solid #111;\n}\n\n.ex20-link {\n  padding: 10px 20px;\n  text-decoration: none;\n  color: #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.06em;\n  position: relative;\n  z-index: 1;\n}\n\n#ex20-l1 { anchor-name: --ex20-l1; }\n#ex20-l2 { anchor-name: --ex20-l2; }\n#ex20-l3 { anchor-name: --ex20-l3; }\n#ex20-l4 { anchor-name: --ex20-l4; }\n\n.ex20-indicator {\n  position: absolute;\n  background: #1B37FF;\n  opacity: 0;\n  transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s, opacity 0.15s;\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ex20-nav:has(#ex20-l1:hover) .ex20-indicator {\n  position-anchor: --ex20-l1;\n  top: anchor(top); left: anchor(left);\n  width: anchor-size(width); height: anchor-size(height);\n  opacity: 1;\n}\n.ex20-nav:has(#ex20-l2:hover) .ex20-indicator {\n  position-anchor: --ex20-l2;\n  top: anchor(top); left: anchor(left);\n  width: anchor-size(width); height: anchor-size(height);\n  opacity: 1;\n}\n.ex20-nav:has(#ex20-l3:hover) .ex20-indicator {\n  position-anchor: --ex20-l3;\n  top: anchor(top); left: anchor(left);\n  width: anchor-size(width); height: anchor-size(height);\n  opacity: 1;\n}\n.ex20-nav:has(#ex20-l4:hover) .ex20-indicator {\n  position-anchor: --ex20-l4;\n  top: anchor(top); left: anchor(left);\n  width: anchor-size(width); height: anchor-size(height);\n  opacity: 1;\n}\n\n@supports not (anchor-name: --x) {\n  .ex20-link:hover { background: rgba(27,55,255,0.12); }\n  .ex20-indicator  { display: none; }\n}',
        js: "// No JavaScript needed",
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "F",
    id: "has",
    title: ":has()",
    desc: ":has()  ·  quantity queries  ·  relational selectors",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex21",
        num: "21",
        title: "Card That Restyles When Checked",
        tags: [":has()", "checkbox", "radio"],
        support: "Fallback: no restyle on check when :has() is not supported.",
        html: '<div class="ex21-demo">\n  <label class="ex21-card">\n    <input class="ex21-check" type="checkbox" name="ex21-opt" aria-label="Select Plan A">\n    <span class="ex21-card-body">\n      <span class="ex21-card-title">Plan A</span>\n      <span class="ex21-card-desc">Basic — great for individuals</span>\n    </span>\n    <span class="ex21-checkmark" aria-hidden="true"></span>\n  </label>\n  <label class="ex21-card">\n    <input class="ex21-check" type="checkbox" name="ex21-opt" aria-label="Select Plan B">\n    <span class="ex21-card-body">\n      <span class="ex21-card-title">Plan B</span>\n      <span class="ex21-card-desc">Pro — teams of up to 20</span>\n    </span>\n    <span class="ex21-checkmark" aria-hidden="true"></span>\n  </label>\n  <label class="ex21-card">\n    <input class="ex21-check" type="checkbox" name="ex21-opt" aria-label="Select Plan C">\n    <span class="ex21-card-body">\n      <span class="ex21-card-title">Plan C</span>\n      <span class="ex21-card-desc">Enterprise — unlimited seats</span>\n    </span>\n    <span class="ex21-checkmark" aria-hidden="true"></span>\n  </label>\n</div>',
        css: '.ex21-demo {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.ex21-card {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 16px 20px;\n  border: 1.5px solid #ccc;\n  background: #fff;\n  cursor: pointer;\n  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;\n}\n\n.ex21-check {\n  width: 18px;\n  height: 18px;\n  accent-color: #1B37FF;\n  flex-shrink: 0;\n}\n\n.ex21-card-body { flex: 1; }\n\n.ex21-card-title {\n  display: block;\n  font-weight: 700;\n  font-size: 0.9rem;\n  margin-bottom: 2px;\n}\n\n.ex21-card-desc {\n  display: block;\n  font-size: 0.78rem;\n  color: #555;\n  font-family: "IBM Plex Mono", monospace;\n}\n\n.ex21-checkmark {\n  width: 22px;\n  height: 22px;\n  border: 1.5px solid #ccc;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  font-size: 0.9rem;\n}\n\n/* :has() magic */\n@supports selector(:has(a)) {\n  .ex21-card:has(.ex21-check:checked) {\n    border-color: #1B37FF;\n    background: #f0f3ff;\n    box-shadow: 4px 4px 0 #1B37FF;\n  }\n  .ex21-card:has(.ex21-check:checked) .ex21-checkmark::after {\n    content: "&#10003;";\n  }\n  .ex21-card:has(.ex21-check:checked) .ex21-checkmark {\n    border-color: #1B37FF;\n    color: #1B37FF;\n    font-weight: 700;\n  }\n}',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex22",
        num: "22",
        title: "Form Validity States — Zero JS",
        tags: [":has()", ":valid", ":invalid", ":placeholder-shown"],
        support:
          "Fallback: default browser validation styles when :has() is not supported.",
        html: '<form class="ex22-form" novalidate>\n  <div class="ex22-field">\n    <label class="ex22-label" for="ex22-name">Full Name *</label>\n    <input class="ex22-input" id="ex22-name" type="text" placeholder="Jane Smith" required minlength="3" aria-required="true">\n    <span class="ex22-msg ex22-msg--error" aria-live="polite">Please enter your full name (min 3 chars)</span>\n    <span class="ex22-msg ex22-msg--ok" aria-live="polite">Looks good!</span>\n  </div>\n  <div class="ex22-field">\n    <label class="ex22-label" for="ex22-email">Email *</label>\n    <input class="ex22-input" id="ex22-email" type="email" placeholder="jane@example.com" required aria-required="true">\n    <span class="ex22-msg ex22-msg--error" aria-live="polite">Enter a valid email address</span>\n    <span class="ex22-msg ex22-msg--ok" aria-live="polite">Valid email!</span>\n  </div>\n  <button class="ex22-submit" type="submit">Submit</button>\n</form>',
        css: '.ex22-form {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n  max-width: 360px;\n}\n\n.ex22-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.ex22-label {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.72rem;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: #555;\n}\n\n.ex22-input {\n  padding: 10px 14px;\n  border: 1.5px solid #ccc;\n  background: #fff;\n  font-family: inherit;\n  font-size: 0.9rem;\n  color: #111;\n  transition: border-color 0.15s;\n}\n.ex22-input:focus { border-color: #1B37FF; outline: none; }\n\n.ex22-msg { font-family: "IBM Plex Mono", monospace; font-size: 0.65rem; }\n.ex22-msg--error { color: #cc0000; display: none; }\n.ex22-msg--ok    { color: #1B7B1B; display: none; }\n\n/* :has() driven states — no JS */\n@supports selector(:has(a)) {\n  .ex22-field:has(.ex22-input:not(:placeholder-shown):invalid) .ex22-msg--error { display: block; }\n  .ex22-field:has(.ex22-input:not(:placeholder-shown):valid)   .ex22-msg--ok    { display: block; }\n  .ex22-field:has(.ex22-input:not(:placeholder-shown):invalid) .ex22-input {\n    border-color: #cc0000;\n  }\n  .ex22-field:has(.ex22-input:not(:placeholder-shown):valid) .ex22-input {\n    border-color: #1B7B1B;\n  }\n}\n\n.ex22-submit {\n  padding: 12px 28px;\n  background: #111;\n  color: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  cursor: pointer;\n  align-self: flex-start;\n}\n.ex22-submit:hover { background: #1B37FF; border-color: #1B37FF; }',
        js: "// No JavaScript needed",
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex23",
        num: "23",
        title: "Quantity-Aware Grid",
        tags: [":has()", "quantity queries", ":nth-child"],
        support: "Fallback: single-column layout when :has() is not supported.",
        html: '<div class="ex23-demo">\n  <p class="ex23-hint">Add or remove items to see the grid layout change automatically.</p>\n  <div class="ex23-controls">\n    <button class="ex23-btn" id="ex23-add" type="button">+ Add item</button>\n    <button class="ex23-btn" id="ex23-remove" type="button">&#8722; Remove</button>\n  </div>\n  <div class="ex23-grid" id="ex23-grid">\n    <div class="ex23-item">01</div>\n    <div class="ex23-item">02</div>\n    <div class="ex23-item">03</div>\n  </div>\n</div>',
        css: '.ex23-hint {\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.72rem;\n  color: #555;\n  margin-bottom: 12px;\n}\n\n.ex23-controls {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 14px;\n}\n\n.ex23-btn {\n  padding: 8px 18px;\n  border: 1.5px solid #111;\n  background: #F3F1EA;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.72rem;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n.ex23-btn:hover { background: #111; color: #fff; }\n\n.ex23-grid {\n  display: grid;\n  gap: 8px;\n  grid-template-columns: 1fr;\n}\n\n.ex23-item {\n  padding: 20px;\n  background: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 1.2rem;\n  font-weight: 700;\n  text-align: center;\n  color: #1B37FF;\n}\n\n/* Quantity queries via :has() */\n@supports selector(:has(a)) {\n  /* 2 items */\n  .ex23-grid:has(.ex23-item:nth-child(2)):not(:has(.ex23-item:nth-child(3))) {\n    grid-template-columns: 1fr 1fr;\n  }\n  /* 3–4 items */\n  .ex23-grid:has(.ex23-item:nth-child(3)):not(:has(.ex23-item:nth-child(5))) {\n    grid-template-columns: 1fr 1fr 1fr;\n  }\n  /* 5+ items */\n  .ex23-grid:has(.ex23-item:nth-child(5)) {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}',
        js: 'var grid   = document.getElementById("ex23-grid");\nvar addBtn = document.getElementById("ex23-add");\nvar remBtn = document.getElementById("ex23-remove");\nvar count  = 3;\n\nif (addBtn) addBtn.addEventListener("click", function() {\n  count++;\n  var item = document.createElement("div");\n  item.className = "ex23-item";\n  item.textContent = String(count).padStart(2, "0");\n  grid.appendChild(item);\n});\n\nif (remBtn) remBtn.addEventListener("click", function() {\n  var items = grid.querySelectorAll(".ex23-item");\n  if (items.length > 1) {\n    grid.removeChild(items[items.length - 1]);\n    count = items.length - 1;\n  }\n});',
      },
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex24",
        num: "24",
        title: "Dim Siblings on Hover",
        tags: [":has()", ":hover"],
        support: "Fallback: no dimming effect when :has() is not supported.",
        html: '<ul class="ex24-list" aria-label="Portfolio items">\n  <li class="ex24-item">System Design</li>\n  <li class="ex24-item">Typography</li>\n  <li class="ex24-item">Motion Design</li>\n  <li class="ex24-item">Color Theory</li>\n  <li class="ex24-item">Accessibility</li>\n</ul>',
        css: ".ex24-list {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n\n.ex24-item {\n  padding: 18px 24px;\n  border-bottom: 1px solid #ddd;\n  font-size: 1.1rem;\n  font-weight: 700;\n  letter-spacing: -0.01em;\n  cursor: default;\n  transition: opacity 0.2s, color 0.2s;\n  border-left: 4px solid transparent;\n}\n.ex24-item:first-child { border-top: 1px solid #ddd; }\n.ex24-item:hover {\n  border-left-color: #1B37FF;\n  color: #1B37FF;\n}\n\n/* Dim siblings via :has() — the list is hovered but this item is not */\n@supports selector(:has(a)) {\n  .ex24-list:has(.ex24-item:hover) .ex24-item:not(:hover) {\n    opacity: 0.3;\n  }\n}",
        js: "// No JavaScript needed",
      },
    ],
  },

  /* ════════════════════════════════════════════════════════════════════════ */
  {
    letter: "G",
    id: "bonus",
    title: "Bonus",
    desc: "@starting-style  ·  interpolate-size  ·  @scope  ·  linear() easing",
    examples: [
      /* ─────────────────────────────────────────────────────────────────── */
      {
        id: "ex25",
        num: "25",
        title: "@starting-style Dialog Entry",
        tags: ["@starting-style", "dialog"],
        support:
          "Fallback: dialog appears instantly without entry animation when @starting-style is not supported.",
        html: '<div class="ex25-demo">\n  <button class="ex25-open" id="ex25-open" type="button">Open Dialog</button>\n  <dialog class="ex25-dialog" id="ex25-dialog" aria-labelledby="ex25-dialog-title">\n    <h2 class="ex25-dialog-title" id="ex25-dialog-title">@starting-style</h2>\n    <p class="ex25-dialog-body">This dialog entry animation is driven by <code>@starting-style</code>. The browser captures the starting state (opacity 0, translate down) when the element first becomes visible, then transitions to the normal state — no JS class toggles needed.</p>\n    <button class="ex25-close" id="ex25-close" type="button" autofocus>Close</button>\n  </dialog>\n</div>',
        css: '.ex25-demo {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 180px;\n}\n\n.ex25-open {\n  padding: 12px 28px;\n  background: #111;\n  color: #fff;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.78rem;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n.ex25-open:hover { background: #1B37FF; border-color: #1B37FF; }\n\n.ex25-dialog {\n  border: 1.5px solid #111;\n  box-shadow: 6px 6px 0 #111;\n  background: #fff;\n  padding: 28px 32px;\n  max-width: 380px;\n  width: 90%;\n  opacity: 1;\n  translate: 0 0;\n  transition: opacity 0.3s, translate 0.3s, display 0.3s allow-discrete, overlay 0.3s allow-discrete;\n}\n\n.ex25-dialog[open] {\n  opacity: 1;\n  translate: 0 0;\n}\n\n@supports (selector(:has(a))) {\n  @starting-style {\n    .ex25-dialog[open] {\n      opacity: 0;\n      translate: 0 24px;\n    }\n  }\n}\n\n.ex25-dialog::backdrop {\n  background: rgba(17,17,17,0.5);\n  transition: background 0.3s, display 0.3s allow-discrete, overlay 0.3s allow-discrete;\n}\n\n@starting-style {\n  .ex25-dialog[open]::backdrop {\n    background: rgba(17,17,17,0);\n  }\n}\n\n.ex25-dialog-title {\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin-bottom: 12px;\n  font-family: "IBM Plex Mono", monospace;\n  letter-spacing: 0.04em;\n}\n\n.ex25-dialog-body {\n  font-size: 0.82rem;\n  line-height: 1.6;\n  color: #555;\n  margin-bottom: 20px;\n}\n\n.ex25-close {\n  padding: 8px 20px;\n  background: #F3F1EA;\n  border: 1.5px solid #111;\n  font-family: "IBM Plex Mono", monospace;\n  font-size: 0.72rem;\n  cursor: pointer;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n}\n.ex25-close:hover { background: #111; color: #fff; }',
        js: 'var openBtn  = document.getElementById("ex25-open");\nvar dialog   = document.getElementById("ex25-dialog");\nvar closeBtn = document.getElementById("ex25-close");\nif (openBtn && dialog) {\n  openBtn.addEventListener("click", function() { dialog.showModal(); });\n}\nif (closeBtn && dialog) {\n  closeBtn.addEventListener("click", function() {\n    dialog.setAttribute("closing", "");\n    dialog.addEventListener("transitionend", function handler() {\n      dialog.removeAttribute("closing");\n      dialog.close();\n      dialog.removeEventListener("transitionend", handler);\n    }, { once: true });\n  });\n}',
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   § 2 · SYNTAX HIGHLIGHTER
   ══════════════════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightCSS(raw) {
  var s = escapeHtml(raw);
  // Comments
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
  // At-rules
  s = s.replace(/(@[\w-]+)/g, '<span class="hl-selector">$1</span>');
  // Selectors (lines ending with {)
  s = s.replace(/^([^{}<\n]+)\s*\{/gm, function (m, sel) {
    return '<span class="hl-selector">' + sel.trimEnd() + "</span> {";
  });
  // Properties
  s = s.replace(/([\w-]+)\s*:/g, '<span class="hl-prop">$1</span>:');
  // Quoted strings
  s = s.replace(
    /(&quot;[^&]*?&quot;|'[^']*?')/g,
    '<span class="hl-value">$1</span>',
  );
  // Numbers with units
  s = s.replace(
    /(\b\d+\.?\d*(%|px|rem|em|fr|vh|vw|deg|ms|s|cqi|cqw)?\b)/g,
    '<span class="hl-number">$1</span>',
  );
  return s;
}

function highlightHTML(raw) {
  // Tokenise tag-by-tag so attribute regexes can never bleed across tag boundaries.
  // Strategy: split on `<...>` boundaries, highlight each tag fragment independently,
  // then reassemble with the text nodes untouched (except HTML-escaping).
  var out = "";
  // Walk through raw source character by character via regex split on tags.
  // We use a capturing split so the delimiters (tags) are kept in the array.
  var parts = raw.split(/(<[^>]*>)/);
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.charAt(0) === "<") {
      // It's a tag — highlight it internally
      out += highlightHTMLTag(part);
    } else {
      // Text node — just escape
      out += escapeHtml(part);
    }
  }
  return out;
}

function highlightHTMLTag(tag) {
  // Handle comments
  if (/^<!--/.test(tag)) {
    return '<span class="hl-comment">' + escapeHtml(tag) + "</span>";
  }
  // Escape the whole tag first, then re-highlight its parts
  var s = escapeHtml(tag);
  // Opening/closing punctuation + tag name
  s = s.replace(
    /^(&lt;\/?)([\w-]+)/,
    '<span class="hl-punct">$1</span><span class="hl-tag">$2</span>',
  );
  // Closing > or />
  s = s.replace(/(\/?&gt;)$/, '<span class="hl-punct">$1</span>');
  // Attribute names (word= pattern, confined to this tag only)
  s = s.replace(/\s([\w-]+)(=)/g, ' <span class="hl-attr">$1</span>$2');
  // Attribute values (&quot;...&quot; or single-quoted)
  s = s.replace(
    /=(&quot;[^&]*?&quot;|'[^']*?')/g,
    '=<span class="hl-string">$1</span>',
  );
  // Boolean attributes (no value, e.g. hidden, disabled, required)
  s = s.replace(
    /\s([\w-]+)(?=\s|<span class="hl-punct">)/g,
    ' <span class="hl-attr">$1</span>',
  );
  return s;
}

function highlightJS(raw) {
  var s = escapeHtml(raw);
  // Line comments
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>');
  // Block comments
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');
  // Strings
  s = s.replace(
    /(&quot;[^&]*?&quot;|'[^']*?')/g,
    '<span class="hl-string">$1</span>',
  );
  // Keywords
  s = s.replace(
    /\b(var|let|const|function|return|if|else|for|while|new|this|true|false|null|undefined|typeof|instanceof|document|window)\b/g,
    '<span class="hl-keyword">$1</span>',
  );
  // Numbers
  s = s.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>');
  return s;
}

function highlight(code, lang) {
  if (lang === "css") return highlightCSS(code);
  if (lang === "html") return highlightHTML(code);
  if (lang === "js") return highlightJS(code);
  return escapeHtml(code);
}

/* ══════════════════════════════════════════════════════════════════════════
   § 3 · RENDER ENGINE
   ══════════════════════════════════════════════════════════════════════════ */

function injectExampleStyles() {
  GROUPS.forEach(function (group) {
    group.examples.forEach(function (ex) {
      var style = document.createElement("style");
      style.id = "style-" + ex.id;
      style.textContent = ex.css;
      document.head.appendChild(style);
    });
  });
}

function buildSpecimen(ex, groupLetter) {
  var total = GROUPS.reduce(function (acc, g) {
    return acc + g.examples.length;
  }, 0);

  // Build feature tags HTML
  var tagsHtml = ex.tags
    .map(function (t) {
      return '<span class="feature-tag">' + escapeHtml(t) + "</span>";
    })
    .join("");

  // Build the demo HTML by injecting it raw (it runs from the same strings)
  var demoHtml = ex.html;

  // Build tab panels
  var htmlHighlit =
    '<pre class="code-block" aria-label="HTML source">' +
    highlight(ex.html, "html") +
    "</pre>";
  var cssHighlit =
    '<pre class="code-block" aria-label="CSS source">' +
    highlight(ex.css, "css") +
    "</pre>";
  var jsHighlit =
    '<pre class="code-block" aria-label="JS source">' +
    highlight(ex.js, "js") +
    "</pre>";

  var art = document.createElement("article");
  art.className = "specimen";
  art.id = ex.id;
  art.setAttribute("aria-labelledby", ex.id + "-title");

  art.innerHTML = [
    '<header class="specimen__header">',
    "  <div>",
    '    <div class="specimen__index">' +
      ex.num +
      " / " +
      String(total).padStart(2, "0") +
      "</div>",
    '    <h3 class="specimen__title" id="' +
      ex.id +
      '-title">' +
      escapeHtml(ex.title) +
      "</h3>",
    "  </div>",
    '  <div class="specimen__meta">',
    "    " + tagsHtml,
    '    <span class="support-note" title="Browser support note">' +
      escapeHtml(ex.support) +
      "</span>",
    "  </div>",
    "</header>",
    '<div class="specimen__stage" id="' + ex.id + '-stage">',
    "  " + demoHtml,
    "</div>",
    '<div class="specimen__tabs" id="' + ex.id + '-tabs">',
    '  <div class="tabs__nav" role="tablist" aria-label="Code tabs for ' +
      escapeHtml(ex.title) +
      '">',
    '    <button class="tabs__btn" role="tab" aria-selected="true"  aria-controls="' +
      ex.id +
      '-panel-html" id="' +
      ex.id +
      '-tab-html">HTML</button>',
    '    <button class="tabs__btn" role="tab" aria-selected="false" aria-controls="' +
      ex.id +
      '-panel-css"  id="' +
      ex.id +
      '-tab-css">CSS</button>',
    '    <button class="tabs__btn" role="tab" aria-selected="false" aria-controls="' +
      ex.id +
      '-panel-js"   id="' +
      ex.id +
      '-tab-js">JS</button>',
    '    <div class="tabs__actions">',
    '      <button class="tabs__action-btn" data-copy="' +
      ex.id +
      '" type="button" aria-label="Copy code">Copy</button>',
    '      <button class="tabs__action-btn" data-playground="' +
      ex.id +
      '" type="button" aria-label="Open in playground">Open in Playground ↗</button>',
    "    </div>",
    "  </div>",
    '  <div class="tabs__panels">',
    '    <div class="tabs__panel" id="' +
      ex.id +
      '-panel-html" role="tabpanel" aria-labelledby="' +
      ex.id +
      '-tab-html" aria-hidden="false">',
    "      " + htmlHighlit,
    "    </div>",
    '    <div class="tabs__panel" id="' +
      ex.id +
      '-panel-css"  role="tabpanel" aria-labelledby="' +
      ex.id +
      '-tab-css"  aria-hidden="true">',
    "      " + cssHighlit,
    "    </div>",
    '    <div class="tabs__panel" id="' +
      ex.id +
      '-panel-js"   role="tabpanel" aria-labelledby="' +
      ex.id +
      '-tab-js"   aria-hidden="true">',
    "      " + jsHighlit,
    "    </div>",
    "  </div>",
    "</div>",
  ].join("\n");

  return art;
}

function buildFeatureGroup(group) {
  var section = document.createElement("section");
  section.className = "feature-group";
  section.id = "group-" + group.id;
  section.setAttribute("aria-labelledby", "group-title-" + group.id);

  var headerHtml = [
    '<div class="feature-group__header">',
    '  <span class="feature-group__letter" aria-hidden="true">' +
      group.letter +
      "</span>",
    '  <div class="feature-group__info">',
    '    <div class="feature-group__label">Group ' + group.letter + "</div>",
    '    <h2 class="feature-group__title" id="group-title-' +
      group.id +
      '">' +
      escapeHtml(group.title) +
      "</h2>",
    '    <p class="feature-group__desc">' + escapeHtml(group.desc) + "</p>",
    "  </div>",
    "</div>",
  ].join("\n");

  section.innerHTML = headerHtml;

  var examplesDiv = document.createElement("div");
  examplesDiv.className = "feature-group__examples";

  group.examples.forEach(function (ex) {
    examplesDiv.appendChild(buildSpecimen(ex, group.letter));
  });

  section.appendChild(examplesDiv);
  return section;
}

function renderExamples() {
  var root = document.getElementById("examples-root");
  if (!root) return;
  GROUPS.forEach(function (group) {
    root.appendChild(buildFeatureGroup(group));
  });
}

function runExampleScripts() {
  GROUPS.forEach(function (group) {
    group.examples.forEach(function (ex) {
      if (ex.js && ex.js.trim() !== "// No JavaScript needed") {
        try {
          // eslint-disable-next-line no-new-func
          new Function(ex.js)();
        } catch (e) {
          console.warn("[HAIRLINE] Script error in " + ex.id + ":", e);
        }
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   § 4 · TABS & COPY
   ══════════════════════════════════════════════════════════════════════════ */

function initTabs() {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest('.tabs__btn[role="tab"]');
    if (!btn) return;

    var tabList = btn.closest(".tabs__nav");
    var panels = btn
      .closest(".specimen__tabs")
      .querySelectorAll(".tabs__panel");
    var tabs = tabList.querySelectorAll('.tabs__btn[role="tab"]');

    tabs.forEach(function (t) {
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (p) {
      p.setAttribute("aria-hidden", "true");
    });

    btn.setAttribute("aria-selected", "true");
    var target = document.getElementById(btn.getAttribute("aria-controls"));
    if (target) target.setAttribute("aria-hidden", "false");
  });
}

function initCopyButtons() {
  document.addEventListener("click", function (e) {
    var copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      var exId = copyBtn.getAttribute("data-copy");
      var ex = findExample(exId);
      if (!ex) return;
      // Find the active tab
      var tabsEl = document.getElementById(exId + "-tabs");
      var activeTab = tabsEl
        ? tabsEl.querySelector('[aria-selected="true"]')
        : null;
      var lang = activeTab ? activeTab.textContent.toLowerCase() : "html";
      var code = lang === "css" ? ex.css : lang === "js" ? ex.js : ex.html;
      copyText(code, copyBtn);
      return;
    }

    var pgBtn = e.target.closest("[data-playground]");
    if (pgBtn) {
      var exId2 = pgBtn.getAttribute("data-playground");
      loadExampleIntoPlayground(exId2);
      document
        .getElementById("playground")
        .scrollIntoView({ behavior: "smooth" });
    }
  });
}

function copyText(text, btn) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function () {
      flashButton(btn, "Copied!");
    });
  } else {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    flashButton(btn, "Copied!");
  }
}

function flashButton(btn, msg) {
  var orig = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(function () {
    btn.textContent = orig;
    btn.disabled = false;
  }, 1400);
}

function findExample(id) {
  for (var i = 0; i < GROUPS.length; i++) {
    for (var j = 0; j < GROUPS[i].examples.length; j++) {
      if (GROUPS[i].examples[j].id === id) return GROUPS[i].examples[j];
    }
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════════════════
   § 5 · PLAYGROUND
   ══════════════════════════════════════════════════════════════════════════ */

var PG_DEFAULT = {
  html: '<div class="demo">\n  <h1>Hello, CSS Platform!</h1>\n  <p>Edit the panes to experiment.</p>\n</div>',
  css: ".demo {\n  font-family: system-ui, sans-serif;\n  padding: 32px;\n  text-align: center;\n}\n\nh1 { color: #1B37FF; }",
  js: "// JavaScript runs in a sandboxed iframe",
};

var pgDebounce;

function getPlaygroundCode() {
  return {
    html: document.getElementById("pg-html").value,
    css: document.getElementById("pg-css").value,
    js: document.getElementById("pg-js").value,
  };
}

function setPlaygroundCode(code) {
  document.getElementById("pg-html").value = code.html;
  document.getElementById("pg-css").value = code.css;
  document.getElementById("pg-js").value = code.js;
}

function buildSrcdoc(code) {
  return (
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    code.css +
    "</style></head><body>" +
    code.html +
    "<script>" +
    code.js.replace(/<\/script>/gi, "<\\/script>") +
    "<\/script></body></html>"
  );
}

function renderPlayground() {
  var code = getPlaygroundCode();
  var frame = document.getElementById("pg-frame");
  var errStrip = document.getElementById("pg-error");
  errStrip.hidden = true;
  frame.srcdoc = buildSrcdoc(code);
  updateShareLink(code);
}

function debouncedRender() {
  clearTimeout(pgDebounce);
  pgDebounce = setTimeout(renderPlayground, 250);
}

function updateShareLink(code) {
  var payload = JSON.stringify(code);
  try {
    var b64 = btoa(unescape(encodeURIComponent(payload)));
    var shareBtn = document.getElementById("pg-share");
    shareBtn.href = "#pg=" + b64;
  } catch (e) {
    /* ignore */
  }
}

function loadFromHash() {
  var hash = location.hash;
  var match = hash.match(/^#pg=(.+)/);
  if (match) {
    try {
      var decoded = decodeURIComponent(escape(atob(match[1])));
      var code = JSON.parse(decoded);
      if (code && code.html !== undefined) {
        setPlaygroundCode(code);
        renderPlayground();
        return;
      }
    } catch (e) {
      /* fallback */
    }
  }
  setPlaygroundCode(PG_DEFAULT);
  renderPlayground();
}

function loadExampleIntoPlayground(exId) {
  var ex = findExample(exId);
  if (!ex) return;
  setPlaygroundCode({ html: ex.html, css: ex.css, js: ex.js });
  renderPlayground();
}

function populateLoadDropdown() {
  var sel = document.getElementById("pg-load");
  GROUPS.forEach(function (group) {
    var optGroup = document.createElement("optgroup");
    optGroup.label = group.letter + ". " + group.title;
    group.examples.forEach(function (ex) {
      var opt = document.createElement("option");
      opt.value = ex.id;
      opt.textContent = ex.num + " — " + ex.title;
      optGroup.appendChild(opt);
    });
    sel.appendChild(optGroup);
  });
}

function initPlayground() {
  populateLoadDropdown();
  loadFromHash();

  // Editor input → debounced render
  ["pg-html", "pg-css", "pg-js"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", debouncedRender);
  });

  // Reset
  var resetBtn = document.getElementById("pg-reset");
  if (resetBtn)
    resetBtn.addEventListener("click", function () {
      setPlaygroundCode(PG_DEFAULT);
      renderPlayground();
    });

  // Copy all
  var copyAllBtn = document.getElementById("pg-copy-all");
  if (copyAllBtn)
    copyAllBtn.addEventListener("click", function () {
      var code = getPlaygroundCode();
      var all =
        "<!-- HTML -->\n" +
        code.html +
        "\n\n/* CSS */\n" +
        code.css +
        "\n\n// JS\n" +
        code.js;
      copyText(all, copyAllBtn);
    });

  // Load dropdown
  var sel = document.getElementById("pg-load");
  if (sel)
    sel.addEventListener("change", function () {
      if (sel.value) {
        loadExampleIntoPlayground(sel.value);
        sel.value = "";
      }
    });

  // Iframe error capture
  var frame = document.getElementById("pg-frame");
  if (frame) {
    frame.addEventListener("load", function () {
      try {
        frame.contentWindow.addEventListener("error", function (ev) {
          var errStrip = document.getElementById("pg-error");
          errStrip.textContent =
            "JS Error: " + ev.message + " (line " + ev.lineno + ")";
          errStrip.hidden = false;
        });
      } catch (e) {
        /* cross-origin; shouldn't happen with srcdoc */
      }
    });
  }

  // Share btn: copy URL
  var shareBtn = document.getElementById("pg-share");
  if (shareBtn) {
    shareBtn.addEventListener("click", function (e) {
      e.preventDefault();
      copyText(shareBtn.href, shareBtn);
    });
  }

  window.addEventListener("hashchange", loadFromHash);
}

/* ══════════════════════════════════════════════════════════════════════════
   § 6 · SUPPORT DETECTION & FEATURE CHIPS
   ══════════════════════════════════════════════════════════════════════════ */

var FEATURES = [
  {
    label: "scroll()",
    test: function () {
      return CSS.supports("animation-timeline", "scroll()");
    },
  },
  {
    label: "@property",
    test: function () {
      return (
        CSS.supports('(syntax: "<angle>")') ||
        (function () {
          try {
            CSS.registerProperty({
              name: "--_test",
              syntax: "<color>",
              inherits: false,
              initialValue: "red",
            });
            return true;
          } catch (e) {
            return false;
          }
        })()
      );
    },
  },
  {
    label: "container",
    test: function () {
      return CSS.supports("container-type", "inline-size");
    },
  },
  {
    label: "view-transition",
    test: function () {
      return typeof document.startViewTransition === "function";
    },
  },
  {
    label: "anchor-pos",
    test: function () {
      return CSS.supports("anchor-name", "--a");
    },
  },
  {
    label: ":has()",
    test: function () {
      return CSS.supports("selector(:has(a))");
    },
  },
];

function renderSupportChips() {
  var row = document.getElementById("support-row");
  if (!row) return;
  FEATURES.forEach(function (f) {
    var yes = false;
    try {
      yes = f.test();
    } catch (e) {
      yes = false;
    }
    var chip = document.createElement("span");
    chip.className =
      "support-chip " + (yes ? "support-chip--yes" : "support-chip--no");
    chip.textContent = f.label;
    chip.setAttribute(
      "title",
      f.label + ": " + (yes ? "supported" : "not supported"),
    );
    row.appendChild(chip);
  });
}

function injectReadingProgressBar() {
  if (CSS.supports("animation-timeline", "scroll()")) {
    var bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   § 7 · NAV RAIL
   ══════════════════════════════════════════════════════════════════════════ */

function buildNavRail() {
  var container = document.getElementById("nav-groups");
  if (!container) return;

  GROUPS.forEach(function (group) {
    var groupEl = document.createElement("div");
    groupEl.className = "nav-group";

    var titleEl = document.createElement("div");
    titleEl.className = "nav-group__title";
    titleEl.textContent = group.letter + " — " + group.title;
    groupEl.appendChild(titleEl);

    group.examples.forEach(function (ex) {
      var a = document.createElement("a");
      a.className = "nav-item";
      a.href = "#" + ex.id;

      var num = document.createElement("span");
      num.className = "nav-item__num";
      num.textContent = ex.num;
      num.setAttribute("aria-hidden", "true");

      var label = document.createElement("span");
      label.textContent = ex.title;

      a.appendChild(num);
      a.appendChild(label);
      groupEl.appendChild(a);
    });

    container.appendChild(groupEl);
  });
}

function initNavHighlight() {
  // Use IntersectionObserver for scroll-linked active state
  // (scroll-driven CSS highlight on siblings requires :has + container which
  //  may not be available in all targets; observer gives solid fallback)
  var items = document.querySelectorAll(".nav-item");
  if (!items.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          items.forEach(function (item) {
            item.classList.toggle(
              "is-active",
              item.getAttribute("href") === "#" + id,
            );
          });
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
  );

  GROUPS.forEach(function (group) {
    group.examples.forEach(function (ex) {
      var el = document.getElementById(ex.id);
      if (el) io.observe(el);
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   § 8 · THEME TOGGLE
   ══════════════════════════════════════════════════════════════════════════ */

function initThemeToggle() {
  var html   = document.documentElement;
  var btn    = document.getElementById("theme-toggle");
  var label  = btn && btn.querySelector(".theme-toggle__label");
  var STORE  = "hairline-theme";

  // Determine starting theme:
  // 1. localStorage wins (user has toggled before)
  // 2. fall back to OS preference
  // 3. default to "light"
  function getSystemPref() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE); } catch(e) {}
  var initial = saved || getSystemPref();
  applyTheme(initial, false);

  if (!btn) return;

  btn.addEventListener("click", function () {
    var current = html.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark", true);
  });

  // Also follow OS changes in real time when no manual override is stored
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      var manual = null;
      try { manual = localStorage.getItem(STORE); } catch(e) {}
      if (!manual) {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    });
  }

  function applyTheme(theme, persist) {
    html.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem(STORE, theme); } catch(e) {}
    }
    if (btn && label) {
      var isDark = theme === "dark";
      label.textContent    = isDark ? "Light" : "Dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   § 9 · INIT
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Inject all example CSS into <head> as separate <style> tags
  injectExampleStyles();

  // 2. Render feature groups & specimens
  renderExamples();

  // 3. Run per-example JS (from the same example strings)
  runExampleScripts();

  // 4. Wire tabs + copy buttons
  initTabs();
  initCopyButtons();

  // 5. Nav rail
  buildNavRail();
  initNavHighlight();

  // 6. Playground
  initPlayground();

  // 7. Support chips
  renderSupportChips();

  // 8. Reading progress bar (scroll-driven)
  injectReadingProgressBar();

  // 9. Theme toggle
  initThemeToggle();
});
