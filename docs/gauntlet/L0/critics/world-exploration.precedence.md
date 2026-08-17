# world-exploration — LENS 3 (PRECEDENCE) critic

**Reviewer stance:** blind critic. I never saw the surveyor's reasoning. Every verdict below
cites an artifact **I** opened. Lens = stale-claiming: does a claim import a doc statement that
a later measurement, ruling, or frame overturned? Does it cite a doc where a frame settles it?

**Headline:** this is an unusually clean survey. I opened 20 of the 22 claims' artifacts and
**19 held on my own inspection**. One claim is textually FALSE and I refute it. Four otherwise-held
claims carry sub-assertion errors that would be ported wrong. The survey also *understates* itself
in two places, and it silently supersedes two prior banked claims without saying so.

---

## What I verified first-hand (own cites)

### Byte / decode checks I ran

```
$ md5 reference/extracted/bindata/92_1t4648s0.bin reference/extracted/android/110_Mobile_MapBitmapData.bin
MD5 (reference/extracted/bindata/92_1t4648s0.bin) = 13068dfa1a5cc5628720a25782f93fed
MD5 (reference/extracted/android/110_Mobile_MapBitmapData.bin) = 13068dfa1a5cc5628720a25782f93fed
$ cmp ... && echo BYTE-IDENTICAL
BYTE-IDENTICAL

$ python3 (PIL) on 110_Mobile_MapBitmapData.bin
GIF (63, 72) P   palette = {(0,0,0): 3801, (255,255,255): 735}
land count 735  total 4536   bbox i 1..61  j 1..70
```

Land mask **HELD exactly**: 63x72, two colours, **735** land pixels, bbox i∈[1,61] j∈[1,70].

```
$ python3 — level gradient over the mask, i = tx-328, j = ty-290 (from WarSelectUI TERRSHIFTX=21,
  TERRSHIFTY=51, WARMARKERSHIFTX=8 against QuestEngine.as:1206)
land territories 735 · min level 3 · max level 93
by level 3..12: [(3,1),(4,2),(5,4),(6,5),(7,7),(8,8),(9,10),(10,9),(11,10),(12,14)]
```

Every one of the surveyor's ten per-level counts reproduces **exactly**.

```
$ python3 — reference/extracted/android/112_Mobile_NodeData.bin
nodes 44 · rooms 98 · widths 94 (min 800 max 4000) · Counter[(800,22),(1000,21),(1600,7),(1400,7),...]
objs 343 · <search> blocks 1 · distinct <bg> 30 · obj id 0 (signpost) count 186
```

44 / 98 / 94 / 800..4000 / 343 / 186 / 30 / one search block — **all HELD**.

```
$ grep -rho "saveUpdate([0-9]*" reference/decompiled/shs3_android/scripts/ | sort -n -u
(blank=0) 1 2 3 4 5 6 7 8 9 10 11 12 14 15 16 17 18 19 100 101 102 103
```

23 distinct slots, not 24 (see correction C3).

```
$ ls src/config/
CLAUDE.md ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts
fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts
profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts
```
No `world.ts` / `ap.ts` / `farming.ts` / `nodes.ts`. Surface bullet **HELD verbatim**.

### Code cites I opened line-by-line

| cite | verdict |
|---|---|
| `QuestEngine.as:1204-1206` `hasTerritory` → `getPixel(...) != 0` | HELD (fn decl at 1204, quoted return at 1206) |
| `NodeGenerator.as:294-302, :318-322, :333` coordinate law | HELD verbatim |
| `NodeGenerator.as:385-390` level formula + `:144` `LEVELSTART:int = 3` | HELD verbatim |
| `StatsManager.as:158` `APINTERVAL:int = 60` | HELD |
| `StatsManager.as:707-708` `STAT_AP,30` / `STAT_MAXAP,30`; `:713` `STAT_LOCATION,8382465` | HELD |
| `StatsManager.as:1097-1115` regen loop + `BUFF_AP` `diff *= 2` | HELD |
| `InventoryUI.as:2409` `getStat(STAT_MAXAP) < 20 + (charlevel + 10)` | HELD (= level+30) |
| `StatsManager.as:1184` `completedTime < serverTimeVariable - 24*60*60` | HELD verbatim |
| `NodeUI.as:350` `var dice:int = 0;` + `:429-447` / `:462-480` hunt & fish | HELD — the `int` declaration is what makes `dice == 3` reachable; without it the whole 30/20/10 split would be dead code. Surveyor's reading is right. |
| `Obj_Bush.as:47` `int(Math.random()*10) <= getStat(1021)` | HELD |
| `Obj_OreDeposit.as:70` `oreType != 2 && int(Math.random()*2) != 0` | HELD verbatim |
| `Obj_VegePatch.as:80-140` grace `15*60`, periods `15*60 / 60*60 / 6*60*60 / 12*60*60` | HELD |
| `InteractUI_crops.as:596,601,605` harvest ambush wave, bg 43 / bg 19 variant | HELD verbatim |
| `TerritoryData.as:782-804` prosperity 0/500/1000/2000/4000 → 0..5 | HELD verbatim |
| `GameStage.as:680-920` object switch | HELD — distinct case ids are exactly `0..72` plus `100`. 73 entries + nested id. |
| `Obj_DirectionSign.as:20` `apuse:int = 1`; `:106-108` 0-AP town/dojo gate | HELD, incl. the `roomid < 14 || roomid >= 100` clause |
| `QuestEngine.as:1123` `generateNode(nodeID >> 12 & 0x0FFF, nodeID & 0x0FFF)` | HELD verbatim |
| `QueryManagerPIO.as:1047-1187` 23 `saveUpdate` calls | HELD (count corrected, C3) |
| `WorldMapUI.as:230` `(terrx + TERRSHIFTX) * 10 + 5` | HELD verbatim |
| `119_Mobile_MapData.bin` | HELD — 65 bytes, `<mapdata>\n\n</mapdata>`, zero children |
| payload negative greps (`getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType`) | HELD — all return 0 |
| `payload.xml:118249-118266` `roomdata`/`procgenronin`/`aggrobandits`/`merccaptain` | HELD |
| `reference/decompiled/shs3_payload/scripts/` = 652 display symbols (ColorPicker skins, body parts) | HELD |

### Frames I cropped and looked at

**`reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg`** (512x288 source), crop `(360,10)-(512,120)`
Lanczos x10 with a 6x6 red grid overlaid on the map box:

- 6 columns headed `0 1 2 3 4 5`, 6 rows labelled `0 1 2 3 4 5` — **HELD**
- N / E / S compass letters — **HELD**
- white player triangle in cell **(1,3)** — **HELD**
- gold up-arrow at **(3,0)** — **HELD**
- gate icons at **(5,0)** and **(0,5)** — **HELD**
- dashed white route outline — **HELD**
- gold **X** — the surveyor says "~(2,2)". Under the overlay it sits squarely in **(3,2)**. **CORRECTED (C1).**
- unmentioned: a gold **`!`** marker at ~(4,2).

Crop `(360,110)-(512,175)` x8: the HUD prints **`TERRITORY (24,52)`** / **`SECTOR (1,3)`** — **HELD**.
Crop `(20,40)-(180,64)` x5: title bar reads **`W KAKUCHI MOUNTAIN PATH`** — **HELD verbatim**.
Top strip x3: level badge **8**, XP `16827 / 20900` — **HELD** (matches the surveyor's level-7-node /
level-8-player cross-check).

**`frame_0080.jpg`**, crop `(0,0)-(512,180)` x3: title `KAKUCHI DOJO GATES`, `TERRITORY (24,52)`,
`SECTOR (3,2)`, no `W` prefix — **HELD verbatim**, and it independently confirms the prefix rule.

### I re-derived the place name myself

Ported `RNG.as:64-66` (`seed = (seed*9301+49297) % 233280`) and the two literal arrays from
`NameGenerator.as:40,42` into Python, then ran `getPlaceName` for the frame's territory:

```
displayed (24,52) → internal (344,342) → tid 1409366
namex = 344 % 137 = 70  (>= 26 → getTownName2 branch)
RNG(1409366*2 = 2818732): rand(78)=74 → "Ka"  ·  rand(37)=19 → "kuchi"   →  "Kakuchi"
level = |344-341| + |342-341| + 3 = 7
STAT_LOCATION 8382465 → sector (2046,2049) → territory (341,341) → displayed (21,51), sector (0,3)
start territory 1397077 → RNG → "Kasu" + "ta" = "Kasuta"
```

**Character-for-character match with the frame.** This is the single strongest thing in the journal
and it holds. (Index nit: `namestarting[73]` is `"Iwa"`; `"Ka"` is index **74**. The result is right,
the narrated index is off by one.)

---

## REFUTED

### R1 — `world-exploration/cross-build-numeric-parity` is textually FALSE — **material**

Claim text: *"only the land mask is byte-proven identical across v0.717 and v0.682"*.
Score rationale repeats it: *"it is the one world artifact with proven cross-build parity"*.

I md5'd all 27 web `reference/extracted/bindata/*.bin` against all 42
`reference/extracted/android/*.bin`. **21 of 27 web blobs are byte-identical to an android blob:**

```
110_Mobile_MapBitmapData.bin        == 92_1t4648s0.bin   (272 B)
84_QuestEngine_TrapRoomData.bin     == 93_1t4647s0.bin   (39,193 B)
85_NameGenerator_MaleNames.bin      == 94_1t4651s0.bin   (3,618 B)
86_NameGenerator_NobleFamilyNames   == 95_1t4649s0.bin   (279 B)
87_NameGenerator_SamuraiFamilyNames == 96_1t4652s0.bin   (289 B)
88_NameGenerator_FemaleNames.bin    == 97_1t4650s0.bin   (2,094 B)
89_NameGenerator_PlaceNames.bin     == 98_1t4653s0.bin   (5,698 B)
+ 14 MCSCharacter_* animation sets (Deer, DualStance, Wolf, Goblin, HeavyStance, Boar,
  LightStance, Bear, Human2, ReversedStance, Horse, BalancedStance, Undead, Human)
```

The claim's **operational conclusion survives** — AS3 constants (`APINTERVAL`, `LEVELSTART`, crop
timers, AP costs) genuinely are v0.682-only, and the negative greps hold. But its stated evidentiary
basis is false, and the error is not neutral: it **understates the journal's own strongest claim**.
`89_NameGenerator_PlaceNames.bin` being byte-identical is load-bearing for
`place-name-reproduced-from-payload`, and `84_QuestEngine_TrapRoomData.bin` being byte-identical
matters to the room inventory. Refuted on the text; the honest replacement is "the *AS3 constants*
are Android-only; **21 of 27 data blobs, including all five name tables and the trap-room file, are
byte-proven cross-build.**"

---

## CORRECTIONS to otherwise-HELD claims

**C1 — `frame-confirms-6x6-grid`, gold X is at (3,2), not ~(2,2).** My own crop
`(360,10)-(512,120)` Lanczos x10 with a 6x6 overlay. §0 demands "what is VISIBLY in it"; the claim's
thesis (6x6 grid, marker matches printed `SECTOR (1,3)`) is fully HELD, only this incidental
coordinate is wrong. A gold `!` at ~(4,2) also goes unmentioned.

**C2 — `farming-tables`, "first harvest guaranteed" is wrong.** `InteractUI_crops.as:607` reads
`if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - getStat(1020))) == 0)`.
`startingIndex + 2` is **`harvestedTimes`** (`InteractUI_crops.as:104`, capped 50 at `:105-107`;
`Obj_VegePatch.as:78` mislabels the same stat `soilLevel`). The guard is `== 1`, i.e. the harvest
taken when the counter already reads 1 — the **second** harvest, not the first, and not `<= 1`. This
is an oddly specific literal that reads like an authored quirk or an original-code bug; either way a
port that writes "first harvest guaranteed" ships the wrong rule. Everything else in the claim
(900/3600/21600/43200 s, 900 s grace, `getPatchLevel` 10/20/30/40/50, `1/(10-skill)`, the enemy-64
ambush at x=400 on an 800 px stage with bg 43 / bg 19) is verified verbatim.

**C3 — `save-schema-recovered`, it is 23 slots with 3 timers, not "24 / four timer slots".**
`grep -rho "saveUpdate([0-9]*"` over all 559 classes yields exactly `0-12, 14-19, 100, 101, 102, 103`
= **23** distinct slots: 20 data (19 numbered + 103 battlestats) and **3** timers (100 nextAPUpdate,
101 nextDTUpdate, 102 nextWarTurn). Slot 103 is battlestats and is not a timer. The claim's own
enumeration in `lane_impact` is complete and correct — only the two count words are wrong, and the
score rationale inherits the "24-slot" figure.

**C4 — `ap-cost-table`, the "4 travel methods resolve to ..." partition is ungrounded, and it
reverses a prior verified refusal.** `docs/gauntlet/L0/CLAIMS.md:2868`
(`world-exploration/four-travel-methods`, STILL_UNHELD) explicitly declined to score this bullet:
*"that is more than four transitions and fewer than four player-facing 'methods' depending on the
cut. Recording it as unheld rather than bending the evidence to the ledger's number."* I opened
`ScreenTransition.as:14-32` myself: `ACTION_EXPLORENODE 1, ACTION_INTERACT 2, ACTION_REFRESHROOM 3,
ACTION_REST 4, ACTION_TELEPORT 5, ACTION_TELEPORTDOWNED 6, ACTION_TELEPORTCLANQUEST 7,
ACTION_NOTHINGCLOSE 8, ACTION_REFRESHROOMONOPEN 9` — three distinct teleport transitions, which the
new partition collapses into one bucket, plus "stables" which is a `NodeUI`/`InteractUI` action and
not a `ScreenTransition` at all. The number 4 is reached by choosing a cut, not by measurement. The
claim's **headline is fully HELD** (see H1); this parenthetical should revert to STILL_UNHELD.

---

## PRECEDENCE HITS THE SURVEY DID NOT DECLARE (both in its favour)

**H1 — it silently overturns a banked PARTIAL, and it is right to.**
`docs/gauntlet/L0/CLAIMS.md:2751` banked `world-exploration/ap-cost-table-stable-mislabelled` —
PARTIAL, asserting *"there is no 5-AP stable object — 5 AP buys TRAVEL or CAMP"*. **That prior claim
is wrong.** I opened `InteractUI.as:1680`: the function that builds the adjacent-town option list is
literally `internal function initStablesButtons()`, and its options route to
`internal function travel(nodeid:int)` at `:1720`, whose body is
`var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;` … `if(!StatsManager.checkAP(5))`.
So the stable **is** the 5-AP object, and the ledger's "stable 5" is correct-but-incomplete —
exactly what the new claim says. The new round is right; it just never says it is superseding a
banked claim. **`CLAIMS.md:2751` should be marked overturned.**

**H2 — `ap-regen-and-cap` resolves a live frame-vs-payload conflict, and the survey doesn't say so.**
`CLAIMS.md:2288` (`economy/ap-and-token-caps-are-40`, HELD [A1]) invoked the STANDING INVARIANT
against the payload: *"AP max is 40 … the '30 max' does not and must not be ported. THE FRAME WINS."*
I opened that frame myself. `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg`,
crop `(470,110)-(780,290)` Lanczos x4 shows `AP 30 / 40`; crop `(300,0)-(1024,130)` x3 of the **same
frame** shows the level badge **`10`**, `26234 / 31400 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`.

**level + 30 = 10 + 30 = 40.** The android formula at `InventoryUI.as:2409` reproduces the web frame
**exactly**. So there is no longer a frame-vs-doc conflict on this axis: the flat "30" was the
level-1 creation initial, the flat "40" was one level-10 observation, and the *formula* explains
both. This makes `ap-regen-and-cap` an **A2+A1** claim, not A2 — and it is a **fourth frame↔code
agreement** proving an Android v0.682 AS3 constant reproduces web v0.717 behaviour, which cuts
directly against R1's framing. It also partially overturns `CLAIMS.md:2288`: AP max is **not** flat
40, it is level+30.

---

## LEAD (not a finding — I cannot close it under §0)

**Web v0.717 may hardcode a third place-name exception that v0.682 does not.**
`NameGenerator.as:136-144` hardcodes exactly two: `territoryID == 1405272 → "Ibamaya"` and
`== 1524045 → "Gokura"`. Neither string exists in `89_NameGenerator_PlaceNames.bin`. The **web**
payload's constant pool carries three capitalised place names adjacently, immediately after the
`nameending` array and `replace` (the `this.rex` call used only by the name functions) and
immediately before `getLocal`/`dateUTC`:

```
reference/extracted/payload.xml:119264  <item>Ibamaya</item>
reference/extracted/payload.xml:119265  <item>Gokura</item>
reference/extracted/payload.xml:119266  <item>Iwakuni</item>
```

`grep -rn "Iwakuni" reference/decompiled/shs3_android/scripts/` returns **0 files**. Counter-evidence
I found against my own hypothesis: `Iwakuni` **is** a normal row of the PlaceNames table (it sits in
a run of real Japanese cities — `Hofu / Iwakuni / Kudamatsu / Mine / Nagato`), so its presence in the
blob is innocent. But a blob row would not need to be an AS3 string constant. The parsimonious
reading is a third hardcode in v0.717's `getPlaceName`. **This is constant-pool adjacency, i.e.
inference, not a quoted line of code — STILL_UNHELD under §0.** Recorded because a port built on the
v0.682 exception list would emit a generated name where v0.717 emits a literal.

I also confirmed the web pool's `namestarting`/`nameending` runs match the android arrays in order
and content, with exactly the two absences a deduplicating constant pool predicts (`Kiyo` appears
once instead of twice; `i` and `no` are deduped against earlier pool entries). So the **generator
tables** are cross-build consistent; only the **exception list** is in doubt.

---

## Score

The survey's **85** is defensible and I would not move it much. R1 does not cost points — it
*understates* parity. C1–C4 are sub-assertion errors, not structural ones. H2 arguably earns a point
back (an A2 claim is really A2+A1). The honest adjustment is **85, unchanged**, with the four
corrections applied and `CLAIMS.md:2751` and `:2288` marked as superseded.

**Nothing in this lane touched source. No file outside this path was modified.**
