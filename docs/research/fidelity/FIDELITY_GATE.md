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

## v2 slice 2b — dense gate: 5 states, edge scans, 55/55 (2026-07-16, DONE)

Gate grew 21 → **55 assertions (41 points + 14 edge scans) across 5 states**,
all PASS on a fresh load, zero console errors. New sampling states drive the
real scenes: `vs-intro` / `fight-splash` (DuelIntro frozen via a dev seam,
`devHoldAt`), `result-defeat` (DuelResult launched with winner:'enemy').

- **Measured discoveries** (B 60fps dense t=3771.2-3773.85; A t=3361-3364.3):
  the duel intro is a TWO-beat sequence — full-width black band (rows
  448-584) over the LIVE arena/HUD with in-band names + portraits + red VS
  glyph (#ff1800 core, bbox (754,392)-(1118,640)), then an orange-gradient
  FIGHT! glyph ((824,492)-(1090,572), F-stem anchors (255,109,0)@512 /
  (255,181,0)@550) on the same band. No name banner, no READY beat (spec
  item 12 corrected — DIVERGENCES). Video A's FIGHT! letterbox is a
  world-fight treatment only; the duel build (B) has none.
- **Result cards**: one shared system — authored-#990000 field inset between
  black pillars (field x 53-1865, no top border), black tableau band from
  row 894. v1's olive band reading (25,34,9) did not reproduce (×3 frames
  read (0,1,0)) → probe re-pointed, render fixed, and the correction
  CHAOS-PROVEN (olive plant → win/defeat silhouette points Δ34 RED + both
  edge scans "found never" → revert → GREEN). Defeat adds the dark splash
  (#220300 interior), red headline (same #990000), and the two buttons
  (resting fill #5c1200; the capture caught FREE RESPAWN mouse-hovered —
  noted in the probe).
- **Edge-scan probe kind**: `compareScan` in core (pure, red-proofed ×7 unit
  tests) + `FIDELITY_SCANS` config + harness line-walker. Pins element EDGES
  (band rows, card pillars, tableau top, bar/plate/slot left edges).
- **Red-first evidence**: 29/55 watched RED in-browser against the pre-refit
  render (band probes hit the old overlay card, defeat probes hit the old
  dark-tint branch, win pillars hit full-bleed red, band scans "found
  never"). Born-green (honest list): the 4 `fighting` edge scans (they pin
  v1-fitted elements) and `win-silhouette-band` (render fixed pre-run —
  covered by the chaos plant above). Glyph-interior probes forced TWO render
  fixes: font letterforms put ink in the wrong measured places (Georgia's V
  gap, then the F serif/slant), so the VS and FIGHT! glyphs are procedural
  brush polygons/bars whose strokes pass through the measured probe points.
- **Bar fraction labels** render from live sim pools; the full gate stayed
  green (glyphs clear every sampled point). Suite 440/440 · tsc exit 0 ·
  eslint exit 0 · ratchet refreshed ×3 (diffs reviewed).
- Runtime note: a full gate run takes ~60-120 s when Chrome throttles the
  tab (settleFrames falls back to manual loop-steps) — launch it async and
  poll, keep the tab visible for speed.

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
