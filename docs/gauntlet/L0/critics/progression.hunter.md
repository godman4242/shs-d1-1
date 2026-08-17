# L0 critic — `progression`, HUNTER lens (blind)

Reviewer opened every artifact first-hand. Nothing below rests on the surveyor's prose.
Two frames were re-extracted from the source video and re-cropped by me; every AS3 line
number was re-read with `sed -n`; the 99-entry array was re-parsed with a script rather
than eyeballed; the L3–L80 unlock ladder was re-derived from `skilldata.xml` independently.

**Headline:** this is a strong survey. 18 claims, 16 stand exactly as written, and the
payload cites are unusually precise — line numbers land on the quoted line, not near it.
Two defects found:

- **MATERIAL — `progression/start-pools-and-respec` says the respec is "free". It is not.**
  The only in-data trigger is a **premium-currency consumable**: item 2200 *Amnesia Scroll*,
  `<heavenlyprice>5</heavenlyprice>`, `<baseprice>0</baseprice>`, `<unique>1</unique>`.
- **MINOR — `progression/xp-from-gather-and-dungeon` under-claims.** I closed it: the
  answer is a definitive **negative**, not a gap. Gathering awards **zero** XP in *both*
  builds, provable by exhaustive call-site enumeration.

Plus four things the surveyor missed, all cited below.

---

## Verification log — what I opened

| Claim | What I did | Result |
|---|---|---|
| `xp-curve-l11-80` | parsed `§1t1523s0§.as:364` with python; diffed vs `§1t29s0§.as:28` and `StatsManager.as:78` | `len==99`; all three arrays **byte-identical** (`web1==web2 True`, `web==android True`); `[11]=37400 [20]=108000 [40]=507300 [60]=1508800 [80]=4285800 [98]=29395800` — every index the surveyor quoted |
| `inferred-extrapolation-error` | re-ran the `XP_DELTA_STEP=500` model and diffed | L12 +0.9% · L20 +5.5% · L40 −15.5% · L60 −37.4% · L80 **−61.3%** — matches to the tenth of a percent |
| `l1-l10-caps-confirmed` | `npx vitest run tests/xp.test.ts --reporter=verbose` | `Tests 11 passed (11)`; the named test exists verbatim; config table `[550,1450,2950,5150,8350,12150,16350,20900,25900,31400]` == `expArray[1..10]` |
| `frame-confirms-xp-caps` | re-extracted t=1600 and t=655 from `zFtCaTO0_1M.mp4`, own crop `(0.38w,0.10h)–(1.0w,0.60h)` @1.6× lanczos | **every reading confirmed** (see below) |
| `per-point-magnitudes` | read `§1t5957s0§.as:3390-3445` and `InventoryUI.as:2417/2424/2432/2439/2446/2453` | web +10/+5/+5/+3/+3/+3, android +5/+5/+1/+1/+1/+1 — exactly as quoted; frame arithmetic 1+1+0+3+3+1=9 ✓ |
| `per-stat-hard-caps` | `§1t5957s0§.as:3341-3346` | verbatim match |
| `271-cap-explained` | recomputed | 1+(80+10)*3 = 271; ATK walks 1,4,…,268,**271** then `271 < 271` is false → exactly reachable; 90 of 237 points |
| `start-pools-and-respec` | `§1t1523s0§.as:2559-2578` + `StatsManager.as:2117-2138`, **then traced the callers** | pools/refund ✓ — **"free" ✗, see below** |
| `post-rebirth-sp` | `§1t1523s0§.as:2598`, `StatsManager.as:2156`, read `doRebirth` 2195-2231 whole | formula verbatim; `doRebirth` calls `unAssignStatPoints()` and **not** `unAssignSkillPoints()` ✓ |
| `sp-first-run-off-by-one` | `§1t1523s0§.as:2072-2075` | `§1t9713s0§(§1t9418s0§,1)` / `(§1t9419s0§,3)` land on 2074/2075 exactly |
| `levelup-refill-and-cap` | `StatsManager.as:1619-1628`, `1646-1692`, `LootDialog.as:644` | all verbatim, incl. `autoAssignStats` round-robin and Dan cap 9 at `:2209`, gold `+20 @Dan8 / +5` at `:2201-2208` |
| `def-mitigation-is-flat` | `MCSPlayer.as:3231-3237/3415-3418`, `§1t99s0§.as:3284-3290/3484-3487` | verbatim both builds; `strings.json` skill 1002 desc really does end `"Defense -20%"` |
| `spd-scaling` | `StatsManager.as:1841/1860/1917/1918`, `§1t1523s0§.as:2276/2295/2346/2347` | verbatim; web `/600` vs android `/300` confirmed — a real build drift, correctly flagged |
| `xp-income-model` | `NPC.as:94-190/218/252`, `EnemyPlayer.as:1307-1327`, `ConnectionPIO.as:643`, `LootDialog.as:640-642` | verbatim — **and I found the web parity the claim lacked**, see N-2 |
| `quest-xp-tabled` | `grep -c "<exp>" questdata.xml` → **69**; read :211-216, :411-413; `Overworld.as:318` | ✓ index row matches (`count 69, range 100–3000`) |
| `unlock-cadence-to-l80` | re-derived the whole ladder from `skilldata.xml` + `resolved_names.json` | **33 rows, exact match to the surveyor's L3→L80 list, skill for skill**; `req/has` = 52 ✓ |
| `campaign-level-band` | `questdata.json` index paths | `enemy/lvl 142 [2,35]`, `friend/lvl 9 [25,80]`, `roomobj…/lvl 18 all 25` ✓ |
| `ap-regen` | `StatsManager.as:158/1099-1103`, `§1t1523s0§.as:192` | verbatim ✓ |

### The frame, re-cropped by me

`reference/videos/zFtCaTO0_1M.mp4`, `ffmpeg -ss 1600 -frames:v 1`, crop
`(0.38w, 0.10h)–(1.00w, 0.60h)` of the 1920×1080 frame, ×1.6 lanczos. **Visibly present:**
fan level badge `4` · `5110 / 5150` over `EXPERIENCE POINTS` · `AVAILABLE STAT POINTS: 0` ·
`HP 20 / 20` green · `CHI 9 / 15` blue · `AP 15 / 30` · `ATK 10` · `DEF 10 + 13` (the `+13`
orange) · `SPD 4` · `WEIGHT: 73 / 100` · `3 GOLD`.

Same treatment at `-ss 655`: badge `3` · `2098 / 2950 EXPERIENCE POINTS` ·
`AVAILABLE STAT POINTS: 0` · `WEIGHT: 38 / 100` · `3 GOLD` (panel showing `PICKAXE`,
`CONDITION: WELL-MAINTAINED`, `USED FOR MINING.`, `DMG: 1 - 3 (EQ: 1 - 2)`, `WEIGHT: 10`).

`expArray[4]=5150` and `expArray[3]=2950`. **Frame and payload agree — there is no conflict
to adjudicate on the XP table**, and the surveyor is right to say so rather than manufacture one.

⚠ **Cite-hygiene defect (minor, not fatal).** The crops the surveyor *states*
(`crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16` at t=1600) span frame-y ≈0.16–0.36. `AP`, `SPD` and
`WEIGHT: 73/100` sit at frame-y ≈0.45–0.53 and **cannot be in that rectangle** — I rendered it
to check: it shows only the XP row, HP, the top of CHI, ATK and DEF. Same for the t=655 crop
(y 0.09–0.31) versus the `WEIGHT 38/100` reading. Every *number* is correct; the stated crop is
too small for what was read from it. §0 asks for the crop you used — state the one that actually
contains the reading.

---

## Defect 1 — MATERIAL: the respec is not free

`progression/start-pools-and-respec` asserts *"the same function is the game's respec, which is
**free**, total, and refunds (level-1)*3 points."* Pools, totality and the refund all hold. "Free"
does not. The surveyor read `unAssignStatPoints()` and stopped at the function body; the cost
lives in the caller.

`reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991` — the **only** non-rebirth
caller — reaches it through the consumable item-modifier dispatcher:

```
if(modid == 78)
{
   StatsManager.unAssignStatPoints();
}
else if(modid == 79)
{
   StatsManager.unAssignSkillPoints();
}
```

and modifier id 78/79 occurs on exactly two items in the whole table
(`itemdata.xml`, 412 modifier blocks, `78 -> 2`, `79 -> 2`):

```
reference/extracted/itemdata.xml:2267-2282
  <item>
    <id>2200</id>
    <type>10</type>
    <name>4130</name>
    <unique>1</unique>
    <baseprice>0</baseprice>
    <heavenlyprice>5</heavenlyprice>
    <desc>4136</desc>
    <modifier><id>78</id></modifier>
    <modifier><id>79</id></modifier>
  </item>
```

Resolved (`docs/gauntlet/L0/index/resolved_names.json`): **2200 = "Amnesia Scroll" /
"Use this to unassign your stat and skill points."**

`heavenlyprice` is the premium-gold price channel, not coins: `XMLItem.as:94-96` maps it to
`hvalue`, `ShopUI.as:393` prices a slot as `setCost(value, hvalue)`, and `Item.as:359`
`return itemxml.hvalue > 0` is the is-premium test. `baseprice 0` means it is **not buyable with
coins at all**. The currency is the same `GOLD: 3` the frame shows beside `COINS`, and the same
`STAT_HGOLD` that `doRebirth` pays out `+5` of (`StatsManager.as:2207`) — one rebirth funds
exactly one respec.

**Consequence for L4:** respec must be modelled as a unique premium-gold consumable gate, not a
free UI button. A config that lets the player re-spec at will diverges from the OG on the single
most monetised progression decision in the game.

## Defect 2 — MINOR: the gather-XP PARTIAL is closable, and the answer is "zero"

`progression/xp-from-gather-and-dungeon` hedges: *"a per-gather-action XP number is not [held],
and on the A-04 evidence may not exist at all."* The prose is correct; the hedge is unnecessary.
Enumerating **every** XP entry point in both builds settles it.

WEB v0.717 — all eight call sites of `addLootXP` (`§1t6201s0§`):

```
§1t68s0§.as:888    mob kill        §1t12070s0§(getLevel(), this.level, this.xp, false)
§1t122s0§.as:1383/1387/1392        duellist / PvP / boss
§1t81s0§.as:1036/1040              PvP network reward, lvl*5+45
§1t3637s0§.as:71                   quest OUTCOME  (XMLQuestOutcome)
§1t6427s0§.as:331                  quest STEP reward (Overworld)
```

…and both call sites of web `changeXP` (`§1t9576s0§`): `§1t5957s0§.as:1257` (item modifier) and
`§1t6172s0§.as:322` (LootDialog commit). **No gathering site exists.** Android is the same
15-site set plus the `/setlevel` console command.

The mining resolver itself confirms it. `Obj_OreDeposit.as:39-77` `interact()` → `NodeUI.runMine()`;
`NodeUI.as:554-598` `runMine` dispenses ore with `addLootItemBasic(20059..20066, 1)` and
**contains no XP call anywhere in the file** (`grep -n "addLootXP\|changeXP" NodeUI.as` → no
match). Farming/foraging in the same class, `NodeUI.as:433-478`, likewise items only.

So the A-04 observation ("XP bar unmoved at 2098/2950 … no XP awarded from mining") is not a
sampling gap — it is the mechanic. **Ledger blocker ④ closes in full**, and the honest statement
is "gathering grants no XP", not "the number is unknown".

Dungeons likewise carry no completion-XP site; dungeon XP *is* kill XP.

---

## What the surveyor missed

### N-1 · An XP-granting item exists, and it is tabled — item 2201 "Level 10 Scroll" *(A2)*

`reference/extracted/itemdata.xml:2284-2305`:

```
<item>
  <id>2201</id> <type>10</type> <name>4131</name>
  <baseprice>0</baseprice> <heavenlyprice>2</heavenlyprice> <desc>4137</desc>
  <modifier><id>9</id><value>-1000000</value></modifier>
  <modifier><id>9</id><value>25900</value></modifier>
  <modifier><id>78</id></modifier>
  <modifier><id>79</id></modifier>
</item>
```

Resolved: **"Level 10 Scroll" / "Use this to become level 10."** Modifier id 9 is `STAT_XP`
(`§1t1523s0§.as:222  internal static const §1t8755s0§:int = 9;`) and is consumed by
`InventoryUI.as:906  StatsManager.changeXP(item.modifierXML[i].value)`. The pair
`(−1,000,000, +25,900)` is a floor-then-set: **25,900 is `expArray[9]` exactly**, and
`getLevel()` returns the first `q` with `expArray[q] > XP`, so XP=25,900 reads as level 10.
It also fires a full stat+skill respec (78/79) on the way.

This is a fourth XP source the model needs (`item modifier`), and it is an *independent
payload-internal proof* that `expArray[9]=25900` is the level-10 boundary — the same number the
frame shows the L10 bar capping at. Also: at 2 heavenly gold it undercuts the Amnesia Scroll's 5,
which is a real economy signal for L7.

### N-2 · The XP-income model was cited android-only; here is the WEB parity it needed *(A2)*

`progression/xp-income-model` is the only major claim in this survey whose cites are **entirely
from `shs3_android` v0.682** — the very build the surveyor themselves proved is differently tuned
(per-point magnitudes). By its own standard that claim was one build-drift away from being wrong.
It survives, because I checked:

```
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208   (calcXP, web v0.717)
  if(param2 <= §1t12068s0§()) { return 0; }
  if(param2 - param1 > 3) { return 0; }
  var _loc5_:int = param3;
  if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); }
  else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); }
  if(param4) { _loc5_ *= 2; }
§1t68s0§.as:120-128   grey level: <40 ⇒ L - floor(L/10) - 5; <60 ⇒ L - floor(L/5) - 1; else L - 9
§1t68s0§.as:131-182   zeroDifference ladder, identical 5→17
§1t4574s0§.as:39      xp = level * 2 + 20         (mob base)
§1t4902s0§.as:26      xp = level * 5 + 45         (duellist base)
```

Byte-for-byte the same model. Record the web cites; do not port from android on this one either.

### N-3 · A SECOND literal progression curve, web-only *(A2, system unidentified)*

`reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30`:

```
public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];
```

`§1t29s0§` (an `[Embed] symbol2123` MovieClip — the XP-bar widget) holds **both** curves. Its
progress-fraction function `§1t29s0§.as:331-347` branches on a track id: track
`§1t24s0§.§1t8755s0§ == 0` uses `expArray` and caps at `levelCap` (80); **all other tracks use
`§1t12498s0§` and cap at 5**. `§1t24s0§` (the containing panel) instantiates seven such bars
(`§1t8754s0§ = 7`), five of them fed from `§1t12498s0§` (`§1t24s0§.as:1124-1128`), and generates
random ones for filler rows (`:1824-1844`).

`grep -rn "300,900,2100" shs3_android/scripts/` → **no match.** This curve does not exist in the
Android build at all. Whatever it drives (five parallel 5-level tracks in the same bar chrome),
it is a progression sub-system in the *filmed* build that no ledger system mentions and that the
survey did not surface. Flagging as a lead, not a solved system — I did not identify which five
tracks these are.

### N-4 · Sharpening `levels-81-99` — the STILL_UNHELD is honest, but three facts narrow it *(A2)*

I do not overturn it; design intent is not recoverable. But the *shipped-build* half is now held:

1. Web declares the cap as a **`const`**, not a `var`: `§1t1523s0§.as:362
   public static const §1t9470s0§:int = 80;` — and `grep -rn "§1t9470s0§" shs3_payload/scripts/`
   returns 20 sites, **all reads, no writes**. Android's is a `var` but is likewise never assigned.
2. Web `changeXP` (`§1t1523s0§.as:2032-2047`) has the console flag **constant-folded to false**
   (`var _loc5_:Boolean = false;`), so the `> levelCap` bail is unconditional in the release build
   — where android's `!consoleEnabled` leaves a debug door. (Web also reports a cheat at a level
   jump `> 2`; android at `>= 5`. Another build drift.)
3. The anti-tamper checksum `§1t1523s0§.as:975-984` sums `expArray[0 .. levelCap-1]` **only** —
   entries 80…98 are outside the integrity check, exactly what you would expect of dead headroom.

Counterweight, so this is not one-sided: `StatsManager.as:1586-1597` `getLevel()` loops `q < 99`
and `return 99` at the top, so the level *function* is built for 99. Treat 81–99 as unreachable
dead headroom in the shipped build; the design question stays open. The surveyor's call stands.

---

## Notes that are not verdicts

- **Score.** 88 is defensible and I would not move it. If anything the survey is slightly
  *under*-scored on evidence quality and slightly *over*-scored on completeness — the respec cost
  and the second curve are both progression-facing and both were sitting in files already open.
- **`score_rationale` wording.** "One frame-vs-payload conflict was found and resolved in the
  frame's favour" is imprecise: the conflict was **payload-vs-payload** (web v0.717 vs android
  v0.682) and the frame was the *arbiter*. Frame and payload never disagreed anywhere in this unit.
  Worth fixing before it becomes a citation someone leans on.
- **`per-stat-hard-caps` is a UI gate, stated correctly.** `§1t5957s0§.as:3341-3352` sets
  `.visible` on the six `+` buttons. The claim says "hard per-stat UI cap" — accurate. Note the
  **android caps differ too** (`InventoryUI.as:2407-2412`: HP `10+(L+10)*5`, AP `20+(L+10)`,
  ATK/DEF/SPD `charlevel+10`), which independently corroborates the build-divergence finding.
- **A-02 is a second, independent frame confirmation of the WEB magnitudes** that the survey did
  not use. `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:25`
  records level 3 with `ATK 4→7, DEF 4+2→7+2, SPD 1→4` and 3 points available. Budget check:
  L3 grants `(3-1)*3 = 6`; already spent = HP 20 (1 pt @+10) + ATK 4 (1 pt @+3) + DEF 4 (1 pt @+3)
  = 3; `3 spent + 3 available = 6` ✓. Android magnitudes cannot produce it. That segment's own
  hedge ("treat exact point-to-stat ratio as INFERRED") is now dischargeable — two frames, two
  levels, same answer.
- **Provenance is clean, contra a caveat circulating elsewhere in this lane.**
  `docs/gauntlet/L0/CLAIMS.md:1213` claims "the web payload stamps v0.706 under a v0.717
  preloader". `grep -rn "0\.706"` across `shs3_payload/`, `shs3_loader/`, `shs3_stage2/`,
  `shs3_stage3/` returns **nothing**; the only version literal in the payload is
  `§1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;` (android's counterpart being
  `StatsManager.as:30  clientVersion:Number = 0.682`). The surveyor's "web v0.717" labels are right.
