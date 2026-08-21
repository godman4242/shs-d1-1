# t1-overturns-06 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-06.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself in this session. Nothing was taken on
another agent's word; I read no `critics/*.md` and no `sources/*.md`.

**Headline: 24 survive, 0 refuted.** This is an unusually clean packet. The machine audit flagged
8 claims `QUOTE_UNVERIFIED`; **all 8 were false alarms** — the quotes are verbatim, and the reason
citeLint could not find them is that the payload identifiers are `§`-delimited (`§1t1523s0§`) and
the quoted array text is elided with `…`/`...` mid-literal. I located every one by opening the file.

Three findings carry **sub-assertion errors that must not ride into the ledger**; each is called out
below under REPAIRS. None of them touches the finding's load-bearing `text`.

---

## 1. The XP-curve cluster — 5 near-duplicate claims, all HELD

`meta-social/xp-curve-has-a-web-cite` · `meta-social/xp-curve-in-web-build` ·
`meta-social/xp-curve-is-in-the-web-build` · `meta-social/xp-curve-is-web-native` ·
`progression/full-xp-table-recovered`

I parsed the arrays myself rather than eyeballing them:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364   len 99  [9]=25900 [10]=31400 [79]=4025800 tail [25395800, 29395800]
reference/decompiled/shs3_android/scripts/StatsManager.as:78  len 99  [9]=25900 [10]=31400 [79]=4025800 tail [25395800, 29395800]
IDENTICAL: True
```

Also confirmed, opening each line:
- `§1t1523s0§.as:36` — `public static var §1t9323s0§:Number = 0.717;` → the file that holds the array
  IS the v0.717 web build. The "web-native, no Android caveat" framing is earned.
- `§1t29s0§.as:28` — the **same 99-entry array a second time** in the web payload. "Twice over" is literal.
- `StatsManager.as:76` — `public static var levelCap:int = 80;`
- Consumption sites `§1t1523s0§.as:2013 / :2024 / :2029` all resolve; `:2027-2030`
  `§1t5928s0§(param1) { return §1t5923s0§[param1]; }` is `getXPLevelThreshhold`.

**Ledger verdict: `REBUILD_READINESS.md:350` and `:200 ②` fall completely.** "no table published"
and "likely unrecoverable" are both false against a file on disk. All five overturns upheld.

*(These five are redundant with one another. The ledger needs one entry, not five — I recommend
`meta-social/xp-curve-is-in-the-web-build` as the canonical one, because it is the only member of the
cluster that cites the `0.717` version line in the same class and therefore closes the build question
in the same breath.)*

## 2. `progression/quest-xp-sum-kills-blocker2-rationale` — HELD, exact

My own count over `reference/extracted/questdata.xml`: **69 `<exp>` rows, sum 79,890**, distinct values
exactly `[100, 200, 250, 290, 500, 600, 750, 1000, 2000, 3000]`. `reference/extracted/itemdata.xml`:
**142 `<minlvl>` rows, range 0–79.** Both numbers land on the claim to the digit.

Level check run through the build's own `getLevel()` loop (`§1t1523s0§.as:2008-2019`,
`while(i<99) if(expArray[i] > xp) return i`): xp=79,890 → `expArray[16]=71,900` not >, `expArray[17]=80,300` >
→ **returns 17.** The claim's "lands at level 17" is not a rounding argument, it is what the shipped
function returns. Blocker ②'s parenthetical rationale is dead.

## 3. `progression/procgen-quest-xp-formula` — HELD (one missing cite, supplied below)

Verbatim at `QuestGenerator.as:839`, `:916`, `StatsManager.as:1604-1606`, and — the part that matters —
**the same expression exists in the web build at four sites**: `§1t123s0§.as:878 / :1039 / :1283 / :1522`
and `§1t27s0§.as:317`. I re-evaluated the formula against the real array:

```
nodelvl 5→527  6→500  7→473  8→462  9→458  10→454  11→423
nodelvl 7 = (20900 − 16350) / (8 × 1.2) = 473.958 → int 473
```

473 is genuinely **absent** from the 69-row table (verified above). 

REPAIR: the finding asserts "the only quest-XP number visible in either longplay" with **no A1 cite**.
It is nonetheless true, and I supply the cite it should have carried:
`docs/research/video-study/segments/B-18-turn-in-and-hattori-kazushi-bounty-accep.md:32` —
"XP 24881/25900 → 25354/25900 (+473, matches reward exactly)", corroborated at `B-16-ne-kakuchi-mine-entrance.md:26`
("**473 XP**, **35 Coins**, **Town Prosperity: +10**"). Judged not-refuted; the on-screen half must
enter the ledger with **that** cite attached, not bare.

## 4. The rebirth-faucet cluster — 3 claims, all HELD

`meta-social/web-rebirth-25-100` · `meta-social/web-rebirth-faucet-25-100-300` ·
`meta-social/web-rebirth-grants-25-and-100-gold`

`§1t1523s0§.as:2638-2656` is verbatim as quoted, down to `:2649 else`:

```
2644:  if(§1t7356s0§(§1t9426s0§) == 8)
2646:     §1t9713s0§(§1t9413s0§,100);
2651:     §1t9713s0§(§1t9413s0§,25);
2653:  if(§1t7356s0§(§1t9426s0§) < 9)
2655:     §1t9713s0§(§1t9426s0§,1);
```

Stat ids confirmed against the Android decoder ring, and the claim's `:194/:220` pointer is exact:
`§1t8755s0§=9`(:222)=`STAT_XP`(:188) · `§1t9413s0§=12`(:228)=`STAT_HGOLD`(:194) · `§1t9426s0§=25`(:254)=`STAT_DAN`(:220).

The Android twin is `StatsManager.as:2195-2212 doRebirth()` — structurally identical, `changeStat(STAT_HGOLD,20)`
at Dan 8, else `5`. **So the web is exactly 5× the Android faucet: 25/100/300 vs 5/20/60.** Confirmed, not inferred.

Start gold: `§1t1523s0§.as:1024` `§1t7357s0§(§1t9413s0§,3);` → new characters start with 3 Gold. Exact.
Client ceiling: `§1t406s0§.as:1544` `if(...§1t9413s0§) > 300 && ...§1t9426s0§) < 9)` — verbatim, and
`:1549` (`> 3 && < 1`) and `:1581` (`(... − 3) / 25 > _loc3_`) both resolve. 8×25 + 100 = 300 exactly,
and the client's own test is the arithmetic's witness.

**Kongregate vindication confirmed.** `docs/research/KONGREGATE_FORUM_FINDINGS.md:308` reads
"25 gold is awarded EVERY rebirth, rising to 100 gold on the 9th". `DAN` starts at 0 and increments
per rebirth, so `DAN == 8` **is** the 9th rebirth. The forum was right and the survey that refuted it
was reading the wrong build. Say it out loud: **the forum beat the payload survey here.**

REPAIR (`web-rebirth-grants-25-and-100-gold`, lane_impact only): "shows the Android >60-Gold reportHack
ceiling has no web equivalent" is **FALSE**. The web equivalent is the very line the sibling claims cite —
`§1t406s0§.as:1544`, at 300 instead of 60 — against Android `OverworldHUD.as:1333`
`if(StatsManager.getStat(StatsManager.STAT_HGOLD) > 60 && StatsManager.getStat(StatsManager.STAT_DAN) < 9)`.
Same guard, scaled 5× like everything else. The finding's `text` is unaffected; do not carry the lane_impact sentence.

## 5. `meta-social/web-duel-token-cap-40` — HELD (citeLint false alarm)

Every element resolves verbatim: `:200 internal static const §1t9400s0§:int = 40;` · `:1401
if(§1t7356s0§(§1t9416s0§) > §1t9400s0§)` · `:1405 §1t7357s0§(§1t9416s0§,§1t9400s0§);` ·
`:2079 §1t9712s0§(§1t9416s0§,§1t9400s0§);` · `§1t6519s0§.as:827 ... §1t9416s0§) + "/" + ... §1t9400s0§`.

The "same slot in an otherwise identical constant block" argument is the strong part and it checks out
line-for-line:

| web `§1t1523s0§.as` | android `StatsManager.as` |
|---|---|
| :192 = 60 | :158 `APINTERVAL = 60` |
| :194 = 2*60 | :160 `DTINTERVAL = 2*60` |
| :196 = 60*60 | :162 `WARMOVEINTERVAL = 60*60` |
| :198 = 7 | :164 `MAXQUESTS = 7` |
| **:200 = 40** | **:166 `MAXDUELTOKENS = 30`** |

`§1t9416s0§ = 15` (:234) = `STAT_DUELTOKENS` (:200 android). Independent cross-check holds too:
`itemdata.xml:402-413` item **2127**, `<modifier><id>15</id><value>40</value></modifier>`,
`<name>4175</name>` → `strings.json["4175"] = "40 Duel Tokens"`. Two independent witnesses to 40.

## 6. `meta-social/web-daily-prize-rolls-differ` — HELD

`§1t401s0§.as` verbatim: `:1218 var _loc1_:int = 37 + this.§1t5864s0§.getLevel();` ·
`:1219 var _loc2_:int = Math.random() * _loc1_;` · `:1535 _loc4_ = Math.random() * 10;` (the
`(streak−1) % 30` branch) · `:1588 _loc4_ = Math.random() * 8;` (the `% 10` branch). The
streak/cooldown block at `:1514-1527` is real (24h reset, −172800 s grace, stat 30019 = streak).

I checked the Android side myself so the "differ" half is not taken on trust —
`reference/decompiled/shs3_android/scripts/InteractUI.as`: `:1154 (streak−1) % 30` → `:1163 dice = Math.random() * 10`;
`:1208 % 10` → `:1217 dice = Math.random() * 6`; base roll `:1247 dice = Math.random() * 36`.
**So: 30-day 10 = 10 ✓ matches · 10-day 8 vs 6 ✗ · base 37+level vs flat 36 ✗.** The claim's
"only the 30-day super-bonus matches" is precisely right.

## 7. `meta-social/web-survival-table-differs-in-composition` — HELD

Both files decode as UTF-8 XML; sizes match the cite exactly (11,721 B / 11,553 B). My own parse:
**39 `<wave>`, 87 enemy entries, sum `<qty>` = 351, blocks `{400: 340, 700: 11}` — identical in both.**
The diff is *entirely* inside `<id>` elements (I filtered for non-`<id>` diff lines: none). I mapped
the 14 changed lines back to their wave blocks: **wave indices 32–38 — exactly the last seven waves.**
"Seven late waves" is measured, not estimated.

Nit, not a refutation: the quote says "168-line unified diff"; `diff -u` gives 107. Python `difflib.unified_diff`
gives 173 — the figure is a plausible difflib artifact, not an invention, and nothing rests on it.

## 8. `meta-social/world-map-tiers-and-level-gating` — HELD as a picture, NOT as a topology closure

I opened `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg` (512×288, whole frame, ×3 LANCZOS)
and looked. Everything quoted is legible: header **"NAGANO (26,52)  LEVEL: 9"**, a red **ZOOM OUT**
button top-right, a vertical **WORLD MAP** rail with an X, a rectangular tile board carrying settlement
icons and coloured clan flags (**yellow, blue, red, and one green** on a castle in the top row — four
colours confirmed by eye, not by inference), the legend **VILLAGE · TOWN · CITY · CASTLE TOWN ·
DESTROYED · QUEST** (destroyed = a black X over a razed building), and
**"GREY TERRITORIES – LEVEL TOO LOW / RED TERRITORIES – LEVEL TOO HIGH"**.

**Overturn NOT upheld.** The named ledger sentence is `REBUILD_READINESS.md:245 ②` "War-Room **map
topology** (board/adjacency)". A tile vocabulary, a per-territory LEVEL field and a colour-coded gate
are not board topology or adjacency, and the finding does not claim they are. The blocker is dented,
not dead. (Worth flagging separately: the visible `(26,52)` coordinate label and the plainly rectangular
tile grid are evidence *against* `:115`'s "sparse geographic Japan outline, not a grid" — but that is a
different sentence and no one has claimed it yet.)

## 9. `npcdata/five-stances-reversed-and-dual` — HELD, and stronger than filed

Verbatim at `shs3_android_payload/scripts/EnemyElite.as:160-167`, with the identical dispatch at
`EnemyPlayer.as:836-843` and `FriendlyElite.as:83-90`. The constants that make it a *stance* claim
rather than a *skill* claim: `MCSPlayer.as:33 internal static var DUAL_STANCE:int = 3;` and
`:35 internal static var REVERSED_STANCE:int = 4;` — so the enum runs 0..4. **Five.**

All five animation blobs ship, and I stat'd them: `95_MCSCharacter_ReversedStanceAnimationData.bin` (35,903 B),
`101_..._DualStance...` (95,009 B), `108_LightStance` (76,847 B), `97_BalancedStance` (82,360 B),
`106_HeavyStance` (76,342 B). Renderable, not vestigial — correct.

Carriers verified by resolving each `<name>` through the string table, and the four line numbers are exact:
`npcdata.xml:3662` npc 175 **Aboshi** (skill 1500) · `:3898` npc 188 **Magoichi** (1500) ·
`:3934` npc 190 **Gojo Takamori** (1501) · `:3956` npc 191 **Gojo Takamori** (1501). All `<ai>29</ai>`,
and `NPCManager.as:605-606 case 29: actor = new EnemyElite(...)`.

**Filed as android v0.682 — but it is not android-only.** I checked: the same `getMastery(1500) > 0`
dispatch is in the web payload at `§1t4907s0§.as:157`, `§1t4906s0§.as:90` and `§1t122s0§.as:862`.
The declared build caveat is honest but unnecessary; **there is no build-parity hole here.**

**Overturn upheld.** `src/config/stances.ts:7` is literally
`export type StanceId = 'light' | 'balanced' | 'heavy';` — the repo's working model is short two states.

## 10. `npcdata/hp-less-combat-rows-default-to-1` — PARTIAL, and the PARTIAL is the right call

`XMLNpc.as:143-150` is verbatim: `if(xml.hp.toString() != "") { this.hp = xml.hp; } else { this.hp = 1; }`
(the same shape guards `ai` at `:135-142` defaulting to 1, and `chi` at `:151`).

I ran the census myself over all 495 `<npc>` blocks: **92 have no `<hp>`; 22 of those carry an `<ai>`;
12 of those carry a full `<skills>` loadout.** The twelve block-start lines are exactly the twelve cited:
3365 (Satoshi), 3424 (Fumio), 3760 (Hachimaru), 3777 (Shou), 3863 (Yohei), 3884 (Magoichi),
3917 + 3939 (Gojo Takamori ×2), 4021 + 4256 (Mitsuo ×2), 4275 (Magoichi), 4293 (Chikako).

The `<lvl>` half needed care — a naive substring test false-positives on `<lvl>` *inside* `<skill>`
elements. Matching only whole-line `<lvl>N</lvl>`: **0 of the 22 carry a top-level `<lvl>`. All 22.**
The claim is exactly right and I nearly mis-refuted it by being sloppy.

Gojo Takamori's loadout at `:3934` is 14 skills, and 1068 resolves to **"Undying"** — as stated.

The finding's own closing sentence ("Where their real HP and level come from at spawn is not established
by anything I opened") is a correct STILL_UNHELD and should be respected as one, not punished.

## 11. `payload/repair-weapon-cost-is-a-template-not-a-constant` — HELD

Strings verbatim:
- `strings.json["848"]` = `Repair your currently equipped weapon?\nCost: [0] coins` — **one slot, no material line.**
- `strings.json["845"]` = `Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore`
- `strings.json["850"]` = `Reinforce ... ?\nCost: 5000 coins\nMaterials needed: 1 Silver Ore` — cost **baked in**, no slot.

I opened both frames (`Nr4fQstqHDM/seg-10/frames/frame_0040.jpg` and `frame_0042.jpg`, 1024×576,
crop y=370→576 full width, ×1.8 LANCZOS) and read them:
- 0040: "FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE"
- 0042: "REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE"

The 845-vs-850 contrast is the argument's spine and it survives: **850 hard-codes 5000, 848 does not
hard-code anything.** A string that ships a `[0]` where the number goes cannot have "never been captured";
there is no constant to capture. Re-stating blocker `:215 ③` as "repair cost is f(weapon), formula unknown"
is the correct repair. Overturn upheld.

(Pedantic: 845 has two slots and 848 one, so "structurally identical" overstates by one slot. Irrelevant
to the finding.)

## 12. `progression/elemental-damage-bypasses-def` — HELD (overturns_ledger=false, honestly declared)

`MCSPlayer.as:3415-3418` and `:3709-3718` both verbatim, including `if(behead) { damage *= 1.5; }` at
`:3714-3716` landing **after** the min-damage floor at `:3710-3712`. Web parity `§1t99s0§.as:3484-3490`:

```
3484:  _loc5_ -= this.§1t4477s0§();
3485:  if(_loc5_ < param2.§1t1088s0§()) { _loc5_ = param2.§1t1088s0§(); }
3489:  _loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_;
3490:  §1t3308s0§(§1t3309s0§() - _loc17_);
```

One physical term, defence-reduced and floored; four elemental terms added raw. DEF touches exactly one
of five. Correct in both builds.

## 13. `progression/elemental-def-crosswheel` — HELD, and this is the packet's best find

`MCSPlayer.as:3347-3350` verbatim, `:3351-3357` is the floor-at-1-if-the-attack-carried-that-element /
clamp-to-0-otherwise logic as described, `:3415` physical only, `:3420` the five-term subtraction.

`StatsManager.as:1836` is the cross-wiring and it is quoted **exactly**, argument for argument:

```
player.initElementDefenseStats(
    getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),
    getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),
    getPlayerStats(STAT_WINDATK)  + findBonusStat(STAT_WATERDEF),
    getPlayerStats(STAT_FIREATK)  + findBonusStat(STAT_EARTHDEF));
```

The web build does the same thing in the same order at `§1t1523s0§.as:2270`, and I checked all eight
constants rather than accepting the mapping: `§1t1235s0§=28`(:260) vs `STAT_FIREATK=28`(:226) ·
`29`(:262)/`STAT_WINDATK`(:228) · `30`(:264)/`STAT_WATERATK`(:230) · `31`(:266)/`STAT_EARTHATK`(:232) ·
`200`(:288)/`STAT_FIREDEF`(:250) · `201`(:290)/`STAT_WINDDEF`(:252) · `202`(:292)/`STAT_WATERDEF`(:254) ·
`203`(:294)/`STAT_EARTHDEF`(:256). **Eight for eight.**

So: fireDef = waterAtk, windDef = earthAtk, waterDef = windAtk, earthDef = fireAtk. It is a counter-wheel,
not a curve — and it independently reproduces `KONGREGATE_FORUM_FINDINGS.md:312` "Water > Fire > Earth >
Wind > Water" from the binary. **Blocker `:205 ②` "elemental ATK-vs-DEF formula" dies.**

## 14. `progression/mining-pipeline-zero-xp` — HELD as fact, overturn only PARTLY upheld

`NodeUI.as:566-610 doMine()` read in full: oreType 1..8 → `addLootItemBasic(20059..20066, 1)`;
`:600-603 if(this.oreType != 1) clearOre();`; then show, save, `PICKUP` anim, `updateWeaponUse(1)`,
`reportAchievementStat(60003,1)`. **There is no `addLootXP` and no `changeXP` in the function.** Zero XP
is a read of the whole function body, which is the only way this claim could be honest, and it is.

`:558 startProgress(24, ACTION_MINE)` — the 24-tick bar is there.
`Obj_OreDeposit.as:46` (pickaxe 13022), `:51-53` (broken weapon), `:57-58` (the skill ladder),
`:63` (AP), `:70-76` (the whiff) — all verbatim.

I resolved the gate ladder against the ore names rather than trusting the mapping:
`strings.json` 652–659 = Rock / Coal Deposit / Iron / Tin / Copper / Silver / Titanium / Diamond →
items 20059–20066. So `oreType 3 ≥1 Iron · 5 ≥2 Copper · 6 ≥3 Silver · 7 ≥4 Titanium · 8 ≥5 Diamond`,
**ungated: 1 Rock, 2 Coal, 4 Tin.** Exactly as filed. `650`/`651`/`663` are the three dialog strings.

**Overturn NOT upheld.** Ledger `:225 ②` reads "gather/mine/farm **yield + whiff + respawn** tables."
This closes yield and whiff **for mining**. It says nothing about respawn (`clearOre()` sets the clip to
frame 1; when it comes back is not in either file I opened) and nothing about farm or scavenge.
The blocker survives in reduced form — which is a big win, just not the one claimed.

## 15. `progression/no-gather-xp-path-exists` — HELD; I re-ran the grep

```
$ grep -rn addLootXP reference/decompiled/shs3_android/scripts/
```
returns **exactly 13 lines**, and they are exactly the 13 enumerated: NPC.as:863 · EnemyPlayer.as:1318/1322/1327 ·
NetworkManager.as:1268/1272/2818/2822 · ConnectionPIO.as:643/647 · Overworld.as:318 · XMLQuestOutcome.as:66 ·
definition LootDialog.as:638. No mining, farming or scavenging site exists. An exhaustive enumeration is
the one thing that can turn "we can't find the number" into "the number does not exist", and it was done properly.

I pushed further than the claim did, because a `changeXP` call could have hidden a gather path the
`addLootXP` grep would miss. `grep -rn changeXP` returns 6 sites: `LootDialog.as:251` (the loot pipe),
`StatsManager.as:1609/1621/1627` (the definition + two reportHack guards), `InventoryUI.as:906`
(modifier id 9, as filed), and **one the finding did not list — `OverworldHUD.as:2137`**. I opened it:
it is inside the `/setlevel` debug chat command (`:2132-2138`), a GM cheat, not a gameplay faucet.
**The enumeration survives the harder test.**

## 16. `progression/per-point-two-frame-delta` — HELD as measurement, NOT an overturn

I extracted the frames from the video myself rather than trusting the description:
`ffmpeg -ss {653.0,656.5,1600} -i reference/videos/zFtCaTO0_1M.mp4`, crop
`iw*0.62:ih*0.42:iw*0.36:ih*0.12`, ×1.7 LANCZOS (wider than the filed crop, so the level badge and the
GOLD counter are both in frame).

- **-ss 653.0** — level badge **3**, `2098 / 2950 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`,
  HP 20/20, CHI 10/10, AP 30/30, ATK 7, DEF **7 + 2** (the +2 in orange), SPD 4, WEIGHT 38/100, GOLD 3.
- **-ss 656.5** — same panel, unchanged (the point of the second read: the panel is stable, not mid-animation).
- **-ss 1600** — level badge **4**, `5110 / 5150`, `AVAILABLE STAT POINTS: 0`, HP 20/20, CHI **9/15**,
  AP 15/30, ATK **10**, DEF **10 + 13**, SPD 4, WEIGHT 73/100.

Delta across exactly one level with **zero unspent points at both ends**: Chi max +5, ATK +3, DEF base +3,
HP max +0, AP max +0, SPD +0. The gear-proof argument is sound *because the HUD prints base and bonus
separately* — DEF goes `7 + 2` → `10 + 13`, and only the left number moves under stat spending.

Three points per level is not assumed either: `§1t1523s0§.as:2075 §1t9713s0§(§1t9419s0§,3);` with
`§1t9419s0§ = 18`(:240) = `STAT_STATPOINTS = 18`(:206 android), matching android `StatsManager.as:1653
changeStat(STAT_STATPOINTS,3)`.

And the "7 under Android" counterfactual is real — Android's auto-allocator at `StatsManager.as:1669-1684`
gives MAXHP +5, MAXCHI +5, MAXAP +1, **everything else +1**. Buying Chi+5/ATK+3/DEF+3 there costs
1 + 3 + 3 = **7**. The observed spend was 3. The Android build cannot produce this frame.

**Overturn NOT upheld — and this is a compliment, not a demotion.** The named ledger sentence is the
`:199` **Ready** line "+3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point".
This finding *confirms* it (+3 stat, +5 Chi). Nothing in it falls. It upgrades the evidence class behind
a line the ledger already had right; file it as corroboration.

## 17. `progression/second-frame-confirms-plus3-per-point` — HELD, overturn upheld

`docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24` and `:25` are
quoted accurately (`:25` is abridged with `…` but nothing is bent — the original's own conclusion is
"treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm").

The adjudication cite is the payoff, and it is exact:
`§1t5957s0§.as:3422 §1t9713s0§(§1t9408s0§,3);` (ATK) · `:3434 ...§1t9409s0§,3);` (DEF) ·
`:3443 ...§1t9410s0§,3);` (SPD), each preceded by `§1t9713s0§(§1t9419s0§,-1)` — one stat point, +3.
So A-02's arithmetic puzzle ("total distributed = 9, inconsistent with the 3-points label") resolves
cleanly: **3 points × +3 = 9.** "No replay needed — mark A-02:25 RESOLVED" is the correct call.

**The +1AP correction is right, and I verified it independently** (the finding asserts it without a cite):
the same click-handler block has `:3394 §1t9713s0§(§1t9403s0§,10)` (MAXHP +10), `:3406 ...§1t9406s0§,5`
(MAXCHI +5), and `:3414 §1t1523s0§.§1t9609s0§(5)` — and `§1t9609s0§` at `:2807-2814` is
`§1t9713s0§(§1t9415s0§, param1)` with `§1t9415s0§ = 14` = MAXAP. **The web build gives +5 AP per point,
not +1.** `REBUILD_READINESS.md:199` and `:77` both carry "+1AP" and both are wrong. Overturn upheld.

## 18. `progression/second-xp-curve-mastery-ranks` — HELD

`§1t29s0§.as:30` verbatim: `public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];`
— 11 entries, i.e. levels 0–10.

The curve *selection* at `:321-329` is the load-bearing part and it says what the claim says:
```
§1t5927s0§(param1) {
   if(param1 == §1t24s0§.§1t8755s0§) return §1t5923s0§[...+1] - _loc2_;   // bar 0 → the CHARACTER expArray
   return §1t12498s0§[...+1] - _loc2_;                                    // bars 1+ → the second curve
}
```
with `§1t24s0§.as:30 §1t8755s0§ = 0`. The sub-bar count: `§1t7329s0§()` at `:424-439` runs
`_loc2_ = 1; while(_loc2_ < §1t24s0§.§1t8761s0§)` and `§1t24s0§.as:42 §1t8761s0§ = 6` → **bars 1–5, five sub-bars**,
returning the max. The letter ladder `§1t7210s0§()` at `:441-489` returns E, E+, D, D+, C, C+, B, B+, A, A+, S
for 0..10 — I read all eleven branches.

Cap 10 confirmed by use, not just by declaration: `:398-400 if(_loc3_ > §1t12495s0§) { _loc3_ = §1t12495s0§; }`.
Independent corroboration from the string table: `strings.json` `8131`/`8132`/`8133` =
"Light / Balanced / Heavy Stance Mastery Level 10." (line 1774 of the index is the `8133` entry).

**WEB-ONLY confirmed by my own grep**: `grep -rn "0,300,900,2100,4800" shs3_android*/` → nothing;
`grep -rln '"A+"' shs3_android*/scripts/` → nothing; the array appears in exactly one file repo-wide,
`§1t29s0§.as`. And the 22xxx string calls are real and really out of range: `§1t29s0§.as:419 getString(22080)`,
`:417`/`:609 getString(22101)`, `:497 getString(22102)`, while the parsed table's **max id is 9010** and
`"22080"` is absent. The "its UI copy is still unheld" hedge is correct and should stay attached.

REPAIR: the cite says "`:24` (const `§1t12495s0§` = 10)". **The constant is at `:20`**, not `:24`; `:24` is
`§1t12496s0§:int = 1`. Four-line slip on a supporting element; the value and its use as the cap are both real.
Fix the line number before this enters the ledger.

---

## REPAIRS — three sub-assertions that must not ride into the ledger

1. **`web-rebirth-grants-25-and-100-gold`** — "the Android >60-Gold reportHack ceiling has no web
   equivalent" is false. The web equivalent is `§1t406s0§.as:1544`, the same guard at 300.
2. **`second-xp-curve-mastery-ranks`** — `§1t12495s0§ = 10` is at `§1t29s0§.as:20`, not `:24`.
3. **`procgen-quest-xp-formula`** — the "on-screen 473" needs the cite it omitted:
   `docs/research/video-study/segments/B-18-turn-in-and-hattori-kazushi-bounty-accep.md:32`.

## Overturn scoreboard

Upheld (18 of 21 claiming an overturn): the five XP-curve claims, quest-XP sum, procgen quest formula,
three rebirth claims, duel-token cap, daily-prize rolls, survival composition, five stances, hp-less rows,
repair template, elemental crosswheel, no-gather-XP, second-frame +3/AP, second XP curve.

**Not upheld (3)** — findings that are TRUE but do not kill the sentence they name:
- `world-map-tiers-and-level-gating` → `:245 ②` is about **board/adjacency**; a legend is not a topology.
- `mining-pipeline-zero-xp` → `:225 ②` names **yield + whiff + respawn**; respawn (and farm/gather) untouched.
- `per-point-two-frame-delta` → the `:199` Ready line is **confirmed**, not overturned.

## Notes on the machine audit

All 8 `QUOTE_UNVERIFIED` flags were false positives caused by `§`-delimited identifiers and by `…`/`...`
elision inside 99-element array literals. Every quote was located verbatim. `citeLint` should not be
read as evidence against a claim when the cited file is a `§`-obfuscated payload script.

No `A5` (owner LOOK verdict) claims in this packet. No claim in this packet rests on an Android string
while asserting web behaviour without saying so — the two android-labelled findings (`five-stances`,
`hp-less-rows`) both declare their build, and `five-stances` turns out to hold in the web payload too.
