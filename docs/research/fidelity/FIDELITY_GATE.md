# Fidelity gate — measured OG assertions vs live canvas readback

**What it is:** the "measure, don't eyeball" harness (adapted from the two
usable ideas in the clone-app-pat-pro skill, 2026-07-16 evaluation — its
computed-style pipeline itself can't run here: the OG is a dead Flash game
with no DOM, and our stage is a Phaser canvas). Reference values are measured
off the study frames; a dev-only harness reads REAL pixels back off the
running game's canvas and compares, point by point, with tolerances.

## The three parts

| Part | File | Rules |
|---|---|---|
| Assertions (data) | `src/config/fidelity.ts` | frame-measured CONTRACT values; every probe cites its source frame (`t=…`) |
| Comparator (pure math) | `src/core/fidelityCompare.ts` | zero literals, config-only imports (core rules) |
| Harness (browser, dev-only) | `src/game/fidelity.ts` | wired as `window.__fidelity` behind `import.meta.env.DEV` in main.ts; absent from prod |

Unit layer: `tests/fidelityCompare.test.ts` (comparator, red-proofed) +
`tests/fidelity-probes.test.ts` (probe schema sanity: unique ids, coords in
[0,1], honest tolerances ≤32, provenance notes required).

## Running the gate

```
npm run dev
# open http://localhost:5173/ in Chrome, DevTools console, tab VISIBLE:
await __fidelity.run()
```

- Prints a probe-by-probe table (expected/actual hex, max per-channel delta,
  pass) and returns the report object. `pass === true` is the gate.
- The harness drives two canonical states itself: **fighting @ t≈0** (intro
  skipped, full pools, fighters at spawns) and **result-win** (the YOU WIN
  card — localStorage is backed up/restored around it, so no save pollution).
- Occlusion-proof: waits for real frames but falls back to manual
  `game.loop.step()` when Chrome throttles rAF (same trick as `__game`).

## How the reference values were measured (reproducible)

1. Native-res frames from the reference longplays (1920×1080@60):
   `ffmpeg -ss <t> -i reference/videos/<id>.mp4 -frames:v 1 -q:v 2 out.png`
   — B-23 VS-duel window (B t=3771–3783) is the duel-HUD anchor.
2. Landmarks: seed-grow rect scans + gridded 2× crops (PIL), colors as
   **medians across 3–4 frames** (kills codec noise; spreads recorded in the
   probe notes). Scripts (session-scratch, disposable):
   `measure_hud.py` pattern documented by the probe notes themselves.
3. Cross-checked against a second video/location (A-28 wild-mob fight):
   combat HUD geometry is IDENTICAL across locations/videos (deltas ≤6px
   @1080p ≈ capture jitter). Mode differences only: single-player fights add
   a pause button; VS-duels have none. Coins/XP/minimap: hidden in BOTH.
4. The OG renders full-bleed 16:9 → normalized fractions transfer 1:1 to our
   1024×576 stage.

## History (evidence trail)

- **v1 RED (2026-07-16):** first run against the Stage-2/3 HUD → **14/17
  FAIL** — plate probe hit our letterbox strip (OG has none in live combat),
  bar probes hit our stance label (bars sat higher/shorter), ring/slot probes
  hit arena (portrait smaller, slots bottom-center vs OG bottom-right),
  enemy-bar green was our old palette value, YOU WIN red was an alpha blend
  (OG is flat #a30e00).
- **v1 fix pass (same day):** measured geometry applied to DuelScene +
  DuelResult + palette (double-entry pins updated) → **17/17 PASS**, most at
  Δ0. Suite 423/423, tsc/eslint clean, zero console errors.
- Two probes were re-pointed during the pass after re-measurement showed the
  first sampling caught glyph anti-aliasing (plate fill is a stable #542c06,
  not the lighter values first read near the text row) — assertion follows
  measurement, never the render.

## Adding probes (the rule)

1. Measure on the frames first (median across ≥3 frames; record spread).
2. Add the probe to `src/config/fidelity.ts` with the source-frame note.
3. Watch it FAIL against the current render (red-first applies here too).
4. Fix the render; re-run to green. Never widen a tolerance to make a probe
   pass — tolerances are codec headroom, not fudge room.

## v2 slice 1 — lossless corpus (2026-07-16, DONE)

43 archived official-wiki images (2016 crawl, real bytes) live in gitignored
`reference/wiki-png/` (owner-approved download; 3 stragglers are resized
dupes/gif). A 6-agent classification pass mapped them; findings:

- **Authored red recovered: #990000 byte-exact** in A5.PNG (kill-silhouette
  card, 2 points), Wiki14.PNG, and A8.PNG's HIT COMBO numeral. The video's
  #a30e00 was the codec shift of this. `winRed`, the combo numeral, and both
  win-bg probes now carry the authored value.
- **Palette corroborated**: A8.PNG (lossless in-combat world-mission HUD,
  2016 build) reads blue fill (44,59,223), plate fill (71,38,7), slot
  interiors #000–#040404 — all within ≤14/channel of our video-derived
  values. No further changes; both readings logged here. Build caveat: A8 is
  the 2016 800×480 build (8-slot world HUD, AUTO SLASH ON); v0.717 video
  remains the layout truth.
- **OG bars are gradient-shaded** (A8 green fill runs (78,222,92) top →
  (12,181,12) bottom). Our bars are flat — queued below.
- Named Tier-1 files (Title2/PrtScrn/stance shots) are NOT recoverable: their
  only Wayback captures are 2025 404-pages (text/html). Corrected in
  reference-sources.md.

## v2 backlog (measured targets, not yet asserted)

- **Bar gradients**: measure row-by-row color stops off the 1080p video
  (multiple rows per bar per frame, median across frames) and render matching
  gradient fills — visible fidelity gain, unprotectable color data.

- **VS-intro splash**: needs a dense 60fps extraction around B t=3770–3772
  (the black-band + giant red VS glyph frame) — our DuelIntro card family
  visibly diverges today.
- **Defeat card** (A-22 death screen) and the **FIGHT! splash** (A-28
  t=3884.5: orange glyph ~(845–1125, 465–565)@1080).
- **HIT COMBO plate**: OG top-right ~(1610,140)-(1830,180)@1080 — ours moved
  near it, unasserted (combo isn't in a canonical sampling state yet).
- **Bar fraction labels** ("14/30"-style) — OG renders them on the bars; we
  don't yet.
- **Color refinement from lossless sources**: the archived official-wiki PNGs
  (see `../reference-sources.md`) beat YouTube compression — re-measure the
  palette against them and tighten tolerances.
- **Location-matched arena probes**: duels happen in the current location's
  scene in the OG; arena-palette assertions need same-location frames (our
  bamboo arena ↔ a matching OG bamboo/forest fight scene).
