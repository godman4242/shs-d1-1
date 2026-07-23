# MECHANICS GAP ANALYSIS — the corrected combat model

> **Provenance:** produced 2026-07-18 by a 6-agent read-only cross-check
> (workflow `wf_18c5d5e9-e3f`) of THREE sources: (A) what the live code does,
> (B) the project's own research docs, (D/E) independent web ground-truth on
> *Straw Hat Samurai: Duels*. Evidence strength is tagged per claim.
> **This doc SUPERSEDES SESSION10_KICKOFF's combat *hypothesis* (its step 2b
> "line = move-to-target command"). Keep SESSION10's METHOD; replace its MODEL.**
> Read-only investigation — no code was changed.
>
> **UPDATE 2026-07-18 (adversarial verify `wf_e0c82aeb-698`):** the crux was
> re-tested by 3 skeptics and REFINED to a **two-gesture HYBRID** — **drag =
> slash** (the line IS the blade path and damages along itself, stance-capped
> reach) and **tap/click = move-to-target** (walk toward the point). So the
> owner was RIGHT that a move-to-target command exists — it is the CLICK, not
> the line. Wherever this doc frames move-to-target as simply wrong, read: "the
> LINE is not a move command; a separate CLICK gesture is." Execution authority
> is **`SESSION11_KICKOFF.md`** (MEDIUM confidence — the reach/whiff NUMBERS are
> still unmeasured; its study pass measures them before any code is written).
>
> **UPDATE 2026-07-23:** `docs/research/REBUILD_READINESS.md` §3 (2026-07-20
> 24-agent research pass) supersedes TWO points below: the movement gesture is
> **hold-mouse-to-run (in-game Tip #27); no click=move-to-target gesture was
> found** — read the hybrid's click half as CONTESTED, hold-run leading; and
> the **"iaido-duel MEASURED 3.0×" crit point is a DIFFERENT GAME** — VOID as
> evidence here, so divergence #5's dispute collapses to the wiki's **1.3×**
> (still worth one OG popup read). Its §3 also corrects: stance tables are
> **mastery-9 ceilings** (Heavy reach 100, not 120), Chi is a **~10-pool with
> single-digit costs**, and in-combat stance is **hard-locked** in v0.717.
> SESSION11_KICKOFF carries the reconciled instructions.
>
> **FRAME-VERIFIED 2026-07-18 (own eyes, `duel_dense/428.0`→`428.9`):** the
> blade-path half is now HIGH confidence — one arc reaches across a gap,
> bloodies MULTIPLE enemies along it, then the body flash-steps a modest
> distance (not a teleport); the far enemy keeps full HP (finite reach).
> Incidental MEASURED: early player HP is small (20/20) → fast TTK, supporting
> divergence #4. Still MEDIUM: the movement gesture + exact reach px / crit ×.

---

## TL;DR (read this, then the table)

- The owner feel-run's **observations are all correct** (mouse-only movement,
  damage too low, crit too slow, stances inert, AUTO SLASH dead).
- The owner feel-run's **inferred model is wrong.** The drawn line is **not** a
  "run-to-this-point-then-slash-the-area" command. **The line IS the blade
  path** — you cut *along* it, and the line's *shape* selects the attack.
- You cannot hit a distant enemy because of a **stance-capped slash REACH**
  (Light ~300 / Balanced ~200 / Heavy ~100 units) + a flash-step along the cut,
  **not** because the line teleports you to a target.
- **The current stroke-vs-hitbox code is closer to the truth than SESSION10's
  rebuild.** Fix, don't rewrite: add a reach cap, switch movement to mouse,
  wire stance reach/speed, re-tune numbers. That's a *smaller* job than planned.
- **Do NOT let the study pass assume the move-to-target framing** — it must
  actively falsify the blade-path model (see "Study pass" below), or the project
  drifts a second time.

---

## What is already built (the engine is real — don't rebuild it)

Phaser 3 + TS5, combat Stages 1–3 CLOSED. Fixed-60Hz `Sim` owns all state
(mulberry32 RNG, zero `Math.random` in `core/`), config-driven numbers labeled
CONTRACT/INFERRED, render-only scenes, 24-seed cross-process determinism
harness, ~55/55 fidelity gate, pre-commit typecheck→test→eslint gate. Stage-4
M0 (15-joint skeletal fighter + walk cycle) done. **Unbuilt:** Stage 4 M1–M7
(campaign: title, dialogue, town, quests, RPG screens), Stage 5 (War Room),
Stage 6 (polish).

---

## Confirmed divergences — current code vs the real game (ranked by feel-impact)

| # | Mechanic | Code does today | Real game does | Evidence | Impact |
|---|---|---|---|---|---|
| 1 | **Slash semantics** | Hit = drawn polyline crosses enemy hitbox at raw screen coords; player position never passed to `resolveSlash`; `STANCE_TABLE.reach` never read → slash connects from anywhere on screen. 127px dash bolted on. | Line IS the blade trajectory; cut runs ALONG the line; **stance-capped reach**; body flash-steps along the cut; close distance by mouse-running first. Line **shape** = attack type. | multi-source | **CRITICAL** |
| 2 | **Movement input** | A/D keyboard (`moveX`, 280 px/s). Mouse only draws. | Mouse-only, **no WASD**; hold/point mouse to run toward cursor (in-game Tip #27). Keyboard = skill/stance hotkeys only. | multi-source | HIGH |
| 3 | **Stance reach & speed** | `reach` scales only the animation arc; `speed` entirely unread. Stances differ by ~2–3 dmg → inert. Perverse: Light counters Heavy yet hits weakest. | Reach = the slash-distance CAP; speed lengthens the slash line + cuts skill cooldowns (Tip #36). Stances are a central tactical layer. | web-confirmed | HIGH |
| 4 | **Damage / HP / TTK** | 8 dmg vs 150-HP enemy = **19 slashes to kill**; enemy 7.25 vs player 100 HP. Grindy. | PvE trash resolves fast (project research: 3–10s); duels short, to-KO, 5s opening grace. Exact numbers must be read from longplay popups. | internal-research | HIGH |
| 5 | **Crit multiplier** | `CRIT_MULT = 1.3`. | **Disputed:** Fandom stat table = 1.3× (internally consistent) vs Tao's Handbook "3×" + sister project iaido-duel **MEASURED 3.0×**. Real conflict. | multi-source | HIGH |
| 6 | **Crit gating** | Dedicated `critical` meter fills passively 8/s (12.5s to full), consumed on landed hit. Focus is a separate stance-switch cost. | Crits gated by the **FOCUS bar** (charged by deliberate play/openings), and the **same** Focus bar pays the stance-switch cost. Crit is a Focus mechanic, not a standalone bar. | multi-source | MEDIUM |
| 7 | **AUTO SLASH** | Render-only static plate; no code path. Non-functional. | Real auto-attack mode (repeated basic slashes); viable in Heavy/Balanced, wastes Light's combos. Exact UI/target rule undocumented. | web-confirmed | LOW |
| 8 | **Counter bonus** | `COUNTER_BONUS = 1.25` (+25%). | Web guide says ~20%. Triangle direction (light>heavy>balanced>light) already correct. | web-confirmed | LOW |

Crux evidence (code side): movement `DuelScene.ts:414`; slash resolves via
`Sim.applyStroke`→`resolveSlash`→`strokeCrossesPolygon` (`slash.ts:46-80`) with
**no player position and no reach gate**; dash `Sim.ts:405-421`
(`DASH_SLASH_PX=127`); dead `damageTakenMult` (`damage.ts:13-15`).

---

## The corrected combat model (what Fable should build toward)

1. **Movement = mouse locomotion.** Hold-mouse-to-run-toward-cursor (verify
   against footage; fall back to click-destination only if the video shows it),
   ~280 px/s. Demote A/D to a dev-seam fallback.
2. **Slash = blade path with a stance reach cap.** Keep stroke-vs-hitbox for
   *what* gets cut, but pass player position into `resolveSlash` and gate the
   hit by `STANCE_TABLE.reach` (Light ~300 / Balanced ~200 / Heavy ~100–120).
   Body flash-steps ALONG the drawn line within reach — reuse the already-
   measured 127px lunge as the in-reach travel, scaled to reach. Keep the
   line-shape→attack-type mapping.
3. **Wire stance reach + speed to real effects** (reach = the slash cap; speed =
   swing cadence / draw speed / slash-line length per Tip #36). Leave
   `damageTakenMult` dead — web agrees only the −20% defense applies.
4. **Re-tune damage / enemy HP / TTK** to measured numbers (trash ~3–10s).
   Label MEASURED vs INFERRED honestly. Gate: hits-to-kill == measured count.
5. **Unify crit under a Focus bar** (charge + spend, shared with stance-switch),
   not a standalone auto-fill meter. Resolve 1.3× vs 3× by reading OG popups —
   **do not default to 1.3× given the measured 3.0× data point.**
6. **AUTO SLASH:** implement the real auto-attack, or honestly wire the plate to
   a true disabled state and log the deferral. The plate must never lie.

Only then proceed to the campaign build order (Stage 4 M1–M7).

## Study pass — the falsification test that prevents a second drift

Before any code, from the longplay footage measure:
- **(a) THE CRUX:** does a slash drawn over a *beyond-reach* enemy connect at
  all, or whiff until you mouse-run into range? (This decides blade-path vs
  move-to-target. Do **not** pre-assume move-to-target.)
- (b) slash reach per stance in px; (c) whether the body travels the FULL drawn
  distance or only a capped flash-step; (d) movement = click-destination vs
  hold-toward-cursor; (e) damage popups, hits-to-kill, crit fill time.

---

## Known / Known-Unknown / Unknown-Known matrix

**Known-knowns (confident — multi-source or code+research agree):**
- Movement is mouse-driven, not keyboard.
- Drawn line drives the slash; line SHAPE selects attack (horizontal=slash,
  up=jump, up-vertical=launch, down-vertical=stab; X/V/triangle=combos).
- 3 stances, RPS triangle light>heavy>balanced>light — code direction matches wiki.
- Stance dmg mult 0.9/1.2/1.4 and heavy −20% defense already match wiki.
- Heavy's only defensive downside is −20% defense, NOT a separate
  incoming-damage mult → dead `damageTakenMult` is correct to leave off.
- Chi = mana-like skill pool; Focus = separate meter gating crits + stance switch.
- Leveling 1–80 (3 stat + 1 skill pt/level; +10HP/+5Chi/+1AP/+3 combat; 80
  skill-pt first-run cap; skill level N costs N pts).
- Rebirth: resets level, keeps skill pts + items, +25 gold; 10-deep dan ladder
  (Shodan..Judan); 4 rebirth-gated elements (Fire/Water/Wind/Earth).
- 4 joinable story clans (not 5); Smoke Bomb is a Ninja skill; coins+gold economy.

**Known-unknowns (must measure/decide — do not invent):**
- CRUX: exact slash reach in units + px, and whether beyond-reach slashes whiff.
- Movement: click-destination vs hold-toward-cursor.
- Crit multiplier: 1.3× vs 3×.
- Focus/crit fill rule + fill time.
- Exact early-mob HP / damage-per-swing / hits-to-kill (read from popups).
- AUTO SLASH exact behavior + UI.
- Duel duration / time limit (web found none — likely to-KO + 5s grace; do NOT
  invent a timer).
- Per-Chi-skill and per-Ninja-skill costs.

**Unknown-knowns (the project ALREADY solved these — surface, don't re-research):**
- Flash-step numbers ALREADY measured: `DASH_SLASH_PX=127`, approach ~10px/f,
  windup 4f, lunge 1f, walk stride 72, run ~14px/f → reuse as the in-reach
  slash travel, not a bolt-on to a move command.
- `STANCE_TABLE` already carries reach (300/200/120) + speed (1.4/1.0/0.7) from
  the wiki — the fix is WIRING them to combat, not new research.
- Counter-triangle direction + heavy −20% defense already match ground-truth —
  do not relitigate them.
- `damage.ts` already documents "apply EITHER defense penalty OR
  damageTakenMult, never both" — the dead-field choice matches the web.
- iaido-duel already MEASURED crit at 3.0× — a real data point the 1.3× default
  silently overrides.
- SHSD_MASTER_REFERENCE openly warns its own CONTRACT/MEASURED tags sometimes
  mirror the recreation, not the OG — trustworthy for progression/economy/enemy
  taxonomy, NOT for the control model (which is why SYNTHESIS §1.1 encoded the
  wrong slash model).

---

## Open risks

- **Confirmation bias in the study pass** — SESSION10's move-to-target framing
  could steer measurement into re-confirming the wrong model. The study MUST
  falsify the blade-path hypothesis (beyond-reach connect test).
- **Owner observation vs owner model** — his observations are the project's
  highest-precedence rule and all check out; his *causal model* (line = move
  command) conflicts with the developer text. Separate the two: trust the
  observations, contest the model.
- **Crit 1.3× vs measured 3.0×** — picking wrong materially changes feel + TTK.
- **Movement model unmeasured** — click-destination vs hold-toward-cursor is a
  core verb; building the wrong one ships a subtly wrong game.
- **Wiki stance stats may be mastery-9 values** reused as the base table — base
  reach/speed/damage may differ; risk of scaling from the wrong baseline.
- **Web RPG sources are player wikis** (internally consistent, not
  developer-authoritative); exact numbers thin — flag unresolved, never invent.
- **Duel duration undocumented** — resist a hard timer; model to-KO + 5s grace.
- **Doc hygiene** — live fidelity count is 55/55 (not stale 17/17); SESSION10
  (not BUILD_PLAN/STAGE4) is the ordering authority — but THIS doc overrides its
  combat model.
