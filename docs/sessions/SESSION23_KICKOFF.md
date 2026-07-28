# SESSION 23 KICKOFF — CLOSE THE GI RULING, THEN PUT THE OG FIGHTER IN THE GAME

> **Entry route:** `RESUME_HERE.md` → this file. **Self-contained; assumes no
> memory of SESSION 22.**
>
> **INTENT, in one sentence:** execute the owner's ruling on the one open
> garment (the gi pair), then make `DuelScene` draw the composed OG fighter —
> three sessions of fighter work that the shipped game still does not render.
>
> **⛔ THE STANDING INVARIANT:** the two gameplay videos are the primary 1:1
> reference (`reference/videos/`). **Open a frame and look** before grading any
> visual claim; when a measurement doc and a frame disagree, **the frame wins.**
>
> **Other standing rulings:** RECREATE-NEVER-RIP for dialogue and names ·
> Duels-not-SHS · single-player-first · `core/` zero numeric literals ·
> render-only scenes · red-first TDD · chaos-plant every guard ·
> **binary gates, never softened to fit a result**.

---

## §0 WHERE SESSION 22 LEFT THE FIGHTER

**Six of seven garments live in the ORIGINAL's own paint grammar** (base tone +
one hard-edged shadow + a stroked contour + measured detail lines), the
training branch is on screen at its measured facing, and **every silhouette
floor ROSE**: tracing 0.9106 (floor 0.9006) · held-out 0.8671 (floor 0.8618) ·
height 140.48 (ceiling 140.5). 51 files / 854 tests green · fidelity 55/55 ·
clean clone green.

```
A10.1  execute the GI RULING (see §P1 — the owner decides, the work is staged)
A10.2  the A9-E probe + roster completion (lands WITH whichever ruling)
A10.3  DuelScene draws the composed OG fighter (render-only swap)
A10.4  both combatants + mirroring, appearance digest discipline
A10.5  re-grade, gates, handoff, SESSION 24 kickoff
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED OR STAGED, NOTHING TO GO AND FIND

**P1 — ⛔ THE GI RULING (the owner's, queued with full evidence).**
A9.4's balloon repair is measured-right (back-edge bump prominence 4.80 → 0.53
stage px, would pass the drafted A9-E bar of 2) and the picture is right — but
it costs held-out **0.8671 → ~0.856** (measured −0.0105 attribution on the
pre-branch tree), **below the 0.8618 floor**. The cause is PROVEN, not guessed:
the held-out frame's stance carries real back-side sleeve mass the balloon
defect accidentally faked; moving our far sleeve aft to match was tried,
measured, and made both scores worse. The authored art is parked in
`reference/traced/pending-a9.4/` (SVGs); the blob SVGs were re-traced
byte-exact so the re-derivation gate holds meanwhile.
- **RULING = ACCEPT (recommended):** regenerate 9015+9019 from the pending
  SVGs, move both to `REAUTHORED`, land the A9-E probe red-first, and re-base
  the held-out floor to the measured number IN THE SAME COMMIT, citing the
  owner's decision. The floor moves DOWN only here, only once, only by ruling.
- **RULING = REJECT:** the fallback is a paints-only re-author ON the blob
  outline (base + shadow + stroke on the existing ring): A9-A/C met with a
  byte-identical silhouette; A9-E stays open and ledgered as owner-waived.

**P2 — ✅ THE DUELSCENE GATES ARE ALREADY DRAFTED** (SESSION 21 §7, folded in
at §2 below): `DuelScene.ts` still calls `drawSamurai`, and
`grep -rln "composePose" src/game/` returns exactly `IdleFighterScene.ts` — a
debug route. The composed fighter must be **placeable** (position/scale from
Sim state), **mirrorable** (faces both directions — note the branch's facing
override in `OG_EQUIPMENT` and what a mirror does to it), and drawn for
**both combatants**.

**P3 — ✅ THE RENDER-ONLY RULE DOES THE HEAVY LIFTING.** `Sim` owns all
gameplay state; the swap is scene-side drawing only. `duel-baseline` must stay
green AND unedited — the sim's behaviour cannot move because art changed.

**P4 — ⚠️ TWO OWNER QUESTIONS REMAIN OPEN, do not decide them silently:**
the kasa height trade (SESSION 21 §P6 — pushing the brim deeper fixes the 11%
height overshoot and costs held-out agreement) and the SESSION 22 §P1 ruling
above.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — RULING FIRST, DUELSCENE SECOND
The ruling changes the shape files; landing DuelScene first would re-pin
digests twice. > **Veto:** flip the order if the ruling waits on the owner.

### D2 — THE DUEL FIGHTER IS THE DRESSED ONE
The starting loadout the videos show: gi, hakama, kasa, branch.
> **Veto:** duel with the bare fighter — recommended against; the videos never
> show one.

### D3 — MIRRORING IS A COMPOSE-TIME TRANSFORM, NOT SECOND ART
One shape set, one pose table, a mirror flag at compose/plan time — the OG's
own weapon data proved position AND rotation flip together (`142 = 180 − 38`,
x sign flip, SESSION 22 A9.6).
> **Veto:** none. Duplicated mirrored art is how the two drift.

---

## §2 THE BAR — binary, measurable, fixed before any code exists

| | Test | **THE NUMBER** | Measure |
|---|---|---|---|
| **A10-A** | the ruling is executed | roster = **all seven** (or the waiver ledgered) · A9-E probe committed red-first if accepted | `tests/utils/a9Roster.ts` + the probe |
| **A10-B** | floors honest after the ruling | held-out floor edited **only** by the accept-commit, citing the ruling; otherwise ≥ 0.8618 · height ≤ 140.5 | `git log -p tests/a6Score.test.ts` |
| **A10-C** | the game draws the OG fighter | `grep -rn "drawSamurai" src/game/DuelScene.ts` → **0 hits**; composePose reachable from DuelScene | grep + a render test |
| **A10-D** | both combatants, mirrored | two fighters on screen, one mirrored, branch facing correct BOTH ways | a committed compose test + a LOOK |
| **A10-E** | behaviour unchanged | `duel-baseline` green AND unedited · Sim untouched | `git diff` |
| **A10-F** | nothing regressed | fidelity **55/55** · suite ≥ 854 green · clean clone green · ratchet not widened | the existing gates |

### ⛔ NOT-DONE — the cut line
Out of scope, deliberately: the other 157 animations · all audio · the kasa
height trade (unless the owner rules it) · other outfits · mob AI (SESSION 14
A5/A6). **A session that ships those instead of §2 has not done §2.**

---

## §3 WHAT WILL FIGHT YOU

1. **The golden digests move with every shape/pose change** — update in the
   SAME commit, say why. The floors are different: they move only per A10-B.
2. **The mirror will try to double the art.** D3 forbids it. The branch's
   `OG_EQUIPMENT` override already encodes facing — a mirrored fighter flips
   it BACK toward the recorded value; write the compose test before the code.
3. **`poseRaster.ts` is the only file a test cannot reach.** Keep it so; the
   DuelScene swap goes through the injectable `poseScene`/`composePose` path.
4. **The fidelity gate exceeds the 45 s CDP timeout** — fire-and-poll
   (`window.__fidelityDone` pattern, memory `reference-browser-gate-polling`).
5. **A green gate is not a good picture.** SESSION 20 shipped a bare torso
   that scored well. LOOK at the duel scene with both fighters before calling
   A10-D met.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

- **A10.0** — baseline: `git log --oneline -1` and `npm test` → 51 files / 854
  (plus any wrap commits above; diff `src tests` against the kickoff commit).
- **A10.1** — the gi ruling, executed per §P1.
- **A10.2** — A9-E probe + roster completion (with A10.1's commit).
- **A10.3** — DuelScene renders the composed dressed fighter (A10-C, A10-E).
- **A10.4** — second combatant + mirroring (A10-D).
- **A10.5** — re-grade, gates, handoff, SESSION 24 kickoff.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline confirmed, deviation (if any) explained | `git log` + `npm test` |
| 2 | Ruling executed or explicitly waived by the owner | roster + ledger |
| 3 | A9-E probe committed red-first (if accepted) | the probe + its plant |
| 4 | `drawSamurai` gone from DuelScene | grep pasted |
| 5 | Both combatants render, mirrored, branch facing correct | screenshot + test |
| 6 | duel-baseline green AND unedited | `git diff` |
| 7 | Floors per A10-B; fidelity 55/55; clean clone green | pasted |
| 8 | Ledgers + RESUME in the same commit as their change | `git show --stat` |
| 9 | A human looked at the duel scene and said what closed | the verdict, in the commit |
| 10 | SESSION 24 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the ruling stalls the session.** Mitigation: D1's veto — flip to
the DuelScene track first; the ruling commit is self-contained either way.

**Risk 2 — the duel swap quietly changes gameplay feel.** The render-only rule
plus `duel-baseline` unedited is the guard; if a timing or hitbox number moves
to "make the art fit", that is the bug, not the fix.

---

## §7 BAR SELF-REPORT

**Does this kickoff reach the bar? ✅ Yes — the next change would be churn.**

- Every goal has a runnable measure that can fail; the two owner questions are
  carried as DECISIONS WITH STAGED WORK, not as research.
- It has an explicit NOT-DONE cut line.
- ⭐ It carries SESSION 22's hardest lesson forward as mechanism: floors move
  only by ruling, in one commit, with the citation — never to fit a result.
- ⭐ It folds the previously-drafted DuelScene gates in verbatim intent
  (placeable · mirrorable · both combatants · behaviour unchanged) so nothing
  waits on an old document.
- **What it deliberately does not promise:** animations, audio, other outfits
  — named in the cut line with their owning backlog entries.
