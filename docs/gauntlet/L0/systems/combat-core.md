# GAUNTLET L0 — system survey: **combat-core**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row + §4 block
`### combat-core — 42`, plus the combat lines in §1 UNKNOWN-UNKNOWNS and the §3 correction.

**Headline: the §4 combat-core block is obsolete in five of its five blockers.** Every one of
blockers ①–⑤ is now held as literal decompiled source. The reason the ledger could not close them
is stated in its own §5 — no playable build — but it never anticipated that the *client source*
would be recovered. `reference/decompiled/shs3_android/scripts/` holds 553 real, class-named
ActionScript files including `MCSPlayer.as` (170 KB), `StatsManager.as` (164 KB), `NPCManager.as`,
`InputManager.as`, `NPC.as` and `Damage.as`. Combat resolution is readable line by line.

**Standing caveat carried on every A2 below (S0-3):** this is the **ANDROID build, clientVersion
0.682** (`shs3_android/scripts/StatsManager.as:30`), not the web build's **v0.717**. Where a frame
from the 1080p longplays (web build) disagrees with an android constant, **THE FRAME WINS** and I
say so — see claim 7, which is exactly that case.

Frame geometry used throughout (measured, not assumed): in the 1920×1080 stills the combat HUD bar
track runs **x = 248 → 511 (263 px wide)**; validated against `t1003.000.png` where HP reads
`14/20` (= 70 %) and the green fill's right edge sits at x = 433 → (433−248)/263 = **70.3 %**.

---

## 1. `combat-core/reach-cap` — Blocker ① is DEAD. The reach formula is source-exact.

**Overturns:** "*① reach cap in **stage px** per stance (the one value the whole model needs; wiki
gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from footage,
or slash a dummy in a preserved build.*"

`reference/decompiled/shs3_android/scripts/StatsManager.as:1915`

```as3
internal static function getBaseSlashLengthVal(speed:int) : int
{
   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
}
```

So `base = 120 + floor((90 + 5·danRank) · SPD / (20 + SPD))`, asymptoting to 210 at dan 0.
`getBaseSlashLength()` (`StatsManager.as:1905`) feeds it `SPD + item bonus`, ×1.5 while
`BUFF_SPEED` is up. At the stated L1 character (`StatsManager.as:700` `setPlayerStats(STAT_SPEED,1)`,
dan 0): **base = 120 + floor(90/21) = 124**.

The scale question ("units of unknown scale") is answered by `InputManager.battleMouseMoveEvent`
(`InputManager.as:341`): mouse coordinates are converted **into** this space by
`(stageMC.mouseX - StatsManager.stageOffsetX) / StatsManager.stageScale`, and the same values are
converted back out for drawing. Reach is therefore in **game/world units on the 800×480 stage**,
and screen px = world units × `stageScale`. Corroborated by `InputManager.as:229`
`if(mouseY > 480) return;`.

- **artifact:** A2 · **verdict:** HELD

## 2. `combat-core/reach-stance-mults` — the per-stance multipliers, and the repo's `reach.ts` does **not** match them

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3020` (`setStance`):

```as3
case LIGHT_STANCE:
   this.slashLength = this.baseSlashLength * 1.5;                                    // :3030
case BALANCED_STANCE:
   this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01); // :3041
case HEAVY_STANCE:
   this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);  // :3052
   if(this.slashLength < 100) { this.slashLength = 100; }                             // :3053-3055
case REVERSED_STANCE:
   this.slashLength = this.baseSlashLength * 1.5;                                     // :3067
case DUAL_STANCE:
   this.slashLength = this.baseSlashLength;                                           // :3078
   if(this.slashLength < 100) { this.slashLength = 100; }                             // :3079-3081
```

Mastery is a **passive skill level 0–10** — `reference/extracted/skilldata.xml:3-11` is
`<id>1000</id><displayname>6000</displayname><passive>1</passive>`, string `6000` = *"Light Stance
Mastery"*, and its `<level>` blocks run `<value>1</value>` … `<value>10</value>`
(`skilldata.xml:74`). So the per-mastery term is **0.005 × mastery** (max +5 %), not a large curve.

**Two documents are wrong against this.**

(a) The ledger's §3 correction: "*`STANCE_TABLE` already carries reach 300/200/120 + speed … they're
actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)*". The 300/200/120 triple
cannot be produced by the source at any mastery: light is a **flat ×1.5** and balanced/heavy move by
at most ±5 %. The "Heavy should be 100" half is right but for a different reason — **100 is a hard
floor clamp**, not a mastery-9 value.

(b) The repo's own replacement, `src/config/reach.ts`, labels its constants "CONTRACT-SRC (read out
of the payload)" but they disagree with the payload on three of five multipliers:

| | `src/config/reach.ts` | android source | ratio |
|---|---|---|---|
| light flat mult | `lightMult: 1.4` | `1.5` | ✗ |
| balanced per mastery | `balancedPerMastery: 0.02` | `0.005` | 4× too big |
| heavy per mastery | `heavyPerMastery: 0.04` | `0.005` | 8× too big |
| heavy base | `heavyBase: 0.5` | `0.5` | ✓ |
| heavy floor | `heavyFloor: 100` | `100` | ✓ |
| base / danBase / danPerRank / spdSoftcap | 120 / 90 / 5 / 20 | 120 / 90 / 5 / 20 | ✓ |

`reach.ts`'s own comment shows the provenance of the wrong three — they were **back-derived** from
the legacy `0.9 / 1.2 / 1.4` triple "evaluated at mastery 10", not read out of the payload. At the
stated L1 character `reach.ts` therefore prints "light 173.6" where the source gives **186**.
I flag the alternative explanation honestly: these could be genuine v0.682→v0.717 tuning changes.
They are not *labelled* as such, and 0.02-vs-0.005 reads as a derivation error, not a patch.

- **artifact:** A2 · **verdict:** HELD

## 3. `combat-core/reach-is-arclength` — reach is an arc-length budget, spent along the stroke

`InputManager.as:51` `internal static var maxDistance:int = 200;` (the default; overwritten per
stance by `MCSPlayer.as:3094` `InputManager.setMaxDistance(this.slashLength)`).
`InputManager.as:198` `distanceLeft = maxDistance;` on mouse-down, then `InputManager.as:362-366`:

```as3
distanceTravelled = Math.sqrt(distanceTravelledSQ);
originalDistanceTravelled = distanceTravelled;
if(distanceTravelled > distanceLeft) { distanceTravelled = distanceLeft; }
distanceLeft -= distanceTravelled;
```

with the whole draw loop gated by `if(mousePressed && distanceLeft > 0 && …)` (`InputManager.as:352`).
So a curvy slash covers less ground than a straight one, and the stroke visibly **tapers to nothing**
as the budget runs out (`InputManager.as:360`, line thickness
`thickness - thickness * ((maxDistance - distanceLeft) / maxDistance)`, `thickness = 8`).
Polyline points are resampled to ≤ `largestUnit = 20` units (`InputManager.as:59`, :370-374).
The battle stroke colour is `10027008` = **0x990000**; the peaceful/move stroke is `39168` = 0x009900
(`InputManager.as:174`, :179).

This **confirms** the model already asserted (unsourced) in `src/config/reach.ts` ("Reach is spent as
an arc-length budget along the drawn stroke, not as a radius"). It is now A2-held.

- **artifact:** A2 · **verdict:** HELD

## 4. `combat-core/crit-multiplier` — Blocker ② is DEAD, and **both** candidate answers were wrong

**Overturns:** "*② crit 1.3 vs 3 final — read one crit popup.*" and the §4 Ready line "*damage
formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)*", and `src/config/combat.ts:12`
("*exactly 1.3 × our STANCE_TABLE dmgMults*").

`MCSPlayer.as:3213-3223`:

```as3
if(this.reload == this.maxreload)
{
   if(this.stance != LIGHT_STANCE)
   {
      return maxDamage * 1.2 + this.STAT_CRITICALDMG;
   }
   return maxDamage * 1.5 + this.STAT_CRITICALDMG;
}
return maxDamage;
```

Crit is **stance-dependent — ×1.5 in Light, ×1.2 in every other stance — plus a flat additive
`STAT_CRITICALDMG` gear term**. It is neither 1.3 nor 3.

⚠ **Internal contradiction inside the same build, worth carrying:** the inventory tooltip preview
uses the *opposite* mapping — `InventoryUI.as:1946` `critModifier = 1.2;` for LIGHT and
`InventoryUI.as:1955`/`:1964` `critModifier = 1.5;` for BALANCED/HEAVY. `MCSPlayer.getDamage()` is
the path that actually resolves combat; `InventoryUI` only paints the "critical dmg: … " string
(`InventoryUI.as:2087`). Treat `MCSPlayer` as authoritative and the tooltip as an original-game bug.

- **artifact:** A2 · **verdict:** HELD

## 5. `combat-core/crit-gating` — Blocker ⑤ is DEAD. Crit is a **deterministic meter**, not a chance proc

**Overturns:** "*⑤ Focus/crit gating rule — watch the Focus bar fill/consume.*" (and, out of lane but
in the same document, skills-meters "*⑤ crit **proc** rule (chance vs deterministic) — entirely absent*").

The meter is `reload` on `MCSPlayer`:

- `MCSPlayer.as:239-240` — `this.maxreload = 5 * 24; this.reload = 0;` (5 seconds × 24 fps)
- `MCSPlayer.as:1158-1168` — `if(this.reload < this.maxreload) { ++this.reload; … updateReload(this.tempreload / (this.maxreload - 24)); }` where `tempreload = reload - 24` clamped at 0 — i.e. the bar only *starts* moving after 24 ticks
- crit fires iff `this.reload == this.maxreload` (`MCSPlayer.as:3213`)
- `MCSPlayer.as:3240-3262` `deductReloadBar()` — a crit **zeroes** the meter (`if(this.reload == this.maxreload) { this.reload = 0; }`), then every slash subtracts `slashUsage` scaled per stance: **Light ÷2, Balanced/Reversed ×1, Heavy/Dual ×1.5**
- `slashUsage` is a **weapon** stat with a floor of 48 (`StatsManager.as:1922-1928`)
- `bonusReload()` adds +6 (`MCSPlayer.as:3265-3272`)
- refill rate is stat-driven: `StatsManager.as:1839` `getBaseReload() { return 48 + (SPD + bonus) * 6; }`
- switching stance is **blocked** below ⅙ meter — `MCSPlayer.as:2975-2978`
  `public function nextStance() { if(this.reload < this.maxreload / 6) { return; } … }` — and when it
  succeeds it costs meter (`MCSPlayer.as:3098-3108`: `if(reload > maxreload/2) reload = maxreload/3;
  else reload -= maxreload/6;`)

This is an entire third combat resource with a full economy; the §4 block records none of it.

- **artifact:** A2 · **verdict:** HELD

## 6. `combat-core/crit-meter-exists-in-web-build` — the frames show the meter and its **"CRITICAL HIT"** label

Frame `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780; the still is itself a
two-panel crop, viewed here at 50 %). The upper panel shows the third HUD bar filled to ~97 % with no
label; the **lower panel shows it at 100 % with `CRITICAL HIT` printed across it**, HP `11/20`,
Chi `47/47` unchanged between panels.

That is exactly `BattleUI.as:259-262`:

```as3
public function updateReload(percentage:Number) : *
{
   this.reloadbar.bar.scaleX = percentage;
   this.crittext.visible = percentage >= 1 && this.reloadbar.visible;
}
```

with `BattleUI.as:102` `this.crittext.text = LangManager.getString(175);` and string **175 =
"Critical Hit"** (`docs/gauntlet/L0/index/strings.json`). Frame ↔ code ↔ string-table triple binding.

This also **corrects the project's own memory note** `[[project-session11-study-pass]]` — "*OG has NO
Critical meter (Focus buys evasion)*". The web-build frame shows a crit meter labelled *Critical Hit*.
The frame wins.

Consumption is visible too: `session11/gap-focus-trigger/t1003.933.png` shows the bar **empty**
immediately after a slash and `t1004.000.png` shows a fresh sliver — `deductReloadBar()` firing at
`endSlash()` (`MCSPlayer.as:2777`).

- **artifact:** A1 · **verdict:** HELD

## 7. `combat-core/crit-meter-fill-rate` — measured on frames; **the frame beats the android constant**

Measured white-fill right edge on the meter track (x0 = 248, width = 263 px), directory
`reference/frames/session11/crit-focus/`:

| frame | fill edge x | fill % |
|---|---:|---:|
| `t1004.800.png` | 281 | 12.5 % |
| `t1005.000.png` | 290 | 16.0 % |
| `t1082.100.png` | 304 | 21.3 % |
| `t1082.900.png` | 340 | 35.0 % |
| `t3779.000.png` | 370 | 46.4 % |

Rate: (16.0−12.5)/0.200 s = **17.5 %/s**; (35.0−21.3)/0.800 s = **17.1 %/s** — monotonic, no slash in
either window. Mean **≈17.3 %/s ⇒ ≈5.8 s for the meter to cross 0→100 %**.

The android build predicts **4.00 s**: `++reload` once per frame (`MCSPlayer.as:1160`) at
`frameRate = 24` (`Mobile.as:117` `GameEngine.getStageMC().frameRate = 24;`) over the displayed span
`maxreload − 24 = 96` ticks. Even the *full* 0→`maxreload` sweep is only 5.00 s.

**The measurement doc and the frame disagree, so THE FRAME WINS: build the web-build meter at ≈5.8 s
of visible travel.** The structural model (linear, +1/tick, first 24 ticks hidden, zeroed on crit,
`slashUsage` per stance) is A2-held; only the constant is contested, and it is the clearest concrete
instance of the v0.682-vs-v0.717 caveat in this lane.

- **artifact:** A1 · **verdict:** PARTIAL

## 8. `combat-core/multi-target-full-damage` — Blocker ④ is DEAD: **full damage each, no falloff, one hit per enemy per slash**

**Overturns:** §4 "*④ multi-target per-hit rule (full vs falloff).*" and §1 UNKNOWN-UNKNOWNS
"***Multi-target damage rule** (one arc hits N enemies — full damage each? falloff toward the tip?).*"

`NPCManager.as:1204` `checkHit(slashArray, offset, damage, checkDeath)` walks **the whole
`enemyList`, then the whole `neutralList`**, and for each walks the slash polyline:

```as3
while(j < slashMax && !enemy.gotHitFlag)
{
   dist = enemy.mcs.x - slashArray[j].x + offset;
   scaledX = (slashArray[j].x - offset) * StatsManager.stageScale + StatsManager.stageOffsetX;
   scaledY = slashArray[j].y * StatsManager.stageScale + StatsManager.stageOffsetY;
   if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false))
   { … enemy.checkHit(scaledX,scaledY,damage) … }
   j++;
}
```

Three facts fall out:

1. **One `Damage` object is shared by every victim** — no per-target scaling, **no falloff toward the
   tip**. The value was rolled once at slash start (`MCSPlayer.as:2699` `this.slashDamage = this.getDamage();`).
2. **Each enemy can be hit at most once per slash** — the loop exits on `gotHitFlag`.
3. A cheap horizontal pre-filter `dist * dist < 40000` ⇒ **|Δx| < 200 world units** before the finer test.

Combo = number of *distinct* enemies hit by the stroke (`NPCManager.as:1284-1287`
`if(comboCount > 0) StatsManager.addCombo(comboCount);`), accumulating into a persistent counter
capped at 999 (`StatsManager.as:4298-4306`). The ledger's "combo rules" Ready bullet is thereby
grounded, and given a hard cap it never had.

- **artifact:** A2 · **verdict:** HELD

## 9. `combat-core/hit-registration-instant-at-endslash` — §1 unknown-unknown answered

**Overturns:** §1 "***Hit-registration window** (instant at release vs an active sweep an enemy can
dodge into/out of).*"

`MCSPlayer.as:2766 endSlash()` is the *only* caller of `NPCManager.checkHit` (`:2796`, `:2809`) /
`checkPlayerHit` (`:2800`, `:2813`). It builds `new Damage(this.slashDamage, level, launchType,
this.stance)` (`:2785`) and resolves the entire polyline **in one instant, at the end of the
traversal**, against wherever the enemies are at that moment. There is no active sweep and no
per-frame hitbox. `deductReloadBar()` is charged in the same call (`:2777`).

- **artifact:** A2 · **verdict:** HELD

## 10. `combat-core/pass-through-dash` — §1 unknown-unknown answered: the player traverses to the stroke's **end**

**Overturns:** §1 "***The reach-cap ↔ 127px-dash relationship** (pass-through vs stop-within-reach —
possibly two stacked motions).*" and reframes the Surface bullet's `DASH_SLASH_PX=127`
(`src/config/combat-sim.ts:69` currently carries "a fixed 105.9 px pass-through").

There is **no fixed dash constant**. Two stacked motions, both derived:

1. *Approach* — `MCSPlayer.as:2476`
   `if(actionState != GOTLAUNCHED_STATE && Math.abs(this.destX - posX) < standingRange)` → slash in
   place, else `startAction(RUN_STATE)` first. `standingRange = 50` (`MCSPlayer.as:9`).
   `initSlash` sets `this.destX = firstPt.x` (`:2408`) — the **first** point of the drawn stroke.
2. *Traversal* — `MCSPlayer.as:2676-2699`:

```as3
this.destX = this.slashArray[this.slashArray.length - 1].x;
…
var xdiff:int = this.destX - posX;
var ydiff:int = this.destY - this.slashArray[0].y;
var dist:Number = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
var time:Number = dist / slashSpeed;
velX = xdiff / time;  velY = ydiff / time;
this.slashDamage = this.getDamage();
```

The player is carried from the stroke's start to its **last point** — a **pass-through**, at a
per-stance speed: `lightSlashSpeed = 50`, `balancedSlashSpeed = 40`, `heavySlashSpeed = 30`
(`MCSPlayer.as:15-19`), in world units/frame. Travel distance is therefore whatever the stroke spans,
itself bounded by the reach budget of claim 3 — that *is* the reach-cap ↔ dash relationship.
(For scale, combat `walkSpeed = 4` — `MCSPlayer.as:206`.)

Shunpo short-circuits the whole thing: `MCSPlayer.as:2700-2705`
`if(this.doShunpo) { setPosition(this.destX,this.destY); this.slashDamage *= 2; this.endSlash(); }`
— instant teleport along the stroke at **double** damage. (Adjacent lane: this also closes
skills-meters blocker ② "*Shunpo's real effect … entirely absent*".)

- **artifact:** A2 · **verdict:** HELD

## 11. `combat-core/gesture-classifier` — the line-vs-tap discriminator, exactly

Refines the §4 Ready bullet "*gesture→attack map*", which carries no thresholds.

`InputManager.as:268` (and `:303` for the network path):

```as3
isLine = drawArrayLength > lengthThreshhold && getDistanceSQ(firstPoint,lastPoint) > distThreshhold;
```

with `lengthThreshhold = 4`, `distThreshhold = 400` (`InputManager.as:53`, `:55`). So a stroke counts
as a **slash** iff it sampled **>4 points** *and* start→end straight-line distance **>20 world units**.
Otherwise it is a **tap**, handled at `MCSPlayer.as:2298-2308`:

```as3
dist = lineArray[0].x - getMCS().x;
if(dist * dist < 625) { return; }
… this.initMove(lineArray[0]);
```

— a tap moves the fighter, with a **25-unit dead-zone**. And in peaceful/adventure mode a *line* is
demoted to a move to the line's last point (`MCSPlayer.as:2260-2273`).

Input buffering the ledger has nowhere: a line drawn while a slash is committed is stored as
`slashArrayBuffer` / `hasSlashBuffer = true` (`MCSPlayer.as:2275-2285`) and fired next.

- **artifact:** A2 · **verdict:** HELD

## 12. `combat-core/slash-type-map` — nine slash types with exact geometric thresholds

`MCSPlayer.as:37-53` declares `HOR_SLASH 0, JUMP_SLASH 1, DROP_SLASH 2, UP_SLASH 3, AIR_SLASH 4,
LAUNCH_SLASH 5, DOWNSTAB_SLASH 6, HOR_SLASHDOWN 7, HOR_SLASHUP 8`. `initSlash` (`MCSPlayer.as:2403-2456`)
picks between them, `jumpThreshhold = 100` (`MCSPlayer.as:11`):

- Light stance while falling: `destY - mcs.y > 100` → **DROP_SLASH**, else **AIR_SLASH**
- `mcs.y - destY > 100` → **JUMP_SLASH**
- `canStab && destY < lastPt.y && Math.abs(destX - lastPt.x) < 50` → **DOWNSTAB_SLASH** (then destX is
  nudged ±55 away from the target, `:2459-2466`)
- `destY - lastPt.y > 100 && !isAirborne()` → **UP_SLASH** (this is the launcher — `endSlash` sets
  `launchType = Damage.LAUNCH_AIR` when `slashType == UP_SLASH && this.canLaunch`, `:2779-2782`)
- else tilt by `diff = destY - lastPt.y`: `> 25` → **HOR_SLASHUP**, `< -25` → **HOR_SLASHDOWN**,
  otherwise **HOR_SLASH**

The ledger's one-line "gesture→attack map" is a nine-way map with numeric gates.

- **artifact:** A2 · **verdict:** HELD

## 13. `combat-core/damage-formula` — the Ready bullet's formula is wrong: damage is a **random roll**, and the stance term is a mastery curve

**Overturns:** "*damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)*".

`MCSPlayer.as:3197-3212`:

```as3
internal function getDamage() : int
{
   var maxDamage:int = 0;
   var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
   switch(this.stance)
   {
      case LIGHT_STANCE:    maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01);    break;
      case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01);   break;
      case HEAVY_STANCE:
      case DUAL_STANCE:
      case REVERSED_STANCE: maxDamage = baseDamage * 1.5;
   }
   …
}
```

with (`StatsManager.as:1860-1900`) `minDamage = ATK + itemBonusATK + weapon.mindamage` and
`damageRange = weapon.maxdamage - weapon.mindamage` (0 if unarmed **or the weapon is broken**;
`+1` instead of the weapon term if broken — `StatsManager.as:1875`). So the true shape is

```
roll   = minDamage + rand()·damageRange                     ← the ledger has no randomness at all
stance = light 0.5+0.005·m | balanced 1+0.005·m | heavy/dual/reversed 1.5
crit   = ×1.5 (light) or ×1.2 (other) + STAT_CRITICALDMG, only at a full meter
```

Note the **exact permutation** of the reach curves in claim 2 — light and heavy swap roles between
the two tables, which is the structural point `src/config/reach.ts` gets right even though its
constants are wrong.

- **artifact:** A2 · **verdict:** HELD

## 14. `combat-core/mitigation-and-part-rule` — flat defence subtraction, a level-banded floor, and a **universal** head/weapon part rule

**Overturns:** "*part-based weak points (shielder legs, undead heads)*" — the real rule is not
per-enemy. `NPC.as:386-462` `gotHit(target:MovieClip, damageObj:Damage)`:

```as3
switch(target)
{
   case mcs.partList[MCSCharacter.PART_hat]:
   case mcs.partList[MCSCharacter.PART_head]:
   case mcs.partList[MCSCharacter.PART_neck]:
      behead = true; gotHitFlag = true; break;
   case mcs.partList[MCSCharacter.PART_weapon]:
      gotHitFlag = false; damage = 0; return false;
   default:
      gotHitFlag = true;
}
if(getHP() > 0)
{
   damage -= this.defense;
   if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
   if(behead) { damage *= 1.5; }
   …
   setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
   this.updateHealthBar();
   this.gotHitCounter = 12;
```

- **Every** character: hat/head/neck ⇒ **×1.5 and a behead**; the **weapon part absorbs the stroke
  entirely** (0 damage, not even flagged as a hit) — a blade-on-blade parry that emerges from the
  paperdoll, not from AI.
- Parts are tested **top-most first** (`NPC.as:301-320`, `while(i >= 0 …)` from `partList.length-1`),
  first containing part wins.
- Mitigation is **flat subtraction**, floored by attacker level (`Damage.as:150-172`):
  `lvl ≤ 10 → 1 + piercing`; `≤ 20 → lvl/8 + piercing`; `≤ 30 → lvl/6 + piercing`; else
  `lvl/4 + piercing`. The ledger's items-equipment line "*defense min-floor (EnemyLevel/4)*" is only
  the last of four bands.
- Elemental damage is computed separately against four per-element defences and floored at 1 when the
  source is > 0 (`NPC.as:393-428`), then **added** after mitigation.
- `gotHitCounter = 12` = a **12-frame (0.5 s at 24 fps) invulnerability window** — one half of §1's
  "*hitstop-on-landed-hit (never catalogued)*".
- Damage popups: `ProjectileManager.createFloatingText(mcs.x, mcs.y - 100, damage.toString(), 10027008)`
  — 100 units above the origin, colour **0x990000**. (Out of lane but exact: ui-hud blocker ③
  "*floating damage/crit popups (absent from the ledger)*".)

- **artifact:** A2 · **verdict:** HELD

## 15. `combat-core/heavy-def-0.8` — the one Ready sub-claim that survives intact

`MCSPlayer.as:3226-3234`:

```as3
internal function getDefense() : int
{
   if(this.stance == HEAVY_STANCE) { return defense * 0.8; }
   return defense;
}
```

Independently corroborated by the game's own copy: string `6005` (skill 1002, *"Heavy Stance
Mastery"*) reads *"Slow but powerful stance. Damage inflicted is increased but slash range is
shorter.\nEffective against Balanced Stance.\n**Defense -20%**"*. The ledger is right here.

Note the Stage-2 landmine the repo already flags is real and now sourced: the penalty exists **only**
on the defence side. `src/config/stances.ts` still carries `heavy: { damageTakenMult: 1.25 }` as
data-only — correct to never apply it, and 1/0.8 = 1.25 confirms it is the same number twice.

- **artifact:** A2 · **verdict:** HELD

## 16. `combat-core/stance-triangle` — CONTRACT confirmed a third time, from the string table

`src/config/stances.ts` `STANCE_BEATS` = `{light:'heavy', heavy:'balanced', balanced:'light'}`.
`docs/gauntlet/L0/index/strings.json` (via `118_Mobile_Lang_EN.bin`), skill descriptions:

- `6001` — *"Swift but light stance. Slash range is longer but damage inflicted is lower.\n**Effective against Heavy Stance.**"*
- `6003` — *"Balanced stance.\n**Effective against Light Stance.**"*
- `6005` — *"…\n**Effective against Balanced Stance.**\nDefense -20%"*

Exactly the table. Also note 6001 states the light-stance trade in the developer's own words —
longer range, lower damage — which is the permutation of claims 2 and 13 in prose.

- **artifact:** A2 · **verdict:** HELD

## 17. `combat-core/early-ttk` — Blocker ③ is DEAD: L1 numbers, starter weapon, and one-hit mobs

**Overturns:** "*③ early-mob HP + starter weapon DMG + hits-to-kill — read L1 bandit-fight popups in
video A.*" and the §2 row's "*early TTK numbers*".

- **L1 character** (`StatsManager.as:693-708`): `STAT_MAXHP 10`, `STAT_MAXCHI 10`, `STAT_ATTACK 1`,
  `STAT_DEFENSE 1`, `STAT_SPEED 1`, `STAT_AP 30`, `STAT_GOLD 100`, `STAT_DUELTOKENS 20`, `STAT_LEVEL 1`.
- **Starter weapon fallback** (`StatsManager.as:1830-1832`):
  `if(equipment[EQ_WEAPON].itemID == 0) { equipItem(EQ_WEAPON,new Item(13002,1)); }`.
  `reference/extracted/itemdata.xml:7906-7915` — `<id>13002</id> … <baseprice>0</baseprice>
  <minlvl>-4</minlvl> <mindamage>1</mindamage> <maxdamage>2</maxdamage> <weight>1</weight>`,
  `<name>4041</name>` → string 4041 = **"Branch"**.
- ⇒ `minDamage = 1 + 1 = 2`, `damageRange = 1` ⇒ roll 2; balanced/mastery-0 ⇒ **2**; heavy ⇒ **3**;
  light ⇒ **1**.
- **Early mobs** (`reference/extracted/npcdata.xml`): line 146 `<id>6</id><name>5010</name><lvl>2</lvl>
  <hp>1</hp><ai>1</ai><attack>5</attack><defense>3</defense>` — string 5010 = **"Thug"**; line 2474
  `<id>101</id><name>5052</name><lvl>1</lvl><hp>2</hp><ai>3</ai><attack>1</attack><defense>0</defense>`
  — string 5052 = **"Duelist"**. Across `npcdata.xml`, every `lvl ≤ 2` NPC sampled has `hp` in **1–5**.
- ⇒ against a Thug: `2 − 3 < floor` ⇒ floored at `1 + piercing` = **1** damage vs **1 HP** ⇒
  **one-hit kill.** This is an A2 confirmation of the SESSION-11 frame measurement recorded in the
  project memory ("*mobs die in ONE hit*").
- Conversely the Thug's `attack 5` vs the player's `maxhp 10` ⇒ the player dies in ~2–3 hits at L1.

- **artifact:** A2 · **verdict:** HELD

## 18. `combat-core/launch-unlock-levels` — the repo's `LAUNCH_UNLOCK_LEVEL` is wrong for heavy

`src/config/stances.ts` — `LAUNCH_UNLOCK_LEVEL = { light: 3, balanced: 5, heavy: 5 }` (labelled INFERRED).
`MCSPlayer.as:3164-3187`:

```as3
else if(this.stance == LIGHT_STANCE)    { this.canLaunch = this.lightMastery >= 3;    this.canDeflect = this.lightMastery >= 4;    this.canAirCombo = this.lightMastery >= 5; … }
else if(this.stance == BALANCED_STANCE) { this.canFlipUp = this.balancedMastery >= 3; this.canDeflect = this.balancedMastery >= 4; this.canLaunch = this.balancedMastery >= 5; … }
else if(this.stance == HEAVY_STANCE)    { this.canLaunch = this.heavyMastery >= 3;    this.canDeflect = this.heavyMastery >= 4;    this.canStab = this.heavyMastery >= 5; … }
```

light 3 ✓, balanced 5 ✓, **heavy 3 ✗ (config says 5)**. The full mastery ladder is: **3 = the stance's
signature move** (light launch / balanced flip-up / heavy launch), **4 = deflect in every stance**,
**5 = the stance's advanced move** (light air-combo / balanced launch / heavy stab). Reversed and Dual
stances get all five unconditionally (`MCSPlayer.as:3188-3194`).

- **artifact:** A2 · **verdict:** HELD

## 19. `combat-core/150pct-damage-is-a-buff-not-a-stance` — a frame that is easy to misread

The gold `150% DAMAGE` line under the bars in `reference/frames/session11/crit-focus/t1003.000.png`
(and every frame in that directory) is **not** a stance readout. `OverworldHUD.as:1404`
`buffstr = "150% DAMAGE";` under `bufftype == StatsManager.BUFF_ATTACK`, and string `4132` is
*"Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time."*
Its mechanical effect is `MCSPlayer.as:209-211`
`if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK)) { this.minDamage *= 1.5; }` — i.e. it scales
`minDamage` **before** the stance multiplier, and only one buff can be live.

I record this because heavy stance's damage multiplier is *also* 1.5, and reading that HUD line as
"heavy stance" would have silently corrupted every TTK derived from these frames.

- **artifact:** A1 · **verdict:** HELD

## 20. `combat-core/build-version-parity` — **STILL_UNHELD**

Every A2 above is the **android v0.682** client. The web build the two longplays record is **v0.717**.
Data-XML row counts match exactly (S0-3), and claim 6 shows the HUD logic matches, but claim 7 shows
**at least one combat constant does not**. I cannot show that `maxreload`, `slashUsage` floors,
`lightSlashSpeed/balancedSlashSpeed/heavySlashSpeed`, the 1.2/1.5 crit split, or the 0.005-per-mastery
terms are identical in v0.717. The web payload's own ActionScript is obfuscated
(`reference/decompiled/shs3_payload/scripts/§1t51s0§/`, 5 files) and cannot be cross-read.

Close-path: diff the two builds' constants by locating these same expressions in the obfuscated web
AS3 by *shape* (numeric literal sequences `120/90/5/20`, `5*24`, `50/40/30`), or measure each on the
frames as claim 7 did. Until then, port android constants **labelled `CONTRACT-SRC-v0.682`**, never
plain CONTRACT.

- **artifact:** STILL_UNHELD · **verdict:** STILL_UNHELD

---

## Re-score

**42 → 78.**

Blockers ①②③④⑤ all closed at source, plus three §1 UNKNOWN-UNKNOWNS (multi-target rule, reach↔dash
relationship, hit-registration window) and half of a fourth (i-frames). What is *not* closed, and
what holds the score off the 90s: (a) v0.682↔v0.717 parity is unproven and already broken once
(claim 7); (b) the AI/telegraph side of a duel lives in `EnemyPlayer.as` + `Enemy*.as` and is
enemies-ai's lane, not surveyed here; (c) screen-shake, hitstop-beyond-i-frames and blend modes
remain uncatalogued; (d) three of the repo's live reach constants and one unlock level are wrong
against the source and must be fixed before any of this is "wired in".
