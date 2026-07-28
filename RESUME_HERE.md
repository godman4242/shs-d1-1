# RESUME HERE

## 📋 NEXT-SESSION KICKOFF (paste-ready)

**Activate first** — turn these on BEFORE pasting; a fresh session won't do it for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy; the browser gate needs the Chrome extension |
| **Model** | **Fable 5** at **`high`** | long-horizon, gate-driven; `high` is Fable's own default — never carry Opus's `xhigh` over. (Working closely interactive instead? Opus 5 `high` is the routing rule's alternative.) |
| **Context** | **fresh session** | the kickoff is self-contained |
| **MCP** | **Claude in Chrome** — on | the 55/55 fidelity gate + the duel-scene look |
| **Ultracode** | optional | SESSION 23 is serial-surgical (a ruling + a render swap), not a fan-out |
| **⛔ FIRST INPUT** | **the GI RULING** | A10.1 is staged either way, but the session starts fastest with the decision in the prompt |

Copy everything **between** the `'''` lines (the markers themselves are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me what they say before writing anything:
- RESUME_HERE.md
- docs/sessions/SESSION23_KICKOFF.md   <- the only kickoff to plan from, self-contained

MY RULING ON THE GI (pick one, this gates A10.1):
- ACCEPT: the balloon repair ships; the held-out floor re-bases in that same
  commit, citing this ruling.  <- recommended in the evidence pack
- REJECT: keep the old silhouette; paints-only re-author on the blob ring.

THE JOB: §4 A10.1 onward — execute the ruling, then make DuelScene draw the
composed OG fighter (it still calls drawSamurai), both combatants, mirrored.

WHAT NOT TO BREAK:
- Floors move ONLY per the ruling commit (A10-B). Otherwise held-out >= 0.8618,
  height <= 140.5, tracing >= 0.9006 — and current state is ABOVE all three.
- duel-baseline green AND unedited — behaviour cannot move because art changed.
- src/core/ zero numeric literals; scenes render-only; red-first; chaos-plant.
- "A green gate is not a good picture" — LOOK at the duel scene, both fighters.

PROVE IT: every §2 gate has a runnable measure. Paste the output, never assert.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 51 files / 854
tests), then propose the exact A10.1 step for my ruling. Don't start until I ok it.
'''
```

**Bar verdict: ✅ this kickoff meets the "cannot be improved further" bar** — every
goal has a measure that can fail, the cut line is explicit, both owner questions
are carried as staged decisions rather than research, and the floor-moves-only-
by-ruling rule closes the one door SESSION 22 found open. The next change would
be churn.

---

> ## ▶ SESSION 22 CLOSED — THE ART GRAMMAR IS THE ORIGINAL'S. ONE OWNER RULING OPEN.
> **51 files / 854 tests green** (was 49/827) · tsc ×2 → 0 · eslint → 0 ·
> fidelity **55/55** · clean clone **843 pass / 11 skipped, exit 0** ·
> 0 app console errors on `?art=dressed` ·
> **tracing 0.9106 · held-out 0.8671 · height 140.48 — every floor held and ROSE, none edited.**
>
> **Commits:** `f7e3801` targets → `354891a` A9.1 grammar gate → `dc9bea6` A9.2
> collar+sleeve → `bd994ba` A9.3+A9.5 kasa/hakama/obi (fan-out) → `2112b84`
> A9.6 branch. Ledger: `docs/DIVERGENCES.md` "SESSION 22 — …" (five entries).
>
> - **GATE A9-A/B/C/D:** six of seven garments re-authored in the OG grammar —
>   every ink share ≤ 61.4 % (the OG's own worst; was 75.9/70.6 on the owner's
>   two), every tone within 12 of its committed p25/p75 target (five byte-exact
>   0), collar base = the SWF's own `#dcd9d4`, hakama MEASURED_FLAT `#dcd9d4`.
> - **GATE A9-F:** the branch is on screen at rotation 38 — the measured mirror
>   of the recorded 142 (`142 = 180 − 38` CONFIRMED, source axis +39.9°±2,
>   residual 0.6°). ⭐ The mirror flips the POSITION too (x sign) — found by
>   LOOKING, fixed by bbox-fraction measurement + floor-bounded sweep.
> - ⛔ **THE ONE OPEN ITEM — THE GI RULING (owner):** the balloon repair is
>   measured-right (bump 4.80 → 0.53 stage px) and costs held-out below the
>   floor (~0.856 vs 0.8618); cause proven (the held-out frame's stance has
>   real back-side sleeve mass the defect faked). Authored art parked in
>   `reference/traced/pending-a9.4/`; evidence + numbers in the A9.3+A9.5
>   ledger entry; execution staged in SESSION23_KICKOFF §P1 for either answer.
> - **Also open (owner):** the kasa height trade (SESSION 21 §P6, unchanged).
> - **Tools built:** `reauthorGarment.py` (grammar re-authoring, D4 SWF
>   preference, measured shadows) · `grammar.ts`/`inkShareLib.ts` (the paint
>   ruler in the suite) · `OG_EQUIPMENT`/`OG_DRESSED_NODES` (equipment facings
>   without touching the byte-checked pose) · traceGarment clobber guard.
> - **Process finds (ledgered):** the no-game-imports guard improved A9.1's
>   design; a coordinate-space misread nearly condemned a valid gate (control-
>   frame check caught it); parallel agents' whole-figure scores are
>   contaminated by siblings mid-flight — per-shape measures are not.

---

> **Fresh session and Kheshav said only "continue"?** Read this file top to
> bottom, then `docs/sessions/SESSION4_KICKOFF.md` (standing mandates), then
> `git log --oneline -10`. Trust those three over any older doc.
> Fidelity ledgers: `docs/TELLS_CHECKLIST.md` · `docs/CALIBRATION.md` ·
> `docs/DIVERGENCES.md` (adopted from iaido-duel mining, 2026-07-12).
> Navigable digest of ALL research: `docs/research/SHSD_MASTER_REFERENCE.md`
> (adopted 2026-07-17 — its header pins precedence: ledgers/config win).
> Orientation map for a FRESH session/model: `docs/BUILD_PLAN.md`
> (adopted 2026-07-17 — snapshot, this file wins on state; its §2
> model-fallback advice is NOT policy).
> **Fidelity GATE (2026-07-16): `docs/research/fidelity/FIDELITY_GATE.md`**
> — measured OG assertions vs live canvas: `npm run dev` → console →
> `await __fidelity.run()` → must stay **55/55** PASS (v2 gate — 41 points
> + 14 edge scans; v1 was 17/17). HUD changes re-run it.

## Awaiting human/browser verification
1. ⛔ **THE GI RULING (SESSION 22 → 23):** accept the balloon repair (right
   picture, held-out floor re-bases by your ruling) or reject (keep silhouette,
   paints-only re-author). Evidence: ledger "SESSION 22 — A9.3 + A9.5" + the
   image pack sent in-chat 2026-07-28. Recommended: ACCEPT.
2. **The kasa height trade** (SESSION 21 §P6) — measured, open, unchanged.
3. **§5 item 13 — look at the three band crops** (`renders/band_A/B/C.png`,
   regenerated with the branch) and say what closed. Sent in-chat 2026-07-28.

## Historical record — moved out on 2026-07-27

The **Current focus**, **State**, **Next concrete step** and **Stage-2 milestone
history** blocks were moved VERBATIM to `docs/sessions/-SESSION-LOG.md`. All four
were past-tense records of closed work (the source dive, Stage 2/3 milestones, the
SESSION 11 study pass) already held permanently in `docs/DIVERGENCES.md`.

**Nothing live was moved.** The sections below — open decisions, what not to break,
stage landmines, backlog — are still current and stay here.

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT 1.3** (was spec 3) — default keep; Stage 2 "crit 3×" gate items
   read "crit ×CRIT_MULT". Veto = revert combat.ts + config-values.test.ts.
2. **MAX_DAN_RANK 10** (Stage 3) — default 10. LANDED M1 as the rebirth
   ceiling (`progression.ts`); still owner-vetoable → revert to 5 = edit
   economy.ts + config-values.test.ts + the DIVERGENCES entry.
3. **Rebirth = elemental +10, stacking** (Stage 3) — default elemental.
   LANDED M1 (field renamed `elementalPointsPerRebirth`; flat +10, NOT the
   research 10th-rebirth +20 nuance). Veto = restore attack semantics / add
   `tenthElemental` (see DIVERGENCES).
4. ~~ESLint~~ DONE (Stage 1). Veto = delete eslint.config.mjs, empty LINT_CMD.
5. **new-project.sh invalid JSON** — installer fix still outside this repo.
6. **Phaser 4 exists** — stay pinned 3.90.0 permanently (default).
7. **Branch `master`** — default keep.
8. **Dev-only `window.__game` seam** (main.ts, DEV-guarded, stripped from prod)
   — default keep for automated verification. Veto = delete the if-block.
9. **Gesture thresholds INFERRED** (`GESTURE_DIAG_DEG=45`,
   `LAUNCH_FLICK_MAX_LEN=90`; length proxies flick speed — no per-point
   timestamps). Default: keep, revisit at Stage 2 feel pass.

## What not to break
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP (drawings/dialogue always
  original; palette now near-OG per owner veto 2026-07-12) · core/
  zero-literals · dependency direction · render-only scenes · binary stage
  gates. Folder rules: `src/{core,config,game}/CLAUDE.md`.
- `tests/fixtures/scan-probe/` is load-bearing (scanner regression fixtures).
- The game-import guard + purity gate are chaos-proven — keep them fail-closed.

## Stage landmines from research (apply at the noted stage)
- **Stage 2**: `HEAVY_DEF_PENALTY` (defense ×0.8) vs `damageTakenMult 1.25` —
  apply ONE, never both. Stance is HARD-LOCKED in combat in v0.717 PvE
  (SYNTHESIS §6.1) — implement out-of-combat switch as CONTRACT + Focus-gated
  in-combat variant as INFERRED. Spawn invuln has a confirmed blink indicator.
  `critical.ts`: two meters (Focus = stance switch, Critical = crits). PvE
  trash resolves 3–10 s — DUEL_TARGET_SECONDS {20,60} is a boss/PvP number.
  Combo counter resets to 1 (not 0) per kill; breaks on damage taken/chain gap.
  NaN-guard Sim.advance inputs (audit refuted Stage-1 scope, binds Stage 2).
- **Stage 4/5**: four joinable Great Clans (+ Aoi Hoiru, Ki Sensu); Shira
  Tancho story-only. War Room: 75 deploy, 500 per-structure donation,
  flag 120%. HAS_CASH_PURCHASE=false is a deliberate deviation.

## Spark / backlog (noticed, not acted on — why later)
- game/ config-purity ratchet baseline (per-file value multiset) — Stage 2
  item 15; DuelScene literals are tolerated until then.
- DuelScene fixed-step accumulator DONE (Stage-1 browser bug); Sim.advance
  (deltaMs, MAX_FRAME_MS=250 in config) replaces the inline 250 at Stage 2.
- Phaser bundle 1.2 MB → code-split at Stage 6.
- `@types/node` 26 vs Node 25 — harmless; align when LTS catches up.
- Vite dev server may still be running in background task b1jaqmhl1.
