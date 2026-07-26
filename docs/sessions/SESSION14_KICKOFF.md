# SESSION 14 KICKOFF — MANY ENEMIES, ONE HIT

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you need.**
> Self-contained. `SESSION13_KICKOFF.md` is CLOSED (all 17 gate items green, commit `335e615`).
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names (art tracing
> permitted per the owner ruling) · **Duels-not-SHS** · single-player-first · `core/` zero
> numeric literals, zero `Math.random` · render-only scenes · **red-first TDD** ·
> chaos-plant every guard · **binary gates, never softened to fit a change**.
>
> ⚡ **THERE IS NO RESEARCH STEP AND NOTHING TO DECIDE.** Every number below is already in
> `SOURCE_CONSTANTS.md` §3.9 or `COMBAT_MEASUREMENTS.md` e-2/e-3/e-4. §P lists them with their
> citations so nobody re-derives them.
>
> ## ▶ A0 + A1 + A2 ARE CLOSED. **START AT §4 A3.**
>
> `tests/duel-baseline.test.ts` now pins what the duel actually DID at the close of SESSION 13:
> all 24 good-play frame counts, all 24 no-play frame counts, the seed-7 outcome fingerprint
> (rolling checksum included), the 10.575 s median, and the derived enemy
> (hp 50 · K 10 · D 18 · xp 90). Suite **540/540** · tsc ×2 exit 0 · eslint exit 0.
>
> **That file is the session's tripwire. If it goes red, the refactor is wrong — fix the
> refactor, never the numbers.** (Re-recording them is legitimate only for a deliberate,
> documented model change, and then the DIVERGENCES entry comes first.)
>
> Red-proofed with two plants: player damage 10→11 → **4 RED**; dash speed 40→41 → **1 RED**,
> and *that one changed no frame count at all* — only the checksum caught it. Two fights of the
> same LENGTH that diverged mid-way are invisible to a duration check, which is why the
> fingerprint sits alongside the frame arrays.
>
> ⚠️ **Coverage fact found while red-proofing, and you need it before you trust anything:**
> `MOVE_RUN_PX_S` 288→289 changes **nothing** in the 24-seed harness. The bot never issues move
> orders — it closes the spawn gap purely by dashing along its own stroke. **The walk/run gaits
> are therefore unexercised by the harness** and are covered by unit tests only. Do not use a
> green harness as evidence that movement still works.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**The duel is solved. The game is not — because the game is mostly not a duel.**

SESSION 13 made a 1v1 named duel behave like the original: 10 hits to kill, 18 to be killed,
a median fight of 10.6 s. But `Sim` is **hard-wired to exactly two fighters**, and the original's
moment-to-moment gameplay is a player wading through a *crowd* of mobs that **die in one hit**.

Our own study pass named this precisely:

> **ORDINARY MOBS DIE IN ONE HIT.** >15 bar-disappearance events across 3 encounters; no
> non-named enemy's HP bar was ever observed at anything other than 100 % on the last frame it
> existed. *"This is the single largest gap between the OG and our build."*
> — `COMBAT_MEASUREMENTS.md` e-2

That sentence was written when our duel took 19 slashes. Phase B fixed the duel and **did not
touch this**. It is now, unambiguously, the largest remaining gap.

**And the model already predicts the answer.** Phase B implemented the source's
`if (level <= 8) { minDamage = 1; defense = 1; }` override and left it *dormant*, because both
duellists sit at level 9. Trash mobs live **inside** that override — and the study pass measured
dungeon mobs dealing **exactly 1 damage per hit** to a 20-HP player. The number we implemented
blind is the number that was filmed. This session switches it on.

> **The test of a model is that it predicts things you did not fit it to.** Ours just did.

---

## §P PREREQUISITES — ✅ ALL RESOLVED. Every number below is already sourced.

No mining, no measuring, no video. Citations so you can check, not so you must.

**P1 — ✅ Mob HP is AUTHORED 1, and is NOT the K-derivation.**
`<hp>1</hp>` in the recovered enemy table, **and** forced by `setLevel`. This is a *different AI
class* from the named duellist whose HP Phase B derives — the same "wrong class" trap that
`SOURCE_CONSTANTS.md` §3.8 fell into and P1 of SESSION13 corrected. **Do not run trash mobs
through `deriveEnemy`.** (`SOURCE_CONSTANTS.md` §3.8; `COMBAT_MEASUREMENTS.md` e-2)

**P2 — ✅ Mob think interval is 1.0 s, not 0.5 s.** Source: *"think interval: **24 frames (1.0 s)**
default; **12 frames (0.5 s)** for duelists."* ⚠️ **Our `AI_THINK_INTERVAL_MS = 500` is the
DUELIST value.** It is correct where it is used today and wrong for mobs. Split it.
(`SOURCE_CONSTANTS.md` §3.9)

**P3 — ✅ Mobs CAN block; duelists cannot — and it is GEOMETRY, not a dice roll.** Source:
*"mobs can block with the weapon hitbox (part 3 → 0 damage); duelists cannot."*
⚠️ This is **not** the `react()` seam SESSION13 deleted. That was a per-swing probability roll
with an attention cooldown — a mechanic the game does not have. This is a **hitbox**: if the
stroke crosses the mob's weapon part before it crosses the body, the hit deals 0. Re-introducing
a *roll* here would be re-introducing the refuted thing under a new name.
(`SOURCE_CONSTANTS.md` §3.9)

**P4 — ✅ Targeting is memoryless.** *"nearest valid actor by `|Δx|` — no aggro table, no
last-attacker memory."* AUTO SLASH already implements exactly this against a single enemy
(`Sim.nearestLivingTarget`); it generalises with no rule change. (`SOURCE_CONSTANTS.md` §3.9)

**P5 — ✅ Enemies do NOT take turns.** *"No token, no cap, no shared cooldown. The apparent
turn-taking in footage is **emergent** from independent timers plus the melee range gate."*
Phase B built both preconditions and asserted them; §7 of SESSION13 recorded that the emergence
itself **could not be observed while `Sim` was 1v1**. This session is where it gets observed.
(`SOURCE_CONSTANTS.md` §3.9)

**P6 — ✅ Corpses linger 96 frames (4.0 s), alpha-fading over the last 12.**
(`SOURCE_CONSTANTS.md` §3.9)

**P7 — ✅ Damage popups encode direction by COLOUR, and their anatomy is measured.**
Dark/black = damage the PLAYER took; red = damage dealt to an ENEMY (13 of 14 events). They rise
**13.3 stage px over ~0.200 s** while fading, and **scale UP as they rise** (29×40 → 42×62 px over
15 frames @1080). ⚠️ *"glyph size alone can never identify a crit"* — do not encode crits by size.
(`COMBAT_MEASUREMENTS.md` e-3)

**P8 — ✅ Encounter sizes are filmed.** A level-1 forest fight and an **8-enemy dungeon fight**.
Eight is a real observed crowd, not a guess. (`COMBAT_MEASUREMENTS.md` e-2)

**P9 — ✅ PvE trash resolves in 3–10 s, and we know WHY.** *"That is travel and approach time,
not grinding an HP bar down."* This is the encounter's duration band, and it comes with its own
explanation — which is what makes it a usable gate rather than a fitted number.
(`COMBAT_MEASUREMENTS.md` e-2)

**P10 — ✅ HP obfuscation exists and must NOT be reproduced.** The original multiplies stored HP
by a random 2..6 per session to defeat memory scanners. *"Not a gameplay number — do not
reproduce it."* Recorded here so nobody "finds" it later and implements it.
(`SOURCE_CONSTANTS.md` §3.9)

**P11 — ✅ `AI_APPROACH_RANGE` has been waiting for this session.** It is already in config, already
labelled *"Stage-4 world-aggro only — reserved; unused in 1v1"*, and `AISeamController` currently
`void`s it. Encounters are what it was reserved for. (`DIVERGENCES.md`, Session-13 A0 block)

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

Each decision carries a **one-line veto**.

### D1 — `Sim` becomes N-actor, and the 1v1 duel becomes the N=1 special case ⭐

This is the foundational decision and the whole risk of the session.

`Sim` today is `Record<'player' | 'enemy', FighterState>`. It becomes a **player plus an array of
enemies**. Every 1v1 behaviour is preserved as the array-of-one case.

**Why an array rather than a second scene with its own sim:** the alternative is two combat
implementations that drift. The whole reason AUTO SLASH was worth building in SESSION13 was to
prove the player and AI paths share ONE pipeline; forking the Sim would throw that away
immediately.

> **Veto:** keep `Sim` 1v1 and build encounters on a separate lightweight sim.
> *Recommended against* — two damage pipelines is exactly the drift the project has spent three
> sessions eliminating.

### D2 — ⛔ THE DUEL MUST NOT MOVE. This is the session's binding invariant.

The N-actor refactor is a **pure generalisation**: at N=1 the sim must produce **byte-identical**
results to `335e615`.

Concretely, and these are gate items, not aspirations:
- the 24-seed harness still reads **24/24 · 0/24 · median 10.575 s · 24 distinct**
- the cross-process determinism fingerprints are **unchanged**
- the in-browser fidelity gate is still **55/55**

**Capture the current fingerprints BEFORE refactoring** so "unchanged" is a diff, not a memory.
⚠️ Note what today's test does and does not do: `tests/determinism.test.ts` proves that runs agree
**with each other** (in-process ×2 and cross-process), which survives any behaviour change so long
as it is deterministic. It pins **no absolute value**. So it would stay green through a refactor
that silently changed the duel. A0 exists to add the absolute pin it is missing.

This is the same discipline A0 used: a refactor that claims to be a generalisation must *prove*
it by reproducing the old numbers exactly, not by passing a looser test.

> **Veto:** allow the duel numbers to shift and re-pin them. *Recommended against* — you would
> lose the only evidence that the refactor was behaviour-preserving.

### D3 — A new `EncounterScene`. `DuelScene` is not touched.

SESSION13 §2's SCOPE TRAP still holds: `DuelScene` is a **NAMED 1v1 duel** (white nameplate, VS
card, win/defeat screens) and **one-hit kills must never be applied to it**. Encounters are a
different thing with different rules, so they get a different scene.

Shared: `Sim`, the damage pipeline, `duelSetup`-style spawn assembly, the HUD chrome.
Not shared: the VS intro, the named nameplate, the result card, `deriveEnemy`.

> **Veto:** put a mode flag on `DuelScene`. *Recommended against* — a scene that renders two
> different games behind a boolean is how the one-hit-kill rule leaks into the duel.

### D4 — Trash mobs: HP 1, damage 1, defence 1 — and NONE of it is authored by us

```
mob.hp      = 1                    // <hp>1</hp>, and setLevel forces it
mob.level   ≤ 8                    // so the source's own override fires
  ⇒ minDamage = 1, defense = 1     // ALREADY IMPLEMENTED, dormant since Phase B
```

**Do not route mobs through `deriveEnemy`** (P1: different class). The `level ≤ 8` override is
already written, already chaos-proven, and already sitting there doing nothing — this session
just spawns something that lives inside it.

**The confirmation worth noticing:** we implemented that override from source while both
duellists sat at level 9, so it had no observable effect and could not have been fitted to
anything. The study pass independently measured dungeon mobs dealing **exactly 1** damage. Those
two facts were established separately and agree.

> **Veto:** give mobs a small HP pool so fights feel less trivial. *Recommended against loudly* —
> "mobs die in one hit" is the single best-evidenced measurement in the whole corpus (>15 events,
> 3 encounters, 4 individually-tracked enemies), and softening it re-opens the largest gap.

### D5 — One stroke, every enemy it crosses — and the reach budget is spent ONCE

`resolveSlash` is already shaped for this: `tests/slash.test.ts` has a multi-foe case, and the
function takes a polyline plus one target. The Sim resolves the **same truncated polyline**
against each living enemy.

⚠️ **Truncate once, before the loop.** Truncating per-enemy would let each foe see a fresh full
reach budget — reach would silently scale with crowd size. The budget belongs to the *swing*.

> **Veto:** resolve against only the nearest crossed enemy. *Recommended against* — the filmed
> 11-hit combos require one stroke to fell several mobs.

### D6 — Mob think interval 1.0 s; the duellist's stays 0.5 s

`AI_THINK_INTERVAL_MS = 500` is renamed to what it actually is and joined by the default:

```
AI_THINK_INTERVAL_MS = { mob: 1000, duelist: 500 }   // 24 / 12 frames
```

⚠️ Changing the constant's shape touches `AISeamController` and AUTO SLASH. AUTO SLASH hands the
PLAYER to the AI routine — the player is a duelist, so it keeps **500**.

> **Veto:** one global interval. *Recommended against* — the source names two, and the slower mob
> cadence is half of why crowds read as taking turns.

### D7 — Mobs block with a WEAPON HITBOX. This is not `react()` coming back.

A mob carries a small weapon-part polygon. If the stroke crosses **that** before it crosses the
body, the hit deals **0** — a geometric, deterministic, position-dependent outcome the player can
*see* and play around.

⚠️ **The refuted thing was a probability roll** (`reactBlockChance` + an attention cooldown), and
it is deleted. If the implementation ever calls `rng()` to decide a block, D7 has been
misread. Duelists get **no** weapon part, so duel blocking stays impossible — which is what the
duel footage shows.

> **Veto:** skip mob blocking this session and log it. Acceptable — it is the most involved item
> here. Do **not** substitute a roll.

### D8 — Turn-taking is OBSERVED and MEASURED, never asserted

SESSION13 could only assert the preconditions. Now they get exercised.

**The falsifiable statement:** with independent timers and a narrow melee gate, simultaneous
strike commitments must be **rare but NOT zero**. A shared token forces the rate to *exactly*
zero; independent timers cannot.

```
over an 8-mob encounter, sample every frame:
  simultaneousCommits = frames where ≥2 mobs commit to a strike on the SAME frame
  ⇒ assert simultaneousCommits > 0        (a rate of 0 means someone added a token)
  ⇒ assert simultaneousCommits / totalStrikes < 0.25   (else it is a mosh pit, not turn-taking)
```

> **Veto:** assert only "no token exists" structurally. *Recommended against* — that tests the
> code's shape, not its behaviour, and shape tests survive refactors that break the feel.

### D9 — Damage popups land, with the measured anatomy and the measured colour rule

Dark = player took damage · red = enemy took damage · rise 13.3 stage px over 200 ms · scale up
as they rise · fade out. **Crits are NOT encoded by size** (P7).

Popups are pure render FX driven off existing `SimEvent`s — no gameplay coupling. They are in
scope because a crowd fight without them is unreadable, and because the numbers are already
measured.

> **Veto:** defer popups. Acceptable — nothing else depends on them.

### D10 — Encounter size 8; spawn geometry is INFERRED and says so

Eight is filmed (P8). **Spawn geometry is NOT sourced** — `REBUILD_READINESS` lists
"aggro/spawn geometry" as a known-unknown. So: spread mobs across the world's x-range at the
ground line, label the layout `INFERRED`, and do not pretend otherwise.

> **Veto:** pick a different count. Fine — but keep it filmed, not invented.

### D11 — Corpses linger 96 frames, fading over the last 12

Dead mobs stay on screen and fade out. Sim-owned (a corpse is state), render-read.

> **Veto:** despawn instantly. *Recommended against* — with one-hit kills, instant despawn makes
> a crowd fight look like enemies were never there.

### D12 — HP obfuscation is NOT reproduced, and this is why

The original multiplies stored HP by a random 2..6 per session to defeat memory scanners. It is
anti-cheat, not gameplay. Recorded in DIVERGENCES so a future session does not "discover" it and
faithfully implement a bug-generator.

> **Veto:** none. Implementing it would be a fidelity error, not fidelity.

---

## §2 THE DURATION BAND — decided ONCE, up front, exactly like D10 of SESSION13

An 8-mob encounter must clear in **3–10 s**.

⚠️ Precision about provenance, so nobody over-reads it: `3–10 s` is the measured band for **PvE
trash encounters generally**, not for the 8-mob case specifically. Eight is the filmed *large*
end (P8), so expect the median in the **upper half** of the band — but the gate is the band, and
the band does not move.

This is not fitted and not inherited from a spec: it is measured, **and it arrives with its own
mechanism** — *"that is travel and approach time, not grinding an HP bar down"* (P9). Since mobs
die in one hit, encounter duration is dominated by **travel**, which our movement model already
reproduces from source (walk 96 / run 288 world px/s, gaits latched at command time).

**Single band rule, carried over verbatim from SESSION13 D10:** `[3, 10]` **does not move inside
this session.** If the median lands outside it, exactly two diagnoses are permitted:

  (a) the bot's approach/stroke geometry, or
  (b) a wrong spawn spread in D10's INFERRED layout.

**If neither explains it, STOP and escalate.** Do not widen the band, and do not "investigate"
your way to a wider one.

> Last session this rule was tested for real: the harness came in at 8.358 s with only 15 distinct
> durations, the band was left alone, diagnosis (a) was applied, and the median moved to 10.575 s
> — *inside the prediction made before any code existed*. The rule works. Use it.

---

## §3 WHAT WILL FIGHT YOU

**1. `Sim` is 1v1 in more places than you think.** `hitbox(side)`, `opponentView()`,
`autoView()`, `dealDamage(target)`, `FighterSide = 'player' | 'enemy'`, the `fightEnded` winner,
the kill-beat, `projectileHits`, `DuelScene`'s two-fighter draw loop — all assume exactly one
enemy. Expect the type change to surface every one of them. **That is the refactor doing its
job**; resist the urge to keep a `sim.enemy` alias "for now", because everything that reads it
silently keeps the 1v1 assumption alive.

*One deliberate exception:* keep a `sim.enemy` accessor **for `DuelScene` only**, documented as
"the duel's single opponent — encounters must use `sim.enemies`". A rename of every duel call
site buys nothing and risks D2.

**2. Determinism is the thing most likely to break quietly.** Iterating enemies in a
non-deterministic order, or consuming rng per-enemy in a crowd-size-dependent way, changes the
stream and the fingerprints shift. **Fixed iteration order, and the AI must draw from the shared
stream in a defined sequence.** The determinism tests are your alarm — run them early and often,
not at the end.

**3. The one-hit rule interacts with the combo.** Combo is cosmetic and resets **only** on player
damage (SESSION13 A2), so an 8-mob encounter should produce an 8-chain — and the filmed
**11-chains** become reachable for the first time. That is a free confirmation; assert it.

**4. `game/` numeric-literal ratchet will fire on the new scene.** Expected. Refresh with
`UPDATE_GAME_PURITY_BASELINE=1` and **review the diff as the audit surface**, as ever.

---

## §3.5 THE 1v1 CALL-SITE INVENTORY — the map, so you do not have to draw it

Surveyed at `018f36a`. **Symbols, not line numbers** (the repo rule; lines drift). This is every
place that assumes exactly one enemy, grouped by what the fix is. Nothing here is a surprise
waiting to be discovered mid-refactor — it is the whole list.

**A. The type itself — start here, everything else follows from it.**
`FighterSide = 'player' | 'enemy'` is consumed by **seven** `SimEvent` variants
(`fightEnded.winner`, `damage.target`, `stanceSwitched.who`, `stanceSwitchDenied.who`,
`strikeEvaded.by`, `invulnBlocked.target`, `strikeBlocked.by`) and by the signatures of `view`,
`hitbox`, `requestStanceSwitch`, `isProtected` and `dealDamage`.
⇒ It becomes an **actor id**. Events must carry an id, not a side. Expect the compiler to walk
you through the rest — that is the plan, not an accident.

**B. Storage and construction.** `Sim.fighters: Record<FighterSide, FighterState>`, built in the
constructor from `spawns.player` / `spawns.enemy`. Public reads `Sim.player`, `Sim.enemy`,
`Sim.playerJumping`, `Sim.hitbox(side)`.
⇒ `player` plus `enemies[]`. **Keep a `Sim.enemy` accessor for `DuelScene` only** (documented as
"the duel's single opponent — encounters use `sim.enemies`"): renaming every duel call site buys
nothing and risks D2.

**C. Slash resolution — the hot path.** `applyStroke` reads `this.fighters.enemy`, calls
`hitbox('enemy')` and `dealDamage('enemy', …)`.
⇒ Loop over living enemies. ⚠️ **Truncate the stroke ONCE, outside the loop** (D5) — per-enemy
truncation silently scales reach with crowd size.

**D. AI views.** `opponentView()` and `autoView()` each build a single-enemy `OpponentView`
(`playerPos` / `enemyPos` / `playerStance` / `enemyStance` / `enemyFocus` / `playerJumping`).
⇒ One view per enemy controller. `autoView()` already swaps player↔target correctly.

**E. Enemy action.** `executeStrike()` hardcodes `fighters.enemy` as attacker and
`fighters.player` as target; `tick()` moves `fighters.enemy` and calls
`requestStanceSwitch('enemy', …)`.
⇒ Per-enemy, each with its own controller instance and its own mode state.

**F. Damage and death — the subtlest one.** `dealDamage` derives the winner as
`target === 'enemy' ? 'player' : 'enemy'`, grants the killer's Focus bonus, and flips
`phase` to `'ended'` **on the first death**.
⇒ An encounter ends when **all** enemies are dead, or the player is. Getting this wrong ends an
8-mob fight on the first kill, and every other test will still pass.

**G. Skills.** `chiPunch` → `dealDamage('enemy', …)`; `smokeBomb` dashes away from
`fighters.enemy`.
⇒ Nearest living target (P4), same rule as everything else.

**H. Projectiles.** `throwKunai` spawns from `fighters.enemy.pos`; `stepKunai` only ever tests
the player as a victim.
⇒ Per-enemy thrower. Player-fired projectiles do not exist and are not in scope.

**I. Generalises for free.** The meter-fill loop already reads
`for (const f of Object.values(this.fighters))`.

**J. ALREADY THE RIGHT SHAPE — do not "fix" these.**
`Sim.nearestLivingTarget()` and `synthesizeStrokePoints()` (AUTO SLASH) already implement
nearest-by-`|Δx|` targeting and generalise unchanged. `resolveSlash(points, target, attacker)` is
already one-target-per-call, and `tests/slash.test.ts` already covers the multi-foe case.
**AUTO SLASH is your canary:** it is the one existing feature that already thinks in "nearest of
several", so if it still behaves after the refactor, the targeting generalised correctly.

**K. Outside `core/Sim.ts`** — touchpoint counts, so you can size the work:

| File | Touchpoints | Note |
|---|---:|---|
| `tests/Sim.test.ts` | 34 | the largest surface; mostly fixture plumbing |
| `src/game/DuelScene.ts` | 16 | two-fighter draw loop, nameplate, overhead bar |
| `tests/utils/duel-bot.ts` | 6 | ⛔ **behaviour must not change** (D2) |
| `tests/autoSlash.test.ts` | 5 | the canary above |
| `src/core/duelSetup.ts` | 2 | builds the pair; encounters get a sibling |
| `src/core/OpponentController.ts` | 2 | `OpponentView`'s singular fields |
| `src/game/fidelity.ts` | 2 | the enemy-bar probe reads `sim.enemy.pos` |
| `src/game/DuelResult.ts` | 1 | winner only |
| `tests/scaffold.test.ts` | 0 | — |

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code, then green.**
Chaos-plant every new guard.

### A0 — ✅ CLOSED (`018f36a`). Capture the baseline BEFORE touching anything ⛔

Done: `tests/duel-baseline.test.ts`. See the banner at the top of this file for the evidence,
the two red-proof plants, and the harness coverage caveat it turned up.

Kept here because the *reason* still governs A1: after A0 you can no longer **prove** the
refactor was behaviour-preserving — you can only claim it.

### A1 — ✅ CLOSED. `Sim` is N-actor, and N=1 is byte-identical

**Gate met, with evidence.** `tests/duel-baseline.test.ts` green and **unedited**
(24 good frames · 24 no-play frames · seed-7 checksum · median 10.575 s, all
byte-identical to `335e615`); in-browser fidelity gate `PASS — 41 points + 14
scans` = **55/55**; suite **555/555** · tsc ×2 exit 0 · eslint exit 0.

`FighterSide` is gone → `ActorId = 'player' | \`enemy${number}\``. Constructor is
`new Sim(rng, SimSetup, autoController)` with each enemy an
`EnemySlot { spawn, controller }`. 15 red-first assertions in
`tests/simNActor.test.ts`; **8 chaos plants all watched RED**, including the one
this section warned about — a per-enemy `rng()` draw turned the *baseline* red.

⚠️ **Two things the next step must know:**
1. **A slash still resolves against the NEAREST living enemy only.** That is
   deliberate, so **A3's** D5 loop can be written red-first. The reach budget is
   already spent exactly once, in `truncateTo`.
2. **The Focus kill bonus now pays on EVERY kill** (credited to the real killer).
   Identical at N=1; an 8-mob encounter pays it 8×. Measure in A6, do not pre-tune.

The original brief, kept because its reasoning still governs A2→A6:

Pure refactor. **No new behaviour, no new constants, no new config values.** `player + enemies[]`.
Work the inventory in §3.5 in order A→K; the type change in (A) will surface most of the rest for
you through the compiler.

**Gate: `tests/duel-baseline.test.ts` green WITHOUT having been edited, plus the fidelity gate at
55/55.** If any of it moved, the refactor is not a generalisation yet — fix it before A2. Do not
proceed with a "close enough" duel; the whole session rests on this step being exact.

⚠️ **Determinism is the likeliest silent breakage.** Iterate enemies in a fixed order, and keep
the AI drawing from the shared rng stream in a defined sequence. A crowd-size-dependent number of
`rng()` calls shifts the stream and the seed-7 checksum moves — which the baseline WILL catch, so
run it early and often rather than once at the end.

### A2 — ✅ CLOSED. Mob spawns + one-hit kills + corpses

Landed: `config/mobs.ts` · `core/mobModel.ts` · `core/encounterSetup.ts` · corpses as Sim state.
Suite **570/570** · tsc ×2 exit 0 · eslint exit 0. **6 chaos plants** (one exposed a dead TEST,
which was rewritten and then bitten twice). The `level ≤ 8` override now lives at ONE shared site
so mob damage is DERIVED, not authored. Mob XP reward deliberately does not exist — no measured
number. Full record: `DIVERGENCES.md` "SESSION 14 — A2".

⚠️ **A3 inherits one thing:** `applyStroke` still resolves against the nearest living enemy, so
right now a swing through three mobs kills **one**. That is the red-first starting point for D5.

The original brief:

`config/mobs.ts` (HP 1, level ≤ 8, the INFERRED layout), mob spawn assembly beside `duelSetup`,
corpse TTL 96 frames. Chaos-plant: force a mob to level 9 → its damage and defence must stop
being 1.

### A3 — One stroke, many enemies

Truncate once, resolve against each living enemy. Red-first: a stroke crossing three mobs kills
three. Chaos-plant: truncate *inside* the loop → the crowd-size reach bug must go RED.

### A4 — `EncounterScene` + damage popups

The scene, the HUD without duel chrome, popups per D9.
**Gate: fidelity gate still 55/55** (encounters must not disturb the duel's measured pixels).

### A5 — Mob AI: 1.0 s cadence, memoryless targeting, weapon-hitbox blocking

D6, P4, D7. Chaos-plant: an rng call inside the block decision → the "blocking is geometric" test
must go RED.

### A6 — Observe turn-taking, and the encounter band

D8's simultaneous-commit measurement, and the `[3, 10]` s band from §2.
**If the median misses, apply §2's two diagnoses, then STOP and escalate.**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | **The duel did not move**: harness 24/24 · 0/24 · median **10.575 s** · 24 distinct | `tests/duel-baseline.test.ts` green **and unedited** |
| 2 | Per-seed frames AND the seed-7 checksum fingerprint unchanged | same file — the checksum catches drift that leaves durations identical |
| 3 | Fidelity gate still **55/55** in-browser | `await __fidelity.run()` |
| 4 | `Sim` carries N enemies; no `'player' \| 'enemy'` union left in gameplay paths | grep; the duel accessor is the one documented exception |
| 5 | Trash mobs die in **ONE hit** | red-first; chaos: give a mob 2 HP → RED |
| 6 | Mob damage and defence are **1**, via the `level ≤ 8` override — not authored by us | chaos: force a mob to level 9 → both must change |
| 7 | Mobs do **not** run through `deriveEnemy` | a mob's HP must be 1, never `effPlayerDmg × K` |
| 8 | One stroke fells every enemy it crosses; **reach truncated ONCE** | chaos: truncate per-enemy → RED |
| 9 | Mob think interval **1000 ms**; duelist and AUTO SLASH stay **500 ms** | red-first, both paths |
| 10 | Mob blocking is **geometric** — a weapon hitbox, never a roll | chaos: plant an `rng()` in the block path → RED |
| 11 | Duelists **cannot** block (no weapon part) | red-first |
| 12 | Targeting is nearest-by-\|Δx\| with **no** aggro or last-attacker memory | a planted "remember who hit me" must change nothing |
| 13 | **Turn-taking OBSERVED**: simultaneous commits > 0 **and** < 25 % of strikes | chaos: add a token → the >0 assert must go RED |
| 14 | Corpses persist 96 frames, fading over the last 12 | red-first |
| 15 | An 8-mob encounter yields a combo chain of 8; **11-chains reachable** | red-first |
| 16 | Damage popups: dark = player took, red = enemy took; **crit not encoded by size** | red-first |
| 17 | Encounter median in **`[3, 10]` s**, band pinned with §2's derivation and stop rule | measured over seeded encounters |
| 18 | HP obfuscation explicitly NOT implemented, recorded in DIVERGENCES | grep + ledger entry |
| 19 | Suite · tsc ×2 · eslint green; **every new guard chaos-planted**; ratchets refreshed with reviewed diffs | pasted output |
| 20 | Ledgers + DIVERGENCES + RESUME_HERE + next kickoff in the closing commit | `git show --stat` |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the refactor silently changes the duel.** An N-actor `Sim` touches every gameplay
path, and the failure mode is not a crash: it is the harness median drifting by a few frames and
nobody noticing because the band is wide enough to absorb it. **A0 already closed that hole** —
`tests/duel-baseline.test.ts` holds the exact expected values, recorded before any refactor could
perturb them, so "unchanged" is checkable rather than assertable. If A1 cannot reproduce them
exactly, the refactor is wrong; do not proceed to A2 with a "close enough" duel.

The red-proof showed the sharp edge here: changing the dash speed by ONE unit left **every frame
count identical** and was caught only by the rolling checksum. A refactor can preserve every
duration and still have changed the fight.

**Risk 2 — mob blocking gets re-implemented as a dice roll.** SESSION13 deleted `react()` because
it modelled behaviour the game lacks. The source *does* say mobs block — and the shortest path
from "mobs block" to working code is a probability, which would quietly restore the exact thing
that was just removed. **The gate names this**: an `rng()` call in the block decision is a
failure, not an implementation detail. If weapon-part hitboxes prove too involved, take D7's
veto and defer the feature — deferring is honest, a roll is a regression wearing a new name.

---

## §7 QUEUED — deliberately NOT in this session

Carried from SESSION13 §7, plus what this session adds:

- **All audio.** The game is currently **completely silent** — `src/` contains no `AudioContext`,
  no oscillator, nothing. `REBUILD_READINESS` scores `art-anim-audio-feel` 56 and names *"all
  audio (SFX + music params)"* as the thing blocking a 1:1, and Tier 1 item 3 calls it *"the
  deepest gap, and closable without the SWF"* via a listen-pass on the longplays and the three
  music rips. **This is the strongest candidate for SESSION 15** — it needs a study pass first, so
  it must not be bolted onto a code session.
- Portrait ring must be stance-coloured (our hardcoded red rests on a refuted reading).
- **"150 % DAMAGE" is a timed buff**, not a Heavy property.
- Body-part crit ×1.3 — the positioned no-op hook landed in SESSION13 B2; it needs limb hitboxes.
  ⚠️ **Mob weapon-part hitboxes (D7) are the first half of that work** — build them so limb parts
  can reuse the same shape.
- The dash's **wind-up first leg** (to the stroke's *first* point).
- Stagger hyperarmor (3 hits, 5 in light stance).
- Elemental resists (no elemental system exists).
- Mastery progression as a spendable skill (triangular cost `N(N−1)/2`).
- The recovered **982-item / 75-skill / 61-quest** tables — campaign fuel (`STAGE4_KICKOFF.md`).
- **39 AI classes.** This session implements ONE mob class. The taxonomy is recovered and waiting.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes — and here is the evidence rather than the claim.**

- **No research step, and that is checkable.** All twelve prerequisites cite an existing ledger
  line (`SOURCE_CONSTANTS.md` §3.9, `COMBAT_MEASUREMENTS.md` e-2/e-3/e-4). Nothing below §P asks
  anyone to measure, watch, or mine anything.
- **Every decision is made, and each carries a veto path.** Twelve decisions; most vetoes are
  marked *recommended against* with the cost stated, two (D7, D9) are marked genuinely acceptable
  to defer — because pretending everything is mandatory is how a session overruns — and D12's is
  explicitly "none", with the reason.
- **The band is derived before the code, and comes with a mechanism.** `[3, 10]` s is measured
  *and* explained (travel time, not HP grinding), and it inherits SESSION13 D10's stop-and-escalate
  rule verbatim — a rule that was tested for real last session and held.
- **The riskiest step was done FIRST, and is already banked.** A0 (`018f36a`) recorded the duel's
  exact numbers before any refactor could perturb them. A session that refactored first and
  measured afterwards could only ever *claim* it preserved behaviour. Its red-proof also produced
  a fact worth more than the pin itself: a one-unit dash-speed change left every frame count
  identical and moved only the checksum.
- **It hands over the map, not just the destination.** §3.5 is a symbol-level inventory of every
  1v1 assumption in the codebase, grouped by what the fix is, with touchpoint counts per file and
  an explicit "already the right shape — do not touch" list. It was produced by surveying the code
  at `018f36a`, so a fresh session does not spend its first hour rediscovering it.
- **It names the specific way this session is most likely to go wrong** (Risk 2: mob blocking
  re-implemented as the dice roll we just deleted) and puts a chaos plant in the gate against it
  — rather than trusting good intentions.
- **It finds a genuine prediction, not just a task list.** The `level ≤ 8` override was
  implemented from source in Phase B while dormant, and the study pass independently measured mobs
  dealing exactly 1 damage. Those were established separately and agree. §0 says so, because a
  model earning its keep is the strongest reason to trust the rest of it.
- **It is honest about what is not sourced.** Spawn geometry is flagged INFERRED with the ledger
  line that says so (D10). Audio is named as the biggest remaining gap and explicitly pushed to
  SESSION 15 *with the reason* — it needs a study pass, and study passes do not belong in code
  sessions.

**What it deliberately does not promise:** that the N-actor refactor lands cleanly. §3 lists the
places `Sim` assumes 1v1 precisely because that list is longer than it looks, and §6 Risk 1 gives
the refactor a hard stop instead of an escape hatch. If A1 cannot reproduce the duel exactly, this
session ends at A1 with an honest report — and that is a success, not a failure.
