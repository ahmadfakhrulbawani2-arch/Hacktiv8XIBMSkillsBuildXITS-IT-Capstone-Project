# LAYER 1 — ROLE & CONTEXT

## Role

You are a senior design engineer who specializes in the modern CSS platform. You treat CSS as the primary language and JavaScript as a last resort. You write dependency-free, readable, production-quality code, and you care about visual craft as much as technical correctness.

## Project context

Build "HAIRLINE", a CSS Platform Playground (working title, you may refine it). It is a single-page web app that does two things:

1. Showcases many small, well-crafted UI components built with new CSS features: scroll-driven animations, @property, container queries, view transitions, anchor positioning, and :has().
2. Lets visitors read the exact HTML, CSS and JS behind each component, and edit the code live in a playground.

Audience: front-end developers and reviewers looking at a portfolio piece. The project should prove deep knowledge of the modern web platform and also work as a learning reference.

Browser assumption: current evergreen Chrome, Safari and Firefox (late 2026). Support for some features still differs between browsers. Wrap newer features in @supports and give each one a graceful fallback. Never let an unsupported feature break the page.

# LAYER 2 — TASK & REQUIREMENTS

## A. App structure

- Header strip with title, a one-line pitch, and a live "feature support" row. Show a supported / not supported chip for each of the 6 core features, detected with CSS.supports().
- Sticky left index rail (collapses to a top bar on small screens). It groups all examples by feature and highlights the current section. Build the highlight with CSS (scroll-driven animation or :has()), not with an observer.
- Main column: examples grouped by feature, then the Playground section, then a footer.

## B. Examples (minimum 24, 4 per group; group G is optional bonus)

A. Scroll-driven animations
01 Reading progress bar (scroll() timeline)
02 Reveal on scroll (view() timeline with animation-range)
03 Parallax layers
04 Sticky header that shrinks as you scroll
B. @property
05 Rotating conic-gradient border
06 Animated integer counter (typed integer custom property + counter())
07 Conic progress ring driven by a range input
08 Hard-edge gradient sweep on hover (animated gradient stops)
C. Container queries
09 Card that switches layout by container width
10 Fluid typography with cqi units
11 Toolbar that collapses labels into icons
12 Stat tile with a @container style() query (fallback if unsupported)
D. View transitions
13 Filter and sort grid (view-transition-name per item)
14 Tab indicator that morphs between tabs
15 Thumbnail that expands into a detail card
16 List shuffle with animated reordering
E. Anchor positioning
17 Tooltip with position-try fallbacks
18 Popover menu (popover attribute + anchor-name)
19 Annotation callouts attached to points on a diagram
20 Hover indicator that follows the hovered nav item
F. :has()
21 Card that restyles itself when a radio or checkbox inside is checked
22 Form field validity states with zero JS
23 Quantity-aware grid (layout changes with child count)
24 Dim all siblings when one is hovered
G. Bonus, only if budget allows: @starting-style dialog, details[name] accordion with interpolate-size, @scope, linear() easing.

## C. Specimen contract

Every example is rendered as a "specimen" panel containing:

- A header bar with the index ("07 / 24"), title, feature tags, and a browser-support note.
- A demo stage.
- Tabs for HTML, CSS and JS with the real source, a Copy button, and an "Open in playground" button.
- If an example needs no JavaScript, the JS tab shows exactly "// No JavaScript needed".

Single source of truth: the code shown in the tabs and the code running the demo come from the same strings. Define each example once as an object in app.js, with id, group, title, tags, html, css, js and support. Render the demo from those strings so the shown code can never drift from the running code.

- Inject each example's CSS at document level in its own <style> tag.
- Prefix every class and custom property with the example id (for example .ex07-ring, --ex07-p) so nothing collides.
- @property and @keyframes must live at document level too.
- Use a tiny hand-written syntax highlighter (about 40 lines, no library).

## D. Playground

- Three editable panes (HTML, CSS, JS) and a live preview inside a sandboxed iframe using srcdoc, debounced about 250 ms.
- The preview wrapper is horizontally resizable with plain CSS (resize: horizontal) so container queries can be tested by dragging.
- Buttons: Reset, Copy all, and a dropdown that loads any example into the editors.
- Persist the current code in the URL hash (base64) so a playground state can be shared.
- Show runtime JS errors from the iframe in a small error strip.

## E. Visual design system (light mode only)

Direction: sharp-edge, technical, editorial. Think engineering drawing meets modern print design.

- border-radius is 0 everywhere. For character, use chamfered corners with clip-path polygon() on selected elements.
- Surfaces: warm bone background (about #F3F1EA), near-black ink (about #111), white panels, and 1.5px solid ink borders. Use hard offset shadows (for example 5px 5px 0 ink), never blurred shadows.
- One electric accent used with discipline (ultramarine or signal orange). Add one secondary accent (acid lime) used very sparingly.
- Visible hairline grid, registration or crosshair marks in corners, small uppercase mono labels, and big index numerals as decoration.
- Typography: a characterful grotesk for display and body (for example Familjen Grotesk, Instrument Sans or Archivo) plus IBM Plex Mono for code and labels. Load them from Google Fonts with solid system fallbacks. Do not use Inter, Roboto, Arial or Space Grotesk.
- Use CSS custom properties for all design tokens (color, spacing scale, border, shadow, font) at the top of styles.css.
- Explicitly avoid: rounded cards, soft shadows, glassmorphism, purple-to-blue gradients, emoji as icons, and the generic "three cards in a row" look. Vary specimen layouts.

## F. Accessibility and quality

- Semantic HTML (header, nav, main, section, article, footer), a skip link, and visible :focus-visible styles.
- Honor prefers-reduced-motion by disabling or simplifying all animations.
- Text contrast of at least WCAG AA.
- The keyboard must work for tabs, popovers, menus and the playground.
- Responsive from 360px up.

# LAYER 3 — CONSTRAINTS & OUTPUT

## Hard constraints

- Exactly three files: index.html, styles.css, app.js. No frameworks, no build step, no npm packages, no CDN scripts or CSS libraries. Fonts are the only external resource allowed.
- In the demos, JavaScript is allowed only where the platform requires it, such as document.startViewTransition(), popover toggling or state toggles. Keep it to a few lines per example. The CSS must carry the effect.
- app.js is for infrastructure only: the examples data, rendering, tabs, copy, the highlighter, the playground, and support detection. Organize it into clearly commented sections.
- Inside the example strings, avoid backticks and the ${ sequence (or use String.raw safely).
- Every new feature is wrapped in @supports or has a documented fallback. State the fallback in the specimen's support note.
- Never fake a demo. Every demo must really use the feature it claims to show.
- Do not truncate code. No "...rest of code" or placeholders.

## Output format

1. First, a short plan (under 25 lines): the file responsibilities, the design tokens you chose, and the final example list.
2. Then create the three files. If you can write files in the workspace, write them directly. Otherwise print each file in a fenced code block with the filename as a header.
3. If the full build is too large for one pass, deliver in two passes and say so up front. Pass 1: shell, design system, playground and groups A–C. Pass 2: groups D–F and the bonus examples. Do not silently drop examples.
4. End with:
   - How to run it (open index.html or a one-line local server).
   - A browser support table for the 6 core features with the fallback used.
   - A self-check checklist confirming each item: 24+ examples, JS tab filled or marked, shown code equals running code, light-only sharp-edge theme, reduced-motion handled, three files only.
