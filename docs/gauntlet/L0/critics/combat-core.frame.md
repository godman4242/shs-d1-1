# L0 CRITIC — combat-core — LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning, only its output. Every verdict below
carries an artifact **I** opened.

---

## HEADLINE: the survey read the WRONG BUILD, and said the right one was unreadable

The survey's claim 20 (`combat-core/build-version-parity`) states:

> "The web payload's own AS3 is obfuscated (`reference/decompiled/shs3_payload/scripts/§1t51s0§/`,
> 5 files) and cannot be cross-read."

**That is false, and it is the load-bearing error of the whole lane.**

```
$ find "reference/decompiled/shs3_payload/scripts" -name "*.as" | wc -l
    1079
```

`§1t51s0§` is one sub-package, not the directory. The web build's ActionScript is only
*partially* obfuscated: class and local names are mangled, but **every numeric literal is
intact and many identifiers survive verbatim** — `standingRange`, `jumpThreshhold`, `runSpeed`,
`lightSlashSpeed`, `balancedSlashSpeed`, `heavySlashSpeed`, `minDamage`, `damageRange`,
`slashUsage`, `defense`, `stance`, `controlledBy`, `thickness`, `maxDistance`, `Math.random`.

`§1t99s0§.as` **is the web build's `MCSPlayer`.** Its first 20 lines are android's
`MCSPlayer.as:5-22` with the names still on them:

```as3
// reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19   (WEB v0.717)
internal static var standingRange:int = 50;
internal static var jumpThreshhold:int = 100;
internal static var runSpeed:int = 12;
internal static var lightSlashSpeed:int = 50;
internal static var balancedSlashSpeed:int = 40;
internal static var heavySlashSpeed:int = 30;
```

The parity check the survey declared blocked took **four greps**. It overturns five of this
lane's own claims — and in three of them the survey called a **correct** repo constant wrong.

---

## THE PARITY TABLE (what I actually read, both builds)

| quantity | android v0.682 | **web v0.717** | `src/config` | survey said |
|---|---|---|---|---|
| reach base | `120+floor((90+5d)·s/(20+s))` | **identical** (`§1t1523s0§.as:2347`) | ✓ | ✓ correct |
| light reach | `×1.5` | **`×1.4`** (`§1t99s0§.as:3094`) | `1.4` ✓ | "reach.ts wrong" ✗ |
| balanced reach | `×(1+0.5·m·0.01)` | **`×(1+0.2·m·0.1)` = 1+0.02m** (`:3105`) | `0.02` ✓ | "4× too big" ✗ |
| heavy reach | `×(0.5+0.5·m·0.01)` | **`×(0.5+0.4·m·0.1)` = 0.5+0.04m** (`:3116`) | `0.04` ✓ | "8× too big" ✗ |
| heavy floor | `100` | `100` (`:3117-3120`) | `100` ✓ | ✓ |
| light damage | `×(0.5+0.005m)` | **`×(0.5+0.04m)`** (`:3262`) | — | android only |
| heavy/dual/rev damage | `×1.5` | **`×1.4`** (`:3270`) | — | android only |
| **crit** | `×1.5` light / `×1.2` other | **`×1.3` FLAT** (`:3272-3274`) | `CRIT_MULT = 1.3` ✓ | "never 1.3" ✗ |
| `maxreload` | `5*24 = 120` | **`8*24 = 192`** (`:249`) | — | "5×24" ✗ |
| meter display | `(r−24)/(max−24)` = 96 t | **`(r−48)/(max−48)`** = 144 t (`§1t113s0§.as:328`) | — | not read |
| stance gate | `reload < maxreload/6` | **`reload < 48`** (`:3060`) | — | "1/6 meter" ✗ |
| heavy defence | `×0.8` | `×0.8` (`:3286-3288`) | `1.25` ✓ | ✓ |
| slash speeds | 50/40/30 | 50/40/30 (`:15-19`) | ✓ | ✓ |
| stroke thickness/colour | 8 / `0x990000`, taper | identical (`§1t1541s0§.as:57,179,361`) | — | ✓ |
| i-frames | `gotHitCounter = 12` | `= 12` (`§1t68s0§.as:483`) | — | ✓ |
| damage floor bands | ≤10/≤20/≤30/else | identical (`§1t67s0§.as:199-209`) | — | ✓ |
| combo cap | 999 | 999 (`§1t1523s0§.as:4998`) | — | ✓ |

**`src/config/reach.ts` was right all along, and it was right because it was read out of the
WEB payload.** Its comment ("the curves at mastery 10 → 0.9/1.2/1.4") is not back-derivation
from a legacy triple; it is the v0.717 source evaluated at m=10. The survey accused it of
being fabricated and prescribed replacing three correct CONTRACT-SRC values with android ones.

---

## FRAME WORK (LENS 4 — I opened the images)

### F1 · `m_nearfull.png` — crit meter and label CONFIRMED
`reference/frames/session11/gap-focus-trigger/m_nearfull.png`, full 1800×780, viewed 1:1.
Upper panel: HP `11/20` green, Chi `47/47` blue, third bar white to ~97 % with a brown sliver,
no label. Lower panel: same HP/Chi, third bar 100 % white with **`CRITICAL HIT`** printed
across it. The survey's claim 6 is exactly what is in the image. **HELD.**

### F2 · `t1003.000.png` — the `150% DAMAGE` line CONFIRMED
Crop `(0,910)-(620,1080)` upscaled 3×. Visible: portrait ring, `14/20` green, `31/31` blue,
third bar reading **`CANNOT CHANGE STANCE`**, and `150% DAMAGE` in gold beneath.
`OverworldHUD.as:1404`, string 4132 and `MCSPlayer.as:209-211` all verified verbatim.
**HELD** — and the warning is a good one; heavy's own multiplier is 1.4-1.5.

### F3 · fill-rate — I reproduced the survey's five edges to the pixel, and found a sixth frame
Row scan at y = 1030/1032/1034/1036, x ∈ [240,534], threshold RGB > 170:

| frame | my last-white x | survey | fill % |
|---|---:|---:|---:|
| `t1081.100` | **259** | *(not used)* | 4.2 % |
| `t1004.800` | 281 | 281 | 12.5 % |
| `t1005.000` | 290–291 | 290 | 16.0 % |
| `t1082.100` | 304 | 304 | 21.3 % |
| `t1082.900` | 340 | 340 | 35.0 % |
| `t3779.000` | 370 | 370 | 46.4 % |

Track x = 248…511 (263 px) independently confirmed; at `t1003.000` HP `14/20` puts the green
edge at x = 433 → 70.3 %. The measurement is sound. `t1081.100 → t1082.100` gives a clean
**1.000 s** window: +45 px.

**But the answer is in the web source, not stuck at a frame estimate.** Both SWF headers read
**24.000 fps** (I parsed them: `shs3_payload_decoded.swf` CWS v17, 24.0 fps, stage 800×690;
`shs3_android_payload_decoded.swf` CWS v26, 24.0 fps, stage 800×480). The web bar is
`(reload − 48)/(192 − 48)` = **144 ticks = 6.000 s**. Predicted vs measured:

| window | Δt | measured | 6.000 s predicts | 5.845 s (survey) | 4.00 s (survey's "android") |
|---|---|---:|---:|---:|---:|
| t1004.800→t1005.000 | 0.200 s | 9 px | 8.8 | 9.0 | 13.1 |
| t1082.100→t1082.900 | 0.800 s | 36 px | 35.1 | 36.0 | 52.6 |
| t1081.100→t1082.100 | 1.000 s | 45 px | 43.8 | 45.0 | 65.8 |

6.000 s fits every window to ≤ 1.2 px **and** is an integer tick count, which 5.845 s cannot be.
**The frame and the web source agree at 6.000 s.** The survey's "the frame wins, build 5.8 s"
gets the direction right and the constant wrong, and its escalation to *"the concrete proof
that v0.682 combat tuning ≠ v0.717"* is a conclusion drawn from a source it wrongly believed
unreadable.

### F4 · the stance-switch label is a per-frame clock — and it matches the WEB formula
`reference/frames/session11/crit-focus/`, crop `(230,1015)-(530,1050)` at 4× NEAREST:

- `t1081.100` 4.2 % — no label · `t1082.100` 21.3 % — no label · `t1082.900` 35.0 % — no label
- **`t1083.100` — bar EMPTY, `CANNOT CHANGE STANCE` back on**, 0.200 s after the 35 % frame

That is `deductReloadBar()` firing on a landed slash, then the gate. The label appears **only
at displayed 0 %**, which is precisely `§1t113s0§.as:328-338`: `_loc3_ = (reload − 48)/(max − 48)`
clamped at 0, label shown `if(_loc3_ == 0)` — i.e. `reload ≤ 48`, the same 48 as the stance
gate `if(reload < 48) return;` (`§1t99s0§.as:3060`). Android's `maxreload/6 = 20` would put the
label boundary somewhere else. **The frames pick the web rule over the android one.**

### F5 · the stroke taper and colour — the survey's visual claim, graded from a frame
`reference/frames/session11/stance-reach/B_t862.667_HEAVY_thin-dark-tail-plus-bold-head.png`,
crop `(60,680)-(1060,1080)` upscaled 2×. The stroke is unmistakably **thin and dull at one end,
thick and vivid at the other** — the taper is real and visible. Sampled stroke pixels run
mean RGB ≈ (110-145, 15-40, 10-35), consistent with `0x990000` = (153,0,0) after antialiasing
and video compression, and inconsistent with a bright `0xFF0000`. `thickness = 8` and the taper
term `thickness − thickness·((maxDistance − distanceLeft)/maxDistance)` are byte-identical in
both builds. **HELD, and now frame-cited** — the survey graded this from code alone with
19 stroke frames sitting unopened in `session11/stance-reach/`.

### F6 · the light stroke measures 555 px — and it favours ×1.4, not ×1.5
`B_t785.200_LIGHT_stroke553px_endtoend.png`. My own measurement (red-dominant mask, band
y ∈ [770,820], contiguous run): **x = 416 → 971 = 555 px**, matching the filename's 553 px.
Viewport (pillarbox scan): x = 52 → 1867 = 1816 px for an 800-unit stage → **2.27 px/unit**, so
the stroke spans ≈ 245 world units end-to-end. The same video's player screen
(`B_t850.600_..._SPD13.png`) gives SPD 13 → base = 120 + floor(90·13/33) = **155**.
- `×1.5` (survey / android) → cap 232.5 units = **528 px**
- `×1.4` (`reach.ts` / **web**) → cap 217 units = 492 px

Neither bare figure covers 555 px, so the character carries a dan rank (`90 + 5d`) — but the
*ratio* is what matters and the frame does not favour the android 1.5 over the web 1.4 by any
margin the dan term does not swamp. The reach magnitudes are settled by the web source, and
the frame is consistent with it. **No refutation from the frame; the refutation is from `§1t99s0§.as`.**

### F7 · damage popups CONFIRMED on frames, plus a colour the survey missed
`reference/frames/session11/damage-ttk/`, crop `(780,480)-(1180,680)` at 2×, sequence
`t125.350 → t125.417 → t125.450 → t125.467 → t125.733`: a dark-red **`1`** rises and grows,
then a dark-red **`2`** spawns lower and rises/scales — exactly
`createFloatingText(mcs.x, mcs.y − 100, damage, 10027008)`. Player HP is `8/10` in these frames,
i.e. the L1 fight, and the numbers 1 and 2 are *precisely* the light/balanced rolls the survey
derives. Independent frame corroboration of claim 17's arithmetic.

⚠ But the same crop also shows a **black `2`** alongside the red one. `0x990000` is not the
whole popup colour story. And the survey never opened `TextProjectile.as`, which carries the
popup's entire animation contract: `ttl = 12`, `velY = -5`, `scale += 0.1` from `ttl < 10`,
`alpha -= 0.25` from `ttl < 4` (`TextProjectile.as:17-25`) — a 0.5 s, 60-world-unit rise.

### F8 · behead is visible in the web build
`reference/frames/session11/damage-ttk/t1383.133.png`: hat detached and airborne, head separated,
blood. `NPC.as:386-392`'s `PART_hat / PART_head / PART_neck → behead = true; damage *= 1.5`
is not just source — it is on screen. Claim 14's part rule gets a frame.

---

## SOURCE ERRORS FOUND (beyond the build mix-up)

**E1 — `baseReload` is dead code.** The survey cites `StatsManager.as:1839
getBaseReload() { return 48 + (SPD + bonus) * 6; }` as "refill rate ... stat-driven" and puts
"refill 48 + SPD·6" into `lane_impact`. Grep over **all 553** android scripts:

```
MCSPlayer.as:105   internal var baseReload:int = 48;      // declaration
MCSPlayer.as:182   ... baseReload:int, ...                // parameter
MCSPlayer.as:190   this.baseReload = baseReload;          // assignment
EnemyClone.as:49   this.baseReload = owner.baseReload;    // copy
```

Those are the only four. It is **never read in any expression, in either build.** The meter is a
flat `++this.reload` per frame (`MCSPlayer.as:1160` / `§1t99s0§.as:1205`) toward a hard
`maxreload` set two lines *after* `baseReload` is stored. SPD does not touch the crit meter.

**E2 — the mastery unlock ladder is the ENEMY branch.** Claim 18 quotes
`MCSPlayer.as:3164-3194` and concludes `src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy`
should be 3, not 5. But `initSpecialSkills()` opens (`MCSPlayer.as:3126-3161`, and identically
`§1t99s0§.as:3186-3212`):

```as3
if(this.controlledBy == 0 || this.controlledBy == 2)      // <-- THE PLAYER
{
   if(this.stance == LIGHT_STANCE) {
      this.canLaunch  = this.getSkillLevel(1014) > 0;
      this.canDeflect = this.getSkillLevel(1036) > 0;
      this.canAirCombo= this.getSkillLevel(1015) > 0;
   } else if(BALANCED) { canFlipUp 1016 · canDeflect 1037 · canLaunch 1017 }
     else if(HEAVY)    { canStab  1018 · canDeflect 1038 · canLaunch 1019 }
}
else if(this.stance == LIGHT_STANCE) { this.canLaunch = this.lightMastery >= 3; ... }
```

The quoted `>= 3 / >= 4 / >= 5` ladder is the **`else`** — the AI/enemy path. For the player,
in **both** builds, mastery level is not consulted at all: launch is gated on *owning skill
1014 / 1017 / 1019*. `LAUNCH_UNLOCK_LEVEL` describes the player, so "heavy 3, not 5" is a wrong
fix to a live config; the right fix is that the whole table is the wrong shape.

**E3 — "early mobs die in ONE hit" is false for 18 % of them.** Every cited row is verbatim
correct (I re-read `itemdata.xml:7906-7915`, `npcdata.xml:145-152` and `:2473-2480`,
`StatsManager.as:693-708` and `:1830-1832`). But a full enumeration of `npcdata.xml` —
495 `<npc>`, of which **22** have `lvl ≤ 2` — gives hp = **1 (×17), 2 (×1), 5 (×4)**, and the
four hp-5 NPCs (ids 7, 8, 9, 10) all carry `defense 3`. Against them the Branch's damage floors
to `1 + piercing`, so they take **five hits, not one.**

**E4 — small mis-cites.** `if(mouseY > 480)` is `InputManager.as:231`, not `:229`. The web
payload's SWF header declares an **800×690** stage, not 800×480 — the 800×480 world space is
established by `StatsManager.as:80-82` (`stageWidth = 800; stageHeight = 480;`), which the
survey never cited, and corroborated on-frame by the 5:3 game viewport (1816×1080 inside a
1920×1080 capture). `destY` is also snapped to `getGroundY()` when the stroke's last point is
within `jumpThreshhold` of the ground (`MCSPlayer.as:2685-2692`) — the pass-through is not a
pure "to the last point". And `src/config/combat-sim.ts:78` **already** carries
`DASH_SPEED_PX_PER_FRAME = {light:50, balanced:40, heavy:30}`, matching source; only the stale
`DASH_SLASH_PX = 105.9` comment needs retiring.

---

## WHAT SURVIVES, AND IT IS A LOT

Nine of the nineteen claims held under my own reading with no correction:
`reach-is-arclength`, `crit-meter-exists-in-web-build`, `multi-target-full-damage`,
`hit-registration-instant-at-endslash`, `pass-through-dash`, `gesture-classifier`,
`slash-type-map`, `mitigation-and-part-rule`, `heavy-def-0.8`, `stance-triangle`,
`150pct-damage-is-a-buff` — and I verified each in the **web** build too where the code exists.
`NPCManager.checkHit`'s per-enemy `gotHitFlag` really is an instance var (`MCSActor.as:998`),
so "one hit per enemy per slash" is not a shared-flag illusion; and
`grep -rn "NPCManager.checkHit\|NPCManager.checkPlayerHit"` over all 553 files really does put
the slash-array overloads only inside `endSlash()`.

## SCORE

The survey scored **78** and held itself off the 90s partly because "every source cite is the
ANDROID v0.682 client and parity with the web v0.717 is unproven". That instinct was right;
the response to it was wrong. The web client was on disk, readable, and it disagrees on
**crit, all three stance reach multipliers, both non-flat damage multipliers, `maxreload`, the
meter display divisor and the stance gate**. Three of those disagreements had the survey
telling the repo to overwrite correct constants with wrong ones.

**Recommend 78 → 55**, with the lane re-run against `reference/decompiled/shs3_payload/scripts/`
as primary and `shs3_android/` as the *named-symbol Rosetta stone* it actually is — read the
android file to learn what `§1t4414s0§` means, then read the value out of the web file.
