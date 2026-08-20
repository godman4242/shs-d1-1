# CRITIC — LENS 1 (CITE LENS) — packet `src-actionscript.claims.json`

Packet size **45**. Judged **45**. No silent caps.
Refuted **8** · Held **37** (12 of those held with an explicit correction attached).

Every verdict below names an artifact **I** opened. Machine-audit status carried in:
3 QUOTE_UNVERIFIED (16, 30, 41) — **all three quotes located by hand**; 1 UNCHECKABLE (28) —
**refuted, the "not found" is false**; 41 RESOLVES.

I did not read `docs/gauntlet/L0/sources/actionscript.md`.

---

## CLASS MAP I ESTABLISHED FIRST (used by many verdicts)

Web payload is identifier-obfuscated. I fixed the inheritance chain by reading class headers,
so "web twin of X" is not guesswork:

| web file | `extends` | = Android class |
|---|---|---|
| `§1t1544s0§.as` | — | `MCSActor` |
| `§1t68s0§.as` | `§1t1544s0§` | `NPC` |
| `§1t99s0§.as` | `§1t68s0§` | `MCSPlayer` |
| `§1t122s0§.as` | `§1t99s0§` | `EnemyPlayer` |
| `§1t4904s0§.as`, `§1t4909s0§.as` | `§1t122s0§` | EnemyPlayer subclasses (clone/duelist) |
| `§1t1523s0§.as` | — | `StatsManager` |
| `§1t1541s0§.as` | — | `InputManager` |
| `§1t75s0§.as` | — | `MCSCharacter` (PART_ indices 12/16/17 confirmed identical) |

This map is what exposed the errors in claims 6, 35 and 37.

---

## REFUTED (8)

### R1 — `actionscript/repair-cost` (idx 28) — **FATAL**
Claim: *"The Repair-Weapon cost formula was NOT found in either ActionScript tree during this sweep."*

**It is there, plain-named and greppable.**

```
reference/decompiled/shs3_android/scripts/InteractUI.as:1057:            case "repairweapon":
reference/decompiled/shs3_android/scripts/InteractUI.as:1058:               cost = StageManager.getCurrentNodeLevel() * 10;
reference/decompiled/shs3_android/scripts/InteractUI.as:1059:               if(StatsManager.getGold() < cost)
reference/decompiled/shs3_android/scripts/InteractUI.as:1072:               StatsManager.changeGold(-cost);
reference/decompiled/shs3_android/scripts/InteractUI.as:1073:               if(weapon.uses > 1)
reference/decompiled/shs3_android/scripts/InteractUI.as:1075:                  weapon.uses = 1;
```
`getCurrentNodeLevel()` resolves at `StageManager.as:782-785`. A single `grep -rin repair` over
`reference/decompiled/shs3_android/scripts/` surfaces it in the first 20 hits.
This is a STILL_UNHELD that should have been HELD. Own cite: `reference/decompiled/shs3_android/scripts/InteractUI.as:1058`.

### R2 — `actionscript/repair-cost-is-two-consumables` (idx 29) — **MATERIAL**
The two consumables **hold exactly** (`reference/extracted/itemdata.xml:293` id 2119 baseprice 20
modifier 82 value 10 → `strings.json["4141"]` = "Whet Stone"; `:306` id 2120 baseprice 40 modifier
82 value 25 → `strings.json["4143"]` = "Sword Repair Kit"; consumed at `InventoryUI.as:994`).
What is **false** is the exclusive framing *"Weapon repair is **not a priced service** but two shop
consumables."* It is both. `InteractUI.as:1058` is a gold-priced repair service (nodeLevel × 10), and
`GetGoldPromptDialog.as:225-235` + `strings.json["669"]` ("Would you like to make it unbreakable for
2 Gold?") is a third, premium path. Re-bank without the "not a priced service" clause.
Own cite: `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081`.

### R3 — `actionscript/war-board-is-a-hex-grid` (idx 41) — **MATERIAL**
Claim: *"a hexagonal grid … not an abstract adjacency list and **not a square grid**."*
The 14 typed roles and the n/s/e/w arrow children are real and verbatim (`WarHex.as:11-37`, `:41/:43/:47/:55`).
The **geometry is refuted**: it is a 6×6 square lattice on a uniform 55 px pitch with **no odd-row offset**
and **4-way** adjacency.

```
reference/decompiled/shs3_android/scripts/WarHexUI.as:350:            for(i = 0; i < 6; i++)
reference/decompiled/shs3_android/scripts/WarHexUI.as:352:               for(j = 0; j < 6; j++)
reference/decompiled/shs3_android/scripts/WarHexUI.as:358:                  this.hexArray[xpos][ypos] = hex;
reference/decompiled/shs3_android/scripts/WarHexUI.as:359:                  hex.x = 90 + xpos * 55;
reference/decompiled/shs3_android/scripts/WarHexUI.as:360:                  hex.y = 92 + ypos * 55;
```
and edge-exit adjacency is strictly cardinal:
```
reference/decompiled/shs3_android/scripts/WarHexUI.as:447:         if(xpos == 0)  … getOwner(territoryx - 1,territoryy);
reference/decompiled/shs3_android/scripts/WarHexUI.as:451:         if(xpos == 5)  … getOwner(territoryx + 1,territoryy);
reference/decompiled/shs3_android/scripts/WarHexUI.as:455:         if(ypos == 0)  … getOwner(territoryx,territoryy - 1);
reference/decompiled/shs3_android/scripts/WarHexUI.as:459:         if(ypos == 5)  … getOwner(territoryx,territoryy + 1);
```
`WarHex.as:219-222` gates the same four arrows on `ypos != 0 / != 5 / xpos != 5 / != 0`.
A hex grid needs a per-row x-offset and six neighbours; neither exists. The cells are *drawn* as
hexagons (`[Embed] symbol622`) — the **board topology is square**. Banking "hex grid" would send
an implementer after cube coordinates for nothing.
Own cite: `reference/decompiled/shs3_android/scripts/WarHexUI.as:350-360` and `:443-464`.

### R4 — `actionscript/spd-to-cooldown` (idx 35) — **MATERIAL (build-parity)**
Android `StatsManager.as:1854-1860` says exactly what the claim says — cap 300.
The **web v0.717 twin caps at 600**:
```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289:      internal static function §1t9590s0§(param1:int) : Number
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2291:         if(param1 > 600)
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2293:            param1 = 600;
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2295:         return 1 - param1 / 600 * 0.5;
```
Identity of the twin is not inferred: `§1t9589s0§` (`:2279-2286`) reads SPEED+bonus, ×1.5 on the buff,
then calls `§1t9590s0§` — and its caller `§1t105s0§.as:318` (`return _loc2_ * §1t1523s0§.§1t9589s0§();`)
is the line-for-line twin of `XMLSkill.as:310` (`return val * StatsManager.getSkillCooldownModifier();`).
The claim states "SPEED 300 is the cap" unqualified while this project targets the **web** build.
Shape (linear, 50 % max CDR, buff before clamp) holds in both; the constant does not.
Own cite: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2295`.

### R5 — `actionscript/stance-counter-triangle` (idx 36) — **MATERIAL**
Claim: *"I could not find any code path applying a counter bonus, so the triangle may be advisory
flavour rather than a mechanic."* The path exists, in the same file the claim already cites:
```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3786: if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§ || …)
reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788:               _loc5_ *= 1.2;
reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3797:               _loc5_ *= 0.9;
```
The search missed it because the code reads the bare field `this.stance` / `enemyStance`, never
`getStance()` — the claim's own grep method is what produced the false negative. (The observation
that `BattleUI.as:368` is the only `getStance()` reader is itself correct — it just proves nothing.)
Superseded by idx 37. Own cite: `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3786-3798`.

### R6 — `actionscript/stance-counter-triangle-confirmed` (idx 37) — **MATERIAL**
Two of three clauses hold. The ×1.2 unfavourable branch + white `16777215` popup is verbatim at
`§1t99s0§.as:3786-3791` (web) and `MCSPlayer.as:3701-3707` (Android). The ×0.9 favourable branch
**is** web-only — `grep -rn '\*= 0.9;'` over `reference/decompiled/shs3_android/scripts/` returns no
stance-context hit.
**Refuted clause:** *"which also widens the rule to ordinary NPC defenders."* It does not. The web
`NPC` twin is `§1t68s0§.as`, and its damage path has **no** stance branch at all:
```
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:465:         if(this.§1t3309s0§() > 0)
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:467:            _loc3_ -= this.defense;
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:472:            if(this.§1t1071s0§)
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:474:               _loc3_ *= 1.3;
```
The extra web sites the claim leaned on — `§1t4904s0§.as:419-430`, `§1t4909s0§.as:155-165` — both
`extends §1t122s0§` which `extends §1t99s0§`, i.e. **EnemyPlayer subclasses, not ordinary NPCs**.
Android has the same two-class spread (`MCSPlayer.as:3703` **and** `EnemyClone.as:436`, which the
claim missed). Net: identical scope in both builds; only the ×0.9 branch is new in web.
Own cite: `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:465-481` + class headers of
`§1t4904s0§.as:5` / `§1t4909s0§.as:4` / `§1t122s0§.as:4`.

### R7 — `actionscript/drawn-line-render-contract` (idx 14) — **MATERIAL**
Thickness 8 (`InputManager.as:57`), `largestUnit` 20 (`:59`), 2 px minimum step (`:356 if(distanceTravelledSQ < 4) return;`),
round caps/joins and linear taper to zero (`:360`), AI line black (`:492`), web parity (`§1t1541s0§.as:361`)
— **all confirmed**. The **colour is wrong**: the literal is `10027008`, which is `0x990000`, not `0xA30000`.
```
$ python3 -c "print(hex(10027008), 0xA30000)"
0x990000 10682368
$ grep -rn '10682368\|0xA30000' reference/decompiled/     # → no matches
```
The project already carries the correct value (`src/config/palette.ts:58: winRed: 0x990000`). Also
incomplete-but-notable: the web build has a **second** stroke colour, `39168` = `0x009900`, at
`reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:174`. Refuted because the wrong constant is
in the claim **text**, and a slash-line colour is precisely what this lane exists to bank correctly.
Own cite: `reference/decompiled/shs3_android/scripts/InputManager.as:360`.

### R8 — (see idx 11 under HELD-WITH-CORRECTION) — not refuted; the same hex error there sits in the
quote annotation rather than the claim text.

---

## HELD (37)

Each was checked by opening the artifact. Grouped; corrections called out.

**Clean holds — cite resolves, text matches, no correction (25):**
0 adaptive-music-system · 2 anim-format · 4 ap-and-war-clocks · 5 auto-slash-is-the-enemy-ai ·
7 build-divergence · 8 coins-per-kill-is-data · 9 crit-is-focus-gated-deterministic ·
10 damage-is-a-random-roll · 12 dan-cap-and-post-rebirth-sp · 13 defense-is-flat-subtraction ·
15 enemy-level-scaling-and-1hp-trash · 16 farming-and-prosperity-numbers · 17 focus-bar-is-the-third-hud-bar ·
18 focus-meter-numerics · 19 hit-registration-window · 21 loot-tables-held · 24 no-condition-damage-multiplier ·
25 paperdoll-compositing-contract · 26 reach-300-200-100-refuted · 27 reach-formula · 31 screenshake-and-killbeat ·
32 sell-price-formula · 33 shunpo-is-teleport-double-damage · 34 slash-frames-ordering-conflict ·
38 stance-damage-is-mastery-10 · 39 territory-daily-sim-vocabulary · 43 xp-curve-l11-80 · 44 xp-income-model

Notable independent reproductions:

* **idx 0** — I counted 13 stem names at `§1t133s0§.as:115-127` and 18 `MUSIC_*` states at
  `MusicManager.as:12-46`; the preset matrix is at `:133-187`; the ±0.05 step at `:301`/`:329`;
  **per-frame** confirmed because `GameEngine.as:923 MusicManager.instance.update();` sits inside
  the `Event.ENTER_FRAME` gameloop (`GameEngine.as:442`). "Phase-locked" is real —
  `MusicManager.as:206-226` seeds a new stem from an anchor stem's `.position`.
* **idx 17 (A1, the only frame claim)** — I re-cropped `reference/frames/duel_dense/Nr4fQstqHDM_*.png`
  at **(230,960)–(560,1070), 4× LANCZOS**, and re-measured the leading run of R,G,B > 170 from x = 246
  at y = 1032/1036/1040. My numbers are **identical** to the claim's:
  `432.4 → 0 · 432.5 → 2 · 432.6 → 6 · 432.7 → 10 · 432.8 → 15 · 432.9 → 19 · 433.0 → 19`, trough
  x 246–513 ≈ 268 px. In `_428.0` I can see the green 20/20 bar, blue 26/26 bar, a brown plate reading
  **CANNOT CHANGE STANCE** in the third slot with gold **150% DAMAGE** beneath, and **no fourth bar**.
  Measured 42.5 px/s vs the code-predicted 38.3 px/s (which correctly uses the `maxreload − 24` UI
  dead-zone from `MCSPlayer.as:1163-1168`). **No frame-vs-doc conflict arose in this packet** — where
  the frame spoke, it agreed with the code.
* **idx 43** — I re-ran the comparison myself: `android entries 99 / web entries 99 / IDENTICAL: True`,
  `expArray[11]=37400`, `expArray[80]=4285800`. `§1t1523s0§.as:364` vs `StatsManager.as:78`.
* **idx 24** — I re-measured `reference/extracted/itemdata.xml`: 982 items; 115 carry `<uses>`
  (100×46 · 80×34 · 60×34 · 50×1), 106 carry `<slashusage>` (72×70 · 96×35 · 24×1), both confined to
  id 13014–13227. Reproduces the claim exactly.
* **idx 21** — byte-identity re-run by me: `list1 identical: True`, `list2 identical: True`
  (`LootDialog.as:73/75` vs `§1t6172s0§.as:82/84`).
* **idx 7** — all six divergences verified pairwise. One nuance: the Android in-battle stance cost is a
  **two-branch** rule (`MCSPlayer.as:3098-3105`: `reload = maxreload/3` if above half, else
  `reload -= maxreload/6`), not a plain `maxreload/6`.

**Held with a correction attached (12):**

| idx | claim | correction |
|---|---|---|
| 1 | affix-generator-complete | the pool is **17 stat channels × 8 name tiers** (`ItemGenerator.as:24-56` runs MAXHP 0 … PIERCINGDMG **16**; `:131-147` assigns all 17), built from **13 distinct** pre/suf arrays (`:102-127`). "16×8" matches neither reading. Everything else — prog1..prog5 at `:150-183`, the rarity dice table at `:206-251`, web parity at `§1t1644s0§.as:167-210` / `:255-277` — is exact. |
| 3 | animation-manifest-with-durations | 442 String constants and 482 `<anim d=…>` rows both re-counted and correct. But *"every slash is a four-part clip whose second part loops"* is over-broad: `*_fallslash_*` are **three**-part and `*_jumpslash_partb` has **no** `l="1"` (`reference/extracted/anim_xml.txt`). True of the hor/up/down slash family only. |
| 6 | behead-and-weapon-parry | multipliers correct apples-to-apples (web `§1t99s0§.as:3807` ×1.3 vs Android `MCSPlayer.as:3716` ×1.5). **Cite mis-targeted:** the web weapon-parry is *not* in `§1t99s0§` (whose switch at `:3736-3747` has no weapon case). It is at **`reference/decompiled/shs3_payload/scripts/§1t68s0§.as:458-461`** (`case mcs.§1t6231s0§[§1t75s0§.§1t12380s0§]` — `§1t12380s0§ = 3 = PART_weapon` — `§1t3256s0§ = false; _loc3_ = 0; return false;`). Parry is an **NPC-defender-only** surface in both builds. |
| 11 | damage-popup-colors | four of five hexes are right (`0xFF6600`, `0xCCCCCC`, `0x0066FF`, `0x663300`, plus `0xFFFFFF`). The physical channel annotation is wrong: `10027008` = **`0x990000`**, not `0xA30000`. Not refuted only because the error is in the quote gloss, not the claim text — **fix before banking**. |
| 20 | in-combat-stance-not-hard-locked | code half exact (`§1t99s0§.as:3050`, `:3060-3062`, `:3162`). The clause *"'CANNOT CHANGE STANCE' is the insufficient-Focus message"* is **inference, not artifact**: that string appears nowhere in `reference/decompiled/` or `reference/extracted/`, and is absent from the v0.682 table (`strings.json` has 125 "Stance Restriction", 208 "Change Stance"). Note also Android `MCSPlayer.as:2965-2967` has **no** Focus gate — the `>= 48` gate is a web-only addition. |
| 22 | multi-target-full-damage | mechanics all correct. Inline line numbers drift: the real lines are **1225** (`while(j < slashMax && !enemy.gotHitFlag)`), **1252** (`if(enemy.gotHitFlag)`), **1254** (`comboCount++`), **1286** (`StatsManager.addCombo`). The range cite `:1204-1295` does contain them. |
| 23 | native-resolution | correct, and I closed its build-parity hole: the web twin carries the same constants — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104` `stageWidth:int = 800`, `:106` `stageHeight:int = 480` (names un-mangled). |
| 25 | paperdoll-compositing-contract | all 27 indices verbatim; head sub-stack `:683/:706/:724/:755` exact. Two notes: the class-resolution lines are **602** and **606**, not 605/609; and *"back-to-front z-order"* is genuinely proven, by `MCSCharacter.as:141-145` (`addChild(mc)` in index order) — worth carrying, since idx 19's front-to-back hit walk depends on it. |
| 30 | save-schema | QUOTE_UNVERIFIED **overturned** — I located every `saveUpdate(n, …)` in `QueryManagerPIO.as:1047-1187` and the checksum at `StatsManager.as:4379-4380`. Correction: **3** timer slots (100 AP / 101 DT / 102 war), not 4; slot **103** is `getBattleStatsString()`, a data slot written alongside slot 1 (`:1057`). |
| 40 | three-shipped-languages | `StatsManager.as:62-68` exact; `clientVersion:Number = 0.682` at `:30`. Correction: the ZH-CN and JA tables **are not held** — `reference/extracted/android/` contains only `118_Mobile_Lang_EN.bin` (42 blobs, listed). "two more complete 2,533-entry string tables exist" is true of the shipped game, false of our evidence, and their entry counts are unverified. |
| 42 | web-payload-obfuscated | thesis correct and load-bearing (I relied on it throughout). Counts are loose: `ls *.as` gives **645 top-level** files of which **569** match `^§1t[0-9]+s0§\.as$` and 34 are plain-named asset stubs; `find … -name '*.as'` gives **1079** total, 408 non-obfuscated (SDK/Flash-UI dirs). The "385 shs3_payload classes" figure is **not reproducible** from `docs/gauntlet/L0/index/actionscript.json`, which reports `shs3_payload: 1079`. |
| 16 | farming-and-prosperity-numbers | QUOTE_UNVERIFIED **overturned** — `:55` gracePeriod 900, `:61` cols 3, `:63` rows 2, `:549/552/555/558` the four periods, `TerritoryData.as:788/:800` all verbatim; patch level every 10 harvests at `:457-479`, cap 50 at `:105-107`; consumer confirmed (`DungeonGenerator.as:1363 var prosperity:int = territoryData.getTownLevel();`). Correction: `getTownLevel()` returns **0–5 (six bands)** across the five thresholds listed. |

---

## NEW FINDINGS (things the surveyor missed)

1. **Repair-Weapon cost = `getCurrentNodeLevel() * 10` gold** — `InteractUI.as:1058`, deducted `:1072`,
   restores `weapon.uses = 1` at `:1075`. (A2. Overturns ledger item "Repair-Weapon cost never captured".)
2. **Make-unbreakable / reinforce prices** — `InteractUI.as:1083: cost = 5000;` (gold), and a 2
   heavenly-gold path at `GetGoldPromptDialog.as:227` / `strings.json["669"]`.
3. **Build divergence #7 (unlisted in idx 7)** — skill-cooldown SPEED cap **300 (Android v0.682)** vs
   **600 (web v0.717)**: `StatsManager.as:1856-1860` vs `§1t1523s0§.as:2291-2295`.
4. **War board is a 6×6 square lattice**, `WarHexUI.as:350-360`, cardinal-only adjacency `:443-464`.
5. **Second drawn-line stroke colour in web** — `39168` = `0x009900` at `§1t1541s0§.as:174`, alongside
   the `10027008` = `0x990000` taper stroke at `:179`/`:361`.
6. **Web weapon-parry cite** — `§1t68s0§.as:458-461` (the correct location for idx 6's parry half).
7. **Stance triangle has a second Android site** — `EnemyClone.as:434-441`, ×1.2 only, missed by idx 37.

## BUILD-PARITY LEDGER FOR THIS PACKET
Android-v0.682-only evidence carried by otherwise-sound claims: 4, 5, 8, 12, 13 (floor ladder), 16,
19, 22, 23 (closed by me), 24, 25, 30, 31, 33 (web spot-checked), 35 (**broke** — see R4), 39, 40.
What closes each: find the obfuscated twin in `shs3_payload/scripts/` via the class map at the top of
this file, then diff the constant. That method is what caught R4 and R6 — it should be run over the
whole Android-only set before any of those numbers are marked CONTRACT.
