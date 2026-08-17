# CITE-LENS CRITIC — unit: world-exploration

**Lens:** over-claiming. Every cite below was opened by me, first-hand, in this session.
**Bottom line:** 0 claims refuted. This is the cleanest cite discipline I have audited in this
gauntlet — 20 of 23 cites resolve to the *exact* line number, and the four A1/A3 claims all
reproduce independently. But four sub-assertions buried in `lane_impact` fields are wrong, one
of them materially (a citation that does not say what it is claimed to say), and those must be
struck before this journal is used as a porting source.

---

## What I re-derived from scratch (not taken from the surveyor)

| Check | My command / method | Result |
|---|---|---|
| Land mask parity | `md5` + `cmp` on `reference/extracted/bindata/92_1t4648s0.bin` vs `reference/extracted/android/110_Mobile_MapBitmapData.bin` | both `13068dfa1a5cc5628720a25782f93fed`, `cmp` silent → **BYTE-IDENTICAL** |
| Land mask decode | PIL on the 272-byte GIF | `GIF (63,72) P`; pixel histogram `{(0,0,0): 3801, (255,255,255): 735}`; land bbox i∈[1,61] j∈[1,70] |
| Level gradient | recomputed `abs(tx-341)+abs(ty-341)+3` over all 735 land pixels with i=x−328, j=y−290 | n=735, **min 3 max 93**; histogram L3×1 L4×2 L5×4 L6×5 L7×7 L8×8 L9×10 L10×9 L11×10 L12×14 — **identical to the surveyor's, digit for digit** |
| Place name | re-implemented the LCG `seed=(seed*9301+49297)%233280` and re-parsed `namestarting`/`nameending` out of `NameGenerator.as:40,42` | territory (344,342) → id 1409366 → `RNG(2818732)` → **"Kakuchi"**; start territory 1397077 → **"Kasuta"** |
| Start coords | decoded 8382465 by hand | 8382465>>12 = 2046, &0xFFF = 2049 → territory (341,341) → displayed (21,51); sector 2046%6=0, 2049%6=3 → **(0,3)** |
| Node file census | regex over `112_Mobile_NodeData.bin` | 44 `<node>`, 98 `<room>`, 94 `<width>` (min 800 max 4000; modes 800×22, 1000×21, 1400×7, 1600×7), 343 `<obj>` of which **id 0 = 186**, 30 distinct `<bg>`, 24 `<roomname>`, 4 `<enterx>`, **exactly 1 `<search>`** |
| Object enum | `awk` over `GameStage.as` 683–925 | cases **0…72 = 73 entries**, plus `case 100:` at :928 |
| Cross-build | `grep -cE "getNodeLevel\|APINTERVAL\|TERRSHIFTX\|getOreType" reference/extracted/payload.xml` | **0** — confirms the honest STILL_UNHELD |
| Config | `ls src/config/` | 27 entries, exactly the quoted list; no `world.ts`/`ap.ts`/`farming.ts`/`nodes.ts` |

**Frames I opened myself** (`reference/frames/Nr4fQstqHDM/map/frames/`, source frames are 512×288,
so I upscaled Lanczos ×8 before grading):
- `frame_0020.jpg` — 6-column × 6-row minimap, columns labelled `0 1 2 3 4 5`, rows `0 1 2 3 4 5`,
  N/E/S/W compass letters, white player triangle at col 1 / row 3, gold up-arrow at (3,0), gold gate
  at (5,0), gates on row 5, dashed white route. HUD prints `TERRITORY (24,52)` / `SECTOR (1,3)`.
  Title bar reads `W KAKUCHI MOUNTAIN PATH`. Player level badge reads **8**.
- `frame_0040.jpg` — `TERRITORY (24,52)` / `INSIDE SECTOR (3,0)`.
- `frame_0080.jpg` — title `KAKUCHI DOJO GATES`, `TERRITORY (24,52)` / `SECTOR (3,2)`.

**Frame vs doc: no conflict.** `Territorymap.as:113` loops `i<6, j<6` and prints
`getString(557)+"("+(territory.x-341+DTERRSHIFTX)+","+…+")\n"+getString(319)+"("+sector.x+","+sector.y+")"`;
`Minimap.as:103` is the identical line with `"\nInside "` spliced in. Strings 557/319 resolve to
`Territory`/`Sector`. Frame and payload agree exactly. Nothing to adjudicate under the frame-wins rule.

---

## Cite audit — every claim, line by line

**Exact-hit cites (line number lands on the quoted text):**
`QuestEngine.as:1206` · `QuestEngine.as:1123` · `WarSelectUI.as:15,17,19` · `WorldMapUI.as:230` ·
`NodeGenerator.as:144` (`LEVELSTART:int = 3`) · `NodeGenerator.as:385-390` · `NodeGenerator.as:393` ·
`StatsManager.as:158` (`APINTERVAL:int = 60`) · `:208` (`STAT_LOCATION:int = 19`) · `:248`
(`STAT_LOCATION_ROOM:int = 43`) · `:707-708` · `:713` · `:1100-1103` · `:1184` · `:5073-5080` ·
`InventoryUI.as:2409` (`< 20 + (charlevel + 10)`) · `:960,980,1045,1067` · `Obj_Bush.as:47` ·
`Obj_OreDeposit.as:70` · `Obj_DirectionSign.as:20,106-108` · `NodeUI.as:361,384,395,414,427,460,535` ·
`InteractUI.as:1690,1723,1736` · `InteractUI_crops.as:457` · `TerritoryData.as:782-804,807-830,1054` ·
`QueryManagerBase.as:15` (`DATASLOTS:int = 20`) · `GetGoldPromptDialog.as:204` ·
`112_Mobile_NodeData.bin:5,8-18,16` · `payload.xml:118249-118266`.

`112_Mobile_NodeData.bin:8-18` deserves a note: the quoted 11-line `<roomdata>` block is *character
for character* what is on lines 8–18. That is a cite I could not improve on.

**Soft mis-cites (function is right, line number drifts 2–8 lines).** None of these change a verdict;
all are logged so a porter is not sent to a blank line:
- `RNG.as:64-66` — the LCG `randomSeed = (randomSeed*9301+49297)%233280` is at **:68**; 64–66 is
  `}` / blank / the `rnd()` header. Cited twice (place-name, world-is-procedural).
- `GameStage.as:683-920` — the enum runs to `case 72:` at **:925** and `case 100:` at **:928**; the
  quoted `case 30/31` pair is at :792–796, inside the range.
- `TerritoryData.as:74` — `this.nodeExits = this.generateSectors()` is at **:76**; :74 is `super()`.
- `NodeUI.as:424-490` for hunt/fish — hunt's `case ACTION_HUNT:` opens at :426; :424 is the tail of
  the previous case.
- `InteractUI_crops.as:595-646` — `wave.init(…)` is at **:596**, inside the range.
- frame crop `(360,10)-(512,120)` for `frame_0020` — that box clips the minimap's bottom row and
  does **not** contain the `TERRITORY (24,52) / SECTOR (1,3)` text the same entry quotes; that text
  sits around y≈140–150 in 512-space. Everything quoted is in the frame, just not all in that crop.

**No fabricated cites. No claim asserting a NAME where only a numeric ID exists** — every name in
this journal (`Small Meat`/`Meat`/`Large Meat` = 2112/2113/2114, `Pickaxe` = 13022, the ore ladder
strings 652–659, `Potato Dog/Bear/Raccoon/Cat/Pig/Duck` = 2115–2118/2140/2141, `W` = 401,
`Territory`/`Sector` = 557/319) resolves in `docs/gauntlet/L0/index/strings.json` or
`resolved_names.json`, which I opened. §2.1 is correctly treated as dead.

---

## The four sub-assertion defects (all inside `lane_impact`, none in a claim `text`)

### D1 — MATERIAL. `MCSPlayer.as:1230` does not say what it is cited as saying.
`world-exploration/ap-regen-and-cap` lane_impact: *"MCSPlayer.as:1230 makes AP==0 in adventure mode
a **death/retreat condition**."* I opened it. Line 1230 is inside `switch(actionState) { case IDLE_STATE:`:

```
if(!GameEngine.isAdventureMode() && !StageManager.isRedFreeze() && getHP() <= maxhp / 4 || GameEngine.isAdventureMode() && this.controlledBy == 0 && StatsManager.getStat(StatsManager.STAT_AP) == 0)
{
   startAnim(TIRED);
}
else
{
   startAnim(IDLE_SHEATHED);
}
```

`TIRED` is `MCSActor.as:116` → the string `"tired"`. This is an **idle-animation selector**: at 0 AP
the player stands in a tired pose instead of idle-sheathed. It is not death, not retreat, and has no
gameplay consequence at this site. `grep -n "STAT_AP) == 0"` across all 559 classes returns this one
line and nothing else. **Strike the sentence.** The real (and genuinely uncatalogued) finding is a
pose rule, not a death rule — see NF-1.

### D2 — MINOR. The 12-hour crop never rots.
`farming-tables` text: *"crop grow times 15 min / 1 h / 6 h / 12 h with a 15-minute harvest grace
before ROT."* `Obj_VegePatch.as` cases 1/2/3 each carry the three-way PLANTED → READYFORHARVEST →
ROTTED ladder. **Case 4 (`timePeriod = 12*60*60`) has only a two-way branch** — PLANTED, else
READYFORHARVEST. No `ROTTED` arm exists for it. Same shape is duplicated in
`InteractUI_crops.as:158-168`. The grace-then-rot rule covers three of the four crops, not four.

### D3 — MINOR. Three timer slots, not four.
`save-schema-recovered` text says *"20 numbered data slots plus **four** timer slots"* (and the score
rationale says *"the 24-slot save schema"*). `grep -o "saveUpdate([0-9]*"` over the whole decompile
returns ids **0–12, 14–19, 100, 101, 102, 103** — id 13 is never written. 100/101/102 are the three
timers (`nextAPUpdate`, `nextDTUpdate`, `nextWarTurn`); **103 is `getBattleStatsString()`, a data
slot**, written next to slot 1. The claim's own enumeration lists exactly three timers, so the word
"four" contradicts the claim body. Correct figures: 20 data slots (`DATASLOTS:int = 20`,
`QueryManagerBase.as:15`) of which 19 are numbered 0–19 plus 103, and 3 timer slots — 23 distinct
ids, not 24. The substantive point — §6's "design a persistence schema" is false, it needs
transcribing — survives untouched.

### D4 — MINOR. Name-table index off by one (name still reproduces).
`place-name-reproduced-from-payload` lane_impact says `namestarting[73]="Ka"`. Parsing
`NameGenerator.as:40` gives `namestarting[73] = "Iwa"`, `namestarting[74] = "Ka"`. My own re-run of
the LCG returns indices **(74, 19)** → `"Ka" + "kuchi"` = **"Kakuchi"**. `nameending[19]="kuchi"` is
right. The claim's conclusion is correct and I reproduced it independently; only the printed index
is wrong.

---

## New findings (things the surveyor did not have)

- **NF-1** (replaces D1): AP==0 in adventure mode swaps the player's *idle animation* to `"tired"`
  (`MCSPlayer.as:1230` → `MCSActor.as:116`). Out of adventure mode the same pose fires at
  `getHP() <= maxhp/4`. That is a real, portable feel rule for L1/L6 — it is just a pose rule.
- **NF-2**: the day-clock blocker is even more dead than claimed. `StatsManager.as:158/160/162` are
  three sibling constants: `APINTERVAL=60`, `DTINTERVAL=2*60`, **`WARMOVEINTERVAL=60*60`**. The
  ledger's ③ names the "war tick" as a consumer of the day length — it is **hourly**. So there are at
  least five independent real-time clocks (60 s AP, 120 s duel tokens, 3600 s war move, the four
  crop timers, 86400 s quest expiry), not three.
- **NF-3**: mining a Rock deposit is an unlimited faucet. `NodeUI.as:600` guards the despawn as
  `if(this.oreType != 1) { …clearOre() }` — oreType 1 (item 20059, "Unusable rocks") never clears, so
  a Rock node returns loot for 2 AP forever. That belongs in the L2 economy lane, not just L1.
- **NF-4**: `isNoChangeTown` pins far more than the 12 explicit ids. `NodeGenerator.as:399-400`
  returns true for any territory with `getTerritoryLevel < LEVELSTART + 5` (i.e. level < 8). Over the
  real land mask that is **19 territories** with a frozen town level, not 12.
- **NF-5**: independent corroboration of the name generator that the surveyor missed. The start node's
  authored label is `112_Mobile_NodeData.bin:6` `<name>1037</name>`, and `strings.json` id 1037 =
  **"W Kasuta Forest"**. The RNG-derived town name for the start territory is "Kasuta". The payload's
  own string table therefore confirms the LCG reproduction from a second, independent artifact.

---

## Verdict

Nothing here is refuted. The score of **85** is defensible on the evidence I opened; I would not move
it. Every one of the five ledger blockers is genuinely closed by an artifact I verified myself, the
four STILL_UNHELD entries are honest and each one checks out (`119_Mobile_MapData.bin` really is a
65-byte `<mapdata></mapdata>` stub; `searchList` really has zero consumers across 559 classes;
`124_Mobile_ImageResource.bin` really is a 1,734,935-byte `CWS` blob; the payload really returns zero
hits for the world constants). Apply D1–D4 as errata and the journal is porting-grade.
