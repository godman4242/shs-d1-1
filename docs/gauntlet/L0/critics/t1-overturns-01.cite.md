# t1-overturns-01 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — 24 claims, all claiming a ledger overturn.
Judged: 24/24. Skipped: 0.

Method: for every claim I opened the cited artifact myself (`awk 'NR>=a && NR<=b'` line-addressed
reads, byte-level censuses in Python, one PIL crop of the cited frame, and my own zlib+RECT decode
of two SWF headers). I did not open `critics/` or `sources/`.

## THE ONE BIG THING THIS PASS FOUND

Two claims (IDX 0 `NF-1-crit-is-deterministic-full-focus`, IDX 3 `NF-5-per-stance-damage-multipliers`)
read android `MCSPlayer.getDamage()` and asked the ledger to be rewritten from it. **The web v0.717
twin of that exact function exists and carries different constants.** It is
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277` (obfuscated, but unambiguous — same
`minDamage + Math.random() * damageRange` opener at :3258, same `getBaseDamage` at :3281, same
Heavy-defender `defense * 0.8` at :3286-3290, same reload-reset at :3295-3297):

| | android v0.682 `MCSPlayer.as:3198-3224` | **web v0.717 `§1t99s0§.as:3255-3277`** |
|---|---|---|
| Light | `base * (0.5 + 0.5*m*0.01)` | `base * (0.5 + 0.4*m*0.1)` |
| Balanced | `base * (1 + 0.5*m*0.01)` | `base * (1 + 0.2*m*0.1)` |
| Heavy / Dual / Reversed | `base * 1.5` | `base * 1.4` |
| crit branch (`reload == maxreload`) | `*1.5` Light / `*1.2` other `+ STAT_CRITICALDMG` | **one branch: `*1.3 + STAT_CRITICALDMG`** |

Consequences:

1. `REBUILD_READINESS.md:152` **"Keep `CRIT_MULT=1.3`" is VINDICATED, not killed.** The web build
   this project targets returns `maxDamage * 1.3 + STAT_CRITICALDMG`. IDX 0's demanded rewrite is
   wrong for v0.717.
2. `REBUILD_READINESS.md:155`'s stance table **"dmg 0.9/1.2/1.4"** reproduces EXACTLY from the web
   expression at mastery 10: `0.5+0.4=0.9`, `1+0.2=1.2`, flat `1.4`. The ledger's numbers are the
   web-build truth; the android constants are a build divergence, not a correction.
3. What survives from IDX 0 in BOTH builds: **crit is DETERMINISTIC and gated on `reload == maxreload`**
   (web :3272), with a flat gear term added. That closes ledger blocker ⑤ (:195) honestly.

This is a second confirmed combat-tuning divergence beyond IDX 16's cooldown cap, and it lands on the
single most load-bearing formula in the project. It also invalidates IDX 0's stated parity warrant
("web longplay cooldowns reproduce from this codepath") — IDX 16 in the same packet proves the
cooldown codepath differs 300 vs 600.

## VERDICTS

### REFUTED (2)

**IDX 0 · NF-1-crit-is-deterministic-full-focus · FATAL**
Android cite `MCSPlayer.as:3215-3222` is verbatim-exact (quote runs one line past into :3223, harmless).
Refuted on its overturn: web `§1t99s0§.as:3272-3275` is a single 1.3× branch. "The real multipliers are
1.5x Light / 1.2x other" is android-only and the ledger's 1.3 stands. `STAT_CRITICALDMG = 204` at
`StatsManager.as:258` confirmed. Also note the code calls the meter `reload` (`maxreload = 5 * 24` at
`MCSPlayer.as:239`, drawn by `BattleUI.updateReload`); calling it "Focus" is an interpretive overlay,
not in the artifact. SURVIVING: deterministic crit gated on a full reload bar, true in both builds.

**IDX 8 · NF-enemy-skill-ladder · MATERIAL**
`EnemyPlayer.as:157-249` is verbatim-exact — the date-seeded RNG ladder is real (gates 6/20/12/70 ×3
groups at 50%, `1005` at 1/3 from level 10). Refuted on its conclusion. The SAME file, `:818-830`,
does `skillList = xml.skillList;` for every non-boss EnemyPlayer (ai 0 and ai 9 = 73 of the 88 rows),
i.e. the moveset IS read from npcdata's `<skills>`. `generateSkillList()` has exactly one call site,
`setLevel()` at `:143`, and `NPCManager` calls `setLevel` only when a spawn passes `lvl != 0`
(`:877-880`, `:893-895`, `:908-910`, `:932-934`). So the ladder is a wave-rescale override, not the
default path, and "false for the 88 EnemyPlayer rows" is backwards.

### HELD, WITH A CORRECTION YOU MUST CARRY (7)

**IDX 3 · NF-5-per-stance-damage-multipliers · MATERIAL** — android constants exact; build field
honestly says android. But tag them per-build: web is `0.5+0.04m` / `1+0.02m` / flat `1.4`. The ledger
line it names (`:189`, incl. "crit 1.3×, Heavy def ×0.8") is CONFIRMED by web `§1t99s0§.as:3274` and
`:3286-3290`, not overturned. What is genuinely new and true in both builds: Heavy/Dual/Reversed take
NO mastery term at all.

**IDX 6 · NF-boss-hp-derivation · MATERIAL** — `EnemyPlayer.as:97/98/107/124/125/131/132/133` verbatim;
level-banded `playerhit` floors at `:108-123` exact. `build: both` over-claims. Web twin
`§1t122s0§.as:105-148`: HP half identical (`:112-113`, floors `:123-137`, `max()` at `:139-143`), but
the `hitsToKillPlayer` floor is **3** (`:118-121`) vs android's **2**, and the boss-ATK `max()` step is
android-only — web `:146-147` sets `minDamage = 1` and assigns `playerHP / hitsToKillPlayer` to a
separate field. "The same shape for attack" is android-only.

**IDX 11 · NF-level10-clamp · MATERIAL** — `NPC.as:241-245` and `:253-259` verbatim, and IDENTICAL in
web `§1t68s0§.as:258-279`. But "**Every** enemy spawned with an explicit level <= 10 is FORCED to
1 HP / 1 damage / 1 defense" is wrong for the 88 ai-0/9/14 rows: `EnemyPlayer.setLevel` overrides with
no `super` call, no ×0.9 damp and no HP clamp — only `if(lvl <= 5) { minDamage = 1; defense = 1; }`
(android `:138-142`, web `§1t122s0§.as:149-154`). My census: 65 of the 285 clan-army rows (ids 200-656)
are ai 9, so "the authored lvl 1-10 rows of the five clan armies are moot at runtime" is wrong for
those 65.

**IDX 18 · actionscript/slash-line-colour-is-0x990000 · MATERIAL** — headline exact:
`InputManager.as:360` = `10027008` = 0x990000, and `10682368` (0xA30000) returns **zero** hits across
all of `reference/decompiled/`. Second sentence FALSE: the green stroke is not web-only and is not
unidentified — android `InputManager.as:172-175` is `public static function greenLine()` at `39168`,
`:177-180` is `redLine()` at `10027008`. No frame pass is needed to name it.

**IDX 22 · art-anim-audio-feel/800x690-is-the-friend-bar-layout · MATERIAL** — headline exact. Its
CAVEAT is refuted by artifact: "exists only in the Android bundle — grep for originalWidth/originalHeight
returns zero hits" is an invalid test, because the web payload renames locals to `_loc*_`. The twin is
present in web v0.717 at `§1t1540s0§.as:269-312` (`_loc2_=800; _loc3_=480; _loc4_=690;`, same aspect
branch, same friend-panel `init()`), plus `:388` `stageWidth == 800 && (stageHeight == 480 || stageHeight == 690)`.
There is NO Android-parity hole on the friend bar.

**IDX 12 · NF-melee-ai-geometry · MINOR** — every EnemyKnife literal verbatim (`:140` walkSpeed
`Math.random()*2+4`; `:181`/`:200` the 50×50 px trigger; `:113-115` `damage * 2` on downed;
`:127` nearest-enemy retarget; `:64/:68` ±40 and `:104/:108` ±100 knockdown pushes). Error: "retarget
every 12 frames" — 12 is **EnemyPlayer's** `aiCounterMax` (`:52`). EnemyKnife does not override the base
`NPC.as:22 aiCounterMax:int = 24`, so the class actually read retargets every **24** frames. Blocker ③
(telegraph/active/recovery frames) is not touched by any of this; only ④'s targeting half moves.

**IDX 23 · art-anim-audio-feel/anim-loop-flag · MINOR** — `AnimData.as:10`, `:16` and
`MCSCharacter.as:1293` verbatim. My own census over `reference/extracted/bindata/*.bin` reproduces the
numbers EXACTLY: **487** `<anim>`, **102** with `l="1"`, and **zero** `@d != len(<f>)` mismatches. Every
named looping animation confirmed (incl. `ogre_walk`). Over-claim: "every `*_partb` slash tail" — only
**18 of 46** `_partb` anims loop; `light_fallslash_partb`, `balanced_fallslash_partb`, all six
`*_jumpslash_partb`, `spear_*_partb`, `punchcombo_partb`, `stomp_partb` etc. do NOT.

### HELD CLEAN (11)

- **IDX 1 · NF-15 (150% DAMAGE potato)** — I cropped `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`
  at (0,820)-(760,1080) and upscaled 3× Lanczos: kasa'd portrait in a red ring, green `20/20`, blue
  `26/26`, a tan bar reading **CANNOT CHANGE STANCE**, gold **150% DAMAGE** beneath it. Exactly as
  described. `strings.json["4132"]` = "Eat this potato to get the 150% Damage buff.\n\nNote: Only one
  buff may be active at a time." verbatim; 4133/4134/4135 = Defense/XP/Speed. `StatsManager.as:288-312`
  = all 13 BUFF_* constants verbatim. `:1847-1850` and `:1908-1911` do multiply SPD ×1.5 pre-cap.
- **IDX 2 · NF-38-cases-35-classes** — `NPCManager.as:516-634` has cases 0..37 = 38 arms; distinct
  classes = 35 (EnemyPlayer serves 0/9/14, EnemySpearElite serves 28/37). `EnemyPlayer.as:40` signature
  verbatim. My `<ai>` census over npcdata: ai 9 = **73**, total ai-bearing = **425** (matches the index).
- **IDX 4 · NF-9-dragon-dance-input-recovered** — `DragonDanceUI.as:68/:70/:71/:355/:367/:447` verbatim,
  file is 650 lines, validation is string equality on `danceTarget.getSequence()`.
  `Obj_DragonDanceStatue.as:42-63` verbatim with all five permutations (1246/4216/1642/1426/6241).
  Node clicks gate POSE1-8 on `canChangeStance()` at `:371-410`. The sub-cite
  `shs3_android_fla/dragondancewords_212.as` DOES exist (at
  `reference/decompiled/shs3_android/scripts/shs3_android_fla/`). BONUS: this is not android-only — the
  web build carries it too (`§1t8695s0§.as:172/176/188` = "1246"/"4216"/"6241", label array in
  `§1t5495s0§.as`), so the claim's build caveat can be dropped.
- **IDX 5 · NF-ai0-duel-opponent-absent** — my own census: `<ai>` values unused in 0..37 = **exactly
  {0, 10, 15, 16}**. `NPCManager.as:518-519` case 0 = `new EnemyPlayer(mcs,true,false)`.
  `XMLNpc.as:36` DEFAULT_EQSTRING verbatim, `:705` `new Vector.<Item>(13)` verbatim, `initDuelist` at
  `:290` builds from stats+equipment strings, called by `DuelModeUI.as:410/435/439/461`.
- **IDX 7 · NF-category-11-decoded** — QUOTE_UNVERIFIED was a prose-census artefact, not a fabrication.
  Every element checks: category 11 = exactly `{1064,1065,1066,1067,1068,1500,1501}`; displaynames
  6132-6136 resolve to Back Throw / Air Stab / Bull Charge / Punch Lunge / Undying; **1500 and 1501 carry
  no `<displayname>` at all**; masteries 1000/1001/1002 sit in categories 1/2/3; no cat-11 skill has a
  top-level `<desc>` or a `<req>`. `skilldata.xml:1948` = `<id>1500</id>`, `:1960` = `<id>1501</id>`.
  `npcdata.xml:3662` = Aboshi (id 175) 1500@3, `:3898` = Magoichi (188) 1500@3, `:3934` = Gojo Takamori
  (190) 1501@3 — all verbatim.
- **IDX 9 · NF-four-faction-spawn-model** — every line number lands; the quote is a faithful paraphrase
  with marked elisions (hence QUOTE_UNVERIFIED). `:923-930` and the `:939` signature are verbatim.
  `lvl != 0` gating on all four constructors confirmed.
- **IDX 10 · NF-kill-xp-formula** — verbatim in android (`NPC.as:218`, `:252`; `EnemyPlayer.as:80-89`)
  AND in web (`§1t68s0§.as:237`, `:271`; `§1t122s0§.as:82`, `:103`). `build: both` is correct.
- **IDX 13 · NF-npcdata-silences** — (a) my census returns exactly ids 0/47/160/801/819 with no
  `<name>`/`<ai>`/`<lvl>`, at lines 3/1511/3352/4097/4437. (b) all eight colour-override tags occur
  **0** times across all 495 blocks while `MCSCharacter.as:524-551` parses every one — verbatim.
  (c) bands 91 / 99 / 285 / **0** / 20, no duplicate ids — EXACT. (d) string bands confirmed
  (5001='?', 5009='Ruffian', 5053='Soldier', 5063='Castle Guard'; 6000/6001 = skill 1000's
  displayname/desc; per-level `<desc>7000</desc>`). ONE off-by-one: the `'?'` placeholder rows are ids
  **814-818 (five)**, not 815-818 — id 814 also carries `<name>5001</name>`.
- **IDX 14 · NF-procgen-surnames** — byte-exact: `bindata/96` (289 B, ASCII CRLF) offset 51 = "Hachisuka",
  offset 84 = "Honda"; `bindata/94` offset 692 = "Kano"; `bindata/97` offset 1620 = "Shizuka".
  `XMLNpc.as:529` verbatim; `NameGenerator.as:96-102` composes `familyName + " " + male/femaleName`.
  I also confirmed none of Hachisuka/Honda/Kano/Shizuka appear anywhere in `strings.json` (2,533
  entries) — and npcdata `<name>` is a string id, so no authored row could carry those names. Zabuza,
  Tengu and Hotaru: zero hits across strings.json, all 69 bin blobs (UTF-16LE and latin-1 tested), and
  all of `reference/decompiled/`.
- **IDX 16 · build-divergence-7-cooldown-cap** — verbatim on both sides: web `§1t1523s0§.as:2291/2293/2295`
  clamps at 600, android `StatsManager.as:1856/1860` at 300; both `1 - x/cap*0.5`; both apply the SPEED
  buff ×1.5 first (`§1t1523s0§.as:2281-2286` / `StatsManager.as:1846-1851`). The twin identity is exact:
  `§1t105s0§.as:318` `return _loc2_ * §1t1523s0§.§1t9589s0§();` == `XMLSkill.as:310`
  `return val * StatsManager.getSkillCooldownModifier();`. Web SPEED is worth half as much per point.
- **IDX 17 · repair-weapon-cost-formula** — `InteractUI.as:1057/1058/1059/1072/1073/1075` verbatim;
  `StageManager.as:782-785` verbatim. The `if(weapon.uses > 1)` guard only ever *reduces* `uses`, so the
  claim's reading (uses counts wear upward; repair lands at 1, not 0) is the only consistent one.
- **IDX 19 · war-board-is-a-6x6-square-grid** — `WarHexUI.as:350/352/359/360` verbatim (uniform 55 px
  pitch, no odd-row offset), `:447-461` branches only on `xpos/ypos == 0 or 5`, `WarHex.as:219-222`
  gates exactly four cardinal arrows, `WarHex.as:7` `[Embed](symbol="symbol622")` verbatim, 14 `HEX_`
  role constants at `:11-37`. Square topology, hexagon art.
- **IDX 20 / IDX 21 · the friend-bar pair** — `GameEngine.as:269-288` and `:190` verbatim. I decoded both
  SWF document RECTs myself (zlib + RECT bit-unpack): `shs3_android_payload_decoded.swf` = **800.0 × 480.0**,
  `shs3_payload_decoded.swf` (web) = **800.0 × 690.0**. Not reproduced: the `124_Mobile_ImageResource`
  k=109 leg — the blob's 8-byte header is plain `CWS` and XOR-109 does recover the `78 9c` zlib magic at
  offset 8, but the stream then fails to inflate under a constant key; I stopped after two attempts
  rather than guess the scheme. Not refuted, just not independently confirmed. IDX 21's extra inference
  ("the videos read 5:3 only because they were captured in fullscreen") is beyond its cite — nothing in
  the artifact says how the longplays were captured.

### FRAME-vs-DOC (say it out loud)

**IDX 15 · NF-stage-800x480 held.** `StatsManager.as:80/:82/:96/:98` and web `§1t1523s0§.as:104/:106`
are verbatim 800 × 480. I then measured the frame myself: on
`reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, scanning row 540 for near-black columns gives a
**52 px left bar and a 1816 px content box** — exactly the numbers the claim states.
**The frame and the literal disagree**: 1816/1080 = 1.6815 vs 800/480 = 1.6667, a 0.89% stretch. Under
the standing invariant the frame wins on what is *visible*, so any HUD fraction measured off these
frames must be re-based as `(x-52)/1816` and must NOT be treated as pixel-exact against the 800-wide
grid. Both IDX 15 and IDX 20 disclose this honestly; IDX 21 does not.

### OVERTURN BOOKKEEPING

Ledger sentence genuinely falls (7): IDX 4, 10, 11, 14, 15, 20, 21, 22, 23.
Ledger sentence does NOT fall — finding true but aimed at the wrong line (9): IDX 1 (aimed at ui-hud
blocker ② "dynamic HUD feel", which is about bar tween / combo pop / vignette), IDX 2 (names no ledger
text at all), IDX 3 and IDX 6 (both aimed at the damage-math line, which the web payload CONFIRMS),
IDX 5 and IDX 8 (aimed at enemies-ai blockers ③/④ they do not touch), IDX 7 (aimed at the mastery-9
ceiling line), IDX 9 (aimed at the species-taxonomy line — allegiance lists are an orthogonal axis),
IDX 13 (adds constraints to the items line, falsifies nothing in it).
Named "ledger_text" is not a REBUILD_READINESS.md sentence at all (3): IDX 16 ("SPEED 300 is the
cooldown cap"), IDX 18 ("slash line colour 0xA30000"), IDX 19 ("War board is a hexagonal grid") —
`grep` over `docs/` and `src/` excluding `docs/gauntlet` returns zero hits for each. These correct
earlier survey claims, not the ledger; no ledger rewrite follows from them.

## NEW FINDINGS (unclaimed by anyone, found while judging)

1. **`kh-web-getdamage-twin` (A2, web v0.717) — the damage/crit formula is a build divergence, and the
   ledger had the WEB numbers right all along.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3290`:
   Light `*(0.5 + 0.4*m*0.1)`, Balanced `*(1 + 0.2*m*0.1)`, Heavy/Dual/Reversed flat `*1.4`, crit one
   branch `*1.3 + STAT_CRITICALDMG` on `reload == maxreload`, Heavy-defender `defense * 0.8` at `:3286-3290`.
   At mastery **10** this yields exactly 0.9 / 1.2 / 1.4 — `REBUILD_READINESS.md:155`'s stance table
   reproduced to the digit (it says mastery-**9**; the expression hits it at 10).
2. **`kh-1500-1501-are-reversed-and-dual` (A2, both builds) — the two unnamed category-11 skills are
   named by CODE.** `reference/decompiled/shs3_android_payload/scripts/EnemyPlayer.as:836-843`:
   `if(xml.getMastery(1500) > 0) setStance(REVERSED_STANCE); else if(xml.getMastery(1501) > 0) setStance(DUAL_STANCE);`
   So 1500 = reversed grip, 1501 = dual wield, even though neither carries a `<displayname>` or a string
   entry. Bonus at `:844-859`: enemy stance is otherwise picked as the argmax of light/balanced/heavy
   mastery, random among the three when all equal — an unbanked enemy-behaviour rule.
3. **`kh-boss-scaling-divergence` (A2) — a FOURTH combat-tuning divergence.** Android
   `EnemyPlayer.as:778-803` bands boss stats ×1.25 (lvl>70) / ×1.2 (lvl>50) / ×1.1 (lvl>30) / ×0.8 (lvl<10);
   web `§1t122s0§.as:810-824` bands only ×1.1 (30 < lvl < 80) / ×0.9 (lvl < 10). Also `hitsToKillPlayer`
   floors at **3** in web (`:118-121`) vs **2** in android (`:103-106`), and web `:77` sets a field to
   `10 * lvl` that android's `setLevel` has no counterpart for.
4. **`kh-dragondance-is-in-the-web-build` (A2) — drop IDX 4's android caveat.** The web payload carries
   the same class at the same line numbers: `§1t5495s0§.as:70-71` are the Earlier/Later Heaven trigram
   arrays verbatim, and `§1t8695s0§.as:172/176/188` are the "1246"/"4216"/"6241" statue sequences.
5. **`kh-greenline-is-named` (A2, both builds).** The second slash-stroke colour is not an unidentified
   render state: `reference/decompiled/shs3_android/scripts/InputManager.as:172-175` is
   `public static function greenLine()` at `39168` (0x009900), `:177-180` is `redLine()` at `10027008`
   (0x990000). Both builds carry the pair.
6. **`kh-aicountermax-is-24-by-default` (A2).** `reference/decompiled/shs3_android_payload/scripts/NPC.as:22`
   `internal var aiCounterMax:int = 24;` is the base retarget cadence. Only `EnemyPlayer` overrides it
   (`:52`, to 12). EnemyKnife and the other melee classes retarget every 24 frames, not 12.
