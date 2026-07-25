# SESSION 13 KICKOFF — THE SOURCE-LED REBUILD

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you need.**
> Self-contained; `SESSION12_KICKOFF.md` is SUPERSEDED (history only).
>
> **Read before touching code:** `docs/research/fidelity/SOURCE_CONSTANTS.md` §3, §5, §6,
> then the "Source dive" block in `docs/DIVERGENCES.md`.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names (art tracing
> permitted per the owner ruling) · **Duels-not-SHS** · single-player-first · `core/` zero
> numeric literals, zero `Math.random` · render-only scenes · **red-first TDD** ·
> chaos-plant every guard · **binary gates, never softened to fit a change**.
>
> **This plan was adversarially reviewed by four independent lenses before you got it.**
> 34 CRITICAL/MAJOR findings were raised against the first draft and folded in; a third pass
> then closed every remaining open question from source.
>
> ⚡ **THERE IS NO RESEARCH STEP AND NOTHING TO DECIDE. Start at §4 A0 and write code.**
> §P records the five questions that were open and their answers, so they are not re-opened.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**Stop fitting numbers to footage. Implement the original's own model.**

Until now we copied a painting by measuring its colour at twenty spots and painting those
twenty dots. The dots matched. Everywhere we *hadn't* measured, we guessed — and some
guesses were wrong in ways more measuring would never have caught.

**We now have the painter's own recipe.** The source gives **formulas**, not just numbers:

- reach = `f(SPD stat, rebirth rank, stance, mastery)` — not three constants
- damage = `f(attack, weapon, stance, mastery, focus)` — not a fixed value
- enemy HP = `f(the player's own damage, level gap)` — not authored at all

A formula reproduces **every** situation, including the thousands we never filmed. Twenty
fitted constants reproduce exactly the twenty we filmed and quietly diverge everywhere else.

**The argument for adopting the formulas is that they are the game's own code
(`CONTRACT-SRC`). That argument is complete on its own and needs no measurement support.**

> ⚠️ **An earlier draft claimed the formula "reproduces our measured 131 and 100 exactly".
> That claim was WRONG and is deleted.** Measurements are in **stage px**; the formula emits
> **world px**. Equating them is unit-mixing — *the project's own documented failure mode*,
> the same shape as the voided 3.0× crit.
>
> **And the corrected conversion makes it worse, not better.** At the source's own render
> scale (D1: ÷1.2), the c-2 readings become — Light **194–201** world · Balanced **97–109** ·
> Heavy **81–86**. The formula at the measured **SPD 1** gives **173 / 124 / 100**. So Light
> measures *above* the formula while Balanced and Heavy measure *below* it. **No single stat
> value reconciles all three**, which means the three "reach" readings were not all measuring
> the same quantity (Light almost certainly captured dash travel, which §3.3 of
> `SOURCE_CONSTANTS.md` says is uncapped).
>
> ⇒ **Do not use measured reach to validate or tune the formula in either direction.**
> Recorded as an open contradiction in `SOURCE_CONSTANTS.md` §5.

**Resolved sub-question, recorded so it is not re-opened.** One mining pass reported the
mastery skills "start at level 1" (which would make Balanced 133, not 131). Checked
directly: the skill-level getter returns **0** for any unpurchased skill
(`if (skill != null) return skill.level(); return 0;`, the same pattern in every branch).
**Fresh-character mastery is 0.**

---

## §P PREREQUISITES — ✅ ALL RESOLVED FROM SOURCE. No prerequisite work remains.

These were open in an earlier draft. They have now been read out of the payload directly and
are recorded here so the next session starts on code, not research.

**P1 — ✅ Enemy class and its K/D pair.** The named-duellist class (`§1t4907s0§`, the one that
draws the **white** `charname + " (" + level + ")"` nameplate `DuelScene` renders) uses
**`K = max(10 + Δ, 3)`** and **`D = max(18 − Δ, 3)`**. The generic `8/16` pair belongs to a
*different* class. Read verbatim: `_loc8_ = 10 + _loc7_; _loc9_ = 18 - _loc7_;` each floored
at 3. ⚠️ **`SOURCE_CONSTANTS.md` §3.8 quoted the wrong class's pair — corrected in the same
commit as this file.**

**P2 — ✅ The `level ≤ 8` override, read verbatim.** The scaling block ends:
```
if (level <= 8) { minDamage = 1;  §1t1244s0§ = 1;  defense = 1; }
```
It fires **after** the HP derivation, so HP still scales but the enemy's **damage and defence
are forced to 1**. Our `DUEL_ENEMY.level = 1` sits inside it — **D3 resolves this by
re-levelling.**

**P3 — ✅ A slash is NOT gated on Focus.** The slash-entry guard checks death and action-state
only — there is **no Focus test**. The spend simply clamps the meter at 0. **Only stance
switching is gated** (`if (focus < 48) return;`).
⇒ Focus is a **crit-charge resource, never a stamina gate**. You can always swing; you cannot
always switch stance. **This means the harness's swing rate is set by the bot's cadence alone.**

**P4 — ✅ Render transform, computed by the original itself.** Its resize routine, for logical
`w=800, h=480, hTall=690`:
```
if (windowAspect <= 800/690)  { contentAspect = 800/690; h = 690; }   // very tall windows only
if (contentAspect >= windowAspect) { scale = stageW/800; xOff = 0; yOff = (stageH − h*scale)/2; }
else                               { scale = stageH/h;   xOff = (stageW − 800*scale)/2; yOff = 0; }
scaleX = scaleY = scale;     // ONE uniform scale, both axes
```
For our **1024×576** canvas: `windowAspect` 1.778 > `contentAspect` 1.667 → **else** →
**scale = 576/480 = 1.2**, **xOff = 32**, **yOff = 0**.

⇒ **`stage = (32 + 1.2·worldX, 1.2·worldY)`** — uniform ×1.2, pillarboxed with 32 px bars.
It fits the speeds far better than the first draft's guessed 1.28: run `288 × 1.2 = 345.6`
against measured **341–349** (dead centre), walk `96 × 1.2 = 115.2` against **112–126**. The
1.28 guess gave 368.6 and needed a "snap-arrival deceleration" excuse that
`COMBAT_MEASUREMENTS.md` b-4 explicitly refutes ("no deceleration ramp").

**P5 (new, found while resolving P1) — ✅ the design is SYMMETRIC.** The parameter map confirms
the stat feeding the enemy-damage formula is **player max HP**:
`enemyMinDamage = max(scaledBase, playerMaxHP / D)`, mirroring
`enemyHP = max(scaledBaseHP, effPlayerDamage × K)`.
⇒ **The player kills the enemy in K hits; the enemy kills the player in D hits.** Both sides
of a duel are tuned in *hits*, and neither is tuned in *hit points*. This is the single
cleanest statement of the original's combat design and it should drive every balance choice.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

Each decision carries a **one-line veto**.

### D1 — Split WORLD from STAGE. Sim goes to 800 × 480; the canvas stays 1024 × 576. ⭐

This is the foundational decision, and the review corrected its first form.

- **WORLD (sim units) becomes 800 × 480** — the original's logical space. Every source
  constant then drops in **with no conversion at all**.
- **STAGE (canvas/render) stays 1024 × 576** — untouched.
- The render layer applies **the original's own transform, derived in P4 and not guessed**:
  **`stage = (32 + 1.2·worldX, 1.2·worldY)`** — uniform ×1.2 with 32 px pillarbox bars.
  **Make this a pinned test, not a comment.**

**Why the split, and not simply "change the stage to 800×480":** 800×480 is **5:3**; our
stage is **16:9**. **There is no uniform transform between them.** A uniform ×1.2 yields
960×576 with 32 px pillarbox bars. So changing the stage would shift every x-fraction probe
and **break the 55/55 fidelity gate by construction** — and a gate re-fitted around a change
is a gate that has stopped testing anything. Keeping the stage fixed makes the gate
**invariant by construction**: it only ever sees rendered output.

This also closes our last open contradiction — **the render scale was never unknowable; it
is computed by the original itself** (P4). At ×1.2, source walk 96 → **115.2** (measured
112–126 ✓) and source run 288 → **345.6** (measured 341–349 ✓, dead centre). No fudge factor,
no hand-waving.

> **Veto:** keep one space at 1024×576 and convert every source constant by ×1.2 (plus the
> 32 px x-offset for *positions*, but not for *lengths* — two different rules).
> *Recommended against* — it makes every future source value a conversion with an
> easy-to-forget offset rule, and you will get one wrong.

### D2 — Reach becomes a formula — and mastery must drive damage too

```
base     = 120 + floor( (90 + 5 × danRank) × SPD / (20 + SPD) )
light    = base × 1.4
balanced = base × (1 + 0.02 × balancedMastery)
heavy    = max( base × (0.5 + 0.04 × heavyMastery), 100 )
```
⚠️ **The driving stat is SPD (Speed), not agility** — the first draft named it wrongly.
Confirmed twice: the getter reads the Speed stat index, and the source's own stat-point notes
say *"Speed does not touch damage — it sets blade LENGTH."* Our PLAYER-screen measurement
read **SPD 1**, so a fresh character is `base = 120 + floor(90/21) = 124` →
**light 173 · balanced 124 · heavy 100** (heavy hits its floor).

Reach is the **arc-length budget of the drawn stroke**, spent as the line is drawn — so a
curvy slash covers less ground than a straight one.

**Why:** our `300 / 200 / 100` is wrong in kind *and* provenance. `200` is the source's
*placeholder default*, overwritten on every stance change. `300` and `200` are also the SHS1
and SHS2 constants — **and those two disagree with each other by 50%**, which proves they
were never a studio invariant.

⚠️ **D2a — mastery must be ONE number, used everywhere.** `STANCE_TABLE.dmgMult`
(0.9 / 1.2 / 1.4) are the **mastery-9/10 ceilings**, while the reach formula at a fresh
character is **mastery 0**. Setting reach from mastery 0 while leaving damage at the ceiling
is **exactly the self-inconsistency the Session-11 adjudication reverted** (it reverted
"mastery-1 halved reaches" for precisely this reason). **Introduce one `PLAYER_MASTERY` and
derive BOTH:** damage `light 0.5+0.04m · balanced 1+0.02m · heavy 1.4`, reach as above.
Pick the mastery level deliberately, state it, and make both tables read from it.

> **Veto:** keep constants — but then compute them from the formula at a **single stated**
> (agility, dan, mastery) and label them derived, so the two tables stay consistent.

### D3 — Enemy HP derives from the player, never authored

```
Δ            = enemyLevel − playerLevel
effPlayerDmg = (playerMinDmg + playerDmgRange/2) − enemyDefense, floored by player level
enemyHP      = max( scaledBaseHP,  effPlayerDmg × K )      K = max(10 + Δ, 3)
enemyMinDmg  = max( scaledBase,    playerMaxHP  / D )      D = max(18 − Δ, 3)
xpReward     = enemyLevel × 5 + 45
if (enemyLevel <= 8) { enemyMinDmg = 1; enemyDefense = 1; }     // fires AFTER the HP derivation
```
K/D are the **named-duellist class's** pair (P1), which is what `DuelScene` renders.

**Why:** the original tunes fights in **hits**, not hit points, so a duel lasts the same
number of swings at level 3 or level 30. Our `hp: 100 / 150` are PvP-dummy seeds modelling
nothing. **Hits-to-kill becomes the tuning knob and HP becomes an output** — a far better
gate than any HP number.

**✅ DECIDED — both fighters go to LEVEL 9.** (This replaces an earlier "you choose" note.)

**Why 9 specifically:** it is the **lowest level that escapes the `≤ 8` override**. At our
current level 1 the enemy is forced to **1 damage and 1 defence**, which makes the duel
literally unlosable and turns the "0/24 no-play losses" harness assertion into a formality.
Nine is the smallest change that makes the fight a fight.

**Why BOTH at 9 (Δ = 0), not just the enemy:** Δ = 0 gives the original's own level-matched
duel — **K = 10, D = 18**: the player kills in 10 hits, the enemy kills the player in 18.
Levelling only the enemy would give Δ = 8 → K = 18 / D = 10, i.e. an enemy-favoured slog that
the good-play bot must win 24/24 anyway.

**Why a level-9 player with SPD 1 is coherent, not a fudge:** stat points are *optional* in
this game, and our own PLAYER-screen measurement caught a real high-level player sitting at
**ATK 1 · DEF 1 · SPD 1** — they had spent nothing. A level-9 character who never spent a
point is exactly what the original produces.

⚠️ **Knock-on you must land in the same commit:** the source's named-enemy XP is
`level × 5 + 45` → **90 XP** at level 9, not our **+10**. Our +10/+8 was an INFERRED seed
verified only against *our own* build's screenshots — it is not an OG measurement — so adopt
**90 XP** and **update the Stage-2 gate row** rather than leaving the row silently false.
**Coins have no source formula found — keep 8, still INFERRED.**

> **Veto:** keep level 1 and accept a 1-damage enemy, or keep +10 XP as a deliberate
> divergence. Either way, say so in DIVERGENCES — do not leave the gate row stale.

### D4 — One meter: Focus, in the original's exact units, with its display quirk

- `focusMax = 192` integer units · fills **+24 units/s** · kill bonus **+6**.
- **Display maps `(current − 48) / 144`** — the first 48 units are invisible.
- Spend per slash: light **24** · balanced **48** · heavy **72** (from `usage` floored at 48).
- A slash at a **full** bar zeroes it first, then the cost subtracts (a no-op).
- **Delete the standalone `CRITICAL_*` meter.** Focus *is* the crit meter.
- **Gating: per P3.**

**Why this exact shape and not a simplified equivalent:** the hidden first 48 units are the
reason our measured fill was **5.97 s** against a raw 8.000 s meter, *and* the reason small
spends produced **no visible drop**, *and* the reason "−20 % per slash" looked false in
footage. **One mechanism explains three anomalies.** Simplify it and you re-derive three
wrong constants.

⚠️ **Accumulator — the first draft got this wrong.** `floor(ticks × 2/5)` is a closed form
over *total* ticks; it is correct only for a meter that is never spent, and silently
overwrites every spend on the next tick. Use an **integer residual accumulator**:
```
acc += 2;  while (acc >= 5) { acc -= 5;  focus = min(192, focus + 1); }
```
Exact, spend-safe, no floats, still 24 units/s at 60 Hz. **Red-first test: fill, spend 48,
re-fill — the spend must persist.**

> **Veto:** keep a 0–100 meter and scale. You lose the exact 5.97 s match and the
> invisible-spend behaviour.

### D5 — Delete `COUNTER_BONUS`; implement the stance triangle

There is **no counter, parry or riposte mechanic in the original.** The forum's "~20 %" is
the **stance matchup**: attacker beats defender → **×1.2**; loses → **×0.9**; same → ×1.0.
Applied to physical damage **before** defence subtracts. Our triangle
(`light▸heavy▸balanced▸light`) is **confirmed correct** — keep it.

> **Veto:** keep `COUNTER_BONUS = 1.25` as a deliberate divergence and say so loudly.

### D6 — Damage: one pipeline, and only the part we can actually build

**Implemented this session, in this exact order:**
1. `raw = minDamage + rand × damageRange`
2. stance/mastery multiplier (D2a)
3. if Focus is full → `× 1.3 + flatCritBonus`
4. **stance triangle ×1.2 / ×0.9**
5. `− defence` (**subtract, never divide**; heavy defender ×0.8)
6. min-damage floor by **attacker** level: `≤10 → 1` · `≤20 → lvl/8` · `≤30 → lvl/6` · else `lvl/4`

**Explicitly NOT implemented, and why:** elemental resists (no elemental system exists) and
**body-part crit ×1.3** (needs limb hitboxes we do not have — §7). Body-part crit lands as a
**no-op hook positioned after the floor**, so the order-sensitive test can pin its *position*
now and the multiplier activates when hitboxes land.

`CRIT_MULT = 1.3` and `HEAVY_DEF_PENALTY` as `defence × 0.8` are **already correct in our
config** — confirm and re-label, don't change.

⚠️ **Do not implement the `×2` doubling** in the source — its flag is never set anywhere in
the payload. Dead code.

⚠️ **RNG scope.** `damageRange = weapon.maxdamage − weapon.mindamage`, and **we have no
weapon model**, so the range is currently **0** — a roll of width zero. Thread the injected
RNG through `physicalDamage` **only if** you also land the weapon min/max in A0.5; otherwise
implement the formula with `damageRange = 0`, take **no** rng parameter, and note that the
roll activates with the weapon model. **Do not pay for determinism re-proving to randomise
nothing.**

### D7 — AUTO SLASH: implement it properly; it is fully specified now

The toggle hands the player's fighter to the **enemy AI decision routine** and **locks out
manual input entirely** (no drawing, no move orders; HUD/skills still work). Decision every
**0.5 s**, never while slashing/airborne/stunned. Targets the **nearest living enemy by |Δx|,
unlimited range, no line-of-sight**. It **synthesises a stroke** (`reach/20` points, 20 px
apart) and feeds it through the *same* entry point a hand-drawn stroke uses. The generated
line is **drawn on screen**. Costs nothing extra.

**Why it matters beyond the feature:** it is the strongest available test that our slash
pipeline is correctly factored — if auto-slash can drive it, the player path and AI path
share one implementation, exactly as the original does.

> **Veto:** wire the plate to a genuinely disabled state and log the deferral. **The plate
> must never lie again.**

### D8 — Combo is cosmetic; enemies do not take turns; the melee gate shrinks

- Combo: **resets to 0**, and **only when the player takes damage**. **Not** on a kill. No
  damage/XP/coin bonus, no decay. ❌ our Stage-2 "resets to 1 on kill" CONTRACT is **wrong**
  and gets an explicit DIVERGENCES correction — not a quiet edit.
- **Remove `react()`** and every `AI_TIERS` react field. ⚠️ `reactMs` is *also* the AI's
  decision cadence (`decisionHoldUntil`), so replace it with an explicit
  `AI_THINK_INTERVAL_MS = 500` rather than deleting it outright.
- **Do not implement an attack token.** Enemies do **not** take turns — the appearance is
  **emergent** from independent 0.5 s timers plus the melee range gate.
- ⚠️ **The gate is half the mechanism and the first draft ignored it.** Source melee trigger
  is `|dx| < 50 && Δy < 50`. Ours is `AI_STRIKE_RANGE = 132` (~103 world px after D1) — still
  **2× too generous**, and we have **no vertical term at all**. Fix both, or the emergent
  behaviour will not emerge.

> **Veto:** keep `react()` as an explicit deviation. Do **not** keep an attack token — that
> would be inventing a mechanism to reproduce an effect that already emerges.

### D9 — In-combat stance switching costs 48 Focus

Free out of combat, **48 Focus in a duel**, gated on affording it. `FOCUS_SWITCH_COST = 34`
and the `WEAPON_WEIGHT` scalar that feeds it both go.

> **Veto:** keep it free and log it.

### D10 — The harness band is re-derived ONCE, up front, from the source model ⚠️

**The first draft said "preserve [20,60] s; needing to move it means the retune is wrong."
That is incoherent with D3 and the review caught it.** K hits-to-kill at the bot's ~0.8 s
swing cadence is arithmetically a **~8–20 s** fight. The band and the model cannot both stand.

**The resolution is not to soften the gate — it is to notice the band was never measured.**
`[20, 60]` came from the original kickoff *spec*, and the test header already flags its
"~24.7 s" reference as *"the reference bot's own number"*. It is a **guess we inherited**.
The source model is **evidence**. Replacing a spec guess with a source-derived value,
**decided in advance and recorded**, is not gate-softening; silently widening it after a
red run would be.

**✅ THE ARITHMETIC IS DONE — here it is, so B0 verifies it rather than inventing it.**

```
bot swing interval = 45 frames + uniform(0..11) jitter = 50.5 frames @60Hz = 0.842 s
K = 10 landing hits (level-matched named duel, D3)
closing swings before the first connect = 1..3   (the instrumented run shows swing 1 missing;
                                                  the dash closes the gap at ~127 px/swing)
⇒ 11..13 swings × 0.842 s  =  9.3 .. 10.9 s      ⇒  PREDICTED MEDIAN ≈ 10 s
```
Focus does **not** throttle this (P3: slashing is never focus-gated), so the swing rate is the
bot's cadence alone.

**⇒ `[20, 60]` fails by roughly 2×. The band becomes `[8, 25] s`.**

**How that band was derived — and why it is not gate-softening.** The spec band was
`[20, 60]` around its own reference of ~24.7 s, i.e. **`[0.81×, 2.43×]`** of the reference.
Applying **the same relative width** to the model-derived median of ~10.4 s gives
**`[8, 25]`**. The gate keeps *exactly the discriminating power it had* — same proportional
tolerance — and is merely re-centred on a number that comes from the game instead of from a
guess. **Computed before any code is written, from K and the bot's cadence, with the derivation
above pinned into the test header.**

**Single band rule, replacing the first draft's two contradictory ones:** `[8, 25]` **does not
move inside this session.** If the median lands outside it, the only two permitted diagnoses
are (a) the bot's stroke geometry (§3.3) and (b) a wrong K or cadence in the arithmetic above.
**If neither explains it, STOP and escalate** — do not widen the band, and do not "investigate"
your way to a wider one.

> **Veto:** keep `[20,60]` and tune the model until it fits. *Recommended against* — that is
> fitting the game to the test, and it would require roughly tripling enemy HP above what the
> original's own K produces.

---

## §2 THE SCOPE TRAP — carried forward, and now mostly dissolved

**Our `DuelScene` is a NAMED 1v1 duel, not an overworld trash fight** — white nameplate, VS
card, win/defeat screens. ⇒ **Do not apply one-hit kills to `DuelScene`.** One-hit kills
describe *overworld trash* (Stage 4+), where the data authors `<hp>1</hp>` outright.

**What the source changed:** the trap used to be about choosing which measured enemy to copy.
Under **D3 it dissolves** — you do not copy an enemy's HP at all. You take the hits-to-kill
budget K from the class P1 identifies, and HP follows.

---

## §3 THE HARNESS — what it really does (first draft got this WRONG)

1. **`[20, 60] s` is a spec guess, not a measurement.** See **D10**. It is re-derived once in B0.
2. ⚠️ **THE BOT DOES MOVE.** The first draft claimed "the bot never moves, so movement
   changes cannot affect the harness." **That is false.** The bot never issues *move orders*,
   but **`Sim.applyStroke` dashes the player `DASH_SLASH_PX` (127) along the attack line on
   every qualifying slash, arena-clamped** — and that dash is the **only** reason the bot ever
   closes the 440 px spawn gap.

   An instrumented run makes it concrete: the player marches **260 → 387 → 514 → 641 → 768 →
   895 → 998** across six swings, and **the first swing misses entirely** — at x=260 the enemy
   hitbox (674–726) is geometrically unreachable. The duel is won by dashing into range.

   ⇒ **Movement, dash, reach and spawn changes all move the harness. A1 is NOT isolated, and
   A0 is not either** — rescaling `DASH_SLASH_PX` and the spawns changes how many swings are
   needed. §4's phasing and A0's gate reflect this.
3. **The bot's stroke is centred on the ENEMY, not anchored at the player:**
   `DrawnStroke([{x: e.x−140, y: e.y}, {x: e.x+140, y: e.y}])`. Real strokes are anchored near
   the player. All three numbers are 1024-space; under D1 they convert as
   `(x − 32)/1.2` → spawns **190 / 557** (gap **367**) and half-stroke **116.7**.
   ⚠️ **The first draft also gave a closed-form hit condition (`enemy.x − player.x ≤ 140 +
   reach`). It is wrong — it has no absolute value and does not model the dash, and it
   predicts "never connects" for a harness that is green today.** The real gate in
   `resolveSlash` is **per-segment**: the segment crossing the enemy polygon must have an
   endpoint within `reach` of the player's **post-dash** position.
   **Diagnostic instead of algebra:** print `player.x`, `enemy.x` and `hit` per swing — five
   lines, and it shows the actual failure (including the player *over-shooting past* the
   enemy, which the instrumented run confirmed happens). The fix is a realistic
   player-anchored bot stroke — **not** a wider band and **not** inflated reach.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code, then green.**
Chaos-plant every new guard.

⚠️ **Two ratchets will go RED on almost every step and that is expected:**
`tests/config-values.test.ts` (double-entry pins — update in the same commit) and
`tests/game-purity-baseline.json` (refresh deliberately with
`UPDATE_GAME_PURITY_BASELINE=1` and **review the diff as the audit surface**).

### PHASE 0 — plumbing (each lands green, alone)

**No research step — §P is already resolved.** Start at A0.

**A0 — World/stage split (D1).** Introduce `WORLD_WIDTH/WORLD_HEIGHT = 800/480` alongside the
existing stage constants; add the render transform **`stage = (32 + 1.2·worldX, 1.2·worldY)`**
(P4) **as a pinned test**. Convert every px-dimensioned gameplay constant into world space
via `(x − 32)/1.2` for x-positions and `/1.2` for lengths and y.
⚠️ **A0 MOVES THE HARNESS** (§3.2) — it rescales `DASH_SLASH_PX` and the spawns, which changes
how many swings the bot needs. **So A0 cannot claim "band unchanged". Either run B0's paper
prediction before A0, or accept that A0 lands together with Phase B.** Decide which and say so.
⚠️ **Mechanical rule, because a prose list will be under-applied:** *every exported numeric in
`src/config` that is dimensioned in px or px/time is either rescaled or explicitly annotated
`// world-space native` in the same commit.* That includes `PLAYER_MOVE_SPEED`,
`SMOKE_BOMB_DISTANCE`, `DEFLECT_RADIUS`, `PROJECTILE_*`, `JUMP_APEX_PX`, `DASH_*`,
`AI_STRIKE_RANGE`, the gesture thresholds, and `DUEL_SPAWNS`.
**Gate: re-run the browser fidelity gate immediately — it must still be 55/55.**

**A0.5 — The stats the formulas need.** None of D2/D3/D6's inputs exist in our config.
Create `src/config/stats.ts`: `agility`, `danRank`, `masteryL/B/H` (cap 10), `level`, attack
stat (+3 damage/point), and weapon min/max damage — for **both** fighters — plus
`src/config/reach.ts` naming every reach literal (`120, 90, 5, 20, 1.4, 0.02, 0.5, 0.04, 100`)
so `core/` stays literal-free. **Nothing consumes them yet; this lands green and alone.**

**A2 — Combo correction (D8).** Cosmetic; reset to 0 on damage only. Delete
`COMBO_CHAIN_GAP_S`. **Correct the Stage-2 CONTRACT explicitly in DIVERGENCES.**

**A3 — AUTO SLASH (D7).** Additive and isolated.

### PHASE B — the coupled core (B0 first; B1–B5 land as ONE change)

Focus, damage, reach, dash and the enemy model **all** move time-to-kill, and per §3.2 so
does movement. Landing them piecemeal leaves the harness RED between steps — and the
pre-commit hook runs tests, so **red steps cannot be committed**.

**B0 — Pin the band (D10).** The arithmetic is already done: predicted median **≈10 s**, band
**`[8, 25]`**. Copy D10's derivation block into the harness test header, replace the `[20,60]`
asserts, and write the DIVERGENCES entry **before** any other B-code. Re-check the two inputs
(K = 10, interval = 0.842 s) against the code as it actually stands — if either differs,
recompute the band from the same `[0.81×, 2.43×]` rule and say so.

**B1 — Movement + Focus.** Walk **96**, run **288** world px/s. Gait by destination type
first; distance threshold **exactly 100 world px** for plain ground moves only. **Deadzone
25 px**, **`standingRange` 50 px**, **no acceleration**, arrival **snaps** when gap ≤ speed,
latch target+gait at command time, **no click-marker FX**. Focus per D4 with the residual
accumulator; delete `CRITICAL_*` and every `criticalUnits` reference.

**B2 — Damage pipeline (D5, D6).** Exact order, implemented subset only. Delete
`COUNTER_BONUS`; add the triangle. RNG only per D6's scope note.

**B3 — Reach as a budget, and the dash (D2).** ⚠️ **The first draft asserted two mutually
exclusive things.** Our `withinReach` is a **Euclidean radius** test from the attacker; the
source has **no radius anywhere** — the budget is spent along the drawn arc. Keeping both
double-counts reach against two different quantities.
**Correct design:** spend the budget at **stroke-construction** time — `DrawnStroke` truncates
its own polyline to `reach` arc-length — then `resolveSlash` does a **plain crosses-hitbox
test on the already-truncated polyline**, with `attacker.pos`/`reach` parameters **removed**.
Resample spacing becomes **20 px** (source), replacing our 8.
**And the dash moves here, not to §7:** the samurai travels to the stroke's **last point,
uncapped**, at **50/40/30 world px/frame** by stance. **Delete `DASH_SLASH_PX` and
`DASH_MIN_STROKE_PX`** — a fixed 127 px pass-through is not what the original does, and per
§3.2 it is the harness's entire closing mechanism, so it cannot be left stale.

**B4 — Enemy model (D3) + AI (D8).** Both fighters to **level 9** (Δ=0 → **K=10, D=18**);
derive enemy HP as `effPlayerDmg × 10` and enemy min-damage as `playerMaxHP / 18`; XP reward
becomes **90** (`level×5+45`) and the Stage-2 gate row updates with it. The `level ≤ 8`
override no longer fires — **keep it implemented anyway**, it governs every Stage-4 mob.
Think interval **0.5 s** via `AI_THINK_INTERVAL_MS`. Remove `react()` and its fields.
**No attack token.** **Melee gate → `|dx| < 50 && Δy < 50` world px.** Telegraph **600 ms**
closing / **267 ms** point-blank — the single global `≥520` is wrong.

**B5 — Harness against B0's band.** Keep the assertion *shapes* verbatim: 24/24 good-play
wins · 0/24 no-play · median in band · ≥22 distinct durations. Band per B0. **If the median
misses, apply §3.3 then STOP and escalate (D10).**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Both fighters at **level 9**; XP reward **90** (`level×5+45`); Stage-2 gate row updated, not left stale | red-first + gate-row diff |
| 2 | WORLD 800×480 exists; STAGE stays 1024×576; every px config rescaled or annotated | grep: no unannotated px literal in `src/config` |
| 3 | **Fidelity gate still 55/55 in-browser** after A0 | `await __fidelity.run()` |
| 4 | Reach computed from the formula; `STANCE_TABLE.reach` gone | pins at the stated (agility, dan, mastery); a 133 for Balanced means the mastery off-by-one is back |
| 5 | **Mastery is ONE value driving BOTH reach and dmgMult** | a mastery change must move both, or RED |
| 6 | Reach spent at stroke-construction; `resolveSlash` has **no** radius/origin params | `withinReach` deleted; planted radius test goes RED |
| 7 | Dash goes to the stroke's last point, uncapped, per-stance speed; `DASH_SLASH_PX` deleted | red-first |
| 8 | Enemy HP = `effPlayerDmg × K` with **K=10**, enemy min-dmg = `playerMaxHP / 18`; `level ≤ 8` override implemented (dormant at level 9) | chaos-proven: force level 8 → damage and defence must drop to 1 |
| 9 | Focus 192 units, `(x−48)/144` display, **residual accumulator survives a spend** | fill → spend 48 → re-fill, red-first |
| 10 | `COUNTER_BONUS` deleted; triangle ×1.2/×0.9 pre-defence | per-matchup red-first |
| 11 | Damage pipeline steps 1–6 order-pinned; body-part crit present as a **positioned no-op** | reordering must go RED |
| 12 | AUTO SLASH drives movement + slashes through the **same** pipeline | synthesized stroke enters `applyStroke` |
| 13 | `react()` and every react field deleted; **no attack token**; think timer fires every 0.5 s independent of player state; melee gate 50 world px both axes | a planted block/dodge must change nothing |
| 14 | Combo cosmetic, resets to 0 on damage only; old "reset to 1 on kill" pin **deleted with a DIVERGENCES entry** | red-first |
| 15 | Harness: 24/24 · 0/24 · median in **`[8, 25]` s** · ≥22 distinct | D10's derivation pinned in the test header |
| 16 | Suite · tsc ×2 · eslint green; **every new guard chaos-planted**; both ratchets refreshed with reviewed diffs | pasted output |
| 17 | Ledgers + DIVERGENCES + RESUME_HERE + next kickoff in the closing commit | `git show --stat` |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the fidelity gate.** D1's world/stage split is designed to make the gate
**invariant by construction**. Verify that early: do A0, immediately re-run
`await __fidelity.run()`. **If it breaks, the transform is wrong — fix the transform, never
re-fit the gate.** This project has already reverted one gate-weakening.

**Risk 2 — the harness, and it is the bigger one.** The likeliest failure of this session is
the median landing outside the band, followed by someone "investigating" their way to a wider
band. **D10 exists to make that impossible:** the band is derived from the model *before* any
code, and once set it does not move. **A red harness at B5 means the model is wrong or the
bot's stroke geometry is unrealistic — those are the only two permitted diagnoses.**

---

## §7 QUEUED — deliberately NOT in this session

- **Portrait ring must be stance-coloured** (our hardcoded red rests on a refuted reading).
- **"150 % DAMAGE" is a timed buff**, not a Heavy property.
- Body-part crit ×1.3 — the **hook** lands in B2; the multiplier needs limb hitboxes.
- The dash's **wind-up first leg** (to the stroke's *first* point). The strike leg lands in B3.
- Stagger hyperarmor (3 hits, 5 in light stance).
- Elemental resists (no elemental system exists).
- Mastery progression as a spendable skill (triangular cost `N(N−1)/2`).
- Multi-enemy combat — `Sim` is hard-wired 1v1, so emergent turn-taking cannot be *observed*
  this session, only its preconditions asserted.
- The recovered **982-item / 75-skill / 61-quest** tables — Stage-4 campaign fuel.

---

## §8 BAR SELF-REPORT

**The first draft did not reach the bar.** Four adversarial review lenses raised **34
CRITICAL/MAJOR findings**, including five material errors:

1. a false claim that the harness bot **cannot move** — it dashes 127 px per slash, and that
   dash is the *only* reason it ever reaches the enemy (an instrumented run proved it: the
   first swing always misses);
2. a **unit-mixing "proof"** equating stage-px measurements with world-px formula outputs —
   the project's own documented failure mode, the same shape as the voided 3.0× crit;
3. a world-space change that would have **broken the 55/55 fidelity gate by construction**
   (5:3 into 16:9 admits no uniform transform);
4. a Focus accumulator that was a closed form over total ticks, **silently discarding every
   spend**;
5. **the wrong render scale** (a guessed 1.28/1.20 stretch) and **the wrong stat driving
   reach** (agility, not SPD).

**Two of those were then improved beyond the fix.** The render transform is not a judgement
call at all — the original **computes it itself**, and reading its resize routine gives
`stage = (32 + 1.2·world, 1.2·world)` exactly, which fits the measured run speed dead centre
(345.6 vs 341–349) where the guess needed an excuse the measurements refute. That turned P4
from a task into a citation. And the corrected units revealed that **no single stat value
reconciles all three measured reach readings** — so measured reach was dropped as a validation
source entirely rather than being quietly reconciled.

**This version folds all of them in**, converts the remaining unresolvable assumptions into
explicit **prerequisite steps (P1–P3)**, replaces the incoherent "preserve the band"
instruction with a **derive-once-up-front rule plus a hard escalation stop**, and states its
scope honestly — what is implemented, what is a positioned no-op, what is deferred and why.

**A third pass then removed every remaining open question.** The four "prerequisites" and the
two decisions the plan had handed back to the owner were all closed from source:

- **P1** — the enemy class named and its real pair read verbatim (**K = max(10+Δ,3),
  D = max(18−Δ,3)**); `SOURCE_CONSTANTS.md` §3.8 had quoted the **wrong class** and is corrected.
- **P2** — the `level ≤ 8` override read verbatim, including that it fires *after* the HP
  derivation.
- **P3** — slashing is **not** Focus-gated (only stance switching is), so Focus is a
  crit-charge resource, never a stamina gate.
- **P5 (new)** — the parameter map proves the D-numerator is **player max HP**, which means
  the original's duel design is **exactly symmetric: K hits to kill, D hits to be killed.
  Both sides tuned in hits, neither in hit points.** That is the cleanest one-line statement
  of the combat model we have, and it was not previously known.
- **D3** — decided: **both fighters to level 9** (lowest level escaping the override; Δ=0 →
  K=10/D=18), with the XP knock-on (**90**, from `level×5+45`) landed rather than left stale.
- **D10** — decided: the arithmetic is **done, not deferred** — predicted median **≈10 s**,
  so `[20,60]` fails by 2×, and the band becomes **`[8, 25]`**, derived by preserving the spec
  band's own `[0.81×, 2.43×]` relative width around a model-derived centre.

**Verdict: it reaches the bar.** Every number traces to source or to arithmetic shown in the
document; every decision is made rather than deferred; the three claims that most wanted to be
assumed (the render transform, the harness's isolation, the band) are each backed by something
actually read or run; and the corrections to *this project's own prior documents* are landed in
the same commit rather than noted.

**What it deliberately does not promise:** that nothing new appears at B5. That is why §6 names
the harness as the likeliest failure and gives it a **stop-and-escalate rule instead of an
escape hatch** — a plan that promised otherwise would be the exact failure mode this project
has already reverted once.
