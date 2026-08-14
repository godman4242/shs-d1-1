# CRITIC — combat-core — LENS 1 (THE CITE LENS)

Blind review. I did not see the surveyor's reasoning, only its output. Every verdict below
carries an artifact **I opened myself**.

Reviewed: **20 claims — 14 upheld · 6 refuted** (5 of the 6 fall out of one root cause).
**7 new findings**, one of which is the largest single unlock in this lane.

---

## ⛔ ROOT CAUSE — THE WEB BUILD v0.717 IS FULLY CROSS-READABLE, AND IT DISAGREES WITH ANDROID

The surveyor's `combat-core/build-version-parity` claim says, verbatim:

> "The web payload's own AS3 is obfuscated (`reference/decompiled/shs3_payload/scripts/§1t51s0§/`,
> 5 files) and cannot be cross-read."

**That is false, and I disproved it in four commands.**

`reference/decompiled/shs3_payload/scripts/` holds **1,079 exported classes** (`payload_export.log`
line 4: `Exported script 1/1079`). The identifiers are obfuscated to `§1tNNNNs0§`; **every numeric
literal is intact.** The `§1t51s0§/` package the claim cites is not the game at all — it is the
PlayerIO API client (`BinarySerializer.as`, `SWFReader.as`, `Converter.as`, `Utilities.as`,
`§1t52s0§.as`, whose `endpoint` getter returns `"https://api.playerio.com/api"`).

The real classes, identified by first-party literals:

| Web class | Is | Proof I opened |
|---|---|---|
| `§1t1523s0§.as` | `StatsManager` | `:36  public static var §1t9323s0§:Number = 0.717;` — **the web client version** |
| `§1t99s0§.as` | `MCSPlayer` | `:9 standingRange:int = 50` · `:11 jumpThreshhold:int = 100` · `:15-19` slash speeds 50/40/30 |
| `§1t113s0§.as` | `BattleUI` | `:121 this.§1t5169s0§.text = §1t1521s0§.getString(175)` (= "Critical Hit") |
| `§1t67s0§.as` | `Damage` | `:303` serialises `damage + "," + attackerlvl + "," + stance + …` |

Consequence: **this lane never needed the android build for its headline numbers**, and four claims
that ported android constants ported the *wrong* ones. Side-by-side, from files I opened:

| Constant | ANDROID v0.682 | WEB v0.717 (SHIPPED) | Live repo config |
|---|---|---|---|
| light reach mult | `× 1.5` (`MCSPlayer.as:3030`) | **`× 1.4`** (`§1t99s0§.as:3094`) | `reach.ts lightMult 1.4` ✅ |
| balanced reach | `(1 + 0.5·m·0.01)` = 0.005/m (`:3041`) | **`(1 + 0.2·m·0.1)` = 0.02/m** (`:3105`) | `balancedPerMastery 0.02` ✅ |
| heavy reach | `(0.5 + 0.5·m·0.01)` = 0.005/m (`:3052`) | **`(0.5 + 0.4·m·0.1)` = 0.04/m**, floor 100 (`:3116-3119`) | `heavyPerMastery 0.04`, floor 100 ✅ |
| heavy/dual/rev damage | `× 1.5` (`:3213`) | **`× 1.4`** (`:3270`) | — |
| **crit** | `1.5` light / `1.2` other (`:3217-3221`) | **flat `× 1.3 + STAT_CRITICALDMG`** (`:3274`) | `combat.ts CRIT_MULT 1.3` ✅ |
| `maxreload` | `5 * 24` = 120 (`:239`) | **`8 * 24` = 192** (`§1t99s0§.as:249`) | — |
| reload bar display | `(reload−24)/(max−24)` (`:1168`) | **`(reload−48)/(max−48)`** (`§1t113s0§.as:328`) | — |

**Identical in both builds** (so these ARE safe to promote to plain CONTRACT): the base-reach
formula `int(120 + Math.floor((90 + 5·dan)·SPD/(20+SPD)))` (`§1t1523s0§.as:2344-2348`),
`standingRange 50`, `jumpThreshhold 100`, `runSpeed 12`, slash speeds `50/40/30`,
`getDefense → defense * 0.8` (`§1t99s0§.as:3286-3290`), `deductReloadBar`'s `÷2 / ×1 / ×1.5`
(`:3299-3311`), `bonusReload += 6` (`:3320`), `slashusage < 48 → 48` (`§1t1523s0§.as:2353-2357`),
starter weapon `new Item(13002,1)` (`§1t1523s0§.as:2246`), damage roll `minDamage + random*range`
(`:3258`), and the mastery unlock ladder 3/4/5 (`§1t99s0§.as:3221-3244`).

### The crit-meter period is SOURCE-HELD, not frame-only — and it is exactly 6.00 s

`§1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;` → maxreload **192**
`§1t113s0§.as:328  var _loc3_:Number = (param1 - 48) / (param2 - 48);` → displayed span **144 ticks**
`§1t99s0§.as:1203-1205  if(reload < maxreload) { ++reload; }` → **+1 per frame**
SWF header of `reference/decrypted/shs3_payload_decoded.swf` → **frame rate 24.0**, version 17,
6,880,328 bytes (I parsed the header: `CWS`, RECT, then the 8.8-fixed FrameRate field).

144 ÷ 24 = **6.000 s empty→full.** The repo's own frame measurement
(`docs/research/fidelity/session11-raw/crit-focus.txt`) says *"EMPTY TO FULL = 6.00 s (three
independent 60fps regressions agreeing to 0.5%: 6.01 / 6.00 / 5.98 s)"*.

**The source and the frame agree to 0.0%.** There is no doc-vs-frame conflict here at all. The
apparent conflict was an artifact of reading the wrong build.

---

## VERDICTS

### 1. `combat-core/reach-cap` — **UPHELD** (minor)
`StatsManager.as:1915-1919` resolves exactly; quote verbatim. `getBaseSlashLength` at `:1905-1912`
shows SPD is `STAT_SPEED + bonus`, ×1.5 under `BUFF_SPEED`. Scale is real: `StatsManager.as:80,82`
`stageWidth:int = 800` / `stageHeight:int = 480`, enforced at `InputManager.as:231` (`mouseY > 480`)
and `:348`. L1 base 124 checks out (`120 + floor(90·1/21)`).
*Minor:* the cite `InputManager.as:341` is `var i:* = undefined;` — the conversion is `:342-343`.
*Minor:* not novel — `src/config/reach.ts`'s header comment already carries this exact formula.
*Bonus:* it is also verbatim in the WEB build (`§1t1523s0§.as:2344-2348`), so it can be plain CONTRACT.

### 2. `combat-core/reach-stance-mults` — **REFUTED (fatal)**
The android quote is verbatim-correct (`MCSPlayer.as:3030/:3041/:3052-3055`). The **conclusion is
wrong and destructive**: `§1t99s0§.as:3094/:3105/:3116-3119` in the shipped v0.717 build give
`× 1.4`, `× (1 + 0.2·m·0.1)` = 0.02/m, `× (0.5 + 0.4·m·0.1)` = 0.04/m floored at 100 — which is
**exactly** `src/config/reach.ts`'s `lightMult 1.4`, `balancedPerMastery 0.02`, `heavyPerMastery
0.04`, `heavyFloor 100`. Those three constants are **correct**, correctly labelled CONTRACT-SRC, and
are live in `src/core/mastery.ts:46-48`. Acting on this claim would break three right numbers.

### 3. `combat-core/reach-is-arclength` — **UPHELD** (minor)
`InputManager.as:198 distanceLeft = maxDistance` ✓; the quoted arc-length drain is at `:361-367`
(cited `:352-366`, ~5 lines low but unambiguous). Taper confirmed at `:360`:
`lineStyle(thickness - thickness * ((maxDistance - distanceLeft)/maxDistance), 10027008, …)` with
`thickness = 8` (`:57`), `largestUnit = 20` (`:59`), colour `10027008 = 0x990000` ✓.
Per-stance budget wired at `MCSPlayer.as:3094 InputManager.setMaxDistance(this.slashLength)` ✓.

### 4. `combat-core/crit-multiplier` — **REFUTED (fatal)**
Android quote verbatim-correct at `MCSPlayer.as:3215-3223`. But *"BOTH candidates were wrong … never
1.3"* is false for the game that shipped: `§1t99s0§.as:3272-3275` —
`if(reload == maxreload) { return maxDamage * 1.3 + STAT_CRITICALDMG; }` — **flat 1.3, no stance
split**. That is precisely ledger blocker ②'s first candidate and precisely `src/config/combat.ts`'s
live `CRIT_MULT = 1.3`. The 1.5/1.2 split is an android-only retune.
*Kept:* the flat additive `STAT_CRITICALDMG` term and the `InventoryUI.as:1946/:1955/:1964`
tooltip mismatch (I opened it — light 1.2, balanced 1.5, heavy 1.5) are both real, in android.

### 5. `combat-core/crit-gating` — **REFUTED (material)** — structure right, two numbers wrong
The mechanism is exactly as claimed and I verified every piece: deterministic full-meter gate,
`deductReloadBar()` verbatim at `MCSPlayer.as:3240-3263`, `++reload` inside `override public function
update()` (enclosing fn at `:275`) at `:1160`, `nextStance()` early-return `reload < maxreload/6` at
`:2977`, switch tax at `:3098-3108`, `bonusReload += 6` at `:3267`, `slashUsage` floor 48 at
`StatsManager.as:1921-1930`. **Two defects:**
- **`maxreload = 5×24` is the android value.** The shipped web build is `8 * 24` = **192**
  (`§1t99s0§.as:249`, same slot in the same `initPlayer`). Building 120 makes the meter 60% too fast.
- **"refill 48 + SPD·6" does not exist.** `getBaseReload()` (`StatsManager.as:1839-1842`) is passed
  into `initPlayer` and stored at `MCSPlayer.as:190` — and **never read again**. I grepped the whole
  android script tree: `baseReload` appears only at `MCSPlayer.as:105,182,190`, `EnemyClone.as:49`,
  and three `48 + xml.speed * 6` producers (`EnemyPlayer.as:754`, `EnemyElite.as:99`,
  `FriendlyElite.as:49`). It is a dead field in both builds. The refill is a flat +1/frame.

### 6. `combat-core/crit-meter-exists-in-web-build` — **UPHELD, and strengthened**
I re-cropped `m_nearfull.png` at 50% and confirmed everything claimed. But that file is a **derived
two-panel montage** — a weak cite. I found its raw sources by scanning all 309 1920×1080 frames under
`reference/frames/session11/` for a full white run on row y=1032:
- `gap-focus-trigger/t1746.733.png` — bar **99.2%**, no text (crop `(150,940)-(620,1070)` @3×: HP
  11/20, Chi 47/47, third bar white to a 2 px brown sliver)
- `gap-focus-trigger/t1747.000.png` — bar **100%** with **"CRITICAL HIT"** printed across it, same
  HP 11/20 and Chi 47/47 (same crop)
- `gap-focus-trigger/t2175.933.png` — a third full-bar frame
Consumption confirmed by my own pixel scan: `t1003.933.png` has **zero** white px on row 1032;
`t1004.000.png` has a 2 px sliver at x=246-247.
Web-side code corroboration the surveyor did not have: `§1t113s0§.as:110`
`"<font color='#000000'>" + getString(175) + "</font>"` and `:121`.
**This kills SESSION-11's *"the bar never once reached full (max 67.7%)"* and *"OG has NO Critical
meter"* outright** (`docs/research/fidelity/session11-raw/crit-focus.txt`, `docs/gauntlet/L0/systems/
skills-meters.md:495`).

### 7. `combat-core/crit-meter-fill-rate` — **REFUTED (material)** — pixels right, conclusion wrong
I reproduced the pixel edges independently (PIL, row y=1032, white mask r,g>180 / b>170):
`t1004.800 → 281` ✓ · `t1005.000 → **291**` (claim says 290) · `t1082.100 → 304` ✓ ·
`t1082.900 → 340` ✓ · `t3779.000 → 370` ✓. Track right edge **511** confirmed independently from the
Chi bar at 47/47 and 31/31 (`t1003.000` row 1000: blue 247→511).
But the claim's *conclusion* — *"the period constant must come from the frame, not the android build …
This is the concrete proof that v0.682 combat tuning ≠ v0.717"* — is half wrong. The divergence is
real, but the period is **source-held for the web build at exactly 6.00 s** (192 ticks, 48 hidden,
+1/frame, 24.0 fps from the payload SWF header). "Build 5.8 s" should be **6.00 s**.
Two further defects: (a) the framing *"THE MEASUREMENT DOC AND THE FRAME DISAGREE"* is backwards —
the repo's measurement doc already says 5.9–6.0 s and **agrees** with the frame
(`docs/research/fidelity/COMBAT_MEASUREMENTS.md` f-6, `DIVERGENCES.md:313`); the disagreement was
source-vs-source. (b) `t3779.000` is 2,700 s away from the `t1082.x` pair and cannot be part of one
"monotonic" ramp; only the 0.8 s pair (304→340 = 17.1 %/s) is a sound rate.

### 8. `combat-core/multi-target-full-damage` — **UPHELD**
`NPCManager.as:1204-1299` verbatim, both loops (`enemyList` then `neutralList`), `!enemy.gotHitFlag`
guard, one shared `Damage` object, `dist*dist < 40000` pre-filter, `comboCount++` per distinct enemy.
`StatsManager.as:4298-4306 addCombo` caps at 999 ✓.

### 9. `combat-core/hit-registration-instant-at-endslash` — **UPHELD**
`endSlash()` at `MCSPlayer.as:2767-2816`, quote verbatim. Exclusivity claim verified by grep: the
only `NPCManager.checkHit(` / `checkPlayerHit(` call sites in the entire android tree are
`MCSPlayer.as:2796, :2800, :2809, :2813`. `deductReloadBar()` is charged at `:2778`, in the same call ✓.

### 10. `combat-core/pass-through-dash` — **UPHELD** (minor: lane_impact is stale)
Source model confirmed end to end: `initSlash` sets `destX = firstPt.x` (`:2408`), branches on
`Math.abs(destX - posX) < standingRange` → `SLASH_STATE` else `RUN_STATE` (`:2476-2500`); `startSlash`
resets `destX` to the **last** point (`:2676`) and derives `velX/velY` from `dist/slashSpeed`
(`:2693-2698`); Shunpo at `:2700-2705` ✓. Same constants in the web build.
*Stale:* `src/config/combat-sim.ts:69-76` **already deleted** `DASH_SLASH_PX` and already ships
`DASH_SPEED_PX_PER_FRAME = {light:50, balanced:40, heavy:30}` as CONTRACT-SRC; `src/core/Sim.ts:664`
already travels to the stroke's last point. Only `docs/research/REBUILD_READINESS.md:98,191` still
carries `DASH_SLASH_PX=127`.

### 11. `combat-core/gesture-classifier` — **UPHELD**
`InputManager.as:268` verbatim; `lengthThreshhold = 4` (`:53`), `distThreshhold = 400` (`:55`) → the
20-unit reading is right (it is squared). Tap dead-zone `dist*dist < 625` → 25 units at
`MCSPlayer.as:2300-2304` ✓. Peaceful demotion `:2260-2273` ✓. Input buffer `:2275-2285` ✓.

### 12. `combat-core/slash-type-map` — **UPHELD**
`MCSPlayer.as:2433-2456` verbatim. Nine constants confirmed at `:37-53`
(HOR 0, JUMP 1, DROP 2, UP 3, AIR 4, LAUNCH 5, DOWNSTAB 6, HOR_SLASHDOWN 7, HOR_SLASHUP 8).
`jumpThreshhold = 100` at `:11` ✓. Launcher binding `Damage.LAUNCH_AIR` at `:2781-2783` ✓.

### 13. `combat-core/damage-formula` — **REFUTED (material)**
The *shape* is right and important — `MCSPlayer.as:3198-3214` verbatim, damage IS an RNG roll
(`minDamage + Math.random() * damageRange`), and the reach/damage permutation is real. But every
stance coefficient given is android-only. Web `§1t99s0§.as:3258-3271`:
light `(0.5 + 0.4·m·0.1)` = **0.04/m** (not 0.005), balanced `(1 + 0.2·m·0.1)` = **0.02/m** (not
0.005), heavy/dual/reversed **`× 1.4`** (not 1.5). `StatsManager.as:1863-1888` / `:1890-1903` for
`minDamage` / `damageRange` and the broken-weapon collapse are correct as cited.

### 14. `combat-core/mitigation-and-part-rule` — **UPHELD** (minor)
`NPC.as:429-462` verbatim (hat/head/neck → behead; weapon → `damage = 0; return false`), part search
descends `i = max-1 … 0` so top-most-first (`:301-320`) ✓, `gotHitCounter = 12` at `:462` ✓,
`canHit() → gotHitCounter == 0` at `:296-299` ✓. `Damage.as:150-172` four-band floor verbatim ✓.
Popup `ProjectileManager.createFloatingText(mcs.x, mcs.y - 100, damage, 10027008)` at `NPC.as:497` —
`10027008 = 0x990000` ✓.
*Minor over-statement:* a weapon-part hit only voids **that polyline point**; `NPCManager`'s `j++`
loop keeps testing the remaining points, so the stroke can still land elsewhere. "Parry" is stronger
than the code.

### 15. `combat-core/heavy-def-0.8` — **UPHELD**
`getDefense()` is at `MCSPlayer.as:3231-3238` (cited `:3226-3234`, ~5 lines low; content verbatim).
String 6005 verified in `docs/gauntlet/L0/index/strings.json` ✓. **Also verbatim in the web build**
(`§1t99s0§.as:3286-3290`) — promote to plain CONTRACT.

### 16. `combat-core/stance-triangle` — **UPHELD** (minor)
Strings 6001 / 6003 / 6005 verbatim in `strings.json`; binding verified in
`reference/extracted/skilldata.xml` — skill 1000 `<desc>6001</desc>` (`:4-6`), 1001 `<desc>6003</desc>`
(`:83-85`), 1002 `<desc>6005</desc>` (`:162-164`) ✓. `src/config/stances.ts:48-52 STANCE_BEATS`
matches ✓.
*Minor:* `strings.json` is the **android** `118_Mobile_Lang_EN.bin` table (§0 S0-3), not "the
payload's own string table". Label accordingly.

### 17. `combat-core/early-ttk` — **UPHELD**
`StatsManager.as:694-702` (HP/MAXHP 10, ATK 1, DEF 1, SPD 1) ✓; `:1830-1832` starter
`new Item(13002,1)` ✓ — and the same fallback in the web build at `§1t1523s0§.as:2246`.
`itemdata.xml:7906-7915` Branch `<mindamage>1</mindamage><maxdamage>2</maxdamage>` ✓;
`npcdata.xml:145-152` Thug lvl 2 / hp 1 / atk 5 / def 3 ✓; `:2473-2480` Duelist lvl 1 / hp 2 ✓.
Arithmetic re-derived: minDamage 2, range 1, roll 2, −DEF 3 → `Damage.getMinDamage()` band
`attackerlvl ≤ 10 → 1 + pierce` = 1 ≥ 1 HP ⇒ one-hit kill ✓.
*Minor:* the quote elides `<ai>3</ai>` from the Duelist row; *"every sampled lvl≤2 mob has 1-5 HP"*
is a sampling assertion I did not exhaustively verify across all 495 `<npc>` rows.

### 18. `combat-core/launch-unlock-levels` — **UPHELD, and strengthened**
`MCSPlayer.as:3164-3194` verbatim. **The web build is identical** (`§1t99s0§.as:3221-3244`), so this
is a genuine live-config bug in v0.717 terms too: `src/config/stances.ts:58-62` has
`heavy: 5`, source says heavy `canLaunch >= 3`. Reversed/Dual granting all five unconditionally
confirmed in both builds.

### 19. `combat-core/150pct-damage-is-a-buff` — **UPHELD**
I cropped it myself: `reference/frames/session11/crit-focus/t1003.000.png`, crop `(0,900)-(640,1080)`
upscaled 2× — visible: straw-hat portrait ring, HP **14/20** green, Chi **31/31** blue, third bar
carrying **"CANNOT CHANGE STANCE"** over an empty brown track, and **"150% DAMAGE"** in gold below.
`OverworldHUD.as:1402-1404 buffstr = "150% DAMAGE"` under `BUFF_ATTACK` ✓; string 4132 ✓;
`MCSPlayer.as:210-212 this.minDamage *= 1.5` (cited `:209-211`, one line low) ✓ — and the same at
`§1t99s0§.as:213`. Stance-gate corroboration is real and now stronger: `§1t113s0§.as:328-342` shows
the label is painted **exactly when the reload bar reads 0**.

### 20. `combat-core/build-version-parity` — **REFUTED (fatal)**
See the root-cause section. The premise is false; the "close-path" the claim defers was executable in
minutes and, once executed, flips claims 2, 4, 5, 7 and 13. STILL_UNHELD was the wrong answer here —
not because guessing was better, but because **the artifact was sitting in the repo unopened**.

---

## SCORE

**78 is not defensible in either direction as stated.** The lane is simultaneously *better* supplied
than the surveyor believes (the shipped build's source is readable, so most of these can be plain
CONTRACT rather than `CONTRACT-SRC-v0.682`) and *worse* delivered (four of its portable constants —
light reach mult, both mastery coefficients, crit multiplier, heavy damage mult, `maxreload` — are
android-only values presented as the answer). My read: **68** until the android/web split is
re-derived across the unit, then plausibly 88+.

## NEW FINDINGS FOR THE BOARD

1. **The web v0.717 AS3 is readable.** 1,079 classes under `reference/decompiled/shs3_payload/scripts/`.
   Obfuscated names, intact literals. This is the single biggest unlock available to L5 and it
   invalidates the `CONTRACT-SRC-v0.682` labelling policy this unit proposes.
2. **`maxreload` = 192 in the shipped build**, display hides the first 48 ticks, +1/frame @ 24.0 fps
   ⇒ **6.000 s** — matching the repo's own 6.00 s frame regression to three decimals.
3. **The payload SWF header is 24.0 fps** — first-party, no android borrowing needed.
4. **`getBaseReload()` (48 + SPD·6) is dead code** in both builds.
5. **Two raw frames show a full crit meter**, `t1746.733.png` (99%) and `t1747.000.png` (100%,
   "CRITICAL HIT") — SESSION-11's "never reached full / no Critical meter" is dead.
6. **`src/config/reach.ts` and `src/config/combat.ts` were already right.** Do not "fix" them.
7. **`src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy` is genuinely wrong** (5, source 3) in *both*
   builds — the one live-config bug in this unit that survives scrutiny.
