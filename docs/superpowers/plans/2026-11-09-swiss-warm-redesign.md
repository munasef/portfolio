# Swiss / Warm Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin jaroschfx.com (`index.html`) into the approved Swiss-type / Warm-dark design, keeping the reel and all content.

**Architecture:** Static GitHub Pages site, no build. `css/style.css` is rewritten from scratch against new markup in `index.html`; `js/main.js` is trimmed (search, veils, skill-tag search removed) and gains a credits table renderer. Data files `js/projects.js` / `js/photos.js` are not touched.

**Tech Stack:** HTML, CSS, vanilla JS, Google Fonts (Inter Tight), Vimeo Player API, Formspree. Node 24 for the one check script.

**Spec:** `docs/superpowers/specs/2026-11-09-swiss-warm-redesign-design.md`
**Approved mockups:** `.superpowers/brainstorm/1792-1794235031/content/swiss-dark.html` (Warm palette) and `about-contact.html` (Timeline B + contact) — copy structure/values from these.

## Global Constraints

- Font: Inter Tight 400/500/700 from Google Fonts only. No Fontshare, no Space Mono, no other families.
- Palette tokens exactly: `--bg:#2a231d; --surface:#382f27; --text:#efe6d6; --muted:#a8998a; --ink:#e9c58a`. `--ink` is the only accent.
- No `text-transform: uppercase`, no positive `letter-spacing` above `0.01em`, no orange (`#d86a2e`, `#f07a37`, `ff5c2b`, `#ff5a33`), no emoji, no glow/glass, square corners.
- Sentence case for all copy.
- No visible email address anywhere.
- `js/projects.js` and `js/photos.js` unchanged (field formats are the owner's editing workflow).
- No new dependencies, no build step.

## Review Focus

1. Filter with zero matches (e.g. "Niagara" if only highlights match) → the empty block (highlights or table) hides; the other still shows; no orphan headings.
2. Project with no `poster` / broken image → card keeps its 2:3 box in `--surface`, no broken-image icon dominating.
3. Keyboard user → can tab to filters, highlight cards, table rows, showreel button; Enter opens the modal; Escape closes it; focus ring visible in `--ink`.
4. `prefers-reduced-motion: reduce` → hero shows `assets/banner.jpg`, no Vimeo iframe loaded.
5. Phone width (375px) → no horizontal scroll; hero facts row 2×2; timeline stacks; credits table drops Role column rather than overflowing.

Each is pinned in the owning task's verification step.

---

## File map

- `index.html` — markup for every section (rewrite body sections; keep head meta, gtag, Vimeo player script).
- `css/style.css` — full rewrite.
- `js/main.js` — trim + add `renderCredits()`.
- `tests/check-design.mjs` — new; static anti-goal + contrast check.
- `.gitignore` — new; `.superpowers/`.
- Delete: `design-preview.html`, `css/sim-hud.css`.

Local preview for all browser checks: `npx --yes http-server -p 8080 -c-1` from repo root, open `http://localhost:8080`.

---

### Task 1: Guard rails — check script, cleanup

**Files:**
- Create: `tests/check-design.mjs`, `.gitignore`
- Delete: `design-preview.html`, `css/sim-hud.css`

**Interfaces:**
- Produces: `node tests/check-design.mjs` → exit 0 and prints `design check ok`, or exit 1 listing each failure.

- [ ] **Step 1: Write `tests/check-design.mjs`** (plain Node, `fs` only). It must assert:
  - `css/style.css` contains no `uppercase`, no `Space Mono`, no `Cabinet`, no `Satoshi`, no `d86a2e|f07a37|ff5c2b|ff5a33` (case-insensitive).
  - `css/style.css` has no `letter-spacing:` value > `0.01em` (parse numbers after `letter-spacing:`; negative is fine).
  - `index.html` contains no `fontshare`, no `Space+Mono`, no `projectSearch`, no `showAllBtn`, no `projectsVeil`, no emoji in U+1F1E6–U+1F1FF (flags), no `mailto:`.
  - `js/main.js` contains no `ff5c2b`.
  - Contrast: WCAG ratio of `--muted` and `--text` vs `--bg`, read from `:root` in `style.css`, each ≥ 4.5. (Implement relative-luminance formula; ~10 lines.)
- [ ] **Step 2: Run it** — `node tests/check-design.mjs`. Expected: FAIL listing uppercase, Space Mono, orange, search, veil, flags (current site).
- [ ] **Step 3: Cleanup** — delete `design-preview.html` and `css/sim-hud.css`; create `.gitignore` with `.superpowers/`.
- [ ] **Step 4: Commit**
```bash
git add tests/check-design.mjs .gitignore
git commit -m "chore: add design guard-rail check, ignore brainstorm files"
```

---

### Task 2: Markup — `index.html`

**Files:** Modify `index.html` (whole `<body>`; head font links).

**Interfaces:**
- Produces element IDs used by Task 3/4: `nav`, `navToggle`, `navMenu`, `hero`, `heroVimeo`, `heroStill`, `showreelBtn`, `projects`, `creditCount`, `filterBar`, `featuredGrid`, `creditsTable` (a `<tbody>`), `creditsBlock`, `about`, `photography`, `photoWrapper`, `photoGrid`, `showAllPhotosBtn`, `photoLightbox` (+ existing lightbox child IDs), `contact`, `contactForm`, `formStatus`, `modalOverlay`, `modal`, `modalClose`, `modalMedia`, `modalBody`.

- [ ] **Step 1: Head** — remove Fontshare and Space Mono links; add Inter Tight 400;500;700 (`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700&display=swap`). Bump `style.css?v=2.0.0`, `main.js?v=2.0.0`.
- [ ] **Step 2: Nav** — keep structure/IDs; links: Work (`#projects`), About, Photography, Contact. Social icons stay.
- [ ] **Step 3: Hero** — keep `.hero-media` iframe `#heroVimeo` but rename its `src` attribute to `data-src` (so it doesn't load before JS decides; see Task 4 Step 7); add `<img id="heroStill" class="hero-still" src="assets/banner.jpg" alt="">` (shown only under reduced motion). Content: `<h1>Alexander<br>Jarosch</h1>`, then `.hero-facts` with four `<span><b>Label</b>Value</span>` exactly as the spec (Role / Focus / Studios / Based) and `<button id="showreelBtn">▶ Showreel with sound</button>`. Remove eyebrow, tagline, secondary buttons, scroll hint.
- [ ] **Step 4: Work** — `.section-head` with `<h2>Selected work</h2><span id="creditCount"></span>`; `<div id="filterBar" class="filters">`; `<div id="featuredGrid" class="highlights">`; `<div id="creditsBlock"><table class="credits"><thead><tr><th>Year</th><th>Title</th><th>Studio</th><th class="col-role">Role</th></tr></thead><tbody id="creditsTable"></tbody></table></div>`. Remove search box, veil, collapse button, sublabels.
- [ ] **Step 5: About** — photo + bio + skills as plain `<p class="about-skills">Houdini, Unreal Engine, Nuke, Niagara, VEX, Python, fluid simulation, destruction, compositing</p>`. Section head "Career" / "2016 – now", then `.timeline` with five `<div>`s: `<span class="y">`, `<b>`, role text, `<span class="place">` — values verbatim from spec "About" list. Studio logo strip: keep markup; Task 3 decides visibility.
- [ ] **Step 6: Photography** — section head "Photography"; `#photoWrapper.collapsed > #photoGrid`; replace veil with `<button id="showAllPhotosBtn" class="text-link">Show all</button>`; remove `collapsePhotosBtn`. Move `#photoLightbox` to just before the `<script>` tags, after `#modalOverlay`.
- [ ] **Step 7: Contact** — `<section id="contact">` with section head "Contact" / "Montréal, Canada"; two columns per spec copy (heading, line, LinkedIn/Vimeo/GitHub text links); form keeps `action`, `method`, `name` attributes, `id="contactForm"`, `#formStatus`; fields get visible `<label>`s (Name, Email, Message); button "Send message". Footer: `<footer class="footer"><span>© 2026 Alexander Jarosch</span></footer>`. Delete old "Let's work together." / form-note.
- [ ] **Step 8: Verify** — `node tests/check-design.mjs`: the `index.html` assertions pass (CSS ones still fail — expected until Task 3).
- [ ] **Step 9: Commit** — `git commit -am "feat: restructure markup for Swiss/Warm redesign"`

---

### Task 3: Styles — rewrite `css/style.css`

**Files:** Replace `css/style.css`.

**Interfaces:**
- Consumes: class/ID names from Task 2.
- Produces: classes JS adds: `.project-card`, `.hidden`, `.scrolled` (nav), `.open` (modal/lightbox/menu), `.expanded`/`.collapsed` (photoWrapper), `.filter-btn.active`, `.credit-row`.

- [ ] **Step 1: Tokens + base** — `:root` tokens from Global Constraints; reset; `body{background:var(--bg);color:var(--text);font-family:'Inter Tight',sans-serif;line-height:1.45}`; `.pad` side gutter `clamp(16px,4vw,48px)`; `:focus-visible{outline:2px solid var(--ink);outline-offset:3px}`.
- [ ] **Step 2: Nav + hero** — values from `swiss-dark.html`: fixed transparent nav, `.scrolled` → `background:var(--bg)`; hero 100vh, iframe cover sizing `width:max(100vw,177.78vh);height:max(100vh,56.25vw)`, gradient `linear-gradient(to top,var(--bg),transparent 60%)`, h1 `clamp(56px,11vw,168px)` / `.88` / `-0.05em`, facts row 4 cols + button, 2px white top rule, labels in `--ink`. `.hero-still{display:none}`; under `@media (prefers-reduced-motion: reduce)` show `.hero-still` (cover) and `display:none` the `.hero-media`.
- [ ] **Step 3: Sections** — `.section-head` (2px top rule, h2 32px/-0.03em, right span muted); `.filters` text buttons, `.active` underlined `--ink` 2px offset 5px; `.highlights` 4-col grid, posters `aspect-ratio:2/3; object-fit:cover; background:var(--surface)`; `.credits` table 15px, 1px rows at `rgba(239,230,214,.15)`, row hover `--surface`, year/studio muted.
- [ ] **Step 4: About / timeline / photos / contact / modal / lightbox** — timeline 5 cols, 1px top rule, `b` 22px/700, `.place` `--ink`; photo grid restyle, `.collapsed` max-height ~480px with overflow hidden (no gradient); contact 5fr/7fr, underline-only inputs, solid button; modal panel `--surface`, square; lightbox dark overlay. Studio logos: show only if they render legibly in cream (`filter` as needed); otherwise `display:none`.
- [ ] **Step 5: Responsive** — `@media (max-width:760px)`: facts 2×2, highlights 2 cols, timeline 1 col, contact 1 col, `.col-role` hidden.
- [ ] **Step 6: Verify** — `node tests/check-design.mjs` → `design check ok`. Browser at 1440px and 375px: no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`); DevTools "Emulate prefers-reduced-motion" shows still, no iframe visible.
- [ ] **Step 7: Commit** — `git commit -am "feat: Swiss/Warm stylesheet"`

---

### Task 4: Behaviour — `js/main.js`

**Files:** Modify `js/main.js`.

**Interfaces:**
- Consumes: IDs from Task 2; `PROJECTS`, `FILTERS`, `PHOTOS` globals.
- Produces: `renderCredits(): void`, `applyFilters(): void` (filter only), `openModal(index: number)` unchanged signature.

- [ ] **Step 1: Cards** — `makeCard(project, index)`: poster, `<p>` title, `<small>` "Studio, Year"; no type badge, no "View Project" overlay. Card is `tabindex="0"`, `role="button"`, opens modal on click and Enter/Space.
- [ ] **Step 2: `renderProjects()`** — featured only into `#featuredGrid`. Drop the fade-in IntersectionObserver.
- [ ] **Step 3: `renderCredits()`** — every project (featured included) as `<tr class="credit-row" data-index tabindex="0">` with Year, Title, Studio, Role (`td.col-role`); click/Enter opens modal. Set `#creditCount` to `` `${PROJECTS.length} credits` ``.
- [ ] **Step 4: `applyFilters()`** — active filter only (no search): toggle `.hidden` on `.project-card` and `.credit-row` by `tags.includes(filter)`; hide `#featuredGrid` / `#creditsBlock` when zero visible.
- [ ] **Step 5: Delete** — `initSkillTags`, search handling in `initFilters`, `expandFilmography`, `collapseFilmography`, `initVeil`, and the collapse half of `initPhotoVeil` (Show all only: expand, then hide the button).
- [ ] **Step 6: Modal** — Vimeo `color=` param → `e9c58a` (both iframes). Modal tag spans: keep content, classes stay (CSS makes them sentence case). Showreel modal title "Showreel".
- [ ] **Step 7: Reduced motion** — `initHeroReel(): void`, first in the init list: if `matchMedia('(prefers-reduced-motion: reduce)').matches`, remove `#heroVimeo` from the DOM; otherwise copy `data-src` → `src`. main.js runs before the inline Vimeo script in `index.html`, which already returns early when the iframe is missing.
- [ ] **Step 8: Init list** — `initHeroReel(); renderProjects(); renderCredits(); initFilters(); initModal(); initNav(); renderPhotos(); initPhotoVeil(); initPhotoLightbox(); initContactForm();`
- [ ] **Step 9: Verify (browser)** —
  - Console: no errors.
  - Click each filter: counts change; pick a filter that matches no highlights → highlights grid hidden, table still shows (Review Focus 1).
  - Temporarily point one poster to a missing path in DevTools → 2:3 `--surface` box remains (Review Focus 2); revert.
  - Keyboard only: Tab reaches filters, cards, rows, showreel; Enter opens modal; Escape closes (Review Focus 3).
  - Reduced-motion emulation + reload: no `player.vimeo.com` request in Network (Review Focus 4).
  - 375px: no horizontal scroll, Role column hidden (Review Focus 5).
  - Contact form: submit with empty fields blocked by `required`; status text styled.
  - `node tests/check-design.mjs` → ok.
- [ ] **Step 10: Commit** — `git commit -am "feat: credits table, filter-only, remove search and veils"`

---

### Task 5: Final pass

- [ ] **Step 1:** Side-by-side with `swiss-dark.html` (Warm) and `about-contact.html` (Timeline B): spacing and type sizes match.
- [ ] **Step 2:** `grep -rn "uppercase\|Space Mono" css js index.html` → nothing.
- [ ] **Step 3:** Commit any tweaks; push only when the owner says so (live site).
