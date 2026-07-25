# SESSION 12 KICKOFF — THE COHERENT COMBAT RETUNE (every number is now measured)

> **Entry route:** `RESUME_HERE.md` → this file. Before touching code, read
> **`docs/research/fidelity/COMBAT_MEASUREMENTS.md`** (the Session-11 study pass:
> 101 measured rows, (a)–(g), with contradictions preserved) and the
> **Session 11 study pass** block in `docs/DIVERGENCES.md`. Raw agent returns —
> including their self-flagged weak rows — are in
> `docs/research/fidelity/session11-raw/`.
>
> **Session 11 verdict: ⚠️ PARTIAL — study pass CLOSED, build steps NOT started.**
> That was deliberate, not a shortfall of effort; the reason is §0 below. Gate
> items 1 and 2 are GREEN; 3–7 are untouched; 8 is green minus the browser re-proof.

---

## §0 WHY NO CODE CHANGED IN SESSION 11 — read this first, it is the whole plan

The study pass measured four things that each, on their own, break the 24-seed
harness gate (`median ∈ [20,60] s · 24/24 good-play wins · 0/24 no-play · ≥22
distinct durations`):

| finding | effect on TTK |
|---|---|
| ordinary mobs die in **1 hit** (e-2) | collapses fight length |
| **no Critical meter**; Focus = 6.00 s, −20 %/hit (f-8, f-9) | changes damage cadence |
| **two gaits** 126 / 341 stage px/s, ours is 280 (b-2) | changes approach time |
| Balanced reach 200 → measured 131 (c-2) | changes whether swings connect |

Landing any one alone forces the harness band to be re-fitted around it — which is
exactly the piecemeal failure the Session-11 adjudication reverted (a foreign
session weakened the gate from `[20,60] s` to `[3,15] s` to fit its own change).
**The gate is never softened to fit a change.** So: retune all four together, then
re-derive the band **once**, from the measured model, and state the derivation.

**Standing rulings unchanged:** RECREATE-NEVER-RIP for dialogue/names (art tracing
now permitted per the owner ruling) · Duels-not-SHS · single-player-first ·
`core/` zero-literals, zero `Math.random` · render-only scenes · red-first TDD ·
chaos-plant every guard · binary gates.

---

## §1 Ordered build sequence

Each step: **failing test names FIRST**, watch red, then code, then green.

### Step 1 — Movement: latch the command, add two gaits
Touch `PlayerIntent` / `Sim` movement block (`Sim.ts` ~line 695) / `DuelScene.ts:~428`.

- **Latch target + gait at command time.** The Sim currently re-reads
  `moveTargetX` from the live cursor *every tick*. Measurement says target and
  gait are fixed for the whole leg — true under **both** candidate input models
  (b-1), so this is safe regardless of how the movement question finally resolves.
- **Two speeds** (new CONTRACT-grade config, from b-2):
  `WALK_SPEED = 126` stage px/s · `RUN_SPEED = 341` stage px/s. Retire the single
  `PLAYER_MOVE_SPEED = 280`, which matches neither (2.22× walk, 0.82× run).
- **Gait chosen once per leg by leg length** (b-3): walk ≤88 stage px, run ≥132.
  ⚠️ The threshold between 88 and 132 is **UNMEASURED** — pick one, tag it
  `INFERRED`, and log it in DIVERGENCES with a veto line. Do not present it as
  measured.
- **No acceleration ramp** — full speed on tick 1 (b-1 evidence 2).
- **Arrival** = full speed, then one `min(speed, distanceRemaining)` clamped tick,
  then zero (b-4).
- **Do NOT add a click-marker FX** — measured absent everywhere (b-5).
- Chaos: NaN / off-arena targets must clamp (the existing guard already covers it —
  re-prove it red-first after the refactor).

### Step 2 — Damage / HP / TTK: the one-hit-kill model
Touch `config/combat-sim.ts`, `core/damage.ts`.

- **Ordinary mobs die in ONE hit** (e-2). Retune enemy HP and player damage *as a
  pair* so a standard early mob dies to a single connecting slash.
- Measured damage TAKEN: dungeon mobs deal **1**, named JINBEI (4) deals **2**,
  against a **20 HP** player (e-4). Player-dealt on a named enemy: **27/30/36**
  (a min/max roll, not a crit tier — f-10).
- Player pools by level: **L1 HP 10 / Chi 10 / AP 50**; ~L3 **HP 20 / Chi 10**
  (§0b H-1, H-2). Our seeds are 100/150 (PvP-dummy numbers) — replace them.
- Leave `damageTakenMult` dead and documented; only the −20 % Heavy defence applies.
- **Gate:** hits-to-kill on a standard mob **== 1**, exactly.

### Step 3 — Delete the Critical meter; retune Focus
Touch `core/critical.ts`, `Sim.ts` (6 sites), `config/combat.ts`, and the pins in
`tests/config-values.test.ts` + `tests/Sim.test.ts`.

- **The OG has no Critical meter (f-8).** Remove it. Three meters only: HP, Chi, Focus.
- **Focus economy (f-9):** linear charge, **6.00 s empty→full**; **−20 % per landed
  slash**; remainder **zeroed when the slash run ends**; **unaffected by taking
  damage**. It is *not* idle regen — it read 0 on 96.7 % of frames, and is INFERRED
  to charge while the slash input is held.
- **A full Focus bar buys EVASION, not crit damage** — developer text, verbatim:
  "ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS
  FULL" (Balanced passive *Critical Evade*, B t=740.0). Model it as i-frames-while-
  slashing gated on a full bar, **not** as a damage multiplier.
- `CRIT_MULT` stays **1.3 INFERRED** — f-10 shows this footage cannot source it.
- **Stance switch costs nothing** (c-4): drop `FOCUS_SWITCH_COST`'s claim to
  measured status; out-of-combat switching is free, in-combat is locked.
- Chi is a **skill resource only** — it never moved in any sampled fight (f-11).
  Known costs: Slash Wave 10, Dash Left 2.

### Step 4 — Reach values
Touch `config/stances.ts`.

- **Light 300 ✅ and Heavy 100 ✅ are CONFIRMED by measurement** (max 303; plateau
  97–103) — promote their provenance from wiki-carried to MEASURED.
- **Balanced 200 ❌ is NOT confirmed** (measured 131, but only level-1 footage
  exists). **Keep 200, retag INFERRED/unverified**, veto line in DIVERGENCES.
- **Do not change the hit-test structure.** `resolveSlash`'s *crosses-hitbox AND
  within-reach* gate already produces the measured direction-sensitivity that a
  bare radius cannot (c-3). The per-segment gate stands.

### Step 5 — Re-derive the harness band ONCE
`tests/harness.test.ts`.

Only after steps 1–4 are green. Re-derive `[min,max]` from the retuned model,
state the derivation in the test's header comment, and keep the other three
assertions (24/24 wins · 0/24 no-play · ≥22 distinct) **verbatim**. Never widen a
gate to make a change pass.

### Step 6 — AUTO SLASH, honestly
`DuelScene.ts:~372`.

Developer text (g-2) settles the behaviour: **ON = the game drives both movement
and basic slashes** ("YOUR BODY WILL MOVE WITH MUSCLE MEMORY WHILE YOU CAN FOCUS ON
ACTIVATING YOUR SKILLS", A t=470.0). Either implement that, or wire the plate to a
genuinely disabled state and log the deferral. **The plate must never lie again.**

---

## §2 Queued, fully specified, NOT part of the retune

- **Portrait ring must be stance-coloured** — developer text plus two frame-proven
  hues (balanced `#8c642e`, heavy `#8a110b`); we hardcode red on a refuted
  "constant red" reading. Needs (i) the LIGHT blue hue, still unmeasured, (ii) a
  ring centre/radius re-measure in the **duel** HUD, (iii) re-pointing gate rows
  `portrait-ring-left/right`, which currently assert the OG's *heavy* red while our
  duel spawns *balanced*. Full write-up in DIVERGENCES.
- **Two contested prior measurements**, both left unchanged, both needing a
  same-method re-measure on video B: `DASH_SLASH_PX = 127` and `SLASH_FRAMES`
  12/16/20. See COMBAT_MEASUREMENTS "Contradictions / open" #3 and #5.
- **`SHSD_MASTER_REFERENCE` A-16 correction** — the "3-hit combo 20/20→4/20" entry
  is wrong (e-5); fix it when next editing that file.
- **Scripted zone-entry walk** (b-7) — a real build requirement for Stage-4 zones.

---

## §3 Gate (binary — every row pass/fail)

| # | Item | Verify | S11 status |
|---|---|---|---|
| 1 | Study ledger rows for (a)–(g), numbers + frame refs, tagged | ledger diff | ✅ **GREEN** — 101 rows, 202 evidence frames |
| 2 | CRUX resolved **by measurement**, not assumed | ledger + red-first test | ✅ **GREEN** — a-5, two independent strands |
| 3 | Movement latched, two measured gaits, WASD demoted | browser + sim reads | ⬜ not started |
| 4 | `resolveSlash` gates by reach; in-reach hits, beyond-reach whiffs | test names + diff | ✅ structure already correct (c-3); values pending |
| 5 | Stance switch shows a visible, measured reach/speed delta | capture pair | ⬜ not started |
| 6 | Hits-to-kill on a standard mob **== 1**; Focus fill == 6.00 s | pins + browser | ⬜ not started |
| 7 | AUTO SLASH state is real (measured behaviour or honest disable) | browser toggle | ⬜ not started |
| 8 | Suite · tsc ×2 · eslint · fidelity 55/55 · zero console errors · harness re-banded green | pastes | 🟡 suite/tsc green; browser + harness pending |
| 9 | Ledgers + DIVERGENCES + RESUME_HERE + SESSION13 kickoff in the closing commit | `git show --stat` | ⬜ at close |

---

## §4 Measurement traps — do not re-learn these the hard way

Every one was hit by an agent in Session 11 and caught only by looking at pixels:

1. **Foreground bamboo occludes enemy HP bars**, splitting them — a naive green-run
   read shows a full bar as 25–70 % and **invents damage that never happened**.
2. **"CANNOT CHANGE STANCE" reads as a ~74 %-full Focus bar** to a white-pixel mask.
   Measure the contiguous run from the track's left edge, then confirm by eye.
3. **Ground-band frame-differencing under-reports camera scroll ~3×** (the white
   character body dominates). Anchor on a discrete world-fixed feature; background
   layers parallax at 0.45–0.68× and are not valid anchors.
4. **15 fps content floor** — nothing under 67 ms is resolvable; 60 fps extraction
   is 4× wasted work.
5. ✅ **Reusable trick:** interaction tooltips render **at the mouse cursor**, not on
   the object they name — the only way to read the mouse in a recording that never
   draws it (±150 px).
