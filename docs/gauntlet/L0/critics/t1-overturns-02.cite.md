# t1-overturns-02 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened myself** in this run. No verdict
here is taken from another agent's prose; I did not open `critics/` or `sources/`.

## Headline

This is the strongest packet I have audited on cite hygiene. **All five
`QUOTE_UNVERIFIED` flags are false alarms of the linter, not over-claims** — in every
case the quoted text is really in the cited file; the linter choked on composite
quotes that splice several files together with `///` / `·` separators, and on a quote
that is a *shell command result* rather than a file line. I located every one of them.

**0 of 24 refuted.** That is not a rubber stamp — it is what happens when a packet
cites decompiled AS3 by line and the lines are actually right. I did find real defects,
all of them line-reference slips or over-reaching *lane_impact* prose, recorded per
claim below with the corrected cite. **6 of the 24 claims are TRUE but do NOT overturn
the ledger sentence they name** (IDX 1, 2, 14, 17, 18, 20) — that is the single most
common failure in this packet and the thing the ledger editor must not wave through.

## Method

- Web AS3: `reference/decompiled/shs3_payload/scripts/*.as` (612 obfuscated top-level
  classes, 1,079 `.as` total — I counted both).
- Android AS3: `reference/decompiled/shs3_android/scripts/`, `shs3_android_payload/scripts/`.
- Anim blobs: `reference/extracted/android/*.bin`. ⚠️ **These two blobs are UTF-8 with a
  BOM, NOT UTF-16LE** — decoding them as UTF-16LE returns 0 `<anim>` hits and would have
  fooled me into refuting three sound claims. Decoded with `utf-8-sig`.
- Frames: opened, cropped and upscaled with PIL/LANCZOS at the crops the claims state.
- Video: frames extracted myself with `ffmpeg -ss <t> -frames:v 1`.
- SWF header: parsed `reference/decrypted/shs3_payload_decoded.swf` in Python
  (`CWS`, v17, stage 800×690, **frameRate 24.000**, 6,880,328 bytes) — matches the two
  claims that quote it, byte for byte.

## The class map, re-derived independently

Several claims rest on an obfuscated→real class mapping. I did not take it on trust; I
re-derived it from the **parameter order of `initPlayer`**, which is unobfuscated in
android and positionally identical in web:

`§1t99s0§.as:183-199` vs `MCSPlayer.as:182-196` line up 1:1, giving
`§1t4420s0§`=baseSlashLength, `§1t4421s0§`=lightMastery, `§1t4422s0§`=balancedMastery,
`§1t4423s0§`=heavyMastery, `§1t4419s0§`=baseReload. `§1t99s0§.as:9-19` additionally
carries **unobfuscated** `standingRange/jumpThreshhold/lightSlashSpeed/...`. So
`§1t99s0§` = MCSPlayer, `§1t68s0§` = NPC, `§1t1523s0§` = StatsManager,
`§1t113s0§` = BattleUI, `§1t123s0§` = QuestGenerator. Confirmed.

Stance-constant mapping, from the identical `setStance` switch in both builds
(`§1t99s0§.as:3091-3155` vs `MCSPlayer.as:3019-3095`):
`§1t12220s0§`=LIGHT, `§1t12221s0§`=BALANCED, `§1t12222s0§`=HEAVY,
`§1t12223s0§`=DUAL, `§1t12224s0§`=REVERSED.

---

## Verdicts

### IDX 0 — combat-core/web-as3-is-readable · NOT REFUTED · overturn UPHELD
`§1t1523s0§.as:36` = `public static var §1t9323s0§:Number = 0.717;` — exact.
`§1t99s0§.as:9-19` = standingRange 50 / jumpThreshhold 100 / lightSlashSpeed 50 /
balancedSlashSpeed 40 / heavySlashSpeed 30 — exact, and those identifiers are NOT
obfuscated. `payload_export.log:4` = `Exported script 1/1079 mx.core.mx_internal` — exact.
The named ledger sentence ("cannot be cross-read") is flatly false: its "5 files" refers
to `§1t51s0§/§1t51s1§/` (SWFReader, Utilities, Converter, BinarySerializer, `§1t52s0§`),
a *library* subfolder, while 612 obfuscated game classes sit at the scripts root.

### IDX 1 — combat-core/web-behead-is-1.3 · NOT REFUTED (minor mis-cite) · overturn NOT upheld
**Corrected cite: `§1t68s0§.as:472-475`, not `:470-472`.** The quote is real and I read
it — `if(this.§1t1071s0§) { _loc3_ *= 1.3; }` — but it sits two lines lower; 470-472 is
the `getMinDamage()` floor plus the `if`. Android side `NPC.as:451-453` is EXACT.
I proved `§1t1071s0§` is `behead` independently: `§1t99s0§.as:3737-3746` sets it true on
`PART_hat / PART_head / PART_neck`, the line-for-line twin of `MCSPlayer.as:3688-3692`.
So web ×1.3 vs android ×1.5 is real.
**Overturn NOT upheld:** the sentence named is "part-based weak points (shielder legs,
undead heads)" (REBUILD_READINESS.md:189), listed under *Ready*. A universal
head/neck/hat multiplier ADDS to that line; it does not falsify it.

### IDX 2 — combat-core/web-build-as3-is-readable · NOT REFUTED · overturn NOT upheld
`actionscript.json` bundles verified verbatim, `shs3_payload = 1079`. `find … -name '*.as' | wc -l` → 1079.
`ls '§1t51s0§/' | wc -l` → 1. Build stamp exact.
**Overturn NOT upheld:** the named sentence (REBUILD_READINESS.md:273, :290) says
"no offline playable build … the ~40 INFERRED values will NOT be measured **from a live
build**". That is still literally true — nothing here makes the game run. What the claim
earns is an ADDITION to the ledger (a static-source recovery route), not a retraction.
The ledger editor must not record this as "P0 overturned".

### IDX 3 — combat-core/web-crit-is-1.3-flat · NOT REFUTED · overturn UPHELD
`§1t99s0§.as:3272-3276` exact, character for character. No stance branch.
Android contrast confirmed at `MCSPlayer.as:3215-3222` (×1.2 non-light / ×1.5 light) —
so the "1.2/1.5 split" really is a v0.682 retune. `src/config/combat.ts:17` is
`export const CRIT_MULT = 1.3;` — the claim's "do not change it" is right.
Blocker ② (REBUILD_READINESS.md:190) closes at 1.3, in the ledger's own favour.

### IDX 4 — combat-core/web-damage-stance-curves · NOT REFUTED · overturn UPHELD
`§1t99s0§.as:3258-3270` exact. Light ×(0.5+0.4·m·0.1), Balanced ×(1+0.2·m·0.1),
HEAVY/DUAL/REVERSED flat ×1.4, over a per-slash roll `minDamage + Math.random()*damageRange`.
I checked `StatsManager.getMinDamage()` (android :1863) — it IS ATK+weapon — so the
ledger's "(ATK+Wpn)×stance" is the roll's *floor*, not the damage. The ledger's *Ready*
line at :189 must be rewritten. Mastery identifiers confirmed via the initPlayer map.

### IDX 5 — combat-core/web-heavy-damage-1.4 · NOT REFUTED · overturn UPHELD
Same block; `:3270` is `_loc2_ = _loc1_ * 1.4;`, android `MCSPlayer.as:3213` is `* 1.5`.
The named sentence (an android-derived "flat 1.5 / 0.005m" line) genuinely falls.

### IDX 6 — combat-core/web-maxreload-192 · NOT REFUTED · overturn UPHELD
QUOTE_UNVERIFIED is a linter artifact. All four fragments located:
`§1t99s0§.as:249` = `this.§1t4415s0§ = 8 * 24;`; `:1203-1205` = `if(this.§1t4414s0§ <
this.§1t4415s0§) { ++this.§1t4414s0§;` **inside `override public function update()`
(:1179)**; `§1t113s0§.as:328` = `var _loc3_:Number = (param1 - 48) / (param2 - 48);`;
SWF header frameRate **24.000** parsed by me.
`§1t4415s0§` is provably the crit meter: it is the same variable the crit test at
`:3272` compares against. `:1208` feeds it straight into the BattleUI bar setter.
(192−48)/24 = **6.000 s**, and `COMBAT_MEASUREMENTS.md` f-9 measures **6.00 s
(6.01/6.00/5.98)** off frames. **Source and frame AGREE** — there is no frame-vs-source
conflict to adjudicate, which is exactly the claim. Android is `MCSPlayer.as:239 =
5 * 24` = 120, a genuine retune.

### IDX 7 — combat-core/web-maxreload-192-and-48-offset · NOT REFUTED (minor) · overturn UPHELD
`§1t113s0§.as:326-330` is an EXACT hit including the function signature. I additionally
confirmed the lane_impact's stance-lock claim first-hand: `§1t99s0§.as:103`
(`§1t4419s0§:int = 48`), `:3050` (`… && this.§1t4414s0§ >= 48;`), `:3060`
(`if(this.§1t4414s0§ < 48)`), `:3162` (`this.§1t4414s0§ -= 48;`).
**Minor defect:** the "re-measure of the cited frames at y=1032: 281/290/304/340/370"
carries **no frame path anywhere in the claim**. Under §0 that half is STILL_UNHELD and
must not enter the ledger as a measurement; the source half stands on its own.
Likewise the `t1003.000.png` reference is path-less. (The empty-bar↔"CANNOT CHANGE
STANCE" link is nevertheless corroborated structurally: `§1t113s0§.as:336-342` shows the
message text takes over the same slot when `_loc3_ == 0`, which is `COMBAT_MEASUREMENTS`
f-7's "shared slot" observation read from the other side.)

### IDX 8 — combat-core/web-reach-and-damage-curves-match-repo · NOT REFUTED · overturn UPHELD
`:3094`, `:3105`, `:3116-3120`, `:3262-3270` all exact. I then opened
`src/config/reach.ts` — `lightMult: 1.4`, `balancedPerMastery: 0.02`, `heavyBase: 0.5`,
`heavyPerMastery: 0.04`, `heavyFloor: 100`, base `120 + floor((90+5·dan)·SPD/(20+SPD))`.
The repo is already exactly the v0.717 source. The ledger's "reach 300/200/120 triple"
(REBUILD_READINESS.md:100-101) is dead: reach is a formula, not a per-stance constant.

### IDX 9 — combat-core/web-stance-damage-and-reach-are-inverse · NOT REFUTED (minor) · overturn UPHELD
The most thorough claim in the packet and every line lands: `:3091-3155` is precisely
the `setStance` switch and `:3255-3277` precisely `getMaxDamage`. The five-stance
assignment (REVERSED ×1.4 at `:3131`, DUAL base-floored-100 at `:3142-3146`) is right —
I verified it against the positionally identical android switch (`MCSPlayer.as:3066-3090`).
Base term `§1t1523s0§.as:2344-2347` is EXACT and byte-identical to android
`StatsManager.as:1915-1919`.
**Minor defect:** the bracketed `[REBUILD_READINESS.md:194]` inside `ledger_text` is the
wrong line — blocker ① is at **:190**; :194 is the skills-meters *Ready* line.

### IDX 10 — combat-core/web-v0717-ast-is-readable · NOT REFUTED · overturn UPHELD
`ls … | grep -c '§'` → **612**, `find … -name '*.as' | wc -l` → **1079**: reproduced
both. All six `.as` line cites exact. Corroboration cite resolves:
`SOURCE_CONSTANTS.md:3-4` = "Status: CRACKED AND MINED (2026-07-25)… Build identified
as v0.717". Blocker ② falls via `:3274`.

### IDX 11 — economy/ap-cap-is-40-not-30 · NOT REFUTED (minor mis-cite) · overturn UPHELD
**I opened the frame and looked.** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg`
(1024×576), crop (470,110)-(780,290) upscaled ×4 LANCZOS: **HP 20 / 30** green,
**CHI 47 / 47** blue, **AP 30 / 40** pale blue, ATK/DEF/SPD diamonds down the right edge.
Exactly as quoted. THE FRAME WINS over `STAT_MAXAP,30` — which android
`StatsManager.as:708` and `:2134` show is a character-creation initial, sitting right
next to `setPlayerStats(STAT_MAXHP,10)` (:695, :2119) that the same frame shows grown to 30.
**Minor defect: APINTERVAL is `§1t1523s0§.as:192`, not `:196`.** Line 196 is
`60 * 60` (=3600, the war-move interval). The `= 60` constant is at :192. Corrected.
*Bonus divergence found while checking:* web `§1t1523s0§.as:200` = **40** where android
`StatsManager.as:166` `MAXDUELTOKENS` = **30** — the same slot in the same constant run.

### IDX 12 — economy/calcxp-hard-cutoffs · NOT REFUTED (minor) · overturn UPHELD
`NPC.as:166-190` is EXACT, quote included. `getGreyLevel` at `:94-110` (three bands),
`getZeroDifference` at `:112-164`. **Minor:** that helper has **12** bands, not the
claim's "eleven". The ledger's "20+ samples show no XP formula either" (:215) falls.
**I closed the claim's own build-parity hole:** the WEB build carries the identical
functions — `§1t68s0§.as:113-129` (greyLevel), `:131-183` (zeroDifference),
`:185-209` (calcXP, same two zero cut-offs, same `*(1+0.05·Δ)`, same `*2` elite doubler).
So this is safe to port as v0.717, not merely as android.

### IDX 13 — economy/minus-70-is-repair-not-artifact · NOT REFUTED · overturn UPHELD
**I extracted the video frames myself** with ffmpeg and looked.
t=21:25 (1285 s): BLACKSMITH panel open, options FORGE A WEAPON / REPAIR WEAPON /
REINFORCE WEAPON / LEAVE, wallet **531 COINS / 2 GOLD** — exactly as claimed.
t=21:45 (1305 s): stables (horses), wallet **461 COINS**. Δ = **−70**.
I also independently confirmed the node level: sampling t=1180 → **545 COINS**,
t=1250 → **531 COINS**, i.e. **−14** across the stable leg = nodeLevel 7 × 2 per
`InteractUI.as:241` (`travelcost = … getNodeLevel(…) * 2`, exact). Repair formula
`InteractUI.as:1058` `cost = StageManager.getCurrentNodeLevel() * 10;` — exact, under
`case "repairweapon":`. 7×10 = 70. The player held 531 against a 700 forge quote, so the
forge was never paid.
`SYNTHESIS.md:243` reads "HUD delta was −70 (B-10, unresolved discrepancy, do NOT
hardcode)" — exact. **REBUILD_READINESS.md:216's "(the −70 HUD read is a capture
artifact)" must be struck.** Blocker ③ "Repair-Weapon cost (never captured)" (:215)
also closes.

### IDX 14 — economy/quest-coin-reward-formula · NOT REFUTED · overturn NOT upheld
Every one of the seven cites is EXACT: `QuestGenerator.as:844` (`nodelvl * 5`), `:1006`
(`nodelvl * 10`), `:917`, `:876`; web twin `§1t123s0§.as:883` (`_loc17_ = _loc15_ * 5`)
and `:955`; consumer `QuestLogUI.as:455-461`. Two builds, same law.
**Overturn NOT upheld:** the sentence named is blocker ① *coins-per-**kill*** reality
(:215). Quest coins are a different faucet. This claim supplements the ledger; it does
not falsify the sentence it points at. File it as a new *Ready* line, not an overturn.

### IDX 15 — economy/quest-prosperity-plus5-is-client-side · NOT REFUTED · overturn UPHELD
**I opened the frame and looked.** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`,
crop (480,335)-(770,465) ×5 LANCZOS: **REWARD / 250 XP / 30 COINS / TOWN PROSPERITY: +5**.
Verbatim. Mechanism cites all exact: `QuestGenerator.as:846` (`prosperityReward = 10`),
`:850` (`= 5`), `:921`, `:1094` (literal `<qty>5</qty>`); web `§1t123s0§.as:885, 889,
959, 1140, 1349`; consumed at `Overworld.as:357-359`; channel named at
`HistoryItem.as:373`. (The 30 COINS on the same card is nodeLevel 6 × 5 — IDX 14's law,
frame-confirmed for free.) Blocker ② (:215) splits: the player-driven half is dead.

### IDX 16 — economy/rebirth-pays-heavenly-gold · NOT REFUTED · overturn UPHELD
`StatsManager.as:192` STAT_GOLD=11, `:194` STAT_HGOLD=12, `:2669-2676` getHeavenlyGold
with the PayVault line at `:2674` — all exact. `OverworldHUD.as:1333` exact in BOTH
android bundles.
I then verified the *substance* in the web build: `§1t1523s0§.as:2638` is doRebirth, and
`:2646`/`:2651` pay `§1t9413s0§` — which `§1t1523s0§.as:228` defines as **12**, i.e.
STAT_HGOLD. Coins (stat 11) are `§1t9412s0§` at `:226` and are never touched.
I also pinned the HUD labels so nobody re-confuses them: `OverworldHUD.as:1554-1556`
routes **STAT_GOLD → `coinstext`** ("COINS") and `:1567-1569` routes **STAT_HGOLD →
`goldtext`** ("GOLD"). So the wiki's "+25 g" is heavenly gold, and mapping it to `p.gold`
in `tests/progression.test.ts:183,192` (verified — both lines exist and assert on
`p.gold`) is the wrong purse. **There IS a tier** — 100 at DAN==8, 25 otherwise, with
DAN incrementing while <9 — so REBUILD_READINESS.md:164-165's "no 10th-rebirth tier"
falls and `MAX_DAN_RANK=10`/`tenthGold=100` can leave INFERRED. Note the repo's total
(9×25+100=325) is one rebirth off the source's (8×25+100=300).

### IDX 17 — economy/tournament-is-web-only · NOT REFUTED (PARTIAL is the honest verdict) · overturn NOT upheld
`§1t7144s0§.as:34, 44, 46, 48, 82` — all exact, member names really do survive the
mangling. `grep -rli tournament`: **shs3_payload/scripts → 5 files**, **shs3_android →
0**, and I also ran **shs3_android_payload → 0**.
*Independent corroboration I found:* the web file calls `getString(11005/11006/11018)`,
and the parsed Android string table (`index/strings.json`) tops out at id **9010** with
**zero** entries containing "tournament". Content divergence, not just tuning.
**Overturn NOT upheld:** blocker ④ asks for *token/tournament economy numbers* (:215).
None are read here — the claim itself says a follow-up pass must read the five files.
The blocker stands; only the "grep returns 0, the half is dead" framing dies.

### IDX 18 — enemies-ai/NEW-npc-die-override-count-is-18-not-3 · NOT REFUTED · overturn NOT upheld
I re-ran the scan. `ls Enemy*.as` → **34**. `grep -ln 'override public function die'` →
**18**, and the 18 filenames match the claim's list exactly. Per-file `super.die()`
count: **EnemyArcher 1, EnemyElite 1, EnemyTrainingDummy 1, all other 15 → 0.** Exact.
`EnemyGoblin.as:386` = `dice = Math.random() * 5;` exact; 0 hits for
`DEATH_FORWARD|DEFEATED2` and 0 for `createFlyingWeapon|createFlyingHat` — reproduced.
The roster list is right too, including the easily-missed fact that `EnemyVegePatch.as`
and `Enemy_VegePatch.as` are **two different files** (the underscored one does not override).
Only slip: "Clone-adjacent" is listed among non-overriders, but `EnemyClone.as` overrides.
**Overturn NOT upheld:** the sentence named is art-anim blocker ⑤ *severed-limb death
variant* (:240). A count of `die()` overrides does not close or falsify it; the claim's
own text says it is correcting **another claim's** lane_impact line.

### IDX 19 — enemies-ai/boss-rubber-band-hits-to-kill · NOT REFUTED · overturn UPHELD
`EnemyElite.as:23-84` carries the quote verbatim, including `xp = lvl*5+45` (:34),
`hitsToKillBoss = 10 + lvldiff` (:40), `hitsToKillPlayer = 18 - lvldiff` (:41), the
four-band `playerhit` floor (:51-66), `bossHP = playerhit * hitsToKillBoss` (:67),
`bossATK = bosshit + playerDEF` (:75), and `if(lvl <= 5){minDamage=1;defense=1;}` (:80-84).
All **seven** per-file line cites land exactly on `override public function setLevel`:
KanjiGuardian:48, WolfAlpha:52, Ogre:51, SpearElite:32, Player:57, Stag:48,
TrainingDummy:23. `EnemyOgre.as:51` really is an **empty** override.
KanjiGuardian's variant is exact: `:65` `5 + 8 + lvldiff`, `:66` `16 - lvldiff`.
**The web-parity cite holds** — `§1t4523s0§.as:77` `xp = param1*5+45`, `:83` `10 + Δ`,
`:84` `18 − Δ`. So this is NOT android-only; it is in the shipped v0.717 build too.
`override public function setLevel` count across all scripts = **11** (8 Enemy* + 3
Friendly*) — exact. Blocker ① "absent, not just inferred" (:220) falls.

### IDX 20 — enemies-ai/eight-death-animations-by-killing-blow · NOT REFUTED · overturn NOT upheld · ⚠ MATERIAL GLOSS ERROR
I decoded `99_MCSCharacter_HumanAnimationData.bin` (**UTF-8 BOM, not UTF-16LE**) and got
**158 `<anim>`** — matching S0-4 — with all eight death tags at the exact durations
quoted: death 38 · deathbyarrow 21 · deathdowned 7 · deathenemy 23 · deathinhalf 28 ·
deathnohand 25 · deathnohead 31 · deathwitharrow 23. Reaction chain also exact:
gotlaunchedupwards_parta 4 / _partb 9 / _partc 7, gotlauncheddowned 18,
gotlauncheddownedend 1, downed 23, downedup 4, downedup2 25. Core claim TRUE.
**⚠ Its lane_impact is WRONG and must not enter the ledger:** "Blocker ③'s 'stagger'
half resolves as **no-stagger**-but-eight-deaths." I opened
`94_MCSCharacter_Human2AnimationData.bin` in the same run — `flinch` d=8 and
`flinch_weapon` d=8 are there. The stagger exists. IDX 22/23 in this same packet prove it.
**Overturn NOT upheld:** death animations do not falsify "telegraph/active/recovery +
stagger frames"; and its cross-reference to "the behead damage *= 1.5 rule" is the
ANDROID number — the web is ×1.3 (IDX 1).

### IDX 21 — enemies-ai/elite-boss-second-level-formula-rubber-band · NOT REFUTED · overturn UPHELD
Same source block as IDX 19, verified line by line. `:105-120` resolves to the `init`
body with `initPlayer(...)` at `:106`. The repo cross-reference is exact:
`src/config/combat-sim.ts:110-113` really does read "B4 makes hp and minDamage DERIVED
at spawn from the player's own stats (`enemyHP = effPlayerDmg × K`) … the pre-scale
floor the source's `max(scaledBase, …)` compares against". `bossHP = playerhit *
hitsToKillBoss` with `if(bossHP > maxhp)` IS that formula and that `max()`. The INFERRED
comment can be promoted — and per my IDX 19 finding it can be labelled **v0.717**, not
just v0.682, because `§1t4523s0§.as:83-84` carries the same K.

### IDX 22 — enemies-ai/flinch-is-8-frames · NOT REFUTED · overturn UPHELD
`94_MCSCharacter_Human2AnimationData.bin` (25 anims): `('flinch_weapon','8')`,
`('flinch','8')` — reproduced exactly. `MCSActor.as:170` FLINCH_WEAPON, `:172` FLINCH,
`:922` `FLINCH_STATE:int = 28` — all three land on the exact declaration.
`NPC.as:747-758` `doFlinch()` verbatim, including the SLASH_STATE armour guard and the
prevActionState/prevAnim/prevFrameCounter save. The stagger half of blocker ③ (:220) is
dead. (Cite says `:747-763`; `endFlinch` actually closes at `:765` — trivial.)

### IDX 23 — enemies-ai/flinch-is-a-real-8-frame-state · NOT REFUTED (minor) · overturn UPHELD
Same evidence, and its range `NPC.as:747-765` is the exact one. `endFlinch()` at
`:760-765` restores `actionState`, `startAnim(prevAnim)` and `mcs.frameCounter` —
verbatim. **I confirmed its sharpest sub-claim myself: `99_MCSCharacter_HumanAnimationData.bin`
contains NO flinch tag at all; the flinch really is only in the Human2 blob** — which is
exactly why a search of the wrong blob concluded absence.
**Minor over-reach:** "blocker ③ is now dead in BOTH halves" — this claim's own evidence
kills only the stagger half; the telegraph half is asserted, not shown here.

---

## New findings (mine, unclaimed by anyone in this packet)

1. **The web build carries calcXP verbatim.** `§1t68s0§.as:113-129 / :131-183 / :185-209`
   are the exact twins of android `NPC.as:94-110 / :112-164 / :166-190`. Closes the
   android-parity hole on the entire XP model.
2. **The boss rubber-band is in the WEB build.** `§1t4523s0§.as:77-84` — `xp = lvl*5+45`,
   `10 + lvldiff`, `18 - lvldiff`. The elite/boss level→stat formula is v0.717, not
   v0.682-only.
3. **Web/android divergence, duel tokens:** web `§1t1523s0§.as:200` = **40**; android
   `StatsManager.as:166` `MAXDUELTOKENS` = **30**. Same slot in the same constant run.
4. **Web/android divergence, crit meter:** web `§1t99s0§.as:249` = `8 * 24` (192);
   android `MCSPlayer.as:239` = `5 * 24` (120).
5. **Web/android divergence, crit multiplier:** web flat ×1.3 (`§1t99s0§.as:3274`);
   android split ×1.2 non-light / ×1.5 light (`MCSPlayer.as:3215-3221`).
6. **The 48-tick stance gate, in full:** `§1t99s0§.as:103` (baseReload 48), `:3050`
   (`>= 48` to allow), `:3060` (`< 48`), `:3162` (`-= 48` cost).
7. **The Android lang table cannot serve the web build's UI.** `index/strings.json`
   maxes at id **9010**; web code calls `getString(11005/11006/11018)` and `getString(960)`.
   Any web UI-copy claim resting on that table has a hard hole — this is the concrete
   shape of the S0 build-parity caveat.
8. **Mastery caps at 10, from the string table itself:** ids 8131/8132/8133 =
   "Light/Balanced/Heavy Stance Mastery Level 10." And id 6005 states Heavy's
   "Defense -20%", i.e. the ×0.8 the ledger lists.
9. **⚠ Decoding warning for the next critic:** `94_` and `99_MCSCharacter_*AnimationData.bin`
   are **UTF-8 with BOM**, not UTF-16LE. Decoding them per the S0 note returns 0 `<anim>`
   hits and will produce a false refutation.

## What the ledger editor must NOT do with this packet

Six claims are TRUE but do not overturn the sentence they name — **IDX 1, 2, 14, 17, 18,
20.** Recording them as overturns would put four wrong things into REBUILD_READINESS.md:
that P0's no-playable-build verdict was reversed (it was not), that coins-per-kill is
solved (it is not), that the tournament economy numbers are read (they are not), and
that there is no stagger (there is — flinch d=8).
