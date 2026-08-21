# t1-overturns-03 — HUNTER LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below carries an artifact I opened myself. Line numbers were re-derived with
`sed -n 'Np'`, not trusted from the claim.

## Headline results

1. **THE FRAME WINS, and it wins loudly.** `reference/frames/session11/gap-focus-trigger/t1747.000.png`
   and `t2175.933.png`, cropped (240,1022)-(525,1052) and upscaled ×6 LANCZOS, show the third HUD bar
   **100% white with "CRITICAL HIT" printed in dark caps across it**. I read the glyphs with my own eyes.
   `docs/research/fidelity/session11-raw/crit-focus.txt:2` says "the OG has ... **NO Critical meter at
   all**" and `:40` says "the bar never once reached full (max 67.7%)". **The measurement doc and the
   frame disagree, and THE FRAME WINS.** SESSION-11's meter conclusion must be re-opened.
2. **Two findings are materially WRONG and are refuted** (`bindata/reach-cap-recovered-per-stance`,
   `bindata/slash-line-colours-exact`) — both because a correct android-v0.682 reading was pushed onto
   the shipped web v0.717 build, or a colour constant was attached to the wrong drawing path.
3. **13 of 22 claimed ledger overturns do not survive the overturn check.** Six name a "ledger sentence"
   that does not exist anywhere in `docs/research/REBUILD_READINESS.md` (`| **combat-model** | …`,
   `| **world-map** | 63x72 bitmap …`, `| **war-room** | board topology — BLOCKER |`, and three with
   `ledger_text: null`). Others name a real sentence that survives the evidence.
4. **New, unclaimed:** the **web v0.717 stage rect is 800×690**, not 800×480. All four web SWFs
   (`shs3.swf`, `shs3preloader.swf`, `shs3_payload_decoded.swf`, `shs3_binarydata_9_decrypted.swf`)
   declare `rect 0..16000 × 0..13800 twips = 800 × 690 px @ 24.0 fps`; only
   `shs3_android_payload_decoded.swf` declares 800×480. `REBUILD_READINESS.md:118` and §3 item 12 assert
   "native canvas is **800×480 (5:3)**" flatly. That is an ANDROID figure.

---

## Verdicts

### 0. `bindata/place-name-table-is-dead-data` — HELD · overturn NOT upheld
I opened `reference/extracted/android/110_Mobile_MapBitmapData.bin`: it is a **63×72 GIF89a** with
exactly **735 non-black pixels**. Applying the verified transform (`QuestEngine.as:522-526`,
`WorldMapUI.as:15,17,19`) gives territoryx ∈ **[329,389]**, and `territoryx % 137` ∈ **[55,115]** —
never < 26 on any of the 735. `NameGenerator.as:147-153` and `:162-165` are verbatim as quoted;
`namestarting` = **78**, `nameending` = **37** (counted from the array literals at `:40` and `:42`),
and the web twin `§1t136s0§.as:§1t1828s0§/§1t1829s0§` = 78/37 as well, with the same `%137` gate at
`:154-160`. `98_1t4653s0.bin` has **677** records (`grep -c ""`; no trailing newline).
**Every number in this finding reproduces exactly.** Overturn not upheld only because `ledger_text` is
null and nothing in `REBUILD_READINESS.md` concerns place names — this overturns a sibling claim.

### 1. `bindata/reach-cap-recovered-per-stance` — **REFUTED (material)** · overturn NOT upheld
The cites are exact (`MCSPlayer.as:3019,3030,3041,3052-3055,3078-3081,3094`, `StatsManager.as:1915-1918`,
`EnemyPlayer.as:757`, `InputManager.as:51,106-108,198`, `§1t1523s0§.as:2347`). The **conclusion is wrong
for the shipped build.** Web v0.717 `§1t99s0§.as` gives:
`:3094 LIGHT ×1.4` · `:3105 BALANCED ×(1+0.2·M·0.1)` · `:3116 HEAVY ×(0.5+0.4·M·0.1)` floor 100 ·
`:3131 REVERSED ×1.4` · `:3142 DUAL ×1.0` floor 100.
The finding asserts LIGHT ×1.5 and REVERSED ×1.5 and a `·0.01` mastery form — those are **android
v0.682 only** — and then states "Web-verified, so the S0 build-parity caveat does not apply." Its only
web cite is the *base-length* formula, not the multipliers. It also says heavy "reaches parity only at
100% heavy mastery", which is unreachable: mastery is a **ten-level** skill (`skilldata.xml`, verified
under finding 19), and in v0.717 heavy tops out at ×0.9.

### 2. `bindata/six-ledger-names-decompose` — HELD · overturn NOT upheld
All ten line lookups reproduce byte-for-byte: `96:7 Hachisuka`, `96:10 Hojo`, `96:11 Honda`,
`95:11 Inokuma`, `94:80 Kano`, `94:107 Kinkiyo`, `97:38 Gin`, `97:170 Niji`, `97:226 Shizuka`,
`97:236 Taka`. Zabuza / Tengu / Hotaru: zero hits in 94–98. `NameGenerator.as:78-103` confirms three
distinct generators (`getCommonerName` bare given-name, `getNobleName` = 95 + given, `getSamuraiName`
= 96 + given), so the Inokuma→noble attribution is right. `SYNTHESIS.md:429` and
`REBUILD_READINESS.md:221` are verbatim as quoted. **Overturn not upheld:** RR:221 says the *project's*
boss table omits those names — still true after this finding.

### 3. `bindata/slash-line-colours-exact` — **REFUTED (material)** · overturn NOT upheld
The three hex values and the taper are exact (`InputManager.as:174` = 39168 = 0x009900, `:179` =
10027008 = 0x990000, `:360` and `:472` taper, `:492` enemy line colour `0`; web `§1t1541s0§.as:174,179,
361,477,499` identical). **The semantics are fabricated.** `greenLine()`/`redLine()` have exactly two
callers in each build — `SkillUI.as:75` (on `reset()`) and `SkillUI.as:136` (when the gesture string
== `"012"`), i.e. the **skill-gesture node grid**, never the slash path. The player's slash guide line
is *unconditionally* 0x990000 with a distance taper. "Green when the slash is affordable" is not in the
source. Overturn also fails on its own terms: `REBUILD_READINESS.md:126` lists "byte-exact palette" in
the **Rebuild-ready-now** column, not as a blocker.

### 4. `bindata/territory-to-bitmap-transform` — HELD (exceptionally) · overturn NOT upheld
Verified against the bitmap itself. `(terrX+341)<<12 | (terrY+341)` with `terrX = i-21+8`,
`terrY = j-51` collapses to `pixel_x = (id>>12 & 0xFFF) - 328`, `pixel_y = (id & 0xFFF) - 290` — my own
decode of all 735 land pixels gives mapid range **[1347935, 1593647]** (claim: identical) and puts
Ibamaya 1405272 → (15,54), Gokura 1524045 → (44,43), Iwakuni 1519945 → (43,39) — **all three land on
land cells**, exactly as claimed. Only nit: y spans **[291,360]**, not [290,361]. Web has all three
hardcoded towns (`§1t136s0§.as:140,144,148`); android has only two. **Overturn not upheld:**
`| **world-map** | 63x72 bitmap … |` does not exist in `REBUILD_READINESS.md` (no "world-map" row, no
"63x72", no "unreconciled"); the live neighbour is `world-exploration` (line 132) → "world map/geography".

### 5. `bindata/trap-duty-cycle-domain-measured` — HELD · overturn NOT upheld
I re-parsed `93_1t4647s0.bin` against its own schema comment (`:6-18`) and reproduce the domains
**exactly**: onDuration {0,24,48}; offDuration {0,24,36,48,60,96,1000}; startInterval
{0,6,8,12,16,18,24,30,32,36,42,48,54,64,72}; **gcd = 2**. Line cites `:451`, `:92-94`, `:99`, `:106`,
`:198-206` are verbatim. I zlib-decompressed `reference/decrypted/shs3_payload_decoded.swf` and parsed
the header myself: **CWS v17, rect [0,16000,0,13800], fps 24.0, 6 frames** — all four facts confirmed.
Minor variance: I count **81** non-multiples of 24, not 75 (row-filter dependent); the point is unaffected.
Overturn not upheld: `ledger_text` is null and `REBUILD_READINESS.md` contains no trap/duty-cycle sentence.

### 6. `bindata/warhex-14-states-not-7` — HELD · overturn NOT upheld
`WarHex.as:11` → `:37` carries exactly 14 `public static var HEX_*` constants with values
0-9,11,12,13,15 (10 and 14 unused) — verified line by line. `WarHexUI.as:175` `this.ht = 6;`,
`:176` `this.wt = 6;`, `:253` `hex.x = 90 + xpos * 55;`, `:254` `hex.y = 92 + ypos * 55;` — all exact.
**Overturn not upheld:** there is no `| **war-room** | board topology — BLOCKER |` row in
`REBUILD_READINESS.md`; the live neighbour is `meta-social` (line 131) → "map board".

### 7. `combat-core/300-200-100-is-base-not-ceiling` — HELD as a PARTIAL lead · **overturn UPHELD**
`InputManager.as:51` = 200 and the three mastery-0 multipliers are exact, and the finding honestly
flags that v0.717 yields 280/200/100. `REBUILD_READINESS.md:155` — "reach 300/200/100 are MASTERY-9
CEILING values, not base" — **falls**: Light's reach multiplier is mastery-INDEPENDENT in both builds
(`§1t99s0§.as:3094`, `MCSPlayer.as:3030`), so 300 cannot be a mastery-9 ceiling, and Balanced/Heavy
only *increase* with mastery, so 200/100 must be the mastery-0 row. Caveat recorded: 200 is
`InputManager`'s compile-time initialiser, overwritten by `setStance` on every battle init
(`§1t99s0§.as:3156-3158`), so it is not a gameplay "base"; the exact 300 reproduces only in android.

### 8. `combat-core/36-was-not-a-crit` — HELD with a measured correction (minor) · overturn NOT upheld
I opened `t1961.900.png`, crop (100,940)-(620,1080) ×3: **HP 10/20 green, Chi 20/20 blue, third bar an
empty brown track reading "CANNOT CHANGE STANCE"** — exactly as claimed, so that red 36 cannot have
been a crit (crit requires `reload == maxreload`, `§1t99s0§.as:3272`). **But the quoted evidence is
wrong:** "bar_px = 0 (0%) on all 18 frames" fails on two of them. `t1958.967.png` shows a white run
x **251–333** (≈83/268 px ≈ 31%) and `t1970.333.png` x **251–318** (≈68/268 ≈ 25%). The inference
survives (31% ≠ full); the stated measurement does not. **Overturn not upheld:** the named sentence
(`session11-raw/damage-ttk.txt:12`, echoed at `COMBAT_MEASUREMENTS.md:642`) ends "…**so it is an
inference, not a measurement**" — the ledger already concedes exactly this, and `36/27 = 1.333` is
still arithmetically true.

### 9. `combat-core/basereload-is-dead-code` — HELD with a correction (minor) · no ledger overturn claimed
Confirmed where it matters: `MCSPlayer.as:239` `this.maxreload = 5 * 24;` (a constant, not derived from
`baseReload`) and `:1158-1160` `if(this.reload < this.maxreload) { ++this.reload; }` — refill is a flat
+1/frame, SPD-independent. Web twin at `§1t99s0§.as:1203-1205`. **Correction:** "[no read site anywhere
in 2,700+ classes]" is literally false — `EnemyClone.as:49` `this.baseReload = owner.baseReload;` reads
it (propagation only, still never consumed). `48 + SPD*6` is computed at `EnemyPlayer.as:754`,
`EnemyElite.as:99`, `FriendlyElite.as:49` and web `§1t1523s0§.as:2276`, and dies there.

### 10. `combat-core/crit-is-1.3-gated-on-full-slash-meter` — HELD · **overturn UPHELD**
`§1t99s0§.as:3272-3276` verbatim: `if(reload == maxreload) return dmg * 1.3 + STAT_CRITICALDMG;`.
Meter identification exact: `:3162` `reload -= 48` on stance change; `:3295` `if(reload == maxreload)
reload = 0;`; `:3302/3306/3310` `-slashUsage/2` (Light) · `-slashUsage` (Balanced, Reversed) ·
`-slashUsage*1.5` (Heavy, Dual). Android divergence at `MCSPlayer.as:3215-3222` (×1.2 / ×1.5 Light) is
real and correctly flagged. `REBUILD_READINESS.md:190 ②` ("crit 1.3 vs 3 final — *read one crit popup*")
falls: the answer is in the shipped source and needs no popup. Note the ledger already carried
"crit 1.3×" as READY at line 189, so the real delta is the **gate**, not the multiplier.

### 11. `combat-core/crit-is-flat-1.3` — HELD, minor cite slip · **overturn UPHELD**
The 1.3 lives at `§1t99s0§.as:3274`; the cited range `3271-3273` stops one line short (it brackets the
`if` at 3272 but not the return). The second cite carries the claim on its own and is **exact**:
`§1t5957s0§.as:2727 / :2736 / :2745` each set the displayed crit multiplier to **1.3** for Light,
Balanced and Heavy respectively — an independent, stance-by-stance confirmation from the stats UI.

### 12. `combat-core/crit-meter-is-6-seconds` — HELD · **overturn UPHELD**
`§1t99s0§.as:249` `maxreload = 8 * 24` (=192); `§1t113s0§.as:328` `(param1 - 48) / (param2 - 48)` →
144 ticks of visible travel = **6.000 s at 24.0 fps** (header-verified); `§1t99s0§.as:3060`
`if(reload < 48) return;` is the stance gate, and `§1t113s0§.as:336-341` prints the caption exactly
when the displayed fraction is 0 — so "CANNOT CHANGE STANCE" at displayed 0% is a source-level fact.
I re-measured the frames myself: `crit-focus/t1081.100` edge **258** → `t1082.100` edge **303** = 45 px
in 1.000 s; `t1004.800` **281** → `t1005.000` **290** = 9 px in 0.200 s. Both = 45.0 px/s. Blocker ⑤
falls (it is source-recoverable, no footage needed).

### 13. `combat-core/crit-track-268px-six-seconds` — HELD · **overturn NOT upheld**
Every number reproduces. My own scan of `t2175.933.png` rows 1036/1040 gives the track **x 246…512**
(268 px). `focusbar_scan2_videoB_fps15.tsv` rows: edge **247 @ t2170.0000** → edge **512 @ t2176.0000**
= **6.000 s** — exact. Rate `t1082.100`→`t1082.900`: I read edges 303→**340** (37 px / 0.8 s = 46.3),
one px off the claimed 339/36/45.0; immaterial. **The overturn is inflated.** The sentence it names —
"Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end)" — appears
**nowhere** in the repo outside the gauntlet worklist (`grep -rn --exclude-dir=gauntlet "17.3%/s" docs/`
and `"5.8 s"` both return nothing). The standing measurement already says **6.00 s / 16.67 %/s**
(`session11-raw/crit-focus.txt:20`, `COMBAT_MEASUREMENTS.md:621`) and the track already measured
269-270 px, not "measured on an empty bar". This finding **confirms** the ledger; it does not overturn it.

### 14. `combat-core/dual-reversed-reach-inverted` — HELD · overturn NOT upheld
`§1t99s0§.as:3131` REVERSED (`§1t12224s0§` = 4) `= base * 1.4`, no floor; `:3142` DUAL
(`§1t12223s0§` = 3) `= base`, floored at 100 (`:3143-3145`). Constants at `:26,28,30,32,34`; the quote
labels them 33/35, which are the **android** line numbers (`MCSPlayer.as:33` DUAL=3, `:35` REVERSED=4) —
both files are inside the cited `:27-35` range, so this is not a mis-cite. **Overturn not upheld:**
blocker ① asks for the reach cap *in stage px*; this fixes a Reversed/Dual swap and does not itself
supply the base-length formula that sets the scale. ① does die — on findings 1/16's chain, not this one.

### 15. `combat-core/early-mob-hp-distribution` — HELD · **overturn UPHELD**
My own parse of `npcdata.xml`: 495 `<npc>`, **22** with lvl ≤ 2, HP histogram **{1:×17, 2:×1, 5:×4}**,
and ids **7, 8, 9, 10** all `<hp>5</hp><defense>3</defense>` — identical to the claim. id 6 at
`:146-152` is `lvl 2 / hp 1 / attack 5 / defense 3`. The damage law is confirmed:
`MCSPlayer.as:3415-3418` `damage -= getDefense(); if(damage < damageObj.getMinDamage()) damage =
damageObj.getMinDamage();` and `Damage.as:150-162` returns `1 + piercingDamage` for attackerlvl ≤ 10.
Starter weapon = item **13002** "Branch" (`strings.json["4041"]`), mindamage 1 / maxdamage 2 — so 5 HP
takes 5 strokes. `REBUILD_READINESS.md:190 ③` closes from payload, no video read needed.

### 16. `combat-core/formula-resolves-c2-balanced-gap` — HELD · **overturn NOT upheld**
The c-2 quotes are verbatim (`COMBAT_MEASUREMENTS.md:396-398` table rows, `:403` warning). The arithmetic checks:
base(SPD 1, dan 0) = 120 + floor(90·1/21) = **124**, inside the measured 116–131 Balanced band; Heavy =
max(124 × 0.5, 100) = **100**, on the measured 97–103 plateau — the clamp at `§1t99s0§.as:3117-3119`,
not a mastery ceiling. **But the named sentence survives.** "⚠️ The Balanced gap cannot be resolved
**from this footage**" is a claim about the footage's evidentiary limits, and this finding resolves it
from *source*. Read in context (`:403-409`) the sentence is a method warning worth keeping. What should
actually be rewritten is the c-2 verdict cell ("Balanced ❌ NOT CONFIRMED") and c-0 ("mastery-9
CEILINGS") — different sentences.

### 17. `combat-core/full-reload-crit-is-1p3-in-v0717` — HELD · **overturn UPHELD**
`§1t99s0§.as:3272-3276` verbatim. Symbol resolution verified end to end: `§1t1523s0§.as:2269` passes
`§1t7358s0§(§1t1243s0§)` as param6 of `§1t4445s0§`, and `§1t99s0§.as:271-278` binds param6 to
`this.§1t1243s0§` — the android twin `MCSPlayer.as:249-256` names that same param6 **STAT_CRITICALDMG**.
`:3162` and `:3169` confirm `§1t4414s0§`/`§1t4415s0§` = reload/maxreload. Android v0.682 split
(`MCSPlayer.as:3215-3221`) correctly excluded from the shipped claim.

### 18. `combat-core/injured-buff-halves-reach` — HELD, and I extend it · overturn NOT upheld
`MCSPlayer.as:214-223` is verbatim. **The cite is android-only but the fact is not:** the web build
carries the identical branch at `§1t99s0§.as:221-223`, where `:223` is `this.§1t4420s0§ *= 0.5;` and
`§1t4420s0§` is baseSlashLength (param10 of `§1t4443s0§`, bound at `:194`). So this holds in v0.717 too.
**Overturn not upheld:** blocker ① asks for the reach cap per stance; a status-effect modifier on the
base does not supply it.

### 19. `combat-core/mastery-caps-at-ten` — HELD · **overturn UPHELD**
`§1t99s0§.as:3255-3271` verbatim: Light `×(0.5+0.4·M·0.1)`, Balanced `×(1+0.2·M·0.1)`,
Heavy/Dual/Reversed `×1.4`. My own parse of `skilldata.xml`: skills 1000 (lines 3-80), 1001 (81-159),
1002 (160-238) each carry **exactly ten** `<level>` blocks with `<value>` 1…10. At M = 10 the three
multipliers are **0.9 / 1.2 / 1.4** — the wiki table, reproduced to the digit. `REBUILD_READINESS.md:155`
says **MASTERY-9**; the ceiling is mastery-**10**, so the sentence is false as written. Its next clause
("a level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4") is *confirmed* as the mastery-0 row.

### 20. `combat-core/mastery-is-ten-level-skill` — HELD · **overturn UPHELD**
`MCSPlayer.as:3174/3175/3176` (canFlipUp ≥3, canDeflect ≥4, canLaunch ≥5 on `balancedMastery`) and
`:3182/3183/3184` (heavy: canLaunch ≥3, canDeflect ≥4, canStab ≥5) are exact; web twins at
`§1t99s0§.as:3231-3233` and `:3239-3241` are exact. Ten-level ladder confirmed as above. The citelint
`QUOTE_UNVERIFIED` is caused by an inline annotation (`// strings.json 6000 = 'Light Stance Mastery'`)
parked on a `balancedMastery` line — sloppy placement, but the lookup itself is right
(`strings.json["6000"]` = "Light Stance Mastery" = skill 1000's `<displayname>`).

### 21. `combat-core/popup-animation-and-black-variant` — HELD · **overturn UPHELD**
I built the five-tile sheet at crop (780,480)-(1180,680) ×2 and looked at it: a dark-red **"1"** above
the left enemy at t125.350, higher and larger at .417/.450; at t125.467 a fresh dark-red **"2"** *and a
BLACK "2"* over the GUEST/JINBEI pair; both much larger and higher at t125.733. Exactly as described.
`TextProjectile.as:20` `ttl = 12;`, `:23` `this.velY = -5;`, `:39-45` `if(ttl < 10) { scaleX += 0.1;
scaleY += 0.1; if(ttl < 4) { alpha -= 0.25; } }` — 12 ticks at 24 fps = 0.5 s, 60-unit rise, ≈1.9×
final scale. Note the cite range `:17-25` covers ttl/velY only; the scale/alpha half of the quote is at
`:39-45` — an under-cite, not a mis-cite. `REBUILD_READINESS.md:235 ③` falls.

### 22. `combat-core/popup-colour-is-a-semantic` — HELD (strongest A1 in the packet) · overturn NOT upheld
I reproduced **both** stated pixel modes. `t1960.000.png` crop (680,480)-(1000,760) ×3 shows a grey
**"2"** fading directly above the player tagged **GUEST** (yellow name plate); the glyph's modal pixels
are **(140-149, 156-160, 180-185)** — no red dominance, a black glyph alpha-fading over sky.
`t1961.900.png` crop (470,580)-(680,700) ×5 shows a red **"36"** over **JINBEI (4)**'s half-empty HP
bar, core modal **(163, 14, 0)** — the claim's exact triple. Source agrees:
`MCSPlayer.as:3542` colour `0` when `controlledBy == 0` (the victim is the player), `:3546` colour
`10027008` otherwise; element colours at `:3551/3555/3559/3563` = 16737792 / 13421772 / 26367 / 6697728;
chi at `:1633` = 3394815; seppuku uses colour 0 at `:709` and `:724`. All line numbers exact.
**Overturn not upheld:** the `ledger_text` is another agent's claim sentence ("damage popups spawn at
(mcs.x, mcs.y-100) in 0x990000 …"), not a `REBUILD_READINESS.md` sentence — `grep` for `mcs.y - 100`
outside `docs/gauntlet` returns nothing. The live sentence this bears on is RR:235 ③.

### 23. `combat-core/raw-frames-show-full-crit-meter` — HELD · **overturn UPHELD**
`t1746.733.png`, crop (240,1022)-(525,1052) ×6: the third bar is **solid white, unbroken, no text**, to
a thin brown sliver at the right end (white run x 245–508 of a 245–513 track). `t1747.000.png`, same
crop, 0.267 s later: **100% white with "CRITICAL HIT" in dark caps** — I read the letters. The wide HUD
crop confirms **HP 11/20 green, Chi 47/47 blue** on both, with a "150% DAMAGE" buff below.
`t2175.933.png` is a third instance (HP 4/20, Chi 47/47). `session11-raw/crit-focus.txt:2` — "the OG
has ... NO Critical meter at all" — and `:40` — "the bar never once reached full (max 67.7%)" — both
**fall**. Standing invariant invoked: **the measurement doc and the frame disagree; THE FRAME WINS.**
(The target sentence lives in the session-11 fidelity ledger, not `REBUILD_READINESS.md` — fix it there.)

---

## New findings (unclaimed by anyone)

**NF-1 — the web stage is 800×690, not 800×480.** Parsed headers of every SWF in `reference/`:
`shs3.swf`, `shs3preloader.swf`, `shs3_payload_decoded.swf`, `shs3_binarydata_9_decrypted.swf` all
declare `rect [0,16000,0,13800]` twips = **800×690 px @ 24.0 fps**. Only
`shs3_android_payload_decoded.swf` declares **800×480**. `REBUILD_READINESS.md:118` and §3 item 12
state "native canvas is **800×480 (5:3)**" without qualification — that is the android figure.
`ui-hud` blocker ① ("aspect-ratio truth … read `stage.stageWidth` in a build") is answerable from bytes.

**NF-2 — v0.717 and v0.682 disagree on BOTH stance tables.** Reach: web Light ×1.4 / Reversed ×1.4 vs
android ×1.5 / ×1.5, and the mastery term is `·M·0.1` (web) vs `·M·0.01` (android). Damage: web
`0.5+0.4M·0.1 / 1+0.2M·0.1 / 1.4` vs android `0.5+0.5M·0.01 / 1+0.5M·0.01 / 1.5`. With a 0-10 mastery
ladder the android form barely scales at all. **Any stance number sourced from `MCSPlayer.as` is
v0.682 and must not be shipped as v0.717.**

**NF-3 — the meter constants split too, and the frames pick the web one.** Web `maxreload = 8*24 = 192`
with display `(reload-48)/(192-48)` → 144 ticks = **6.000 s**; android `maxreload = 5*24 = 120` with
`(reload-24)/(120-24)` → 96 ticks = **4.000 s**. The frame-measured fill is 45.0 px/s over a 268 px
track = **5.96–6.00 s**, so the footage independently selects the WEB constants. That is the cleanest
cross-build parity datum in the repo and it is positive for v0.717.

**NF-4 — the world map bitmap is in the repo and is byte-checkable.**
`reference/extracted/android/110_Mobile_MapBitmapData.bin` is a 272-byte GIF89a, 63×72, with exactly
**735 non-black pixels**. The "735 territories" figure is now measured, not inferred.

**NF-5 — `InputManager.maxDistance = 200` is not a gameplay base.** It is a compile-time initialiser,
overwritten by `setStance` on every battle init (`§1t99s0§.as:3156-3158`, `MCSPlayer.as:3092-3094`).
Any derivation of the wiki's 300/200/100 that treats 200 as "the shipped default slash budget" rests
on a value the player never plays at.

**NF-6 — two frames in the damage-ttk crit window are NOT empty.** `t1958.967.png` focus bar x251-333
(≈31%) and `t1970.333.png` x251-318 (≈25%). Any future "the bar was zero all fight" statement about
that window is wrong; the correct statement is "never full, so never a crit".
