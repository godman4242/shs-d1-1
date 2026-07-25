# SESSION 12 KICKOFF — THE COHERENT COMBAT RETUNE

> # 🔴 SUPERSEDED 2026-07-25 — DO NOT PLAN WORK FROM THIS FILE
> **Use `docs/sessions/SESSION13_KICKOFF.md`.** It is self-contained and carries
> forward everything here that is still valid (the scope trap, the harness trap).
>
> **Why this file was replaced rather than edited:** it was written *before* the
> source dive, and its whole method — fit constants to footage — was superseded by
> having the original's own formulas. Four of its rows are now known to be wrong,
> not merely uncertain. It is kept because its §2 audit is the honest record of what
> we knew before the source, and that before/after is what makes the dive's value
> legible. **Read it as history, never as instructions.**

> **Entry route:** `RESUME_HERE.md` → this file.
> **Read before touching code:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md`
> — start with **§00 (the sampling floor)** and **§00b (corrections)**, because a
> second pass overturned four rows of the first. Then the two **Session 11**
> blocks in `docs/DIVERGENCES.md`. Raw agent returns, with their own caveats and
> self-flagged weak rows, are in `docs/research/fidelity/session11-raw/`.
>
> **Session 11 verdict: ⚠️ PARTIAL — study pass CLOSED (gate 1 + 2 GREEN),
> build steps deliberately NOT started.** §1 says why. §2 is the completeness
> audit: exactly where this plan stands on measurement vs inference.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names (art
> tracing is permitted per the owner ruling) · **Duels-not-SHS** ·
> single-player-first · `core/` zero numeric literals, zero `Math.random` ·
> render-only scenes · **red-first TDD** · chaos-plant every guard · **binary
> gates, never softened to fit a change**.

---

> ⚠️ **RUN `SOURCE_DIVE_KICKOFF.md` BEFORE THIS FILE.** A lead found 2026-07-25:
> the archived client SWFs are on disk, the SHS1/SHS2 predecessors are already
> plain and parseable, and the Duels payload is wrapped by a small "tinyloader"
> stub that may be crackable. If it works, roughly a dozen values in §2's
> *inferred* table become **exact source constants** — including three this
> footage can never answer — and you would otherwise tune to estimates and then
> re-tune. If it fails, **this plan stands exactly as written.**

## START HERE — the first three things to do

1. **Read §3 (the scope trap).** One paragraph. It is the single easiest way to
   wreck this retune, and the ledger reads as if it *wants* you to fall in.
2. **Read §00b of `COMBAT_MEASUREMENTS.md`.** Four rows of that ledger were
   overturned by a later pass. If you build from the un-corrected rows you will
   implement an evasion meter that does not exist.
3. **Pick ONE of Step 1 or the Step 2–4 cluster.** Step 1 (movement) is provably
   isolated from the harness (§4.2) and can land alone. Steps 2–4 must land
   together. Do not interleave them.

**The three numbers you will reach for most:** named enemy **~44 HP / 3 hits**
(HONDA SHIZUKA, the closest analogue to our duel) · Focus **5.97 s** empty→full ·
walk/run **112–126 / 341–349** stage px/s.

**The one sentence that matters most:** *damage follows the drawn line, the body
runs to it, and in combat there is no separate move command at all.*

---

## §1 Why nothing was built yet — and the two places that reasoning was WRONG

The honest version, because the first draft of this file overstated it and a
later audit caught it.

**The claim was:** one-hit kills, the deleted Critical meter, two gaits and the
reach values *all* cascade into the 24-seed harness gate, so they must land together.

**Two of those four are false**, verified by reading `tests/utils/duel-bot.ts`:

| change | affects the harness? | why |
|---|---|---|
| one-hit kills | ❌ **NO** | the harness duels a **named** enemy (§3); one-hit kills apply only to unnamed trash |
| two gaits / movement | ❌ **NO** | **the bot never calls `setPlayerIntent`** — it only slashes and jumps. It never moves. |
| Focus/crit rework | ✅ yes | changes damage cadence → duel length |
| reach values | ✅ yes | decides whether the bot's stroke connects at all (§4) |

**The coherence argument is narrower than first stated but still holds** for the
damage / meter / reach cluster: those move duel duration *together*, and tuning
them one at a time invites re-fitting the gate around each — the exact failure the
Session-11 adjudication reverted (a foreign session weakened the band from
`[20,60] s` to `[3,15] s` to make its own change pass).

**The band is not yours to move.** See §4.

---

## §2 COMPLETENESS AUDIT — measured / inferred / never-knowable

> ## 🔴 SUPERSEDED IN PART (2026-07-25) — READ `SOURCE_CONSTANTS.md` §6 FIRST
>
> **The source dive SUCCEEDED.** The payload is decrypted and decompiled, and the
> build is confirmed **v0.717 — the same build this footage measured.** The
> "⚠️ Inferred / unresolved / never-knowable" table below is **out of date**:
> the two rows marked UNRESOLVABLE (**AUTO SLASH ON**, **`ENEMY_BASE.defense`**)
> are both **answered from source**, `CRIT_MULT` and `HEAVY_DEF_PENALTY` are
> **confirmed exactly as we had them**, and the gait threshold is **exactly 100**.
>
> **Four rows below are now known to be WRONG, not merely inferred** — do not build
> from them:
> - **`COUNTER_BONUS`** — the counter mechanic **does not exist**; the forum's
>   "~20 %" is the stance triangle (×1.2 / ×0.9).
> - **reach `300 / 200 / 100`** — reach is a **stat-driven formula**, not a
>   per-stance constant; the `200` traces to a **placeholder default** and
>   `300`/`200` are also the SHS1/SHS2 constants (likely lineage contamination).
> - **`DASH_SLASH_PX`** — not a constant at all; the dash runs to the stroke's
>   endpoint, uncapped, in **two legs**.
> - **combo "resets to 1 on kill"** (our Stage-2 CONTRACT) — it resets to **0**,
>   and **only when the player takes damage**; it does not reset on a kill.
>
> Everything measured in §00c still stands — the source **confirmed** every
> primary anchor, including JINBEI's 132 HP falling out of the formula exactly.
> `SOURCE_CONSTANTS.md` §5 carries the full cross-check and every contradiction.

**This table is the point of the session.** It tells you where you stand on solid
measurement and where you stand on inference, so nothing gets presented as
"measured" that isn't.

### ✅ Measured — use with confidence

| value | measured | source |
|---|---|---|
| player pools | L1 **HP 10 / Chi 10**; L2 **Chi 10 / AP 30**; L5 **HP 20 / Chi 20**; L10 **HP 30 / Chi 47** | §0b, §00c |
| early player stats | **ATK 1 · DEF 1 (+2) · SPD 1**, weight 14/100 | PLAYER screen A t≈152, full-res |
| **named enemy HP** | **JINBEI (4) = 132** · **HONDA SHIZUKA (7) ≈ 44** | §00c, per-hit ledgers |
| **hits-to-kill, named** | **3** for both (JINBEI 42+48+42 = 132 exactly) | §00c |
| hits-to-kill, unnamed mobs | **1** (>15 events, 3 encounters) | e-2 |
| **damage is a ROLL** | 36/10/30/27/42/48/42 on ONE target, ONE level, ONE stance, ONE weapon | §00c gap C |
| damage TAKEN | mobs **1**; JINBEI **2**; HONDA **4/6/2** | e-4, §00c |
| WALK / RUN speed | **112–126** / **341–349** stage px/s (peak 440) — 3 agents | §00c |
| **gait selection** | **destination-type first** (exit ⇒ walk, hostile ⇒ run); distance threshold only for plain ground, **(105.2, 130.8]** stage px | §00c gap E |
| **Focus trigger** | **holding the slash input** — charge leads the visible stroke by up to 1.2 s | §00c gap F |
| Focus fill | **5.97 s** empty→full, linear, 45.05 ± 0.30 px/s | §00c gap F |
| **Focus payoff** | full bar prints **"CRITICAL HIT"** in the bar | §00c (corrects f-8/f-10) |
| **combat movement** | **no separate move command** — every leg is approach-run + dash along one stroke | §00c gap G |
| meters that exist | **HP, Chi, Focus. No fourth meter.** | f-8 |
| reach Light / Heavy | **300** (max 303) / **100** (plateau 97–103) | c-2 |
| stance switch | portrait click, **free**, cycle L→B→H, locked in combat | c-4 |
| counter triangle | light▸heavy▸balanced▸light | **DEV-TEXT** D-3 |
| **enemy AI** | walk **128** stage px/s · lunge **484** · cadence median **0.733 s** · telegraph **600 ms** approach / **267 ms** point-blank · **no blocking** · **enemies take turns** · attack is a **dash-through** | §00c gap H |

### ⚠️ Inferred, unresolved, or permanently unknowable — never call these measured

| value | status | what to do |
|---|---|---|
| `ENEMY_BASE.defense` | **UNRESOLVABLE** — the OG has no enemy stat screen | keep INFERRED, label it |
| `COUNTER_BONUS = 1.25` | **NEVER MEASURED** (forum says ~20 %) | leave, retag INFERRED |
| `HEAVY_DEF_PENALTY = 0.2` | wiki only | leave, retag INFERRED |
| `dmgMult` 0.9 / 1.2 / 1.4 | wiki only | leave, retag INFERRED |
| `STANCE_TABLE.speed` | **no usable measurement** (c-5 cadence unusable) | leave unread |
| reach **Balanced 200** | measured **131**, level-1 footage only | keep 200, retag INFERRED/unverified |
| `CRIT_MULT` magnitude | Focus reached full only **twice in 65.8 min**, and no crit-vs-normal popup pair was captured | leave **1.3 INFERRED**. The crit *mechanism* is now measured; its *multiplier* is not. |
| Focus **cost** per slash | **not a general rule** — 19 drops in 111 cycles, size varies between fights | do NOT hard-code −20 % |
| `DASH_SLASH_PX = 127` | **CONTESTED** (video B snap vs video A multi-tick run) | leave unchanged |
| `SLASH_FRAMES` 12/16/20 | **CONTESTED** (new pass found Heavy *faster* than Light, self-flagged unusable) | leave unchanged |
| hitbox half-width | **NOT-FOUND** — upper bound 40.3 stage px, no tighter than ~4 px | see §6 for how to measure it properly |
| AUTO SLASH ON behaviour | **UNRESOLVABLE from footage** — the plate reads OFF in every frame of both videos | implement from DEV-TEXT or disable honestly |
| player damage vs level | **NOT a function of level** — an L10 player dealt *less* than an L5 player | never scale damage from level alone |

**Bottom line: this retune is measurement-led, not measurement-complete.** About a
dozen values stay INFERRED. That is the project's normal state — but the commit
message and DIVERGENCES must not imply otherwise.

---

## §3 ⚠️ THE SCOPE TRAP — read before applying "mobs die in one hit"

**Our `DuelScene` is a NAMED 1v1 duel, not an overworld trash fight.**

- `config/duel.ts`: `DUEL_ENEMY = { name: 'RONIN', level: 1 }`.
- `DuelScene` renders the nameplate **white**, and its own comment records the
  distinction: *"VS-duel opponents read WHITE (B-23); red labels are wild-mob
  aggro tags (A-28)."*
- It runs a **VS card**, nameplate, and win/defeat screens — the OG's named-duel flow.

And the measurement is explicit: **partial HP bars belong ONLY to named
characters**; unnamed mobs die in one hit and are never seen at a partial bar.

⇒ **Applying one-hit kills to `DuelScene` would misread the ledger**, make the duel
trivial and destroy the harness. One-hit kills describe *overworld trash* (Stage 4+).

**Use HONDA SHIZUKA (7) as the model.** She is the closest analogue we have:
challenge → VS card → FIGHT! → YOU WIN → reward card. **~44 HP, 3 hits to kill,
7.4 s**, against an L10 player with **HP 30 / Chi 47** who took **4/6/2** per hit.
JINBEI (4) is the fuller ledger (132 HP, 3 hits, 3.2 s, 7 damage samples) if you
want the wider damage distribution.

**Decide-and-flag:** our duel enemy is level **1**, for which no named-duel footage
exists. Prefer **re-levelling `DUEL_ENEMY` to a level we actually measured** over
extrapolating downward. Veto = keep level 1 and mark the derived stats INFERRED.
⚠️ If you re-level, check the Victory rewards — `DUEL_ENEMY.level = 1` is what
makes the Stage-2 gate's exact **+10 XP / +8 coins** read true.

---

## §4 THE HARNESS — what it really does, and the trap inside it

Before touching `tests/harness.test.ts`, know these three facts:

1. **`[20, 60] s` is a BOSS/PvP band, not a trash band.** The test header says so,
   and the Stage-2 landmine records *"PvE trash resolves 3–10 s — {20,60} is a
   boss/PvP number."* Our duel **is** boss/PvP class (§3), so the band is already
   right. **Preserve it. Needing to move it means the retune is wrong, not the gate.**
2. **The bot never moves.** It calls `applyStroke` and jumps; it never calls
   `setPlayerIntent`. Movement changes cannot affect harness durations.
3. **The bot's stroke is centred on the ENEMY, not anchored at the player:**
   `DrawnStroke([{x: e.x−140, y: e.y}, {x: e.x+140, y: e.y}])`.

   Real strokes are anchored **near the player** — that is how reach was measured
   (near end within 30 px of the body). So the bot's geometry is **unrealistic**,
   and the reach gate interacts with it arithmetically:

   > the bot connects only when **`enemy.x − player.x ≤ 140 + reach`**

   Spawns are player **x=260**, enemy **x=700** (gap 440); the player never moves,
   so the enemy must close to `260 + 140 + reach`:
   - reach **200** → enemy must reach **x ≤ 600** (closes 100 px)
   - reach **131** → enemy must reach **x ≤ 531** (closes 169 px)

   **If the harness fails after a reach change, check this inequality FIRST.** The
   fix is to give the bot a realistic player-anchored stroke — **not** to widen the
   band and **not** to inflate reach.

---

## §5 Ordered build sequence

Each step: **write the failing test names FIRST, watch them go red, then code, then
green.** Chaos-plant every new guard.

### Step 1 — Movement: latch the command, add two gaits
Touch `PlayerIntent`, the player-movement block inside `Sim.advance` (the
`playerIntent.moveTargetX` branch), and the intent assembly in `DuelScene.update`.

- **Latch target + gait at command time.** The Sim currently re-reads
  `moveTargetX` from the live cursor **every tick**. Hold-to-run-toward-the-current-
  cursor is now **falsified in combat** (the 2.7× speed change at the stroke's near
  endpoint); the **latch-on-mousedown** variant survives. Latching is correct under
  every surviving model.
- **Two speeds**, replacing the single `PLAYER_MOVE_SPEED = 0.28`: **WALK 112–126**
  and **RUN 341–349** stage px/s (peak 440). Pick a statistic and say which.
- **Gait is chosen by DESTINATION TYPE first** — exit/transition ⇒ walk at any
  distance; hostile ⇒ run at any distance; a distance threshold **(105.2, 130.8]
  stage px** applies only to plain ground moves.
- **No acceleration ramp** — full speed on tick 1.
- **Arrival:** out of combat it **decelerates** into the target; the in-combat
  approach-run does not. Do not use one rule for both.
- **Do NOT add a click-marker FX** — measured absent everywhere.
- ✅ Cannot affect the harness (§4.2) — land it independently if you prefer.

### Step 2 — Damage / HP / TTK (the named-duel model)
Touch `config/combat-sim.ts` (`PLAYER_BASE`, `ENEMY_BASE`), `core/damage.ts`.

- Read **§3 first.** Tune the duel to **named-enemy** numbers (HONDA ≈44 HP / 3 hits,
  or JINBEI 132 / 3). Our `hp: 100 / 150` are PvP-dummy seeds and are simply wrong.
- **Damage is a min/max ROLL, not a fixed value** (gap C). Faithful modelling means
  `physicalDamage` takes the **injected RNG** — which touches determinism and the
  24-seed fingerprint. **If you adopt the roll, re-prove cross-process determinism**
  (the existing test plants `Math.random` and expects RED — keep that guard honest).
  Veto = keep damage deterministic and log the divergence.
- **Never scale damage from level** — an L10 player dealt *less* than an L5 player.
- Leave `damageTakenMult` dead and documented; only the −20 % Heavy defence applies.
- **Gate:** hits-to-kill on the modelled enemy == the measured count exactly.

### Step 3 — ⚠️ Focus IS the crit meter (this REVERSES the earlier instruction)
Touch `core/critical.ts`, every `criticalUnits` reference in `Sim` (the
`FighterState` field, its spawn init, the `FighterView` projection, `applyStroke`,
`executeStrike`, the per-tick accrual), `config/combat.ts`, and the pins in
`tests/config-values.test.ts` + `tests/Sim.test.ts`.

- **The first pass got this wrong and §00b corrects it.** Focus is **not** an
  evasion meter — when it fills, the HUD prints **"CRITICAL HIT"**. The forum was
  right all along. *Critical Evade* is a **separate Balanced-stance passive** that
  also keys off a full bar.
- ⇒ **Do not delete crit. Delete the *standalone Critical meter* and gate crit on
  Focus instead.** One meter, two consumers (crit + the Balanced evade passive).
- **Charge trigger: holding the slash input** — measured to lead the visible stroke
  by up to 1.2 s with the player motionless and nothing drawn. It does **not**
  charge while idle (94 % of frames read zero) and does **not** pause while drawing.
- **Fill: 5.97 s** empty→full, linear.
- ⚠️ **Do NOT hard-code a −20 % per-hit cost.** Only 19 drops in 111 cycles, and the
  size differs between fights. Model the charge and the full-bar payoff; leave the
  spend rule INFERRED and say so.
- `CRIT_MULT` stays **1.3 INFERRED** — the mechanism is measured, the magnitude is not.
- **Stance switch costs nothing** (c-4) — `FOCUS_SWITCH_COST` has no measured basis.
  Knock-on: `WEAPON_WEIGHT` exists only to scale that cost and becomes unused.
  Decide whether to delete it, and say which.
- Chi is a **skill resource only** — it never moved in any sampled fight. Known
  costs: Slash Wave 10, Dash Left 2.

### Step 4 — Reach values
Touch `config/stances.ts`.

- **Light 300 ✅ and Heavy 100 ✅ CONFIRMED** — promote provenance from wiki-carried
  to MEASURED, citing c-2.
- **Balanced 200 ❌ NOT confirmed** (measured 131, level-1 footage only) — **keep
  200**, retag INFERRED/unverified, veto line in DIVERGENCES.
- **Do NOT change the hit-test structure.** `resolveSlash`'s *crosses-hitbox AND
  within-reach* gate already produces the measured direction-sensitivity a bare
  radius cannot (c-3). The Session-11 per-segment gate **stands**.
- Re-read **§4.3** before running the harness.

### Step 5 — Enemy AI corrections
Touch `config/ai.ts`, `core/AISeamController`.

- **The single global `telegraphMs ≥ 520` is wrong.** Two cases measured:
  **600 ms** when the enemy must close distance (confirms our assertion) and
  **267 ms** for an in-place follow-up on an adjacent/downed target.
- **Enemies never block, parry or dodge** — zero in ~70 s across ~30 enemies. Our
  `react()` models behaviour the OG does not have. Remove it or flag it loudly as
  a deliberate deviation.
- **Enemies take turns** — 1 attacker at a time (occasionally 2), even with 8 on
  screen. Implement an attack token; the rest idle.
- **The enemy attack is a dash-THROUGH**, the same mechanic as the player: commit
  at **194 stage px**, damage resolves at the END of the dash when the enemy is
  **96 stage px past** the player. A radius-based range check cannot reproduce it.
- Speeds: walk **128** stage px/s (mean 16–18 px/tick, **not** the 22 px peak),
  lunge **484** stage px/s. Cadence median **0.733 s**.
- **No enemy telegraph FX** — pose change only. Do not give enemies a drawn line.

### Step 6 — Harness: preserve the band
`tests/harness.test.ts`. Only after 2–5 are green.

Keep all four assertions **verbatim**: 24/24 good-play wins · 0/24 no-play · median
∈ **[20,60] s** · ≥22 distinct durations. If the median leaves the band, **fix the
model or the bot's stroke geometry (§4.3) — not the band.** If after genuine
investigation it truly must move, state the derivation in the test header and
record it in DIVERGENCES as a deviation, not a tidy-up.

### Step 7 — AUTO SLASH, honestly
The `autoSlash` plate in `DuelScene`'s HUD builder.

Developer text settles the *behaviour*: **ON = the game drives both movement and
basic slashes** — *"TRY TURNING AUTOSLASH ON. YOUR BODY WILL MOVE WITH MUSCLE
MEMORY WHILE YOU CAN FOCUS ON ACTIVATING YOUR SKILLS."* (A t=470.0). But the
**cadence and targeting are unobservable** — the plate reads OFF in every frame of
both videos. So either implement the described behaviour with INFERRED timings, or
wire the plate to a genuinely disabled state and log the deferral.
**The plate must never lie again.**

---

## §6 Queued, fully specified, NOT part of this retune

- **Portrait ring must be stance-coloured.** DEV-TEXT D-1 plus two frame-proven hues
  (balanced `#8c642e`, heavy `#8a110b`); we hardcode red on a **refuted** "constant
  red in both stances" reading — that pass only sampled heavy-stance frames. Needs
  (i) the LIGHT blue hue, still unmeasured, (ii) a ring centre/radius re-measure in
  the **duel** HUD, (iii) re-pointing gate rows `portrait-ring-left/right`, which
  assert the OG's *heavy* red while our duel spawns *balanced*.
- **Hitbox half-width** — still NOT-FOUND. The confound is known: damage may resolve
  over the whole **dash sweep**, not just the drawn line (two enemies *behind* a
  line's near end died in one slash), which tensions with a-5 strand ②. **Measure it
  with a single-enemy stationary duel, reading hits from the red damage numerals
  rather than bar disappearance.**
- **Two contested measurements** needing a same-method re-measure on video B:
  `DASH_SLASH_PX = 127` and `SLASH_FRAMES` 12/16/20.
- **`SHSD_MASTER_REFERENCE` A-16 correction** — its "3-hit combo 20/20→4/20" entry is
  wrong; the duel starts at 16/20 and it is seven 2-damage hits.
- **Scripted zone-entry walk**: spawn ≈123.5 stage px, auto-walk to ≈212 before
  control resumes. A real Stage-4 requirement.
- **Enemy leaps and falling-wave spawns** — measured, unbuilt.

---

## §7 Gate (binary — every row pass/fail)

| # | Item | Verify | entering S12 |
|---|---|---|---|
| 1 | Study ledger rows for (a)–(g), numbers + frame refs, tagged | ledger diff | ✅ **GREEN** — 194 rows across two passes, 358 evidence frames |
| 2 | CRUX resolved **by measurement**, not assumed | ledger + red-first test | ✅ **GREEN** — a-5, independent strands |
| 3 | Movement latched, two measured gaits, WASD demoted | browser + sim reads | ⬜ |
| 4 | `resolveSlash` gates by reach; in-reach hits, beyond-reach whiffs | test names + diff | ✅ structure correct (c-3); **values** pending |
| 5 | Stance switch produces a visible, measured reach delta | capture pair | ⬜ |
| 6 | Hits-to-kill == measured count; Focus fill == 5.97 s | pins + browser | ⬜ |
| 7 | AUTO SLASH state is real (measured behaviour or honest disable) | browser toggle | ⬜ |
| 8 | Suite · tsc ×2 · eslint · fidelity **55/55** · zero console errors · harness green **with the band unchanged** | pastes | 🟡 suite/tsc/eslint green; browser + harness pending |
| 9 | Ledgers + DIVERGENCES + RESUME_HERE + **SESSION13 kickoff** in the closing commit | `git show --stat` | ⬜ at close |

Browser gate: `npm run dev` → console → `await __fidelity.run()` → must read **55/55**.

---

## §8 Measurement traps — do not re-learn these the hard way

Every one burned an agent in Session 11 and was caught only by looking at pixels.

1. **Foreground bamboo is drawn in front of enemy HP bars** and splits them — a
   naive green-run read shows a **full** bar as 25–70 % and **invents damage that
   never happened**. Verify fragment widths sum to ~130 px.
2. **"CANNOT CHANGE STANCE" reads as a ~74 %-full Focus bar** to a white-pixel mask.
   Measure the contiguous run from the track's **left edge**, then confirm by eye.
   ✅ Useful inverse: that caption ⇔ **focus == 0**, an exact free readout.
3. **A FULL Focus bar carrying "CRITICAL HIT" reads as a 29 % fill** to the same
   measure. Check whether x 498–513 is lit before believing a mid-range value.
4. **Ground-band frame-differencing under-reports camera scroll ~3×** (the white
   character body dominates). Anchor on a discrete world-fixed feature; background
   layers parallax at 0.45–0.68× and are **not** valid anchors.
5. **The 15 fps content floor** — both videos carry only ~15 fps of unique content
   in a 60 fps container. Nothing under **67 ms** is resolvable; **extract at
   `fps=15`**, not 60.
6. **Faint thin red tails persist at focus 0** — only the saturated RGB(167,16,3)
   head is a live stroke.
7. **Track the player by the rigid yellow "GUEST" nameplate** — body centroids are
   too jittery.
8. ⚠️ **Tooltips are CONTESTED as a cursor readout.** One agent proved a tooltip
   sliding 115 px while its object stayed fixed (⇒ renders at the cursor); another
   found dojo/overworld tooltips in a **fixed top-left slot** carrying no cursor
   information. Probably two families — verify which before relying on it.

---

## §9 Close ritual

Update the ledgers, add DIVERGENCES entries for every value changed **and every
value left INFERRED**, refresh `RESUME_HERE.md`, and write the **SESSION13 kickoff
in the same commit** — paste-ready, verdict stated explicitly (✅ / ⚠️ + limiter),
grounded in the live code and the numbers actually landed.

**Report the bar honestly.** If a step shipped on inference rather than
measurement, say so in the commit message. This project's failure mode is not slow
progress — it is a number quietly presented as measured when it was guessed.
