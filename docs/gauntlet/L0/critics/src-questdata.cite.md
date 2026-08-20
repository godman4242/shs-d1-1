# CRITIC — CITE LENS — `src-questdata`

Packet: `docs/gauntlet/L0/worklist/src-questdata.claims.json` · 11 claims · **11 judged, 0 skipped**
Source under audit: `reference/extracted/questdata.xml` (796,383 bytes, 27,734 lines)
Surveyor prose (`docs/gauntlet/L0/sources/questdata.md`) **not opened** — §3.2.

**Result: 9 survive · 2 REFUTED (both material) · 6 new findings, 4 of which overturn ledger entries.**

The two refutations share one root cause: the surveyor searched the name-generator **data
tables** and never opened the name-generator **code**. `NameGenerator.getPlaceName()` is
shipped in the *web* build and I reproduced both disputed place names from it exactly, with
no fitting. That collapses claim 4's inference and kills claim 8's STILL_UNHELD.

---

## 0. Machine-audit triage

| citelint | n | outcome |
|---|---|---|
| RESOLVES | 9 | 8 confirmed by hand · **1 refuted on content** (`frame-vs-payload-placenames`) |
| QUOTE_UNVERIFIED | 1 | **false positive** — quote found, claim survives (`portrait-count-correction`) |
| UNCHECKABLE (NO_CITE_STILL_UNHELD) | 1 | **refuted** — the honest answer was available (`placename-source`) |

Every `<param>` / `<property>` / `<name>` line number in the packet resolved to the exact
text quoted. Not one line cite was off. The failures are all in **inference**, not in cites.

---

## 1. THE HEADLINE REFUTATION — the place-name system is fully HELD

### 1.1 The generator is in the shipped WEB client

`reference/decompiled/shs3_android/scripts/NameGenerator.as:135` — `public function getPlaceName(territoryID:int) : String`

```as3
var territoryx:int = territoryID >> 12 & 0x0FFF;
var territoryy:int = territoryID & 0x0FFF;
var namex:int = territoryx % 137;
var namey:int = territoryy % 26;
if(namex < 26) { return this.getTownName1(namex,namey); }   // -> placeNamesArray[namex*26+namey]
return this.getTownName2(territoryID);                       // -> syllable pair
```

`:162` — `getTownName2` = `namestarting[RNG(territoryID*2).rand(78)] + nameending[rand(37)]`,
with the two syllable arrays literal at `:40` and `:42`.

**Build parity CLOSED.** The identical function is in the web v0.717 payload:
`reference/decompiled/shs3_payload/scripts/§1t136s0§.as:140` `if(param1 == 1405272)`,
`:144` `if(param1 == 1524045)`, `:152` `var _loc2_:int = param1 >> 12 & 0x0FFF;`,
`:154` `% 137`, `:155` `% 26` — including the same two hard-coded territory IDs
(→ "Ibamaya" / "Gokura"). The syllable arrays are in the web bundle too
(`grep -l '"Kitsu"' reference/decompiled/shs3_payload/scripts/` → `§1t136s0§.as`).
No Android-vs-web hole.

### 1.2 I reproduced the disputed names exactly

The frame the surveyor used, `reference/videos/Nr4fQstqHDM.mp4` @ t=60s, native 1920×1080,
also carries the coordinate readout. Crop **(1400,470)–(1920,600) upscaled ×3**:

> `TERRITORY (23,52)` · `SECTOR (3,5)`

`reference/decompiled/shs3_android/scripts/WarSelectUI.as:17` `TERRSHIFTX:int = 21`, `:19` `TERRSHIFTY:int = 51`.
`reference/decompiled/shs3_android/scripts/OverworldHUD.as:2187`:

```as3
nodeid = (terrX + 341 - DTERRSHIFTX) * 6 + secX << 12 | (terrY + 341 - DTERRSHIFTY) * 6 + secY;
```

So territoryID = `(23+341-21) << 12 | (52+341-51)` = `343<<12 | 342` = **1405270**.
Running the shipped RNG (`RNG.as:68`, `seed = seed*9301+49297 mod 233280`) through
`getTownName2`:

```
tid 1405270  ->  'Chikada'     <-- location bar at t=60s reads "S CHIKADA MINE"
tid 1409366  ->  'Kakuchi'     <-- one territory EAST; objective reads "FIND WORK AT KAKUCHI TOWN",
                                   location bar at t=900s reads "N KAKUCHI MOUNTAIN PATH"
```

And the questdata Prologue node `8382465` → nodeX 2046 / nodeY 2049 → territory internal
(341,341) → display **TERRITORY (21,51) SECTOR (0,3)** → `getTownName2` → **'Kasuta'**,
which is exactly the place name inside that node's authored label
`112_Mobile_NodeData.bin:6 <name>1037</name>` → `strings.json["1037"]` = `"W Kasuta Forest"`.

Three names, three exact hits, zero free parameters. This is not plausibility — it is the
shipped algorithm run on shipped data.

### 1.3 The location bar is a three-part composite

`strings.json["1005"]` = `"Mine"`, `strings.json["1015"]` = `"Mountain Path"`,
`strings.json["1003"]` = `"Forest"`. The bar is `<direction> <getPlaceName(territoryID)> <roomtype>`.
Every part is held.

**Consequence:** "S Chikada Mine" and "N Kakuchi Mountain Path" are NOT evidence that v0.717
renders content missing from the payload. They are evidence that the payload **generates**
that content. The standing invariant is not engaged here: **the frame and the payload do not
disagree — the payload explains the frame.**

---

## 2. Verdicts

### ✅ 1. `questdata/epilogue-verbatim-script` — HOLDS
`reference/extracted/questdata.xml:27552` / `:27557` / `:27617` — all three lines verbatim,
character-for-character, including the shipped authoring error at `:27617`
`<text>Good. Then the time for action has finally arrived. has arrived.</text>`.
Counts re-derived: 3,307 `<text>`, 2,771 `<dialogue>` — exact.

*Strengthened beyond the claim:* `reference/extracted/android/116_Mobile_QuestData.bin` is
**byte-identical** to `questdata.xml` plus one trailing `\n` (796,384 vs 796,383 bytes;
`b == w + b'\n'` → True). The campaign script therefore has **no web-vs-Android parity hole
at all** — the A-06 caveat can be narrowed to "not proven exhaustive", dropping "build parity".

*Corrections (minor):* word count is **40,135** by my tokenizer, not 40,119. Quest 59's
`<quest>` tag opens at `:27345`; `:27347` is its `<title>`.

### ✅ 2. `questdata/five-stances` — HOLDS, and is understated
All six cites verbatim (`:11787 reversed_stance`, `:26029 191,dual_stance,0`,
`:26078`, `:12101 168,spear_idle`, `:12107 161,balanced_stance`, `:12113 164,heavy_stance`).

Independent corroboration in the **web** build:
`reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:698 / :740 / :782 / :824 / :866`
declare exactly five idle constants — `light_stance`, `balanced_stance`, `heavy_stance`,
`dual_stance`, `reversed_stance`. Five dedicated blobs exist:
`95_MCSCharacter_ReversedStanceAnimationData.bin`, `97_..Balanced..`, `101_..Dual..`,
`106_..Heavy..`, `108_..Light..`, plus a separate `104_MCSCharacter_HumanSpearAnimationData.bin`
confirming spear sits outside the stance system. The whole questdata file contains exactly
five `*_stance` tokens. Not an inference — a declared enum.

### ✅ 3. `questdata/frame-corroborates-objective` — HOLDS (one wrong by-product)
Opened `reference/frames/zFtCaTO0_1M/seg-24/frames/frame_0003.jpg` (1024×576).
**Crop (40,120)–(420,190), upscaled ×4:** reads `STORY QUEST: TURN IN INOKICHI'S CLUB AT THE
BOUNTY BOARD`. Matches `reference/extracted/questdata.xml:4160`
`<title>Turn in Inokichi's Club at the Bounty Board</title>` character-for-character. Held.

**⚠ The lane_impact by-product is WRONG.** It reads "L7->L8 = 16550" off
`reference/frames/broad_survey/Nr4fQstqHDM_0060.jpg` — a **480×270** survey-scale frame, read
without upscaling, which is precisely the failure mode §0 forbids. The true value is **16350**:

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` (WEB build) —
`public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,…]`
(also `reference/decompiled/shs3_android/scripts/StatsManager.as:78`).
`expArray[6] = 12150` ✓ (the frame's "10431 / 12150" at level 6 is right) · `expArray[7] = 16350` ✗.

See NEW FINDING N2 — the *entire* curve is held, which makes the by-product moot anyway.

### ❌ 4. `questdata/frame-vs-payload-placenames` — **REFUTED (material)**
The frame reads are all genuine — I re-extracted at native 1920×1080 and confirmed
crop (60,120)–(900,340) ×2 at t=60s (`S CHIKADA MINE` + `STORY QUEST: FIND WORK AT KAKUCHI
TOWN`), t=300s (`TRAP CHALLENGE`, same objective), t=900s (`N KAKUCHI MOUNTAIN PATH`).
The **conclusion drawn from them is wrong on two independent counts.**

**(a) The headline statement is factually false.** The claim asserts the location names occur
"ZERO times in questdata.xml". They do not:

```
reference/extracted/questdata.xml:3922
        <text>inokichi was last spotted at N Chikada Dungeon.</text>
```

Same `<direction> Chikada <roomtype>` construction as the location bar. The claim's own quote
block lists `grep -c "Kakuchi" questdata.xml -> 0` and `grep -c "Chikada" payload.xml -> 0`
but **never ran Chikada against questdata.xml** — the one grep that would have caught it.

**(b) The inference is refuted outright.** The lane_impact concludes the names are "composed at
runtime from a source **not shipped in the client**". The source *is* shipped, in the web
build, and I reproduced both names exactly from it (§1 above). Nothing here is unrecoverable.

*What survives:* the narrower true statement that the composed strings do not appear as
literals in the payload — which is unremarkable once you know they are composed. The claim's
value as "a global caveat on L9 quests-story" does not survive; it should be replaced by
NEW FINDING N1. The "THE FRAME WINS" framing is misapplied: nothing disagreed.

### ✅ 5. `questdata/generated-npc-names` — HOLDS (two wrong support numbers)
Frame opened; full-frame ×2 read confirms every element of the quote — `GOJO OTONDO` with `!`
marker, `GUEST`, `MAIN STREET`, `310 COINS`, level 6, `10431 | 12150 EXPERIENCE POINTS`,
`TERRITORY (23,52)`, `INSIDE SECTOR (1,3)`, `20 / 20` ×2, `HEAVY STANCE`.

All six table cites resolve **exactly**: `86:5='Gojo'`, `85:267='Otondo'`, `87:7='Hachisuka'`,
`85:80='Kano'`, `87:11='Honda'`, `88:226='Shizuka'`.

Mechanism proven, not guessed — `NameGenerator.as:87` `getNobleName` returns
`NobleFamilyName + " " + MaleName`; `:96` `getSamuraiName` returns
`SamuraiFamilyName + " " + Male/FemaleName`. "Gojo Otondo" is a literal `getNobleName`;
"Hachisuka Kano" / "Honda Shizuka" are literal `getSamuraiName`. Zero authored occurrences of
`Hachisuka`, `Kano`, `Otondo`, `Zabuza` or `Hotaru` in `questdata.xml`, `npcdata.xml`, or
`strings.json` (the two `Shizuka` hits in questdata are the substring inside
"Shizukana Uta" at `:12634` / `:12669`, not a name). Ledger over-claim confirmed.

*Corrections (minor, both in lane_impact):*
- Table sizes are **398 male / 291 female / 33 noble / 36 samurai / 677 place**, not
  397/290/32/35/676. The files have **no trailing newline**, so `wc -l` undercounts by one;
  `NameGenerator.as` splits on `/\n/`, so the array lengths are the higher numbers.
- "only 16 of 535 nodes … carrying an authored `<name>`" is wrong and **inverts the point**:
  `112_Mobile_NodeData.bin` contains **44** `<node>` elements, of which **30 carry a `<name>`**.
  535 is the count of *all* `<id>` tags in the file, not nodes.

### ✅ 6. `questdata/knockdown-grapple-aerial` — HOLDS
All six cites verbatim (`:19323`, `:19477`, `:19494`, `:19500`, `:19516`, `:19778`).
The 88 figure **reproduces exactly**: distinct lowercase tokens across `<param>` + `<property>`
comma-fields = 88. Every named state present — `downed`, `flipupfromdowned`, `kneel`,
`kneeltostand`, `backthrow` + `backthrow_victim`, `airstab_start/mid/stab/end`,
`backstep_start/end`, `focus_start`, `warcry_start`, `buffarmor_start`, `throwgrenade`.
*Nit:* the 88 set includes `left`, `right`, `darkblur`, `masahiro_floating` — ~84 are true
animation states. Does not touch the claim.

### ✅ 7. `questdata/node-packing-decoded` — HOLDS as PARTIAL, and is now fully CLOSED
Every cite verbatim: `questdata.xml:15 <node>8382465</node>`; `112_Mobile_NodeData.bin:5`
`<id>8382465</id>`, `:6 <name>1037</name>`, `:11 <bg>4</bg>`, `:12 <width>800</width>`,
`:15 <x>750</x>` + `:16 <property>0,50,8386561,1,2,2,1</property>`, `:46` (x=50 → −4096),
`:74`. The gather table is there verbatim: `<search><id>20000</id><chance>5</chance></search>`.

Delta distribution re-measured independently:
`−4096 ×19, exit x 50..721` ✓ · `+4096 ×18, exit x 750..1550` ✓ · `−1 ×19` ✓ ·
`+1 ×19` (claim says 18 — one-element parser difference, immaterial). The x-ranges matching
to the pixel is strong evidence the measurement was really performed.

**The packing is no longer inferred — it is declared.** `NameGenerator.as:137-138` and
`NodeGenerator.as:296/305/314` both do `nodeid >> 12 & 0x0FFF` / `nodeid & 0x0FFF`.
The claim's declared-open item is closed by NEW FINDING N3.

*Over-claim to trim:* lane_impact says "the graph topology … all held". `112_Mobile_NodeData.bin`
holds **44** nodes — the hand-authored story nodes only. The overworld proper is *generated*
(NEW FINDING N4).

### ✅ 9. `questdata/portrait-count-correction` — HOLDS · **citelint false positive**
`QUOTE_UNVERIFIED` fired because the "quote" is a derived enumeration, not a file line.
I re-parsed `questdata.xml` from scratch:
- distinct `<img>` inside `<dialogue>` = **52**, and my set is **identical** to the claim's
  52-name list (symmetric difference = ∅).
- distinct `<img>` that are **direct children of `<intro>`** (nested `<dialogue>` stripped) = **16**,
  identical to the claim's list (`_exposition`, `_episode0.._episode12`, `_epilogue`,
  `_exposition_epilogue`).
- total distinct `<img>` in the file = **68** = 52 + 16. The run-1 correction is right.

### ✅ 10. `questdata/projectile-launch-params` — HOLDS as PARTIAL, stronger than claimed
All cites verbatim. The grammar is **not** an inference:

`reference/decompiled/shs3_android/scripts/XMLQuestCutscene.as:67` matches `"createprojectile"`,
splits on `,`, and `:75` calls
`ProjectileManager.createProjectile(strArray[0],strArray[1],strArray[2],strArray[3],strArray[4],0,skilllvl,null)`.
`reference/decompiled/shs3_android/scripts/ProjectileManager.as:131` —
`createProjectile(type:int, x:int, y:int, velX:Number, velY:Number, damage:int, skilllevel:int, owner:NPC)`.
So `typeId,x,y,vx,vy` is **proven**, and `:94` gives `public static var PROJ_ARROW:int = 40;`
— type 40 really is the arrow.

Cadence verified in situ: `firearrow` + `createprojectile` at `<time>0.3`, next pair at
`<time>0.7` → 0.4 s. Telegraph cycle `arrownormalpose → pullbackarrow → firearrow` confirmed.
*Bonus the claim missed:* a **6th** param is accepted and read as `skilllvl`
(`XMLQuestCutscene.as:71-74`). The claim's stated honest limit (scripted direction ≠ live AI)
is correct and should be kept.

### ❌ 8. `questdata/placename-source` — **REFUTED (material)**
"The source of v0.717's wilderness place names could not be established … I will not guess a
generation rule." No guessing was needed: the rule is `NameGenerator.getPlaceName`
(`NameGenerator.as:135`, web twin `§1t136s0§.as:152`), and I reproduced `Chikada`, `Kakuchi`
and `Kasuta` exactly from it (§1.2). The lane_impact's positive assertion — "Person names ARE
generated from client tables …; place names are not, by the same mechanism" — is **false**.
Place names are generated from client tables (677-entry `placeNamesArray` when `namex < 26`)
or from the client's own syllable arrays otherwise.

This is a *respected* answer form being given for the wrong reason. STILL_UNHELD is correct
only when the artifact was opened and did not contain the answer; here the artifact
(`reference/decompiled/`) was never opened. Left standing, it would send L8 hunting a dead
server for something sitting in the client.

---

## 3. NEW FINDINGS

**N1 · The overworld place-name system is HELD end-to-end.** A2 ·
`reference/decompiled/shs3_payload/scripts/§1t136s0§.as:152` + `NameGenerator.as:40,42,135,162`
+ `RNG.as:68`. Reproduced `Chikada` (tid 1405270), `Kakuchi` (1409366), `Kasuta` (1397077).
Overturns L8 blocker ①. **Web build — no parity hole.**

**N2 · The complete 99-entry level XP curve is HELD in the WEB build.** A2 ·
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
(= `shs3_android/scripts/StatsManager.as:78`). `[0,550,1450,2950,5150,8350,12150,16350,…,29395800]`.
Overturns the ledger's "L11-80 curve likely unrecoverable" — the whole curve, all 99 entries,
is a literal in the shipped web payload. Also fixes the 16550 → **16350** misread.

**N3 · The TERRITORY / SECTOR readout mapping is CLOSED.** A2 ·
`OverworldHUD.as:2187` + `WarSelectUI.as:17,19`:
`nodeid = ((terrX + 341 − 21)*6 + secX) << 12 | ((terrY + 341 − 51)*6 + secY)`.
Six sectors per territory per axis (`NodeGenerator.as:318` `% 6`). Verified against the
t=60s frame: `TERRITORY (23,52) SECTOR (3,5)` → territoryID 1405270 → "Chikada" ✓.
The high 12 bits are the **E–W** axis (the ±4096 the left/right room exits traverse); the low
12 bits are **N–S** (the ±1). This closes the item claim 7 explicitly left open.

**N4 · The overworld is PROCEDURALLY GENERATED, not authored.** A2 ·
`reference/decompiled/shs3_android/scripts/NodeGenerator.as:330` `generateNode(nodex,nodey)`,
`:566` `generateRooms(...)`, `:1539` `getLocationType`, `:1570` `getRoomBG`, `:1637` `getNodeName`.
`112_Mobile_NodeData.bin` holds only **44** hand-authored story nodes. L8 must model a
generator, not a map.

**N5 · The campaign script has NO web/Android parity hole.** A2 ·
`reference/extracted/android/116_Mobile_QuestData.bin` is byte-identical to
`reference/extracted/questdata.xml` + one trailing `\n` (796,384 vs 796,383). Every questdata
claim in this lane is therefore v0.717-valid without caveat.

**N6 · Name-generator table sizes corrected.** A2 · 398 male / 291 female / 33 noble /
36 samurai / 677 place (files end without a newline; `wc -l` undercounts by one).

---

## 4. Standing-invariant note
No frame-vs-doc conflict arose in this packet. The one place a conflict was *claimed*
(claim 4) turned out to be a payload that **explains** the frame rather than contradicting it,
so the invariant was not engaged — and I say that out loud rather than letting a false
"THE FRAME WINS" stand.

judged_count = 11 · packet_size = 11 · skipped = 0
