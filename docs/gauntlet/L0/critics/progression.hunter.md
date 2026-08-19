# progression — HUNTER LENS review (blind critic)

Reviewed the 20 claims in `docs/gauntlet/L0/systems/progression.md` (surveyor score 88)
against the artifacts, first-hand. Every verdict below carries an artifact **I** opened.

**Headline:** 17 of 20 claims survive. The four big overturns (expArray, flat DEF, SPD
transfer functions, post-rebirth SP) are all real and I re-derived each one. Three claims
are refuted: one **material** mis-attribution inside an otherwise-correct XP model, and
two **under-claims** (a PARTIAL and a STILL_UNHELD) that I closed by going and finding it.

I also found **one whole progression sub-system nobody in this lane has mentioned** — a
second XP curve with an E→S letter-grade ladder, present only in the web v0.717 build.

---

## 1. Verification of the big overturns — all four hold

### expArray (claim `progression/xp-curve-l11-80`)
Parsed the array myself out of `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`:

```
len 99 · [11]=37400 · [12]=43500 · [20]=108000 · [40]=507300
        · [60]=1508800 · [80]=4285800 · [98]=29395800
```

Byte-identity with `reference/decompiled/shs3_android/scripts/StatsManager.as:78` confirmed
by string comparison of the two bracketed bodies → `identical: True`, 99 vs 99 entries.
A third copy sits at `§1t29s0§.as:28`. Ledger `docs/research/REBUILD_READINESS.md:200`
(blocker ②) and `:350` (§6 "structurally UNRECOVERABLE") are dead. **HELD.**

### The extrapolation error (`progression/inferred-extrapolation-error`)
`src/config/xp.ts:28` = `export const XP_DELTA_STEP = 500;`. Re-ran the extrapolation in
`src/core/xp.ts`'s exact shape against the real array — surveyor's divergence table
reproduces **digit for digit**: L12 +0.9% · L20 +5.5% · L40 −15.5% · L60 −37.4% ·
L80 −61.3%. **HELD.**

### Flat DEF (`progression/def-mitigation-is-flat`)
Read both builds verbatim. Web `§1t99s0§.as:3284-3291` (`getDefense`, Heavy ×0.8) and
`:3484-3488` (`_loc5_ -= this.§1t4477s0§(); if(_loc5_ < param2.§1t1088s0§()) …`);
android `MCSPlayer.as:3231-3237` / `:3415-3419`. There was never a curve. **HELD.**

### SPD (`progression/spd-scaling`)
All three functions read first-hand, web and android. Web `§1t1523s0§.as:2276`
(`48 + spd*6`), `:2295` (`1 - param1/600*0.5`, clamp 600), `:2347`
(`120 + floor((90+Dan*5)*spd/(20+spd))`); android `StatsManager.as:1841`, `:1860`
(`/300`, clamp 300), `:1918`. The /600-vs-/300 drift is real. **HELD.**

---

## 2. I opened the frame myself — it holds, and it arbitrates

Extracted my own crops from `reference/videos/zFtCaTO0_1M.mp4` (1920×1080):

- `-ss 1600`, `crop=iw*0.62:ih*0.42:iw*0.38:ih*0.13, scale=1.5× lanczos` →
  **GOLD 3 · level badge 4 · `5110 / 5150` EXPERIENCE POINTS · AVAILABLE STAT POINTS: 0 ·
  HP 20/20 · CHI 9/15 · AP 15/30 · ATK 10 · DEF 10 `+ 13` (orange) · SPD 4 ·
  WEIGHT: 73 / 100.**
- `-ss 655`, `crop=iw*0.62:ih*0.30:iw*0.38:ih*0.13, scale=1.6×` →
  **level badge 3 · `2098 / 2950` · AVAILABLE STAT POINTS: 0** (this crop shows the
  PICKAXE item panel, not the weight meter — I could not confirm the surveyor's
  "WEIGHT 38/100" at this timestamp; immaterial).

`expArray[4] = 5150` and `expArray[3] = 2950`. **Payload and frame agree exactly.**

The 9-point budget arithmetic is the real prize and it checks out:
web magnitudes cost `1+1+0+3+3+1 = 9` = `(4-1)*3`; android magnitudes would cost 24.
Independently corroborated by `docs/research/video-study/segments/A-02-…md:25`, which
observed ATK 4→7, DEF 4→7, SPD 1→4 for 3 points — **+3 per point, a third independent
frame-derived reading.** THE FRAME WINS, and it names the web build. **HELD.**

---

## 3. Two things I checked that the surveyor did not, and both strengthen the case

**a) The per-stat cap is on the BASE stat, not gear-inclusive.**
`getStat(id)` for a PLAYERSTAT returns `getPlayerStats(id)` —
`reference/decompiled/shs3_android/scripts/StatsManager.as:3939-3952`. `findBonusStat`
(gear) is a separate call and is *not* in the cap expression. So the ledger's
"the 271 cap is gear/rebirth-inclusive" (`REBUILD_READINESS.md:201`) is refuted on its own
terms, not just by arithmetic. `progression/271-cap-explained` **HELD**, and stronger than
claimed.

**b) The android build uses a completely different cap formula.**
`InventoryUI.as:2410-2412`: `getStat(STAT_ATTACK) < charlevel + 10` — linear, not
`1 + (level+10)*3`. Independent confirmation of S0-3's parity caveat: **port progression
from the WEB payload.**

Also verified the increment divides the cap evenly in every stat, so the ceilings are
exactly reachable: HP 910 (10+10k), Chi 460 (10+5k), AP 480 (30+5k), ATK/DEF/SPD 271
(1+3k, k=90 ≤ the 237-point budget). The surveyor's "reachable in one stat" is right.

---

## 4. REFUTED — material

### `progression/xp-income-model` — `lvl*5+45` is NOT the "duellist/PvP base"

The `calcXP` model itself is fully held; I read `NPC.as:94-190` line by line and every
branch (grey level, +3 cutoff, ±scaling, elite ×2, sub-L10 ×3, XP buff ×1.5) is verbatim
correct. But the quote annotates `lvl * 5 + 45` as `(duellist/PvP base)`. It is not.

```
$ grep -rl "\* 5 + 45" reference/decompiled/shs3_android/scripts/
NetworkManager EnemyFox EnemyCivilian EnemySpearElite EnemyNianMonster EnemyWolf
EnemyWolfAlpha EnemyStag EnemyBear EnemyPlayer EnemyDeer EnemyOgre EnemyElite
EnemyBoar EnemyKanjiGuardian EnemyHorse ConnectionPIO          (17 files)

$ grep -rl "\* 2 + 20" reference/decompiled/shs3_android/scripts/
EnemySpearElite EnemySorcererBoss EnemyStag NPC EnemyPlayer EnemyZombie   (6 files)
```

`lvl*5+45` is the base for **15 ordinary enemy classes** — foxes, wolves, bears, boars,
deer, ogres, civilians. Web parity at `§1t4902s0§.as:26` (`xp = level * 5 + 45`), a web
enemy class. A rebuilder following the claim would give a wolf `level*2+20` and be **~2.5×
low on every overworld kill.** The correct statement: `NPC.as:218` `level*2+20` is the
*generic NPC* base; `level*5+45` is the *named-enemy* base; several classes carry both on
level-dependent branches.

---

## 5. REFUTED — under-claiming (the failure this lane exists to fix)

### `progression/xp-from-gather-and-dungeon` — PARTIAL is wrong. Gathering awards ZERO XP, by construction.

The surveyor said "a per-gather-action XP number is not held … and may not exist at all."
It is held. It is **zero**, and the whole gather pipeline is on disk.

`reference/decompiled/shs3_android/scripts/NodeUI.as:566-608` — `doMine()` in full:

```
internal function doMine() : *
{
   if(this.oreType == 1)      { …addLootItemBasic(20059,1); }
   else if(this.oreType == 2) { …addLootItemBasic(20060,1); }
   … through oreType == 8 → 20066 …
   if(this.oreType != 1) { (interactiveStageObjectHolder as Obj_OreDeposit).clearOre(); }
   OverworldHUD.instance.lootDialog.show();
   …
   StatsManager.updateWeaponUse(1);
   StatsManager.reportAchievementStat(60003,1);
}
```

**There is no `addLootXP` and no `changeXP` anywhere in the function.** Mining yields an
item and nothing else. This turns the A-04 observation ("XP bar unmoved at 2098/2950 …
no XP awarded from mining", `docs/research/video-study/segments/A-04-…md:32`) from a
suggestive absence into a confirmed mechanic — payload and frame **agree**.

And the whole gather table came out with it (`Obj_OreDeposit.as:40-78` +
`strings.json` 650-659) — a cross-lane gift to **world-exploration blocker ②**
("gather/mine/farm yield + whiff + respawn tables"), which the surveyor left on the board:

| oreType | node (string) | item | skill gate (`getStat(1022)`) |
|---|---|---|---|
| 1 | Mine Rock | 20059 | — (node is **not** cleared — repeatable) |
| 2 | Mine Coal Deposit | 20060 | — (**no whiff** — always yields coal) |
| 3 | Mine Iron Deposit | 20061 | ≥ 1 |
| 4 | Mine Tin Deposit | 20062 | — |
| 5 | Mine Copper Deposit | 20063 | ≥ 2 |
| 6 | Mine Silver Deposit | 20064 | ≥ 3 |
| 7 | Mine Titanium Deposit | 20065 | ≥ 4 |
| 8 | Mine Diamond Deposit | 20066 | ≥ 5 |

Plus: requires a pickaxe (`getStat(59) != 13022` → "You need to equip a pickaxe.",
string 651); refuses on a broken weapon (663); costs AP (`getAPUse()`, varies per node —
matches A-04's 2 AP coal vs 1 AP herb); **whiff = for every oreType except 2, a flat 50%
(`int(Math.random()*2) != 0`) downgrade to Rock**; progress bar 24 ticks
(`startProgress(24, ACTION_MINE)`); nodes 2-8 are consumed, node 1 is not.

### `progression/levels-81-99` — STILL_UNHELD is wrong for the question that matters

The historical "were they *ever* reachable" is genuinely unanswerable and I do not fault
that. But the operative engineering question — *are they reachable in the shipped build* —
**is held, negatively, by two independent gates I opened:**

1. `§1t1523s0§.as:362` — `public static const §1t9470s0§:int = 80;` is a **`const`**.
   Grepped all 20 uses of `§1t9470s0§` across `shs3_payload/scripts/`: **reads only**,
   never reassigned. (Android's `levelCap` is a `var` but is likewise never written.)
2. `LootDialog.as:644` — `if(StatsManager.getLevel() < StatsManager.levelCap)` gates
   **every** XP credit in the game. At level 80 XP simply stops arriving.
3. `§1t1523s0§.as:2043-2047` — `changeXP` bails with a localized message if the recomputed
   level exceeds the cap.

Correct verdict: **PARTIAL**, not STILL_UNHELD. `expArray[81..98]` is provably dead
headroom in v0.717. The surveyor's own `lane_impact` already says exactly this — the
label is the only thing that is wrong.

---

## 6. NEW — a second XP curve and an E→S rank ladder that nobody in this lane has

`reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30`:

```
public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];
```

Eleven entries (levels 0-10), with `§1t12495s0§:int = 10` as the cap. It is a **second,
independent cumulative XP table**, selected against the character `expArray` by index:
`§1t29s0§.as:326-328` — `if(param1 == §1t24s0§.§1t8755s0§) return §1t5923s0§[…]; return §1t12498s0§[…];`
where `§1t8755s0§ = 0`. So each unit carries **bar 0 = character level (expArray, cap 80)
plus bars 1-5 on this second curve (cap 10)**.

`§1t29s0§.as:459-486` maps the max of bars 1-5 to a letter grade:

```
0→"E"  1→"E+"  2→"D"  3→"D+"  4→"C"  5→"C+"  6→"B"  7→"B+"  8→"A"  9→"A+"  10→"S"
```

Corroborated by the resolved string table — achievements
`8131 "Light Stance Mastery Level 10." · 8132 "Balanced…" · 8133 "Heavy Stance Mastery Level 10."`
confirm a 10-level mastery track exists and tops out at 10.

Notes for whoever picks this up:
- `§1t24s0§` imports `playerio` and pushes `§1t29s0§` instances into a roster
  (`§1t553s0§`) placed on a grid (`§1t558s0§[x][y]`), with the player themselves inserted
  by `charname` at `§1t24s0§.as:265` — this is the clan/castle roster, so it straddles
  **L4 progression** and **L11 meta-social**.
- **Web-only.** `grep` for the array across `shs3_android/scripts/` returns nothing, and
  there is no android class returning `"E+"`. Another concrete instance of the S0-3 parity
  caveat.
- The 22xxx string ids it calls (`getString(22080)`, `22101`, `22102`) are **outside** the
  Android `Mobile_Lang_EN` table (max id 9010) — so this system's UI copy is still unheld.
- `§1t29s0§.as:344` has `if(_loc2_ == 5) return 1;` for the progress fraction while the
  level lookup caps at 10 — either a bug or a soft display cap. Flagging, not resolving.

---

## 7. Two smaller finds

**Elemental damage bypasses DEF entirely.** In both builds the DEF subtraction and its
`minDamage` floor are applied to the physical term *only*, and the four elemental terms are
added afterwards:
`MCSPlayer.as:3415-3420` → `damage -= this.getDefense(); if(damage < minDamage) damage = minDamage;`
then `setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));`
(web: `§1t99s0§.as:3484-3490`, `_loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_`).
Direct partial answer to **rebirth-elements blocker ②** ("elemental ATK-vs-DEF formula"):
there is no elemental-vs-DEF interaction — DEF does not apply.

**A dev console proves the expArray indexing.** `OverworldHUD.as:2136-2137` —
`/setlevel N` does `StatsManager.setStat(9, StatsManager.expArray[N-1] - 1); StatsManager.changeXP(1);`.
Confirms stat id **9 = raw cumulative XP** and that `expArray` is indexed directly by level.

---

## 8. Minor caveats on surviving claims (not refutations)

- `progression/per-point-magnitudes` — the frame arbitrates five of the six magnitudes.
  **AP +5 is not frame-confirmed**: the t=1600 frame shows AP 30/30 max, i.e. the starting
  value with zero points spent. AP+5 rests on the web A2 cite (`§1t9609s0§(5)`, and I
  confirmed `§1t9609s0§` = `addMaxAP` by reading its body against
  `StatsManager.as:addMaxAP`). The conclusion is right; the "frame wins for all six"
  framing is one step too strong.
- `progression/levelup-refill-and-cap` — "reported as a cheat" is **android-only**. The web
  build at `§1t1523s0§.as:2043-2047` shows a localized dialog and returns `false`, with no
  `reportHack`, and its multi-level guard is `> 2`, not `> 1`. Correctly cited to android,
  but do not port the reportHack path as web behaviour.
- `progression/unlock-cadence-to-l80` — I verified the endpoints and the count
  (`skilldata.xml:257` `<lvlreq>3</lvlreq>` id 1004; `:1640` `<lvlreq>80</lvlreq>` id 1055;
  `grep -c "<lvlreq>"` = 33) but did not re-derive all 33 gate names.

## 9. Counts and commands I ran

```
$ grep -c "<exp>" reference/extracted/questdata.xml            → 69
$ grep -c "<lvlreq>" reference/extracted/skilldata.xml         → 33
questdata.json: questdata/quest/step/wave/enemy/lvl  count 142, range [2.0, 35.0]
                questdata/quest/step/wave/friend/lvl count 9,   range [25.0, 80.0]
$ npx vitest run tests/xp.test.ts
  Test Files  1 passed (1)      Tests  11 passed (11)
src/config/xp.ts:23-25  XP_THRESHOLDS = [550,1450,2950,5150,8350,12150,16350,20900,25900,31400]
                        ≡ expArray[1..10]  ✓
```
