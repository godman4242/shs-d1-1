# t1-overturns-02 — LENS 3 (contradiction) — blind critic s27e

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` · 7 findings · **7 judged, 0 skipped**
Verdicts: **7 survive** (0 refuted) · 2 material corrections carried inside surviving claims · **5 new findings**

I did not open `critics/*.md` or `sources/*.md`. Every verdict below rests on a file I opened myself.

---

## Headline

All seven findings are real and all seven overturns hold. That is not the interesting result.
The interesting result is that **three of them collide with material that is already UPHELD**, and
in two of those collisions the *banked* side is the wrong one:

| # | Collision | Who wins | Cost if unfixed |
|---|---|---|---|
| 1 | `hunter-s27d/max-dan-rank-10…` says *"tenthGold=100 stays INFERRED, RR:165 survives"* vs. four upheld findings saying tenthGold=100 is CONTRACT | **the neighbours** — I read the line the finding itself cites | a false ledger sentence, plus a self-contradicting ledger |
| 2 | `[[combat-core/the-in-combat-stance-gate-is-reload-48-of-a-192-max]]` (UPHELD, 4 critics) says the in-combat stance switch *"costs no Focus and no Chi"* vs. five upheld findings saying it costs a flat −48 | **the −48 side**, i.e. the packet finding | a stance system shipped either free or priced, by coin flip |
| 3 | Inside this packet: one reach finding says the stage-px scale *"still wants one frame measurement"*, the other says the unit is closed | **the "closed" side** | one lane keeps a dead close-path open |

---

## The verdicts

### 1. `base-slash-length-is-a-closed-formula-combat-core-blocker-1-falls` — SURVIVES (minor)

Opened `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2334-2348`. The quote is verbatim:
`:2346` `var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;` / `:2347` `return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`,
and `:2336-2341` is the SPD_eff wrapper with the ×1.5 buff. The android twin `StatsManager.as:1917-1918`
is the same two statements in plain names.

I did not take `§1t9426s0§ = STAT_DAN` on trust: `§1t1523s0§.as:254` declares it `= 25`, and
`StatsManager.as:220` declares `STAT_DAN:int = 25`. Arithmetic re-derived: SPD 0 → 120, SPD 20 → 165,
asymptote 210 at DAN 0, 255 at DAN 9.

**Correction carried:** its lane_impact hedge — *"What is NOT closed: the unit-to-stage-px scale factor"* —
is superseded by its own packet-mate (see §4). A hedge is incompleteness, not error, so the finding stands;
but the hedge must not be copied into the ledger.

### 2. `crit-is-deterministic-at-full-focus-not-a-proc` — SURVIVES (minor)

`§1t99s0§.as:3255-3277` opened. `:3258` is the only RNG in the function. `:3272` is a strict equality;
`:3274` returns `_loc2_ * 1.3 + this.§1t1243s0§`. `:3295-3297` zeroes the meter on the same equality
*before* the per-stance `slashUsage` debit at `:3299-3311`, so crits cannot chain.

I checked the 192 myself rather than inheriting it: `§1t99s0§.as:249` `this.§1t4415s0§ = 8 * 24;` is the
only `maxreload` assignment in the web class. Android is `5 * 24 = 120` (`MCSPlayer.as:239`) — a build
divergence the finding's web label already covers.

HUD claim verified to the character: `§1t113s0§.as:110` builds
`"<font color='#000000'>" + getString(175) + "</font>"`, and `strings.json["175"] = 'Critical Hit'`.

### 3. `max-dan-rank-10-is-contract-not-inferred` — SURVIVES, but one clause is STRUCK (**material**)

**Held.** `§1t1523s0§.as:2653` `if(§1t7356s0§(§1t9426s0§) < 9)` guards `:2655`. DAN runs 0..9 = ten rungs.
`strings.json["455"]`–`["464"]` are exactly ten consecutive titles, (初段) through (十段), with `["465"]`
= 'Renshi' unrelated. MAX_DAN_RANK = 10 is CONTRACT on **web** source; RR:164's demotion falls.

**Struck.** The finding writes: *"nothing here touches 'tenthGold=100', which stays INFERRED — RR:165's
'film shows a flat +25 gold every rebirth, no 10th-rebirth tier' … survives."*

It is touched — **seven lines inside the range the finding itself cites**:

```
§1t1523s0§.as:2644   if(§1t7356s0§(§1t9426s0§) == 8)
             :2646      §1t9713s0§(§1t9413s0§,100);
             :2651      §1t9713s0§(§1t9413s0§,25);
```

`§1t9413s0§ = 12` at `:228`, and `StatsManager.as:194` gives `STAT_HGOLD:int = 12`. The web build pays
+25 normally and **+100 on the DAN 8→9 rebirth**. RR:165's "no 10th-rebirth tier" is FALSE, and
tenthGold = 100 is CONTRACT.

**Lens-3 consequence:** this clause fights at least four UPHELD findings in `LEDGER_EVIDENCE.md`
(:691, :697-699, :701-702, :998-999, :1012), all citing the same function. They are right. Anyone who
followed this finding's lane_impact would write a false sentence *and* contradict the bank. The overturn
is therefore **stronger** than claimed: RR:164-165 falls in **both** halves.

### 4. `reach-cap-in-stage-px-per-stance-is-fully-recovered` — SURVIVES (minor)

Every one of the five stance branches verified verbatim at `§1t99s0§.as:3094 / :3105 / :3116-3119 /
:3131 / :3142-3145`. BUFF_INJURED halving verified at `:219-223`. Field identity is not guessed: the
15-arg init at `§1t99s0§.as:183-199` maps slot-for-slot onto `MCSPlayer.as:182-198`, fixing
param10 → `§1t4420s0§` = `baseSlashLength`.

**This is the side that wins the packet's internal contradiction on the unit.** `§1t99s0§.as:3158`
pushes `slashLength` into `§1t1541s0§.§1t10094s0§()`, whose android twin is
`InputManager.setMaxDistance` (`MCSPlayer.as:3094`). `InputManager.as:198` loads it as
`distanceLeft = maxDistance`, and `:355-367` spends it as a **Euclidean pixel budget**
(`sqrt(getDistanceSQ2(...))`) over game coordinates converted at `:223-224`. So `slashLength` is
literally the drawn blade path's length budget in stage pixels — not a hitbox radius, not a wiki unit.
No frame measurement is needed for the unit question.

Stats-panel corroboration exact: `§1t5957s0§.as:2719 / :2729 / :2738 / :2747 / :3013`, twinned by
`InventoryUI.as:2232` which labels the product `"slash distance: "`.

**Overstatement, minor:** "300 : 214 : 107 … is the wiki's 300/200/100 to rounding". 214 vs 200 is a
7 % miss. See new finding 2.

### 5. `reinforce-carries-three-material-tiers-keyed-on-weapon-level` — SURVIVES (minor), and its build caveat is DISCHARGED

`InteractUI.as:1083` `cost = 5000;` with no formula; `:1097` weapon level; `:1098-1101` forces itemID
13022 to 59; `:1102/:1112/:1122` branch <30 / <60 / else onto stats 20064 / 20065 / 20066;
`:1132` `changeGold(-cost)`; `:1133` `weapon.uses = 0;`. `resolved_names.json` gives Silver Ore /
Titanium Ore / Uncut Diamond, and 13022 = **Pickaxe** ("Used for mining.") — a mining tool in the
weapon slot.

**The finding under-claims its own build.** It says *"I could not confirm the 5000 on the web side, so
this row is v0.682 under S0-3."* I confirmed it. `§1t401s0§.as:1086-1150` is the web twin line for line:
`:1087 cost = 5000;` · `:1105 getLevel()` · `:1106-1108` the 13022→59 forcing ·
`:1110/:1122/:1134` the same three-way branch spending 20064/20065/20066 · `:1146 -cost` ·
`:1147 weapon.uses = 0;`. **No S0-3 hedge is needed.** This agrees with, rather than fights,
`[[lens3/reinforce-tiers-are-web-code-not-a-string-table-inference]]`.

### 6. `rr-159-is-inverted-out-of-combat-is-the-free-switch` — SURVIVES (**material**)

**Out of combat is free.** `§1t406s0§.as:3064-3104`, registered at `:944`. Early-returns on hell
(`:3066-3070`, `getString(860)` = *'Not allowed in hell.'* — I looked it up) and two mail states, then
cycles Light→Balanced→Heavy→Light announcing `getString(644)/(645)/(643)` and plays `Snd_smallClick`.
**No meter read, no debit anywhere in the function.**

**In combat costs.** `§1t99s0§.as:3160-3166` debits `-= 48` under `§1t1525s0§.§1t9948s0§()`. I verified
that predicate independently rather than trusting the finding: `§1t1525s0§.as:1152-1155` is
`actionState == §1t9903s0§` with `§1t9903s0§ = 2` at `:53`, and its neighbour `:1147-1150`
(`== §1t9901s0§`, `= 0` at `:49`) maps onto `StageManager.as:1022` `STATE_PEACEFUL` / `:1027`
`STATE_BATTLE`. So `§1t9948s0§` is `isBattle()`.

The lane_impact's *require-48-and-spend-48* is correct on both halves: requirement at
`§1t99s0§.as:3050` and `:3060`, spend at `:3162`, on a 192 bar (`:249`).

RR:159-160 is inverted exactly as claimed, and **RR:158's "HARD-LOCKED in v0.717" falls with it.**

### 7. `the-crit-proc-rule-is-deterministic-full-meter-not-a-chance-roll` — SURVIVES (minor)

I walked the 15-parameter twin slot by slot (web `:185-199` vs android `:184-198`): controlledBy, setHP,
maxhp, setChi, maxchi, defense, baseReload, minDamage, damageRange, baseSlashLength, slashUsage,
lightMastery, balancedMastery, heavyMastery, level — exact order, no gaps. `§1t4478s0§` (web `:3293-3298`)
is `deductReloadBar` (android `:3240-3245`) statement for statement. That fixes
`§1t4414s0§ = reload`, `§1t4415s0§ = maxreload` beyond argument.

**Mis-aimed cite, non-fatal:** *"Math.random() appears at :3281"* — `:3281` is real but it is the sibling
public accessor `§1t4476s0§`; the roll inside the function under discussion is at `:3258`. Both lines carry
the identical expression, so "nowhere in the crit branch" survives. It points at the wrong copy.

**Discharges a standing hedge:** `LEDGER_EVIDENCE.md:1510` still reads *"the crit PROC rule … is still
open — :3272 tests an equality between two obfuscated members, not a probability."* The members are now
named from the twin. That hedge is dead.

---

## Contradiction sweep — what each finding was compared against

Searched `LEDGER_EVIDENCE.md` **by artifact, not by wording** (`§1t1523s0§.as:2344`, `§1t99s0§.as:3094`,
`:3272`, `:249`, `:3162`, `maxreload`, `slashLength`, `reinforce`, `STAT_DAN`, `tenthGold`), then
`SEEN_CLAIM_IDS.txt` for prior ids.

- **Findings 1 & 4** vs `[[combat-core/300-200-100-is-base-not-ceiling]]`, `[[cite-s27b/stance-damage-ceiling-is-mastery-10-not-mastery-9]]`, `[[combat-core/mastery-caps-at-ten]]`, LEDGER_EVIDENCE :45, :660-676, :3082-3084, :3370, :1412 — one live contradiction (the wiki triple; new finding 2), one latent one (RR:155 bundling; new finding 3). Otherwise duplicates that agree.
- **Findings 2 & 7** vs `[[actionscript/crit-is-focus-gated-deterministic]]`, `[[skills-meters/maxreload-is-192]]`, `[[combat-core/web-maxreload-192-and-48-offset]]`, LEDGER_EVIDENCE :407-413, :469, :1506-1510, :1984, :2119 — **no live contradiction.** The apparent one between the two packet-mates (`Math.random()` at `:3258` vs `:3281`) is FALSE: I opened both lines; both exist.
- **Finding 3** vs LEDGER_EVIDENCE :691, :697-702, :998-999, :1002-1012, :1204 — **live contradiction, settled against the packet finding.**
- **Finding 5** vs `[[lens3/reinforce-tiers-are-web-code-not-a-string-table-inference]]`, `[[hunter-s26c/web-parity-for-the-three-tier-reinforce]]`, `[[payload/reinforce-has-three-material-tiers-not-two]]`, LEDGER_EVIDENCE :834, :1186-1197, :3379-3381 — no contradiction; parity caveat discharged.
- **Finding 6** vs `[[combat-core/in-combat-stance-cycling-is-live-code-in-v0717]]`, `[[combat-core/the-real-in-combat-stance-rule-is-actionstate-gate-AND-meter-48]]`, `[[combat-core/the-in-combat-stance-gate-is-reload-48-of-a-192-max]]`, LEDGER_EVIDENCE :207-213, :285, :606-628, :710-724, :938-949, :1993-1995, :2031 — **live contradiction inside the upheld corpus, settled in the packet finding's favour.**

### C2 build-parity check (run before declaring any contradiction)

Every divergence I hit was a genuine two-build split, and in each case both sides were correctly labelled,
so none of them is a real contradiction:

| Quantity | web v0.717 | android v0.682 |
|---|---|---|
| `maxreload` | `8*24 = 192` (`§1t99s0§.as:249`) | `5*24 = 120` (`MCSPlayer.as:239`) |
| in-battle stance cost | flat `−48` (`:3162`) | `>max/2 → max/3` else `−max/6` (`:3098-3105`) |
| stance gate | `reload >= 48` (`:3050`, `:3060`) | `reload < max/6` (`:2977`) |
| HUD normalisation | `(r−48)/(max−48)` (`§1t113s0§.as:328`) | `(r−24)/(max−24)` (`MCSPlayer.as:3272`) |
| crit multiplier | flat `×1.3` (`:3274`) | `×1.5` Light / `×1.2` other (`:3215-3221`) |
| reach multipliers | `1.4` / `1+0.02m` / `0.5+0.04m` | `1.5` / `1+0.005M` / `0.5+0.005M` |
| rebirth gold | `25` / `100` at DAN 8 (`§1t1523s0§.as:2646/:2651`) | `5` / `20` (`StatsManager.as:2203/:2207`) |
| **base slash length** | **identical** (`:2346-2347` ≡ `StatsManager.as:1917-1918`) | **identical** |
| stage | `800×480` (`§1t1523s0§.as:104/:106`) | `800×480` (`StatsManager.as:80/:82`) |

---

## New findings (5)

1. **`lens3-s27e/an-upheld-finding-says-the-in-combat-stance-switch-is-free-and-it-is-not`** — A2, web v0.717, HELD.
   `LEDGER_EVIDENCE.md:943` cites only the gate and the cycle body; the `−48` lives one function down in
   `§1t3489s0§` at `§1t99s0§.as:3160-3166`. Truncated read, not a build artefact — *both* builds charge.
2. **`lens3-s27e/the-wiki-reach-triple-reproduces-exactly-only-under-android-arithmetic`** — A2, both builds, HELD.
   300/200/100 = `InputManager.as:51` default 200 × android 1.5/1.0/0.5, exactly. Web can't reach it: web
   Light is 1.4, so the web ratio is 2.8 : 2 : 1, never 3 : 2 : 1. The triple must stop being used to
   validate a v0.717 build.
3. **`lens3-s27e/rr155-bundles-two-tables-and-the-two-upheld-fixes-destroy-each-other-unless-it-is-split`** — A2, web v0.717, HELD, **overturns RR:155.**
   Damage and reach scale in **opposite** directions with mastery (dmg Light `0.5+0.04m`, reach Light flat
   `1.4`). The damage table needs re-labelling UP a rung (mastery-10), the reach triple DOWN to mastery-0 —
   in the same sentence. Split it before either correction lands.
4. **`lens3-s27e/the-stats-panel-omits-the-100px-floor-so-the-displayed-reach-is-not-the-engine-reach`** — A2, HELD.
   Engine clamps Heavy/Dual at 100 (`:3117-3119`, `:3143-3145`); the panel prints the unfloored product
   (`§1t5957s0§.as:3013`). At DAN 0 / SPD 1 the panel reads **62** where the engine gives **100**.
5. **`lens3-s27e/800x480-cannot-carry-one-uniform-2.4x-into-a-1080p-frame`** — A2, PARTIAL.
   `stageWidth 800` / `stageHeight 480` is 5:3; 1920×1080 is 16:9. 1920/800 = 2.40 but 1080/480 = 2.25.
   The banked "×2.4 screen px per stage px" is width-fit only, and `InputManager.as:223-224` shows the game
   explicitly supports letterboxing (`stageOffsetX/Y`, `stageScale`). **Not closed:** which fit the two
   longplays used — that needs one frame, and I did not open one.

---

## Standing-invariant note

No frame-vs-doc conflict arose in this packet: every verdict here is A2 (decompiled source), and the one
place a frame is still required — the stage-to-capture fit in new finding 5 — I have left open rather than
guessed. **STILL_UNHELD is the honest answer there.**
