# CRITIC — LENS 3 (PRECEDENCE) — unit: `progression`

Blind adversarial review of `docs/gauntlet/L0/systems/progression.md`.
I did not see the surveyor's reasoning. Every verdict below cites an artifact **I**
opened this pass. Date: 2026-08-15.

**Headline verdict: 18 of 20 claims survive; 2 are refuted in part (both material).**

This is the strongest survey I have reviewed in this gauntlet. The two headline
claims — the 99-entry `expArray` and the frame-arbitrated per-point magnitudes — I
reproduced independently and they are airtight. The refutations are narrow:

1. `progression/start-pools-and-respec` calls the respec **"free"**. It is not. It is
   gated behind a **premium-currency** item ("Amnesia Scroll", 5 heavenly gold).
2. `progression/quest-xp-tabled` says quest XP is **"a table, not a formula"**. Half
   true. Proc-gen daily quests compute XP at runtime, and **the only quest-XP number
   visible in either longplay (473) comes from the formula, not the table** — I
   reproduced it exactly. **THE FRAME WINS over the table-only reading.**

I also log **7 new findings**, two of which are large: the **per-stance slash-length
modifiers** (which close L1 combat-core blocker ① outright, and are *build-divergent*
again), and the **proc-gen quest-XP formula** validated against an on-screen number.

---

## 1. What I re-derived first-hand (so the survey is not taken on trust)

| Surveyor assertion | My independent check | Result |
|---|---|---|
| `expArray` = 99 entries, byte-identical in both builds | python parse of both files | `len 99` both; `values identical: True`; `[11]=37400 [20]=108000 [40]=507300 [60]=1508800 [80]=4285800 [98]=29395800` — **exact** |
| extrapolation error −61.3% @ L80 | re-implemented `src/core/xp.ts` in python against the real array | L11 0.0% · L12 +0.9% · L20 +5.5% · L40 −15.5% · L60 −37.4% · L80 −61.3% — **all five exact** |
| `tests/xp.test.ts` passes, test name verbatim | `npx vitest run tests/xp.test.ts --reporter=verbose` | `Tests 11 passed (11)`; test name matches the pasted string character-for-character |
| frame @ t=1600 reads L4 / 5110 / 5150 / HP20 / CHI9-15 / AP15-30 / ATK10 / DEF10+13 / SPD4 / WEIGHT 73-100 | my own ffmpeg crop `crop=iw*0.62:ih*0.42:iw*0.36:ih*0.12,scale=1.5×` | **every single value visibly present**, plus GOLD 3 |
| frame @ t=655 reads L3 / 2098 / 2950 / WEIGHT 38-100 | same crop | **confirmed** (panel also shows PICKAXE tooltip, "USED FOR MINING", DMG 1–3) |
| 33 `<lvlreq>` rows, range 3–80 | `grep -o … \| sort \| uniq -c` | 33 rows; distribution `L5×7 L20×5 L50×6 L15×2 + 13 singletons` = **exactly** the surveyor's ladder |
| 69 `<exp>` rows, 100–3000 | grep | 69; distinct set `100·200·250·290·500·600·750·1000·2000·3000` |
| 142 quest-wave enemy `<lvl>` 2–35 | my own `ElementTree` walk of questdata.xml | `142 2 35`, friend `9 25 80`, roomobj `18 25 25` — **exact** |
| symbol map android→web | compared the stat-id **integers** in both files | `1/4/6/7/8/10/14/17/18/25` identical in both — the decoder ring is sound |
| web parity of the XP-income model (surveyor cited android only) | read `§1t68s0§.as:113-121, :131-179, :185-208` | greyLevel, zeroDifference and calcXP are **byte-parallel** in web. Benign. |

---

## 2. REFUTED (material) — R1: the respec is not free

`progression/start-pools-and-respec` says *"the same function is the game's respec,
which is **free**, total, and refunds (level-1)*3 points."*

`unAssignStatPoints()` has exactly two callers:

```
InventoryUI.as:986   StatsManager.unAssignStatPoints();     // modid == 78
InventoryUI.as:990   StatsManager.unAssignSkillPoints();    // modid == 79
StatsManager.as:2229 unAssignStatPoints();                  // doRebirth()
```

So outside rebirth it is **item-gated**. The item is `reference/extracted/itemdata.xml:2267-2281`:

```xml
<item>
  <id>2200</id>
  <type>10</type>
  <name>4130</name>
  <unique>1</unique>
  <baseprice>0</baseprice>
  <heavenlyprice>5</heavenlyprice>
  ...
  <modifier><id>78</id></modifier>
  <modifier><id>79</id></modifier>
```

Resolved through the Stage-0b string table: `4130` = **"Amnesia Scroll"**, `4136` =
*"Use this to unassign your stat and skill points."*

`baseprice 0 / heavenlyprice 5` — heavenly gold is the **premium** currency
(`STAT_HGOLD`, the same one `doRebirth()` pays out at +5, or +20 at Dan 8). A respec
therefore costs **5 premium gold and cannot be bought with coins at all**. That is a
different design decision from "free", and it lands on L7 economy, not just L4.

Everything else in the claim (start pools HP10/Chi10/AP30, the missing ATK/DEF/SPD = 1,
the `(level-1)*3` refund) I verified verbatim at `§1t1523s0§.as:2559-2578` and holds.

**Severity: material.** The claim is right about the mechanism, wrong about its price.

---

## 3. REFUTED (material) — R2: quest XP is a table **AND** a formula, and the footage shows the formula

`progression/quest-xp-tabled` asserts *"Quest XP is **a table, not a formula**."*

The 69 `<exp>` rows are real (I counted them). But there is a **second quest system**
the claim misses entirely. `QuestGenerator` builds proc-gen daily-quest reward XML at
runtime — **~28 sites** all of the form:

```
QuestGenerator.as:916   rewardStr += "<exp>" + questReward + "</exp>";
QuestGenerator.as:839   var questReward:int = (StatsManager.getXPLevelThreshhold(nodelvl + 1)
                          - StatsManager.getXPLevelThreshhold(nodelvl)) / ((nodelvl + 1) * 1.2);
StatsManager.as:1604-1606  public static function getXPLevelThreshhold(level:int):int { return expArray[level]; }
```

**WEB parity is present** (so this is not an Android artefact):
`§1t123s0§.as:878, :1039, :1283, :1522` and `§1t27s0§.as:317` carry the identical
`… / ((_loc N_ + 1) * 1.2)` expression.

**And the frame settles it.** The single quest-XP number visible anywhere in the two
longplays is `473 XP` (video B, t=1:01:51, "TAKE ME THERE" waypoint: *473 XP / 35 coins
/ Town Prosperity +10*). **473 is not one of the 69 tabled values.** It is *exactly*
the formula at node level 7:

```
(expArray[8] - expArray[7]) / (8 * 1.2) = (20900 - 16350) / 9.6 = 473.958 → int → 473
```

I computed the whole neighbourhood to be sure it is not a coincidence:
`nodelvl 5→527 · 6→500 · 7→473 · 8→462 · 9→458 · 10→454 · 11→423`. Only 7 hits.

**THE FRAME WINS over the table-only reading**, and it wins doubly: the same
arithmetic is an *independent validation of the newly-recovered `expArray`*, since the
formula consumes it.

**Severity: material.** Blocker ④'s quest side is *more* closed than the surveyor
said — but a port that follows this claim literally would ship only the 61 authored
quests' XP and silently drop the entire daily-quest faucet.

---

## 4. NEW FINDINGS

### N1 — ⭐ The per-stance slash-length modifiers are HELD, and they are BUILD-DIVERGENT (closes L1 combat-core ①)

`progression/spd-scaling` hands L1 a "cross-lane gift" and then stops one function
short: *"with per-stance modifiers applied on top"* — unlocated. They are in the very
file the surveyor already had open for the DEF claim.

**WEB v0.717 — `§1t99s0§.as:3093, 3105, 3115-3119, 3130, 3141-3145`:**

```
LIGHT     slashLength = baseSlashLength * 1.4
BALANCED  slashLength = baseSlashLength * (1 + 0.2 * balancedMastery * 0.1)
HEAVY     slashLength = baseSlashLength * (0.5 + 0.4 * heavyMastery * 0.1);  if (< 100) = 100
REVERSED  slashLength = baseSlashLength * 1.4
DUAL      slashLength = baseSlashLength;                                      if (< 100) = 100
```

**ANDROID v0.682 — `MCSPlayer.as:3030, 3041, 3052-3055, 3067, 3078-3081` — DIFFERENT:**

```
LIGHT     * 1.5                              (web 1.4)
BALANCED  * (1 + 0.5 * balancedMastery * 0.01)   (web 1 + 0.2*m*0.1  →  0.02/pt vs 0.005/pt)
HEAVY     * (0.5 + 0.5 * heavyMastery * 0.01)    (web 0.5 + 0.4*m*0.1 → 0.04/pt vs 0.005/pt)
```

This is the **second independent proof in this lane** that Android is differently
tuned — it generalises the surveyor's own S0-3 caveat from "per-point magnitudes" to
"combat tuning in general". Port from WEB.

**The measurement ledger corroborates the web numbers rather than contradicting them.**
`COMBAT_MEASUREMENTS.md §S24-B` measured 30 strokes at **120–280 px @1080 = 53–124
world px**, and the wiki ceilings in `§S24-B/c-0` are **Light 300 / Balanced 200 /
Heavy 100**. Against the payload: HEAVY's hard floor is literally **100** ✓, and
LIGHT at the Dan-1 asymptote is `(120+95) × 1.4 = 301` ≈ **300** ✓. Every measured
stroke sits *under* the corresponding cap, which is exactly what a truncation cap
predicts. **L1 combat-core blocker ① ("reach cap in stage px per stance — the one
value the whole model needs") is now fully held, not partially.**

### N2 — ⭐ Proc-gen quest-XP formula (see §3) — validated against an on-screen 473

`(expArray[n+1] - expArray[n]) / ((n+1) * 1.2)`, web parity confirmed. Overturns
REBUILD_READINESS §4 progression blocker ④ *and* the surveyor's own claim 15.

### N3 — There is provably NO gather/mine/farm XP path

`progression/xp-from-gather-and-dungeon` is graded PARTIAL ("plumbing held, value
not"). It can be graded stronger. I enumerated **every** `addLootXP` call site in the
build:

```
NPC.as:863                     mob kill        calcXP(playerLvl, level, xp=lvl*2+20, false)
EnemyPlayer.as:1318/1322/1327  duellist/boss   calcXP(..., xp=lvl*5+45, elite)
NetworkManager.as:1268/1272/2818/2822 + ConnectionPIO.as:643/647   PvP
Overworld.as:318               quest step      reward.exp
XMLQuestOutcome.as:66          quest outcome   this.modify
LootDialog.as:638              (the definition)
```

Plus one non-loot path, `InventoryUI.as:906  StatsManager.changeXP(item.modifierXML[i].value)`
(item modifier id 9). **That is the complete set — there is no gathering call site at
all.** So the honest finding is not "value not held"; it is *"a dedicated gather-XP
number does not exist; gathering XP can only arrive as a quest outcome."* Which is
exactly what video-study `A-04` observed on camera (XP bar frozen at 2098/2950 through
an entire mining session) — **the code and the frame agree**.

### N4 — Levels 81–99 are closed for the WEB build specifically

`progression/levels-81-99` is honestly STILL_UNHELD and I do not refute it. But it is
partly closable: in web v0.717 the cap is a **compile-time constant** —
`§1t1523s0§.as:362  public static const §1t9470s0§:int = 80;` — whereas Android has
`StatsManager.as:76  public static var levelCap:int = 80;` (mutable, server-settable).
On the shipped web build 81+ was structurally unreachable. Corroborating dead
headroom: `§1t68s0§.as:176-179` ends `if(_loc1_ < 80) { return 17; } return 17;` — a
band that was authored and never differentiated.

### N5 — A paid level-skip item exists (progression economy)

`itemdata.xml:2283-2305` item **2201**, `baseprice 0 / heavenlyprice 2`, name `4131` =
**"Level 10 Scroll"**, desc `4137` = *"Use this to become level 10"*. Its modifiers are
`id 9 value -1000000` then `id 9 value 25900` — i.e. zero the XP, then set it to
`expArray[9] = 25900`. This is an independent payload-side confirmation of the
**cumulative-threshold semantics** the config already encodes (`xp == expArray[N-1]`
⇒ level N), and it belongs on the L4/L7 boards.

### N6 — A second anti-cheat gate the survey missed

`progression/levelup-refill-and-cap` reports the `newlevel > levelCap` hack report.
There is a second one immediately below it: `StatsManager.as:1625-1629` —
`if(!consoleEnabled && leveldiff >= 5) { reportHack("changeXP many levels"); return false; }`.
**A single XP grant may never cross 5 levels**, which caps any single reward's
effective size and matters for the Level 10 Scroll and for big quest payouts.

### N7 — ⭐ The per-point magnitudes are confirmed by a SECOND frame at a SECOND level

`progression/per-point-magnitudes` rests its frame arbitration on one frame (L4). I
extracted a second one myself — **video A, t=464 s, `crop=iw*0.62:ih*0.42:iw*0.36:ih*0.12,
scale=1.5×`**. Visibly in the crop: level badge **3**, `1502 / 2950 EXPERIENCE POINTS`,
`AVAILABLE STAT POINTS: 0`, HP `20/20`, CHI `10/10`, AP `30/30`, ATK `7`, DEF `7 + 2`
(orange = gear), SPD `4`, `WEIGHT: 23 / 100`.

Budget at L3 = `(3-1)*3 = 6`, all spent. Web magnitudes:

```
HP  20 = 10 + 10×1  → 1 pt      ATK 7 = 1 + 3×2 → 2 pt
CHI 10 = 10 + 5×0   → 0 pt      DEF 7 = 1 + 3×2 → 2 pt
AP  30 = 30 + 5×0   → 0 pt      SPD 4 = 1 + 3×1 → 1 pt      TOTAL = 6 ✓ EXACT
```

Android magnitudes would require `2+0+0+6+6+3 = 17` ≠ 6 ✗.

And the L3→L4 delta between my two frames is *exactly one level's grant*: ATK 7→10
(1 pt), DEF 7→10 (1 pt), CHI 10→15 (1 pt) = 3 = `+3 stat points per level`.
**Two frames, two consecutive levels, exact to the point.** The arbitration is not
merely defensible — it is over-determined.

(Note: `docs/research/video-study/segments/A-02-…md:25` already *observed* the +3
ratio from this same panel and flagged it INFERRED. The surveyor cited that line only
as "an open INFERRED flag it closes" and did not notice it is a second independent
confirmation of the very magnitudes it was arbitrating.)

---

## 5. Precision notes that do NOT rise to refutation

- **`progression/per-stat-hard-caps`** — the cited lines set `statsPanel.HPadd.visible`
  etc. They are a **spend gate** (the "+" button hides), not a clamp on gear/buff
  totals. The frame shows `DEF 10 + 13` where the +13 is gear and sits outside the cap.
  The surveyor's companion claim already calls it a "UI cap", so this is internally
  consistent — but a porter must not clamp the *displayed total*.
- **`progression/271-cap-explained`** — arithmetic verified (`1+(80+10)*3 = 271`;
  from base 1 in steps of 3, 271 needs exactly 90 of the 237 points, so reachable).
  I could not trace where the ledger's "271" originally came from — `grep -rn 271
  docs/research/` returns only unrelated px measurements. The identification is
  inferential, but the arithmetic coincidence is exact.
- **`progression/xp-income-model`** — cites `NPC.as:112-164 (getZeroDifference)` with
  line-perfect accuracy but never states its contents, and the claim text calls the
  scaling "symmetric". It is not: the over-level divisor is a **13-band step function
  of PLAYER level** returning 5→17 (`<8:5, <10:6, <12:7, <16:8, <20:9, <30:11, <40:12,
  <45:13, <50:14, <55:15, <60:16, else 17`), while the under-level side is a flat
  `1 + 0.05Δ`. Incomplete, not wrong — but a porter reading only the claim text would
  build the wrong curve.
- **`progression/post-rebirth-sp`** — verified verbatim in both builds, and Dan caps at
  9 (`StatsManager.as:2209  if(getPlayerStats(STAT_DAN) < 9)`), so 10 ranks and 790
  lifetime SP is right. Worth stating explicitly: the formula lives inside
  `unAssignSkillPoints()` (the **respec**), and `doRebirth()` does not call it. It is
  the budget **invariant**, not a grant site. The surveyor already flags the
  non-call, so the claim is self-consistent.
- **`progression/ap-regen`** — "+1 per 60 s" is the steady state; the code actually
  pays a catch-up batch, `diff = Math.floor(timeDiff / APINTERVAL) + 1`.
- **`progression/frame-confirms-xp-caps`** — cite form. §0's A1 asks for a path under
  `reference/frames/`; the surveyor cites the source video plus an ffmpeg recipe. I
  re-ran the recipe and every stated value is there, so the artifact is real and the
  claim is sound — but the crop should be written out under `reference/frames/` so the
  next reader does not have to re-decode 800 MB of video to check it.
- **`progression/levelup-refill-and-cap`** is cited android-only. I confirmed WEB
  parity myself at `§1t1523s0§.as:2073-2081` (`+1 SP, +3 stat pts, fullHealth(),
  AP←MAXAP, DUELTOKENS←MAX`). Benign.

---

## 6. Scoring

The surveyor proposed **88**. On my own reading the evidence supports **86** — the two
material refutations (a premium-priced respec sold as free; a quest-XP model sold as
table-only when the only filmed number comes from the formula) cost more than the new
sub-systems I found gain, because both are *claims a porter would act on directly*.
The lane is nonetheless transformed: **all four 2026-07-20 blockers are dead**, and
`REBUILD_READINESS.md:350` — "L11–80 XP curve — no table published … keep the
extrapolation labeled INFERRED" — should be struck from §6 in the same edit.
