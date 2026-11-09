# Swiss / Warm redesign of jaroschfx.com

## Why

The live site reads as AI-generated. The owner pinned it on two things: the
orange-accent-on-white-on-near-black palette and the small, letter-spaced,
all-caps labels (≈20 `text-transform: uppercase` rules in `css/style.css`,
`Space Mono` labels, `#d86a2e` used 21×). Other template tells: gradient
"veils" over collapsed grids, emoji flags, dot-and-line timeline,
"Let's work together." footer.

Goal: a site that looks deliberately designed — Swiss typographic discipline
on a warm dark ground — while keeping the reel and all existing content.

## Goals

- Re-skin the whole one-page site (`index.html`) in the agreed direction.
- Keep the Vimeo reel playing silently behind the hero title.
- Make credits scannable as a table; remove collapsing/veil UI.
- Basic polish: reduced-motion, focus states, contrast, single font family.

## Non-goals

- No content changes: `js/projects.js` and `js/photos.js` data stay as is.
- No blog redesign this round (`blog/` untouched).
- No build tooling, frameworks or new dependencies. Plain HTML/CSS/JS on
  GitHub Pages, as today.

## Anti-goals (failure even if it "works")

- Any orange, any all-caps letter-spaced labels, any monospace "tech" labels.
- HUD/viewport chrome (reticles, grid overlays, readouts) — the
  `design-preview.html` direction is rejected.
- Glow, gradients-as-decoration, glassmorphism, emoji.
- Showing a plain email address on the page.

## Visual system (decided)

**Type:** Inter Tight only (Google Fonts, 400/500/700). Remove Fontshare
(Cabinet Grotesk, Satoshi) and Space Mono. Sentence case everywhere.
Tight negative tracking on large headings (name ≈ `-0.05em`, section titles
≈ `-0.03em`), normal tracking on body. No `text-transform: uppercase`
anywhere.

**Palette — "Warm":**

| Token     | Value     | Use                                    |
|-----------|-----------|----------------------------------------|
| `--bg`    | `#2a231d` | page background                        |
| `--surface` | `#382f27` | image placeholders, modal panel      |
| `--text`  | `#efe6d6` | body text, rules                       |
| `--muted` | `#a8998a` | secondary text (verify ≥ 4.5:1 on bg)  |
| `--ink`   | `#e9c58a` | the only accent: active filter underline, labels in hero facts row, hover, focus |

**Structure:** strict grid, generous whitespace. Sections open with a 2px
rule in `--text`, then heading left / count or note right on one baseline.
Thin 1px rules (`--text` at ~15–25% alpha) between rows. Square corners.
Buttons are solid blocks (cream on brown, sand on hover), no pills.

Reference mockups (approved): `.superpowers/brainstorm/*/content/swiss-dark.html`
(Warm palette) and `about-contact.html` (Timeline B + contact).

## Page, section by section

**Nav.** Minimal bar: "AJ" left; Work, About, Photography, Contact right;
social icons may stay. Transparent over the reel, takes `--bg` background
once scrolled past the hero. Keep the existing mobile toggle behaviour.

**Hero.** Full-viewport Vimeo background (existing iframe + the existing
"skip to 9s / loop at end" player script). Bottom-to-top gradient from
`--bg` to transparent (~60%) so the type sits on the warm colour. Bottom-left:
"Alexander / Jarosch" in very large bold Inter Tight
(`clamp(56px, 11vw, 168px)`), then a 2px white rule and a four-column facts
row — Role: Lead FX Technical Director · Focus: Simulation, destruction,
pipeline · Studios: Eidos-Montréal, Weta FX, DNEG · Based: Montréal, Canada —
labels in `--ink`, plus a solid "▶ Showreel with sound" button (opens the
existing showreel modal). Drop the "View Selected Work / Get In Touch"
buttons and the "Scroll" hint. Facts row goes 2×2 on narrow screens.

**Work.**
- Heading "Selected work", right side "N credits" (computed).
- Filters: plain text links from `FILTERS`, active one underlined in `--ink`.
- Highlights: projects with `featured: true`, as poster cards (poster image,
  title, "Studio, Year" underneath in `--muted`). Posters stay.
- Credits: every project as a table — Year · Title · Studio · Role. Rows
  are clickable/keyboard-activatable and open the existing project modal.
- Filters apply to both highlights and table.
- Removed: search box + clear button, veil, "View full credits",
  "Show less", filmography collapse logic.

**About.** Photo + bio as today, restyled. Skill tags become plain text
(e.g. comma- or slash-separated) — they no longer drive search, since
search is gone. Career shown as **Timeline B · Columns**: five equal
columns, each with a 1px top rule; years (muted, small), studio/headline
large and bold, role, country in `--ink`. Country names as text, no flags.
Stacks to one column on phones. Entries (newest first):

1. 2024 – now · Eidos-Montréal · Lead VFX Artist · Canada
2. 2022 – 2024 · Weta FX · Senior FX TD · New Zealand
3. 2020 – 2022 · DNEG · Lead FX TD · Canada
4. 2017 – 2018 · Fulbright · Academy of Art, San Francisco · USA
5. 2016 · Compositor · Captain America: Civil War, Doctor Strange · Germany

The studio logo strip may stay if it renders cleanly in cream on brown;
otherwise drop it (builder's call).

**Photography.** Same `PHOTOS`-driven grid and lightbox, restyled. Replace
the veil/"View all photos" with a plain "Show all" text link that expands
the grid. Move the lightbox markup so it sits after the photography section
in a sensible place (it is currently fine functionally; just tidy order).

**Contact.** Two columns: left — heading "Working on something with water,
fire or rubble?", line "Send a note and I'll get back to you. CV on
request.", text links LinkedIn / Vimeo / GitHub underlined in `--ink`;
right — the existing Formspree form (`https://formspree.io/f/mvznbonk`,
same field names and existing JS submit/status handling), restyled as
underline-only fields with small muted labels and a solid "Send message"
button. No visible email address. Footer line: "© 2026 Alexander Jarosch".

**Project modal / showreel modal.** Keep behaviour; restyle to the system
(`--surface` panel, square corners, Inter Tight, no caps labels).

## Polish (decided)

- `prefers-reduced-motion: reduce` → do not autoplay the reel; show a still
  (use `assets/banner.jpg` if suitable, else a frame grab).
- Visible `:focus-visible` outline in `--ink` on all interactive elements.
- Verify `--muted` on `--bg` meets 4.5:1; lighten if not.
- One font family as above.

## Cleanup

- Delete `design-preview.html` and `css/sim-hud.css` (uncommitted, rejected).
- Add `.superpowers/` to `.gitignore`.
- Bump cache-busting query strings on `style.css` and `main.js`.

## Left to the builder

- Exact spacing scale, breakpoints, and card/table column widths.
- Whether to rewrite `css/style.css` from scratch or edit in place
  (rewrite is likely smaller).
- How much of `main.js` to delete vs adapt; keep `projects.js`/`photos.js`
  formats unchanged so the owner's editing workflow stays the same.
- Hover details (e.g. subtle poster dim, row highlight) within the palette.
