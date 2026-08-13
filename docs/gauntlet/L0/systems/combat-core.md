# GAUNTLET L0 — system survey: **combat-core**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row line 129 and
§4 block lines 188–191. Ledger score: **42/100**.

**Headline: the whole combat-core block of the ledger is obsolete.** It was written as a
"must-measure from footage" plan. Since then the **complete, unobfuscated ActionScript 3
source of the combat system** was decompiled to `reference/decompiled/shs3_android/scripts/`
(925 default-package classes incl. `MCSPlayer`, `NPCManager`, `InputManager`, `StatsManager`,
`Damage`, `BattleUI`, `StageManager`). **All five combat-core blockers are closed by source
code, not by measurement.** Four of the five "Ready" items are wrong or under-specified in the
ledger, and one mechanic (the stance triangle) is missing from the ledger entirely.

## Provenance caveat (read before trusting any number below)

- The readable source is the **Android/AIR payload**, exported by JPEXS 26.2.1
  (`reference/decompiled/android_export.log:1`). Identity confirmed:
  `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1872` →
  `"name":"Straw Hat Samurai: Duels",`. This is Duels, not a sibling title.
- The **web** payload decompile (`reference/decompiled/shs3_payload/scripts/`, 652 entries) contains
  **only art-symbol classes** (`torso4000.as`, `weapon13000.as`, `shs3_fla/…`) plus playerio —
  its game logic is identifier-mangled (`payload_export.log:9` → `Exported script 14/1079 §1t398s0§`).
  So combat logic is readable **only** in the Android bundle.
- Consequence: every number below is **the mobile build's** value. It may differ from web v0.717.
  Flag as CONTRACT-from-source with a "mobile-build" qualifier, not as v0.717-measured.
- `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as` is byte-identical in length
  (4775 lines) to the `shs3_android` copy — two exports of the same code, not two builds.

---

## C1 — Blocker ① "reach cap in stage px per stance" is CLOSED, with a full formula

Ledger (line 190): *"① reach cap in **stage px** per stance (the one value the whole model needs;
wiki gives "units" of unknown scale) — measure blade-FX tip-to-body span in Light/Bal/Heavy from
footage, or slash a dummy in a preserved build."*

The reach cap is a variable called `slashLength`, fed straight into the input layer:

`reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1918`
```
      internal static function getBaseSlashLengthVal(speed:int) : int
      {
         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
```

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030 / 3041 / 3052-3055 / 3067 / 3078-3082`
```
3030               this.slashLength = this.baseSlashLength * 1.5;                                    // LIGHT
3041               this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01); // BALANCED
3052               this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);  // HEAVY
3053               if(this.slashLength < 100)
3055                  this.slashLength = 100;
3067               this.slashLength = this.baseSlashLength * 1.5;                                    // REVERSED
3078               this.slashLength = this.baseSlashLength;                                          // DUAL, floor 100
```

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3094`
```
            InputManager.setMaxDistance(this.slashLength);
```

**Full model:** `base = 120 + floor((90 + DAN*5) * SPEED / (20 + SPEED))`; SPEED×1.5 while
`BUFF_SPEED` is up (`StatsManager.as:1908-1911`); halved outright while `BUFF_INJURED`
(`MCSPlayer.as:222` → `this.baseSlashLength *= 0.5;`).
At SPEED 0, Dan 0 → base **120**; asymptote at Dan 0 → **210**.
Stance multipliers: **Light ×1.5 flat (no mastery term at all)**, **Balanced ×1.0→×1.5 with mastery**,
**Heavy ×0.5→×1.0 with mastery, hard floor 100**, Reversed ×1.5, Dual ×1.0 floor 100.

Units are **stage pixels in the 800×480 native space** — `InputManager.as:185-186` divides raw
`stageX/stageY` by `StatsManager.stageScale` before use, and `InputManager.as:231` rejects
`if(mouseY > 480)`.

**Verdict: HELD. Overturns the ledger.** Also kills the ledger's "wiki gives units of unknown
scale" — the wiki's 300/200/100 is exactly this table at `base = 200` (Light 200×1.5=300,
Balanced 200×1.0=200, Heavy floor→100).

## C2 — The reach cap is a **stroke-length budget**, not a radius from the body

`reference/decompiled/shs3_android/scripts/InputManager.as:198`
```
         distanceLeft = maxDistance;
```
`reference/decompiled/shs3_android/scripts/InputManager.as:363-367`
```
            if(distanceTravelled > distanceLeft)
            {
               distanceTravelled = distanceLeft;
            }
            distanceLeft -= distanceTravelled;
```
The budget is spent on the **arc-length of the mouse drag**, and drawing simply stops when it runs
out. The player's position is **never** consulted. Reach therefore caps *how long a line you may
draw*, not *how far from you it may be*.

Ledger Surface bullet (line 191): *"**wire reach into `resolveSlash`** (today it gets no player pos
and no reach gate)."* — the fix as written (feed player position, gate hits by distance-from-player)
would be **the wrong mechanic**. Reach belongs in the input/stroke layer, not the hit resolver.
The line also visibly tapers as the budget drains: `InputManager.as:360` →
`lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance), 10027008, …)`,
with `thickness = 8` (`InputManager.as:57`) and colour `10027008 = 0x990000` (dark red).

**Verdict: HELD. Overturns the ledger's Surface bullet.**

## C3 — Blocker ② "crit 1.3 vs 3" — it is **neither**. Crit is ×1.5 Light / ×1.2 all other stances

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215-3222`
```
         if(this.reload == this.maxreload)
         {
            if(this.stance != LIGHT_STANCE)
            {
               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
            }
            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
         }
```
Corroborated in the inventory comparison tooltip,
`reference/decompiled/shs3_android/scripts/InventoryUI.as:1946 / 1955 / 1964 / 1970-1971`
(`critModifier = 1.2` / `1.5` / `1.5`; `minCrit = minDamage * critModifier + criticalDmgDiff`).

**Verdict: HELD. Overturns the ledger twice** — the §4 Ready bullet "crit 1.3×" and §3 correction
#2 "*SHS:Duels' own wiki (2016 + 2025) states the formula 'Critical = **1.3× Physical**.' Keep
`CRIT_MULT=1.3`*". The wiki is wrong; `CRIT_MULT=1.3` is wrong. The item stat `STAT_CRITICALDMG`
is an **additive flat term applied after the multiplier**, not a multiplier — so the "3×" folklore
is explained by a big flat crit-damage roll, not by compounding.

## C4 — Blocker ⑤ "Focus/crit gating rule" — crit is **deterministic on a full bar**, no proc chance

Same line, `MCSPlayer.as:3215` → `if(this.reload == this.maxreload)`. There is **no RNG** anywhere
in the crit path. The HUD agrees: `reference/decompiled/shs3_android/scripts/BattleUI.as:262`
```
         this.crittext.visible = percentage >= 1 && this.reloadbar.visible;
```
Consumption, `MCSPlayer.as:3242-3257`:
```
         if(this.reload == this.maxreload)
         {
            this.reload = 0;
         }
         …
            case LIGHT_STANCE:      this.reload -= this.slashUsage / 2;
            case BALANCED_STANCE:
            case REVERSED_STANCE:   this.reload -= this.slashUsage;
            case HEAVY_STANCE:
            case DUAL_STANCE:       this.reload -= this.slashUsage * 1.5;
```
i.e. the crit slash **zeroes** the bar, then still pays its own stance cost.
`slashUsage` is a **weapon** stat with a floor of 48 (`StatsManager.as:1921-1929`,
`if(itemdata == null || itemdata.slashusage < 48) … return 48;`).

**Verdict: HELD. Closes blocker ⑤ and also skills-meters blocker ⑤** (*"crit **proc** rule (chance
vs deterministic) — entirely absent"*): it is deterministic.

## C5 — The third HUD bar is the crit/reload meter; it fills at **+1 per tick** and `maxreload` is hard-coded **120**

Frame evidence (A1): `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png`, crop `560×180+0+900`
of the 1920×1080 frame, upscaled ×3 nearest-neighbour. Visible: a round portrait with a red ring,
then **three stacked bars** — green `20/20`, blue `26/26`, and a **third tan/olive bar** with
`CANNOT CHANGE STANCE` overlaid on it, plus `150% DAMAGE` beneath. Top-left reads `AUTO SLASH OFF`;
top-right reads a red `3` over `HIT COMBO`.

That maps 1:1 onto the BattleUI field list,
`reference/decompiled/shs3_android/scripts/BattleUI.as:24 / 16 / 60 / 48 / 54 / 36 / 56`:
`hpbar`, `chibar`, `reloadbar`, `crittext`, `autoslashofflabel`, `changestancelabel`, `combo`.
So the third bar = `reloadbar` = the crit meter, and "CANNOT CHANGE STANCE" is
`changestancelabel` (`BattleUI.as:110` → `LangManager.getString(208)`) drawn over it.

Fill rate, `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1158-1168`:
```
         if(this.reload < this.maxreload)
         {
            ++this.reload;
            …
               this.tempreload = this.reload - 24;
               …
               StageManager.getBattleUI().updateReload(this.tempreload / (this.maxreload - 24));
```
**+1 per tick**, and the bar's displayed range is `(reload − 24) / (maxreload − 24)` — the first
24 ticks are invisible dead zone.

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:239`
```
         this.maxreload = 5 * 24;
```
This is unconditional at the tail of `initPlayer`. The speed-scaled value
`getBaseReload() = 48 + SPEED*6` (`StatsManager.as:1839-1842`) **is computed, passed into
`initPlayer`, stored into `this.baseReload` (MCSPlayer.as:190) and then never read again** —
grep for `baseReload` across all 925 classes returns only assignments. **SPEED does not affect
crit-bar fill in this build.** Bar fills empty→full in 96 ticks (4.0 s at the 24 fps set by
`Mobile.as:117` → `GameEngine.getStageMC().frameRate = 24;`).

Stance switching spends the same bar, `MCSPlayer.as:2977` and `3098-3105`:
```
2977         if(this.reload < this.maxreload / 6)   // cannot switch below 1/6
3098            if(this.reload > this.maxreload / 2)
3100               this.reload = this.maxreload / 3;
3104               this.reload -= this.maxreload / 6;
```

**Verdict: HELD.** This is the "Focus bar" the project has been guessing at. It is one resource
doing three jobs: crit gate, slash budget, stance-change currency.

## C6 — Ledger §3 #3's stance damage table (0.9 / 1.2 / 1.4, "Heavy fixed") is wrong

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3201-3213`
```
         var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
            case LIGHT_STANCE:    maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01);
            case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01);
            case HEAVY_STANCE:
            case DUAL_STANCE:
            case REVERSED_STANCE: maxDamage = baseDamage * 1.5;
```
Real table: **Light 0.50 → 1.00**, **Balanced 1.00 → 1.50**, **Heavy 1.50 flat**.
Ledger §3 #3 says *"The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING
values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is
fixed); Heavy's *reach* also scales ×0.5→×0.9."* — the ×0.5 / ×1.0 floors are right, the
ceilings are 1.0 / 1.5 (not 0.9 / 1.2), Heavy is **1.5** (not 1.4), and the mastery term is
`mastery × 0.005` on a 0–100 mastery scale, not a 9-step ladder. Note the *reach* and *damage*
mastery terms are the **same shape but on different stances**: damage scales Light+Balanced and
fixes Heavy; reach fixes Light and scales Balanced+Heavy.

**Verdict: HELD. Overturns §3 correction #3.**

## C7 — A **stance triangle** worth ×1.2 exists and is absent from the entire ledger

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3708` (inside the victim's `gotHit`;
`this.stance` = victim, `enemyStance` = attacker)
```
            if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)
            {
               damage *= 1.2;
```
→ **Balanced beats Light, Heavy beats Balanced, Light beats Heavy**, +20% damage, and the floating
number is recoloured white (`damagetextcol = 16777215`) when an NPC lands it on you.

**Verdict: HELD. Pure under-claim** — nothing in §2, §4 or §3 mentions any stance-vs-stance
interaction. Stance choice is a live rock-paper-scissors read in PvP, not just a stat preset.

## C8 — The damage formula, end to end (ledger's "(ATK+Wpn)×stance" is the right shape, missing three terms)

Attacker side (`StatsManager.as:1863-1902`, `MCSPlayer.as:3198-3224`):
```
1881            basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;
1902         return itemdata.maxdamage - itemdata.mindamage;      // getDamageRange()
3201         var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
```
Victim side (`MCSPlayer.as:3701-3717`, `EnemyShield.as:346-353`, `Damage.as:150-173`):
```
            damage *= 1.2;                       // stance triangle
            damage -= this.getDefense();         // flat subtraction
            if(damage < damageObj.getMinDamage())
               damage = damageObj.getMinDamage();
            if(behead) damage *= 1.5;
```
```
Damage.as:160-172
         if(this.attackerlvl <= 10)  return 1 + this.piercingDamage;
         if(this.attackerlvl <= 20)  return this.attackerlvl / 8 + this.piercingDamage;
         if(this.attackerlvl <= 30)  return this.attackerlvl / 6 + this.piercingDamage;
         return this.attackerlvl / 4 + this.piercingDamage;
```
Terms the ledger's "((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)" omits: the **uniform random roll**
over the weapon's min–max band; the **stance triangle ×1.2**; the **attacker-level minimum-damage
floor** (a 4-tier table, not the "EnemyLevel/4" the items-equipment block records); the **flat
additive `STAT_CRITICALDMG`**; and **`behead ×1.5`**.

Confirmed as-written: **Heavy def ×0.8** — `MCSPlayer.as:3233-3235`
`if(this.stance == HEAVY_STANCE) { return defense * 0.8; }`. Heavy trades 20% of your defense for
its 1.5× damage.
Broken weapon: `StatsManager.as:1877` → `basedamage = ATK + findBonusStat(ATK) + 1;` with
`getDamageRange()` returning 0 — a broken weapon is **ATK+1 flat**, not a percentage penalty.

**Verdict: HELD (partial confirmation + three corrections).**

## C9 — Blocker ④ multi-target: **full damage to every enemy the stroke touches**, max one hit each

`reference/decompiled/shs3_android/scripts/NPCManager.as:1219-1256`
```
1225               while(j < slashMax && !enemy.gotHitFlag)
1227                  dist = enemy.mcs.x - slashArray[j].x + offset;
1230                  if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false))
1232                     if(enemy.checkHit(scaledX,scaledY,damage))
…
1252               if(enemy.gotHitFlag)
1254                  comboCount++;
```
The **same `Damage` object** is handed to every enemy — **no falloff, no tip/base gradient, no
per-target division**. `!enemy.gotHitFlag` stops the scan at the first stroke point that overlaps
that enemy, so one enemy takes **at most one hit per stroke**. `dist*dist < 40000` is a **±200 px
x-window between the stroke point and the enemy**, not between the enemy and the player.

**Verdict: HELD. Closes blocker ④ (full damage, not falloff).**

## C10 — Combo = number of **distinct enemies hit by one stroke**, reset on taking damage

`NPCManager.as:1284` → `StatsManager.addCombo(comboCount)`;
`StatsManager.as:4298-4305` → `combo += num; if(combo > 999) combo = 999; BattleUI.instance.showCombo(combo);`
`MCSPlayer.as:3732` → `StatsManager.resetCombo();` fires inside the player's `gotHit`.
Frame confirmation (A1): `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png` top-right shows a red
`3` above `HIT COMBO`.
**Verdict: HELD.** Combo is a *breadth* counter (enemies per swing) plus a *streak* (no damage
taken), capped 999 — the ledger's "combo rules" Ready bullet is right but unquantified.

## C11 — Part-based weak points: the ledger's "shielder legs" is not in the code

The hit resolver walks the character's `partList` **back-to-front** and takes the first part whose
art contains the point (`NPC.as:301-320`). Named parts are `MCSCharacter.PART_hat / _head / _neck /
_weapon / _prop`.

- **Any enemy, head/hat/neck** → `behead = true` (`EnemyShield.as:325-330`, `EnemyZombie.as:496-501`).
- **Shielder**, behead → `damage *= 1.5` (`EnemyShield.as:351-353`).
- **Shielder**, `PART_prop` (the shield) → `gotHitFlag = true; damage = 0; gotHitCounter = 24;
  SoundManager.instance.playHitMetal(); return false;` (`EnemyShield.as:335-340`) — the shield
  **absorbs the hit entirely and grants 24 frames of invulnerability**.
- **Any enemy**, `PART_weapon` → `gotHitFlag = false; damage = 0; return false;` — a clean whiff.
- **Zombie/undead**, *not* behead → `damage /= 2` (`EnemyZombie.as:516-518`). So the undead rule is
  **"everything except the head is 50%-resisted"**, not "the head is a bonus".

**Verdict: HELD, with a correction.** Ledger Ready bullet says *"part-based weak points (shielder
legs, undead heads)"*. Undead heads: right (as a resist, not a bonus). **Shielder legs: no such
rule exists** — the shielder's real rules are head ×1.5 and shield-absorbs-everything.

## C12 — Ledger §3 correction #1 is WRONG: a tap **does** move you to the tapped point

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:2298-2313` (the `else` branch taken when
the gesture is **not** a line):
```
               dist = lineArray[0].x - getMCS().x;
               if(dist * dist < 625)
               {
                  return;
               }
               …
                  lineArray[0].x += offset;
                  this.initMove(lineArray[0]);
```
`MCSPlayer.as:2318-2344` (`initMove`):
```
         this.destX = dest.x;
         …
         if(dist * dist <= 10000)
         {
            this.startAction(WALK_STATE);
         }
         else
         {
            this.startAction(RUN_STATE);
         }
```
Gesture classification is in `InputManager.as:268`:
`isLine = drawArrayLength > lengthThreshhold && getDistanceSQ(firstPoint,lastPoint) > distThreshhold;`
with `lengthThreshhold = 4`, `distThreshhold = 400` (i.e. **>20 px end-to-end and >4 sampled points**
= slash; anything shorter = a move click).

So: **tap → walk/run to that x. Walk if |Δx| ≤ 100 px, run if beyond. 25 px dead-zone.**
There is no mouse-hold-to-run state machine in `InputManager` at all — `battleMouseMoveEvent`
only extends the slash stroke.

Ledger §3 #1: *"Movement is HOLD-mouse-to-run-toward-cursor, not click-to-destination. In-game
Tip #27 is explicit. → **The SESSION11 "hybrid" is half-wrong:** the drawn line is the blade path
(correct), but there is *no* "tap/click = move-to-target" gesture."*
**The SESSION11 hybrid was right and the §3 correction that overrode it was wrong.**
(This matches the memory note that §3's hold-run claim "was REVERSED by measurement 2026-07-25 —
it was never sourced" — the source code now settles it permanently.)

**Verdict: HELD. Overturns §3 correction #1.**

## C13 — The gesture→attack map, with exact thresholds

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:2420-2456`
```
2420         this.slashType = HOR_SLASH;
2426               this.slashType = DROP_SLASH;      // Light + FALL_STATE + destY - mcs.y > 100
2430               this.slashType = AIR_SLASH;       // Light + FALL_STATE otherwise
2435            this.slashType = JUMP_SLASH;         // mcs.y - destY > jumpThreshhold
2439            this.slashType = DOWNSTAB_SLASH;     // canStab && destY < lastPt.y && |destX-lastPt.x| < 50
2443            this.slashType = UP_SLASH;           // destY - lastPt.y > jumpThreshhold  → launcher
2450               this.slashType = HOR_SLASHUP;     // diff > 25
2454               this.slashType = HOR_SLASHDOWN;   // diff < -25
```
`endSlash` turns `UP_SLASH` into a launcher only if the stance has unlocked it —
`MCSPlayer.as:2781-2784`: `if(this.slashType == UP_SLASH && this.canLaunch) launchType = Damage.LAUNCH_AIR;`
and `canLaunch/canDeflect/canStab/canFlipUp/canAirCombo` are gated at mastery ≥3/4/5 per stance
(`MCSPlayer.as:3164-3187`) or by explicit skill IDs 1014–1019 / 1036–1038 in the skill-tree path
(`MCSPlayer.as:3131-3154`). `DOWNSTAB_SLASH` also **teleports the landing x by ±55 px**
(`MCSPlayer.as:2459-2466`).
**Verdict: HELD.** The ledger's "gesture→attack map" Ready bullet is correct in kind, and now
carries eight named types with numeric thresholds.

## C14 — Blocker ③ (early-mob HP, starter weapon DMG, hits-to-kill) is CLOSED by the payload XML

`reference/extracted/npcdata.xml:22-29`
```
	<npc>
		<id>1</id>
		<name>5009</name>
		<lvl>3</lvl>
		<hp>1</hp>
		<ai>1</ai>
		<attack>3</attack>
		<defense>0</defense>
```
`reference/extracted/itemdata.xml:7906-7913` (item 13002 — the engine's hard-coded fallback weapon,
`EnemyElite.as:97` → `itemdata = QuestEngine.getItemData(13002);`)
```
		<id>13002</id>
		<type>9</type>
		<name>4041</name>
		<baseprice>0</baseprice>
		<minlvl>-4</minlvl>
		<mindamage>1</mindamage>
		<maxdamage>2</maxdamage>
```
With `<hp>1</hp>`, `<defense>0</defense>` and a damage floor of `1 + piercing` for any attacker of
level ≤10 (`Damage.as:160-162`), **hits-to-kill on early field mobs is exactly 1, unconditionally** —
even a Light-stance mastery-0 swing (×0.5 on a 1–2 roll) is floored to 1 and the mob has 1 HP.
This independently confirms the SESSION 11 frame measurement "mobs die in ONE hit" from source.
The ledger's close-path (*"read L1 bandit-fight popups in video A"*) is unnecessary.
**Verdict: HELD. Overturns blocker ③.**

## C15 — Hitstop / screen-shake / kill-beat: shake EXISTS, per-hit hitstop does NOT

`reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227`
```
      public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *
…
            shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
            gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
            gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
```
Uniform random jitter of ±amt/2 on both axes, **auto-decaying over the final `amt` frames**
(`min(amt, counter)`), snapping back to origin at counter 0. Callers are **not** ordinary slashes —
they are Deadly Cleave (`MCSPlayer.as:911`, 12 frames), Earthquake jutsu (`MCSPlayer.as:946`,
24 frames), Heavenly Sword (`HeavenlySwordProjectile.as:76`, 12), crusher traps
(`Trap_CrusherBlockAuto.as:88`, 6) and `Marker_RumbleTrigger`.
Per-hit feel is instead **12 frames of invulnerability** (`gotHitCounter = 12`, `MCSPlayer.as:3719`,
`EnemyShield.as:362`) plus a red vignette on the player (`BattleUI.showHurtRed()` →
`this.hurtred.gotoAndPlay(1)`, `BattleUI.as:424-428`). There is **no global time-freeze on a landed
hit**.
The kill-beat is a distinct "red freeze" fired only when the **last enemy of the last wave** is
dying (`NPCManager.as:1630-1648`), lasting `24 * 6` ticks (`StageManager.as:1101`).
**Verdict: HELD. Overturns art-anim-audio-feel blocker ④** (*"**screen-shake** + **hitstop-on-landed-hit**
(never catalogued)"*): screen-shake is fully catalogued above; hitstop-on-landed-hit does not exist.

## C16 — Floating damage popups: exact colours and anchor

`reference/decompiled/shs3_android/scripts/EnemyShield.as:392-408` /
`MCSPlayer.as:3805-3826`
```
                  ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);
…fire 16737792 · wind 13421772 · water 26367 · earth 6697728
```
= physical `0x990000`, fire `0xFF6600`, wind `0xCCCCCC`, water `0x0066FF`, earth `0x663300`,
each spawned at the victim's `(x, y − 100)`. Elemental damage is **a separate popup per element**,
each mitigated by its own `STAT_?DEF` with a floor of 1 whenever the incoming elemental term was >0.
**Verdict: HELD. Closes ui-hud blocker ③** (*"floating damage/crit **popups** (absent from the
ledger, confirmed to exist)"*).

## C17 — The string-table blocker is LOCATED but the bytes are NOT extracted (PARTIAL — honest limit)

`reference/decompiled/shs3_android/scripts/LangManager.as:37-59`
```
         var server:String = "./data/";
…
            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
```
`reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5`
```
   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
```
So: on the **web** build the string table is a **server-side file** `data/shs3_en.xml` — which is
why `reference/extracted/bindata/` is exhausted without finding it, and why the numeric IDs in
`itemdata/skilldata/npcdata` resolve to nothing locally. On the **mobile** build it is embedded as
binary asset `118_Mobile_Lang_EN.bin`, and **we hold that SWF**: `reference/preservation/shs3_android_payload.swf`
(15,142,649 bytes). Its header is `435753 72 7899226910…` — not a plain `CWS`+zlib stream, so a
naive `zlib.decompress` at offset 8 fails; JPEXS 26.2.1 read it fine (it exported 970 scripts,
`android_export.log:511` → `Exported script 511/970 Mobile_Lang_EN`), but only *scripts* were
exported — no `binaryData` export was ever run, and JPEXS is not installed on this machine
(`which ffdec` → not found).

**Verdict: PARTIAL.** The table is *identified and physically present in a file we hold*, but the
strings are **not on disk today**. Do **not** claim any `<name>`/`<desc>`/`<displayname>` is held.
Close-path is one command, not an expedition: JPEXS `-export binaryData` on
`reference/preservation/shs3_android_payload.swf`.

## C18 — What is still STILL_UNHELD in combat-core

- **Whether the web v0.717 numbers equal these mobile numbers.** Every constant above is from the
  Android bundle. The web payload's logic is identifier-mangled, so there is no second source to
  diff against. `maxreload = 5*24` with a dead `baseReload` looks like a mobile-side simplification
  — I cannot prove the web build did the same.
- **Animation timing of a slash** (start/active/recovery in frames). `doSlash` gates on animation
  labels (`LIGHTSLASH_START/_MID` etc.) and `lightSlashSpeed / balancedSlashSpeed / heavySlashSpeed`;
  those speeds and the per-label frame counts live in the `<animdata>` bindata sets (bindata 100–118),
  which I did not open — that is the art-anim lane's ground.
- **`jumpThreshhold`'s value** — used at `MCSPlayer.as:2433/2441/2789` but declared outside the
  region I read; I did not verify it and will not guess.
- **`DASH_SLASH_PX = 127`** (ledger Surface bullet). I found no `127` in the slash path. The
  in-slash forward motion is `movement(lightSlashSpeed | balancedSlashSpeed | heavySlashSpeed)`
  toward `destX`, i.e. an animation-speed glide to the stroke's first point — not a fixed 127 px
  dash. I could not locate the constant's origin, so I am **not** calling the ledger wrong here;
  it is unverified in either direction.
