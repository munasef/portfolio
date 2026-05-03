We'd hit the point where fluid and destruction sims were too slow to run interactively — artists blocking on their own machines waiting for cache jobs to finish. We needed a farm. We had Houdini licenses. HQueue ships free with Houdini and has a native ROP integration, and we're all-Houdini on the FX side. That decision took about five minutes.

This is what we built, the decisions behind it, and what tripped us up.

---

## What HQueue is (and isn't)

HQueue is SideFX's bundled render scheduler. It's lightweight, runs a web UI on port 5000, and integrates natively with Houdini via the HQueue ROP — no plugin, no bridge layer, just submit from inside Houdini. For an all-Houdini pipeline it covers everything you need.

What it isn't: a multi-DCC scheduler. If you need Maya renders, Nuke scripts, and Houdini sims dispatched from the same queue, look at OpenCue or Deadline. For a studio where Houdini is the only submitter, HQueue is the right size.

---

## Farm topology

Three categories of machine:

- **Scheduler** — a low-spec server running HQueue Server only. No rendering happens here. Keeping it cheap and dedicated means it's easy to replace and never gets pulled into render work.
- **Artist workstations** — double as farm workers during off-hours. They run HQueue Client, pick up CPU and GPU jobs during defined windows, and drop back to interactive use during the day.
- **Render blades** — dedicated nodes, 24/7, CPU-only. One standard blade for the default queue; one high-memory blade for large sims and volumes.

<div class="diagram">
<svg viewBox="0 0 1100 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    .ns { fill: #1c3654; stroke: #5fa8ff; stroke-width: 1.5; }
    .nfs { fill: #1f3d2a; stroke: #79c879; stroke-width: 1.5; }
    .nwks { fill: #3a2658; stroke: #c69bff; stroke-width: 1.5; }
    .nbld { fill: #2a3340; stroke: #a4b3c5; stroke-width: 1.5; }
    .nhimem { fill: #4d3415; stroke: #ffb84d; stroke-width: 2; }
    .t-title { fill: #f0f4f8; font: 700 14px -apple-system, sans-serif; }
    .t-role  { fill: #c9d3df; font: 500 11px -apple-system, sans-serif; }
    .t-spec  { fill: #8a99ad; font: 400 10px -apple-system, sans-serif; }
    .bus     { stroke: #4a5b71; stroke-width: 3; stroke-linecap: round; }
    .lctrl   { stroke: #5fa8ff; stroke-width: 2; stroke-dasharray: 6 4; fill: none; opacity: 0.85; }
    .ldata   { stroke: #79c879; stroke-width: 2; stroke-dasharray: 6 4; fill: none; opacity: 0.85; }
    .lboth   { stroke: #8a99ad; stroke-width: 2; fill: none; opacity: 0.7; }
    .label   { fill: #8a99ad; font: 400 10px -apple-system, sans-serif; }
    .blabel  { fill: #d8dee9; font: 600 11px -apple-system, sans-serif; }
  </style>

  <!-- HQueue Server -->
  <rect class="ns" x="60" y="30" width="220" height="100" rx="8"/>
  <text class="t-title" x="170" y="58" text-anchor="middle">hq-server</text>
  <text class="t-role"  x="170" y="76" text-anchor="middle">HQueue Server (scheduler only)</text>
  <text class="t-spec"  x="170" y="95" text-anchor="middle">Low spec · no GPU</text>
  <text class="t-spec"  x="170" y="112" text-anchor="middle">Web UI on :5000</text>

  <!-- File Server -->
  <rect class="nfs" x="820" y="30" width="220" height="120" rx="8"/>
  <text class="t-title" x="930" y="56" text-anchor="middle">\\fileserver\</text>
  <text class="t-role"  x="930" y="74" text-anchor="middle">UNC project + cache storage</text>
  <text class="t-spec"  x="930" y="95" text-anchor="middle">hq\ — HQueue working dir</text>
  <text class="t-spec"  x="930" y="112" text-anchor="middle">projects\ → $JOB</text>
  <text class="t-spec"  x="930" y="129" text-anchor="middle">caches\ → $NCACHE</text>

  <!-- LAN bus -->
  <line class="bus" x1="40" y1="250" x2="1060" y2="250"/>
  <text class="blabel" x="550" y="241" text-anchor="middle">Internal LAN — domain auth as DOMAIN\svc_hquser</text>

  <!-- Server to bus -->
  <line class="lctrl" x1="170" y1="130" x2="170" y2="250"/>
  <text class="label"  x="178" y="185">TCP 5000</text>

  <!-- Fileserver to bus -->
  <line class="ldata" x1="930" y1="150" x2="930" y2="250"/>
  <text class="label"  x="938" y="200">SMB / UNC</text>

  <!-- WKS01 -->
  <rect class="nwks" x="40" y="350" width="210" height="130" rx="8"/>
  <text class="t-title" x="145" y="376" text-anchor="middle">WKS01</text>
  <text class="t-role"  x="145" y="394" text-anchor="middle">Artist workstation + worker</text>
  <text class="t-spec"  x="145" y="414" text-anchor="middle">Threadripper Pro · 128 GB</text>
  <text class="t-spec"  x="145" y="431" text-anchor="middle">RTX GPU</text>
  <text class="t-spec"  x="145" y="453" text-anchor="middle">Off-hours · CPU + GPU jobs</text>

  <!-- WKS02..N -->
  <rect class="nwks" x="270" y="350" width="210" height="130" rx="8"/>
  <text class="t-title" x="375" y="376" text-anchor="middle">WKS02 … N</text>
  <text class="t-role"  x="375" y="394" text-anchor="middle">Artist workstation + worker</text>
  <text class="t-spec"  x="375" y="414" text-anchor="middle">Same config as WKS01</text>

  <!-- BLD01 -->
  <rect class="nbld" x="500" y="350" width="210" height="130" rx="8"/>
  <text class="t-title" x="605" y="376" text-anchor="middle">BLD01</text>
  <text class="t-role"  x="605" y="394" text-anchor="middle">Render blade (standard)</text>
  <text class="t-spec"  x="605" y="414" text-anchor="middle">Threadripper · 64 GB</text>
  <text class="t-spec"  x="605" y="431" text-anchor="middle">No GPU / CPU-only</text>
  <text class="t-spec"  x="605" y="453" text-anchor="middle">24/7 · default queue</text>

  <!-- BLD02 high-mem -->
  <rect class="nhimem" x="730" y="350" width="210" height="130" rx="8"/>
  <text class="t-title" x="835" y="376" text-anchor="middle">BLD02</text>
  <text class="t-role"  x="835" y="394" text-anchor="middle">Render blade (high-memory)</text>
  <text class="t-spec"  x="835" y="414" text-anchor="middle">Threadripper · 256 GB</text>
  <text class="t-spec"  x="835" y="431" text-anchor="middle">Tagged: sims / large volumes</text>

  <!-- Drop lines -->
  <line class="lboth" x1="145" y1="350" x2="145" y2="250"/>
  <line class="lboth" x1="375" y1="350" x2="375" y2="250"/>
  <line class="lboth" x1="605" y1="350" x2="605" y2="250"/>
  <line class="lboth" x1="835" y1="350" x2="835" y2="250"/>
</svg>
<div class="diagram-legend">
  <span><span class="legend-swatch" style="background:#1c3654;border:1px solid #5fa8ff;"></span>HQueue server</span>
  <span><span class="legend-swatch" style="background:#1f3d2a;border:1px solid #79c879;"></span>Fileserver ($JOB · $NCACHE)</span>
  <span><span class="legend-swatch" style="background:#3a2658;border:1px solid #c69bff;"></span>Workstation worker</span>
  <span><span class="legend-swatch" style="background:#2a3340;border:1px solid #a4b3c5;"></span>Render blade (standard)</span>
  <span><span class="legend-swatch" style="background:#4d3415;border:1px solid #ffb84d;"></span>Render blade (high-mem)</span>
  <span><span class="legend-line" style="border-color:#5fa8ff;"></span>Control (TCP 5000)</span>
  <span><span class="legend-line" style="border-color:#79c879;"></span>Data (SMB / UNC)</span>
</div>
</div>

The fileserver is separate from everything else — it hosts the project share and cache share over SMB. Workers reach it via UNC paths. Nothing on the farm uses mapped drive letters.

---

## Three decisions that shape the whole setup

Before getting into the install, the design decisions that everything else follows from.

### UNC paths everywhere

No mapped drive letters (`Z:\`, `W:\`) in hip files, ROPs, or environment variables. The most common farm failure I've run into: `$HIP=Z:\` on the submitting workstation, no `Z:` on the worker. The job dispatches, the worker opens the hip, can't resolve the path, fails with a confusing error or silently produces nothing.

Enforcing UNC from the start — `\\fileserver\projects\show\` — means the same path resolves on every machine in the domain, every time. It's more to type once and then completely invisible forever. Make it a rule before anyone's built habits around drive letters.

### One service account

Workers run Houdini headlessly as a single domain account: `DOMAIN\svc_hquser`. Not as the logged-in artist. Not as local system.

This matters for three things: **license checkout** (the license server always sees the same identity), **file permissions** (the service account's access to the fileserver is predictable and doesn't change when someone moves teams), and **debugging** (when something breaks on the farm, you're not chasing per-user environment differences).

The account needs two user rights on every worker, set via Local Security Policy before installing the client:
- **Log on as a service** — required for the HQueue Client service
- **Log on as a batch job** — some Houdini sub-processes need it

### `$JOB` and `$NCACHE` environment variables

Two Houdini environment variables that abstract the UNC paths artists type in their hip files:

- `$JOB` → `\\fileserver\projects\<show>\` — project root. Hip files, render output, project-scoped scratch.
- `$NCACHE` → `\\fileserver\caches\<show>\` — sim and geo caches. VDB, bgeo, Alembic.

Both point at the same physical fileserver. The split is a workflow convention, not separate storage. It exists for two reasons: **discoverability** (artists type `$NCACHE/sim/foo.bgeo.sc`, not a long UNC) and **future-proofing** (if caches ever move to a dedicated fast-tier NAS or object storage, you change the variable definition once, not every hip file in production).

---

## Submit flow

How a job moves from the artist pressing submit to caches landing somewhere usable.

<div class="diagram">
<svg viewBox="0 0 1100 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="ah-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#79c879"/></marker>
    <marker id="ah-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#5fa8ff"/></marker>
    <marker id="ah-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#79d8a8"/></marker>
    <marker id="ah-gold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#ffb84d"/></marker>
  </defs>
  <style>
    .ah-wks { fill: #3a2658; stroke: #c69bff; stroke-width: 1.5; }
    .ah-srv { fill: #1c3654; stroke: #5fa8ff; stroke-width: 1.5; }
    .ah-bld { fill: #2a3340; stroke: #a4b3c5; stroke-width: 1.5; }
    .ah-job { fill: #1f3d2a; stroke: #79c879; stroke-width: 1.5; }
    .ah-nc  { fill: #1f3d35; stroke: #79d8a8; stroke-width: 1.5; }
    .ht { fill: #f0f4f8; font: 700 13px -apple-system, sans-serif; }
    .hr { fill: #c9d3df; font: 500 10px -apple-system, sans-serif; }
    .hs { fill: #8a99ad; font: 400 9px -apple-system, sans-serif; }
    .ll  { stroke: #4a5b71; stroke-width: 1.2; stroke-dasharray: 3 4; fill: none; }
    .ag  { stroke: #79c879;  stroke-width: 2; fill: none; }
    .ab  { stroke: #5fa8ff;  stroke-width: 2; fill: none; }
    .am  { stroke: #79d8a8;  stroke-width: 2; fill: none; }
    .agold { stroke: #ffb84d; stroke-width: 2.4; fill: none; }
    .sm  { fill: #ffb84d; stroke: #0f1419; stroke-width: 1.5; }
    .sn  { fill: #0f1419; font: 700 10px -apple-system, sans-serif; }
    .sl  { fill: #d8dee9; font: 500 11px -apple-system, sans-serif; }
    .div { stroke: #ffb84d; stroke-width: 1; stroke-dasharray: 4 4; opacity: 0.6; }
    .dl  { fill: #ffb84d; font: 600 10px -apple-system, sans-serif; letter-spacing: 0.04em; }
  </style>

  <!-- Actor headers (centres: 110 / 310 / 510 / 750 / 990) -->
  <rect class="ah-wks" x="10"  y="16" width="200" height="90" rx="8"/>
  <text class="ht" x="110" y="40" text-anchor="middle">WKS01</text>
  <text class="hr" x="110" y="57" text-anchor="middle">Artist workstation</text>
  <text class="hs" x="110" y="75" text-anchor="middle">Houdini interactive</text>
  <text class="hs" x="110" y="91" text-anchor="middle">C:\UEProj\_Exports\ ←</text>

  <rect class="ah-srv" x="210" y="16" width="200" height="90" rx="8"/>
  <text class="ht" x="310" y="40" text-anchor="middle">HQueue Server</text>
  <text class="hr" x="310" y="57" text-anchor="middle">hq-server</text>
  <text class="hs" x="310" y="75" text-anchor="middle">RPC + web UI :5000</text>

  <rect class="ah-bld" x="410" y="16" width="200" height="90" rx="8"/>
  <text class="ht" x="510" y="40" text-anchor="middle">BLD01</text>
  <text class="hr" x="510" y="57" text-anchor="middle">Render worker</text>
  <text class="hs" x="510" y="75" text-anchor="middle">Houdini as svc_hquser</text>

  <rect class="ah-job" x="640" y="16" width="220" height="90" rx="8"/>
  <text class="ht" x="750" y="40" text-anchor="middle">$JOB</text>
  <text class="hr" x="750" y="57" text-anchor="middle">\\fileserver\projects\show\</text>
  <text class="hs" x="750" y="75" text-anchor="middle">hip\ · render\</text>

  <rect class="ah-nc"  x="870" y="16" width="220" height="90" rx="8"/>
  <text class="ht" x="980" y="40" text-anchor="middle">$NCACHE</text>
  <text class="hr" x="980" y="57" text-anchor="middle">\\fileserver\caches\show\</text>
  <text class="hs" x="980" y="75" text-anchor="middle">sim\ · geo\ · vdb\</text>

  <!-- Lifelines -->
  <line class="ll" x1="110" y1="106" x2="110" y2="680"/>
  <line class="ll" x1="310" y1="106" x2="310" y2="680"/>
  <line class="ll" x1="510" y1="106" x2="510" y2="680"/>
  <line class="ll" x1="750" y1="106" x2="750" y2="680"/>
  <line class="ll" x1="980" y1="106" x2="980" y2="680"/>

  <!-- Step 1: WKS → $JOB save .hip -->
  <line class="ag" x1="122" y1="160" x2="738" y2="160" marker-end="url(#ah-g)"/>
  <text class="sl" x="424" y="153" text-anchor="middle">save .hip to $JOB/hip/</text>
  <circle class="sm" cx="110" cy="160" r="10"/><text class="sn" x="110" y="164" text-anchor="middle">1</text>

  <!-- Step 2: WKS → Server submit -->
  <line class="ab" x1="122" y1="220" x2="298" y2="220" marker-end="url(#ah-b)"/>
  <text class="sl" x="210" y="213" text-anchor="middle">submit (HQueue ROP)</text>
  <circle class="sm" cx="110" cy="220" r="10"/><text class="sn" x="110" y="224" text-anchor="middle">2</text>

  <!-- Step 3: Server → Worker dispatch -->
  <line class="ab" x1="322" y1="280" x2="498" y2="280" marker-end="url(#ah-b)"/>
  <text class="sl" x="410" y="273" text-anchor="middle">dispatch (matches capability tags)</text>
  <circle class="sm" cx="310" cy="280" r="10"/><text class="sn" x="310" y="284" text-anchor="middle">3</text>

  <!-- Step 4: $JOB → Worker read .hip -->
  <line class="ag" x1="738" y1="340" x2="522" y2="340" marker-end="url(#ah-g)"/>
  <text class="sl" x="630" y="333" text-anchor="middle">read .hip from $JOB</text>
  <circle class="sm" cx="750" cy="340" r="10"/><text class="sn" x="750" y="344" text-anchor="middle">4</text>

  <!-- Step 5: Worker ↔ $NCACHE -->
  <line class="am" x1="522" y1="400" x2="968" y2="400" marker-start="url(#ah-m)" marker-end="url(#ah-m)"/>
  <text class="sl" x="745" y="393" text-anchor="middle">read prev caches / write sim · geo · VDB to $NCACHE</text>
  <circle class="sm" cx="510" cy="400" r="10"/><text class="sn" x="510" y="404" text-anchor="middle">5</text>

  <!-- Step 6: Worker → $JOB write renders -->
  <line class="ag" x1="522" y1="460" x2="738" y2="460" marker-end="url(#ah-g)"/>
  <text class="sl" x="630" y="453" text-anchor="middle">write rendered frames → $JOB/render/</text>
  <circle class="sm" cx="510" cy="460" r="10"/><text class="sn" x="510" y="464" text-anchor="middle">6</text>

  <!-- Step 7: Worker → Server report done -->
  <line class="ab" x1="498" y1="520" x2="322" y2="520" marker-end="url(#ah-b)"/>
  <text class="sl" x="410" y="513" text-anchor="middle">report job complete</text>
  <circle class="sm" cx="510" cy="520" r="10"/><text class="sn" x="510" y="524" text-anchor="middle">7</text>

  <!-- Phase divider -->
  <line class="div" x1="20" y1="570" x2="1080" y2="570"/>
  <text class="dl" x="550" y="564" text-anchor="middle">REPATRIATION  ·  AFTER JOB FINISHES  ·  MANUAL OR SCRIPTED</text>

  <!-- Step 8: $NCACHE → WKS repatriate -->
  <line class="agold" x1="968" y1="630" x2="122" y2="630" marker-end="url(#ah-gold)"/>
  <text class="sl" x="550" y="623" text-anchor="middle">copy caches → C:\UEProj\_Exports\</text>
  <circle class="sm" cx="980" cy="630" r="10"/><text class="sn" x="980" y="634" text-anchor="middle">8</text>
</svg>
<div class="diagram-legend">
  <span><span class="legend-line" style="border-color:#5fa8ff;"></span>Control (HQueue RPC)</span>
  <span><span class="legend-line" style="border-color:#79c879;"></span>$JOB I/O (hip · renders)</span>
  <span><span class="legend-line" style="border-color:#79d8a8;"></span>$NCACHE I/O (sim · geo · VDB)</span>
  <span><span class="legend-line" style="border-color:#ffb84d;"></span>Repatriation (network → local UE folder)</span>
</div>
</div>

**Step by step:**

1. Artist saves `.hip` to `$JOB/hip/` — UNC path inside Houdini
2. Artist submits via the HQueue ROP. Submission includes the hip path, frame range, and any worker capability tags (`cpu`, `gpu`, `highmem`)
3. HQueue Server dispatches to an eligible worker — drops a job descriptor under `\\fileserver\hq\jobs\<id>\` and signals the worker
4. Worker opens the hip from `$JOB` over SMB, running as `svc_hquser`
5. Worker reads prerequisite caches from `$NCACHE`, writes new sim/geo/VDB caches back
6. Rendered frames land under `$JOB/render/<scene>/`
7. Worker reports success back to the HQueue Server. Per-frame status visible in the web UI

### Repatriation (step 8)

The step most likely to be skipped and then regretted.

Caches in `$NCACHE` live on the network — accessible from every worker, but not where Unreal expects them. Unreal's content browser indexes _local_ directories with specific folder conventions. Pointing it at a moving network path with arbitrary subfolders doesn't work reliably.

After a sim job finishes, the relevant caches get copied from `$NCACHE` to a local folder on the workstation in the shape the UE project expects:

```
C:\UEProjects\<show>\
├── _Source\    source-of-truth assets (USD, Alembics from sim)
└── _Exports\   caches pulled from $NCACHE for UE to consume
```

Three approaches:

| Approach | When to use |
|---|---|
| Manual (`robocopy`) | Prototyping, one-off shots |
| Python CLI (artist-triggered) | Default for production — predictable, debuggable |
| Post-job hook (HQueue child task) | Only if repatriation is fast and the workstation is reliably online |

We went with a Python CLI as the default. Takes `(show, sim-name, ue-project-root)`, copies and renames per project convention, logs what it did. Simple enough to debug when something goes wrong. The post-job hook is tempting because it's one less manual step, but if the workstation is off or repatriation takes a while, you're burning farm slots on a disk copy.

---

## Installation phases

Do these in order — each phase catches failures before they compound.

**Phase 0 — Pre-flight.** The issues that waste an afternoon if you skip them:
- **Houdini build parity** across all machines — not just the major version, the exact build. `20.5.445` submitting to a `20.5.584` worker mostly works and then mysteriously fails on specific node types
- **License reachability under `svc_hquser`** — RDP to a fresh worker _as_ `svc_hquser` and run `hkey` to confirm a license checks out. If this fails, nothing else matters
- **User rights** — `Log on as a service` and `Log on as a batch job` on every worker, via Local Security Policy
- **Firewall** — TCP 5000 open between all machines and the scheduler

**Phase 1 — UNC layout.** Create the share structure on the fileserver, set permissions so `svc_hquser` has full access. Minimum: `hq\`, `projects\`, `caches\`. If legacy tooling needs drive letters, set a persistent mapping — but try to avoid it from the start.

**Phase 2 — Server install.** Install HQueue Server on the scheduler machine only. Confirm the web UI comes up on `:5000`. Most failures here are firewall or Python version mismatches.

**Phase 3 — First worker.** Install HQueue Client on one worker, point it at the server, bring it up as the `svc_hquser` service. Get one job running end-to-end before touching other machines.

**Phase 4 — Houdini-side prep.** Set `$JOB`, `$NCACHE`, and the HQueue server address in `houdini.env` on every submitting workstation. Push this centrally if you can — doing it per-artist means half the machines are wrong by the end of the week.

**Phase 5 — Smoke test.** Submit a minimal Mantra or simulation job from one workstation, confirm it runs on the worker, confirm output lands under `$JOB/render/`. Don't move on until this passes cleanly.

**Phase 6 — Roll out + queue tags.** Add remaining workers. Set capability tags (`cpu`, `gpu`, `highmem`) on workers. Configure off-hours scheduling on workstation workers — artists will notice if their machine starts thrashing at noon.

---

## Common gotchas

**"Works on the workstation, fails on the farm"** — almost always a path issue. Check `$HIP`, `$JOB`, `$NCACHE` in the failed job log. If any resolve to a drive letter, that's your problem.

**License failures under `svc_hquser`** — always validate this interactively before installing anything. Run `hserver -s` on the license server to see current checkouts. If the service account can't check out a license, no job will ever run.

**Houdini build mismatch** — "mostly works" is worse than "clearly fails." Parity on the exact build is non-negotiable. Pin the build in your Houdini deployment and update all machines together.

**Workers picking up jobs during business hours** — the HQueue Client has no schedule by default. Set the off-hours window in the client config before anyone notices their workstation slowing down mid-afternoon.

**Using `svc_hquser` credentials on the artist's machine** — some setups do this to keep permissions consistent. Avoid it. The artist's workstation needs to run Houdini interactively as the artist; using the service account interactively blurs that line and creates confusing permission overlaps.

---

HQueue is genuinely straightforward once the three foundational decisions are solid: UNC paths, one service account, environment variables for storage roots. The complexity lives almost entirely in Phase 0 and the first-worker bring-up. After that, adding machines is just running the client installer and setting up the service.
