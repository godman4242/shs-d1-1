# FIDELITY V2 KICKOFF — dense gate, new states, measured art proportions

> Entry route: RESUME_HERE → this file. Read `docs/research/fidelity/FIDELITY_GATE.md`
> first (the protocol: what the gate is, how values are measured, the
> assertion-follows-measurement rule). Then `git log --oneline -5`.
> This kickoff continues the owner-green-lit **fidelity v2** program
> ("run fidelity v2", 2026-07-16) inside Stage 4.

## Where things stand (verified 2026-07-16, Session 6 close)

- Gate: **21/21 PASS** (`await __fidelity.run()` in the dev-server console,
  tab visible). Suite 426/426 · tsc exit 0 both configs · eslint exit 0.
- Commits: `f36aedb` gate v1 (14/17 RED → 17/17) · `717aa8b` v2 slice 1
  (lossless corpus; authored `#990000` recovered byte-exact) · `6cc1cf9`
  v2 slice 2a (measured gradient bars, 4 new probes).
- Stage-4 M0 (skeletal fighters) is a committed WIP checkpoint (`4a27cd7`)
  — milestone NOT closed; it resumes per `STAGE4_KICKOFF.md` and
  **interacts with slice 3 below** (same files: `samurai.ts`,
  `config/anim.ts`, `config/poses.ts`).
- Reference on disk (all gitignored, study-only): two 1080p60 longplays in
  `reference/videos/` · 43 lossless 2016 wiki shots in `reference/wiki-png/`
  (classified — see FIDELITY_GATE.md "v2 slice 1") · cached study frames in
  `reference/frames/`.

## Standing rulings (do NOT relitigate; flag, don't fold)

1. **RECREATE, NEVER RIP** — and specifically: the owner's pixel-by-pixel-
   copy ask was DECLINED twice (2026-07-16), including the private-then-
   modify variant, and a THIRD time later the same day under an
   "it's-only-an-experiment, real game later" framing (same variant —
   held; copied artwork in the experiment repo would also contaminate the
   later real game). The standing target is the **measured ceiling**: every
   unprotectable property (color, geometry, proportion, timing) matched
   exactly; drawings stay original linework. If asked again, hold the line
   and point at this section.
   **Project framing update (owner, 2026-07-16):** the repo is now an
   EXPERIMENT — "how far can Fable 5 go" toward indistinguishable-in-motion
   — not a product for players; the shipped game comes later. This changes
   the goal statement, not the rules: the experiment's metric is the
   measured ceiling (fidelity gate + motion-timing fidelity + per-region
   delta scores + blind A/B composites in the gitignored scratchpad).
2. **Assertion follows MEASUREMENT, never the render.** Never widen a
   tolerance to pass; re-measure instead (two plate probes were re-pointed
   when re-measurement exposed glyph-AA contamination — that's the model).
3. **Red-first applies to probes too**: new probe → watch it FAIL in the
   browser against the current render → fix render → GREEN. (Unit tests
   red-first as always.)
4. Layout truth = the v0.717 longplays (2020). The 2016 lossless shots are
   color/corroboration truth only (different build: 800×480, 8-slot world
   HUD). Where they disagree on layout, video wins.

## Ordered work list

### Slice 2b — dense gate + new sampling states (~2–3 h)
1. **VS-intro state**: dense 60 fps extraction around B t=3770–3772
   (`ffmpeg -ss 3769.5 -to 3772.5 -i reference/videos/Nr4fQstqHDM.mp4
   -vf fps=60 ...`), find the stable full VS-splash frame(s); measure the
   black band geometry, the red VS glyph field, name positions. Add a
   `vs-intro` sampling state to `src/game/fidelity.ts` (freeze DuelIntro at
   the VS beat — it needs a deterministic pause hook; add a DEV-only seam to
   DuelIntro, mirror the existing loop-step fallback) + probes. Our intro
   card family will go RED — refit `DuelIntro`/`banners.ts` to measured
   geometry (drawings stay original).
2. **Defeat card state**: timestamps from
   `docs/research/video-study/segments/A-22-death-you-were-defeated-screen.md`
   → extract native frames from `reference/videos/zFtCaTO0_1M.mp4`, measure
   (the win card's authored `#990000` likely reappears — verify, don't
   assume), add `result-defeat` state + probes; refit `DuelResult`'s defeat
   branch.
3. **FIGHT! splash**: A t≈3884.5 (orange glyph ≈(845–1125, 465–565)@1080,
   from the A-28 cross-check). Measure; assert when the intro state exists.
4. **Edge-scan assertions**: add a `scan` probe kind to
   `core/fidelityCompare.ts` (pure: given a row of sampled colors + expected
   transition x + tol-px, pass/fail) and sampler support — pins element
   EDGES (bar left/right, plate box, slot frames) instead of interiors only.
   Target: gate ≥ 40 probes across ≥ 4 states, all green, red-proofed.
5. **Bar fraction labels** ("742/749"-style, confirmed in BOTH builds):
   white bold numerals centered on HP and chi bars. Sim already owns the
   values; render-only texts. Mind the landmine: keep existing interior
   probes sampling points the glyphs never cover (measure our render after).

### Slice 3 — measured art-proportions pass (~4–6 h; coordinate with M0)
- Measure fighter proportions off clean 1080p duel frames (B-23 window
  already extracted in the scratchpad recipe; re-extract freely): total
  sprite height vs screen, head/kasa width, torso/leg split, blade length,
  stance silhouettes. Cross-check vs the lossless story shots
  (`reference/wiki-png/` A1–A4, Fdsqf, GiveThatDemonFlowers).
- Apply to `config/anim.ts` + `config/poses.ts` + `game/samurai.ts` — these
  are M0's files: **finish or checkpoint M0 first** (its session-log entry
  says hitbox capsules stay deferred), then re-proportion the skeleton at
  measured ratios. Original linework throughout; proportions/palette are the
  measured part.
- Arena: pick the OG location that matches our bamboo arena best (A-02 dojo
  / A-10 fields study frames), measure its band structure (sky/canopy/
  ground fractions, palette bands), refit `drawArena`. Add probes for stable
  arena bands (location-matched only — see FIDELITY_GATE.md caveat).
- Deliverable: updated side-by-side composite (scratchpad, study-only,
  NEVER committed) + honest verdict line in the session log.

### Slice 4 — Stage-4 title-flow reference (fold into M1 of Stage 4)
- Targeted Fandom pulls (API works with a browser UA; images at
  static.wikia.nocookie.net): `Character_creation_screen.PNG`,
  `Bridge1-3.png`, ENDING stills → `reference/fandom/` (gitignored).
  Owner approved reference downloads 2026-07-16 (scope: study reference).
- These feed the Stage-4 title/login/creation screens with measured layout
  the way B-23 fed the duel HUD.

## Gate table (binary, close v2 when ALL green)

| # | Item | Verify |
|---|---|---|
| 1 | Gate ≥ 40 probes across ≥ 4 states (fighting, result-win, result-defeat, vs-intro), 100% PASS | `await __fidelity.run()` paste |
| 2 | Every new probe was watched RED in-browser before its fix | session-log paste per slice |
| 3 | Edge-scan probe kind live (pure core + sampler), red-proofed unit tests | vitest paste |
| 4 | Bar fraction labels render; existing probes still green | gate paste |
| 5 | Fighter/arena proportions measured (numbers in config with provenance) and applied; M0 not regressed (its tests green) | suite paste + side-by-side |
| 6 | Ledgers current (DIVERGENCES/TELLS/CALIBRATION), FIDELITY_GATE.md updated per slice, RESUME_HERE same-commit | `git show --stat` |
| 7 | Suite + tsc + eslint green; zero console errors on fresh load | pastes |

## Landmines (all hit once already — don't re-learn them)

- **Probe points near text/icons are fragile** — sample fill areas glyphs
  never touch; medians across ≥3 frames; record spreads in the note. The
  probe-schema test REQUIRES `t=<digits>` provenance in every note.
- **Focus strip / any draining meter**: fill length moves between frames —
  single-frame sample for fill colors, multi-frame only for statics.
- **Intro overlay races**: stop `duel-intro` within ~2 settled frames of the
  duel restart or its card visuals linger over the scene (they draw before
  your stop lands). The harness sequence in `game/fidelity.ts` is the
  reference implementation — reuse `settleFrames` (it has the occlusion
  manual-step fallback; naked `postrender` waits hang in background tabs).
- **Row mapping**: compute stage-row → OG-row in python
  (`round((y+0.5)/576*1080-0.5)`), never by hand (banker's rounding bit once).
- **Ratchet**: layout literals in `game/` trip `game-purity-ratchet` — refresh
  via `UPDATE_GAME_PURITY_BASELINE=1 npx vitest run tests/game-purity-ratchet.test.ts`
  (the refresh run deliberately reports RED; the reviewed diff is the receipt).
- **Palette is double-entered** (`config/palette.ts` ↔
  `tests/config-values.test.ts`) — change both in one commit.
- **Wayback throttles bursts**: sleep ≥1 s between fetches, retry with the
  non-`id_` URL form; check mimetype (text/html capture = archived 404,
  not an image).
- **`main.ts` boot**: `?scene=duel` is a no-op by design; DuelScene IS the
  boot scene until Stage 6.

## Session discipline (unchanged)

`RESUME_HERE.md` refreshed in the same commit as the change it describes ·
`docs/sessions/-SESSION-LOG.md` per milestone · evidence pasted, never
asserted · kickoff-bar self-report at close · commits green (pre-commit runs
typecheck → suite).
