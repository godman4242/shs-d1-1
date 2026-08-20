# CRITIC — src-frames, LENS 1V (THE FRAME LENS)

Packet: `docs/gauntlet/L0/worklist/src-frames.claims.json` — **21 claims, 21 judged, 0 skipped.**
Method: for every claim I opened the cited `.jpg` myself with PIL, cropped to the named
region, and upscaled with LANCZOS before reading. Crop box + upscale factor is stated in
every verdict. I did **not** read `docs/gauntlet/L0/sources/frames.md`.

**Corpus fact the packet does not state:** every still under `reference/frames/` is
**1024x576**, not 1080p (`sips -g pixelWidth -g pixelHeight` on
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg` -> 1024x576). Every crop below
is therefore taken from a 1024x576 source. This matters: several of the errors I found are
exactly the "counted it on a small image" failure mode.

Result: **3 claims refuted** (2 material, 1 material-with-caveat kept as upheld),
**18 upheld**, of which 3 carry corrections that must be applied before banking.

---

## REFUTED

### C20 `frames/world-map-is-a-tile-lattice-with-clan-banners` — REFUTED (material)
own_cite: `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg`, crops
(40,220)-(950,305) @1.65x, (40,95)-(950,165) @1.65x, (40,155)-(950,235) @1.65x,
(700,160)-(780,230) @15x.

Three separate errors, all of the kind this lens exists to catch:

1. **"a 12-column lattice" is wrong — I count 13.** Crop (40,220)-(950,305) @1.65x shows a
   full row: grey blank / village+blue / town+blue / castle+yellow / blank / white-outlined
   selection / village / village / castle+red / village / village+blue / village+blue /
   village+blue = **13 columns**. A pixel scan of the tile borders at y=232 puts them at
   x = 54, 109, 176, 241, 309, (374 hidden by the white selection border), 442, 507, 575,
   640, 707, 773, 840, 901 — 13 cells at ~66 px pitch inside a panel ending at x~912.
2. **"a clan ownership banner in one of four colours" is wrong — there are five.** Blue,
   gold/yellow, red and green are all present, and so is a **black banner carrying a white
   circular mon**, on the castle-town tile at crop (700,160)-(780,230) @15x. A fifth side is
   exactly what `docs/gauntlet/L0/systems/meta-social.md:397-398` predicts ("the code speaks
   only in side **numbers** 1–5 and colours"). A rebuild taking "four colours" from this
   claim would ship four factions and lose one.
3. **"uniform W x H lattice ... not a 'sparse geographic outline'" overturns the ledger in
   the wrong direction.** Crop (40,95)-(950,165) @1.65x is the top row: tiles occupy only
   ~5 of the 13 columns, the rest is bare backdrop. The *geometry* is a regular lattice; the
   *occupancy* is sparse and follows the coastline. And the 13 columns are a **viewport**,
   not W: the quest cards in this same corpus read `TERRITORY (22,51)`, `(23,52)`, `(21,51)`
   and this map header reads `NAGANO (26,52)`, so the real board is far wider than 13.

What survives and should be re-banked: a tile-grid territory layer with per-tile settlement
icons, destroyed-X marks, a selection outline, and the legend
`VILLAGE / TOWN / CITY / CASTLE TOWN / DESTROYED / QUEST` +
`GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH` (frame reads a dash,
the claim wrote "="). Corrected numbers: **>=13 columns visible in one viewport, >=5 banner
colours, sparse occupancy over a regular lattice.**

### C16 `frames/two-font-faces-and-where-the-second-one-lives` — REFUTED (material)
own_cite: `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg` crop (420,5)-(700,90)
@5.36x, vs `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg` crop (350,55)-(690,78)
@4.41x; plus `reference/extracted/ui_strings.txt:201`.

First half holds: two faces on one screen is real. `frame_0018` crop (350,55)-(690,78) @4.41x
renders `Register now to fight LIVE PVP duels!` in an upright bold sans with **true
lower-case**, while `DUEL`, `DUEL TOKENS`, `CHALLENGE`, `RANKINGS`, `VICTORY TAUNT (...)`
on the same screen are irregular brush caps. Corroborates S0-2.

The **localisation is false**, from both directions:

- *"the plain sans face is reserved for account/registration nag copy"* — `ui_strings.txt`
  contains exactly two `face="Calibri"` runs, at **:182** (registration confirmation) and
  **:201** (`Your device/computer is behind a NAT or router that is preventing it from
  receiving messages`). :201 is a **network diagnostic**, not account copy. So the sans is
  not reserved for that class.
- The converse, which is what `lane_impact` actually hands a rebuild ("tells a rebuild which
  strings must NOT use the brush face"), is falsified by pixels: `frame_0003` crop
  (420,5)-(700,90) @5.36x shows the `REGISTER` button and the nag line
  `TO SAVE YOUR PROGRESS AND PLAY ONLINE!` **in the brush face**. That is account/
  registration nag copy rendered in Edo SZ.

A rebuild following this claim would put the wrong face on the register nag.

### C19 `frames/web-v0717-renders-android-string-table` — UPHELD, with a material bound
own_cite: `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg` crop (0,370)-(1024,576)
@1.46x; `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg` crop (0,380)-(700,576)
@2.14x.

The 12 named strings check out — I re-read `REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE
IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE` off frame_0042 and it is
`strings.json["850"]` word for word, and the `CONGRATULATIONS! ... JOIN THE WAR ROOM ...`
header off seg-20 is `["321"]` word for word. So the claim as written stands.

But the `lane_impact` — *"removes the 'android-only, unverified' hedge that S0-3 forced onto
**all** ported UI copy"* — is not supported, and I found a **new counterexample the packet
does not carry**. `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg` crop
(0,380)-(700,576) @2.14x reads:

```
YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE DAYS.
AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE!
AFTER EVERY 30 CONSECUTIVE DAYS: SUPER BONUS PRIZE!!!
```

against `strings.json["843"]` = `Every 10 consecutive days: bonus prize!` and `["844"]` =
`Every 30 consecutive days: super bonus prize!!!`. **THE FRAME WINS: v0.717 prepends
"AFTER".** Together with C17's 1/7-vs-1/6 finding this makes two independent rewording
classes. The hedge must stay on every android string that has **not** been seen on film.

---

## UPHELD WITH CORRECTIONS

### C4 `frames/critical-evade-states-the-focus-gate` — UPHELD, two counts wrong (minor)
own_cite: `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg` whole-frame @1.27x and
crop (10,180)-(420,410) @3.66x; `frame_0010.jpg` crop (380,170)-(1024,360) @2.33x;
`frame_0011.jpg` crop (380,110)-(1024,220) @2.33x.

The substance is exactly right and is a real close on combat-core blocker (5). frame_0013
reads, verbatim: `CRITICAL EVADE` / `(PASSIVE SKILL)` / `ALLOWS YOU TO EVADE ATTACKS WHILE
SLASHING IN THIS STANCE WHEN YOUR FOCUS BAR IS FULL.` / `NEXT LEVEL  (LEVEL 1)` /
`REQUIRED SKILL POINTS: 1` / red `LEARN SKILL`. Focus buys **evasion**, not a crit meter.

Two numbers in the quote are wrong, both countable only at proper magnification:
- frame_0010 `SELECT A SKILL CATEGORY` shows **6** tiles (5 in row 1 + 1 in row 2), not 7.
- frame_0011 `LIGHT STANCE SKILLS` shows **6** tiles in a single row, not 8.

### C14 `frames/repair-weapon-cost-still-unheld` — UPHELD, crop box wrong (minor)
own_cite: `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0041.jpg` whole-frame @1.27x;
sweep of `seg-10/frame_0030..0048` crops (60,400)-(620,576) @1.35x and (0,330)-(700,576) @1.55x.

The conclusion is right — I swept seg-10 frames 0030-0048 and the REPAIR branch is never
entered, so no repair cost is ever rendered. But the cite is mis-placed twice:
- The claim's own crop, `(0,340)-(620,576)`, **does not contain the option list.** I read
  that crop first and saw only `BLACKSMITH` / `WHAT CAN I DO FOR YOU TODAY?` over an empty box.
- The list is not "in the adjacent frames" either. It is in **frame_0041 itself**, in a
  service panel at the **top-left**, roughly crop (40,80)-(320,320): `BLACKSMITH` /
  `FORGE A WEAPON` / `REPAIR WEAPON` / `REINFORCE WEAPON` / `LEAVE`.

Right frame, wrong region and wrong attribution. Re-cite before banking.

### C9 `frames/private-pvp-room-door` — UPHELD, one digit unresolvable (minor)
own_cite: `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg` whole-frame @1.37x;
digit crop (838,12)-(890,36) autocontrast @24x.

Everything material is confirmed: `ENTER ROOM NAME` modal, one text field, `OK` / `CANCEL`,
the in-scene interactable `GO TO PRIVATE PVP ROOM`, `TERRITORY (23,52)` / `INSIDE SECTOR (5,4)`,
`465 COINS`, `2 GOLD`, level badge 7.

The claim's `14591 / 16350` is not readable as stated. At (838,12)-(890,36) autocontrasted and
scaled 24x the third digit is two stacked arcs — the same glyph as the `3` in `16350`, not the
flat-top-bar `5` I calibrated against the level-5 badge at
`reference/frames/zFtCaTO0_1M/seg-25/frames/frame_0020.jpg` crop (770,5)-(900,45) @5x. Best
reading is **14391**; at 1024x576 it cannot be asserted as measured either way.

---

## UPHELD CLEAN (own crop stated in each)

- **C0 achievements/daily/tokens** — `Nr4fQstqHDM/seg-04/frame_0001` crop (550,490)-(1000,545)
  @3.33x: `ACHIEVEMENT UNLOCKED / WIN A DAILY TRAP CHALLENGE.` = `["8111"]`.
  `Nr4fQstqHDM/seg-00/frame_0001` crops (0,30)-(1024,300) @1.46x and (0,380)-(700,576) @2.14x:
  `NINJA SERVICES / CLAIM DAILY PRIZE / ENTER REDEEM CODE / BACK`, and the full streak ladder.
  `zFtCaTO0_1M/seg-03/frame_0018` @1.37x: skull icon `40` over `DUEL TOKENS`. All three items
  of blocker (3) are on film.
- **C1 choice text diverges** — `zFtCaTO0_1M/seg-00/frame_0023` crop (0,440)-(1024,576) @1.46x
  reads `I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE.` and
  `THESE BANDITS DON'T SCARE ME!`. `questdata.xml:149` matches the first exactly; `:153` reads
  `<text>They'll get nothing from me!</text>`. `grep -in "scare me" reference/extracted/questdata.xml`
  returns exactly `7776, 14256, 22435`, all unrelated. **THE FRAME WINS.**
- **C2 clan identity bound on screen** — seg-20 `frame_0007` / `0008` / `0001` / `0004` all
  whole-frame @1.37x. Crest -> name -> daimyo -> domain, plus the `?` RANDOM tile
  (`LET CHANCE DECIDE.`) and `JOIN CLAN`, under the level-10 gate header.
- **C3 30-minute buff clock** — strengthened, not just confirmed. `seg-04/frame_0007` crops
  (600,80)-(980,210) and (600,150)-(980,280) @3.95x give the item card verbatim incl.
  `NOTE: ONLY ONE BUFF MAY BE ACTIVE AT A TIME.` and `WEIGHT: 1`. A montage of
  `seg-04/frame_0008..0020` crop (760,488)-(1024,522) @4.5x shows the widget **appear** at
  frame_0011 reading `29:54` and tick down monotonically 29:54, 29:52, 29:50, 29:47, 29:45,
  29:43, 29:39, 29:33, 29:30, 29:28. Highest observed value 29:54 immediately after
  consumption pins the start at 30:00 and the decrement rate at real seconds.
- **C5 death card** — `zFtCaTO0_1M/seg-22/frame_0026` crop (330,230)-(700,390) @4.05x:
  `YOU WERE DEFEATED!` over `LEAVE AREA` (silver) and `FREE RESPAWN` (gold). A scan of the
  string table for `respawn|leave area|defeated` returns `["480"] Respawn`,
  `["481"] Restart From Entrance`, `["92"] You were defeated!` — the title matches, **neither
  button label exists in the android table.** Context frames 0024/0025/0027 show combat ->
  defeat -> retry.
- **C6 forge is level-parameterised** — `Nr4fQstqHDM/seg-10/frame_0040` crop (0,370)-(1024,576)
  @1.46x: `FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE`,
  the runtime fill of `["845"]`. The ledger's "Forge 700c+2 ore" static is wrong as a static.
- **C7 Jinbei greeting diverges** — `zFtCaTO0_1M/seg-00/frame_0021` whole-frame @1.27x:
  nameplate `JINBEI`, body `IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS...` vs
  `questdata.xml:128` `Ah! A new face in this territory! ...`. Same beat, same `<img>jinbei</img>`,
  different words. **THE FRAME WINS.**
- **C8 level-up card** — `zFtCaTO0_1M/seg-00/frame_0049` crops (320,140)-(710,260) and
  (320,180)-(710,410) @3.85x: `YOU ACHIEVED / LEVEL 2 / STAT POINTS +3 / SKILL POINTS +1 /
  NEXT LEVEL 663 XP / OK`. The remainder reading is **arithmetically proven** by the paired
  PLAYER screen `frame_0051` @1.27x: `787 / 1450 EXPERIENCE POINTS`, and 1450 - 787 = **663**.
- **C10 duel screen fully filmed** — `zFtCaTO0_1M/seg-03/frame_0018` whole-frame @1.37x gives
  every element in the quote. `frame_0016` @1.37x shows `REFRESHING...` (and the token counter
  mid-animation, 40 -> 30). `frame_0019` @1.37x is the `GUEST` vs `TYLUV` VS card. The player's
  own level is confirmed at `seg-03/frame_0003` crop (750,0)-(1024,60) @5.47x: badge `3`,
  `1918 / 2950 EXPERIENCE POINTS` — so all six opponents are level-matched.
- **C11 quest card** — `zFtCaTO0_1M/seg-08/frame_0016` and `seg-00/frame_0057`, both
  whole-frame @1.37x. Every quoted string is verbatim, incl.
  `(THIS QUEST EXPIRES AT THE END OF THE DAY)`, `TERRITORY (22,51) SECTOR (5,2)`,
  `TOWN PROSPERITY: +5`, `TAKE ME THERE` at 5 gold, and the `(RECOMMENDED LEVEL: 3)` variant.
- **C12 rebirth still unfilmed** — honest STILL_UNHELD, and I corroborated it structurally
  rather than taking it on trust. `strings.json["610"]` is verbatim as quoted, and
  `docs/gauntlet/L0/systems/rebirth-elements.md:466-467` says exactly what the claim says it
  says. Then the decisive check: crop (770,5)-(900,45) @5x across the late segments gives
  level **10** (`Nr4fQstqHDM/seg-29/frame_0030`, 27056/31400) and level **7**
  (`zFtCaTO0_1M/seg-28/frame_0020`, 12681/16350). Both longplays end far below any dan rank,
  so the rebirth UI **cannot** be on film. Upheld.
- **C13 recruit gets three moves a turn** — `Nr4fQstqHDM/seg-20/frame_0014` crops
  (0,460)-(700,576) @2.14x and (600,460)-(1024,576) @3.54x:
  `RANK: RECRUIT (3 MOVES A TURN)`, `MOVES MADE: 0/36`, `3 MOVE(S) LEFT`.
  **THE FRAME WINS** — the game says "A TURN", not "per hour".
- **C15 save policy** — `zFtCaTO0_1M/seg-00/frame_0002` @1.27x:
  `TIP: YOUR LOCATION IS ONLY SAVED AT SPECIAL LOCATIONS LIKE TOWNS AND DUNGEONS.`
  `frame_0003` @1.27x: `NOTE: PLAYER PROGRESS WILL NOT BE SAVED IN GUEST MODE.`
  `seg-03/frame_0003` @1.37x: `NINJA SERVICES ARE NOT AVAILABLE IN GUEST MODE.` = `["632"]`.
- **C17 v0.717 is a string superset** — `Nr4fQstqHDM/seg-20/frame_0011/0012/0013`, montage of
  crop (60,60)-(700,130) @2.2x: `WAR ROOM RULES 1/7 (JOINING A BATTLE)`,
  `3/7 (ATTACKING AND DEFENDING)`, `6/7 (BUILDING STRUCTURES)`. The android table runs
  `["369"] 1/6` ... `["379"] 6/6` and stops. **THE FRAME WINS.** Strongest claim in the packet.
- **C18 war-room board frame exists** — `Nr4fQstqHDM/seg-20/frame_0014` whole-frame @1.37x
  carries every quoted element. `docs/gauntlet/L0/systems/meta-social.md:404` does say
  "I never found a frame showing the board", so the overturn is real, and the claim is honest
  that the 6x6 sector layer is still unfilmed.

---

## NEW FINDINGS THE SURVEYOR MISSED

1. **v0.717 rewords the daily-streak ladder.** `Nr4fQstqHDM/seg-00/frame_0001` crop
   (0,380)-(700,576) @2.14x reads `AFTER EVERY 10 / 30 CONSECUTIVE DAYS`; `["843"]/["844"]`
   read `Every 10 / 30 consecutive days`. **THE FRAME WINS**, and it bounds C19.
2. **Two clans are given the same domain.** frame_0001 crop (575,415)-(900,465) @4.62x:
   `CLAN AKA RYU RULES THE DOMAIN IN THE NORTH-EAST.` frame_0007 crop (575,395)-(900,445)
   @4.62x: `CLAN KI SENSU RULES THE DOMAIN IN THE NORTH-EAST.` The string table confirms it
   is an original-data collision, not an OCR slip: `["324"]` and `["327"]` both say North-East
   (`["325"]` South-East, `["326"]` South-West). Domain text is **not** a partition key.
3. **A fifth banner colour exists on the world map** — black with a white circular mon,
   `zFtCaTO0_1M/seg-08/frame_0029` crop (700,160)-(780,230) @15x. Matches meta-social's
   "side numbers 1-5".
4. **Repair-Weapon cost can never be a constant.** `strings.json["848"]` is
   `Repair your currently equipped weapon?\nCost: [0] coins` — a runtime template, exactly like
   Forge's `["845"]`. Blocker (3) is not "a number we failed to capture", it is `f(weapon)`.
5. **The world-map zoom-in is a viewport, not the board.** 13 columns on screen vs quest-card
   territory coords in the 21-26 / 51-52 range.
