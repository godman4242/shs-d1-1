# t1-overturns-01 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` — **24 claims, 24 judged, 0 skipped.**
Every verdict below rests on an artifact **I opened myself**. No claim was judged from another
agent's prose; `docs/gauntlet/L0/critics/*.md` and `docs/gauntlet/L0/sources/*.md` were not opened.

Result: **22 survive · 1 refuted · 1 survives-but-its-overturn-fails** — plus **5 claims whose
factual content is true but whose named ledger sentence does NOT fall.**

---

## 0. The load-bearing identification I re-derived first

Almost every combat-core claim in this packet reads the obfuscated web file
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as` as the desktop `MCSPlayer` and reads
`§1t4420s0§` as `baseSlashLength` and `§1t4421/4422/4423s0§` as light/balanced/heavy mastery.
**That identification is CONFIRMED, not assumed:**

- `§1t99s0§.as:183-199` — `public function §1t4443s0§(param1 … param15)` assigns
  `this.§1t4420s0§ = param10; this.slashUsage = param11; this.§1t4421s0§ = param12;
  this.§1t4422s0§ = param13; this.§1t4423s0§ = param14; this.level = param15;`
- `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1834` — the twin call:
  `player.initPlayer(0, …, getBaseSlashLength(), getSlashUsage(), getStat(1000), getStat(1001),
  getStat(1002), getLevel())`

Param-for-param match. So `§1t4420s0§` **is** baseSlashLength and the three mastery slots **are**
skill levels 1000/1001/1002. `reference/extracted/skilldata.xml` gives skills 1000/1001/1002 exactly
**10 `<level>` rows each** (regex count), so **mastery is an integer 1..10, and the ceiling is 10,
not 9.**

---

## 1. Verdicts

### ✅ NEW-3-full-xp-curve-is-shipped-in-both-builds — HELD, overturn UPHELD
citelint QUOTE_UNVERIFIED (the quote carries a `…` ellipsis). **My own parse:**
`§1t1523s0§.as:364` → `public static const §1t5923s0§:Array = [0,550,1450,2950,…]` —
**99 entries**, idx10 = **31400**, idx80 = **4285800**, idx98 = **29395800**.
`shs3_android/scripts/StatsManager.as:78 expArray` — I compared the two lists element by element:
`len(w)==len(a)==99` and `w == a` → **True**.
Overturns `REBUILD_READINESS.md:200` blocker ② *and* `:350` §6 "L11–80 XP curve". Both fall.

### ✅ NEW-4-paperdoll-is-13-slots-not-9 — HELD, overturn UPHELD
`shs3_android/scripts/StatsManager.as:262-286` — EQ_ARMOR 0 … EQ_WEAPON 9, **EQ_SCABBARD 10,
EQ_ACCESSORY1 11, EQ_ACCESSORY2 12**, verbatim. Corroborated: `XMLNpc.as:36`
`DEFAULT_EQSTRING = "4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0"` = **13 fields**;
`XMLNpc.as:705` `var equipment:Vector.<Item> = new Vector.<Item>(13);`.
`REBUILD_READINESS.md:82` and `:209` both say "9-slot paperdoll" — both wrong.

### ✅ NEW-6-shunpo-effect-recovered — HELD, overturn UPHELD
`docs/gauntlet/L0/index/resolved_names.json` → `skilldata.xml.resolved["1039"]` is character-for-
character the quoted text; `strings.json["6082"]="Shunpo"`, `["6085"]` = the desc.
`reference/extracted/skilldata.xml` skill 1039: `<displayname>6082</displayname>
<desc>6085</desc> <req><has><id>1000</id><qty>10</qty></has></req> <category>1</category>
<chi>50</chi> <cooldown>60</cooldown>` — so the ledger's own "Light **L10** ultimate" framing at
`:195` is correct and blocker ② (Shunpo's real effect unknown) falls.
Carries the S0-3 caveat honestly (Android string table for the COPY; the id/category/req are web).
**Not banked:** the side-detail "all three sit at the level-70 rung of the enemy skill ladder" — I
did not verify it and the claim does not need it.

### ✅ art-anim-audio-feel/NEW-24hz-killbeat-is-web-parity-closed — HELD, overturn UPHELD
citelint QUOTE_UNVERIFIED. **All four web lines are verbatim:**
`§1t1525s0§.as:1026 if(§1t9905s0§ == 24 * 5)` · `:1049 else if(§1t9905s0§ == 24 * 3)` ·
`:1225 §1t9905s0§ = 24 * 3 + 6;` · `:1230 §1t9905s0§ = 24 * 6;`
Android twin verbatim at `StageManager.as:903 / 926 / 1096 / 1101` with `redFreezeCounter`.
Line-for-line structural match confirmed. Combined with the SWF frameRate below (24.0, which I
parsed myself), 144 ticks = 6.000 s and the "15fps" sim-rate reading falls.

### ✅ art-anim-audio-feel/animdata-code-injected-hold-table — HELD, overturn UPHELD
`shs3_android/scripts/AnimData.as` — the whole switch is verbatim: 13 `*SLASH_POSE` +10 (:28-41),
10 `*FALLSLASH_END`/`*JUMPSLASH_LAND` +15 (:43-53), `sheathesword`/`sheathesword3` +24 (:55-57),
six death anims + `KNEEGROIN_VICTIM` +6 (:59-66), `ogre_nap1_mid` +48 (:104), `DEATHTOUCH_PARTA`
+50 (:113), the five +24 poses (:116-129), range +2 (`jutsu_blow_parta`, `spear_kick_partb`) to +50.
`MCSCharacter.as:1316 if(this.frameCounter < this.currentAnimationDuration)` and
`:1334 if(this.frameCounter < this.currentAnimation.frameList.length)` — both verbatim. The latch
mechanism is exactly as described.
**I reproduced the 487/487 measurement myself** over `reference/extracted/bindata/*.bin`:
`web bindata animdata rows: 487 · @d==len(<f>): 487 · mismatch: 0`.
Minor: `duration = xml.@d` is at **:15**, not inside the cited `:16-21`; "~35 named entries" is
really 30 switch branches / 58 case labels. Neither touches the finding.

### ✅ art-anim-audio-feel/music-is-13-stems-and-18-layer-presets — HELD, overturn UPHELD
`MusicManager.as:50-76` TRACK_BATTLECHANTS 0 … TRACK_LOSE 12, `TOTALTRACKS:int = 13` verbatim;
`:78-82` ACTION_NONE/FADEOUT/FADEIN; `:133-186` the whole presetsArray build, verbatim — I checked
each preset the claim names: TOUGHBATTLE = flutes+battledrums+battlechants (:138-140),
DUNGEONCREEPYDANGER = ambience+flute+percussion+piano (:166-169), DOJO = flutes+safeambience+
safekoto+safepercussion (:171-174), QUIET = flutes alone (:142).
`grep -c "public static var MUSIC_"` → **18**. The 13 TRACK_* names are exactly the 13 DefineSound
names I extracted from the decrypted 113 blob. Loop-lock verified: 882,144 ×6 and 504,288 ×4.

### ⚠️ art-anim-audio-feel/web-swf-header-is-24fps-and-800x690 — HELD on fact, **overturn NOT upheld**
My own header parse (RECT bit-reader then UI16 frameRate as 8.8 fixed) reproduces the quote exactly:
```
shs3_payload_decoded.swf         sig=CWS ver=17 stage=800.0 x 690.0 framerate=24.0 framecount=6
shs3_android_payload_decoded.swf sig=CWS ver=26 stage=800.0 x 480.0 framerate=24.0 framecount=6
```
The **24 fps half is decisive** and the ledger's "15fps" tick reading falls.
**The 800×690 half does NOT overturn the ledger's "native canvas is 800×480 (5:3)" (`:117`).**
The web build's own code sets the gameplay canvas to 800×480:
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104 public static var stageWidth:int = 800;`
`:106 public static var stageHeight:int = 480;` (plus `:120/:122` a second 800/480 pair).
690 is the SWF **document** rect — the 800×480 stage plus the ~210 px Kongregate chrome band —
which is what the claim's own text says ("the friend-bar layout size"). So the ledger bullet at
`:117` stands and, in fact, `:235` blocker ① ("read `stage.stageWidth` in a build") is now
**answered in the ledger's favour**. The lane_impact line "assuming a single 800x480 canvas is
wrong" over-reads its own evidence.

### ✅ audio/RECOVERED-not-encrypted-resourcemanager-decrypt — HELD, overturn UPHELD — **AND IT OVERTURNS §0 LAW S0-5**
`ResourceManager.as:200-216` `decryptByteArray` is verbatim (XOR bytes 3..255 with `key`, and swap
`ba[i]`↔`ba[i+256]` whenever `i % 11 == 0`); `:186 ba = decryptByteArray(ba,
resourceFileNameArray[num].charCodeAt(1))`; `:41 resourceFileNameArray:Array =
["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"]`
→ keys h=104, u=117, o=111, m=109, g=103, exactly as claimed.
**I ran the transform on all five blobs myself.** All five inflate:
```
115_Mobile_SHS3Resource  k=104 CWS v17 INFLATES 1040849
113_Mobile_MusicResource k=117 CWS v17 INFLATES 1402677
122_Mobile_SoundResource k=111 CWS v17 INFLATES   29623
124_Mobile_ImageResource k=109 CWS v17 INFLATES 1908229
120_Mobile_BGResource    k=103 CWS v17 INFLATES 4412340
```
Plain whole-file XOR (no i%11 swap) fails to inflate on both audio blobs — the swap is the missing
step, exactly as claimed. My DefineSound extraction returns the claimed 13 + 13 names in order.
**Standing invariant, said out loud: the byte-check beats the doc.** §0's S0-5 ("audio is HELD but
ENCRYPTED … You may NOT claim audio is recovered") is **FALSE as stated.** Its premise (ffdec cannot
open the nested CWS) is true and irrelevant — the repo's own decoder opens them.
Ledger `:240` blocker ① and `:348` §6 "exact waveforms/envelopes are not [study-able]" both fall.
**Caveat that must ride with it:** ANDROID v0.682 only — see New Finding NF-2.

### ✅ bindata/NEW-audio-waveforms-are-recovered-not-encrypted — HELD, overturn UPHELD
citelint QUOTE_UNVERIFIED. **Every number in the quote reproduced on my own run:**
```
113_Mobile_MusicResource k=117 ver 17 declen 1402685 actual 1340647 INFLATES -> 1402677
122_Mobile_SoundResource k=111 ver 17 declen   29631 actual   23928 INFLATES ->   29623
122 DefineSound = 13: deflect die2 sumo slash3 die3 refund die1 slash2 slash1 goodkoto hitmetal fart punch
ffprobe slash1.mp3     -> format_name=mp3 duration=0.572000 bit_rate=16000
ffprobe battledrums.mp3-> format_name=mp3 duration=79.872000 bit_rate=16000
```
Key-from-file check also reproduces: `raw[3] ^ 0x11` = **117** and **111**. All 26 tags are
MP3 / 11025 Hz / 16-bit / mono.

### ✅ bindata/NEW-music-is-layered-stems-not-tracks — HELD, overturn UPHELD
citelint QUOTE_UNVERIFIED. My own DefineSound parse of the decoded 113 blob:
six stems at **exactly 882,144** samples (battlechants, battledrums, flutes, safeambience, safekoto,
safepercussion), four at **exactly 504,288** (dungeonambience, dungeonflute, dungeonpercussion,
dungeonpiano), plus bgm_lose 38,880 / bgm_levelup 328,320 / bgm_gangnam 40,032. Identical to the
quote. `MusicManager.as` TRACK_* indices select exactly these.
Two cosmetic slips, neither material: "882,144 / 11,025 = 79.872 s" is arithmetically 80.013 s
(79.872 is the ffprobe MP3 duration); `bytes=159746` is the MP3 payload, i.e. the 159,753-byte tag
minus its 7-byte DefineSound header. Cite `MusicManager.as:48+` should be `:50+`.

### ⚠️ combat-core/reach-and-crit-configs-already-correct — HELD on fact, **overturn NOT upheld**
Source verbatim at `§1t99s0§.as:3094` (`* 1.4`), `:3105` (`* (1 + 0.2 * this.§1t4422s0§ * 0.1)`),
`:3116-3119` (`* (0.5 + 0.4 * this.§1t4423s0§ * 0.1)` + `if(… < 100) { … = 100; }`),
`:3274` (`return _loc2_ * 1.3 + this.§1t1243s0§;`).
Live config verbatim: `src/config/reach.ts:47 lightMult: 1.4`, `:49 balancedPerMastery: 0.02`,
`:51 heavyBase: 0.5`, `:53 heavyPerMastery: 0.04`, `:55 heavyFloor: 100`; `src/config/combat.ts:17
export const CRIT_MULT = 1.3;`. **The do-not-touch ruling is correct.**
**But the `ledger_text` it names is not a ledger sentence.**
`grep -c "three live constants" docs/research/REBUILD_READINESS.md` → **0**. That string is another
agent's prose. Nothing in `REBUILD_READINESS.md` falls, so `overturns_ledger` cannot be honoured.
Bonus, and I verified it: the lane_impact's live-bug call is **right** —
`src/config/stances.ts:61 heavy: 5` contradicts BOTH builds
(`§1t99s0§.as:3239 this.§1t4425s0§ = this.§1t4423s0§ >= 3;` and
`shs3_android/scripts/MCSPlayer.as:3182 this.canLaunch = this.heavyMastery >= 3;`). Balanced is
`>= 5` in both (`:3233` / `:3176`), light `>= 3` (`:3223` / `:3166`). See NF-4.

### ✅ combat-core/reach-table-is-mastery-zero — HELD, overturn UPHELD (reach half)
citelint QUOTE_UNVERIFIED — the quote is an annotated paraphrase, but the code at `:3094/:3105/:3116`
is exactly as summarised, and the mastery-variable identification is pinned by `:183-199` (above).
At mastery 0 the reach multipliers are **1.4 : 1.0 : 0.5 = 2.8 : 2 : 1**, which is the ledger's
300/200/100. At mastery 10 they are **1.4 : 1.2 : 0.9** (ratio 1.56 : 1.33 : 1), nothing like 3:2:1.
`REBUILD_READINESS.md:155` sweeps damage and reach into one "MASTERY-9 CEILING" claim; the **reach
half is mastery-ZERO** and falls. The claim is careful to leave the damage half standing — correct.

### ✅ combat-core/reach-table-is-mastery-zero-not-a-ceiling — HELD, overturn UPHELD
`§1t1523s0§.as:2344-2348` matches the quote **character for character**:
`internal static function §1t9593s0§(param1:int) : int { var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§)
* 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1))); }`
Android confirm verbatim at `shs3_android/scripts/StatsManager.as:1915-1919` (`getBaseSlashLengthVal`).
Arithmetic checks: Dan 0 → asymptote 120 + 90 = **210**; ×1.4/×1.0/×0.5 = **294 / 210 / 105**.

### ⚠️ combat-core/reach-ts-was-right — HELD on fact, **overturn NOT upheld**
Source and config verified as above (`:3094/:3105/:3116-3120` vs `reach.ts:47/49/53`). The claim's
own text is entirely about `src/config/reach.ts`. The `ledger_text` it names (`:100-101`) is about
`STANCE_TABLE` — a different module that still exists (`src/config/stances.ts:34`) and whose
"never wired into `resolveSlash`" and "Heavy should be 100, not 120" clauses this finding does not
touch. The mastery-9 clause of that sentence is separately overturned by the reach-mastery-zero
cluster, not by this claim.

### ✅ combat-core/slash-distance-is-player-visible — HELD (PARTIAL is the right verdict), overturn UPHELD
`shs3_android_payload/scripts/InventoryUI.as:2232` is verbatim:
`str += "slash distance: " + FONTCOLOR1 + int(baseSlashLength * slashModifier).toString() +
FONTEND + " (" + stanceName + ")<br>";`
`reference/extracted/ui_strings.txt:361` (471-line file, so the line is in range) is verbatim and is
the **only** "slash distance" line in the file:
`n="center">wind def: 2earth def: 3slash distance: 345 (heavy)<p align="c`
`docs/GAUNTLET.md:156` establishes `ui_strings.txt` as the **web** SWF's static UI fields, so
"the web payload's own authored copy" is correct.
The 345 anomaly is real and correctly flagged as open, not measured: `SOURCE_CONSTANTS.md` pins
`dan = rebirth rank 0..9`, so base ≤ 120 + (90+45) = **255**, and Heavy's ceiling multiplier is 0.9
→ **≤ 229.5**. 345 is unreachable under the v0.717 formula. The clause of blocker ① that falls is
"wiki gives *units* of unknown scale" — the game prints the number itself, from a formula in payload
code. The cap itself is closed by the sibling reach claims, not by this one.

### ✅ combat-core/stance-damage-mastery10-ceiling — HELD, overturn UPHELD
`§1t99s0§.as:3255-3276` verbatim — `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1)` (LIGHT,
:3262), `* (1 + 0.2 * this.§1t4422s0§ * 0.1)` (BALANCED, :3265), `* 1.4` for the three-case fallthrough
HEAVY/DUAL/REVERSED (:3267-3270). skilldata 1000/1001/1002 = **10 `<level>` rows each** (my count),
so the ceiling is **mastery 10, exact**: 0.9 / 1.2 / 1.4. The ledger's "mastery-9" is off by one
(m=9 gives 0.86 / 1.18 / 1.4 — a rounding, not an identity). Heavy's damage carries **no** mastery
term — a real design fact the board lacks.

### ⚠️ combat-core/stance-modifier-table-in-payload — HELD on fact, **overturn NOT upheld**, and it carries a live hazard
`shs3_android/scripts/InventoryUI.as:1940-1970` is verbatim, including `defModifier = 0.8` for
Heavy (:1965) and `slashModifier` per stance; `:2232` consumes it. Cite resolves perfectly.
**But the ledger sentence it names is PROGRESSION blocker ① — "DEF mitigation curve + SPD
range/cooldown scaling".** A per-*stance* defence multiplier is not the DEF-**stat** mitigation
curve, and a per-stance slash multiplier is not the SPD→range/cooldown function (that lives in
`getBaseSlashLengthVal`, which is outside the cited range). Nothing in that sentence falls.
**Live hazard, flagged loudly:** the android `critModifier` column (**1.2 / 1.5 / 1.5**) is
CONTRADICTED by the web build, where the character sheet sets crit **1.3 for all three stances**
(`§1t5957s0§.as:2727 / :2736 / :2745`) and `getDamage` applies a flat `* 1.3` with no stance branch
(`§1t99s0§.as:3274`). Android also uses `dmgModifier 1.5` for Heavy vs web `1.4`. Porting this table
would ship v0.682 tuning into a v0.717 target. The claim's own ⚠ says so — I am upgrading it.

### ✅ combat-core/stance-reach-is-mastery-zero-base — HELD, overturn UPHELD
citelint QUOTE_UNVERIFIED (the `// Light — NO mastery variable` half is annotation). The code half
is verbatim at `:3094` and **the structural argument is decisive**: a bare literal `* 1.4` with no
mastery operand cannot be a mastery-9 ceiling. Android twin verbatim at `MCSPlayer.as:3030`
(`* 1.5`, also bare). Base asymptote 210 at Dan 0 confirmed at `StatsManager.as:1915-1919`.
One factual slip, minor: "Heavy also lands on the shipped floor exactly (210 × 0.5 = 105, clamped to
100)" — **105 is above the 100 floor, so nothing is clamped there.** The floor bites at realistic
speeds (SPD 1 → base 124 → heavy 62 → 100), not at the asymptote. Structural argument unaffected.

### ✅ combat-core/stance-reach-modifiers — HELD, overturn UPHELD
Both sides verbatim. WEB `§1t99s0§.as:3094 / :3105 / :3116-3119`, plus REVERSED `* 1.4` at **:3131**
and DUAL `= this.§1t4420s0§` floored at 100 at **:3142-3146**. ANDROID `MCSPlayer.as:3030 * 1.5`,
`:3041 * (1 + 0.5 * this.balancedMastery * 0.01)`, `:3052-3055 * (0.5 + 0.5 * this.heavyMastery *
0.01)` + `if(this.slashLength < 100) { this.slashLength = 100; }`. **Differently tuned — confirmed.**
Combined with `§1t1523s0§.as:2344-2348` the reach cap is fully closed in stage px, so
`REBUILD_READINESS.md:190` blocker ① falls. Arithmetic spot-check: Dan-1 asymptote
(120+95) × 1.4 = **301 ≈ 300** ✓; Heavy's hard floor is literally 100 ✓.
Off-by-one in the cite: the Light assignment is at **:3094**, not `:3093` (`:3093` is the `case`
label). The stance-token mapping (12220 = LIGHT … 12222 = HEAVY, 12224 = REVERSED, 12223 = DUAL) is
independently pinned by the android twin's identical `setStanceColor(1/2/3)` and `IDLE_*` calls.

### ✅ combat-core/v0717-crit-is-flat-1.3 — HELD, overturn UPHELD
`§1t99s0§.as:3272-3276` verbatim: `if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 +
this.§1t1243s0§; } return _loc2_;` — **no stance branch.** Corroborated in the web character sheet
(`§1t5957s0§.as:2727 / :2736 / :2745` all `= 1.3`). The v0.682 split is real and confined to android:
`MCSPlayer.as:3215-3222` returns `maxDamage * 1.2 + STAT_CRITICALDMG` for non-Light and `* 1.5` for
Light. Ledger `:190` blocker ② ("crit 1.3 vs 3") resolves to **1.3**, in the ledger's own favour.
lane_impact check: `SOURCE_CONSTANTS.md:158` really does record `body-part crit | **1.3**, parts 12
neck / 16 head / 17 hat | a *second*, stacking 1.3` ✓.

### ⚠️ combat-core/v0717-stance-curves-are-already-in-config — HELD on fact, **overturn NOT upheld**
Reach at `:3094/:3105/:3116-3119`, damage at `:3262/:3265/:3270`, and the build stamp is real:
`§1t1523s0§.as:36 public static var §1t9323s0§:Number = 0.717;` (android twin
`StatsManager.as:30 clientVersion:Number = 0.682`). The do-not-touch ruling on `reach.ts` is correct.
Same defect as `reach-ts-was-right`: the named ledger sentence (`:100-101`) is about `STANCE_TABLE`,
not `reach.ts`, and this finding does not make it fall.

### ❌ combat-core/v0717-stance-multipliers — **REFUTED (material)**
The constants it quotes are right and I verified every one (`:3094`, `:3105`, `:3116-3117`, `:3131`,
`:3142`; skilldata caps mastery at 10; `StatsManager.as:1834` pins the mastery params). But **the
conclusion the claim actually states is wrong**:

> "with mastery capped at 10 their ceilings are Light 1.4 / Balanced 1.2 / Heavy 0.9, **which
> vindicates the ledger's 0.9/1.2/1.4 line as REACH-at-mastery-ceiling**."

`REBUILD_READINESS.md:155` reads *"The stance tables (**dmg** 0.9/1.2/1.4, **reach** 300/200/100)"* —
0.9/1.2/1.4 is explicitly the **damage** row, in Light→Balanced→Heavy order. Re-reading it as the
reach row requires silently **reversing** the stance order the ledger itself uses. And the reach
ceilings do **not** reproduce 300/200/100: their ratio is 1.56 : 1.33 : 1, whereas the mastery-ZERO
multipliers 1.4 : 1.0 : 0.5 = **2.8 : 2 : 1** land on it. Banking this sentence would re-install the
exact error that five sibling claims in this same packet correct.
Nothing is lost by refuting it: the constants, the five-stance list and the "mastery is 1..10, not
0-100" point all survive in `combat-core/stance-reach-modifiers`, `…/v0717-stance-slash-multipliers`
and `…/stance-damage-mastery10-ceiling`.

### ✅ combat-core/v0717-stance-slash-multipliers — HELD, overturn UPHELD
Quote verbatim at `:3093-3119`. **The identification the cite offers is real and I checked it:**
`§1t1523s0§.as:2270` calls `player.§1t4446s0§(…)` with four element-defence arguments — the twin of
`shs3_android_payload/scripts/StatsManager.as:1836 player.initElementDefenseStats(…)` — and
`§1t99s0§.as:183-199` is the `initPlayer` twin with matching param order. So `§1t99s0§` **is** the
desktop MCSPlayer. Strong cite.
One lane_impact error to flag (not in the claim's text, so it does not sink the claim):
"the surveyor's grep terms ('0.005', '0.5 + 0.5 *') exist in neither build" is **half false** —
`0.005` as a literal exists in neither, but `0.5 + 0.5 *` is all over the android build
(`MCSPlayer.as:3052`, `:3205`; `InventoryUI.as:1945`, `:1966`).

### ✅ combat-core/v0717-stance-table — HELD, overturn UPHELD (reach half)
`§1t5957s0§.as:2726-2729 / 2735-2738 / 2744-2747` is verbatim, and it is the richest single row in
the packet — damage `_loc41_`, crit `_loc42_ = 1.3`, defence `_loc47_` (Heavy **0.8**) and slash
`_loc48_` for all three stances in one block, with the mastery read at `:2725/:2734/:2743` as
`§1t9714s0§(1000/1001/1002)`. Every number in the claim's text checks out.
Two flags: (a) the claim's `lane_impact` says the finding **"CONFIRMS the ledger's mastery-9 reading
rather than overturning it"** while `overturns_ledger = true` — internally contradictory; what
actually falls is the **reach** half of `:155`, not the damage half. (b) the damage ceiling is exact
at **mastery 10**, not 9, because skilldata caps 1000/1001/1002 at 10 levels.

---

## 2. Pattern across the packet

1. **The cite quality in this packet is unusually high.** Of the 6 QUOTE_UNVERIFIED flags, **all 6
   were false alarms** — ellipses (`…`), annotation comments appended to real code, or numbers from
   a tool run rather than a file. Every one located.
2. **The recurring defect is not the evidence, it is the ledger sentence the finding is pointed at.**
   Five claims (`reach-and-crit-configs-already-correct`, `reach-ts-was-right`,
   `v0717-stance-curves-are-already-in-config`, `stance-modifier-table-in-payload`,
   `web-swf-header-is-24fps-and-800x690`) are factually true but name a ledger sentence that does
   not fall — one of them names a sentence that **is not in the ledger at all**.
3. **`REBUILD_READINESS.md:155` needs splitting, not deleting.** dmg 0.9/1.2/1.4 = mastery-**10**
   ceiling (exact). reach 300/200/100 = mastery-**ZERO** base. One sentence, two different rows of
   the same curve.

---

## 3. New findings I turned up while judging (nobody has claimed these)

- **NF-1 · The web build's own gameplay canvas IS 800×480 — the ledger bullet stands.**
  `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104 public static var stageWidth:int =
  800;` and `:106 public static var stageHeight:int = 480;` (a second pair at `:120/:122`).
  So the 800×690 SWF document rect is chrome, not canvas. This **blocks** a rewrite of
  `REBUILD_READINESS.md:117`, and separately **answers** ui-hud blocker ① at `:235`
  ("read `stage.stageWidth` in a build") in the ledger's favour.

- **NF-2 · The recovered audio is ANDROID-ONLY; web v0.717 audio is STILL_UNHELD.**
  My own tag walk of `reference/decrypted/shs3_payload_decoded.swf`: **DefineSound (tag 14) = 0**,
  DefineBinaryData (tag 87) = 27 (matching §0's S0-1 count of 27 web bindata files). A filesystem
  sweep finds no web-side `*SoundResource*` / `*MusicResource*` container anywhere under
  `reference/`. The 26 byte-exact waveforms are v0.682's. S0-5 falls, but only for Android.

- **NF-3 · The obfuscated web payload can be symbol-mapped against the Android build by
  call-signature.** `§1t99s0§.as:183-199` vs `shs3_android_payload/scripts/StatsManager.as:1834`
  pins `§1t4420s0§ = baseSlashLength`, `§1t4421/4422/4423s0§ = getStat(1000/1001/1002)`. This is the
  general method that lets the WEB build check every Android-derived constant, and it is what makes
  the whole combat-core cluster admissible rather than inferred.

- **NF-4 · LIVE CONFIG BUG: `src/config/stances.ts:61 heavy: 5` is wrong; both builds say 3.**
  `§1t99s0§.as:3239 this.§1t4425s0§ = this.§1t4423s0§ >= 3;` (heavy canLaunch) and
  `shs3_android/scripts/MCSPlayer.as:3182 this.canLaunch = this.heavyMastery >= 3;`. Balanced is
  `>= 5` in both (`:3233` / `:3176`) and light `>= 3` (`:3223` / `:3166`) — so only the heavy row is
  wrong, and `LAUNCH_UNLOCK_LEVEL` can be promoted INFERRED → CONTRACT-SRC in the same edit.
  No packet claim's `text` asserts this; it appears only inside one lane_impact, so it is un-banked.

- **NF-5 · The v0.717 crit is flat 1.3 for every stance — do not port the android crit column.**
  `§1t5957s0§.as:2727 / :2736 / :2745` all set `_loc42_ = 1.3`, and `§1t99s0§.as:3274` applies
  `_loc2_ * 1.3 + <flat crit-dmg stat>` with no stance branch, against android
  `MCSPlayer.as:3215-3222` (`* 1.5` Light / `* 1.2` others) and `InventoryUI.as:1946/1955/1964`
  (`critModifier` 1.2 / 1.5 / 1.5). Any table sourced from android `InventoryUI` carries this.

- **NF-6 · Level cap 80 vs a 99-entry XP array — the tail is dead data.**
  `§1t1523s0§.as:362 public static const §1t9470s0§:int = 80;` and android
  `StatsManager.as:76 public static var levelCap:int = 80;`, but the expArray runs to **index 98**
  (29,395,800). Indices 81..98 are shipped-but-unreachable. A rebuild should paste the table and
  cap at 80 rather than treating 98 as the cap.
