# CRITIC — LENS 1 (CITE LENS) — packet `src-bindata.claims.json`

Packet size **36**. Judged **36**. Refuted **8**. Survived **28**.
Every verdict below rests on an artifact **I opened myself**; nothing is taken from the
surveyor's prose (`docs/gauntlet/L0/sources/bindata.md` was NOT read).

Machine-audit split in the packet: RESOLVES 22 · QUOTE_UNVERIFIED 11 · UNCHECKABLE 3.
**All 11 QUOTE_UNVERIFIED quotes were located by hand.** The lint failures were artefacts of
(a) CRLF line endings inside `.bin` files that are really XML text, and (b) quotes assembled
from several files. None of the 11 was a fabricated cite.

---

## 0. Environment facts I established first (so every line cite below is checkable)

- All 27 `reference/extracted/bindata/*.bin` are **text**, not binary: 20 are `XML 1.0 document
  text, UTF-8 (with BOM), CRLF`, 6 are `ASCII text, CRLF`, and `92_1t4648s0.bin` is
  `GIF image data, version 89a, 63 x 72`. So `LINE_ON_BINARY` lint notes are false alarms —
  line numbers on these files are meaningful. Verified with `file` + `wc -l`.
- The five plain-text name tables have **no trailing newline**, so `wc -l` under-reports by one.
  Real line counts: `94`=398 · `95`=33 · `96`=36 · `97`=291 · `98`=677.
- **`reference/extracted/android/125_Mobile_NpcData.bin` is ASCII/UTF-8, NOT UTF-16LE.** I fell
  into the reverse of the §0 trap: decoding it as UTF-16LE returns **0** `<id>` tags. Decoded as
  UTF-8 it returns **1,273**. Recorded here so the next agent does not mis-refute on it.
- **NEW — the WEB payload is decompiled and on disk.** `reference/decompiled/shs3_payload/scripts/`
  holds **1,079 `.as` files** with obfuscated identifiers (`§1t58s0§.as` etc.). This is the
  v0.717 build. It means the packet's many `shs3_android_payload` (v0.682) cites are
  **parity-checkable**, and I used it below. This is the single most useful thing I found.

---

## VERDICTS

### [0] `bindata/487-anims-held-4-ported` — **SURVIVES**
Reproduced every number: over the 19 animdata blobs `100`–`118`, `<anim `=**487**, `<f `=**5,596**,
`<n `=**81,706**; file `108_1t4635s0.bin` alone = **158 / 1,638 / 24,502**. (`119` contributes 0,
so the 19-file scope is right even though the glob `1[0-1][0-9]_*` touches 20 files.)
Ran the gate myself: `npx vitest run tests/a11AnimData.test.ts` →
`Test Files  1 passed (1)` / `Tests  12 passed (12)` — verbatim match.
`src/config/ogAnims.ts:39` is character-for-character the quoted line (4 names → 4/487 = 0.82%).
`src/config/poses.ts` exports exactly six poses. The lane_impact counter-weight is also true:
`grep -rohE '1[0-1][0-9]_1t46[0-9]{2}s0' src/ scripts/ tests/` returns **only** `108_1t4635s0` (6 hits).
**own_cite:** counts over `reference/extracted/bindata/1[0-1][0-9]_*.bin` + `tests/a11AnimData.test.ts` run + `src/config/ogAnims.ts:39`

### [1] `bindata/51-skill-animations` — **SURVIVES**
All **12** line cites in `102_1t4629s0.bin` are exact (938 fireball d=12 · 2038 deathtouch_partb d=12 ·
4242 shunpo_start d=4 · 4328 shunpo_end d=1 · 4351 enchantweapon d=8 · 4521 buffarmor_start d=8 ·
4840 warcry_start d=4 · 5978 focus_start d=8 · 6148 focus_end d=13 · 6333 cleave_start d=9 ·
9204 chicharge_start d=14 · 9556 chicharge_fly d=5). `grep -c '<anim '` = **51**.
Parity note: `102` is **not** byte-identical to `android/93_MCSCharacter_SkillsAnimationData.bin`
(md5 `50ca7c49…` vs `47d17351…`), but the **anim set and every `d=` are identical** in both — the
delta is node data only. The claim's Android-class-name attribution stands.
**own_cite:** `reference/extracted/bindata/102_1t4629s0.bin:938,2038,4242,4328,4351,4521,4840,5978,6148,6333,9204,9556`

### [2] `bindata/RETRACTION-animation-rate-is-24hz` — **SURVIVES (with one struck corroborator)**
I parsed the SWF header myself: `reference/decrypted/shs3_payload_decoded.swf` = `CWS` v17,
stage rect twips `[0,16000,0,13800]` = **800×690**, **framerate = 24.0**. The headline holds on
the WEB artifact, independent of Android.
`93_1t4647s0.bin:36` and `:451` quoted verbatim — exact.
`GameEngine.as:442 stageMC.addEventListener(Event.ENTER_FRAME,gameloop);` — exact.
`Mobile.as:117 GameEngine.getStageMC().frameRate = 24;` — exact.
**STRUCK:** "every authored duty cycle is a multiple of 24" is **false**. Decoding every auto-trap
`<property>` in `93` against its own schema (lines 6–18) gives duty values
`{0:96, 16:3, 24:18, 30:4, 32:3, 36:9, 48:23, 60:16, 64:1, 72:4, 96:16, 1000:2}` — **38 values are
not multiples of 24**, including 60 (×16) and 30 (×4). Ledger text must drop the clause.
**own_cite:** SWF header parse of `reference/decrypted/shs3_payload_decoded.swf` (framerate 24.0)

### [3] `bindata/RETRACTION-gif92-is-the-world-map` — **SURVIVES**
I wrote my own GIF LZW decoder rather than trust the write-up. `92_1t4648s0.bin`: `GIF89a`, 63×72,
272 bytes, GCT `[(0,0,0),(255,255,255),(102,102,102),(153,153,153)]`, **735 of 4,536** cells set,
row 51 = `.............###########################.##....................` — **string-identical** to
the claim. Cell (21,51) = index **1** = land. md5 `13068dfa1a5cc5628720a25782f93fed` matches
`reference/extracted/android/110_Mobile_MapBitmapData.bin` byte for byte.
I rendered all 72 rows: Hokkaido (rows 1–19, upper right), Honshu on the diagonal, Shikoku and
Kyushu bottom-left. It is unmistakably Japan.
**own_cite:** `reference/extracted/bindata/92_1t4648s0.bin` (own LZW decode, 735/4536, row 51)

### [4] `bindata/anim-duration-holds` — **SURVIVES**
Every one of the seven quoted cases is exact inside `AnimData.as:24-141`: `light_afterslashpose`
+10 (:25-26), `LIGHTJUMPSLASH_LAND` +15 (:48,53), `sheathesword`/`sheathesword3` +24 (:55-57),
`death` group +6 (:59-66), `DEATHTOUCH_PARTA` +50 (:113-114), `GUARDIAN_STOMPFREEZE` +24 (:125-126),
`ogre_nap1_mid` +48 (:104-105).
**Parity closed:** the WEB build's AnimData is `reference/decompiled/shs3_payload/scripts/§1t783s0§.as`
and carries the *same* value sequence (`10,15,24,6,24,10,4,8,10,12,6,6,2,20,2,6,48,6,6,50,24,24,24,24,24,6,12,6,12`)
— it folds the standalone `light_afterslashpose` case into the 13-case `+10` group and adds one
extra `+12` case at :145. Values are v0.717-safe.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/AnimData.as:24-141`

### [5] `bindata/aspect-frame-beats-swf-header` — **SURVIVES**
Opened `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080) and ran the claim's own
metric: content x = **52..1867** = **1816 px**, y = 0..1079, aspect **1.6815**. Exact reproduction.
I also viewed the frame downscaled to 960×540 to confirm the bands are hard black **pillars**
running the full height with no top/bottom letterbox — they are (HUD, stone-wall backdrop and
fighters all sit inside the 1816-px canvas).
I re-parsed the SWF header myself: 800×690, so the stated contradiction is real as written.
**NEW — the contradiction is resolvable, and the claim did not know it:**
`GameEngine.as:269-271` reads
`var originalWidth:int = 800; var originalHeight:int = 480; var originalHeightWithBar:int = 690;`
— 690 is the stage **with the bar**; 480 is the gameplay canvas. The frame and the header do not
actually disagree. Not a refutation (the claim's cites are all correct) but the ledger text should
carry the reconciliation instead of an unexplained conflict.
**own_cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (full-frame column scan + visual)

### [6] `bindata/audio-not-in-this-source` — **SURVIVES (honest STILL_UNHELD)**
`file reference/extracted/bindata/*.bin` over all 27 returns only XML text, ASCII text and one GIF.
No sound blob. The positive half of the claim is true and the refusal to claim on the encrypted
CWS audio is correct under S0-5.
**own_cite:** `file` over all 27 `reference/extracted/bindata/*.bin`

### [7] `bindata/boss-telegraph-triads` — **SURVIVES**
Every line exact: `100:901 ogre_swingdown d=16` · `100:1223 ogre_swingdownhit d=5` ·
`100:1325 ogre_swingdownend d=11` · `111:892 guardian_swingdown d=14` · `111:1174 guardian_swingdownhit d=7` ·
`111:1316 guardian_swingdownend d=11` · `103:2646 flinch_weapon d=8` · `103:2798 flinch d=8`.
`ogre_death d="54"` and `guardian_death d="54"` both confirmed.
**own_cite:** `reference/extracted/bindata/100_1t4627s0.bin:901,1223,1325` + `111_1t4638s0.bin:892,1174,1316`

### [8] `bindata/clan-band-tail-holds-seasonal-event-enemies` — **SURVIVES** (quote located)
`docs/gauntlet/L0/index/resolved_names.json` → `npcdata.xml.resolved`:
`453 Santa · 454 Blacksmith · 455 Nian Monster · 456 Bear`, versus `353,354,355,356` all
`Heavy Soldier`. Exact.
`119_1t4646s0.bin` — `:440 <id>448|453</id>` · `:466 <id>449|454|449|454|443</id>` ·
`:492 <id>450|455|450|455|443</id>` · `:518 <id>451|456|451|456|443</id>`. Exact.
Minor slip, not fatal: the remap line is `WarHexUI.as:1735 remainder = tempid % 100;`, not `:1732`
(`:1732` is `tempid = int(strArray[k]);`). It sits inside the claim's own cited range 1732-1750.
**own_cite:** `docs/gauntlet/L0/index/resolved_names.json` (npcdata resolved 353-356 vs 453-456) + `reference/extracted/bindata/119_1t4646s0.bin:440,466,492,518`

### [9] `bindata/element-enum-order-and-archetypes` — **SURVIVES**
`93_1t4647s0.bin:274` is the authored comment `<!-- 4x fire element trap -->`; `:276/:284/:292/:300`
are four `Trap_ElementAuto` objects with `elementType` **0/1/2/3** in that order — exact.
`Trap_ElementAuto.as:69-95` is quoted verbatim: 0→`PROJ_FIREBREATH`, 1→`PROJ_WINDKICK`,
2→`PROJ_WATERSPLASH` (`yChange = 0`), 3→`PROJ_GROUNDPUNCH` (`yChange = 0`); default `yChange = -55`,
`xChange = 20`, `createProjectile(...,20,1,null)` speed 20. All exact.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/Trap_ElementAuto.as:69-95`

### [10] `bindata/engine-ticks-24fps` — **REFUTED (material)**
The mechanical half is fine and I confirmed it: SWF framerate 24.0 (own parse);
`GameEngine.as:442` exact; `MCSCharacter.as:1315-1318`
`++this.frameCounter; if(this.frameCounter < this.currentAnimationDuration) { this.updateFrame(); }`
exact — one keyframe per tick.
Refuted on **two** counts:
1. Same struck corroborator as [2] — "every trap duty cycle in `93` is a multiple of 24" is
   measurably false (38 counter-examples: 60, 30, 36, 16, 32, 64, 1000).
2. **"the ledger's '15fps pose latch' is a video-sampling artifact"** carries **no artifact cite at
   all** — no frame, no test, no payload row. It is an inference used to delete a video-derived
   ledger number, and this claim is flagged `overturns_ledger: true`. Under §0 that half is
   STILL_UNHELD, and under the standing invariant you do not overturn a frame measurement from a
   code reading without opening a frame.
**What should re-enter the ledger:** "engine loop is ENTER_FRAME at a declared 24 fps and advances
one authored keyframe per tick, so every animdata `d=` is in 24ths of a second" — nothing more.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:1309-1318` + own duty-cycle decode of `reference/extracted/bindata/93_1t4647s0.bin`

### [11] `bindata/five-stances-not-three` — **REFUTED (material)**
Line cites are exact: `110_1t4637s0.bin:3 <anim i="dual_stance" d="1">` and
`104_1t4631s0.bin:3 <anim i="reversed_stance" d="1">`. `src/config/stances.ts:7` really does model
only `'light' | 'balanced' | 'heavy'`. Android class names are **byte-confirmed**:
md5(`110`) == md5(`android/101_MCSCharacter_DualStanceAnimationData.bin`) and
md5(`104`) == md5(`android/95_MCSCharacter_ReversedStanceAnimationData.bin`).
**But "each with the same 21-animation kit" is false.** Enumerating every `<anim>`:
light `118`=21 · balanced `106`=21 · heavy `116`=21 · dual `110`=21 · **reversed `104`=13**.
Reversed ships `reversed_slash_part[a-d]` only — it has **no downslash and no upslash family**.
Small off-by-one too: the `DUALSLASH_POSE`…`REVERSEDSLASH_POSE` cases are `AnimData.as:37-40`, not `:38-41`.
**What survives:** five stance movesets exist and the ledger models three. **What must be struck:**
"the same 21-animation kit" → "21 clips for light/balanced/heavy/dual, 13 for reversed".
**own_cite:** `reference/extracted/bindata/104_1t4631s0.bin` (13 `<anim>`, no down/up-slash family) vs `110_1t4637s0.bin` (21)

### [12] `bindata/launcher-downed-ground-finisher-verbset` — **SURVIVES**
`108:5846 launchopponent d=14` · `108:6142 downstab d=15` · `108:24174 forwardroll_start d=6` — exact.
I re-measured **every** trailing duration and all 15 match: gotlaunchedupwards_parta/b/c 4/9/7 ·
gotlauncheddowned 18 · gotlauncheddownedend 1 · downed 23 · downedup 4 · downedup2 25 ·
flipupfromdowned 21 · downstab_up 10 · deathdowned 7 · forwardroll_end 14 · backstep 16 ·
forwardstep 16 · brake 9. `AnimData.as:68-72` really does hold `gotlauncheddownedend +24` and
`downstab_up +10`, so these are engine states, not orphan art.
**own_cite:** `reference/extracted/bindata/108_1t4635s0.bin:5846,6142,24174` + `AnimData.as:68-72`

### [13] `bindata/map-bitmap-vs-territory-scale-unreconciled` — **SURVIVES (honest STILL_UNHELD)**
`NameGenerator.as:147 var namex:int = territoryx % 137;` exact. Hardcoded towns at `:137-144`
exact. I redid the arithmetic: `1405272 >>12 &0xFFF = 343`, `&0xFFF = 344`; `1524045 → (372, 333)`.
Both outside 63×72 — the tension is real and the refusal to resolve it is correct.
Loose but not refutable: "both land near territory (57,57)" — `343/6, 344/6 ≈ (57.2, 57.3)` yes,
but `372/6, 333/6 = (62.0, 55.5)`, which is 5 off in x.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:135-148`

### [14] `bindata/missing-boss-npcs-700-710` — **REFUTED (minor — superseded inside its own packet)**
Every data check is correct and I reproduced all of them: `119:18 <id>700</id>`;
`reference/extracted/npcdata.xml` = 495 `<npc>`, npc ids **0–819**, none in 700–710;
`android/125_Mobile_NpcData.bin` = **1,273** `<id>` tags, max **20028**, none in 700–710.
The **conclusion** is wrong: "a real, newly-located hole in no ledger". It is not a hole. Claim [33]
in this same packet explains it, and I verified [33] independently —
`WarHexUI.as:1413 npcXML.id = 700 + i;` inside `startBattle(sentryStr)`, and
`QuestEngine.as:1041` inside a method literally named `clearPlayersInNPCData()`.
Refuted so the ledger does not end up holding both "a hole" and "not a hole".
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:1035-1043`

### [15] `bindata/mounted-shield-archer-poses-eggs` — **SURVIVES**
All five line cites exact (`8071 nodepose_1 d=1` · `13327 holdshield d=1` ·
`24123 mounted_idle d=1 l=1` · `24919 gangnam d=88 l=1` · `26860 narutorun d=12 l=1`).
Shield kit is exactly **seven** clips (holdshield, _crouch, _defend, _startrun, _run 10 loop,
holdshieldwalk 19 loop, holdshieldstabattack 10) — I counted them. Archer chain aimarrow 1 /
pullbackarrow 9 / pullbackarrow_full 15 / firearrow 1 (+10 at `AnimData.as:81`) / arrownormalpose 22
— all exact. `nodepose_1`…`nodepose_10` = ten slots, and `MCSActor.as:132-150` is `POSE1`…`POSE10`
mapping to those exact strings.
**own_cite:** `reference/extracted/bindata/108_1t4635s0.bin:8071,13327,24123,24919,26860` + `MCSActor.as:132-150`

### [16] `bindata/original-rng-is-a-specific-lcg` — **SURVIVES, and I closed its build-parity hole**
`RNG.as:10-19` — constructor negates a negative seed and burns one `rnd()`: exact.
`RNG.as:68-69` — `this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280; return this.randomSeed / 233280;`: exact.
(Trivial: the quoted `rand()` return is at `:74`, one line past the cited `65-73`.)
**Parity closed:** the WEB v0.717 build carries the identical generator —
`reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84-85` is the same LCG line for line, with the
same negate-and-burn constructor at `:12-20`. The Android-source caveat does not apply here.
**own_cite:** `reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84-85` (web v0.717, same LCG)

### [17] `bindata/paired-grab-throw-victim-anims` — **SURVIVES**
`102:3143 kneegroin d=30` · `102:3577 kneegroin_victim d=41` · `102:7570 backthrow d=39` ·
`102:8319 backthrow_victim d=36` — all exact. `AnimData.as:65-66` really does special-case
`MCSActor.KNEEGROIN_VICTIM` with `+6`, so the victim track is engine-known.
**own_cite:** `reference/extracted/bindata/102_1t4629s0.bin:3143,3577,7570,8319`

### [18] `bindata/per-stance-idle-poses` — **SURVIVES** (quote located)
Parsed the three `<anim>` blocks myself. Each carries exactly **19** `<n>` nodes.
`108:8002 lightstanceidle` → `<n i="16" x="29" y="-59" r="12">`, `<n i="3" x="24" y="-44" r="177">`.
`108:8025 balancedstanceidle` → `<n i="16" x="-7" y="-92" r="9">`, `<n i="3" x="14" y="-46" r="44">`.
`108:8048 heavystanceidle` → `<n i="16" x="3" y="-78" r="9">`, `<n i="3" x="14" y="-100" r="-170">`.
Every value verbatim. Head-height spread −59 → −92 = **33 px**, exactly as claimed. Weapon at three
distinct angles (177 / 44 / −170). `src/config/poses.ts` ships one `IDLE_POSE`.
**own_cite:** `reference/extracted/bindata/108_1t4635s0.bin:8002,8025,8048` (19 nodes each, own parse)

### [19] `bindata/pillarbox-independently-reverified` — **SURVIVES**
Reproduced under the claim's **own stated metric** (per-column max channel, every 3rd row) on
`Nr4fQstqHDM_431.0.png`: x=50→8, x=51→10, **x=52→82 (median 49)**, x=53→149; right edge
x=1865→150, x=1866→122, **x=1867→63**, x=1868→10. Digit-for-digit. The same boundary (52 / 1867)
holds on `_427.0.png` and `_433.0.png`. Canvas 1816×1080, aspect 1.6815.
Honest caveat I owe the record: the boundary is metric-dependent. At a much looser threshold
(any sampled row with R+G+B>18) the edges bleed to 49..1868 on `_431.0` and 52..1870 on `_433.0`
— i.e. "identical on all three frames" is true of the claim's metric, not of every metric. The
claim states its metric, so it stands.
**own_cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` (column max/median scan, ±`_427.0`, `_433.0`)

### [20] `bindata/place-name-26x26-lookup` — **SURVIVES**
`98_1t4653s0.bin:676` is exactly `Uenohara` (677 lines total, no trailing newline).
`NameGenerator.as:145-148,158` quoted verbatim; the two hardcoded towns are at `:137-144` exactly.
`getTownName2` = `namestarting[rand(len)] + nameending[rand(len)]` seeded `new RNG(territoryID * 2)`
— and I counted the literal arrays at `NameGenerator.as:40,42`: **78** and **37**, exactly as claimed.
Nit worth carrying into the ledger: `namex ∈ [0,25]` and `namey ∈ [0,25]`, so `namex*26+namey ≤ 675`
— the grid needs **676** entries and the table has **677**. Line 677 (`Yamanashi`) is a **dead row**,
unreachable by the algorithm. "maximum index (675) matches the table's usable row count exactly"
is loosely worded; 676 of 677 rows are usable.
**own_cite:** `reference/extracted/bindata/98_1t4653s0.bin:676` + `NameGenerator.as:145-158`

### [21] `bindata/procedural-name-generator` — **SURVIVES, parity byte-closed**
`96:7 Hachisuka` · `96:11 Honda` · `94:80 Kano` · `97:226 Shizuka` — all exact.
Table sizes exact: 94=398, 95=33, 96=36, 97=291, 98=677.
**All five tables are byte-identical to their named Android blobs**, which pins the mapping with no
inference at all: md5 94≡`85_NameGenerator_MaleNames`, 95≡`86_…NobleFamilyNames`,
96≡`87_…SamuraiFamilyNames`, 97≡`88_…FemaleNames`, 98≡`89_…PlaceNames`. So "Hachisuka Kano" =
samurai family (96) + male given (94) and "Honda Shizuka" = samurai family (96) + female given (97)
is a checked decomposition, not a guess.
**own_cite:** md5 equality of `reference/extracted/bindata/9[4-8]_*.bin` with `reference/extracted/android/8[5-9]_NameGenerator_*.bin`

### [22] `bindata/reach-cap-not-in-this-source` — **SURVIVES (honest STILL_UNHELD)**
The substantive claim is right: the animdata node schema is `<n i x y r>` or `<n i x y a b c d>`
(`FrameNodeData.as` constructor) — position and rotation only, never a blade length. Reach is not
derivable from this source and the refusal is correct.
Mis-cite worth flagging, not fatal: the quoted grep names `Player.as`, which **does not exist** in
`reference/decompiled/shs3_android_payload/scripts/` (grep emits "No such file or directory"). The
second grep (`slashLine|drawSlash|SlashLine` over `*.as`) genuinely returns nothing — I re-ran it.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/FrameNodeData.as` (node schema carries no length) + `ls` of that directory

### [23] `bindata/severed-limb-deaths` — **REFUTED (minor)**
The four severed-limb clips are exact: `108:11953 deathnohand d=25` · `108:12402 deathnohead d=31` ·
`108:18132 deathinhalf d=28` · `103:2950 seppuku_nohead d=26`. The five corpse poses are exact:
`corpse1..corpse5` at `103:979, 1002, 1025, 1046, 1067`, all `d="1"`.
**"a nine-clip death family" is wrong.** The claim's own quote enumerates **seven**
(death 38, defeatedanimationv1 34, defeatedanimationv2 35, deathenemy 23, deathwitharrow 23,
deathbyarrow 21, deathdowned 7). A full census of file `108` gives **8** `death*` clips plus
**2** `defeated*` = **10** total, of which 3 are the severed ones already counted. There is no
reading under which the number is nine.
**What survives:** the severed-limb death variant is authored, not an art blocker. Fix the count.
**own_cite:** `reference/extracted/bindata/108_1t4635s0.bin` — census of `<anim i="…death…">` (8) + `defeated*` (2)

### [24] `bindata/slash-is-four-part-looping-hold` — **REFUTED (material)**
Every line cite is exact: `118:217 light_horslash_parta d=13` · `118:492 …partb d=9 l="1"` ·
`118:683 …partc d=6` · `118:811 …partd d=1` · `106:217 balanced_horslash_parta d=12` ·
`116:217 heavy_horslash_parta d=5`. `src/config/timing.ts:37-41` is exactly
`light {4,4,4} balanced {4,4,8} heavy {4,4,12}`.
**"Every stance slash is a four-part clip whose MIDDLE part loops" is false.** I enumerated all
five stance files. Per stance there are five slash families:
- `horslash` / `downslash` / `upslash` — 4 parts, `partb` carries `l="1"`. ✅ claim holds.
- `fallslash` — **3 parts** (`parta/b/c`), `partb` is `d="1"` with **no `l`**. ❌
- `jumpslash` — 4 parts, `partb` is `d="1"` with **no `l`**. ❌
Second over-reach: "Light has the LONGEST windup (13)" is horslash-only. On `downslash`, balanced
and dual are 13 and light is 12. (Heavy being shortest does hold across all three ground slashes.)
**What survives:** the ground slashes (hor/down/up) are 4-part with a looping middle — the
hold-while-drawing state — and the per-part counts contradict the config's uniform windup of 4.
**own_cite:** `reference/extracted/bindata/118_1t4645s0.bin` — full `<anim>` enumeration (fallslash 3 parts, no `l`; jumpslash partb no `l`)

### [25] `bindata/spawn-geometry` — **SURVIVES**
Counted in `119_1t4646s0.bin`: `<x>-50</x>` **49**, `<x>1650</x>` **37**, `<x>-1650</x>` **1**.
Line 77 is that `-1650`, and `<wave>` tags start at lines 3, 16, 24, 37, 55, **68** — so it is
inside the **6th** wave, exactly as claimed. The typo reading is the right one.
"a ~1600px arena" is an inference from the two spawn xs (stated as approximate), not a cite; the
authored stage width is 800 (`GameEngine.as:269`), so 1650 is a world-x, not a stage-x.
**own_cite:** `reference/extracted/bindata/119_1t4646s0.bin:77` + occurrence counts

### [26] `bindata/sprite-compositing-contract` — **SURVIVES** (quote located; strongest claim in the packet)
`MCSCharacter.as:10-62` — all **27** `PART_*` constants at exactly the quoted indices, `l_hand 0`
through `r_knee 26`, on even lines 10..62. Verbatim.
`FrameNodeData.setPosition` — `mc.x = this.x; mc.y = this.y; mc.rotation = this.rotation;` in the
`rotation != 999` branch, else `m.a = this.matA / 100; …`. Verbatim; x/y are plain pixels, `r`
degrees, `a/b/c/d` fixed-point ×100.
`FrameData` — `this.reorder = xml.@r == 1` and `if(this.reorder) { this.reorderLayers(mcs); }`, so
reordering really does run **only** on `r="1"` frames; `reorderLayers` inserts `PART_hat` right
after `PART_head` and `PART_crotch` right after `PART_l_calf`. Verbatim.
I counted the frames myself: `108_1t4635s0.bin` has **89** `<f i="N" r="1">` against 1,549 plain
`<f>` — **89 exactly**.
Undocumented detail worth adding, not a refutation: `FrameData.setVisible` uses `partMax = 22`, so
slots 22–26 (`prop3`, both shoulders, both knees) are never hidden by the visibility pass.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:10-62` + `FrameData.as` + own count of 89 `r="1"` frames in `108_1t4635s0.bin`

### [27] `bindata/survival-is-warroom-content` — **SURVIVES**
`WarHexUI.as:1710` is `internal function createWarRoomWaveList(targetside:int)`, and `:1719` is
`var xml:XML = XML(new SurvivalModeData());` — exact, so `119` really is loaded as clan-war content.
`:1733 if(tempid >= 200 && tempid < 600)` and `:1735 remainder = tempid % 100;` exact; the five
re-base branches land at +200/+400/+300/+500/+600. (The `+600` branch is at `:1754`, two lines past
the claim's stated range `1733-1752` — trivial.)
`119:4-8` is exactly `<enemy><id>400|401|402|403|404</id><qty>4</qty><x>-50</x></enemy>`.
Counts: **39** `<wave>`, **87** `<enemy>`, root `<survivalmodedata>`. All exact.
**Parity delta found (worth recording, does not refute):** `119` is **not** byte-identical to
`android/109_WarHexUI_SurvivalModeData.bin`. Exactly **14** lines differ, all the same shape — the
WEB build appends a `443` (Soldier) and repeats the pair, e.g. web `<id>449|454|449|454|443</id>`
vs android `<id>449|454</id>`. Wave count, enemy count and spawn geometry are identical. The claim
cites the **web** file for its data, so its numbers are the v0.717 ones.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1710,1719,1733,1735,1754`

### [28] `bindata/territory-12bit-packing-and-6x6-nodes` — **SURVIVES**
`WarHexUI.as:1422-1424` verbatim:
`var zeronodex:int = (this.mapid >> 12 & 0x0FFF) * 6; var zeronodey:int = (this.mapid & 0x0FFF) * 6;
var nodeid:int = zeronodex + this.selectedHex.xpos << 12 | zeronodey + this.selectedHex.ypos;`
`NameGenerator.as:145-146` verbatim. The `*6` on both axes is the 6×6 subdivision and it re-uses
the identical 12-bit packing. Exact on both files, both line ranges.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1422-1424`

### [29] `bindata/trap-census-and-800-is-one-screen` — **REFUTED (material)**
Verified and exact: per-tier `easy(:32) 13 rooms / 37 objs, widths {800} only` ·
`medium(:126) 21/94` · `hard(:309) 15/72` · `veryhard(:446) 20/94`.
`93:49` is the authored comment `<!-- horizontal shoot past head -->` and `93:52` is
`<obj><id>32</id><name>Trap_Kunai</name><x>800</x><y>310</y><property>270,5</property></obj>` — exact.
`Obj_LowCeiling` is at `<y>200</y>` on **all 13** occurrences (12 shipped + the schema template at `:18`). `GameEngine.as:269
var originalWidth:int = 800;` — exact. The "one easy room = one screen" reading is sound.
**Two counting errors:**
1. **"= 70 rooms"** contradicts the claim's own per-tier split: 13+21+15+20 = **69**. A raw
   `grep -o '<room>'` gives 70 because the **70th `<room>` is inside the commented-out
   `<!--<default>…-->` block at lines 22-30** and is never shipped. `RoomGenNode.as:2437` confirms
   that branch is dead (`if(QuestEngine.trapRoomData.default.toString() != "")`).
2. **The 14-type census sums to 314, not the 297 stated in the same sentence.** I reproduced every
   figure and found why: it counts the **13 commented schema-header entries (lines 6-18)** plus the
   **4 commented `<default>` `Trap_ElementAuto` entries**. 297 + 13 + 4 = 314. The shipped census is
   FloorSwitch 53 · SawBladesAuto 45 · SpikeBallAuto 42 · ElementAuto 33 · Kunai 32 · KunaiAuto 18 ·
   Jump 16 · CrushingColumnAuto 12 · LowCeiling 12 · SpikesAuto 11 · Lever 9 · CrushingBlockAuto 7 ·
   Boulder 4 · BonePile 3 = **297**.
**own_cite:** `reference/extracted/bindata/93_1t4647s0.bin:22-30` (commented `<default>` room) + own comment-stripped `<room>`/`<name>` census

### [30] `bindata/trap-dungeon-system` — **REFUTED (minor)**
Nearly all exact: schema block `:6-18` (13 entries), root `:21 <traproomdata>`, tiers at
`:32/:126/:309/:446`, `:36` sawblade object verbatim, `:8` `Trap_Kunai` schema verbatim, `:9`
`Trap_KunaiAuto` schema verbatim, widths **{800, 1000, 1100, 1150, 1400}** exactly, and the 14
base object types are right. "Owned by the quest engine" is **byte-proved**:
md5(`93_1t4647s0.bin`) == md5(`android/84_QuestEngine_TrapRoomData.bin`) = `2ac03043b5aa3f91fe83173785813242`.
Refuted only on **"70 `<room>` blocks"** — the shipped count is **69**; the 70th is the commented
`<default>` template at lines 22-30. Everything else in this claim stands.
**own_cite:** md5 equality `reference/extracted/bindata/93_1t4647s0.bin` ≡ `reference/extracted/android/84_QuestEngine_TrapRoomData.bin`; `<room>` = 70 raw / 69 outside comments

### [31] `bindata/trap-room-placement-and-level-gate` — **SURVIVES**
Every rule verbatim at the stated lines. `:1918` BG_DUNGEON/BG_DUNGEON_FOG guard, `:1921
if(totalExits == 2 && this.isEnterFromLeft() && rng.rand(4) == 0)`; `:1937` BG_ANCIENTRUINS with
`:1940 if(totalExits == 2)` (unconditional); `:1956` ROOM_NINJATRAIL with `:1958
if(this.isEnterFromLeft() && rng.rand(2) == 0)`. The level gate `if(lvl < 10) … else if(lvl < 50) …
else` is identical at `:1923`, `:1942`, `:1960` and `:2380` — all four confirmed. Bleed dice
confirmed: EASY `rng.rand(4)`, roll 3 → medium (`:2395-2402`); MEDIUM `rng.rand(5)`, 3 → easy,
4 → hard (`:2407-2418`); HARD `rng.rand(4)`, 3 → medium (`:2423-2430`).
One inference to label: the gate proves levels ≥ 50 are anticipated content; the upper bound "80"
in "proves L11–80 is shipped" comes from outside this cite.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:1918-1975, 2380-2431`

### [32] `bindata/veryhard-rooms-rotate-daily` — **SURVIVES** (quote located)
`RoomGenNode.as:2445 traprng = new RNG(this.roomid * QueryManager.instance.getServerDate());` — exact,
and it sits inside `:2443 if(this.roomType == ROOM_TRAPVERYHARD)`, so **"the veryhard set alone"**
is precisely right: `:2450` uses the ordinary `rng` for every other tier.
All nine cross-cites resolve exactly: `ActiveQuest.as:56,380` · `CompletedQuest.as:69,73` ·
`LootDialog.as:428` · `InteractUI.as:780,1562,1614` · `EnemyPlayer.as:160`. I printed every one.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2443-2450`

### [33] `bindata/war-boss-ids-are-rival-players` — **SURVIVES** (quote located; best claim in the packet)
All eleven `119` line cites exact: `:18 <id>700</id>`, `:49 701`, `:80 702`, `:111 703`, `:142 704`,
`:173 705`, `:204 706`, `:235 707`, `:266 708`, `:297 709`, `:328 710`.
`WarHexUI.as:1413 npcXML.id = 700 + i;` sits directly after `:1412 npcXML.initDuelist(innerStrArray[1],…,false);`
inside `startBattle(sentryStr)` — exact.
`QuestEngine.as:1041 if(npcList[i].id >= 700 && npcList[i].id <= 710 || npcList[i].id == XMLNpc.INDEX_NPCHOLDER)`
inside `clearPlayersInNPCData()` at `:1035` — exact.
I re-ran both absence checks myself. `grep -n "<id>70[0-9]</id>" reference/extracted/npcdata.xml`
→ no output (exit 1). Android `125_Mobile_NpcData.bin` decoded **as UTF-8** → 1,273 `<id>` tags,
max 20028, 700-series `[]`. Both tables also agree at 495 `<npc>` and npc ids 0–819.
"28 of the 39 waves are fully recoverable" — I counted: **11** waves contain a 700-series id,
**28** do not. Exact.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1405-1414` + `QuestEngine.as:1035-1043` + own 11/28 wave split of `119_1t4646s0.bin`

### [34] `bindata/warhex-board-6x6` — **REFUTED (material)**
Board geometry is exact and I confirmed it: `WarHexUI.as:175-176 this.ht = 6; this.wt = 6;` and
`:253 hex.x = 90 + xpos * 55;` (with `:254 hex.y = 92 + ypos * 55;` — same 55 pitch on the other
axis, which strengthens the claim). Adjacency via `getExitOwner(xpos,ypos)`, defined at `:443`.
All seven named states do appear in the cited window `:266-322`.
**"seven enumerated hex states" is wrong.** The authoritative enumeration is
`reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37` and it declares **fourteen**:
`HEX_NOTHING 0 · HEX_SPAWNPOINT 1 · HEX_FORWARDBASE 2 · HEX_CONTROLPOINT 3 · HEX_TOWN 4 ·
HEX_POTENTIALSPAWNPOINT 5 · HEX_UPCOMINGSPAWNPOINT 6 · HEX_LADDER 7 · HEX_DEFENSE 8 ·
HEX_VILLAGE 9 · HEX_CITY 11 · HEX_CASTLE 12 · HEX_DISABLEDSPAWNPOINT 13 · HEX_DEMOLISHEDSPAWNPOINT 15`
(values 10 and 14 unused). `WarHexUI` itself sets four more than the seven listed —
`HEX_TOWN` at `:326`, `HEX_CITY` at `:330`, `HEX_CASTLE` at `:334`, `HEX_LADDER` at `:703`.
The cited window stops at `:322`, one line before `HEX_TOWN`. This is a citation that was cut short
and then reported as a complete set — exactly the failure mode this lens exists for.
**What survives:** 6×6 board, 55 px pitch on both axes. **What must be struck:** "seven … states"
→ fourteen, with the numeric enum from `WarHex.as:11-37`.
**own_cite:** `reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37` (14 hex states with values)

### [35] `bindata/world-map-bitmap` — **SURVIVES**
Independently re-decoded (see [3]). `file` → `GIF image data, version 89a, 63 x 72`; palette
`[(0,0,0),(255,255,255),(102,102,102),(153,153,153)]` with only indices 0 and 1 used; **735** of
**4,536** cells set; row 51 string-identical; (21,51) → 1 = LAND; md5 identical to
`android/110_Mobile_MapBitmapData.bin`. Every figure exact.
**own_cite:** `reference/extracted/bindata/92_1t4648s0.bin` (own LZW decode: 735/4536, palette, row 51)

---

## SUMMARY OF REFUTATIONS

| # | claim | severity | what must be struck |
|---|-------|----------|---------------------|
| 10 | engine-ticks-24fps | material | "15fps pose latch is a video-sampling artifact" (no artifact cite, overturns a frame measurement); "every trap duty cycle is a multiple of 24" |
| 11 | five-stances-not-three | material | "each with the same 21-animation kit" — reversed has **13** |
| 24 | slash-is-four-part-looping-hold | material | "**Every** stance slash" — fallslash is 3 parts and neither fallslash nor jumpslash loops |
| 29 | trap-census-and-800-is-one-screen | material | "70 rooms" (69); census sums to 314 not 297 — it counts 17 commented-out entries |
| 34 | warhex-board-6x6 | material | "seven enumerated hex states" — `WarHex.as:11-37` declares **fourteen** |
| 14 | missing-boss-npcs-700-710 | minor | "a real, newly-located hole" — superseded by [33], which I verified |
| 23 | severed-limb-deaths | minor | "nine-clip death family" — its own quote lists 7; file 108 holds 10 |
| 30 | trap-dungeon-system | minor | "70 `<room>` blocks" (69) |

Two struck items ([2]/[10] duty cycles, [29]/[30] room count) are the **same** underlying error
appearing in two claims each — one bad measurement propagating, which is worth noting for whoever
re-runs the surveyor.

## NEW FINDINGS THE SURVEYOR MISSED

1. **The web v0.717 payload is decompiled and on disk** — `reference/decompiled/shs3_payload/scripts/`,
   1,079 `.as` files, obfuscated identifiers. Every Android-only cite in this packet is
   parity-checkable there. I used it to close the parity hole on the RNG (`§1t58s0§.as:84-85`,
   identical LCG) and on the AnimData hold table (`§1t783s0§.as:42-145`, same value sequence).
2. **`GameEngine.as:269-271` reconciles the 800×690 SWF header with the 800×480 canvas** —
   `originalWidth 800 / originalHeight 480 / originalHeightWithBar 690`. Claim [5]'s "contradiction"
   is a bar, not a disagreement.
3. **`WarHex.as:11-37` is the canonical 14-state hex enum** with numeric values (10 and 14 unused).
4. **The 70th trap `<room>` is commented out** (`93_1t4647s0.bin:22-30`), and `RoomGenNode.as:2437`
   shows the engine branch that would have consumed it is therefore dead.
5. **Trap object `<name>` values carry instance suffixes** — 47 distinct raw strings
   (`Trap_Kunai1`, `Obj_FloorSwitch3`, `Trap_SawBladesAuto10`…) collapsing to 14 base types. The
   suffix is the **trigger-wiring id**: `<obj><id>7</id><name>Obj_FloorSwitch1</name><x>300</x><property>Trap_Kunai1</property></obj>`
   — a floor switch's `<property>` is the *name* of the object it fires. The packet never states
   how switches are wired to traps.
6. **Web/Android survival data diverge in exactly 14 lines** — `119_1t4646s0.bin` vs
   `android/109_WarHexUI_SurvivalModeData.bin`: the web build appends `|443` (Soldier) and repeats
   the pair in the 449/450/451 late waves. Same 39 waves, 87 enemies, same spawn xs.
7. **`98_1t4653s0.bin` has one dead row** — the algorithm can only reach indices 0..675, so line 677
   (`Yamanashi`) is unreachable.
8. **`FrameData.setVisible` uses `partMax = 22`**, so part slots 22–26 (`prop3`, both shoulders,
   both knees) are never hidden by the visibility pass — a gap in the compositing contract of [26].
