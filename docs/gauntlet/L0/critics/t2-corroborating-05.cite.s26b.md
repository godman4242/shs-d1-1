# BLIND CITE-LENS REVIEW — packet `t2-corroborating-05.json` (48 findings)

Reviewer: cite-lens blind critic, run s26b. Packet size 48, judged 48, skipped 0.
Every verdict below rests on an artifact **I** opened in this session. I did not read
any other agent's prose (§3.2): no file under `docs/gauntlet/L0/critics/` or
`docs/gauntlet/L0/sources/` was opened.

**Verdict tally: 44 HELD · 4 REFUTED (2 fatal, 2 material).**
The four refutations are claims 5, 10, 14 and 28. Three of them share one root cause:
**the web v0.717 payload is name-obfuscated, and three findings mistook obfuscation for
absence or for parity.** The packet contains its own antidote — claims 7, 9, 11, 29, 32,
33, 34, 41 and 42 all read the obfuscated bundle correctly, and two of them (7 and 34)
directly refute two of the others (14 and 10).

---

## THE FOUR REFUTATIONS

### ✗ C28 `gauntlet/no-web-gameplay-code-or-string-table` — REFUTED, FATAL

Claim part (1): *"The WEB decompile holds no gameplay classes at all:
`reference/decompiled/shs3_payload/scripts/` has 652 files and zero matching 'enemy' —
it is skins and asset classes (torso4000.as, hair6000.as, ColorPicker_*)."*

The command output is real. The inference is false, and it is the **exact false-negative
trap the Stage-0 correction C1 warns about**, one level up: not a byte-encoding trap but
a symbol-renaming trap.

```
$ ls reference/decompiled/shs3_payload/scripts/ | wc -l          -> 652
$ ls reference/decompiled/shs3_payload/scripts/ | grep -ci enemy -> 0
$ ls reference/decompiled/shs3_payload/scripts/ | grep -vc '§'   -> 40
$ find reference/decompiled/shs3_payload/scripts -name '*§*' -type f | wc -l -> 667
```

The 40 non-`§` files ARE the skins the claim describes. The other **612 are the gameplay
code**. I opened six of them by hand:

| web file | what it is | proof I read |
|---|---|---|
| `§1t68s0§.as` | NPC base class | `:258-279` `setLevel` with the `0.9` factor and the `<=10` clamp; `:22` `= 24`; `:483` `= 12` |
| `§1t99s0§.as` | MCSPlayer | `:249` `this.§1t4415s0§ = 8 * 24;`; `:3272` crit predicate |
| `§1t120s0§.as` | SkillManager | `:503-514` the five trap cases, `-1` kunai |
| `§1t1523s0§.as` | StatsManager | `:36` `= 0.717`; `:2644-2651` rebirth payout |
| `§1t1541s0§.as` | InputManager | `:57` `internal static var thickness:int = 8;` |
| `§1t1543s0§.as` | NPCManager | `:615-730` the 38-case `switch(_loc6_.ai)` |

Claim part (2) — no skill-description strings in `payload.xml` — is TRUE; I reproduced
all three greps at 0. The `125_Mobile_NpcData.bin` encoding note is TRUE; the first 60
bytes are `b'<?xml version="1.0" encoding="utf-8"?>\r\n<npcdata>\r\n\r\n\t<npc>\r'`.

But the finding's operative instruction — *"there is no web AS3 to cross-check against …
it should be stamped on the ledger once instead of refuting ten claims"* — would tell
every lane to stop looking at the one bundle that actually answers the parity question.
That is why this is fatal rather than material.

### ✗ C14 `enemies/archer-knockdown-is-android-only` — REFUTED, FATAL

Claim: *"The archer's arrow-knockdown roll does not exist in the shipped web build…
The web twin `§1t4539s0§.as:563` calls its create-arrow with SIX arguments and no such
flag. Web archers therefore never set LAUNCH_KNOCKDOWN."*

**`§1t4539s0§` is not the archer.** I recovered the web dispatcher and read the case map:

```
reference/decompiled/shs3_payload/scripts/§1t1543s0§.as
 615:  switch(_loc6_.ai)
 623:  case 2:   _loc5_ = new §1t4542s0§(...);   <- android case 2  = EnemyArcher
 693:  case 25:  _loc5_ = new §1t4539s0§(...);   <- android case 25 = EnemyGoblinThrower
 726:  case 36:  _loc5_ = new §1t4545s0§(...);   <- android case 36 = EnemyKanjiGuardian
```

The real web archer carries the knockdown ladder **verbatim**:

```
reference/decompiled/shs3_payload/scripts/§1t4542s0§.as
 273:  var _loc1_:Boolean = false;
 274:  if(level > 50)      { 276: _loc1_ = int(Math.random() * 2) > 0; }
 278:  else if(level > 20) { 280: _loc1_ = int(Math.random() * 3) == 0; }
 282:  else if(level > 10) { 284: _loc1_ = int(Math.random() * 4) == 0; }
 305:  §1t1712s0§.§1t11327s0§(_loc2_,_loc3_,_loc8_,_loc10_,damage,_loc1_,this);   <- SEVEN args, flag 6th
```

versus `reference/decompiled/shs3_android/scripts/EnemyArcher.as:288-300`, which is the
same three tiers and the same 7-arg call. The rule is **build-identical**, not
android-only. C14's instruction *"do not ship it in a v0.717-targeted recreation"* would
delete a shipped mechanic.

Two of C14's side-facts are correct and worth keeping: `§1t128s0§.as:8` is
`internal static var §1t12543s0§:Number = 3;` (GRAVITY), and `§1t4545s0§.as:466` really
does carry the KanjiGuardian's flatter `/(0.866 / 3)` arc.

**C7, in this same packet, is the correct reading of the same file** and it survives.

### ✗ C10 `enemies-ai/web-payload-is-obfuscated-not-empty` — REFUTED, MATERIAL

Every line cite in C10 resolves and every quoted line is verbatim — I checked
`§1t68s0§.as` at `:22`, `:122`, `:128`, `:237`, `:258-278`, `:483` and all six are exact.
What fails is the conclusion: *"every headline enemies-ai constant is identical to the
Android v0.682 build, so build parity is **ESTABLISHED** rather than open."*

It is disproven **inside the very file C10 cites**:

```
reference/decompiled/shs3_android/scripts/NPC.as:451-453
      if(behead) { damage *= 1.5; }
reference/decompiled/shs3_payload/scripts/§1t68s0§.as:472-474
      if(this.§1t1071s0§) { _loc3_ *= 1.3; }
```

The behead multiplier is a headline enemies-ai constant and it moved 1.5 → 1.3. Three
further divergences are proven by claims I upheld in this same packet: the stance-refusal
threshold (C33: flat 48 of a 192-frame bar, vs `maxreload/6` of a 120-frame bar), the
rebirth payout (C29: 100/25 vs 20/5) and — per C7 — the archer's knockdown gravity
override, which exists only in web.

C11 and C9 state the same true core without the false conclusion, so nothing is lost by
refusing C10. Admitting it would license stamping android numbers CONTRACT for a
v0.717 target, which is precisely the risk S0-3's caveat exists to prevent.

### ✗ C5 `enemies-ai/second-ai-dispatch` — REFUTED, MATERIAL

The headline is TRUE and I verified it: `NPCManager.as:671-700` really is a second,
independent `if/else` dispatch on `xml.ai`, and it is the overworld path
(`Obj_NPCAggro.as:63`, `Obj_NPCCivilian.as:24`, `Obj_Corpse.as:28` all call it).

The finding then appends an explicit *correction* that is wrong:
*"38 cases resolve to 34 DISTINCT classes (31 Enemy\* + 3 Friendly\*), because
EnemyPlayer appears 3x and EnemyWolf/EnemySpearElite 2x each."*

```
$ sed -n '516,636p' .../NPCManager.as | grep -oE "new [A-Za-z0-9_]+" | sort -u | wc -l   -> 35
$ ... | grep -oE "new Enemy[A-Za-z0-9_]+" | sort -u | wc -l                              -> 32
$ ... | grep -oE "new Friendly[A-Za-z0-9_]+" | sort -u | wc -l                           -> 3
```

`EnemyWolf` (case 8) and `EnemyWolf2` (case 10) are **different classes** —
`EnemyWolf2.as:3` reads `public class EnemyWolf2 extends EnemyWolf`, and both files exist
on disk. The `[A-Za-z_]*` character class used to derive "2x EnemyWolf" silently ate the
trailing digit. Correct arithmetic: **35 distinct (32 Enemy\* + 3 Friendly\*)**, repeats
being EnemyPlayer ×3 and EnemySpearElite ×2 only (3 + 2 + 33×1 = 38 ✓).

Refused rather than held because the false half is presented *as a correction to the
lane*, and a wrong roster count is exactly the kind of thing that propagates silently.
The true half is re-filed below as new finding **N3**.

---

## THE 44 THAT HELD

I opened every cited artifact. Highlights of what I re-derived rather than trusted:

**Anim blob (C1, C2).** Parsed `99_MCSCharacter_HumanAnimationData.bin` myself — it is
`<anim i="name" d="N">`, not `<name>` — and got **158 anim tags, 158 unique names**.
16 families use `_part`, with counts `{3,3,3,3,3,3,3,3,5,5,4,2,2,2,2,2}` and the family
list matches C1's sixteen entries **one for one**. The seven "NO parts" durations
(`lighthorizontalslash 3, downstab 15, stabattack 14, katanaattack 10, downstab_up 10,
holdshieldstabattack 10, ninjaslash 8`) are exact. C2's eight death durations
(`death 38 · deathenemy 23 · deathnohand 25 · deathnohead 31 · deathwitharrow 23 ·
deathbyarrow 21 · deathinhalf 28 · deathdowned 7`) are exact.

**Premium ladder (C37).** Re-derived from `121_Mobile_PremiumData.bin` joined to
`itemdata.xml`: 176 raw rows, 143 unique ids, 0 unresolved, unique ladder
`{1:20, 2:2, 3:94, 5:4, 12:23}`, raw ladder `{1:23, 2:2, 3:123, 5:4, 12:24}`, and the
23 twelve-Gold ids in the exact order given. The 2-Gold pair resolves to
`2101 'Medium Soldier Pill'` and `2126 '25 Duel Tokens'`. Every number matched.
`citelint` flagged QUOTE_UNVERIFIED here; that was a false alarm — the "quote" is a
derived measurement, not file text.

**Modifier histogram (C45).** Re-derived over all 982 items: 412 modifiers total,
`103×223, 104×42, 105×40, 106×33, 0×13, 3×13, 38×6, 1/2/13/15×3, 5/8/9/78/79/82/84×2`,
singletons `6,7,12,25,90,96,97,98,99,101,102,117,122,123,124,40000`. **Entry for entry.**
`InventoryUI.as:1098-1109` is the three-way fallback verbatim, and `itemdata.xml:2412`
`<id>2210</id>` → `:2425` `<id>40000</id>` is exact. `strings.json["4356"]` = `Reset Quests`.

**Loot histogram (C46).** Re-derived over 495 npcs: `0×77, 3×28, 2×10, 1×10, 2113×2,
2112×2, 2114×1, 20028×1` — exact, and exactly six rows fall through to
`NPC.as:855 addLootItemBasic(lootType,qty)`. `npcdata.xml:31` carries the malformed
`6015.6017` verbatim; it occurs 355× and `6.5006501650265E+47` occurs once.

**Focus-bar row scan (C22).** Re-ran the scan independently at y=1033, x∈[230,560] over
all 18 `t19*.png` frames: `t1958.967` → one white run `(251,333)`, `t1970.333` → one run
`(251,318)`, sixteen others empty. Then I cropped `t1958.967.png` at (100,940)-(620,1080)
LANCZOS ×3 and looked: partial white fill on the third bar, no caption, HP 16/20 green,
Chi 20/20 blue. The track measures x251→x518 = 268 px, so 83/268 = 31% and 68/268 = 25%.
The crit predicate is real — `§1t99s0§.as:3272` is
`if(this.§1t4414s0§ == this.§1t4415s0§)` → `×1.3`. This finding is a model of scope
discipline: it corrects the evidence line without touching the conclusion.

**THE FRAME WINS, twice.**
- C24: `ui_strings.txt:189` says `War room rules 1/6`; I opened
  `Nr4fQstqHDM/seg-20/frame_0011.jpg` (whole @1.6×) and the shipped screen reads
  **`WAR ROOM RULES 1/7 (JOINING A BATTLE)`**. The doc loses. `ui_strings.txt` is authored
  TextField default text — `:100` still carries the `1234 - 1235` filler verbatim.
- C39: I opened `Nr4fQstqHDM/seg-05/frame_0025.jpg` (whole @1.9×). It is a full-screen
  crimson **YOU WIN** blood-splatter card with a black grass silhouette across the lower
  fifth and two silhouettes at right — a straw-hat samurai with a sheathed sword and an
  archer drawing a bow. **No HUD chrome of any kind.** No level badge, no XP, no currency,
  no Dan. Any A1 quote describing a level-8 HUD on this frame describes a frame that does
  not exist.

**Frames I opened and confirmed pixel-for-claim:** C16 (`YOU WERE DEFEATED!` +
`LEAVE AREA` / `FREE RESPAWN`; neither button string exists in the table, only
`["480"]='Respawn'`), C17 (`AUTO SLASH OFF`, `TYLUV (3)` over a green bar,
`CANNOT CHANGE STANCE` under 20/20 and 10/10, tray slots 2 and 3), C18 (`REFRESHING…`
modal up with **both** `40` and a bare `30`; 0017 and 0018 show `40` only), C19 (four
crests plus a `?` — gold fan, red dragon, blue four-wheel, **green fist** — with the
Ki Sensu card open), C20 (`FAST SHOES OF FOCUS` in **green**, `RESERVED SHARP IRON SWORD
OF WATER` in **blue**), C21 (the potato tooltip renders `strings.json["4132"]` verbatim),
C23 (Aka Ryu and Ki Sensu **both** claim the North-East), C25 (`NAGANO (26,52) LEVEL: 9`
over exactly 13 tile columns, cross-read against `TERRITORY (22,51) SECTOR (5,2)` and
`TERRITORY (21,51) SECTOR (2,3)` — a 13-wide board cannot hold column 26), C36
(gold `150% DAMAGE` under the bars in `duel_dense/Nr4fQstqHDM_428.0.png`).

**Real, well-measured build divergences that held:** C7 (gravity 3 → 1.5 on knockdown
shots, web only), C29 (rebirth 100/25 web vs 20/5 android, both capping dan at 9),
C33 (stance refusal `>= 48` of a 192-frame bar web vs `maxreload/6` of 120 android),
C26 (v0.717 calls `getString(979/980/981)` for the three stance names and
`strings.json` has **no** key in 960..999 — I enumerated).

**Cite-perfect finds:** C30 (every one of eight line numbers in the bladeslashfx block
exact), C31 (traps `-1` in both builds; the `/4` belongs to `SKILL_WINDMILL = 1051`,
whose own description ends `Uses 4 kunai.`), C40 (`11037` carries `<baseprice>.</baseprice>`
— the **only** non-numeric baseprice in 982 rows; `XMLItem.as:86-92` confirms `'.'`
coerces to 0 instead of firing the 1-coin default), C41, C42 (982-id sets identical,
symmetric difference empty, 2218 in neither), C43 (top of the maxdamage distribution
reproduced in order: `13179 108/39/65, 13178 96/57/70, 13176 94/55/66, 13177 92/53/64,
13227 92/50/63, 13225 90/81/79`), C47 (`sellPercentage` is the sole occurrence in the
whole bundle; `ShopUI.as:401` calls `getSellAmt()` unmodified).

---

## CORRECTIONS CARRIED BY HELD FINDINGS

These do not sink their findings, but a lane copying the cite verbatim will trip.

| # | finding | correction |
|---|---|---|
| 4 | roster-display-names | `new EnemyWolfAlpha()` is at `NPCManager.as:551-552`, **not** `:559-561` (`:559-561` is `break; case 14: new EnemyPlayer(…)`). The declared CITE — `resolved_names.json` — is exact: all nine values verify against its 484 rows. |
| 6 | setlevel-is-plural | the EnemyPlayer boss branch opens at `:780`, not `:781`. Cite range `:777-790` covers it. |
| 8 | web-gameplay-code-obfuscated | `§1t3244s0§:int = 24` is at `§1t68s0§.as:22`, **not** `:26` (`:26` is `§1t3246s0§:int = 0`). C10 and C11 both give `:22` correctly. |
| 21 | six-buff-potatoes | the six-potato family is right, but `OverworldHUD.as:1388-1470` renders **13** buff labels, not 6 (adds coins, rare loot, two mutes, hell, injured, moderator). |
| 27 | index-firstlines | **four** questdata paths share `[93, 226, 240, 1698, 2329, 2401]`, not three — `wave/neutral/lvl` is the fourth, and `questdata.xml:93` is in fact the *neutral* one, exactly as quoted. The `<lvlreq> -> [257,286]` example is from `skilldata.json` / `skilldata.xml`, not questdata; it does verify (`skilldata.xml:257` `<lvlreq>3</lvlreq>`, `:286` `<lvlreq>5</lvlreq>`). |
| 32 | web-only-skills-1074-1077 | the parenthetical "75 `<skill>` rows, **max id below 1074**" is wrong — max skill id is **1501** (`skilldata.xml:1948` id 1500, `:1960` id 1501). The load-bearing claim survives: 1074-1077 are absent from all 75 rows, absent from the 50 android `SKILL_*` constants, and `2501,-8` is unique to web. |
| 35 | blade-stroke-taper | the web `lineStyle` is at `§1t1541s0§.as:**361**`, not `:360` (`:360` is `return;`), and the two lines are **not** byte-identical — android has `distanceLeft`, web has `§1t10078s0§`. Semantically identical, and `:57 thickness:int = 8` **is** byte-identical in both. Colours check: 10027008 = 0x990000, 39168 = 0x009900. `greenLine()/redLine()` really do have only `SkillUI.as:75` and `:136` as callers. |
| 42 | item-2218 | 2218 branches at **twelve** sites, not ten (`:957` and `:1014` in addition to the ten cited). Undercount only. |
| 44 | empty-item-row | 7075 is **not** the only fully-empty row — there are **19** (`4021, 4022, 4070, 4102-4107, 4110-4117, 4138, 7075`), all of which the finding's own quote partially lists. And "around 90 further rows are stubs" measures **166** rows carrying only `id`/`type`/`unique`. The 804/178 and 103/75 splits are exact, and `XMLItem.as:68/:76/:92/:116` confirms the parse defaults (`displayname ""`, `type 0`, `gvalue 1`, `art = id`). |
| 46 | npc-loot-ids | `6015.6017` occurs 355× but appears in **352** `<mcs>` blocks. Immaterial. |
| 13 | zombie-weapon-parry | the branch is **not** zombie-specific — `NPC.as:437-440` carries the identical case, so it is universal. Filed as N4. |

---

## NEW FINDINGS (mine, unclaimed by anyone in this packet)

**N1 — the behead multiplier diverges 1.5 → 1.3 between builds.** `NPC.as:451-453`
`if(behead) { damage *= 1.5; }` vs `§1t68s0§.as:472-474` `if(this.§1t1071s0§) { _loc3_ *= 1.3; }`.
A tuning divergence in the base NPC class of the two builds. Port 1.3 for a v0.717 target.
This is the artifact that kills C10 and it independently sharpens the undischarged S0-3
parity caveat.

**N2 — the web class-name mapping has its anchor: `§1t1543s0§.as` is the web NPCManager.**
Its `switch(_loc6_.ai)` at `:615-730` has 38 cases in the same order as the android
switch at `NPCManager.as:516-636`, so the whole enemy roster can be name-mapped in one
pass. Confirmed pairs: ai 0 → `§1t122s0§` = EnemyPlayer(`…,true,false`), ai 2 →
`§1t4542s0§` = EnemyArcher, ai 25 → `§1t4539s0§` = EnemyGoblinThrower, ai 36 →
`§1t4545s0§` = EnemyKanjiGuardian, ai 37 → `§1t4523s0§` = EnemySpearElite(boss).
This is the schedulable name-recovery job C9 asked for, already started.

**N3 — the android `createNPC` switch resolves to 35 distinct classes, not 34.**
32 `Enemy*` + 3 `Friendly*`; `EnemyWolf` (case 8) and `EnemyWolf2` (case 10) are separate
classes (`EnemyWolf2.as:3` `public class EnemyWolf2 extends EnemyWolf`). Repeats are
EnemyPlayer ×3 and EnemySpearElite ×2 only. Separately, 34 `Enemy*.as` files exist on
disk, i.e. two `Enemy*` classes are never reached by this switch. (Corrected form of C5,
whose true half — two independent dispatch tables — stands.)

**N4 — the free weapon-parry is universal, not a zombie quirk.** `NPC.as:437-440` carries
`case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;`
in the base class, and `§1t68s0§.as:458-461` confirms it in v0.717. **Every** NPC nullifies
a blade hit that lands on its rendered weapon. C12/C13 read the EnemyZombie override
correctly; the mechanic is just far broader than either says, which makes it a
first-order combat-core rule rather than an undead flavour note.

**N5 — itemdata ships 19 completely empty item rows, not one.** ids
`4021, 4022, 4070, 4102, 4103, 4104, 4105, 4106, 4107, 4110, 4111, 4112, 4113, 4114,
4115, 4116, 4117, 4138, 7075` each carry only `<id>`. A further 147 rows carry only
`<id>` plus `<type>` and/or `<unique>` (166 stubs total). An item pipeline that survives
one empty row must survive nineteen.

---

## PROCESS NOTES

- `citelint` flagged six findings QUOTE_UNVERIFIED. **Five were false alarms** (4, 9, 26,
  37, 43, 44 — the quote lived in a file outside the declared CITE field, or was a derived
  measurement rather than file text). Only claim 4 carried a genuine bad line number, and
  it was in a parenthetical, not the CITE. QUOTE_UNVERIFIED is a weak signal on this lane.
- Conversely, **three of my four refutations carried `citelint: RESOLVES`** — the failures
  were inferential, not mechanical. The script cannot catch "0 grep hits therefore the code
  is absent", and that is the single most expensive error class in this packet.
- No file outside this journal path was modified. `src/core/Sim.ts` and
  `tests/duel-baseline.test.ts` untouched.
