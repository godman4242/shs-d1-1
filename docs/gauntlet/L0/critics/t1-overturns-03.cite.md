# t1-overturns-03 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself. Crops, scans and greps are
reproduced inline so the numbers can be re-run.

---

## HEADLINE — A NEW FINDING THAT OVERTURNS A LEDGER I WAS NOT ASKED TO JUDGE

**The 1080p stage-scale divisor used throughout `docs/research/fidelity/COMBAT_MEASUREMENTS.md`
is WRONG. It is 2.25, not 1.875. Every "stage px" number converted at /1.875 is 20 % too large.**

Three independent proofs, all mine:

1. **Source.** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-307` —
   `var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690;` then
   `_loc8_ = §1t9973s0§.stageHeight / _loc3_;` with
   `_loc9_ = (§1t9973s0§.stageWidth - _loc2_ * _loc8_) / 2;`.
   At a 1920×1080 viewport the tall branch (`_loc7_ <= 800/690`) is not taken, so
   **scale = 1080/480 = 2.25** and **offsetX = (1920 − 1800)/2 = 60**.
   Confirmed by `§1t1523s0§.as:104` `stageWidth:int = 800` and `:106` `stageHeight:int = 480`.
2. **Frames.** Pillarbox measured on four frames (first/last column with any pixel > 12):
   `damage-ttk/t125.350.png` 54→1862, `gap-focus-trigger/t1747.000.png` 48→1867,
   `stance-reach/B_t783.400_….png` 52→1868, `stance-reach/A_t117.400_….png` 54→1863.
   Content width ≈ 1810–1820 ⇒ 800 × 2.25 = 1800 plus compression bleed.
   At /1.875 the content would be 1500 px wide with **210 px** black bars. Not observed.
3. **Reductio.** The HUD reload bar sits at row **y = 1036** (measured, below). At /1.875 that
   is stage y ≈ 504 — **off the bottom of a 480-tall stage, impossible.** At /2.25 it is
   stage y ≈ 460 of 480, i.e. the bottom HUD strip. Only 2.25 is physically realisable.

Consequence for the c-2 table: LIGHT 233–241 → **194–201**; BALANCED 116–131 → **97–109**;
HEAVY 97–103 → **81–86** (max 121 → 101). This kills finding **#16** and should be applied
to every MEASURED row in COMBAT_MEASUREMENTS.md that carries a stage-px conversion.

---

## VERDICTS

### 0. `bindata/place-name-table-is-dead-data` — **HELD**
`NameGenerator.as:147` `var namex:int = territoryx % 137;`, `:149-153`, `:162-165` all verbatim.
Array lengths re-counted from `:40` / `:42` → **namestarting 78, nameending 37** (2 886 compounds). ✓
I decoded `reference/extracted/bindata/92_1t4648s0.bin` (GIF89a, 63×72): **735 white cells**,
raw territory-x ∈ [329,389] ⇒ `namex = x % 137` ∈ **[55,115]**, `any < 26 = False`.
**getTownName1 hit count 0/735 reproduced exactly.** 98_1t4653s0.bin holds 677 entries (5 698 B,
no trailing newline). Web twin `§1t136s0§.as:138-160` is identical and adds a third hardcoded
town (Iwakuni 1519945), so `build: both` is right.

### 1. `bindata/reach-cap-recovered-per-stance` — **REFUTED (material)**
The android lines are quoted correctly (`MCSPlayer.as:3030/3041/3052-3055/3078-3081/3094`,
`StatsManager.as:1915-1918`, `EnemyPlayer.as:757`, `InputManager.as:51`, `§1t1523s0§.as:2347` — all exact).
**But the claim is flagged `build: both` and its lane says "Web-verified, so the S0 build-parity
caveat does not apply." That is false.** Web v0.717 `§1t99s0§.as:3094` `= this.§1t4420s0§ * 1.4;`
(LIGHT), `:3105` `* (1 + 0.2 * §1t4422s0§ * 0.1)`, `:3116` `* (0.5 + 0.4 * §1t4423s0§ * 0.1)`,
`:3131` REVERSED `* 1.4`, `:3142` DUAL `* 1.0` floor 100.
So the web build is **1.4 not 1.5** for Light/Reversed, and mastery is scaled **×0.1 on a 0–10
ladder**, not ×0.01 on a 0–100 one. The claim's closing sentence — "heavy … reaches parity only at
100 % heavy mastery" — is impossible in v0.717: at the mastery cap of 10 Heavy is 0.5+0.4 = **0.9**,
never parity. Only the *base* formula is genuinely web-verified. Finding **#14** carries the
correct web table; bank that one instead.

### 2. `bindata/six-ledger-names-decompose` — **HELD**
All ten line cites re-read with an exact-match scan: 96:7 Hachisuka · 96:10 Hojo · 96:11 Honda ·
95:11 Inokuma · 94:80 Kano · 94:107 Kinkiyo · 97:38 Gin · 97:170 Niji · 97:226 Shizuka · 97:236 Taka. ✓
Zabuza / Tengu / Hotaru: **zero hits across all five tables** ✓. Table roles confirmed from
`NameGenerator.as:10-18` + `:48-66` and by content (95 = Konoe/Kujo kuge families, 96 = Asai/Ashikaga
samurai clans, 94 male, 97 female, 98 places). `getNobleName` at `:87-93` vs `getSamuraiName` at
`:96-102` makes the Inokuma Kinkiyo attribution correct. Ledger cites exact:
`SYNTHESIS.md:429` and `REBUILD_READINESS.md:221`.

### 3. `bindata/slash-line-colours-exact` — **REFUTED (material)**
The constants are right and the line numbers are exact (`InputManager.as:174` = 39168 = 0x009900,
`:179` = 10027008 = 0x990000, `:360` taper, `:492` enemy line colour `0`; web `§1t1541s0§.as:174/179/361/477`).
**The semantic is fabricated.** `greenLine()` / `redLine()` are never called from the slash path.
Their only call sites are `SkillUI.as:75` (`this.greenCircle.visible = true; … InputManager.greenLine();`
inside `reset()`) and `SkillUI.as:136` (inside `if(this.skillStr == "012")`, which also sets
`redCircle.visible = true` and drives every node to frame 4). Web is identical:
`§1t6980s0§.as:75` and `:136`. So green/red is the **chi-skill gesture canvas** — green while a
gesture is being entered, red when the entered combo is rejected. It has nothing to do with
"the slash is affordable". The player's slash guide line is **always** 0x990000 (`:360`, `:472`);
only its *thickness* tapers with `distanceLeft`. Building this claim paints the guide line green.

### 4. `bindata/territory-to-bitmap-transform` — **HELD**
`QuestEngine.as:522-526` and `:1206` quoted verbatim and land on exactly those lines.
`WorldMapUI.as:15/17/19` = 8 / 21 / 51 ✓, `WarSelectUI.as:15/17/19` identical ✓,
web `§1t7934s0§.as:15/17/19` = 8 / 21 / 51 ✓. I collapsed and tested the transform against the
real bitmap: **735 land cells**, `mapid ∈ [1347935, 1593647]` — *exactly* the claimed span —
and all three hardcoded towns land on white pixels: Ibamaya 1405272 → (15,54), Gokura 1524045 →
(44,43), Iwakuni 1519945 → (43,39). All three reproduce to the pixel.
*Nit:* y actually spans **[291,360]**, not the claimed [290,361]. Non-load-bearing.

### 5. `bindata/trap-duty-cycle-domain-measured` — **HELD**
Schema line `93_1t4647s0.bin:15` reads `direction, onDuration, offDuration, startInterval, active,
spikelook, bigDamage` ✓ and `:451` is verbatim `…<property>0,24,36,0,1,1,1</property>…` ✓ (offDuration 36).
I re-derived the domains from all 130 live trap rows against the file's own schema:
onDuration **{0,24,48}**, offDuration **{0,24,36,48,60,96,1000}**, startInterval
**{0,6,8,12,16,18,24,30,32,36,42,48,54,64,72}**, **gcd = 2** — identical to the claim.
SWF header parsed by me: `reference/decrypted/shs3_payload_decoded.swf` = **CWS v17, rect
[0,16000,0,13800] twips (800×690), framerate 24.0, 6 frames** ✓ exactly as stated.
*Nit:* I count **81** non-multiples of 24, not 75. Does not touch the conclusion.

### 6. `bindata/warhex-14-states-not-7` — **REFUTED (material)**
Android side is exact: `WarHex.as:11` HEX_NOTHING = 0 … `:37` HEX_DEMOLISHEDSPAWNPOINT = 15,
`grep -c 'public static var HEX_'` = **14**; `WarHexUI.as:175-176` `ht = 6; wt = 6;`,
`:253-254` `hex.x = 90 + xpos * 55; hex.y = 92 + ypos * 55;`. Geometry is web-confirmed at
`§1t7785s0§.as:261-262` (`x = 90 + _loc18_ * 55; y = 92 + _loc19_ * 55;`).
**But the enum is NOT the same in both builds, and the claim says `build: both`.**
The web WarHex is `§1t416s0§.as` (same `[Embed] symbol732` shape, same MovieClip members
logo/narrow/sarrow/boundary/bg/button/earrow/flag/hqflag/hqflag2). Its constants at
`:11-39` are **FIFTEEN**: 0,1,2,3,4,5,6,7,8,9,**10**,11,12,13,15. Value 10 — which the claim
calls unused — is a live state in v0.717; only 14 is skipped.
So: "fourteen members … 10 and 14 unused" is an android-v0.682 fact asserted of the shipped web build.
The direction (far more than seven) survives; the count and the gap list do not.

### 7. `combat-core/300-200-100-is-base-not-ceiling` — **HELD (PARTIAL, as filed)**
`InputManager.as:51` `internal static var maxDistance:int = 200;` ✓, `MCSPlayer.as:3030/3041/3052` ✓.
Arithmetic 200 × {1.5, 1.0, 0.5} = 300/200/100 ✓ for the android multipliers, and the claim
itself flags that v0.717 gives 280/200/100. The ledger's "MASTERY-9 CEILING" reading for *reach*
does fall: at the web mastery cap the ratios are 1.4 : 1.2 : 0.9, nothing like 3 : 2 : 1, whereas
mastery-0 gives 1.4 : 1.0 : 0.5. Honest PARTIAL, correctly hedged.
*Caveat to record:* `maxDistance = 200` is a static initialiser that `setMaxDistance(slashLength)`
overwrites (`MCSPlayer.as:3094`); the stance multipliers multiply `baseSlashLength`
(`MCSPlayer.as:107`, default 10, filled from `getBaseSlashLength()`), never `maxDistance`.
The 200 is a numerological coincidence, not the mechanism.

### 8. `combat-core/36-was-not-a-crit` — **HELD (with a correction to its own quote)**
I re-ran the row-1032 scan over all 18 `damage-ttk/t19*.png` frames (1920×1080, x ∈ [240,520],
all channels > 190). The key frame reproduces perfectly: **t1961.900** — third bar 0 px, HUD crop
(100,940)-(620,1080) ×3 reads green **10/20**, blue **20/20**, and the third bar printed
**"CANNOT CHANGE STANCE"**; crop (470,580)-(680,700) ×5 shows a red **36** over **JINBEI (4)**
whose HP bar is ~55 %. A crit was impossible there.
**Correction:** "bar_px = 0 on all 18 frames" is false. Two frames carry fill —
**t1958.967 = 83 px (x 251→333)** and **t1970.333 = 68 px (x 251→318)**. Neither is *full*,
so the conclusion (no crit anywhere in that fight; 27/30/36 is the RNG term) stands unharmed.
*Parity nit:* `MCSPlayer.as:2977` (`reload < maxreload/6`) is the **android** stance gate; the web
gate is `§1t99s0§.as:3060` `if(this.§1t4414s0§ < 48)`. Conclusion unaffected.

### 9. `combat-core/basereload-is-dead-code` — **HELD (with two corrections)** [citelint QUOTE_UNVERIFIED — resolved]
`shs3_android/scripts/MCSPlayer.as:105` `internal var baseReload:int = 48;` ✓ and `:190`
`this.baseReload = baseReload;` ✓ — both exact.
**Correction 1:** the quoted exhaustive grep does **not** return no rows; run verbatim it returns 5
(`FriendlyElite.as:56`, `EnemyPlayer.as:761`, `EnemyElite.as:106`, `StatsManager.as:1834`, `:1839`).
**Correction 2:** there **is** one read site — `EnemyClone.as:49` `this.baseReload = owner.baseReload;`
(web twin `§1t4904s0§.as:49`). It only copies the dead value into another dead field.
The conclusion is nevertheless right **and broader than filed**: the field is dead in *both* builds
(web `§1t99s0§.as:103` decl, `:191` assign, no consumer), and the meter refills flat +1/frame —
android `MCSPlayer.as:1160` `++this.reload;`, web `§1t99s0§.as:1205` `++this.§1t4414s0§;`.
`StatsManager.as:1841` `return 48 + (getPlayerStats(STAT_SPEED)+findBonusStat(STAT_SPEED)) * 6;`
feeds nothing. Do not build 48 + SPD×6 as a refill rate.

### 10. `combat-core/crit-is-1.3-gated-on-full-slash-meter` — **HELD**
`§1t99s0§.as:3272-3276` verbatim and on exactly those lines. Meter identification confirmed
end to end: `:249` `this.§1t4415s0§ = 8 * 24;` (maxreload, set unconditionally in initPlayer),
`:1205` `++this.§1t4414s0§;`, `:3162` `this.§1t4414s0§ -= 48;` on stance change,
`:3302/3306/3310` `-= slashUsage/2` (Light) / `-= slashUsage` (Balanced, Reversed) /
`-= slashUsage * 1.5` (Heavy, Dual). And `:3295-3297` `if(reload == maxreload) { reload = 0; }` —
a slash from full **zeroes** the meter, which is exactly the "first-strike-from-full" reading.
Android divergence quoted correctly: `MCSPlayer.as:3215-3222`, `×1.2` when `stance != LIGHT_STANCE`,
`×1.5` for Light. `§1t1243s0§` = STAT_CRITICALDMG confirmed via `§1t99s0§.as:278` (`= param6`)
against the android signature `MCSPlayer.as:249 initAttackStats(…, STAT_CRITICALDMG:int = 0, …)`.

### 11. `combat-core/crit-is-flat-1.3` — **HELD (one inverted side-note)**
Primary assertion verified at `§1t99s0§.as:3272-3274` (cite range `:3271-3273` is one line early
but overlaps). **CORRECTION REQUIRED before banking:** the android note is backwards.
`MCSPlayer.as:3217-3221` reads `if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + …; }
return maxDamage * 1.5 + …;` — i.e. **1.5 in Light, 1.2 elsewhere**, not "1.2 in Light, 1.5 elsewhere".
Findings #10 and #17 state it correctly.

### 12. `combat-core/crit-meter-is-6-seconds` — **HELD**
`§1t99s0§.as:249` `= 8 * 24;` ✓, `:3060` `if(this.§1t4414s0§ < 48) { return; }` ✓,
`§1t113s0§.as:328-333` `var _loc3_:Number = (param1 - 48) / (param2 - 48); … bar.scaleX = _loc3_;` ✓
— all three land on exactly the cited lines. With `++reload` once per frame (`:1205`) and a 24.0 fps
SWF header (parsed by me), visible travel = (192 − 48) = **144 ticks = 6.000 s** exactly.
I confirmed the 6 s independently on frames (see #13). The android twin is `maxreload = 5 * 24` with
`(reload − 24)/(maxreload − 24)` = 96 ticks = **4.000 s** (`MCSPlayer.as:239`, `:1168`), which is
precisely the 4.0 s the claim tells us not to build.

### 13. `combat-core/crit-track-268px-six-seconds` — **HELD**
Re-measured `gap-focus-trigger/t2175.933.png` myself over rows 1026–1049, x ∈ [200,600]:
white extent **x 245 → 512, width 268** — exact. HUD crop (150,940)-(620,1070) ×3 LANCZOS shows
green **4/20**, blue **47/47**, third bar 100 % solid white with **"CRITICAL HIT"** across it.
Fill rate re-measured in `crit-focus/`: t1082.100 edge 304, t1082.900 edge 340 ⇒ **36 px / 0.8 s
= 45.0 px/s** (claim said 303→339; ±1 px is antialias threshold). t1004.800 → t1005.000 = 281→290
= 9 px / 0.2 s = 45 px/s. 268 / 45.0 = **5.96 s**. Third route from
`focusbar_scan2_videoB_fps15.tsv`: edge 247 @ **2170.0000** → 512 @ **2175.9333–2176.0000** ⇒ 5.93–6.00 s.
Also confirms the surveyor's "max 67.7 %": `crit-focus/t837.683.png` edge 427 ⇒ (427−245)/268 = 67.9 %.

### 14. `combat-core/dual-reversed-reach-inverted` — **HELD**
`§1t99s0§.as:3130` `case §1t12224s0§:` / `:3131` `* 1.4` (REVERSED, no floor) and `:3141`
`case §1t12223s0§:` / `:3142` `= this.§1t4420s0§;` / `:3143-3145` floor 100 (DUAL) — **exact to the line.**
Identities confirmed: android `MCSPlayer.as:33` `DUAL_STANCE:int = 3`, `:35` `REVERSED_STANCE:int = 4`,
against web `§1t99s0§.as:32` `§1t12223s0§ = 3` and `:34` `§1t12224s0§ = 4`.
*Nit:* the quote labels those two web constants "33:" and "35:" — those are the **android** line
numbers; in `§1t99s0§.as` they sit at 32 and 34, still inside the cited `:27-35` window.
The corrected web table in the lane note (Light ×1.4 · Balanced ×(1+0.02M) · Heavy ×(0.5+0.04M)
floor 100 · Dual ×1.0 floor 100 · Reversed ×1.4) matches `:3094/:3105/:3116/:3131/:3142` exactly.
**This is the reach table to bank — not #1's.**

### 15. `combat-core/early-mob-hp-distribution` — **HELD**
`npcdata.xml:145-152` is verbatim `<id>6</id> … <lvl>2</lvl><hp>1</hp><ai>1</ai><attack>5</attack><defense>3</defense>`.
I re-enumerated all `<npc>` rows: **495 total** (matches the S0 index), **22 with lvl ≤ 2**, HP
histogram **{1: 17, 2: 1, 5: 4}** — identical to the claim. ids **7, 8, 9, 10** are each
lvl 2 / hp 5 / defense 3 / attack 5 ✓. Mechanism verified: Branch = itemdata id 13002
(`itemdata.xml:7907-7914`, `<mindamage>1</mindamage><maxdamage>2</maxdamage>`);
`MCSPlayer.as:3415` and `:3709` `damage -= this.getDefense();`; `Damage.as:160-162`
`if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; }`. 5 HP ÷ 1 = **five hits**.

### 16. `combat-core/formula-resolves-c2-balanced-gap` — **REFUTED (material)**
Every literal cite resolves: `COMBAT_MEASUREMENTS.md:397` is verbatim
`| **Balanced** | 116–131 | **131** | 17 | 200 | ❌ **NOT CONFIRMED** — measured 131 |`,
`:403-405` carries the ⚠️ line and "Light and Heavy were both measured on a **level-8** character",
and `§1t1523s0§.as:2346-2347`, `§1t99s0§.as:3094/3105/3116-3119` are all exact. The row's own
frame cites exist (`session11-raw/stance-reach.txt` EVID lines → `reference/frames/session11/stance-reach/`).
**The claim still fails, because the stage-px numbers it matches against are 20 % too large.**
See the headline above: the divisor is **2.25**, not the 1.875 the c-2 row used
(`§1t1540s0§.as:271-307` + the 60 px pillarbox I measured + the reductio that a row-1036 HUD bar
cannot exist on a 480-tall stage at /1.875). Corrected, the bands are Balanced **97–109** and
Heavy **81–86** — so `base = 124` does **not** "land inside the measured band", and the Heavy
plateau is **not** sitting on the 100-px floor. The source stays *consistent* with the corrected
numbers (a body-to-endpoint distance is a lower bound on a path-length budget), but "three
frame-measured reach numbers are reproduced by the v0.717 constants" is not true, and the
⚠️ ledger warning does not fall on this evidence.
**STANDING INVARIANT INVOKED: the measurement doc and the frames disagree, and THE FRAME WINS.**

### 17. `combat-core/full-reload-crit-is-1p3-in-v0717` — **HELD**
`§1t99s0§.as:3272-3276` verbatim on exactly those lines. `§1t1243s0§` → STAT_CRITICALDMG confirmed:
`§1t1523s0§.as:2269` passes `§1t7358s0§(§1t1243s0§)` as the 6th argument of `§1t4445s0§`, and the
android twin `MCSPlayer.as:249` names that parameter `STAT_CRITICALDMG`. `§1t4414s0§`/`§1t4415s0§`
= reload/maxreload confirmed at `:3162` and `:3169`. Android split at `MCSPlayer.as:3215-3221`
stated correctly (1.2 non-Light / 1.5 Light).

### 18. `combat-core/injured-buff-halves-reach` — **HELD, and stronger than filed**
`MCSPlayer.as:216` `this.defense *= 1.5;`, `:218-223` the BUFF_INJURED block with
`this.baseSlashLength *= 0.5;` at **:222** — verbatim, exact.
**Web-verified too, which the claim does not say:** `§1t99s0§.as:223` `this.§1t4420s0§ *= 0.5;`
inside the same three-way buff chain, and `§1t4420s0§` is baseSlashLength by `:194` (`= param10`)
against the android `initPlayer` signature at `MCSPlayer.as:182`. Promote to `build: both`.

### 19. `combat-core/mastery-caps-at-ten` — **HELD**
`§1t99s0§.as:3255-3271` is the whole `getDamage` switch, verbatim and exactly on those lines.
`skilldata.xml` re-parsed: skill **1000 = lines 3-80**, **1001 = 82-159**, **1002 = 161-238**,
each with exactly **10 `<level>` blocks and `<value>` 1…10** ✓. Names resolved from the string
table: 6000 "Light Stance Mastery", 6002 "Balanced Stance Mastery", 6004 "Heavy Stance Mastery".
Binding verified at `§1t99s0§.as:183` (15-param initPlayer) → params 12/13/14 →
`§1t4421s0§`/`§1t4422s0§`/`§1t4423s0§`, against the named android signature `MCSPlayer.as:182`;
values come from `§1t9714s0§(1000/1001/1002)` (`getMastery`, `XMLNpc.as:671-685`, returns the skill level).
The arithmetic closes the wiki table exactly: 0.5+0.4·10·0.1 = **0.9**, 1+0.2·10·0.1 = **1.2**,
Heavy/Dual/Reversed flat **1.4**. Mastery-TEN, not mastery-9.

### 20. `combat-core/mastery-is-ten-level-skill` — **HELD** [citelint QUOTE_UNVERIFIED — resolved]
The lint choked on the inline `// strings.json` annotation; the code is verbatim.
`MCSPlayer.as:3174` `this.canFlipUp = this.balancedMastery >= 3;` `:3175` `canDeflect … >= 4;`
`:3176` `canLaunch … >= 5;` ✓ and `:3182-3184` the Heavy triple (`canLaunch/canDeflect/canStab`
at 3/4/5) ✓. Web parity is exact: `§1t99s0§.as:3231-3233` and `:3239-3241` gate on
`§1t4422s0§` / `§1t4423s0§` at the same 3/4/5. Ten-level ladder confirmed as in #19.

### 21. `combat-core/popup-animation-and-black-variant` — **HELD**
Five-tile sheet built from crop (780,480)-(1180,680) ×2 on the exact five frames. I see what the
claim says I would: dark-red **1** over the left enemy at t125.350, higher and larger at
t125.417/.450 (glyph ymin 564 → 552, height 57 → 60, x unchanged), a fresh dark-red **2** at
t125.467 with a **BLACK 2** beside it over the GUEST/Jinbei pair, both much larger and higher by
t125.733. Code verbatim at `TextProjectile.as:20` `ttl = 12;`, `:23` `this.velY = -5;`,
`:38-46` `--ttl; if(ttl < 10) { scaleX += 0.1; scaleY += 0.1; if(ttl < 4) { alpha -= 0.25; } }`.
**Web-identical**, line for line: `§1t138s0§.as:20/23/38-46`. 12 ticks @ 24 fps = 0.5 s,
60 world units, ≈1.9–2.0× terminal scale ✓.
*Nit:* the cite range `:17-25` covers only the `initText` half; the `update()` quote is at `:38-46`.
The black variant is attributed correctly by #22 — no grep needed any more.

### 22. `combat-core/popup-colour-is-a-semantic` — **HELD**
Both crops re-cut. `t1960.000` (760,500)-(900,620) ×6: a fading **2** over the **GUEST** tag,
modal glyph pixels **(146,158,180)/(140,158,183)** against a (186,205,242) sky — the claim said
(140,160,180)/(140,140,180); red-dominant pixels are 69 of 2 414 (2.9 %, nameplate edge bleed).
A black glyph alpha-fading, exactly as filed. `t1961.900` (470,580)-(680,700) ×5: red **36** over
**JINBEI (4)**, core pixels ≈(163,14,0).
Source verbatim and exact: `MCSPlayer.as:3542` `…,damage.toString(),0);` under
`if(this.controlledBy == 0)`, `:3546` `…,10027008);` in the else, `:3551/3555/3559/3563`
= 16737792 / 13421772 / 26367 / 6697728, `:1633` chi = 3394815.
**Web-verified** (the claim does not say so): `§1t99s0§.as:3619-3626` is the same
`controlledBy == 0 → 0` / `else → 10027008` branch, with the four element colours at `:3630-3642`
and chi 3394815 at `:1691`. The HUD spec needs the table, not one hue.

### 23. `combat-core/raw-frames-show-full-crit-meter` — **HELD**
Both frames are raw 1920×1080 PNGs, not montages, and both read exactly as filed at crop
(150,940)-(620,1070) ×3 LANCZOS. **t1746.733**: HP 11/20 green, Chi 47/47 blue, third bar solid
white to a ~2 px brown sliver, no text. **t1747.000** (0.267 s later): identical HP and Chi, third
bar 100 % white with **"CRITICAL HIT"** in dark caps across it. `t2175.933` is a third full-bar
frame (HP 4/20, Chi 47/47, "CRITICAL HIT"). SESSION-11's "the bar never once reached full
(max 67.7 %)" and "OG has NO Critical meter at all" are both dead. Its 67.7 % maximum is a
sampling artefact — I reproduced it at `crit-focus/t837.683.png` (edge 427 = 67.9 %) while two
100 % frames sat in a directory it did not scan.

---

## SUMMARY

| verdict | ids |
|---|---|
| **HELD (19)** | 0, 2, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23 *(20 rows — 8, 9, 11 held with corrections)* |
| **REFUTED (4)** | 1 (android multipliers sold as web-verified), 3 (green/red belong to the skill-gesture canvas), 6 (web enum has 15 states, value 10 is live), 16 (rests on a 20 %-wrong stage-scale conversion) |

Both QUOTE_UNVERIFIED claims (#9, #20) survived: the quoted code is verbatim at the cited lines;
the lint tripped on inline prose inside the quote field. #9 nevertheless needed two corrections.

Three claims (#10, #11, #17) are the same finding filed three times. Bank **#17** or **#10**;
**#11** carries an inverted android note.

The reach lane has two mutually exclusive tables in one packet: **#1** (android 1.5/…×0.01) and
**#14** (web 1.4/…×0.1). **#14 is the shipped build.**
