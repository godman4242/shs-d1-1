# L0 CRITIC — CITE LENS — unit: progression

Reviewer: blind critic (never saw the surveyor's reasoning; only its output + the artifacts).
Date: 2026-08-15. Lane: L4 progression. Journal under review:
`/Users/kheshav/kheshav-code/SSHD 1-1/docs/gauntlet/L0/systems/progression.md` (score claimed 88).

**Method.** Every cite below was opened first-hand. Payload lines were read with `Read`
at the exact offsets; the two A1 video claims were re-extracted from
`reference/videos/zFtCaTO0_1M.mp4` with my own `ffmpeg` crops; the A3 test was re-run.
Where the surveyor gave a derived number I recomputed it in Python rather than trusting it.

**Headline: 19 of 20 claims survive. One is materially wrong.**

---

## 1. What refutes

### `progression/start-pools-and-respec` — REFUTED on "free"

The claim: *"…the same function is the game's respec, which is **free**, total, and refunds
(level-1)*3 points."*

The start pools and the refund are correct — I read
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2559-2580` and it is exactly the
android `unAssignStatPoints()` body, HP10 / Chi10 / ATK1 / DEF1 / SPD1 / AP30 and
`§1t7357s0§(§1t9419s0§,(getLevel() - 1) * 3)` at :2577. That half stands.

But "free" is ungrounded, and the artifact says the opposite. The respec is not a menu
button — it is reached **only** through an item modifier:

```
reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991
   if(modid == 78)
   {
      StatsManager.unAssignStatPoints();
   }
   else if(modid == 79)
   {
      StatsManager.unAssignSkillPoints();
   }
```

The item carrying modifiers 78 + 79 is item 2200, and it is a **premium-currency** item:

```
reference/extracted/itemdata.xml:2267-2280
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

Resolved through the Stage-0b string table
(`docs/gauntlet/L0/index/strings.json`): `4130` = **"Amnesia Scroll"**, `4136` =
**"Use this to unassign your stat and skill points."**

`baseprice 0` + `heavenlyprice 5` is the signature of an IAP/premium item, not a free one —
`heavenlyprice` is the same currency as `STAT_HGOLD` (StatsManager.as:194), which is a
*different stat id* from `STAT_GOLD` (:192). So a respec costs 5 heavenly gold and consumes a
unique item. Porting this as a free, unlimited respec would be a real design error: it
changes the whole stat-commitment loop from "costless experimentation" to "premium-gated,
one-shot".

Severity: **material**. The headline (start pools) is right; one adjective is wrong and would
be ported wrong.

---

## 2. What holds — the load-bearing checks

### `progression/xp-curve-l11-80` — HELD, and it is the real thing

This is the claim that kills a §6 "structurally UNRECOVERABLE" entry, so I checked it hardest.

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` is present verbatim, opening
`public static const §1t5923s0§:Array = [0,550,1450,2950,5150,...`. I parsed it rather than
eyeballing it:

```
len 99
[1]=550  [2]=1450  [3]=2950  [4]=5150  [10]=31400  [11]=37400
[20]=108000  [40]=507300  [60]=1508800  [80]=4285800  [98]=29395800
```

Every index the surveyor quoted is exact. The duplicate at `§1t29s0§.as:28` exists. And the
byte-identity assertion is true — I string-compared the two bracket bodies:

```
web §1t1523s0§.as:364  vs  android StatsManager.as:78   ->  identical: True
```

Ledger text confirmed verbatim at `docs/research/REBUILD_READINESS.md:200` and the §6 entry at
`:350`. Blocker ② is dead and §6 line 350 must be struck.

### `progression/inferred-extrapolation-error` — HELD, recomputed independently

`src/config/xp.ts:28` is `export const XP_DELTA_STEP = 500;`. I reimplemented
`xpThreshold`'s loop from `src/core/xp.ts` and diffed against the real array:

```
L11 real 37400     inferred 37400     +0.0%
L12 real 43500     inferred 43900     +0.9%
L20 real 108000    inferred 113900    +5.5%
L40 real 507300    inferred 428900   -15.5%
L60 real 1508800   inferred 943900   -37.4%
L80 real 4285800   inferred 1658900  -61.3%
```

Every figure matches the claim to the decimal. (Worth noting for the porter: the
extrapolation is *exactly right at L11* and only diverges from L12 — which is why it looked
plausible for so long. At L98 it is -91.6% off.)

### `progression/l1-l10-caps-confirmed` — HELD, test re-run

```
✓ tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly 2ms
 Test Files  1 passed (1)      Tests  11 passed (11)
```

Config holds `[550,1450,2950,5150,8350,12150,16350,20900,25900,31400]` = `expArray[1..10]`. The
video study got all ten right from frames alone.

### `progression/frame-confirms-xp-caps` — HELD (I opened the video myself)

I re-extracted both moments from `reference/videos/zFtCaTO0_1M.mp4`.

- `-ss 1600`, crop `iw*0.62:ih*0.40:iw*0.36:ih*0.10` @1.6× lanczos — **visibly**: fan level badge
  `4`, gold XP bar `5110 / 5150` over `EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`,
  `HP 20 / 20` (green), `CHI 9 / 15` (blue), `AP 15 / 30`, `ATK 10`, `DEF 10 + 13` (the `+ 13`
  in orange), `SPD 4`, `GOLD 3`; and in a lower crop `WEIGHT: 73 / 100`.
- `-ss 655`, same crop — **visibly**: level badge `3`, `2098 / 2950 EXPERIENCE POINTS`,
  `AVAILABLE STAT POINTS: 0`.

`5150 = expArray[4]` and `2950 = expArray[3]`. Frame and payload agree; there is no conflict to
adjudicate here, exactly as claimed.

*Cite nit (not a refutation):* the surveyor's stated crops
(`ih*0.20 … ih*0.16` and `ih*0.22 … ih*0.09`) clip the level badge and the top of the XP
numerals — at those exact parameters you cannot read the `4` or the `5110 / 5150` the claim
quotes. The readings are all correct at a slightly taller crop. State a crop that actually
contains what you quote.

### `progression/per-point-magnitudes` — HELD, and the symbol mapping is not assumed

Both sides resolve verbatim:

- Web `§1t5957s0§.as:3393-3394` `§1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9403s0§,10);`
  · `:3406` Chi `,5` · `:3414` `§1t1523s0§.§1t9609s0§(5)` · `:3422/:3434/:3443` ATK/DEF/SPD `,3`.
- Android `InventoryUI.as:2417/2424/2432/2439/2446/2453` — `5 / 5 / addMaxAP(1) / 1 / 1 / 1`.

I checked `§1t9609s0§` is really `addMaxAP` rather than taking it on trust:
`§1t1523s0§.as:2807` `public static function §1t9609s0§(param1:int)` → body
`§1t9713s0§(§1t9415s0§,param1)` = `changeStat(STAT_MAXAP,num)`, structurally identical to
android `addMaxAP`. So web is genuinely **+5 MaxAP per point** and the ledger's "+1AP" is wrong.

The decoder-ring is sound — the stat ids are numerically identical across builds:

```
web §1t1523s0§.as     android StatsManager.as
 §1t9403s0§ = 1        STAT_MAXHP      = 1
 §1t9406s0§ = 4        STAT_MAXCHI     = 4
 §1t9408s0§ = 6        STAT_ATTACK     = 6
 §1t9409s0§ = 7        STAT_DEFENSE    = 7
 §1t9410s0§ = 8        STAT_SPEED      = 8
 §1t9411s0§ = 10       STAT_LEVEL      = 10
 §1t9415s0§ = 14       STAT_MAXAP      = 14
 §1t9418s0§ = 17       STAT_SKILLPOINTS= 17
 §1t9419s0§ = 18       STAT_STATPOINTS = 18
 §1t9426s0§ = 25       STAT_DAN        = 25
```

Two things the surveyor did not use, both of which **strengthen** the verdict:

1. The web build reverse-computes spent points at `§1t5957s0§.as:3454-3459` —
   `(MAXHP-10)/10`, `(MAXCHI-10)/5`, `(MAXAP-30)/5`, `(ATK-1)/3`, `(DEF-1)/3`, `(SPD-1)/3` —
   an in-build restatement of both the magnitudes *and* the start pools.
2. The android build's own cap formulas at `InventoryUI.as:2407-2412`
   (`< 10+(lvl+10)*5`, `< 20+(lvl+10)`, `< lvl+10`) are internally consistent with its
   +5/+1 magnitudes and differ from the web caps. Each build is self-consistent; they are
   simply two different tunings. The parity caveat from Stage-0b S0-3 is now concrete.

See §3 for a much stronger frame proof of the same fact.

### `progression/per-stat-hard-caps` and `progression/271-cap-explained` — both HELD

`§1t5957s0§.as:3341-3346` reads exactly as quoted. Arithmetic check: because the guard is a
strict `<` and the increments divide the bound evenly, the bound is *attained*, not
approached — ATK steps 1,4,…,268 then one more click lands exactly on 271, after which
`271 < 271` is false. So L80 ceilings are HP 910 / Chi 460 / AP 480 / ATK-DEF-SPD 271, as
claimed.

Reachability: 271 needs `(271-1)/3 = 90` points; the first-run budget is `(80-1)*3 = 237`
(`§1t1523s0§.as:2577`, `:362` levelCap 80). 90 ≤ 237, so it *is* reachable in one stat. The
ledger's Surface bullet at `REBUILD_READINESS.md:201` — "237-point first-run budget makes it
impossible in one stat" — assumed +1 per point and is refuted. The surveyor's correction is
right, and its characterisation as a *base-stat* ceiling (gear's `+13` sits outside it) matches
the frame, where DEF renders as `10 + 13`.

### `progression/post-rebirth-sp` + `sp-first-run-off-by-one` + `levelup-refill-and-cap` — HELD

- `§1t1523s0§.as:2598` = `getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1)`, i.e.
  `SP = (level-1) + Dan*79`. Android `StatsManager.as:2156` is the clear-named twin. At
  Dan 9 / L80 → 790. Blocker ③ dies.
- `§1t1523s0§.as:2074-2075` = `+1 STAT_SKILLPOINTS`, `+3 STAT_STATPOINTS` per level-up.
  79 level-ups L1→L80 ⇒ **79** SP, not 80. Off-by-one confirmed.
- `doRebirth()` at `StatsManager.as:2195-2232` verified line-for-line: `:2229`
  `unAssignStatPoints();` and **no** `unAssignSkillPoints()` call; the skill-slot vector is
  reset inline at `:2215-2218` to `skillSlots[0] = new IntStat(1003,1)`. Dan cap 9 at `:2209`.
  Every detail of the surveyor's note is accurate.
- `levelUp()` `:1646-1694`: `fullHealth()`, `setStat(STAT_AP, MAXAP)`,
  `setStat(STAT_DUELTOKENS, MAXDUELTOKENS)` — duel tokens do refill. Dual cap enforcement
  confirmed: `:1619` `reportHack("changeXP levelcap")` and `LootDialog.as:644`
  `if(StatsManager.getLevel() < StatsManager.levelCap)`. `autoAssignStats` at `:1655-1687`
  is as described.

*Cite nit:* the quote block for `levelup-refill-and-cap` labels those three lines 1688/1689/1690;
they are actually **1689/1690/1691**. The range cite `:1646-1692` is correct and the quoted
text is verbatim, so this is sloppiness, not a bad claim. Same pattern in `ap-regen`, whose
quote labels `:1099-1103` a block that runs 1099-**1105**.

### `progression/def-mitigation-is-flat` — HELD

Web `§1t99s0§.as:3284-3291` (getDefense, `HEAVY_STANCE → defense * 0.8`) and `:3484-3487`
(`_loc5_ -= this.§1t4477s0§();` then floor at `param2.§1t1088s0§()`) both read exactly as
quoted; android `MCSPlayer.as:3231-3237` / `:3415-3418` likewise. There is no curve — it is
flat subtraction floored at the attack's minDamage. Blocker ①'s DEF half dies.

The string-table corroboration checks out and is better than advertised: skilldata skill 1002
resolves via `displayname 6004` → **"Heavy Stance Mastery"**, `desc 6005` →
*"Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\n
Effective against Balanced Stance.\nDefense -20%"*. That single string independently confirms
**both** the ×0.8 defence and the per-stance slash-range modifier the SPD claim leans on.

### `progression/spd-scaling` — HELD, every line exact

- Reload: web `§1t1523s0§.as:2276` / android `:1841` — `48 + spd*6`.
- Cooldown: web `:2295` `return 1 - param1 / 600 * 0.5;` (clamp 600) vs android `:1860`
  `return 1 - speed / 300 * 0.5;` (clamp 300). **The web/android drift is real and I confirmed
  it on both sides** — a second, independent demonstration that the android build is retuned.
- Slash length: web `§1t9593s0§` at `:2346-2347` / android `getBaseSlashLengthVal` at
  `:1917-1918` — `120 + floor((90 + Dan*5) * spd / (20 + spd))`. Floor 120 at spd 0, Dan-0
  asymptote 210. Both correct.
- Speed buff pre-multiplies by 1.5 in both.

The cross-lane gift to L1 combat-core is legitimate: this getter *is* the reach model.

### `progression/xp-income-model` + `quest-xp-tabled` + `unlock-cadence-to-l80` + `campaign-level-band` — HELD

- `NPC.as:166-190` `calcXP`, `:94-109` `getGreyLevel`, `:112-164` `getZeroDifference` all
  verbatim. `NPC.as:218` `this.xp = this.level * 2 + 20;` and `:252` likewise; web parity at
  `§1t4574s0§.as:39`. Duellist base `lvl * 5 + 45` at `ConnectionPIO.as:643` and web
  `§1t4902s0§.as:26`. `EnemyPlayer.as:1316` sub-L10 ×3. `LootDialog.as:640-642` buff ×1.5.
  `src/config/duel.ts:55-56` does hold `XP_PER_LEVEL = 5` / `XP_REWARD_BASE = 45`.
- `questdata.xml:214-216` and `:411-413` are the `<reward><exp>290|200</exp></reward>` blocks
  claimed; index confirms 69 rows, range 100–3000 (10 distinct values). Consumed at
  `Overworld.as:318`.
- Unlock ladder: I rebuilt it from scratch from `skilldata.xml` + `strings.json` and got **33
  rows, identical to the surveyor's table, in the same order** — L3 Roll … L80 Mass Shadow
  Clone, including the 7-skill L5 tier and the 6-skill L50 tier. `skilldata.xml:257` and
  `:1640` are the exact anchor lines. `getSkillSlotCount()` = `3 + getStat(1008)` at
  `StatsManager.as:2293-2295` and `getCarryingWeight()` = `100 + getStat(1009)*20` at
  `:2298-2300` — both exact, and the frame's `WEIGHT: 73 / 100` is indeed the un-upgraded base.
- Level band: index rows confirmed (`wave/enemy/lvl` 142 @ 2–35; `wave/friend/lvl` 9 @ 25–80;
  `roomobj/…/wave/enemy/lvl` 18 @ 25). "Both longplays cap at L10" is a capture limit.

### `progression/levels-81-99` — STILL_UNHELD is the correct answer, and it is honest

I tried to break it. Across `questdata / skilldata / npcdata / itemdata` there is **no**
`<lvl> / <lvlreq> / <level>` value between 81 and 199, and **zero** strings in the 2,533-entry
table match `level 8[1-9]|9\d`. Nothing contradicts the surveyor. Correctly left open.

### `progression/xp-from-gather-and-dungeon` — PARTIAL is correct

`XMLQuestOutcome.as:66` and `InventoryUI.as:906` are exact. And
`docs/research/video-study/segments/A-04-mines-takahasi-coal-mining-quest.md:32` reads exactly
*"XP bar unmoved at 2098/2950 (level 3) for entire segment — no XP awarded from mining or quest
steps shown."* Plumbing held, value not. Honest grading.

---

## 3. NEW — a direct frame proof of +3/point that the surveyor did not use

The surveyor's `per-point-magnitudes` proof is a *budget reconstruction*: it assumes the whole
spend history and shows the totals reconcile at 9 points. That is sound but indirect. There is
a far stronger artifact sitting in the same video, and it settles the question on the frame
alone.

`reference/videos/zFtCaTO0_1M.mp4`, `-ss 456 / 459 / 462`, crop
`iw*0.62:ih*0.42:iw*0.36:ih*0.09` (no upscale needed — the panel is large):

| t | AVAILABLE STAT POINTS | ATK | DEF | SPD | HP | CHI | AP |
|---|---|---|---|---|---|---|---|
| 456 | **3** | 4 | 4 + 2 | **1** | 20/20 | 10/10 | 30/30 |
| 459 | **2** | 4 | 4 + 2 | **4** | 20/20 | 10/10 | 30/30 |
| 462 | **0** | **7** | **7** + 2 | 4 | 20/20 | 10/10 | 30/30 |

Between t=456 and t=459 **exactly one** stat point is spent (3 → 2) and SPD moves **1 → 4**.
That is a single click producing **+3**, observed on screen, with no reconstruction required.
The next two points take ATK 4→7 and DEF 4→7 — +3 each. The android model (+1) is impossible
on this frame.

This also independently reproduces the budget arithmetic at a *different level* from the
surveyor's: at t=462 the character is level 3, so the budget is `(3-1)*3 = 6` and the panel
reads 0 remaining. Web magnitudes: `(20-10)/10 + (10-10)/5 + (30-30)/5 + (7-1)/3 + (7-1)/3 +
(4-1)/3 = 1+0+0+2+2+1 = 6` ✓. Android magnitudes give 17 ✗.

**Frame vs doc, and the frame wins:**
`docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:25` looked
at this same moment and wrote *"…spending the 3 stat points 1-for-1 per stat click … likely +1
stat point grants +3 to the underlying stat … treat exact point-to-stat ratio as INFERRED,
needs frame-by-frame combat-panel replay to confirm."* The replay it asked for is above. The
ratio is **+3 per point**, CONTRACT, no longer INFERRED — confirmed by the frame *and* by
`§1t5957s0§.as:3422/3434/3443`. The surveyor was right to say this closes A-02:25; it just
had a stronger cite available than the one it used.

## 4. NEW — the rebirth payout is heavenly gold, not gold

`levelup-refill-and-cap`'s lane_impact says rebirth pays "+5 gold or +20 at Dan 8". The code at
`StatsManager.as:2201-2208` pays **`STAT_HGOLD`**, which is stat id **12**, a different stat
from `STAT_GOLD` = **11** (`:192`, `:194`). `HGOLD` is the currency `itemdata.xml`'s
`<heavenlyprice>` is denominated in — the premium tier. Rebirth therefore hands out premium
currency, which is a materially different economic fact from handing out soft gold, and it is
the same currency that gates the Amnesia Scroll in §1. L5 rebirth-elements and L7 economy
should both take the corrected version.

## 4b. NEW — the payload validates its own XP table, with no frame needed

Item 2201 is a second premium scroll, and it is an unintended oracle for the XP curve:

```
reference/extracted/itemdata.xml:2284-2302
   <id>2201</id>
   <name>4131</name>          -> "Level 10 Scroll"
   <desc>4137</desc>          -> "Use this to become level 10"
   <heavenlyprice>2</heavenlyprice>
   <modifier><id>9</id><value>-1000000</value></modifier>
   <modifier><id>9</id><value>25900</value></modifier>
```

Modifier id 9 is XP (`StatsManager.as:188` `STAT_XP:int = 9`; consumed at
`InventoryUI.as:904-906` `if(modid == 9) { StatsManager.changeXP(...) }`). The pair zeroes XP
(`changeXP` clamps negatives to 0 at `StatsManager.as:1614-1617`) and then sets it to
**25,900** — which is exactly `expArray[9]`.

So the game itself asserts: *cumulative XP 25,900 ⇒ level 10*. That independently confirms
(a) the L1–L10 values and (b) the **threshold semantics** already encoded in `src/core/xp.ts`
— level N holds while `xpThreshold(N-1) <= totalXp < xpThreshold(N)`, so hitting a cap
finishes the level. Worth banking: it is a payload-internal cross-check of the curve that
depends on no frame and no video reading at all.

---

## 5. Verdict on the unit

The cite discipline here is **high**. I opened 20 cites across 11 files, two video moments and
one test; every file existed, and every quoted line was verbatim except three off-by-one line
*labels* inside quote blocks whose range cites were correct. Nothing was invented. Nothing was
a name-as-held-when-only-an-id-exists violation (the surveyor correctly routed every name
through the Stage-0b string table). The two negative answers (STILL_UNHELD, PARTIAL) are
honest and survived an active attempt to break them.

One material error ("free" respec) and one currency mis-identification (GOLD vs HGOLD), both
in secondary sub-clauses rather than headlines.

**Suggested score adjustment: 88 → 86.** The "free respec" error is the kind that ships: it
would have been ported as an unlimited free respec button, silently changing the stat economy.
Everything the score was actually built on — the 99-entry XP table, the two dead blockers, the
per-point magnitudes — is real, and the per-point finding is in fact better supported than the
journal claims.
