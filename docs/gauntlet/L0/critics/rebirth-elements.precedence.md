# PRECEDENCE CRITIC — unit: rebirth-elements

**Lens 3.** I hunt stale-claiming: a claim that imports a doc statement a later
measurement/ruling/frame overturned, or that cites a doc where a settling artifact
already exists. Every verdict below carries the artifact **I** opened.

**Headline:** 16 of 19 claims survive, and I *strengthened* four of them by finding the
v0.717 desktop confirmation the surveyor said it did not look for or could not find.
**Two claims are refuted**, and one of them is the survey's own parity flag —
`rebirth/stance-slash-multipliers-parity` got the precedence direction exactly
**backwards**. That is the single most important line in this review.

---

## ⛔ REFUTATION 1 (fatal to the claim) — `rebirth/stance-slash-multipliers-parity`

The claim: per-stance slash multipliers are Light ×1.5, Balanced ×(1+0.005·mastery),
Heavy ×(0.5+0.005·mastery); *"I grepped the whole v0.717 desktop tree for the identical
expressions and got zero hits, so parity is NOT established."*

**The desktop code exists. I opened it.**
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083-3153` — the exact structural
analog of `MCSPlayer.setStance` (same five cases, same order, same `setStanceColor`
1/2/3/2/3 sequence, same `< 100` floors on Heavy and Dual):

```
case §1t12220s0§:   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                              // LIGHT
case §1t12221s0§:   this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1); // BALANCED
case §1t12222s0§:   this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); // HEAVY
                    if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
case §1t12224s0§:   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                              // REVERSED
case §1t12223s0§:   this.§1t4417s0§ = this.§1t4420s0§;                                    // DUAL, floor 100
```

Symbol binding proved from the same file, `§1t99s0§.as:182-197` (`initPlayer` analog,
15 params in the android order):
`param10 → §1t4420s0§` = **baseSlashLength**, `param11 → this.slashUsage` (**not
obfuscated** — this is what identifies the class), `param12/13/14 → §1t4421s0§ /
§1t4422s0§ / §1t4423s0§` = **light / balanced / heavy mastery**.
Corroborated by `§1t99s0§.as:222` `this.§1t4420s0§ *= 0.5;` matching
`MCSPlayer.as:222 this.baseSlashLength *= 0.5;`.

### Three separate failures follow

1. **The negative grep is a false negative by construction.** Searching an *obfuscated*
   tree for the *unobfuscated build's literal constants* (`'0.5 + 0.5 *'`, `'1 + 0.5 *'`,
   `'0.005'`) can only miss: the desktop constants are **different numbers**
   (`0.2 … 0.1`, `0.4 … 0.1`, `1.4`). Absence of the android's string is not absence of
   the code. A negative grep is only admissible when the symbol you searched for is
   build-invariant.

2. **The banked numbers are the wrong build's.** v0.717 Light is **×1.4**, not ×1.5.
   The lane's own stated rule ("the desktop value wins", §A7) was applied to heavenly
   gold and then not applied here — in the one place it changes a **combat-core** number.

3. **The ledger correction it questions is CONFIRMED by v0.717, not weakened.**
   The claim's `lane_impact` says: *"mastery is a 0-100 percentage here, not 0-9, so the
   ledger's 'mastery-9 ceiling' framing needs re-checking."* Wrong on both counts:
   - Desktop scales mastery by **`* 0.1`**, i.e. a **0-10 domain**. Heavy reach runs
     `0.5 → 0.9` across it. `REBUILD_READINESS.md` §3 #3 says, verbatim, *"Heavy's reach
     also scales ×0.5→×0.9."* **The ledger is exactly right and the surveyor's flag is
     the stale import.**
   - Even inside the android file the surveyor cited, mastery is a small integer:
     `MCSPlayer.as:3174-3184` gates abilities at `balancedMastery >= 3 / >= 4 / >= 5`.
     A 0-100 percentage would make those thresholds nonsense. The claim is contradicted
     by its own source file.

**Net effect on the board:** the survey's score rationale lists *"v0.717 parity for the
per-stance slash multipliers"* as a remaining gap. **That gap is not real** — the v0.717
values are on disk in a file the surveyor had already fingerprinted. This one is worth
re-running before anything downstream consumes the reach numbers.

---

## ⛔ REFUTATION 2 (material) — `rebirth/unlock-gate-is-stat-threshold`

The core survives: the gate **is** a stat threshold on element ATK at **10 / 30 / 60**,
not a rebirth count. I confirmed the thresholds exhaustively —
`reference/extracted/skilldata.xml`, counted by regex over `<req><has><id>28..31</id>`:
**exactly 24 elemental-gated skills, 3 at qty 10 · 2 at qty 30 · 1 at qty 60, per element.**
Grant site confirmed in **both** builds (`InteractUI.as:848-860` and
`§1t401s0§.as:873-884`: `== 8 → +20`, `< 8 → +10`, then `changeStat(2202,-1)`).

Two statements attached to it are **false**:

**(a) "the entire usable elemental kit lands on the FIRST rebirth into that element."**
Only 3 of 6 do. Fire's qty-10 set is `1013 Fire Breath`, `1025 Fire Element Trap`,
`1029 Fire Kunai`. The AoE ultimate `1070 Inferno` and `1056 Dragon Dance Step: Fire`
sit at **qty 30**; `1060 Dragon Dance Step: Fire II (Later Heaven)` at **qty 60**.
The claim's own three-tier sentence contradicts its closing clause.

**(b) "Gear affixes on stats 28-31 count toward the same threshold."** They do not.
`StatsManager.checkCondition` routes element ids to the **base** stat only:

```
StatsManager.as:4229   else if(id >= 28 && id <= 31) { output = getStat(id); }
StatsManager.as:2928   getStatType(id): if(id < 50) return PLAYERSTAT;
StatsManager.as:3952   case PLAYERSTAT: … return getPlayerStats(id);     // no findBonusStat
```
Same branch in the desktop client at `§1t1523s0§.as:4906`. Gear **does** raise elemental
*damage* (`StatsManager.as:1835` adds `findBonusStat` into `initAttackStats`), but it can
**never** unlock a skill. A rebuild that wires affixes into the unlock check lets a player
skip rebirths entirely.

---

## ✅ CLAIMS I STRENGTHENED (surveyor under-cited its own case)

The survey flagged parity risk on the stance numbers and then banked four other android-only
numeric blocks without the same caveat. I checked those four. **They all hold in v0.717** —
so the caveat was aimed at the one claim where parity actually *fails*, and withheld from
the four where it holds. Precedence hygiene inverted.

| survey claim | desktop v0.717 confirmation I opened |
|---|---|
| `rebirth/aoe-radii-per-element` | `§1t8338s0§.as:36` **600** · `§1t8343s0§.as:38` **400** · `§1t8341s0§.as:37` **200** · `§1t8334s0§.as:72` **50** — all four, verbatim |
| same, launch types | `§1t8341s0§.as:24` uses `§1t9117s0§` (Tornado) while 8338/8343/8334 use `§1t9118s0§` — the LAUNCH_AIR-vs-KNOCKDOWN split is real in v0.717 |
| `rebirth/elemental-damage-ladder` | `§1t8365s0§.as:19-42` carries the identical ladder `0.8/0.9/1/1.1/1.2` with `scale 1→1.4`; also in `§1t8398s0§`, `§1t8359s0§`, `§1t8394s0§` (four classes = four elements) |
| ultimate ×1.5, physical 0 | `§1t8338s0§.as:23` `new §1t67s0§(0,0,§1t67s0§.§1t9118s0§,-1,param3 * 1.5)`; `Damage.as:50` signature confirms slot 5 = fireDamage, slot 1 = physical |
| `combat-core/dan-scaled-slash-length` | `§1t1523s0§.as:2344-2348` **byte-identical formula** `120 + floor((90 + DAN*5) * speed / (20 + speed))` |
| `progression/post-rebirth-sp-economy` | `§1t1523s0§.as:2598` identical; `levelCap` = **80** at `§1t1523s0§.as:362` |
| `rebirth/element-counter-wheel` | `§1t1523s0§.as:2270` — `(WATERATK+b, EARTHATK+b, WINDATK+b, FIREATK+b)` into a 4-param `initElementDefenseStats(FIREDEF, WINDDEF, WATERDEF, EARTHDEF)` (`MCSPlayer.as:260`). Wheel confirmed in v0.717. |

**"stage pixels" is now cited, not asserted.** The survey asserts the slash unit without an
artifact. It holds: `MCSPlayer.as:3094` feeds `slashLength` to `InputManager.setMaxDistance`,
`:2776` to `InputManager.drawEnemyLine` (which draws canvas `graphics` with it as a pixel
run-length, `InputManager.as:487-492`), and `:4638` mixes it directly into a stage
y-coordinate: `startY = endY - this.slashLength / 2;`. Stage px. Confirmed.

⚠ **But the ceiling arithmetic in that claim is stance-blind.** "210 px at Dan 0 → 255 at
Dan 9" is the **base**; on-screen Light reach in v0.717 is `× 1.4` (not the android's 1.5),
so 294 → 357 px. Do not bank the base as the reach.

---

## 🔍 NEW FINDINGS THE SURVEY MISSED

### N1 — §3 #7's "film shows a flat +25 gold" is a PHANTOM SOURCE (Tip-#27 class)
The surveyor overturned §3 #7 with code but did not name **how** #7 went wrong.
`REBUILD_READINESS.md:165` says *"film shows a flat +25 gold every rebirth, no 10th-rebirth
tier."* `REBUILD_READINESS.md:205` says the rebirth flow was *"never filmed — both longplays
pre-rebirth."* **The same ledger, two lines apart in its own §4, says the film both shows and
does not show the rebirth.** Neither could be true of a 10th-rebirth tier anyway: a
pre-rebirth longplay cannot film a Dan 8→9 payout. This is the exact failure mode of
"hold-run per Tip #27" — a confident sourced-sounding sentence with no source behind it.
It should be struck from §3, not merely corrected.

### N2 — the +25 lands in `STAT_HGOLD` (id **12**), not `STAT_GOLD` (id **11**)
`StatsManager.as:192,194`. The naming is inverted relative to the ledger's "100c/3g":
`STAT_GOLD` is set to **100** at character start (`:705`) = the *copper*; `STAT_HGOLD` is
set to **3** in the desktop client (`§1t1523s0§.as:1024`) = the *gold*. A rebuild that wires
"+25 gold" to the stat literally named GOLD pays the wrong currency.

### N3 — ⛔ A single character can NEVER unlock all four Dragon Dance Steps. The arithmetic forbids it.
This overturns the survey's own design rationale. The **only** write to base element ATK in
either bundle is the rebirth grant — I grepped every write site:
`InteractUI.as:851` (+20 at DAN==8) and `:855` (+10 at DAN<8); nothing in `questdata.xml`
(its single `<id>28</id>` at line 10721 is a quest id, not a stat). Rebirth at `STAT_DAN >= 9`
hits **neither** branch — the shipped dev comment in `90_InteractUI_UIData.bin:97` says so:
`"no element boost"`.

So the lifetime budget is **exactly 100 points**: DAN 0..7 = 8 × 10, plus 20 at DAN 8.
Four Dragon Dance Steps require **4 × 30 = 120**. **Impossible.**
Best a solo character can do: one element to 60 + one to 30, or three elements to 30.

Consequence: `rebirth/dragon-dance-bagua-input`'s `lane_impact` — *"which is the whole design
rationale for rebirthing into all four elements"* — is **arithmetically impossible**, and
`rebirth/dragon-dance-teachable` is not a nice-to-have social flavour: **the teaching loop is
load-bearing.** The Later Heaven flip needs nodes {1,2,4,6} = {wind, water, earth, fire}
(`DragonDanceUI.as:70,367`), and no one player can earn all four. A single-player recreation
must substitute the teaching loop or the Later Heaven arrangement is unreachable by design.

### N4 — the survey mislabels which skills are "tier-3"
`rebirth/dragon-dance-bagua-input` calls `1056/1057/1058/1059` *"the four tier-3 passives."*
They are the **qty-30 (3×)** tier, and their tooltips say plain *"Dragon Dance Step for Fire"*.
The qty-60 (6×) tier is `1060/1061/1062/1063` — *"Dragon Dance Step: Fire **II**"*,
*"…for Fire **(Later Heaven)**"*. Verified by parsing `skilldata.xml` for ids 1050-1075.
Side effect: `REBUILD_READINESS.md:206`'s *"Dragon Dance unlocks at 3×/6× same-element
rebirths"* is **exactly right** — Step at 3×, Step II / Later Heaven at 6×. The survey treats
the ledger line as needing correction; it needs only the addition of the 1× tier.

### N5 — the shogo title threshold is off by one between two shipped artifacts
`114_Mobile_AchievementData.bin`: achievement **49 'Renshi'** fires at `<stat>25</stat>
<val>2</val>` (STAT_DAN 2 = displayed Dan 3); achievement **50 'Kyoshi'** at `<val>5</val>`.
But `InventoryUI.as:2285` awards the Renshi suffix from `case 3:` and Kyoshi from `case 6:`.
The achievement names the rank one Dan **earlier** than the nameplate grants the suffix.
A rebuild must pick one; flag it rather than silently averaging.
(Full ladder confirmed while I was in there: cases 3/4/5 → 465 Renshi, 6/7 → 466 Kyoshi,
8/9/default → 467 Hanshi, `InventoryUI.as:2285-2316`. The survey's 3-5 / 6-7 / 8-9 is right.)

### N6 — `rebirth/element-status-effects` can be PARTIALLY closed, not left blank
`Damage.as:1-60` enumerates every field the class carries: `damage, stance, launchType,
attackerlvl, piercingDamage, fireDamage, waterDamage, windDamage, earthDamage, flyVelX,
flyVelY, victimPosX`. **There is no status, buff, DoT or duration field anywhere on the
object**, and `Damage` is the only payload an elemental projectile hands to
`NPCManager.checkHitObject(this, damageObj, radius)`. That is strong negative evidence for
"no per-element status effect". It is not conclusive — the projectile itself is also passed,
so a receiver could branch on its type — so PARTIAL, not HELD. Better than a blank.

---

## Cite hygiene (noted, not refuted)

- `rebirth/elemental-skill-tooltips` is **off by one** on two line numbers: `<chi>50</chi>`
  is `skilldata.xml:1890` and `<cooldown>60</cooldown>` is `:1891` (the quoted 1889/1890 are
  `<required>` and `<chi>`). Values correct, `:1884 qty 30` and `:1882 lvlreq 50` exact.
  Repo rule is *cite symbols, not line numbers* — this is why.
  Its kunai-ammo aside **checks out**: `1025 Fire Element Trap` and `1029 Fire Kunai` both
  read *"Requires kunai ammo."*
- `rebirth/kanji-statue-bonus` and `rebirth/mitigation-flat-min1` are **android-only** cites.
  Both verified verbatim in v0.682 (`Obj_DragonDanceStatue.as:41-62,185,224,239`;
  `MCSPlayer.as:3347-3357,3420`). I could not locate the desktop analogs; given that one in
  three checked numbers moved between builds, label them v0.682 until confirmed.
- `frames.json` has **113 keys but one is `"."`** (the manifest root, 16 loose files) —
  112 real frame directories. Does not change the STILL_UNHELD verdict.

## Where the "frame wins" rule stands in this lane

It genuinely never fires. All 112 frame directories descend from the two longplays
(`Nr4fQstqHDM`, `zFtCaTO0_1M`) plus derived crop/analysis sets; nothing is rebirth-flow
material. And it is *structurally* impossible for a pre-rebirth longplay to show a Dan
title: `InventoryUI.as:2276` renders `danfield.text = ""` at `case 0:`. Both STILL_UNHELD
verdicts are honest and I let them stand.
