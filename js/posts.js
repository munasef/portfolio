/*
 * ═══════════════════════════════════════════════════════════
 *  POSTS — add new blog posts here.
 *
 *  1. Write a .md file in blog/posts/
 *  2. Add an entry to the POSTS array below
 *  3. Commit and push — done
 *
 *  Fields
 *  ──────
 *  slug       Filename without .md   e.g. "hqueue-farm-setup"
 *  title      Post title
 *  date       ISO date string        e.g. "2026-05-03"
 *  excerpt    Short description shown on listing page
 *  tags       Array of topic tags
 *  readTime   Estimated read time    e.g. "10 min"
 * ═══════════════════════════════════════════════════════════
 */

const POSTS = [

  {
    slug:     "hqueue-render-farm-setup",
    title:    "HQueue on a Small Studio Farm",
    date:     "2026-05-03",
    excerpt:  "Setting up SideFX's render scheduler for a small game-cinematic studio. Covers topology, the service account pattern, UNC path discipline, submit flow, cache repatriation into Unreal, and the gotchas that cost real time.",
    tags:     ["Houdini", "Pipeline", "Render Farm", "HQueue"],
    readTime: "12 min",
  },

];
