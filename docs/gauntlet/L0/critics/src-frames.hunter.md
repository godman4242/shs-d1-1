# src-frames — HUNTER CRITIC review

Packet: `docs/gauntlet/L0/worklist/src-frames.claims.json` — **21 claims, 21 judged, 0 skipped.**
Source: `reference/frames/` (7,381 stills). Every verdict below carries an artifact **I** opened.
Tooling: PIL crop+LANCZOS upscale (script at scratchpad `crop.py`); frames are **1024x576** in the
`seg-NN` longplay dirs and **1920x1080** in the `session11/` + `session24/` measurement dirs.

---

## HEADLINE — THE SILENCE (worth more than any re-judgement)

**58% of the frame corpus was never opened by this survey.**
Measured from `docs/gauntlet/L0/index/frames.json`:

| bucket | frames |
|---|---|
| total | 7,381 |
| longplay chapter dirs (`Nr4fQstqHDM/seg-*`, `zFtCaTO0_1M/seg-*`, `map/frames`) | 2,675 |
| everything else | 4,690 |
| of which **combat/duel/measurement dirs** (`session11/*`, `session24/*`, `duel_*`, `combat_*`, `s19_*`, `s21_*`) | **4,256 across 44 dirs** |

**Every one of the 21 cites in the packet points at a `seg-NN` longplay directory.** Not one claim
touches `session24/svm-B05-mountain-duel/fight15` (480 frames), `svm-A16-beach-duel` (406),
`reach-A28-forest-duel` (372), `reach-B-dojo` (342), `reach-B-honda-duel` (248),
`gait-duel-speeds` (194), `session11/stance-reach`, `session11/gap-gait-hitbox`,
`session11/strike-travel-duration`, `duel_dense`, `combat_analysis`…

All 21 claims are **UI screens, menus and dialogue**. The lane this repo exists for — 1:1 duel
combat feel — is **100% absent from the packet**, and it is the half of the corpus that is shot at
full 1080p with self-describing measurement filenames.

I opened two to prove they are real evidence, not empty dirs:

* `reference/frames/session11/lead/t396.0_counter-triangle.png` (1920x1080, read whole) — TRAINING
  HALL, `STORY QUEST: ATTACK TRAINING DUMMY USING HEAVY STANCE`, the articulated wooden dummy,
  HUD reads `BALANCED STANCE` with a **tan/brown ring** round the portrait, `1257 / 1450
  EXPERIENCE POINTS`.
* `reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png` (1920x1080,
  read whole) — live duel: `AUTO SLASH OFF` toggle, `1 HIT COMBO` counter, enemy nameplate
  `FUKUSHIMA CHIKO` over a red/green HP bar, player `SOUND360TM`, the **red slash line drawn
  end-to-end** with a steel blade sprite at its head, portrait ring **blue** (Light stance),
  `14/20` HP, `26/31` CHI, `150% DAMAGE` buff, skill tray slots numbered **2** and **3**.

The stance-ring colours read off those two frames match
`strings.json["IDS_Q50S3NODE1"]` verbatim: *"Your stance is indicated by the color of the circle
around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red."*

---

## VERDICTS

Legend: **UPHELD** = I opened the artifact and it held. **REFUTED** = thesis is wrong/over-broad.
**CORRECTION** = thesis stands, a named clause must be struck before it enters the ledger.

### 1. `frames/achievements-daily-and-tokens-all-on-film` — UPHELD
Opened `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0001.jpg` (crop 550,490–1000,545 @6.5x):
trophy icon + `ACHIEVEMENT UNLOCKED / WIN A DAILY TRAP CHALLENGE.` == `strings.json["8111"]`.
Opened `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg` (crops 0,30–1024,300 @3x and
0,480–700,576 @4x): `NINJA SERVICES` panel with `CLAIM DAILY PRIZE / ENTER REDEEM CODE / BACK`,
and the ladder `CLAIM YOUR DAILY PRIZE NOW! / YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE
DAYS. / AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE! / AFTER EVERY 30 CONSECUTIVE DAYS: SUPER
BONUS PRIZE!!!`. Token counter `40` + `DUEL TOKENS` on
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`. All three items present.
**Note carried forward:** the frame says **"AFTER EVERY"**, `strings.json["843"]/["844"]` say
**"Every"** — see the refutation of claim 20.

### 2. `frames/choice-text-diverges-from-payload` — UPHELD
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0023.jpg` (crop 0,440–1024,576 @4x) shows two
options: `I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE.` and `THESE BANDITS DON'T SCARE ME!`.
`reference/extracted/questdata.xml:149` = *"I'll stand my ground and ask them to leave me alone."*
(exact match); `:153` = *"They'll get nothing from me!"* (no match). My own
`grep -in "scare me" reference/extracted/questdata.xml` returns **:7776, :14256, :22435** only —
exactly the three the surveyor named, none of them this node. **THE FRAME WINS.**

### 3. `frames/clan-identity-bound-on-screen` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg`, `frame_0008.jpg`, `frame_0001.jpg`,
`frame_0004.jpg` (all read whole @1.9x). Gold-fan crest → `CLAN KI SENSU … LED BY LADY TSUBASA …
RULES THE DOMAIN IN THE NORTH-EAST.`; navy four-ring → `CLAN AOI HOIRU … LORD YOSHIO … SOUTH-WEST.`;
dark-red serpent → `CLAN AKA RYU … LORD TSUYOSHI`; white `?` → `RANDOM / LET CHANCE DECIDE.`
Header `CONGRATULATIONS! YOU ARE NOW LEVEL 10 AND ARE ABLE TO JOIN THE WAR ROOM.` Four crests +
RANDOM, each card ending in a red `JOIN CLAN`. **Confirmed exactly as claimed.**
Two additions the claim missed — see new findings **NF-3** and **NF-4**.

### 4. `frames/consumable-buffs-run-a-30-minute-real-clock` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg` (crop 700,480–1024,530 @8x) reads
`150% DAMAGE 29:39`. Item card `frame_0007.jpg` (crop 600,80–1024,260 @5x) reads
`EAT THIS POTATO TO GET THE 150% DAMAGE BUFF. / NOTE: ONLY ONE BUFF MAY BE ACTIVE AT A TIME.`
== `strings.json["4132"]` verbatim.
I went further than the claim and montaged the HUD strip across `seg-04` frames 0001–0032: the
timer **counts down monotonically — 29:54 → 29:52 → 29:50 → 29:47 → 29:45 → 29:43 → … → 29:39**.
Direction and units confirmed; the "30 minute" duration is a one-sample extrapolation from a max
observed 29:54, which is honest but should be labelled INFERRED, not CONTRACT.
Under-claim: there are **six** buff potatoes, not one — see **NF-5**.

### 5. `frames/critical-evade-states-the-focus-gate` — UPHELD, with a **CORRECTION**
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0013.jpg` (read whole @1.9x) reads verbatim:
`CRITICAL EVADE / (PASSIVE SKILL) / ALLOWS YOU TO EVADE ATTACKS WHILE SLASHING IN THIS STANCE WHEN
YOUR FOCUS BAR IS FULL. / NEXT LEVEL (LEVEL 1) / REQUIRED SKILL POINTS: 1` with a red `LEARN SKILL`.
The thesis — Focus buys **evasion**, not crit — is exactly right and is the load-bearing part.

**CORRECTION — the tile counts in the quote are both wrong.** I cropped and counted:
* `frame_0010.jpg` `SELECT A SKILL CATEGORY` shows **6** tiles (5 + 1 wrapped), the quote says 7.
* `frame_0011.jpg` `LIGHT STANCE SKILLS` shows **6** tiles, the quote says 8.
Crop used for the count: `frame_0011.jpg` 380,120–1024,210 @4x, and `frame_0010.jpg` whole @1.9x.
Strike both numbers before this enters the ledger.

### 6. `frames/death-card-offers-free-respawn` — UPHELD
`reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg` (read whole @1.9x and crop
300,200–730,420 @5x): `YOU WERE DEFEATED!` over **exactly two** buttons — `LEAVE AREA`
(silver border) and `FREE RESPAWN` (gold border). Nothing else on the card.
I ran the string search myself: `"Leave Area"` → **0 hits**; `"Free Respawn"` → **0 hits**;
`"respawn"` → only `strings.json["480"]` = `Respawn`. `strings.json["481"]` = `Restart From
Entrance`. Neither shipped label exists in the android table. **THE FRAME WINS.**
Bonus the claim missed: the header **does** resolve — `strings.json["92"]` = `You were defeated!`,
and there is a separate `["831"]` `You were defeated in the war room!`.

### 7. `frames/forge-cost-is-level-parameterised` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg` (crop 0,360–1024,576 @3x):
`FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE`.
`strings.json["845"]` = `Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed:
2 Iron Ore`. The 700 is the `[1]` fill at `[0]`=7. **"Forge 700c" is not a constant.**
The surveyor's refusal to assert the formula from one sample is correct discipline.
Strengthened — see **NF-6** (three sword tiers, all parameterised).

### 8. `frames/jinbei-greeting-diverges-too` — UPHELD
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0021.jpg` (crops 0,380–1024,480 @5x for the
nameplate and 0,440–1024,576 @4x for the body): nameplate **JINBEI**, body
`IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL
THE HONEST FOLK AWAY.` vs `reference/extracted/questdata.xml:128` *"Ah! A new face in this
territory! My, it isn't often we see people walk this road alone, what with all the bandits
infesting it..."* — same beat, same speaker, different words. **THE FRAME WINS.** Second
independent instance; the held script is a pre-v0.717 revision.

### 9. `frames/levelup-card-corroborates-banked-numbers` — UPHELD, and **arithmetically verified**
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0049.jpg` (crop 320,180–710,410 @5x):
`LEVEL 2 / STAT POINTS +3 / SKILL POINTS +1 / NEXT LEVEL 663 XP / OK`.
`frame_0051.jpg` (read whole @1.9x), PLAYER screen: `787 / 1450 EXPERIENCE POINTS`,
`AVAILABLE STAT POINTS: 3`.
**1450 − 787 = 663 exactly.** The "NEXT LEVEL is XP REMAINING, not the threshold" rendering rule is
proven, not asserted. Independently corroborated a third time by
`reference/frames/session11/lead/t396.0_counter-triangle.png`, which shows `1257 / 1450` at level 2.
That same PLAYER screen is a large under-claim — see **NF-1**.

### 10. `frames/private-pvp-room-door` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0017.jpg` (read whole @1.9x): modal
`ENTER ROOM NAME` with one text field, `OK` / `CANCEL`; beneath it in-scene the interactable reads
`GO TO PRIVATE PVP ROOM`. Same frame HUD: `465 COINS`, `2 GOLD`, `TERRITORY (23,52) / INSIDE SECTOR
(5,4)`, `CORRIDOR`, `STORY QUEST: FIND WORK AT KAKUCHI TOWN`, level badge 7.
Only nit: at 11x (crop 820,8–1024,36) the XP numerator is genuinely ambiguous between **14391** and
**14591** — JPEG mush on one glyph. Not refutable, not load-bearing.

### 11. `frames/pvp-duel-screen-fully-filmed` — UPHELD, in full
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg` (read whole @1.95x): gold `DUEL`;
skull-diamond `40` captioned `DUEL TOKENS`; `Register now to fight LIVE PVP duels!`; a 2x3 grid —
TYLUV / IXBAL / NANASHI21 / BODYGU4RD / JOTA / LHADYCANDY, every one `LEVEL 3`, each with a red
`CHALLENGE`; `RANKINGS`; circular-arrow refresh; footer `VICTORY TAUNT (DISPLAYS ON OPPONENT'S
SCREEN WHEN YOU WIN)` over a field pre-filled `YOU CAN NEVER DEFEAT ME!`.
`frame_0016.jpg` = `REFRESHING…` modal; `frame_0019.jpg` = VS card `GUEST` vs `TYLUV`.
Level-parity with the player confirmed via `seg-03/frame_0003.jpg` → badge 3, `1918 / 2950`.
`frame_0019.jpg` is itself a big under-claim — see **NF-2**.

### 12. `frames/quest-card-expiry-prosperity-and-coords` — UPHELD, both cites
`reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg` (read whole @2.4x):
`OBJECTIVE / GET BLACK BALD HERB FOR YOKO / (THIS QUEST EXPIRES AT THE END OF THE DAY)`;
`LOCATION / E TOSHIBARA FIELD / TERRITORY (22,51) SECTOR (5,2)`; `TAKE ME THERE` priced **5 gold**;
`REWARD / 266 XP / 20 COINS / TOWN PROSPERITY: +5`; `ABANDON QUEST`; balance `3 GOLD`;
left rail `PROLOGUE` / `YOKO'S QUEST`.
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg` (read whole @2.4x):
`MEET HIROSHI OUTSIDE HIS HUT / (RECOMMENDED LEVEL: 3)`, `W KASUTA FOREST / TERRITORY (21,51)
SECTOR (2,3)`, `REWARD / 200 XP`. Both exactly as quoted.
Small unremarked template difference: the **story**-quest card has no `ABANDON QUEST` and no
coin/prosperity line; the **side**-quest card has all three.

### 13. `frames/rebirth-element-picker-still-unfilmed` — **STILL_UNHELD stands, and I strengthened it**
I could not disprove a negative by search alone, so I attacked it from the level gate instead.
`strings.json["4155"]` = *"New Game +\nProgress on to the next Dan Rank and specialize in an
element. \nLevel 80 required."* I then montaged the HUD XP bar across the tail segments of both
longplays (`Nr4fQstqHDM/seg-27..29`, `zFtCaTO0_1M/seg-27..30`, crop 880,8–1024,34 @6x):
the highest thresholds ever on film are **`/31400`** (Nr4, ≈lvl 9–10) and **`/16350`** (zFt, lvl 7).
Neither longplay is within seventy levels of the rebirth gate. **The picker cannot be on film.**
That is a much better argument than "I looked and didn't see it", and it closes the question.
But the ledger blocker is now largely closable from A2 — see **NF-7**.

### 14. `frames/recruit-gets-three-moves-a-turn` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg` (read whole @1.9x):
`RANK: RECRUIT (3 MOVES A TURN)`, `MOVES MADE: 0/36`, `3 MOVE(S) LEFT`, `ALLEGIANCE: CLAN AKA RYU`.
The "per hour" reconciliation is dead **twice over**: the frame says A TURN, and so does the
android table — `strings.json["329"]` = `' moves a turn'`, `["308"]` = `' Move(s) Left'`.
The "36 = rank threshold" reading is now A2-held, not inferred: `strings.json["378"]` =
*"- your rank is based on the number of moves that you have made."*
Caveat the claim misses: `reference/extracted/ui_strings.txt:215` reads
`allegiance: AKA RYU clanrank: soldier (3 moves a turn)moves made: 15/60` — a **different
denominator (60)** and a rank name (`soldier`) that is **not** in the 330–339 ladder. 36 is
rank-specific, and the ladder may be longer than the ten strings suggest.

### 15. `frames/repair-weapon-cost-still-unheld` — **STILL_UNHELD stands, with a CORRECTION**
`reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0041.jpg` (crop 0,320–700,576 @3.5x):
nameplate `BLACKSMITH`, body `WHAT CAN I DO FOR YOU TODAY?`. Correct.
**CORRECTION — the second half of the quote is not reproducible from the cite.** I montaged
`seg-10` frames **0033–0048** (crop 0,400–700,576 @2x) and the option list
`FORGE A WEAPON / REPAIR WEAPON / REINFORCE WEAPON / LEAVE` **appears in none of them**. What those
frames do show: f0038 a quest offer, f0040 the forge prompt, f0041 the greeting, f0042 + f0043 the
reinforce prompt, f0045 a reward panel, f0048 the stablehand. The menu strings exist
(`strings.json["660"]`,`["661"]`,`["662"]`) so the menu is real, but the "adjacent frames" sighting
is uncited and I could not find it. Strike that sentence or add the frame that shows it.
**The blocker itself is mis-specified** — see **NF-8**.

### 16. `frames/save-policy-is-checkpoint-at-towns-and-dungeons` — UPHELD, and **upgraded to A2**
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0002.jpg` (read whole @1.9x):
`TIP: YOUR LOCATION IS ONLY SAVED AT SPECIAL LOCATIONS LIKE TOWNS AND DUNGEONS.`
`frame_0003.jpg`: `NOTE: PLAYER PROGRESS WILL NOT BE SAVED IN GUEST MODE.` == `strings.json["295"]`.
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0003.jpg`: `NINJA SERVICES ARE NOT AVAILABLE IN
GUEST MODE.` == `strings.json["632"]`.
The loading tip is **not** in the string table — I checked. I found its real home:
`reference/decompiled/shs3_android/scripts/GameEngine.as:596`
`str = "Tip: Your location is only saved at special locations like towns and dungeons.";`
That promotes the save policy from a single A1 sighting to a quotable A2 source line — and it
opens up 38 more tips nobody has read. See **NF-9**, which is the second-biggest find in this pass.

### 17. `frames/two-font-faces-and-where-the-second-one-lives` — UPHELD, with a **CORRECTION**
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`, crop 340,55–700,80 @8x: the single
line `Register now to fight LIVE PVP duels!` is an upright, even-weight humanist sans with true
lower-case, flat baselines, no taper — plainly not the brush face carrying `DUEL`, `DUEL TOKENS`,
`CHALLENGE`, `RANKINGS`, `VICTORY TAUNT (…)` on the same screen. Split confirmed **from the pixels**.
Payload side confirmed too: `reference/extracted/ui_strings.txt:100` carries `face="Edo SZ"`,
`:182` and `:201` carry `face="Calibri"`.
**CORRECTION — "reserved for account/registration nag copy" is too narrow.** `ui_strings.txt:201`
puts Calibri on a *network* error: `Your device/computer is behind a NAT or router that is
preventing it from receiving messages <font face="Calibri" …`. The rule is *system/account/network
chrome*, not registration nag specifically.
Flag, low confidence: `ui_strings.txt:99` contains a third face token, `<font face="EPSON`. Almost
certainly authoring junk pasted into a text field rather than a shipped face, but S0-2's "the font
is CLOSED" should say so out loud rather than leave a stray face token unexplained.

### 18. `frames/v0717-is-a-string-superset-not-identity` — UPHELD, and **the extra page is now named**
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg` / `frame_0012.jpg` / `frame_0013.jpg`
(crop 0,40–1024,200 @3.5x) read `WAR ROOM RULES 1/7 (JOINING A BATTLE)`, `3/7 (ATTACKING AND
DEFENDING)`, `6/7 (BUILDING STRUCTURES)`; the bodies match `strings.json["370"]`, `["374"]`,
`["380"]` verbatim. Android caps at `["369"]` 1/6 and `["379"]` 6/6. **THE FRAME WINS.**
The claim stops at the count. `reference/extracted/ui_strings.txt:189–194` — a **web** artifact —
lists the web deck as 1/6 joining · 2/6 Turns AND MOVES · 3/6 attacking and defending ·
4/6 CAPTURING Sectors · **5/6 (WINNING AND LOSING)** · 6/6 (rank). `WINNING AND LOSING` **does not
exist anywhere in the android string table.** That is the identity of the inserted page, and it
also proves `ui_strings.txt` is itself a pre-v0.717 snapshot (it still says /6). See **NF-10**.

### 19. `frames/war-room-territory-board-frame-exists` — UPHELD
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg` (read whole @1.9x). Every quoted
element present and verbatim: `SELECT TERRITORY`, `ZOOM IN`, `HELP`, `CLAN CROPS: 402 (+2 HQ)`,
a uniform orthogonal grid ruled over a Japan silhouette (Kyushu→Shikoku→western/central Honshu),
one red clan banner on the contested cell, `ALLEGIANCE: CLAN AKA RYU / RANK: RECRUIT (3 MOVES A
TURN) / MOVES MADE: 0/36`, `FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN`,
`SHOW CLAN MSG`, `3 MOVE(S) LEFT`. The banked survey's "I never found a frame showing the board"
is dead.

### 20. `frames/web-v0717-renders-android-string-table` — **REFUTED (material)**
The evidence half is fine, and I re-verified it myself on the frames rather than taking it:
`["197"] ["198"] ["59"] ["231"] ["28"]` on `zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`;
`["321"]` on `Nr4fQstqHDM/seg-20/frames/frame_0001.jpg`; `["850"]` on
`Nr4fQstqHDM/seg-10/frames/frame_0042.jpg`. I found more the claim never listed: `["92"]` on the
death card, `["632"]` and `["295"]` on the guest modals, `["4132"]` on the potato card, `["619"]`
`Auto Slash Off` on the duel HUD.

**But the conclusion — "closed for every android string that survives into v0.717" — is refuted by
the surveyor's own frame.** `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg`
(crop 0,480–700,576 @4x) renders:

> `AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE!`
> `AFTER EVERY 30 CONSECUTIVE DAYS: SUPER BONUS PRIZE!!!`

against `strings.json["843"]` = `Every 10 consecutive days: bonus prize!` and `["844"]` =
`Every 30 consecutive days: super bonus prize!!!`. I searched the whole table for `consecutive`
and `bonus prize` — no android entry anywhere begins `After every`. **THE FRAME WINS.**
Claim 18 (same packet) independently shows `["369"]` `1/6` rendering as `1/7`.

So parity is **per-string and must be evidenced per-string**. The blanket lift of S0-3's caveat is
wrong and would let unverified android copy into every lane. Bank the 12-string match; keep the
hedge. (Sharper framing available anyway: `ui_strings.txt:127` already carries `["321"]` verbatim
in the **web** payload, so shared copy is provable web-side without leaning on the android build.)

### 21. `frames/world-map-is-a-tile-lattice-with-clan-banners` — UPHELD, with a **CORRECTION**
`reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg` (read whole @2.4x): `NAGANO (26,52)
LEVEL: 9`, `ZOOM OUT`, a uniform lattice of rounded-square tiles, navy/gold/red/green clan banners,
black X on destroyed tiles, one white-outlined selection tile, the player avatar in a tile, and the
legend `VILLAGE · TOWN · CITY · CASTLE TOWN · DESTROYED · QUEST` plus `GREY TERRITORIES - LEVEL TOO
LOW / RED TERRITORIES - LEVEL TOO HIGH`. `frame_0009.jpg`: `CLICK ON THE MAP TO ZOOM IN` over the
Japan silhouette with a coarse orthogonal grid. **The "sparse geographic outline, not a grid"
ledger line is correctly overturned.**
I checked the column count rather than trusting it: autocorrelating a horizontal band at y=250–262
across the panel (x 45–900) gives a tile pitch of **66–67 px**, i.e. **≈12.8 columns** — "12-column"
is a fair read.
**CORRECTION — "each tile carries a settlement icon" is false.** Crop 40,220–740,300 @4x shows a
row reading: grey-empty · village+navy · city+navy · castle+gold · **empty** · **empty (selected)** ·
village · village · castle+red · village. Many tiles carry no settlement icon at all. Strike that
clause. The clause it should be replaced by: **tile tint encodes level gating** (grey = too low,
red = too high), which the claim quotes in the legend but never states as a mechanic.

---

## NEW FINDINGS (things nothing in this packet mentions)

**NF-0 — the combat corpus.** See the HEADLINE section. 4,256 of 7,381 frames, 44 directories,
1920x1080, purpose-shot for stance reach / gait speed / strike travel / hitboxes, cited by nobody.
Cite: `docs/gauntlet/L0/index/frames.json`, plus the two frames I opened,
`reference/frames/session11/lead/t396.0_counter-triangle.png` and
`reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png`.

**NF-1 — the PLAYER screen is an unread stat contract.**
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0051.jpg` (read whole @1.9x) prints, in one card:
a 9-slot equipment doll (hat · mask · torso · gloves · legs · weapon · ring ×2 · boots); three
meters `HP 10/10`, `CHI 10/10`, `AP 30/30` with a bare `30` beneath AP; three stats `ATK 1`,
`DEF 1 +2` (base + equipment bonus rendered separately), `SPD 1`; an `ADD HP` affordance; and
**`WEIGHT: 14 / 100`** — an encumbrance cap the ledger records nowhere. Corroborated payload-side by
`reference/extracted/ui_strings.txt:197` `Weight: 50/50`.

**NF-2 — the duel-combat HUD.** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0019.jpg`
(read whole @1.9x): an `AUTO SLASH OFF` toggle top-left (== `strings.json["619"]`, with `["620"]`
`Auto Slash On`); opponent nameplate `TYLUV (3)` over a green HP bar — enemies render level in
parens; player status line `CANNOT CHANGE STANCE` — a **stance-lock state** in duels, whose label
family is `strings.json["125"]` `Stance Restriction` / `["208"]` `Change Stance`; a skill tray whose
slots are numbered **2** and **3** (keyboard binding). Nothing in the packet touches any of it.

**NF-3 — the fourth clan resolves, and it was never named.** The green-fist crest on
`Nr4fQstqHDM/seg-20/frames/frame_0007.jpg` is **Clan Midori Ken** — `strings.json["290"]`
`Midori Ken Crops`, alongside `["289"]` `Aka Ryu Crops`, `["291"]` `Aoi Hoiru Crops`, `["292"]`
`Ki Sensu Crops`. Midori = green, Ken = fist. Four clans, closed set, crest→name binding complete.

**NF-4 — an in-game contradiction the frames expose.** `frame_0007.jpg` says
`CLAN KI SENSU RULES THE DOMAIN IN THE NORTH-EAST.` and `frame_0001.jpg` says
`CLAN AKA RYU RULES THE DOMAIN IN THE NORTH-EAST.` — **two clans, same domain.** The android table
reproduces it: `["327"]` Ki Sensu → North-East, and `["326"]` Aoi Hoiru → South-West. A rebuild that
mirrors the four-domain compass will hit this; log it as an OG defect, not a transcription error.

**NF-5 — six buffs, not one.** `strings.json["4132"]–["4135"]` = 150% **Damage / Defense / XP /
Speed**; `["4229"]` = 200% **AP Regeneration**; `["4230"]` = 200% **Duel Token Regeneration**. All six
carry the same "only one buff may be active at a time" clause. The 30-minute HUD timer therefore
governs a six-member buff family.

**NF-6 — three forge tiers, all level-parameterised.** `strings.json["845"]` iron (2 Iron Ore),
`["846"]` bronze (1 Tin + 2 Copper), `["847"]` steel (2 Iron + 2 Coal + 1 Titanium) — each
`(level [0])? / Cost: [1] coins`. Reinforce is **three** rows too, not the ledger's one:
`["850"]` 1 Silver Ore, `["851"]` 1 Titanium Ore, `["852"]` 1 Uncut Diamond, all at 5000 coins —
material scales with weapon tier. And there is a **second, gold-priced** path: `["636"]` *"Name your
currently equipped weapon and make it unbreakable for 2 Gold?"*, `["669"]` on breakage.
Weapon condition is a rendered field: `reference/extracted/ui_strings.txt:257`
`condition: well-maintained23`.

**NF-7 — the rebirth/element picker is A2-recoverable even though it is unfilmable.**
`strings.json["611"]` = **`Choose an element to specialize in.`** — the picker's own prompt.
The element set is closed at **four**: `["6030"]–["6033"]` Fire / Water / Wind / Earth Element
Skills, mirrored by `["507"]–["510"]` Fire/Wind/Water/Earth ATK and `["6058"]–["6061"]` elemental
traps. The gate is a hard number: `["4155"]` **"Level 80 required."** The effects are stated:
`["610"]` — reborn at level 1, keeps inventory + skill points + clan rank, equipment auto-unequipped,
**slash length and bank storage increase per dan rank**. Plus `["4154"]` `Scroll of Rebirth`,
`["864"]` `[0] has rebirthed and is now Dan [1]!`. Blocker ⑤ is mostly closable without a picture.

**NF-8 — the Repair-Weapon blocker is mis-specified.** `strings.json["848"]` =
`Repair your currently equipped weapon?\nCost: [0] coins`. The cost is a **runtime fill**, exactly
like Forge. There is no constant to capture, so "Repair-Weapon cost (never captured)" can never be
closed by finding a frame — it should be re-stated as "repair cost = f(runtime state); derive the
function". Related: `["393"]` names the consumable path (whet stones, `["4143"]` Sword Repair Kit),
`["7042"]` a repair-effectiveness stat, `["8099"]` `Repair a sword 50 times.`

**NF-9 — 39 hardcoded gameplay rules nobody has read.**
`reference/decompiled/shs3_android/scripts/GameEngine.as:536–695` is an `if(dice == n)` ladder of
**39 loading tips**, none of which are in the string table. Line-cited highlights:

* `:564` `"Tip: A green border indicates that an item is special."` · `:568` blue = **rare** ·
  `:572` purple = **unique**. **This is the item-rarity colour enum**, and it explains the coloured
  quest-item names I found on film — `Nr4fQstqHDM/seg-10/frames/frame_0033.jpg` renders
  `QUEST: FIND FAST SHOES OF FOCUS` in **green** and `frame_0038.jpg` renders
  `QUEST: FIND RESERVED SHARP IRON SWORD OF WATER` in **blue** (crops 0,400–700,576 @2x). Those two
  names also expose a four-part procedural item grammar: prefix · quality · base · `of` suffix.
* `:683` `"Tip: A higher speed stat will reduce skill cooldown times and also give you a longer
  slash line."` — SPD drives **both** cooldown and slash reach. Combat-core, uncited anywhere.
* `:640` `"Tip: When not in battle, you can hold down the mouse button to keep running in that
  direction."` — **this is the source for the hold-run claim** that project memory records as
  "never sourced" and reversed on 2026-07-25. The tip is real and line-citable; whether the
  *measurement* still contradicts it is a separate question, but "unsourced" is no longer true.
* `:584` spacebar = change stance · `:588` number keys = activate skills · `:592` drag-and-drop a
  skill to fire it in a specific direction. An entire input map.
* `:644` `"Crops grown from 12-hour seeds do not rot."` — a real-time constant.
* `:612` `"When fighting undead, target their heads."` — hit-location damage.
* `:616`/`:620`/`:624` village → town → city → castle upgrade by completing quests — the mechanism
  behind the `TOWN PROSPERITY: +5` / `+10` deltas on the quest cards.
* `:536`,`:608` duel **recording** and a `Duels TV` rewatch surface — an entire unclaimed feature.
* `:540`–`:560` chat emotes `/sit /bow /kneel /stand /fart /gangnamstyle`.
* `:679` `"Scavenging Skill Level 5 lets you see hidden paths to secret areas."`
* `:695` AP replenishes by duelling or war-room fighting.

**NF-10 — `reference/extracted/ui_strings.txt` is an unmined web-side artifact.** 471 lines, and
the packet uses it for exactly one thing (font faces). Line-cited:
* `:193` `War room rules 5/6 &nbsp;(WINNING AND LOSING)` — a page title absent from the android
  table; the identity of v0.717's extra rules page (see claim 18).
* `:7` and `:26` — a **duel betting system**: *"'Odds' refers to the estimated profit that you will
  make for each token that you bet. example: If you bet 2 tokens at 1.5 odds, you will make an
  estimated profit of 3 gold when your bet wins"* / *"Odds are changed whenever someone makes a bet
  and are only finalized when betting is closed."* Nothing in any lane mentions betting.
* `:214` `level requirement: 10 - 30 · autostarts upon full roster · round duration: 30 min` — a
  **tournament/arena** mode template with a level band and a 30-minute round.
* `:100` `physical dmg: 1234 - 1235 (heavy) critical dmg: 1234-1235 *(heavy) piercing dmg: 20` —
  a three-way damage taxonomy with stance annotation and a `*` marker.
* `:212` `next level damage: 10 def: 20` — skill-level deltas rendered as next-level previews.
* `:314` `hp: 123 / 123 (hp regen 12) chi: 123 / 434 (chi regen 13)` — **HP and CHI regen are
  displayed stats**, not just internal.
* `:215` the war-room rank template with a `soldier` rank and `moves made: 15/60` (see claim 14).

**NF-11 — the full stance triangle, with a hard number.** `strings.json["6001"]` Light: *"Slash
range is longer but damage inflicted is lower. Effective against Heavy Stance."* · `["6003"]`
Balanced: *"Effective against Light Stance."* · `["6005"]` Heavy: *"Damage inflicted is increased
but slash range is shorter. Effective against Balanced Stance. **Defense -20%**."*
A closed rock-paper-scissors plus a codeable constant. `["IDS_Q50S3NODE1"]` gives the HUD ring
colours (light=blue, balanced=brown, heavy=red), which I verified on the two 1080p frames in the
HEADLINE. `["6085"]`–`["6087"]` add a hold-to-charge ultimate per stance.

**NF-12 — the war tick is a stated 24 hours.** `strings.json["376"]`: *"Troops will advance on enemy
sectors every **24 hours**."* Same string gives the capture rule (more attackers than defenders) and
the win condition (capture all control points). `["380"]` gives the five structure types (Command
HQ · Forward Base · Barricades · Tunnels · Towns) and the 500-coin-per-player contribution.
`["372"]` gives terrain advantage order (mountains > forests > fields), adjacency/blocking rules,
the arrow-fire fallback, and **5 coins paid per move**. Ledger blocker ③ asks for the "day length"
that governs the war tick — it is written down.

**NF-13 — the gold↔resource exchange rate.** `strings.json["61"]` *"You are out of Duel Tokens.
Would you like to get 10 more Duel Tokens for 1 Gold?"* and `["100"]` *"You are out of AP. Would you
like to get 10 more AP for 1 Gold?"* — **1 Gold = 10 AP = 10 Duel Tokens**. Token packs at
`["4173"]`/`["4174"]`/`["4175"]` (10/25/40), cap at `["122"]` `Max Duel Tokens`.
Separately: `Nr4fQstqHDM/seg-10/frames/frame_0048.jpg` (crop 0,400–700,576 @2x) shows
`STABLEHAND / WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE? / COST: 14 COINS`
— the ledger banks "stable 14c+5AP" but **no AP component is rendered on this prompt**; the +5AP
half needs its own cite or should be dropped.

**NF-14 (low confidence, logged as a lead, not a number).** On
`reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0016.jpg` (crop 50,60–220,180 @6x) the token
widget renders **two** values during the `REFRESHING…` modal — `40` inside the box and a bare `30`
directly under the `DUEL TOKENS` caption — where `frame_0017.jpg` and `frame_0018.jpg` show only
`40`. That is an animated 10-token delta on the refresh action. **Direction is unresolved from three
frames**, so this is a lead for a dense re-extract, not a cost to bank.
