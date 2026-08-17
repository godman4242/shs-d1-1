# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 17 surveys · 56 critic reviews · 722 claims · 1085 verdicts.

## actionscript — re-scored ?

Not a system sweep — no re-score submitted. Context for whoever does re-score: this lane closes, with A2 payload cites, combat-core blockers ①④⑤, skills-meters ③④⑤, items-equipment ③⑤, economy ②, world-exploration ③④, meta-social ②, art-anim ④, progression ②, plus three §1 unknown-unknowns (multi-target rule, hit-registration window, save/serialization schema) and two of §6's six "structurally unrecoverable" bullets (L11–80 XP curve, save format). It also creates one new cross-cutting blocker: the readable Android v0.682 export and the obfuscated web v0.717 payload carry DIFFERENT combat tuning (crit 1.2/1.5 vs 1.3; Heavy stance 1.5 vs 1.4; mastery scale ×0.01 vs ×0.1; Focus max 120 vs 192), so every combat number sourced from the readable build must be re-verified against the web payload before use. Non-combat data (expArray, sell formula) IS byte-identical across builds, so the rule is per-value, not per-file.

### `actionscript/ap-and-war-clocks` — HELD [A2] ⚑ OVERTURNS LEDGER

All real-time clocks are explicit and server time is counted in whole seconds: AP regenerates 1 per 60s (doubled by the AP buff), the second timed resource 'DT' 1 per 120s, and a war move accrues 1 per 3600s — and regen is offline-accruing arithmetic, not a live tick.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158-162 (intervals), :1099-1104 (accrual + buff), :707 (start AP 30); units proved by QueryManagerBase.as:39 'new Timer(1000)', :111 'this.serverTime += 1;', :105 'new Date(this.serverTime * 1000)'`
- **Quote:** 158:      internal static var APINTERVAL:int = 60;
160:      internal static var DTINTERVAL:int = 2 * 60;
162:      internal static var WARMOVEINTERVAL:int = 60 * 60;
 — 1099-1100: 'timeDiff = timeVariable - nextAPUpdate; diff = Math.floor(timeDiff / APINTERVAL) + 1;'  1101-1104: 'if(hasBuff(BUFF_AP)) { diff *= 2; }'
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap."
- **Lane impact:** L-world-exploration (blockers ③ and ④ closed — AP cap is STAT_MAXAP + bonus, rate 1/min), L-meta-social (the ledger's surface note '"moves per turn" reconciles as "per hour"' is CONFIRMED literally by WARMOVEINTERVAL = 60*60), L-economy.

### `actionscript/auto-slash-is-the-enemy-ai` — HELD [A2] ⚑ OVERTURNS LEDGER

AUTO SLASH is not a separate autoswing routine — the toggle routes the player's own character through the enemy AI function — so its cadence is the AI tick: a decision every 12 frames (0.5s) for the player and elites, every 24 frames (1s) for ordinary NPCs.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1149 (routing), NPC.as:22 with overrides at MCSPlayer.as:165 / EnemyElite.as:18 / EnemyPlayer.as:52 / FriendlyElite.as:18 (cadence), MCSPlayer.as:4426 with rolls at :4520-4556 (the decision)`
- **Quote:** 1149:         if((this.controlledBy == 1 || this.controlledBy == 3 || this.autoSlash) && !dead && checkAITrigger() && !GameEngine.isAdventureMode() && !NetworkManager.instance.playBack)
1151:            this.AI();
 — NPC.as:22 'internal var aiCounterMax:int = 24;' overridden to 12 at MCSPlayer.as:165; and MCSPlayer.as:4530 'this.doReload = 24 + Math.random() * (this.maxreload - 24);'
- **Overturns:** "AUTO SLASH cadence."
- **Lane impact:** L-combat-core (the §1 known-unknown 'AUTO SLASH cadence' closed), L-enemies-ai (the AI's randomised doReload target explains the observed 'enemy backs off to recharge' behaviour — it is deliberately disengaging to refill Focus for a crit).

### `actionscript/crit-is-focus-gated-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Critical hits in v0.717 are deterministic, not probabilistic: a slash crits iff the Focus ('reload') bar is exactly full, the multiplier is a flat x1.3, gear STAT_CRITICALDMG is a flat addend applied AFTER the multiply, and landing the crit zeroes the bar.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274 (read) and :3295-3297 (consumption)`
- **Quote:** 3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
 — consumption 3295-3297: 'if(this.§1t4414s0§ == this.§1t4415s0§) { this.§1t4414s0§ = 0; }'
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L-combat-core (blockers ② 'crit 1.3 vs 3 final read' and ⑤ 'Focus/crit gating rule' both closed) and L-skills-meters (blocker ⑤ closed). Also confirms §3 item 2's CRIT_MULT=1.3 for v0.717 and explains the '3x' folklore as 1.3 x 1.4 Heavy + flat gear crit-damage.

### `actionscript/damage-is-a-random-roll` — HELD [A2] ⚑ OVERTURNS LEDGER

Physical damage is NOT deterministic — the pre-stance base is a uniform random roll between the weapon's mindamage and maxdamage offset by ATK — and a BROKEN weapon collapses the roll to ATK + 1 with zero range.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258; inputs at reference/decompiled/shs3_android/scripts/StatsManager.as:1863-1888 (getMinDamage, broken branch :1871-1877) and :1890-1903 (getDamageRange, broken branch :1892)`
- **Quote:** 3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
 — StatsManager.as:1881 'basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;' · :1875 broken → 'basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1;' · :1903 'return itemdata.maxdamage - itemdata.mindamage;'
- **Overturns:** "**Damage math:** Physical = (ATK + WeaponDMG) × stanceMult; Heavy defender Defense ×0.8 (one way); Critical = 1.3 × Physical"
- **Lane impact:** L-combat-core (the stance mult, the x0.8 and the 1.3 are all confirmed; the MISSING term is the random weapon range, which is why TTK reads off video never resolved to clean integers) and L-items-equipment (blocker ② partial: the broken end of the condition ladder is not a multiplier at all — it REPLACES the weapon contribution with +1). Full v0.717 chain: roll = ATK+bonus+wpn.min + rand*(wpn.max-wpn.min) → x stanceMult(stance,mastery) → if Focus full x1.3 + STAT_CRITICALDMG → defender Heavy defends at defense*0.8.

### `actionscript/focus-meter-numerics` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus meter's full v0.717 numeric model: max 192 (8*24 = 8s at 24fps), +1 per game frame, +6 when a slash lands on at least one enemy, minus slashUsage per slash (halved in Light, x1.5 in Heavy/Dual), minus a flat 48 for an in-battle stance change, and zeroed by spending a crit; slashUsage comes from the equipped weapon with a floor of 48.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249, :1203-1205, :3318-3320 (caller §1t1543s0§.as:2047-2049), :3300-3311, :3162; weapon floor reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1927; UI dead-zone MCSPlayer.as:1163-1168`
- **Quote:** 249:         this.§1t4415s0§ = 8 * 24;   /  1203-1205: 'if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§;'  /  3318-3320: 'public function §1t4479s0§() : * { this.§1t4414s0§ += 6;'  /  3302,3306,3310: '-= this.slashUsage / 2', '-= this.slashUsage', '-= this.slashUsage * 1.5'  /  3162: 'this.§1t4414s0§ -= 48;'
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L-skills-meters (blocker ③ closed), L-combat-core, L-ui-hud (the bar is driven by a per-frame integer, so it is a snap-per-frame not a tween — answers ui-hud blocker ② in part; and the displayed bar is (reload-24)/(max-24), a hidden 24-unit dead zone).

### `actionscript/hit-registration-window` — HELD [A2] ⚑ OVERTURNS LEDGER

Hit registration is instantaneous at slash resolution, evaluated by walking the released polyline point-by-point — there is no swept active window an enemy can dodge into or out of — and resolution walks the paperdoll part list FRONT-to-BACK so the topmost part struck decides the hit (which is the actual mechanism behind 'shielder legs / undead heads' weak points).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:301-321`
- **Quote:** 306:         var i:* = int(max - 1);
307:         while(i >= 0 && !gotHitFlag)
309:            mc = partList[i];
310:            if(mc.hitTestPoint(hitX,hitY))
312:               if(this.gotHit(mc,damage))
- **Overturns:** "**Hit-registration window** (instant at release vs an active sweep an enemy can dodge into/out of)."
- **Lane impact:** L-combat-core, L-enemies-ai, L-items-equipment (weak points are literally paperdoll slots, so the weak-point table and the equipment layer table are the same table).

### `actionscript/in-combat-stance-not-hard-locked` — HELD [A2] ⚑ OVERTURNS LEDGER

v0.717 does NOT hard-lock stance in combat — the in-combat switch is alive, gated on Focus >= 48 and costing a flat 48 Focus; 'CANNOT CHANGE STANCE' is the insufficient-Focus / wrong-action-state message, not a version removal.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3050 (gate), :3058-3062 (early-out), :3160-3162 (in-battle cost); state predicate at :3043, mirrored plain-named at reference/decompiled/shs3_android/scripts/MCSPlayer.as:2965`
- **Quote:** 3048:      public function §1t4470s0§() : Boolean
3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
3060:         if(this.§1t4414s0§ < 48)
3062:            return;
3160:         if(§1t1525s0§.§1t9948s0§())   // isBattle()
3162:            this.§1t4414s0§ -= 48;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**."
- **Lane impact:** L-combat-core, L-skills-meters, L-ui-hud — this is backwards in the ledger: the recreation's Focus-gated in-combat switch is ORIGINAL v0.717 behaviour, down to the mechanism. FRAME-vs-DOC: the frame showing 'CANNOT CHANGE STANCE' still WINS on what was on screen — the message was displayed; what the code overturns is the inference that it means a permanent lock. Predicted re-crop check: the Focus bar in that frame reads under 48/192 (~25%).

### `actionscript/multi-target-full-damage` — HELD [A2] ⚑ OVERTURNS LEDGER

One arc hitting N enemies deals the same full Damage object to every one of them — no falloff toward the tip and no split — each enemy hit at most once per slash (gotHitFlag), broad-phased by a ±200 px horizontal window, and the combo counter increments by the number of DISTINCT enemies hit, not by hits.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295`
- **Quote:** 1221:               while(j < slashMax && !enemy.gotHitFlag)
1230:                  if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false))
1232:                     if(enemy.checkHit(scaledX,scaledY,damage))
1251:               if(enemy.gotHitFlag)
1253:                  comboCount++;
1285:            StatsManager.addCombo(comboCount);
- **Overturns:** "**Multi-target damage rule** (one arc hits N enemies — full damage each? falloff toward the tip?)."
- **Lane impact:** L-combat-core (§4 blocker ④ 'multi-target per-hit rule (full vs falloff)' closed and the §1 unknown-unknown deleted), L-ui-hud (combo semantics = distinct enemies). Note the neutralList is swept by the same loop, so civilians/animals are cuttable by a stray arc.

### `actionscript/paperdoll-compositing-contract` — HELD [A2] ⚑ OVERTURNS LEDGER

The sprite-compositing contract is fully specified: 27 named body slots in an explicit back-to-front z-order, with the art class for any slot resolved by string-concatenating the part name and the item's art id (fallback <partType>0) — which is exactly why the payload's asset classes are named head8000, torso4000, weapon13000, item0.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:9-62 (z-order) and :581-612 (class resolution) and :683/:706/:724/:755 (head sub-stack indices); asset classes on disk at reference/decompiled/shs3_payload/scripts/head8000.as, torso4000.as, weapon13000.as, mask9000.as, item0.as`
- **Quote:** PART_l_hand 0 · PART_l_uparm 1 · PART_l_lowarm 2 · PART_weapon 3 · PART_prop 4 · PART_l_foot 5 · PART_l_thigh 6 · PART_l_calf 7 · PART_crotch 8 · PART_r_foot 9 · PART_r_thigh 10 · PART_r_calf 11 · PART_neck 12 · PART_stomach 13 · PART_pelvic 14 · PART_torso 15 · PART_head 16 · PART_hat 17 · PART_r_hand 18 · PART_r_uparm 19 · PART_r_lowarm 20 · PART_prop2 21 · PART_prop3 22 · PART_l_shoulder 23 · PART_r_shoulder 24 · PART_l_knee 25 · PART_r_knee 26  — and :605 'ClassDefinition = Class(getDefinitionByName(partType + art.toString()));' with :609 fallback 'getDefinitionByName(partType + "0")'
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L-items-equipment (blocker ⑤ closed — the layer order is a 27-entry literal and the naming rule is deterministic), L-art-anim-audio-feel, L-enemies-ai. Non-obvious detail a from-scratch renderer would get wrong: inside the head slot the explicit indices are head=0, headMask=1, hatHair=2, hair=3, i.e. the MASK renders BEHIND the hat-hair and hair.

### `actionscript/reach-300-200-100-refuted` — HELD [A2] ⚑ OVERTURNS LEDGER

The reach triple 300/200/100 cannot be produced by v0.717 at any mastery, so it is not a mastery-9 ceiling: Light reach is a FIXED x1.4 of base while Balanced is >= 1.0x base, capping the Light:Balanced ratio at 1.4 — but 300:200 = 1.5. The only part the code confirms literally is Heavy's 100, which is a hard floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119 (and the 1.5 ratio IS reachable in the Android build at mastery 0: reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030)`
- **Quote:** 3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;            // LIGHT — no mastery term at all
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);   // BALANCED >= 1.0x
3117-3119:               if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }   // HEAVY hard floor
- **Overturns:** "`STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L-combat-core — 'Heavy should be 100 not 120' is CONFIRMED as a literal code floor; 'they're mastery-9 values' is REFUTED for v0.717. Retires the planned Tier-1 code task from 'relabel mastery-9' to 'replace the whole table with the formula'. The 300/200/100 row, if real, describes the mobile v0.682 tuning.

### `actionscript/reach-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The blade-path reach cap is fully specified in stage pixels — baseSlashLength = 120 + floor((90 + 5*DAN) * SPEED / (20 + SPEED)), times a per-stance multiplier, with a hard 100 px floor on Heavy and Dual — and it is enforced on the drawn line at input time via InputManager.setMaxDistance.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (parity: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2347); per-stance §1t99s0§.as:3094/3105/3116/3131/3142 with floors at :3119 and :3145; cap enforced §1t99s0§.as:3158 = android MCSPlayer.as:3094 'InputManager.setMaxDistance(this.slashLength);' + InputManager.as:106-109`
- **Quote:**       internal static function getBaseSlashLengthVal(speed:int) : int
      {
         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
      }   — v0.717 multipliers: LIGHT x1.4 (3094) · BALANCED x(1+0.2*m*0.1) (3105) · HEAVY x(0.5+0.4*m*0.1) floor 100 (3116/3119) · REVERSED x1.4 (3131) · DUAL x1.0 floor 100 (3142/3145)
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L-combat-core — the highest-weight blocker in the system, closed without a measurement pass and without a playable build. Usable numbers at Dan 0: SPEED 0 → base 120 ⇒ Light 168 / Balanced 120 / Heavy 100(floor); asymptote → base 210 ⇒ Light 294 px max.

### `actionscript/save-schema` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete client-side save schema exists — 20 data slots plus 4 timer slots, each with a named serializer, a pipe-delimited wire format and a %54321 checksum — and the client ships its own offline SharedObject persistence path, so a single-player save model does not have to be invented.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 (slot map) + QueryManagerBase.as:15 (DATASLOTS=20) + StatsManager.as:4362-4381 (wire format) + QueryManagerPIO.as:1024-1029 and :1218 (offline path) + QueryManagerBase.as:97 (SharedObject)`
- **Quote:** saveUpdate(0,getPlayerLevelString()); saveUpdate(1,getPlayerStatsString()); saveUpdate(103,getBattleStatsString()); saveUpdate(2,getEquipmentString()); saveUpdate(3,getSkillStatsString()); saveUpdate(4,getInventoryString()); saveUpdate(5,getQuestItemsString()); saveUpdate(6,getIntStatsString()); saveUpdate(7,getBooleanStatsString()); saveUpdate(8,getActiveQuestString()); saveUpdate(9,getCompletedQuestString()); saveUpdate(10,getLocationString()); saveUpdate(11,getTaunt()); saveUpdate(12,getFriendListString()); saveUpdate(14,getSkillSlotsString()); saveUpdate(15,getSide()); saveUpdate(16,getPla
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L-meta-social, L-progression, L-world-exploration; also deletes the §1 unknown-unknown 'Save/serialization schema for every system (the original was server-side, so there's nothing to copy — must be designed)'.

### `actionscript/screenshake-and-killbeat` — HELD [A2] ⚑ OVERTURNS LEDGER

Screen-shake exists, is parameterised and self-decays (default amplitude 30 px, uniform ±amp/2 on both axes, amplitude tapering as min(amt, remaining frames)); the kill beat is a separate global redFreeze state budgeted at 24*6 = 144 frames — and there is NO per-hit hitstop.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1228 (shake) and :1075-1106 with stepped release at :903/:916/:926 (redFreeze); call sites MCSPlayer.as:4180 (12f), :911 (12f), :946 (24f), Trap_CrusherBlockAuto.as:88 (6f), Trap_CrusherColumnAuto.as:90 (6f), HeavenlySwordProjectile.as:76 (12f)`
- **Quote:** 1200:      public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *
1225:            shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
1226:            gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
1227:            gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
 — 1101:            redFreezeCounter = 24 * 6;   (skip path 1096: 24 * 3 + 6)
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued)"
- **Lane impact:** L-art-anim-audio-feel (blocker ④), L-combat-core (feel). Screen-shake is now fully catalogued with per-event durations at 24fps. The honest other half: hitstop-on-landed-hit does NOT exist — the only global time-stop is the 6-second kill-beat redFreeze, which fans out to gameStage, NPCManager, ProjectileManager, ParticleSystemManager and the player.

### `actionscript/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Sell price is (1 + affixModifierCount) x 10 for items of weight >= 10 and x 5 below that, with anything itemID < 3000 selling for a flat 1 — it does NOT scale with rarity or level, and it is identical in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 (affix count at Item.as:307-310); web parity reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
- **Quote:** 1582:      public function getSellAmt() : int
1584:         if(this.itemID < 3000)
1586:            return 1;
1588:         if(this.getWeight() >= 10)
1590:            return (1 + this.getModifierCount()) * 10;
1592:         return (1 + this.getModifierCount()) * 5;
- **Overturns:** "**Sell price is NOT flat per item** — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L-economy (blocker ② half-closed) and L-items-equipment (blocker ③ closed). The ledger's own observation is reproduced exactly by the true mechanism: 5c = a light item with 0 modifiers (1+0)x5; 25c = the same item with 4 modifiers (1+4)x5. The mechanism is affix count x weight class, not rarity/level.

### `actionscript/spd-to-cooldown` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The SPEED→cooldown transfer function is linear and hard-capped: cooldowns are multiplied by 1 − min(SPD,300)/300 × 0.5, so SPEED 300 is the cap and buys exactly a 50% cooldown reduction; the SPEED buff multiplies SPD by 1.5 before the clamp.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860 (related: getBaseReload at :1839-1842 = 48 + SPEED*6)`
- **Quote:** 1854:      internal static function getSkillCooldownModifierVal(speed:int) : Number
1856:         if(speed > 300)
1858:            speed = 300;
1860:         return 1 - speed / 300 * 0.5;
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L-skills-meters (blocker ④) and L-progression (blocker ① 'SPD range/cooldown scaling' half). PARTIAL only because I could NOT locate the obfuscated twin in the web payload (literal search for '300 * 0.5' returns nothing there), so per as/build-divergence the SHAPE is solid but the CONSTANTS are Android-sourced pending a web confirm.

### `actionscript/stance-damage-is-mastery-10` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's stance damage triple 0.9/1.2/1.4 is exactly right but it is a MASTERY-10 ceiling, not mastery-9: Light = base x (0.5 + 0.4*m*0.1), Balanced = base x (1 + 0.2*m*0.1), Heavy/Dual/Reversed = base x 1.4 fixed, and skills 1000/1001/1002 each have exactly 10 levels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3261-3270; mastery cap from reference/extracted/skilldata.xml (skills 1000/1001/1002 each carry 10 <level><value> rows, values 1..10, counted programmatically)`
- **Quote:** 3261:            case §1t12220s0§:
3262:               _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3264:            case §1t12221s0§:
3265:               _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3267-3269:            case §1t12222s0§: case §1t12223s0§: case §1t12224s0§:
3270:               _loc2_ = _loc1_ * 1.4;
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed)"
- **Lane impact:** L-combat-core, L-skills-meters, L-progression — the base row and 'Heavy is fixed x1.4' are confirmed exactly; the ceiling is mastery-10 with linear +0.04/level (Light) and +0.02/level (Balanced), so §3's decide-and-flag ('model the curve or target mastery-9') resolves to 'model it, it's two lines'.

### `actionscript/war-board-is-a-hex-grid` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room board is a hexagonal grid whose cells carry one of 14 typed roles with rendered directional adjacency arrows — not an abstract adjacency list and not a square grid; and Survival Mode is a mode OF the War system, not a standalone mode.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHex.as:10-40 (hex types) and :40-70 (narrow/sarrow/earrow/warrow adjacency children); Survival ownership at WarHexUI_SurvivalModeData.as:5; WarRules.as:23 (6-page rules screen)`
- **Quote:** HEX_NOTHING 0 · HEX_SPAWNPOINT 1 · HEX_FORWARDBASE 2 · HEX_CONTROLPOINT 3 · HEX_TOWN 4 · HEX_POTENTIALSPAWNPOINT 5 · HEX_UPCOMINGSPAWNPOINT 6 · HEX_LADDER 7 · HEX_DEFENSE 8 · HEX_VILLAGE 9 · HEX_CITY 11 · HEX_CASTLE 12 · HEX_DISABLEDSPAWNPOINT 13 · HEX_DEMOLISHEDSPAWNPOINT 15  — and WarHexUI_SurvivalModeData.as:5 '[Embed(source="/_assets/109_WarHexUI_SurvivalModeData.bin", mimeType="application/octet-stream")]'
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** L-meta-social (blocker ② closed). Also REFINES Stage-0 finding S0-1, which called bindata 119 <survivalmodedata> 'an ENTIRE GAME MODE absent from all 12 ledger systems' — the owning class is WarHexUI_SurvivalModeData, so it homes squarely in meta-social rather than nowhere (blob index differs per build: 109 Android / 119 web).

### `actionscript/xp-curve-l11-80` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete XP threshold table for levels 1–98 is a literal array in the source, byte-identical in the web v0.717 payload and the Android v0.682 build — the L11–80 curve is not extrapolated, not partial, and not lost.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78 (parity: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364; programmatic compare printed 'entries 99 / android entries 99 / IDENTICAL: True')`
- **Quote:**       public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300, … ,19295800,22095800,25395800,29395800];  // expArray[11]=37400, expArray[80]=4285800; semantics fixed by StatsManager.as:1591 'if(expArray[q] > currentXP) return q;' and levelCap=80 at :76
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L-progression: §4 blocker ② deleted outright; the system's 55/100 score floor rises. Also kills the §0 bullet listing the L11-80 curve as structurally unrecoverable.

### `actionscript/anim-format` — HELD [A2]

The animation system is a keyframe transform-matrix format, not sprite sheets: each <anim> carries a duration d and loop flag l, each <f> frame holds per-part nodes keyed by part index i with x/y plus either a rotation r or a full 2x2 matrix a/b/c/d — and all 13 stance slash POSE anims get a hard-coded +10 frame hold appended at parse time.

- **Cite:** `reference/decompiled/shs3_android/scripts/AnimData.as:12-42 and FrameNodeData.as:29-43`
- **Quote:** AnimData.as:13-14: 'this.duration = xml.@d; this.looping = xml.@l == 1;' … :26-27 'case "light_afterslashpose": this.duration += 10;' … :30-41 the 13 *SLASH*_POSE cases 'this.duration += 10;'  /  FrameNodeData.as:30-43: 'this.x = xml.@x; this.y = xml.@y; if(xml.@r.toString() == "") { this.matA = xml.@a; … this.matD = xml.@d; } else { this.rotation = xml.@r; } this.id = xml.@i;'
- **Lane impact:** L-art-anim-audio-feel — this is the SCHEMA for the 19 <animdata> bindata blobs from Stage-0 finding S0-1 and the ~450 animations counted in S0-4, converting an unlabelled binary pile into a parseable animation library. The +10-frame pose hold is the code-side origin of the observed pose latch.

### `actionscript/build-divergence` — HELD [A2]

Android v0.682 and web v0.717 do NOT share combat tuning — six constants differ (crit 1.2/1.5 vs 1.3; Heavy damage 1.5 vs 1.4; mastery scale x0.01 vs x0.1; Light reach 1.5 vs 1.4; Focus max 120 vs 192; stance-change cost maxreload/6 vs flat 48) — while non-combat data (expArray, sell formula) is byte-identical, so Stage-0 finding S0-3's caveat moves from 'parity NOT established' to 'parity DISPROVEN, per-value'.

- **Cite:** `web reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277, :3083-3150, :249 vs android reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223, :3019-3084, :239`
- **Quote:** web §1t99s0§.as:3272-3274 'if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§;' — vs android MCSPlayer.as:3215-3221 'if(this.reload == this.maxreload) { if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; } return maxDamage * 1.5 + this.STAT_CRITICALDMG;'
- **Lane impact:** All lanes L1..L11 — a governing rule for every payload-derived number. The readable build is the WRONG one to copy combat numbers from; v0.717 is the build that matches the wiki.

### `actionscript/native-resolution` — HELD [A2]

Native stage is 800 x 480 as a code constant, not an inference, and the engine carries an explicit letterbox/scale transform (stageScale, stageOffsetX/Y) that is applied to hit-test coordinates — so HUD fractions measured off a 1920x1080 capture are suspect exactly as the ledger warned.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:80-98; transform applied at NPCManager.as:1226-1227`
- **Quote:** 80:      public static var stageWidth:int = 800;
82:      public static var stageHeight:int = 480;
86:      public static var stageScale:Number = 1;
88:      public static var stageOffsetX:Number = 0;
96:      public static var stageBaseWidth:int = 800;
98:      public static var stageBaseHeight:int = 480;
- **Overturns:** "**Native resolution is 800×480 (5:3)**, not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed."
- **Lane impact:** L-ui-hud (blocker ① 'read stage.stageWidth in a build' no longer needs a build) and L-combat-core (all reach px in as/reach-formula are stage px, and stage px are now unambiguous). Honest limit: stageScale/stageOffset are runtime-set, so the letterboxing question is a render-time question these literals do not fully answer.

### `actionscript/repair-cost` — STILL_UNHELD [STILL_UNHELD]

The Repair-Weapon cost formula was NOT found in either ActionScript tree during this sweep — the condition/broken machinery is fully present (condition tiers at 0 / <25 / <50 / <75 / else, plus isBroken()) but no repair pricing.

- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L-economy — blocker ③ STANDS. Reporting honestly rather than guessing. Next actor should grep reference/decompiled/shs3_android/scripts/ for the repair action icon / InteractUI shop branch rather than StatsManager (where I looked); the condition machinery that a repair cost would key off is at Item.as:714-756 and Item.as:1467.

### `actionscript/stance-counter-triangle` — PARTIAL [A2]

A stance rock-paper-scissors relationship (Light beats Heavy, Balanced beats Light, Heavy beats Balanced) is asserted by the shipped in-game text and appears in NO ledger system; the '-20% Defense' half of that text is confirmed in code, but I could not find any code path applying a counter bonus, so the triangle may be advisory flavour rather than a mechanic.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 6001/6003/6005 (resolved from reference/extracted/android/118_Mobile_Lang_EN.bin per S0-3); code half at reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3288; Damage carries an attacker stance at reference/decompiled/shs3_android/scripts/Damage.as:28 but the only getStance() reader in the whole Android tree is BattleUI.as:368, a HUD write-back`
- **Quote:** 6001 = 'Swift but light stance. Slash range is longer but damage inflicted is lower.\nEffective against Heavy Stance.' · 6003 = 'Balanced stance.\nEffective against Light Stance.' · 6005 = 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%'  — code: 3288 'return defense * 0.8;'
- **Lane impact:** L-combat-core and L-skills-meters — a whole asserted relationship absent from both ledgers. PARTIAL and deliberately not upgraded: the TEXT is an artifact, the MECHANIC is not grounded. Do NOT encode a counter bonus. Live lead for the next actor: grep the obfuscated web tree for a READ of Damage.stance.

### `actionscript/three-shipped-languages` — HELD [A2]

The game shipped three localisations — English, Simplified Chinese and Japanese — each its own resource file inside a fixed 18-file resource manifest, so two more complete 2,533-entry string tables exist beyond the one Stage-0 used.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:62-68 (with the other 15 slots named at :32-56); device-font fallback at LangManager.as:131/135`
- **Quote:** 62:      public static var FILE_LANG_EN:int = 15;
64:      public static var FILE_LANG_ZHCN:int = 16;
66:      public static var FILE_LANG_JA:int = 17;
68:      public static var TOTALFILECOUNT:int = 18;
- **Lane impact:** L-ui-hud, L-quests-story — Stage-0 finding S0-3 resolved names from 118_Mobile_Lang_EN.bin alone; ZHCN and JA tables of the same 2,533 entries can cross-check any ambiguous English row. Also relevant to the font question (S0-2 settled the face as 'Edo SZ'): LangManager sets textfield.embedFonts = false on those paths, i.e. a device-font fallback.

### `actionscript/web-payload-obfuscated` — HELD [A2]

The web v0.717 payload's game logic survives only as identifier-obfuscated ActionScript, so the readable 970-file Android v0.682 export is the only plain-named index into it — the index's 385 'shs3_payload classes' are almost entirely PlayerIO SDK, Google Analytics, Flash UI and asset-symbol stubs, not game code.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255 (plus the directory: 645 top-level .as files named §1t<N>s0§.as and an obfuscated package scripts/§1t51s0§/§1t51s1§/)`
- **Quote:**       internal function §1t4475s0§() : int
- **Lane impact:** All lanes L1..L11 — this is the method note for the whole payload-era corpus: find the shape in the Android tree, then re-verify the constant in the web tree.

## art-anim-audio-feel — re-scored 84

56 -> 84. Every one of the five named blockers in the "### art-anim-audio-feel — 56" block is now resolved: (1) ALL AUDIO is recovered as 26 playable MP3 masters plus the complete mixing/trigger contract; (2) the font is identified down to its embedded font program and vendor copyright string; (3) "FX blend modes" is answered — the game sets NO blendMode anywhere, all compositing is ColorTransform + BlurFilter + ColorMatrixFilter via one small class; (4) screen-shake is fully catalogued (exact algorithm, default amplitude 30, trigger set); (5) the severed-limb death is not one variant but a gore SYSTEM with a measured 40/20/20/20 distribution, a behead flag, and a global censor switch. On top of that the animation model is settled from bytes (24 Hz keyframe stream, 21-node rig, code-added hold tails) and 14 of 18 animation blobs are proven byte-identical between the Android and web builds, so the usual Android caveat does not apply to motion. Held back from higher: the newly-opened vector art (1,949 sprites in SHS3Resource, 49 backgrounds in BGResource) was not rendered or graded this pass; audio web-parity is unproven (the web payload holds no CWS blob at all); and no test in the suite pins any of this yet.

### `art-anim-audio-feel/21-node-rig-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The authored motion itself is held byte-exact: a 21-node skeletal rig where each <n> carries x, y and rotation (or a 2x2 matrix divided by 100 when skewed), applied straight onto MovieClip transforms — 487 authored animations across the 19 web-payload animdata blobs.

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin head (light_stance pose); reference/decompiled/shs3_android/scripts/FrameNodeData.as:27-75; counted 487 <anim> across reference/extracted/bindata/*.bin with root animdata`
- **Quote:** 118_1t4645s0.bin: `<anim i="light_stance" d="1">` / `<f i="0">` / `<n i="19" x="14" y="-67" r="-25"></n>` ...  ·  FrameNodeData.as:60-70 `mc.x = this.x; mc.y = this.y; mc.rotation = this.rotation;` else `m.a = this.matA / 100;`
- **Overturns:** "motion (15fps latch, gaits, slash frames, death), byte-exact palette"
- **Lane impact:** art-anim-audio-feel: the §2 scorecard's 'Rebuild-ready now' entry undersells reality — motion is not 'measured from video', it is the shipped keyframe data. 487 anims measured vs the board's assumed ~150 (Stage-0 S0-4 estimated ~450).

### `art-anim-audio-feel/24fps-keyframe-stream` — PARTIAL [A3] ⚑ OVERTURNS LEDGER

The animation clock is 24 fps with exactly one keyframe per tick — the XML's @d equals the number of <f> children for every animation, so the data holds no hold frames; the 'latch' is injected in code by AnimData's per-animation duration tails, which the frame guard then holds on the final pose.

- **Cite:** `SWF header of reference/preservation/shs3.swf (framerate 24.0); reference/decompiled/shs3_android/scripts/Mobile.as:117; MCSCharacter.as:1309-1338 (updateAnimation/updateFrame); AnimData.as:23-142 (duration tails); measured @d vs len(<f>) across 108_1t4635s0.bin and 118_1t4645s0.bin`
- **Quote:** Mobile.as:117 `GameEngine.getStageMC().frameRate = 24;`  ·  MCSCharacter.as:1315 `++this.frameCounter;` and :1334 `if(this.frameCounter < this.currentAnimation.frameList.length)`  ·  AnimData.as:41 `this.duration += 10;` (every stance's slash pose)  ·  measured: light_stance d=1/1f, light_run d=9/9f, walk d=20/20f, death d=38/38f — hold=0 everywhere  ·  WhiteOutFX.as:22 `ttlMax = 24 * 3;` (durations written as 24 x seconds)
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel: the headline Ready bullet's model is wrong — motion is a 24 Hz keyframe stream with per-animation code-added hold tails, not a 15 Hz latch. Graded PARTIAL and not HELD because the payload settles the clock but no frame can arbitrate the visible cadence: the dense stills sample at 0.1 s (10 Hz) and cannot resolve 24 vs 15, so this is a doc-vs-payload correction, not a frame-vs-doc one.

### `art-anim-audio-feel/adaptive-music-engine` — HELD [A2] ⚑ OVERTURNS LEDGER

The adaptive-music engine is fully specified: 17 presets are boolean masks over the 13 stems, crossfades move volume by exactly ±0.05 per tick (~0.83 s at 24 fps), and a newly-enabled stem starts at the playhead of the currently-playing anchor stem so layers enter phase-locked.

- **Cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:115-190 (stem table + presets), :206 (phase lock), :301 and :329 (fade rate), :279 (loop on SOUND_COMPLETE); SoundManager.as:114-173 (pickMusic BG switch)`
- **Quote:** MusicManager.as:301  `sndTransform.volume -= 0.05;`  ·  :329  `sndTransform.volume += 0.05;`  ·  :206  `playPosition = int(this.scArray[this.TRACK_FLUTES].position);`  ·  :140  `this.presetsArray[MUSIC_TOUGHBATTLE][this.TRACK_BATTLECHANTS] = true;`
- **Overturns:** "**all audio** (SFX + music params)"
- **Lane impact:** art-anim-audio-feel: the §2 scorecard's blocking phrase 'music params' is void — the params are literal constants in the shipped client, including the per-background preset routing table.

### `art-anim-audio-feel/aspect-ratio-frame-wins` — HELD [A1] ⚑ OVERTURNS LEDGER

Aspect-ratio truth is closed and the frame arbitrates it: the design canvas is literally 800x480 with letterbox scale/offset math in code, and although the real client SWF's document rect decodes to 800x690, the measured visible game surface in a 1080p frame is 1816x1080 (aspect 1.6815 = 800x480), so the 690-tall rect is container chrome, not play area.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png non-black content box measured at thresholds 5/12/25/40/60 (cols 52..1867, all 1080 rows); cross-checked against reference/preservation/shs3.swf header rect (16000x13800 twips = 800x690) and reference/decompiled/shs3_android/scripts/GameEngine.as resizeHandler`
- **Quote:** GameEngine.as: `var originalWidth:int = 800;` / `var originalHeight:int = 480;` / `newScale = stageMC.stageHeight / originalHeight; offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2;` and :190 `stageMC.fullScreenSourceRect = new Rectangle(0,0,800 * newScale,480 * newScale);`  ·  measured frame: 'thr 12 cols 52 1867 w 1816 aspect 1.6814814814814816' (800x480 = 1.6667, 800x690 = 1.1594)
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** art-anim-audio-feel and ui-hud: promoted out of §1's UNKNOWN-UNKNOWNS into a payload CONTRACT, including the exact letterbox formula. THE FRAME WINS over the SWF document rect — I say so explicitly: the byte-check says the document is 800x690, the frame says the visible surface is 800x480, and the frame decides what the player saw. Every HUD fraction and feel measurement taken off 16:9 video must be re-based on 800x480.

### `art-anim-audio-feel/audio-recovered-not-encrypted` — HELD [A3] ⚑ OVERTURNS LEDGER

The audio is RECOVERED, not encrypted: 122_Mobile_SoundResource.bin decodes with the known payload transform at XOR key 111 into a valid CWS v17 SWF holding 13 DefineSound tags plus a SymbolClass table naming every SFX, all extracted to playable MP3 and verified with an independent decoder.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin decoded with reference/tools/payload_decode.py transform at key=111 -> CWS v17, declared len 29,631, zlib body inflates to 29,623 B; macOS afinfo on the extracted slash1.mp3`
- **Quote:** SymbolClass: [(13,'punch'),(12,'fart'),(11,'hitmetal'),(10,'goodkoto'),(9,'slash1'),(8,'slash2'),(7,'die1'),(6,'refund'),(5,'die3'),(4,'slash3'),(3,'sumo'),(2,'die2'),(1,'deflect')]  //  afinfo: 'Data format: 1 ch, 11025 Hz, .mp3 ... 576 frames/packet' / 'estimated duration: 0.572000 sec'
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel (this unit): blocker ① deleted; the SFX lane flips from 'invent a WebAudio synth' to 'match a reference file'. Also overturns Stage-0 finding S0-5 ('You may NOT claim audio is recovered') for all five CWS blobs, which unblocks ui-hud (ImageResource portraits), world-exploration (BGResource, 49 named backgrounds) and items-equipment (SHS3Resource, 1,949 part sprites).

### `art-anim-audio-feel/blood-vfx-exact` — HELD [A2] ⚑ OVERTURNS LEDGER

Blood VFX numbers are exact constants, not something to frame-measure: 20 particles, angle variance 10°, velocity 6 ±2, gravity 0.6, time-to-live 24 ticks (~1.0 s at 24 fps), with per-death-variant emitter overrides naming the exact body part and spray angle.

- **Cite:** `reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26; per-death overrides at EnemyGoblin.as:367-432`
- **Quote:** BloodParticleEmitter.as:18-26  `pnumber = 20; px = 0; py = 0; pangle = 0; panglevariance = 10; pvel = 6; pvelvariance = 2; pgravity = 0.6; pttl = 24;`  ·  behead spray: `createEmitter(0,mcs.getPart(MCSCharacter.PART_neck),...,130)` and `...PART_head...,180)` with `setVel(4)` / `setNumber(10)`
- **Overturns:** "**Frame-measure combat numbers from existing footage:** blade-FX reach span per stance; L1 bandit-fight damage popups + HP-bar fractions; blade-trail width/fade; blood droplet count/spread; whether there's screen-shake / hitstop."
- **Lane impact:** art-anim-audio-feel: §5 Tier-1 item 2 loses three of its five sub-tasks (blood droplet count/spread, screen-shake, hitstop) — they are payload constants now, not video measurements.

### `art-anim-audio-feel/font-identified` — HELD [A2] ⚑ OVERTURNS LEDGER

The font blocker is closed with embedded font programs and vendor copyright strings: the display face is Edo SZ (© 2008 Vic Fieger), alongside EPSON Taigyousho B, Adobe Gothic Std B and MS UI Gothic.

- **Cite:** `DefineFontName tags in reference/extracted/android/115_Mobile_SHS3Resource.bin (key=104), font ids 307/12/61/161, and 124_Mobile_ImageResource.bin (key=109), font id 76`
- **Quote:** DefineFontName id=307 name='Edo SZ' copyright='2008 Vic Fieger'  ·  DefineFontName id=12 name='EPSON 太行書体Ｂ' copyright='(C) 2000 SEIKO EPSON CORP. All rights reserved.'  ·  DefineFontName id=61 name='Adobe 고딕 Std B'  ·  DefineFontName id=161 name='MS UI Gothic 標準'
- **Overturns:** "② font (unidentified)."
- **Lane impact:** art-anim-audio-feel blocker ② deleted, and ui-hud gets the text face for every HUD string. Stronger than Stage-0 S0-2 (which had only face="Edo SZ" in ui_strings.txt): we now hold the font programs themselves in two independent containers. LICENCE FLAG: Edo SZ is Vic Fieger's, not Lut's — third-party, outside the owner grant; identify, do not redistribute.

### `art-anim-audio-feel/gore-system-not-one-variant` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'severed-limb death variant' is a whole gore system: eight death animations including deathnohand (25 f), deathnohead (31 f) and deathinhalf (28 f), selected by a behead flag plus a 40/20/20/20 random split, with a 50% corpse-mirror coin flip and a global censored switch that defaults to false.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin (web payload human animdata) for the anim rows; reference/decompiled/shs3_android/scripts/EnemyGoblin.as:352-432 for the selection rule (mirrored in every Enemy* class); StatsManager.as:314 for the censor default`
- **Quote:** EnemyGoblin.as:354-356 `if(Math.random() * 2 < 1) { mcs.scaleX = -mcs.scaleX; }`  ·  :358 `if(!StatsManager.censored && fatal)`  ·  :360-362 `if(behead) { startAnim(ENEMYDEATHNOHEAD); }`  ·  :386-423 `dice = Math.random() * 5;` -> `<=1 GOB_DEATH · ==2 ENEMYDEATH · ==3 ENEMYDEATHNOHAND · ==4 DEATHINHALF`  ·  StatsManager.as:314 `public static var censored:Boolean = false;`
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel blocker ⑤ deleted with its exact probability distribution. Cross-lane: enemies-ai gets the per-enemy death branch, and the censored flag is an options-screen item ui-hud does not have.

### `art-anim-audio-feel/hit-reaction-12-ticks` — HELD [A2] ⚑ OVERTURNS LEDGER

The hit reaction is a single uniform 12-tick window (0.5 s at 24 fps) set identically in every enemy class and in MCSPlayer, and hitting the hat, head or neck part sets the behead flag AND multiplies damage by 1.5.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3687-3719; gotHitCounter = 12 repeated across EnemyClone.as:162/207/227/392/448 and decremented once per tick in every Enemy* update`
- **Quote:** MCSPlayer.as:3689-3692 `case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true;`  ·  :3714-3716 `if(behead) { damage *= 1.5; }`  ·  :3719 `gotHitCounter = 12;`
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: the authored 7/12/16-frame tint ladder is a recreation invention — the original's single number is 12. Cross-lane into combat-core: a body-part headshot multiplier of x1.5 driven by the blade path is a mechanic no ledger holds. CAUTION, un-reconciled: the HUD in Nr4fQstqHDM_432.0.png shows '150% DAMAGE' under 'CANNOT CHANGE STANCE', which reads as the stance modifier — do not conflate the two 1.5s.

### `art-anim-audio-feel/music-13-stems-measured` — HELD [A3] ⚑ OVERTURNS LEDGER

The music is 13 named MP3 stems, all held, and the six overworld stems are exactly 79.872 s while the four dungeon stems are exactly 45.760 s — bit-identical lengths are the mechanism that lets them layer in phase.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin (key=117) -> 13 DefineSound + SymbolClass; durations measured with macOS afinfo on the extracted MP3s`
- **Quote:** battlechants/battledrums/flutes/safeambience/safekoto/safepercussion = 'estimated duration: 79.872000 sec' each; dungeonambience/dungeonflute/dungeonpercussion/dungeonpiano = 45.760000 sec each; bgm_levelup 29.900000; bgm_lose 3.744000; bgm_gangnam 3.848000
- **Overturns:** "**Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** art-anim-audio-feel: §6's 'structurally UNRECOVERABLE' audio bullet falls. Also kills §5 Tier-1 item 3 ('Listen-pass on existing audio ... the deepest gap') — never listen-pass a YouTube rip when the master stem is on disk.

### `art-anim-audio-feel/no-blend-modes` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'FX blend modes' blocker is answered in the negative: no game class ever sets a blendMode — the only hit across all 559 client classes is an mx framework interface the game never implements — and the entire compositing vocabulary is one class using ColorTransform, BlurFilter and a luma ColorMatrixFilter.

- **Cite:** `exhaustive grep for blendMode over reference/decompiled/shs3_android/scripts/ and reference/decompiled/shs3_payload/ (only hit: mx/core/IFlexDisplayObject.as:87-89); reference/decompiled/shs3_android/scripts/ColorCode.as:12-120`
- **Quote:** ColorCode.as:110-119 `setMCTint(mc,mul,col)`: `var ctMul:Number = 1 - mul; ... var ct:* = new ColorTransform(ctMul,ctMul,ctMul,1,ctRedOff,ctGreenOff,ctBlueOff,0);`  ·  :47 `var myElements_array:Array = [0.3,0.59,0.11,0,0, ...];`  ·  :12 `new ColorTransform(0,0,0,1,0,0,0,0)`
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** art-anim-audio-feel blocker ③ deleted: the answer is 'none — normal alpha only'. A recreation reaching for additive/screen blending on trails, tints or vignettes is diverging from the original. Corroborated visually by the A1 blade-trail crop (opaque, outlined, occluding).

### `art-anim-audio-feel/no-hitstop` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

There is no hitstop on a landed hit anywhere in the client: the only time-freeze is STATE_FROZEN, set at exactly two sites (both the battle-intro bar), plus the end-of-battle redFreeze; gotHit sets a 12-tick reaction counter and no global freeze.

- **Cite:** `grep for hitstop|hitpause|freezeframe|slowmo|timeScale|hitFreeze over reference/decompiled/shs3_android/scripts/*.as returns zero hits; STATE_FROZEN set only at StageManager.as:162 and :212; MCSPlayer.as:3719`
- **Quote:** StageManager.as:161-162 `battleIntroBar.init(action);` / `actionState = STATE_FROZEN;`  ·  MCSPlayer.as:3719 `gotHitCounter = 12;` (no freeze call)
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued);"
- **Lane impact:** art-anim-audio-feel: the honest answer is 'the mechanism does not exist', so any hitstop in the recreation is an authored deviation and must be labelled. Graded PARTIAL, not HELD, because this is a negative from an exhaustive grep of one build rather than a positive artifact.

### `art-anim-audio-feel/screen-shake-catalogued` — HELD [A2] ⚑ OVERTURNS LEDGER

Screen-shake is fully catalogued: a uniform random offset within ±amt/2 on both axes every tick, default amplitude 30 px, auto-tapering over the final amt ticks via min(amt,counter), snapping back to the exact start position — and it keeps running while the action is frozen.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227 (startShake/doShake), :826-830 (stepped outside the STATE_FROZEN gate); triggers at MCSPlayer.as:911 (Cleave, 12), :946 (Earthquake jutsu, 24), :4180 (player launched, 12), Trap_CrusherColumnAuto.as:90 (6), Marker_RumbleTrigger.as:9-11 (data-driven, defaults 24/30)`
- **Quote:** StageManager.as:1225-1227  `shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);` / `gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);` / `gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);`
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued);"
- **Lane impact:** art-anim-audio-feel blocker ④ half-deleted, and §1's UNKNOWN-UNKNOWNS bullet 'screen-shake and hitstop-on-landed-hit (never catalogued)' plus §5 Tier-1's 'whether there's screen-shake / hitstop' are both closed without any frame-measuring.

### `art-anim-audio-feel/sfx-playback-contract` — HELD [A2] ⚑ OVERTURNS LEDGER

SFX playback params are held too: slash and death each pick 1-of-3 at random, hit and hurt both play the SAME 'punch' asset, and every call is a bare sound.play() — no SoundTransform, so volume 1.0, pan 0, no loop, no offset.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187-219 (playSlash), :221-253 (playDie), :255-279 (playHit/playHurt)`
- **Quote:** SoundManager.as:194 `var dice:int = Math.random() * 3;` ... :197 `sound = ResourceManager.getSound("slash1");` :200 `sound.play();`  ·  :261 and :274 are identical: `var sound:Sound = ResourceManager.getSound("punch");`
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel: 'every SFX param is INFERRED' is false in both halves — the asset and its playback contract are both held. Note the shared punch asset: a recreation with separate hit/hurt sounds is a deviation.

### `art-anim-audio-feel/android-web-byte-identity` — HELD [A3]

The Android-build caveat dissolves for animation: 14 of the 18 MCSCharacter animation blobs are MD5-identical between the Android v0.682 export and the web v0.717 payload, including Human, Human2 and all five stance sets.

- **Cite:** `MD5 over reference/extracted/android/*.bin vs reference/extracted/bindata/*.bin — 21 blobs identical overall`
- **Quote:** MD5 (reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin) = bcfd658e79fafb41f52431afb7d10622 ; MD5 (reference/extracted/bindata/108_1t4635s0.bin) = bcfd658e79fafb41f52431afb7d10622 — differing: Ogre, Skills (51 anims), Guardian, HumanSpear
- **Lane impact:** art-anim-audio-feel and every lane citing the Android build: Stage-0 S0-3's standing caveat ('this is the ANDROID build ... parity is NOT established') is now PROVEN for 14/18 animation sets by hash rather than assumed. Animation claims sourced from shs3_android are web-parity; audio claims are not (see the STILL_UNHELD claim).

### `art-anim-audio-feel/blade-trail-frame` — HELD [A1]

Frame check: the blade trail is a flat opaque vector wedge — mid-blue body over a darker blue lower half, a white double-stripe core, a hard black outline, tapering to a point — and it occludes the grass behind it rather than lightening it, which is what 'no blendMode' looks like on screen.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png (1920x1080), crop (900,600)-(1300,900) upscaled x3 Lanczos`
- **Quote:** Visibly in the crop: a wide hard-edged blue wedge sweeping left from the fighter's hands with a white double stripe running its length and a solid black outline; the fighter in navy haori with red trim, cream obi, white hakama and straw kasa, all bold-outlined flat vector; a felled bare-torso enemy sprawled at his feet with his kasa fallen beside him, with NO blood and NO severed limb at this instant.
- **Lane impact:** art-anim-audio-feel: independently corroborates the no-blend-mode finding from the frame side, and confirms the ledger's 'flat-vector bold-outline style' Ready bullet by eye rather than second-hand. Supporting A2: bladeslashfx.as is a 5-frame clip that removes itself (`addFrameScript(4,this.frame5)`), so the slash FX lives ~0.21 s at 24 fps.

### `art-anim-audio-feel/kill-beat-timings` — HELD [A2]

The kill-beat has exact numbers: on victory the action freezes for 24*6 ticks (6.0 s) with the win card shown 1.0 s in, and the freeze will not end at the 24-tick mark while the player is still playing the blood-flick sheathe animation; on defeat it is 24*3 (3.0 s).

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:898-935 (countdown) and :1095-1101 (setup)`
- **Quote:** StageManager.as:1096 `redFreezeCounter = 24 * 3 + 6;` (harvest) / :1101 `redFreezeCounter = 24 * 6;`  ·  :903 `if(redFreezeCounter == 24 * 5)` -> `battleUI.showWin();`  ·  :916 `else if(redFreezeCounter == 24 && StatsManager.getPlayer().getMCS().getAnim() != MCSActor.SHEATHESWORDCHIBURI || redFreezeCounter == 0)`  ·  :926 `else if(redFreezeCounter == 24 * 3)` -> `battleUI.showLose();`
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: the Ready bullet's 'kill-beat' is now a number set, not a vibe, and it is gated on a named animation (SHEATHESWORDCHIBURI). Note the screen shake is deliberately NOT gated off during the freeze (StageManager.as:826-830).

### `art-anim-audio-feel/web-audio-parity-unheld` — STILL_UNHELD [STILL_UNHELD]

The web build's own audio is STILL_UNHELD: every one of the web payload's 27 bindata blobs was checked and none is a CWS blob, so the web client streamed its sound resources separately and we do not hold them — all audio claims here are Android v0.682 and must be labelled as such.

- **Quote:** Scanned all 27 files in reference/extracted/bindata/ for an FWS/CWS/ZWS signature: zero hits (the 19 animdata, 5 name tables, room-object defs, survivalmodedata and one GIF89a are all that is there). Build id: reference/decompiled/shs3_android/scripts/StatsManager.as:30 clientVersion 0.682 vs the web build's 0.717.
- **Lane impact:** art-anim-audio-feel: bounds the audio win. Web-parity is PROVEN for animation (14/18 blobs hash-identical) and UNPROVEN for audio, so ported SFX/music must carry an 'Android v0.682' label. Two further honest gaps: the newly-opened vector art (1,949 DefineSprite in SHS3Resource, 49 named backgrounds in BGResource) was not rendered or graded this pass, and no test in the suite pins any finding in this survey.

## bindata — re-scored ?

Source sweep, not a system sweep — no re-score submitted. For context on the lanes I touched: the ledger's world-exploration (35), meta-social (31), enemies-ai (34) and items-equipment (42) scores are all floored by blockers this file kills outright (world geography, war board topology, boss telegraph frames, layer-order contract), while art-anim's 56 is scored against video measurement when 487 authored animations sit on disk — but only 4 are ported, so the recoverable/recovered distinction must be preserved rather than collapsed into a higher score.

### `bindata/487-anims-held-4-ported` — HELD [A3] ⚑ OVERTURNS LEDGER

The 19 animdata blobs hold 487 animations / 5,596 keyframes / 81,706 joint transforms verbatim, against which the build ships 6 hand-authored poses and has ported exactly 4 animations — so the art-anim score is measured against video when the authored source is on disk, but the recovery work is 0.8% done.

- **Cite:** `tests/a11AnimData.test.ts (npx vitest run) + src/config/ogAnims.ts:39 + counts over reference/extracted/bindata/1[0-1][0-9]_*.bin`
- **Quote:** Test output: `Test Files  1 passed (1)` / `Tests  12 passed (12)`. src/config/ogAnims.ts:39 `export type OgAnimName = 'walk' | 'balancedhorizontalslash_parta' | 'balancedhorizontalslash_partb' | 'balancedhorizontalslash_partc';`. Measured counts (grep -c '<anim ' / '<f ' / '<n '): TOTAL anims=487 frames=5596 nodes=81706; file 108 alone = 158/1638/24502. src/config/poses.ts exports six poses: IDLE_POSE, SLASH_WINDUP, SLASH_FOLLOW, GUARD_POSE, HIT_RECOIL, DEAD.
- **Overturns:** "| **art-anim-audio-feel** | 56 | motion (15fps latch, gaits, slash frames, death), byte-exact palette | **all audio** (SFX + music params); font; FX blend modes; screen-shake/hitstop |"
- **Lane impact:** L-art-anim-audio-feel: the 56 is scored against video measurement when the authored source exists. HONEST COUNTER-WEIGHT, stated so this is not read as triumphalism: the byte-check gate that exists guards only 4 of 487 animations and only from file 108; a grep across src/, scripts/ and tests/ finds references to exactly one bindata file (108_1t4635s0), so the other 18 blobs are untouched. Data held ≠ data ported.

### `bindata/51-skill-animations` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

bindata/102 is the skills animation set: 51 authored skill animations including shunpo_start/end, focus_start/end, cleave, chicharge, warcry, buffarmor, enchantweapon, fireball and deathtouch — so 'names only' is wrong, though no damage/cost/AoE value lives here.

- **Cite:** `reference/extracted/bindata/102_1t4629s0.bin:938,2038,4242,4328,4351,4521,4840,5978,6148,6333,9204,9556 — Android class name 93_MCSCharacter_SkillsAnimationData.bin`
- **Quote:** 4242:`<anim i="shunpo_start" d="4">` · 4328:`<anim i="shunpo_end" d="1">` · 5978:`<anim i="focus_start" d="8">` · 6148:`<anim i="focus_end" d="13">` · 6333:`<anim i="cleave_start" d="9">` · 9204:`<anim i="chicharge_start" d="14">` · 9556:`<anim i="chicharge_fly" d="5">` · 4351:`<anim i="enchantweapon" d="8">` · 4840:`<anim i="warcry_start" d="4">` · 4521:`<anim i="buffarmor_start" d="8">` · 938:`<anim i="fireball" d="12">` · 2038:`<anim i="deathtouch_partb" d="12">`
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L-skills-meters + L-rebirth-elements: 'names only' is false — the MOTION of 51 skills is held. Shunpo specifically is a 4-tick start plus a single arrival pose with NO travel clip, i.e. the signature of an instantaneous displacement rather than a dash, which bears on skills-meters blocker ② ('Shunpo's real effect'). I explicitly do NOT claim Shunpo's numbers: bindata carries no damage, cost, AoE or status value — those are in skilldata.xml.

### `bindata/boss-telegraph-triads` — HELD [A2] ⚑ OVERTURNS LEDGER

Boss attacks are authored as explicit telegraph / hit / recovery clip triads with exact tick counts, and stagger is an 8-tick flinch clip — the ledger's 'telegraph/active/recovery + stagger frames' blocker.

- **Cite:** `reference/extracted/bindata/100_1t4627s0.bin:901,1223,1325 (ogre); 111_1t4638s0.bin:892,1174,1316 (guardian); 103_1t4630s0.bin:2646,2798 (flinch)`
- **Quote:** 100:901 `<anim i="ogre_swingdown" d="16">` · 100:1223 `<anim i="ogre_swingdownhit" d="5">` · 100:1325 `<anim i="ogre_swingdownend" d="11">` ; 111:892 `<anim i="guardian_swingdown" d="14">` · 111:1174 `<anim i="guardian_swingdownhit" d="7">` · 111:1316 `<anim i="guardian_swingdownend" d="11">` ; 103:2798 `<anim i="flinch" d="8">` · 103:2646 `<anim i="flinch_weapon" d="8">` ; ogre_death d=54, guardian_death d=54.
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L-enemies-ai: blocker ③ is dead for the Ogre and Guardian, and the same triad naming (swingdown/swingdownhit/swingdownend, swingup/…, stomp/stomphit/stompend) is structural across creature sets. At 24Hz the Ogre overhead is 0.67s telegraph / 0.21s active / 0.46s recovery. Note the ledger's separately-measured 'hit-stagger 12f' is not directly comparable — the flinch CLIP is 8 ticks; I am not asserting a contradiction without knowing whether 12f was measured at 60Hz.

### `bindata/engine-ticks-24fps` — HELD [A2] ⚑ OVERTURNS LEDGER

The engine runs an ENTER_FRAME game loop at a declared 24 fps and advances exactly one authored keyframe per tick, so the ledger's '15fps pose latch' is a video-sampling artifact and every bindata d= attribute is in 24ths of a second.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf SWF header (framerate=24.0) + reference/decompiled/shs3_android_payload/scripts/GameEngine.as:442 + MCSCharacter.as updateAnimation()`
- **Quote:** GameEngine.as:442 `stageMC.addEventListener(Event.ENTER_FRAME,gameloop);` ; MCSCharacter.updateAnimation(): `++this.frameCounter; if(this.frameCounter < this.currentAnimationDuration) { this.updateFrame(); }`. Corroborated inside bindata: every trap duty cycle in 93_1t4647s0.bin is a multiple of 24 — line 36 `<property>0,24,24,0,1</property>`, line 451 `<property>0,24,36,0,1,1,1</property>`.
- **Overturns:** "**Motion & palette (best-evidenced slice):** 15fps pose latch, two gaits, per-stance slash frames, hit-stagger 12f, death collapse 333ms, fighter proportions, byte-exact HUD/result-card hex."
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: the pose-latch MECHANISM is real but the RATE is 24, not 15. Every d= in all 19 animdata blobs converts to seconds at 1/24, which re-bases all animation timing in the build (file 108 alone = 1638 keyframes = 68.25s of authored human motion).

### `bindata/five-stances-not-three` — HELD [A2] ⚑ OVERTURNS LEDGER

The game ships FIVE complete stance movesets — light, balanced, heavy, dual and reversed — each with the same 21-animation kit; the ledger and src/config/stances.ts model only three.

- **Cite:** `reference/extracted/bindata/110_1t4637s0.bin:3 and 104_1t4631s0.bin:3 + reference/decompiled/shs3_android_payload/scripts/AnimData.as:38-41`
- **Quote:** 110_1t4637s0.bin:3 `<anim i="dual_stance" d="1">` ; 104_1t4631s0.bin:3 `<anim i="reversed_stance" d="1">` ; AnimData.as:38-41 `case MCSActor.DUALSLASH_POSE:` / `case MCSActor.DUALSLASHDOWN_POSE:` / `case MCSActor.DUALSLASHUP_POSE:` / `case MCSActor.REVERSEDSLASH_POSE:`. Android class names: 101_MCSCharacter_DualStanceAnimationData.bin, 95_MCSCharacter_ReversedStanceAnimationData.bin.
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L-combat-core + L-skills-meters: the entire three-stance model (§1, §2, §3.3, §3.4, §4) is missing two full movesets. STANCE_TABLE in src/config/stances.ts is Record<StanceId,…> with three keys; the OG has dual-wield and reverse-grip stance kits of equal size (21 anims each).

### `bindata/paired-grab-throw-victim-anims` — HELD [A2] ⚑ OVERTURNS LEDGER

The skills animation set contains paired attacker/victim animations (kneegroin + kneegroin_victim, backthrow + backthrow_victim) — a grab-and-throw combat category that appears in none of the 12 ledger systems.

- **Cite:** `reference/extracted/bindata/102_1t4629s0.bin:3143, 3577, 7570, 8319 + AnimData.as case MCSActor.KNEEGROIN_VICTIM`
- **Quote:** 3143:`<anim i="kneegroin" d="30">` · 3577:`<anim i="kneegroin_victim" d="41">` · 7570:`<anim i="backthrow" d="39">` · 8319:`<anim i="backthrow_victim" d="36">` ; AnimData.as special-cases `case MCSActor.KNEEGROIN_VICTIM: this.duration += 6;` so the victim track is engine-known, not leftover art.
- **Overturns:** "- **Core loop & controls:** draw-a-line-to-slash; line SHAPE picks the attack (horizontal=slash, up=jump, up-vertical=launch, down=stab); **the line is a BLADE PATH with finite reach** that cuts everything along it (own-eyes verified, §3); **movement = hold mouse to run toward cursor**."
- **Lane impact:** L-combat-core: overturn by OMISSION. The ledger's combat model is entirely 'draw a line, the blade path cuts'. Nothing anywhere describes a grab, a throw, or a second actor whose animation is driven in lockstep by the attacker's — yet the engine ships four such clips and special-cases the victim track.

### `bindata/procedural-name-generator` — HELD [A2] ⚑ OVERTURNS LEDGER

NPC and place names are procedurally generated from five payload tables (398 male, 291 female, 33 noble, 36 samurai family, 677 place), and the ledger's two 'omitted bosses' Hachisuka Kano and Honda Shizuka decompose exactly into samurai-surname + given-name from those pools.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin:7 and :11; 94_1t4651s0.bin:80; 97_1t4650s0.bin:226 — Android class names 85_NameGenerator_MaleNames, 86_NameGenerator_NobleFamilyNames, 87_NameGenerator_SamuraiFamilyNames, 88_NameGenerator_FemaleNames, 89_NameGenerator_PlaceNames`
- **Quote:** 96_1t4652s0.bin:7 `Hachisuka` · 96_1t4652s0.bin:11 `Honda` · 94_1t4651s0.bin:80 `Kano` · 97_1t4650s0.bin:226 `Shizuka`. Table sizes: 94=398 lines, 95=33, 96=36, 97=291, 98=677.
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L-enemies-ai (stop chasing two generated names as authored bosses — Zabuza and Tengu Hotaru are NOT in these pools and remain open) + L-world-exploration (677 verbatim place names answer territory naming for free) + L-quests-story (character rosters may contain generated, not authored, names).

### `bindata/severed-limb-deaths` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'severed-limb death variant' the ledger lists as an art blocker is four separate authored animations plus a nine-clip death family and five static corpse poses.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin:11953,12402,18132 and 103_1t4630s0.bin:2950, 979-1067`
- **Quote:** 108:11953 `<anim i="deathnohand" d="25">` · 108:12402 `<anim i="deathnohead" d="31">` · 108:18132 `<anim i="deathinhalf" d="28">` · 103:2950 `<anim i="seppuku_nohead" d="26">` ; rest of the family in 108: death d=38, defeatedanimationv1 d=34, defeatedanimationv2 d=35, deathenemy d=23, deathwitharrow d=23, deathbyarrow d=21, deathdowned d=7 ; 103:979-1067 corpse1..corpse5 (d=1 each).
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** L-art-anim-audio-feel: blocker ⑤ is dead. Nine death clips + four dismemberment variants + five corpse poses, all with exact tick counts at 24Hz.

### `bindata/slash-is-four-part-looping-hold` — HELD [A2] ⚑ OVERTURNS LEDGER

Every stance slash is a four-part clip whose MIDDLE part loops (l="1") — the hold-while-drawing state — and the per-part frame counts invert the config's ordering: Light has the LONGEST windup (13) and Heavy the shortest (5).

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin:217,492,683,811 (light); 106_1t4633s0.bin:217 (balanced); 116_1t4643s0.bin:217 (heavy) vs src/config/timing.ts SLASH_FRAMES`
- **Quote:** 118:217 `<anim i="light_horslash_parta" d="13">` · 118:492 `<anim i="light_horslash_partb" d="9" l="1">` · 118:683 `<anim i="light_horslash_partc" d="6">` · 118:811 `<anim i="light_horslash_partd" d="1">` ; 106:217 `<anim i="balanced_horslash_parta" d="12">` ; 116:217 `<anim i="heavy_horslash_parta" d="5">`. Config says light{4,4,4} balanced{4,4,8} heavy{4,4,12}, labelled MEASURED.
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors; kill-beat."
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: 'per-stance slash frames' is not ready. The shipped SLASH_FRAMES is wrong in SHAPE (constant 4f windup, monotone recovery) not just magnitude — the payload windup varies 5..13 and is inverted vs stance weight, recovery is non-monotone (6/4/7). The looping partb is also the missing data model for the draw-the-line hold and for AUTO SLASH cadence.

### `bindata/spawn-geometry` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Wave spawn geometry is literal in the data: enemies enter 50px off-screen from both sides of a ~1600px arena, at x=-50 and x=1650.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:7 and :12`
- **Quote:** `<x>-50</x>` (49 occurrences) and `<x>1650</x>` (37 occurrences); one `<x>-1650</x>` at the 6th <wave> (line ~77) is evidently an authoring typo for the right-side spawn.
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: the spawn-geometry third of blocker ④ is held for war/survival battles, with an implied ~1600px arena width (consistent with traproomdata room widths 800-1400). Aggro radius and leash distance are NOT in bindata — those stay open from this source.

### `bindata/sprite-compositing-contract` — HELD [A2] ⚑ OVERTURNS LEDGER

The full sprite-compositing contract — 27-slot part map, transform semantics, z-order rule and per-frame visibility — is specified exactly, decoding every <n i="…"> in all 19 animdata blobs.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as:10-62 + FrameData.as (reorderLayers, setVisible) + FrameNodeData.as (setPosition)`
- **Quote:** MCSCharacter.as:10-62 `PART_l_hand=0 · l_uparm=1 · l_lowarm=2 · weapon=3 · prop=4 · l_foot=5 · l_thigh=6 · l_calf=7 · crotch=8 · r_foot=9 · r_thigh=10 · r_calf=11 · neck=12 · stomach=13 · pelvic=14 · torso=15 · head=16 · hat=17 · r_hand=18 · r_uparm=19 · r_lowarm=20 · prop2=21 · prop3=22 · l_shoulder=23 · r_shoulder=24 · l_knee=25 · r_knee=26`. FrameNodeData.setPosition: `mc.x = this.x; mc.y = this.y; mc.rotation = this.rotation;` else `m.a = this.matA / 100; ...` — x/y plain pixels, r degrees, a/b/c/d fixed-point x100. FrameData.reorderLayers runs ONLY on frames carrying r="1" (89 such frames
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L-items-equipment: the layer-order half of blocker ⑤ is dead. Corroborated by the web payload's own art symbol classes in reference/decompiled/shs3_payload/scripts/ — torso4000.as, uparm4000.as, lowarm4000.as, hand5000.as, hair6000.as, hat7000.as, head8000.as, mask9000.as, neck10000.as, thigh11000.as, calf11000.as, crotch11000.as, foot12000.as, weapon13000.as, prop13000.as. The icon manifest half I did not open.

### `bindata/survival-is-warroom-content` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

bindata/119 is not a standalone survival mode: WarHexUI.createWarRoomWaveList loads it as the CLAN WAR battle content and re-bases every enemy id per clan side (id%100 + 200/300/400/500/600), which is why npcdata carries five parallel Soldier rosters.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin (39 <wave>, 87 <enemy>) + reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1719-1752 — Android class name 109_WarHexUI_SurvivalModeData.bin`
- **Quote:** WarHexUI.as:1719 `var xml:XML = XML(new SurvivalModeData());` ; :1733-1752 `if(tempid >= 200 && tempid < 600) { remainder = tempid % 100; if(targetside == 1) { strArray[k] = remainder + 200; } else if(targetside == 2) { strArray[k] = remainder + 400; } else if(targetside == 3) { strArray[k] = remainder + 300; } else if(targetside == 4) { strArray[k] = remainder + 500; } else if(targetside == 0 || targetside == 5 || StatsManager.isCustomClan(targetside)) { strArray[k] = remainder + 600; } }` ; 119:4-8 `<enemy><id>400|401|402|403|404</id><qty>4</qty><x>-50</x></enemy>`
- **Overturns:** "① **server-authoritative simulation** (24h tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled)."
- **Lane impact:** L-meta-social + L-enemies-ai: the live population and 24h tick remain genuinely unrecoverable — not disputed. But the clan war's BATTLE CONTENT (39 waves, 87 enemy groups, the per-clan id remap, the Soldier/Elite/Heavy/Castle Guard tiering resolved via docs/gauntlet/L0/index/resolved_names.json) is held verbatim and is currently filed under 'unrecoverable'. Waves also use ids 453=Santa and 455=Nian Monster, i.e. seasonal live-ops content no ledger mentions.

### `bindata/trap-dungeon-system` — HELD [A2] ⚑ OVERTURNS LEDGER

bindata/93 is <traproomdata>: a 70-room, 4-difficulty-tier hazard-dungeon system with 14 fully-schema'd trap and interactive-object types, owned by the quest engine and absent from all 12 ledger systems.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:6-18 (schema), :21 (root), :32/:126/:309/:446 (tiers), :34-37 (a room) — Android class name 84_QuestEngine_TrapRoomData.bin`
- **Quote:** :21 `<traproomdata>` ; tiers `<easy>`:32 `<medium>`:126 `<hard>`:309 `<veryhard>`:446 ; 70 `<room>` blocks, widths 800/1000/1100/1150/1400 ; :36 `<obj><id>43</id><name>Trap_SawBladesAuto</name><x>400</x><property>0,24,24,0,1</property></obj>` ; schema header :8 `<obj><id>32</id><name>Trap_Kunai</name><x>200</x><y>300</y><property>angle, speed, kunaicount, spread, bigdamage</property></obj>` ; :9 `Trap_KunaiAuto ... angle, speed, kunaicount, spread, onDuration, offDuration, startInterval, active, bigDamage`. 14 object types: Trap_Kunai, Trap_KunaiAuto, Trap_SawBladesAuto, Trap_CrushingBlockAuto
- **Overturns:** "- **Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder."
- **Lane impact:** L-world-exploration + L-quests-story: overturn by OMISSION. A 12-system ledger claiming to cover the game never mentions traps, levers, floor switches or hazard rooms. Every property is named in the file's own commented schema, and Trap_ElementAuto carries an elementType parameter that also touches L-rebirth-elements.

### `bindata/warhex-board-6x6` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room board is a 6x6 hex grid at 55px pitch with seven enumerated hex states — the topology the ledger lists as a blocker.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:175-176, 253, 266-322`
- **Quote:** `this.ht = 6;` `this.wt = 6;` (:175-176) ; `hex.x = 90 + xpos * 55;` (:253) ; hex states HEX_POTENTIALSPAWNPOINT, HEX_UPCOMINGSPAWNPOINT, HEX_SPAWNPOINT, HEX_DISABLEDSPAWNPOINT, HEX_DEMOLISHEDSPAWNPOINT, HEX_CONTROLPOINT, HEX_VILLAGE; adjacency via `this.getExitOwner(xpos,ypos)`
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** L-meta-social: blocker ② is dead. 6x6 board, 55px hex pitch, 7 hex types, adjacency resolved through getExitOwner. This was reached only because the survivalmodedata blob forced me to open its consumer — a system-siloed reader auditing meta-social would not have opened bindata/119.

### `bindata/world-map-bitmap` — HELD [A2] ⚑ OVERTURNS LEDGER

reference/extracted/bindata/92_1t4648s0.bin is a 63x72 GIF89a whose 735 white cells are a boolean land mask of Japan — the world grid the ledger calls unrecoverable geography.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin (md5 13068dfa1a5cc5628720a25782f93fed, byte-identical to reference/extracted/android/110_Mobile_MapBitmapData.bin)`
- **Quote:** file -> 'GIF image data, version 89a, 63 x 72'; LZW-decoded: palette [(0,0,0),(255,255,255),(102,102,102),(153,153,153)], only 2 indices used, 735 non-background cells of 4536; row 51 = '.............###########################.##....................'; the ledger's own documented start coord (21,51) decodes to index 1 = LAND
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L-world-exploration: blocker ① is dead. World grid is exactly 63x72 with 735 traversable cells, held as a 272-byte payload asset. No wiki mining or map tracing needed. src/config/ has no world module at all today, so this is a straight import.

### `bindata/anim-duration-holds` — PARTIAL [A2]

The engine adds fixed post-clip freeze durations on top of the authored keyframes (afterslash pose +10, jumpslash land +15, sheathe +24, deaths +6, deathtouch +50, guardian stompfreeze +24), giving exact feel-timing the ledger lists as never catalogued.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/AnimData.as:24-141`
- **Quote:** `case "light_afterslashpose": this.duration += 10;` · `case MCSActor.LIGHTJUMPSLASH_LAND: ... this.duration += 15;` · `case "sheathesword": case "sheathesword3": this.duration += 24;` · `case "death": ... this.duration += 6;` · `case MCSActor.DEATHTOUCH_PARTA: this.duration += 50;` · `case MCSActor.GUARDIAN_STOMPFREEZE: this.duration += 24;` · `case "ogre_nap1_mid": this.duration += 48;`
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued); ⑤ severed-limb death variant."
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: these are authored animation HOLDS, explicitly not hitstop and not screen-shake — I do not claim those. But they are the same class of feel-timing the ledger calls absent, and they are exact: duration (not frameList.length) is what updateAnimation compares against, so the extra ticks freeze the last pose.

### `bindata/aspect-frame-beats-swf-header` — HELD [A1]

The live canvas in the longplay measures 1816x1080 (aspect 1.6815 ≈ 5:3) with 52px pillars each side, confirming §3.12's 800x480 read and quantifying the pillarbox — even though the web payload's own SWF header declares an 800x690 stage rect. THE FRAME WINS and I say so.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — full-frame 1920x1080 per-column scan, column counted as letterbox when every 7th-row pixel has R+G+B <= 18; frame also viewed at full size to confirm the bands are pillars, not scene content`
- **Quote:** content x range 52..1867 (1816 px), y range 0..1079 (1080 px), aspect 1.6815 — vs 800x480=1.6667, vs 800x690=1.1594, vs 16:9=1.7778. Contradicting binary: reference/decrypted/shs3_payload_decoded.swf header CWS framerate=24.0 stage twips [0,16000,0,13800] = 800x690; android payload [0,16000,0,9600] = 800x480.
- **Overturns:** "**Native resolution is 800×480 (5:3)**, not 16:9 — HUD x-fractions measured off 1920×1080 video may be pillarbox-compressed. Verify before trusting horizontal coords."
- **Lane impact:** L-ui-hud: blocker ① 'aspect-ratio truth' is CLOSED with a number. Every HUD x-fraction taken off the full 1920 width is wrong by 5.42%; correct conversion is frac = (x_px - 52) / 1816. Also flags that '800x480' is literally only the ANDROID binary's rect — the web SWF rect is 800x690 and the frame overrules it.

### `bindata/missing-boss-npcs-700-710` — STILL_UNHELD [STILL_UNHELD]

The war/survival wave data references eleven boss NPC ids (700-710) that exist in neither the web nor the Android npcdata — a real, newly-located hole in no ledger.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:18 (and ids 701-710, one wave slot each); checked against reference/extracted/npcdata.xml and reference/extracted/android/125_Mobile_NpcData.bin`
- **Quote:** 119_1t4646s0.bin:18 `<id>700</id>`. npcdata.xml: 495 <npc> blocks, ids 0-819, NONE in 700-710. Android 125_Mobile_NpcData.bin: 1,273 <id> entries, max 20028, ALSO none in 700-710. WarHexUI's clan remap only rewrites ids in [200,600), so 700-710 are used literally and cannot be aliases.
- **Lane impact:** L-enemies-ai: eleven survival/war boss definitions are referenced by shipped content data and absent from both builds we hold. This is not in any ledger because no ledger opened this file. It is a genuine gap, not a recoverable one from the sources currently in reference/ — reporting it as STILL_UNHELD rather than guessing which bosses they were.

### `bindata/per-stance-idle-poses` — HELD [A2]

The payload holds three distinct per-stance idle poses (19 nodes each) differing by up to 33px of head height and carrying the weapon at three different angles; src/config/poses.ts ships a single IDLE_POSE for all stances.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin:8002, 8025, 8048 vs src/config/poses.ts IDLE_POSE`
- **Quote:** 108:8002 `<anim i="lightstanceidle" d="1" l="1">` head slot16 `x="29" y="-59" r="12"`, weapon slot3 `x="24" y="-44" r="177"` ; 108:8025 `<anim i="balancedstanceidle" d="1" l="1">` head `x="-7" y="-92" r="9"`, weapon `x="14" y="-46" r="44"` ; 108:8048 `<anim i="heavystanceidle" d="1" l="1">` head `x="3" y="-78" r="9"`, weapon `x="14" y="-100" r="-170"`. Per FrameNodeData.setPosition these are plain pixels and degrees.
- **Overturns:** "MEASURED — semi-crouch combat idle (Session 8B, 2026-07-17; coil deepened Session 9) ... interior knee bend now ~155° vs the measured ~157°"
- **Lane impact:** L-art-anim-audio-feel + L-combat-core: stance idle is PER-STANCE in the original and single in the build, so the video-derived IDLE_POSE cannot be right for all three. I deliberately do NOT convert these to interior joint angles — part art carries its own baked rest orientation and I have not established it, so any 'knee = N°' claim from this data would be unfounded. The x/y joint positions are the safe exact quantity; the ~155° figure stays a video measurement neither confirmed nor refuted here.

## combat-core — re-scored 78

All five §4 combat-core blockers (reach cap, crit read, early TTK, multi-target rule, crit gating) are closed at literal decompiled source, plus three §1 UNKNOWN-UNKNOWNS (multi-target damage rule, reach-cap↔dash relationship, hit-registration window) and half of a fourth (i-frames). Held off the 90s by four things: (a) every source cite is the ANDROID v0.682 client and parity with the web v0.717 is unproven — and already broken once, measured on frames (claim crit-meter-fill-rate); (b) duel AI/telegraphs live in EnemyPlayer.as/Enemy*.as, surveyed by L4 not here; (c) screen-shake, hitstop-beyond-i-frames and blend modes still uncatalogued; (d) three live constants in src/config/reach.ts and one in src/config/stances.ts are WRONG against the source and must be fixed before any of it is wired in.

### `combat-core/crit-gating` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ is dead: crit is a deterministic full-meter gate on a 'reload' resource (maxreload = 5×24, +1 per frame, zeroed on crit, charged slashUsage per slash scaled Light÷2 / Balanced×1 / Heavy×1.5), not a chance proc — and stance switching is blocked below 1/6 meter and costs meter.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:239-240, :1158-1168, :2975-2978, :3098-3108, :3240-3262; refill rate StatsManager.as:1839`
- **Quote:** public function deductReloadBar() : * { if(this.reload == this.maxreload) { this.reload = 0; } switch(this.stance) { case LIGHT_STANCE: this.reload -= this.slashUsage / 2; break; case BALANCED_STANCE: case REVERSED_STANCE: this.reload -= this.slashUsage; break; case HEAVY_STANCE: case DUAL_STANCE: this.reload -= this.slashUsage * 1.5; }
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L2 — an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax) that no ledger system records.

### `combat-core/crit-meter-exists-in-web-build` — HELD [A1] ⚑ OVERTURNS LEDGER

A web-build frame shows the third HUD bar reaching 100% with the label CRITICAL HIT printed across it — proving the crit meter exists in the shipped game and correcting the project's own SESSION-11 note that 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — 1800×780 two-panel still, viewed at 50%; lower panel, HUD bar row. Corroborated by BattleUI.as:259-262 + :102 and strings.json 175`
- **Quote:** Visible in the crop: upper panel = third bar filled ~97%, unlabelled; lower panel = same bar at 100% with 'CRITICAL HIT' printed on it, HP 11/20 and Chi 47/47 unchanged between panels. Code: this.crittext.visible = percentage >= 1 && this.reloadbar.visible; / this.crittext.text = LangManager.getString(175); / string 175 = 'Critical Hit'.
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — the combat HUD is three bars, not two; the third is the crit/reload meter and it carries a 'CRITICAL HIT' overlay at full. Consumption is also visible: session11/gap-focus-trigger/t1003.933.png empty right after a slash, t1004.000.png a fresh sliver.

### `combat-core/crit-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② is dead and BOTH candidates were wrong: crit is ×1.5 in Light and ×1.2 in every other stance, plus a flat additive STAT_CRITICALDMG gear term — never 1.3 and never 3.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3213-3223`
- **Quote:** if(this.reload == this.maxreload) { if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; } return maxDamage * 1.5 + this.STAT_CRITICALDMG; } return maxDamage;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — src/config/combat.ts's '1.3 × our STANCE_TABLE dmgMults (1.17/1.56/1.82)' is wrong. Carry the internal contradiction: InventoryUI.as:1946/:1955/:1964 uses the OPPOSITE mapping (light 1.2, balanced/heavy 1.5) for its tooltip preview — an original-game display bug; MCSPlayer.getDamage is authoritative.

### `combat-core/damage-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's Ready formula '(ATK+Wpn)×stance' is wrong in two ways: damage is a RANDOM roll over the weapon's min..max range, and the stance term is a mastery curve (light 0.5+0.005m, balanced 1+0.005m, heavy/dual/reversed flat 1.5) that is the exact permutation of the reach curves.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3197-3212; inputs StatsManager.as:1860-1900`
- **Quote:** var baseDamage:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case LIGHT_STANCE: maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01); break; case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01); break; case HEAVY_STANCE: case DUAL_STANCE: case REVERSED_STANCE: maxDamage = baseDamage * 1.5; }
- **Overturns:** "**Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** L5 — Sim needs an RNG draw per slash (mulberry32, injected) that the current model has no place for; minDamage = ATK + itemBonus + weapon.mindamage, damageRange = weapon.maxdamage - mindamage, and BOTH collapse when the weapon is broken (range 0, +1 flat).

### `combat-core/early-ttk` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is dead: the L1 character has ATK 1 / DEF 1 / SPD 1 / HP 10, the starter weapon fallback is item 13002 'Branch' at 1-2 damage, and every sampled lvl≤2 mob has 1-5 HP — so early mobs die in ONE hit, confirming the SESSION-11 frame measurement from source.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:693-708 and :1830-1832; reference/extracted/itemdata.xml:7906-7915; reference/extracted/npcdata.xml:146-152 and :2474-2480; names via docs/gauntlet/L0/index/strings.json`
- **Quote:** if(equipment[EQ_WEAPON].itemID == 0) { equipItem(EQ_WEAPON,new Item(13002,1)); }   ///   itemdata.xml:7907 <id>13002</id> <name>4041</name> <baseprice>0</baseprice> <mindamage>1</mindamage> <maxdamage>2</maxdamage>   [4041 = 'Branch']   ///   npcdata.xml:146 <id>6</id><name>5010</name><lvl>2</lvl><hp>1</hp><ai>1</ai><attack>5</attack><defense>3</defense>   [5010 = 'Thug']   ///   npcdata.xml:2474 <id>101</id><name>5052</name><lvl>1</lvl><hp>2</hp><attack>1</attack><defense>0</defense>   [5052 = 'Duelist']
- **Overturns:** "③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.*"
- **Lane impact:** L5 + L4 — full derivation: minDamage 1+1 = 2, range 1, balanced roll 2, vs Thug DEF 3 → floored at 1+pierce → 1 damage vs 1 HP = one-hit kill. Conversely Thug attack 5 vs player maxhp 10 means the player dies in 2-3 hits at L1.

### `combat-core/hit-registration-instant-at-endslash` — HELD [A2] ⚑ OVERTURNS LEDGER

The hit-registration window is answered: there is no active sweep and no per-frame hitbox — the entire polyline resolves in one instant inside endSlash(), against wherever enemies stand at that moment.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2766-2814 (the only call sites of NPCManager.checkHit / checkPlayerHit)`
- **Quote:** var damage:Damage = new Damage(this.slashDamage,level,launchType,this.stance); damage.setPiercingDamage(this.STAT_PIERCINGDMG); ... if(this.controlledBy == 0 || this.controlledBy == 3) { NPCManager.checkHit(this.slashArray,offset,damage); }
- **Overturns:** "**Hit-registration window** (instant at release vs an active sweep an enemy can dodge into/out of)."
- **Lane impact:** L5 — an enemy cannot dodge into or out of a stroke mid-sweep; deductReloadBar() is charged in the same call, so the meter cost lands at resolution, not at input.

### `combat-core/mitigation-and-part-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

Part-based weak points are UNIVERSAL, not per-enemy: hat/head/neck on any character is a behead at ×1.5, and a hit landing on the weapon part deals zero and does not even register — mitigation itself is flat defence subtraction floored by a four-band attacker-level table.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:386-462 (part search order at :301-320); floor table Damage.as:150-172`
- **Quote:** case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true; gotHitFlag = true; break; case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;  ...  damage -= this.defense; if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); } if(behead) { damage *= 1.5; }  ...  this.gotHitCounter = 12;
- **Overturns:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** L5 + L4 + L8 — blade-on-blade parry emerges from the paperdoll, not from AI; parts test top-most-first; gotHitCounter = 12 is a 12-frame (0.5 s @24fps) i-frame window, half of §1's uncatalogued 'hitstop-on-landed-hit'; the ledger's items-equipment 'defense min-floor (EnemyLevel/4)' is only the last of four bands (≤10 → 1+pierce, ≤20 → lvl/8, ≤30 → lvl/6, else lvl/4); damage popups spawn at (mcs.x, mcs.y-100) in 0x990000, closing ui-hud blocker ③.

### `combat-core/multi-target-full-damage` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is dead: one slash tests the whole enemyList and neutralList, each enemy can be hit at most once, and every victim takes the SAME Damage object — full damage each, no falloff toward the tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295 (damage rolled once at MCSPlayer.as:2699); combo cap StatsManager.as:4298-4306`
- **Quote:** while(j < slashMax && !enemy.gotHitFlag) { dist = enemy.mcs.x - slashArray[j].x + offset; ... if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false)) { if(enemy.checkHit(scaledX,scaledY,damage)) ... } j++; } if(enemy.gotHitFlag) { comboCount++; }
- **Overturns:** "**Multi-target damage rule** (one arc hits N enemies — full damage each? falloff toward the tip?)."
- **Lane impact:** L5 — also yields the cheap pre-filter |Δx| < 200 world units, and grounds the 'combo rules' Ready bullet: combo = count of DISTINCT enemies hit per stroke, accumulated into a persistent counter capped at 999.

### `combat-core/pass-through-dash` — HELD [A2] ⚑ OVERTURNS LEDGER

The reach-cap ↔ dash relationship is answered: there is NO fixed dash constant — the player runs to the stroke's first point only if it is ≥ standingRange 50 away, then passes THROUGH to the stroke's last point at a per-stance slashSpeed of 50/40/30 world units per frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2408, :2476, :2676-2705; constants at :9 (standingRange=50) and :15-19 (slash speeds)`
- **Quote:** this.destX = this.slashArray[this.slashArray.length - 1].x; ... var xdiff:int = this.destX - posX; var ydiff:int = this.destY - this.slashArray[0].y; var dist:Number = Math.sqrt(xdiff * xdiff + ydiff * ydiff); var time:Number = dist / slashSpeed; velX = xdiff / time; velY = ydiff / time; this.slashDamage = this.getDamage();
- **Overturns:** "**The reach-cap ↔ 127px-dash relationship** (pass-through vs stop-within-reach — possibly two stacked motions)."
- **Lane impact:** L5 — it IS two stacked motions (approach, then pass-through), but the travel distance is the stroke's own span, itself bounded by the arc-length reach budget. src/config/combat-sim.ts's 'fixed 105.9 px pass-through' and the ledger's DASH_SLASH_PX=127 both need replacing with the derivation. Bonus (L2): Shunpo is setPosition(destX,destY) + slashDamage *= 2 + endSlash() at MCSPlayer.as:2700-2705.

### `combat-core/reach-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ① is dead: reach is a source-exact stat formula, base = 120 + floor((90 + 5·danRank)·SPD/(20+SPD)), in 800×480 world units — not an unmeasured 'unit of unknown scale'.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (scale established by InputManager.as:341 and :229)`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 — the reach gate can be built today from a formula rather than waiting on a footage measurement; at the stated L1 character base = 124 world px.

### `combat-core/reach-stance-mults` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance reach multipliers are light ×1.5 flat, balanced ×(1+0.005·mastery), heavy ×(0.5+0.005·mastery) hard-floored at 100 — which means BOTH the ledger's '300/200/120 mastery-9' triple AND three live constants in src/config/reach.ts are wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052-3055 (mastery domain 0-10 from reference/extracted/skilldata.xml:3-11 and :74)`
- **Quote:** case LIGHT_STANCE: this.slashLength = this.baseSlashLength * 1.5;  ...  case BALANCED_STANCE: this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);  ...  case HEAVY_STANCE: this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; }
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — src/config/reach.ts lightMult 1.4 (src: 1.5), balancedPerMastery 0.02 (src: 0.005), heavyPerMastery 0.04 (src: 0.005) are all wrong and are labelled CONTRACT-SRC; reach.ts's own comment shows they were back-derived from the legacy 0.9/1.2/1.4 triple, not read from the payload. Heavy's 100 is a floor clamp, not a mastery value.

### `combat-core/150pct-damage-is-a-buff` — HELD [A1]

The gold '150% DAMAGE' line under the HUD bars in the combat frames is a consumable BUFF readout, not a stance damage multiplier — reading it as 'heavy stance' would silently corrupt every TTK derived from those frames.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — bottom-left HUD, crop (0,910)-(620,1080) upscaled 2×; bound to OverworldHUD.as:1404, strings.json 4132, and MCSPlayer.as:209-211`
- **Quote:** Visible in the crop: portrait ring, HP 14/20 green, Chi 31/31 blue, a third bar reading 'CANNOT CHANGE STANCE', and below them '150% DAMAGE' in gold. Code: buffstr = "150% DAMAGE"; under bufftype == StatsManager.BUFF_ATTACK; string 4132 = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'; effect = if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK)) { this.minDamage *= 1.5; }
- **Lane impact:** L5 + L8 — the buff scales minDamage BEFORE the stance multiplier and only one buff can be live; heavy stance's own multiplier is also 1.5, which is exactly why the misread is available. The same frame independently corroborates the stance-switch meter gate: 'CANNOT CHANGE STANCE' is the label over the reload bar, matching nextStance()'s reload < maxreload/6 early return.

### `combat-core/build-version-parity` — STILL_UNHELD [STILL_UNHELD]

I cannot show that the android v0.682 combat constants equal the web v0.717 ones — and one of them provably does not (the crit-meter period), so every A2 in this lane must be ported labelled CONTRACT-SRC-v0.682, never plain CONTRACT.

- **Lane impact:** L5 — blocks promoting maxreload, slashUsage floors, slashSpeed 50/40/30, the 1.2/1.5 crit split and the 0.005-per-mastery terms to CONTRACT. The web payload's own AS3 is obfuscated (reference/decompiled/shs3_payload/scripts/§1t51s0§/, 5 files) and cannot be cross-read. Close-path: locate the same expressions in the obfuscated web AS3 by numeric-literal shape (120/90/5/20, 5*24, 50/40/30), or measure each on frames the way the crit-meter rate was measured.

### `combat-core/crit-meter-fill-rate` — PARTIAL [A1]

Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end); the android constants predict 4.00 s. THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s.

- **Cite:** `reference/frames/session11/crit-focus/{t1004.800,t1005.000,t1082.100,t1082.900,t3779.000}.png — meter track x=248..511 (263 px), row y≈1032; track width validated on t1003.000.png where HP 14/20 puts the green edge at x=433 = 70.3%`
- **Quote:** Fill right edge: t1004.800 x=281 (12.5%), t1005.000 x=290 (16.0%), t1082.100 x=304 (21.3%), t1082.900 x=340 (35.0%), t3779.000 x=370 (46.4%). Rates 17.5%/s and 17.1%/s, monotonic. Android prediction: '++this.reload' (MCSPlayer.as:1160) at 'GameEngine.getStageMC().frameRate = 24' (Mobile.as:117) over displayed span maxreload-24 = 96 ticks = 4.00 s.
- **Lane impact:** L5 — the structural model (linear, first 24 ticks hidden, zeroed on crit, slashUsage per stance) is A2-held, but the period constant must come from the frame, not the android build. This is the concrete proof that v0.682 combat tuning ≠ v0.717.

### `combat-core/gesture-classifier` — HELD [A2]

The gesture→attack map's discriminator is exact: a stroke is a SLASH iff it sampled >4 points AND its start→end straight-line distance exceeds 20 world units; otherwise it is a tap that moves the fighter, with a 25-unit dead-zone.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:268 with constants at :53 and :55; tap path MCSPlayer.as:2298-2308; peaceful-mode demotion MCSPlayer.as:2260-2273`
- **Quote:** isLine = drawArrayLength > lengthThreshhold && getDistanceSQ(firstPoint,lastPoint) > distThreshhold;   //  lengthThreshhold = 4, distThreshhold = 400   ...   dist = lineArray[0].x - getMCS().x; if(dist * dist < 625) { return; }
- **Lane impact:** L5 — the Ready bullet 'gesture→attack map' carried no thresholds; these are the numbers. Also uncovers input buffering the ledger has nowhere: a line drawn while a slash is committed is stored as slashArrayBuffer and fired next (MCSPlayer.as:2275-2285).

### `combat-core/heavy-def-0.8` — HELD [A2]

The Heavy-stance defence penalty ×0.8 is the one Ready sub-claim that survives intact, confirmed twice — in code and in the game's own skill copy.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3226-3234; corroborating string 6005 in docs/gauntlet/L0/index/strings.json (skill 1002 desc, reference/extracted/skilldata.xml)`
- **Quote:** internal function getDefense() : int { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }   ///   string 6005: 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%'
- **Lane impact:** L5 — the penalty exists ONLY on the defence side, which validates the repo's Stage-2 landmine warning; src/config/stances.ts heavy.damageTakenMult 1.25 is the same number inverted (1/0.8) and must stay data-only.

### `combat-core/launch-unlock-levels` — HELD [A2]

src/config/stances.ts's LAUNCH_UNLOCK_LEVEL is wrong for heavy: the source ladder is 3 = the stance's signature move (light launch / balanced flip-up / heavy launch), 4 = deflect in every stance, 5 = the stance's advanced move — so heavy launch unlocks at mastery 3, not 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3164-3194`
- **Quote:** else if(this.stance == LIGHT_STANCE) { this.canLaunch = this.lightMastery >= 3; this.canDeflect = this.lightMastery >= 4; this.canAirCombo = this.lightMastery >= 5; ... } else if(this.stance == BALANCED_STANCE) { this.canFlipUp = this.balancedMastery >= 3; this.canDeflect = this.balancedMastery >= 4; this.canLaunch = this.balancedMastery >= 5; ... } else if(this.stance == HEAVY_STANCE) { this.canLaunch = this.heavyMastery >= 3; this.canDeflect = this.heavyMastery >= 4; this.canStab = this.heavyMastery >= 5; ... }
- **Lane impact:** L5 + L2 — light 3 ✓, balanced 5 ✓, heavy 3 ✗ (config says 5). Reversed and Dual stances get all five abilities unconditionally (MCSPlayer.as:3188-3194), which the ledger's three-stance model has no slot for.

### `combat-core/reach-is-arclength` — HELD [A2]

Reach is an arc-length budget spent along the drawn stroke (a curvy slash covers less ground than a straight one), with the stroke visibly tapering to zero thickness as the budget drains — confirming a model the repo asserted without a source.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:198, :352-366 (defaults at :51-59; per-stance value set by MCSPlayer.as:3094)`
- **Quote:** distanceTravelled = Math.sqrt(distanceTravelledSQ); originalDistanceTravelled = distanceTravelled; if(distanceTravelled > distanceLeft) { distanceTravelled = distanceLeft; } distanceLeft -= distanceTravelled;
- **Lane impact:** L5 — the reach gate must decrement per polyline segment, not test a radius. Also fixes the stroke render: thickness = 8 tapering by (maxDistance-distanceLeft)/maxDistance, battle colour 0x990000, points resampled to ≤20 units.

### `combat-core/slash-type-map` — HELD [A2]

The 'gesture→attack map' is really a nine-way slash-type classifier with exact geometric gates (jumpThreshhold 100, ±25 tilt band, downstab |Δx|<50, drop >100), not a single mapping.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2403-2456; type constants at :37-53; jumpThreshhold at :11`
- **Quote:** else if(mcs.y - this.destY > jumpThreshhold) { this.slashType = JUMP_SLASH; } else if(this.canStab && this.destY < lastPt.y && Math.abs(this.destX - lastPt.x) < 50) { this.slashType = DOWNSTAB_SLASH; } else if(this.destY - lastPt.y > jumpThreshhold && !isAirborne()) { this.slashType = UP_SLASH; } else { diff = this.destY - lastPt.y; if(diff > 25) { this.slashType = HOR_SLASHUP; } else if(diff < -25) { this.slashType = HOR_SLASHDOWN; } }
- **Lane impact:** L5 + L6 — nine slash types (HOR / JUMP / DROP / UP / AIR / LAUNCH / DOWNSTAB / HOR_UP / HOR_DOWN) each drive their own animation, and UP_SLASH is the launcher (endSlash sets Damage.LAUNCH_AIR when canLaunch).

### `combat-core/stance-triangle` — HELD [A2]

The stance counter-triangle CONTRACT (light>heavy, heavy>balanced, balanced>light) is confirmed a third time, now from the payload's own string table rather than a transcribed tutorial line.

- **Cite:** `docs/gauntlet/L0/index/strings.json entries 6001 / 6003 / 6005, attached to skilldata.xml skills 1000 / 1001 / 1002`
- **Quote:** 6001: 'Swift but light stance. Slash range is longer but damage inflicted is lower.\nEffective against Heavy Stance.'  ·  6003: 'Balanced stance.\nEffective against Light Stance.'  ·  6005: '...\nEffective against Balanced Stance.\nDefense -20%'
- **Lane impact:** L5 — src/config/stances.ts STANCE_BEATS matches exactly; never relitigate. 6001 also states the light trade in the developer's words (longer range, lower damage), which is the reach/damage permutation in prose.

## economy — re-scored 82

48 → 82. Blocker ① dies twice (coins-per-kill generator AND calcXP), ③ dies outright (repair = nodeLevel×10), ④ dies (token cap 40 + 120s regen), ② splits — sell-price dies, prosperity survives narrowed to "magnitudes are server-side". §6's "dead IAP economy" is over-conceded: tier table, catalogue blob, hourly rotation rule and exchange rate all survive. Two subsystems the ledger never names are fully held (trade-goods arbitrage; the coin-purse cap ladder). One ledger claim under apparent payload attack is DEFENDED by a frame (Writ at 25g). Held back from 90+ by: prosperity deltas genuinely server-side; the trade-goods RNG seed expression differs between builds and I did not resolve it; and the 5× premium redenomination means every heavenly-gold figure must be re-derived per build before porting.

### `economy/cho-han-is-ev-neutral` — HELD [A2] ⚑ OVERTURNS LEDGER

Cho-Han betting is a zero-expected-value variance device, not a gold faucet — two independent floor(U[0,1)×6) dice give exactly 50/50 parity and a correct call returns bet × 2 on an escrowed stake.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1802-1843 (doChoHan); stake escrowed at :1790 (doBet)`
- **Quote:** InteractUI.as:1811-1812 — "var dice1:int = Math.random() * 6;\nvar dice2:int = Math.random() * 6;"; :1823 — "var isEven:Boolean = (dice1 + dice2) % 2 == 0;"; :1832-1834 — "if(isEven && choice == 0 || !isEven && choice == 1)\n{\n   StatsManager.changeGold(this.bet * 2);"
- **Overturns:** "gold has legit non-cash faucets (rebirth/tournament/betting)"
- **Lane impact:** L10/L11: betting must not be modelled as a gold source. Rebirth IS a genuine faucet (25 gold, 100 on the ninth). The Ready bullet is wrong in expectation on the betting clause.

### `economy/coins-per-kill-and-xp` — HELD [A2] ⚑ OVERTURNS LEDGER

Both halves of blocker ① are HELD in the web build: coins per kill come from <reward><loot> id 0 (=1 coin × qty) and id 1 (=5 coins × qty) rolled against <chance>, or Math.random()×level for duelists — and calcXP is a complete, literal formula with both helper curves.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:861-867 and :188-206 (= Android NPC.as:837-843 and :166-190); loot rows at reference/extracted/npcdata.xml:38-44 (131 <loot> blocks over 66 NPCs, tabulated this run)`
- **Quote:** §1t68s0§.as:863-867 — "§1t406s0§.instance.§1t6488s0§.§1t5846s0§(1 * _loc8_);\n}\nelse if(_loc7_ == 1)\n{\n   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(5 * _loc8_);". npcdata.xml:38-44 — "<reward>\n<loot>\n<id>0</id>\n<qty>2</qty>\n<chance>0.5</chance>\n</loot>\n</reward>". §1t68s0§.as:196-202 — "if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); }". Loot tally: (0,5,0.1)×42, (0,5,0.05)×19, (3,1,0.1)×27, (2,1,1)×10, (1,2,0.5)×7, (0,5,0.5)×6, (0,2,0.5)×5, (0,3,0.5)×5, rest singletons.
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L4/L10: the commonest field mob yields 0.5 coins/kill in expectation (10% × 5 × 1c), not 8. src/config/economy.ts:37 KILL_REWARD={coinsFlat:8} and its docblock 'COINS have NO source formula found' are both refuted — the filmed +8 is the top of the duelist range floor(U[0,1)×9), so the frame stands and only the flat-constant MODEL falls. calcXP helpers: getGreyLevel (NPC.as:94) and getZeroDifference (NPC.as:112).

### `economy/duel-token-cap-40` — HELD [A1] ⚑ OVERTURNS LEDGER

FRAME BEATS PAYLOAD: the duel-token cap is 40, not the Android bundle's 30 — the HUD reads 40/40 on film and the web payload's constant at the same slot is 40; this closes the token-economy blocker.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04, crop (1500,130)-(1780,235) upscaled ×5; corroborated at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200 vs reference/decompiled/shs3_android/scripts/StatsManager.as:166`
- **Quote:** The crop shows a skull icon in a green diamond beside a bordered field reading '40/40' with the label 'DUEL TOKENS' beneath. Constant blocks align slot-for-slot: APINTERVAL 60=60, DTINTERVAL 2*60=2*60, WARMOVEINTERVAL 60*60=60*60, MAXQUESTS 7=7, MAXDUELTOKENS Android 30 vs web 40, MAJORCUSTOMCLANTHRESHHOLD 40=40.
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** L10: token economy fully specified — cap 40, regen 1 per 120 s, ×2 under BUFF_DUELTOKENS, fresh character 20/20. L9 (WORLD) gets AP regen = 1 per 60 s free, closing world-exploration blocker ④ 'AP regen rate + cap'.

### `economy/iap-tiers-held-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

The real-money IAP tier tables are HELD verbatim for BOTH builds, including two discount ladders — the ledger's 'IAP tiers' Ready bullet is now cited rather than assumed, and the prior survey's STILL_UNHELD verdict is overturned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140 + :325-329 + :274-278 + :296-300 (web); reference/decompiled/shs3_android/scripts/PayUI.as:127-141 (Android)`
- **Quote:** §1t410s0§.as:136-140 — "this.goldtext0.text = 50 + \" \" + §1t1521s0§.getString(64);" … 125 … 200 … 275 … 400; :325-329 — "this.pricetext0.text = \"50 KREDS\";" … 100 … 150 … 200 … 250 KREDS. PayUI.as:127-141 — 10/25/40/55/75 gold at "4.99"/"9.99"/"14.99"/"19.99"/"24.99". Discounts: 20% → 60/150/240/330/480 (:274-278); 50% → 75/188/300/413/600 (:296-300).
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L10/L11: the whole cash→gold→coin chain now closes end-to-end (50 KREDS → 50 gold → 10,000 coins). §6 must stop calling the IAP economy structurally unrecoverable; only the payment processor is dead.

### `economy/premium-exchange-rate-200` — HELD [A2] ⚑ OVERTURNS LEDGER

1 heavenly gold buys 200 coins in the web v0.717 build, not the 1000 the Android build pays — frame and web payload agree against the Android row.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:948-959 (web convertgold) vs reference/decompiled/shs3_android/scripts/InteractUI.as:918-923; corroborated by the '200' banknote at 1 gold in the t=48:04 frame`
- **Quote:** §1t401s0§.as:952 — "§1t1523s0§.§1t9619s0§(200);" inside the block tagged by the surviving literal "convertgold" at :959; Android InteractUI.as:923 — "StatsManager.changeGold(1000);"
- **Overturns:** "The dead IAP economy — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L10/L11: the premium→coin sink is fully specified for the rebuild target at 200 coins/gold. Also corrects the prior gauntlet economy survey's E-08, which banked 1000.

### `economy/premiumdata-blob-is-extracted` — HELD [A2] ⚑ OVERTURNS LEDGER

The premium storefront catalogue blob IS on disk and is plain XML — 16 permanent SKUs, a commented-out special list, and rotating outfit sets carrying the developers' own comment headers — overturning the prior survey's finding that it was never extracted.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin (4,504 bytes, XML 1.0); rotation seeding at reference/decompiled/shs3_android/scripts/XMLShopData.as:101`
- **Quote:** "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<premiumdata>\n<default>\n<item>2208</item>\n<item>2209</item>\n<item>2212</item>\n<item>2215</item>\n<item>2213</item>\n<item>2100</item>" … and in <rotation>: "<!-- Assassin outfit -->", "<!-- Dark Assassin outfit -->", "<!-- Santa outfit -->", "<!-- Ichigo outfit -->", "<!-- Zaraki outfit -->", each followed by a <set> of 6-7 item ids (Assassin = 2130, 7034, 4065, 5008, 11036, 12018)
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L3 (ITEMS/PAPERDOLL): each rotation <set> is a free 6-7-slot paperdoll manifest with a human-readable outfit name. L10/L11: hourly rotation rule is `setRNGSeed(serverDate * floor(serverTime/3600))`.

### `economy/repair-weapon-cost` — HELD [A2] ⚑ OVERTURNS LEDGER

Repair-Weapon cost is HELD in both builds at currentNodeLevel × 10 coins, and repair resets condition to tier 1 rather than restoring to new.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1058; the same line number in the web build, reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1058`
- **Quote:** InteractUI.as:1057-1058 — "case \"repairweapon\":\n   cost = StageManager.getCurrentNodeLevel() * 10;"; §1t401s0§.as:1058 — "cost = §1t1525s0§.§1t9936s0§() * 10;". On success InteractUI.as:1073 — "if(weapon.uses > 1) { weapon.uses = 1; }"; refused for itemID 0 or 13000 at :1066.
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10: closes the blocker and also kills the §5 Tier-2 task line 'Items/economy session: … read Repair cost' — no playable build is needed for it.

### `economy/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The sell-price formula is HELD verbatim in the WEB build and is independent of <baseprice> — it is a function of item-id band, weight and affix count only, so any 'sell = X% of buy' model is false.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web), byte-for-byte identical to reference/decompiled/shs3_android/scripts/Item.as:1582-1592; consumed at ShopUI.as:401, paid at ShopUI.as:540`
- **Quote:** public function getSellAmt() : int
{
   if(this.itemID < 3000) { return 1; }
   if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; }
   return (1 + this.getModifierCount()) * 5;
}
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L10 (PROGRESSION + ECONOMY): sell price is portable today. Trap flagged: ShopUI.as:58 declares `internal var sellPercentage:Number = 0.5;` which is dead code — one declaration, zero reads across the bundle. Every itemID < 3000 (all consumables/materials) sells for exactly 1 coin.

### `economy/service-prices-are-formulas` — HELD [A2] ⚑ OVERTURNS LEDGER

Four of the six service 'prices' the ledger banked as constants are formulas keyed to node level, and one filmed town corroborates three of them simultaneously.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:229 (inn), :241 (stables), :1406 (toll), :1003-1008 (forge), :1058 (repair), :1083 (reinforce) — all line-matched in web §1t401s0§.as`
- **Quote:** InteractUI.as:1003-1008 — "level = StageManager.getCurrentNodeLevel();\nif(level > 80)\n{\n   level = 80;\n}\ncost = level * 100;". Inn/stables = getNodeLevel(currentNode) * 2; toll = getNodeLevel(currentNode); reinforce = flat 5000. Video B's town is a level-7 node (B-10 t=21:02 dialogue: 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS'), which makes toll 7 ✓, stable 14 ✓, forge 7×100=700 ✓.
- **Overturns:** "Forge 700c (the −70 HUD read is a capture artifact)"
- **Lane impact:** L10: Forge is min(nodeLevel,80)×100 — up to 8000c, not a 700c constant. The ledger banked samples, not laws. Reinforce additionally burns reagent stats 20060-20065 in three level bands (<30, <60, 60+).

### `economy/coin-purse-cap-ladder` — HELD [A2]

A hard coin-purse cap ladder (1000/2000/4000/6000/8000/10000) exists in BOTH builds and changeGold silently discards the overflow — the load-bearing sink that gives the economy its shape, named in none of the ledger's economy bullets.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2632-2667; identical in web at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2921-2940`
- **Quote:** internal static function getMaxCoins() : int
{
   switch(getStat(1011))
   {
      case 0: return 1000;  case 1: return 2000;  case 2: return 4000;
      case 3: return 6000;  case 4: return 8000;  case 5: return 10000;
      default: return 1000;
   }
}
… changeGold: "if(newCoins > maxCoins) { newCoins = setStat(11,maxCoins); }"
- **Lane impact:** L10/L9: a 1000-coin default cap against a 5000c Reinforce and an 8000c max-level Forge IS the mid-game grind. isCoinPurseFull() gates both the gold→coin conversion and the purse-upgrade purchase (ShopUI.as:426-435). The bank (InteractUI.as:1748 bankDeposit, STAT_COINSINBANK) is the escape hatch and pays zero interest; storage weight = 100 + STAT_DAN*10 + STAT_PAIDSTORAGE*10 (BankUI.as:264), each +10 costing 1 heavenly gold.

### `economy/crop-price-is-supply-oscillator` — HELD [A2]

Crop price is not a static '5–20c' range but a three-point supply signal: base 10 for all four clans, 20 for the clan with the fewest crops, 5 for the clan with the most, and a flat 10 if the four are level.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:105 and :497-501; payout at :1544-1548; global tally fed by getAllCrops at :220`
- **Quote:** InteractUI.as:497-501 — "this.cropPrices = [10,10,10,10];\nif(maxCrops != leastCrops)\n{\n   this.cropPrices[leastCropsSide] = 20;\n   this.cropPrices[maxCropsSide] = 5;\n}"
- **Overturns:** "crop 5–20c"
- **Lane impact:** L9/L10/L11: '5–20c' is the envelope, not the rule. Payout is count × price in one lump. Needs the four-clan crop tally as state, which is a server-sim surface the offline build must author.

### `economy/guest-start-3-gold-confirmed` — HELD [A2]

The frame-sourced guest wallet '100 coins / 3 gold' is confirmed verbatim by the web payload's initNewPlayer; the Android build's 0 gold is what made the prior survey call it a live contradiction.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007 (initNewPlayer), wallet block :1023-1028 — positionally identical to reference/decompiled/shs3_android/scripts/StatsManager.as:692-711 (same 21 assignments, same order, same default args 4017/11017/12017)`
- **Quote:** §1t1523s0§.as:1023-1028 — "§1t7357s0§(§1t9412s0§,100);" (GOLD) "§1t7357s0§(§1t9413s0§,3);" (HGOLD) "§1t7357s0§(§1t9414s0§,30);" (AP) "§1t7357s0§(§1t9415s0§,30);" (MAXAP) "§1t7357s0§(§1t9416s0§,20);" (DUELTOKENS) "§1t7357s0§(§1t9417s0§,20);" (MAXDUELTOKENS). Android StatsManager.as:706 — "setPlayerStats(STAT_HGOLD,0);"
- **Lane impact:** L9/L10: src/config/profile.ts:10's deferred '(100 coins / 3 gold)' is now A2-confirmed and can be seeded. PROFILE_START_POOLS {hp:10, chi:10, ap:30} also matches verbatim.

### `economy/heavenlyprice-is-5x-deflated` — HELD [A1]

FRAME BEATS PAYLOAD: the shipped v0.717 gold prices are exactly 5× the <heavenlyprice> rows in reference/extracted/itemdata.xml — the frame shows badges 60, 25, 15, 10 and 5 while that file's entire heavenlyprice domain is {0,1,2,3,5,8,12,25,100}, so 10, 15 and 60 do not exist in it at all.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04, premium BUY shop, 1920×1080; crops (380,840)-(580,1030) badge '60', (390,650)-(940,840) three scrolls each badge '25', (190,270)-(560,450) banknote '200' badge '1' — each upscaled ×4 LANCZOS`
- **Quote:** Visible in the crops: a blue gift-box tile with a white '60' beside a gold-coin icon; three purple-bordered scroll tiles each with '25' beside a gold-coin icon; a banknote icon printed '200' with '1' beside a gold-coin icon. Frame price set = {1,5,10,15,25,60}; itemdata.xml heavenlyprice tally = 0:1 1:59 2:6 3:191 5:5 8:1 12:39 25:1 100:1 (304 rows).
- **Lane impact:** L3 (ITEMS): <baseprice>/<weight>/<modifier> port as-is (the web and Android itemdata are byte-identical apart from the XML declaration), but <heavenlyprice> must be MULTIPLIED BY 5 for a v0.717 target or the shop will price every premium item at one-fifth of the original. L10/L11 inherit the same rule.

### `economy/prosperity-magnitudes-server-side` — PARTIAL [A2]

The prosperity daily-sim taxonomy is HELD — every renderable event, its sign, the four town state variables and one hard-coded constant — but every magnitude arrives from the dead server, so the tick rates and deltas remain unheld.

- **Cite:** `reference/decompiled/shs3_android/scripts/HistoryItem.as:137-311 (dataToString); values sourced at NetworkManager.as:2042 (updateTownProsperity); 5-tier ladder consumed at DungeonGenerator.as:1363-1555`
- **Quote:** HistoryItem.as — "return \"merchants robbed by bandits: prosperity -\" + val1;" / "return getAttackerName(val2) + \" attacked town: prosperity -\" + val1;" / "return \"mercenaries upkeep cost: prosperity -\" + val1;" / "return \"town hired ninja: prosperity -1000\";" / "return \"trade with other towns: prosperity +\" + val1;" / "return \"town status (prosperity: \" + val4 + \", crops: \" + val1 + \", goods: \" + val2 + \", defense: \" + val3 + \")\";"
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L11: the client renders, it does not compute. Blocker ② dies for sell-price and survives NARROWED for prosperity — the offline sim must author the deltas and label them in DIVERGENCES. Only the −1000 ninja hire is a recoverable constant.

### `economy/quests-never-pay-coins` — HELD [A2]

No shipped quest pays coins: the schema supports it but a scan of all 386 <outcome> blocks in questdata.xml found zero carrying <id>11</id> (STAT_GOLD) — so the coin faucet set is closed and enumerable.

- **Cite:** `reference/extracted/questdata.xml — 386 <outcome> blocks scanned this run, 0 with <id>11</id>; 69 <reward><exp> rows over 10 distinct values; branch at reference/decompiled/shs3_android/scripts/XMLQuestOutcome.as:56-58`
- **Quote:** XMLQuestOutcome.as:56-58 — "if(this.id == 11 && this.modify > 0)\n{\n   OverworldHUD.instance.lootDialog.addLootCoins(this.modify);\n}". Quest XP reward values, measured: {100, 200, 250, 290, 500, 600, 750, 1000, 2000, 3000}.
- **Lane impact:** L1 (CAMPAIGN) / L10: quest rewards are exp + loot only. Faucet set closes to: mob loot rolls, duelist kills, chests, crops, trade goods, item sales, war rank-ups, daily prize, gold conversion. Daily-prize table verbatim at InteractUI.as:1195-1275 (Math.random()*36 → 100c on 0-4, 200c on 5, 300c on 6, items 7+; a Math.random()*6 bonus roll every 10th streak day paying 1000c on a 0).

### `economy/rebirth-payout-config-is-right` — HELD [A2]

The web build pays 25 heavenly gold per rebirth and 100 on the ninth (DAN==8), exactly matching src/config/economy.ts REBIRTH — while the Android build pays 5/20, so porting from the Android decompile would have injected a 5× error into an already-landed config.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2656 (web) vs reference/decompiled/shs3_android/scripts/StatsManager.as:2200-2208 (Android); config at src/config/economy.ts:54`
- **Quote:** §1t1523s0§.as:2644-2652 — "if(§1t7356s0§(§1t9426s0§) == 8)\n{\n   §1t9713s0§(§1t9413s0§,100);\n   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),\"10\"]));\n}\nelse\n{\n   §1t9713s0§(§1t9413s0§,25);\n}"; Android StatsManager.as:2200-2208 — "changeStat(STAT_HGOLD,20)" / "changeStat(STAT_HGOLD,5)"
- **Lane impact:** L10/L11: REBIRTH.earlyGold=25 / tenthGold=100 upgrades from research-sourced to A2-sourced. MAX_DAN_RANK=10 corroborated twice — STAT_DAN increments only while <9 (0-indexed = 10 ranks) and the announcement string is literally parameterised with "10".

### `economy/trade-goods-arbitrage-loop` — PARTIAL [A2]

A five-commodity buy-low/carry/sell-high arbitrage loop with a deterministic seeded price oscillator exists in both builds and appears in none of the ledger's four economy bullets.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1647-1676 (web) = reference/decompiled/shs3_android/scripts/InteractUI.as:1558-1586 (Android); tutorial tip at GameEngine.as:636`
- **Quote:** Price/variation table identical in both: 0→(10,20), 1→(20,30), 2→(100,15), 3→(200,30), 4→(200,30); return expression "return price * (100 - variation / 2 + rng.rand(variation)) / 100;". GameEngine.as:636 — "Tip: You can make money easily by buying goods from a market and selling in another town." Android seeds `new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index)`; the web expression at :1676 is `§1t3317s0§.instance.§1t1848s0§() * param1` (two factors, not three) — I did NOT resolve which is authoritative.
- **Lane impact:** L9/L10: fully reproducible offline with the project's injected mulberry32 RNG, no server needed. buyGoods/sellGoods write stats 20054-20058. The seed-expression divergence between builds is an open item.

### `economy/war-room-structure-costs` — HELD [A2]

War-Room structure build totals are HELD as payload rows — Forward Base 10000, Ladder 5000, Defense 10000, Town 10000 coins, donated in flat 500-coin chunks that each burn one war move.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:190-208 (per-structure totals); WarHexUI.as:1291-1302 and :1332-1386 (donation mechanics); WarHex.as:424/478/521/541 (same totals as maxcost); StatsManager.as:162 (WARMOVEINTERVAL)`
- **Quote:** WarHexUIBuildMenu.as:192 — "str += \"- \" + LangManager.getString(566) + 10000 + \" \" + LangManager.getString(63) + \"\\n\";" under case WarHex.HEX_FORWARDBASE; :197 = 5000 under HEX_LADDER; :202 = 10000 under HEX_DEFENSE; :207 = 10000 under HEX_TOWN. WarHexUI.as:1332 — "var buildcost:int = 500;". StatsManager.as:162 — "internal static var WARMOVEINTERVAL:int = 60 * 60;"
- **Overturns:** "War-Room structure coin costs absent from config"
- **Lane impact:** L11 (META + REBIRTH): src/config/economy.ts:60 buildDonationCap:500 is corroborated; the four totals are new to the repo. The Surface bullet stays TRUE of the repo — this is now a port task, not a knowledge gap. War moves regen 1 per real hour.

### `economy/web-payload-is-decompilable` — HELD [A2]

The web v0.717 payload IS decompiled and readable on disk under SWFDefender identifier mangling — 1079 .as files, 612 §…§ game-logic classes — so no lane needs to caveat 'this is the Android build' any more.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web Item.getSellAmt); 612 §-mangled classes in that directory, 1079 .as files total`
- **Quote:** if(this.§1t467s0§.§1t697s0§() < 3000)
{
   return 1;
}
if(this.§1t545s0§() >= 10)
{
   return (1 + this.§1t497s0§()) * 10;
}
- **Lane impact:** Every lane (L1–L11): the Android-only provenance caveat that the pass-1 economy survey and the L0 journal S0-3 both carry is now removable for AS3. Diff web vs android, cite the web. Class map established: StatsManager=§1t1523s0§, InteractUI=§1t401s0§, Item=§1t17s0§, NPC=§1t68s0§, XMLItem=§1t104s0§, XMLShopItem=§1t61s0§, PayUI=§1t410s0§.

### `economy/writ-25g-upheld-by-frame` — HELD [A1]

The ledger's 'Writ of Release 25g' is CORRECT and is upheld against a payload row that appears to refute it: itemdata.xml lists the Writ at heavenlyprice 5, but the frame shows three 25-gold scrolls matching the three 5-priced scroll items exactly, so the 5 is the Android denomination.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04 crop (390,650)-(940,840) ×4 — three purple scroll tiles at 25 gold; vs reference/extracted/itemdata.xml:2327-2339 (item 2203)`
- **Quote:** itemdata.xml:2327-2339 — "<item>\n<id>2203</id>\n<type>10</type>\n<name>4156</name>\n<unique>1</unique>\n<baseprice>0</baseprice>\n<heavenlyprice>5</heavenlyprice>"; the frame's three 25-gold scrolls correspond one-for-one to the three heavenlyprice-5 scrolls 2200 (Amnesia Scroll), 2203 (Writ of Release), 2207 (Name Change Scroll).
- **Overturns:** "Writ of Release 25g now double-confirmed"
- **Lane impact:** L10/L3: do NOT 'correct' the ledger down to 5 gold on the strength of the payload row. This is the worked example proving the 5× redenomination rule and the standing frame-wins invariant in the same claim.

## enemies-ai — re-scored 78

Ledger says 34/100. Re-scored 78. All five §4 blockers resolve on disk: ① the level→stat formula is NPC.setLevel() (linear rescale + 0.9 sub-21 + a hard 1/1/1 clamp at lvl<=10); ② 403 authored <hp> rows (1..1000); ③ every attack animation ships as parta/partb/partc with explicit frame durations across 471 timed anims; ④ per-class engagement distances (50/100/400/250) plus a 24-frame decision cadence, and 118 <wave> blocks with 160 <x> spawn coords + drop-in-from-above rule; ⑤ the archer's full ballistic solve (GRAVITY=3, cos30 launch, ±4 jitter) and — refuting the blocker's premise — no reflect mechanic anywhere, only a zombie half-damage-unless-behead gate. Beyond the blockers the payload holds a 38-case ai-id→class dispatch that the shipped 3-tier AI_TIERS does not model at all. Capped at 78, not 90+, by four things: (1) every behavioural constant comes from the ANDROID v0.682 decompile — the web v0.717 payload decompile holds 652 classes and ZERO Enemy*/NPC* gameplay code, so build parity is unestablished and this is the dominant residual risk; (2) "Tengu", listed Ready in the ledger taxonomy, greps to 0 across the entire payload and script tree; (3) the 38 behaviour classes are unwritten work, not a tuning gap; (4) the 12-frame hit-lockout is a counter with no stagger animation and wants frame-side confirmation before it is treated as CONTRACT.

### `enemies-ai/ai-id-to-class-map` — HELD [A2] ⚑ OVERTURNS LEDGER

The <ai> field is not a difficulty tier — it is an index into a literal 38-case switch that instantiates 34 named Enemy* classes plus 3 Friendly* classes, each a full hand-written state machine; the shipped src/config/ai.ts AI_TIERS easy|normal|hard table models a structure the original does not have.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-634`
- **Quote:** switch(xml.ai) { case 0: actor = new EnemyPlayer(MCSPool.getMCS(),true,false); break; case 1: actor = new EnemyKnife(MCSPool.getMCS()); break; case 2: actor = new EnemyArcher(MCSPool.getMCS()); break; case 3: actor = new EnemyKatana(MCSPool.getMCS()); break; case 4: actor = new EnemySpear(MCSPool.getMCS()); break; case 5: actor = new EnemyShield(MCSPool.getMCS()); break; ... case 35: actor = new EnemySorcererBoss(MCSPool.getMCS()); break; case 36: actor = new EnemyKanjiGuardian(MCSPool.getMCS()); break; case 37: actor = new EnemySpearElite(MCSPool.getMCS(),true); break;
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster"
- **Lane impact:** L0 enemies-ai: the taxonomy is A2-held, not research-reconstructed. But the shipped 3-tier AI model is the wrong SHAPE, and that unwritten 38-class work is what keeps the score under 90. npcdata uses 34 distinct <ai> values across 425 rows (histogram: 1×56 2×48 3×52 4×47 5×48 6×3 7×6 8×2 9×73 14×15 26×8 28×24 29×10 30×8 …).

### `enemies-ai/arrow-arc-physics` — HELD [A2] ⚑ OVERTURNS LEDGER

Arrow arc physics is held in full: a closed-form ballistic solve at a fixed 30° launch (0.866 = cos30) from a 60px muzzle offset with ±4 vertical scatter, integrated per-frame with GRAVITY = 3 and ttlMax = 48, rotation = atan(velY/velX)*57.2727+180, dying at groundY; knockdown chance gates on the archer's level (>50 → 1-in-2, >20 → 1-in-3, >10 → 1-in-4, else never). The Oni thrower reuses the identical solve via createRock.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyArcher.as:271-302 + ArrowProjectile.as:51-56 + Projectile.as:8,22 + EnemyGoblinThrower.as:555-565`
- **Quote:** var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866; velA = Math.sqrt(velA); var velXa:Number = velA * 0.866; var t:Number = Math.abs(targetX - fireX) / velXa; var velYa:Number = (targetY - fireY - 0.5 * Projectile.GRAVITY * t * t) / t; if(fireX > targetX) { velXa = -velXa; } velYa += Math.random() * 8 - 4;   ·   Projectile.as:8 internal static var GRAVITY:Number = 3;   ·   ArrowProjectile.as:51-56 x += velX; y += velY; … rotation = Math.atan(velY / velX) * 57.2727 + 180; velY += GRAVITY;
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: kills the arrow half of blocker ⑤. Corroborated visually by the two drawn-longbow archers in the seg-11 frame (CLAIM 4).

### `enemies-ai/boss-names-are-procgen` — HELD [A2] ⚑ OVERTURNS LEDGER

Two of the four 'missing bosses' the ledger flags are not bosses at all — "Hachisuka Kano" and "Honda Shizuka" are procedurally generated bounty-target names assembled from the shipped name tables; "Zabuza" and "Hotaru" appear nowhere in the payload or the 559-class decompile.

- **Cite:** `reference/extracted/android/87_NameGenerator_SamuraiFamilyNames.bin, 85_NameGenerator_MaleNames.bin, 88_NameGenerator_FemaleNames.bin + XMLNpc.as:527,581-594`
- **Quote:** 87_NameGenerator_SamuraiFamilyNames.bin (36 entries): "Asai / Askikaga / Chosokabe / Date / Fukushima / Genji / Hachisuka / Hattori / Heike / Hojo / Honda / Hosokawa / …"  ·  85_MaleNames.bin (398 entries) contains "Kano" at index 79  ·  88_FemaleNames.bin (291 entries) contains "Shizuka" at index 225  ·  XMLNpc.as:527 this.name = NameGenerator.getInstance().getSamuraiName(rng,true);  ·  XMLNpc.as:581-586 if(isBountyTarget) { bossxml = QuestEngine.getNPCData(18); this.id = INDEX_BOUNTYTARGET; this.ai = bossxml.ai; this.hp = bossxml.hp;
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L0 enemies-ai: prevents a real authoring error — a recreation that hard-codes these as named bosses would be wrong. The correct port is a bounty-target generator: random surname + given name wearing NPC 18's statline.

### `enemies-ai/engagement-ranges` — HELD [A2] ⚑ OVERTURNS LEDGER

Aggro/engagement geometry is a set of per-class literal constants, plus a global decision cadence: Knife 50px, Katana 100px, Spear 400px approach with 100/50px stab, Shield 50/100px, Ogre 100/40px, Wolf lunge band 100>d>50 and pounce 100-250 at 1-in-3, Archer switches bow→knife under 100px, JiangSi 50px, overworld roamer trigger 100px; NPC.aiCounterMax = 24 frames, halved to 12 for elites and the player-mirror.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:22 + NPC.as:285-294; EnemyKnife.as:181,200; EnemyKatana.as:167,179; EnemySpear.as:192,204,225,227; EnemyShield.as:204,216,265; EnemyOgre.as:239,241; EnemyWolf.as:255,259; EnemyArcher.as:202,219; EnemyJiangSi.as:192; Obj_NPCProcGen.as:135`
- **Quote:** internal var aiCounterMax:int = 24;  …  internal function checkAITrigger() : Boolean { --this.aiCounter; if(this.aiCounter <= 0) { this.aiCounter = this.aiCounterMax; return true; } return false; }  ·  EnemySpear.as:192 if(playerX - mcs.x < 400 && mcs.y - playerY < 10 && int(Math.random() * 4) == 0)  ·  EnemyWolf.as:259 else if(dist >= 100 && dist < 250 && int(Math.random() * 3) == 0)  ·  Obj_NPCProcGen.as:135 return abs(this.npc.mcs.x - mc.x) < 100;
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: kills the aggro half of blocker ④, and supplies the decision cadence that src/config/ai.ts currently models as AI_THINK_INTERVAL_MS with no source.

### `enemies-ai/kill-rewards-close-two-economy-blockers` — HELD [A2] ⚑ OVERTURNS LEDGER

Kill rewards are fully authored in npcdata's <reward> plus NPC.as: loot id 0 = a 1-coin drop, id 1 = a 5-coin drop, id 2 = quest item, id 3 = level-scaled random item, anything else = that literal item id — so coins-per-kill is Σ(qty × {1,5}) over rolled drops, not a flat 8; and the XP award is the complete grey-level / over-level / elite curve on base xp = level*2 + 20.

- **Cite:** `reference/extracted/npcdata.xml:38-44 (66 <reward> / 131 <loot>, chance domain 0.05,0.1,0.3,0.4,0.5,1) + reference/decompiled/shs3_android/scripts/NPC.as:218, 799-855, 166-190, 94-105, 112-124`
- **Quote:** npcdata.xml:38-44 <reward><loot><id>0</id><qty>2</qty><chance>0.5</chance></loot>   ·   NPC.as chance = loot.chance * 100; if(chance == 100 || Math.random() * 100 < chance) … if(lootType == 0) { addLootCoins(1 * qty); } else if(lootType == 1) { addLootCoins(5 * qty); } else if(lootType == 2) { addQuestLootItem(); } else if(lootType == 3) { addRandomLootItem(this.level,false,true); } else { addLootItemBasic(lootType,qty); }   ·   NPC.as:166-190 public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) { if(mobLevel <= getGreyLevel()) { return 0; } if(mobLevel - playerL
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** Cross-lane into L0 economy, banked here because it lives in npcdata.xml. Kills economy blocker ① in both halves: the coin faucet and the full XP curve (incl. getGreyLevel playerLevel - floor(playerLevel/10) - 5, and getZeroDifference 5/6/…) are on disk.

### `enemies-ai/level-stat-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The enemy level→stat formula the ledger calls "absent, not just inferred" is NPC.setLevel(): a linear rescale of the authored XML statline (factor = requestedLvl / authoredLvl, ×0.9 at or under level 20) applied identically to damage, defense and maxhp, with a hard clamp to 1/1/1 at level ≤ 10 and xp = lvl*2 + 20.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:239-260`
- **Quote:** public function setLevel(lvl:int) : * { var factor:Number = lvl / this.level; if(lvl <= 20) { factor *= 0.9; } this.level = lvl; this.damage *= factor; this.defense *= factor; maxhp *= factor; setHP(maxhp); this.updateHealthBar(); this.xp = lvl * 2 + 20; if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); } }
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: kills blocker ①. The lvl<=10 clamp is also the mechanical CAUSE of the SESSION-11 empirical finding that mobs die in one hit, and it retro-justifies src/config ENEMY_BASE.hp = 1.

### `enemies-ai/per-enemy-hp` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-enemy HP is fully authored: 403 <hp> rows spanning 1..1000, alongside 406 <attack> and 394 <defense> rows.

- **Cite:** `reference/extracted/npcdata.xml:3121-3128 (index: docs/gauntlet/L0/index/npcdata.json, npcdata/npc/hp count 403, range [1.0, 1000.0])`
- **Quote:** <npc>\n\t\t<id>144</id>\n\t\t<name>5058</name>\n\t\t<lvl>80</lvl>\n\t\t<hp>1000</hp>\n\t\t<ai>28</ai>\n\t\t<attack>200</attack>\n\t\t<defense>200</defense>
- **Overturns:** "② per-enemy HP."
- **Lane impact:** L0 enemies-ai: kills blocker ②. Measured HP histogram top: 1×42, 15×32, 30×26, 10×23, 40×19, 20×13, 150×11.

### `enemies-ai/shipped-config-hp150-is-stale` — HELD [A3] ⚑ OVERTURNS LEDGER

The ledger's Surface bullet that the shipped ENEMY_BASE is a PvP-duel dummy at hp 150 was true when written (2026-07-20) and is false now — the 150 was removed in commit 335e615 on 2026-07-26 and ENEMY_BASE.hp is 1, asserted green in the suite.

- **Cite:** `tests/config-values.test.ts (57 passed) + tests/enemyModel.test.ts (14 passed); assertion at tests/config-values.test.ts:466-474`
- **Quote:** $ npx vitest run tests/config-values.test.ts →  Test Files  1 passed (1) / Tests  57 passed (57).  Assertion: expect(ENEMY_BASE).toEqual({ hp: 1, minDamage: 1, damageRange: 0, defense: 5, stance: 'heavy', deflectLearned: false, stats: ENEMY_STATS });  ·  git log -S"hp: 150" -- src/config/combat-sim.ts → 335e615 2026-07-26 SESSION13 PHASE B
- **Overturns:** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L0 enemies-ai: the Surface bullet is stale on both halves — the hp 150 is gone, and 'every PvE number lives only in notes' is refuted by 403 hp / 406 attack / 394 defense rows. The code comment that guessed at the 1 now has its source: NPC.as:253 clamps to 1 below level 11.

### `enemies-ai/spawn-geometry` — HELD [A2] ⚑ OVERTURNS LEDGER

Spawn geometry is fully authored: 118 <wave> blocks carrying 160 <x> spawn coordinates (range -400..2000), 171 <lvl> overrides (1..80), 75 <fatal> flags, 169 <enemy> / 70 <friend> / 2 <neutral>; the spawn rule is wave 0 on the ground and waves 1+ dropping in from above at posY - random*200, with the next wave gated on every enemy in enemyList being dead.

- **Cite:** `reference/extracted/questdata.xml:77-88 + reference/decompiled/shs3_android/scripts/NPCManager.as:300-320,374-412`
- **Quote:** <wave>\n      <enemy>\n        <id>1</id>\n        <qty>1</qty>\n        <x>750</x>\n      </enemy>\n      <enemy>\n        <id>6</id>\n        <qty>1</qty>\n        <x>790</x>\n        <fatal>0</fatal>\n      </enemy>   ·   NPCManager: if(currentWave == 0) { posY = StageManager.getGroundY(); } else { posY = 0; } … createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY - Math.random() * 200,npcHolder.getFatal(),npcHolder.getLvl());
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: kills the spawn half of blocker ④, so ④ is dead in both halves. Also explains the FALL_STATE→LAND_STATE branch every Enemy class opens with (EnemyArcher.as:49-52 catches ENEMYLAND).

### `enemies-ai/stagger-is-a-counter-not-an-anim` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The 'stagger' half of blocker ③ resolves differently than the ledger assumes: the hit reaction is a 12-frame hit-lockout counter (gotHitCounter = 12, gating canHit()), and there is NO stagger/flinch/gothit animation among the 158 human anim names — only a launch/knockdown reaction chain (gotlaunchedupwards 4/9/7, gotlauncheddowned 18, downedup 4, downedup2 25, deathdowned 7).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:462 and NPC.as:296-299`
- **Quote:** this.gotHitCounter = 12;  …  public function canHit() : Boolean { return this.gotHitCounter == 0; }
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai: the number is held (12 frames of hit-lockout / i-frames) but the ledger asked for a mechanic the source does not implement. Wants frame-side confirmation before being stamped CONTRACT — this is one of the four things capping the re-score.

### `enemies-ai/telegraph-active-recovery-frames` — HELD [A2] ⚑ OVERTURNS LEDGER

Telegraph / active / recovery frame counts are authored verbatim: every stance attack ships as three named parts with explicit frame durations, e.g. heavyhorizontalslash_parta d=6, _partb d=9 (looping = active hold), _partc d=7 — across 471 timed animations in the 18 MCSCharacter_*AnimationData blobs.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (158 <anim> blocks; measured 471 across all 18 *AnimationData.bin)`
- **Quote:** <?xml version="1.0"?>\n<animdata>\n<anim i="idle" d="1">\n<f i="0">\n<n i="20" x="-10" y="-64" r="-9"></n>  …  heavyhorizontalslash_parta:6, heavyhorizontalslash_partb:9 (l="1"), heavyhorizontalslash_partc:7, balancedhorizontalslash_parta:4/_partb:9/_partc:7, lighthorizontalslash:3, katanaattack:10, stabattack:14, downstab:15, ninjaslash:8, pullbackarrow:9, pullbackarrow_full:15, firearrow:1, arrownormalpose:22
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: kills the telegraph/active/recovery half of blocker ③. Also corrects S0-4's '~450 animations' estimate to a measured 471, each with a frame duration and full 21-part keyframes.

### `enemies-ai/tengu-is-not-in-the-payload` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

"Tengu", listed in the ledger's Ready taxonomy, greps to zero across payload.xml, questdata.xml, npcdata.xml, itemdata.xml, skilldata.xml, ui_strings.txt and the entire Android script tree. "Guardian" is held.

- **Cite:** `grep -c -i "tengu" over reference/extracted/*.xml + ui_strings.txt → 0 each; Guardian at reference/decompiled/shs3_android/scripts/NPCManager.as:628 and reference/extracted/npcdata.xml:4111`
- **Quote:** npcdata.xml:0  itemdata.xml:0  questdata.xml:0  ui_strings.txt:0  payload.xml:0  skilldata.xml:0   ·   NPCManager.as:628 case 36: actor = new EnemyKanjiGuardian(MCSPool.getMCS()); break;   ·   npcdata.xml:4111 <id>802</id> … <lvl>10</lvl> <hp>30</hp> <ai>36</ai>  (name resolves to "Guardian"; dedicated 102_MCSCharacter_GuardianAnimationData.bin, 16 anims)
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)"
- **Lane impact:** L0 enemies-ai: Guardian HELD, Tengu STILL_UNHELD. The Ready bullet over-claims one whole faction — either a v0.717-only addition or a ledger invention. This is one of the four things capping the re-score.

### `enemies-ai/undead-rule-is-not-reflect` — HELD [A2] ⚑ OVERTURNS LEDGER

The Undead blocker is wrong in kind, not merely unmeasured: grep 'reflect' over all 559 Android classes returns zero hits. The actual Undead-specific rule is a head-gate — a zombie takes HALF damage unless the hit lands on hat/head/neck — inverting the base class, which instead rewards a behead with ×1.5. JiangSi uses the standard ×1.5 and does not halve.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:493-518 (contrast NPC.as:451-453 and EnemyJiangSi.as:308-311)`
- **Quote:** switch(target) { case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true; … } … if(!behead) { damage /= 2; }   ·   NPC.as:451-453 if(behead) { damage *= 1.5; }
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: kills the undead half of blocker ⑤ by refuting its premise. There is no reflect mechanic and therefore no reflect probability to measure — planning a measurement pass for it would have been wasted work.

### `enemies-ai/combat-hud-drops-the-nameplate` — HELD [A1]

The enemy readout is mode-switched: in active combat every hostile shows only a bare thin HP bar with no name, no level and no numerals — the nameplate seen on the overworld is gone.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg — crops (560,300)→(1024,500) and (250,300)→(620,500), LANCZOS ×3`
- **Quote:** Visibly in the crops: dungeon brick interior under a full-screen red near-death vignette; HUD 16/20 green, 15/15 blue, "CANNOT CHANGE STANCE", "AUTO SLASH OFF". Five thin horizontal HP bars (four green, one dim tan at far right) float above five separate hostiles; NO hostile carries a name or level. The only text over a fighter is the gold "GUEST" over the player, mid-swing with a pickaxe as a bare-chested bandit lunges from the left. Two kasa-hatted archers with drawn longbows stand at the right.
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: the single ledger bullet flattens two distinct UI states. A recreation that shows names+levels during combat is wrong.

### `enemies-ai/creature-and-boss-roster` — HELD [A2]

The boss and creature roster is held with exact statlines and skill loadouts: Wolf Alpha lvl15/hp100, Ogre lvl80/hp40, Zombie lvl8/hp40 (×7) and lvl30/hp150, Guardian lvl10/hp30, elite spearmen Tadao lvl10/hp200 and Amaya lvl30/hp600, Mad Cultist (SorcererBoss) lvl23/hp800, Hiroshi lvl80/hp1000 — plus 96 <skills> blocks carrying 647 <skill> rows with ids 1000-1501 and mastery levels 1,2,3,5,10.

- **Cite:** `reference/extracted/npcdata.xml:1844, 2064, 2395, 3442, 3842, 4072, 4111, 3121 + skills at npcdata.xml:492 and :535`
- **Quote:** npcdata.xml:492 <skills><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill></skills>   ·   npcdata.xml:535 (Bandit Leader) <skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1006</id><lvl>1</lvl></skill></skills>   ·   npcdata.xml:4072 <id>800</id> <lvl>23</lvl> <hp>800</hp> <ai>35</ai>
- **Overturns:** "boss roster; projectile set (arrows arc, oni rocks, bandit hammer)"
- **Lane impact:** L0 enemies-ai: the roster is A2-held with numbers, not just names. Note also that 'bandit hammer' from the ledger's projectile set greps to zero — hammer/club appear nowhere in the 39 *Projectile.as classes.

### `enemies-ai/nameplate-level-4-bandit` — HELD [A1]

Roaming overworld enemies carry a red all-caps nameplate with a parenthesised level — "BANDIT (4)" — while the player carries a gold "GUEST"; the frame's level 4 disagrees with npcdata's authored lvl 10 for Bandit, and the frame wins, which routes that bandit through setLevel(4) and the ≤10 clamp to a real on-screen HP of 1.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg — crop (340,320)→(900,480), LANCZOS ×3`
- **Quote:** Visibly in the crop: two kasa-hatted hostiles walking across a reed field, each under a red all-caps label reading "BANDIT (4)" (the right-hand label is two overlapping copies for two stacked bandits); the player at x≈430 under a gold label "GUEST"; HUD readout TERRITORY (22,51) / SECTOR (1,2). Contrast npcdata.xml:273-280 <id>11</id> <lvl>10</lvl> <hp>15</hp>.
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai: confirms the Ready bullet and adds the colour rule (hostile red / player gold) the ledger omits. THE FRAME WINS over the npcdata statline on level, and that is what makes the 1-HP clamp bite.

### `enemies-ai/no-per-enemy-chi-or-speed` — HELD [A2]

Enemy Chi and SPD are not authored anywhere: npcdata.xml contains zero <chi> and zero <speed> tags, so XMLNpc's parse defaults every NPC to chi = 1 and speed = 1 (other defaults on the same path: ai→1, hp→1, attack→1, defense→0).

- **Cite:** `grep -c "<chi>\|<speed>" reference/extracted/npcdata.xml → 0; reference/decompiled/shs3_android/scripts/XMLNpc.as:150-182`
- **Quote:** if(xml.chi.toString() != "") { this.chi = xml.chi; } else { this.chi = 1; }  …  if(xml.speed.toString() != "") { this.speed = xml.speed; } else { this.speed = 1; }
- **Overturns:** "enemies-ai | 34 | full taxonomy + movesets, boss roster, projectile set"
- **Lane impact:** L0 enemies-ai: a positive answer, not a gap. Any recreation that gives enemies a Chi pool or a per-enemy speed stat is inventing a system the original does not have — this deletes work rather than adding it.

### `enemies-ai/no-squad-coordination` — HELD [A2]

There is no squad coordination anywhere: every NPC independently re-queries the nearest live target within the stage bounds ±10px, with no shared aggro table, no formation and no flanking assignment in NPCManager.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1360-1390`
- **Quote:** public static function getNearestEnemy(xpos:int, isEnemy:Boolean = false) : NPC { … var maxdist:int = 99999; … if(pos > -10 && pos < stageWidth + 10) { dist = Math.abs(xpos - pos); if(!enemy.isDead() && dist < maxdist && enemy.actionState != MCSActor.SKILL_UNDYING_STATE) { selectedEnemy = enemy; maxdist = dist; } }
- **Overturns:** "independent-aggro (no coordination — closed)"
- **Lane impact:** L0 enemies-ai: promotes a research-closed Ready bullet to an A2 cite. Corroborated by the seg-11 frame, where five hostiles converge from both sides with no formation.

### `enemies-ai/one-statline-six-movesets` — HELD [A2]

The authoring rule is one archetype × N AI classes: NPC ids 11-16 are identical statlines (name 5011 "Bandit", lvl 10, hp 15, attack 24, defense 20) differing in exactly one field, <ai> = 1,2,3,4,5,9 — knife / archer / katana / spear / shield / player-mirror.

- **Cite:** `reference/extracted/npcdata.xml:273-465`
- **Quote:** id 11 line 275-280: <name>5011</name> <lvl>10</lvl> <hp>15</hp> <ai>1</ai> <attack>24</attack> <defense>20</defense>  ·  id 12 line 315: <ai>2</ai>  ·  id 13 line 352: <ai>3</ai>  ·  id 14 line 389: <ai>4</ai>  ·  id 15 line 426: <ai>5</ai>  ·  id 16 line 463: <ai>9</ai>
- **Overturns:** "full taxonomy … with movesets"
- **Lane impact:** L0 enemies-ai: this is the real 'moveset' model and it is absent from the ledger entirely. It also means the roster is far cheaper to build than 495 rows suggests — 38 behaviours × a paperdoll/statline table.

### `enemies-ai/web-build-parity` — STILL_UNHELD [STILL_UNHELD]

Every behavioural constant cited above comes from the ANDROID v0.682 decompile; the web v0.717 payload decompile holds 652 classes and zero Enemy*/NPC* gameplay classes, so nothing on disk establishes that v0.717 kept these numbers.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:30 (version) + `ls reference/decompiled/shs3_payload/scripts | grep -ci "enemy\|npc"` → 0`
- **Quote:** StatsManager.as:30 — public static var clientVersion:Number = 0.682;   ·   shs3_payload: 652 files, NPC.as? no   ·   shs3_android_payload: 559 files, NPC.as? present (byte-identical to shs3_android/scripts/NPC.as)
- **Lane impact:** L0 enemies-ai: this is the dominant residual risk and the main reason the re-score is 78 rather than 90+. Do not stamp any AS3-sourced number CONTRACT until the web bytecode is recovered or a frame measurement corroborates that specific number. Label all ported values v0.682-ANDROID.

## itemdata — re-scored ?

Source sweep, not a system sweep — no re-score submitted. But for whoever re-scores items-equipment: 4 of its 5 blockers (①②③⑤ plus half of ④) are refuted below with A2 cites, and economy loses blockers ②+③. The only remaining items-equipment gap that is genuinely open is the affix prefix/suffix WORD lists (preSufArray) and loot/drop tables; the port itself (no src/config/items.ts) is now the binding constraint, not information. A 42 is not defensible after this; the honest floor is "everything but the affix wordlist is on disk."

### `itemdata/adjacent-speed-formulas` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Chasing <slashusage> into StatsManager surfaced the SPEED-to-slash-length (reach, in px) formula and the SPEED-to-cooldown formula, both of which the ledger lists as open blockers in other lanes — but the reach formula must be reconciled against the frames before anyone trusts it.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (getBaseSlashLengthVal) and :1854-1861 (getSkillCooldownModifierVal); frame counter-evidence in reference/frames/session11/stance-reach/`
- **Quote:** StatsManager.as:1915-1919 — 'internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }'. :1854-1861 — 'internal static function getSkillCooldownModifierVal(speed:int) : Number { if(speed > 300) { speed = 300; } return 1 - speed / 300 * 0.5; }'. Note the reach formula carries NO stance term.
- **Overturns:** "- **Combat numbers:** reach cap in **px** per stance; ... - **Skills:** ... the SPEED-stat→cooldown formula."
- **Lane impact:** L5 (COMBAT CORE) and L2 (SKILLS): cooldowns scale linearly to a 50% floor at SPEED 300, and slash length is 120px rising asymptotically toward 120+90+5*Dan. WARNING, and I am saying it out loud: the frames measure real strokes at 226-239px (filenames in reference/frames/session11/stance-reach/, e.g. A_t117.400_BALANCED_lvl1_stroke235px.png) and the code is per-character not per-stance — if the code and the frames disagree, THE FRAME WINS. I did not open those frames this pass, so the reconciliation is owed and this claim is PARTIAL until L5 does it.

### `itemdata/affix-count-per-rarity` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The per-rarity affix count, the per-slot allowed-stat pools and the forced first affix are all exact in ItemGenerator; only the prefix/suffix WORD lists remain unread.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:206-252 (getEnchantmentCount), :397-428 (pools), :432-449 (forced first affix), :833-871 (getModTier / prog1..prog5)`
- **Quote:** ItemGenerator.as:206-252 — 'if(isRareItem) { dice = this.rng.rand(11); if(dice <= 3) return 2; if(dice <= 6) return 3; if(dice <= 9) return 4; if(dice == 10) return 5; return 0; } dice = this.rng.rand(100); if(dice <= 84) return 0; if(dice <= 89) return 1; if(dice <= 93) return 2; if(dice <= 96) return 3; if(dice <= 98) return 4; return 5;' — normal items are 85% affix-free. :432-449 forces the first affix by slot: 'if(itemType == ARMOR) { attrib = DEFENSE; ... } else if(itemType == WEAPON) { attrib = ATTACK; ... } else if(itemType == SHOES) { attrib = SPEED; ... }'. :397-428 gives an explicit
- **Overturns:** "④ affix **suffix** pool + per-rarity affix count."
- **Lane impact:** L3: the per-rarity affix count half of blocker ④ is closed with exact dice tables; the suffix/prefix word lists (preSufArray) and the prog1..prog5 tier thresholds were NOT read this pass and stay open.

### `itemdata/art-is-only-for-sharing` — HELD [A2] ⚑ OVERTURNS LEDGER

All 146 explicit <art> rows point at a DIFFERENT item's id — <art> exists purely for art-sharing — so with the art=id default the icon manifest resolves for all 982 items with zero gaps.

- **Cite:** `reference/extracted/itemdata.xml:326 (first <art> row) and the 2131-2174 outfit block; count from docs/gauntlet/L0/index/itemdata.json (itemdata/item/art count 146)`
- **Quote:** itemdata.xml:326 — item 2121 'Red Packet' carries '<art>20041</art>'. Items 2131-2174 (Dark Assassin, Ichigo, Santa, Firefistace, Zaraki, Byakuya, Hitsugaya, Mayuri, Komamura Outfits...) all carry '<art>2130</art>', i.e. they reuse the Assassin Outfit's icon. Measured: of the 146 rows with <art>, 146 have art != id — not one is a redundant self-reference.
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3: the icon manifest is generatable in one pass (art = <art> or id) with no unresolved entries; the 146 sharers tell you which icons must be authored ONCE and reused, which is real art-budget information.

### `itemdata/condition-has-no-damage-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

There is no condition-to-damage multiplier anywhere in the engine: weapon damage is flat until the item breaks, at which point the weapon contributes nothing at all; the six condition tiers are display-only labels over remaining durability.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1863-1888 (getMinDamage / getDamageRange) + Item.as:1467-1496 (isBroken / getCondition) + Item.as:714-746 (getDesc)`
- **Quote:** StatsManager.as:1863-1888 — not broken: 'basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;' broken: 'basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1;' and getDamageRange returns 0. Item.as:1467 — 'public function isBroken() : Boolean { ... return this.uses >= itemXML.durability + this.getModifierBonus(83); }'. Item.as:1481 — 'var val:int = (maxDurability - this.uses) / maxDurability * 100;'. Item.as:714-746 maps that percent to strings only: uses==0 -> 639 'Unbreakable', uses==1 -> 392 'Condition: Well-Maintained', condition==
- **Overturns:** "② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L3: implement condition as a binary functional/broken gate plus a label, and delete the multiplier from the model. L5: TTK math must not carry a condition term. The ledger's own suspicion (the evidence was a level gap, not condition) is confirmed.

### `itemdata/frame-validates-the-payload` — HELD [A1] ⚑ OVERTURNS LEDGER

A 1080p frame of the PLAYER screen shows item numbers that match itemdata.xml exactly on three independent fields, which validates the extracted XML against the v0.717 video build and settles the starter-weapon damage the ledger lists as unknown.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1310,235)-(1780,320) upscaled 3x, and crop (1420,545)-(1780,600) upscaled 3x; cross-checked against reference/extracted/itemdata.xml:7907`
- **Quote:** VISIBLY IN THE 3x CROPS: 'DMG: 1 - 2  (EQ: 1 - 3)' / 'WEIGHT: 1' for the selected item BRANCH, and 'WEIGHT: 43 / 100'. itemdata.xml:7907 — '<id>13002</id><type>9</type><name>4041</name><baseprice>0</baseprice><minlvl>-4</minlvl><mindamage>1</mindamage><maxdamage>2</maxdamage><weight>1</weight>'; resolved_names.json 13002 = 'Branch'. The weapon rendered in the paperdoll is the Pickaxe, itemdata id 13022, mindamage 1 / maxdamage 3 = the '(EQ: 1 - 3)' comparison. StatsManager.as:1830-1832 — 'if(equipment[EQ_WEAPON].itemID == 0) { equipItem(EQ_WEAPON,new Item(13002,1)); }' makes 13002 the auto-equ
- **Overturns:** "- **Combat numbers:** reach cap in **px** per stance; crit ×1.3 vs ×3 final read; early-mob HP + starter weapon DMG + hits-to-kill; the Focus/crit **gating rule** (fill trigger/amount/consumption); AUTO SLASH cadence."
- **Lane impact:** L5 (COMBAT CORE): starter weapon DMG is 1-2 (Branch, id 13002), no longer an unknown feeding TTK work. L3: the frame is a byte-check target for the ported item table. Also retires the Stage-0b S0-3 Android-vs-web caveat for item numbers.

### `itemdata/repair-weapon-cost` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon cost the ledger says was never captured is two consumables sitting in itemdata with their coin prices and their exact repair amounts, both stocked by every shop by default.

- **Cite:** `reference/extracted/itemdata.xml:294-304 and :306-317 + reference/decompiled/shs3_android/scripts/InventoryUI.as:992 + XMLShopData.as:46`
- **Quote:** itemdata.xml:294-304 — '<id>2119</id><type>10</type><name>4141</name><baseprice>20</baseprice><weight>1</weight><desc>4142</desc><modifier><id>82</id><value>10</value></modifier>'; :306-317 — '<id>2120</id> ... <baseprice>40</baseprice> ... <modifier><id>82</id><value>25</value></modifier>'. Resolved: 2119 = 'Whet Stone' / 'Use this to improve the condition of your equipped weapon.'; 2120 = 'Sword Repair Kit' / '...significantly.'. InventoryUI.as:992 — 'else if(modid == 82) { StatsManager.repairEquippedWeapon(item.modifierXML[i].value); ... }'. XMLShopData.as:46 — 'var defaultItems:Array = [13
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10 (ECONOMY): repair is consumable-based — 20 coins restores 10 uses, 40 coins restores 25 uses — not an NPC service fee. Whether a separate smith 'repair service' also existed is unevidenced either way and stays open.

### `itemdata/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The sell-price formula is held, and it is NOT level-scaled: sell = (1 + modifierCount) x 10 if weight >= 10, else x 5, with everything below id 3000 selling for 1 — confirmed independently in the web v0.717 bundle as well as Android.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 + reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web v0.717) + ShopUI.as:58`
- **Quote:** Item.as:1582-1593 — 'public function getSellAmt() : int { if(this.itemID < 3000) { return 1; } if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5; }'. Web v0.717, §1t17s0§.as:1977-1988, same function obfuscated — 'if(this.§1t467s0§.§1t697s0§() < 3000) { return 1; } if(this.§1t545s0§() >= 10) { return (1 + this.§1t497s0§()) * 10; } return (1 + this.§1t497s0§()) * 5;'. ShopUI.as:58 — 'internal var sellPercentage:Number = 0.5'.
- **Overturns:** "9. **Sell price is NOT flat per item** — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L10 (PROGRESSION + ECONOMY): closes items blocker ③ and economy blocker ②, and corrects §3 correction 9 — the observed 5c vs 25c is 0 modifiers vs 4 modifiers ((1+4)x5), there is no level term. The level term lives on the BUY side instead: XMLShopItem.as:68,86 'this.value = itemData.gvalue + this.item.getLevel() * 100;'.

### `itemdata/sprite-compositing-contract` — HELD [A2] ⚑ OVERTURNS LEDGER

The sprite-compositing contract and the item icon manifest are both fully held: the symbol class name is literally partType + art, art defaults to the item id, and the z-ordered part list is 27 entries — with the web payload itself shipping the fallback symbols under exactly that naming scheme.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:581-607 (getMCSComponent) + MCSCharacter.as:10-62 (PART_* z-order) + XMLItem.as:110-117 + the symbol classes in reference/decompiled/shs3_payload/scripts/ (torso4000.as, calf11000.as, hat7000.as, ...)`
- **Quote:** MCSCharacter.as:581-607 — 'internal function getMCSComponent(partType:String, id:int) : MovieClip { var xmlItem:XMLItem = QuestEngine.getItemData(id); if(xmlItem == null) { art = id; } else { art = xmlItem.art; } ... if(getDefinitionByName(partType + art.toString())) { ClassDefinition = Class(getDefinitionByName(partType + art.toString())); } else { ClassDefinition = Class(getDefinitionByName(partType + "0")); }'. XMLItem.as:110-117 — 'if(xml.art.toString() != "") { this.art = xml.art; } else { this.art = this.id; }'. MCSCharacter.as:10-62 lists 27 z-ordered parts: l_hand, l_uparm, l_lowarm, w
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 + L6 (ART + ANIM): one ARMOR item paints 5 parts (torso, stomach, pelvic, uparm, lowarm), PANTS paints 3 (crotch, thigh, calf), SHOES 2 (foot, foottop), the rest 1. This is the from-scratch-art blocker dissolved: the layer order and per-slot decomposition are both explicit.

### `itemdata/stat-vs-level-is-a-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'item stat-magnitude vs level curve' is not a missing formula — it is fully tabulated on disk from level -4 to level 79, for both weapon damage and armour defence.

- **Cite:** `reference/extracted/itemdata.xml — 158 rows with <mindamage>+<maxdamage>, 155 rows with <minlvl> spanning -4..79 (index docs/gauntlet/L0/index/itemdata.json numeric_range), endpoints at :7907 and item 13225`
- **Quote:** Low end, itemdata.xml:7907 — '<id>13002</id> ... <minlvl>-4</minlvl><mindamage>1</mindamage><maxdamage>2</maxdamage>'. High end, item 13225 'Steel Sabre' — minlvl 79, mindamage 81, maxdamage 90. Armour side: item 4006 'Medium Armor' minlvl 10 / defense 15; item 4050 'Zaku Samurai Armor' minlvl 30 / defense 35 (the maximum). 371 rows carry <defense>, domain 0-35.
- **Overturns:** "- **Blockers:** ① item stat-magnitude **vs level** curve."
- **Lane impact:** L3: port the table, do not fit a curve. L10 (PROGRESSION + ECONOMY): the item ladder to L79 exists even though the L11-80 XP curve does not, so the two must not be conflated as one gap.

### `itemdata/baseprice-dot-data-bug` — HELD [A2]

itemdata.xml contains a genuine authoring bug — one item's baseprice is a bare '.' — which the parser silently turns into a free item; a 1:1 recreation has to decide to reproduce or deviate, not silently fix.

- **Cite:** `reference/extracted/itemdata.xml item 11037 'Santa Pants' + docs/gauntlet/L0/index/itemdata.json (baseprice: count 550, numeric_count 549, sample_values includes ".") + XMLItem.as:86-93`
- **Quote:** The index records baseprice as 550 rows of which only 549 are numeric, with '.' listed among sample_values; the single offender is item 11037 'Santa Pants', '<baseprice>.</baseprice>'. XMLItem.as:86-93 tests only for the empty string — 'if(xml.baseprice.toString() != "") { this.gvalue = xml.baseprice; } else { this.gvalue = 1; }' — so gvalue becomes int(".") = 0 and the item is free.
- **Lane impact:** L3: the byte-exact port gate will trip on this row unless it is expected. Log it in DIVERGENCES either way.

### `itemdata/consumable-effect-table` — HELD [A2]

Every consumable's effect is exactly decodable: modifier ids 0-16 are the stat enum, and ids 25/78/79/82/84/90/97/98/99/101/102/103 each dispatch to a named engine action in InventoryUI.onUseItem.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:219-298 (determineAttributes) + StatsManager.as:170-202 (STAT_* enum) + InventoryUI.as:901-1010 (inside onUseItem at :854) + docs/gauntlet/L0/index/strings.json`
- **Quote:** Resolved stat enum (XMLItem case -> LangManager string): 0 HP, 1 Max HP, 2 HP Regen, 3 Chi, 4 Max Chi, 5 Chi Regen, 6 Attack, 7 Defense, 8 Speed, 9 XP, 10 'Level ', 11 Coins, 12 Gold, 13 AP, 14 Max AP, 15 Duel Tokens, 16 Max Duel Tokens. Action branches, InventoryUI.as:901-1010: 9 -> changeXP; 25 -> rebirth UI; 78 -> unAssignStatPoints; 79 -> unAssignSkillPoints; 82 -> repairEquippedWeapon(value); 84 -> addRandomLootItem; 90 -> LEAVECLAN UI; 97 -> changeSex; 98 -> full wipe ('StatsManager.unequipAll(); StatsManager.inventory = new Vector.<Item>(); StatsManager.setStat(11,1000);' then grants 22
- **Lane impact:** L3 for the items themselves; L10 for the rebirth scroll trigger; L11 for Writ of Release / clan deeds; L9 (WORLD) gets free node ids out of modifier 102 (e.g. 8382465 as the dojo/home teleport target, 9902095 for the wedding venue).

### `itemdata/five-stances-and-stance-locked-weapons` — PARTIAL [A2]

The engine has FIVE stances, not three, and 53 weapons in itemdata are stance-locked — though what the restriction values 4 and 6 encode is not established.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:27-35 + reference/extracted/itemdata.xml (53 <stancerestriction> rows, first at :8737) + XMLItem.as:327`
- **Quote:** MCSPlayer.as:27-35 — 'LIGHT_STANCE:int = 0; BALANCED_STANCE:int = 1; HEAVY_STANCE:int = 2; DUAL_STANCE:int = 3; REVERSED_STANCE:int = 4;'. itemdata.xml carries <stancerestriction> on 53 type-9 rows, values 4 (7 rows, all weight 15) and 6 (46 rows). XMLItem.as:327 only prints it — 'this.desc += LangManager.getString(125) + ": " + this.stancerestriction;' (string 125 = 'Stance Restriction'); no enforcement site was found in the Android bundle this pass.
- **Lane impact:** L5 + L3: the project's STANCE_TABLE models 3 stances; the engine enumerates 5 (dual and reversed also appear as animation sets in bindata per Stage-0 finding S0-1). 53 weapons are slot-locked to a stance subset. STILL UNHELD: the 4/6 encoding — a bitmask reading (4=heavy, 6=balanced+heavy) is a hypothesis with no cite and must not be shipped as fact.

### `itemdata/gold-catalogue` — HELD [A2]

The entire premium (Gold) catalogue and its exact price points are held — 303 items priced in Gold, all with baseprice 0, topping out at a 100-Gold Wedding Package.

- **Cite:** `reference/extracted/itemdata.xml — 304 <heavenlyprice> rows (docs/gauntlet/L0/index/itemdata.json, numeric_range 0-100), first at :32; measured histogram over the 303 non-zero rows`
- **Quote:** Measured Gold-price histogram: 3G x191, 1G x59, 12G x39, 2G x6, 5G x5, 8G x1, 25G x1, 100G x1. Top end: item 2175 'Paradise Gift Pack' 25G; item 2142 'Wedding Package' 100G. The 12G tier is the outfit line — 2169 'Demon Huntress Outfit', 2170 'Kanji Outfit', 2171 'Swords of the Mist', 2172 'Chronos Outfit', 2173 'Heavenly Outfit', 2174 'Paradise Outfit'. Every one of these rows also carries '<baseprice>0</baseprice>' — Gold-only, not buyable with coins.
- **Overturns:** "- **The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L10 + L11: §6 is right that the FAUCET is dead, but the SINK side is now fully recovered — an authored offline gold faucet can be balanced against a real 303-item price list instead of guesswork. Flag it as an upgrade to §6's line rather than a refutation.

### `itemdata/modifier-103-grants-items` — HELD [A2]

Modifier id 103 means 'grants item X' — 223 such grants across 42 outfit bundles — and its values independently prove the id-prefix-to-slot map with no code needed.

- **Cite:** `reference/extracted/itemdata.xml item 2130 'Assassin Outfit' (five <modifier><id>103</id> rows) + reference/decompiled/shs3_android/scripts/InventoryUI.as:1005`
- **Quote:** Item 2130 'Assassin Outfit' carries five id-103 modifiers with values 7034, 4065, 5008, 11036, 12018 — hat, armor, gloves, pants, shoes by the id-range map. InventoryUI.as:1005 — 'else if(modid == 103) { OverworldHUD.instance.lootDialog.addRareLootItem(item.modifierXML[i].value,StatsManager.getLevel(),1,true); }'. Measured totals: 223 id-103 grants; id 104 on 42 rows and id 105 on 40 rows are valueless flags on the same bundles; id 106 on 33 rows carries further item ids (e.g. 2132 'Ichigo Outfit' -> 6023, a hair id).
- **Lane impact:** L3 + L10: the cosmetic store's contents are enumerable per piece (Assassin, Dark Assassin, Ichigo, Santa, Zaraki, Byakuya, Hitsugaya, Mayuri, Komamura, Firefistace, Kanji, Chronos, Heavenly, Paradise, Demon Huntress, Wedding...). Note these are anime-derived names — a licensing flag for L11's DIVERGENCES, since the owner grant covers Lut's art, not third-party IP.

### `itemdata/no-items-config-still-true` — HELD [A3]

The ledger's one honest items-equipment surface note still holds on 2026-08-15 — there is no items config in the build — and after everything above it is now the only binding constraint on a 1:1 item system.

- **Cite:** `filesystem byte-check (not a vitest): `ls src/config/` run 2026-08-15 in /Users/kheshav/kheshav-code/SSHD 1-1`
- **Quote:** Pasted output: 'CLAUDE.md ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts' — there is no items.ts.
- **Overturns:** "- **Surface:** measured weight table + named-item blocks exist in segment notes but **no items config file exists yet** — entirely un-ported."
- **Lane impact:** L3: the lane is now a PORT job, not a research job. Information is no longer the bottleneck for items-equipment; 982 rows plus the compositing contract are sitting on disk unported.

### `itemdata/paperdoll-9-boxes-13-indices` — PARTIAL [A1]

The paperdoll is 9 CLICKABLE BOXES over a 13-entry equipment array — the four extra slots (HAIR, HEAD, NECK, SCABBARD) contribute no stats and get no box, they render on the body; and two of the nine boxes are ring/accessory slots that the named AS3 enum does not cover.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1045) at 1x (each slot box is ~150px, legible without upscale) + reference/decompiled/shs3_android/scripts/StatsManager.as findBonusStat`
- **Quote:** VISIBLY IN THE CROP: exactly nine slot boxes — row1 hat (filled straw hat) / mask (empty outline); row2 armor (filled grey robe) / gloves (empty); row3 pants (filled white hakama) / weapon (filled pickaxe); row4 ring (empty) / shoes (filled sandals) / ring (empty). The character between them wears hair, a face and a back-slung scabbard, none of which has a box. Code side, StatsManager.findBonusStat: 'for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && ...' — the array is 13 long though only indices 0-10 are named, and 13 - 4 skipped = 9, exact
- **Overturns:** "- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; ..."
- **Lane impact:** L3: the lane's done-criterion says '9-slot compositing contract' — correct on boxes, but a dressed fighter needs 13 equipment indices of which 4 are body-only. L8 (UI): the inventory screen must draw 9 boxes with two accessory slots.

### `itemdata/slashusage-is-a-reload-economy` — HELD [A2]

<slashusage> is a per-weapon RELOAD cost drawn from a bar the ledger models nowhere: stance multiplies it (light x0.5, balanced/reversed x1, heavy/dual x1.5), the bar's max is 48 + SPEED*6, its floor is 24, and the weapon's cost is a pure step function of weight (48/72/96 at weight 5/10/15).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3240-3263 (deductReloadBar) and :3265 (bonusReload) + StatsManager.as:1839-1842 (getBaseReload) and :1921-1930 (getSlashUsage) + XMLItem.as:152-159 + measured cross-tab over the 177 type-9 rows of reference/extracted/itemdata.xml`
- **Quote:** MCSPlayer.as:3240-3263 — 'switch(this.stance) { case LIGHT_STANCE: this.reload -= this.slashUsage / 2; break; case BALANCED_STANCE: case REVERSED_STANCE: this.reload -= this.slashUsage; break; case HEAVY_STANCE: case DUAL_STANCE: this.reload -= this.slashUsage * 1.5; }'. :3265 — 'this.reload += 6; ... updateReload((this.reload - 24) / (this.maxreload - 24));'. StatsManager.as:1839-1842 — 'internal static function getBaseReload() : int { return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6; }'. XMLItem.as:152-159 defaults slashusage to 48. Measured cross-tab, all 177 type-9 
- **Lane impact:** L5 (COMBAT CORE): an entire third combat resource — a reload/stamina bar gating slash cadence, priced per weapon and per stance — appears in none of the 12 systems' Ready or Blocker lists. It also gives SPEED a second consumer and is almost certainly what 'AUTO SLASH cadence' is really about. L8: the bar is normalised (reload-24)/(maxreload-24) for the HUD.

### `itemdata/type-is-the-slot-enum` — HELD [A2]

The 12 <type> codes in itemdata.xml are the equipment-slot enum verbatim, and a MISSING <type> is not missing data — it parses to 0 = ARMOR, which is why 153 torso items look typeless.

- **Cite:** `reference/extracted/itemdata.xml:2608 (item 4000, no <type>) + reference/decompiled/shs3_android/scripts/XMLItem.as:70-77 + reference/decompiled/shs3_android/scripts/StatsManager.as:262-282`
- **Quote:** XMLItem.as:70-77 — 'if(xml.type.toString() != "") { this.type = xml.type; } else { this.type = 0; }'   StatsManager.as:262-282 — 'EQ_ARMOR:int = 0; EQ_GLOVES:int = 1; EQ_HAIR:int = 2; EQ_HAT:int = 3; EQ_HEAD:int = 4; EQ_MASK:int = 5; EQ_NECK:int = 6; EQ_PANTS:int = 7; EQ_SHOES:int = 8; EQ_WEAPON:int = 9; EQ_SCABBARD:int = 10;'   Measured partition of all 982 rows: type absent=ARMOR 153 (ids 4000-7075), 1=GLOVES 35 (5000-5034), 2=HAIR 73 (6000-6520), 3=HAT 97 (7000-7097), 4=HEAD 38 (8000-8509), 5=MASK 60 (9000-9059), 6=NECK 14 (10000-10013), 7=PANTS 93 (11000-11514), 8=SHOES 55 (12000-12054), 9
- **Lane impact:** L3 (ITEMS + PAPERDOLL): the id->slot map is the first thing the generator script needs; without it the 153 typeless rows would be dropped or mis-slotted. Also L4 (npcdata paperdolls use the same id ranges).

### `itemdata/web-android-schema-parity` — HELD [A2]

Item-schema parity between the web v0.717 payload and the Android v0.682 build is proven field-by-field, so itemdata-derived claims can be ported without the Stage-0b S0-3 build caveat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:6-54 and :68-202 (web v0.717 item parser) vs reference/decompiled/shs3_android/scripts/XMLItem.as:6-178`
- **Quote:** The web class declares the identical field set — 'id, type, unique, art, animated, levelrestriction, mindamage, maxdamage, slashusage, stancerestriction, defense, weight, durability, nogive, nodrop, pcolor, scolor, imageurl, modifierXML' — and the identical defaults: type->0 (:68-75), unique->0 (:76-83), baseprice->1 (:84-91), heavenlyprice->0 (:92-99), art->id (:108-115, 'this.art = this.id;'), slashusage->48 (:164-171), stancerestriction->0 (:172-178), uses->durability (:198-202).
- **Lane impact:** All lanes reading itemdata: combined with the frame match, the Android decompile may be used as the readable Rosetta stone for the web payload's obfuscated item code. Parity is established for the ITEM schema only — it says nothing about UI copy or combat tuning elsewhere.

## items-equipment — re-scored 78

42 -> 78. All five listed blockers resolve against the payload: (1) stat-magnitude-vs-level is held BOTH as a 158-row static weapon table in itemdata.xml (minlvl -4..79, mindamage 1..81, maxdamage 2..108) AND as the executable roll formula in ItemGenerator.getMaxTier + prog1..prog5; (2) condition->DMG multiplier is dissolved, not closed - no multiplier exists anywhere, getCondition() is display-only and damage is a binary broken/not-broken cliff in StatsManager.getMinDamage/getDamageRange; (3) sell price is an exact formula, confirmed in BOTH the Android v0.682 and the web v0.717 builds; (4) the suffix pool the ledger calls a blocker sits verbatim next to the prefix pool (104 + 104 strings) with both affix-count distributions; (5) the sprite-compositing contract is a 27-entry z-ordered PART_* enum plus a `partType + <art>` symbol-name contract, cross-confirmed by the web payload exporting exactly the named default part classes, and the "icon manifest" turns out not to exist as a separate thing (the icon IS the paperdoll part stack at published offsets). Held back from >78 by two genuine remaining gaps: the per-item vector art payload for the full 982-row roster (either obfuscated in the web SWF or inside the encrypted CWS resource blobs per S0-5), and one UI-slot mapping the frame cannot disambiguate. Two ledger "Ready" bullets are additionally WRONG and need correcting rather than re-scoring (defense min-floor, weight cap).

### `items-equipment/affix-suffix-pool-and-counts` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 4 is fully held: 104 verbatim prefixes and 104 verbatim suffixes (13 distinct pools x 8 tiers) plus both affix-count distributions (normal d100 and rare d11) and the legendary -1 rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127, :128-148, :206-252, :371-374`
- **Quote:** var attack_suf:Array = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];  /  num = Math.floor(i / 10);  /  dice = this.rng.rand(100); if(dice <= 84) { return 0; } if(dice <= 89) { return 1; } if(dice <= 93) { return 2; } if(dice <= 96) { return 3; } if(dice <= 98) { return 4; } return 5;  /  dice = this.rng.rand(11); if(dice <= 3) { return 2; } if(dice <= 6) { return 3; } if(dice <= 9) { return 4; } if(dice == 10) { return 5; } return 0;
- **Overturns:** "④ affix **suffix** pool + per-rarity affix count."
- **Lane impact:** L4/L7 (economy + loot) — the whole procedural item-naming and enchant-count system is now copyable verbatim, including the shipped bug where the four elemental-DEF channels reuse the wrong prefix/suffix pools (ItemGenerator.as:142-145).

### `items-equipment/condition-has-no-damage-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 2 is dissolved, not closed: there is NO condition->damage multiplier anywhere — getCondition() is called only by getDesc(), and damage is a binary broken/not-broken cliff (broken weapon = ATK+bonus+1 with damage range 0).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1481-1496 and :714 (only non-definition call site); StatsManager.as:1863-1903`
- **Quote:** var val:int = (maxDurability - this.uses) / maxDurability * 100;  /  if(itemdata == null || equipment[EQ_WEAPON].isBroken()) { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1; } else { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage; }  /  getDamageRange(): if(equipment[EQ_WEAPON].itemID == 0 || equipment[EQ_WEAPON].isBroken()) { return 0; } return itemdata.maxdamage - itemdata.mindamage;
- **Overturns:** "② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L1/L2 (combat core + damage) — kills a phantom mechanic; a 99%-worn sword hits identically to a pristine one, so no wear curve should be implemented.

### `items-equipment/defense-min-floor-is-wrong` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's Ready bullet 'defense min-floor (EnemyLevel/4)' is wrong in both variable and shape: the real code is a four-band floor on the PLAYER's post-defense hit keyed to playerLVL with divisors 1 / 8 / 6 / 4, and it lives in boss auto-scaling, not the generic defense pipeline.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:107-123`
- **Quote:** playerhit = playerATK - defense; if(playerLVL <= 10 && playerhit < 1) { playerhit = 1; } else if(playerLVL <= 20 && playerhit < playerLVL / 8) { playerhit = playerLVL / 8; } else if(playerLVL <= 30 && playerhit < playerLVL / 6) { playerhit = playerLVL / 6; } else if(playerhit < playerLVL / 4) { playerhit = playerLVL / 4; }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) and L3 (enemy AI) — this is a boss-scaling floor, not an item/defense rule; implementing 'EnemyLevel/4' as written produces different numbers at every level band below 30.

### `items-equipment/item-save-format-held` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The item and equipment serialization formats are on disk, which partially overturns §6's claim that there is 'nothing to copy' for the save format — Item.parse reads "<id>,<qty>,<modid>@<val>#..." with five reserved modifier IDs, and equipment is a 12-field pipe string.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:6-16 and :47-104; MCSCharacter.as:348`
- **Quote:** public static var PCOLORMODID:int = 80; public static var SCOLORMODID:int = 81; public static var USESMODID:int = 82; public static var NAMEMODID:int = 89; public static var CREATORMODID:int = 125;  /  var strArray:Array = str.split(","); var item:Item = new Item(int(strArray[0]),int(strArray[1])); ... modArray = strArray[2].split("#"); ... modvalArray = modArray[q].split("@");  /  this.mcsString = armorid + armorColor + "|" + glovesid + "|" + hairid + "|" + hatid + hatColor + "|" + headid + "|" + maskid + maskColor + "|" + neckid + "|" + pantsid + pantsColor + "|" + shoesid + "|" + weaponid +
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 (persistence/save) — the §6 line stands for server topology but is wrong for the item/equipment schema; the wire format is copyable byte-for-byte. Marked PARTIAL because only the item/equipment slice of §6's claim is overturned.

### `items-equipment/no-separate-icon-manifest` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'item icon manifest' half of blocker 5 is a category error: the inventory icon is composed from the SAME MCS part symbols as the paperdoll, at hard-coded sub-offsets, with ArmorDummyIcon as the miss case — there is no separate icon art set to recover.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:324-349`
- **Quote:** public function setArmor(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("stomach",id); if(this.displayItem == null) { this.displayItem = new ArmorDummyIcon(); addChild(this.displayItem); } else { addChild(this.displayItem); this.displayItem.x = -0.65; this.displayItem.y = 5.9; this.displayItem1 = this.getMCSComponent("pelvic",id); addChild(this.displayItem1); this.displayItem1.x = -0.35; this.displayItem1.y = 10; this.displayItem2 = this.getMCSComponent("torso",id); addChild(this.displayItem2); this.displayItem2.y = -2; this.displayItem3 = this.getMCSComponent("uparm",
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 — one art pipeline, not two; icon offsets are published numbers, so no icon-authoring pass is needed.

### `items-equipment/paperdoll-is-13-slots-not-9` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The frame shows exactly 9 paperdoll boxes so the ledger's UI claim is right, but the equipment MODEL is a Vector.<Item>(13) with 13 named EQ_ constants of which 11 are passed to the renderer — a builder coding '9 slots' from the ledger loses hair, head and scabbard. FRAME AND DOC DO NOT DISAGREE HERE; the doc is simply describing the UI and silently omitting the model.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1040) upscaled x2 LANCZOS — 9 boxes: hat(filled) mask(empty) armor(filled) gloves(empty) pants(filled) weapon/pickaxe(filled) ring-left(empty) shoes(filled) ring-right(empty); corroborated by A2 reference/decompiled/shs3_android/scripts/StatsManager.as:108, :262-286, :724-738, :1765`
- **Quote:** Visible in the crop: a 'GUEST' fighter surrounded by exactly nine slot boxes — straw hat, oni mask outline, grey haori, gauntlet outlines, white hakama, pickaxe, ring outline, sandals, ring outline. Code side: public static var equipment:Vector.<Item> = new Vector.<Item>(13); EQ_ARMOR 0 · EQ_GLOVES 1 · EQ_HAIR 2 · EQ_HAT 3 · EQ_HEAD 4 · EQ_MASK 5 · EQ_NECK 6 · EQ_PANTS 7 · EQ_SHOES 8 · EQ_WEAPON 9 · EQ_SCABBARD 10 · EQ_ACCESSORY1 11 · EQ_ACCESSORY2 12; player.initMCS(equipment[EQ_ARMOR],equipment[EQ_GLOVES],equipment[EQ_HAIR],equipment[EQ_HAT],equipment[EQ_HEAD],equipment[EQ_MASK],equipment[EQ
- **Overturns:** "**Ready:** 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the bullet must read '9 UI boxes over a 13-slot equipment model, 11 of which render'. PARTIAL because the 9 is correct for the UI.

### `items-equipment/sell-price-corrects-section3-item9` — HELD [A2] ⚑ OVERTURNS LEDGER

The same formula corrects §3 correction #9: sell price scales with MODIFIER COUNT and a single weight>=10 step — it does NOT scale with level at all (5c = 0 mods weight<10; 25c = 4 mods weight<10).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593`
- **Quote:** if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5;
- **Overturns:** "**Sell price is NOT flat per item** — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L4 (economy) — a builder encoding a level term implements a different curve; the observed 5c/25c pair is fully explained by modifier count alone.

### `items-equipment/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 3 (sell-price formula) is held exactly and in BOTH builds: sell = 1 for id<3000, else (1 + modifierCount) * 10 when weight>=10, else (1 + modifierCount) * 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
- **Quote:** public function getSellAmt() : int { if(this.itemID < 3000) { return 1; } if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5; }
- **Overturns:** "③ sell-price formula."
- **Lane impact:** L4 (economy) + items — closes the shared economy/items sell-price gap with a two-build-confirmed formula; no INFERRED seed needed.

### `items-equipment/soul-infusion-is-code` — HELD [A2] ⚑ OVERTURNS LEDGER

Soul-infusion / stat-transfer is exact code, not a patch-note inference: the gate is floor(id/1000) equality, modifiers copy wholesale from the stats item, weapons get the damage delta as modifier id 6 (Attack), durability follows the stats item and colour follows the design item.

- **Cite:** `reference/decompiled/shs3_android/scripts/CraftingUI.as:494-525`
- **Quote:** var designType:int = Math.floor(this.designSlot.itemID / 1000); var statsType:int = Math.floor(this.statsSlot.itemID / 1000); if(designType != statsType) { this.noCombine(LangManager.getString(698)); return; } ... combinedItem.copyModifiers(this.statsSlot.getItem().modifiers); if(designType == 13) { ... combinedItem.addModifier(6,statsMinDamage - designMinDamage); ... combinedItem.uses = this.statsSlot.getItem().uses; } combinedItem.setPrimaryColor(this.designSlot.getPrimaryColor());
- **Overturns:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — upgrades a patch-note paraphrase to executable rules; the ledger's Ready bullet understates what is held.

### `items-equipment/sprite-compositing-contract-held` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 5 is dead: MCSCharacter declares 27 named part indices whose index IS the addChild z-order, one equipment slot drives many parts (armor=7, pants=5), and the symbol-lookup contract is class name = partType + <art> with a partType+"0" fallback.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :141-146, :581-607, :915-924; cross-confirmed by reference/decompiled/shs3_payload/scripts/torso4000.as, stomach4000.as, uparm4000.as, lowarm4000.as, pelvic4000.as, crotch11000.as, thigh11000.as, calf11000.as, foot12000.as, hand5000.as, hair6000.as, hat7000.as, head8000.as, mask9000.as, neck10000.as, weapon13000.as, prop13000.as`
- **Quote:** public static var PART_l_hand:int = 0; ... PART_weapon:int = 3; ... PART_torso:int = 15; ... PART_r_lowarm:int = 20;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  if(getDefinitionByName(partType + art.toString())) ClassDefinition = Class(getDefinitionByName(partType + art.toString())); else ClassDefinition = Class(getDefinitionByName(partType + "0"));
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art/animation) — removes the named from-scratch-art blocker for equipment rendering; the z-order table and the 11 naked-default part IDs (head 8000, mask 9000, hair 6001/6000, hat 7000, neck 10000, armor 4000, shoes 12000, pants 11000, gloves 5000, weapon 13000, prop 13000) are directly codeable.

### `items-equipment/stat-vs-level-curve` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 1 is held twice over: a complete 158-row static weapon ladder in itemdata.xml (minlvl -4..79) AND the generated-affix roll formula tier = clamp(nodelvl+1, 0, 79) with five progression arrays and a levelrestriction subtraction on the item's signature stat.

- **Cite:** `reference/extracted/itemdata.xml:7906-7915 and :9925-9937; reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183, :321-347, :465-490`
- **Quote:** <item><id>13002</id><type>9</type><name>4041</name><baseprice>0</baseprice><minlvl>-4</minlvl><mindamage>1</mindamage><maxdamage>2</maxdamage><weight>1</weight></item>  ...  <item><id>13225</id><type>9</type><name>4161</name><minlvl>79</minlvl><mindamage>81</mindamage><maxdamage>90</maxdamage><slashusage>72</slashusage><stancerestriction>6</stancerestriction><weight>10</weight><art>13205</art><uses>60</uses></item>  /  var tier:int = nodelvl + 1; if(tier < 0) tier = 0; else if(tier > MAXINDEX) tier = MAXINDEX; if(getHighestTier) { tier = this.rng.rand(4) + tier - 3; ... } tier = this.rng.rand(
- **Overturns:** "① item stat-magnitude **vs level** curve."
- **Lane impact:** L4/L7 — no extrapolation needed for the L-4..L79 weapon ladder; the per-tier affix magnitudes (prog1 attack/defense, prog2 maxhp/maxchi, prog3 elemental+regen+crit, prog4 speed, prog5) are exact, including the +10 spike at index 79.

### `items-equipment/weight-cap-is-a-base-not-a-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

'Weight cap 100' is the guest BASE, not a constant: carrying capacity is 100 + stat1009*20, and bank storage is a separate upgradeable cap of 100 + DAN*10 + PAIDSTORAGE*10.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2298-2301 and BankUI.as:264; A1 corroboration reference/frames/s21_weapon/t708.0.png crop (1400,540)-(1780,600) upscaled x4 reads "WEIGHT: 43 / 100"`
- **Quote:** public static function getCarryingWeight() : int { return 100 + getStat(1009) * 20; }  /  this.storageMaxWeight = 100 + StatsManager.getPlayerStats(StatsManager.STAT_DAN) * 10 + StatsManager.getPlayerStats(StatsManager.STAT_PAIDSTORAGE) * 10;
- **Overturns:** "weight cap 100"
- **Lane impact:** L4 (economy) + L5 (UI/HUD) — two distinct upgradeable caps where the ledger records one constant; the frame's 100 is the stat1009=0 case.

### `items-equipment/condition-tier-thresholds` — HELD [A2]

The condition ladder is 7 named states with exact thresholds (uses==0, uses==1, ==0, <25, <50, <75, else), names resolved via the S0-3 string table, and the 25/50/75 ladder is present in the web v0.717 build too.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:712-746 + docs/gauntlet/L0/index/strings.json ids 387-392,639; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1011,1015,1019`
- **Quote:** if(this.uses == 0) { conditionStr = LangManager.getString(639); } else if(this.uses == 1) { conditionStr = LangManager.getString(392); } else if(condition == 0) { conditionStr = "<font color=\"#FF0000\">" + LangManager.getString(387) + "</font>"; } else if(condition < 25) { ...388 } else if(condition < 50) { ...389 } else if(condition < 75) { ...390 } else { ...391 }   [639="Unbreakable" 392="Condition: Well-Maintained" 387="Condition: Broken" 388="Condition: Poor" 389="Condition: Used" 390="Condition: Usable" 391="Condition: Good"]
- **Lane impact:** L5 (UI/HUD) + items — the ledger listed only 'condition tier names' as Ready; the numeric thresholds and the red-wrap on Broken are now exact.

### `items-equipment/eq-comparison-frame-payload-identity` — HELD [A1]

The (EQ:n) comparison UX is confirmed to the hex AND the frame's item resolves exactly to a payload row: the frame's BRANCH / DMG 1-2 / WEIGHT 1 is itemdata.xml id 13002 name 4041 -> strings.json "Branch", mindamage 1 maxdamage 2 weight 1, with the red 2 explained by compareValue's a<b branch.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4; matched to reference/extracted/itemdata.xml:7906-7915 and docs/gauntlet/L0/index/strings.json["4041"]; formula at reference/decompiled/shs3_android/scripts/Item.as:759-770`
- **Quote:** Visibly in the crop: "DMG: 1 - 2 (EQ: 1 - 3)" with the 2 rendered red, and "WEIGHT: 1", under the item name "BRANCH" and the label "LEVEL 1". Code: internal function compareValue(a:int, b:int) : String { if(a > b) { output = "<font color=\"#00A606\">" + String(a) + "</font>"; } else if(a < b) { output = "<font color=\"#FF0000\">" + String(a) + "</font>"; }
- **Lane impact:** L5 (UI/HUD) — supplies the two comparison hexes (#00A606 green / #FF0000 red, both present in the web build) and is the cleanest frame-to-payload identity check in this system: an on-screen tooltip reproduced exactly by an XML row.

### `items-equipment/modifier-id-stat-table` — HELD [A2]

The modifier-ID -> stat-name table is fully resolved (17 stat channels 0-16 plus a Set band 101-1999 and six reserved non-stat IDs), using the S0-3 string table.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 + docs/gauntlet/L0/index/strings.json ids 59,63,64,102,108-125`
- **Quote:** case 0: tempString += LangManager.getString(110); ... case 16: tempString += LangManager.getString(122); ... default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; }   [110=HP 111=Max HP 112=HP Regen 113=Chi 114=Max Chi 115=Chi Regen 116=Attack 117=Defense 118=Speed 119=XP 120="Level " 63=Coins 64=Gold 102=AP 121=Max AP 59=Duel Tokens 122=Max Duel Tokens 123=Set 124=Level Required 125=Stance Restriction]
- **Lane impact:** L4/L7 — the 412 <modifier> rows in itemdata.xml (34 distinct IDs) become readable stat grants instead of opaque numbers; also names the reserved IDs 80/81/82/83/89/125 that are colour/uses/durability-bonus/name/creator rather than stats.

### `items-equipment/per-item-art-payload-unknown` — STILL_UNHELD [STILL_UNHELD]

Whether the vector symbols for the full 982-row item roster exist in the web SWF under obfuscated names or only inside the encrypted CWS-prefixed Android resource blobs is not established — the naming CONTRACT is held, the ART PAYLOAD is not.

- **Lane impact:** L6 (art) — the residual real blocker for this system. Lead (not an artifact): getMCSComponent's ResourceManager branch fires when StatsManager.useExternalResource is true, and S0-5 lists 115_Mobile_SHS3Resource and 124_Mobile_ImageResource as held-but-encrypted; neither was opened, so no recovery claim is made.

### `items-equipment/purple-border-is-unique-not-rarity` — HELD [A2]

The purple item border visible in the frame is the UNIQUE flag, not a rarity tier — the game's own tip string says so verbatim.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:572; visual corroboration reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2 — 2 of 7 inventory icons carry a purple border, sampled border pixel RGB(144,102,203)`
- **Quote:** str = "Tip: A purple border indicates that an item is unique.";
- **Lane impact:** L5 (UI/HUD) — prevents mis-wiring the border colour to the 4-tier rarity ladder; border tracks <unique>, text colour tracks the 4 tiers. Sampled hex is approximate (video compression); the code string is the authority.

### `items-equipment/rarity-is-derived-not-a-field` — HELD [A2]

The '4 rarity tiers' are real but DERIVED at read time from unique-flag + modifier count — there is no rarity field in itemdata.xml — and all six tier colours are byte-exact and confirmed in the WEB v0.717 build, not just Android.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:382-405 and :417-451; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:683,687,691,704,708,712`
- **Quote:** if(itemxml != null && itemxml.unique == 1 || this.isPickableQuestItem() || isTradeQuestItem || this.isPlayerNamed()) { return "unique"; } if(modifierCount >= 3) { return "rare"; } if(modifierCount > 0) { return "special"; } return "normal";  /  loot toast: #b048f8 unique · #0080ff rare · #1eff00 special · #FFFFFF normal ; inventory: #6600cc unique · #003399 rare · #336600 special · #000000 normal
- **Lane impact:** L5 (UI/HUD) — supplies byte-exact tier colours in two palettes and removes the S0-3 Android-parity caveat for them. Also surfaces a third state the ledger does not know: itemdata.xml has 253 rows <unique>1</unique> and 116 rows <unique>2</unique> (counted this run), and 2 passes every ==1 test as not-unique while failing every ==0 test.

### `items-equipment/slashusage-stancerestriction-omitted` — HELD [A2]

itemdata.xml carries two items-owned combat inputs the ledger block never mentions: 106 <slashusage> rows with exactly three values 24/72/96 (default 48) and 53 <stancerestriction> rows with values 4 and 6.

- **Cite:** `docs/gauntlet/L0/index/itemdata.json paths itemdata/item/slashusage and itemdata/item/stancerestriction; reference/decompiled/shs3_android/scripts/XMLItem.as:152-167; StatsManager.as:1921-1930 and :1915-1919`
- **Quote:** if(xml.slashusage.toString() != "") { this.slashusage = xml.slashusage; } else { this.slashusage = 48; }  /  internal static function getSlashUsage() : int { var itemdata:XMLItem = QuestEngine.getItemData(equipment[EQ_WEAPON].itemID); if(itemdata == null || itemdata.slashusage < 48) { return 48; } return itemdata.slashusage; }  /  getBaseSlashLengthVal: var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
- **Lane impact:** L1 (combat core / reach) — the weapon slash-meter budget and the stance gate are items-owned numbers absent from the items block entirely; the reach formula 120 + floor((90 + DAN*5) * speed/(20+speed)) is an A2 hand-off to the combat lane.

### `items-equipment/ui-slot-mapping-unknown` — STILL_UNHELD [STILL_UNHELD]

Which of EQ_NECK / EQ_ACCESSORY1 / EQ_ACCESSORY2 the two visually identical empty ring boxes in the paperdoll map to cannot be established from the frames or the AS3 I read.

- **Lane impact:** L5 (UI/HUD) — one unresolved slot label; the 9-box layout itself is frame-confirmed, only the identity of two boxes is open.

## meta-social — re-scored 78

31/100 is badly stale. Of the four §4 blockers: ② (map topology) is fully closed at BOTH scales — a 6×6 sector board plus a world board that is a 63×72 GIF byte-identical across the web and Android payloads (735 land territories); ③ (achievements / daily-reward / token numbers) is closed outright with 61 resolved achievements, the full 36/6/10-slot daily prize tables, and both token pools quantified; ① (server sim) is closed on MECHANICS (deploy = 100×terrain-mod, arrows = 80+rand40×mod, 7-row terrain table, structure costs, 11-rank curve, 24h advance, 39-wave battle table) and open only on hosted state; ④ (offline gold faucet) is NOT unclosable as both the ledger and the first survey pass claimed — doRebirth grants 5 Gold per rebirth and 20 at Dan 8, a 60-Gold lifetime ceiling the client itself uses as its paid-player test. Both disputed "Ready" numbers are now positively resolved: "kill cap 350" is measurably 351 (340 troops + 11 samurai, identical in web and Android), and "flag +120%" is the terrain table's case-1 row wearing the wrong label — there is no control-point deploy bonus at all. Held back from higher by three real gaps: war-rules page 7 (desktop string ids 11016/11017, above the Android table's 9010 ceiling), no frame anywhere in the 100-frame map segment showing the 6×6 board itself, and the entire duel/leaderboard/friends/custom-clan surface that was never in scope when 31 was computed.

### `meta-social/achievements-61-resolved` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③'s achievements third is dead without a Ruffle session: all 61 achievements resolve to names, descriptions, tracked stat ids and thresholds.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (<achievementdata>, 61 <achievement> rows) resolved through docs/gauntlet/L0/index/strings.json`
- **Quote:** First row verbatim: `<achievement><id>0</id><img>1</img><name>8000</name><desc>8080</desc><stat>60000</stat><val>1</val></achievement>` → "Duelist I — Win an online duel." Others: id 45 stat 60022 val 10 "Chi Master — Learn all Chi Skills."; id 46 stat 60023 val 9 "Ninja Master — Learn all Ninja Skills."; id 58 stat 60018 val 340 "Warrior III — Defeat 340 in a war room attack."; id 60 stat 60025 val 1 "Be Awesome — Completed Season 1".
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — also pins the skill-tree shape for L-skills (10 Chi skills, 9 Ninja skills) as a side effect.

### `meta-social/daily-reward-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The full daily-login reward system is on disk: a 24h cooldown, a 36-outcome base roll, a 6-outcome bonus every 10th consecutive day and a 10-outcome super-bonus every 30th, with a global chat announcement on each bonus tier.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1139-1375 (case "dailyprize")`
- **Quote:** `:1152 StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);` `:1153 if(streak > 1 && (streak - 1) % 30 == 0)` → `dice = Math.random() * 10` over items 2130,2131,2132,2133,2135,2136,2137,2138,2139,2146; `:1207 else if(streak > 1 && (streak - 1) % 10 == 0)` → `dice = Math.random() * 6` over 1000 coins / 2101 / 2105 / 2126 / 2127 / random level-scaled item; base `:1247 dice = Math.random() * 36` → `dice <= 4` 100 coins, 5 → 200, 6 → 300, 7 → random item, 8-35 fixed item ids. Corroborated by strings 843 "Every 10 consecutive days: bonus prize!" and 844 "Every 30 consec
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — closes the daily-reward third of blocker ③ with the exact probability tables.

### `meta-social/flag-120-is-mislabelled-terrain-row` — HELD [A2] ⚑ OVERTURNS LEDGER

"flag +120%" is not a flag bonus at all — it is the case-1 row of getTerrainModifier (one step of terrain advantage); the only structure modifier in the payload is toValue += 2 for a completed Barricade, City or Castle, which can push an attacker down to 0.25x.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:2281-2307`
- **Quote:** `if(this.selectedHex.hextype == WarHex.HEX_DEFENSE && this.selectedHex.cost == 0 || this.selectedHex.hextype == WarHex.HEX_CITY || this.selectedHex.hextype == WarHex.HEX_CASTLE){ toValue += 2; } switch(fromValue - toValue){ case 2: return 1.5; case 1: return 1.2; case 0: return 1; case -1: return 0.75; case -2: return 0.6; case -3: return 0.5; case -4: return 0.25; }` — with `deployvalue = 100 * this.getTerrainModifier();` at WarHexUI.as:1052. HEX_CONTROLPOINT never appears in this function.
- **Overturns:** "flag +120%"
- **Lane impact:** L0 meta-social — kills a phantom number and replaces it with the real defender modifier the ledger omits entirely; the three neighbouring master-reference deploy rows (+60/+100/+75) are proven exact by the same table.

### `meta-social/offline-gold-faucet-exists` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is NOT unclosable: rebirth is an offline premium-Gold faucet at exactly 5 Gold per rebirth and 20 at the Dan 8→9 rebirth — 60 Gold lifetime — and the client itself treats >60 Gold below Dan 9 as proof of purchase.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2195-2208 and reference/decompiled/shs3_android/scripts/OverworldHUD.as:1333`
- **Quote:** StatsManager.as:2195 `public static function doRebirth() : *` … :2203 `changeStat(STAT_HGOLD,20);` … :2207 `changeStat(STAT_HGOLD,5);`. OverworldHUD.as:1333 `if(StatsManager.getStat(StatsManager.STAT_HGOLD) > 60 && StatsManager.getStat(StatsManager.STAT_DAN) < 9)` — 8 rebirths × 5 + 20 = 60, the exact free ceiling. This also contradicts docs/research/KONGREGATE_FORUM_FINDINGS.md:399 "Rebirthing = 25 FREE Gold" — payload over forum memory.
- **Overturns:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social — overturns both the ledger blocker and the FIRST survey pass's verdict ("there is none in the client… Blocker ④ stands as written"), which searched addLootGold and missed changeStat(STAT_HGOLD, …).

### `meta-social/section6-live-clan-war-overbroad` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

§6's "the live clan-war is structurally unrecoverable" is over-broad: only the hosted population and the authoritative tick are gone — every rule of the clan war is client-side and now readable.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1052 (deploy), :1104 (arrows), :2281-2307 (terrain), WarHexUIBuildMenu.as:185-213 (costs), StatsManager.as:162,824-1013 (ranks), string 376 (24h)`
- **Quote:** WarHexUI.as:1052 `deployvalue = 100 * this.getTerrainModifier();` · :1104 `num = 80 + Math.random() * 40 * this.getTerrainModifier();` · string 376: "- Troops will advance on enemy sectors every 24 hours. - If a sector has more attacking troops than defending troops, the sector will be captured by the attackers. - The Clan that captures all the control points in the battlefield will gain control of the territory."
- **Overturns:** "**The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim."
- **Lane impact:** L0 meta-social — the scoping decision (offline AI sim) stays right, but it must be built to the ORIGINAL numbers, not authored ones.

### `meta-social/six-actions-understated` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

"War-Room 6 actions" is correct as the in-game rulebook's count but wrong as a move budget: the client spends a war move at ten distinct sites, adding build-HQ, demolish-HQ and castle assault.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as lines 1049, 1177, 1210, 1279, 1304, 1386, 1654, 1771, 2420, 2471`
- **Quote:** Ten occurrences of `OverworldHUD.instance.warUI.useWarMove(1);` — versus rulebook string 372: "Moves can be used to deploy troops, attack enemy troops, move to a different sector, spy on the enemy or build structures." (5) plus the blocked-neighbour arrow branch (6).
- **Overturns:** "War-Room 6 actions + 11-rank ladder (moves/hr + thresholds)"
- **Lane impact:** L0 meta-social — anyone implementing the move economy needs ten operations, not six.

### `meta-social/structure-costs-and-donation-rate` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Structure costs are exact — Forward Base 10000, Tunnels 5000, Barricades 10000, Village→Town 10000, Command HQ free — and the ledger's "500 coins/turn" donation cap is really 500 coins per build MOVE, so a War Hero can contribute 3,000 per turn.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:185-213 + WarHexUI.as:1291,1332 + WarHex.as:424,477,521,540`
- **Quote:** WarHexUIBuildMenu.as getDesc rows: `str += "- " + LangManager.getString(566) + 10000 + " " + LangManager.getString(63)` for HEX_FORWARDBASE, `+ 5000` for HEX_LADDER (Tunnels), `+ 10000` for HEX_DEFENSE (Barricades) and HEX_TOWN; HEX_SPAWNPOINT (Command HQ) carries no cost line. WarHexUI.as:1291 `buildcost = 500;` gated on `StatsManager.getStat(StatsManager.STAT_WARMOVES) > 0 && StatsManager.getStat(StatsManager.STAT_GOLD) >= buildcost`. Ledger source SHSD_MASTER_REFERENCE.md:171 says "Build donation cap | 500 coins/turn".
- **Overturns:** "Build donation cap | 500 coins/turn"
- **Lane impact:** L0 meta-social — the move economy is off by a factor of 3-6 as written; also newly pins the castle gate window at 3*60*60 s (WarHex.as:499,507,513).

### `meta-social/two-token-pools-quantified` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's "two token types" bullet resolves to two fully specified pools — AP (30/30, 1 per 60 s) and Duel Tokens (start 20, hard cap 30, 1 per 120 s) — each with a x2 regeneration buff.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158,160,166,707,709,710 and :1101,:1134`
- **Quote:** `:158 internal static var APINTERVAL:int = 60;` `:160 internal static var DTINTERVAL:int = 2 * 60;` `:166 internal static var MAXDUELTOKENS:int = 30;` `:707 setPlayerStats(STAT_AP,30);` `:709 setPlayerStats(STAT_DUELTOKENS,20);` `:710 setPlayerStats(STAT_MAXDUELTOKENS,20);` and `:1101 if(StatsManager.hasBuff(StatsManager.BUFF_AP)) diff *= 2;`. Naming trap: STAT_GOLD=11 is the COIN stat (string 63 = "Coins"); the premium currency is STAT_HGOLD=12 behind getHeavenlyGold() and <heavenlyprice>.
- **Overturns:** "achievements/daily/token numbers"
- **Lane impact:** L0 meta-social — completes blocker ③'s token third; the first survey pass covered only Duel Tokens.

### `meta-social/war-kill-cap-351` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's "kill cap 350" is measurably 351 — 340 rank-and-file troops plus 11 named samurai — summed over the 39-wave war-room battle table, identical in the web v0.717 and Android payloads.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin (web v0.717 <survivalmodedata>, first <wave> at line 3, 39 waves) + reference/decompiled/shs3_android/scripts/WarHexUI.as:1711-1720`
- **Quote:** WarHexUI.as:1719 `var xml:XML = XML(new SurvivalModeData());` — and summing every <qty> in bindata/119: qty by id-block {400: 340, 700: 11} total 351. Wave head verbatim: `<enemy><id>400|401|402|403|404</id><qty>4</qty><x>-50</x></enemy>`. The 700 block is 11 distinct ids 700-710 at qty 1 each.
- **Overturns:** "kill cap 350"
- **Lane impact:** L0 meta-social — turns a STILL_UNHELD Ready bullet into a measured number and corrects it by one; also gives the war-room battle its full 39-wave enemy composition.

### `meta-social/world-board-63x72-byte-identical` — HELD [A3] ⚑ OVERTURNS LEDGER

Blocker ②'s world half is closed: the strategic war board is a 63x72 two-colour GIF mask with 735 land territories, and the web and Android copies are byte-identical, so the claim carries no Android caveat.

- **Cite:** `byte-check: reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Quote:** web  b'GIF89a' 63 72 272 bytes sha256 b9d152c046b66b59… / andr b'GIF89a' 63 72 272 bytes sha256 b9d152c046b66b59… / identical: True — decoded palette is 2 colours, 735 non-black pixels of 4536. Consumer: WarSelectUI.as:83-85 `internal var mapWidth:int = 63; internal var mapHeight:int = 72;` and :173 `return this.mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX,territoryy + TERRSHIFTY) != 0;`
- **Overturns:** "server-sim topology; map board; achievements/daily/token numbers; offline gold faucet"
- **Lane impact:** L0 meta-social — the §2 table's "map board" gap is dead; combined with the 6x6 sector generator the whole topology is now 735 territories → 6x6 sectors → 4-way [N,S,E,W] exits.

### `meta-social/xp-curve-l11-80-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE (progression), but it is a §6 line: the "L11–80 XP curve, likely unrecoverable" is a 99-entry array in the payload, and level 80 is exactly the rebirth gate.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** `public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,…,25395800,29395800];` — 99 entries; expArray[9]=25900, expArray[10]=31400 (the L11+ cliff), expArray[79]=4025800. String 4155: "New Game +\nProgress on to the next Dan Rank and specialize in an element. \nLevel 80 required."
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — retires a §6 "structurally unrecoverable" line and the §2 note "L11–80 curve (likely unrecoverable)"; the labeled-INFERRED extrapolation in src/config/xp.ts can be replaced with measured values.

### `meta-social/chikako-affinity-meter` — HELD [A2]

An entire meta-social loop the ledger never mentions: the Chikako affinity meter, a 5-level ladder fed 1 point per premium Gold spent plus achievement score, which pays out as random Gold refunds — the one place achievements have a mechanical payout.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_chikako.as:24-26,40 + StatsManager.as:2719-2724 + NetworkManager.as:2306-2315`
- **Quote:** InteractUI_chikako.as:24 `internal var expArray:Array = [0,10,30,60,100,150];` :26 `internal var maxLevel:int = 5;` :40 `return StatsManager.getPlayerStats(StatsManager.STAT_CHIKAKOLOVE) + QuestEngine.getAchievementScore();`. StatsManager.as:2722-2723 `changeHeavenlyGold(-num,callbackSuccess,callbackError); changeStat(STAT_CHIKAKOLOVE,num);`. NetworkManager.as:2306 `else if(m.type == "refunded")` → `showChikakoRefund()`. String 723: "Tip: Use Ninja Services or unlock achievements to impress Chikako and increase your chances for a \"Chikako Refund\"!"
- **Lane impact:** L0 meta-social — the 31/100 was scored over a smaller system than exists; this changes how achievements must be scoped (mechanical, not cosmetic).

### `meta-social/four-clans-named-led-located` — HELD [A2]

The four canonical clans are fully bound to names, daimyo, compass domains and side numbers — closing the first survey pass's STILL_UNHELD #3 and grounding the ledger's "4 clans (heraldry/masks/daimyo/capitals)" Ready bullet in A2 evidence.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 271-278 and 324-327 + reference/decompiled/shs3_android/scripts/WarHexUI.as:1077-1089`
- **Quote:** id 275-278: "Clan Aka Ryu" / "Clan Midori Ken" / "Clan Aoi Hoiru" / "Clan Ki Sensu". id 324: "Clan Aka Ryu is led by Lord Tsuyoshi… rules the domain in the North-East." id 325: "…led by Lord Daichi… rules the domain in the South-East." id 326: "…led by Lord Yoshio… rules the domain in the South-West." id 327: "…led by Lady Tsubasa…". Side colours WarHexUI.as:1077-1089: 16711680=0xFF0000 red, 39168=0x009900 green, 26367=0x0066FF blue, 16776960=0xFFFF00 yellow — i.e. Aka Ryu (red dragon), Midori Ken (green sword), Aoi Hoiru (blue wheel), Ki Sensu (yellow fan), same order.
- **Lane impact:** L0 meta-social — side n ↔ clan n is now fixed, which is required before any clan-coloured render or war-sim can be built.

### `meta-social/frame-prints-coordinate-system` — HELD [A1]

A longplay frame prints the live war-map coordinate system — TERRITORY (24,52) SECTOR (3,0) — independently confirming the 63x72 territory grid and the 0..5 sector board decoded from code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0090.jpg, crop (255,140)-(400,165) upscaled x12 LANCZOS`
- **Quote:** Visibly on screen: "KAKUCHI CASTLE TOWN, MAIN STREET / TERRITORY (24,52) SECTOR (3,0)" — and in the same panel a reward line "TOWN PROSPERITY: +10". x=24 ≤ 62 and y=52 ≤ 71 both sit inside the 63x72 mask; sector (3,0) sits inside 0..5.
- **Lane impact:** L0 meta-social — A1 corroboration for the A2 topology claim, plus surfaces "town prosperity", a town-conversion currency absent from the §4 block.

### `meta-social/frame-proves-string-table-parity` — HELD [A1]

A v0.717 longplay frame renders Android string 370 word-for-word including the original's grammatical error "you can may select", proving the Android string table is v0.717's own copy; the same frame's header reads 1/7 where the Android source says max = 6, and the FRAME WINS.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg, crops (100,50)-(420,250) x5 and title strip (100,30)-(420,70) x6`
- **Quote:** On screen: "…ES 1/7 (JOINING A BATTLE)" / "…IS A CLAN-BASED STRATEGY GAME WITHIN STRAW HAT SAMURAI: DUELS." / "…A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN." / "…TTLES WILL BE MARKED ON THE WAR ROOM MAP WITH YOUR CLAN'S FLAG." — versus reference/decompiled/shs3_android/scripts/WarRules.as:23 `internal var max:int = 6;`. STANDING INVARIANT APPLIED: the measurement source (Android decompile) and the frame disagree on page count, and the frame wins — v0.717 has seven pages.
- **Lane impact:** L0 meta-social — this is the calibration artifact for every Android-sourced string in the lane; a typo is a fingerprint. Also independently reproduces the first pass's 1/7 finding from a frame file rather than a video timecode.

### `meta-social/kisensu-domain-typo-in-shipped-data` — HELD [A2]

The shipped game data contains a quadrant bug: Ki Sensu is described as ruling the North-East, the same quadrant already assigned to Aka Ryu, leaving North-West vacant — a 1:1 recreation must decide to reproduce or knowingly fix it.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 324 and 327 (from reference/extracted/android/118_Mobile_Lang_EN.bin)`
- **Quote:** 324: "Clan Aka Ryu rules the domain in the North-East." / 327: "Clan Ki Sensu rules the domain in the North-East." — with 325 South-East and 326 South-West, North-West is unassigned.
- **Lane impact:** L0 meta-social — a fidelity decision the ledger's "capitals" bullet hides; needs an owner ruling before the world map is authored.

### `meta-social/ninja-services-priced-catalogue` — HELD [A2]

"Ninja-Services prices" upgrades from a bullet to a 12-row priced catalogue read out of the WEB v0.717 itemdata.xml, including the clan-economy SKUs and two currency conversion rates.

- **Cite:** `reference/extracted/itemdata.xml lines 27, 41, 55, 374, 388, 402, 416, 430, 2267, 2327, 2379, 2393, 2402, 2445, 2461, 2479; catalogue list at reference/extracted/android/121_Mobile_PremiumData.bin`
- **Quote:** itemdata.xml:2393 item 2208 <heavenlyprice>1</heavenlyprice> → "1000 coins — Buy 1000 coins."; :2445 item 2212 heavenlyprice 5 → "Clan Deed — Form your own clan. War Hero rank required. Includes: 1 Clan General Invitations, 3 Clan Invitations"; :2327 item 2203 heavenlyprice 5 → "Writ of Release — Use this item to leave your Clan."; :27/:41/:55 items 2100/2101/2102 at 1/2/3 Gold → Small/Medium/Large Soldier Pill; :374/:388/:402 items 2125/2126/2127 at 1/2/3 Gold → 10/25/40 Duel Tokens. Rates: 1 Gold = 1000 coins (item 2208, string 609) and 1 Gold = 10 AP (string 100).
- **Lane impact:** L0 meta-social — the premium economy is now implementable without a Ruffle session; prices come from the WEB build so no version caveat applies.

### `meta-social/rank-ladder-thresholds-and-moves` — HELD [A2]

The 11-rank ladder is exact: thresholds 36/84/180/324/516/816/1176/1596/2076/5000, moves per turn 3,4,4,4,4,5,5,5,5,5,6, a turn is exactly one hour, and coin donations buy rank at 1 point per 1,000 coins.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:162, 824-1013 (getWarRank / getWarMovesToNextRank / getMaxWarMoves) + strings 330-339, 403`
- **Quote:** `:162 internal static var WARMOVEINTERVAL:int = 60 * 60;` `:826 var num:int = getStat(STAT_WARMOVESMADE) + int(getStat(STAT_WARCOINSDONATED) / 1000);` `:827 if(num < 12 * 3){ return 0; }` … getMaxWarMoves returns 3 at rank 0 and 6 at rank 10. Names ids 330-339 + 403: recruit, private, corporal, sergeant, sergeant major, lieutenant, captain, major, colonel, general, War Hero. Achievements 53/54/55 cross-check the indices: "Reach Lieutenant Rank" val 5, "Reach General Rank" val 9, "Reach War Hero Rank" val 10.
- **Lane impact:** L0 meta-social — confirms the ledger's Surface note ("moves per turn reconciles as per hour; 36 = Private's threshold") with A2 evidence rather than inference.

### `meta-social/rival-clan-ai` — STILL_UNHELD [STILL_UNHELD]

The "Rival-clan AI: Greedy strategy — reinforce weakest border, attack adjacent weaker enemy, build when Captain+ and flush" in the project's own master reference has no payload backing — the server ran the clan AI, and no war AI exists in the client.

- **Quote:** docs/research/SHSD_MASTER_REFERENCE.md:177 states the strategy, but nothing in reference/decompiled/shs3_android/scripts/War*.as or Territory*.as implements or describes an AI opponent; every war action originates from a player click and is posted to QueryManager.
- **Lane impact:** L0 meta-social — must be labelled recreation-authored design, never cited as original fidelity.

### `meta-social/survivalmode-is-the-warroom-wave-table` — HELD [A2]

Stage-0 finding S0-1's "entire game mode absent from all 12 ledger systems" is sharper than that: survivalmodedata IS the war-room battle wave table, and enemy ids are remapped per clan side into distinct NPC id blocks.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:13, 1711-1752`
- **Quote:** `:13 internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;` `:1719 var xml:XML = XML(new SurvivalModeData());` and the remap: `if(targetside == 1){ strArray[k] = remainder + 200; } else if(targetside == 2){ strArray[k] = remainder + 400; } else if(targetside == 3){ strArray[k] = remainder + 300; } else if(targetside == 4){ strArray[k] = remainder + 500; } else if(targetside == 0 || targetside == 5 || StatsManager.isCustomClan(targetside)){ strArray[k] = remainder + 600; }`
- **Lane impact:** L0 meta-social — reassigns bindata/119 from an orphan 'survival mode' to meta-social's core battle content, and hands enemies-ai the 4-clan → NPC-id block mapping.

### `meta-social/war-rules-page-7-content` — STILL_UNHELD [STILL_UNHELD]

The content of war-rules page 7 (desktop-only, string ids 11016/11017) is not held — those ids sit above the Android string table's 9010 ceiling.

- **Quote:** The frame shows the header "1/7" but the page-7 body was never on screen in any extracted frame, and reference/extracted/android/118_Mobile_Lang_EN.bin tops out below id 9011.
- **Lane impact:** L0 meta-social — one of three remaining deductions in the 78 score.

### `meta-social/warroom-board-frame` — STILL_UNHELD [STILL_UNHELD]

No frame anywhere in the 100-frame map segment shows the war-room 6x6 board itself; every board claim in this lane rests on decompiled code plus the on-screen coordinate readout, not on a picture of the board.

- **Quote:** Checked reference/frames/Nr4fQstqHDM_map_contact.jpg (100 cells) and pulled frames 0048, 0084, 0090 at full source resolution; the longplay opens the War Room rules dialog and the quest panel, never the hex board.
- **Lane impact:** L0 meta-social — the honest ceiling on the topology claim; a denser video pass over the war-room segment is the close-path.

## npcdata — re-scored ?

No new_score returned — this is a SOURCE sweep, not a system sweep. But the board should note: enemies-ai's 34/100 is not a conservative floor, it is wrong. Four of its five listed blockers are wholly or half closed by one unread 228 KB file. Blocker ① (level→stat formula, "absent, not just inferred") is closed EXACTLY — a closed form reproduces 225/225 rows with zero violations. Blocker ② (per-enemy HP) is closed for 403/495 NPCs including every named boss. Blocker ④ (aggro/spawn) is half closed (34-profile AI assignment table held; behaviour bodies still in AS3). The moveset/"notes only" framing is closed by 647 authored skill rows. meta-social 31 also moves: the clan-war unit roster, level ladder and per-clan livery are fully held even though the server sim is not. items-equipment's "9-slot paperdoll" is a miscount — 10 wearable + 12 render slots.

### `frames/pillarbox-52px` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The longplay frames carry a 52 px black bar on each side: active picture is columns 52..1867 = 1816×1080 = 1.6815:1, which is NOT 16:9 and is within 0.9% of 5:3 — so every HUD x-fraction taken against the full 1920 is wrong by a 52 px offset and a 0.9458 scale factor.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (1920×1080), confirmed identically on Nr4fQstqHDM_432.0.png. Crops used: crop=960:400:0:380 and crop=960:400:960:380, each upscaled 3× nearest-neighbour; then a full-frame per-column luminance scan.`
- **Quote:** Visibly in the crops: a solid black vertical band at the extreme left of the left crop and the extreme right of the right crop, game art (stone-wall backdrop, straw-hat fighter, blood spray) between them, and a yellow "SOUND360TM" recorder watermark mid-frame. Measured per-column mean luminance: cols 0–51 = 0.0–1.1; col 52 = 40.9; col 53 = 86.5; col 1866 = 72.9; col 1867 = 33.2; col 1868 = 1.3; cols 1869–1919 ≤ 1.1.
- **Overturns:** "① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.*"
- **Lane impact:** L-ui-hud: blocker ① is measurable TODAY from frames we already hold — no build needed, contrary to the close-path which routes it through 'read stage.stageWidth in a build' (and P0 proved no build exists). THE FRAME WINS: where any HUD-geometry doc quotes an x-fraction of 1920, the frame says the picture is 1816 px wide starting at x=52 — take the frame. PARTIAL and honestly so: a single frame cannot separate a Flash-stage pillarbox from the recorder's own letterboxing of a browser window, and the SOUND360TM watermark proves a recorder overlay was present. The existence and exact width of the bars is HELD; their ORIGIN is STILL_UNHELD.

### `npcdata/absent-boss-names` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The four bosses the ledger says our boss table 'omits' — Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru — plus the 'Shira Tancho' clan appear NOWHERE in the 484 resolved NPC names or the full 2,533-entry EN string table, so they are currently unsourced against any artifact we hold.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json (npcdata.xml, 484 resolved names) + docs/gauntlet/L0/index/strings.json (2,533 entries); searched for Hachisuka, Honda, Zabuza, Tengu, Kano, Shizuka, Hotaru, Shira, Tancho`
- **Quote:** Search output: Tancho 0 [] · Hachisuka 0 [] · Honda 0 [] · Zabuza 0 [] · Tengu 0 [] · Shira 0 [] · Kano 0 [] · Shizuka 0 [] · Hotaru 0 []. Actual payload named-boss roster: Hiroshi, Amaya, Tadao, Mad Cultist, Guardian, Gojo Takamori, Magoichi, Yohei, Aboshi, Mitsuo, Kojuro, Chikako, Yuudai, Fumio, Satoshi, Hachimaru, Shou, Inokichi, Boss Tanaka, Den Boss, General Daisuke, Lady Oiwa, Nian Monster, Santa, Jinbei, Kurai, Jonin.
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L-enemies-ai + L-quests-story + L-meta-social ('4 clans … + Shira Tancho story-only'). PARTIAL, deliberately: absence from the ANDROID v0.682 table is not proof of absence from web v0.717, and these may be wiki/fan or predecessor-game material. But the ledger presents them as a known gap in OUR boss table, which implies we know they exist — we do not, and the real roster above should replace them.

### `npcdata/ai-profile-table` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

A 34-profile AI archetype assignment table is held: 425 NPCs carry <ai> spanning ids 1–37 with 10, 15 and 16 never used, five generic soldier profiles (ai1–ai5), an elite profile (ai9, ×73), one-off creature profiles (Wolf/Horse/Bear/Boar/Deer/Stag/Oni/Fox), and boss-unique profiles ai29–ai37.

- **Cite:** `reference/extracted/npcdata.xml:27 (npc 1) and 424 sibling <ai> rows; distribution re-derived first-hand, sums to 425 matching docs/gauntlet/L0/index/npcdata.json`
- **Quote:** <ai>1</ai>  — counts: ai1 ×56, ai2 ×48, ai3 ×52, ai4 ×47, ai5 ×48, ai9 ×73, ai28 ×24, ai14 ×15, ai26 ×8 (all Undead), ai6 ×3, ai13 ×1 (Training Dummy), ai29–ai37 boss-unique
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L-enemies-ai: blocker ④ HALF closed — which behaviour each of 425 NPCs runs is now a table, not a guess. PARTIAL and deliberately so: <ai> is an index only; the behaviour bodies (aggro radius, leash, spawn geometry) are in the AS3 bundles and remain STILL_UNHELD from this file.

### `npcdata/enemy-skill-loadouts` — HELD [A2] ⚑ OVERTURNS LEDGER

Enemy movesets are a per-NPC, per-rank data table, not notes: 96 NPCs carry 647 <skill> rows using 39 distinct skill ids drawn from the SAME pool as the player, with individually authored boss loadouts (Gojo Takamori carries Shunpo, Heavenly Sword@3, Spirit Thief and "Undying"; Aboshi carries Smoke Bomb@2, Substitution Jutsu@2 and Shadow Clone).

- **Cite:** `reference/extracted/npcdata.xml:535 (npc 17), :3898 (npc 188 Magoichi), :3934 (npc 190 Gojo Takamori), :3662 (npc 175 Aboshi), :3436 (npc 164 Fumio)`
- **Quote:** npc 17, :535 — <skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1006</id><lvl>1</lvl></skill></skills>
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L-enemies-ai: the 'taxonomy + movesets from notes' framing is replaced by an authored table (blocker ③'s frame-timing half is still STILL_UNHELD — npcdata carries no timing field of any kind). L-skills-meters blocker ②: Shunpo is real, is skill 1039, is carried by 6 NPCs, and its description is held verbatim — "Ultimate Light Stance technique. Hold down the skill icon to increase the damage it inflicts. This skill can only be used when in Light Stance."

### `npcdata/five-clan-armies` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Five structurally identical 57-unit clan armies are held (id blocks 200-256 / 300-356 / 400-456 / 500-556 / 600-656) — every stat field identical across blocks, differing ONLY in a per-block 4-id livery set drawn from the armor band, i.e. armor id is the clan heraldry channel.

- **Cite:** `reference/extracted/npcdata.xml:4460, :5495, :6530, :7565, :8600 (blocks starting 4451/5486/6521/7556/8591)`
- **Quote:** npc 200 :4460 <armor>4038</armor> · npc 300 :5495 <armor>4041</armor> · npc 400 :6530 <armor>4044</armor> · npc 500 :7565 <armor>4047</armor> · npc 600 :8600 <armor>4053</armor> — all five otherwise identical: <name>5053</name><lvl>1</lvl><hp>1</hp><ai>1</ai><attack>1</attack><defense>1</defense>, same hair pool, <pants>11006</pants>, <shoes>12002</shoes>, <weapon>13109</weapon>
- **Overturns:** "① **server-authoritative simulation** (24h tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled)."
- **Lane impact:** L-meta-social: the simulation LOGIC is indeed not here, but the war's unit roster, its full level ladder and its per-clan livery ARE fully held — which is most of what a rebuilt offline sim needs to be populated with. PARTIAL, and a live conflict: the string table names only FOUR clans (275 'Clan Aka Ryu', 276 'Clan Midori Ken', 277 'Clan Aoi Hoiru', 278 'Clan Ki Sensu') while npcdata holds FIVE armies. Which faction the fifth belongs to is STILL_UNHELD.

### `npcdata/level-stat-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The enemy level→stat formula the ledger calls "absent, not just inferred" is authored in the payload and reproduces exactly: for lvl 11–40 hp=ceil(2.5·lvl) and attack=defense=ceil(2.4·lvl); for lvl 45–60 hp=attack=ceil(2.5·lvl) and defense=ceil(2.8·lvl); for lvl 70 all three = 2.5·lvl; lvl 1–5 hp is pinned to 1 with attack=defense=lvl, and lvl 6–10 has hp=attack=defense=lvl.

- **Cite:** `reference/extracted/npcdata.xml — <npc> blocks starting at lines 4665 (npc 212), 4861 (npc 223), 5298 (npc 247), 5317 (npc 248), 5392 (npc 252); fields at block-start+3…+6`
- **Quote:** <lvl>11</lvl> <hp>28</hp> <attack>27</attack> <defense>27</defense>  (npc 212); <lvl>45</lvl> <hp>113</hp> <attack>113</attack> <defense>126</defense>  (npc 248); <lvl>70</lvl> <hp>175</hp> <attack>175</attack> <defense>175</defense>  (npc 252). Verification output: "checked 225 army NPCs lvl>=11 across all five blocks; formula violations: 0"
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L-enemies-ai: blocker ① CLOSED outright; the score of 34 is wrong, not merely stale. Also L-progression: this 2.4/2.5/2.8-per-level shape is the only observed stat-vs-level transfer function anywhere in the payload, and is a candidate answer to progression blocker ① (DEF/SPD transfer functions).

### `npcdata/loot-drop-tables` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Drop tables with exact probabilities are held: 66 NPCs carry <reward> holding 131 <loot> rows, <chance> domain exactly {0.05, 0.1, 0.3, 0.4, 0.5, 1} and <qty> ∈ {1,2,3,5}, with a visible boss pattern (id=2, qty=1, chance=1 guaranteed) and an animal-butchery pattern (Meat 0.3 / Small Meat 0.3 / Large Meat 0.4 / Animal Fang 0.5).

- **Cite:** `reference/extracted/npcdata.xml:530-532 (npc 17 Bandit Leader), :39-42 (npc 1), :1859-1861 (npc 67 Wolf), :1975-1982 (npc 73 Boar)`
- **Quote:** <loot>\n\t<id>2</id>\n\t<qty>1</qty>\n\t<chance>1</chance>\n</loot>  (npc 17, :530-532); <id>20028</id><qty>1</qty><chance>0.5</chance> = Animal Fang (npc 67, :1859-1861)
- **Overturns:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L-items-equipment / L-economy / L-enemies-ai: the §1 known-unknown 'loot/drop tables' is overturned as to STRUCTURE and PROBABILITIES. PARTIAL because loot <id> 0/1/2/3 are table references, not item ids (real item ids in the same field are 4–5 digit: 2112/2113/2114/20028) — what tables 0–3 resolve to is STILL_UNHELD from this file. Separately and importantly for L-economy: <reward> contains ONLY <loot>. There is no <xp> and no <coins> tag anywhere in npcdata.xml, so the 'coins-per-kill =8 unconfirmed INFERRED seed' gets no help here.

### `npcdata/npc-elemental-typing` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Elemental typing exists on the NPC side, not just in the rebirth domain: four NPCs carry <fire>10</fire> or <earth>10</earth>, and each of the four also carries a matching elemental skill (Fire Breath "Close-ranged fire attack", Ground Punch "Close-ranged earth attack").

- **Cite:** `reference/extracted/npcdata.xml:3380 (npc 161 Satoshi, fire), :3439 (npc 164 Fumio), :4039 (npc 197 Mitsuo), :4272 (npc 809 Mitsuo, earth)`
- **Quote:** <fire>10</fire> (:3380) · <earth>10</earth> (:3439, :4039, :4272); npc 161 skill row carries <id>1013</id> = "Fire Breath", npcs 164/197/809 carry <id>1033</id> = "Ground Punch"
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** L-rebirth-elements: elements are a LIVE combat channel on ordinary NPCs in the v0.682 data, not a rebirth-only or gear-only system — which is the linkage the ledger's own Surface bullet says was never made ('elements are TWO systems … the gear side is measured but never linked to the rebirth domain'). PARTIAL: what the scalar 10 means (resist / affinity / bonus) is STILL_UNHELD, and no water or wind sibling tag appears anywhere in the file.

### `npcdata/paperdoll-12-slots` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The paperdoll is 10 wearable slots and 12 render slots, not 9 — <mcs> enumerates armor, gloves, hair, hat, head, mask, neck, pants, shoes, weapon, prop1, prop2, and itemdata's <type> 1–12 maps onto the id bands with zero ambiguity.

- **Cite:** `reference/extracted/npcdata.xml:7-19 (npc 0, the reference paperdoll) + :3954 (<prop2>); cross-checked against reference/extracted/itemdata.xml id-band↔<type> histogram`
- **Quote:** 7 <mcs> / 8 <armor>4031</armor> / 9 <gloves>5005</gloves> / 10 <hair>6001</hair> / 11 <hat>7052</hat> / 12 <head>8008</head> / 13 <mask>9000</mask> / 14 <neck>10004</neck> / 15 <pants>11030</pants> / 16 <shoes>12015</shoes> / 17 <weapon>13012</weapon> / 18 <prop1>13012</prop1> / 19 </mcs>  — itemdata: 4000s=no <type> (armor,152) · 5000s=1 gloves(35) · 6000s=2 hair(73) · 7000s=3 hat(97) · 8000s=4 head(38) · 9000s=5 mask(60) · 10000s=6 neck(14) · 11000s=7 pants(93) · 12000s=8 shoes(55) · 13000s=9 weapon/prop(177) · 2000s=10 consumable(98) · 3000s=11(9) · 20000s=12 material(79)
- **Overturns:** "**Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list"
- **Lane impact:** L-items-equipment: the slot COUNT in the ledger's Ready column is wrong (10 wearable / 12 render, not 9) and the item-id NAMESPACE is now fully held, which is half of blocker ⑤. PARTIAL: the LAYER ORDER half of blocker ⑤ is STILL_UNHELD — <mcs> children are emitted alphabetically (an authoring artefact, not z-order). L-art-anim also affected.

### `npcdata/per-enemy-hp` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-enemy HP, listed as blocker ②, is authored for 403 of 495 NPCs including every named boss — Hiroshi L80 hp1000, Mad Cultist L23 hp800, Amaya L30 hp600, Tadao L10 hp200 — with the 92 hp-less rows being non-combat NPCs.

- **Cite:** `reference/extracted/npcdata.xml:3125 (Hiroshi), :4076 (Mad Cultist), :3846 (Amaya), :3446 (Tadao), :1848 (Wolf), :1951 (Bear), :499 (Bandit Leader), :4115 (Guardian), :2689 (Training Dummy)`
- **Quote:** npc 144 "Hiroshi": <lvl>80</lvl> <hp>1000</hp> <attack>200</attack> <defense>200</defense>
- **Overturns:** "② per-enemy HP."
- **Lane impact:** L-enemies-ai: blocker ② CLOSED. A builder can table the entire PvE roster's HP today without a single measurement.

### `npcdata/stance-mastery-rank-10` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Stance mastery caps at rank 10, not 9: every elite NPC ships skills 1000/1001/1002 at <lvl>10</lvl>, and skilldata.xml gives each of the three masteries exactly 10 <level> rows.

- **Cite:** `reference/extracted/npcdata.xml:535 (npc 17) and 75 sibling rows; cross-checked in reference/extracted/skilldata.xml (skills 1000/1001/1002, 10 <level> rows each)`
- **Quote:** <skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill>  — resolved: 1000 "Light Stance Mastery", 1001 "Balanced Stance Mastery", 1002 "Heavy Stance Mastery"
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L-combat-core + L-skills-meters: §3 correction #3's 'mastery-9 ceiling' label is wrong on the rank cap — the ceiling is 10. PARTIAL and deliberately so: I hold the rank cap, I do NOT hold which rank the wiki's 300/200/100 reach figures belong to. That still needs skilldata's <value> rows read against the wiki, and it changes whether STANCE_TABLE should be relabelled 'mastery-10' or treated as a mid-curve row.

### `npcdata/enemy-render-scale` — HELD [A2]

Per-NPC render scale is authored on 16 NPCs over the domain {0.95, 0.99, 1, 1.1, 1.3, 2}, including a 2.0× double-height Guardian and non-uniform x≠y entries (Inokichi 1.3/1.1, Fumio and Mitsuo 1.0/0.95) that force independent axis scaling in the renderer.

- **Cite:** `reference/extracted/npcdata.xml:4136-4137 (npc 802 Guardian), :3880-3881 (npc 187 Yohei), :3408-3409 (npc 162 Inokichi), :3437-3438 (npc 164 Fumio)`
- **Quote:** npc 802 Guardian, :4136-4137 — <scalex>2</scalex> <scaley>2</scaley>; npc 162 Inokichi, :3408-3409 — <scalex>1.3</scalex> <scaley>1.1</scaley>
- **Lane impact:** L-art-anim-audio-feel: the ledger's Ready column ('proportions', 'fighter proportions') assumes a single fighter size. It is not one size — the same rig is scaled per NPC, non-uniformly, up to 2×. L-enemies-ai: boss silhouette scale is a codeable value today.

### `npcdata/heavy-stance-def-penalty` — HELD [A2]

Heavy stance's defence penalty is confirmed verbatim at −20% by a first-party string rather than a wiki restatement, along with the full stance rock-paper-scissors ring.

- **Cite:** `skill 1002 carried by 79 NPCs (e.g. reference/extracted/npcdata.xml:535), resolved through docs/gauntlet/L0/index/strings.json`
- **Quote:** "Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%" — with 1000 "Effective against Heavy Stance" and 1001 "Effective against Light Stance" closing the ring
- **Lane impact:** L-combat-core: upgrades the provenance of §1's 'Heavy defender Defense ×0.8 (one way)' from wiki to first-party payload string, and independently sources the stance counter ring. ⚠ Carries the S0-3 caveat: this is ANDROID build v0.682 copy; web v0.717 parity is NOT established.

### `npcdata/named-boss-hp-authored` — HELD [A2]

A live comment in src/config/combat-sim.ts ENEMY_BASE asserts "Named-enemy HP is not authored at all" — the payload contradicts this directly, so the max()-is-a-no-op reasoning that justified hp:1 rests on a false premise.

- **Cite:** `reference/extracted/npcdata.xml:3125 (and 360 further non-1 <hp> rows) vs src/config/combat-sim.ts symbol ENEMY_BASE`
- **Quote:** config, verbatim: "Named-enemy HP is not authored at all — it is recomputed at spawn as `effPlayerDmg × K`, and the source's own data authors trash HP as `<hp>1</hp>` and lets `max(scaledBase, …)` be a no-op."  Payload, verbatim: npc 144 <hp>1000</hp>, npc 800 <hp>800</hp>, npc 186 <hp>600</hp>.
- **Lane impact:** L-combat-core / L-enemies-ai: the derived-HP model in Sim rests on a claim the payload disproves. NO FILE WAS MODIFIED (read-only lane, §4 NO-TOUCH) — flagged for the build lane to re-derive with the real level-scaled base from claim npcdata/level-stat-formula.

### `npcdata/one-hp-field-trash` — HELD [A2]

The "~1-HP-chip field trash" reading is confirmed at payload level with an exact census: 42 NPCs carry <hp>1</hp> — Soldier ×25, Ruffian ×5, Elite Soldier ×5, Novice Swordsman ×3, Thug, Deer, Fox and one Training Dummy.

- **Cite:** `reference/extracted/npcdata.xml:26 (npc 1 Ruffian), :4455 (npc 200 Soldier), :4542 (npc 205 Elite Soldier), :1659 (npc 56), :149 (npc 6), :1991 (npc 74 Deer), :2087 (npc 78 Fox), :2710 (npc 118 Training Dummy)`
- **Quote:** npc 1 "Ruffian": <lvl>3</lvl> <hp>1</hp> <ai>1</ai> <attack>3</attack> <defense>0</defense>
- **Overturns:** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L-enemies-ai: upgrades the ledger's own Surface suspicion from 'notes' to A2 payload evidence, with an exact 42-row census. src/config/combat-sim.ts already ships hp:1, so no code change is implied — only the ledger's provenance label changes.

### `npcdata/shipped-data-defects` — HELD [A2]

The payload ships three real authoring defects a rebuilder's importer must handle: one hair pool coerced to a float, 355 occurrences of a period typed for a comma inside hair pools, and four NPCs whose <attack> field holds a mis-keyed hat-band item id — which is the sole source of the index's misleading attack range of 7092.

- **Cite:** `reference/extracted/npcdata.xml:1644, :4371, :4389, :4408, :4425, plus 355 rows containing the token 6015.6017`
- **Quote:** :1644 — <hair>6.5006501650265E+47</hair>;  :4371 — <id>815</id> <name>5001</name> <attack>7092</attack> (npc 815 also has <hat>7093</hat> and no <lvl>/<hp>/<defense>/<ai>);  355× the token 6015.6017 inside hair pools, silently collapsing ids 6015 and 6017
- **Lane impact:** L-enemies-ai + L-items-equipment + L-art-anim. Concrete consequence: docs/gauntlet/L0/index/npcdata.json reports npcdata/npc/attack numeric_range [1.0, 7092.0] and mcs/hair numeric_range up to 6.5e47 — BOTH are artefacts of these defects, not real game values. A naive importer would ship a 7,092-attack enemy. Defect 2 sits in the most-instantiated NPC rows in the game (the five clan armies).

### `npcdata/unresolved-name-5017` — STILL_UNHELD [STILL_UNHELD]

String id 5017 — the only unresolved NPC name, referenced by six non-combat NPCs (ids 50–55) — has no entry in the Android EN table; four of the six carry the ai7 civilian-idle profile and one uses a 500-offset head/pants body sub-band that no other NPC touches.

- **Cite:** `reference/extracted/npcdata.xml:1560, :1576, :1592, :1608, :1624, :1640 (the six <name>5017</name> rows); ai at :1561, :1577, :1593, :1609 (=7), :1625 (=32), :1641 (=33); body band at :1646, :1648`
- **Quote:** <name>5017</name> — all six have no <lvl>, no <hp>, no <attack>, no <defense>, no <reward>, and <weapon>0</weapon>. npc 55: <head>8500,8501,8502,8503,8504,8505,8506</head> and <pants>11503</pants>
- **Lane impact:** L-art-anim-audio-feel + L-enemies-ai. Recorded so it is not re-opened: the ai7 civilian pairing (shared only with 'Peasant' and 'Charcoal Burner') points at a townsfolk archetype, and the 500-band head/pants at a second body rig which the payload's MCSCharacter_* blobs (finding S0-4) would settle. I will not guess which.

### `npcdata/wardrobe-randomiser` — HELD [A2]

NPC appearance is a randomised per-slot wardrobe roll that no ledger system models: 741 of 3,210 <mcs> slot rows (23.1%) are comma-separated POOLS rather than single ids, and repeated 0 entries act as a spawn-weighting device (9 zeros to 11 hats ≈ 45% bare-headed).

- **Cite:** `reference/extracted/npcdata.xml:31 (npc 1 hair pool), :505 (npc 17 hair pool), :506 (npc 17 hat pool with weighting zeros)`
- **Quote:** npc 17, :506 — <hat>0,0,0,0,0,0,0,0,0,7003,7008,7009,7010,7011,7012,7013,7014,7015,7016,7017</hat>; npc 1, :31 — <hair>6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019</hair>
- **Lane impact:** L-art-anim-audio-feel + L-items-equipment + L-enemies-ai simultaneously — which is exactly why a system-siloed reader could not see it. A single <npc> row is a GENERATOR, not an instance: one archetype spawns visually varied instances by rolling each slot independently against its pool. This is an unmodelled RNG contract (which stream? rolled at spawn or at authoring?) and a from-scratch-art requirement. Absent from all 12 ledger systems.

## progression — re-scored 88

All four of the 2026-07-20 blockers are now HELD in the payload, including the one escalated to §6 "structurally UNRECOVERABLE" (L11–80 XP curve, a 99-entry literal array present byte-identically in both the web v0.717 and Android v0.682 builds). Also newly held: post-rebirth SP closed form, flat-subtraction DEF, all three SPD transfer functions, the complete kill-XP model with grey-level/over-level cutoffs, 69 tabled quest XP rewards, a 33-gate L3–L80 unlock ladder, per-stat level caps, free total respec, and AP regen. Two "Ready" bullets were WRONG (+1AP is really +5; "80 SP first run" is really 79) and the Surface bullet's "271 cap" explanation is refuted (271 = 1+(80+10)*3, a hard per-stat UI cap, and it IS reachable in one stat). Not 100 because two genuine unknowns remain: whether levels 81–99 (18 unused expArray entries above the level-80 cap) were ever reachable, and whether a dedicated gather/mine/farm XP number exists at all (plumbing held, value not). One frame-vs-payload conflict was found and resolved in the frame's favour: the Android build is differently tuned for per-point magnitudes, so progression must be ported from the WEB payload.

### `progression/271-cap-explained` — HELD [A2] ⚑ OVERTURNS LEDGER

The "271 cap" is exactly the level-80 evaluation of the ATK/DEF/SPD cap formula 1+(80+10)*3 = 271 — a hard per-stat UI ceiling, not a gear/rebirth-inclusive total, and it IS reachable in one stat on a first run.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3344 (cap formula) + §1t1523s0§.as:362 (levelCap 80) + §1t1523s0§.as:2577 (237-point budget)`
- **Quote:** §1t5957s0§.as:3344 "< 1 + (_loc2_ + 10) * 3" · §1t1523s0§.as:362 "public static const §1t9470s0§:int = 80;" · §1t1523s0§.as:2577 "§1t7357s0§(§1t9419s0§,(getLevel() - 1) * 3);" — 1+(80+10)*3 = 271; the 237-point budget buys 271 in one stat with only 90 points because each point is +3, not +1.
- **Overturns:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L4: the Surface bullet's arithmetic is refuted; it assumed +1 per point. Replace with the cap formula.

### `progression/ap-regen` — HELD [A2] ⚑ OVERTURNS LEDGER

AP regenerates +1 per 60 seconds of server time, doubled by the AP buff, hard-stopped at MAXAP (which starts at 30 and is itself a spendable stat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158 and :1090-1115; web parity at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:192`
- **Quote:** StatsManager.as:158  internal static var APINTERVAL:int = 60;
StatsManager.as:1099-1103  diff = Math.floor(timeDiff / APINTERVAL) + 1; if(StatsManager.hasBuff(StatsManager.BUFF_AP)) { diff *= 2; } newAP = changeAP(diff);
§1t1523s0§.as:192  internal static const §1t9396s0§:int = 60;
- **Overturns:** "④ AP regen rate + cap."
- **Lane impact:** CROSS-LANE GIFT to L10 world-exploration blocker ④ ("AP regen rate + cap") — closed. The cap is the MAXAP stat, whose cap formula is 30+(level+10)*5 (see progression/per-stat-hard-caps).

### `progression/campaign-level-band` — HELD [A2] ⚑ OVERTURNS LEDGER

The campaign's own intended level band is tabled — 142 quest-wave enemy <lvl> rows spanning levels 2–35 (plus ally rows to 80) — so "both longplays cap at L10" is a capture limit, not a content limit.

- **Cite:** `docs/gauntlet/L0/index/questdata.json paths questdata/quest/step/wave/enemy/lvl (count 142, range 2.0–35.0), questdata/quest/step/wave/friend/lvl (count 9, range 25.0–80.0), questdata/quest/step/roomobj/property/obj/property/xml/wave/enemy/lvl (count 18, all 25)`
- **Quote:** questdata/quest/step/wave/enemy/lvl 142 [2.0, 35.0] sample_values ['11','15','17','18','2','20','22','23','25','27']
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline)."
- **Lane impact:** L4: removes the stated reason for blocker ② ("both longplays cap at L10") as evidence about the game rather than about the capture. Also useful to L8 enemies-ai for level-band pacing.

### `progression/def-mitigation-is-flat` — HELD [A2] ⚑ OVERTURNS LEDGER

There is NO DEF mitigation curve: defense is flat subtraction from incoming damage, floored at the attack's own minDamage, with exactly one modifier — Heavy stance multiplies your defense by 0.8.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3291 and :3484-3488 (web); clear-named at reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3237 and :3415-3419`
- **Quote:** MCSPlayer.as:3231-3237  internal function getDefense() : int { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }
MCSPlayer.as:3415-3418  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
§1t99s0§.as:3484-3487  _loc5_ -= this.§1t4477s0§(); if(_loc5_ < param2.§1t1088s0§()) { _loc5_ = param2.§1t1088s0§(); }
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L4 blocker ① (DEF half) dies — and there was never a curve to find. Corroborated by the resolved string table: skill 1002 Heavy Stance Mastery desc ends "Defense -20%". Feeds L1 combat-core's damage pipeline directly.

### `progression/inferred-extrapolation-error` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped XP_DELTA_STEP=500 extrapolation is not merely INFERRED but quantifiably wrong — it under-shoots the real curve by -61.3% at level 80.

- **Cite:** `src/config/xp.ts:28 vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364; test tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED)`
- **Quote:** export const XP_DELTA_STEP = 500;  — measured divergence: L12 real 43,500 vs inferred 43,900 (+0.9%); L20 108,000 vs 113,900 (+5.5%); L40 507,300 vs 428,900 (-15.5%); L60 1,508,800 vs 943,900 (-37.4%); L80 4,285,800 vs 1,658,900 (-61.3%)
- **Overturns:** "Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: src/config/xp.ts must swap the extrapolation for the real 99-entry table and drop the INFERRED label; tests/xp.test.ts's extrapolation test pins a refuted model.

### `progression/per-point-magnitudes` — HELD [A1] ⚑ OVERTURNS LEDGER

Per stat point the WEB v0.717 build grants HP +10, Chi +5, AP +5, ATK +3, DEF +3, SPD +3 — the ledger's "+1AP" is wrong (it is +5); and where the Android v0.682 payload disagrees (HP+5/AP+1/stat+1), THE FRAME WINS and it matches WEB.

- **Cite:** `FRAME: reference/videos/zFtCaTO0_1M.mp4 @ t=1600s, crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7×; adjudicating reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445 (web) against reference/decompiled/shs3_android/scripts/InventoryUI.as:2417-2453 (android)`
- **Quote:** Web §1t5957s0§.as:3390-3445: "§1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9403s0§,10);" (MAXHP +10) · "…(§1t9406s0§,5)" (Chi +5) · "§1t9609s0§(5)" (addMaxAP 5) · "…(§1t9408s0§,3)/(§1t9409s0§,3)/(§1t9410s0§,3)" (ATK/DEF/SPD +3). Android InventoryUI.as:2417/2424/2431/2438/2445/2452: "changeStat(STAT_MAXHP,5)", "changeStat(STAT_MAXCHI,5)", "addMaxAP(1)", "changeStat(STAT_ATTACK,1)", "…STAT_DEFENSE,1", "…STAT_SPEED,1". FRAME at level 4 shows AVAILABLE STAT POINTS: 0 with maxHP 20, maxChi 15, maxAP 30, ATK 10, DEF 10, SPD 4 from a 9-point budget: web magnitudes cost exactly 1+1+0+3+3+1 = 9 ✓; android 
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: fixes the +1AP error. Gauntlet-wide: proves Stage-0b finding S0-3's parity caveat concretely — shs3_android v0.682 is DIFFERENTLY TUNED and must be used only as a decoder ring for symbol names; port all progression numbers from shs3_payload (web v0.717). Also closes an open INFERRED flag in docs/research/video-study/segments/A-02-...md line 25.

### `progression/post-rebirth-sp` — HELD [A2] ⚑ OVERTURNS LEDGER

The post-rebirth skill-point economy is a single closed form: SP = (level-1) + Dan*(levelCap-1) = (level-1) + Dan*79, so each rebirth permanently adds a full 79-point budget (lifetime max 790 at the Dan-9 cap).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 (web), clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:2156`
- **Quote:** §1t1523s0§.as:2598  §1t7357s0§(§1t9418s0§,getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1));
StatsManager.as:2156  setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
- **Overturns:** "③ post-rebirth SP economy;"
- **Lane impact:** L4 blocker ③ dies. Also: doRebirth() (StatsManager.as:2195-2231) calls unAssignStatPoints() but NOT unAssignSkillPoints() — learned skills survive rebirth; only the equipped skill-slot vector resets to skillSlots[0]=IntStat(1003,1) (Jump).

### `progression/quest-xp-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Quest XP is a table, not a formula, and it is on disk — 69 <exp> reward rows across the 61 quests, range 100–3000, attached to quest steps.

- **Cite:** `reference/extracted/questdata.xml:214-216 and :411-413; index docs/gauntlet/L0/index/questdata.json path questdata/quest/step/reward/exp (count 69, range 100.0–3000.0)`
- **Quote:** questdata.xml:214-216
    <reward>
      <exp>290</exp>
    </reward>
questdata.xml:411-413
    <reward>
      <exp>200</exp>
    </reward>
Consumed at Overworld.as:318  overworldHUD.lootDialog.addLootXP(reward.exp);
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4 blocker ④ (quest side). Also touches L9 quests-story blocker ③ ("per-quest trigger types + coords + rewards (sampled, not tabled)") — the reward side is tabled.

### `progression/sp-first-run-off-by-one` — HELD [A2] ⚑ OVERTURNS LEDGER

First-run skill points are 79, not 80 — SP = level-1 with level capped at 80.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 with Dan=0, and per-level grants at §1t1523s0§.as:2074-2075`
- **Quote:** §1t1523s0§.as:2074-2075  §1t9713s0§(§1t9418s0§,1);  §1t9713s0§(§1t9419s0§,3);   // +1 skill point, +3 stat points per level — 79 levels gained L1→L80 ⇒ 79 SP and 237 stat points
- **Overturns:** "cap 80; 80 SP first run; unlock cadence;"
- **Lane impact:** L4: an off-by-one in the Ready bullet. The '+3 stat/+1 skill per level' half of the same bullet is confirmed correct.

### `progression/spd-scaling` — HELD [A2] ⚑ OVERTURNS LEDGER

All three SPD transfer functions are held verbatim — slash length (reach) = 120 + floor((90 + Dan*5)*spd/(20+spd)); slash reload = 48 + spd*6; skill cooldown multiplier = 1 - min(spd,600)/600*0.5 (WEB) vs /300 (Android drift); speed buff pre-multiplies spd by 1.5. SPD never touches damage.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276, :2286-2296, :2344-2347 (web); clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:1841, :1854-1861, :1915-1919`
- **Quote:** StatsManager.as:1841  return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;
StatsManager.as:1860  return 1 - speed / 300 * 0.5;        [web §1t1523s0§.as:2295 = /600]
StatsManager.as:1917  var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
StatsManager.as:1918  return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L4 blocker ① dies in full. CROSS-LANE GIFT to L1 combat-core blocker ① ("reach cap in stage px per stance — the one value the whole model needs"): the base slash-length getter is a SPD formula with a hard floor of 120 and a Dan-0 asymptote of 210, with per-stance modifiers applied on top. Also closes skills-meters blocker ④ (SPD→cooldown formula).

### `progression/xp-curve-l11-80` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete L1→L99 cumulative XP table is a literal array on disk in BOTH payloads (byte-identical), so the L11–80 curve the ledger calls "likely unrecoverable" and lists under §6 "structurally UNRECOVERABLE" is fully held.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (web v0.717; duplicated at §1t29s0§.as:28) and reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000, … ,19295800,22095800,25395800,29395800];  — 99 entries; expArray[11]=37400, [20]=108000, [40]=507300, [60]=1508800, [80]=4285800, [98]=29395800
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4 progression blocker ② dies outright; §6's "structurally UNRECOVERABLE" list loses the L11–80 XP curve line (line 350).

### `progression/xp-income-model` — HELD [A2] ⚑ OVERTURNS LEDGER

The full XP-income model is held: base XP per mob, a grey-level cutoff, a +3-level cutoff, symmetric under/over-level scaling, elite ×2, a sub-level-10 duellist ×3 boost, and an XP-buff ×1.5.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:166-190 (calcXP), :94-109 (getGreyLevel), :112-164 (getZeroDifference), :218/:252 (mob base xp); EnemyPlayer.as:1307-1327; LootDialog.as:640-642`
- **Quote:** NPC.as:166-190  public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : * { if(mobLevel <= getGreyLevel()) { return 0; } if(mobLevel - playerLevel > 3) { return 0; } var finalXP:int = xp; if(playerLevel < mobLevel) { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); } else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); } if(elite) { finalXP *= 2; } return finalXP; }
NPC.as:218  this.xp = this.level * 2 + 20;   [web parity §1t4574s0§.as:39 "xp = level * 2 + 20;"]
ConnectionPIO.as:643 / §1t4902s0§.as:26  lvl * 5
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4 blocker ④ largely dies (kill + quest sides fully held). Confirms src/config/duel.ts:55-56 XP_PER_LEVEL=5 / XP_REWARD_BASE=45 against the payload. Also feeds L7 economy blocker ① ("20+ samples show no XP formula either") — the formula is now held.

### `progression/frame-confirms-xp-caps` — HELD [A1]

Opened the primary video first-hand: the on-screen XP bar reads the payload's numbers exactly (expArray[3]=2950, expArray[4]=5150) — payload and frame AGREE, no conflict to adjudicate here.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 (video A, 1920×1080), ffmpeg -ss 1600 and -ss 655; crops crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7× lanczos (stat block) and crop=iw*0.55:ih*0.22:iw*0.42:ih*0.09 scale=1.8× (XP row)`
- **Quote:** Visibly in the t=1600s crop: fan level badge "4", gold XP bar "5110 / 5150" captioned EXPERIENCE POINTS, "AVAILABLE STAT POINTS: 0", HP 20 / 20 (green), CHI 9 / 15 (blue), AP 15 / 30, ATK 10, DEF 10 + 13 (the +13 orange = gear), SPD 4, WEIGHT: 73 / 100. Visibly in the t=655s crop: level badge "3", "2098 / 2950 EXPERIENCE POINTS", AVAILABLE STAT POINTS: 0, WEIGHT 38/100.
- **Lane impact:** L4: independent on-screen confirmation of the payload XP table; supplies the stat readings that arbitrate the build conflict in progression/per-point-magnitudes.

### `progression/l1-l10-caps-confirmed` — HELD [A3]

The frame-derived XP_THRESHOLDS already in config is EXACTLY the payload's expArray[1..10] — the video study got all ten right, which is what licenses trusting the frames elsewhere in this lane.

- **Cite:** `tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly`
- **Quote:** ✓ tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly 1ms
 Test Files  1 passed (1)      Tests  11 passed (11)   — config holds [550,1450,2950,5150,8350,12150,16350,20900,25900,31400], identical to expArray[1..10]
- **Lane impact:** L4: confirms the ledger's "L1–L10 XP caps" Ready bullet and upgrades it from frame-INFERRED to payload-CONTRACT.

### `progression/levels-81-99` — STILL_UNHELD [STILL_UNHELD]

Whether levels 81–99 were ever reachable is not held: expArray carries 99 entries (up to 29,395,800) but levelCap=80 gates both XP credit and level-up, and no UI, quest, item or string references a level above 80.

- **Lane impact:** L4: keeps one honest blocker on the board. Treat expArray[81..98] as dead headroom; do NOT port them as reachable levels.

### `progression/levelup-refill-and-cap` — HELD [A2]

"Full refill per level" is right and under-specified — levelUp() refills HP, Chi, AP AND duel tokens; and level cap 80 is enforced twice (XP is simply not credited past it, and a level jump past it is reported as a cheat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:76, :1619-1628, :1646-1692; reference/decompiled/shs3_android/scripts/LootDialog.as:644-647`
- **Quote:** StatsManager.as:76 "public static var levelCap:int = 80;" · :1688 "fullHealth();" · :1689 "setStat(STAT_AP,getPlayerStats(STAT_MAXAP));" · :1690 "setStat(STAT_DUELTOKENS,MAXDUELTOKENS);" · :1619 "if(!consoleEnabled && newlevel > levelCap) { QueryManager.instance.reportHack("changeXP levelcap"); }" · LootDialog.as:644 "if(StatsManager.getLevel() < StatsManager.levelCap) { this.lootXP.changeIntValue(num); }"
- **Lane impact:** L4: extends the Ready bullet (duel tokens refill too). Also newly surfaced: an autoAssignStats mode (StatsManager.as:1655-1687) that round-robins the 3 points through [MAXHP,MAXCHI,ATTACK,DEFENSE,SPEED,MAXAP] starting at getLevel()%6, and a Dan cap of 9 (:2209) ⇒ 10 Dan ranks, rebirth paying +5 gold or +20 at Dan 8 (:2201-2208) — the last is a cross-lane gift to rebirth-elements blocker ③ (count only, not titles).

### `progression/per-stat-hard-caps` — HELD [A2]

Stats are hard-capped by character level — HP < 10+(L+10)*10, Chi < 10+(L+10)*5, AP < 30+(L+10)*5, ATK/DEF/SPD < 1+(L+10)*3 — a mechanic the ledger's progression block does not mention at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Quote:** var _loc3_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) < 10 + (_loc2_ + 10) * 10;
var _loc4_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) < 10 + (_loc2_ + 10) * 5;
var _loc5_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) < 30 + (_loc2_ + 10) * 5;
var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;
- **Lane impact:** L4: a whole missing sub-system for the ledger's Ready list — at L80 the ceilings are HP 910, Chi 460, AP 480, ATK/DEF/SPD 271.

### `progression/start-pools-and-respec` — HELD [A2]

Start pools HP10/Chi10/AP30 are correct and now carry a payload cite, plus the two missing entries ATK 1 / DEF 1 / SPD 1; the same function is the game's respec, which is free, total, and refunds (level-1)*3 points.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2559-2578 (web), clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:2118-2138`
- **Quote:** public static function unAssignStatPoints() : *
{
   setPlayerStats(STAT_MAXHP,10);
   …
   setPlayerStats(STAT_MAXCHI,10);
   …
   setPlayerStats(STAT_ATTACK,1);
   setPlayerStats(STAT_DEFENSE,1);
   setPlayerStats(STAT_SPEED,1);
   …
   setPlayerStats(STAT_MAXAP,30);
   setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
}
- **Lane impact:** L4: confirms a Ready bullet with an A2 cite and adds ATK/DEF/SPD start values plus a respec mechanic the ledger omits.

### `progression/unlock-cadence-to-l80` — HELD [A2]

The unlock cadence is held all the way to L80, not just to L10 where both longplays stop — 33 character-level gates plus a 52-row skill prerequisite graph the ledger never mentions.

- **Cite:** `reference/extracted/skilldata.xml:257 (<lvlreq>3</lvlreq>, id 1004 Roll) through skilldata.xml:1640 (<lvlreq>80</lvlreq>, id 1055 Mass Shadow Clone); index docs/gauntlet/L0/index/skilldata.json paths skilldata/skill/lvlreq (33, range 3–80) and skilldata/skill/req/has/id (52)`
- **Quote:** skilldata.xml:257 "<lvlreq>3</lvlreq>" … skilldata.xml:1640 "<lvlreq>80</lvlreq>". Full ladder measured this pass: L3 Roll · L5 Focus, Skill Slots+, Carrying Weight+, Coin Purse+, Farming, Scavenging, Mining · L10 Throw Kunai · L15 Slash Wave, Lay Trap · L20 Smoke Bomb, Fire Breath, Ground Punch, Wind Combo, Water Stomp · L25 Chi Kick · L30 Windmill Shuriken · L35 Spirit Thief · L40 Flashbang · L45 Chi Burst · L50 Shadow Clone, Chi Charge, Inferno, Tsunami, Tornado, Earthquake · L55 Charged Shot · L60 Stealth · L65 Heavenly Sword · L70 Substitution Jutsu · L75 Deadly Touch · L80 Mass Shadow Cl
- **Lane impact:** L4: upgrades the "unlock cadence" Ready bullet from an L1–L10 observation to a complete L3–L80 table. Two gates are themselves progression systems: getSkillSlotCount() = 3 + getStat(1008) (StatsManager.as:2293-2295) and getCarryingWeight() = 100 + getStat(1009)*20 (:2298-2300) — the frame's WEIGHT: 73 / 100 is the un-upgraded base.

### `progression/xp-from-gather-and-dungeon` — PARTIAL [A2]

For gathering (mine/farm/forage) only the plumbing is held — XP arrives as a quest outcome or an item-modifier value, not via a dedicated gather-XP formula, and the one filmed mining session awarded none.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLQuestOutcome.as:66 and InventoryUI.as:906; corroborated by docs/research/video-study/segments/A-04-mines-takahasi-coal-mining-quest.md line 32`
- **Quote:** XMLQuestOutcome.as:66  OverworldHUD.instance.lootDialog.addLootXP(this.modify);
InventoryUI.as:906  StatsManager.changeXP(item.modifierXML[i].value);
A-04 line 32: "XP bar unmoved at 2098/2950 (level 3) for entire segment — no XP awarded from mining or quest steps shown."
- **Lane impact:** L4: blocker ④'s gather/dungeon sub-clause survives as a PARTIAL — the delivery path is held, a per-gather-action XP number is not, and on the A-04 evidence may not exist at all.

## quests-story — re-scored 78

42 -> 78. Additive gains: the full script + branching graph is on disk and renders literally (Q-01); all 14 chapters ship, not 4 (Q-02); triggers/coords/rewards are fully tabled and the loot ids name-resolve (Q-03); the choice-consequence question is ANSWERED rather than open (Q-04); the Android-version caveat is retired by a byte check (Q-05); the cutscene director is a closed 15-verb instruction set (Q-12); an entire unlisted ally-wave subsystem is held (Q-11). Held back from 85+ by three real gaps: the shipped web build's Prologue dialogue is REWRITTEN relative to questdata.xml (Q-06 — the frame wins, so line-level fidelity is only guaranteed where a longplay shows the scene), plus two unnamed enums (step <action> semantics, Q-14; <outcome><id> flag namespace, Q-15). Not 90+: <img> portraits and <bg> backdrops are referenced by token only — the art itself is a separate recovery problem.

### `quests-story/ally-waves-unlisted-system` — HELD [A2] ⚑ OVERTURNS LEDGER

An entire subsystem is missing from the §4 block: scripted ALLIES in quest waves — 70 <wave><friend> entries resolving to Fumio x16, Yuudai x15, Satoshi x14, Old Guard x6, Soldier x8, Mitsuo/Hachimaru/Shou x3 each, Hiroshi, Chikako; 59 of 70 carry <fatal>0</fatal> (allies knock down, do not die). The same table gives 151 <enemy> rows (lvl 2-35, qty 1-10, spawn x -400..2000) and 4 <endless> waves.

- **Cite:** `reference/extracted/questdata.xml — 70 <wave><friend> / 151 <wave><enemy> / 2 <wave><neutral>, ids resolved via docs/gauntlet/L0/index/resolved_names.json`
- **Quote:** FRIEND ids: 164 Fumio x16 · 168 Yuudai x15 · 161 Satoshi x14 · 90 Old Guard x6 · 807/806 Soldier x4 each · 197 Mitsuo x3 · 181 Hachimaru x3 · 182 Shou x3 · 144 Hiroshi x1 · 811 Chikako x1. NEUTRAL: <id>118</id> = Training Dummy.
- **Overturns:** "- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN must spawn allies; L4 ENEMIES+AI gains a per-quest encounter table (151 rows with level and spawn x) and an ally-AI requirement its §4 block never mentions.

### `quests-story/choices-not-consequential` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (4) is ANSWERED and the answer is no: the engine supports per-choice outcomes (XMLQuestChoice.applyOutcome) but ZERO of the 471 shipped choices carry <outcome> — all 471 are pure <goto> jumps, only 7 are condition-gated, and the Prologue's two branches reconverge on the same <label> and the same terminal <outcome>.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestChoice.as:38-47 + reference/extracted/questdata.xml:146-185 (measured over all 471 <choice> blocks)`
- **Quote:** public function applyOutcome() : * { var max:int = this.outcome.length(); for(var i:int = 0; i < max; i++) { outcomeXML = new XMLQuestOutcome(this.outcome[i]); outcomeXML.applyOutcome(); } }  ||  measured: <goto> 471/471 · <outcome> 0/471 · <condition> 7/471 · <gotolabel> 0/471
- **Overturns:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN — the choice graph is a flat jump table, not a consequence system; drops a large chunk of L1's assumed runtime risk.

### `quests-story/cutscene-director-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The cutscene director is fully recovered: 55 <cutscene> blocks, 399 timed commands, and a CLOSED 15-verb instruction set with time (0-8 s), actor handle, param and x (-200..1600) — including 23 `sound` cue points and 7+7 addemitter/removeemitter particle calls.

- **Cite:** `reference/extracted/questdata.xml:27414-27420 (+ measured verb histogram over all 399 <data> commands)`
- **Quote:** <data>\n  <time>0</time>\n  <id>fig1</id>\n  <action>create</action>\n  <param>814,shoulderweapon,1</param>\n  <x>220</x>\n</data>  ||  verbs: anim 107 · walk 76 · create 75 · end 33 · sound 23 · say 16 · createprojectile 16 · face 13 · remove 10 · addemitter 7 · removeemitter 7 · pose 6 · darkblur 6 · setposition 3 · createobject 1
- **Overturns:** "- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN — the cutscene director is a 15-opcode interpreter, fully specified. L7 AUDIO gains 23 exact cue points; L6 ART gains a named particle-emitter requirement its blocker list calls uncatalogued.

### `quests-story/ep4-12-epilogue-shipped` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (2) is dead: Episodes 4-12 and the Epilogue all ship with full step chains, cutscenes, waves and rewards; the ONLY unshipped chapter is Season 2, and the payload says so in its own words.

- **Cite:** `reference/extracted/questdata.xml:8521, :24869, :27347, :27697, :27710, :27726`
- **Quote:**   <title>Episode 4</title> / <title>Episode 12</title> / <title>Epilogue</title> / <title>Season 2</title> / <title>(Unreleased) The adventure continues...</title> / <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
- **Overturns:** "Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L1 CAMPAIGN — scope is Prologue -> Ep1-12 -> Epilogue (14 chapters), tripling the campaign the ledger planned to build.

### `quests-story/frame-beats-payload-dialogue-rewritten` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

FRAME BEATS PAYLOAD: the shipped build's Prologue dialogue is REWRITTEN relative to questdata.xml — of six comparable strings in one scene, 1 is exact, 1 near-exact and 4 are different wording, while the structure (speakers, beat order, exactly two choice rows, reconvergence) matches perfectly. questdata.xml is a script-COMPLETE, near-verbatim source, not a byte-verbatim one, and I say so out loud: where the frame and the payload disagree, THE FRAME WINS.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=62/66/68/72/76 s, 1920x1080 frames, crop (0,700)-(1400,1060) [bottom parchment dialogue box + nameplate tab], 5-up sheet at 640x360/panel — scratch: /private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/qframes/sheet.png`
- **Quote:** VISIBLE IN CROP t=62, nameplate JINBEI: "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." vs questdata.xml:128 "Ah! A new face in this territory!..." (DIFFERENT). t=68, nameplate GUEST, two stacked rows: "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." (= :149 EXACT) / "THESE BANDITS DON'T SCARE ME!" (vs :153 "They'll get nothing from me!" DIFFERENT). t=72: "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST..." (vs :183 which prefixes "I say "). t=76 JINBEI: "THAT'S TOO BAD, TRAVELER, IT REALLY IS.
- **Overturns:** "| §4 quests-story: *"verbatim dialogue — captured NOWHERE"*; §6: *"structurally unrecoverable"* | `questdata.xml` — **2,771 `<dialogue>` blocks, 3,307 verbatim `<text>` lines, 471 `<choice>`**, full `<cutscene>` direction |"
- **Lane impact:** L1 CAMPAIGN — its done-criterion 'all 3,307 lines present byte-exact' is now known to NOT equal on-screen fidelity for at least the Prologue. L1 must add a frame-reconciliation pass for every scene visible in the two longplays, and must label the rest 'payload wording, may differ from shipped build'.

### `quests-story/quest-log-cap-is-a-row-count` — HELD [A2] ⚑ OVERTURNS LEDGER

'QUEST_LOG_CAP = 7 (1 story + 6 side)' is a misread of a UI row count — the 7 is the number of visible scroller rows (x=60, y=73+55i) over an unbounded activeQuests list with scroll-up/down buttons; a grep for an accept-time cap finds only a selection-index clamp.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestLogUI.as:88-96 (+ :525, :553)`
- **Quote:** this.questLogButtonList = new Vector.<QuestLogButton>(); for(i = 0; i < 7; i++) { tempQuestLogButton = new QuestLogButton(i); tempQuestLogButton.x = 60; tempQuestLogButton.y = 73 + i * 55; ... }  ||  :553 this.questScrollDownButton.visible = this.activeQuests.length - this.currentRow > length;
- **Overturns:** "QUEST_LOG_CAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN + L8 UI — ship a 7-row scroller with exact geometry (x=60, y=73+55i); do NOT ship a 7-quest limit.

### `quests-story/questtype-taxonomy-wrong` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 'archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)' is the wrong taxonomy: the engine's QuestType is a 9-value enum containing none of trade/bounty/escort/gather/timed, and the 61 shipped quests use only 3 of the 9 (StoryQuest 37, Dialogue 22, NormalSideQuest 2).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestType.as:6-24 + measured <type> over the 61 quests in reference/extracted/questdata.xml`
- **Quote:** public static var NormalSideQuest:int = 0; public static var RepeatableSideQuest:int = 1; public static var StoryQuest:int = 2; public static var DailySideQuest:int = 3; public static var Dialogue:int = 4; public static var ClanQuest:int = 5; public static var OngoingQuest:int = 6; public static var HighLvlQuest:int = 7; public static var LowLvlQuest:int = 8; public static var length:int = 9;  ||  measured {2:37, 4:22, 0:2}
- **Overturns:** "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"
- **Lane impact:** L1 CAMPAIGN — build the 9-value enum, not the invented 7; note that types 1/3/5/6/7/8 are produced at runtime by QuestGenerator.as and never authored in questdata.xml. Also touches L11 (ClanQuest).

### `quests-story/reward-and-roster-undercount` — HELD [A2] ⚑ OVERTURNS LEDGER

Two 'Ready' bullets under-claim badly: there are 77 <reward> blocks (69 <exp> + 18 <loot>), not '9 reward tuples'; and the character roster is 68 distinct <img> portrait tokens including emotional variants (mitsuo_dying, yasuka_hurt, jinbei_angry, chikako_blush, magoichi_masked, yuudai_before), i.e. a complete story-mode portrait manifest.

- **Cite:** `reference/extracted/questdata.xml — measured: 77 <reward>, 69 <exp> {100,200,250,290,500,600,750,1000,2000,3000}, 18 <loot>, 68 distinct <img>`
- **Quote:** top <img> tokens by use: kojuro 213 · yuudai 210 · satoshi_serious 209 · fumio 177 · satoshi 176 · chikako_mask 77 · hiroshi 65 · hachimaru 65 · mitsuo 52 · fumio_happy 52 · chikako 47 · yasuka 41 · shinmen 33 · tanaka 32
- **Overturns:** "turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles"
- **Lane impact:** L1 CAMPAIGN gets the exp/loot table; L6 ART gets a closed 68-asset portrait manifest to draw against.

### `quests-story/triggers-coords-rewards-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (3) is dead: per-quest triggers, coords and rewards are fully tabled — 225 <step> with <node>+<roomobj>, 215 <action> over a closed 5-value domain, 348+52+14+97 coordinate fields, and 77 <reward> blocks (69 <exp> over a closed 10-value domain, 18 <loot> rows) whose item ids all resolve to names.

- **Cite:** `reference/extracted/questdata.xml:442-456 (+ docs/gauntlet/L0/index/resolved_names.json)`
- **Quote:** <reward>\n <loot>\n  <id>13100</id>\n  <qty>1</qty>\n  <chance>1</chance>\n </loot>\n <loot>\n  <id>2103</id>\n  <qty>5</qty>\n  <chance>1</chance>\n </loot>  -> 13100 = "Iron Sword", 2103 = "Small Rice Ball"
- **Overturns:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L1 CAMPAIGN — the quest state machine can be generated from data instead of hand-authored; L9 WORLD gets 225 node ids + 14 teleport coords for free.

### `quests-story/verbatim-script-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The verbatim story script is NOT gone and NOT server-fetched: 2,771 <dialogue> blocks / 3,307 <text> lines sit as static XML in the client payload, and LangManager.getQuestString returns non-"ID" strings unchanged, so those lines are what the game renders.

- **Cite:** `reference/extracted/questdata.xml:128 (+ reference/decompiled/shs3_android_payload/scripts/LangManager.as:95-100)`
- **Quote:** <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>  ||  public static function getQuestString(id:String) : String { if(id.charAt(0) != "I" || id.charAt(1) != "D") { return id; }
- **Overturns:** "**Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** L1 CAMPAIGN — the dialogue corpus is an input, not a writing task. Also deletes the top entry of REBUILD_READINESS.md §6.

### `quests-story/android-caveat-retired` — HELD [A3]

The standing Android v0.682-vs-web v0.717 caveat DOES NOT apply to quests-story: the web questdata.xml and the Android 116_Mobile_QuestData.bin are byte-identical apart from one trailing newline, which legitimises using the Android bundle's 53 named quest classes (the web payload's ActionScript is obfuscated and holds none).

- **Cite:** `cmp + sha256 of reference/extracted/questdata.xml vs reference/extracted/android/116_Mobile_QuestData.bin`
- **Quote:** $ cmp reference/extracted/questdata.xml reference/extracted/android/116_Mobile_QuestData.bin\ncmp: EOF on reference/extracted/questdata.xml\nandroid len 796384 web len 796383 · android[:-1]==web ? True · android last byte b'\\n'\nsha256 web        e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e\nsha256 android[:-1] e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e
- **Lane impact:** L1 CAMPAIGN + L1b — quest DATA needs no build label; quest CODE ported from shs3_android_payload should still be labelled v0.682.

### `quests-story/outcome-id-namespace` — STILL_UNHELD [STILL_UNHELD]

I could not ground the <outcome><id> global-variable namespace: 194 <set> rows write 28 distinct ids (42..40002) and startcondition/has reads them back, but I did not open XMLQuestOutcome.as or StatsManager.checkConditions, so any mapping of id ranges to 'story flags' / 'quest items' / 'stats' would be a guess.

- **Lane impact:** L1 CAMPAIGN + L9 WORLD (save schema) — the quest flag namespace is the save-game's story section. Close-path: read XMLQuestOutcome.as + StatsManager.checkConditions in reference/decompiled/shs3_android_payload/scripts/.

### `quests-story/player-name-satoshi-resolved` — HELD [A1]

The 'player named Satoshi' contradiction is RESOLVED: the player has no canonical name (the dialogue nameplate is the account name — 'GUEST' unauthenticated, 'SOUND360TM' in the other longplay), speaks as <id>-2</id>, and Satoshi is NPC id 161, a portrait-bearing companion who fights beside the player in 14 quest waves.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=68 s, crop (0,700)-(1400,1060) [nameplate tab reads GUEST]; reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg [PLAYER sheet, name field reads SOUND360TM]; corroborated A2 reference/extracted/questdata.xml:158`
- **Quote:** VISIBLE IN CROP: the black nameplate banner above the player's own two choice rows reads "GUEST"; the PLAYER character-sheet frame shows "SOUND360TM" over the paperdoll. questdata.xml:158 <id>-2</id> is the player speaker id; 'satoshi*' appears 406x as an <img> portrait token and resolves to NPC id 161 "Satoshi", 14x as <wave><friend>.
- **Lane impact:** L1 CAMPAIGN — the dialogue box must substitute the player's chosen name for speaker id -2; Satoshi is an ally NPC to spawn, not the PC.

### `quests-story/step-action-enum-semantics` — STILL_UNHELD [STILL_UNHELD]

I could not ground the SEMANTICS of <step><action>: the domain is measured ({0:169, 1:37, 6:5, 14:3, 4:1} over 215 rows) and QuestAction.as:49 reads it, but I did not find the enum mapping those ints to behaviours (talk-to / kill / gather / enter-room). Per-step trigger TYPES are therefore enumerated but not named.

- **Lane impact:** L1 CAMPAIGN — blocks generating the quest state machine's trigger dispatch. Close-path: trace QuestAction.action consumers in InteractUI.as / GenericActionButton.as / Obj_NPC.as under reference/decompiled/shs3_android_payload/scripts/. One focused pass.

### `quests-story/two-yasukas-confirmed` — HELD [A2]

The 'two Yasukas = one person' Ready bullet holds, now on a payload cite rather than inference: exactly one NPC resolves to the name 'Yasuka' (id 156), and questdata uses two portrait tokens for her (yasuka, yasuka_hurt) — one character, two emotional states.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> npcdata.xml resolved: id 156; reference/extracted/questdata.xml:1508 <img>yasuka</img>`
- **Quote:** resolved NPC name matches for 'yasuka': [('156', 'Yasuka')] — exactly one. questdata portrait tokens: yasuka x41, yasuka_hurt x10.
- **Lane impact:** L1 CAMPAIGN — no disambiguation work needed; L4 gets one NPC row, not two.

## rebirth-elements — re-scored 88

Ledger scored this 30/100 with five blockers. Blockers (1) what each element does, (2) elemental ATK-vs-DEF formula, (3) Dan-rank count/titles, and (4) Dragon Dance input + Kanji-statue bonus are all fully answered by files already on disk; blocker (5) the element-picker UI is answered as data/flow/copy/icons, with only its ART still unheld. §3 correction #7 is disproven by the real v0.717 client. Three cross-lane numbers the ledger files nowhere (Dan-scaled slash length in stage px, +79 SP/Dan, +10 bank weight/Dan) are recovered. Remaining gaps are narrow and named: elementCircle art (no frame exists), per-element status effects (unverified either way), statue placement join, and v0.717 parity for the per-stance slash multipliers. 88, not higher, because the art gap is genuinely unclosable from held material and one number block is android-only.

### `combat-core/dan-scaled-slash-length` — HELD [A2] ⚑ OVERTURNS LEDGER

The base slash length is an exact formula in stage pixels that is scaled by Dan rank, so the combat-core 'reach in units of unknown scale' blocker is answered and its ceiling is owned by the rebirth system.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1919, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348; BankUI.as:264`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int\n{\n   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;\n   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));\n}
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core blocker ① — units are stage pixels, floor 120, asymptote 210 px at Dan 0 rising to 255 px at Dan 9. Bank weight is 100 + DAN*10 + PAIDSTORAGE*10. Both are corroborated by the game's own prompt (string 610: 'Slash length and bank storage is increased with each dan rank').

### `progression/post-rebirth-sp-economy` — HELD [A2] ⚑ OVERTURNS LEDGER

The post-rebirth skill-point economy is an exact formula, SP = (level−1) + DAN×(levelCap−1) = (level−1) + DAN×79, which also shows the ledger's '80 SP first run' is one too many.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2156, desktop confirm §1t1523s0§.as:2598; levelCap=80 at StatsManager.as:76`
- **Quote:** setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
- **Overturns:** "③ post-rebirth SP economy;"
- **Lane impact:** progression blocker ③ closed, and its Ready bullet '80 SP first run' corrected to 79 at L80/Dan 0. A Dan-10 L80 character has 790 SP.

### `rebirth/aoe-radii-per-element` — HELD [A2] ⚑ OVERTURNS LEDGER

The four ultimates have different AoE radii and different launch types, so they are not reskins of each other.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BigFireBreathProjectile.as:32, BigWaveProjectile.as:34, BigTornadoProjectile.as:33, BigEarthquakeProjectile.as:68, BigTornadoProjectile.as:24`
- **Quote:** BigFireBreathProjectile.as:32   NPCManager.checkHitObject(this,damageObj,600);\nBigWaveProjectile.as:34         NPCManager.checkHitObject(this,damageObj,400);\nBigTornadoProjectile.as:33      NPCManager.checkHitObject(this,damageObj,200);\nBigEarthquakeProjectile.as:68   NPCManager.checkHitObject(this,damageObj,50);
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (AoE half). Inferno 600 / Tsunami 400 / Tornado 200 / Earthquake 50-per-rock; Tornado is LAUNCH_AIR while the other three are LAUNCH_KNOCKDOWN. Carried from PASS 1 and re-verified verbatim.

### `rebirth/dan-achievements-prove-ten` — HELD [A2] ⚑ OVERTURNS LEDGER

The achievement table independently proves the ladder tops out at a displayed Dan 10: achievement 51 fires at STAT_DAN==9 with the description 'Reach Dan 10.'

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin:463-470 + strings 8044/8124`
- **Quote:** <id>51</id>\n<name>8044</name>\n<desc>8124</desc>\n<stat>25</stat>\n<val>9</val>      → 8044='Ultimate Warrior', 8124='Reach Dan 10.', stat 25=STAT_DAN
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + meta-social: MAX_DAN_RANK=10 becomes CONTRACT; the four Dan achievement rows also drop straight into meta-social blocker ③.

### `rebirth/dan-ladder-titles` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dan ladder is fully recovered: STAT_DAN 0..9 displays as Dan 1..10, with kanji titles 初段…十段 (strings 455–464) and the kendo shogo suffixes Renshi / Kyoshi / Hanshi (465/466/467) awarded at STAT_DAN 3-5 / 6-7 / 8-9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2285-2288 + StatsManager.as:2209-2211 (desktop confirm §1t1523s0§.as:2653-2655), joined to docs/gauntlet/L0/index/strings.json:455-467`
- **Quote:** case 3:\n   nametext += " <font color='#7D5500'>" + LangManager.getString(465) + "</font>";\n   this.danfield.text = LangManager.getString(458);   // 465='Renshi', 458='(四段)'
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements blocker ③ closed outright. Also explains the wiki garble the ledger complains about in §3 #7: 九段 (kyudan) is STAT_DAN 8 / displayed Dan 9 — the wiki collapsed two numbering layers.

### `rebirth/dragon-dance-bagua-input` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance input is an 8-node bagua click ring with two named arrangements, and clicking the four elemental nodes {1,2,4,6} is what flips Earlier Heaven to Later Heaven.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:70-71, :354-355, :367-369, :302-334, :447`
- **Quote:** this.earlierHeavenLabel = ["sky","wind","water","mountain","earth","thunder","fire","lake"];\nthis.laterHeavenLabel = ["fire","earth","lake","sky","water","mountain","thunder","wind"];\n…\nif(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean(this.clickedArray[6]))
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ (input half). The four tier-3 passives 1056/1057/1058/1059 teach precisely nodes 6/2/1/4 — exactly the set that opens Later Heaven — which is the whole design rationale for rebirthing into all four elements. Carried from PASS 1, re-verified.

### `rebirth/dragon-dance-teachable` — HELD [A2] ⚑ OVERTURNS LEDGER

Dragon Dance steps are a player-to-player transmission mechanic, and the game's own name for the second bagua arrangement is 'Later Heaven' — neither fact appears anywhere in the ledger.

- **Cite:** `docs/gauntlet/L0/index/strings.json:6117, 6125, 750`
- **Quote:** 6125 = 'Unlocks the Dragon Dance Step for Fire (Later Heaven) and gives you the ability to teach it to others.'
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ + meta-social: the Dragon Dance is a social propagation system, not a solo unlock, so a single-player recreation must decide how to substitute the teaching loop.

### `rebirth/element-counter-wheel` — HELD [A2] ⚑ OVERTURNS LEDGER

Your ATK in one element IS your defence against another — a rock-paper-scissors wheel that makes choosing a rebirth element simultaneously a choice of what you become immune to.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1836, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270; parameter order from MCSPlayer.as:260`
- **Quote:** player.initElementDefenseStats(getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),getPlayerStats(STAT_WINDATK) + findBonusStat(STAT_WATERDEF),getPlayerStats(STAT_FIREATK) + findBonusStat(STAT_EARTHDEF));
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements blocker ② (the DEF half) and the Surface bullet's 'elements are TWO systems' note — the gear side and the rebirth side are the SAME stat ids (28-31 ATK, 200-203 DEF gear affixes), which is the link the ledger says was never made. Carried from PASS 1, re-verified in both bundles.

### `rebirth/element-picker-uidata` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth/element-picker UI is held as shipped DATA — a two-menu flow whose second menu is four buttons labelled 'Fire ATK' / 'Earth ATK' / 'Wind ATK' / 'Water ATK' in that on-screen order with icons 24/27/25/26, plus a Dan-10 short-circuit that skips the element menu entirely.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:94-105 (labels resolved via strings.json 507-510)`
- **Quote:** <option><label>1</label><icon>12</icon><condition><has><id>25</id><qty>9</qty><comp>gte</comp></has></condition><action><id>firerebirth</id></action></option> <!-- "yes" useicon >=10 dan, no element boost-->
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤ reduced from 'unknown UI' to 'unknown ART only'. The shipped dev comment '>=10 dan, no element boost' is a fourth independent confirmation of the 10-rank ladder.

### `rebirth/elemental-damage-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental skill damage is the caster's element ATK stat scaled by skill level {0.8, 0.9, 1.0, 1.1, 1.2} with a zero physical component, and ultimates deal x1.5.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FireBreathProjectile.as:15-52 and :51; Damage.as:50; BigFireBreathProjectile.as:23`
- **Quote:** if(skilllevel == 1) { scale = 1; damage *= 0.8; } … else if(skilllevel == 5) { scale = 1.4; damage *= 1.2; }\n…\ndamageObj = new Damage(0,0,2,-1,damage);   // signature: (damage, attackerlvl, launchType, stance, fireDamage, …) → physical 0
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (damage half). Carried from the PASS-1 journal and re-read line by line this pass; independently corroborated by the shipped tooltip '150% Fire ATK'. The FX sprite scale 1.0→1.4 moves in lockstep with the damage ladder.

### `rebirth/elemental-skill-tooltips` — HELD [A2] ⚑ OVERTURNS LEDGER

The 24 elemental skills are not 'names only' — the shipped tooltips state their AoE nature and damage magnitude in words, and skilldata.xml carries every Chi cost and cooldown.

- **Cite:** `docs/gauntlet/L0/index/strings.json:6143-6146 + reference/extracted/skilldata.xml:1880-1893`
- **Quote:** 6143 = 'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'   ·   skilldata.xml:1889 <chi>50</chi>  1890 <cooldown>60</cooldown>  1882 <lvlreq>50</lvlreq>
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① closed for damage/cost/AoE. Also closes skills-meters blocker ① for the elemental branch ('read skill cards in a preserved build' — no build needed). Tooltips also reveal traps/kunai consume kunai AMMO on top of Chi, a cost the ledger never records.

### `rebirth/kanji-statue-bonus` — HELD [A2] ⚑ OVERTURNS LEDGER

The Kanji-statue bonus is specified: 2 AP per attempt, 100 px interact range, a permanent node unlock, and a required sequence that is a deterministic RNG permutation of '1246' seeded on the map node id.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-62, :185, :224-226, :238-240`
- **Quote:** rng = new RNG(StageManager.getCurrentNode());\ndice = rng.rand(5);\nif(dice == 0) { sequence = "1246" + this.num; } … else if(dice == 4) { sequence = "6241" + this.num; }\n…\noverride public function getAPUse() : int { return 2; }
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ (statue half). The same statue in the same room always demands the same dance, but different rooms demand different permutations — reproducible offline from the node id alone. Carried from PASS 1, re-verified.

### `rebirth/mitigation-flat-min1` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental mitigation is flat subtraction with a hard min-1 floor per channel, summed with physical damage into a single HP loss.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3357 and :3420`
- **Quote:** var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;\nif(damageObj.fireDamage > 0 && fireDamage < 1) { fireDamage = 1; }\nelse if(fireDamage < 0) { fireDamage = 0; }\n…\nsetHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements blocker ② (the ATK-vs-DEF half) closed. Note the elemental floor is a hard 1, distinct from the physical getMinDamage() ladder — so the ledger's Ready bullet 'Undead/Red-Oni damage floor' is a different mechanism and should not be conflated. Carried from PASS 1, re-verified.

### `rebirth/stance-slash-multipliers-parity` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The per-stance slash-length multipliers are recovered (Light x1.5 fixed, Balanced x(1+0.005·mastery), Heavy x(0.5+0.005·mastery) floored at 100 px) but only in the android v0.682 bundle — I grepped the whole v0.717 desktop tree for the identical expressions and got zero hits, so parity is NOT established.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3081; negative grep over reference/decompiled/shs3_payload/scripts/ for '0.5 + 0.5 *', '1 + 0.5 *', '0.005' returned no matches`
- **Quote:** this.slashLength = this.baseSlashLength * 1.5;                                     // LIGHT\nthis.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);  // BALANCED\nthis.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);   // HEAVY\nif(this.slashLength < 100) { this.slashLength = 100; }
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** combat-core: mastery is a 0-100 percentage here, not 0-9, so the ledger's 'mastery-9 ceiling' framing needs re-checking in its own lane. Flagged PARTIAL rather than HELD because the numbers are v0.682-only and §A7 proves numbers moved between builds.

### `rebirth/string-table-resolved` — HELD [A2] ⚑ OVERTURNS LEDGER

Every display string this system needs — Dan titles, shogo suffixes, rebirth prompts, all 24 elemental skill names and descriptions, the element-button labels — is resolved on disk, so the PASS-1 journal's claim that the table is missing is retracted.

- **Cite:** `docs/gauntlet/L0/index/strings.json (from reference/extracted/android/118_Mobile_Lang_EN.bin, 2533 entries)`
- **Quote:** 610 = 'Are you ready to attain the next dan rank?\n\nYou will be reborn as a level 1 character while retaining your inventory, skill points and clan rank. Your current equipment will be automatically unequipped.\n\nSlash length and bank storage is increased with each dan rank.'
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: dissolves the PASS-1 survey's own stated blocker ('all display TEXT … NOT on disk'), which was auto-REFUTED by Stage-0b finding S0-3. Also feeds ui-hud and quests-story.

### `rebirth/tenth-gold-is-100` — HELD [A2] ⚑ OVERTURNS LEDGER

The real v0.717 desktop client pays +25 gold on every rebirth and +100 on the Dan 8→9 (displayed 9→10) rebirth, so both MAX_DAN_RANK=10 and tenthGold=100 are CONTRACT, not INFERRED.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 (§1t9426s0§=25=STAT_DAN at :254, §1t9413s0§=12=STAT_HGOLD at :228)`
- **Quote:** if(§1t7356s0§(§1t9426s0§) == 8)\n{\n   §1t9713s0§(§1t9413s0§,100);\n   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));\n}\nelse\n{\n   §1t9713s0§(§1t9413s0§,25);\n}
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy: promotes two config values from INFERRED to CONTRACT. Also the concrete evidence for the S0-3 build-parity caveat — the android v0.682 bundle uses 5/20 for the same two branches (StatsManager.as:2201-2207), so one in six checked numbers moved between 0.682 and 0.717; the desktop value wins.

### `rebirth/unlock-gate-is-stat-threshold` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance / elemental unlock gate is a stat threshold on element ATK at 10/30/60, not a rebirth count, so there are three tiers (1x/3x/6x) and the entire usable elemental kit lands on the FIRST rebirth into that element.

- **Cite:** `reference/extracted/skilldata.xml:1884 (qty 30), :1726 (qty 60), :985+ (qty 10); id 28 = STAT_FIREATK per reference/decompiled/shs3_android_payload/scripts/StatsManager.as:226; grant at InteractUI.as:849-855, desktop §1t401s0§.as:873-881`
- **Quote:** <req><has><id>28</id><qty>30</qty></has></req>      // id 28 = 'internal static var STAT_FIREATK:int = 28;'
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements Surface bullet corrected: the ledger drops the 1x tier, which is the one that opens each element's Kunai, Trap AND tier-2 attack. Gear affixes on stats 28-31 count toward the same threshold, and the Dan-8 rebirth grants +20, so the cadence is not a clean multiple of 3.

### `rebirth/element-circle-art` — STILL_UNHELD [STILL_UNHELD]

The element-picker circle's art, layout and colours remain unrecovered — no frame in any of the 113 frame directories shows the rebirth flow, the element circle, or a Dan title.

- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤, art half — this is the one clause of the ledger's rebirth block that fully survives. The 'frame wins' rule never fired in this lane because there is no frame to weigh against the docs. Close-path: locate the exported symbol for InteractUI's elementCircle MovieClip in the asset SWF, or accept a recreation-authored design and label it.

### `rebirth/element-status-effects` — STILL_UNHELD [STILL_UNHELD]

Whether elemental skills apply a status (burn / slow / root / DoT) beyond their launch type is unverified in either direction.

- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual. No burn/slow/DoT flag appears at any elemental Damage construction site, but I did not read NPCManager.checkHitObject or the BUFF_* system end to end, so I will not assert that none exists. Close-path: read Damage.as buff fields plus the BUFF_* constants in StatsManager.as.

## skilldata — re-scored 78

Re-score of the two systems this source owns.

skills-meters: ledger 33/100 -> 78/100. Four of its five blockers are dead on A2 evidence (① all 182 chi/cooldown rows verbatim; ② Shunpo's effect + gate + cost; ③ Focus = the reload meter, with max/fill/switch-cost all sourced; ④ the exact SPD->cooldown formula). Blocker ⑤ (crit proc rule) survives untouched, and one new open question appeared (the mastery domain in the reach formula), so this is not a 90+. The confidence is unusually high for a dead game because the payload's numbers reproduce the web longplay's on-screen cooldowns to the hundredth of a second at SPD=5 — three independent hits — and the android and web skilldata files are byte-identical (sha1 match). What remains for L2 is a transcription loop, not research.

rebirth-elements: ledger 30/100 -> 62/100. Blocker ① ('names only') is dead — all 24 elemental skills carry chi, cooldown and damage-as-%-of-element-ATK. Blocker ② is half-dead (ATK side sourced, DEF side not). The unlock gate is corrected from a rebirth count to a stat threshold (10/30/60), and Dragon Dance turns out to be 8 steps, not 4, and player-teachable. Blockers ③ (Dan-rank titles), ④'s input half, and ⑤ (the element-picker UI, never filmed) all survive, which caps this well below skills-meters.

Weighted across the 12 systems I cannot score — I only surveyed one source — so treat 78 as the skills-meters figure, not a board average.

### `combat-core/five-stances-not-three` — HELD [A2] ⚑ OVERTURNS LEDGER

The game shipped FIVE stances, not three: skills 1500 and 1501 are NPC-only stance selectors for REVERSED_STANCE and DUAL_STANCE, and the ledger contains zero occurrences of either word.

- **Cite:** `reference/extracted/skilldata.xml:1947-1957 and :1959-1969 (category 11, no displayname/desc/order/lvlreq); EnemyPlayer.as:836-843, EnemyElite.as:161-167, FriendlyElite.as:84-90`
- **Quote:** if(xml.getMastery(1500) > 0)\n{\n   setStance(REVERSED_STANCE);\n}\nelse if(xml.getMastery(1501) > 0)\n{\n   setStance(DUAL_STANCE);\n}\n\n(grep -i "reversed\\|dual" docs/research/REBUILD_READINESS.md returns nothing.)
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 combat-core (the damage/reach model is 3-stance and must become 5), L4 enemies-ai (two boss/elite stances with their own AI), L6 art-anim (S0-1's 'reversed' and 'dual_stance' bindata sets and android blobs 95_MCSCharacter_ReversedStanceAnimationData.bin / 101_MCSCharacter_DualStanceAnimationData.bin are these two).

### `combat-core/stance-reach-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The reach cap the ledger calls 'the one value the whole model needs' is in the payload in stage px: base = 120 + floor((90 + DAN*5) * SPD/(20+SPD)), multiplied per stance (Light x1.5 flat, Balanced x(1+0.005*mastery), Heavy x(0.5+0.005*mastery) with a hard floor of 100), and fed straight to InputManager.setMaxDistance as the max drawn-line length.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919; MCSPlayer.as:3030 / :3041 / :3052-3055 / :3067 / :3078-3081; consumed at MCSPlayer.as:3094`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int\n{\n   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;\n   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));\n}\n\n// MCSPlayer.as:3052-3055\nthis.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);\nif(this.slashLength < 100)\n{\n   this.slashLength = 100;\n}\n\n// MCSPlayer.as:3094\nInputManager.setMaxDistance(this.slashLength);
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 combat-core — blocker ① no longer needs a footage measurement. It also confirms the ledger's own :101 correction: Heavy's 100 is a hard FLOOR in the source, not a table entry. Light takes a flat x1.5 with no mastery term, so Light reach never scales with mastery.

### `economy/coin-cap-weight-cap-mining-tiers` — HELD [A2] ⚑ OVERTURNS LEDGER

Three hard economy ceilings and the full ore-tier ladder sit in skilldata's Survival category and are absent from the ledger's economy and items sections: coin cap 2000->10000, carrying weight 120->300 (not a flat 100), and mining tiers coal/iron through diamond.

- **Cite:** `reference/extracted/skilldata.xml:531-574 (1011 Coin Purse+, strings 7020-7023 + 7007), :420-498 (1009 Carrying Weight+, strings 7014-7018 + 7029-7033), :844-887 (1022 Mining, strings 7059-7063)`
- **Quote:** 7020-7023 + 7007 = "Coin purse is able to hold 2000/4000/6000/8000/10000 coins"; 7014-7018 + 7029-7033 = "Carrying weight: 120/140/160/180/200/220/240/260/280/300"; 7059-7063 = "Allows you to mine coal and iron deposits." ... "coal, iron, tin, copper silver, titanium and diamond deposits."  (7060 ships a verbatim typo: "coal, iron, tin and tin deposits.")
- **Overturns:** "- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4)."
- **Lane impact:** L10 progression+economy and L3 items — 'weight cap 100' is the BASE only; a fully invested character carries 300. The coin cap is a hard sink the economy model needs. Cat 5 also holds Farming (7039 rare-crop chance) and Scavenging (7040 hidden-item chance): three gathering professions, 5 levels each.

### `enemies-ai/npcs-run-on-skilldata` — HELD [A2] ⚑ OVERTURNS LEDGER

Enemy AI is driven by skilldata: NPCs pull their per-skill cooldowns from this file via getSkillData().getCooldown(), and their usage policy is four hard-coded range buckets containing the category-11 skills that appear in no player tree.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:825-829, :30/:32/:34/:36, :1079; EnemyElite.as:197-203; reference/extracted/skilldata.xml:1842-1847 (skill 1068)`
- **Quote:** EnemyPlayer.as:825-828\nskilldata = QuestEngine.getSkillData(skillList[i].getId());\nif(skilldata != null)\n{ this.cooldownArray[skillList[i].getId()] = skilldata.getCooldown(skillList[i].getValue()); }\n\nEnemyPlayer.as:1079  if(this.canUseSkill(SkillManager.SKILL_AIRSTAB) && downedDist > 50 && downedDist < 200)\nEnemyElite.as:197-203  if(!hasSkill(SkillManager.SKILL_UNDYING)) ... startAction(SKILL_UNDYING_STATE);\n\nskilldata.xml:1842-1847 — skill 1068 Undying is the ONLY skill in the file with no <level> block at all.
- **Overturns:** "① enemy level→stat formula… absent"
- **Lane impact:** L4 enemies-ai — the level->stat half is npcdata's to close, but the MOVESET + per-skill cooldown half is already held in skilldata (bucket sizes: veryClose 16, close 13, mid 22, long 16). Category 11's Back Throw / Air Stab / Bull Charge / Punch Lunge / Undying are enemy-only and appear in no ledger system.

### `meta-social/pvp-rooms-and-a-cut-steal-skill` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Two skills are explicitly excluded from PvP rooms, and a complete five-level coin-stealing ability exists in the shipped string table and art with NO skill row referencing it — but attributing it to the missing id 1023 is inference, not evidence.

- **Cite:** `reference/extracted/skilldata.xml:1575-1604 and :1637-1652 (strings 6111/6115); orphan strings 7024-7028 + 6022/6023 in docs/gauntlet/L0/index/strings.json; StealActionIcon.as:5-6 wired at GenericActionButton.as:191-193 and :309-311`
- **Quote:** 6111 = "Creates a clone to distract your enemy. / This skill cannot be used in PvP rooms."\n7024 = "Steal up to 5 coins from other players. If target is online, 50% chance to get caught." ... 7028 = "Steal up to 25 coins ... 30% chance to get caught."\n6022 = "Steal"  6023 = "Steal other players' money"\nGenericActionButton.as:191-193  case NodeUI.ACTION_STEAL: this.image = new StealActionIcon();\n\nNOT held: SkillManager.as has no SKILL_STEAL constant and no reference to 1023 anywhere in the AS3. skilldata.xml:887 closes skill 1022 and :890 opens <id>1024</id> — 1023 is the single gap in the 
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** L11 meta+rebirth and L8 ui-hud — per-skill PvP-room exclusion is a shipped rule the ledger's meta-social section does not carry. The steal content should be recorded as cut-or-node-only with orphaned strings, NOT as skill 1023; the id-1023 attribution is circumstantial (it sits exactly where the other 5-level cat-5 professions live) and I will not assert it.

### `progression/required-is-skill-points` — HELD [A2] ⚑ OVERTURNS LEDGER

The <required> field is the skill-point PRICE of that level, not a character level (that is the separate <lvlreq>), and each stance mastery is a 10-level ladder costing 1,1,2,3,4,5,6,7,8,9 SP = 46 SP to max.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:253-263 with strings.json["158"]; ladder at reference/extracted/skilldata.xml:10-79`
- **Quote:** required = int(this.levelList[lvl].required);\nif(StatsManager.getStat(StatsManager.STAT_SKILLPOINTS) < required)\n{ ... return outputString + (LangManager.getString(158) + ": " + required + "</font>"); }\n\nstrings.json["158"] = "Required Skill Points"\n\nskilldata.xml:73-79  <level><value>10</value><required>9</required><chi></chi><cooldown></cooldown><desc>7000</desc></level>
- **Overturns:** "the stance tables are **mastery-9 ceilings**, not base; Season 1 is **14 chapters**, not 4"
- **Lane impact:** L10 progression — makes the whole SP economy computable (ledger blocker ③ 'post-rebirth SP economy' still needs the post-rebirth grant, but the SPEND side is fully priced). Because levels 1 AND 2 both cost 1 SP, the ladder tops out 9 above its start, which is the likely origin of the wiki's 'mastery-9' framing the ledger repeats at :58 and :155 — the data says TEN levels.

### `rebirth-elements/24-elemental-skills-with-numbers` — HELD [A2] ⚑ OVERTURNS LEDGER

The 24 elemental skills the ledger has as 'names only' carry full numbers: 6 per element in categories 7-10, with exact chi, cooldown and per-level damage stated as a percentage of that element's ATK stat (80/90/100/110/120% for the close-range attack, 150% for the AoE ultimate).

- **Cite:** `reference/extracted/skilldata.xml:607-650 (1013 Fire Breath, 5 levels, chi 5/6/7/8/10, cd 15, descs 7034-7038) and :1879-1894 (1070 Inferno, chi 50, cd 60, desc 6143); strings 7034-7038 / 6143 via docs/gauntlet/L0/index/strings.json`
- **Quote:** 7034 = "Fire Damage: 80% Fire ATK"  7035 = "Fire Damage: 90% Fire ATK"  7036 = "100%"  7037 = "110%"  7038 = "120%";  6143 = "Area of Effect Fire Attack / Fire Damage: 150% Fire ATK". Water 7053-7057, Wind 7048-7052, Earth 7043-7047 are structurally identical with the same chi/cd ladders.
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L11 meta+rebirth — blocker ① dead; blocker ② ('elemental ATK-vs-DEF formula') half-dead, the ATK side is a straight percentage of the element ATK stat. Also L2: these 4 categories are 24 of the 75 skills and were never counted in skills-meters' '6-category tree'.

### `rebirth-elements/dragon-dance-is-eight-and-teachable` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

There are EIGHT Dragon Dance Steps, not four — each element has an Early-Heaven step (qty 30) and a 'II (Later Heaven)' step (qty 60), all passive, and every one of them is described as granting the ability to TEACH it to other players.

- **Cite:** `reference/extracted/skilldata.xml:1654-1669 (1056), :1722-1737 (1060) and the six parallel rows 1057-1059 / 1061-1063; strings 6117/6119/6121/6123/6125/6127/6129/6131`
- **Quote:** 6117 = "Unlocks the Dragon Dance Step for Fire and gives you the ability to teach it to others."  6125 = "Unlocks the Dragon Dance Step for Fire (Later Heaven) and gives you the ability to teach it to others."
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** L11 meta+rebirth — the unlock structure and a player-to-player TEACHING mechanic are now held (and the teaching mechanic is absent from the ledger's meta-social section entirely). The Dragon Dance INPUT itself and the Kanji-statue bonus remain unheld; skilldata says nothing about either.

### `rebirth-elements/element-gate-is-a-stat-threshold` — HELD [A2] ⚑ OVERTURNS LEDGER

The elemental-skill gate is a STAT threshold, not a rebirth count: req/has/id 28/29/30/31 are STAT_FIREATK/WINDATK/WATERATK/EARTHATK and the qty is a >= comparison, giving thresholds of 10 (kunai/trap/close-range), 30 (Dragon Dance Step + AoE ultimate) and 60 (Step II) — reachable through gear bonuses as well as rebirths.

- **Cite:** `reference/extracted/skilldata.xml:1658 (Dragon Dance Step: Fire) resolved via StatsManager.as:226-232 and StatsManager.as:4152-4177 (checkConditions defaults comp to "gte")`
- **Quote:** skilldata.xml:1658  <req><has><id>28</id><qty>30</qty></has></req>\nStatsManager.as:226  internal static var STAT_FIREATK:int = 28;\nStatsManager.as:228  internal static var STAT_WINDATK:int = 29;\nStatsManager.as:230  internal static var STAT_WATERATK:int = 30;\nStatsManager.as:232  internal static var STAT_EARTHATK:int = 31;\nStatsManager.as:4171-4174  if(has[i].comp.toString() == "") { comparison = "gte"; }
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L11 meta+rebirth — port the stat threshold, not the rebirth count (the 3x/6x reading is consistent only if a rebirth grants exactly +10 element ATK, and StatsManager.as:1835 adds findBonusStat(STAT_FIREATK) from equipment, so gear can also open these skills).

### `skills-meters/chi-cooldown-table-held` — HELD [A2] ⚑ OVERTURNS LEDGER

All 182 level rows carry verbatim <chi> and <cooldown>, including every skill the ledger's blocker ① names by name (Smoke Bomb, Kunai, Lay Trap, elemental), so zero INFERRED cooldowns need remain in config.

- **Cite:** `reference/extracted/skilldata.xml:508-514 (Smoke Bomb 1010 L1), :897-903 (Lay Trap 1024 L1), :927-933 (Fire Trap 1025 L1), :991-997 (Fire Kunai 1029 L1)`
- **Quote:** <level>\n\t<value>1</value>\n\t<required>1</required>\n\t<chi>5</chi>\n\t<cooldown>6</cooldown>\n\t<desc></desc>\n</level>  (skill 1010 Smoke Bomb). Chi domain across the file: 0,2,3,5,6,7,8,10,20,50,100. Cooldown domain: 2,3,3.5,4,5,6,8,9,10,15,20,30,60,70.
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2 skills-meters — blocker ① dead. L2's gate ('zero INFERRED cooldowns remain') is now a transcription loop, not research.

### `skills-meters/focus-is-the-reload-meter` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus bar IS the engine's reload meter, which closes all three parts of blocker ③: max = 48 + 6xSPD frames at 24fps, fill = the Focus skill setting reload to maxreload-1, per-slash drain = the weapon's slashusage (floor 48), and the stance-switch cost = reload cut to a third if above half, else minus a sixth.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillManager.as:218-221; StatsManager.as:1839-1842; StatsManager.as:1921-1930; MCSPlayer.as:3098-3105; skilldata.xml:291-311 (skill 1005)`
- **Quote:** case SKILL_FOCUS:\n   owner.reload = owner.maxreload - 1;\n\n// StatsManager.as:1841\nreturn 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;\n\n// MCSPlayer.as:3098-3104, inside setStance()\nif(this.reload > this.maxreload / 2)\n{ this.reload = this.maxreload / 3; }\nelse\n{ this.reload -= this.maxreload / 6; }
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 skills-meters — blocker ③ dead. Also L5 combat-core blocker ⑤ ('Focus/crit gating rule — watch the Focus bar fill/consume'): the fill/consume half is now sourced; the crit-gating half is not (see crit-proc-rule).

### `skills-meters/measured-cooldowns-explained` — HELD [A2] ⚑ OVERTURNS LEDGER

The three oddly precise cooldowns the ledger measured off the WEB v0.717 longplay (Chi Punch 4.96s, Focus 9.92s then 8.92s) are reproduced to the hundredth by the payload's xml cooldowns 5/10/9 run through the SPD formula with int truncation at SPD=5 — proving the android-build data IS the web build's tuning.

- **Cite:** `reference/extracted/skilldata.xml:1288-1294 (1042 L1 cd 5), :291-297 (1005 L1 cd 10), :298-304 (1005 L2 cd 9) + XMLSkill.as:289-311 (returns int)`
- **Quote:** 5*24=120 -> 120*(1-5/600)=119.0 -> int 119 -> 119/24=4.9583 -> toFixed(2)="4.96"; 10*24=240 -> 238.0 -> 238/24=9.9166 -> "9.92"; 9*24=216 -> 214.2 -> int 214 -> 214/24=8.9166 -> "8.92". Ledger:194 measured "cd 4.96s" and "cd 9.92→8.92s".
- **Overturns:** "- **Ready:** Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s); full 6-category tree structure + per-stance unlock levels; crit = 1.3× formula."
- **Lane impact:** L2 skills-meters — also corrects two ledger details: Chi Punch has a level 3 (30 damage, string 7066) the ledger's '10/20 dmg' misses, and the skill is named 'Focus' (string 6008), not 'Replenish Focus'.

### `skills-meters/shunpo-effect` — HELD [A2] ⚑ OVERTURNS LEDGER

Shunpo's real effect is held: it is a hold-to-charge damage ultimate usable only in Light Stance, gated on Light-Stance-Mastery 10, costing 50 chi with a 60s cooldown — and it has two siblings (Thousand Stabs / Deadly Cleave) with identical shape.

- **Cite:** `reference/extracted/skilldata.xml:1234-1248 (id 1039) + strings.json 6082/6085 via docs/gauntlet/L0/index/strings.json; SkillManager.as:54`
- **Quote:** <skill><id>1039</id><displayname>6082</displayname><desc>6085</desc><req><has><id>1000</id><qty>10</qty></has></req><order>10</order><category>1</category><level><value>1</value><required>1</required><chi>50</chi><cooldown>60</cooldown><desc></desc></level></skill>  — 6082="Shunpo", 6085="Ultimate Light Stance technique. / Hold down the skill icon to increase the damage it inflicts. / This skill can only be used when in Light Stance."
- **Overturns:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."
- **Lane impact:** L2 skills-meters — blocker ② dead. Also L5 combat-core and L8 ui-hud: the ultimate is a hold-to-charge input on the skill icon, not a tap.

### `skills-meters/spd-cooldown-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The SPEED-to-cooldown formula is in the source verbatim: effective cooldown = xmlCooldown x (1 - SPD/600), SPD capped at 300 (max -50%), with the Speed buff multiplying SPD by 1.5 before the cap.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861 and :1844-1853; applied at XMLSkill.as:289-311`
- **Quote:** internal static function getSkillCooldownModifierVal(speed:int) : Number\n{\n   if(speed > 300)\n   {\n      speed = 300;\n   }\n   return 1 - speed / 300 * 0.5;\n}   // and XMLSkill.as:308-310  val = this.levelList[lvl].cooldown * 24;  return val * StatsManager.getSkillCooldownModifier();
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2 skills-meters — blocker ④ dead. Also L10 progression: this is one of the two SPD transfer functions progression blocker ① asks for ('DEF mitigation curve + SPD range/cooldown scaling — wiki gives only direction').

### `ui-hud/skill-icons-are-gestural` — HELD [A2] ⚑ OVERTURNS LEDGER

Skill icons are not tap-once buttons: the shipped descriptions state two additional input verbs — hold-the-icon-to-charge (the three stance ultimates plus Charged Shot) and drag-and-drop-the-icon to pick a target location or a direction (Heavenly Sword, and one slot that holds BOTH dashes).

- **Cite:** `strings 6085/6086/6087 (skills 1039/1040/1041), 6099 (1046), 6100 (1047), 6103/6105 (1049/1050) via docs/gauntlet/L0/index/strings.json, rows at reference/extracted/skilldata.xml:1234-1280, :1435-1464, :1483-1511`
- **Quote:** 6099 = "Shoots a charged projectile from your blade. / Hold down the skill icon to increase the damage it inflicts. / Getting hit while charging will cancel the skill."  6100 = "Calls down a mystical sword from the heavens. / Drag and drop skill icon to select target location."  6103 = "Short burst of speed. / Interchangable with Dash Left Skill if you drag and drop skill icon to select direction."
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L8 ui-hud — the skill bar needs press-and-hold charge state and drag-to-aim, neither of which is in the ledger. Also L5 combat-core: Charged Shot scales 20/40/60 dmg per second to a 200/400/600 cap (strings 7075-7077) and is cancelled by taking a hit.

### `ui-hud/skill-slots-3-to-8` — HELD [A2] ⚑ OVERTURNS LEDGER

Skill slots are base 3, hard max 8, with slot 0 pre-filled with the Jump skill — so the ledger's guess that the third HUD element is 'a stance up-arrow' is wrong, because the three stance masteries are <passive>1</passive> and passives cannot occupy an action slot.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2295, :126, :749; SkillManager.as:14; reference/extracted/skilldata.xml:375-418 (skill 1008) with strings 7009-7013; passives at skilldata.xml:7, :86, :165`
- **Quote:** StatsManager.as:2295  return 3 + getStat(1008);\nStatsManager.as:126   public static var skillSlots:Vector.<IntStat> = new Vector.<IntStat>(8);\nStatsManager.as:749   skillSlots[0] = new IntStat(1003,1);\nSkillManager.as:14    public static var SKILL_JUMP:int = 1003;\nstrings 7009-7013 = "4 skill slots" / "5 skill slots" / "6 skill slots" / "7 skill slots" / "8 skill slots"  (skill 1008 "Skill Slots+")
- **Overturns:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** L8 ui-hud — blocker ④ dead; the HUD must support 3 to 8 slots driven by skill 1008, with Jump as the default slot-0 occupant. 3 + 5 = 8 = the vector length, so the two sources agree exactly.

### `world-exploration/secret-areas-behind-bushes` — HELD [A2] ⚑ OVERTURNS LEDGER

Overworld rooms have a hidden-passage layer: Scavenging level 5 highlights in red the bushes that conceal paths to secret areas.

- **Cite:** `reference/extracted/skilldata.xml:835-841 (skill 1021 Scavenging, level 5, <desc>7094</desc>) resolved via docs/gauntlet/L0/index/strings.json`
- **Quote:** 7094 = "Bushes concealing paths to secret areas will be highlighted in red."
- **Overturns:** "- **Content depth:** Ep4–12 + epilogue (10 undocumented chapters); verbatim dialogue; per-quest trigger types + coords; the full territory map/geography; elemental-skill effect values."
- **Lane impact:** L9 world — a room-content mechanic (concealed exits + a skill-driven reveal) that appears in no ledger system; world-exploration's known-unknowns list only trigger types, coords and geography. Pairs with S0-4's 112_Mobile_NodeData (535 ids, 372 <x>, 343 <obj>).

### `art-anim/engine-tick-is-24fps` — HELD [A2]

The original simulation ticks at 24 fps — skilldata cooldowns are stored in seconds and multiplied by 24 to become engine units, and maxreload is initialised as 5 * 24.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLSkill.as:300 and :308 (multiply), :116/:189/:205/:223 (divide for display); MCSPlayer.as:239`
- **Quote:** XMLSkill.as:308  val = this.levelList[lvl].cooldown * 24;\nXMLSkill.as:116  cooldown = this.getCooldown(1) / 24;\nMCSPlayer.as:239 this.maxreload = 5 * 24;\n(LangManager.getString(647) = "Cooldown", getString(648) = "sec")
- **Lane impact:** L5 combat-core and L6 art-anim — our Sim is fixed 60Hz, so every duration ported from skilldata or the AS3 in FRAMES must be rescaled x2.5, and 24fps-exact sub-frame timings will not land on 60Hz boundaries. This is distinct from the ledger's ':84 15fps pose latch', which is an animation-hold rate, not the sim rate.

### `combat-core/mastery-domain` — STILL_UNHELD [STILL_UNHELD]

Whether the mastery term in the stance-reach formula is the 1-10 skilldata <value> or a 0-100 derived figure is not resolved by anything I read, so the coefficient cannot be ported as a number.

- **Quote:** 0.5 * mastery * 0.01 only produces a meaningful spread if mastery runs 0-100 (Balanced 1.0->1.5, Heavy 0.5->1.0). But skilldata.xml <value> runs 1-10 and XMLNpc.as:671-686 getMastery() returns that <value> verbatim. I could not find a conversion between getStat(1001) and a 0-100 scale.
- **Lane impact:** L5 combat-core — port the formula shape, leave the mastery domain flagged INFERRED until someone finds the conversion. This is also the likely real explanation of the ledger's 'mastery-9 ceilings' framing (:58, :155), which my progression/required-is-skill-points claim gives a competing explanation for.

### `skilldata/android-web-byte-identical` — HELD [A3]

The Android v0.682 skilldata blob and the web v0.717 skilldata.xml are byte-identical apart from the XML declaration line, which discharges the S0-3 'parity NOT established' caveat for this unit.

- **Cite:** `sha1 over whitespace-normalised, decl-stripped content of reference/extracted/android/117_Mobile_SkillData.bin vs reference/extracted/skilldata.xml`
- **Quote:** android sha1 bdc45aec04640165b78a133483c3a429f13bae27\nweb     sha1 bdc45aec04640165b78a133483c3a429f13bae27\nIDENTICAL\n\n(difflib over non-blank stripped lines: one hunk, android line 1 = '<?xml version="1.0" encoding="utf-8"?>'; 1,895 other lines identical; same 75 ids both sides, no id in one and not the other.)
- **Lane impact:** L2 skills-meters — the S0-3 caveat ('UI copy and combat tuning parity is NOT established') no longer applies to skilldata; the android string table's skill names and descs port to the web build without a label caveat. Still applies to AS3 constants not independently cross-checked.

### `skills-meters/crit-proc-rule` — STILL_UNHELD [STILL_UNHELD]

The crit proc rule is not in skilldata and I found nothing that grounds it — this blocker survives the sweep.

- **Quote:** skilldata.xml contains no <crit> field, no crit term among the 6xxx or 7xxx description strings, and no crit term in XMLSkill.as. STAT_CRITICALDMG:int = 204 exists (StatsManager.as:258) but it is an item/gear stat plumbed through MCSPlayer.initAttackStats(..., findBonusStat(STAT_CRITICALDMG), ...), not a skill field and not a proc rule.
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2 skills-meters — blocker ⑤ stands. Of the five skills-meters blockers, four are now closed by this sweep and this one is not. Do not let the four closures imply the fifth.

### `ui-hud/three-slots-on-screen` — HELD [A1]

A frame confirms exactly three skill slots on the bottom-right HUD, holding an empty tile, a dimmed gold fist (Chi Punch on cooldown) and a gold up-arrow — matching the payload's base-3 slot count with no conflict to adjudicate.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png — crop (1380, 900) -> (1920, 1080) of the 1920x1080 frame, Lanczos-upscaled 3x to 1620x540`
- **Quote:** Visibly in the crop: three rounded-square slots with bevelled pale-grey frames on black. Slot 1 (leftmost) empty, no number label. Slot 2 labelled "2", a gold clenched fist with motion streaks, whole tile dimmed/tinted. Slot 3 labelled "3", a plain gold up-arrow. Same frame's left HUD reads 20/20 green, 26/26 blue, "CANNOT CHANGE STANCE", "150% DAMAGE".
- **Lane impact:** L8 ui-hud — grounds the slot-count claim in the primary reference. The fist is skill 1042 Chi Punch ('Focuses Chi into your fist for a deadly punch') and the up-arrow is skill 1003 Jump per the slot claim; frame and payload agree.

## skills-meters — re-scored 86

33 -> 86. All five §4 blockers are now HELD with payload cites: every skill's chi cost and cooldown (182 level rows), the Focus/reload meter's max + dead zone + switch cost + per-stance slash cost, the deterministic crit trigger and its multiplier, the SPD->cooldown formula, and Shunpo's gating/cost/charge rule. On top of that, 73/73 skill names and descriptions now resolve from the recovered string table, 135 of 182 level rows carry a verbatim numeric effect string (damage/duration/dodge-%/slot counts), and a byte-check proves the Android and web skilldata are the same 39,003 bytes so all of it is web-v0.717 fact. Held back from ~95 by: the ultimates' and elemental projectiles' constants (47 blank level rows, and Android projectile code is proven-retuned so it cannot be trusted for v0.717), skill VFX/animation/audio entirely untouched, Shunpo's 250px/3s charge geometry Android-only, and all UI copy carrying an Android-table caveat.

### `skills-meters/blocker1-costs-cooldowns` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ① is dead: every one of the 75 skills' chi costs and cooldowns sits in skilldata.xml across 182 <level> rows, including all four skills the blocker names by hand.

- **Cite:** `reference/extracted/skilldata.xml:500-513 (Smoke Bomb, id 1010); also :345-358 (Throw Kunai 1007), :889-902 (Lay Trap 1024), :607-614 (Fire Breath 1013)`
- **Quote:** 501:		<id>1010</id>
502:		<displayname>6018</displayname>
503:		<lvlreq>20</lvlreq>
505:		<req><has><id>1024</id><qty>1</qty></has></req>
507:		<category>6</category>
511:			<chi>5</chi>
512:			<cooldown>6</cooldown>
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2 (SKILLS + METERS): the lane's stated done-condition 'all 75 skills x 182 rows byte-exact from A2; zero INFERRED cooldowns remain' is reachable by a transcription script today, with no preserved build and no measurement pass.

### `skills-meters/chi-costs-are-not-single-digit` — HELD [A2] ⚑ OVERTURNS LEDGER

The Surface bullet is wrong: chi costs run 0, 2, 3, 5, 6, 7, 8, 10, 20, 50, 100 — double digits are the norm above level ~30 and the ladder tops out at exactly 100.

- **Cite:** `docs/gauntlet/L0/index/skilldata.json -> skilldata/skill/level/chi (distinct_values 11, numeric_range [0,100]); reference/extracted/skilldata.xml:1638-1649 (Mass Shadow Clone, id 1055)`
- **Quote:** 1638:		<id>1055</id>
1640:		<lvlreq>80</lvlreq>
1648:			<chi>100</chi>
1649:			<cooldown>30</cooldown>
- **Overturns:** "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."
- **Lane impact:** L2: chi is an absolute integer pool that grows with level (BattleUI.as:252-256 prints chi + '/' + maxchi; frames show 26/26 and 47/47), starting 10/10 with regen +maxchi/10 per tick. 'Single-digit vs fabricated-100-meter' is the wrong axis — config's 30/25/10 is wrong for a different reason than the ledger gives.

### `skills-meters/crit-is-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ⑤ is dead: crit is not a proc at all — it fires on the exact equality reload == maxreload and costs the whole meter, in the shipped web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (getDamage) and :3295-3298 (deductReloadBar zeroes a full meter)`
- **Quote:** 3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3273:         {
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
3275:         }
3276:         return _loc2_;
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5 (COMBAT CORE): removes the crit-chance RNG question entirely — no roll, no seed, no variance. L2: the meter is the crit resource, so Focus/crit are one system not two.

### `skills-meters/focus-meter-numerics-web` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ③ is dead: the 'Focus bar' is the reload/crit meter — max 120 frames (5s), bar mapping (reload-48)/(maxreload-48) i.e. a 48-frame dead zone, stance switch costs a flat 48 frames, slash costs slashUsage x0.5/x1.0/x1.5 by stance, bonus refill +6.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-333 (mapping); §1t99s0§.as:55 (max), :3160-3166 (switch cost), :3299-3311 (slash cost), :3318-3324 (refill)`
- **Quote:** 328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
---
3162:            this.§1t4414s0§ -= 48;
---
3302:               this.§1t4414s0§ -= this.slashUsage / 2;
3306:               this.§1t4414s0§ -= this.slashUsage;
3310:               this.§1t4414s0§ -= this.slashUsage * 1.5;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: usable meter range is 72 frames and a stance switch costs two-thirds of it. Also corrects the previous UNVERIFIED survey, which banked the Android numbers (24-frame dead zone, maxreload/6 gate, maxreload/2->maxreload/3 cost) — none of those constants exist in the web player class.

### `skills-meters/in-combat-stance-switch-is-real` — HELD [A2] ⚑ OVERTURNS LEDGER

§3.4 is wrong: in-combat stance switching is real in v0.717. 'CANNOT CHANGE STANCE' is a transient caption shown only when the focus bar reads exactly 0, hidden at any partial fill — and setStance charges a flat 48 frames, which a hard lock would have nothing to charge.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:336-347 (three-state caption) with §1t99s0§.as:3160-3166 (the charge)`
- **Quote:** 336:            if(_loc3_ == 0)
340:                  this.§1t5169s0§.htmlText = this.§1t5204s0§;
342:               this.§1t5169s0§.visible = true;
344:            else if(_loc3_ > 0 && _loc3_ < 1 && this.§1t5169s0§.visible)
346:               this.§1t5169s0§.visible = false;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L5/L2: the recreation's Focus-gated in-combat switch is FAITHFUL, not a divergence — it should be presented as original behaviour and the cost set to a flat 48 frames. This REMOVES an entry from the project's labelled-deviation list rather than adding one.

### `skills-meters/kunai-chi-is-a-phantom` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 'Kunai chi' blocker names a cost that does not exist: Throw Kunai and Lay Trap have an empty <chi> element (cost 0) and spend an ammo counter, stat id 2501, instead.

- **Cite:** `reference/extracted/skilldata.xml:355 and :900; reference/decompiled/shs3_android_payload/scripts/SkillManager.as:252-259`
- **Quote:** 355:			<chi></chi>
---
254:                     if(StatsManager.getStat(2501) == 0)
256:                        trace("no ammo");
257:                        return false;
259:                     StatsManager.changeStat(2501,-1);
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: kunai/trap skills must be wired to an ammo stat (2501), not to the chi pool; the shipped card copy confirms it in words ('Throws a kunai.\n\nRequires kunai ammo.').

### `skills-meters/ledger-decimals-are-display-artefacts` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 4.96 / 9.92 / 8.92 cooldowns are not contract values — they are one reader's SPD applied to the raw integers 5 / 10 / 9, and under the web formula that reader's SPD was 6-10.

- **Cite:** `reference/extracted/skilldata.xml:1292/1299/1306 (Chi Punch cd 5) and :295/302/309 (Focus cd 10/9/8), run through §1t1523s0§.as:2289-2296`
- **Quote:** 295:			<cooldown>10</cooldown>
302:			<cooldown>9</cooldown>
309:			<cooldown>8</cooldown>
--- reproduction ---
SPD  6: mod=0.995000  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
SPD 10: mod=0.991667  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
- **Overturns:** "Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s)"
- **Lane impact:** L2: config must encode the integers 5/10/9 and compute the display, not hard-code the decimals. Also shows the ledger truncated Focus to two levels — it has three (cd 8 at L3).

### `skills-meters/per-level-effect-numbers` — HELD [A2] ⚑ OVERTURNS LEDGER

The single biggest under-claim: 135 of the 182 level rows carry a verbatim numeric effect string in the recovered string table — damage, damage/sec caps, chi-steal, durations, dodge percentages, slot counts — so no projectile-class reading is needed for them.

- **Cite:** `reference/extracted/skilldata.xml <level><desc> ids 7000-7095 joined to docs/gauntlet/L0/index/strings.json; cross-checked in code at shs3_android_payload/scripts/ChiPunchProjectile.as:20-31`
- **Quote:** 7064 -> '10 damage'   7065 -> '20 damage'   7066 -> '30 damage'
7072 -> 'Steal 20 chi'  7074 -> 'Steal 50 chi'
7075 -> '20 damage/sec, max 200 damage'
7078 -> '500 damage, 5 sec delay'
7004 -> '60% chance to dodge enemy attacks when rolling'
7013 -> '8 skill slots'
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2: the whole tree can be transcribed to config with numeric effects attached. Also settles two things outside the lane — Roll (60/80/100%) is what buys evasion, not Focus (correcting project memory 'Focus buys evasion'), and the base hotbar is 3 slots growing to 8 (answers L8/ui-hud blocker ④).

### `skills-meters/per-stance-reach-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Combat-core's #1 blocker (reach cap in stage px per stance) is fully held: baseSlashLength = 120 + floor((90 + DAN*5) * SPD/(20+SPD)), then Light x1.4, Balanced x1.0->1.2, Heavy x0.5->0.9 floored at 100 px, Dual x1.4, Reversed x1.0 floored at 100.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 (setStance) and §1t1523s0§.as:2344-2348 (base)`
- **Quote:** 3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3119:                  this.§1t4417s0§ = 100;
---
2346:         var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
2347:         return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L5: closes the blocker the ledger calls 'the one value the whole model needs'. §3's wiki 300/200/100 reconciles at the SPD asymptote (1.4x210=294 / 210 / 105) — I flag that last step as inference from A2, not measurement. §3's 'Heavy's reach also scales x0.5->x0.9' is exactly right.

### `skills-meters/shunpo-effect` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ② is half closed: Shunpo is the Light-stance capstone at mastery 10, costs 50 chi on a 60s cooldown, and is a hold-to-charge damage skill — but its 250px/3s teleport geometry is Android-only and I will not promote it to web fact.

- **Cite:** `reference/extracted/skilldata.xml:1234-1246 with strings 6082/6085; Android-only mechanics at shs3_android_payload/scripts/MCSPlayer.as:1705-1706, 1747-1753`
- **Quote:** 1235:		<id>1039</id>
1236:		<displayname>6082</displayname>
1238:		<req><has><id>1000</id><qty>10</qty></has></req>
1244:			<chi>50</chi>
1245:			<cooldown>60</cooldown>
---
6085 -> 'Ultimate Light Stance technique. \n\nHold down the skill icon to increase the damage it inflicts.\n\nThis skill can only be used when in Light Stance.'
- **Overturns:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."
- **Lane impact:** L2: gating, cost, cooldown and the charge-to-increase-damage rule are codeable now; the 250 px flash-step and 3s charge window need a web-bundle cross-check first, because the crit/stance/SPD constants all diverge between builds. The ledger's negative half (no spacebar slow-mo) stands — there is no slow-motion in any Shunpo path in either bundle.

### `skills-meters/spd-cooldown-cap-600` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ④ is dead — and the cap is 600, not the 300 that the readable Android build shows: web cooldownModifier = 1 - min(SPD,600)/600 x 0.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296; call chain via §1t105s0§.as:297-318 (XMLSkill.getCooldown)`
- **Quote:** 2291:         if(param1 > 600)
2293:            param1 = 600;
2295:         return 1 - param1 / 600 * 0.5;
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2: cooldown pipeline is XML seconds -> x24 frames -> x SPD modifier -> /24 -> 2dp for display. Also corrects the previous (UNVERIFIED) L0 survey, which banked the Android cap of 300.

### `skills-meters/stance-damage-ceiling-is-mastery-10` — HELD [A2] ⚑ OVERTURNS LEDGER

§3.3's stance damage table 0.9/1.2/1.4 is exactly right and is the web build's per-stance damage multiplier — but the ceiling index is mastery 10, not 9; the coefficient is x0.1 per level and the mastery skills have ten levels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3259-3271; mastery source at shs3_android_payload/scripts/StatsManager.as:1834 (getStat(1000)/(1001)/(1002))`
- **Quote:** 3262:               _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3265:               _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3270:               _loc2_ = _loc1_ * 1.4;
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L5/L2: Light = 0.5 + 0.04*M, Balanced = 1.0 + 0.02*M, Heavy/Dual/Reversed = flat 1.4, M in 0..10. Coding a mastery-9 ceiling ships Light at 0.86 and Balanced at 1.18 — both wrong.

### `skills-meters/string-table-resolves-all-73` — HELD [A2] ⚑ OVERTURNS LEDGER

GAUNTLET §2.1's string-table blocker is dead for this system: all 73 skills that carry a <displayname> resolve, with 0 misses, and their descriptions come with them.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> skilldata.xml -> misses: 0, rows_resolved: 73, miss_sample: []; source blob reference/extracted/android/118_Mobile_Lang_EN.bin`
- **Quote:** '6000' -> 'Light Stance Mastery'
'6018' -> 'Smoke Bomb'
'6042' -> 'Stab'
'6047' -> 'When target is downed, draw a downward line to stab him for massive damage.'
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L1b is DONE for L2 — the lane's blocking dependency ('needs L1b for names') is satisfied. Caveat that survives: the table is the ANDROID one, it is not identical to the web build's (web string 960 is absent from it), and some phrasing is touch-specific ('Hold down the skill icon'); label ported UI copy as Android-sourced. This also corrects the previous UNVERIFIED survey, which graded the table PARTIAL and said it was 'not on disk here'.

### `skills-meters/ten-categories-all-named` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet undercounts by four: the skill screen builds TEN player categories (Light / Balanced / Heavy / Chi / Survival / Ninja / Fire / Water / Wind / Earth), all now named verbatim; the data file's eleventh category is NPC-only.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillScreenUI.as:84,103-104, joined to docs/gauntlet/L0/index/strings.json ids 6024-6033; category domain from docs/gauntlet/L0/index/skilldata.json (distinct_values 11, range [1,11])`
- **Quote:**  84:      internal var categoryCount:int = 10;
103:         this.categoryIcons = [1,2,3,4,5,6,7,8,9,10];
104:         this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
---
6027 -> 'Chi Skills\n\nSkills that channel chi to create protective and offensive effects.'
6028 -> 'Survival Skills\n\nGeneral skills that make life easier.'
6029 -> 'Ninja Skills\n\nSkills that are based on stealth, deception and illusion.'
- **Overturns:** "full 6-category tree structure + per-stance unlock levels"
- **Lane impact:** L2: ten tabs, not six. Category 11 (Back Throw, Air Stab, Bull Charge, Punch Lunge, Undying, 1500, 1501) has no <order> and no <lvlreq> and is absent from SkillScreenUI — it is enemy moveset data, so it belongs to L4 not L2. Cross-lane to L11/rebirth-elements: cats 7-10 are its '4 elements x 6 named skills', all 24 now named, costed, cooldowned and per-level-numbered, gating on 10/10/10/30/30/60 units of the element item — its blocker ① 'what each element does' is mostly closed by THIS lane's evidence.

### `skills-meters/150pct-damage-is-a-food-buff` — HELD [A2]

Correction to the previous UNVERIFIED survey: the frames' yellow '150% DAMAGE' is the BUFF_ATTACK food buff (minDamage x1.5), not evidence of a Heavy-stance multiplier — and the ledger's own §3 crux note (Potato Dog) was right all along.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/OverworldHUD.as:1402-1404 and MCSPlayer.as:210-223; item copy string 4132`
- **Quote:** 1402:            else if(bufftype == StatsManager.BUFF_ATTACK)
1404:               buffstr = "150% DAMAGE";
---
210:            if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK))
212:               this.minDamage *= 1.5;
---
4132 -> 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'
- **Overturns:** "Also visible: player HP **20/20**, **"150% DAMAGE"** buff (Potato Dog), **"CANNOT CHANGE STANCE"**"
- **Lane impact:** L5/L10: the buff multiplies minDamage ONLY (not damageRange), and buffs are mutually exclusive (an else-if chain, and the item copy says so). Under the web build Heavy is x1.4 anyway, so the coincidence the previous survey rested on does not exist in v0.717.

### `skills-meters/crit-mult-is-1.3-ledger-vindicated` — HELD [A2]

The ledger's CRIT_MULT=1.3 is CORRECT for the shipped web build v0.717 — and the previous UNVERIFIED L0 survey was wrong to overturn it, because it read the Android build (which was retuned to 1.5 Light / 1.2 other).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 (web getDamage), vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3219-3221 (android)`
- **Quote:** web  3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
android 3219:               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
android 3221:            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
- **Overturns:** "crit = 1.3× formula."
- **Lane impact:** L5: keep CRIT_MULT=1.3, flat across stances, plus an ADDITIVE gear term STAT_CRITICALDMG (stat 204, gear-only via findBonusStat). Coding the previous survey's 1.5/1.2 would have mistuned every critical hit in the game.

### `skills-meters/frame-cracks-web-string-960` — HELD [A1]

A1 cracks a web-only string the recovered table does not contain: string 960 = 'CANNOT CHANGE STANCE', rendered light-grey in the empty focus bar.

- **Cite:** `reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png — crop (60,880)-(1020,1080) upscaled 3x Lanczos; paired with reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111`
- **Quote:** Visibly in the crop: red portrait ring, green 20/20 (full), blue 26/26 (full), a third bar EMPTY/brown carrying light-grey text 'CANNOT CHANGE STANCE', yellow '150% DAMAGE' beneath.
---
110:         this.§1t5203s0§ = "<font color='#000000'>" + §1t1521s0§.getString(175) + "</font>";
111:         this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L2/L8: one text field, three states of the same bar (empty = refusal caption grey #BBBBBB, partial = hidden, full = crit caption black #000000). The frame renders ALL CAPS while table row 175 is 'Critical Hit' — the field uppercases, so THE FRAME WINS: ship the caps. Bonus for L7: §1t113s0§.as:352 fires a named SFX event 'Snd_criticalDamage' on the same transition.

### `skills-meters/frame-crit-appears-at-exactly-full` — HELD [A1]

A1, measured: the crit caption is absent when the third bar reads 98.0% full and present when it reads 100% — the on-screen proof that crit is an exactly-full equality, not a probability.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — crops (640,0)-(1800,390) and (640,390)-(1800,780), each upscaled 2x Lanczos; fill widths then measured in the original`
- **Quote:** Visibly in the top crop: green 11/20, blue 47/47, a white third bar with NO text, yellow '150% DAMAGE'. Bottom crop: identical 11/20 and 47/47, the same white bar now carrying BLACK text 'CRITICAL HIT'. Measured: track (blue at 47/47) x736->1540 = 805 px; TOP white x737->1525 = 789 px = 98.0%; BOT white x737->1540 = 804 px = 100%.
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2's done-condition 'meters on-screen match A1' now has its reference measurement. Frame and payload agree here; had they disagreed the frame would win.

### `skills-meters/skill-vfx-anim-audio` — STILL_UNHELD [STILL_UNHELD]

Still unheld: nothing in this pass touches how a skill looks or sounds — cast poses, charge tells, hit sparks, screen-shake, the Shunpo streak, per-skill SFX.

- **Lane impact:** L6/L7: reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin is the likely home of the animation sets and is unopened; the audio resource blobs are CWS-encrypted (Stage-0b S0-5). One SFX EVENT NAME was recovered ('Snd_criticalDamage', §1t113s0§.as:352) — the event and its exact trigger are held, the waveform is not.

### `skills-meters/skilldata-byte-identical-across-builds` — HELD [A3]

Byte-check: the Android v0.682 skilldata blob is the web v0.717 skilldata.xml byte-for-byte across all 39,003 bytes, plus only a 40-byte XML declaration and one trailing CRLF — so every id, cost, cooldown, lvlreq, order, category and prerequisite edge in this survey is web-build fact.

- **Cite:** `byte comparison of reference/extracted/android/117_Mobile_SkillData.bin against reference/extracted/skilldata.xml (python3 prefix/suffix diff, run this session)`
- **Quote:** android len 39045 web len 39003 delta 42
android first 40: b'<?xml version="1.0" encoding="utf-8"?>\r\n'
common prefix identical for 39003 bytes
tail android: b'>\r\n\t</skill>\r\n\r\n</skilldata>\r\n'
tail web:   b'el>\r\n\t</skill>\r\n\r\n</skilldata>'
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L2: kills the standing Stage-0b S0-3 caveat ('combat tuning parity is NOT established') for this system's DATA. It emphatically survives for this system's CODE — see the crit, stance and SPD-cap divergences. Rule for every downstream lane: Android XML is web-true, Android AS3 is not.

### `skills-meters/stab-is-a-passive-tree-node` — HELD [A2]

The Surface bullet survives contact with the payload intact: 'Stab' (id 1018) is Heavy category, prerequisite Heavy Stance Mastery 3, marked <passive>1</passive>, and canEquip() returns false for passives so it can never occupy a hotbar slot.

- **Cite:** `reference/extracted/skilldata.xml:721-727; reference/decompiled/shs3_android_payload/scripts/XMLSkill.as:345-348 and MCSPlayer.as:3147-3151`
- **Quote:** 721:		<id>1018</id>
722:		<displayname>6042</displayname>
724:		<req><has><id>1002</id><qty>3</qty></has></req>
725:		<passive>1</passive>
727:		<category>3</category>
---
347:         return !this.passive && StatsManager.getStat(this.id) > 0 && (StatsManager.getLevel() >= this.lvlreq || StatsManager.canEquipAllSkills);
- **Overturns:** ""Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill."
- **Lane impact:** L2: the full per-stance capability ladder falls out — Light 1014/1036/1015/1039-Shunpo, Balanced 1016/1037/1017/1040-Thousand-Stabs, Heavy 1018-Stab/1038/1019/1041-Deadly-Cleave at mastery 3/4/5/10. One disambiguation the ledger misses: Thousand Stabs (1040) is the BALANCED capstone, a different node from the Heavy canStab.

### `skills-meters/ultimates-and-elemental-projectile-constants` — STILL_UNHELD [STILL_UNHELD]

Still unheld: 47 of 182 level rows resolve to an empty effect string, clustered on the three stance ultimates, Mass Shadow Clone, the four elemental AoEs' level rows, the eight elemental kunai/traps and both dashes — their damage is computed in projectile classes, not tabled.

- **Lane impact:** L2: this is now a TWO-step gap, not the one-step 'read 40 projectile files' a prior pass assumed — the ~40 *Projectile.as classes are Android, and this survey proves Android combat constants are retuned, so each must then be located in the obfuscated web bundle by constant-pattern grep (the method that found getDamage this pass). Four of the blanks are partly covered by their skill-level <desc> ('150% Fire ATK', Deadly Touch's '10 damage for each chi point').

## ui-hud — re-scored 88

Pass 1 of this lane already moved ui-hud 57 -> 85 on the Android decompile; I re-derived its claims 1-18 independently and they hold, so 85 is the floor, not a contested number. +3 for three things Pass 1 left open or got wrong: (a) blocker (5) goes from "half closed" to "closed except symbol geometry" — DialogBox re-assigns its layout in ActionScript every show (button.x 340 / 270+425, msgText.y 187.5 vs 220, centre-if-<=2-lines), and the battle pause is a full behaviour spec (button hidden in duel/PvP, pauseScreen raised to top, any click resumes); (b) the screen-transition durations Pass 1 declared "unheld pending a follow-up" are constants in the same file and resolve by arithmetic to 17 frames / 708 ms for each shutter and exactly 24 frames / 1000 ms for the white fade; (c) an entire UI subsystem — 19-screen, 47-menu, 139-option InteractUI UIData with inventory gates and error copy — is on disk and appears in neither the ledger nor Pass 1. Held below 90 by real gaps, not caution: no assets.swf symbol geometry exported (BattleUI symbol2952, OptionsUI symbol1133, DialogBox symbol83, SkillSlotButton symbol2915 etc. are script-only exports), no icon manifest for the 139 icon ids, HUD chrome art still sealed in the encrypted 124_Mobile_ImageResource, the 800x690 friend-bar layout is code-held but appears in zero reference frames, and "(EQ:n) UX" is still ungrounded. Separately, P1 is a correctness hit that does not change the score but changes every other lane: the string-id mapping Pass 1 used is the wrong one.

### `ui-hud/dialogbox-metrics-in-code` — HELD [A2] ⚑ OVERTURNS LEDGER

Dialogue-box exact metrics are NOT locked inside an assets.swf symbol — DialogBox re-assigns button x, message y and text alignment in ActionScript on every show, so blocker (5)'s dialogue half is closed.

- **Cite:** `reference/decompiled/shs3_android/scripts/DialogBox.as:46,49,53,59,63,136,147`
- **Quote:** `this.button.x = 340;` (single-button) / `this.button.x = 270;` + `this.button2.x = 425;` (Yes/No); `this.msgText.y = 187.5;` when a button is shown else `this.msgText.y = 220;`; `myFormat.align = "center";` if `this.msgText.numLines <= 2` else `myFormat.align = "left";`
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: closes the dialogue half of blocker (5) and upgrades this lane's Pass 1 claim 19 from PARTIAL ('exact pixel metrics ... the geometry lives in the symbol's shape/placement records inside assets.swf') — for DialogBox it demonstrably does not.

### `ui-hud/options-screen-complete` — HELD [A2] ⚑ OVERTURNS LEDGER

The Options screen is completely held — six XCheckBox toggles, two buttons, a title, two conditional hides — with all copy resolving verbatim through the resname table.

- **Cite:** `reference/decompiled/shs3_android/scripts/OptionsUI.as:34-43,44-51`
- **Quote:** `this.musiccheck.setText(LangManager.getString(6)); this.soundcheck.setText(LangManager.getString(7)); this.bloodcheck.setText(LangManager.getString(8)); this.chatcheck.setText(LangManager.getString(396)); this.recordcheck.setText(LangManager.getString(492)); this.fullscreencheck.setText(LangManager.getString(752)); this.backtomainmenubutton.setText(LangManager.getString(74)); this.closewindowbutton.setText(LangManager.getString(75));` -> Music / Sound / Blood / Chat notification / Record Duels / Full Screen / Title Screen / Return To Game, title = 'Options' (10). Hides: `if(StatsManager.hideB
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: the options half of blocker (5). Adds three toggles Pass 1 missed (Chat notification 396, Record Duels 492, Full Screen 752).

### `ui-hud/pause-is-click-anywhere` — HELD [A2] ⚑ OVERTURNS LEDGER

The battle pause is fully specified in code: the pause button exists only outside duel/PvP, pressing it raises pauseScreen to the top of the display list, and any click anywhere resumes — there is no in-battle pause menu.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:179,267-272,324-328`
- **Quote:** `this.pausebutton.visible = !GameEngine.isDuelMode() && !GameEngine.isPvPRoomMode();` (:179); `if(GameEngine.isPaused){ GameEngine.setPaused(false); this.pauseScreen.visible = false; return true;` as the FIRST test in gotClicked (:267-272); `GameEngine.togglePaused(); this.pauseScreen.visible = true; setChildIndex(this.pauseScreen,numChildren - 1);` (:324-328)
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: closes the pause half of blocker (5) as behaviour (the remaining unheld part is pixel geometry only, see ui-hud/hud-symbol-metrics).

### `ui-hud/skill-cooldown-12-step-quantised` — HELD [A2] ⚑ OVERTURNS LEDGER

The skill-slot cooldown sweep is quantised to exactly 12 steps with a 13th 'disabled' frame — the same no-tween, snap character as the HP/Chi bars — and the slot face doubles as a live ammo readout.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220,146,110,114,153`
- **Quote:** `newframe = int(this.cooldown / this.cooldownmax * 12) + 1;` (:220); `this.shade.gotoAndStop(13);` in disableButton (:146); `this.levelText.text = String(StatsManager.getStat(2501));` for kunai/trap skills (:110) and `String(Math.floor(StatsManager.getStat(2501) / 4))` for Windmill (:114); stance-gated grey-out for SHUNPO/THOUSANDSTABS/DEADLYCLEAVE (:153)
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** ui-hud lane: extends blocker (2) beyond Pass 1's bars/combo/vignette to the cooldown widget. Feeds skills-meters too (cooldownmax comes from XMLSkill.getCooldown(level), and stat 2501 is the kunai ammo pool).

### `ui-hud/tier3-video-repass-obsolete` — HELD [A2] ⚑ OVERTURNS LEDGER

Three of the five items the ledger's Tier-3 plan schedules for 'denser video re-passes' are ui-hud items that are already fully specified in source, so that work should not be funded.

- **Cite:** `reference/decompiled/shs3_android/scripts/TextProjectile.as:20-46 and MCSPlayer.as:3805 and DialogBox.as:46-63 and DuelIntroBar.as:22`
- **Quote:** `ttl = 12; ... this.velY = -5;` then `if(ttl < 10){ scaleX += 0.1; scaleY += 0.1; if(ttl < 4){ alpha -= 0.25; } }` (TextProjectile.as:20-46); spawn `ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),damagetextcol);` (MCSPlayer.as:3805); dialogue metrics per DialogBox.as:46-63; `addFrameScript(0,this.frame1,19,this.frame20,68,this.frame69,87,this.frame88);` (DuelIntroBar.as:22).
- **Overturns:** "- Archer moveset at full fps; VS/FIGHT exact ms; damage-popup animation; dialogue-box metrics; overworld HUD pixel geometry."
- **Lane impact:** ui-hud lane re-prioritises the ledger's close-path: of the five Tier-3 items, VS/FIGHT exact ms, damage-popup animation and dialogue-box metrics are closed from source; only overworld HUD pixel geometry still needs work, and that is a JPEXS symbol export, not a video re-pass.

### `ui-hud/typography-edo-sz` — HELD [A2] ⚑ OVERTURNS LEDGER

HUD and tooltip typography is specified inside the WEB payload's own TextField defaults — Edo SZ at 13/14 px #cccccc for body and 16 px #ffffff for headings — so it carries no Android-build caveat.

- **Cite:** `reference/extracted/ui_strings.txt:100,206,314`
- **Quote:** `...physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.` (:100); `aaa<font face="Edo SZ" size="16" color="#ffffff" letterSpacing="0.` (:206); `hp: 123 / 123 &nbsp;(hp regen 12 ) chi: 123 / 434 &nbsp;(chi regen 13)<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.00" kerning` (:314). LangManager.initTextField turns embedFonts off only for Chinese/Japanese (LangManager.as:127-137), so Edo SZ is embedded and authoritative for EN.
- **Overturns:** "② font (unidentified)."
- **Lane impact:** ui-hud lane supplies the missing spec for every HUD text field; also closes the art-anim-audio-feel blocker (2) 'font (unidentified)' with sizes, colours, letterSpacing and kerning attached, not just a face name (this extends Stage-0 finding S0-2).

### `ui-hud/690-friend-bar-never-filmed` — PARTIAL [A1]

The 800x690 'friend bar' layout that Pass 1 found in code is exercised in zero reference frames — every captured session ran the 480 layout — so it is code-held but frame-unverified and must be labelled INFERRED-from-source if built.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, duel_frames/Nr4fQstqHDM_t425.0s.png, zFt_combat/zFtCaTO0_1M_t0320s.png, zFt_combat/zFtCaTO0_1M_t0325s.png`
- **Quote:** Per-column max-luminance content extents (threshold >25) over full 1920x1080 frames: video B 52->1867 (width 1816, aspect 1.682) in duel_dense/_427.0, _427.1, _427.2, _431.5 and duel_frames/_t425.0s; video A 55->1861 (1807, aspect 1.673) and 54->1861 (1808, 1.674). Rows 0->1079 in all — no letterbox, pillarbox only. All approximately 5:3, none approximately 800/690 = 1.159.
- **Lane impact:** ui-hud lane: bounds Pass 1's claim 2 (dual-layout 480/690). The layout exists in code but nobody has ever seen it rendered; a rebuild that ships it is authoring, not copying. Independently replicates Pass 1's pillarbox measurement to the pixel (52/1816 and 55/1807).

### `ui-hud/hud-symbol-metrics` — STILL_UNHELD [STILL_UNHELD]

HUD panel/bar/plaque pixel geometry, the icon manifest, and the identity of the gold up-arrow skill in slot 3 remain ungrounded — I will not name any of them.

- **Lane impact:** ui-hud lane: the residual after P3/P4/P5. Every HUD class is [Embed(source="/_assets/assets.swf", symbol="symbolNNNN")] (BattleUI 2952, OptionsUI 1133, DialogBox 83, SkillSlotButton 2915, WinUI 2894, BattleIntroBar 2855, DuelIntroBar 2861, ScreenTransition 2758) and only scripts/ was exported, so symbol geometry is not on disk; the 139 <icon> ids in 90_InteractUI_UIData.bin map to unextracted art; and the slot-3 up-arrow is an equipped-skill image from ResourceManager.getSkillImage (NOT the stance control, which is bound to battlemodebust) but which skill is unproven. Closing all three is one JPEXS shape/sprite export away.

### `ui-hud/interactui-menu-system` — HELD [A2]

An entire data-driven interaction-UI subsystem — 19 screens, 47 menu pages, 139 options with icons, inventory gates and error copy — is on disk and is mentioned by neither the ledger's ui-hud block nor Pass 1.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:5-9,17`
- **Quote:** `<title>peddler</title>` then `<option><label>83</label><icon>15</icon><action><id>peddlerbuy</id></action></option> <!-- buy buyicon-->`; and the gated form `<option><label>269</label><icon>1</icon><condition><has><id>20040</id><qty>1</qty></has></condition><action><id>goto</id><param>1</param>...<errormsg>270</errormsg></action></option> <!-- "sell crops" shopicon "you don't have any crops for sale" -->`. Root <uidata>, 20,947 bytes: 19 <ui>/<title>, 47 <menu>, 139 <option>, 139 <icon>, 28 <condition><has>, 67 <param>. Titles at lines 5/14/47/66/73/82/94/109/117/142/161/190/219/227/249/257/2
- **Lane impact:** ui-hud lane under-claim: the Ready bullet list (combat HUD, VS/FIGHT, result cards, overworld HUD, ribbon, minimap, parchment chrome, login/char-create) omits the town interaction UI entirely. Directly feeds economy (peddler/market/bank/blacksmith/gambling den option sets), world-exploration (stables, towntoll, vegpatch), rebirth-elements (a 'rebirth' screen exists) and meta-social (leaveclan, joincustomclan*).

### `ui-hud/langmanager-uses-resname-not-id` — HELD [A1]

LangManager.getString() is keyed by the XLIFF resname attribute, not the id attribute, so every string id Pass 1 of this lane quoted above 211 is wrong — and a video frame, not a document, is what proves it.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop (40,0)-(560,200), upscaled 3x) adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:124`
- **Quote:** BattleUI.as:124 reads `this.autoslashofflabel.text = LangManager.getString(619);`. Under resname (docs/gauntlet/L0/index/strings.json) 619 = 'Auto Slash Off'; under the id attribute 619 = 'Special Event'. The crop shows a brown plaque top-left reading AUTO SLASH OFF. Raw blob: `<trans-unit id="0" resname="0">`; first divergence `id="212" resname="222"` (source 'CHI'); 2,343 of 2,555 units have id != resname because 649 carry non-numeric resnames (first `id="1906" resname="IDS_Q0TITLE"`).
- **Lane impact:** Cross-lane, not just ui-hud: any lane that quoted a Mobile_Lang_EN id above 211 must re-derive it against strings.json resnames. Concretely corrects this lane's own Pass 1: 'Pause state string is id 388 "Game Paused"' is wrong (resname 388 = 'Condition: Poor'; 'Game Paused' is resname 407), and 'id 1506 Skill Slots+, ids 1648/1649/1650' should be resnames 6014 and 7009/7010/7011. Pass 1's getString(104)='FIGHT!' is below the divergence point and survives. THE FRAME WINS over both maps.

### `ui-hud/result-cards-exact` — HELD [A2]

The win/lose result cards are an 11-frame timeline with exact beats, a DRAW variant the ledger never mentions, and a revive-for-gold paywall on the lose card.

- **Cite:** `reference/decompiled/shs3_android/scripts/WinUI.as:26,32-37,49-55,90 and LoseUI.as:35-36,45,53`
- **Quote:** `addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` — brush stroke frames 1-6, winwords appears frame 7 (250 ms @24fps), stop() frame 11 (417 ms). `if(!BattleUI.instance.getIsDraw()){ this.winwords.gotoAndStop(1); } else { this.winwords.gotoAndStop(2); }`. Buttons resname 482 'Continue' + 483 'Save Replay', shown only `if(NetworkManager.instance.isRecording())`; on save `this.urltext.text = "http://www.strawhatsamuraiduels.com/watch?name=" + StatsManager.charname;`. LoseUI: respawnbutton resname 480 'Respawn' (483 when recording) plus `gold`, `getgoldpromptdialog`, `payui`.
- **Lane impact:** ui-hud lane: upgrades the Ready bullet 'result cards' from structural to frame-exact and adds an unlisted DRAW state. Touches economy (the lose card is a gold-gated revive prompt) and meta-social (replay URL).

### `ui-hud/slot-geometry-frame-validated` — HELD [A1]

The Android v0.682 source predicts the web v0.717 video frame's skill-slot layout to within ~1 px, which is the strongest build-parity evidence in this lane and retires the 'android parity not established' caveat for the combat HUD.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop (1380,920)-(1880,1080), upscaled 3x) vs reference/decompiled/shs3_android/scripts/BattleUI.as:133-134`
- **Quote:** Visible in the crop: three slot boxes, leftmost empty AND unnumbered, middle labelled 2, right labelled 3 holding a gold up-arrow. Measured empty-box bright border: columns 1449->1558 (centre 1503.5), rows 952->1073 (centre 1012.5). Converting with this video's own pillarbox (x0=52, content width 1816, scale 2.270) gives game (639.4, 446.0); code says `skillSlotButton.x = 760 - i * 60; skillSlotButton.y = 450;` i.e. (640, 450) for i=2. Measured pitch 137 frame px = 60.4 game px vs 60.
- **Lane impact:** ui-hud lane: converts Pass 1's rule-level claim into a measured frame<->code match, and licenses using the Android decompile as a source of web-build HUD geometry. Unnumbered empty slot matches initEmpty() clearing keypressText (SkillSlotButton.as:128).

### `ui-hud/transition-durations-exact` — HELD [A2]

Screen-transition durations are constants in the shipped code and resolve exactly: each black shutter takes 17 frames (708 ms) and the white fade takes exactly 24 frames (1000 ms) at the SWF's 24 fps.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:80-88,111,143-146,159-162`
- **Quote:** `this.blackup.y = -240; this.blackdown.y = 480; this.blackMovtSpeed = 0; this.counter = 0;` (:143-146) then per frame `this.blackup.y += this.blackMovtSpeed; this.blackdown.y -= this.blackMovtSpeed; this.blackMovtSpeed += 2; if(this.blackup.y >= 0){ this.blackup.y = 0; this.blackdown.y = 240; if(this.counter >= 17)` (:80-88), and `this.white.alpha -= 1 / 24;` (:111). Speed applies before it increments, so displacement after n frames is (n-2)(n-1); (17-2)(17-1) = 240 exactly, which is why the gate is counter >= 17.
- **Lane impact:** ui-hud lane: overturns this lane's own Pass 1 claim 21 ('the durations are driven by blackMovtSpeed and per-call counter values I did not trace to constants this pass ... Claiming either would be guessing. Unheld pending a follow-up.'). Also confirms the ledger's Ready bullet 'transition timings' and supplies a third independent confirmation of the 480-px stage height (shutter halves park at +/-240 and meet at 240).

## unassigned — re-scored ?

### `art-anim-audio-feel/690-is-the-friend-panel` — HELD [A2] ⚑ OVERTURNS LEDGER

The 800x690 rect is not container chrome: GameEngine.resizeHandler names the extra 210 px as originalHeightWithBar and switches to it with StatsManager.stageShowingFriendBar = true plus OverworldHUD.instance.friendpanel.init() - an in-game friend panel that is a second, unbuilt UI surface.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-306, and :190 for the fullscreen path`
- **Quote:** GameEngine.as:271 `var originalHeightWithBar:int = 690;` :275 `if(newAspectRatio <= originalWithBarAspectRatio)` :278 `originalHeight = originalHeightWithBar;` :279 `StatsManager.stageShowingFriendBar = true;` :282 `OverworldHUD.instance.friendpanel.init();` ; and :190 `stageMC.fullScreenSourceRect = new Rectangle(0,0,800 * newScale,480 * newScale);`
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud gains a whole layout mode and a friend panel it does not hold; world-exploration/meta-social gain the social strip. art-anim-audio-feel: the claimed doc-vs-frame conflict never existed - the code holds 800x480 AND 800x690 with an explicit aspect branch, and the videos read 5:3 only because they were captured in fullscreen where fullScreenSourceRect clips to 800x480.

### `art-anim-audio-feel/hud-150-is-a-potato-buff` — HELD [A2] ⚑ OVERTURNS LEDGER

The '150% DAMAGE' line in the reference frame is a consumable food-buff readout, not a stance modifier - and the shipped stance rock-paper-scissors multiplier is x1.2, not x1.5.

- **Cite:** `reference/extracted/itemdata.xml:237-249 (item 2115) resolved through reference/extracted/android/118_Mobile_Lang_EN.bin; reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3703`
- **Quote:** itemdata.xml:238-248 `<id>2115</id><type>10</type><name>4125</name> ... <desc>4132</desc><modifier><id>38</id><value>1</value></modifier>`  ·  Lang_EN resname 4125 = 'Potato Dog', resname 4132 = 'Eat this potato to get the 150% Damage buff. Note: Only one buff may be active at a time.'  ·  MCSPlayer.as:3703 `damage *= 1.2;` (the stance-advantage branch opening at :3701)
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH - all measured/authored but missing from the art digest S5."
- **Lane impact:** art-anim-audio-feel: overturns the CAUTION inside claim art-anim-audio-feel/hit-reaction-12-ticks, which reads the HUD's '150% DAMAGE' as the stance modifier. It is neither the stance modifier nor a second 1.5 to avoid conflating - it is an active-buff readout from a type-10 consumable, paired with its restriction line 'CANNOT CHANGE STANCE'. Cross-lane: ui-hud gains an active-buff HUD element no ledger holds (buff name + restriction, bottom-left under the HP/Chi bars); combat-core gains the real stance-advantage number, x1.2, contradicting any 1.5 assumption; items-equipment gains the buff-item shape (type 10, modifier id 38, one buff active at a time).

### `art-anim-audio-feel/killbeat-6000ms-pins-24hz-tick` — HELD [A1] ⚑ OVERTURNS LEDGER

The end-of-battle red freeze measures exactly 6.000 s (360 frames at 60 fps) twice independently, which is redFreezeCounter = 24*6 = 144 ticks and pins the simulation tick rate at 24.0 +/- 0.3 Hz - frame-confirming both the 24 Hz clock and the kill-beat number, and proving the 15 Hz on-screen cadence is the capture rate, not the game.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4, my 60 fps extraction + red-fraction (>0.65 of a 64x36 downscale) measurement at t=514-526 and t=585-597; against reference/decompiled/shs3_android/scripts/StageManager.as:1101`
- **Quote:** red run t=516.683..522.667 duration=6.000s (360 frames @60); red run t=587.683..593.667 duration=6.000s (360 frames @60); t=697.550..703.600 6.067s; t=864.417..871.067 6.667s. StageManager.as:1101 'redFreezeCounter = 24 * 6;' => 144 ticks in 6.00 +/- 0.07 s => 24.0 +/- 0.3 Hz. A 15 Hz sim would take 9.6 s.
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel: raises claim 24fps-keyframe-stream from PARTIAL to frame-confirmed HELD, and confirms claim kill-beat-timings from the frame side. The ledger's '15fps pose latch' is a correct description of the VIDEO and a wrong description of the GAME - the sim ticks at 24 Hz and both uploads were recorded at 15 fps. Bonus: the code's normal exit is at counter==24 (5.0 s), so measuring 6.0 s twice proves the SHEATHESWORDCHIBURI branch at StageManager.as:916 is the common case.

### `art-anim-audio-feel/no-blendmode-holds-for-timeline-tags-too` — HELD [A3] ⚑ OVERTURNS LEDGER

The no-blend-mode finding survives the check an ActionScript grep cannot do: every blend-mode flag in the shipped web client's timeline tags is false, 498 of 498.

- **Cite:** `grep -a -o -E '[a-zA-Z]*blendMode="[^"]*"' reference/extracted/payload.xml | sort | uniq -c ; plus my PlaceObject3 flag parse of the three decoded Android resource SWFs`
- **Quote:** 194 buttonHasBlendMode="false" / 304 placeFlagHasBlendMode="false" — zero "true". PlaceObject3 tags with HasBlendMode set: 115_Mobile_SHS3Resource 0, 124_Mobile_ImageResource 0, 120_Mobile_BGResource 0.
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** art-anim-audio-feel: blocker 3 was closed on an AS3 grep alone, which cannot see a blend mode set in the Flash IDE (PlaceObject3 / DefineButton2 tag flags). I checked those and they are all off, so the 'none - normal alpha only' answer now covers authored timeline content too. A recreation may use plain alpha compositing with confidence.

### `art-anim-audio-feel/no-blendmode-in-authored-data` — HELD [A3] ⚑ OVERTURNS LEDGER

No blend mode is set in the authored timeline data either, not just in ActionScript: zero PlaceObject3 tags carry the blend-mode flag across all five decoded resource SWFs.

- **Cite:** `my PlaceObject3 flag scan (top-level and nested inside every DefineSprite) of the decoded 115_Mobile_SHS3Resource, 124_Mobile_ImageResource, 120_Mobile_BGResource, 113_Mobile_MusicResource, 122_Mobile_SoundResource`
- **Quote:** PlaceObject3-with-blendmode-flag count: 0 — reported for every one of the five decoded containers
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** art-anim-audio-feel: this is the half of blocker ③ a code grep structurally cannot answer, because in Flash a blend mode is normally authored on the timeline and rides in a PlaceObject3 tag without ever touching ActionScript. With both paths checked, 'none — normal alpha only' is now a closed result rather than an argument from absence.

### `art-anim-audio-feel/second-layout-mode-800x690` — HELD [A2] ⚑ OVERTURNS LEDGER

The client ships a SECOND layout mode - 800x690 with a friend bar - entered whenever the window aspect drops to 800/690 or below, which is why the SWF document rect decodes to 800x690.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-288`
- **Quote:** GameEngine.as:271 `var originalHeightWithBar:int = 690;` · :273 `var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar;` · :275 `if(newAspectRatio <= originalWithBarAspectRatio)` · :277-282 `originalAspectRatio = originalWithBarAspectRatio; originalHeight = originalHeightWithBar; StatsManager.stageShowingFriendBar = true; ... OverworldHUD.instance.friendpanel.init();`
- **Overturns:** "**Aspect-ratio truth** - native canvas is **800x480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** art-anim-audio-feel and ui-hud: the ledger's aspect-ratio item has TWO answers, not one - 800x480 when window aspect > 1.1594, and 800x690 (480 play area plus a friend bar) otherwise, with StatsManager.stageBaseHeight switching between them. This dissolves the doc-vs-frame conflict that claim art-anim-audio-feel/aspect-ratio-frame-wins invokes the standing frame-wins invariant to settle, and it hands ui-hud a friend-panel layout (OverworldHUD.instance.friendpanel.init()) that no ledger holds.

### `art-anim-audio-feel/zero-blendmode-byte-proof` — HELD [A3] ⚑ OVERTURNS LEDGER

The no-blend-mode negative is now a byte proof rather than a grep: 2,091 PlaceObject3 tags across all three decoded art containers and both decoded payloads carry zero blend-mode fields.

- **Cite:** `recursive PlaceObject3 parse (descending into every DefineSprite) of reference/extracted/android/115_Mobile_SHS3Resource.bin, 124_Mobile_ImageResource.bin, 120_Mobile_BGResource.bin, reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** 115: PO3=12 blendmodes={} · 124: PO3=1473 blendmodes={} · 120: PO3=54 blendmodes={} · shs3_payload_decoded.swf: PO3=304 blendmodes={} · shs3_android_payload_decoded.swf: PO3=248 blendmodes={}
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** art-anim-audio-feel: blocker 3 closes on bytes, not on an ActionScript grep that could not have seen timeline-authored blend modes. Upgrades the survey's evidence class for the same conclusion.

### `combat-core/36-was-not-a-crit` — HELD [A1] ⚑ OVERTURNS LEDGER

The repo's only numeric basis for 'crit 1.3' (red 36 vs 27 on the same target) is dead: the crit bar was EMPTY on every frame of that fight, so 27/30/36 is a random damage roll — frame proof of the RNG term in getDamage().

- **Cite:** `reference/frames/session11/damage-ttk/t19*.png (18 frames), row-1032 crit-bar scan x∈[247,515]; plus t1961.900.png HUD crop (100,940)-(620,1080) LANCZOS x3`
- **Quote:** bar_px = 0 (0%) on all 18 frames t1940.000 … t1979.000. The t1961.900 HUD crop reads green 10/20, blue 20/20, and the third bar showing 'CANNOT CHANGE STANCE' — i.e. reload < maxreload/6 (MCSPlayer.as:2977), so a crit was impossible. The red '36' popup lands on JINBEI (4) in that same frame.
- **Overturns:** "36/27 = 1.333 does match the forum-derived "crit 1.3""
- **Lane impact:** L5 — closes the 'crit 1.3' folklore from the frame side as well as the source side, and gives the next measurer a real crit-detection protocol: pair every popup value with the third bar's state in the same frame (full + 'CRITICAL HIT' = crit, anything else = roll).

### `combat-core/basereload-is-dead-code` — HELD [A2] ⚑ OVERTURNS LEDGER

getBaseReload() = 48 + SPD·6 is computed, passed into initPlayer and stored, and then never read anywhere — it is dead code in both builds, so there is no speed-scaled crit-meter refill to implement.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1839-1842 and MCSPlayer.as:105, :182, :190; exhaustive grep over reference/decompiled/shs3_android/scripts/`
- **Quote:** StatsManager.as:1841  return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;   ///   MCSPlayer.as:190  this.baseReload = baseReload;   ///   grep -rn baseReload → MCSPlayer.as:105,182,190 · EnemyClone.as:49 · EnemyPlayer.as:754 · EnemyElite.as:99 · FriendlyElite.as:49 — no read site anywhere
- **Overturns:** "an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax) that no ledger system records"
- **Lane impact:** L5 + L2 — do NOT build a SPD-scaled meter refill. SPD affects reach (via the 20+SPD soft-cap) and skill cooldowns, not crit-meter charge rate.

### `combat-core/basereload-is-dead-code` — HELD [A2] ⚑ OVERTURNS LEDGER

getBaseReload() = 48 + SPD·6 is passed into initPlayer, stored, and NEVER read — the crit meter fills at a flat ++reload per frame, so SPD does not accelerate crit charging in v0.682.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105, :182, :190 (the only three occurrences in the class) vs :1158-1160; StatsManager.as:1840-1843`
- **Quote:** MCSPlayer.as:105 `internal var baseReload:int = 48;` · :190 `this.baseReload = baseReload;` · and the actual fill: :1158 `if(this.reload < this.maxreload)` :1160 `++this.reload;`. A grep of `baseReload` across all 2,768 android scripts finds only declarations, the initPlayer parameter, the assignment, and EnemyClone.as:49 copying it — no read site that affects the meter.
- **Overturns:** "an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax)"
- **Lane impact:** L5 — do NOT put a SPD term in the crit-meter refill config. slashUsage (spend side) and the stance-switch tax are real; the 48 + SPD·6 refill is not.

### `combat-core/crit-is-1.3-gated-on-full-slash-meter` — HELD [A2] ⚑ OVERTURNS LEDGER

Crit in v0.717 is a flat x1.3 plus the crit-damage affix, and it fires exactly when the slash/reload meter is full - which answers combat-core blockers 2 and 5 in one expression.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (meter identified as the slash meter by :3162 and :3302-3310); android divergence at reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3215-3222`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; } return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** combat-core blockers ② and ⑤ both close without a video read. The 1.3-vs-3 question is settled at 1.3 (+ STAT_CRITICALDMG, an additive gear affix). The Focus/crit gating rule is: crit applies only while the meter is at max, and the meter is spent by slashing (§1t99s0§.as:3302-3310, -slashUsage/2, -slashUsage, -slashUsage*1.5 by stance) and by changing stance (:3162, a flat -48) - so crit is a first-strike-from-full mechanic, not a random roll. The android v0.682 twin instead uses x1.2, or x1.5 for Light, on 'reload == maxreload' - the desktop wins.

### `combat-core/crit-meter-is-6-seconds` — HELD [A2] ⚑ OVERTURNS LEDGER

The web crit meter is maxreload = 8x24 = 192 ticks drawn as (reload-48)/(192-48) = 144 ticks at 24 fps = exactly 6.000 s of visible travel, and the stance-switch gate is a flat reload < 48 — which is why 'CANNOT CHANGE STANCE' shows only at displayed 0%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :3060; §1t113s0§.as:328-338`
- **Quote:** this.§1t4415s0§ = 8 * 24;   ///   if(this.§1t4414s0§ < 48) { return; }   ///   var _loc3_:Number = (param1 - 48) / (param2 - 48); if(_loc3_ < 0) { _loc3_ = 0; } this.§1t5182s0§.bar.scaleX = _loc3_;
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — build 6.000 s, not 5.8 s and not 4.0 s. Independently confirmed on frames: my three measured windows fit 6.000 s to <=1.2 px (t1004.800->t1005.000 9 vs 8.8 px; t1082.100->t1082.900 36 vs 35.1; t1081.100->t1082.100 45 vs 43.8), and 5.845 s is not realisable as an integer tick count at the SWF-header 24.0 fps.

### `combat-core/crit-track-268px-six-seconds` — HELD [A1] ⚑ OVERTURNS LEDGER

The crit/reload track is 268 px wide at 1080p (x 245..512), measured on a bar that is actually FULL — which makes the fill rate 45.0 px/s = 16.8 %/s and the empty→full sweep 5.96 s, not 5.8 s.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t2175.933.png — white-pixel extent over rows 1026-1049, x∈[200,600]; HUD crop (100,940)-(620,1080) LANCZOS x3`
- **Quote:** bar white extent x 245 -> 512, width 268. The crop shows green 4/20, blue 47/47, and the third bar 100% solid white with 'CRITICAL HIT' printed across it. Rate from crit-focus/t1082.100 (edge 303) to t1082.900 (edge 339) = 36 px / 0.8 s = 45.0 px/s ⇒ 268/45.0 = 5.96 s. Independent third route: focusbar_scan2_videoB_fps15.tsv, edge 247 @ t2170.000 → 512 @ t2176.000 = 6.000 s.
- **Overturns:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end)"
- **Lane impact:** L5 + L8 — build the meter at 6.0 s, and use 268 px / x 245..512 as the HUD track geometry for all three bars. Measuring a bar's track on an EMPTY bar is the error mode; measure it on a full one.

### `combat-core/early-mob-hp-distribution` — HELD [A2] ⚑ OVERTURNS LEDGER

Of the 495 <npc> rows, 22 are lvl<=2 and their HP is 1 (x17), 2 (x1) and 5 (x4); the four 5-HP rows (ids 7, 8, 9, 10) all carry defense 3, so against the starter Branch they take five hits, not one.

- **Cite:** `reference/extracted/npcdata.xml — full <npc> enumeration; ids 7/8/9/10 alongside the already-cited id 6 at :145-152`
- **Quote:** npcdata.xml id 6 <lvl>2</lvl><hp>1</hp><attack>5</attack><defense>3</defense> (one-hit) vs ids 7,8,9,10 <lvl>2</lvl><hp>5</hp><defense>3</defense> — Branch roll 2, minus defense 3, floored by Damage.getMinDamage() at 1+piercing => 5 hits.
- **Overturns:** "③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.*"
- **Lane impact:** L5 + L4 — the L1 TTK model is bimodal, not 'one hit'. 77% of early mobs die to a single stroke; a distinct 18% tier takes five. Frame-side this is exactly what damage-ttk shows: '1' and '2' popups on enemies whose green bars do not empty.

### `combat-core/formula-resolves-c2-balanced-gap` — HELD [A4] ⚑ OVERTURNS LEDGER

The reach formula resolves COMBAT_MEASUREMENTS c-2's 'unresolvable' Balanced gap: balanced was measured on the level-1 tutorial where base = 124, which lands inside the measured 116–131 band, and Heavy's measured 97–103 plateau is the source's hard 100-px floor clamp rather than a mastery-9 ceiling.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md §(c) c-2 (frame-measured: Light plateau 233–241 / max 303 n=17; Balanced 116–131 n=17; Heavy 97–103 n=25) against reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347 and §1t99s0§.as:3094/:3105/:3116-3119`
- **Quote:** c-2: 'Balanced | 116–131 | 131 | 17 | wiki 200 | ❌ NOT CONFIRMED — measured 131' and '⚠️ The Balanced gap cannot be resolved from this footage … Light and Heavy were both measured on a level-8 character.' — vs base(SPD 1, dan 0) = 120 + floor(90·1/21) = 124, balanced = base × (1+0.02m) ≈ 124; heavy = max(base×(0.5+0.04m), 100) = 100.
- **Overturns:** "⚠️ **The Balanced gap cannot be resolved from this footage.**"
- **Lane impact:** L5 — three frame-measured reach numbers, taken at two different character levels, are reproduced by the v0.717 constants. That is the cross-build parity evidence the survey said did not exist, and it is positive for reach. It also retires the wiki's 300/200/100 triple for good: 200 was never a reach value.

### `combat-core/full-reload-crit-is-1p3-in-v0717` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 crit is a flat x1.3 on every stance when the reload gauge is full, plus the gear crit-damage affix - so the ledger's open 'crit 1.3 vs 3' question is closed at 1.3 for the shipped build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (§1t1243s0§ = STAT_CRITICALDMG per the initAttackStats call at §1t1523s0§.as:2269; §1t4414s0§/§1t4415s0§ = reload/maxreload per :3162 and :3169); android v0.682 diverges at MCSPlayer.as:3215-3221`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§)
{
   return _loc2_ * 1.3 + this.§1t1243s0§;
}
return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L combat-core blocker (2) closed without a video frame. Also names the trigger the ledger lists as unknown ('the Focus/crit gating rule (fill trigger/amount/consumption)'): the gate is reload == maxreload, and android v0.682 splits it x1.2 non-Light / x1.5 Light, so the split is NOT in the shipped build.

### `combat-core/injured-buff-halves-reach` — HELD [A2] ⚑ OVERTURNS LEDGER

The INJURED buff halves base slash length alongside min damage and defence - a reach modifier neither the ledger nor the rebirth lane records.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:214-223`
- **Quote:** 216:    this.defense *= 1.5;
218: else if(StatsManager.hasBuff(StatsManager.BUFF_INJURED))
219: {
220:    this.minDamage *= 0.5;
221:    this.defense *= 0.5;
222:    this.baseSlashLength *= 0.5;
223: }
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L-combat-core: reach is not a pure function of speed, Dan and stance - a status effect scales the base by 0.5 before the stance multiplier. Any reach test that does not control for BUFF_INJURED can measure the wrong number.

### `combat-core/mastery-caps-at-ten` — HELD [A2] ⚑ OVERTURNS LEDGER

Stance mastery is a 0-10 skill level, not 0-9 and not a 0-100 percentage, so the wiki's stance-damage table 0.9/1.2/1.4 is the mastery-TEN ceiling, and the v0.717 stance damage roll is Light x(0.5+0.4*m*0.1), Balanced x(1+0.2*m*0.1), Heavy/Dual/Reversed x1.4 flat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 joined to reference/extracted/skilldata.xml skills 1000 (lines 3-80), 1001 (82-159), 1002 (161-238), each carrying exactly ten <level><value> rows 1..10; param binding at §1t99s0§.as:183-199`
- **Quote:** internal function §1t4475s0§() : int
{
   var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
   switch(this.stance)
   {
      case §1t12220s0§:  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
      case §1t12221s0§:  _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
      case §1t12222s0§: case §1t12223s0§: case §1t12224s0§:  _loc2_ = _loc1_ * 1.4;
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L combat-core: 'mastery-9' becomes 'mastery-10' everywhere, and 0.5+0.4*10*0.1 = 0.9, 1+0.2*10*0.1 = 1.2, Heavy 1.4 reproduces the wiki table exactly. The ledger's 'level-1 Shugyosha does Light x0.5 / Balanced x1.0 / Heavy x1.4' is confirmed as the mastery-0 row.

### `combat-core/popup-animation-and-black-variant` — HELD [A1] ⚑ OVERTURNS LEDGER

Damage popups have a full animation contract nobody read (ttl 12 frames, velY -5, scale +0.1/frame from ttl<10, alpha -0.25/frame from ttl<4 => a 0.5 s, 60-world-unit rise ending at ~1.9x scale), and the frames show a BLACK popup alongside the dark-red one, so 0x990000 is not the whole colour story.

- **Cite:** `reference/frames/session11/damage-ttk/{t125.350,t125.417,t125.450,t125.467,t125.733}.png — crop (780,480)-(1180,680) upscaled 2x, five-tile sheet; code at reference/decompiled/shs3_android/scripts/TextProjectile.as:17-25`
- **Quote:** Visible in the crop: a dark-red '1' above the left enemy at t125.350, higher and larger at t125.417/.450; a fresh dark-red '2' at t125.467 with a BLACK '2' beside it over the GUEST/Jinbei pair; both much larger and higher by t125.733. Code: `ttl = 12; this.velY = -5;` and `--ttl; if(ttl < 10) { scaleX += 0.1; scaleY += 0.1; if(ttl < 4) { alpha -= 0.25; } }`.
- **Overturns:** "floating damage/crit popups (absent from the ledger)"
- **Lane impact:** L8 + L5 — ui-hud blocker 3 closes with an actual animation spec, not just a spawn point and a colour. The black variant needs one grep to attribute (MCSPlayer.as:709/:724 uses colour 0 for seppuku damage, so black may mark self/ally damage in v0.717) before any popup is built.

### `combat-core/popup-colour-is-a-semantic` — HELD [A1] ⚑ OVERTURNS LEDGER

Damage-popup colour is a SEMANTIC, not a constant: black (0x000000) for damage the player takes, 0x990000 for damage dealt to anyone else, plus four element colours and a chi colour — so ui-hud blocker ③ closes on the rule, not on one hue.

- **Cite:** `reference/frames/session11/damage-ttk/t1960.000.png crop (760,500)-(900,620) LANCZOS x6, and t1961.900.png crop (470,580)-(680,700) LANCZOS x5`
- **Quote:** t1960.000: above the player (tag 'GUEST', HP 14/20) a fading '2' whose modal pixels over the sky are (140,160,180)/(140,140,180) — a black glyph alpha-fading, zero red dominance. t1961.900: above JINBEI (4) (enemy, HP bar ~55%) a red '36', core pixels (163,14,0). Source agrees: MCSPlayer.as:3542 `if(this.controlledBy == 0) ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),0);` :3546 `else ... ,10027008);`; element colours 16737792 / 13421772 / 26367 / 6697728 at :3551-3563 and chi 3394815 at :1633.
- **Overturns:** "damage popups spawn at (mcs.x, mcs.y-100) in 0x990000, closing ui-hud blocker ③"
- **Lane impact:** L8 — the HUD spec needs a colour TABLE keyed on victim and damage element, not a single popup colour; building the surveyor's version paints every hit the player takes dark red. L5 — the same branch is a free 'is this me' flag for the popup emitter.

### `combat-core/raw-frames-show-full-crit-meter` — HELD [A1] ⚑ OVERTURNS LEDGER

Two raw 1920×1080 video frames — not a montage — show the third HUD bar at 99% and then at 100% with CRITICAL HIT printed across it, permanently killing SESSION-11's 'the bar never once reached full (max 67.7%)' and 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t1746.733.png and t1747.000.png — crop (150,940)-(620,1070) upscaled 3× (LANCZOS); third full-bar frame at t2175.933.png`
- **Quote:** t1746.733: HP 11/20 green, Chi 47/47 blue, third bar solid white to a ~2 px brown sliver at the right end, no text. t1747.000 (0.267 s later): identical HP 11/20 and Chi 47/47, third bar 100% white with 'CRITICAL HIT' in dark caps across it. Found by scanning all 309 1920×1080 session11 frames for a contiguous white run on row y=1032 from x=246.
- **Overturns:** "SUMMARY: HEADLINE: our build's meter set is wrong. The OG has exactly three meters — HP (green), CHI (blue), and FOCUS (white, no numerals) — and NO Critical meter at all. ... CRIT: NOT FOUND, and this matters. Across ~845 s of sampled play the bar never once reached full (max 67.7% at B t=837.683)"
- **Lane impact:** L5 + L8 — the surveyor's own cite (m_nearfull.png) is a derived montage; these are its raw sources and are the citable artifacts. SESSION-11's 'Focus buys evasion, not crit' conclusion and its Critical-meter deletion recommendation both need re-opening.

### `combat-core/reach-and-crit-configs-already-correct` — HELD [A2] ⚑ OVERTURNS LEDGER

src/config/reach.ts's lightMult 1.4 / balancedPerMastery 0.02 / heavyPerMastery 0.04 and src/config/combat.ts's CRIT_MULT 1.3 are all EXACTLY the shipped web build's values — they must not be 'fixed' to the android numbers this unit recommends.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119, :3274 vs src/config/reach.ts (REACH block) and src/config/combat.ts:17`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;   :3105  * (1 + 0.2 * this.§1t4422s0§ * 0.1);   :3116-3119  * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(... < 100) { ... = 100; }   :3274  return _loc2_ * 1.3 + this.§1t1243s0§;   ///   reach.ts: lightMult: 1.4, balancedPerMastery: 0.02, heavyBase: 0.5, heavyPerMastery: 0.04, heavyFloor: 100   ///   combat.ts:17  export const CRIT_MULT = 1.3;
- **Overturns:** "three live constants in src/config/reach.ts and one in src/config/stances.ts are WRONG against the source and must be fixed before any of it is wired in"
- **Lane impact:** L5 — this is a DO-NOT-TOUCH ruling on four live constants that are already right and already labelled CONTRACT-SRC. Only stances.ts LAUNCH_UNLOCK_LEVEL.heavy (5, source 3 in both builds) is a genuine live bug.

### `combat-core/reach-table-is-mastery-zero` — HELD [A2] ⚑ OVERTURNS LEDGER

The stance REACH table is the mastery-ZERO case, not a ceiling: the v0.717 multipliers at mastery 0 are 1.4 : 1.0 : 0.5 = 2.8 : 2 : 1, which is the ledger's 300/200/100; at mastery 10 they become 1.4 : 1.2 : 0.9, which is nothing like 3:2:1.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116`
- **Quote:** 3094: * 1.4                    (LIGHT, mastery-independent)
3105: * (1 + 0.2 * m * 0.1)     (BALANCED, = 1.0 at m=0, 1.2 at m=10)
3116: * (0.5 + 0.4 * m * 0.1)   (HEAVY,    = 0.5 at m=0, 0.9 at m=10)
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: the ledger's §3 correction is HALF wrong. Damage 0.9/1.2/1.4 is a mastery ceiling (see combat-core/mastery-is-small-integer) but reach 300/200/100 is the mastery-0 ratio. Treating reach as a ceiling would shrink every low-mastery stance reach in the rebuild.

### `combat-core/reach-table-is-mastery-zero-not-a-ceiling` — HELD [A2] ⚑ OVERTURNS LEDGER

The wiki reach table 300/200/100 is the mastery-ZERO base at high speed, not a mastery ceiling: base slash length asymptotes to 210 stage px at Dan 0, and the mastery-0 stance multipliers 1.4/1.0/0.5 give 294/210/105.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348 (base) combined with §1t99s0§.as:3094/3105/3116 (mastery-0 multipliers); android confirm StatsManager.as:1915-1919`
- **Quote:** internal static function §1t9593s0§(param1:int) : int
{
   var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
   return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
}
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L combat-core blocker (1): the damage table and the reach table are read off DIFFERENT rows of the mastery curve - damage at mastery 10, reach at mastery 0. The ledger sweeps both into one claim. At mastery 10 the reaches are 294/252/189, nothing like 300/200/100. Note the crossover the ledger misses: the mastery-scaled term is each stance's WEAK axis (Light's damage, Heavy's reach); its strong axis is a fixed 1.4.

### `combat-core/reach-ts-was-right` — HELD [A2] ⚑ OVERTURNS LEDGER

src/config/reach.ts's lightMult 1.4, balancedPerMastery 0.02 and heavyPerMastery 0.04 are the CORRECT v0.717 values read out of the web payload; the survey's prescription to replace them with 1.5/0.005/0.005 would have broken three correct CONTRACT-SRC constants.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120`
- **Quote:** case LIGHT: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;  ...  case BALANCED: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);  ...  case HEAVY: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — reach.ts needs no change; promote its five multiplier constants from CONTRACT-SRC to CONTRACT-SRC-v0.717 with file/line. The reach<->damage permutation its comment documents is real in the web build (reach light 1.4 flat / damage heavy 1.4 flat, sharing the same two mastery curves).

### `combat-core/stance-damage-mastery10-ceiling` — HELD [A2] ⚑ OVERTURNS LEDGER

The wiki's stance damage triple 0.9 / 1.2 / 1.4 is not a mystery table - it is the v0.717 desktop's own per-stance damage function evaluated at mastery 10, and the ledger's 'mastery-9 ceiling' framing is off by one.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3276, joined to reference/extracted/skilldata.xml skills 1000/1001/1002 (10 <level> rows each)`
- **Quote:** internal function §1t4475s0§() : int { var _loc1_:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); break;   // LIGHT -> 0.9 at mastery 10 | case §1t12221s0§: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); break;   // BALANCED -> 1.2 at mastery 10 | case §1t12222s0§: case §1t12223s0§: case §1t12224s0§: _loc2_ = _loc1_ * 1.4;   // HEAVY/DUAL/REVERSED, flat }
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** combat-core: the damage multipliers become CONTRACT from the shipped v0.717 client rather than a wiki reading. Light scales 0.54 -> 0.9 across mastery 1-10, Balanced 1.02 -> 1.2, Heavy/Dual/Reversed a flat 1.4 with no mastery term at all. The ceiling is mastery 10 (skilldata gives skills 1000/1001/1002 exactly ten levels), so every 'mastery-9' label in the ledger should read mastery-10. It also means Heavy is the only stance whose damage does NOT improve with mastery - a design fact absent from the board.

### `combat-core/stance-reach-is-mastery-zero-base` — HELD [A2] ⚑ OVERTURNS LEDGER

The wiki stance reach table 300/200/100 records MASTERY-ZERO BASE values, not mastery-9 ceilings — Light-stance reach carries no mastery term at all in either build, so it cannot be a mastery-9 ceiling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094 (Light, constant), :3105, :3116; android MCSPlayer.as:3030; StatsManager.as:1915-1919 (base tops out at 210 px at Dan 0)`
- **Quote:** 3094:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;   // Light — NO mastery variable in the expression
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** combat-core: structural argument is decisive on its own — a bare constant cannot be a mastery-9 ceiling. Numerically, desktop multipliers at mastery 0 give 1.4 : 1.0 : 0.5 = 2.8 : 2.0 : 1.0, matching the wiki's 3 : 2 : 1; at mastery 9 they give 1.63 : 1.37 : 1.0, which does not. Heavy also lands on the shipped floor exactly (210 x 0.5 = 105, clamped to 100). The remediation at REBUILD_READINESS.md:320 ('relabel mastery-9') is backwards — label the tables mastery-0 BASE, with mastery a modest additive bonus on Balanced/Heavy only.

### `combat-core/stance-reach-modifiers` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance slash-length modifiers are held verbatim in the WEB payload — LIGHT ×1.4, BALANCED ×(1+0.02·balancedMastery), HEAVY ×(0.5+0.04·heavyMastery) with a hard floor of 100, REVERSED ×1.4, DUAL = base floored at 100 — which closes L1 combat-core blocker ① outright, and they are DIFFERENTLY TUNED in the Android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3093, :3105, :3115-3119, :3130, :3141-3145 (web v0.717) vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052-3055, :3067, :3078-3081 (android v0.682)`
- **Quote:** WEB §1t99s0§.as:3093 'this.§1t4417s0§ = this.§1t4420s0§ * 1.4;' · :3105 'this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);' · :3115-3119 'this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }'  ||  ANDROID MCSPlayer.as:3030 'this.slashLength = this.baseSlashLength * 1.5;' · :3041 '… * (1 + 0.5 * this.balancedMastery * 0.01);' · :3052-3055 '… * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; }'
- **Overturns:** "① **reach cap in stage px per stance** — the one value the whole model needs."
- **Lane impact:** L1 combat-core blocker ① dies in full, not partially: base = 120 + floor((90 + Dan*5)*spd/(20+spd)) from progression/spd-scaling, then the per-stance multiplier above. COMBAT_MEASUREMENTS §S24-B's measured band (30 strokes, 120–280 px @1080 = 53–124 world px) sits entirely UNDER these caps, which is exactly what a truncation cap predicts, and the wiki ceilings in §S24-B/c-0 (Light 300 / Balanced 200 / Heavy 100) land on the payload: HEAVY's hard floor is literally 100, and LIGHT at the Dan-1 asymptote is (120+95)×1.4 = 301 ≈ 300. Also the SECOND independent proof in this lane that Android is differently tuned — generalising Stage-0b S0-3 from 'per-point magnitudes' to 'combat tuning at large'. Port from WEB.

### `combat-core/v0717-crit-is-flat-1.3` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② resolves to 1.3 after all: the v0.717 build applies a flat ×1.3 plus a flat crit-damage stat at full meter, with no stance branch — so CRIT_MULT = 1.3 in src/config/combat.ts is already right.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; } return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — blocker ② is closed at the TARGET build, in the ledger's own favour. The ×1.5/×1.2 split is a v0.682-only retune. SOURCE_CONSTANTS.md:158 additionally records a SECOND, stacking ×1.3 for body parts 12 neck / 16 head / 17 hat — which is the v0.717 answer to the survey's ×1.5 behead.

### `combat-core/v0717-stance-curves-are-already-in-config` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 web payload gives light reach ×1.4, balanced ×(1+0.02·mastery), heavy ×(0.5+0.04·mastery) floored at 100, and damage light ×(0.5+0.04·m) / balanced ×(1+0.02·m) / heavy ×1.4 — i.e. src/config/reach.ts is already correct and the survey's 'three wrong constants' would regress it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119 (reach) and :3258-3271 (damage); build stamped 0.717 at §1t1523s0§.as:36`
- **Quote:** 3094: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;  ·  3105: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);  ·  3116-3119: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }  ·  3262-3270: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); … _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); … _loc2_ = _loc1_ * 1.4;
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — do NOT touch src/config/reach.ts. lightMult 1.4, balancedPerMastery 0.02, heavyPerMastery 0.04, heavyFloor 100 are the target build's own numbers and were read from this file on 2026-07-25 (SOURCE_CONSTANTS.md:193, 204-206). The android 1.5/0.005/0.005 values are v0.682 and must never be quoted as 0.717.

### `combat-core/v0717-stance-multipliers` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop client carries the full five-case stance slash-length switch and its numbers differ from the android v0.682 bundle in four of five cases: LIGHT x1.4 (not 1.5), BALANCED x(1 + 0.2*mastery*0.1), HEAVY x(0.5 + 0.4*mastery*0.1) floored at 100, REVERSED x1.4, DUAL x1.0 floored at 100.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 (compare reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3082)`
- **Quote:** 3094: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117: if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
3131: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3142: this.§1t4417s0§ = this.§1t4420s0§;
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: the stance reach model is now recovered from the SHIPPED v0.717 client rather than inferred, and the android values must NOT be used. It also kills the surveyor's 'parity is NOT established' framing and shows the 0.682-to-0.717 numeric drift is far worse than the '1 in 6' the lane reported - 4 of 5 branches moved in this one function.

### `combat-core/v0717-stance-slash-multipliers` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop build's per-stance slash-length multipliers are on disk and differ from the android v0.682 set the survey adopted: Light and Reversed are x1.4 (not x1.5), Balanced is base*(1 + 0.2*balancedMastery*0.1), Heavy is base*(0.5 + 0.4*heavyMastery*0.1) floored at 100 px, Dual is base floored at 100 px.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3155 (desktop MCSPlayer; identified because it defines §1t4446s0§, the initElementDefenseStats callee at §1t1523s0§.as:2270), param order pinned at :183-199`
- **Quote:** case §1t12220s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
case §1t12221s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
case §1t12222s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
   if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's *reach* also scales ×0.5→×0.9."
- **Lane impact:** L combat-core: the reach multipliers stop being android-only guesses. Also kills the survey's PARTIAL on rebirth/stance-slash-multipliers-parity - the surveyor's grep terms ('0.005', '0.5 + 0.5 *') exist in neither build, so its negative grep proved nothing.

### `combat-core/v0717-stance-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete v0.717 per-stance combat table — slash-length multiplier, damage multiplier, crit multiplier and defence multiplier — is on disk in the desktop bundle, so combat-core blocker ① needs no footage measurement and no playable build for its multipliers.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094/:3105/:3116-3119 + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2721-2748`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                  // LIGHT slash\n§1t99s0§.as:3105  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);   // BALANCED slash\n§1t99s0§.as:3116  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); // HEAVY slash, floor 100\n§1t5957s0§.as:2725-2728  _loc41_ = 0.5 + 0.4 * _loc46_ * 0.1;  _loc42_ = 1.3;  _loc47_ = 1;  _loc48_ = 1.4;   // LIGHT dmg/crit/def/slash\n§1t5957s0§.as:2735-2738  _loc41_ = 1 + 0.2 * _loc46_ * 0.1;    _loc42_ = 1.3;  _loc47_ = 1;  _loc48_ = 1 + 0.2 * _loc46_ * 0.
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core (L for combat-core): the per-stance multipliers are CONTRACT from the shipping v0.717 build — Light x1.4, Balanced x(1+0.02·mastery), Heavy x(0.5+0.04·mastery) floored at 100 — and mastery is a 0-10 scale, not 0-100. Combined with getBaseSlashLengthVal this gives Dan-0 reach of 294 (Light) / 210-252 (Balanced) / 105-189 floored to 100+ (Heavy) in display units. Only the stage-px:frame-px conversion still needs footage. Also confirms the ledger's dmg 0.9/1.2/1.4 as mastery-ceiling values and the banked 'crit 1.3' correction (crit is a flat 1.3 in ALL three stances in v0.717, vs android's 1.2/1.5).

### `combat-core/web-as3-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build v0.717's full ActionScript is decompiled and cross-readable in the repo — 1,079 classes with obfuscated identifiers but intact numeric literals — so combat constants never needed to come from the android v0.682 build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (StatsManager, web) and §1t99s0§.as:9-19 (MCSPlayer, web); inventory count at reference/decompiled/payload_export.log:4`
- **Quote:** §1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;   ///   §1t99s0§.as:9-19  internal static var standingRange:int = 50; ... internal static var jumpThreshhold:int = 100; ... internal static var lightSlashSpeed:int = 50; internal static var balancedSlashSpeed:int = 40; internal static var heavySlashSpeed:int = 30;   ///   payload_export.log:4  Exported script 1/1079 mx.core.mx_internal
- **Overturns:** "The web payload's own AS3 is obfuscated (reference/decompiled/shs3_payload/scripts/§1t51s0§/, 5 files) and cannot be cross-read."
- **Lane impact:** L5 + every lane that cited android source — the CONTRACT-SRC-v0.682 labelling policy this unit proposes is unnecessary; constants that match across both builds (base-reach formula, standingRange, jumpThreshhold, slash speeds, defence ×0.8, slashUsage floor 48, unlock ladder, RNG damage roll) can be promoted to plain CONTRACT today, and constants that differ must be taken from the WEB file.

### `combat-core/web-as3-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 client's ActionScript is decompiled, on disk, and readable: 1079 .as files under reference/decompiled/shs3_payload/scripts/, with all numeric literals and many identifiers unmangled — §1t99s0§.as is MCSPlayer, §1t1523s0§.as is StatsManager, §1t1541s0§.as is InputManager, §1t113s0§.as is BattleUI, §1t67s0§.as is Damage, §1t68s0§.as is NPC.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19`
- **Quote:** internal static var standingRange:int = 50; internal static var jumpThreshhold:int = 100; internal static var runSpeed:int = 12; internal static var lightSlashSpeed:int = 50; internal static var balancedSlashSpeed:int = 40; internal static var heavySlashSpeed:int = 30;
- **Overturns:** "no playable build ... ~40 INFERRED values won't be measured from a live build"
- **Lane impact:** ALL LANES — demote the android build to a named-symbol Rosetta stone (read it to learn what §1t4414s0§ means, then read the VALUE out of the web file). Every lane that cited shs3_android as authority needs a parity pass. This is a bigger unlock than the string table (S0-3).

### `combat-core/web-behead-is-1.3` — HELD [A2] ⚑ OVERTURNS LEDGER

The behead (hat/head/neck) multiplier in the shipped web build is ×1.3, not ×1.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:470-472 (vs reference/decompiled/shs3_android/scripts/NPC.as:451-453)`
- **Quote:** web §1t68s0§.as:470-472: `if(this.§1t1071s0§)\n{\n   _loc3_ *= 1.3;\n}`   ·   android NPC.as:451-453: `if(behead)\n{\n   damage *= 1.5;\n}`
- **Overturns:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** L5 — universal head/neck/hat weak point confirmed in the shipped build, but at ×1.3. Note the pattern: v0.682 moved BOTH the crit multiplier and the behead multiplier off 1.3 and onto 1.5, so any android number near 1.5 should be treated as suspect until cross-read.

### `combat-core/web-build-as3-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build's ActionScript is fully readable — 1079 decompiled classes under reference/decompiled/shs3_payload/, name-obfuscated but literal-intact — so every combat constant can be cross-read on v0.717 directly instead of being inferred from the android v0.682 client.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (build stamp) + docs/gauntlet/L0/index/actionscript.json bundles.shs3_payload = 1079`
- **Quote:** §1t1523s0§.as:36: `public static var §1t9323s0§:Number = 0.717;`  ·  actionscript.json: {"shs1":164,"shs2":366,"shs3_android":970,"shs3_android_payload":970,"shs3_loader":3,"shs3_payload":1079,"shs3_stage2":6,"shs3_stage3":9}  ·  `find reference/decompiled/shs3_payload -name '*.as' | wc -l` -> 1079  ·  `ls 'reference/decompiled/shs3_payload/scripts/§1t51s0§/' | wc -l` -> 1
- **Overturns:** "P0 EXPERIMENT RUN 2026-07-23: DEFINITIVELY no offline playable build ... ~40 INFERRED values won't be measured from a live build."
- **Lane impact:** L5 (and every other lane citing android source) — the whole 'android v0.682 is all we have, parity unproven' framing is wrong. Class map recovered by numeric-literal shape: §1t99s0§=MCSPlayer, §1t1523s0§=StatsManager, §1t113s0§=BattleUI, §1t1541s0§=InputManager, §1t67s0§=Damage, §1t68s0§=NPC, §1t122s0§=stat/enemy builder. ~40 INFERRED values are now readable from the shipped build without needing it to run.

### `combat-core/web-crit-is-1.3-flat` — HELD [A2] ⚑ OVERTURNS LEDGER

Crit in the shipped web build is a flat ×1.3 with no stance split — the ledger's 1.3 candidate was correct and src/config/combat.ts CRIT_MULT must NOT be changed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§)\n{\n   return _loc2_ * 1.3 + this.§1t1243s0§;\n}\nreturn _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — blocker ② closes at 1.3, not at the survey's 1.2/1.5 split. Android v0.682's 1.2 (non-light) / 1.5 (light) is a version retune and must not be ported.

### `combat-core/web-crit-is-1.3-flat` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 crit multiplier is a flat x1.3 with no stance branch, plus the additive STAT_CRITICALDMG — so the ledger's '1.3' and src/config/combat.ts CRIT_MULT = 1.3 were right, and blocker 2 closes in the ledger's own favour.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; } return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — CRIT_MULT stays 1.3 and is promotable to CONTRACT-SRC-v0.717. What genuinely changes is the GATE (deterministic full meter, not a chance proc) and the additive gear term, not the multiplier. The 1.5/1.2 split and InventoryUI's mirror-image 1.2/1.5 tooltip bug are android-only curiosities.

### `combat-core/web-damage-stance-curves` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 damage stance curves are light x(0.5 + 0.04*mastery), balanced x(1 + 0.02*mastery), heavy/dual/reversed flat x1.4 — the exact permutation of the reach curves, at the same coefficients the repo already documents.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258-3270`
- **Quote:** var _loc1_:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); break; case §1t12221s0§: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); break; case §1t12222s0§: case §1t12223s0§: case §1t12224s0§: _loc2_ = _loc1_ * 1.4; }
- **Overturns:** "damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** L5 — the RNG roll per slash is real and Sim needs an injected mulberry32 draw for it; but use 0.5+0.04m / 1+0.02m / flat 1.4, not the android 0.005 coefficients. The ledger's flat '(ATK+Wpn)×stance' is still wrong (it is a roll, not a point value) — that half of the survey's correction stands.

### `combat-core/web-heavy-damage-1.4` — HELD [A2] ⚑ OVERTURNS LEDGER

In the shipped build the heavy/dual/reversed damage multiplier is ×1.4, not ×1.5 — the same 1.4/1.5 android retune that hits light reach, so the reach↔damage permutation is 1.4-flat on both diagonals in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258-3271`
- **Quote:** var _loc1_:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); break; case §1t12221s0§: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); break; case §1t12222s0§: case §1t12223s0§: case §1t12224s0§: _loc2_ = _loc1_ * 1.4; }
- **Overturns:** "the stance term is a mastery curve (light 0.5+0.005m, balanced 1+0.005m, heavy/dual/reversed flat 1.5) that is the exact permutation of the reach curves"
- **Lane impact:** L5 — the damage table for v0.717 is light ×(0.5+0.04m), balanced ×(1+0.02m), heavy/dual/reversed ×1.4; the RNG roll per slash (mulberry32, injected) is confirmed in both builds and is the real structural finding here.

### `combat-core/web-maxreload-192` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped crit/reload meter is 192 ticks with the first 48 hidden, refilling +1 per frame at 24.0 fps — exactly 6.000 s empty→full, which matches the repo's own frame regression to three decimals and dissolves the claimed source-vs-frame conflict.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :1203-1205; §1t113s0§.as:328; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **Quote:** §1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;   ///   §1t113s0§.as:328  var _loc3_:Number = (param1 - 48) / (param2 - 48);   ///   §1t99s0§.as:1203-1205  if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§;   ///   SWF header: CWS, version 17, frameRate 24.0, 6,880,328 bytes   =>  (192-48)/24 = 6.000 s
- **Overturns:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end); the android constants predict 4.00 s. THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s."
- **Lane impact:** L5 + L8 — build maxreload = 192, hide the first 48 ticks in the HUD, refill +1 per 24 Hz frame. The repo's session-11 measurement (6.01 / 6.00 / 5.98 s) is now source-confirmed rather than the only evidence, and the android's 120/24 is a retune to be discarded.

### `combat-core/web-maxreload-192` — HELD [A2] ⚑ OVERTURNS LEDGER

The web build's crit meter is maxreload = 8*24 = 192 ticks with the first 48 hidden, so the displayed bar is 144 ticks = 6.00 s at 24 fps — not the android build's 120/96/4.00 s.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and §1t113s0§.as:326-330`
- **Quote:** this.§1t4415s0§ = 8 * 24;   ///   public function §1t5205s0§(param1:int, param2:int) : * { var _loc3_:Number = (param1 - 48) / (param2 - 48); if(_loc3_ < 0) { _loc3_ = 0; } this.§1t5182s0§.bar.scaleX = _loc3_;
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — the crit meter is a 192-tick resource with a 48-tick hidden head; build 6.00 s, and note that the same 48 is the stance-switch gate/cost, so the hidden head and the switch tax are the same constant.

### `combat-core/web-maxreload-192-and-48-offset` — HELD [A2] ⚑ OVERTURNS LEDGER

The web build's crit meter is maxreload = 8×24 = 192 ticks with the HUD bar showing (reload−48)/(192−48) = 144 ticks — which at the SWF's 24 fps is 6.00 s, matching the frame-measured 5.9–6.1 s and dissolving the survey's claimed parity break.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and §1t113s0§.as:326-330; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **Quote:** §1t99s0§.as:249 `this.§1t4415s0§ = 8 * 24;`  ·  §1t113s0§.as:326-330 `public function §1t5205s0§(param1:int, param2:int) : * { var _loc3_:Number = (param1 - 48) / (param2 - 48); if(_loc3_ < 0) { _loc3_ = 0; }`  ·  SWF header parse: shs3_payload_decoded.swf CWS v17 stage 800x690 frameRate=24.000  ·  my re-measure of the cited frames at y=1032: 281 / 290 / 304 / 340 / 370 -> 16.5%/s and 16.9%/s -> 5.9-6.1 s
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — blocker ⑤ closes fully from the shipped build: 192-tick meter, +1/frame at 24 fps, bar shows the last 144 ticks, zeroed at full on crit, charged slashUsage ÷2/×1/×1.5. The stance lock is a flat `reload < 48` with a flat −48 cost, and 'reload < 48' is EXACTLY 'bar reads zero', which is why t1003.000.png shows CANNOT CHANGE STANCE on an empty bar. No frame-vs-source conflict exists.

### `combat-core/web-reach-and-damage-curves-match-repo` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build's per-stance reach AND damage multipliers are exactly the values already in src/config — light reach ×1.4, balanced ×(1+0.02·m), heavy ×(0.5+0.04·m) floored at 100; damage light ×(0.5+0.04·m), balanced ×(1+0.02·m), heavy/dual/reversed ×1.4.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120, :3262-3270`
- **Quote:** :3094 `this.§1t4417s0§ = this.§1t4420s0§ * 1.4;`  ·  :3105 `... * (1 + 0.2 * this.§1t4422s0§ * 0.1);`  ·  :3116 `... * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);` then `if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }`  ·  :3262 `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);`  ·  :3265 `_loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);`  ·  :3270 `_loc2_ = _loc1_ * 1.4;`
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — the reach/damage curve family is now CONTRACT (shipped-build source), not CONTRACT-SRC-guessed. It also promotes reach.ts's 'one mastery drives both tables' permutation from an observation to a source fact, in the correct build. The 300/200/120 ledger triple is dead, but so is the survey's replacement.

### `combat-core/web-v0717-ast-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 payload's ActionScript is decompiled and readable in this repo — 612 obfuscated top-level classes, 1,079 .as files, plain bodies — so no combat constant in this lane needed to be sourced from the android build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 and §1t99s0§.as:249/:3094/:3105/:3116/:3274; corroborated by docs/research/fidelity/SOURCE_CONSTANTS.md §0 (2026-07-25, 'CRACKED AND MINED … Build identified as v0.717')`
- **Quote:** §1t1523s0§.as:36 `public static var §1t9323s0§:Number = 0.717;` · §1t99s0§.as:249 `this.§1t4415s0§ = 8 * 24;` · :3094 `this.§1t4417s0§ = this.§1t4420s0§ * 1.4;` · :3274 `return _loc2_ * 1.3 + this.§1t1243s0§;` · shell: `ls reference/decompiled/shs3_payload/scripts/ | grep -c '§'` → 612
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 (and every other lane that inherited the 'android is all we have' framing) — v0.717 constants are directly readable, so any A2 in a combat lane can and must be taken from shs3_payload, with shs3_android used only for the four data XMLs (which SOURCE_CONSTANTS §3.7 already tags CONTRACT-SRC (0.682)). The gauntlet's standing android caveat should be narrowed to the XML tables, not applied to code constants.

### `economy/ap-cap-is-40-not-30` — HELD [A1] ⚑ OVERTURNS LEDGER

AP max is 40 in the filmed web build; STAT_MAXAP,30 in StatsManager is a level-1 creation initial, exactly like STAT_MAXHP,10 which the same frame shows at 30.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg, crop (470,110)-(780,290) upscaled ×4 LANCZOS`
- **Quote:** Visibly in the crop, the character-summary bars: 'HP 20 / 30' (green), 'CHI 47 / 47' (blue), 'AP 30 / 40' (pale blue), with ATK/DEF/SPD diamonds down the right edge.
- **Overturns:** "④ AP regen rate + cap (world-exploration blocker)"
- **Lane impact:** L9 (WORLD): blocker ④'s regen half closes at 1 AP per 60 s (APINTERVAL, web §1t1523s0§.as:196 = 60); the CAP half does not close at 30 and must not be written into config. THE FRAME WINS. Same failure mode as reading MAXDUELTOKENS=30 as a cap when the HUD reads 40/40.

### `economy/rebirth-pays-heavenly-gold` — HELD [A2] ⚑ OVERTURNS LEDGER

Rebirth pays HEAVENLY GOLD (stat 12, the PayVault-backed premium currency), not gold/coins (stat 11) — the desktop doRebirth never touches the coin purse at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192, 194, 2668-2698 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2660 + OverworldHUD.as:1333`
- **Quote:** StatsManager.as:192  internal static var STAT_GOLD:int  = 11;
StatsManager.as:194  internal static var STAT_HGOLD:int = 12;
StatsManager.as:2668 public static function getHeavenlyGold() : int
StatsManager.as:2674    hgold += QueryManagerPIO.instance.getPayVaultCoins();
OverworldHUD.as:1333 if(getStat(STAT_HGOLD) > 60 && getStat(STAT_DAN) < 9) reportHack("gold");
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** economy + rebirth-elements: config REBIRTH.earlyGold/tenthGold currently feed p.gold (tests/progression.test.ts:183,192), i.e. coins — the wrong purse. The 25/100 numbers and MAX_DAN_RANK=10 are sound and can be promoted, but the currency must be modelled as a separate premium resource or the mapping relabelled. Corroboration that stat 12 is the rebirth currency: the android anti-cheat trips at HGOLD>60 while DAN<9, and android pays 8x5+20 = exactly 60. The same line shows desktop's 25/100 (8x25+100 = 300) could not run against a >60 check — further evidence the two builds' rebirth economies genuinely diverge.

### `economy/tournament-is-web-only` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The tournament system exists ONLY in the web v0.717 bundle — zero Android files mention it — so economy blocker ④'s tournament half is openable rather than dead, and the survey's own claim 1 is the key that unlocks it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:34-48 and :81-82; grep -rli tournament over shs3_payload/scripts → 5 files, over shs3_android/scripts → 0 files`
- **Quote:** §1t7144s0§.as:34 'public var notournamenttext:TextField;' · :44 'public var tournamentCreate:§1t7091s0§;' · :46 'public var tournamentdetailstext:TextField;' · :48 'public var tournamenttitletext:TextField;' · :82 'this.notournamenttext.text = §1t1521s0§.getString(11018);' — member names survive SWFDefender mangling.
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** L10/L11: the 2026-08-13 critic's 'grep returns 0 files, the tournament half is untouched' was true of Android and is FALSE of the web bundle. A follow-up pass should read §1t7144s0§.as and its four siblings for entry fees, payouts and bracket rules. Also a sixth witness that web ≠ Android in CONTENT, not just tuning.

### `enemies-ai/flinch-state-exists` — HELD [A2] ⚑ OVERTURNS LEDGER

The stagger mechanic blocker ③ asks for is fully implemented: FLINCH_STATE (id 28) with a base-class doFlinch/endFlinch pair that saves and restores animation + frameCounter, driving an authored 8-frame flinch / flinch_weapon animation — a mechanism entirely separate from the 12-frame gotHitCounter i-frame lockout.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:747-764 + MCSActor.as:922,170,172 + reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin + EnemyZombie.as:544 + EnemyShield.as:117-119 + MCSPlayer.as:4309-4326`
- **Quote:** NPC.as:747-758 `public function doFlinch() : * { if(actionState == FLINCH_STATE || actionState == SLASH_STATE) { return; } this.prevActionState = actionState; this.prevAnim = mcs.animation; this.prevFrameCounter = mcs.frameCounter; actionState = FLINCH_STATE; startAnim(FLINCH_WEAPON); }` · NPC.as:760-764 `public function endFlinch() : * { actionState = this.prevActionState; startAnim(this.prevAnim); mcs.frameCounter = this.prevFrameCounter; }` · MCSActor.as:922 `internal static var FLINCH_STATE:int = 28;` · MCSActor.as:170,172 `FLINCH_WEAPON:String = "flinch_weapon"` / `FLINCH:String = "flinch
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: blocker ③'s stagger half is CLOSED, not absent, and the survey's score cap built on 'a counter with no stagger animation' must be dropped. The port is: on hit, save actionState/anim/frameCounter, enter FLINCH_STATE, play flinch_weapon (8 frames), then restore the exact prior frame. It is guard-interrupted by SLASH_STATE and SKILL_CHICHARGE_STATE (NPC.as:749, MCSPlayer.as:4311) and stacks on top of, not instead of, the 12-frame gotHitCounter i-frame window. Note the animation lives in the 94_Human2 blob, not the 99_Human blob the survey searched.

### `enemies-ai/gothitcounter-is-iframes` — HELD [A2] ⚑ OVERTURNS LEDGER

gotHitCounter = 12 is invulnerability, not an action lockout: canHit() is called only from NPCManager's hit-detection, so the counter gates whether the enemy CAN BE HIT for 12 frames.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:296-299 + every call site: NPCManager.as:1222,1263,1325,1414,1434,1454,1494,1513,1534,1564,1579`
- **Quote:** NPC.as:296 public function canHit() : Boolean { return this.gotHitCounter == 0; }  ·  NPCManager.as:1564 if(!enemy.isDead() && enemy.canHit() && enemy.testHit(thing))  ·  NPCManager.as:1414 if(!enemy.isDead() && enemy.canHit() && enemy.checkHitTrap(thing,damage))
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + combat-core: the 12 frames are i-frames, so the ledger's 'stagger' question is genuinely STILL_UNHELD - the source implements no hit-reaction at all, neither a stagger animation nor an action lock. A recreation that locks the enemy out of acting for 12 frames is wrong.

### `enemies-ai/nameplate-colour-table` — HELD [A1] ⚑ OVERTURNS LEDGER

The nameplate is a five-value colour table keyed by RELATIONSHIP, not a two-value hostile-red/player-gold rule, and the frame and the payload agree on the exact constants: gold 0xFFCC00 (16763904) for the player AND all three Friendly* classes, white 0xFFFFFF (16777215) for elites/Kanji Guardian/same-side duelists and bosses, dark red 0x990000 (10027008) for an opposing-side duelist or boss, blue 0x0099FF (39423) for a procgen quest-giver, and khaki 0xC0AC4B (12627019) for a MARKED quest-giver; the format is literally name + " (" + lvl + ")", and the plain mob classes get no plate at all.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg — glyph-pixel sample, crop (340,315)-(480,350) for BANDIT and (180,315)-(240,350) for GUEST, LANCZOS x3; corroborated by MCSPlayer.as:245, EnemyPlayer.as:771/774/776, EnemyElite.as:114, EnemyKanjiGuardian.as:59, FriendlyArcher.as:57, FriendlyElite.as:64, FriendlySpearElite.as:55, Obj_NPCProcGen.as:51/60`
- **Quote:** Measured in the frame: BANDIT (4) core glyph pixels (138,3,0) and (133,4,0); GUEST core glyph pixels (244,213,61) and (240,208,48). In the payload: EnemyPlayer.as:774 `namecolor = 10027008;` then `mcs.setDisplayName(xml.name + " (" + level + ")",namecolor);` · MCSPlayer.as:245 `mcs.setDisplayName(StatsManager.charname,16763904);` · EnemyElite.as:114 `mcs.setDisplayName(xml.name + " (" + level + ")",16777215);` · Obj_NPCProcGen.as:51 `setDisplayName(this.npcname,39423);` · :60 `setDisplayName(this.npcname,12627019);`
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: replaces the ledger's single `nameplate (N)=level` bullet AND the surveyor's 'hostile red / player gold' simplification. Gold is NOT player-exclusive (all Friendly* share it), and elites/guardians/duelists are WHITE, not red. 0x990000 is reserved for opposing-SIDE duelists/bosses. Since 0xFFCC00 and 0x990000 are confirmed simultaneously by the frame's pixels and the AS3 literal, these two are the strongest CONTRACT candidates in the unit despite the v0.682 parity caveat — a frame from v0.717 corroborates the v0.682 constant.

### `enemies-ai/setlevel-is-eleven-formulas` — HELD [A2] ⚑ OVERTURNS LEDGER

There is no single enemy level→stat formula: NPC.setLevel is overridden in 11 subclasses, and the elite/boss family does not scale off its own statline at all — it inverse-solves HP and damage from the LIVE player's stats via hitsToKillBoss = 10 + lvldiff and hitsToKillPlayer = 18 - lvldiff.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyElite.as:23-52 (plus EnemyOgre.as:51-53, EnemyWolfAlpha.as:52-78, EnemyPlayer.as:57-86, EnemySpearElite.as:32-78, EnemyTrainingDummy.as:23-47, EnemyKanjiGuardian.as:48, EnemyStag.as:48-70, FriendlyArcher.as:21, FriendlyElite.as:23, FriendlySpearElite.as:19)`
- **Quote:** EnemyElite.as:34-41 `xp = lvl * 5 + 45; var playerHP:int = StatsManager.getPlayerStats(StatsManager.STAT_MAXHP) + StatsManager.findBonusStat(StatsManager.STAT_MAXHP); var playerDEF:int = ...; var playerATK:int = StatsManager.getMinDamage() + StatsManager.getDamageRange() / 2; var playerLVL:int = StatsManager.getLevel(); var lvldiff:int = lvl - playerLVL; var hitsToKillBoss:int = 10 + lvldiff; var hitsToKillPlayer:int = 18 - lvldiff;` · EnemyOgre.as:51-53 `override public function setLevel(lvl:int) : * { }` · EnemyWolfAlpha.as:73-78 `xp = lvl * 5 + 45; if(lvl <= 5) { damage = 1; defense = 1; }`
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: blocker ① dies, but as >=5 distinct formulas rather than one, and it drags in a system the board has never scoped — a live-player-relative boss balancer. Field trash uses NPC.setLevel (×0.9 sub-21, 1/1/1 clamp at lvl<=10, xp lvl*2+20); the Oni ignores level entirely; the training dummy's setLevel is a tutorial script; every Elite/Boss/duelist derives its numbers from the player's current MAXHP/DEFENSE/damage at spawn. A recreation that ports only NPC.setLevel gets 100% of bosses wrong. It also means ENEMY_BASE.hp = 1 is retro-justified for TRASH ONLY.

### `enemies-ai/setlevel-is-twelve-formulas` — HELD [A2] ⚑ OVERTURNS LEDGER

Enemy level scaling is not one formula but twelve: NPC.setLevel is overridden by eleven subclasses, EnemyOgre's override is EMPTY (ogres never level-scale), EnemyPlayer / EnemyElite / EnemyKanjiGuardian drop both the x0.9 sub-21 factor and the 1/1/1 clamp and pay xp = lvl*5 + 45, and the elite/boss variants additionally run a player-relative autobalance (hitsToKillBoss = 8 or 10 or 13 + lvldiff, hitsToKillPlayer = 16 - lvldiff) that rewrites minDamage and maxhp against the live player's stats.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:57-100, EnemyElite.as:23-40, EnemyKanjiGuardian.as:48-65, EnemyOgre.as:51-53, EnemyWolfAlpha.as:52-70 (plus EnemySpearElite.as:32, EnemyStag.as:48, EnemyTrainingDummy.as:23, FriendlyArcher.as:21, FriendlyElite.as:23, FriendlySpearElite.as:19)`
- **Quote:** EnemyOgre.as:51-53 `override public function setLevel(lvl:int) : * { }` · EnemyPlayer.as:73-88 `factor = lvl / level; level = lvl; minDamage = damage * factor; defense *= factor; maxhp *= factor; setHP(maxhp); updateHealthBar(); if(this.isBoss || this.isDuelist) { xp = lvl * 5 + 45; namecolor = 16777215; mcs.setDisplayName(...); } else { xp = lvl * 2 + 20; }` · EnemyElite.as:40 `var hitsToKillBoss:int = 10 + lvldiff;` · EnemyKanjiGuardian.as:59 `xp = lvl * 5 + 45;`
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: blocker ① is advanced but NOT dead, and the shape is different from what the surveyor banked. A recreation needs a scaling POLICY per AI class (base / player-mirror / elite-with-autobalance / none), not one function. The empty EnemyOgre override plus the fact that ai 9 (73 of 425 npcdata rows, the largest bucket) skips the clamp means the '1-HP field trash' story cannot be sourced to this code — it has to come back from the frames.

### `enemies-ai/tengu-absent-from-resolved-strings` — HELD [A2] ⚑ OVERTURNS LEDGER

Tengu is absent from the RESOLVED string table as well as the raw XML, which closes the 'it is hidden behind a numeric id' escape hatch that a raw-XML grep alone leaves open.

- **Cite:** `grep -ic tengu over docs/gauntlet/L0/index/strings.json and docs/gauntlet/L0/index/resolved_names.json -> 0 and 0`
- **Quote:** docs/gauntlet/L0/index/strings.json:0   docs/gauntlet/L0/index/resolved_names.json:0   (the 2,533-entry S0-3 table in which itemdata resolves 804/0 unresolved, skilldata 73/0, npcdata 484/6)
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)"
- **Lane impact:** L0 enemies-ai: the Ready-taxonomy bullet over-claims an entire faction, and this closes the last defence of it. Either a v0.717-only addition or a ledger invention. Do not build a Tengu.

### `enemies-ai/web-has-39-ai-cases-not-38` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 AI dispatch switch runs cases 0..38 — 39 cases instantiating 36 unique classes — against the Android v0.682 build's 38 cases / 34 unique classes, so v0.717 carries two more behaviour classes and one more ai id than the survey scopes for.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:615-732 (contrast reference/decompiled/shs3_android/scripts/NPCManager.as:516-634)`
- **Quote:** §1t1543s0§.as:615 switch(_loc6_.ai) with case labels 0 through 38 (39 unique, verified by `grep -o "case [0-9]*:" | sort -u | wc -l` -> 39; `grep -o "new §[^(]*" | sort -u | wc -l` -> 36)  ·  NPCManager.as:516 switch(xml.ai) with cases 0..37 (38 cases; 31 unique Enemy* + 3 Friendly* = 34)
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster"
- **Lane impact:** L0 enemies-ai: corrects the survey's own correction. The unwritten-behaviour work item — cap-reason (3) on the score — is BIGGER than stated: 36 classes across 39 ai ids for the 1:1 web target, not 34/38. Any roster or dispatch table built to the Android decompile will be missing an enemy type.

### `items-equipment/condition-blocker-dead-in-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 2 (condition->DMG multiplier) is dissolved in the WEB v0.717 build as well as Android: the web getCondition has exactly two references in the whole payload -- its definition and one call inside getDesc -- so no damage path reads it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:995,1868 (grep "§1t536s0§" over reference/decompiled/shs3_payload/scripts/ returns exactly 2 hits)`
- **Quote:** §1t17s0§.as:1868  public function §1t536s0§() : int   /   §1t17s0§.as:995  var _loc1_:int = this.§1t536s0§();   [only call site, inside the getDesc equivalent]
- **Overturns:** "② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L1/L2 (combat core + damage) -- removes the S0-3 Android-parity caveat for blocker 2 that the surveyor left open. The phantom wear curve is dead in the build we are actually recreating (v0.717), not just in the Android port.

### `items-equipment/equipment-save-format-is-13-field` — HELD [A2] ⚑ OVERTURNS LEDGER

The equipment save format is StatsManager.getEquipmentString/parseEquipmentString -- all 13 equipment slots joined by "|", each field an Item.toStringNoQty() record carrying id plus modifiers, colours, uses, name and creator. MCSCharacter's 12-field mcsString is the character APPEARANCE string, not persistence.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:4417-4445; Item.as:229-259; MCSCharacter.as:618`
- **Quote:** public static function getEquipmentString() : String { var max:int = int(equipment.length); for(var i:int = 0; i < max; i++) { if(i == max - 1) { str += equipment[i].toStringNoQty(); } else { str += equipment[i].toStringNoQty() + "|"; } } return str; }  /  public static function parseEquipmentString(str:String) : * { equipment.length = 0; var strArray:Array = str.split("|"); for(var i:* = 0; i < strArray.length; i++) { equipment.push(Item.parseNoQty(strArray[i])); } }  /  MCSCharacter.as:618  return this.mcsString;
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 (persistence) -- corrects the surveyor's cite. Copying MCSCharacter.as:348 instead loses the scabbard, both accessory slots and every per-slot modifier, and adds two prop fields that are not equipment slots.

### `items-equipment/repair-weapon-cost-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon cost is held exactly — currentNodeLevel * 10 gold — and repair sets the wear counter to 1, not 0, so a repaired weapon can never return to the 'Unbreakable' state.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1080 (cost at :1058, uses clamp at :1073-1076, reinforce at :1082-1083)`
- **Quote:** case "repairweapon": cost = StageManager.getCurrentNodeLevel() * 10; ... weapon = StatsManager.equipment[StatsManager.EQ_WEAPON]; if(weapon == null || weapon.itemID == 0 || weapon.itemID == 13000) { ...error... } StatsManager.changeGold(-cost); if(weapon.uses > 1) { weapon.uses = 1; } ... case "reinforceweapon": cost = 5000;
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L4 (economy) — kills economy blocker ③ outright with a two-term formula and a gold currency (not coins). Also settles an items question the survey left dangling: repair floors `uses` at 1, which is 'Condition: Well-Maintained' (string 392), never 0 ('Unbreakable', string 639). That one-way door explains the otherwise-odd uses==0 branch in the condition ladder. Repair is refused when the weapon slot is empty or holds id 13000 (bare hands).

### `items-equipment/two-icon-only-art-namespaces` — HELD [A2] ⚑ OVERTURNS LEDGER

Consumables and accessories have their own icon symbol namespaces ('item<art>' and 'acc<art>') that are not paperdoll parts, plus 11 named placeholder icon classes — so the item icon pipeline is genuinely separate from the paperdoll pipeline.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-224 (setConsumable) and :226-245 (setAccessory); DummyIcon class census in reference/decompiled/shs3_android/scripts/; visual consequence at reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2`
- **Quote:** public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); ... } }  /  public function setAccessory(id:int) : * { ... this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... } }  /  11 classes: Accessory/Achievement/Armor/Consumable/Gloves/Hat/Invalid/Mask/Pants/Shoes/Weapon DummyIcon
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — the icon-manifest half of blocker ⑤ is NOT dissolved; it is a third and fourth art namespace on top of the paperdoll parts. Five of the seven inventory icons in the reference frame (scroll, onigiri x3, black stone, two feathers) are consumables/accessories that cannot be composed from body parts. Only item0 (the fallback) exists as a named class in any bundle, so this widens the residual art gap rather than closing it.

### `items-equipment/web-soul-infusion-superset` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web v0.717 soul-infusion transfers a DEFENSE delta (modifier id 7) for every item type and a WEIGHT delta for armor (type 4) and pants (type 11), and gates the durability copy on the design item having non-zero durability — none of which exists in the Android v0.682 code the survey quoted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:686-724`
- **Quote:** _loc6_ = _loc5_.defense; _loc7_ = …(statsSlot).defense; if(_loc3_.§1t523s0§(7) == 0) { _loc3_.§1t493s0§(7,_loc7_ - _loc6_); } … if(_loc1_ == 4 || _loc1_ == 11) { _loc8_ = statsItem.§1t545s0§(); _loc9_ = _loc5_.weight; _loc3_.§1t478s0§ = _loc8_ - _loc9_; } … if(_loc5_.durability != 0) { _loc3_.uses = statsItem.uses; }
- **Overturns:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — implement the v0.717 rule set; the Android-only version silently no-ops for armour and pants.

### `ledger/film-shows-rebirth-is-unsourced` — HELD [A1] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md §3 #7 attributes its '+25 gold' to film, but nothing about rebirth was ever filmed — both longplays are frame-verified at level 5 and level 8, seventy-plus levels below the L80 rebirth gate, and the ledger's own §4 says so.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg and reference/frames/zFtCaTO0_1M/seg-20/frames/frame_0019.jpg — top-22% HUD strips, 2x LANCZOS upscale`
- **Quote:** Visibly in the crops: a level badge reading 8 beside '20880 / 20900 EXPERIENCE POINTS', and a level badge reading 5 beside '8093 / 8350 EXPERIENCE POINTS' with 'REGISTER TO SAVE YOUR PROGRESS AND PLAY ONLINE!' (a guest session). Both HUDs also show a silver '507 / 259 COINS' readout separate from a gold '2 GOLD' readout with a 'GET GOLD' button, and an EMPTY Dan field.
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy + ledger hygiene. THE FRAME WINS, and here it wins against the ledger's own sourcing claim: the longplays cap at L5/L8 so no rebirth could have been observed, and REBUILD_READINESS.md:205 concedes it ('never filmed — both longplays pre-rebirth') — the ledger contradicts itself at :165 vs :205. The '+25' number is NOT wrong; it is the value already banked in the ledger's KNOWN-KNOWNS at :79 ('rebirth scroll 1000c (+25g)') and it is now CONFIRMED by v0.717 code. Only the 'no 10th-rebirth tier' half of §3 #7 is disproven. Downstream lanes must stop treating '+25' as a film measurement — the frames prove that provenance is fictitious. The frames also confirm COINS and GOLD are two distinct on-screen currencies, so STAT_HGOLD is the on-screen 'GOLD'.

### `meta-social/achievement-58-pins-340` — HELD [A2] ⚑ OVERTURNS LEDGER

The game's own achievement text independently pins 340 as the rank-and-file war-room kill count, corroborating the wave-table sum from a second, unrelated table.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin, achievement row index 58, resolved via docs/gauntlet/L0/index/strings.json`
- **Quote:** row 58: stat 60018, val 340 → name 'Warrior III', desc 'Defeat 340 in a war room attack.'
- **Overturns:** "kill cap 350"
- **Lane impact:** L0 meta-social — supports the 340-troop half of the kill-cap correction without relying on the wave-table sum, and separates the 340 troops from the 11 unresolved boss slots.

### `meta-social/achievements-in-web-payload` — HELD [A2] ⚑ OVERTURNS LEDGER

The 61 achievement names are in the WEB v0.717 payload itself, in the same order as the Android blob, so blocker ③'s achievement third closes on a desktop cite with no Android caveat.

- **Cite:** `reference/extracted/payload.xml:119088-119148 compared element-wise to reference/extracted/android/114_Mobile_AchievementData.bin resolved via docs/gauntlet/L0/index/strings.json`
- **Quote:** payload.xml:119088 `<item>Duelist I</item>` ... :119133 `<item>Chi Master</item>` :119134 `<item>Ninja Master</item>` ... :119148 `<item>Be Awesome</item>`. My comparison printed: `android n= 61   web n= 61` / `EXACT MATCH: True`.
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social -- and this is the strongest available validation of the whole S0-3 Android string table against the desktop build: 61 independently-authored strings agreeing name-for-name and order-for-order.

### `meta-social/premium-catalogue-is-143-skus` — HELD [A2] ⚑ OVERTURNS LEDGER

The premium (Ninja Services) catalogue is 143 unique SKUs on a 1/3/5/12 Gold ladder, not the 12 rows the lane reports, and every one of them resolves in the WEB itemdata.xml.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice> and docs/gauntlet/L0/index/strings.json`
- **Quote:** 176 <item> rows, 143 unique ids, 0 unresolved against the web itemdata.xml. Ladder: 1 Gold = consumables + '1000 coins' (2208) + 'Clan Invitation' (2213) + 'Edit Clan' (2215) + 12 Hair SKUs; 3 Gold = every cosmetic equipment piece (armor 4063-4099, gloves 5008-5020, headgear 7034-7082, masks 9025-9049, pants 11035-11056, shoes 12018-12041, weapons 13014-13043); 5 Gold = 'Amnesia Scroll' 2200, 'Writ of Release' 2203, 'Name Change Scroll' 2207, 'Clan Deed' 2212; 12 Gold = 30 named outfit bundles, 2130 'Assassin Outfit' through 2171 'Swords of the Mist'.
- **Overturns:** "Ninja-Services prices"
- **Lane impact:** L0 meta-social and L-items-equipment — the cosmetic tier is the bulk of the premium economy and is entirely absent from the lane's 12-row account.

### `meta-social/six-by-six-sector-board-is-pictured` — HELD [A1] ⚑ OVERTURNS LEDGER

The 6x6 sector board the lane files as unpictured is plainly on screen in the SECOND longplay, complete with 0-5 axis labels on both axes and the white connector lines that are its exit topology.

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_013_t565s.jpg and zFtCaTO0_1M_map_010_t439s.jpg, crop (395,20)-(512,125) upscaled x10 LANCZOS`
- **Quote:** Visibly in the crop: a gold-cornered panel with column headers '0 1 2 3 4 5' across the top and row headers '0 1 2 3 4 5' down the left side; cells containing yellow gate/arch icons, an X marker and a white triangular player arrow; white lines drawn between adjacent cells. Directly beneath the panel: 'TERRITORY (21,51)'. A2 corroboration: Territorymap.as:65-75 `for(var i:int = 0; i < 6; i++){ this.minimapRoomList[i] = new Array(6); for(j = 0; j < 6; j++){ ... x = i * 20 - 77 + 28 ...` with north/south/east/west labels, and :501-504 A* over the same 6x6. Same board the war room draws: WarHexUI.
- **Overturns:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social — kills one of the three deductions holding the score at 78. Also exposes the search scope: reference/frames/map_analysis/ (20 frames, 10 per longplay) and the entire zFtCaTO0_1M longplay were never opened by this lane.

### `meta-social/war-mechanics-are-in-the-web-build` — HELD [A2] ⚑ OVERTURNS LEDGER

The entire war deploy/arrow/terrain/6x6-board stack is present in the WEB v0.717 build, so the Android caveat is removable for war-room mechanics.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:1108, :1123, :2119-2145, :2150`
- **Quote:** `:1108 _loc2_ = 100 * this.§1t7871s0§();` · `:1123 _loc3_ = 80 + Math.random() * 40 * this.§1t7871s0§();` · `:2119 internal function §1t7871s0§() : Number` with `case 2: return 1.5; case 1: return 1.2; case 0: return 1; case -1: return 0.75; case -2: return 0.6; case -3: return 0.5; case -4: return 0.25;` · `:2150 if(param1 < 0 || param2 < 0 || param1 > 5 || param2 > 5)` — the 6x6 board bound, web-confirmed. WarSelectUI's 63 also appears at §1t1056s0§.as:136.
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** L0 meta-social — blocker ② closes on WEB evidence rather than Android, which is what the ledger actually needed.

### `meta-social/warroom-board-is-on-screen` — HELD [A1] ⚑ OVERTURNS LEDGER

The war-room board is on screen in at least four frames in a segment the survey never opened -- reference/frames/Nr4fQstqHDM/seg-29/ is a War Room segment, and the 6x6 sector board with printed 0-5 axes appears in the second longplay's map segment.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0019.jpg and frame_0018.jpg (whole frame, 512x288 upscaled x3 LANCZOS); reference/frames/zFtCaTO0_1M/map/frames/frame_0024.jpg crop (398,40)-(502,160) upscaled x10 LANCZOS`
- **Quote:** frame_0019: right-rail 'WAR ROOM'; 'SELECT A SECTOR'; 'TROOPS WILL ATTEMPT SECTOR CAPTURE IN 16:44:05'; '2 MOVE(S) LEFT' / 'NEXT TURN IN 59:58'; a 6-wide sector grid with black sector boundaries, mountains vs open ground vs trees, green clan shading with green banner flags, red enemy shading, two Command-HQ fist medallions with directional arrows, a barricade icon, a samurai on the contested cell; 'RYUWARA MESSAGE BOARD' with 'SEND TO SIDE'/'SEND TO ALL' and the log line 'ASUTORARU: BUILDING BARRICADES AT SECTOR (4,3)'. frame_0018 is the same board headed 'SELECT HQ/TOWN TO ENTER TERRITORY' wi
- **Overturns:** "② War-Room **map topology** (board/adjacency)"
- **Lane impact:** L0 meta-social -- retires the survey's only frame-side STILL_UNHELD, and gives A1 confirmation of the 0..5 sector clamp, the [N,S,E,W] exit model, the one-hour turn (NEXT TURN IN 59:58) and the 24h capture advance, none of which had a picture before.

### `meta-social/web-rebirth-faucet-25-100-300` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 rebirth faucet is 25 Gold per rebirth and 100 at the Dan 8 rebirth -- a 300-Gold lifetime ceiling that the desktop client itself uses as its paid-player test -- exactly 5x the Android values the survey reported.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656 (and :222,:228,:254) + reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544`
- **Quote:** :2644 `if(§1t7356s0§(§1t9426s0§) == 8)` :2646 `§1t9713s0§(§1t9413s0§,100);` :2649 `else` :2651 `§1t9713s0§(§1t9413s0§,25);` -- with :228 `internal static const §1t9413s0§:int = 12;` (STAT_HGOLD) and :254 `internal static const §1t9426s0§:int = 25;` (STAT_DAN), the same ids as android StatsManager.as:194/:220. The paid-player test: §1t406s0§.as:1544 `if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 300 && §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9426s0§) < 9)`. 8x25 + 100 = 300 exactly.
- **Overturns:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social -- blocker ④ closes, but at 25/100/300 not 5/20/60. Also vindicates docs/research/KONGREGATE_FORUM_FINDINGS.md:308 ('25 gold is awarded EVERY rebirth, rising to 100 gold on the 9th'), which the survey declared refuted by the payload; the forum was describing the desktop build the survey never opened.

### `meta-social/world-map-tiers-and-level-gating` — HELD [A1] ⚑ OVERTURNS LEDGER

The world board's tile vocabulary and level-gating are visible in the second longplay: four settlement tiers plus a destroyed state and a quest marker, with grey/red tiles encoding level-too-low / level-too-high.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg (whole frame, 512x288 upscaled x3 LANCZOS)`
- **Quote:** Header 'NAGANO (26,52) LEVEL: 9' with a 'ZOOM OUT' button and a vertical 'WORLD MAP' rail; a tiled territory board where tiles carry settlement icons and coloured clan flags (yellow, blue, red, green); LEGEND: 'VILLAGE  TOWN  CITY  CASTLE TOWN  DESTROYED  QUEST'; and 'GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH'.
- **Overturns:** "② War-Room **map topology** (board/adjacency)"
- **Lane impact:** L0 meta-social + L-world-exploration -- maps HEX_VILLAGE/HEX_TOWN/HEX_CITY/HEX_CASTLE onto rendered art, adds a per-territory LEVEL field and the destroyed state, and confirms the four clan colours on the world board from a picture.

### `meta-social/xp-curve-in-web-build` — HELD [A2] ⚑ OVERTURNS LEDGER

The 99-entry XP array is in the WEB v0.717 build and is byte-for-byte identical to the Android copy, so the recovered L11-80 curve carries no version caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (also §1t29s0§.as:28) compared element-wise to reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** `public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,...]` -- my parse: `android line 78 len 99 a[79] 4025800 last2 [25395800, 29395800]` / `WEB line 364 len 99 b[79] 4025800 last2 [25395800, 29395800]` / `IDENTICAL: True`.
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression -- retires REBUILD_READINESS.md:350 and :200 outright on a desktop cite; src/config/xp.ts can drop the INFERRED label rather than merely relabelling it 'measured (Android)'.

### `meta-social/xp-curve-is-in-the-web-build` — HELD [A2] ⚑ OVERTURNS LEDGER

The 99-entry XP array is in the WEB v0.717 payload, not only the Android build — the L11-80 §6 line closes with no build caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (same class whose line 36 sets clientVersion) and §1t29s0§.as:28`
- **Quote:** §1t1523s0§.as:36 `public static var §1t9323s0§:Number = 0.717;` and :364 `public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,…];` — parsed: 99 entries, [9]=25900, [10]=31400, [79]=4025800, tail 25395800, 29395800. Identical to StatsManager.as:78.
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — the §6 'structurally unrecoverable' line and the §2 progression note both retire on WEB evidence; src/config/xp.ts's INFERRED extrapolation can be replaced with measured v0.717 values.

### `progression/no-gather-xp-path-exists` — HELD [A2] ⚑ OVERTURNS LEDGER

An exhaustive enumeration of every addLootXP call site proves there is NO gather/mine/farm XP path at all — gathering XP can only arrive as a quest outcome, so the missing 'gather XP number' is not missing, it does not exist.

- **Cite:** `grep -rn addLootXP reference/decompiled/shs3_android/scripts/ — 13 sites, all enumerated: NPC.as:863; EnemyPlayer.as:1318/1322/1327; NetworkManager.as:1268/1272/2818/2822; ConnectionPIO.as:643/647; Overworld.as:318; XMLQuestOutcome.as:66; definition LootDialog.as:638`
- **Quote:** NPC.as:863 addLootXP(calcXP(getLevel(),this.level,this.xp,false)) · EnemyPlayer.as:1318/1322/1327 duellist+boss · NetworkManager/ConnectionPIO lvl*5+45 PvP · Overworld.as:318 addLootXP(reward.exp) · XMLQuestOutcome.as:66 addLootXP(this.modify) — plus the one non-loot path InventoryUI.as:906 StatsManager.changeXP(item.modifierXML[i].value) for item modifier id 9. No mining/farming/scavenging site exists.
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4: upgrades progression/xp-from-gather-and-dungeon from PARTIAL to a held negative — stop looking for a gather-XP constant. Corroborated on camera by A-04 (XP bar frozen at 2098/2950 for an entire mining session), so code and frame agree.

### `progression/per-point-two-frame-delta` — HELD [A1] ⚑ OVERTURNS LEDGER

A two-frame differential in video A proves the WEB per-point magnitudes without any assumption about gear folding into displayed maxima: one level-up spends exactly 3 stat points and buys Chi +5, ATK +3, DEF +3 — 3 points under web magnitudes, 7 under Android.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 and -ss 656.5 vs @ -ss 1600; crops crop=iw*0.55:ih*0.30:iw*0.42:ih*0.15 scale=1.5x lanczos and crop=iw*0.55:ih*0.30:iw*0.42:ih*0.12 / :ih*0.36 scale=2x lanczos`
- **Quote:** Visibly at -ss 653.0 AND -ss 656.5: level badge 3, '2098 / 2950 EXPERIENCE POINTS', 'AVAILABLE STAT POINTS: 0', HP 20/20, CHI 10/10, AP 30/30, ATK 7, DEF 7 + 2 (orange +2), SPD 4. Visibly at -ss 1600: level badge 4, '5110 / 5150', 'AVAILABLE STAT POINTS: 0', HP 20/20, CHI 9/15, AP 15/30, ATK 10, DEF 10 + 13, SPD 4, WEIGHT: 73 / 100. Delta across exactly one level (=3 points, §1t1523s0§.as:2075) with 0 unspent at both ends: Chi max +5, ATK +3, DEF base +3.
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: this should replace the single-frame budget sum as the canonical evidence for the web-build ruling — it is gear-proof because it is a delta and because the HUD renders equipment bonus separately (DEF 7 + 2 -> DEF 10 + 13). Gauntlet-wide it is the hardest available proof that shs3_android v0.682 is a decoder ring only.

### `progression/procgen-quest-xp-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Proc-gen daily quests compute their XP at runtime from the recovered expArray — questReward = (expArray[nodelvl+1] − expArray[nodelvl]) / ((nodelvl+1) × 1.2) — and this formula, not the 69-row table, produces the only quest-XP number visible in either longplay.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestGenerator.as:839 and :916 (and ~28 sibling sites at 1001/1228/1465/1644/1839/2105/2266/2417…); WEB parity reference/decompiled/shs3_payload/scripts/§1t123s0§.as:878, :1039, :1283, :1522 and §1t27s0§.as:317; consumed via reference/decompiled/shs3_android/scripts/StatsManager.as:1604-1606`
- **Quote:** QuestGenerator.as:839  var questReward:int = (StatsManager.getXPLevelThreshhold(nodelvl + 1) - StatsManager.getXPLevelThreshhold(nodelvl)) / ((nodelvl + 1) * 1.2);
QuestGenerator.as:916  rewardStr += "<exp>" + questReward + "</exp>";
StatsManager.as:1604-1606  public static function getXPLevelThreshhold(level:int) : int { return expArray[level]; }
WEB §1t123s0§.as:878  var _loc16_:int = (§1t1523s0§.§1t5928s0§(_loc15_ + 1) - §1t1523s0§.§1t5928s0§(_loc15_)) / ((_loc15_ + 1) * 1.2);
— evaluated by me: nodelvl 5→527 · 6→500 · 7→473 · 8→462 · 9→458 · 10→454 · 11→423; nodelvl 7 = (20900−16350)/9.6 =
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4: overturns the surveyor's own progression/quest-xp-tabled ('a table, not a formula') and closes blocker ④'s quest side more completely than claimed. L9 quests-story: the daily-quest generator is a second reward system with its own XP curve. Also an independent VALIDATION of the newly recovered expArray, since the formula consumes it — the frame's 473 could not be reproduced without the real table.

### `progression/quest-xp-sum-kills-blocker2-rationale` — HELD [A2] ⚑ OVERTURNS LEDGER

The 69 tabled quest XP rewards sum to 79,890 — enough on their own to carry a solo offline player to level 17, which destroys the ledger's stated reason for calling the L11-80 curve unrecoverable.

- **Cite:** `reference/extracted/questdata.xml — my own sum over all 69 <exp> rows; compared against expArray at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **Quote:** quest exp rows 69, sum 79890. expArray[10]=31,400 · expArray[17]=80,300 — 79,890 XP from quest turn-ins alone, before a single mob kill, lands at level 17. Supporting: reference/extracted/itemdata.xml carries 142 <minlvl> rows spanning 0-79, i.e. gear authored for the whole band.
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: blocker ②'s parenthetical was doing the persuasive work, and it is now false on two counts — the curve is on disk AND a solo build reaches L11+ from quests alone. Also strengthens L9 quests-story (the reward side is fully tabled) and L8 enemies-ai level-band pacing.

### `progression/second-frame-confirms-plus3-per-point` — HELD [A4] ⚑ OVERTURNS LEDGER

A second frame reading, already in the video study and flagged INFERRED there, independently confirms +3 per stat point and the start pools — it was sitting unused while the ledger carried the wrong +1AP figure.

- **Cite:** `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24-25 (segment carries its own frame cites); adjudicated against reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3422,3434,3443`
- **Quote:** A-02:24  "Three resource bars with `+` allocate buttons: `HP 20/20`, `CHI 10/10`, `AP 30/30`"
A-02:25  "Observed progression: ATK 4→7, DEF 4+2→7+2 (i.e., DEF base 4→7 too), SPD 1→4, spending the 3 stat points … total distributed points = (7-4)+(7-4)+(4-1)=3+3+3=9 … treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm"
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: closes A-02's open INFERRED flag with a payload cite, and shows the frame evidence for +3/point was already on disk. CHI 10/10 and AP 30/30 in the same frame confirm the start pools directly. No replay needed — mark A-02:25 RESOLVED.

### `progression/stance-reach-multipliers-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance reach multipliers sit directly on top of the SPD slash-length base and are fully held, making the L1 combat-core gift the COMPLETE reach model rather than only its base term.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052-3055, :3078-3081, :3094`
- **Quote:** MCSPlayer.as:3030  this.slashLength = this.baseSlashLength * 1.5;   (Light)
MCSPlayer.as:3041  this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);
MCSPlayer.as:3052-3055  this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; }
MCSPlayer.as:3078  this.slashLength = this.baseSlashLength;   (default, floor 100)
MCSPlayer.as:3094  InputManager.setMaxDistance(this.slashLength);
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L1 combat-core blocker ① dies in full, not partially: base = 120 + floor((90+Dan*5)*spd/(20+spd)) (floor 120, Dan-0 asymptote 210), then Light x1.5, Balanced x(1+0.5*balancedMastery*0.01), Heavy x(0.5+0.5*heavyMastery*0.01) with a hard floor of 100, fed to InputManager.setMaxDistance. The units are the same stage-space the gesture input uses.

### `progression/unlock-rule-ends-in-0-or-5-false` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's stated unlock rule 'skills unlock at levels ending 0 (Ninja) / 5 (Chi)' is falsified on the first row of the lvlreq table.

- **Cite:** `reference/extracted/skilldata.xml:255-257 (id 1004, displayname 6007, lvlreq 3) with strings.json 6007 → 'Roll'`
- **Quote:** skilldata.xml:255-257 '<id>1004</id> / <displayname>6007</displayname> / <lvlreq>3</lvlreq>'; strings.json '6007 -> Roll'. Full measured ladder: 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80.
- **Overturns:** "- **Progression spine:** XP caps L1–L10 (550…31 400), +3 stat/+1 skill per level, +10HP/+5Chi/+1AP/+3-stat per point, level cap 80, 80 SP first run, skills unlock at levels ending 0 (Ninja) / 5 (Chi)."
- **Lane impact:** L4: REBUILD_READINESS.md:77 carries THREE errors in one sentence — '+1AP' (really +5), '80 SP first run' (really 79), and the 'levels ending 0/5' rule (broken at L3 by Roll). The unit overturned the first two but did not mark line 77 itself, only the line-199 Ready bullet. Both lines need the edit.

### `progression/xp-curve-kills-three-more-docs` — HELD [A2] ⚑ OVERTURNS LEDGER

The dead 'L11–80 curve is unrecoverable' statement is load-bearing in three documents beyond the two the unit names — including the gauntlet's own charter and a calibration row whose acceptance gate would have passed the refuted model.

- **Cite:** `docs/GAUNTLET.md:373-374 · docs/CALIBRATION.md:38 (row 17) · docs/research/REBUILD_READINESS.md:62 and :93`
- **Quote:** GAUNTLET.md:373 'it does not claim the server-side systems (live clan war, L11–80 curve, IAP economy) are recoverable — those are named as authored deviations in L11, not hidden.' · CALIBRATION.md:38 '| 17 | XP curve tail (L11+) | `xp.ts` XP_DELTA_STEP | threshold ±5% vs any future high-level HUD read | +500/level delta growth extrapolating the CONTRACT L1–L10 table (observed tail 4550→5000→5500) | INFERRED |' · REBUILD_READINESS.md:62 'Some things are structurally unrecoverable ... the live clan-war population, and the L11–80 XP curve. See §6.' · :93 lists 'L11–80 XP curve' under KNOWN-UNKNOW
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** Blast radius is wider than L4. GAUNTLET.md:373 mis-states what L11 (meta+rebirth) must author as a deviation — L11 loses one authored-deviation obligation. CALIBRATION.md row 17's ±5% band is worse than stale: the real curve misses it by −61.3% at L80, so the gate as written would have green-lit a refuted model; rewrite row 17 as CONTRACT against the 99-entry table. REBUILD_READINESS.md:62 and :93 need the same edit as :200/:350.

### `progression/xp-income-web-parity` — HELD [A2] ⚑ OVERTURNS LEDGER

The full XP-income model exists in the shipped WEB v0.717 build too, not just Android — calcXP, the grey-level ladder and the elite doubling are all present at §1t68s0§.as, so the unit's own Android-parity caveat does not apply to blocker ④.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:198, :186-208, :122, :126, :128`
- **Quote:** §1t68s0§.as:198  _loc5_ = param3 * (1 + 0.05 * (param2 - param1));
§1t68s0§.as:186-208  if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } … else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); } if(param4) { _loc5_ *= 2; } return _loc5_;
§1t68s0§.as:122  return _loc1_ - Math.floor(_loc1_ / 10) - 5;
§1t68s0§.as:126  return _loc1_ - Math.floor(_loc1_ / 5) - 1;
§1t68s0§.as:128  return _loc1_ - 9;
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4: upgrades progression/xp-income-model from 'Android v0.682, parity unestablished' to 'confirmed in the shipped web v0.717 build'. L7 economy blocker ① ('20+ samples show no XP formula either') closes against the WEB build, not a differently-tuned mobile port.

### `quests-story/choices-are-consequential` — HELD [A2] ⚑ OVERTURNS LEDGER

Player choices ARE consequential: consequence is positional, not nested — <goto> lands the display walker in a branch that carries its own <outcome> nodes, and 54 of 195 multi-choice options reach divergent outcomes.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/CutsceneManager.as:203-206 + XMLQuestStep.as:158-212 + reference/extracted/questdata.xml:971, :814, :1851, :2410`
- **Quote:** CutsceneManager.display(): case "outcome": outcome = XMLQuestOutcome(currentDisplay); outcome.applyOutcome(); break;  ||  CutsceneManager.gotoStep: this.currentDisplayNo = goto;  ||  walker over 195 multi-choice options -> 54 DIVERGENT. :971 "Let's start mining." -> set 113=8402942, set 114=2, set 115=350, set 102=0, END 1  vs  "Not right now." -> END 1
- **Overturns:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN — REVERSES the surveyor's lane impact. L1 MUST build the outcome/consequence system: a positional display walker with index-based <goto>, per-branch outcome application, and divergent end codes (1=leaveOK starts the fight, -1=leaveCancel aborts it). 54 options break without it.

### `rebirth/dragon-dance-ui-art-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance ritual UI art is fully on disk: a dark-red double outer ring, eight green-outlined white kanji nodes, an inner dark-red bagua trigram ring, a black/white taiji centre carrying the element name, and an X close button.

- **Cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png (819x500, viewed whole) + DefineSprite_1800/1.png (green bagua ring 437x437), DefineSprite_1802/1.png (dark-red bagua ring 437x437), DefineSprite_1808/1.png (taiji 242x242), DefineSprite_1797_shs3_fla.dragondancewords_235 (39x40, 58 frames), DefineSprite_1798_1t5501s0 (64x64); class link via reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71`
- **Quote:** §1t5495s0§.as:70  this.§1t5516s0§ = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
§1t5495s0§.as:71  this.§1t5517s0§ = ["fire","earth","lake","sky","water","mountain","thunder","wind"];
(art) DefineSprite_1810_1t5495s0/1.png visibly shows the 8-node click ring, the trigram ring and a yin-yang centre reading "FIRE"
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** L rebirth-elements blocker (4): the survey closed the INPUT half only and left the art unmentioned. The art half is held too. The 58-frame dragondancewords strip is exactly what DragonDanceUI.as:359 and :364 index (word.gotoAndStop(num + 11) for Earlier Heaven, (num + 31) for Later Heaven), so the glyph-per-node mapping is reproducible frame-for-frame.

### `rebirth/dragon-dance-ui-art-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The entire Dragon Dance bagua UI art is also on disk and rendered - the 8-node click ring with taijitu centre, trigram glyphs and close button - class-linked to the v0.717 DragonDanceUI.

- **Cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png (opened, 813x480) + reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:7 and :70-71; second variant at reference/extracted/sprites/DefineSprite_3555_1t6980s0/1.png`
- **Quote:** §1t5495s0§.as:7  [Embed(source="/_assets/assets.swf", symbol="symbol1810")]   §1t5495s0§.as:70-71  this.§1t5516s0§ = ["sky","wind","water","mountain","earth","thunder","fire","lake"]; this.§1t5517s0§ = ["fire","earth","lake","sky","water","mountain","thunder","wind"];   |   VISIBLE IN PNG: three concentric dark-red rings; 8 white click nodes with bright-green outlines at the 8 compass points, each bearing a green kanji (frame-1 default 天 = 'sky'); 8 dark-red bagua trigram glyphs on an inner ring; a taijitu (yin-yang) centre labelled 'FIRE' in the brush font; red ✕ close button top-right.
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ loses its art half too, which nobody in this unit claimed. The node `word` sub-clip frame map is also held (DragonDanceUI.as:358 gotoAndStop(num+11) Earlier Heaven / :362 num+31 Later Heaven), so the per-node kanji swap is reproducible. Feeds ui-hud.

### `rebirth/element-circle-art-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth element-picker circle's art, layout and colours are fully recovered from the exported asset set: an 808x480 panel with FIRE (red) / EARTH (dark gold) / WIND (white-grey) / WATER (blue) kanji badges on a ring, joined by grey 'STRONG AGAINST' arrows running FIRE->EARTH->WIND->WATER->FIRE.

- **Cite:** `reference/extracted/sprites/DefineSprite_1650/1.png (808x480; viewed whole, then crop (230,80)-(620,420) upscaled x3 LANCZOS); parent symbol reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png (crop (520,250)-(860,470) x4) linked by reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9 [Embed symbol="symbol1691"] and :77 elementCircle:MovieClip`
- **Quote:** Visibly in the crop: four circular element badges - FIRE at top (bright red ring, 火 in red on a near-black disc, white label 'FIRE'), EARTH at right (dark-gold ring, 土, 'EARTH'), WIND at bottom (light-grey ring, 風, 'WIND'), WATER at left (blue ring, 水 in blue, 'WATER') - connected by grey curved arrows each captioned 'STRONG AGAINST' in white, on a plain grey field.
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** L rebirth-elements blocker (5) closed OUTRIGHT, art half included - it is not merely 'data held, art unheld'. The arrow direction independently corroborates the code wheel at StatsManager.as:1836, so art and AS3 agree with no measurement doc in between. The 808x480 sprite size is also fresh corroboration of ledger §3 #12's 800x480 native stage. Prompt copy recovered too: string 611 = 'Choose an element to specialize in.' (InteractUI.as:556-559).

### `rebirth/element-circle-art-is-on-disk` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The rebirth element-picker circle is recoverable art, already extracted: the v0.717 InteractUI symbol export shows the disc with its element name and its STRONG AGAINST / WEAK AGAINST label ring.

- **Cite:** `reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png — crop (500,260)-(850,420) of the 856x853 export, alpha matted white, upscaled x4 LANCZOS; symbol identified by reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9 [Embed symbol="symbol1691"] with elementCircle at :77 and :574`
- **Quote:** Visibly in the crop: a large dark disc behind the character bust; the element name 'WIND' in the game's brush face below disc centre; two arc labels at the disc flanks reading '...AGA[INST]' (left) and '...NG ...AINST' (right).
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤: the art half is no longer fully unheld. Layout (circular, element name below centre, two opposed arc labels naming the counter relationship) is held from an asset render, and it visually corroborates the code-side counter wheel at StatsManager.as:1836. Still open: a clean per-layer render (the export flattens the whole InteractUI symbol so the character bust occludes the disc) and the exact hues. The close-path is now narrow - re-export symbol1691's elementCircle child on its own, rather than searching video frames the ledger correctly says never filmed it.

### `rebirth/element-circle-art-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth element-picker circle's art, layout, colours and copy are fully recovered from the WEB v0.717 payload: sprite 1650 'elementCircle' inside InteractUI's symbol 1691, already rendered to PNG on disk.

- **Cite:** `reference/extracted/sprites/DefineSprite_1650/1.png (opened; crop (510,50)-(808,370) upscaled 3x to 894x960, Lanczos) + reference/extracted/payload.xml:626581 + reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9`
- **Quote:** payload.xml:626581  <item type="PlaceObject2Tag" characterId="1650" depth="37" name="elementCircle" .../>   |   §1t401s0§.as:9  [Embed(source="/_assets/assets.swf", symbol="symbol1691")]   |   VISIBLE IN CROP: four ringed circular nodes - FIRE 火 top, EARTH 土 right, WIND 風 bottom, WATER 水 left - joined by four clockwise grey arrowed arcs each captioned 'STRONG AGAINST' on two lines, English label beneath each node, hand-drawn brush display face. Sampled hexes: FIRE #FF3300, EARTH #7D5500, WIND #BBBBBB, WATER #0099FF, node fill #333333.
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤ is now CLOSED OUTRIGHT - data, flow, copy, geometry AND art. Also feeds ui-hud: the four element hexes are the OG's canonical element palette, and #7D5500 is the same gold InventoryUI.as:2286 draws the shogo title in. Also art-anim: this is v0.717 web art, so no build-parity caveat applies.

### `rebirth/elemental-gate-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete elemental unlock table is recoverable by name: qty 10 opens Fire Breath, the four Element Traps, the four Kunai, Ground Punch, Wind Combo and Water Stomp; qty 30 opens the four Dragon Dance Steps AND the four ultimates Inferno/Tsunami/Tornado/Earthquake; qty 60 opens the four Dragon Dance Step II passives.

- **Cite:** `reference/extracted/skilldata.xml — every <req><has><id>28|29|30|31</id><qty>…</qty> block, names joined through docs/gauntlet/L0/index/strings.json (anchors verified at :988, :1726, :1884)`
- **Quote:** 988:  <req><has><id>28</id><qty>10</qty></has></req>   skill 1029 = 'Fire Kunai'
1884: <req><has><id>28</id><qty>30</qty></has></req>   skill 1070 = 'Inferno'
1726: <req><has><id>28</id><qty>60</qty></has></req>   skill 1060 = PASSIVE 'Dragon Dance Step: Fire II'
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L-rebirth-elements + L-skills-meters: the ledger's Dragon Dance sentence is correct as written; what it omits is the 1x tier (breath/traps/kunai/stomps) and the fact that the four ultimates share the 3x gate with the Dragon Dance Steps. This is the table that refutes the rebirth lane's 'entire usable elemental kit lands on the FIRST rebirth'.

### `rebirth/hgold-is-premium-currency` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth payout is Heavenly Gold, the real-money PayVault currency, not the coin economy - so a 'tenthGold' config key modelled as coins would be wrong even with the right number.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2669-2682 and :2684-2711; desktop thresholds at reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544 and :1581`
- **Quote:** public static function getHeavenlyGold() : int { var hgold:int = getPlayerStats(STAT_HGOLD); if(usePlayerIO) { hgold += QueryManagerPIO.instance.getPayVaultCoins(); } return hgold; } ... QueryManagerPIO.instance.debitPayVaultCoins(deductgold, ...)
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** economy + rebirth-elements: rebirth is a premium-currency faucet, which is why the desktop anti-cheat tolerates 300 of it only once DAN >= 9 (§1t406s0§.as:1544) while capping coins separately (OverworldHUD.as:1338, STAT_GOLD > 10000). The ledger's film-derived '+25 gold' was reading the Heavenly Gold counter, not the coin counter. For a single-player recreation with no PayVault this reward has no destination and should be flagged as a design decision, not ported.

### `rebirth/no-elemental-status-effects-exist` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental skills apply no status effect at all - no burn, slow, root or DoT - because the Damage packet has no field to carry one and every BUFF_* constant is a meta/economy buff.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:26-48 (complete field list) and :6-24 (launchType enum) + StatsManager.as:288-312 (complete BUFF_* list)`
- **Quote:** Damage.as fields: damage, stance, launchType, attackerlvl, piercingDamage, fireDamage, waterDamage, windDamage, earthDamage, flyVelX, flyVelY, victimPosX.
StatsManager.as:288-312: BUFF_XP 0, BUFF_ATTACK 1, BUFF_DEFENSE 2, BUFF_SPEED 3, BUFF_AP 4, BUFF_DUELTOKENS 5, BUFF_COINS 6, BUFF_RARELOOT 7, BUFF_MUTE 8, BUFF_FULLMUTE 9, BUFF_HELL 10, BUFF_INJURED 11, BUFF_MODERATOR 12
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L rebirth-elements blocker (1): the 'status' clause resolves to a clean NEGATIVE rather than staying open. Build the elemental kit statusless and label it. The only per-hit reaction is launchType (Tornado = LAUNCH_AIR, the other three ultimates = LAUNCH_KNOCKDOWN).

### `rebirth/romaji-dan-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop build ships a SECOND Dan ladder — hard-coded English romaji, absent from the string table and from the android build — printed in the versus/duel panel, and it is the direct explanation of the 'garbled wiki datum' the ledger complains about.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-566, rendered at :582`
- **Quote:** case 0: dantext = "";                                case 5: dantext = "(rokudan) "  + §1t1521s0§.getString(465);\ncase 1: dantext = "(nidan)";                         case 6: dantext = "(nanadan) "  + §1t1521s0§.getString(466);\ncase 2: dantext = "(sandan)";                        case 7: dantext = "(hachidan) " + §1t1521s0§.getString(466);\ncase 3: dantext = "(yondan) " + getString(465);      case 8: dantext = "(kyudan) "   + §1t1521s0§.getString(467);\ncase 4: dantext = "(godan) "  + getString(465);      case 9: dantext = "(judan) "    + §1t1521s0§.getString(467);\n:582  this.playerText.tex
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements blocker ③ + ui-hud: the versus panel reads 'Level: N (yondan) Renshi' in ROMAJI, while the inventory panel shows the KANJI danfield — two different display formats for the same stat, and only the kanji one was recovered by the survey. This also settles the ledger's §3 #7 garble: the game itself prints '(kyudan)' at STAT_DAN 8, so a wiki editor transcribing the versus panel would write exactly the string the ledger calls garbled. Copy '(nanadan)' for 7th verbatim — it is a non-standard romanisation and is what shipped.

### `skills-meters/canchangestance-is-a-named-gate` — HELD [A2] ⚑ OVERTURNS LEDGER

In-combat stance switching has a named public gate in the web build: canChangeStance() = valid action state AND reload >= 48 — the ledger's HARD-LOCK line is dead code-level, not just caption-level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3063`
- **Quote:** 3048:      public function §1t4470s0§() : Boolean
3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
---
3058:      public function §1t4472s0§() : *
3060:         if(this.§1t4414s0§ < 48)
3062:            return;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L2/L5: the recreation's Focus-gated switch is FAITHFUL. The gate value and the charge value are the same 48, so the rule is simply 'costs 48, refused below 48'. Two documents must be struck, not one: REBUILD_READINESS.md:158 and SHSD_MASTER_REFERENCE.md:388, which grades the hard lock [CONTRACT].

### `skills-meters/focus-skill-web-effect` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'Focus' skill (id 1005, the ledger's 'Replenish Focus') sets reload to maxreload - 1 in the WEB build — one frame short of crit, deliberately.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:230-231, with the id at §1t120s0§.as:18`
- **Quote:** 18:      public static var §1t10128s0§:int = 1005;
---
230:            case §1t10128s0§:
231:               param3.§1t4414s0§ = param3.§1t4415s0§ - 1;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: the survey had this only from Android (SkillManager.as:218-219); here is the web cite, so it is v0.717 fact. Design consequence worth stating: the skill never grants the crit itself — it puts you one frame away, so a crit always costs one more tick of natural refill. Note also the string table names skill 1005 simply 'Focus', not 'Replenish Focus'.

### `skills-meters/kunai-ammo-cost` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental kunai and traps consume a kunai-ammo stat on top of Chi, and traps cost four kunai each — a resource cost absent from the ledger.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillSlotButton.as:108, :118, :159-174 + docs/gauntlet/L0/index/strings.json descs for skills 1025-1032`
- **Quote:** SkillSlotButton.as:161  ammo = StatsManager.getStat(2501);
SkillSlotButton.as:172  ammo = Math.floor(StatsManager.getStat(2501) / 4);
skill 1025 desc = 'Lay a trap that deals fire damage when triggered.\n\nRequires kunai ammo.'
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** skills-meters + economy: stat 2501 is a consumable ammo pool with its own HUD readout (the skill button shows remaining casts, greying out at <=0). Traps divide by 4, kunai by 1. Independently, the '24 elemental skills' figure is exactly right — categories 7/8/9/10 in reference/extracted/skilldata.xml hold precisely 24 skills (1013, 1025-1035, 1056-1063, 1070-1073).

### `skills-meters/maxreload-is-192-frames` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 crit/Focus meter's maximum is 192 frames (8.00 s), not the 120 the survey banked; usable range above the 48-frame dead zone is 144 frames (6.00 s) and it refills at +1 per tick.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (player), §1t4904s0§.as:77 (clone), refill at §1t99s0§.as:1203-1205`
- **Quote:** 249:         this.§1t4415s0§ = 8 * 24;
---
1203:         if(this.§1t4414s0§ < this.§1t4415s0§)
1205:            ++this.§1t4414s0§;
--- exhaustive grep of §1t4415s0§ across the web bundle ---
§1t99s0§.as:249:      this.§1t4415s0§ = 8 * 24;
§1t4904s0§.as:77:     §1t4415s0§ = 8 * 24;
(no other assignment exists; §1t12234s0§ = 5*24 at :55 is assigned only to §1t4440s0§ at :266)
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: config must encode maxReloadFrames = 192, deadZone = 48, usable = 144, refill = +1/frame. Every derived statement in the survey's R-09 rescales: a stance switch costs one third of the usable meter, not two thirds; a 0-to-crit charge is 8.00 s, not 5.00 s. Blocker ③ is closed by THIS number, not by the survey's.

### `skills-meters/maxreload-is-192-not-120` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 Focus/reload meter maxes at 8*24 = 192 frames (8.00 s), of which the first 48 frames render as a zero-width bar, leaving exactly 6.000 s of visible travel — which is what the frame-derived fill measurement has been reporting all along.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (inside §1t4443s0§, declared :183) with §1t113s0§.as:328; corroborated by docs/research/fidelity/COMBAT_MEASUREMENTS.md:101 and rows f-5/f-6 (:589-590)`
- **Quote:** 249:         this.§1t4415s0§ = 8 * 24;
---
328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
--- COMBAT_MEASUREMENTS.md:101 ---
- Rate **45.05 ± 0.30 px/s** ⇒ empty→full **5.97 s** (confirms 6.00 s).
--- arithmetic ---
(192-48)/24 = 6.000 s visible travel   <== matches the measurement exactly
(120-48)/24 = 3.000 s                  <== the survey's number, off by 2x
- **Overturns:** "**Focus empty→full ≈ 5.9 s** (268 px ÷ 45.5 px/s) … **rate MEASURED; total INFERRED** — the observed ramps only span 0→49 % of the track, so the full time extrapolates a constant rate; no full-fill or consumption event was captured"
- **Lane impact:** L2: this UPGRADES COMBAT_MEASUREMENTS f-6 from 'total INFERRED' to CONTRACT — the extrapolation was right and no longer needs to be an extrapolation. Config: RELOAD_MAX = 192 frames, dead zone 48, usable 144, stance switch 48 = one third of usable (not two thirds). Also the standing rule to carry: the frame and the web code agree here and both refute a doc-derived number, so cite the code AND the measurement together.

### `skills-meters/slashusage-is-weapon-derived` — HELD [A2] ⚑ OVERTURNS LEDGER

slashUsage — the multiplicand in the whole Focus-spend model — is read off the equipped weapon with a hard floor of 48, and itemdata carries 106 <slashusage> rows.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2350-2358 (param 11 of the init call at :2268); reference/extracted/itemdata.xml:8044`
- **Quote:** 2350:      internal static function §1t9594s0§() : int
2353:         if(_loc1_ == null || _loc1_.slashusage < 48)
2355:            return 48;
2357:         return _loc1_.slashusage;
---
itemdata.xml:8044:		<slashusage>72</slashusage>   (106 such rows in the file)
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2/L10: this is the number that makes the meter simulable and the survey left it an opaque symbol. With max 192 / usable 144 and a 72-usage weapon: Light slash = 36, Balanced = 72, Heavy = 108 focus. Weapon choice therefore controls crit cadence — a cross-lane hook into items-equipment that no lane has claimed.

### `skills-meters/stance-switch-gate-and-cycle` — HELD [A2] ⚑ OVERTURNS LEDGER

The stance-switch gate is a hard reload >= 48 and the button cycles only Light -> Balanced -> Heavy -> Light; Dual and Reversed are unreachable from it, and the switch unlocks at the exact reload value where the bar still displays 0%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3079, read against §1t113s0§.as:328-343`
- **Quote:** 3050:          return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
3060:          if(this.§1t4414s0§ < 48)
3062:             return;
3066:             this.§1t3489s0§(§1t12220s0§);
3070:             this.§1t3489s0§(§1t12221s0§);
3074:             this.§1t3489s0§(§1t12222s0§);
3078:             this.§1t3489s0§(§1t12220s0§);
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L2/L5: this is the direct proof the ledger's §3.4 is dead — the survey argued it indirectly from caption states. Also an authenticity detail worth reproducing rather than fixing: bar% = (reload-48)/144, so at reload exactly 48 the bar reads 0% and the CANNOT CHANGE STANCE caption is on screen for the frame in which switching first becomes legal.

### `skills-meters/stance-switch-gate-is-48` — HELD [A2] ⚑ OVERTURNS LEDGER

In-combat stance switching is hard-gated on reload >= 48 by an explicit early-return, so 'CANNOT CHANGE STANCE' is a literally true refusal rather than an inference from the switch cost.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3051 and :3058-3063`
- **Quote:** 3048:      public function §1t4470s0§() : Boolean
3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
---
3058:      public function §1t4472s0§() : *
3060:         if(this.§1t4414s0§ < 48)
3062:            return;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L5/L2: §1t4472s0§ is the whole stance cycle (-1 -> Light -> Balanced -> Heavy -> Light, :3064-3079) and it refuses below 48. Since the bar reads 0 iff reload <= 48, the caption fires exactly when the cycle refuses. Ship a Focus-gated switch with gate 48 and cost 48 — and note only THREE stances are player-cyclable; Dual and Reversed are never reached by §1t4472s0§.

### `skills-meters/stance-switch-hard-gate-48` — HELD [A2] ⚑ OVERTURNS LEDGER

In-combat stance switching is gated by a hard reload >= 48 check, and the switch button cycles only Light -> Balanced -> Heavy -> Light; Dual and Reversed are unreachable from it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3048-3050 and :3058-3078`
- **Quote:** 3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
3060:         if(this.§1t4414s0§ < 48)
3062:            return;
3066:            this.§1t3489s0§(§1t12220s0§);
3070:            this.§1t3489s0§(§1t12221s0§);
3074:            this.§1t3489s0§(§1t12222s0§);
3078:            this.§1t3489s0§(§1t12220s0§);
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE")"
- **Lane impact:** L2/L5: settles the survey's claim outright with a direct gate instead of an inference from caption states. Note the off-by-one to reproduce faithfully: the gate opens at raw reload 48, which is exactly where the displayed bar still reads 0 ((48-48)/(192-48)=0), so the refusal caption is on screen for the first frame the switch is legal.

### `ui-hud/bars-are-untweened-continuous-scalex` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker (2)'s 'bar tween vs snap' question is closed and the answer is snap: both HP and Chi bars are direct, untweened, continuous scaleX assignments with a paired drop-shadow text field.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:244-256`
- **Quote:** `this.hptext.text = hp + "/" + maxhp; this.hptextshadow.text = hp + "/" + maxhp; this.hpbar.bar.scaleX = hp / maxhp;` and `this.chitext.text = chi + "/" + maxchi; this.chitextshadow.text = chi + "/" + maxchi; this.chibar.bar.scaleX = chi / maxchi;` -- no Tween, no easing, no interpolation anywhere in the class.
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** ui-hud lane + art-anim-audio-feel: closes the first third of blocker (2) outright and supplies the exact readout format, which I frame-confirmed (the same crop shows 20/20 and 26/26 centred on full green and blue bars, matching hp + "/" + maxhp). Note the paired *shadow field: every HUD number is drawn twice with an offset, a fidelity detail no ledger row carries. Also corrects claim 6's rider -- the bars are continuous, the cooldown is 12-step quantised; they are not 'the same character'.

### `ui-hud/blocker4-uparrow-is-an-equipped-skill` — HELD [A1] ⚑ OVERTURNS LEDGER

Ledger blocker (4) is wrong: the gold up-arrow in slot 3 is an equipped skill, not the stance control, because a slot only receives a keypress numeral on the branch where StatsManager.skillSlots[i] is non-null.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png crop (1380,920)-(1880,1080) upscaled 3x, adjudicated against reference/decompiled/shs3_android/scripts/BattleUI.as:501-511, SkillSlotButton.as:123-135 and BattleUI.as:275,192`
- **Quote:** Visible in the crop: leftmost box empty AND carrying no numeral, middle box numeral 2 over a claw/fang icon, right box numeral 3 over a gold up-arrow. Code: `skillSlotButton.visible = i < this.slotCount;` then `if(i < equippedSkillsCount && StatsManager.skillSlots[i] != null){ skillSlotButton.initKeyPressText(this.slotCount - i); skillSlotButton.initSkill(...); } else { skillSlotButton.initEmpty(); }`, and initEmpty does `this.keypressText.text = "";` (SkillSlotButton.as:128). Stance is bound elsewhere: `if(this.battlemodebust.hitTestPoint(mousex,mousey)){ this.stanceButtonClick(); }` (BattleU
- **Overturns:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud: Pass 1 claim 10 made this call; Pass 2 restated it inside claim ui-hud/hud-symbol-metrics with an EMPTY cite and overturns_ledger:false, which loses a real ledger overturn. Filed here with a cite so it is not dropped. It also fixes the slot reading: slotCount = 3 with two skills equipped, key 3 at i=0 (x=760) and key 2 at i=1 (x=700).

### `ui-hud/combo-widget-content-held-pop-unheld` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The combo counter's content and structure are fully held -- a number plus a shadow duplicate under a label reading 'Hit Combo' -- but there is no code-side animation, so the 'combo pop' half of blocker (2) is timeline motion inside symbol2952 and stays open.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:56,98-100,382-395`
- **Quote:** `this.combo.combolabel.text = LangManager.getString(45);` (resname 45 = 'Hit Combo'), `this.combo.mouseEnabled = false;`, then `showCombo(num)`: `this.combo.visible = true; this.combo.combo.text = num.toString(); this.combo.comboshadow.text = num.toString();` and `hideCombo()`: `this.combo.visible = false;`. No tween, no gotoAndPlay, no scale or alpha touched.
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** ui-hud lane + art-anim-audio-feel: catalogues the combo widget (structure + copy + show/hide rule) and localises the remaining unknown precisely to symbol2952's timeline. Frame-confirmed in crop (1560,0)-(1920,200) upscaled 3x of duel_dense/Nr4fQstqHDM_428.0.png: a red brush '3' with a hard black offset shadow above a black plaque reading HIT COMBO -- the number+shadow pair rendered. Also a third independent confirmation of claim 1's resname keying.

### `ui-hud/frame-refutes-stance-up-arrow` — HELD [A1] ⚑ OVERTURNS LEDGER

Ledger blocker ④ is wrong: the gold up-arrow is a keypress-bound skill in slot 3, not a stance control — the stance control is the bottom-left portrait bust.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crops (40,900)-(700,1080) upscaled 2.4x and (1380,920)-(1880,1080) upscaled 3x`
- **Quote:** Bottom-left crop shows a portrait bust inside a RED stance ring, a green 20/20 HP bar, a blue 26/26 Chi bar, a brown 'CANNOT CHANGE STANCE' plaque directly beneath them and a yellow '150% DAMAGE' line. Slot-strip crop shows three boxes: leftmost empty with a bright metallic border and NO number, middle labelled '2' holding a pale claw/beast icon, right labelled '3' holding a gold up-arrow. A stance control does not carry a keypress label.
- **Overturns:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** L-ui-hud: closes ledger blocker ④ outright rather than leaving it inside a STILL_UNHELD. Corroborated in code — stance is battlemodebust.hitTestPoint -> stanceButtonClick() (BattleUI.as:275-277), while slot art comes from SkillSlotButton.image and initEmpty() clears keypressText (:124-129). THE FRAME WINS over the ledger. Also touches skills-meters (the slot strip is 3 skill slots, one empty, not 2 skills + a stance widget).

### `ui-hud/friend-bar-690` — HELD [A2] ⚑ OVERTURNS LEDGER

The 690-px stage height is not container chrome: it is originalHeightWithBar, a viewport-driven in-game friend panel the engine lays out itself, and the web build shipped the 690 stage while the Android build shipped the 480 one.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:271, :277-283; SWF headers of reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** GameEngine.as:271 `var originalHeightWithBar:int = 690;`  ·  :277-283 `if(newAspectRatio <= originalWithBarAspectRatio) { originalAspectRatio = originalWithBarAspectRatio; originalHeight = originalHeightWithBar; StatsManager.stageShowingFriendBar = true; if(OverworldHUD.instance != null) { OverworldHUD.instance.friendpanel.init(); } }`  ·  headers I decoded: shs3_payload_decoded.swf rect 800.0 x 690.0 · shs3_android_payload_decoded.swf rect 800.0 x 480.0
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** ui-hud and meta-social, not art: the ledger's aspect-ratio unknown resolves to a TWO-MODE layout — 800x480 with the friend bar off (wide viewports, which is what both longplays record) and 800x690 with a game-drawn friendpanel on (narrow viewports). Neither ui-hud nor meta-social holds a friend panel. Also retires the false frame-vs-doc conflict in art-anim-audio-feel/aspect-ratio-frame-wins.

### `ui-hud/hud-art-already-exported` — HELD [A1] ⚑ OVERTURNS LEDGER

The JPEXS shape/sprite export that this lane's residual says is missing already exists on disk from the WEB payload: 1,822 shape SVGs and 827 rendered DefineSprite directories, including the pause screen at 802x481 and the 5-frame skill-slot box at 56x55.

- **Cite:** `reference/extracted/sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png (opened whole, 802x481, alpha-composited over a dark ground and viewed) and reference/extracted/sprites/DefineSprite_934_shs3_fla.skillSlotBG_755/1-5.png (opened, 5 frames at 56x55, rendered as a 4x NEAREST strip)`
- **Quote:** Visibly in PauseScreen_51/1.png: a full-stage near-black overlay 802x481 px carrying the Straw Hat Samurai 'DUELS' logo (white kanji over a red brush DUELS) centred around y=130-260 and a white 'GAME PAUSED' line at about y=285. Visibly in skillSlotBG_755: five 56x55 rounded-square slot faces - dark border/olive fill, bright cream border/olive fill, dark border/black fill, bright cream border/black fill, dark border/olive fill. Frame 4 is exactly the empty highlighted slot seen in duel_dense/Nr4fQstqHDM_428.0.png. Also present: shs3_fla.autoslashbutton, chatTextBattle, skillnodeinner, MinimapI
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane, and it changes the close-path for every art-bearing lane. The ledger's Tier-3 'overworld HUD pixel geometry' and blocker ⑤'s pause half are closable today by reading files already in the repo - no new export, no video re-pass, and nothing gated on the encrypted 124_Mobile_ImageResource. It also overturns this pass's own STILL_UNHELD residual (ui-hud/hud-symbol-metrics) and removes one of the two reasons its score rationale gives for holding ui-hud below 90. Cross-lane: art-anim-audio-feel and world-exploration inherit the same 1,822-SVG / 827-sprite corpus.

### `ui-hud/interactui-panel-geometry` — HELD [A2] ⚑ OVERTURNS LEDGER

InteractUI's panel geometry is held in stage pixels straight from the payload placement matrices, so the rebirth menu can be laid out without guessing.

- **Cite:** `reference/extracted/payload.xml:626573-626600 (DefineSpriteTag spriteId=1691, the symbol §1t401s0§/InteractUI embeds)`
- **Quote:** name="elementCircle" translateX="0" translateY="0" (depth 37)
name="titleText"     translateX="206"  translateY="1400"
name="button1"       translateX="200"  translateY="2180"
name="button2"       translateX="200"  translateY="2960"
name="button3"       translateX="200"  translateY="3740"
name="button4"       translateX="200"  translateY="4520"
name="button5"       translateX="200"  translateY="5300"
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** ui-hud + rebirth-elements: twips/20 = px, so titleText sits at (10.3, 70) px, buttons share x = 10 px at y = 109 / 148 / 187 / 226 / 265 px — a uniform 39 px row pitch — and elementCircle anchors at the sprite origin. Same technique opens every other named UI sprite in payload.xml.

### `ui-hud/jpexs-export-already-on-disk` — HELD [A2] ⚑ OVERTURNS LEDGER

The JPEXS shape/sprite export that this lane schedules as the remaining close-path has already been run and is in the repo — 1,822 web-build SVGs and 827 sprite directories, including the HUD symbols declared missing.

- **Cite:** `reference/extracted/shapes/ (1,822 *.svg) and reference/extracted/sprites/ (827 dirs), e.g. DefineSprite_3621_shs3_fla.autoslashbutton_43/1.png, DefineSprite_934_shs3_fla.skillSlotBG_755/1.png, DefineSprite_3632_shs3_fla.PauseScreen_51/1.png`
- **Quote:** Measured opaque bounding boxes: autoslashbutton_43 = 129x31 (bbox fills canvas), skillSlotBG_755 = 56x55 (opened it: the rounded metallic slot frame visible in the frame crop), PauseScreen_51 = 802x481. shapes/1003.svg header: `ffdec:objectType="shape" height="30.55px" wid...`. Also present: stancecolor1_56, chatTextBattle_45, MinimapIcon_668, MinimapRoomIcon_672, skillnodeinner_89, speechbubble_422, QuestLogButtonBG_548.
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** L-ui-hud: the declared residual is already closed, so the lane's STILL_UNHELD is stale and its Tier-3 recommendation mis-directs. Also feeds art-anim-audio-feel (HUD chrome art no longer needs the encrypted 124_Mobile_ImageResource) and any lane that assumed only scripts/ was recovered from the payload.

### `ui-hud/pausescreen-sprite-confirms-play-field` — HELD [A2] ⚑ OVERTURNS LEDGER

A web-build-native artifact confirms the 800x480 play field, so blocker ① no longer has to borrow the Android build's stage rect — which matters, because the web SWF's own stage rect is 800x690.

- **Cite:** `reference/extracted/sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png; SWF headers of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf parsed first-hand`
- **Quote:** PauseScreen_51 rasterises to 802 x 481 px with the opaque bbox filling the canvas — a full-play-field overlay from the WEB payload. Parsed SWF header rects: shs3_payload_decoded.swf = 800.0 x 690.0 @ 24.0 fps, 6 frames; shs3_android_payload_decoded.swf = 800.0 x 480.0 @ 24.0 fps, 6 frames.
- **Overturns:** "① aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect unt.png for side-bars; read stage.stageWidth in a build."
- **Lane impact:** L-ui-hud: separates the two numbers the lane has been conflating — the web STAGE is 800x690 (the authored canvas, friend-bar layout) while the web PLAY FIELD is 800x480. Both are now held from web-build artifacts, so no android caveat is needed for either, and the 'read stage.stageWidth in a build' instruction in the ledger is moot.

### `ui-hud/up-arrow-is-a-skill-not-the-stance-control` — HELD [A2] ⚑ OVERTURNS LEDGER

The gold up-arrow occupying a combat skill slot is an equipped-skill icon, not a stance control, so the ledger's 'really ~2 abilities + a stance up-arrow' reading of the slot strip is wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillSlotButton.as:87 and BattleUI.as:26,112-113,192-193,275,374`
- **Quote:** `this.image = ResourceManager.getSkillImage(this._skillId);` (SkillSlotButton.as:87) - a slot's face is always the equipped skill's image. The stance control is a separate object: `public var battlemodebust:MovieClip;` (BattleUI.as:26) with `battlemodebust.buttonMode = true` (:113), `battlemodebust.addEventListener(MouseEvent.MOUSE_OVER, this.showChangeStanceLabel)` (:192), `if(this.battlemodebust.hitTestPoint(mousex,mousey)){ this.stanceButtonClick(); ... }` (:275) and `this.battlemodebust.stancecolor1.gotoAndStop(num)` (:374).
- **Overturns:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** ui-hud lane: closes blocker ④ as a misreading - the strip is N equipped-skill slots (8 are constructed, BattleUI.as:130-137) and the stance control lives on the portrait bust, elsewhere on the HUD. The pass stated this correctly but buried it inside a STILL_UNHELD claim and never flagged the overturn. Feeds skills-meters: whichever skill carries the up-arrow icon is now a lookup against ResourceManager.getSkillImage plus the 139-icon manifest, not a video-re-pass question.

### `world-exploration/war-tick-is-hourly-not-daily` — HELD [A2] ⚑ OVERTURNS LEDGER

The war tick the ledger names as a consumer of the "day" length runs on a 3600-second clock, and duel tokens on a 120-second clock, so blocker ③'s single-day-clock premise fails on five independent clocks, not three.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158,:160,:162`
- **Quote:** internal static var APINTERVAL:int = 60;

internal static var DTINTERVAL:int = 2 * 60;

internal static var WARMOVEINTERVAL:int = 60 * 60;
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L1 world-exploration and L11 meta-social: strengthens and corrects the journal's day-length-is-three-clocks claim. The ledger's ③ explicitly lists the "war tick" as governed by the day length; WARMOVEINTERVAL=3600 kills that outright — the war moves hourly. Full clock inventory: AP 60 s, duel tokens 120 s, war move 3600 s, crops 900/3600/21600/43200 s (+900 s grace), quest repeat + daily streak 86400 s. Five independent real-time clocks, all measured in raw seconds off QueryManager.getServerTime(). The save schema corroborates: slots 100/101/102 are nextAPUpdate / nextDTUpdate / nextWarTurn, three separate persisted timestamps.

### `world-exploration/web-decompile-holds-full-logic` — HELD [A2] ⚑ OVERTURNS LEDGER

reference/decompiled/shs3_payload/ is the complete web v0.717 game-logic decompile under obfuscated class names, not 'only display symbols' - so cross-build parity is checkable for every world constant by grepping values instead of names.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (StatsManager), §1t70s0§.as:146,:399-404 (NodeGenerator), §1t6481s0§.as:17-21,:285-286 (WorldMapUI), §1t58s0§.as (RNG), §1t136s0§.as:40,42 (NameGenerator), §1t8621s0§.as:82-138 (Obj_VegePatch), §1t72s0§.as:32,98 (XMLWorldNode)`
- **Quote:** public static var §1t9323s0§:Number = 0.717;
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** Affects EVERY L0 unit, not just L1. The Stage-0b caveat 'this is the ANDROID build, clientVersion 0.682 ... combat tuning parity is NOT established' is far weaker than assumed: the web v0.717 logic is on disk and greppable by constant. Verified identical across builds in this lane: APINTERVAL 60, DTINTERVAL 2*60, WARMOVEINTERVAL 60*60, start AP/MAXAP 30, STAT_LOCATION 8382465, quest 24*60*60, level formula abs(x-341)+abs(y-341)+3 with cap 200 (and the cap-100 variant), territory = floor(sector/6), TERRSHIFTX 21 / TERRSHIFTY 51 / WARMARKERSHIFTX 8, projection *10+5 and *10+8.5, LCG 9301/49297/233280, crop timers 15m/1h/6h/12h + 15m grace, and both NameGenerator arrays element-for-element (78 and 37 entries, diffed: IDENTICAL). New standing rule for the board: before declaring an Android-only caveat, grep shs3_payload for the VALUE. Only divergence found here: XMLWorldNode does XMLList(param1.search).copy() on web vs xml.search on android.

### `world-exploration/world-map-art-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The drawn world-map art IS held: the web v0.717 payload carries it as 36 tiles inside DefineSprite 262, already exported to reference/extracted/sprites/, and reassembling them at their own twip offsets renders the Japanese archipelago.

- **Cite:** `reference/extracted/payload.xml:395761-395830 (DefineSpriteTag spriteId="262") + reference/extracted/sprites/DefineSprite_{191,193,195,197,199,201,203,205,207,209,211,213,215,217,219,221,223,225,227,229,231,233,235,237,239,241,243,245,247,249,251,253,255,257,259,261}/1.png`
- **Quote:** <item type="PlaceObject3Tag" characterId="189" depth="1" ... name="shadowmap" ...
<item type="PlaceObject2Tag" characterId="227" depth="39" ... name="map_1_6" ...
  <matrix type="MATRIX" ... translateX="1598" translateY="9600"/>
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L1 world-exploration: kills the journal's own STILL_UNHELD 'map-art-unheld' and removes one of the four negatives holding the score at 85. 36 tiles map_0_7..map_8_1, characterIds 191-261, placed at translateX = i*80*20 twips and translateY = j*80*20 twips (map_1_6 -> 79.9, 480 px), plus a 'shadowmap' underlay at characterId 189. Every tile PNG is already on disk from the earlier ffdec export; nothing new needs decrypting. I composited all 36 and LOOKED: Hokkaido, Honshu, Shikoku, Kyushu, Sado and Awaji are all present and correctly shaped. The ledger's 'trace the map image' close-path is doubly obsolete - the image does not need tracing, it needs compositing.

### `art-anim-audio-feel/150-percent-damage-is-a-potato-buff` — HELD [A2]

The HUD's '150% DAMAGE' is a consumable food buff, not the stance modifier and not the behead multiplier — the string table settles it in one lookup.

- **Cite:** `docs/gauntlet/L0/index/strings.json entry 4132 (and 125, 208); cross-checked against reference/decompiled/shs3_android/scripts/MCSPlayer.as stance-matchup branch `damage *= 1.2``
- **Quote:** strings.json 4132 = "Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time." · 125 = "Stance Restriction" · 208 = "Change Stance" · MCSPlayer.as: light>balanced>heavy>light -> `damage *= 1.2;`
- **Lane impact:** art-anim-audio-feel: closes the survey's own 'CAUTION, un-reconciled' note, which was answerable from the evidence index it was handed. Cross-lane into combat-core (the stance-matchup bonus is x1.2, not x1.5), items-equipment (a timed consumable buff class exists) and ui-hud (an active-buff HUD row exists that no ledger system holds).

### `art-anim-audio-feel/150pct-damage-is-a-buff-not-the-stance-modifier` — HELD [A2]

The frame's '150% DAMAGE' HUD line is a consumable BUFF_ATTACK buff, not the stance modifier - the stance-triangle bonus is x1.2 in the same function, and the string table resolves both HUD lines outright.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 4132 and 125; reference/decompiled/shs3_android/scripts/MCSPlayer.as:3699-3703 and StatsManager.as:290; HUD text visible in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png bottom-left panel`
- **Quote:** strings.json 4132 = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.' ; 125 = 'Stance Restriction'. MCSPlayer.as:3701 `damage *= 1.2;` (the stance-triangle branch, LIGHT>BALANCED>HEAVY>LIGHT) vs :3715 `if(behead) { damage *= 1.5; }`. StatsManager.as:290 `internal static var BUFF_ATTACK:int = 1;`
- **Lane impact:** art-anim-audio-feel: closes the claim's own 'CAUTION, un-reconciled' note and closes it against the guess. Cross-lane into combat-core (the stance-triangle multiplier is 1.2, a hard number) and ui-hud (the player HUD panel is a buff/debuff stack, and 'CANNOT CHANGE STANCE' is a stance-restriction debuff line).

### `art-anim-audio-feel/24hz-proven-on-web-build` — HELD [A3]

The 24 Hz animation clock is provable on the web v0.717 build itself, not only via the Android client or the Kongregate loader shell.

- **Cite:** `SWF header of reference/decrypted/shs3_payload_decoded.swf, decoded and parsed by me`
- **Quote:** reference/decrypted/shs3_payload_decoded.swf: sig=CWS v17 len=11,892,061 rect_px=800.0 x 690.0 framerate=24.0 frames=6
- **Lane impact:** art-anim-audio-feel: replaces the two weaker cites behind the 24 fps claim. The survey used shs3.swf (the loader shell — 2 frames, DoABC + SymbolClass, no game content) and Mobile.as:117 (Android). This one is the web payload's own header, so the clock carries no Android caveat and the PARTIAL on 24fps-keyframe-stream can be re-argued upward.

### `art-anim-audio-feel/690-is-a-friend-panel` — HELD [A2]

The 800x690 document rect is the 800x480 play area plus a conditionally-shown in-game friend panel with its own class, and the Android payload SWF's own rect is literally 800x480 — so the aspect question is settled by the payload alone, with no frame-vs-byte conflict.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:269-281; plus my SWF header parse of reference/preservation/shs3.swf, reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf`
- **Quote:** GameEngine.as:271 `var originalHeightWithBar:int = 690;` · :275 `if(newAspectRatio <= originalWithBarAspectRatio)` · :278 `originalHeight = originalHeightWithBar;` · :279 `StatsManager.stageShowingFriendBar = true;` · :281 `OverworldHUD.instance.friendpanel.init();` · headers: shs3.swf 16000x13800 twips = 800x690 fps 24.0; shs3_android_payload_decoded.swf 16000x9600 twips = 800x480 fps 24.0
- **Lane impact:** art-anim-audio-feel and ui-hud: the play area is 800x480 (confirming, not overturning, REBUILD_READINESS.md:117 and :171). Cross-lane into ui-hud and meta-social: an in-battle friend panel is a UI surface the 12-system board does not list, and it changes the letterbox geometry when the window is narrow.

### `art-anim-audio-feel/animdata-loop-and-reorder-attrs` — HELD [A2]

The animation XML carries two attributes no ledger system holds: 102 of the 487 anims are flagged looping, and 258 individual frames carry a per-frame z-order reorder flag that re-sorts the paperdoll mid-animation.

- **Cite:** `attribute census over all 19 animdata blobs in reference/extracted/bindata/; semantics from reference/decompiled/shs3_android/scripts/AnimData.as:16, FrameData.as:15-17, MCSCharacter.as:1306`
- **Quote:** anim attribute sets = {('d','i','l'): 102, ('d','i'): 385} · f attribute sets = {('i',): 5338, ('i','r'): 258} · AnimData.as:16 `this.looping = xml.@l == 1;` · FrameData.as:15-17 `if(xml.@r.toString() != "") { this.reorder = xml.@r == 1; }` · MCSCharacter.as:1306 `this.currentAnimation.frameList[this.frameCounter].reorderLayers(this);`
- **Lane impact:** art-anim-audio-feel: mid-animation part re-sorting is authored motion data that a naive renderer will get wrong (limbs will pop in front of the torso on turns). Also explains why a strict `<anim i=".." d="..">` regex undercounts to 385 — the true total is 487, and the survey's 487 is correct.

### `art-anim-audio-feel/animdata-loop-flag-parsing-trap` — HELD [A2]

The d-equals-frame-count invariant holds across ALL 19 web animdata blobs (487/487 anims, zero mismatches), but only under a robust parse: ~100 <anim> tags carry an extra attribute after d, so a strict regex silently drops them and manufactures phantom hold frames.

- **Cite:** `reference/extracted/bindata/*.bin - all 19 animdata blobs, parsed with `<anim\b([^>]*)>(.*?)</anim>` and compared against the strict `<anim i="X" d="N">` form`
- **Quote:** robust parse: total anims parsed 487, mismatches d != number-of-<f> : 0. Strict parse drops 38 of the 158 anims in 108_1t4635s0.bin (both `walk` d=20 and `light_run` d=9 are missed) and reports ~96 false mismatches such as ogre_swingdownhit d=5 vs 3 frames.
- **Lane impact:** art-anim-audio-feel: strengthens art-anim-audio-feel/24fps-keyframe-stream from a 2-blob sample to a proven universal across all 487 authored animations - the data genuinely holds no hold frames anywhere, and every latch is code-added by AnimData's duration tails. Also a standing measurement warning for any lane re-deriving animation counts or durations from the bindata XML: parse `<anim\b[^>]*>`, never `<anim i=".." d="..">`, or you lose the looping animations and invent hold frames that are not there.

### `art-anim-audio-feel/glow-is-part-of-the-vocabulary` — HELD [A3]

Timeline-authored Glow, Blur and DropShadow filters are a core part of the compositing vocabulary and ColorCode.as never builds them — 1,469 Glow filters in ImageResource alone.

- **Cite:** `same PlaceObject3 parse, filter-list decode; cross-checked against reference/decompiled/shs3_android/scripts/ColorCode.as:1-10 imports`
- **Quote:** 124_Mobile_ImageResource.bin filters={'Glow': 1469, 'Blur': 4} · 120_Mobile_BGResource.bin filters={'Blur': 29} · 115_Mobile_SHS3Resource.bin filters={'Glow': 8} · shs3_payload_decoded.swf filters={'Glow': 152, 'Blur': 41, 'DropShadow': 2} · ColorCode.as imports only BlurFilter and ColorMatrixFilter
- **Lane impact:** art-anim-audio-feel and ui-hud: corrects the survey's 'the entire compositing vocabulary is one class'. A recreation built from that sentence would omit glow entirely — and glow is visible in-frame on the yellow nameplate and the HUD text in Nr4fQstqHDM_432.0.png, and the blurred background matches BGResource's 29 Blur filters.

### `art-anim-audio-feel/gore-has-no-frame-corroboration` — STILL_UNHELD [STILL_UNHELD]

The gore system is held from bytes only: a scan of all 7,364 readable frames in reference/frames/ produced no localised blood spray - every saturated-red hit resolved to a full-screen red freeze.

- **Quote:** My red-blob scan (r>100, r-g>60, r-b>55) over all 7,364 readable files under reference/frames/: median 519 red pixels per 480x270 thumbnail, and every one of the top 60 hits (97,000-105,000 red pixels, i.e. ~75% of frame) is a full-screen redFreeze, not a spray. No candidate showing deathnohead, deathnohand, deathinhalf or a blood emitter was found.
- **Lane impact:** art-anim-audio-feel: bounds blocker 5. The 40/20/20/20 split, the behead flag and the pttl=24 droplets are solid from EnemyGoblin.as and BloodParticleEmitter.as, but the VISUAL half of the severed-limb blocker is still unopened - nobody has shown a frame of it. Compounded by the 15 fps capture rate (NF-1/NF-2): a 1.0 s spray is only ~15 sampled frames wide, so a targeted 60 fps re-extraction around a kill is the cheap way to close it.

### `art-anim-audio-feel/gore-is-humanoid-only` — HELD [A2]

The dismemberment/gore death system applies only to humanoids: 17 of the 34 Enemy*.as classes carry no DEATHNOHEAD branch at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/ - my own grep for DEATHNOHEAD across the 34 Enemy*.as files`
- **Quote:** No DEATHNOHEAD branch in: EnemyBear, EnemyBoar, EnemyCivilianFemale, EnemyClone, EnemyDeer, EnemyElite, EnemyFox, EnemyHorse, EnemyNianMonster, EnemyPlayer, EnemyPlayerGiant, EnemyStag, EnemyVegePatch, EnemyWolf, EnemyWolf2, EnemyWolfAlpha, Enemy_VegePatch (17 of 34)
- **Lane impact:** art-anim-audio-feel: bounds the gore win claimed by art-anim-audio-feel/gore-system-not-one-variant, whose cite asserts the selection rule is 'mirrored in every Enemy* class'. Every animal plus the player-clone / elite / boss-monster classes take a plain death path. A recreation wiring the 40/20/20/20 dismemberment split onto wolves, boars or clones is diverging from the original.

### `art-anim-audio-feel/gothit-is-a-ladder-not-a-constant` — HELD [A2]

The got-hit reaction is a ladder, not a constant: 12 general, 24 on a shield block, 16 after Deadly Cleave, 26 after Thousand Stabs, 24/84 in redfreeze - so a 16-frame reaction does exist in the original.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:335-339; MCSPlayer.as:1457, :1461, :1764, :1768, :3719`
- **Quote:** EnemyShield.as:335-339 `case mcs.partList[MCSCharacter.PART_prop]: gotHitFlag = true; damage = 0; gotHitCounter = 24; SoundManager.instance.playHitMetal(); return false;`  ·  MCSPlayer.as:1768 `else if(prevActionState == SKILL_DEADLYCLEAVE_STATE) { gotHitCounter = 16; }`  ·  :1764 `gotHitCounter = 26;`  ·  :1457 `gotHitCounter = 24;`  ·  :1461 `gotHitCounter = 84;`
- **Lane impact:** art-anim-audio-feel: blocks the survey's recommendation to delete the recreation's 7/12/16 tint ladder as 'an invention'. The original's reaction window is context-dependent and does contain a 16. Cross-lane into enemies-ai: EnemyShield's PART_prop branch zeroes damage and returns false - a shield is a hard block with its own 24-tick beat and its own SFX (hitmetal), not a damage reduction.

### `art-anim-audio-feel/hit-reaction-ladder-not-uniform` — HELD [A2]

gotHitCounter is not a uniform 12: there is a 12/16/24/26/84 ladder, EnemyShield sets 24 on a shield block, and 16 is in the original for the DEADLYCLEAVE recovery - so the ledger's 7/12/16f tint ladder is not a recreation invention.

- **Cite:** `grep -rhno 'gotHitCounter = [0-9]*' over reference/decompiled/shs3_android/scripts/*.as; contexts at EnemyShield.as:330-342 and MCSPlayer.as:1445-1470, :1752-1775`
- **Quote:** counts: 23x `gotHitCounter = 12`, 3x `= 0`, 2x `= 24`, 1x `= 84`, 1x `= 26`, 1x `= 16`. EnemyShield.as:335-340 `case mcs.partList[MCSCharacter.PART_prop]: gotHitFlag = true; damage = 0; gotHitCounter = 24; SoundManager.instance.playHitMetal();` · MCSPlayer.as:1457-1461 `if(mcs.animation == DOWNSTAB) { gotHitCounter = 24; } else if(this.controlledBy == 0) { gotHitCounter = 84; }` · MCSPlayer.as:1764-1768 `else if(prevActionState == SKILL_THOUSANDSTABS_STATE) { gotHitCounter = 26; } else if(prevActionState == SKILL_DEADLYCLEAVE_STATE) { gotHitCounter = 16; }`
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: do not ship 'the original's one number is 12'. Cross-lane into combat-core and skills-meters: the per-skill recovery lockouts (THOUSANDSTABS 26, DEADLYCLEAVE 16) and the 84-tick player red-freeze lock are recovery-frame numbers no ledger holds. EnemyShield.as:338 also explains what the recovered `hitmetal` SFX is for - a zero-damage shield block.

### `art-anim-audio-feel/killbeat-looks-like-red-field-black-silhouettes` — HELD [A1]

The kill beat is visually a flat saturated red field with every actor rendered as a pure black silhouette - ColorCode's makeBlack ColorTransform applied stage-wide - and no frame of it was ever opened.

- **Cite:** `reference/frames/session24/reach-A28-forest-duel/ev2_S3_wintint_hz031.png (1100x630), viewed whole at 0.87x; against reference/decompiled/shs3_android/scripts/ColorCode.as:12`
- **Quote:** Visibly in the frame: a uniform saturated red field filling the screen; both fighters, their kasa, the blade wedge and the entire grass line rendered as SOLID BLACK with no interior detail, only the small white eye/highlight shapes surviving. ColorCode.as:12 `internal static var blackColorTransform:ColorTransform = new ColorTransform(0,0,0,1,0,0,0,0);`
- **Lane impact:** art-anim-audio-feel: gives the kill-beat a visual spec, not just timings, and corroborates the no-blend-mode compositing vocabulary from the frame side (a full-alpha ColorTransform to black, not a multiply/darken blend). Note the blade wedge in THIS frame does taper to a point, unlike the one in Nr4fQstqHDM_432.0.png - the bladeslashfx silhouette varies across its 5 frames.

### `art-anim-audio-feel/no-hold-frames-verified-exhaustively` — HELD [A3]

The "no hold frames in the data" result is universal, not a spot-check: @d equals the number of <f> children for all 487 authored animations across all 19 web animdata blobs.

- **Cite:** `my parse of every <anim> block in reference/extracted/bindata/*.bin`
- **Quote:** total anim blocks parsed: 487 · anims with NO d attr: 0 · d != frame count: 0
- **Lane impact:** art-anim-audio-feel: promotes the survey's four-sample check (light_stance, light_run, walk, death) to a measured universal, which is what lets the "holds are code-injected by AnimData duration tails" model be asserted without qualification. It also means any hold frame observed on screen must come from AnimData's tail table, so that table is a hard requirement for the recreation, not an optimisation.

### `art-anim-audio-feel/pose-cadence-is-15hz-measured` — HELD [A1]

The shipped game visibly steps poses at 15 Hz, not 24: both 1080p60 longplays show unique content on exactly every 4th frame, phase-locked, so the ledger's '15fps pose latch' is frame-backed and stands while the SWF's declared 24 fps describes only the stage timeline.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 (ffprobe r_frame_rate=60/1) 150 frames from t=428s, and reference/videos/zFtCaTO0_1M.mp4 (r_frame_rate=60/1) 120 frames from t=900s; luma MAE on play-area crop [400:1000, 500:1500]`
- **Quote:** Nr4fQstqHDM mean MAE by index mod 4 = [0.061, 3.076, 0.026, 0.069]; raw deltas 0.42 5.94 0.05 0.02 0.02 5.29 0.02 0.02 0.03 4.95 0.00 0.03 0.00 3.17 ... · zFtCaTO0_1M mean MAE by index mod 4 = [0.003, 0.040, 6.438, 0.078]
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel (L-art): DEFENDS the ledger rather than overturning it, and voids the survey's proposed correction. THE FRAME WINS — stated out loud, as the standing invariant requires. Cross-lane: every tick->seconds conversion in this unit (0.5 s hit reaction, 0.83 s music fade, 1.0 s blood ttl, 6.0 s kill beat) is contingent on the clock and must ship as TICKS with the seconds labelled INFERRED.

### `art-anim-audio-feel/predecessor-swfs-hold-sfx` — PARTIAL [A3]

Two SHS3 SFX masters are byte-identical to assets in the studio's earlier WEB Flash games, both already in this repo — so they are provably not Android-only, and 30 predecessor sound assets sit entirely unsurveyed.

- **Cite:** `reference/predecessors/shs2_kon.swf (20 DefineSound) and reference/predecessors/shs1_462631_shunpo202c.swf (10 DefineSound), MD5-compared by me against the decoded reference/extracted/android/122_Mobile_SoundResource.bin`
- **Quote:** shs3 'punch' == shs2 'punch' == shs1 'punch' = cfd26c816a723ed36c45f79877924082  ·  shs3 'slash1' == shs2 'slash1' == shs1 'sword1' = da4e98632c18a175715a1e679a3d42a2  ·  shs2_kon.swf DefineSound names: deflect die1 die2 die3 hitmetal punch slash1 slash2 slash3 boom1 boom2 boom3 power_mp3 area2_mp3 area3_mp3 area4_mp3 boss_fight_mp3 cutscene4_mp3 ending_cutscene_mp3
- **Lane impact:** art-anim-audio-feel: bounds the bound. The STILL_UNHELD on web-audio parity is right that the SHS3 web payload holds no audio, but 'all audio claims here are Android v0.682' is too wide — punch and slash1 shipped unchanged in two web Flash builds. Marked PARTIAL because only 2 of 13 are byte-identical; the other seven shared names match in sample count and byte length but differ in bytes (re-encode). Also flags 7 SHS2 music tracks no lane has ever opened.

### `art-anim-audio-feel/preservation-shs3swf-is-the-loader` — HELD [A3]

reference/preservation/shs3.swf is the 164 KB, 2-frame LOADER stub, not 'the real web client'; the actual client is shs3_payload.swf and it independently reports the same framerate and rect.

- **Cite:** `my SWF header parse of reference/preservation/shs3.swf, shs3preloader.swf and the ffdec export header of the client at reference/extracted/payload.xml line 1`
- **Quote:** shs3.swf -> CWS v10, fileLength 165,252, rect 16000x13800 twips = 800.0x690.0, framerate 24.0, frameCount 2 ; shs3preloader.swf -> CWS v10, 165,305 B, same rect, framerate 24.0, frameCount 2 ; payload.xml line 1 -> `<swf ... frameCount="6" frameRate="24.0" ... version="17">` with `<displayRect type="RECT" Xmax="16000" Ymax="13800"/>`
- **Lane impact:** art-anim-audio-feel: cite hygiene only - the 24.0 fps and 800x690 conclusions are unaffected because the real client agrees, but any future claim sourcing 'the real web client SWF' should cite reference/extracted/payload.xml or reference/preservation/shs3_payload.swf, not the 2-frame stub. Also worth banking: the loader's 24 fps IS the Flash stage rate the player actually ran at, since a loaded child SWF cannot override the root's framerate.

### `art-anim-audio-feel/rig-is-19-nodes` — HELD [A2]

The character rig keys 19 nodes per pose in the stance sets (20 in the human set, 26 max in the wolf set), against 27 named PART_ constants in code — the survey's "21-node rig" matches none of these.

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin, light_stance frame 0; reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62`
- **Quote:** light_stance frame0 node ids: ['19','16','15','14','13','12','11','10','9','7','6','5','4','2','1','0','20','18','3'] COUNT = 19  ·  MCSCharacter.as: 'public static var PART_l_hand:int = 0;' ... 'public static var PART_r_knee:* = 26;' (27 constants)
- **Lane impact:** art-anim-audio-feel (L6): the skeleton spec for the recreation. A 21-joint rig will not map onto the shipped keyframe data; build 19 keyed nodes for stances, 20 for the human set, and reserve the 27-slot part table for equipment/props.

### `art-anim-audio-feel/rig-is-23-parts-27-slots` — HELD [A2]

The paperdoll rig is 23 MovieClips built at runtime over 27 named part slots, and the animdata references 25 distinct node ids — the survey's '21-node rig' matches none of these.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :120, :141; plus my <n i=> id scan over all 19 animdata blobs in reference/extracted/bindata/`
- **Quote:** MCSCharacter.as:120 `internal var partListLength:int = 22;` · :141 `for(var i:int = 0; i <= this.partListLength; i++)` · :10 `public static var PART_l_hand:int = 0;` ... :62 `public static var PART_r_knee:* = 26;` · measured distinct node ids across the 19 web blobs = 25 (0-26 minus 8 and 17); per-frame node-count histogram {9:1,16:22,17:39,18:56,19:240,20:17,25:9,26:1} — 21 never occurs
- **Lane impact:** art-anim-audio-feel and items-equipment: the paperdoll slot count is load-bearing for both the rig and the equipment-compositing contract. 23 built parts / 27 named slots is the number to code against.

### `art-anim-audio-feel/three-missed-shake-triggers` — HELD [A2]

The screen-shake trigger set is 8 call sites, not the 5 listed, and one of them takes its amplitude from data so the amplitude set is open-ended.

- **Cite:** `my grep for startShake( over reference/decompiled/shs3_android/scripts/`
- **Quote:** HeavenlySwordProjectile.as:76 `StageManager.startShake(12);` · Trap_CrusherBlockAuto.as:88 `StageManager.startShake(6);` · StatsManager.as:3535 `StageManager.startShake(val);`
- **Lane impact:** art-anim-audio-feel: completes blocker ④'s trigger catalogue. StatsManager.as:3535 passing a variable means the shake amplitude is server/data-driven in at least one path, so the recreation needs a parameterised shake API rather than a fixed enum of five events.

### `art-anim-audio-feel/three-uncatalogued-shake-triggers` — HELD [A2]

Three screen-shake call sites are missing from the survey's trigger set, including a fully data-driven one whose amplitude comes from game data.

- **Cite:** `grep for startShake over reference/decompiled/shs3_android/scripts/ — 8 call sites, not 5`
- **Quote:** HeavenlySwordProjectile.as:76 `StageManager.startShake(12);` · Trap_CrusherBlockAuto.as:88 `StageManager.startShake(6);` · StatsManager.as:3535 `StageManager.startShake(val);`
- **Lane impact:** art-anim-audio-feel: completes blocker 4's trigger catalogue. Cross-lane into skills-meters (HeavenlySword projectile shakes on impact) and world-exploration (both crusher traps shake at amplitude 6).

### `art-anim-audio-feel/videos-are-60fps-frames-do-arbitrate` — HELD [A1]

Both primary reference videos are 60 fps native, so the surveyor's premise that 'no frame can arbitrate the visible cadence' is false - and measured at 60 fps the on-screen content in BOTH longplays updates at exactly 15.0 Hz.

- **Cite:** `ffprobe on reference/videos/Nr4fQstqHDM.mp4 and reference/videos/zFtCaTO0_1M.mp4; my own ffmpeg -fps_mode passthrough extractions at t420/429/2800 (Nr4f) and t600/1200/3000 (zFt), autocorrelated frame-diff series over cols 60..1860`
- **Quote:** ffprobe: Nr4fQstqHDM.mp4 width=1920 height=1080 r_frame_rate=60/1 nb_frames=237047 duration=3950.875 ; zFtCaTO0_1M.mp4 r_frame_rate=60/1 nb_frames=251111 duration=4185.258. Autocorrelation of the 60 fps frame-diff series: Nr4f t420 ac[4]=+0.810, Nr4f t429 ac[4]=+0.800, Nr4f t2800 ac[4]=+0.577, zFt t600 ac[4]=+0.842, zFt t1200 ac[4]=+0.864, zFt t3000 ac[4]=+0.718 - peak lag 4 => 15.00 Hz in every motion window, with ac[5] NEGATIVE everywhere (no 24-in-60 signature).
- **Lane impact:** art-anim-audio-feel: this is the Lens-4 failure the lens exists to catch - a cadence question graded off a pre-baked 10 Hz still set while the 60 fps source sat on disk. Also cross-lane into combat-core, enemies-ai and skills-meters: EVERY frame-measured timing ever taken off these two videos was sampled at 15 Hz against a 24 Hz sim and is under-resolved by 37%. Any gauntlet lane that cites reference/frames/ for a duration should re-extract from the mp4 at 60 fps instead.

### `art-anim/equipment-art-was-server-streamed` — PARTIAL [A2]

All equipment art is loaded at runtime from an external shs3resource.swf (POST to getresource.php, pass=12345), because useExternalResource is hard-set true — so the roster art was never in either payload and the getDefinitionByName symbol path is dead code in shipped builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41, :80-115, :139 + StatsManager.as:360, :508; corroborated by reference/extracted/sprites/ (22 MCS part sprites out of 827)`
- **Quote:** internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];  /  public static var useExternalResource:Boolean = true;  /  StatsManager.mainTimeLine.loadingScreen.loadertext.text = "Loading art assets... ";
- **Lane impact:** L6 (art) — restates the residual blocker precisely: the only surviving copy is the CWS-obfuscated 115_Mobile_SHS3Resource.bin (zlib fails: 'unknown compression method'), so equipment art must be authored from frames, and the 22 naked defaults are the only symbols we hold.

### `combat-core/android-stance-numbers-are-a-rebalance` — HELD [A2]

Every stance-related constant moved between android v0.682 and desktop v0.717, so the android bundle must never be used as a source for combat tuning - only for structure.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3081 and :3205-3222 vs reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 and :3255-3276`
- **Quote:** android: LIGHT slash *1.5 · BALANCED *(1 + 0.5*m*0.01) · HEAVY *(0.5 + 0.5*m*0.01) · dmg LIGHT *(0.5+0.5*m*0.01) · HEAVY *1.5 · crit *1.2 (or *1.5 light) || desktop: LIGHT slash *1.4 · BALANCED *(1 + 0.2*m*0.1) · HEAVY *(0.5 + 0.4*m*0.1) · dmg LIGHT *(0.5+0.4*m*0.1) · HEAVY *1.4 · crit *1.3 flat
- **Overturns:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** All lanes: S0-3's parity caveat is now quantified for combat. Structure (which stances exist, which fields feed which formula, the shape of every expression) is identical across builds and is safe to port from android where the desktop is obfuscated; every NUMBER inside those expressions moved. Contrast with the values that did NOT move - getBaseSlashLengthVal, the SP formula, the element counter wheel and the +10/+20 element grant are character-for-character identical in both bundles, which is exactly why those claims are safe.

### `combat-core/basereload-is-dead-code` — HELD [A2]

getBaseReload() = 48 + SPD*6 is a write-only dead field in the android build: it is stored into MCSPlayer.baseReload and never read anywhere, so meter refill is SPD-independent and 48+SPD*6 must not be built as a refill rate.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105 and :190 (assignments only); exhaustive grep `grep -rni basereload reference/decompiled/shs3_android/scripts/ | grep -v "var baseReload\|this.baseReload = \|baseReload:int"` returns no rows`
- **Quote:** internal var baseReload:int = 48;   ///   this.baseReload = baseReload;   ///   [no read site anywhere in 2,700+ classes]
- **Lane impact:** L5 — delete '48 + SPD*6 refill' from the Focus economy. The meter fills at a flat +1 per frame regardless of SPD (MCSPlayer.as:1160 / web §1t99s0§.as:1205). SPD affects reach (getBaseSlashLength) and skill cooldowns, not Focus.

### `combat-core/basereload-is-dead-code` — HELD [A2]

getBaseReload() = 48 + (SPD + bonus) * 6 is computed, passed into initPlayer and stored, but never read in any expression in either build — the crit meter refills at a flat +1 per frame and SPD does not affect it.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105, :182, :190 and EnemyClone.as:49 — the only four occurrences of `baseReload` across all 553 files`
- **Quote:** MCSPlayer.as:105 `internal var baseReload:int = 48;` · :190 `this.baseReload = baseReload;` · EnemyClone.as:49 `this.baseReload = owner.baseReload;` — and nothing else. Meanwhile MCSPlayer.as:239 `this.maxreload = 5 * 24;` is set two lines later, unconditionally, and :1160 is a bare `++this.reload;`.
- **Lane impact:** L5 + L2 — delete 'refill 48 + SPD*6' from the crit-meter economy before anyone builds it. The reload meter has exactly three inputs: a fixed maxreload, +1/frame, and the weapon's slashUsage (floored at 48) scaled per stance. SPD's real combat levers are reach base and skill cooldown (1 - speed/300 * 0.5), not the crit meter.

### `combat-core/cannot-change-stance-not-in-android-strings` — HELD [A1]

'CANNOT CHANGE STANCE' — printed on the web build's reload bar — has no counterpart anywhere in the android build's 2,533-entry string table, a third hard android-v0.682 ≠ web-v0.717 divergence.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png crop (0,900)-(640,1080) NEAREST x3 and reference/frames/session11/damage-ttk/t1961.900.png crop (100,940)-(620,1080) LANCZOS x3; cross-checked against docs/gauntlet/L0/index/strings.json`
- **Quote:** Both crops legibly read 'CANNOT CHANGE STANCE' over the third bar. Exhaustive value search of strings.json: entries containing 'annot' AND 'stance' = []; entries starting 'Cannot' = []. The nearest entries are 208 'Change Stance' (the android's BattleUI.as:114 changestancelabel) and 125 'Stance Restriction'.
- **Lane impact:** L8 + L5 — strengthens combat-core/build-version-parity from one divergence to three, and warns that porting android UI copy verbatim will produce strings the shipped game never showed. Label every ported string CONTRACT-SRC-v0.682.

### `combat-core/crit-is-full-reload-1p3` — HELD [A2]

The crit condition in the shipped v0.717 client is a full reload bar, and the multiplier is 1.3 with piercing damage added flat afterwards.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (android twin at MCSPlayer.as:3215ff)`
- **Quote:** 3272: if(this.§1t4414s0§ == this.§1t4415s0§)
3273: {
3274:    return _loc2_ * 1.3 + this.§1t1243s0§;
3275: }
3276: return _loc2_;
- **Overturns:** "③ §3 corrections (hold-run, crit 1.3, mastery-9, Chi-10)"
- **Lane impact:** L-combat-core / L-skills-meters: independently confirms the 1.3 crit from the shipped client rather than the forum, and pins the trigger - reload == maxreload, i.e. a fully recharged slash, not a random roll and not a Critical meter.

### `combat-core/desktop-stance-multipliers` — HELD [A2]

The v0.717 desktop stance slash-length multipliers ARE recoverable and differ from android: Light x1.4, Balanced x(1+0.02*mastery), Heavy x(0.5+0.04*mastery) with the same 100 px floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, 3105, 3116, 3131, 3142`
- **Quote:** 3094:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
- **Overturns:** "n/a — this overturns the surveyor's claim rebirth/stance-slash-multipliers-parity, not a ledger sentence"
- **Lane impact:** combat-core: the reach model should take the DESKTOP values (Light x1.4, not x1.5), per the same 'desktop value wins' precedent claim 7 establishes. Method note for every lane: the desktop tree is obfuscated, so a literal grep for identifier-bearing expressions can NEVER establish absence — only numeric literals survive renaming. Locate the class positionally instead (§1t99s0§.as is MCSPlayer: it defines both §1t4443s0§ initPlayer and §1t4446s0§ initElementDefenseStats).

### `combat-core/duel-path-damage-terms-unsurveyed` — HELD [A2]

The lane surveyed the MOB damage path (NPC.gotHit) and missed the fighter-vs-fighter path that DuelScene actually models — which on v0.717 beheads at ×1.3 BEFORE defence subtraction and applies a stance triangle ×1.2 (losing) / ×0.9 (winning) that no claim in the lane mentions.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4904s0§.as:405-429 (v0.717); android counterpart reference/decompiled/shs3_android/scripts/MCSPlayer.as:3694-3717`
- **Quote:** v0.717 §1t4904s0§.as:409-429 — `case mcs.partList[hat]: case [head]: case [neck]: _loc3_ *= 1.3; behead = true; ... if(stance==LIGHT && atk==BALANCED || stance==BALANCED && atk==HEAVY || stance==HEAVY && atk==LIGHT) { _loc3_ *= 1.2; } else if(stance==LIGHT && atk==HEAVY || stance==BALANCED && atk==LIGHT || stance==HEAVY && atk==BALANCED) { _loc3_ *= 0.9; } _loc3_ -= getDefense();` · android MCSPlayer.as:3701-3716 has ONLY the *= 1.2 branch, no *= 0.9, and applies behead *= 1.5 AFTER the min-floor.
- **Lane impact:** L5 + L4 — three damage terms with no home in any lane claim or in src/config: the ×1.2/×0.9 stance-triangle multipliers (which are also the real source of the forum's '~20% counter bonus'), and a behead multiplier that is ×1.3-before-defence on the target build, not ×1.5-after-floor. Ordering matters: behead-before-subtraction and behead-after-floor give different numbers on the same hit.

### `combat-core/every-checked-combat-number-moved-between-builds` — HELD [A2]

The android v0.682 bundle and the desktop v0.717 bundle disagree on every combat-tuning number checked so far, so android-only combat values must be treated as INFERRED until the desktop line is located.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094/3105/3116/3131/3162/3262/3265/3270/3274 and §1t1523s0§.as:2644-2652 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3030/3041/3052/3067/3098-3104/3205/3208/3213/3215-3221 and StatsManager.as:2201-2207`
- **Quote:** rebirth payout 5/20 (android) vs 25/100 (desktop) · Light+Reversed reach x1.5 vs x1.4 · mastery scaling *0.01 vs *0.1 (coefficients 0.5/0.5 vs 0.4/0.2) · Heavy stance damage x1.5 vs x1.4 · full-reload crit x1.2 non-Light / x1.5 Light vs flat x1.3 · stance-change reload penalty maxreload/3 then -maxreload/6 vs a flat -48
- **Overturns:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** All lanes sourcing android AS3. The Stage-0b caveat is stronger than 'one in six numbers moved' - six for six moved in the combat block. The desktop file to check first is reference/decompiled/shs3_payload/scripts/§1t99s0§.as (MCSPlayer) and §1t1523s0§.as (StatsManager); both are present and complete, so 'android-only' is almost never the true state of a combat number.

### `combat-core/focus-6s-is-the-source-not-a-parity-break` — HELD [A2]

There is no crit-meter parity break: v0.717's meter is 8×24 = 192 raw units rendered as (x−48)/144, so the visible fill is 144 frames = exactly 6.000 s at 24 fps — which is the frame-measured value, to 0.5%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (`= 8 * 24`) and :1203-1208 (`if(reload < maxreload) { ++reload; … updateReload(reload, maxreload) }`); measured counterpart COMBAT_MEASUREMENTS.md f-9 (6.00 s, 3× 60 fps regressions) and src/config/combat.ts:82-101`
- **Quote:** §1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;   ///   f-9: 'empty → full 6.00 s … agreeing to 0.5 % (6.01 / 6.00 / 5.98)'   ///   combat.ts: FOCUS_MAX = 192 · FOCUS_DISPLAY_OFFSET = 48 · FOCUS_DISPLAY_SPAN = 144
- **Lane impact:** L5 — kills the survey's score-capping caveat (a) as stated and kills its 5.8 s recommendation. Build 6.00 s, which is already in config. The android's 5×24 with a 24-frame hidden offset is the v0.682 retune; quoting it as the prediction is what manufactured the 4.00 s 'discrepancy'.

### `combat-core/focus-fill-remeasured-on-frames` — HELD [A1]

Re-measuring the crit/Focus meter with the track calibrated on the full Chi bar gives 16.9 %/s ⇒ 5.92 s empty→full, which agrees with the repo's existing 5.97 s measurement and the v0.717 source's exact 6.000 s — there is no frame-vs-doc conflict to adjudicate.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png (track calibration: full Chi bar 31/31 spans x=245..513, rows y=1004-1016) and t1004.800/t1005.000/t1081.100/t1082.100/t1082.900.png (fill edge scanned at y=1036)`
- **Quote:** Fill right edge, own scan at y=1036: t1081.100 x=259 · t1082.100 x=304 · t1082.900 x=340 · t1004.800 x=282 · t1005.000 x=291. Deltas: 45 px/s (259→304 over 1.0 s), 45.6 px/s (304→340.5 over 0.8 s), 45 px/s (282→291 over 0.2 s). Track from the full Chi bar = x 245..513; empty reload track's flat (45,30,0) run ends x=511/512. 45 px/s ÷ 267 px = 16.9 %/s ⇒ 5.92 s.
- **Lane impact:** L5 — build FOCUS_MAX 192 with display span 144 at 24 units/s (6.000 s visible), exactly as src/config/combat.ts already does. Do not adopt the survey's 5.8 s; it is a 2 % track-width artifact, and the invariant 'when a measurement doc and a frame disagree the frame wins' does not apply here because they do not disagree.

### `combat-core/footage-runs-at-nominal-24fps` — HELD [A1]

The longplay footage carries a hard 15 Hz content cadence but the GAME inside it ticks at its nominal 24 fps, so wall-clock timings read off these frames are valid — and the crit-bar fill measures 140.6 ticks against the web source's 144, i.e. frame and source AGREE.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 @1084.3333-1085.9333 s and @1089.2667-1090.0667 s, 60 fps burst; crit-bar row y=1034, track x in [246,513]; subpixel white-fill edge`
- **Quote:** Whole-frame mean-abs-diff spikes only every 4th video frame (1080.2000, 1080.2667, 1080.3333 ...) = 15 Hz content floor. Subpixel fill steps are bimodal at ~1.9 px and ~3.8 px = 1-or-2 ticks per sample: 37 ticks / 24 samples (1.60 s) plus 20 ticks / 12 samples (0.80 s) = 57 ticks / 2.40 s = 23.75 ticks/s. Quantum 1.899 px -> 267 px track / 1.899 = 140.6 displayed ticks vs source 144 (2.4%). Byte-check: reference/decrypted/shs3_payload_decoded.swf SWF header frameRate = 24.000, stage rect 0..16000 x 0..13800 twips.
- **Lane impact:** L5 + every lane that measures timing off these videos — the 15 Hz cadence is a CAPTURE floor, not a slow game, so tick counts can be recovered from wall-clock at 24 fps; but no event shorter than 66.7 ms can be resolved.

### `combat-core/generic-post-defense-damage-floor` — HELD [A2]

The real post-defense damage floor is a four-band ladder on the ATTACKER's level — 1 / lvl/8 / lvl/6 / lvl/4, each plus piercingDamage — applied on every hit in the generic pipeline, not only in boss scaling.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-172; applied at MCSPlayer.as:3415-3418 (and :3710, EnemyWolf.as:384, EnemyShield.as:347, EnemyNianMonster.as:383, EnemyClone.as:222/443, EnemyJiangSi.as:304)`
- **Quote:** if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; } if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; } if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; } return this.attackerlvl / 4 + this.piercingDamage;   /   damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — the ledger's Ready bullet is CORRECT and should be extended to four bands + piercing, not replaced by the boss-only rule the survey proposed.

### `combat-core/heavy-launch-unlock-is-3-on-target-build` — HELD [A2]

The mastery ladder is identical in v0.717, so src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy = 5 is wrong on the target build, not just on the android one — this is the survey's single clean, shippable config fix.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3221-3244 (and :3245-3252 for Reversed/Dual); vs src/config/stances.ts LAUNCH_UNLOCK_LEVEL`
- **Quote:** 3221-3227 light: §1t4425s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4429s0§ = m >= 5;  ·  3229-3235 balanced: §1t4427s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4425s0§ = m >= 5;  ·  3237-3243 heavy: §1t4425s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4426s0§ = m >= 5;  ·  3245-3252 reversed/dual: all five = true.
- **Lane impact:** L5 + L2 — ship `heavy: 3`. Same-slot permutation across both builds means this one is safe to land without a further v0.717 re-read. Reversed and Dual granting all five abilities unconditionally still has no slot in the three-stance model.

### `combat-core/hud-track-is-269px` — HELD [A1]

The HUD bar track is 269 px at 1080p (x = 245…513), not the 263 px the survey calibrated against — measurable directly off the FULL Chi bar in the survey's own frame.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — blue-channel scan of rows 1008 and 1010 (Chi reads 31/31, i.e. a full bar), plus HP cross-check on row 980`
- **Quote:** Chi (31/31, full) blue span = x 245…513 → width 269 px, identical on both rows. HP green edge at x=433 → (433−245)/269 = 69.9 % against a displayed 14/20 = 70.0 %. COMBAT_MEASUREMENTS f-4 says 268 px, f-8 says 269–270 px.
- **Lane impact:** L8 + L5 — any future percentage read off this bar must use 269, not 263. The 6 px error is 2.3 % and is most of the gap between the survey's 5.8 s and the banked 6.00 s.

### `combat-core/mastery-domain-unresolved` — STILL_UNHELD [STILL_UNHELD]

Whether stance mastery runs 0-10 or 0-100 is UNRESOLVED and it silently scales both the reach and damage tables — on the 0-10 reading the heavy reach mastery term can never do anything, because its maximum (×0.55) stays permanently under its own 100-unit floor.

- **Lane impact:** L5 — blocks promoting the 0.005-per-mastery terms in reach.ts/damage to CONTRACT at any domain. Close-path: measure a balanced-stance stroke at lvl 1 (stance-reach/A_t121.667, 239 px ⇒ 106 world at 2.25 px/unit) against a late-game balanced stroke at known SPD; the two readings pin the coefficient's domain directly, since the domain is the only free variable left in the formula.

### `combat-core/mastery-is-single-digit` — HELD [A2]

Stance mastery is a single-digit integer scale in BOTH builds, not a 0-100 percentage — ability unlocks gate at mastery >= 3 / >= 4 / >= 5.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3166-3168, 3174-3176, 3182-3184 + reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3231-3233, 3239-3241`
- **Quote:** MCSPlayer.as:3166  this.canLaunch = this.lightMastery >= 3;
MCSPlayer.as:3167  this.canDeflect = this.lightMastery >= 4;
MCSPlayer.as:3168  this.canAirCombo = this.lightMastery >= 5;
- **Overturns:** "n/a — this refutes the surveyor's lane_impact sub-claim that 'mastery is a 0-100 percentage here, not 0-9'"
- **Lane impact:** combat-core: a 0-100 scale would put every ability unlock inside the first 5% of the track, which is absurd. The ledger's 'mastery-9' SCALE reading is right even though its 'mastery-9 ceiling' reading of the reach table is wrong. The 0-100 inference came from reading '* 0.01' in isolation without checking any consumer of the variable.

### `combat-core/mastery-is-small-integer` — HELD [A2]

Stance mastery is a small integer (roughly 0-10), not a 0-100 percentage: abilities are gated at mastery >= 3 / 4 / 5, and substituting mastery=10 into the v0.717 damage switch reproduces the ledger's stance damage table 0.9 / 1.2 / 1.4 exactly.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 + reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3166-3184 and StatsManager.as:1834`
- **Quote:** 3262: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);   // LIGHT    -> 0.9 at mastery 10
3265: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);       // BALANCED -> 1.2 at mastery 10
3270: _loc2_ = _loc1_ * 1.4;                                     // HEAVY/DUAL/REVERSED
---
MCSPlayer.as:3174: this.canFlipUp = this.balancedMastery >= 3;
MCSPlayer.as:3175: this.canDeflect = this.balancedMastery >= 4;
MCSPlayer.as:3176: this.canLaunch = this.balancedMastery >= 5;
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: CONFIRMS the ledger's mastery-ceiling reading for the damage table and refutes the rebirth lane's counter-assertion that mastery is a 0-100 percentage. Also gives the recreation the ability-unlock ladder for free: light 3/4/5 = launch/deflect/air-combo, balanced 3/4/5 = flip-up/deflect/launch, heavy 3/4/5 = launch/deflect/stab; reversed and dual grant all five unconditionally (MCSPlayer.as:3188-3195).

### `combat-core/parity-confirmed-set` — HELD [A2]

Ten combat facts are byte-identical between android v0.682 and web v0.717 and can be promoted straight to plain CONTRACT with no parity caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347 · §1t99s0§.as:9,:11,:15-19,:2377,:2548,:3223-3241,:3286-3288 · §1t1541s0§.as:51 · §1t1543s0§.as:1486 · §1t67s0§.as:197-209`
- **Quote:** return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));   ///   standingRange:int = 50; jumpThreshhold:int = 100; lightSlashSpeed:int = 50; balancedSlashSpeed:int = 40; heavySlashSpeed:int = 30;   ///   maxDistance:int = 200;   ///   if(_loc12_ * _loc12_ < 40000 && ...)   ///   if(_loc8_ * _loc8_ < 625)   ///   if(this.attackerlvl <= 10) ... / 8 + ... / 6 + ... / 4 +   ///   this.§1t4425s0§ = this.§1t4421s0§ >= 3;   ///   return defense * 0.8;
- **Lane impact:** L5 — promote to CONTRACT: reach base formula 120+floor((90+5*dan)*SPD/(20+SPD)); arc-length budget with maxDistance 200; multi-target |dx|<200 pre-filter; tap dead-zone 25 units; standingRange 50; slashSpeed 50/40/30; jumpThreshhold 100; mastery unlock ladder 3/4/5 (heavy launch = 3); four-band damage floor; heavy defence x0.8. The lane's real, safe yield.

### `combat-core/parity-established-for-ten-quantities` — HELD [A2]

Ten combat quantities the survey flagged as android-only are byte-identical in the shipped web build, so they can be labelled CONTRACT rather than CONTRACT-SRC-v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19, :3221-3251, :3283-3289; §1t1541s0§.as:52-60; §1t67s0§.as:199-209; §1t68s0§.as:465-483; §1t122s0§.as:771-774`
- **Quote:** §1t99s0§.as:9-19 standingRange 50 / jumpThreshhold 100 / runSpeed 12 / lightSlashSpeed 50 / balancedSlashSpeed 40 / heavySlashSpeed 30  ·  §1t99s0§.as:3288 `return defense * 0.8;`  ·  §1t99s0§.as:3238 `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` (heavy canLaunch at mastery 3)  ·  §1t1541s0§.as:52-60 maxDistance 200 / 4 / 400 / thickness 8 / 20  ·  §1t67s0§.as:203-209 `attackerlvl / 8`, `/ 6`, `/ 4`  ·  §1t68s0§.as:467 `_loc3_ -= this.defense;` :483 `this.§1t3246s0§ = 12;`  ·  §1t122s0§.as:771-774 `_loc3_ = 48 + param1.speed * 6;` ... `120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_))`
- **Lane impact:** L5 — promotes to CONTRACT: the reach base formula, reload refill 48+SPD·6, standingRange 50, slashSpeed 50/40/30, jumpThreshhold 100, the whole InputManager gesture/arc-length constant set, the 12-frame i-frame window, the four-band defence floor table, heavy defence ×0.8, and the 3/4/5 mastery ability ladder (heavy launch at 3). src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy 5 -> 3 is the one config edit from this unit that is safe to make.

### `combat-core/payload-swf-framerate-24` — HELD [A2]

The web payload SWF's own header declares 24.0 fps, so the tick→second conversion for every v0.717 frame-counted constant is first-party and no longer borrowed from the android Mobile.as.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — SWF header (signature CWS, version 17, RECT, then the 8.8-fixed FrameRate field)`
- **Quote:** ('CWS', 17, 24.0, 6, 6880328) — parsed signature, version, frameRate, frameCount, file bytes
- **Lane impact:** L5 + L6 — every ticks-based constant (i-frames gotHitCounter=12 → 0.5 s, reload 192 → 8.0 s raw / 6.0 s displayed, doReload jitter) now converts to seconds from a web-build artifact.

### `combat-core/player-unlocks-are-skills-not-mastery` — HELD [A2]

For the PLAYER (controlledBy 0 or 2) launch/deflect/stab/flip-up/air-combo are gated on owning specific skills (1014/1015/1036 light, 1016/1017/1037 balanced, 1018/1019/1038 heavy), never on mastery level; the >=3/>=4/>=5 mastery ladder is the enemy branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3126-3161 (and identically reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3186-3212)`
- **Quote:** if(this.controlledBy == 0 || this.controlledBy == 2) { if(this.stance == LIGHT_STANCE) { this.canLaunch = this.getSkillLevel(1014) > 0; this.canDeflect = this.getSkillLevel(1036) > 0; this.canAirCombo = this.getSkillLevel(1015) > 0; ... } else if(HEAVY) { this.canStab = this.getSkillLevel(1018) > 0; this.canDeflect = this.getSkillLevel(1038) > 0; this.canLaunch = this.getSkillLevel(1019) > 0; } } else if(this.stance == LIGHT_STANCE) { this.canLaunch = this.lightMastery >= 3; ...
- **Lane impact:** L5 + L2 + L3 — src/config/stances.ts LAUNCH_UNLOCK_LEVEL is the wrong SHAPE, not merely wrong for heavy. Replace it with a skill-ownership predicate over skilldata ids 1014-1019 and 1036-1038 (names/descs already resolvable via docs/gauntlet/L0/index/strings.json), and keep the mastery ladder only for the enemy-AI side in L4.

### `combat-core/reversed-and-dual-reach` — HELD [A2]

Reversed and Dual stances have their own reach multipliers the three-stance model has no slot for: Dual = base x1.4, Reversed = base x1.0, both hard-floored at 100.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3130-3152`
- **Quote:** case §1t12224s0§ (DUAL): this.§1t4417s0§ = this.§1t4420s0§ * 1.4;   ///   case §1t12223s0§ (REVERSED): this.§1t4417s0§ = this.§1t4420s0§; if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
- **Lane impact:** L5 + L2 — combined with the unconditional ability grants for Reversed/Dual, these two stances are a complete fourth and fifth kit; the reach floor of 100 applies to Reversed as well as Heavy.

### `combat-core/sim-dash-hz-unit-bug` — HELD [A2]

src/core/Sim.ts converts the source's per-frame dash speed with FIXED_HZ = 60 although the original runs at 24 fps, so the sim dashes at 3000/2400/1800 px/s instead of 1200/960/720 — 2.5× too fast.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile.as:117 (frame rate) + MCSPlayer.as:15-19 (50/40/30) → applied at src/core/Sim.ts:670 with FIXED_HZ=60 from src/config/timing.ts:8`
- **Quote:** Mobile.as:117 `GameEngine.getStageMC().frameRate = 24;` · MCSPlayer.as:15-19 `lightSlashSpeed:int = 50 / balancedSlashSpeed:int = 40 / heavySlashSpeed:int = 30` · src/config/combat-sim.ts:77 `/** CONTRACT-SRC — dash travel per 60 Hz frame, in WORLD px, by stance. */` · src/core/Sim.ts:670 `speedPxS: DASH_SPEED_PX_PER_FRAME[player.stance] * FIXED_HZ,`
- **Lane impact:** L5 — a live, shipped 2.5× error in dash travel speed, sitting inside the exact constants combat-core/pass-through-dash quoted without checking the unit. The rest of the config already bridges 24→60 correctly (combat.ts:83-91 names FOCUS_FILL_PER_S = 24 and FOCUS_ACC 2/5 = 24/60); the dash is the one constant that skipped the conversion. Fix: DASH_SPEED_PX_PER_FRAME × 24, or relabel as px/s = {1200,960,720}.

### `combat-core/stance-change-costs-48-meter` — HELD [A2]

Changing stance costs a flat 48 off the slash meter in v0.717, and only in battle - a cost that appears in no ledger system.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3160-3171`
- **Quote:** if(§1t1525s0§.§1t9948s0§()) { this.§1t4414s0§ -= 48; if(this.§1t4414s0§ < 0) { this.§1t4414s0§ = 0; }
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** combat-core: stance switching is not free. Combined with the crit rule above, switching stance while at full meter throws away the crit - a real tactical constraint the current model has no representation for.

### `combat-core/stance-label-is-a-frame-clock` — HELD [A1]

The 'CANNOT CHANGE STANCE' overlay is an on-frame readout of the reload gate: absent at 4.2%, 12.5%, 21.3%, 35.0% and 46.4% fill, and back the instant a slash lands — t1082.900 shows 35% with no label, t1083.100 (0.200 s later) shows an empty bar with the label on.

- **Cite:** `reference/frames/session11/crit-focus/{t1081.100,t1004.800,t1082.100,t1082.900,t1083.100,t3779.000}.png — crop (230,1015)-(530,1050) upscaled 4x NEAREST, six-tile contact sheet`
- **Quote:** Visible in the crop, top to bottom: sliver fill / no label; ~21% fill / no label; ~35% fill / no label; EMPTY bar with 'CANNOT CHANGE STANCE' printed across it; ~12.5% fill / no label; ~46% fill / no label.
- **Lane impact:** L5 + L8 — a free, reusable frame-side probe of the reload meter: the label boundary pins the gate to the SAME constant as the display offset (48), which is the web rule, not android's maxreload/6 = 20. Future build-parity questions about the meter can be settled from this overlay alone.

### `combat-core/stance-triangle-damage-magnitudes` — HELD [A2]

The stance counter-triangle is a damage multiplier in code, not just tutorial copy: the victim takes x1.2 when the attacker's stance beats theirs, and the web build additionally applies x0.9 when the attacker's stance loses.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3799 (web); reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3704 (android, x1.2 only)`
- **Quote:** if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§ || this.stance == §1t12221s0§ && _loc11_ == §1t12222s0§ || this.stance == §1t12222s0§ && _loc11_ == §1t12220s0§) { _loc5_ *= 1.2; ... } else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || this.stance == §1t12221s0§ && _loc11_ == §1t12220s0§ || this.stance == §1t12222s0§ && _loc11_ == §1t12221s0§) { _loc5_ *= 0.9; }
- **Lane impact:** L5 + L4 — STANCE_BEATS gets its magnitudes (+20% favourable, -10% unfavourable, applied BEFORE defence subtraction and before the behead x1.5); the x0.9 branch is web-only and must not be dropped when porting from the android read.

### `combat-core/stance-triangle-is-1p2` — HELD [A2]

The stance rock-paper-scissors multiplier is x1.2, not x1.5, and a stance-advantage hit also recolours the damage popup to white.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3699-3706`
- **Quote:** `if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE) { damage *= 1.2; if(this.controlledBy != 0) { damagetextcol = 16777215; } }`
- **Lane impact:** combat-core: the damage pipeline in one order — stance triangle x1.2, then subtract defense, then clamp to damageObj.getMinDamage(), then behead x1.5, then add the four elemental damages. Three distinct multipliers exist (stance 1.2, behead 1.5, BUFF_ATTACK 150%) and the ledger conflates none of them because it holds none of them.

### `combat-core/stroke-render-frame-confirmed` — HELD [A1]

The drawn-stroke render is settled on frames, not just in code: thickness 8 world units (measured 18 screen px), colour 0x990000 (measured modal (150,0,0)), tapering from the START of the stroke to a point at the end — which also pins the world→screen scale at 2.25 px/unit and so confirms the 800×480 world.

- **Cite:** `reference/frames/session11/stance-reach/B_t862.600_HEAVY_bold-bright-red-head-only.png and B_t862.667_HEAVY_thin-dark-tail-plus-bold-head.png, both crop (400,690)-(1020,820) LANCZOS x3`
- **Quote:** t862.600 shows one BOLD red segment over the enemy (≈x 840-940) and no tail; t862.667, 67 ms later at the identical crop, shows that same bold segment PLUS a thin red line now extending left across the whole crop. Red-pixel column heights along the stroke: x=460 2px, x=540 5px, x=780 4px, x=900 13px, x=940 18px. Modal stroke colour (150,0,0); 10027008 = 0x990000 = (153,0,0). 18 px ÷ 8 world units = 2.25 px/unit = 1080/480.
- **Lane impact:** L5 + L8 — the stroke renderer can be built and gated today with no remaining unknowns, and any reach number expressed in screen px converts at exactly 2.25. Also re-classes combat-core/reach-is-arclength from A2 to A2+A1.

### `combat-core/two-builds-differ-in-stage-height` — HELD [A2]

Both SWF headers run at 24.000 fps, but the web payload declares an 800x690 stage against the android build's 800x480 — the 800x480 world space the reach unit lives in is established by StatsManager (stageWidth 800 / stageHeight 480) and confirmed on-frame by the 5:3 game viewport, not by the SWF header.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf (CWS v17, framerate 24.0, stage 800.0x690.0) and reference/decrypted/shs3_android_payload_decoded.swf (CWS v26, framerate 24.0, stage 800.0x480.0); world space at reference/decompiled/shs3_android/scripts/StatsManager.as:80-82`
- **Quote:** StatsManager.as:80 `public static var stageWidth:int = 800;` · :82 `public static var stageHeight:int = 480;` — and the frame: the game viewport in reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png measures x=52..1867 (1816 px) at 1080 px tall = 5:3, i.e. 2.27 screen px per world unit.
- **Lane impact:** L5 + L8 + L6 — gives the px<->world-unit scale (2.26-2.27) needed to grade ANY reach/stroke/hitbox measurement off the 1080p longplays, and warns that the 690 in the web SWF header is chrome, not playfield. My own stroke measurement on that frame (416->971 = 555 px = 245 world units) is the first reach figure in the lane with a stated scale.

### `combat-core/v0717-stance-multipliers` — HELD [A2]

The v0.717 per-stance slash-length multipliers ARE recoverable and differ from android on every constant; with mastery capped at 10 their ceilings are Light 1.4 / Balanced 1.2 / Heavy 0.9, which vindicates the ledger's 0.9/1.2/1.4 line as REACH-at-mastery-ceiling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3117, :3130, :3141 + reference/extracted/skilldata.xml skills 1000/1001/1002 (10 <level> rows each) + reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1834`
- **Quote:** 3094 LIGHT    this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105 BALANCED this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116 HEAVY    this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117          if(this.§1t4417s0§ < 100) { ... = 100; }
3130 REVERSED this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3141 DUAL     this.§1t4417s0§ = this.§1t4420s0§;   floor 100
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** combat-core: use the v0.717 constants, not the android ones (android is 1.5 / (1+0.5·m·0.01) / (0.5+0.5·m·0.01)). Mastery is skill level 1..10, NOT a 0-100 percentage. Combined with combat-core/dan-scaled-slash-length this makes reach fully closed in stage px: Light 1.4×(120+90·s/(20+s)) etc., Heavy floored at 100 px. Also note there are FIVE stances (Reversed ×1.4, Dual ×1.0) - the unit only listed three.

### `combat-core/web-crit-is-flat-1.3` — HELD [A2]

Ledger blocker (2) resolves to 1.3: in v0.717 a full-meter slash multiplies damage by a flat 1.3 in EVERY stance and adds the STAT_CRITICALDMG gear term — there is no light/non-light split.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3274`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; } return _loc2_;
- **Overturns:** "(2) crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — crit = 1.3x + flat gear term, applied after the stance damage curve, gated on a full meter. The x3 candidate is dead. src/config/combat.ts's 1.3 coefficient was right; only its application to the legacy 1.17/1.56/1.82 dmgMults needs replacing with the mastery curves.

### `combat-core/web-focus-economy` — HELD [A2]

The v0.717 Focus/crit meter is 192 points (8x24) filling +1/frame, displayed as (reload-48)/(maxreload-48) so the first 48 points are invisible — giving exactly 144 visible frames = 6.000 s, which matches the frame measurement of ~5.8-5.97 s and leaves no doc-vs-frame conflict.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :1205; display mapping reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328`
- **Quote:** this.§1t4415s0§ = 8 * 24;   ///   if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§; ... }   ///   var _loc3_:Number = (param1 - 48) / (param2 - 48);
- **Overturns:** "(5) Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — build focusMax 192, hidden offset 48, visible span 144 frames = 6.000 s at 24fps. Use 6.000 s CONTRACT-SRC, not the 5.8 s frame estimate. This also independently reconfirms docs/research/fidelity/SOURCE_CONSTANTS.md §3.2, which the survey overwrote with android numbers.

### `combat-core/web-only-1.3-state-multiplier` — PARTIAL [A2]

The web build has a fifth damage term with no android counterpart: a boolean character-state flag that multiplies incoming damage by 1.3 after the min-damage floor.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3804-3807; flag declared at §1t67s0§.as:52 and §1t68s0§.as:62`
- **Quote:** _loc5_ -= this.§1t4477s0§(); if(_loc5_ < param2.§1t1088s0§()) { _loc5_ = param2.§1t1088s0§(); } if(§1t1071s0§) { _loc5_ *= 1.3; }
- **Lane impact:** L5 — a state-gated +30% damage-taken multiplier exists in the shipped build and no ledger system records it. The boolean itself is not yet identified (set/cleared across EnemyClone/EnemyPlayer/boss classes; a downed-or-launched juggle state is the likely reading). Flagged as a LEAD, not a closed constant.

### `combat-core/web-payload-as3-is-readable` — HELD [A2]

The web v0.717 payload is fully decompiled and readable in this repo — 1,079 .as files with renamed identifiers but every numeric literal and control-flow structure intact — so the whole lane can and must be re-read against the build actually being recreated.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ — 1,079 .as files; worked example §1t1523s0§.as:2346-2347`
- **Quote:** internal static function §1t9593s0§(param1:int) : int { var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1))); }
- **Lane impact:** L5 + every lane that deferred to 'the web AS3 is obfuscated' — the android-vs-web caveat stops being a blanket blocker and becomes a per-constant diff that can be run today.

### `combat-core/web-payload-is-cross-readable` — HELD [A2]

The web v0.717 AS3 is fully cross-readable — 1,079 decompiled .as files with obfuscated names but plain bodies — so the build-parity question the survey filed as STILL_UNHELD is answerable in minutes by numeric-literal grep, and was already answered in-repo three weeks ago.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (1,079 .as files); §1t1523s0§.as:36 = 0.717; reference/decompiled/shs3_android/scripts/StatsManager.as:30 = 0.682; docs/research/fidelity/SOURCE_CONSTANTS.md (515 lines, 2026-07-25)`
- **Quote:** §1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;   ///   StatsManager.as:30  public static var clientVersion:Number = 0.682;   ///   DIVERGENCES.md: 'BUILD IDENTIFIED: v0.717 … The android payload is 0.682 — an earlier build despite a newer SWF container; its four data tables are therefore tagged CONTRACT-SRC (0.682) and must never be quoted as 0.717.'
- **Lane impact:** L5 + every other lane citing shs3_android — the correct protocol is: read v0.682 for structure, then confirm each constant in shs3_payload by literal shape before it becomes CONTRACT. Nine of this unit's twenty claims cite v0.682 numbers that were never checked against the target build.

### `combat-core/web-payload-is-readable` — HELD [A2]

The web v0.717 payload is fully decompiled and cross-readable on disk — 1,079 .as files with mangled identifiers but plain AS3 bodies — so every combat constant in this lane can and must be verified against it rather than against the android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:6 (1,079 .as files under that directory; docs/research/fidelity/SOURCE_CONSTANTS.md:1-6)`
- **Quote:** public class §1t99s0§ extends §1t68s0§   ///   SOURCE_CONSTANTS.md: "Status: CRACKED AND MINED (2026-07-25). ... Build identified as v0.717 — the same build our video measurements came from. 189 constants extracted"
- **Lane impact:** L5 — kills the lane's blanket CONTRACT-SRC-v0.682 labelling requirement. Every constant below can be graded against the shipped build today; nothing in combat-core needs to wait on a parity study.

### `combat-core/web-reach-stance-mults` — HELD [A2]

In the shipped v0.717 build the per-stance reach multipliers are light x1.4 flat, balanced x(1 + 0.02*mastery) and heavy x(0.5 + 0.04*mastery) floored at 100 — which is exactly what src/config/reach.ts already holds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120`
- **Quote:** case §1t12220s0§: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;  ...  case §1t12221s0§: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);  ...  case §1t12222s0§: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
- **Lane impact:** L5 — DO NOT change src/config/reach.ts. lightMult 1.4, balancedPerMastery 0.02, heavyPerMastery 0.04, heavyFloor 100 are all correct and can be promoted from CONTRACT-SRC to plain CONTRACT. At the stated L1 character (SPD 1, dan 0, mastery 0): base 124, light 173.6, balanced 124, heavy 100 (floored) — the config comment is right.

### `combat-core/web-stance-switch-rule` — HELD [A2]

The v0.717 stance-switch rule is an absolute threshold, not a fraction: switching is blocked while reload < 48 and costs a flat 48 — and 48 is precisely the meter's hidden display offset, so the rule is literally 'you cannot switch while the visible bar reads empty', which is exactly what the CANNOT CHANGE STANCE frame shows.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3058-3060 and :3161-3166 (corroborated by reference/frames/session11/crit-focus/t1003.000.png, crop (0,910)-(620,1080) at 2x)`
- **Quote:** public function §1t4472s0§() : * { if(this.§1t4414s0§ < 48) { return; } ...   ///   if(§1t1525s0§.§1t9948s0§()) { this.§1t4414s0§ -= 48; if(this.§1t4414s0§ < 0) { this.§1t4414s0§ = 0; } ... }   ///   In the frame: the third HUD bar is empty and reads CANNOT CHANGE STANCE.
- **Lane impact:** L5 + L8 — replace the android maxreload/6 gate and the >max/2 -> max/3 tax with: gate reload >= 48, cost flat -48. This is the correct grounding for the CANNOT CHANGE STANCE HUD state, which the survey attached to the wrong rule.

### `economy/2208-is-the-gold-to-coin-sku` — HELD [A2]

The filmed banknote tile is item 2208, the shop's gold→coin SKU at heavenlyprice 1 — so v0.717's 5× change is a DEFLATION of coins-per-gold (1000→200) at an unchanged 1-gold price, the inverse of the surveyed claim.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:428 and :482-484; payout divergence at reference/decompiled/shs3_payload/scripts/§1t401s0§.as:952 vs shs3_android/scripts/InteractUI.as:923; row at reference/extracted/itemdata.xml item 2208`
- **Quote:** ShopUI.as:428 — "if(this.displayItem.itemID == 2208)" gated on "StatsManager.isCoinPurseFull()"; ShopUI.as:482-484 — "if(this.displayItem.itemID == 2208) { StatsManager.changeGold(1000); SoundManager.instance.playGoodKoto(); }"; itemdata 2208 <heavenlyprice>1</heavenlyprice>, name resolves to "1000 coins" / "Buy 1000 coins."
- **Lane impact:** L10: the premium→coin sink is one SKU (2208) priced at 1 heavenly gold, paying 200 coins on web and 1000 on android, and refused when the purse is full. Model it as an item, not a menu service. Item 2209 ('Full HP and Chi', hp=1) is the second 1-gold SKU, paying StatsManager.fullHealth() at ShopUI.as:487-489.

### `economy/coin-faucet-set-now-cited` — HELD [A2]

The coin-faucet set the survey enumerated without citations is fully citable in the android bundle.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:1298; Obj_ChestLoot.as:45; Obj_ChestGoodLoot.as:62; Obj_DragonDanceLoot.as:331; WarUI.as:241 and :491; InteractUI.as:1548`
- **Quote:** EnemyPlayer.as:1298 — "OverworldHUD.instance.lootDialog.addLootCoins(Math.random() * level);" · Obj_ChestLoot.as:45 — "addLootCoins(Math.random() * this.lvl);" · Obj_ChestGoodLoot.as:62 and Obj_DragonDanceLoot.as:331 — "addLootCoins(Math.random() * this.lvl + this.lvl * 5);" · WarUI.as:491 — "addLootCoins(newrank * 100);" · WarUI.as:241 — "addLootCoins(5);" · InteractUI.as:1548 — "addLootCoins(count * price);"
- **Lane impact:** L4/L9/L10: the faucet set is closed and every member now has a line cite. Note the two chest tiers differ by a guaranteed floor (lvl*5) on good/dragon-dance chests, which the survey's chest bullet did not distinguish.

### `economy/five-fold-redenomination-is-A2-grade` — HELD [A2]

The web-vs-Android 5× gold redenomination is provable from code alone, three independent ways, and does not need the frame-inference the survey used.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140 vs reference/decompiled/shs3_android/scripts/PayUI.as:127-131; §1t1523s0§.as:2646/:2651 vs StatsManager.as:2202/:2207; §1t401s0§.as:952 vs InteractUI.as:923`
- **Quote:** IAP ladder: Android 10/25/40/55/75 gold ↔ web 50/125/200/275/400 gold — exactly ×5, five for five, at the same USD tiers. Rebirth: Android 5 / 20 ↔ web 25 / 100 — ×5 twice. Exchange: Android changeGold(1000) ↔ web (200) per 1 gold — ÷5. Chain closes: 50 KREDS → 50 web gold → 10,000 coins; 10 Android gold → 10,000 coins. Same real value, 5:1 unit split.
- **Lane impact:** L3/L10/L11: bank the ×5 rule at A2 with three code witnesses instead of A1-by-icon-matching. Every heavenly-gold figure ported from a 0.682 artifact must be multiplied by 5 for a v0.717 target, and every coins-per-gold figure divided by 5. The two operations cancel in real terms — do not apply one without the other.

### `economy/itemdata-line-identical-across-builds` — HELD [A2]

reference/extracted/itemdata.xml (web) and reference/extracted/android/111_Mobile_ItemData.bin are line-for-line identical — 10,546 lines each, zero diff hunks after stripping the XML declaration — so item stats port as-is, which is precisely what makes the filmed premium-price mismatch a live-server-data problem rather than an android-build problem.

- **Cite:** `reference/extracted/itemdata.xml vs reference/extracted/android/111_Mobile_ItemData.bin, unified diff run this review`
- **Quote:** web lines 10546 · android lines 10546 · diff hunks: 0. Raw byte lengths 184002 vs 184044; the 42-byte delta is the '<?xml version="1.0" encoding="utf-8"?>' declaration plus a trailing newline.
- **Lane impact:** L3: <baseprice>/<weight>/<modifier>/<defense> may be ported without a build caveat — the two builds ship the same file. But the same fact removes 'it's the android data' as an explanation for the filmed 10/15/60 gold badges, forcing the DIVERGENT label in N1.

### `economy/no-multiplier-in-web-shop-chain` — HELD [A2]

The web v0.717 shop prints the gold badge as the raw <heavenlyprice> value with no transform anywhere in the chain, so any 'shipped prices are N× the rows' law is impossible and the true correction is that the extracted itemdata's heavenlyprice column is divergent from the filmed build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:94 → §1t61s0§.as:35 → §1t394s0§.as function §1t6868s0§`
- **Quote:** §1t104s0§.as:94 — "this.§1t847s0§.§1t695s0§(param1.heavenlyprice);" · §1t61s0§.as:35 — "this.§1t847s0§.§1t695s0§(_loc2_.§1t854s0§());" · §1t394s0§.as §1t6868s0§ — "if(param2 > 0) { this.coin.visible = false; this.gold.visible = true; this.§1t6859s0§.text = param2.toString(); this.§1t6866s0§ = 2; }"
- **Lane impact:** L3/L10/L11: do NOT multiply <heavenlyprice> by anything. Label the premium price column DIVERGENT in DIVERGENCES.md and re-derive per build. The web ShopItem class is §1t394s0§ — add it to the class map (found by the surviving timeline instance names 'coin' and 'gold').

### `economy/premium-price-exception-set` — HELD [A1]

Three premium SKUs are priced at 1 heavenly gold in the shipped web build despite the x5 pattern holding for the other thirteen visible tiles — the coin pack, the full-heal and the 10-token pack — so premium prices must be read per item from frames, not multiplied.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=2884s (48:04), premium BUY shop, 1920x1080; crop (185,260)-(950,1035) upscaled x2 LANCZOS covering all 16 tiles; item identities from reference/extracted/android/121_Mobile_PremiumData.bin <default> order + docs/gauntlet/L0/index/resolved_names.json`
- **Quote:** Visible in the crop, row-major with gold-coin badges: banknote printed '200' badge 1; green+blue '++' badge 1; one grey skull badge 5; two grey skulls badge 10; five grey skulls badge 15; one gold skull badge 1; gold skull cluster badge 10; red/gold gift badge 5; green egg badge 5; three purple scrolls badge 25 each; pink shell badge 5; blue gift badge 60; black hood badge 15; dark garment badge 15. Resolved: 2208 '1000 coins' hp=1 -> 1; 2209 'Full HP and Chi' hp=1 -> 1; 2125 '10 Duel Tokens' hp=1 -> 1; but 2100 hp=1 -> 5, 2101 hp=2 -> 10, 2102 hp=3 -> 15, 2126 hp=2 -> 10, 2200/2203/2207 hp=5 
- **Lane impact:** L3/L10/L11: replaces the refuted blanket 'multiply heavenlyprice by 5' instruction. Use x5 as a working prior for gear and consumables, x1 for the three currency/utility SKUs, and treat every premium price as frame-sourced. Corroborating mechanism: item 2208's name string is still literally '1000 coins' while the web art reads '200' and web §1t401s0§.as:952 pays 200 vs Android 1000 — the web build cut the coin PAYOUT instead of raising that item's gold PRICE.

### `economy/prosperity-tier-thresholds-recoverable` — PARTIAL [A2]

The prosperity scale IS recoverable offline: town level is a step function of raw townProsperity at thresholds 500 / 1000 / 2000 / 4000, giving the five-tier ladder its absolute units.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:782-805`
- **Quote:** public function getTownLevel() : int
{
   if(this.townProsperity == 0)
   {
      return 0;
   }
   if(this.townProsperity < 500)
   {
      return 1;
   }
   if(this.townProsperity < 1000)
   {
      return 2;
   }
   if(this.townProsperity < 2000)
   {
      return 3;
   }
   if(this.townProsperity < 4000)
   {
      return 4;
   }
   return 5;
}
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L11 (META): overturns the economy survey's clause 'Only the -1000 ninja hire is a recoverable constant'. Four thresholds are now held, which fixes the UNITS of prosperity — a town spans 0 to 4000+, so the hard-coded -1000 ninja hire is a full-tier shock rather than noise, and the 5-tier ladder consumed at DungeonGenerator.as:1363-1555 is now anchored to absolute numbers. The offline sim can author per-event deltas against a correct scale instead of inventing one; the per-event magnitudes themselves remain server-side (QueryManagerBase.as:2259 posts to /town/updatetownprosperity.php), so this is PARTIAL, not HELD.

### `economy/quest-coins-are-the-biggest-early-faucet` — HELD [A1]

Quests do pay coins, via <reward><loot><id>0|1|11</id> rather than <outcome><id>11</id>, and at +30 per turn-in they are the largest single early-game coin payout in the game.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg, crop (490,340)-(760,460) upscaled ×5 LANCZOS`
- **Quote:** Visibly in the crop: 'REWARD / 250 XP / 30 COINS / TOWN PROSPERITY: +5'. Backed at reference/extracted/questdata.xml:4162-4168 (<exp>750</exp> + <loot><id>0</id><qty>30</qty><chance>1</chance>) and QuestLogUI.as:457/:461/:494.
- **Lane impact:** L1 (CAMPAIGN) / L10 (ECONOMY): the coin faucet enumeration must be re-opened with quests in it. Any offline balance pass that omits quest coins will under-fund the early game by roughly 60× the per-mob rate. Scan <reward><loot>, never <outcome>.

### `economy/rebirth-pays-premium-currency` — HELD [A2]

The rebirth payout is Heavenly Gold (STAT_HGOLD = 12, the PayVault premium currency), not the soft coin purse (STAT_GOLD = 11), so any tenthGold config value must be wired to the premium wallet.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, :2627-2677 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 and :228; docs/gauntlet/L0/index/strings.json keys 63/64`
- **Quote:** 192: internal static var STAT_GOLD:int = 11;
194: internal static var STAT_HGOLD:int = 12;
2653: public static function isCoinPurseFull() : Boolean { return getPlayerStats(STAT_GOLD) >= getMaxCoins(); }
2669: public static function getHeavenlyGold() : int { var hgold:int = getPlayerStats(STAT_HGOLD); if(usePlayerIO) { hgold += QueryManagerPIO.instance.getPayVaultCoins(); } return hgold; }
---
strings 63 = 'Coins'   64 = 'Gold'
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-economy + L-rebirth-elements: the rebirth reward touches the premium wallet, which also means it is entangled with the dead Player.IO PayVault backend and needs an offline substitute. If the ledger's filmed '+25 gold' was read off the Coins counter, the film and the code describe different currencies - and per the standing invariant the frame wins, so that reading needs re-checking against the frame.

### `economy/sell-price-edge-cases` — HELD [A2]

Two shipped edge cases sit on top of the sell formula: item 13002 (the starter Branch) is force-priced at 0 in the sell list, and ShopUI.sellPercentage = 0.5 is dead code — onSell pays getSellAmt() unmodified.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58, :394-401, :536-540`
- **Quote:** else if(slot.getItemID() == 13002) { slot.setCost(0,0); } else { slot.setCost(slot.getItem().getSellAmt(),0); }  /  internal var sellPercentage:Number = 0.5;   [no other reference]  /  StatsManager.changeGold(this.displayItem.getCost());
- **Lane impact:** L4 (economy) — prevents a builder wiring a 50% vendor haircut that the game never applies.

### `economy/tradegoods-web-seed-drops-node` — PARTIAL [A2]

The web trade-goods price seed omits getCurrentNode(), which if literal makes every town quote the same daily price and would destroy the arbitrage loop the game's own tutorial tip advertises.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1676 vs reference/decompiled/shs3_android/scripts/InteractUI.as:1562`
- **Quote:** Android: "var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index);" (three factors). Web: "var _loc4_:int = §1t3317s0§.instance.§1t1848s0§() * param1;" then "§1t58s0§.random(_loc3_,_loc4_)" (two factors). §1t3317s0§ is QueryManager — it carries saveModifiedCharData and reportPremiumBuy(4,"convertgold",1) in the block at :953-959 — so §1t1848s0§() is getServerDate(). The missing factor is the NODE.
- **Lane impact:** L9/L10: the survey's 'fully reproducible offline with mulberry32, no server needed' is premature for a v0.717 target. Someone must read the web call site to find whether a node offset is applied there; until then the arbitrage loop is reproducible only in the Android formulation. GameEngine.as:636's tip ('buy goods from a market and sell in another town') is the constraint the resolution has to satisfy.

### `economy/web-build-has-unresolvable-content` — HELD [A1]

The filmed web build contains item content the android 0.682 string table cannot name at all, proving the S0-3 provenance caveat is a live hazard rather than a formality.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04 self-extracted 1920×1080, tooltip panel right of the grid (approx (1100,250)-(1780,820)), read at 1280-wide render; cross-checked against reference/extracted/android/118_Mobile_Lang_EN.bin via docs/gauntlet/L0/index/strings.json`
- **Quote:** Tooltip reads: "TRAINING GARMENT / OWNED: 0 / SOUL-INFUSED / THIS ITEM LEVELS UP AS YOU GAIN XP. / DEFENSE: +21 (EQ: 4) / EARTH DEF: +3 (EQ: 1) / PIERCING DAMAGE: +2 (EQ: 0) / MAX CHI: +15 (EQ: 0) / WEIGHT: 10", badge 15 gold, LEVEL 7. Searching the 2,533-entry android table for 'Training' returns Training Hall / Training Sword / Training Dummy and no garment; searching for 'levels up as you gain' returns zero hits.
- **Lane impact:** L3/L10: a soul-infused item-levelling system is visible on film and absent from every extracted data source. Any lane porting item names or premium SKUs from resolved_names.json must label them ANDROID 0.682 and expect gaps against the filmed build.

### `economy/web-build-ships-no-game-data` — HELD [A2]

The web v0.717 payload contains NO item, skill, npc or quest data — it fetched all four tables from the dead Player.IO backend — so every reference/extracted/*.xml on disk is Android v0.682 data and the §0 S0-3 build caveat can never be retired by diff, only by frame.

- **Cite:** `reference/extracted/payload.xml byte offsets 19403382 ('heavenlyprice') and 19503662 ('itemdata') — each the ONLY occurrence in 329 MB, both inside an AS3 string constant pool listed between 'baseprice' and 'minlvl'; plus the 27-file header dump of reference/extracted/bindata/`
- **Quote:** payload.xml @19403382: "<item>shop</item> <item>roomdata</item> <item>property</item> <item>baseprice</item> <item>heavenlyprice</item> <item>minlvl</item> <item>scalex</item>" — tag names for a parser, not rows. bindata/ headers: 100-118 + 102/103 etc. all '<?xml version="1.0"?> <animdata> <anim i="…"', 119 '<survivalmodedata', 93 room-object defs, 94-98 name lists, 92 'GIF89a'. Zero item/skill/npc/quest blobs. And: diff reference/extracted/{itemdata,skilldata,npcdata,questdata}.xml against android/{111,117,125,116}_*.bin differs ONLY by the <?xml?> declaration and a trailing newline.
- **Lane impact:** ALL LANES (L1 campaign, L3 items, L4 enemies, L5 skills, L10, L11): every row ported out of reference/extracted/*.xml must be labelled clientVersion 0.682. Four independent web-vs-disk divergences are already known — item 2208 pays 1000 coins on disk and 200 on film/code; the premium gold ladder is 5×; 'Soul-Infused'/'Training Garment' are on the web frame but score 0 hits in 118_Mobile_Lang_EN.bin; quest loot id 50007 (town prosperity) renders in the client and appears 0 times in the 0.682 questdata. Where a frame exists, the frame is the ONLY web-side authority.

### `economy/web-payload-has-no-itemdata-table` — HELD [A2]

The web v0.717 payload contains NO itemdata table at all — only the parser's field names in the SWF string constant pool — so every data XML on disk is Android v0.682 provenance and the S0-3 build caveat must stay on data even though it can be dropped for AS3.

- **Cite:** `reference/extracted/payload.xml, single occurrence of 'heavenlyprice' at byte offset 19403382 of 329520665; reference/extracted/itemdata.xml vs reference/extracted/android/111_Mobile_ItemData.bin`
- **Quote:** <item>shop</item>\n<item>roomdata</item>\n<item>property</item>\n<item>baseprice</item>\n<item>heavenlyprice</item>\n<item>minlvl</item>\n<item>scalex</item>\n<item>scaley</item>  — i.e. the ABC string constant pool, not a data row. grep -o 'heavenlyprice' payload.xml | wc -l = 1. Meanwhile the Android blob 111_Mobile_ItemData.bin is content-identical to reference/extracted/itemdata.xml (differs only by the 40-byte XML declaration plus a 2-byte trailing newline).
- **Lane impact:** ALL LANES (L1-L11): narrows claim economy/web-payload-is-decompilable. AS3 can now be cited from the web build, but itemdata/npcdata/skilldata/questdata are Android-provenance and the web build fetched its tables from the dead Player.IO server. This is the root cause of the heavenlyprice-vs-frame mismatch, and it means any DATA number ported from reference/extracted/*.xml must still be labelled Android v0.682 and frame-checked before use.

### `enemies-ai/allies-scale-to-player-level-enemies-do-not` — HELD [A2]

Friendly NPCs scale to the PLAYER's level at spawn while enemies take an authored per-wave <lvl> override — two different scaling rules by side, which the ledger and the survey both treat as one formula.

- **Cite:** `reference/decompiled/shs3_android/scripts/FriendlyArcher.as:58, FriendlyElite.as:70, FriendlySpearElite.as:56 (contrast NPCManager.as:868-881)`
- **Quote:** FriendlyArcher.as:58 this.setLevel(StatsManager.getLevel());  ·  FriendlyElite.as:70 this.setLevel(StatsManager.getLevel());  ·  FriendlySpearElite.as:56 this.setLevel(StatsManager.getLevel());  ·  NPCManager.as:868-881 public static function createEnemy(npcID:int, x:int, y:int, fatal:Boolean, lvl:int = 0) : NPC { ... if(lvl != 0) { actor.setLevel(lvl); } return actor; }
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: completes blocker ①. setLevel is the shared mechanism but the INPUT differs by faction — allies read StatsManager.getLevel(), enemies read the wave's <lvl> (171 such overrides authored, range 1..80) and fall through to the authored statline when it is 0. Note the consequence: an ally at player level <=10 also hits the 1/1/1 clamp.

### `enemies-ai/drop-in-spawn-is-on-film` — HELD [A1]

The drop-in-from-above wave-spawn rule, asserted from AS3 only, is directly visible in a frame: a wave-2 enemy descends through the air with its HP bar already tracking it.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0020.jpg - crop (400,150)->(1024,470), LANCZOS x2`
- **Quote:** Visibly in the crop: a blue-clad kasa-hatted enemy fully airborne, roughly a body-height above the reed line, legs trailing, mid-descent, with a green HP bar floating directly above him; two more green bars over grounded hostiles at left; the gold GUEST player standing at right. No hostile carries a name or level.
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: promotes NPCManager's posY - Math.random()*200 drop-in rule from A2-only to A2+A1, so it is safe to stamp. Also independently corroborates the combat-readout rule in a second scene (outdoor field, not the dungeon the surveyor cited).

### `enemies-ai/endless-wave-flag-is-the-survival-engine` — HELD [A2]

The wave engine carries an `endless` flag that rewinds the wave counter by 2 and recurses instead of ending the fight — the runtime behind the survivalmodedata blob that Stage-0 flagged as an entire game mode absent from all 12 ledger systems.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:381-388`
- **Quote:** ++currentWave; if(currentWave >= waveCount) { if(endless && !StageManager.isSurviveCleanUp()) { currentWave -= 2; nextWave(); } }
- **Lane impact:** Cross-lane: connects Stage-0 finding S0-1 (bindata 119 = <survivalmodedata>, plus the Android 109_WarHexUI_SurvivalModeData.bin) to executable behaviour. Survival mode is not a separate system to reverse-engineer — it is the existing wave spawner with one boolean and a -2 rewind.

### `enemies-ai/nameplate-is-cosmetic-override` — HELD [A2]

The overworld nameplate's parenthesised level is a cosmetic per-placement display string read from the room-object property, not a stat: it never reaches setLevel(), so the enemy keeps its authored npcdata statline.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:34-37,62,73-80 + NPCManager.as:671`
- **Quote:** if(strArray.length >= 2) { this.lvl = strArray[1]; } ... this.npc = NPCManager.createRoomNPC(this.npcid,posX,posY,doChase); ... this.npc.mcs.hideHealthBar(); if(this.lvl == 0) { this.npc.mcs.setDisplayName(this.npcname,10027008); } else { this.npc.mcs.setDisplayName(this.npcname + " (" + this.lvl + ")",10027008); }  ·  NPCManager.as:671 public static function createRoomNPC(npcID:int, x:int, y:int, doChase:Boolean = false) : NPC
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai + ui-hud: refutes the surveyor's 'frame wins over npcdata, therefore HP 1' chain. There is no frame-vs-doc conflict - the level is authored per placement. Also code-holds the plate colour as 10027008 (0x990000, dark red), which the ledger omits.

### `enemies-ai/part-decomposition-is-variable` — HELD [A2]

The parta/partb/partc attack decomposition is neither universal nor uniformly three-part: only 16 of 158 human anim families use it, with 2, 3, 4 or 5 parts, and most attacks have no decomposition at all.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (my own parse of all 158 <anim> blocks)`
- **Quote:** families using _part: heavyhorizontalslash 3, balancedhorizontalslash 3, balancedfallslash 3, heavyfallslash 3, jumpunsheathed 3, jumpsheathed 3, lightjumpslash 3, gotlaunchedupwards 3, balancedjumpslash 5, heavyjumpslash 5, punchcombo 4, jutsu_ground 2, jutsu_punch 2, jutsu_blow 2, stomp 2, punchground 2  ·  NO parts: lighthorizontalslash 3, downstab 15, stabattack 14, katanaattack 10, downstab_up 10, holdshieldstabattack 10, ninjaslash 8
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: corrects the surveyor's 'every stance attack ships as three named parts'. A port following that rule would invent a three-phase light-stance slash and three-phase katana/stab attacks that do not exist. The durations themselves are authored and correct - it is the generalisation that fails.

### `enemies-ai/part-specific-death-animations` — HELD [A2]

Death animation is part-specific, not a single clip: the human anim set ships deathnohead, deathnohand, deathinhalf, deathwitharrow and deathbyarrow alongside plain death — the visual half of the behead x1.5 and zombie head-gate mechanics.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (parsed: 158 <anim> blocks)`
- **Quote:** death d=38 · deathenemy d=23 · deathnohand d=25 · deathnohead d=31 · deathwitharrow d=23 · deathbyarrow d=21 · deathinhalf d=28 · deathdowned d=7
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: the survey establishes the behead DAMAGE rule (NPC.as x1.5, EnemyZombie half-unless-behead) but never connects it to the authored dismemberment ART. deathnohead is the behead death, deathnohand the disarm death, deathinhalf the bisection death — all with frame durations. A recreation that plays one generic death clip loses a visibly authored feature.

### `enemies-ai/readout-split-is-two-spawn-paths` — HELD [A2]

The nameplate-vs-HP-bar split is not a HUD mode switch but two different spawn paths: overworld Obj_NPCAggro roamers get hideHealthBar() plus a permanent display name, while wave-spawned combat NPCs get the inverse - a bar and no name.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:38-41,73-80 vs NPCManager.as:869-882 (createEnemy)`
- **Quote:** Obj_NPCAggro.as:73 this.npc.mcs.hideHealthBar();  ·  :38-41 if(strArray.length >= 3) { this.waveXML = new XMLList(strArray[2]); }  ·  NPCManager.as:869 public static function createEnemy(npcID:int, x:int, y:int, fatal:Boolean, lvl:int = 0) : NPC { var actor:NPC = createNPC(npcID,x,y,fatal); ... enemyList.push(actor); if(lvl != 0) { actor.setLevel(lvl); }
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: model it as two spawn paths, not one HUD that toggles. The aggro object carries its own waveXML, so on trigger the billboard enemy is replaced by a real wave - which is exactly what the seg-10 0013->0021 footage shows.

### `enemies-ai/roster-display-names-differ-from-class-names` — HELD [A2]

Three roster entries the survey names after their AI class carry different display names in the shipped string table — npc 67 is "Wolf" (not Wolf Alpha), npc 77 is "Oni" (not Ogre), npc 89 is "Undead" (not Zombie) — which matters because the nameplate displays this string.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json → npcdata.xml.resolved (484 rows): '67' {'name':'Wolf'}, '77' {'name':'Oni'}, '89' {'name':'Undead'}, '11' {'name':'Bandit'}, '144' {'name':'Hiroshi'}, '165' {'name':'Tadao'}, '186' {'name':'Amaya'}, '800' {'name':'Mad Cultist'}, '802' {'name':'Guardian'}`
- **Quote:** npcdata.xml:1844-1849 `<npc><id>67</id><name>5056</name><lvl>15</lvl><hp>100</hp><ai>11</ai>` → 5056 resolves to "Wolf", while ai 11 = `new EnemyWolfAlpha()` (NPCManager.as:559-561). Same split at id 77 ("Oni", ai 23 = EnemyOgre) and id 89 ("Undead", ai 26 = EnemyZombie).
- **Overturns:** "boss roster"
- **Lane impact:** L0 enemies-ai + ui-hud: the OG's nameplate prints the string-table name, not the class name — proved by the seg-10 frame in claim 2, where npc 11 renders as "BANDIT (4)". Any roster table for the recreation must be keyed on resolved_names.json, with the class name used only as the behaviour selector. Cheap to fix now, expensive after the nameplate ships.

### `enemies-ai/second-ai-dispatch` — HELD [A2]

The <ai> field is resolved by two independent dispatch tables, not one: NPCManager.createRoomNPC has its own if/else chain distinct from the 38-case createNPC switch, and it is the path every overworld enemy takes.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:671-700 (contrast the switch at :516-636)`
- **Quote:** public static function createRoomNPC(npcID:int, x:int, y:int, doChase:Boolean = false) : NPC { ... var xml:XMLNpc = QuestEngine.getNPCData(npcID); ... if(xml.ai == 8) { actor = new EnemyWolf(); } else if(xml.ai == 11 || xml.ai == 16) { actor = new EnemyWolfAlpha(); } else if(xml.ai == 12) {
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. the archer (closed this pass); boss roster"
- **Lane impact:** L0 enemies-ai: a recreation that models only the 38-case switch misses the overworld branch entirely. Also corrects the class arithmetic: 38 cases resolve to 34 DISTINCT classes (31 Enemy* + 3 Friendly*), because EnemyPlayer appears 3x and EnemyWolf/EnemySpearElite 2x each.

### `enemies-ai/web-archer-halves-gravity-on-knockdown` — HELD [A2]

The web v0.717 archer overrides the ballistic gravity term from 3 to 1.5 for shots that rolled a knockdown, producing a flatter, faster arc — a branch that does not exist in the Android v0.682 build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t4542s0§.as:287-299 (contrast reference/decompiled/shs3_android/scripts/EnemyArcher.as:277-281)`
- **Quote:** var _loc6_:Number = §1t128s0§.§1t12543s0§; if(_loc1_) { _loc6_ = 1.5; } var _loc7_:Number = _loc6_ * Math.abs(_loc4_ - _loc2_) / 0.866; _loc7_ = Math.sqrt(_loc7_); var _loc8_:Number = _loc7_ * 0.866; var _loc9_:Number = Math.abs(_loc4_ - _loc2_) / _loc8_; var _loc10_:Number = (_loc5_ - _loc3_ - 0.5 * _loc6_ * _loc9_ * _loc9_) / _loc9_;   ·   ANDROID has no override: var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866;
- **Lane impact:** L0 enemies-ai: the first PROVEN v0.682-vs-v0.717 behavioural divergence. It lands inside the very claim the survey marked HELD, and it vindicates the parity caveat while showing the risk is specific and fixable rather than diffuse. Port the web value: gravity 3 normally, 1.5 on knockdown shots.

### `enemies-ai/web-payload-is-obfuscated-not-absent` — PARTIAL [A2]

The web v0.717 build's gameplay code is present on disk under obfuscated identifiers, not missing: 667 §1t…s0§-named files, with the version constant at §1t1523s0§.as:36 in the same structural slot Android's StatsManager.as:30 holds 0.682 — so §1t1523s0§ is the web StatsManager and a name mapping between the two decompiles is achievable.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (plus `find reference/decompiled/shs3_payload -name "§*" -type f | wc -l` → 667; scripts/§1t51s0§/ is an obfuscated package dir)`
- **Quote:** §1t1523s0§.as:36 `public static var §1t9323s0§:Number = 0.717;` followed at :38 by `public static var §1t9324s0§:int = 80;` — compare reference/decompiled/shs3_android/scripts/StatsManager.as:30 `public static var clientVersion:Number = 0.682;`
- **Lane impact:** L0 enemies-ai and every lane that cites the Android decompile: the survey's dominant residual risk is mis-framed. Web parity is NOT unestablishable — it is a name-recovery job on 667 obfuscated classes with at least one anchor constant already matched (0.717 ↔ 0.682, same slot). That is schedulable verification work and should be opened as a lane, rather than treating AS3-sourced numbers as permanently un-CONTRACT-able. The caution itself still stands: keep labelling ported values v0.682-ANDROID until the mapping is done.

### `enemies-ai/web-v0717-gameplay-code-is-on-disk` — HELD [A2]

The web v0.717 gameplay code is NOT missing — it is name-obfuscated into 667 `§...§.as` classes in the web payload decompile, and §1t68s0§.as is the web NPC class carrying setLevel, the 24-frame AI cadence and the 12-frame hit lockout.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:258-279, :22, :483`
- **Quote:** public function setLevel(param1:int) : * { var _loc2_:Number = param1 / this.level; if(param1 <= 20) { _loc2_ *= 0.9; } this.level = param1; this.damage *= _loc2_; this.defense *= _loc2_; this.§1t3257s0§ *= _loc2_; this.§1t3308s0§(this.§1t3257s0§); this.§1t3301s0§(); this.xp = param1 * 2 + 20; if(param1 <= 10) { this.damage = 1; this.defense = 1; this.§1t3257s0§ = 1; this.§1t3308s0§(this.§1t3257s0§); } }  ·  :22 internal var §1t3244s0§:int = 24;  ·  :483 this.§1t3246s0§ = 12;
- **Lane impact:** L0 enemies-ai (and every AS3-sourced lane): the survey's only STILL_UNHELD is refuted. Parity between v0.682 and v0.717 is now directly checkable by constant-matching against obfuscated classes, and it CONFIRMS the unit's core numbers. Cap-reason (1) on the 78 score should be struck. This also unblocks every other lane that deferred an AS3 number as 'Android-only'.

### `enemies-ai/zombie-weapon-parry` — HELD [A2]

EnemyZombie has a weapon-part parry the survey missed: a hit landing on PART_weapon deals zero damage and returns false, eating the hit entirely.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:502-505`
- **Quote:** case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai + combat-core: sits alongside the half-damage-unless-behead gate in the same switch. Blade-path hits that intersect the enemy's weapon are nullified, which is a real feel mechanic and is not in any ledger system.

### `gauntlet/index-firstlines-are-leafname-scoped` — HELD [A2]

⚠ CROSS-CUTTING: the Stage-0 index's first_lines field is scoped to the LEAF TAG NAME, not to the full path, so it is only a valid line cite when the leaf name is unique in the file — every lane citing it must open the line first.

- **Cite:** `docs/gauntlet/L0/index/questdata.json (three distinct paths sharing first_lines) vs reference/extracted/questdata.xml:93`
- **Quote:** index reports first_lines [93, 226, 240, 1698, 2329, 2401] IDENTICALLY for questdata/quest/step/wave/enemy/lvl, questdata/quest/step/wave/friend/lvl AND questdata/quest/step/roomobj/property/obj/property/xml/wave/enemy/lvl. questdata.xml:93 is none of them — I opened it: '        <lvl>1</lvl>' inside '<neutral><id>118</id><qty>1</qty><x>2000</x><lvl>1</lvl></neutral>'.
- **Lane impact:** All lanes L1-L11: never cite an index first_lines value as a path-specific line number. It happens to be correct for unique leaf names (<exp> -> [215,412], <lvlreq> -> [257,286], both of which I verified) and wrong for repeated ones. The progression unit did not fall into this — all four of its XML line cites were self-derived and all four verified — but the trap is live for every other lane.

### `items-equipment/23-render-slots-not-27` — HELD [A2]

MCSCharacter declares 27 PART_* constants but instantiates only 23 MovieClips, so the four shoulder/knee indices (23-26) point past the end of partList.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:62, :120, :141-145`
- **Quote:** :62 public static var PART_r_knee:* = 26;   /   :120 internal var partListLength:int = 22;   /   :141 for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
- **Lane impact:** L6 (art/animation) -- build 23 z-ordered render slots, not 27. PART_prop3(22) is the last real one; l_shoulder/r_shoulder/l_knee/r_knee are declared-but-unallocated (note they are the only ones typed :* rather than :int, i.e. a later, unfinished addition).

### `items-equipment/27-parts-but-23-human-layers` — HELD [A2]

MCSCharacter declares 27 PART_ indices but allocates only 23 MovieClip layers for a human (partListLength = 22, loop i <= partListLength); indices 23-26 (l/r shoulder, l/r knee) are creature-only and exist solely for MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:56-62, :120, :141-146; reference/decompiled/shs3_android/scripts/MCSWolf.as:13-14, :184-197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  MCSWolf: partListLength = 25; for(var i:int = 0; i <= partListLength; i++) ... var r_frontleg1:MovieClip = partList[PART_r_shoulder]; ... var l_backleg2:MovieClip = partList[PART_l_knee];
- **Lane impact:** L6 (art) — the paperdoll z-order table a builder should implement is 23 layers (PART_l_hand 0 .. PART_prop3 22), not 27. The four extra indices are the quadruped rig.

### `items-equipment/affix-eligibility-matrix` — HELD [A2]

Affix rolling is gated by an 8-type x 17-channel 0/1 eligibility matrix, and the FIRST affix is forced by item type (armor -> DEFENSE, weapon -> ATTACK, shoes -> SPEED) with that channel then removed from the pool.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:397-455`
- **Quote:** if(itemType == WEAPON) { pot = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1]; } else if(itemType == ARMOR) { pot = [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1]; } … if(i == 0) { if(itemType == ARMOR) { attrib = DEFENSE; pot[DEFENSE] = 0; } else if(itemType == WEAPON) { attrib = ATTACK; pot[ATTACK] = 0; } else if(itemType == SHOES) { attrib = SPEED; pot[SPEED] = 0; } }
- **Lane impact:** L4/L7 (economy + loot) — this is the missing half of the affix system the survey banked; without it every item type rolls from the same pool and loot identity collapses.

### `items-equipment/border-is-four-tier-16-frames` — HELD [A2]

The inventory slot border encodes the full 4-tier derived rarity (normal/special/rare/unique) as 16 named frames — borderType + _default/_selected/_mouseover/_selectedmouseover — which is why the game ships both a 'blue border = rare' tip and a 'purple border = unique' tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52, :116, :219-220, :283-299; GameEngine.as:568 and :572`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  …  gotoAndStop(this.borderType + "_selectedmouseover");  /  str = "Tip: A blue border indicates that an item is rare."
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the slot symbol needs 4 border palettes x 4 interaction states; wiring the border to <unique> alone drops the blue rare state.

### `items-equipment/border-is-the-four-tier-ladder` — HELD [A2]

The item border is driven by getShopItemType() and therefore has four frames (normal/special/rare/unique _default), not a binary unique flag — the game's own tip list says a BLUE border means rare.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52 and :219-220, :243-245; reference/decompiled/shs3_android/scripts/GameEngine.as:567`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  str = "Tip: A blue border indicates that an item is rare.";
- **Lane impact:** L5 (UI/HUD) — directly overturns the survey's claim 13. Border AND text colour come from the same four-valued function; ShopItem additionally has _selected, _mouseover and _selectedmouseover frames per tier, i.e. 4 tiers x 4 states = 16 border frames to author, not one purple outline.

### `items-equipment/border-is-the-four-tier-ladder` — HELD [A2]

The inventory slot border is not a unique flag — it is the four-tier rarity ladder rendered as a 4 tiers x 4 states = 16 frame-label art contract on the ShopItem clip.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:27, :51-52, :283, :287, :295, :299; corroborated by GameEngine.as:568 and InventoryUI.as:1453; frame reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2 LANCZOS`
- **Quote:** internal var borderType:String = "normal";  /  this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  gotoAndStop(this.borderType + "_selectedmouseover"); gotoAndStop(this.borderType + "_mouseover"); gotoAndStop(this.borderType + "_selected"); gotoAndStop(this.borderType + "_default");  /  GameEngine.as:568: str = "Tip: A blue border indicates that an item is rare.";  /  visible in the crop: 2 purple borders (unique), 1 darkened tile with an unchanged tan border (normal_selected), 4 plain tan (normal_default)
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the survey's guidance ('border tracks <unique>, text colour tracks the 4 tiers') would leave rare items with no distinct border. The real contract is 16 named frames: {normal,special,rare,unique} x {_default,_selected,_mouseover,_selectedmouseover}. This is also a small but real named art requirement that belongs beside the icon-namespace gap.

### `items-equipment/border-is-the-four-tier-ladder` — HELD [A2]

The item border is driven by getShopItemType() — the 4-tier rarity ladder — with one MovieClip frame per tier, and the game's own tip string names blue = rare alongside purple = unique.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52, :116-120, :219-220, :283-299; GameEngine.as:568 and :572; Item.as:392`
- **Quote:** ShopItem.as:51 this.borderType = itemRef.getShopItemType(); :52 gotoAndStop(this.borderType + "_default");   /   GameEngine.as:568 str = "Tip: A blue border indicates that an item is rare.";   :572 str = "Tip: A purple border indicates that an item is unique.";
- **Lane impact:** L5 (UI/HUD) — the border is the SAME 4-tier ladder as the text colour, drawn as four named MovieClip frames (normal/special/rare/unique) x four states (_default/_selected/_mouseover/_selectedmouseover) = 16 border frames to author. It does NOT track the <unique> XML field: getShopItemType returns "unique" for unique==1 OR isPickableQuestItem() OR ids 20103-20107 OR isPlayerNamed().

### `items-equipment/border-is-the-rarity-ladder` — HELD [A2]

The item border is driven by the SAME derived 4-tier function as the text colour, not by the <unique> flag: ShopItem sets borderType = getShopItemType() and jumps to that frame label, and the game's own tip list contains a blue=rare border tip six lines above the purple=unique one.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52; reference/decompiled/shs3_android/scripts/GameEngine.as:568 and :572`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  else if(dice == 8) { str = "Tip: A blue border indicates that an item is rare."; } ... else if(dice == 9) { str = "Tip: A purple border indicates that an item is unique."; }
- **Lane impact:** L5 (UI/HUD) — one colour system, four border states (normal/special/rare/unique) x four frame suffixes (_default/_mouseover/_selected/_selectedmouseover). Overturns the survey's guidance that border and text colour are separate channels. Also note 'unique' is broader than <unique>==1: quest-pickable items, trade ids 20103-20107 and player-named items all return 'unique'.

### `items-equipment/border-is-the-rarity-ladder` — HELD [A2]

The inventory item border is driven by the same four-tier rarity string as the text colour -- ShopItem sets borderType = getShopItemType() and gotoAndStop(borderType + "_default"), and the game's own tips name a green border for special and a blue border for rare, not just purple for unique.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52; GameEngine.as:564,568,572`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  :564 str = "Tip: A green border indicates that an item is special.";  :568 str = "Tip: A blue border indicates that an item is rare.";  :572 str = "Tip: A purple border indicates that an item is unique."
- **Lane impact:** L5 (UI/HUD) -- one visual channel, four frame labels (normal_default / special_default / rare_default / unique_default), each also having a _selected variant. Do NOT build a separate border channel keyed to the <unique> XML flag.

### `items-equipment/build-parity-caveat-proven-live` — HELD [A2]

S0-3's build-parity caveat is load-bearing, not theoretical: the same speed-scaling function caps at 300 in Android v0.682 and at 600 in web v0.717 — a clean 2x tuning divergence.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861 (getSkillCooldownModifierVal); reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2288-2296`
- **Quote:** Android: internal static function getSkillCooldownModifierVal(speed:int) : Number { if(speed > 300) { speed = 300; } return 1 - speed / 300 * 0.5; }   Web: { if(param1 > 600) { param1 = 600; } return 1 - param1 / 600 * 0.5; }
- **Lane impact:** Cross-lane (L1/L2/L8) — a concrete counterexample proving Android combat/skill tuning may NOT be ported unchecked. Every Android-only number in this and other units needs a §1t1523s0§ / §1t17s0§ cross-read before it is treated as v0.717. (The items-lane numbers I re-checked — getSellAmt, the condition ladder, getMinDamage/getDamageRange, getSlashUsage, the reach formula — all DO match.)

### `items-equipment/consumable-accessory-icon-families` — STILL_UNHELD [A2]

Consumables and accessories have their own icon symbol namespaces — getMCSComponent("item",id) with an item0 fallback and getMCSComponent("acc",id) with AccessoryDummyIcon — so the item icon manifest is a real, still-unrecovered art set covering the ~824 non-weapon rows of the 982-item roster.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-224 and :226-247; absence confirmed by ls reference/decompiled/shs3_payload/scripts/ (1 item[0-9]* class = item0.as, 0 acc[0-9]* classes)`
- **Quote:** public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); addChild(this.displayItem); } ... }  /  public function setAccessory(id:int) : * { this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — blocker ⑤ must be split, not closed: the paperdoll compositing contract is HELD, the item/accessory icon manifest is STILL_UNHELD. Two art pipelines, and the second one needs an authoring pass or a recovery of 124_Mobile_ImageResource / 115_Mobile_SHS3Resource (encrypted, S0-5).

### `items-equipment/durability-is-the-uses-tag-115-items` — HELD [A2]

The durability field is the XML tag <uses>, and only 115 of the 982 items have it — so the seven-state condition ladder applies to 115 items and the other 867 render no condition line at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:186-190; Item.as:1481-1487 and :712-715; docs/gauntlet/L0/index/itemdata.json path itemdata/item/uses`
- **Quote:** this.durability = xml.uses;  ...  else { this.durability = 0; }  /  getCondition(): if(itemXML == null || itemXML.durability == 0) { return -1; }  /  getDesc(): var condition:int = this.getCondition(); ... if(condition >= 0) { ...ladder... }  /  index: itemdata/item/uses count 115, distinct {50,60,80,100}; no itemdata/item/durability path exists
- **Lane impact:** L4 + L5 — bounds the condition/repair system: 115 durable items out of 982, cap values only 50/60/80/100. A builder wiring durability to every item implements a system 8x larger than the original. Also names the tag correctly for anyone porting itemdata.xml.

### `items-equipment/elemental-def-affix-wheel-is-deliberate` — HELD [A2]

The four elemental-DEF affix channels borrowing other pools is a deliberate counter-element wheel, not a shipped bug: each DEF channel uses the pool of the element that counters it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145`
- **Quote:** this.preSufArray[FIREDEF][i] = new PreSuf(wateratk_pre[num],wateratk_suf[num]); this.preSufArray[WINDDEF][i] = new PreSuf(earthatk_pre[num],earthatk_suf[num]); this.preSufArray[WATERDEF][i] = new PreSuf(windatk_pre[num],windatk_suf[num]); this.preSufArray[EARTHDEF][i] = new PreSuf(fireatk_pre[num],fireatk_suf[num]);
- **Lane impact:** L4/L7 — port it verbatim as designed. Fire defense is named 'of Water / of Ice / of Frost', wind defense 'of Stone / of the Mountain'; treating it as a bug and 'fixing' it would change 32 of the 104 affix names away from the original.

### `items-equipment/elemental-def-pools-are-opposition-not-bug` — HELD [A2]

The four elemental-DEF affix channels do not reuse the 'wrong' pools by accident - the mapping is a consistent elemental-opposition scheme (fire-DEF takes water names, water-DEF takes wind, wind-DEF takes earth, earth-DEF takes fire) and should be copied as-is rather than 'fixed'.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145 (with the source arrays at :117-124)`
- **Quote:** this.preSufArray[FIREDEF][i] = new PreSuf(wateratk_pre[num],wateratk_suf[num]);  this.preSufArray[WINDDEF][i] = new PreSuf(earthatk_pre[num],earthatk_suf[num]);  this.preSufArray[WATERDEF][i] = new PreSuf(windatk_pre[num],windatk_suf[num]);  this.preSufArray[EARTHDEF][i] = new PreSuf(fireatk_pre[num],fireatk_suf[num]);   [wateratk_pre = "Wet","Chill","Icy","Frosted",...; wateratk_suf = "of Water","of Ice",...,"of Frost","of Winter"]
- **Lane impact:** L4/L7 (economy + loot) - corrects the survey's 'shipped bug' framing. Fire resistance rolling as 'Icy ... of Frost' is coherent design; a builder told it is a bug will 'fix' it and break 1:1 on every elemental-DEF affix name.

### `items-equipment/eleven-modifier-ids-unnamed` — PARTIAL [A2]

Eleven of the 34 distinct modifier ids used in itemdata.xml fall outside both XMLItem's 0..16 switch and its 101..1999 Set band, so they hit the trace("ErrorValue") branch and have no name.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:290-296; reference/extracted/itemdata.xml (own parse of all 412 <modifier> rows)`
- **Quote:** default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; } else { trace("ErrorValue: " + this.modifierXML[q].id); }   [unnamed ids present in itemdata.xml: 25, 38, 78, 79, 84, 90, 96, 97, 98, 99, 40000 -- 19 of 412 rows]
- **Lane impact:** L4/L7 -- corrects the survey's 'fully resolved'. 393 of 412 modifier rows are readable; 19 are not. Id 82 among them is the reserved USESMODID, so ~10 ids are genuinely unknown channels and must be labelled INFERRED if implemented.

### `items-equipment/frame-equipped-item-also-resolves` — HELD [A1]

Both items in the frame resolve to payload rows, and the selected one is UNIQUE across the whole roster: exactly one of 982 rows has mindamage 1 / maxdamage 2 (id 13002 'Branch'), and the pickaxe in the weapon box with (EQ: 1 - 3) is id 13022 name 4244 'Pickaxe', weight 10.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4 LANCZOS and crop (170,240)-(870,1040) upscaled x2 LANCZOS; matched to reference/extracted/itemdata.xml and docs/gauntlet/L0/index/strings.json`
- **Quote:** Visibly in the crops: header 'BRANCH', 'DMG: 1 - 2  (EQ: 1 - 3)' with the 2 red, 'WEIGHT: 1', and a brown-hafted pickaxe filling the weapon box of the paperdoll. Payload: id 13002 name 4041 -> 'Branch' mindamage 1 maxdamage 2 weight 1 (the ONLY 1-2 row in 982); id 13022 name 4244 -> 'Pickaxe' mindamage 1 maxdamage 3 weight 10.
- **Lane impact:** L5 + L4 — a two-item frame-to-payload identity rather than one, and the selected tile's grey (normal) border independently confirms the derived-rarity read: 13002 carries no <unique> and no modifiers, so getShopItemType() = 'normal'. Open sub-item: the 'LEVEL 1' label under the icon is NOT <minlvl> (13002 is -4) and Item.getLevel() returns 0 for a modifier-free Branch — its source is a SWF-embedded field not resolvable in the decompiled AS3.

### `items-equipment/full-modifier-id-table` — HELD [A2]

The complete runtime modifier-ID table adds ten channels to the XML-only one: 28-31 = Fire/Wind/Water/Earth ATK and 200-205 = Fire/Wind/Water/Earth DEF, Critical Damage, Piercing Damage; and ids 103-106 (82% of itemdata's modifier rows) are container contents, not stats.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1004-1053; ids at StatsManager.as:226-260; names at docs/gauntlet/L0/index/strings.json 507-510, 871-876`
- **Quote:** case 28: attribs += LangManager.getString(507);  … case StatsManager.STAT_PIERCINGDMG: attribs += LangManager.getString(876);  … case 103: case 106: itemxml = QuestEngine.getItemData(modArrayCheck[q].value); attribs += "- " + itemxml.displayname;   [507 'Fire ATK' … 875 'Critical Damage' 876 'Piercing Damage']
- **Lane impact:** L4/L7 — the elemental and crit/pierce affixes are 11 of the 17 generated channels; without these ids the tooltip renders them blank and mislabels 223 pack rows as 'Set: 103'.

### `items-equipment/generic-defense-floor-is-attackerlvl` — HELD [A2]

The generic post-defense damage floor is Damage.getMinDamage(), a four-band ladder keyed to attackerlvl (1 / lvl÷8 / lvl÷6 / lvl÷4, each + piercingDamage), applied immediately after 'damage -= getDefense()' at every damage-receipt site including the player's.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-170; call site reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418`
- **Quote:** public function getMinDamage() : int { if(this.damage == 0) { return 0; } if(this.attackerlvl == 0) { return this.damage; } if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; } if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; } if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; } return this.attackerlvl / 4 + this.piercingDamage; }  /  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — VINDICATES the ledger bullet the surveyor tried to delete. Encode the full four-band ladder keyed to the ATTACKER's level plus the piercing add-on; the ledger's 'EnemyLevel/4' is the >30 band written down. The separate playerLVL ladder the surveyor found (EnemyPlayer.as:107-123, duplicated in EnemySpearElite/EnemyWolfAlpha/EnemyKanjiGuardian/EnemyElite) is enemy HP auto-scaling and belongs to L3, not here.

### `items-equipment/generic-min-damage-floor-is-attacker-keyed` — HELD [A2]

The four-band min-damage floor is a GENERIC post-defense rule on the Damage object keyed to the attacker's level and applied on the player's damage-taking path in 9 files — which means the ledger's 'defense min-floor (EnemyLevel/4)' is the correct top band, not a wrong rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-172; MCSPlayer.as:3415-3419 and :3710-3712; grep damageObj.getMinDamage() -> 9 files`
- **Quote:** Damage.as:149 public function getMinDamage() : int { if(this.damage == 0) { return 0; } if(this.attackerlvl == 0) { return this.damage; } if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; } if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; } if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; } return this.attackerlvl / 4 + this.piercingDamage; }   /   MCSPlayer.as:3415 damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — this belongs in combat-core, not items. The ledger bullet stands and should be REFINED not replaced: attackerLvl<=10 -> 1, <=20 -> lvl/8, <=30 -> lvl/6, else lvl/4, each plus piercingDamage, applied immediately after 'damage -= getDefense()'. EnemyPlayer.as:107-123 is the boss-HP-sizing mirror of the same ladder, not a separate mechanic.

### `items-equipment/getweight-diverges-between-builds` — HELD [A2]

getWeight() — the input to the sell-price branch and to the carry-weight total — is NOT the same function in the two builds: web v0.717 adds a per-item weight term that Android v0.682 has no counterpart for.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1580 vs reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1975`
- **Quote:** Android: if(this.weight != -1) { return this.weight * this.getQuantity(); } ... return this.weight;   |   Web v0.717: if(this.weight != -1) { return (this.weight + this.§1t478s0§) * this.§1t484s0§(); } ... return (this.weight + this.§1t478s0§) * this.§1t484s0§();
- **Lane impact:** L4 (economy) + L5 (HUD weight bar) — a concrete instance of the S0-3 Android-parity caveat biting. getSellAmt is identical in both builds but its only branch reads a function that is not. Also: getWeight multiplies by QUANTITY, so the >=10 sell step is a stack threshold, not an item-weight threshold — ten weight-1 items sell at x10.

### `items-equipment/getweight-is-stack-weight-and-diverges` — HELD [A2]

getWeight() returns weight x QUANTITY, so the sell formula's `weight >= 10` step is stack weight, not the itemdata <weight> field — and the web build adds a weight-modifier term the Android build lacks.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as getWeight; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1948-1976`
- **Quote:** Android: public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... return this.weight; }   Web: public function §1t545s0§() : int { if(this.weight != -1) { return (this.weight + this.§1t478s0§) * this.§1t484s0§(); } ... return (this.weight + this.§1t478s0§) * this.§1t484s0§(); }
- **Lane impact:** L4 (economy) — getSellAmt is two-build-confirmed but its INPUT is not. A builder feeding the static <weight> column into `>= 10` gets the wrong branch for stacks, and gets the web build wrong for any item carrying a weight modifier. Also explains the frame's WEIGHT: 43 / 100 as a stack sum (the onigiri x3 contributes 3).

### `items-equipment/human-part-stack-is-23-not-27` — HELD [A2]

The human paperdoll layer stack is 23 deep, not 27: MCSCharacter allocates partList[0..22], and PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) exist only for MCSWolf, where they are front and back legs.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120 and :141; reference/decompiled/shs3_android/scripts/MCSWolf.as:13, :184, :188, :193, :197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  MCSWolf: super(); partListLength = 25; for(var i:int = 0; i <= partListLength; i++) {...}  /  var r_frontleg1:MovieClip = partList[PART_r_shoulder]; var l_frontleg1:MovieClip = partList[PART_l_shoulder]; var r_backleg2:MovieClip = partList[PART_r_knee]; var l_backleg2:MovieClip = partList[PART_l_knee];
- **Lane impact:** L6 (art/animation) — corrects the layer count a from-scratch equipment renderer must implement: 23 z-ordered containers for a human, with 23-26 being creature-only. Index==addChild z-order still holds for 0..22 (no setChildIndex/swapChildren touches the top-level partList; the six setChildIndex calls reorder inside a single part container). armor=7 parts and pants=5 parts both verified independently.

### `items-equipment/human-part-stack-is-23-not-27` — HELD [A2]

The human paperdoll z-order stack is 23 layers deep, not 27: MCSCharacter builds indices 0..22 only, and PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) are creature-rig indices read solely by MCSWolf.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :141-146, :56-62; MCSWolf.as:13, :184, :188, :193, :197`
- **Quote:** internal var partListLength:int = 22;   /   for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }   /   MCSWolf: partListLength = 25;  ...  var r_frontleg1:MovieClip = partList[PART_r_shoulder];  var l_backleg2:MovieClip = partList[PART_l_knee];
- **Lane impact:** L6 (art/animation) - code 23 z-layers for the fighter, not 27. Aside worth carrying: with partListLength=25 the wolf builds 26 clips (0-25) yet MCSWolf.as:193 reads partList[PART_r_knee] = index 26, an apparent off-by-one in the decompile or the original; do not copy that read blindly.

### `items-equipment/humanoid-stack-is-23-layers` — HELD [A2]

MCSCharacter allocates 23 render layers, not 27: partListLength is 22 and the constructor loops i <= partListLength, so PART_l_shoulder(23), PART_r_shoulder(24), PART_l_knee(25) and PART_r_knee(26) are never instantiated on a human — they are quadruped parts used only by MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120 and :141; readers at reference/decompiled/shs3_android/scripts/MCSWolf.as:13, :184, :188, :193, :197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  MCSWolf.as:13  partListLength = 25;  /  MCSWolf.as:184  var r_frontleg1:MovieClip = partList[PART_r_shoulder];
- **Lane impact:** L6 (art/animation) — code 23 z-ordered layers for the fighter paperdoll, indices 0..22 ending at PART_prop3. The four shoulder/knee indices belong to the creature rig only.

### `items-equipment/icon-art-is-a-separate-family` — HELD [A1]

Inventory icons are NOT just paperdoll part stacks: MCSItem uses two symbol families absent from the paperdoll — "item" for consumables (fallback class item0) and "acc" for accessories (fallback AccessoryDummyIcon) — plus eleven dedicated *DummyIcon placeholder artworks, four of which are visible in the frame.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (900,590)-(1640,960) upscaled x2 LANCZOS and crop (170,240)-(870,1040) upscaled x2 LANCZOS; code side reference/decompiled/shs3_android/scripts/MCSItem.as:203-216 and :226-233`
- **Quote:** Visibly in the (900,590)-(1640,960) crop: 7 inventory tiles of which 4 hold non-equipment art — a red/yellow scroll, a white onigiri with a green nori patch labelled 'X3', a black stone, a white feather. Visibly in the (170,240)-(870,1040) crop: four empty slot boxes rendering dedicated line-art placeholders — a red oni-mask outline, a pair of gauntlet outlines, and two ring outlines. Code: public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); ... }  /  public function set
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — blocker ⑤'s ICON half stays OPEN. The survey's 78 rests partly on 'the icon manifest turns out not to exist'; it does exist, as three separate authoring jobs: the `item<art>` consumable family, the `acc<art>` accessory family, and 11 DummyIcon placeholders. THE FRAME WINS over the document here: the surveyor graded from one AS3 method while a frame showing four non-equipment icons and four placeholder artworks was available.

### `items-equipment/icon-symbol-families-still-unheld` — STILL_UNHELD [A2]

Consumables and accessories render their inventory icons from two dedicated symbol families, `item<art>` and `acc<art>`, which have no PART_* body counterpart - so an item icon art set (~187 of ~983 roster rows, plus every accessory) remains unrecovered and ledger blocker (5)'s icon half is still open.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-225, :226-247, :406-437; corroborated by A1 reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2 LANCZOS`
- **Quote:** public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); addChild(this.displayItem); } ... }  /  public function setAccessory(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); addChild(this.displayItem); } ... }  /  visible in the crop: 7 inventory icons - branch, red-capped scroll, blue feather, onigiri x3, katana, black stone, white feather
- **Overturns:** "(5) **sprite-compositing contract** (layer order, per-slot body render - a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) - the icon half of blocker (5) must stay on the board. Counted this run: paperdoll-composited bands 4000/5000/6000/7000/8000/9000/10000/11000/12000/13000 = 795 rows; the remaining ~187 rows (band 2000=99, band 3000=9, band 20000 quest=79) plus both accessory slots need item*/acc* art that exists in no held artifact (the web payload exports only the fallback `item0.as`).

### `items-equipment/item-panel-level-caption-unsourced` — STILL_UNHELD [A1]

The item detail panel renders a 'LEVEL 1' caption under the icon that no formula in the Android build reproduces — Item.getLevel() returns 0 for the Branch (id 13002) and its levelrestriction is -4.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (980,480)-(1200,540) upscaled x5 LANCZOS; code checked against reference/decompiled/shs3_android/scripts/Item.as:274-299, :1101-1104, :1299-1304 and reference/extracted/itemdata.xml:7906-7915`
- **Quote:** Visibly in the crop: the words "LEVEL 1" in the game UI font, centred beneath the Branch item tile. Code: getLevel() = max(levelrestriction, max over modifiers of getModTier(id,val)+1) clamped to levelCap; for id 13002 there are no modifiers and levelrestriction = -4, giving 0. Both 'Level Required' render sites are gated on itemlevel > 0 and would not fire.
- **Lane impact:** L5 (UI/HUD) — a small items-owned on-screen number the survey did not address. THE FRAME WINS: the caption is on screen regardless of what the Android v0.682 code computes, so either the display clamps to a minimum of 1 or the web v0.717 build diverges here. Flag it as open rather than porting getLevel() straight to the panel.

### `items-equipment/item-panel-level-row-unexplained` — PARTIAL [A1]

The web v0.717 item panel renders a 'LEVEL n' row under the item icon that has no counterpart in the Android v0.682 source, and for the frame's Branch the Android formula would produce 0, not the 1 on screen.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (575,240)-(880,540) region of the middle panel (I read it at x2 from the (170,240)-(870,1040) and full-frame passes): 'BRANCH' / icon / 'LEVEL 1'; against reference/decompiled/shs3_android/scripts/XMLItem.as:128-134, Item.as:274-298, InventoryUI.as:228-236 and :1453-1462`
- **Quote:** Visibly in the frame: the item name 'BRANCH', the branch icon, and the label 'LEVEL 1' beneath it. Code side: XMLItem.as:130 `this.levelrestriction = xml.minlvl;` (= -4 for id 13002); Item.getLevel() with zero modifiers gives maxlevel 0, then `if(lvl < baselevel) lvl = baselevel;` is 0 < -4 = false, so it returns 0. InventoryUI's itemPanel exposes only selectItem, selectItemName, selectItemAttribute and chatbutton — no level field.
- **Lane impact:** L5 (UI/HUD) — THE FRAME WINS over the Android measurement path. The item panel needs a fourth field the Android decompile does not describe, and its formula is unheld. Held: the label exists and reads 'LEVEL 1' for an unmodified Branch. Unheld: what computes it. This also bounds the survey's 'cleanest frame-to-payload identity' claim to name/DMG/weight.

### `items-equipment/mcs-human-partlist-is-23-not-27` — HELD [A2]

MCSCharacter allocates 23 z-ordered part MovieClips (indices 0..22) for a human, not 27; PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) are declared but never instantiated and are used only by quadruped subclasses.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :141-146, :56-62; reference/decompiled/shs3_android/scripts/MCSWolf.as:188 and :197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  public static var PART_l_shoulder:* = 23; ... PART_r_knee:* = 26;  /  MCSWolf.as:188  var l_frontleg1:MovieClip = partList[PART_l_shoulder];
- **Lane impact:** L6 (art/animation) — the human paperdoll z-stack is 23 deep. Building 27 layers produces 4 permanently empty layers and, worse, invites treating the shoulder/knee indices as human parts when they belong to the wolf/quadruped rig. Note the type tell: 0-22 are `:int`, 23-26 are `:*`.

### `items-equipment/mcs-partlist-is-23-layers` — HELD [A2]

The MCS render stack instantiates 23 layers (indices 0-22), not 27: PART_l_shoulder 23, PART_r_shoulder 24, PART_l_knee 25 and PART_r_knee 26 are declared but never used anywhere in the corpus.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:56-62, :120, :141-146 (grep for the four constants returns only their declarations)`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
- **Lane impact:** L6 (art) — build 23 layers; also note setArmor drives 8 parts (neck included, conditionally) and EQ_ACCESSORY1 renders into PART_prop2 (21) via StatsManager.as:3330.

### `items-equipment/modifier-rows-are-mostly-set-ids` — PARTIAL [A2]

Only 47 of the 412 <modifier> rows in itemdata.xml (11%) resolve to a named stat channel; 344 rows (83%) fall in the 101-1999 Set band and render as the literal string 'Set: <id>', and 19 rows across 11 distinct ids resolve to nothing and hit the trace("ErrorValue") branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 (the switch) evaluated against my parse of all 412 <modifier> rows in reference/extracted/itemdata.xml (34 distinct ids)`
- **Quote:** Unmapped by the table, with row counts: 25 x1, 38 x6, 78 x2, 79 x2, 84 x2, 90 x1, 96 x1, 97 x1, 98 x1, 99 x1, 40000 x1 = 19 rows / 11 distinct ids. Set-band (101-1999) = 344 rows. Stat switch (0-16) = 47 rows. Code: default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; } else { trace("ErrorValue: " + this.modifierXML[q].id); }
- **Lane impact:** L4/L7 (economy + loot) — the modifier table is transcribed but the DATA is not thereby readable: the dominant channel is set membership (344 rows), which needs a separate set-bonus table that no one has looked for, and 11 ids shipped in the data have no handler at all.

### `items-equipment/nine-ui-boxes-are-the-nine-stat-bearing-slots` — HELD [A2]

The 9 paperdoll boxes are not an arbitrary UI subset of the 13-slot model — they are exactly the 9 slots that grant stats, with the two ring boxes resolved as EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right), and EQ_NECK carrying no box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :261-269, :460-535; StatsManager.as:1944 (findBonusStat) and :1983 (findWeight); frame reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **Quote:** InventoryUI.as:163-179  SLOT_HAT 0 · SLOT_MASK 1 · SLOT_ARMOR 2 · SLOT_GLOVES 3 · SLOT_PANTS 4 · SLOT_WEAPON 5 · SLOT_RING1 6 · SLOT_SHOES 7 · SLOT_RING2 8   /   :268-269 this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1; this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;   /   :460 for(var i:int = 0; i < 9; i++)   /   StatsManager.findBonusStat: for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && !(skipWeapon && q == EQ_WEAPON)) {
- **Overturns:** "**Ready:** 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) + L6 (art) — closes the surveyor's only STILL_UNHELD UI item and corrects their '9 UI boxes over a 13-slot model, loses hair/head/scabbard' to FOUR hidden slots (hair, head, neck, scabbard), all cosmetic-only. The SLOT_ index order 0..8 is literally the frame's reading order, box for box — an independent frame-to-code lock. Shipped asymmetry to carry: findWeight skips only HEAD/NECK/SCABBARD, so hair carries weight but grants no stats.

### `items-equipment/paperdoll-ui-slot-mapping-resolved` — HELD [A2]

The two visually identical ring boxes in the 9-box paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2 (named SLOT_RING1/SLOT_RING2 in source); EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD have no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:520-533, plus the dummy-icon roster in reference/decompiled/shs3_android/scripts/ (8 slot-dummy classes, no Neck/Hair/Head/Scabbard dummy)`
- **Quote:** case 7: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; if(tempItem.getItemID() == 0) { this.acc1Icon.visible = true; } tempShopItem = this.equippedSlots[this.SLOT_RING1]; break; case 8: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2]; if(tempItem.getItemID() == 0) { this.acc2Icon.visible = true; } tempShopItem = this.equippedSlots[this.SLOT_RING2];
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item and fixes the 13-vs-9 delta: the four model-only slots are HAIR, HEAD, NECK, SCABBARD. The paperdoll switch has exactly 9 cases (0..8), matching the frame's 9 boxes, so the whole slot map is now codeable.

### `items-equipment/part-stack-is-23-not-27` — PARTIAL [A2]

MCSCharacter declares 27 PART_ constants but only instantiates 23 layers and only ever indexes 22 — PART_l_shoulder(23), PART_r_shoulder(24), PART_l_knee(25) and PART_r_knee(26) are dead names that would index past the end of partList.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :120, :141-146; grep 'partList[PART_*]' over the same file -> 22 distinct indices used`
- **Quote:** MCSCharacter.as:120 internal var partListLength:int = 22;   /   :141 for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }   /   :54 PART_prop3:* = 22; :56 PART_l_shoulder:* = 23; :58 PART_r_shoulder:* = 24; :60 PART_l_knee:* = 25; :62 PART_r_knee:* = 26;
- **Lane impact:** L6 (art/animation) — corrects the survey's headline '27-entry z-ordered PART_* enum'. Build 23 z-layers (indices 0-22); 22 are ever populated (PART_prop3 is allocated but never referenced). Shipping 27 layers gives four dead ones and an out-of-range index if anything uses the shoulder/knee names.

### `items-equipment/pickaxe-frame-payload-identity` — HELD [A1]

The equipped weapon in the same frame also resolves to a payload row: itemdata id 13022 "Pickaxe", mindamage 1, maxdamage 3, weight 10 -- matching both the pickaxe visible in the weapon slot and the on-screen "(EQ: 1 - 3)".

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1040) upscaled x2 LANCZOS (weapon box) and crop (1320,240)-(1620,320) upscaled x4 (tooltip); matched to reference/extracted/itemdata.xml item id 13022 via docs/gauntlet/L0/index/strings.json`
- **Quote:** Visibly in the crops: a pickaxe (tan haft, grey head) filling the weapon slot box, and the tooltip line "DMG: 1 - 2 (EQ: 1 - 3)". Payload: id 13022 -> "Pickaxe", mindamage 1, maxdamage 3, weight 10 -- the only 1-3 weapon that is a pickaxe (13001 "Stick" and 13003 "Bamboo" are the other 1-3 rows, both weight 1).
- **Lane impact:** L5 (UI/HUD) + L4 -- a SECOND frame-to-payload identity in the same screenshot, this time on the equipped side. Also confirms the weight-10 sell branch is reachable on a starter item, and that weapon13002.as (the Branch) is one of only 21 part classes actually exported.

### `items-equipment/placeholder-icon-art-set` — HELD [A2]

There IS a small item-icon art set to author: 8 *DummyIcon symbols for inventory misses plus 9 per-slot empty-box icons in the paperdoll, the latter directly visible as the ghosted mask/gauntlet/ring outlines in the frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:70,95,126,158,183,232,255,285,330,368 + InventoryUI.as:459-540; frame reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS`
- **Quote:** this.displayItem = new HatDummyIcon(); … new MaskDummyIcon(); … new WeaponDummyIcon(); … new AccessoryDummyIcon(); … new GlovesDummyIcon(); … new ShoesDummyIcon(); … new ArmorDummyIcon(); … new PantsDummyIcon();  /  if(tempItem.getItemID() == 0) { this.maskIcon.visible = true; }
- **Lane impact:** L6 (art) — a bounded 17-symbol authoring task that the 'no icon manifest' finding would have dropped.

### `items-equipment/prog-spike-and-dead-slashusage` — HELD [A2]

Two implementation traps in the survey's own numbers: the +10 end-spike applies to prog1/prog2/prog3 only (SPEED and PIERCINGDMG have none), and the single <slashusage>24</slashusage> row is dead because getSlashUsage floors anything below 48 to 48 in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183; reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1928; reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2352-2359`
- **Quote:** this.prog1[MAXINDEX] += 10; ... this.prog2[MAXINDEX] += 10; ... this.prog3[MAXINDEX] += 10;   [no += 10 after the prog4 or prog5 loops]  /  internal static function getSlashUsage() : int { var itemdata:XMLItem = ...; if(itemdata == null || itemdata.slashusage < 48) { return 48; } return itemdata.slashusage; }
- **Lane impact:** L4/L7 (loot magnitudes) and L1 (reach) — a builder applying the +10 spike to all five progression arrays overshoots SPEED and PIERCINGDMG at tier 79, and one implementing slashusage=24 as a fast weapon implements a value the shipped game clamps away.

### `items-equipment/removeparts-leaks-prop3` — HELD [A2]

MCSCharacter.removeParts() never clears partList[22] (PART_prop3) — its loop starts at partListLength - 1 = 21, one short of the highest allocated index.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:245-258 against :120 and :141`
- **Quote:** for(var i:* = int(this.partListLength - 1); i >= 0; i--) { mc = this.partList[i]; childmax = mc.numChildren; for(j = 0; j < childmax; j++) { this.partList[i].removeChildAt(0); } this.partList[i].cacheAsBitmap = false; }   [partListLength = 22; the constructor allocates 0..22]
- **Lane impact:** L6 (art) — an OG behaviour, not a recreation choice: a second prop attached at PART_prop3 persists across a character rebuild. A from-scratch renderer that correctly clears all 23 slots will visibly diverge from the videos in any scene where prop3 is used.

### `items-equipment/ring-slots-are-accessory1-and-2` — HELD [A2]

The two identical ring boxes are EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right), not EQ_NECK; and the 9 UI boxes are exactly the 9 stat-bearing slots, because findBonusStat skips EQ_HEAD, EQ_NECK, EQ_SCABBARD and EQ_HAIR.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-181, :268-269, :522-535; reference/decompiled/shs3_android/scripts/StatsManager.as:1944-1946`
- **Quote:** internal var SLOT_HAT:int = 0; SLOT_MASK 1; SLOT_ARMOR 2; SLOT_GLOVES 3; SLOT_PANTS 4; SLOT_WEAPON 5; SLOT_RING1 6; SLOT_SHOES 7; SLOT_RING2 8; internal var totalEquippedSlots:int = 9;  /  this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1; this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;  /  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; ... tempShopItem = this.equippedSlots[this.SLOT_RING1];  /  for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && !(skipWeapon && q == EQ_WEAPON))
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD on this system and upgrades the ledger's '9-slot paperdoll' from a frame reading to a code constant (totalEquippedSlots = 9). The 4 model-only slots (hair, head, neck, scabbard) are cosmetic and grant NO stat bonuses.

### `items-equipment/roster-art-absent-from-both-exports` — PARTIAL [A2]

The per-item vector art for the 982-row roster is confirmed absent from BOTH decompiled script exports: each contains exactly the same 21 MCS part classes, i.e. the naked defaults plus three extras.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ and reference/decompiled/shs3_android/scripts/, filtered to ^(torso|stomach|uparm|lowarm|pelvic|crotch|thigh|calf|foot|foottop|hand|hair|hat|head|mask|neck|weapon|prop)[0-9]+\.as$`
- **Quote:** 21 files in each, identical set: calf11000 crotch11000 foot12000 foottop12000 hair6000 hair6001 hand5000 hat7000 head8000 head8004 lowarm4000 mask9000 neck10000 pelvic4000 prop13000 stomach4000 thigh11000 torso4000 uparm4000 weapon13000 weapon13002
- **Lane impact:** L6 (art) -- quantifies the survey's residual STILL_UNHELD. The naming CONTRACT is held and 21 symbols are held; ~961 are not. Next lead is S0-5's encrypted 115_Mobile_SHS3Resource / 124_Mobile_ImageResource, reached via getMCSComponent's StatsManager.useExternalResource branch. No recovery claim is made.

### `items-equipment/second-icon-art-family-item-and-acc` — HELD [A2]

A fifth of the item roster gets its inventory icon from two symbol families with NO paperdoll counterpart — `item####` (consumables and quest items) and `acc####` (accessories) — so the 'icon manifest' half of blocker 5 is a live art blocker, not a category error.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:134-200; MCSItem.as:203-247; my parse of reference/extracted/itemdata.xml (982 rows); ls reference/decompiled/shs3_payload/scripts/`
- **Quote:** ShopItem.as:146 else if(this.itemID < 3000 && this.itemID > 1999) { this.itemMCS.setConsumable(this.itemID); }   :150 else if(this.itemID < 4000 && this.itemID > 2999) { this.itemMCS.setAccessory(this.itemID); }   :192 else if(this.itemID < 30000 && this.itemID >= 20000) { this.itemMCS.setConsumable(this.itemID); }   :178 else if(!(this.itemID < 11000 && this.itemID > 9999))   /   MCSItem.as:206 this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); }   :229 this.displayItem = this.getMCSComponent("acc",id);
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — reinstates the icon-manifest blocker the survey closed. Measured scope: id bands 2xxx=99 + 3xxx=9 + 20xxx=79 = 187 of 982 rows (19%) need item/acc art, and the 14 rows in the 10xxx neck band are explicitly excluded by ShopItem.as:178 and get no icon call at all. The web payload holds one such class (item0.as) and zero acc*.as — the default, not the set. Corroborated visually: the frame's inventory row shows a scroll, a rice ball, a stone and a feather, none of which is a body part.

### `items-equipment/sell-price-reads-stack-weight` — HELD [A2]

getSellAmt's weight>=10 test reads stack weight, not row weight, because getWeight() multiplies by quantity — so ten weight-1 items in one stack each sell at x10 instead of x5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1568 (getWeight) feeding Item.as:1582-1593 (getSellAmt); web divergence at reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1974`
- **Quote:** public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... }  /  web v0.717: return (this.weight + this.§1t478s0§) * this.§1t484s0§();
- **Lane impact:** L4 (economy) — a port that evaluates the >=10 threshold on the XML row's <weight> mis-prices every stack. Also note the web build adds a weight-modifier term the Android build lacks, so the sell formula's INPUT is not cross-build identical even though its body is.

### `items-equipment/sell-weight-is-stack-weight-and-builds-diverge` — HELD [A2]

The weight>=10 branch of the sell formula reads STACK weight (base x quantity), and the web v0.717 build adds a per-item weight-modifier term that the Android v0.682 build does not have.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1568; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1974; sole call site ShopUI.as:401`
- **Quote:** Android: public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... return this.weight; }  /  Web v0.717: public function §1t545s0§() : int { if(this.weight != -1) { return (this.weight + this.§1t478s0§) * this.§1t484s0§(); } ... return (this.weight + this.§1t478s0§) * this.§1t484s0§(); }  /  ShopUI.as:401 slot.setCost(slot.getItem().getSellAmt(),0);
- **Lane impact:** L4 (economy) — the sell formula itself is identical across builds, but its input is not: implementing 'weight >= 10' as per-item weight puts a stack of ten weight-1 items on the wrong branch (5c/unit instead of 10c/unit). This is the first concrete instance of the S0-3 Android/web parity caveat biting on a combat-adjacent number, and it should be labelled per-build. ShopUI.as:401 being the only call site is also what proves there is no shop-side level multiplier.

### `items-equipment/sell-weight-test-is-stack-weight` — HELD [A2]

getSellAmt's `getWeight() >= 10` step tests STACK weight, not unit weight, because getWeight() multiplies by quantity.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1571 and :1582-1593`
- **Quote:** public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... }
- **Lane impact:** L4 (economy) — a stack of ten weight-1 items crosses the >=10 threshold and sells at the x10 tier. Implementing the formula on unit weight produces a different consumable economy. Moot for id<3000 (short-circuits to 1) but live for the 79-row 20xxx quest/trade band.

### `items-equipment/setarmor-drives-8-parts` — HELD [A2]

One armor equip drives EIGHT part slots, not seven: torso, stomach, l_uparm, r_uparm, l_lowarm, r_lowarm, pelvic AND neck — and PART_neck is shared with setNeck, so it can hold two children.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:915-1088 (declaration block at :917-924, neck attach at the tail of setArmor) and :795-813 (setNeck)`
- **Quote:** var neck:MovieClip = this.partList[PART_neck]; ... componentObject = this.getMCSComponent("neck",id); ... neck.addChild(componentObject); neck.cacheAsBitmapMatrix = neck.transform.concatenatedMatrix;  /  setNeck: if(neck.numChildren > 1) { neck.removeChildAt(1); } if(neck.numChildren > 0) { neck.removeChildAt(0); }
- **Lane impact:** L6 (art) — the armor art set needs a neck/collar symbol per item, an 8th piece the survey's part budget omits. The removeChildAt(0) prologue in setArmor covers only 7 parts (neck excluded), which is the trap that produces a 7-count; setNeck's two-deep clear proves the slot is deliberately shared.

### `items-equipment/stancerestriction-is-dead-data` — HELD [A2]

<stancerestriction> is parsed and printed in a description string in the Android build and never read at all in the web build — there is no stance gate to implement.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:30,172-178 (only occurrences); reference/decompiled/shs3_android/scripts/XMLItem.as:38,160-166,321-327 (only occurrences)`
- **Quote:** if(param1.stancerestriction.toString() != "") { this.stancerestriction = param1.stancerestriction; } else { this.stancerestriction = 0; }   [web: no further reference]  /  Android: if(this.stancerestriction > 0) { … this.desc += LangManager.getString(125) + ": " + this.stancerestriction; }
- **Lane impact:** L1 (combat core) — removes a phantom weapon/stance restriction from the combat plan; the 53 rows are display text only.

### `items-equipment/two-ring-slots-are-accessory1-and-2` — HELD [A2]

The two visually identical empty ring boxes in the paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2, not EQ_NECK: MCSItem — the slot-icon renderer — declares 11 setters and none of them is setNeck, so EQ_NECK has no UI-box renderer at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:64, :89, :120, :152, :177, :203, :226, :249, :279, :324, :362 (the complete setter list); setNeck exists only at reference/decompiled/shs3_android/scripts/MCSCharacter.as:795 and MCSBust.as:47`
- **Quote:** MCSItem setters, complete: setHat(:64) setHair(:89) setHead(:120) setMask(:152) setWeapon(:177) setConsumable(:203) setAccessory(:226) setGloves(:249) setShoes(:279) setArmor(:324) setPants(:362). No setNeck. And setAccessory is the only one that draws a repeatable identical empty box: this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); }
- **Lane impact:** L5 (UI/HUD) — closes the survey's only open UI question. The 9 boxes map to hat, mask, armor, gloves, pants, weapon, accessory1, shoes, accessory2; EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD render on the body but have no paperdoll box.

### `items-equipment/ui-slot-map-resolved` — HELD [A2]

The nine paperdoll boxes map exactly to HAT, MASK, ARMOR, GLOVES, PANTS, WEAPON, ACCESSORY1(left ring), SHOES, ACCESSORY2(right ring) — declaration order equals screen reading order — and EQ_NECK is not a UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :519-540 (cross-checked against reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS)`
- **Quote:** internal var SLOT_HAT:int = 0; SLOT_MASK 1; SLOT_ARMOR 2; SLOT_GLOVES 3; SLOT_PANTS 4; SLOT_WEAPON 5; SLOT_RING1 6; SLOT_SHOES 7; SLOT_RING2 8;  /  case 7: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; tempShopItem = this.equippedSlots[this.SLOT_RING1];  case 8: … EQ_ACCESSORY2 … SLOT_RING2
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item; the paperdoll can be laid out and wired without guessing.

### `items-equipment/ui-slot-mapping-resolved` — HELD [A2]

The nine paperdoll boxes are an explicit ordered constant table in InventoryUI, and the two ring boxes are EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right); EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD have no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-181, :261-269, :522-535; frame corroboration reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) upscaled x2 LANCZOS`
- **Quote:** internal var totalEquippedSlots:int = 9;  /  SLOT_HAT=0 SLOT_MASK=1 SLOT_ARMOR=2 SLOT_GLOVES=3 SLOT_PANTS=4 SLOT_WEAPON=5 SLOT_RING1=6 SLOT_SHOES=7 SLOT_RING2=8  /  this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1; this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;  /  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; ... tempShopItem = this.equippedSlots[this.SLOT_RING1]; ... tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2]; ... tempShopItem = this.equippedSlots[this.SLOT_RING2];
- **Overturns:** "**Ready:** 9-slot paperdoll;"
- **Lane impact:** L5 (UI/HUD) — refutes the survey's only UI STILL_UNHELD and additionally confirms the ledger's '9-slot paperdoll' from code, not just from a frame. The SLOT_ index order reproduces the frame's reading order exactly (hat,mask / armor,gloves / pants,weapon / ring,shoes,ring), so the box layout is fully specified. Bonus from the same block (:475,:493): item IDs 4000 and 4001 (armor) and 11001 (pants) are treated as empty and draw the placeholder icon — the naked-default ITEM ids, which are not the same list as the naked-default ART ids.

### `items-equipment/uses-zero-is-a-never-wears-sentinel` — HELD [A2]

uses == 0 is a sentinel meaning the item never degrades, not 'brand new': gotUsed() returns immediately when uses==0 and repair() clamps to a floor of 1, so 0 is unreachable once an item has ever worn — which is why the ladder's first branch is 'Unbreakable'.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1419-1424 (gotUsed), :1439-1449 (repair), :712-724 (ladder head)`
- **Quote:** public function gotUsed(num:int = 1) : * { if(this.uses == 0) { return; } ... this.uses += num; }  /  public function repair(num:int) : * { if(this.uses == 0) { return; } this.uses -= num; if(this.uses <= 0) { this.uses = 1; } }  /  if(this.uses == 0) { conditionStr = LangManager.getString(639); } else if(this.uses == 1) { conditionStr = LangManager.getString(392); }   [639='Unbreakable', 392='Condition: Well-Maintained']
- **Lane impact:** L5 (UI/HUD) + items — a builder who initialises fresh items to uses=0 makes every item permanently Unbreakable. Fresh wearable items must start at uses=1 ('Well-Maintained'); uses=0 is reserved for the unbreakable class.

### `items-equipment/weapon-ladder-minlvl-coverage-and-prog-spike` — PARTIAL [A2]

Two arithmetic corrections to the stat-vs-level claim: <minlvl> is present on only 122 of the 158 weapon rows, and the +10 top-tier spike applies to prog1/prog2/prog3 only — prog4 (speed) and prog5 get none.

- **Cite:** `my parse of reference/extracted/itemdata.xml (982 <item>, 158 with <mindamage> all type 9, 122 of those with <minlvl>); reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183`
- **Quote:** ItemGenerator.as:157 this.prog1[MAXINDEX] += 10;   :164 this.prog2[MAXINDEX] += 10;   :171 this.prog3[MAXINDEX] += 10;   — and NO corresponding line after the prog4 loop (:172-178) or the prog5 loop (:179-183).
- **Lane impact:** L4/L7 — a builder copying 'the complete 158-row ladder, minlvl -4..79' finds 36 rows with no level anchor and must pick a default; copying 'the +10 spike at index 79' to all five progressions inflates top-tier speed rolls.

### `items-equipment/web-build-has-a-fifth-name-colour-band` — HELD [A2]

The web v0.717 build colours xp-bearing items #ff9900 (loot toast) / #ff6600 (inventory) in a branch placed ABOVE the unique tier — a fifth band the Android v0.682 build does not have at all, because the Android Item class has no xp field.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:42, :677-681, :698-701; reference/decompiled/shs3_android/scripts/Item.as:415-451 (no xp branch; `grep -c xp Item.as` -> 0)`
- **Quote:** internal var xp:§1t98s0§ = null;  /  if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; } else if(_loc5_ != null && _loc5_.unique == 1 || ...) { _loc1_ += "<font color=\"#b048f8\">"; }  /  else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) — the survey says the web cross-check 'removes the S0-3 Android-parity caveat' for the tier colours; it is the reverse. The 1:1 target build has FIVE name-colour bands, not four, and xp-bearing items (an entire item concept absent from the Android class) sit at the top.

### `items-equipment/web-build-has-fifth-item-colour` — HELD [A2]

The web v0.717 build carries a FIFTH item-name colour state that the Android v0.682 build does not have: #ff9900 in the loot toast and #ff6600 in the inventory, both gated on the item carrying xp.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677-679, :698-700 (also :767, :834); Android absence: grep -c "ff9900\|ff6600" reference/decompiled/shs3_android/scripts/Item.as -> 0`
- **Quote:** if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; }  ...  else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) -- the item colour ladder is FIVE states in the web build, not four. Directly contradicts the survey's claim that the tier colours 'remove the S0-3 Android-parity caveat'; per S0-3 the ported palette must stay labelled as Android-sourced plus this web-only delta.

### `items-equipment/web-build-has-fifth-item-colour-tier` — HELD [A2]

The shipping web build v0.717 has a fifth, highest-precedence item colour state gated on an `xp` member - #ff9900 in the loot palette and #ff6600 in the inventory palette - that does not exist anywhere in the Android v0.682 Item class.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:42, :679, :700 vs reference/decompiled/shs3_android/scripts/Item.as:417-451 (grep for `this.xp` and `ff9900|ff6600` returns zero hits)`
- **Quote:** internal var xp:§1t98s0§ = null;   /   _loc1_ += "<font color=\"#ff9900\">";   /   else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) - the item colour ladder is FIVE states in the target build, not four. Any port that takes its colour table from the Android decompile ships a missing tier. This is also the concrete proof that S0-3's Android-parity caveat must stay attached to every items claim sourced from shs3_android.

### `items-equipment/web-build-has-fifth-name-colour` — HELD [A2]

The web v0.717 build carries a name colour the Android v0.682 build does not: an orange #ff6600 branch gated on 'this.xp != null', sitting between the loot-dialog palette and the inventory palette.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:698-701; absent from reference/decompiled/shs3_android/scripts/Item.as:417-451`
- **Quote:** else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) — five name-colour states in the web build, not four, and the S0-3 Android-parity caveat is NOT fully removed for item colours. Any port graded against the videos (which are the web build) needs the #ff6600 XP-item state.

### `items-equipment/web-only-xp-item-colour` — HELD [A2]

The web v0.717 build has a FIFTH item-name colour state the Android v0.682 build lacks entirely — #ff9900 in the loot palette and #ff6600 in the inventory palette, keyed on the item carrying xp.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677 and :700; absent from reference/decompiled/shs3_android/scripts/Item.as:407-450 and from a tree-wide grep of all 559 Android scripts`
- **Quote:** Web: if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; }  ...  else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }   |   Android getName() has no xp branch in either palette; `grep -rn "ff9900\|ff6600"` over shs3_android/scripts returns nothing.
- **Lane impact:** L5 (UI/HUD) — disproves the survey's claim that the Android-parity caveat is discharged for item colours. Five states per palette in the shipped web build, four in Android. Since the reference videos are the WEB build, a recreation copying Android silently drops the colour an xp-bearing (soul) item displays in.

### `items-equipment/web-save-format-has-modifier-id-206` — HELD [A2]

The web v0.717 item wire format reserves a sixth non-stat modifier ID, 206, carrying the item's XP/soul payload; the Android v0.682 Item class defines no such ID, so an Android-shaped save string is not byte-compatible with the shipping build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:18, :119, :187, :304, :350, :429 vs reference/decompiled/shs3_android/scripts/Item.as:6-16`
- **Quote:** public static var §1t8739s0§:int = 206;   /   _loc2_ += §1t8739s0§ + "@" + this.xp.§1t697s0§() + "#";   [Android reserves only: PCOLORMODID 80, SCOLORMODID 81, USESMODID 82, NAMEMODID 89, CREATORMODID 125]
- **Lane impact:** L10 (persistence/save) - the item schema is still worth copying, but it must be taken from the web build: id 206 (xp) is a required field there. A second omission in the same area: Item.copyModifiers (Item.as:317-330) blacklists modifier IDs 85, 86, 87 and 88 from ever transferring, which no claim in the survey mentions.

### `meta-social/clan-crops-resource` — HELD [A1]

An entire clan-economy resource -- 'clan crops', a per-clan stockpile with HQ-derived income and per-clan deltas -- appears in the war-room UI and in the web payload, and is in no claim and no ledger row.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0015.jpg (x3 LANCZOS) + reference/extracted/ui_strings.txt:248 and :211`
- **Quote:** On screen in frame_0015, top-left of the war-select panel: 'CLAN CROPS: 402 (+2 HQ)'. WEB v0.717 payload placeholders: ui_strings.txt:248 'clan crops: 130 *(+1 hq)' and :211 'aka ryu crops: +2bob crops: -2'.
- **Lane impact:** L0 meta-social -- another system the 31/100 was never scored over; income scales with the number of Command HQs a clan holds, which couples it directly to the war-room build economy.

### `meta-social/clan-pays-five-coins-per-move` — HELD [A2]

The war rulebook states a per-move coin income neither the ledger nor the lane records: the clan pays the player 5 coins for every war move made.

- **Cite:** `docs/gauntlet/L0/index/strings.json id 372 (from reference/extracted/android/118_Mobile_Lang_EN.bin), rendered by WarRules.as:100-101 as war-rules page 2`
- **Quote:** String 372, final line printed in full: "- the clan will pay the player 5 coins per move made." Same string also states "- the effect of moves is dependent on the terrain. mountains have the highest tactical advantage, followed by forests and fields.", which independently corroborates WarTerrain.as:9-13 FIELD=0 / FOREST=1 / MOUNTAIN=2 and therefore the sign convention of getTerrainModifier.
- **Lane impact:** L0 meta-social / L-economy — closes the war-move income side of the loop; the lane costs moves at 500 coins each but never credits the 5-coin payout.

### `meta-social/desktop-v0717-decompile-was-on-disk-unopened` — HELD [A2]

The repo holds a DESKTOP v0.717 decompile at reference/decompiled/shs3_payload/ that is LARGER than the Android one (1,079 classes indexed / 652 script files vs 970 / 559) and is listed in the lane's own evidence index, yet the entire lane was sourced from the Android 0.682 build and papered over with version caveats.

- **Cite:** `docs/gauntlet/L0/index/actionscript.json (bundles: shs3_payload 1079, shs3_android 970) + reference/decompiled/shs3_payload/scripts/ (652 .as files)`
- **Quote:** actionscript.json bundles block: "shs3_android": 970, "shs3_payload": 1079. Concrete deltas I confirmed by opening both: (1) §1t7924s0§.as:23 `internal var max:int = 7;` with `:121-123 case 7: getString(11016)/(11017)` vs Android WarRules.as:23 `max:int = 6` — so the frame's 1/7 is confirmed by the target build and no frame-vs-doc conflict ever existed; (2) §1t7785s0§.as:2123 adds `&& this.§1t7807s0§.owner != this.§1t7812s0§` to the barricade guard that Android's WarHexUI.as:2285 lacks; (3) §1t1523s0§.as:364 expArray is byte-identical to Android's (99 entries, a[79]=4025800); (4) §1t1523s0§.as
- **Lane impact:** L0 meta-social, and every other L-lane that sourced from shs3_android — most Android caveats are dischargeable in minutes, but one quoted line (the barricade owner guard) is wrong for v0.717 and one claim (offline gold faucet) is unconfirmable in the target build. Re-run the lane against shs3_payload before raising the score.

### `meta-social/enemy-remap-second-witness` — HELD [A2]

The 4-clan to NPC-id-block mapping has a second, unrelated witness in the client, making it a build-wide convention rather than a war-room quirk.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:362-381 vs WarHexUI.as:1736-1751`
- **Quote:** InteractUI.as:365 `this.bust.initMCSFromNPCID(247);` for clanId 1, :370 `(447)` for 2, :375 `(347)` for 3, :380 `(547)` for 4 -- the same +200/+400/+300/+500 side offsets as the survivalmodedata remap. Note also the remap guard the survey's quote omits: WarHexUI.as:1733 `if(tempid >= 200 && tempid < 600)`, which is why the 700-block samurai are never remapped.
- **Lane impact:** L0 meta-social + L-enemies-ai -- the clan->NPC block mapping can be treated as a global rule, and the 700-block exclusion explains why the 11 named samurai are shared across all four sides.

### `meta-social/filmed-build-is-neither-artifact` — HELD [A1]

The build shown in the longplay is NOT reference/extracted/payload.xml (web v0.717) and NOT the Android decompile — its war-rules dialog has 7 pages and Android-family prose, while the v0.717 payload has 6 pages with completely different wording, so every 'it came from the WEB build, no version caveat' upgrade in this lane is provisional.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg, crop (60,20)-(300,45) upscaled x10 LANCZOS; cross-checked against reference/extracted/payload.xml:528040-528084`
- **Quote:** Visibly on screen: 'ROOM RULES 1/7  (JOINING A BATTLE)' and body 'IS A CLAN-BASED STRATEGY GAME WITHIN STRAW HAT SAMURAI: DUELS. / A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN.' — versus payload.xml:528044 (characterID 745, initialText, tags stripped): '1) pick a side.2) select a battle to join.3) select the sector with your side's castle HQ and select the "MOVE" action to enter the battlefield.' and payload.xml:528040/528048/528056/528064/528072/528080 titles 'War room rules 1/6' … '6/6' (characterIDs 744-755 = six title/body pairs). Over the 329 MB payload.xml: '1/7' 0 hits,
- **Lane impact:** L0 meta-social, and lane-wide — this is the calibration fact for every ported string and number in L0: reference/extracted/ is an older revision than the filmed build for at least the war-room UI. It also caps the meta-social score below 78.

### `meta-social/rank-ladder-a1-confirmed` — HELD [A1]

The rank ladder, its first threshold and the one-hour turn are all rendered by the live v0.717 client, upgrading the survey's A2-only rank claim to A1.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0015.jpg (whole frame x3 LANCZOS) and frame_0019.jpg`
- **Quote:** frame_0015 bottom-left: 'ALLEGIANCE: CLAN AKA RYU / RANK: RECRUIT (3 MOVES A TURN) / MOVES MADE: 0/36', bottom-right '3 MOVE(S) LEFT'; frame_0019 bottom-right 'NEXT TURN IN 59:58'. Matches getWarRank rank 0 = string 330 'recruit', getMaxWarMoves(0) = 3, the 12*3 = 36 threshold, and WARMOVEINTERVAL = 60*60. Note the WEB authoring placeholder reference/extracted/ui_strings.txt:215 reads 'allegiance: AKA RYU clanrank: soldier (3 moves a turn)moves made: 15/60' -- THE FRAME WINS: shipped v0.717 renders 'recruit' and '/36', so the placeholder's 'soldier' and '/60' must not be ported.
- **Lane impact:** L0 meta-social -- the 11-rank ladder moves from decompile-only to frame-confirmed, and flags a trap in ui_strings.txt that a text-only pass would have copied.

### `meta-social/side-to-clan-is-direct-not-inferred` — HELD [A2]

The side-number to clan binding is a literal switch in two independent files, not an inference from Japanese colour words — and the same files reproduce the side to npc-id-block map from a second site.

- **Cite:** `reference/decompiled/shs3_android/scripts/PlayerPanel.as:424-438 and InteractUI.as:362-380`
- **Quote:** PlayerPanel.as: `switch(side){ case 1: … LangManager.getString(275)); case 2: … getString(276)); case 3: … getString(277)); case 4: … getString(278)); }`. InteractUI.as: `if(clanId == 1){ clanName = LangManager.getString(275); this.bust.initMCSFromNPCID(247); } else if(clanId == 2){ … getString(276); … initMCSFromNPCID(447); } else if(clanId == 3){ … getString(277); … initMCSFromNPCID(347); } else if(clanId == 4){ … getString(278); … initMCSFromNPCID(547); }` — the 247/447/347/547 busts reproduce WarHexUI's +200/+400/+300/+500 side→block remap exactly.
- **Lane impact:** L0 meta-social + L-enemies-ai — upgrades the clan claim from a colour-word inference to direct code proof, and double-sources the 4-clan → NPC-id-block mapping.

### `meta-social/survivalmode-web-android-diverge` — HELD [A3]

Web and Android survivalmodedata are NOT identical: 14 of 87 enemy rows differ in composition, even though wave count and total quantity match exactly.

- **Cite:** `byte-check + row diff: reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Quote:** web 11721 B sha256 709d94cb28c08ba1… / andr 11553 B sha256 b56f8c6a028357c4… / identical: False. Both parse to 39 waves and 87 <enemy> rows summing to 351. Rows 73-86 differ, e.g. web `<id>449|454|449|454|443</id> <qty>3</qty>` vs android `<id>449|454</id> <qty>3</qty>`; likewise for the 450|455 and 451|456 blocks. Web pools include npc 443 and duplicated ids; Android drops both.
- **Lane impact:** L0 meta-social + L-enemies-ai — the 351 total is build-independent, the enemy MIX is not; any wave table built for 1:1 must be sourced from the web blob, not the Android one.

### `meta-social/survivalmode-web-vs-android-differ` — HELD [A3]

The war-room wave table is NOT identical between builds: 14 lines differ after CRLF normalisation, and the web v0.717 late waves draw from a wider enemy pool than Android's.

- **Cite:** `byte-check: reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Quote:** web 11,721 B sha256 709d94cb28c08ba1 / andr 11,553 B sha256 b56f8c6a028357c4 / identical: False. After replacing CRLF with LF: 11,166 vs 10,998 bytes, same 556 lines, 14 differing. Web `<id>449|454|449|454|443</id>` where Android has `<id>449|454</id>`; likewise 450|455 and 451|456. Totals identical in both: 39 waves, 87 <enemy>, 351 total <qty>, {400-block 340, 700-block 11}.
- **Lane impact:** L0 meta-social and L-enemies-ai — the kill cap of 351 is safe, but the enemy MIX of the late war-room waves must be read from the web file; NPC 443 is web-only.

### `meta-social/war-boss-npcs-unresolvable` — STILL_UNHELD [STILL_UNHELD]

The 11 singleton war-room boss spawns (npc ids 700-710) resolve to nothing — no name, no stats, no art binding anywhere on disk — so the war-room battle content is not fully held.

- **Quote:** reference/extracted/npcdata.xml npc ids run 0..656 then jump to 800..819 — no 7xx row exists. Regex `<id>70[0-9]</id>|<id>710</id>` over reference/extracted/android/125_Mobile_NpcData.bin returns 0 hits. docs/gauntlet/L0/index/resolved_names.json npcdata.xml.resolved returns None for 700 through 710. They appear only as `<enemy><id>700</id><qty>1</qty><x>-50</x></enemy>` style rows in bindata/119 waves 1,3,5,7,9,…
- **Lane impact:** L0 meta-social and L-enemies-ai — 11 of the war-room battle's 39 waves are gated on unknown boss entities; calling them 'named samurai' is the §2.1 numeric-ID failure.

### `meta-social/warrules-page3-frame` — HELD [A1]

Page 3 of the 7-page war-room rulebook is on screen and renders Android string 374 word-for-word -- a second, independent string-table calibration point.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0013.jpg (whole frame, 512x288 upscaled x3 LANCZOS)`
- **Quote:** 'WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)' over: '- WHEN YOU SELECT THE "ATTACK" OR "DEFEND" ACTION, YOU WILL PERSONALLY FIGHT AGAINST THE ENEMY TROOPS. / - IF ENEMY PLAYERS ARE PRESENT IN THE SECTOR, YOU WILL ALSO ENCOUNTER THEM DURING BATTLE. / - DEFEATING ENEMY PLAYERS WILL REMOVE THEM FROM THE SECTOR AND KICK THEM OFF THE BATTLEFIELD.' with PREVIOUS/NEXT buttons -- identical to strings.json id 374.
- **Lane impact:** L0 meta-social -- shows the only web/Android delta on rules pages 1-6 is the '/7' vs '/6' suffix inside the title strings, so android 369-380 can be ported for pages 1-6 with a suffix edit.

### `meta-social/web-barricade-bonus-owner-gated` — HELD [A2]

In v0.717 the +2 defensive terrain penalty for a completed Barricade applies only when the barricade belongs to an ENEMY; the Android build applies it regardless of owner.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2123 vs reference/decompiled/shs3_android/scripts/WarHexUI.as:2285`
- **Quote:** web :2123 `if(this.§1t7807s0§.hextype == §1t416s0§.§1t12527s0§ && this.§1t7807s0§.cost == 0 && this.§1t7807s0§.owner != this.§1t7812s0§ || ... HEX_CITY || ... HEX_CASTLE)`; android :2285 `if(this.selectedHex.hextype == WarHex.HEX_DEFENSE && this.selectedHex.cost == 0 || ... HEX_CITY || ... HEX_CASTLE)`. §1t7812s0§ is playerside -- it is the side argument passed to setWarHex at :1109 and to getRandomEnemy at :1122.
- **Lane impact:** L0 meta-social -- your own completed barricade does not penalise your deploys in v0.717; implementing the Android condition would make friendly Barricades self-harming.

### `meta-social/web-barricade-guard-stricter` — HELD [A2]

The web v0.717 terrain-modifier guard is stricter than the Android line the survey quoted: a completed Barricade gives no +2 defence step against its own owner.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2123 vs reference/decompiled/shs3_android/scripts/WarHexUI.as:2287`
- **Quote:** web §1t7785s0§.as:2123 `if(this.§1t7807s0§.hextype == §1t416s0§.§1t12527s0§ && this.§1t7807s0§.cost == 0 && this.§1t7807s0§.owner != this.§1t7812s0§ || … §1t12530s0§ || … §1t12531s0§){ _loc2_ += 2; }` — the Android line at WarHexUI.as:2287 is the same expression WITHOUT `&& owner != playerside`.
- **Lane impact:** L0 meta-social — a recreation copying the Android condition would over-buff deploys onto friendly barricades. Everything else in the switch (1.5/1.2/1/0.75/0.6/0.5/0.25) is identical across builds.

### `meta-social/web-troop-cap-50000` — HELD [A2]

v0.717 hard-caps a single side's troop strength in one hex at 50,000; the Android build has no such cap.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2179-2186 (grep -n 50000 reference/decompiled/shs3_android/scripts/WarHexUI.as returns nothing)`
- **Quote:** :2181 `_loc3_ = this.§1t7807s0§.§1t7776s0§(this.§1t7812s0§) + param2;` :2182 `if(_loc3_ > 50000)` :2184 `_loc3_ = 50000;` then :2186 `this.§1t7807s0§.§1t7774s0§(this.§1t7812s0§,_loc3_);`
- **Lane impact:** L0 meta-social -- a war-sim ceiling in no claim and no ledger row; any offline AI war sim needs it or troop counts diverge from the original at scale.

### `meta-social/web-warrules-max-7` — HELD [A2]

The WEB v0.717 WarRules class exists and declares max = 7 with case 7 reading string ids 11016/11017 -- the desktop code agrees with the frame, so no standing-invariant adjudication was ever needed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23,121-123 (located via grep -rln "warruleswords" reference/)`
- **Quote:** :23 `internal var max:int = 7;` and :121 `case 7:` :122 `this.warrulestitle.text = §1t1521s0§.getString(11016);` :123 `this.warruleswords.text = §1t1521s0§.getString(11017);`. Pages 1-6 use the identical ids 369-380 as android WarRules.as:93-119.
- **Lane impact:** L0 meta-social -- supplies the missing cite for the survey's 11016/11017 assertion and corrects its methodology note; the page-7 body stays unrecoverable because the web LangManager loads strings over the network (§1t1521s0§.as:63-77, './data/' or server+'strings/').

### `progression/a02-second-frame-corroboration` — HELD [A4]

A second, independent frame confirmation of the WEB per-point magnitudes exists at level 3 in the video study and was not used: A-02's own budget arithmetic closes exactly on +10 HP / +3 stat per point, discharging that segment's INFERRED hedge.

- **Cite:** `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24-25 (frame-backed, t=07:35–07:45 of video A), reconciled against reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445`
- **Quote:** A-02:24  'Three resource bars with + allocate buttons: HP 20/20, CHI 10/10, AP 30/30'
A-02:25  'Observed progression: ATK 4→7, DEF 4+2→7+2 (i.e. DEF base 4→7 too), SPD 1→4 … AVAILABLE STAT POINTS: 3 (ticks down to 1, then 0) … treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm'
Budget check at level 3: grant = (3-1)*3 = 6. Already spent = HP 10→20 (1 pt @ +10) + ATK 1→4 (1 pt @ +3) + DEF 1→4 (1 pt @ +3) = 3. 3 spent + 3 available = 6 exactly. Android magnitudes (+5 HP, +1 stat) cannot produce it.
- **Lane impact:** L4 — two frames at two different levels (A-02 L3, and the t=1600 L4 crop) independently confirm the same web per-point table, so progression/per-point-magnitudes rests on more than one reading. A-02 line 25's 'treat exact point-to-stat ratio as INFERRED' can now be closed as CONTRACT.

### `progression/android-caps-also-drifted` — HELD [A2]

The Android build's per-stat CAP formulas are drifted in lockstep with its per-point magnitudes (HP *5 not *10, AP 20+(L+10) not 30+(L+10)*5, ATK/DEF/SPD L+10 not 1+(L+10)*3), proving the divergence is a deliberate mobile re-tune of the whole stat economy rather than decompiler noise.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2407-2412 vs reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Quote:** InventoryUI.as:2407-2412  this.statsPanel.HPadd.visible = StatsManager.getStat(StatsManager.STAT_MAXHP) < 10 + (charlevel + 10) * 5; … this.statsPanel.APadd.visible = StatsManager.getStat(StatsManager.STAT_MAXAP) < 20 + (charlevel + 10); this.statsPanel.ATKadd.visible = StatsManager.getStat(StatsManager.STAT_ATTACK) < charlevel + 10;
- **Lane impact:** L4: independent corroboration that progression/per-stat-hard-caps picked the right build. At Android L80 the ATK ceiling would be 90, not 271 — port the WEB cap formula. Gauntlet-wide: hardens S0-3's parity caveat from 'not established' to 'measurably violated in the stat economy'.

### `progression/autoassign-android-only` — HELD [A2]

The autoAssignStats round-robin the unit surfaces as a newly-found level-up mechanic exists ONLY in the Android v0.682 build — the web v0.717 levelUp has no such branch, and the feature's own magnitudes are the Android tuning this same unit proved the frame refutes.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082 (complete web levelUp) vs reference/decompiled/shs3_android/scripts/StatsManager.as:1655-1687, :322, :586 and InventoryUI.as:313, :2376, QueryManagerBase.as:3091/:3171`
- **Quote:** Web §1t9577s0§ in full: '§1t9713s0§(§1t9418s0§,1); §1t9713s0§(§1t9419s0§,3); §1t9712s0§(§1t9411s0§,getLevel()); §1t9578s0§(); §1t9712s0§(§1t9414s0§,§1t7356s0§(§1t9415s0§)); §1t9712s0§(§1t9416s0§,§1t9400s0§);' — six statements, no autoAssign branch. `grep "new Array(§1t9403s0§" §1t1523s0§.as` returns no match. Android-only support surface: StatsManager.as:322 'public static var autoAssignStats:Boolean = false;', InventoryUI.as:313 'this.autoAssignCheckBox.setCheck(StatsManager.autoAssignStats);', QueryManagerBase.as:3171 'sharedObject.data.autoAssignStats = StatsManager.autoAssignStats;'.
- **Lane impact:** L4 progression: strike autoAssignStats from the port list or label it ANDROID-ONLY. Its round-robin grants changeStat(stat,5) HP and changeStat(stat,1) ATK/DEF/SPD — the exact magnitudes progression/per-point-magnitudes proved the frame refutes — so porting it would inject a non-existent feature carrying refuted numbers. This is the S0-3 parity trap the unit identified in claim 5 and then walked into in claim 11.

### `progression/autoassign-is-android-only` — HELD [A2]

The autoAssignStats round-robin the survey surfaced as a progression sub-system does not exist in the WEB v0.717 build at all — it is an Android-port convenience feature, and porting it would import Android's wrong per-point magnitudes with it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082 (the complete web levelUp) vs reference/decompiled/shs3_android/scripts/StatsManager.as:322, :586, :1655-1688`
- **Quote:** WEB levelUp in full — eight statements, no statBucket, no branch:
public static function §1t9577s0§() : void { §1t9713s0§(§1t9418s0§,1); §1t9713s0§(§1t9419s0§,3); §1t9712s0§(§1t9411s0§,getLevel()); §1t9578s0§(); §1t9712s0§(§1t9414s0§,§1t7356s0§(§1t9415s0§)); §1t9712s0§(§1t9416s0§,§1t9400s0§); §1t3317s0§.instance.§1t1530s0§(§1t9673s0§); §1t406s0§.instance.§1t6578s0§(); }
Grep for the six-stat statBucket array across the whole web payload: zero hits. Android StatsManager.as:322 "public static var autoAssignStats:Boolean = false;" and its bucket at :1657 grants +5 MAXHP / +5 MAXCHI / +1 everythin
- **Lane impact:** L4: strike autoAssignStats from the progression board, or label it ANDROID-ONLY (v0.682). It is listed unlabeled in progression/levelup-refill-and-cap's lane_impact and would otherwise reach config carrying the exact per-point numbers this lane just proved wrong for the web build.

### `progression/autoassign-is-android-only` — HELD [A2]

The autoAssignStats round-robin level-up mode is ANDROID-ONLY — the web v0.717 levelUp has no such block — so it must not be ported as an original-game feature.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2073-2082 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1654-1687`
- **Quote:** Web §1t1523s0§.as:2073-2082 (entire levelUp body): §1t9713s0§(§1t9418s0§,1); §1t9713s0§(§1t9419s0§,3); §1t9712s0§(§1t9411s0§,getLevel()); §1t9578s0§(); §1t9712s0§(§1t9414s0§,§1t7356s0§(§1t9415s0§)); §1t9712s0§(§1t9416s0§,§1t9400s0§); … — no autoAssignStats branch anywhere. Android StatsManager.as:1654 'if(autoAssignStats)' with statBucket = new Array(STAT_MAXHP,STAT_MAXCHI,STAT_ATTACK,STAT_DEFENSE,STAT_SPEED,STAT_MAXAP).
- **Lane impact:** L4: corrects the lane_impact note on progression/levelup-refill-and-cap. The rest of that claim IS web-parity and was undersold — web :2078 refills AP from MAXAP, :2079 refills duel tokens, and the levelCap cheat-report exists in web at :2043.

### `progression/elemental-damage-bypasses-def` — HELD [A2]

Defense is subtracted from the physical damage term only — fire, wind, water and earth damage are added after the min-damage floor and are never mitigated by DEF; and a behead multiplies x1.5 after the floor too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484-3489 and reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418, :3709-3718`
- **Quote:** MCSPlayer.as:3415-3418  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
MCSPlayer.as:3714-3718  if(behead) { damage *= 1.5; }  setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
§1t99s0§.as:3489  _loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_;
- **Lane impact:** L4 completeness on the DEF claim, and a CROSS-LANE GIFT to L1 combat-core: stacking DEF has zero effect on elemental builds, which is a real balance property of the original, not an approximation.

### `progression/getlevel-pins-cumulative-cap-semantics` — HELD [A2]

getLevel()'s strictly-greater comparison is a payload witness for the cumulative-cap semantics that src/core/xp.ts currently justifies from frames alone — reaching a cap exactly finishes the level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2007-2020; pins the behaviour asserted in tests/xp.test.ts > levelForXp — current level for a cumulative XP total > crosses to the next level exactly AT each cap (bar full = level done)`
- **Quote:** public static function getLevel() : int { var _loc1_:int = §1t7356s0§(§1t8755s0§); var _loc2_:int = 0; while(_loc2_ < 99) { if(§1t5923s0§[_loc2_] > _loc1_) { return _loc2_; } _loc2_++; } return 1; }  — at xp=550, expArray[1]=550 is NOT > 550, so it falls through to expArray[2] and returns 2
- **Lane impact:** L4: src/core/xp.ts's level semantics can be relabeled CONTRACT (payload-backed) instead of frame-INFERRED. Note the tail behaviour differs by build — web returns 1 on overflow, android returns 99 (StatsManager.as:1596) — so do not port android's tail.

### `progression/kill-xp-never-validated-on-screen` — STILL_UNHELD [STILL_UNHELD]

The kill-XP model is held as code but has never been reconciled with the one on-screen kill-XP delta in the footage (+52 XP at player level 10), and no plausible parameterisation of calcXP reproduces 52.

- **Quote:** Attempted reconciliation (player level 10 ⇒ greyLevel 4, zeroDifference 7): regular mob L6 → int(32×(1−4/7)) = 13, elite 27; duellist L6 → int(75×(1−4/7)) = 32, elite 64; duellist L8 elite = 120. None yields 52. The enemy's true level/type/elite flag and any active XP buff are not established from a frame — the study doc's 'Bandit level 6' is explicitly attributed to a DIFFERENT bandit encounter, and I could not locate the nameplate in the combat window I extracted.
- **Lane impact:** L4 + L7 economy: keeps one honest validation gap on the board against progression/xp-income-model. The fix is cheap and specific — crop the enemy nameplate during the video-B forest bandit duel (~t=1:00:35–1:00:59) to read the mob's level and elite/boss status, then re-run calcXP. Until then the kill-XP branch is payload-held but frame-unvalidated, unlike the quest branch which IS now frame-validated at 473.

### `progression/level-10-scroll-xp-item` — HELD [A2]

A fourth XP source exists and is tabled: item 2201 'Level 10 Scroll' carries two STAT_XP modifiers (-1,000,000 then +25,900) that floor XP to zero and set it to expArray[9], plus a full stat+skill respec — an independent payload-internal proof that 25,900 is the level-10 boundary.

- **Cite:** `reference/extracted/itemdata.xml:2284-2305; consumed at reference/decompiled/shs3_android/scripts/InventoryUI.as:906; STAT_XP id 9 at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:222`
- **Quote:** itemdata.xml:2284-2305  <item><id>2201</id><type>10</type><name>4131</name><baseprice>0</baseprice><heavenlyprice>2</heavenlyprice><desc>4137</desc><modifier><id>9</id><value>-1000000</value></modifier><modifier><id>9</id><value>25900</value></modifier><modifier><id>78</id></modifier><modifier><id>79</id></modifier></item>  — resolved: 'Level 10 Scroll' / 'Use this to become level 10'
§1t1523s0§.as:222  internal static const §1t8755s0§:int = 9;   (STAT_XP)
InventoryUI.as:906  StatsManager.changeXP(item.modifierXML[i].value);
- **Lane impact:** L4 — adds an item-modifier XP channel to the income model the survey did not list, and confirms expArray[9]=25900 from a second, independent place in the payload (getLevel() returns the first q with expArray[q] > XP, so XP=25900 reads as level 10). Cross-lane to L7 economy: 2 heavenly gold, undercutting the Amnesia Scroll's 5.

### `progression/level10-scroll-validates-xp-table` — HELD [A2]

The payload validates its own XP table without any frame: the 'Level 10 Scroll' sets cumulative XP to 25,900, which is exactly expArray[9] — confirming both the L1-L10 values and the cumulative-threshold semantics (hitting a cap finishes that level).

- **Cite:** `reference/extracted/itemdata.xml:2284-2302; reference/decompiled/shs3_android/scripts/StatsManager.as:188 and :1612-1617; InventoryUI.as:902-906; names via docs/gauntlet/L0/index/strings.json 4131/4137`
- **Quote:** itemdata.xml:2284-2302  <id>2201</id> <name>4131</name> <desc>4137</desc> <heavenlyprice>2</heavenlyprice> <modifier><id>9</id><value>-1000000</value></modifier> <modifier><id>9</id><value>25900</value></modifier>   |   StatsManager.as:188 'internal static var STAT_XP:int = 9;'   |   InventoryUI.as:904-906 'if(modid == 9) { StatsManager.changeXP(item.modifierXML[i].value); }'   |   strings 4131 = 'Level 10 Scroll', 4137 = 'Use this to become level 10'
- **Lane impact:** L4: a payload-internal cross-check of the XP curve that depends on no frame and no video reading. The game asserts cumulative XP 25,900 => level 10, and expArray[9] = 25,900, so it independently confirms the L1-L10 table AND the semantics already encoded in src/core/xp.ts (level N holds while xpThreshold(N-1) <= totalXp < xpThreshold(N)). Worth banking as a second, fully independent line of evidence for the curve.

### `progression/levelcap-const-vs-var` — HELD [A2]

levelCap is declared const in the web build but var in the Android build, which is the one structural reason the levels 81-99 question stays honestly open rather than being closable as dead data.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 vs reference/decompiled/shs3_android/scripts/StatsManager.as:76`
- **Quote:** §1t1523s0§.as:362  public static const §1t9470s0§:int = 80;
StatsManager.as:76  public static var levelCap:int = 80;
- **Lane impact:** L4: strengthens (does not weaken) the STILL_UNHELD verdict on progression/levels-81-99. The web build could not raise its cap at runtime; the mobile build could, so the 18 unused expArray entries may have been live headroom for a server-side raise. Still do not port 81-99 as reachable.

### `progression/paid-level-skip-item` — HELD [A2]

A premium level-skip item exists — 'Level 10 Scroll', 2 heavenly gold — that zeroes XP and sets it to expArray[9] = 25900, independently confirming the cumulative-threshold semantics the config encodes.

- **Cite:** `reference/extracted/itemdata.xml:2283-2305 + docs/gauntlet/L0/index/strings.json 4131 / 4137 + reference/decompiled/shs3_android/scripts/InventoryUI.as:903-906`
- **Quote:** itemdata.xml:2283-2305  <item><id>2201</id><type>10</type><name>4131</name><baseprice>0</baseprice><heavenlyprice>2</heavenlyprice><desc>4137</desc><modifier><id>9</id><value>-1000000</value></modifier><modifier><id>9</id><value>25900</value></modifier>
strings.json 4131 = 'Level 10 Scroll' · 4137 = 'Use this to become level 10'
InventoryUI.as:904-906  if(modid == 9) { StatsManager.changeXP(item.modifierXML[i].value); }
- **Lane impact:** L4 + L7: a paid progression skip on the board. Its value 25900 = expArray[9] is a payload-side proof that a character is level N once totalXp reaches expArray[N-1] — the exact semantics src/core/xp.ts already implements, previously only frame-inferred.

### `progression/per-point-plus3-direct-frame-proof` — HELD [A1]

One stat point grants +3 to ATK/DEF/SPD, proved directly on screen by a single-click delta rather than by budget reconstruction: at t=456 the panel reads STAT POINTS 3 with SPD 1, and at t=459 it reads STAT POINTS 2 with SPD 4.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4, own ffmpeg extracts -ss 456 / 459 / 462, crop=iw*0.62:ih*0.42:iw*0.36:ih*0.09 (no upscale needed, the stats modal is large in frame)`
- **Quote:** t=456 visibly: 'AVAILABLE STAT POINTS: 3', ATK 4, DEF 4 + 2, SPD 1, HP 20/20, CHI 10/10, AP 30/30, XP 1502/2950, badge 3. t=459 visibly: 'AVAILABLE STAT POINTS: 2', ATK 4, DEF 4 + 2, SPD 4 — exactly one point spent, SPD moved 1 -> 4. t=462 visibly: 'AVAILABLE STAT POINTS: 0', ATK 7, DEF 7 + 2, SPD 4 — the remaining two points took ATK 4->7 and DEF 4->7.
- **Overturns:** "likely +1 stat point grants +3 to the underlying stat ... treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm"
- **Lane impact:** L4: upgrades progression/per-point-magnitudes from an indirect budget reconstruction (which must assume the whole spend history) to a directly observed single-click delta, and kills the android +1 model on the frame alone. It also supplies a second, independent budget proof at a DIFFERENT level from the surveyor's: at t=462 the character is level 3, budget (3-1)*3 = 6, and the web magnitudes cost exactly (20-10)/10 + 0 + 0 + (7-1)/3 + (7-1)/3 + (4-1)/3 = 1+0+0+2+2+1 = 6, while android magnitudes give 17. FRAME vs DOC, and the frame wins: docs/research/video-study/segments/A-02-...md:25 asked for exactly this frame-by-frame replay and left the ratio INFERRED; the replay is now done, so the ratio is CONTRACT and that INFERRED flag can be cleared with an A1 cite rather than the A2 one the journal used.

### `progression/rebirth-pays-heavenly-gold` — HELD [A2]

Rebirth's payout is STAT_HGOLD (stat id 12, the premium 'heavenly' currency that itemdata's <heavenlyprice> is denominated in), not STAT_GOLD (stat id 11).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194, :2201-2208`
- **Quote:** StatsManager.as:192 'internal static var STAT_GOLD:int = 11;' · :194 'internal static var STAT_HGOLD:int = 12;' · :2201-2208 'if(getPlayerStats(STAT_DAN) == 8) { changeStat(STAT_HGOLD,20); } else { changeStat(STAT_HGOLD,5); }'
- **Lane impact:** L4/L5: corrects the lane_impact note on progression/levelup-refill-and-cap, which called it '+5 gold'. Rebirth hands out premium currency — the same currency that gates the Amnesia Scroll — which is a materially different economic fact from a soft-gold payout. L5 rebirth-elements and L7 economy should take the corrected version.

### `progression/respec-costs-premium-gold` — HELD [A2]

Respec is not free: it is delivered only by the 'Amnesia Scroll', a unique item priced at 5 HEAVENLY gold (premium currency) with a coin baseprice of 0, i.e. unbuyable with coins.

- **Cite:** `reference/extracted/itemdata.xml:2267-2281 + reference/decompiled/shs3_android/scripts/InventoryUI.as:983-991 + docs/gauntlet/L0/index/strings.json entries 4130 / 4136`
- **Quote:** itemdata.xml:2267-2281  <item><id>2200</id><type>10</type><name>4130</name><unique>1</unique><baseprice>0</baseprice><heavenlyprice>5</heavenlyprice><weight>0</weight><desc>4136</desc><modifier><id>78</id></modifier><modifier><id>79</id></modifier>
InventoryUI.as:985-990  if(modid == 78) { StatsManager.unAssignStatPoints(); } else if(modid == 79) { StatsManager.unAssignSkillPoints(); }
strings.json 4130 = 'Amnesia Scroll' · 4136 = 'Use this to unassign your stat and skill points.'
- **Lane impact:** L4: corrects progression/start-pools-and-respec. L7 economy: a premium-currency sink sitting on the progression system — heavenly gold is the same STAT_HGOLD that doRebirth() pays out at +5 (or +20 at Dan 8), so respec and rebirth share one currency loop.

### `progression/respec-costs-premium-gold` — HELD [A2]

The stat/skill respec is not free: its only in-data trigger is the unique premium-currency consumable item 2200 'Amnesia Scroll' at heavenlyprice 5 / baseprice 0, dispatched through item-modifier ids 78 and 79.

- **Cite:** `reference/extracted/itemdata.xml:2267-2282; reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991; XMLItem.as:94-96, ShopUI.as:393, Item.as:359`
- **Quote:** itemdata.xml:2267-2282  <item><id>2200</id><type>10</type><name>4130</name><unique>1</unique><baseprice>0</baseprice><heavenlyprice>5</heavenlyprice><desc>4136</desc><modifier><id>78</id></modifier><modifier><id>79</id></modifier></item>  — resolved: 'Amnesia Scroll' / 'Use this to unassign your stat and skill points.'
InventoryUI.as:984-991  if(modid == 78) { StatsManager.unAssignStatPoints(); } else if(modid == 79) { StatsManager.unAssignSkillPoints(); }
Item.as:359  return itemxml.hvalue > 0;   (hvalue <- heavenlyprice via XMLItem.as:96; priced by ShopUI.as:393 setCost(value,hvalue))
- **Lane impact:** L4 — corrects progression/start-pools-and-respec. Respec must be modelled as a unique premium-gold (STAT_HGOLD) consumable gate, not a free UI action. Cross-lane to L7 economy: baseprice 0 means it is not coin-purchasable at all, and doRebirth pays exactly +5 HGOLD (StatsManager.as:2207) — one rebirth funds exactly one respec.

### `progression/respec-is-premium-gated` — HELD [A2]

The respec is not free: it is delivered only by item 2200 'Amnesia Scroll', a unique item with baseprice 0 and heavenlyprice 5, i.e. purchasable only with the premium currency.

- **Cite:** `reference/extracted/itemdata.xml:2267-2280; reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991; names via docs/gauntlet/L0/index/strings.json 4130/4136`
- **Quote:** itemdata.xml:2267-2280  <id>2200</id> <type>10</type> <name>4130</name> <unique>1</unique> <baseprice>0</baseprice> <heavenlyprice>5</heavenlyprice> ... <modifier><id>78</id></modifier> <modifier><id>79</id></modifier>   |   InventoryUI.as:984-991  if(modid == 78) { StatsManager.unAssignStatPoints(); } else if(modid == 79) { StatsManager.unAssignSkillPoints(); }   |   strings 4130 = 'Amnesia Scroll', 4136 = 'Use this to unassign your stat and skill points.'
- **Lane impact:** L4: corrects progression/start-pools-and-respec. The stat economy is premium-gated and consumable-limited, not costlessly re-rollable — porting it as a free respec button would materially change stat commitment. Cross-lane to L7 economy (a premium sink) and L5 rebirth-elements.

### `progression/second-xp-curve-web-only` — PARTIAL [A2]

A second literal progression curve exists in the web payload only — an 11-entry array [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000] driving five parallel non-character tracks in the same XP-bar widget, capped at level 5, and absent from the Android build entirely.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30, branch logic at :331-347, consumers at §1t24s0§.as:1124-1128 and :1824-1844; absence confirmed by grep over reference/decompiled/shs3_android/scripts/`
- **Quote:** §1t29s0§.as:30  public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];
§1t29s0§.as:336-347  if(param1 == §1t24s0§.§1t8755s0§) { if(_loc2_ == §1t1523s0§.§1t9470s0§) { return 1; } return (_loc3_ - §1t5923s0§[_loc2_ - 1]) / §1t5923s0§[_loc2_]; } if(_loc2_ == 5) { return 1; } return (_loc3_ - §1t12498s0§[_loc2_]) / §1t12498s0§[_loc2_ + 1];
§1t24s0§.as:28 public static const §1t8754s0§:int = 7;  (seven bar slots; slot 0 = STAT_XP, slots 1-5 fed from §1t12498s0§ at §1t24s0§.as:1124-1128)
grep -rn "300,900,2100" reference/decompiled/shs3_android/scripts/ 
- **Lane impact:** L4 — a progression sub-system in the FILMED build that no ledger system mentions and the survey did not surface. The curve and its cap-at-5 branch are held; which five tracks it drives is not yet identified. Flag as a lead for L4/L5, and note it is another web-only feature absent from android (the reverse direction of the S0-3 caveat).

### `progression/slash-length-settles-balanced-reach` — PARTIAL [A4]

The SPD slash-length formula reconciles with a frame measurement the combat lane declared unresolvable: at SPD 1 it returns 124 stage px, landing inside the frame-measured level-1 Balanced plateau of 116–131 — so Balanced ≈ ×1.0 base, and the wiki's Balanced 200 is refuted.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md §c-2 (reach-per-stance table, method 'distance from the player's body to the far end of the drawn stroke, counting only strokes whose near end starts within 30 px', n=17 Balanced) combined with reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347`
- **Quote:** §c-2: '| **Balanced** | 116–131 | **131** | 17 | 200 | ❌ **NOT CONFIRMED** — measured 131 |' and 'The Balanced gap cannot be resolved from this footage. The *only* Balanced combat in either video is the level-1 tutorial fight'. Payload §1t1523s0§.as:2346-2347: 'var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));' → at SPD 1, Dan 0: 120 + floor(90/21) = 124.
- **Lane impact:** L1 combat-core blocker ① : the cross-lane gift is no longer just a lead — it is frame-corroborated at the one stance/level where a measurement exists. STANCE_TABLE's Balanced entry should become 124 at SPD 1 and track 120 + 90·spd/(20+spd), not the wiki's 200. Corroborated by strings.json 6005 (Heavy: 'slash range is shorter'), matching measured Heavy 97–103 < Balanced 116–131. CARRY THIS CAVEAT: §S24-H's re-run REFUTED the older 775 px / '≈413 stage px' reading at COMBAT_MEASUREMENTS.md:221 ('No normal-anatomy stroke >280 px anywhere re-checked; the 775 refutation REPRODUCED') — reconcile against the §S24-H-corrected figures, never :221. Left PARTIAL because Light/Heavy multipliers and the stage-px unit domain are still unverified.

### `progression/spent-points-audit-second-witness` — HELD [A2]

A second, structurally independent WEB witness for both the start pools and the per-point magnitudes: a spent-points audit whose divisors are the magnitudes and whose subtrahends are the start pools.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3450-3457`
- **Quote:** _loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) - 10) / 10;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) - 10) / 5;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) - 30) / 5;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) - 1) / 3;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9409s0§) - 1) / 3;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9410s0§) - 1) / 3;
_loc1_ += §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9419s0§);
- **Lane impact:** L4: raises the per-point table (HP+10/Chi+5/AP+5/ATK,DEF,SPD+3) and the start pools (10/10/30/1/1/1) from single-witness to triple-witness — the click handlers, this audit, and the frame budget arithmetic all agree, all within the WEB payload. Ready to land in config as CONTRACT.

### `progression/start-pools-third-frame` — HELD [A4]

A third, level-2 frame-backed reading independently confirms the virgin base stats including the ATK/DEF/SPD = 1 the unit added, and a fourth observation (A-02) had already inferred the +3-per-point ratio the payload now proves.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md:203 §H-1 (tagged MEASURED, carries its own frame cite 'A t≈152 PLAYER screen, re-read at full resolution') and docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:25`
- **Quote:** §H-1: 'Early player pools + stats (PLAYER screen, level 2) | HP green · Chi 10/10 · AP 30/30; ATK 1 · DEF 1 (+2) · SPD 1; weight 14/100; available stat points 3'. A-02:25: 'Observed progression: ATK 4→7, DEF 4+2→7+2 ..., SPD 1→4, spending the 3 stat points ... total distributed points = (7-4)+(7-4)+(4-1)=3+3+3=9, inconsistent with "3 points" label — likely +1 stat point grants +3 to the underlying stat ... treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm'.
- **Lane impact:** L4: §H-1 is at level 2 with all 3 points UNSPENT, so its ATK 1 / DEF 1 / SPD 1 / Chi 10 / AP 30 ARE the unAssignStatPoints() literals — the unit's added start values are frame-confirmed, not payload-only. A-02:25's INFERRED flag on the point-to-stat ratio is now closed twice over (payload + my L3→L4 delta). Four independent confirmations of +3 now exist: A-02, §H-1, the L3 absolute fit, and the L3→L4 delta.

### `progression/web-anticheat-and-console-differ` — HELD [A2]

Two more web-vs-android divergences in the same function: the web anti-cheat rejects a jump of more than 2 levels (android: 5 or more), and the web build has consoleEnabled constant-folded to a literal false, so every guard written !consoleEnabled is unconditional in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2042, :2043, :2049 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1619, :1625, :336`
- **Quote:** WEB §1t1523s0§.as:2042  var _loc5_:Boolean = false;
WEB :2043  if(!_loc5_ && _loc4_ > §1t9470s0§) { … return false; }
WEB :2049  if(!_loc5_ && _loc6_ > 2) { … return false; }
ANDROID StatsManager.as:1619  if(!consoleEnabled && newlevel > levelCap) { QueryManager.instance.reportHack("changeXP levelcap"); return false; }
ANDROID :1625  if(!consoleEnabled && leveldiff >= 5) { … }
ANDROID :336  internal static var consoleEnabled:Boolean = true;   (live var, toggled at :586 and OverworldHUD.as:2715)
- **Lane impact:** L4: the multi-level anti-cheat threshold is 2, not 5, for the rebuild target. GAUNTLET-WIDE decoding rule: whenever an android guard reads `!consoleEnabled && X`, the web equivalent is plain `X` — do not port the flag, and do not treat an android console/admin path as evidence that a behaviour was reachable in v0.717.

### `progression/web-calcxp-parity` — HELD [A2]

The WEB v0.717 build has its own calcXP / greyLevel / zeroDifference, byte-parallel with the Android twin, so the entire XP-income model — cited android-only by the survey — is now sourced from the actual rebuild target.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (greyLevel), :131-178 (zeroDifference), :180-202 (calcXP)`
- **Quote:** §1t68s0§.as:180-202  public static function §1t12070s0§(param1:int, param2:int, param3:int, param4:Boolean) : * { if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } var _loc5_:int = param3; if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); } if(param4) { _loc5_ *= 2; } return _loc5_; }  ·  :122 "return _loc1_ - Math.floor(_loc1_ / 10) - 5;"  ·  the 13-band zeroDifference table (5,6,7,8,9,11,12,13,14,15,16,17,17) is identical to android's
- **Lane impact:** L4: removes the single biggest sourcing risk in the survey. Given this lane's own ruling that shs3_android v0.682 is differently tuned, an android-only cite for a numeric model was a live hazard; the web twin is identical here, so the XP-income model may be ported as-is with a WEB cite.

### `progression/web-level-cap-is-const` — PARTIAL [A2]

On the shipped WEB build levels 81–99 were structurally unreachable, because levelCap is a compile-time const there while Android makes it a mutable var.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 vs reference/decompiled/shs3_android/scripts/StatsManager.as:76; dead band at §1t68s0§.as:176-179`
- **Quote:** WEB §1t1523s0§.as:362  public static const §1t9470s0§:int = 80;
ANDROID StatsManager.as:76  public static var levelCap:int = 80;
WEB §1t68s0§.as:176-179  if(_loc1_ < 80) { return 17; } return 17;   // authored band, never differentiated
- **Lane impact:** L4: partially closes progression/levels-81-99 for v0.717 specifically — expArray[81..98] is dead headroom in the web build by construction, not merely by observation. The 'were they EVER reachable' question survives only across versions.

### `progression/web-payload-is-v0717` — HELD [A2]

The web payload's own version stamp is 0.717 — the 'stamps v0.706 under a v0.717 preloader' provenance caveat circulating in this lane is unsupported by the decompiled bundles.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36; negative grep across shs3_payload/, shs3_loader/, shs3_stage2/, shs3_stage3/`
- **Quote:** §1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;
reference/decompiled/shs3_android/scripts/StatsManager.as:30  public static var clientVersion:Number = 0.682;
grep -rn "0\.706" over shs3_payload/scripts shs3_loader/scripts shs3_stage2/scripts shs3_stage3/scripts  ->  no match anywhere
- **Lane impact:** Gauntlet-wide — protects every 'web v0.717' label in this unit's cites, and removes a provenance discount asserted at docs/gauntlet/L0/CLAIMS.md:1213 ('the web payload stamps v0.706 under a v0.717 preloader, so it is the last live payload, not provably the filmed build'). The only version literal in the payload is 0.717.

### `progression/web-stance-triangle-has-a-penalty-branch` — HELD [A2]

The WEB build's stance rock-paper-scissors is symmetric — x1.2 on a favourable matchup AND x0.9 on an unfavourable one — whereas the Android build has only the x1.2 branch; a third concrete proof that Android is differently tuned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3799 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3708`
- **Quote:** §1t99s0§.as:3788-3799  if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§ || … ) { _loc5_ *= 1.2; … } else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || … ) { _loc5_ *= 0.9; }   ← the else-if is ABSENT from android, whose block is only  if(LIGHT vs BALANCED || BALANCED vs HEAVY || HEAVY vs LIGHT) { damage *= 1.2; }
- **Lane impact:** CROSS-LANE GIFT to L1 combat-core's damage pipeline: the stance triangle is x1.2 / x1.0 / x0.9, applied BEFORE the flat DEF subtraction. Also a standing warning for every lane — a formula present in both builds can still differ in structure, not just in constants.

### `progression/xp-income-web-parity` — HELD [A2]

The XP-income model was cited entirely from the differently-tuned Android v0.682 build; the WEB v0.717 parity it needed is present and byte-for-byte identical, so the claim survives on web evidence too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208 (calcXP), :120-128 (grey level), :131-182 (zeroDifference); §1t4574s0§.as:39 (mob base); §1t4902s0§.as:26 (duellist base)`
- **Quote:** §1t68s0§.as:185-208  public static function §1t12070s0§(param1:int, param2:int, param3:int, param4:Boolean) : * { if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } var _loc5_:int = param3; if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); } if(param4) { _loc5_ *= 2; } return _loc5_; }
§1t68s0§.as:120-128  if(_loc1_ < 40) { return _loc1_ - Math.floor(_loc1_ / 10) - 5; } if(_loc1_ < 60) { return _loc1_ - Math.floor(_loc1_ / 5) - 1; } return _loc1_ - 9;
§1t45
- **Lane impact:** L4 — hardens progression/xp-income-model against the very build-drift risk the same survey proved is real (per-point magnitudes). Record the web line numbers; the model may now be ported as CONTRACT from the filmed build rather than inferred from android.

### `progression/xp-income-web-parity` — HELD [A2]

The full kill-XP model, cited by the unit from the Android build alone, has complete WEB v0.717 parity — grey level, the zero-difference ladder and calcXP are value-for-value identical, so blocker 4's kill side is held on the SHIPPED build, not inferred across SKUs.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-128 (grey level), :131+ (zero difference), :185-208 (calcXP)`
- **Quote:** §1t68s0§.as:185-208: 'if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } var _loc5_:int = param3; if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); } if(param4) { _loc5_ *= 2; } return _loc5_;' · :120-128 grey ladder '<6 => 0 · <40 => L - floor(L/10) - 5 · <60 => L - floor(L/5) - 1 · else L - 9' · :131+ zero-difference '5,6,7,8,9,11,12,13,14,15,16,17,17' at breakpoints 8,10,12,16,20,30,40,45,50,55,60,80 — identical to android NPC.as:94-164.
- **Lane impact:** L4 blocker 4 and L7 economy blocker 1 are now closed on the web payload rather than on an Android cross-reference. Given this unit's own proof that the two builds are differently tuned, that upgrade matters: the XP-income model is one of the places where they did NOT drift.

### `quests-story/choices-are-consequential-positionally` — HELD [A2]

Player choices ARE consequential: the engine applies consequence positionally, so a <goto> that lands past an <outcome> node changes persisted game state, and 12 shipped <option> blocks (86 under a looser test) have branches that write different stats.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as:193-201 + CutsceneManager.as:80-102,202-205 + XMLQuestOutcome.as:50-90 + reference/extracted/questdata.xml quest id 0, step[8] <intro>`
- **Quote:** XMLQuestStep.as:193-201 'case "option": questOption = new XMLQuestOption(currentDisplay); vectorList.push(questOption); max = int(questOption.choice.length); for(j = 0; j < max; j++) { vectorList.push(null); }'  ||  CutsceneManager.as:93 'this.currentDisplayNo = goto; this.display();'  ||  CutsceneManager.as:202-204 'case "outcome": outcome = XMLQuestOutcome(currentDisplay); outcome.applyOutcome();'  ||  Prologue step[8] display list: [6] option "What's his story?"->10 | "(FIghting Tutorial) I may be able to learn something here."->14 | "I should go."->19 ; [14] dialogue "You said before that 
- **Overturns:** "quests-story/choices-not-consequential: "Blocker (4) is ANSWERED and the answer is no ... all 471 are pure <goto> jumps ... the choice graph is a flat jump table, not a consequence system""
- **Lane impact:** L1 CAMPAIGN — REVERSES the surveyor's risk call. L1 must implement the CutsceneManager display-list walker with the null-padded index space and apply <outcome> at traversal time; a flat jump table silently drops three setStat writes in the Prologue alone. Also feeds L9 (save schema): branch-dependent stat writes must persist.

### `quests-story/condition-grammar-closed` — HELD [A2]

The <condition>/<startcondition> grammar is fully recovered, including a probabilistic 'rand' comparator and negated quest prerequisites — so the quest prerequisite DAG is on disk, not open.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4152-4260`
- **Quote:** checkConditions: `has` list ANDed via checkCondition(id, qty, comp) with comp defaulting to "gte"; `completedquest` supports a '!' negation prefix -> checkNotCompletedQuest; `activequest` is an OR set (any true returns true). checkCondition: `if(comparison == "rand") { return Math.random() * id <= val; }`
- **Lane impact:** L1 CAMPAIGN — the quest unlock graph (62 <condition> + 17 <startcondition> + 97 <activequest> + 32 <completedquest>) is generatable. Note the 'rand' comparator needs the injected RNG, never Math.random, per the src/core invariant.

### `quests-story/dialogue-divergence-is-build-divergence` — HELD [A1]

The Prologue dialogue mismatch is not a "rewrite" of a near-verbatim source — it is a build divergence between the web v0.717 renderer and the v0.682 Android script the payload actually holds, which is empirical proof that the Android caveat bites hardest on exactly the unit that declared it retired.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 t=62/68/72/76, crop (0,700)-(1400,1060) upscaled to 2100x540 -> /private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/crit_q/c62.png c68.png c72.png c76.png`
- **Quote:** VISIBLE IN MY CROPS — t=62 nameplate JINBEI: "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." (questdata.xml:128 reads "Ah! A new face in this territory!..."). t=76 JINBEI: "THAT'S TOO BAD, TRAVELER. IT REALLY IS..." — grep -n -i "too bad" reference/extracted/questdata.xml returns only :4262, :19794, :24531, all unrelated, so this shipped line exists in NO build data we hold. t=68 GUEST rows: "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." (= :149 EXACT) / "THESE BANDITS DON'T SCARE ME!" (:153 reads "They'll get noth
- **Lane impact:** L1 CAMPAIGN — its done-criterion cannot be "3,307 lines byte-exact", because byte-exact to the Android script is known-wrong on screen. L1 must (a) transcribe every scene visible in the two longplays from frames and let those win, (b) ship the remaining ~2,700 lines labelled 'Android v0.682 wording, diverges from the shipped web build', and (c) budget a frame-transcription pass as real work, not a checkbox. Also feeds L7/L6: the same two builds may diverge in audio cues and portrait art.

### `quests-story/ending-track-unclaimed` — HELD [A2]

<ending> is a second dialogue track per step that every claim in this unit ignores: XMLQuestStep builds BOTH an intro and an ending vector through the same parser, and 5 <ending> blocks ship with their own option/choice and outcome nodes.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestStep.as:130-131 + reference/extracted/questdata.xml — parentage 5 quest/step/ending/outcome, 2 quest/step/ending/option/choice`
- **Quote:** this.intro = this.getXMLIntroList(xml.intro); this.ending = this.getXMLIntroList(xml.ending);  ||  lxml parentage: outcome -> 381 quest/step/intro/outcome, 5 quest/step/ending/outcome; choice -> 469 intro, 2 ending
- **Lane impact:** L1 CAMPAIGN — post-battle scenes are a separate track from pre-battle intros and use the identical opcode set; the cutscene interpreter must be driven for both vectors.

### `quests-story/ledger-banner-already-banks-two-overturns` — HELD [A4]

REBUILD_READINESS.md retired its own quests-story §4/§6 and §3.8 claims in a dated staleness banner two days before this run, so the two ledger overturns the surveyor scores as new were already on the board.

- **Cite:** `docs/research/REBUILD_READINESS.md:20-40 (STALENESS BANNER dated 2026-08-13); the superseded bodies it retires live at :229-231 and :347`
- **Quote:** "## ⛔ STALENESS BANNER — 2026-08-13: THIS DOC IS WRONG ON ITS BIGGEST CALLS ... | §4 quests-story: \"verbatim dialogue — captured NOWHERE\"; §6: \"structurally unrecoverable\" | questdata.xml — 2,771 <dialogue> blocks, 3,307 verbatim <text> lines, 471 <choice>, full <cutscene> direction | ... | §3.8: \"Ep4–12 were likely never shipped… faithful campaign = Prologue–Ep3\" | 61 quests: Prologue → Episodes 1–12 → Epilogue → a Season 2 hook. The campaign is complete |"
- **Lane impact:** SCORING, all lanes. Any unit quoting a REBUILD_READINESS.md body without checking the 2026-08-13 banner above it will double-count novelty. Q-01 and Q-02 both do. The gauntlet's scoring pass should discount overturns_ledger:true whenever the banner table already names the same correction, and every other L0 unit's ledger quotes should be re-checked against :20-40 for the same error.

### `quests-story/loot-count-19` — HELD [A2]

The <loot> row count is 19, not the 18 asserted in two claims.

- **Cite:** `reference/extracted/questdata.xml — lxml parentage: 19 quest/step/reward/loot`
- **Quote:** == loot\n    19 quest/step/reward/loot
- **Lane impact:** L1 CAMPAIGN — trivial, but the reward table is 19 rows; anything generated from the claimed 18 drops one.

### `quests-story/maxquests-cap-is-real` — HELD [A2]

The quest-log cap the ledger recorded is real engine behaviour, not a UI row count: StatsManager holds MAXQUESTS = 7 and gates every accept path on it, with a forceAdd escape that is exactly the ledger's "1 story + 6 side" shape.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:164, :1257-1274, :1313`
- **Quote:** StatsManager.as:164:      internal static var MAXQUESTS:int = 7;\nStatsManager.as:1257: public static function addActiveQuests(questID:int, forceAdd:Boolean = false) : Boolean\nStatsManager.as:1262:         if(activeQuestList.length < MAXQUESTS || forceAdd)\nStatsManager.as:1313:         if(activeQuestList.length < MAXQUESTS)\n(and QuestLogUI.as:89 'for(i = 0; i < 7; i++)' — the 7 scroller rows equal the cap, they do not explain it away)
- **Overturns:** "QUEST_LOG_CAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN + L8 UI — ship BOTH: the 7-row scroller with exact geometry (x=60, y=73+55i) AND a hard 7-quest accept cap with a forceAdd bypass reserved for story quests. The surveyor's instruction to ship no cap would be a fidelity regression, and the scroll buttons are the tell that forceAdd can legitimately exceed 7.

### `quests-story/nested-roomobj-waves` — HELD [A2]

12 additional waves holding 18 additional enemy rows are hidden inside a nested <xml> document within room-object <property> elements — true totals are 169 <enemy> and 118 <wave>, not 151 and 106.

- **Cite:** `reference/extracted/questdata.xml:20569 (also :20601, :20633) — parentage quest/step/roomobj/property/obj/property/xml/wave/enemy`
- **Quote:** <xml><wave><enemy><id>19|20|21|22|23|24</id><lvl>25</lvl><qty>5</qty></enemy></wave><wave><enemy><x>-100</x>...<enemy><x>1227</x>...</wave></xml>  ||  lxml parentage: 151 quest/step/wave/enemy + 18 nested = 169; waves 106 + 12 = 118
- **Lane impact:** L4 ENEMIES+AI — the encounter table is 18 rows / 12 waves larger than claimed, and some encounters are attached to room objects (trap/ambush triggers) rather than quest steps. L9 WORLD inherits the room-object spawn wiring.

### `quests-story/outcome-id-is-statsmanager-namespace` — PARTIAL [A2]

The <outcome><id> namespace is StatsManager's stat-id space, with a carve-out band [2000,30000) that means itemdata item ids; id 42 is STAT_CHIKAKOLOVE, an affection stat the campaign increments that no ledger system mentions.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestOutcome.as:50-90 + StatsManager.as:188,192,246,248 + reference/extracted/questdata.xml <outcome> id domain`
- **Quote:** XMLQuestOutcome.as:52-76 'if(this.id >= 0) { if(this.hasModify) { if(this.id == 11 && this.modify > 0) { OverworldHUD.instance.lootDialog.addLootCoins(this.modify); } else if(this.id >= 2000 && this.id < 30000 && this.modify > 0) { OverworldHUD.instance.lootDialog.addLootItemBasic(this.id,this.modify); } else if(this.id == StatsManager.STAT_XP) { OverworldHUD.instance.lootDialog.addLootXP(this.modify); } else { StatsManager.changeStat(this.id,this.modify); } } else if(this.hasSet) { StatsManager.setStat(this.id,this.setNo); } }' and :78-89 'if(this.end == -1) leaveCancel(); else if(this.end ==
- **Overturns:** "quests-story/outcome-id-namespace: "I did not open XMLQuestOutcome.as or StatsManager.checkConditions, so any mapping of id ranges to 'story flags' / 'quest items' / 'stats' would be a guess.""
- **Lane impact:** L1 CAMPAIGN + L9 SAVE SCHEMA — the quest flag namespace IS the stat array, not a separate table; <end> is a named 3-value enum (-1 abort, 1 step-complete, 0 continue). L1 must also model STAT_CHIKAKOLOVE (a romance/affection track absent from all 12 ledger systems) and the [2000,30000) item-grant band. STILL PARTIAL: the individual meanings of story-flag ids 100-130 remain unnamed.

### `quests-story/pipe-delimited-enemy-pools` — HELD [A2]

The enemy <id> field is a PIPE-DELIMITED random pool, not a scalar id: 114 of the 169 enemy rows use forms like 11|12|13|14|15, so spawns are randomised picks and ids cannot be one-to-one name-resolved.

- **Cite:** `reference/extracted/questdata.xml:4054, :5195, :6120, :10089 (114 rows total, measured)`
- **Quote:** (4054, 'enemy', '11|12|13|14|15', lvl '6', qty '4') · (5195, 'enemy', '11|12|13|14|15|16', lvl '7', qty '4') · (10089, 'enemy', '40|41|42|43|44|45', lvl '15', qty '4') — 114/169 rows pipe-delimited
- **Lane impact:** L4 ENEMIES+AI — the spawner contract needs a pool-pick (RNG through the injected mulberry32, per the Sim invariant), not a scalar lookup. Any 'encounter table with resolved names' derived from these rows is wrong for two thirds of them.

### `quests-story/step-action-is-gameengine-action-enum` — HELD [A2]

The <step><action> integer is GameEngine.ACTION_*, a 15-value enum, of which the 225 shipped steps use five: 169 ACTION_NOTHING (talk), 37 ACTION_FIGHT, 5 ACTION_DUEL, 3 ACTION_SURVIVECLEANUP, 1 ACTION_SURVIVE.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:81-109 + QuestEngine.as:1214-1219 + GameEngine.as:990 + Obj_NPCAggro.as:139,214`
- **Quote:** GameEngine.as:81-109 'ACTION_NOTHING:int = 0; ACTION_FIGHT:int = 1; ACTION_ASSASSINATE:int = 2; ACTION_ESCORT:int = 3; ACTION_SURVIVE:int = 4; ACTION_REACHMARKER:int = 5; ACTION_DUEL:int = 6; ACTION_ADVENTURE:int = 7; ACTION_HARVEST:int = 8; ACTION_SURVIVALMODE:int = 9; ACTION_WARROOMBATTLE:int = 10; ACTION_PLAYBACK:int = 11; ACTION_PVPROOM:int = 12; ACTION_CUTSCENE:int = 13; ACTION_SURVIVECLEANUP:int = 14;'  ||  QuestEngine.as:1219 'GameEngine.initBattleMode(quest,questStepData.action,questStepData.bg,questStepData.stagewidth,questStepData.time,questStepData.wave,startingPosX);' against GameE
- **Overturns:** "quests-story/step-action-enum-semantics: "I did not find the enum mapping those ints to behaviours (talk-to / kill / gather / enter-room). Per-step trigger TYPES are therefore enumerated but not named.""
- **Lane impact:** L1 CAMPAIGN — closes the quest state machine's trigger dispatch: build the 15-value GameEngine.ACTION_* enum, wire 0/1/4/6/14. Scope fact for the board: only 5 of 225 story steps are DUELS, 37 are FIGHT, 169 are pure dialogue. L2/L4: ACTION_DUEL steps spawn the player at startingPosX 150 instead of 400.

### `quests-story/web-payload-has-no-quest-data` — HELD [A3]

The web payload contains NO quest, item, npc or skill XML at all — all four data XMLs in reference/extracted/ are Android-build (v0.682) artifacts, which means every L0 unit built on them inherits the S0-3 build caveat rather than escaping it.

- **Cite:** `reference/extracted/payload.xml (hex grep, 329 MB FFDec export of the web payload) + reference/extracted/bindata/ (27 files, ls -la) + ls -la reference/decrypted/`
- **Quote:** $ for h in 3c7175657374646174613e 3c6974656d646174613e 3c6e7063646174613e 3c736b696c6c646174613e 4a696e626569 3c616e696d646174613e; do printf "%s : " "$h"; LC_ALL=C grep -c "$h" reference/extracted/payload.xml; done\n3c7175657374646174613e : 0   # <questdata>\n3c6974656d646174613e   : 0   # <itemdata>\n3c6e7063646174613e     : 0   # <npcdata>\n3c736b696c6c646174613e : 0   # <skilldata>\n4a696e626569           : 0   # Jinbei\n3c616e696d646174613e   : 19  # <animdata>  <-- control proves the grep works\n--- extractor signature ---\nitemdata/npcdata/skilldata: android.find(web) = 40, remainder b'
- **Lane impact:** ALL LANES, not just L1. Every L0 unit that cites reference/extracted/{quest,item,npc,skill}data.xml is citing Android v0.682, so L1 CAMPAIGN, L2/L3 (skilldata), L4 ENEMIES+AI (npcdata) and L5 ITEMS (itemdata) must each carry the v0.682 label and treat web-build parity as UNHELD, not established. Close-path: re-run the payload_decode + ffdec export against reference/decrypted/shs3_payload_decoded.swf and enumerate whether the web build fetches these XMLs from the dead Player.IO backend — if it does, the web data is genuinely unrecoverable and Android is the only source we will ever have.

### `rebirth/dan-1-has-no-kanji` — HELD [A2]

A Dan-1 character (STAT_DAN 0) displays no kanji badge at all - the dan field is set to the empty string - and string 455 '(初段)' is never referenced anywhere in the decompiled tree.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2280; negative grep 'getString(455' over reference/decompiled/ returns zero hits`
- **Quote:** 2276: case 0:
2277:    this.danfield.text = "";
2278:    break;
2279: case 1:
2280:    this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L-rebirth-elements / L-ui-hud: the used kanji range is 456-464 over STAT_DAN 1-9 (nine badges), not 455-464 over 0-9. A recreation that paints 初段 on a fresh character contradicts the shipped build.

### `rebirth/dan-zero-shows-no-title` — HELD [A2]

A Dan-1 (STAT_DAN 0) character displays a BLANK dan field, so the kanji title string 455 exists in the table but is never shown in game; the displayed ladder runs 456..464 for STAT_DAN 1..9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2312`
- **Quote:** case 0:
   this.danfield.text = "";
   break;
case 1:
   this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L rebirth-elements + ui-hud: a recreation that renders 初段 for a fresh character diverges from the original on the most common screen state in the game. The shogo suffix bands the survey reported are exactly right (465 at cases 3/4/5, 466 at 6/7, 467 at 8/9, default 467+464).

### `rebirth/dan1-has-no-kanji-title` — HELD [A2]

Dan 1 displays NO kanji title — string 455 (初段) is never shown — so the live map is STAT_DAN n → string 455+n for n≥1 only.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2316`
- **Quote:** case 0:
   this.danfield.text = "";
   break;
case 1:
   this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: a recreation that prints 初段 at Dan 1 renders something the OG never renders. Ten ranks, nine kanji labels (456 弐段 … 464 十段), blank at rank 1. The shogo bands are separately correct: 465 Renshi at STAT_DAN 3-5, 466 Kyoshi at 6-7, 467 Hanshi at 8-9 and default.

### `rebirth/dan1-renders-blank` — HELD [A2]

String 455 '(初段)' is never displayed: at STAT_DAN 0 both builds set the Dan field to an empty string, so a Dan-1 character shows NO rank text at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2275-2277 and desktop twin reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3063-3065`
- **Quote:** case 0:\n   this.danfield.text = "";\n   break;      // grep -rn "getString(455)" over BOTH decompiled trees returns zero hits
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: corrects the surveyor's claim rebirth/dan-ladder-titles. The display mapping is STAT_DAN n → string 456+(n-1) for n>=1 and BLANK at n=0, not 455..464 across the board. A recreation copying the survey verbatim would render '(初段)' where the OG renders nothing — and every HUD frame in both longplays shows exactly that empty field, so this is frame-consistent too.

### `rebirth/dan1-shows-no-kanji` — HELD [A2]

Dan 1 displays no kanji rank at all - string 455 (初段) ships in the table but is never rendered by either display path.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2278 and PlayerPanel.as:384-386`
- **Quote:** case 0:\n   this.danfield.text = "";\n   break;
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: a recreation must leave the dan field blank at Dan 1 and start printing kanji at Dan 2 (弐段). Both display paths agree, and PlayerPanel.as additionally gives the romaji ladder the wiki garbled - nidan, sandan, yondan, godan, rokudan, nanadan, hachidan, kyudan, judan for STAT_DAN 1..9.

### `rebirth/dragon-dance-v0717-parity` — HELD [A2]

The Dragon Dance input logic has full v0.717 parity — the label arrays and the {1,2,4,6} Later-Heaven trigger are byte-identical to android, at the same line numbers — so the S0-3 build caveat does not apply to this mechanic.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71, :382 vs reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:70-71, :367`
- **Quote:** §1t5495s0§.as:382  if(Boolean(this.§1t5519s0§ && this.§1t5518s0§.length == 4) && Boolean(this.§1t5512s0§[1]) && Boolean(this.§1t5512s0§[2]) && Boolean(this.§1t5512s0§[4]) && Boolean(this.§1t5512s0§[6]))
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements: promote the Dragon Dance input from android-only to build-agnostic CONTRACT. Contrast with the statue (diverges) and the stance multipliers (diverge) — parity must be checked per-mechanic, never assumed either way.

### `rebirth/elemental-aoe-is-a-horizontal-band` — HELD [A2]

The elemental AoE parameter is a horizontal half-width, not a radius: the hit test compares x-distance only, so Inferno 600 / Tsunami 400 / Tornado 200 / Earthquake 50 describe a band +/-N px wide with unbounded y.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:1422-1449`
- **Quote:** public static function checkHitObject(thing:MovieClip, damage:Damage, dist:int = 100, checkByAttacker:Boolean = false, objectToCheckDist:MovieClip = null) : Boolean
{
   var distsq:int = dist * dist;
   ...
   enemydist = enemy.getMCS().x - thing.x;
   if(enemydist * enemydist < distsq && enemy.checkHitObject(thing,damage,checkByAttacker))
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L rebirth-elements + combat-core: the survey's numbers are right but its word 'radii' is not. A circular-radius implementation would let an airborne or elevated target dodge an ultimate that in the original always connects. The same function is the generic melee/projectile hit test, so this applies well beyond the elemental kit.

### `rebirth/gold-is-premium-hgold` — HELD [A2]

The rebirth payout is written to STAT_HGOLD (id 12), the premium currency the UI calls 'Gold' — not STAT_GOLD (id 11), which is the coin currency.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192, :194, :705-706, :2203, :2207 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:228, :2646, :2651 + docs/gauntlet/L0/index/strings.json key 100`
- **Quote:** StatsManager.as:192 internal static var STAT_GOLD:int = 11;
StatsManager.as:194 internal static var STAT_HGOLD:int = 12;
StatsManager.as:705-706 setPlayerStats(STAT_GOLD,100); setPlayerStats(STAT_HGOLD,0);
§1t1523s0§.as:228 internal static const §1t9413s0§:int = 12;   // the stat the +100/+25 is written to
strings.json 100 = 'You are out of AP.\nWould you like to get 10 more AP for 1 Gold?'
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.**"
- **Lane impact:** economy: tenthGold=100 and the flat +25 belong to the PREMIUM currency config, not the coin config. The ledger's Economy 'gold has legit non-cash faucets (rebirth/tournament/betting)' line is therefore about hard currency specifically, which is the whole point of that bullet — bind it to the right stat id or the faucet model is wrong by a factor of the coin/gold exchange.

### `rebirth/no-elemental-buff-channel` — PARTIAL [A2]

The game's buff system provably carries no elemental status effect: the BUFF_* enum has thirteen entries and not one is burn, slow, root, freeze or damage-over-time.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:288-312`
- **Quote:** BUFF_XP=0  BUFF_ATTACK=1  BUFF_DEFENSE=2  BUFF_SPEED=3  BUFF_AP=4  BUFF_DUELTOKENS=5  BUFF_COINS=6  BUFF_RARELOOT=7  BUFF_MUTE=8  BUFF_FULLMUTE=9  BUFF_HELL=10  BUFF_INJURED=11  BUFF_MODERATOR=12
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual, narrowed. Every BUFF_* is a meta/economy/moderation buff; none is a combat status. So elemental skills cannot apply a status via the buff system, and the only remaining place a burn/slow could live is an ad-hoc per-projectile effect. A grep for setOnFire|burning|poison|slowed|frozen over the android tree returns only background-art redFreeze() and a guardian stomp animation constant, so the residual is close to empty — but I did not read NPCManager.checkHitObject end to end, so PARTIAL not HELD.

### `rebirth/payout-is-the-premium-gold-purse` — HELD [A2]

The rebirth payout (+25, +100 at Dan 8) lands in STAT_HGOLD=12, the IAP-linked premium purse the HUD labels 'GOLD', not in STAT_GOLD=11, the coin purse the HUD labels 'MONEDAS'.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, 2669-2675 + OverworldHUD.as:1567-1569 + reference/extracted/sprites/DefineSprite_1671/1.png ('100000 MONEDAS') and DefineSprite_1674/1.png ('100000 GOLD')`
- **Quote:** StatsManager.as:192  internal static var STAT_GOLD:int = 11;
StatsManager.as:194  internal static var STAT_HGOLD:int = 12;
StatsManager.as:2669 public static function getHeavenlyGold() : int { var hgold:int = getPlayerStats(STAT_HGOLD); if(usePlayerIO) { hgold += QueryManagerPIO.instance.getPayVaultCoins(); }
OverworldHUD.as:1567 public function updateHGoldText(gold:int) : * { this.info.goldtext.text = String(gold); }
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L economy + rebirth-elements: refines the survey's tenth-gold claim rather than refuting it (the game itself calls HGOLD 'gold', so the film's '+25 gold' is consistent). But REBIRTH.earlyGold/tenthGold must be wired to the premium currency, and a recreation that omits IAP has to decide what that purse becomes. Also resolves the ledger's currency naming: 'coins' = STAT_GOLD = MONEDAS, 'gold' = STAT_HGOLD = the cash-purchasable one.

### `rebirth/statue-sequence-v0717-diverges` — PARTIAL [A2]

The v0.717 Kanji-statue dance is not one deterministic permutation: it has three regimes producing 3-, 5- or 6-click sequences, and its RNG seed is node*X+21 rather than the bare node id.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t8702s0§.as:150-224 (class confirmed as the statue by getAPUse()->2 at :324 and abs(x-param1.x)<100 at :344)`
- **Quote:** var _loc1_ = RNG.create(StageManager.getCurrentNode() * <fn>() + 21);
var _loc2_ = <perNodeLookup>(StageManager.getCurrentNode());
var _loc4_:Array = [0,1,2,3,4,5,6,7];
if(_loc2_ < 20)      → 3 distinct nodes drawn without replacement
else if(_loc2_ < 60) → "1246"-permutation + _loc1_.rand(8)
else                 → "1246"-permutation + 2 more distinct draws
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④, statue half: the android spec the unit banked is one of three v0.717 regimes. AP cost 2 and 100 px interact range DO hold in both builds. Still unheld: the meaning of the per-node gating value behind the <20 / <60 thresholds (obfuscated lookup I did not resolve).

### `rebirth/statue-two-sequence-modes` — HELD [A2]

Dragon Dance statues have TWO sequence modes, not one: the RNG permutation only applies to Later-Heaven statues (prop >= 8); Earlier-Heaven statues take their sequence verbatim from the room-object property.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-42 and :65-66`
- **Quote:** this.num = int(props);\nif(this.num >= 8)\n{\n   this.num -= 8;\n   this.earlierHeaven = false;\n   rng = new RNG(StageManager.getCurrentNode());\n   dice = rng.rand(5);\n   …\n}\nelse\n{\n   sequence = props;\n}
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④, statue half — refines the surveyor's claim rebirth/kanji-statue-bonus, which presents the RNG permutation as THE sequence rule. A recreation must implement both branches: authored sequence straight off the room prop for Earlier Heaven, node-id-seeded permutation of '1246' for Later Heaven. Both are reproducible offline; the prop values come from the room-object defs in bindata 93 / 84_QuestEngine_TrapRoomData.

### `rebirth/status-not-on-damage-packet` — PARTIAL [A2]

No elemental status effect can be carried on the Damage object: its constructor has eight parameters and none of them is a status, buff, duration or DoT field.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:50`
- **Quote:** public function Damage(damage:int = 0, attackerlvl:int = 0, launchType:int = 0, stance:int = -1, fireDamage:int = 0, waterDamage:int = 0, windDamage:int = 0, earthDamage:int = 0)
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L-rebirth-elements: narrows the surveyor's STILL_UNHELD on per-element status from 'unverified in either direction' to 'not on the damage packet'. A status would have to be applied by the projectile or inside NPCManager.checkHitObject; that read is the remaining close-path.

### `rebirth/string-455-never-displayed` — HELD [A2]

String 455 '(初段)' is shipped-but-dead — Dan 0 renders a BLANK dan field, and getString(455) has zero call sites anywhere in the android tree.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2278 + grep -rn 'getString(455)' over reference/decompiled/shs3_android_payload/scripts/ (zero hits)`
- **Quote:** InventoryUI.as:2276  case 0:
InventoryUI.as:2277     this.danfield.text = "";
InventoryUI.as:2278     break;
- **Overturns:** "n/a — peripheral correction to the surveyor's claim rebirth/dan-ladder-titles"
- **Lane impact:** rebirth-elements + ui-hud: the displayed kanji set is 456-464 for STAT_DAN 1..9 with a BLANK field at Dan 0, not 455-464. A recreation that renders 初段 at first rank would diverge from the original. The ladder and shogo mapping in that claim are otherwise exactly right.

### `rebirth/unlock-gate-ignores-gear-affixes` — HELD [A2]

Gear affixes on the four element-ATK stats do NOT count toward the 10/30/60 skill-unlock thresholds - only the rebirth-granted base stat does.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4216-4233 (checkCondition) vs :1835 (initAttackStats), reached from XMLSkill.as:133/:321 -> StatsManager.checkConditions(:4152-4183)`
- **Quote:** public static function checkCondition(id:int, val:int, comparison:String = "gte") : Boolean
{
   ...
   else if(id >= 28 && id <= 31)
   {
      output = getStat(id);      // NO findBonusStat — contrast :1835 which adds it explicitly
   }
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L rebirth-elements: corrects the survey's own lane_impact on rebirth/unlock-gate-is-stat-threshold, which asserts the opposite. The unlock cadence therefore IS a clean function of rebirth count (1x/3x/6x, with the Dan-8 rebirth granting +20 instead of +10), because nothing else feeds stats 28-31. Shipping the gear-inclusive rule would let a player buy their way past the gate.

### `skills-meters/baseReload-is-a-dead-stat` — HELD [A2]

SPD does NOT accelerate the Focus meter: getBaseReload() = 48 + SPD*6 is computed, passed into the player and stored, then never read anywhere in either bundle — the meter fills at a flat +1 per tick.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :191, :1203-1205 (grep over the whole web bundle returns only :103 and :191 for §1t4419s0§); reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1839-1842 and MCSPlayer.as:105/:182/:190`
- **Quote:** web 103:      internal var §1t4419s0§:int = 48;
web 191:         this.§1t4419s0§ = param7;      <== only two occurrences in the bundle
web 1203:         if(this.§1t4414s0§ < this.§1t4415s0§)
web 1205:            ++this.§1t4414s0§;
---
android StatsManager 1841:         return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;
- **Lane impact:** L2: do not wire SPD to meter fill in config — fill is a constant +1/frame regardless of stats, so empty->full is always 8.000 s. This also independently corroborates COMBAT_MEASUREMENTS f-5 ('fills PASSIVELY and LINEARLY with time … no event-driven jumps') against gap-F's 'charge begins on holding the slash input': the web code has no input term in the charge path at all. L5 should re-open gap-F on that basis.

### `skills-meters/basereload-is-48-plus-spd6` — HELD [A2]

Param 7 of the player init is baseReload = 48 + SPD*6 — a field distinct from maxreload, and the likely source of the survey's 120/192 confusion.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2274-2276 -> §1t99s0§.as:183/191; Android name at StatsManager.as:1839-1841 / MCSPlayer.as:182`
- **Quote:** 2274:      internal static function §1t9588s0§() : int
2276:         return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
---
§1t99s0§.as:191:         this.§1t4419s0§ = param7;
---
android MCSPlayer.as:182: initPlayer(… defense:int, baseReload:int, minDamage:int …)
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: the meter system has THREE reload-family numbers, not one — baseReload (48 + SPD*6, param 7), maxreload (192, hard-coded), and the 48-frame dead zone. Any config that collapses them will mis-simulate. The Android parameter names at MCSPlayer.as:182 are the Rosetta stone for the whole obfuscated web init signature and should be banked for every downstream lane.

### `skills-meters/cooldowns-are-not-all-integers` — HELD [A2]

Cooldown is not an integer field — the domain includes 3.5 — so the survey's 'config must encode the integers' guidance would truncate a real value.

- **Cite:** `docs/gauntlet/L0/index/skilldata.json -> skilldata/skill/level/cooldown (count 182, distinct_values 14, numeric_range [2.0, 70.0], sample_values include '3.5')`
- **Quote:** 'skilldata/skill/level/cooldown': {'count': 182, 'distinct_values': 14, 'numeric_range': [2.0, 70.0], 'sample_values': ['10','15','2','20','3','3.5','30','4','5','6','60','70']}
- **Lane impact:** L2: the config cooldown field must be Number, not int. Note the pipeline still truncates downstream — §1t105s0§.as:297 is declared ': int', so 3.5 s becomes int(3.5*24*mod) frames — but the source value itself must survive transcription intact.

### `skills-meters/damage-roll-still-uses-rng` — HELD [A2]

Only the crit trigger is deterministic — base damage is still a random roll every swing, so the lane_impact phrase 'no roll, no seed, no variance' is misleading.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258 and :3281`
- **Quote:** 3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
3281:         return this.minDamage + Math.random() * this.damageRange;
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5: the crit-chance RNG question is closed, but Sim still needs the injected mulberry32 stream for the per-swing damage roll. Read literally the survey's lane_impact invites dropping it.

### `skills-meters/dual-reversed-are-swapped` — HELD [A2]

Reversed stance gets reach x1.4 and slash cost x1.0; Dual stance gets reach x1.0 floored at 100 px and slash cost x1.5 — the survey has the two exactly the wrong way round.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:824 and :866, joined to §1t99s0§.as:3130-3134, :3141-3149 and :3299-3311`
- **Quote:** 824:      internal static var §1t11073s0§:String = "dual_stance";
866:      internal static var §1t11115s0§:String = "reversed_stance";
---
3131:                this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3134:                   §1t1557s0§(§1t11115s0§);        // reversed
3142:                this.§1t4417s0§ = this.§1t4420s0§;
3145:                   this.§1t4417s0§ = 100;
3149:                   §1t1557s0§(§1t11073s0§);        // dual
- **Overturns:** "① reach cap in **stage px** per stance"
- **Lane impact:** L5/L2: config's per-stance table must read Light x1.4 / Balanced x1.0->1.2 / Heavy x0.5->0.9 floor 100 / REVERSED x1.4 / DUAL x1.0 floor 100, and the meter cost must group Reversed with Balanced (x1.0) and Dual with Heavy (x1.5). Confirmed three ways inside the web bundle alone: the animation string literals, the stance ints 3=Dual/4=Reversed matching android MCSPlayer.as:33,35, and android's own setStance giving REVERSED the long reach at :3067.

### `skills-meters/dual-reversed-swapped` — HELD [A2]

The two off-stances are inverted in the survey: Reversed gets reach x1.4 and Dual gets x1.0 floored at 100, not the other way round.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:27-35 and :3066-3081, matched to reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27-35 and :3130-3145`
- **Quote:** android 33:      internal static var DUAL_STANCE:int = 3;
android 35:      internal static var REVERSED_STANCE:int = 4;
android 3066:            case REVERSED_STANCE:
android 3067:               this.slashLength = this.baseSlashLength * 1.5;
android 3077:            case DUAL_STANCE:
android 3078:               this.slashLength = this.baseSlashLength;
---
web 3130:            case §1t12224s0§:   (=4 = REVERSED)
web 3131:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
web 3141:            case §1t12223s0§:   (=3 = DUAL)
web 3142:               this.§1t4417s0§ = this.§1t4420s0§;
- **Lane impact:** L5/L2: config must map stance 3 = Dual (reach x1.0 floored 100, slash cost x1.5, damage x1.4) and stance 4 = Reversed (reach x1.4, slash cost x1.0, damage x1.4). The same inversion sits in the slash-cost buckets at §1t99s0§.as:3305/:3309. Also useful: the obfuscated web class declares the five constants in the same order with the same values as the named Android class, so the Android names are a safe decoder ring for stance ids specifically.

### `skills-meters/dual-reversed-swapped` — HELD [A2]

Web stance constant §1t12223s0§ = 3 = Dual takes reach x1.0 floored at 100 px, and §1t12224s0§ = 4 = Reversed takes x1.4 — the opposite of the survey's assignment.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:33,35,3130-3131,3141-3146; android MCSPlayer.as:33,35,3066-3067,3077-3081`
- **Quote:** web  33:      internal static var §1t12223s0§:int = 3;
web  35:      internal static var §1t12224s0§:int = 4;
web 3130:            case §1t12224s0§:
web 3131:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
web 3141:            case §1t12223s0§:
web 3142:               this.§1t4417s0§ = this.§1t4420s0§;
android 33:      internal static var DUAL_STANCE:int = 3;
android 35:      internal static var REVERSED_STANCE:int = 4;
- **Overturns:** "① reach cap in **stage px** per stance"
- **Lane impact:** L5: ship Reversed x1.4 and Dual x1.0-floored-at-100, not the reverse. Same swap propagates to slash cost, where Reversed groups with Balanced at x1.0 and Dual groups with Heavy at x1.5 (§1t99s0§.as:3299-3311).

### `skills-meters/elemental-per-level-numbers-are-blank` — PARTIAL [A2]

Only 4 of the 24 elemental skills carry per-level numbers; the 8 elemental kunai/traps, the 8 Dragon Dance Steps and the 4 AoE ultimates each have a single level row whose <desc> is blank.

- **Cite:** `reference/extracted/skilldata.xml categories 7/8/9/10, parsed against docs/gauntlet/L0/index/strings.json`
- **Quote:** cat 7  Fire Breath   5 lvls -> 'Fire Damage: 80/90/100/110/120% Fire ATK'
cat 8  Water Stomp   5 lvls -> 'Water Damage: 80..120% Water ATK'
cat 9  Wind Combo    5 lvls -> 'Wind Damage: 80..120% Wind ATK'
cat 10 Ground Punch  5 lvls -> 'Earth Damage: 80..120% Earth ATK'
all 20 others: 1 lvl, <desc> BLANK
- **Overturns:** "### rebirth-elements"
- **Lane impact:** L11/rebirth-elements: its blocker ① 'what each element does' is only partly closed — names, chi costs, cooldowns and the {10,10,10,30,30,60} item gates are held, but 20 of 24 effect magnitudes still live in projectile classes that exist only in the retuned Android bundle. The survey's lane_impact claimed all 24 were per-level-numbered; do not act on that.

### `skills-meters/full-focus-negates-a-hit` — PARTIAL [A2]

A full Focus meter buys evasion in the web build: with reload == maxreload and the current stance's ultimate skill owned, an incoming attack is fully negated with 12 frames of immunity.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3383-3388 (duplicated at §1t4909s0§.as:74 and :311); skill ids at §1t120s0§.as:108-112`
- **Quote:** 3383:         if(this.§1t4465s0§() && this.§1t4414s0§ == this.§1t4415s0§ && (this.stance == §1t12220s0§ && this.§1t4491s0§(§1t120s0§.§1t10173s0§) > 0 || …))
3385:            §1t3246s0§ = 12;
3386:            §1t88s0§.instance.§1t1516s0§("Snd_jump");
3387:            return true;
---
§1t120s0§.as:108-112:  §1t10173s0§ = 1074 · §1t10174s0§ = 1075 · §1t10175s0§ = 1076
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L2/L5: directly contradicts the survey's 'Roll is what buys evasion, not Focus' and restores project memory's 'Focus buys evasion' as at least half right. PARTIAL because ids 1074/1075/1076 do NOT exist in skilldata.xml (real ids stop at 1068, then 1500/1501), so getStat on them likely returns 0 and the branch may be unreachable in shipped data — verify before coding, do not delete.

### `skills-meters/heavy-defense-penalty-is-web-true` — HELD [A2]

The ledger's uncited 'Heavy def x0.8' is confirmed as a web-build A2 fact.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3290`
- **Quote:** 3286:         if(this.stance == §1t12222s0§)
3288:            return defense * 0.8;
3290:         return defense;
- **Overturns:** "- **Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** L5: the penalty applies to Heavy ONLY (stance 2) — not to Dual or Reversed, which share Heavy's x1.4 damage but keep full defence. The ledger listed this under combat-core 'Ready' with no cite; it now has one in the shipped web build.

### `skills-meters/kunai-ammo-is-web-and-tiered` — HELD [A2]

The kunai ammo stat 2501 is present in the WEB v0.717 bundle, and skills spend 1, 4 or 8 ammo — the 8-cost tier does not exist in the Android build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:266-270, :319-323, :347-351 and §1t5184s0§.as:109-113; vs reference/decompiled/shs3_android_payload/scripts/SkillManager.as:254/259, 308/313, 474/479`
- **Quote:** 266:                   if(§1t1523s0§.§1t9714s0§(2501) == 0)
270:                   §1t1523s0§.§1t9713s0§(2501,-1);
319:                   if(§1t1523s0§.§1t9714s0§(2501) < 4)
323:                   §1t1523s0§.§1t9713s0§(2501,-4);
347:                   if(§1t1523s0§.§1t9714s0§(2501) < 8)
351:                   §1t1523s0§.§1t9713s0§(2501,-8);
---
§1t5184s0§.as:113:            this.§1t6959s0§.text = String(Math.floor(§1t1523s0§.§1t9714s0§(2501) / 4));
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2/L8: the ammo mechanic needs no Android caveat — cite the web bundle. Costs are tiered 1/4/8, and the hotbar slot renders floor(ammo/4) for the 4-cost skill, so the HUD shows 'charges' not raw ammo. Android has no 8-cost case, one more datapoint that Android AS3 is a different tuning.

### `skills-meters/maxreload-is-192-not-120` — HELD [A2]

The web v0.717 Focus/crit meter maxes at 8 * 24 = 192 frames, so the usable bar above the 48-frame dead zone is 144 frames and a stance switch costs one-third of it, not two-thirds.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (sole assignment; §1t4904s0§.as:77 is the only other, also 8 * 24) vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239`
- **Quote:** web  249:         this.§1t4415s0§ = 8 * 24;
android 239:         this.maxreload = 5 * 24;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: FOCUS_MAX = 192 frames (8 s at 24 fps), FOCUS_DEADZONE = 48, usable = 144, switch cost 48 = 33%. The 120 that the surveyor banked is the Android v0.682 number. This is the same Android-contamination failure the claim was written to correct, so the corrected constant must be propagated to any lane that consumed it.

### `skills-meters/only-83-level-rows-carry-a-number` — PARTIAL [A2]

83 of the 182 skill level rows carry a digit, not 135; 52 of the resolved level descriptions are purely qualitative, including all 30 stance-mastery rows.

- **Cite:** `reference/extracted/skilldata.xml level <desc> ids joined to docs/gauntlet/L0/index/strings.json (my parse: 182 rows / 47 blank / 135 resolved / 83 containing a digit)`
- **Quote:** 7000 -> 'Increased damage'                    (Light Stance Mastery, identical for all 10 levels)
7001 -> 'Increased damage and slash range'    (Balanced, all 10)
7002 -> 'Increased slash range'               (Heavy, all 10)
7067 -> 'Reduced cooldown'
7039 -> 'Increases your chances of harvesting rare crops'
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2: the transcribable numeric surface is 83 rows, not 135. Crucially the mastery ladder carries no numbers at all in the card text, so the 0.9/1.2/1.4 and reach ceilings rest entirely on §1t99s0§.as — there is no second, independent source for them.

### `skills-meters/only-83-numeric-level-rows` — HELD [A2]

Only 83 of the 182 skill level rows carry a number in their effect string; 135 merely resolve, and the 30 stance-mastery rows carry no number at all.

- **Cite:** `reference/extracted/skilldata.xml <level><desc> joined to docs/gauntlet/L0/index/strings.json (my parse this session)`
- **Quote:** levels 182 · blank 47 · resolved 135 · contain digit 83 · digit-free 52
7000 x10 -> 'Increased damage'                  (Light Stance Mastery lvl 1..10)
7001 x10 -> 'Increased damage and slash range'  (Balanced lvl 1..10)
7002 x10 -> 'Increased slash range'             (Heavy lvl 1..10)
7067 x3  -> 'Reduced cooldown'
- **Lane impact:** L2: the transcribable-with-numbers set is 83 rows, not 135. The 0.9/1.2/1.4 mastery ceiling is held ONLY by the AS3 (§1t99s0§.as:3262-3270) and never by card text, so the stance-damage claim is load-bearing rather than corroborated.

### `skills-meters/roll-cooldown-is-a-float` — HELD [A2]

At least one cooldown in skilldata.xml is not an integer: Roll (1004) level 2 is 3.5 seconds.

- **Cite:** `reference/extracted/skilldata.xml:264,271,278`
- **Quote:** 264: 			<cooldown>4</cooldown>
271: 			<cooldown>3.5</cooldown>
278: 			<cooldown>3</cooldown>
- **Lane impact:** L2: the config cooldown field must be a float. The survey's lane_impact 'config must encode the integers 5/10/9' is right for Chi Punch and Focus but would truncate Roll level 2 from 3.5s to 3s.

### `skills-meters/roll-cooldown-is-fractional` — HELD [A2]

At least one cooldown in skilldata.xml is fractional — Roll (1004) reads 4 / 3.5 / 3 — so the config field cannot be an integer.

- **Cite:** `reference/extracted/skilldata.xml:264, :271, :278; corroborated by docs/gauntlet/L0/index/skilldata.json cooldown distinct_values 14 with sample value "3.5"`
- **Quote:** 264: 			<cooldown>4</cooldown>
271: 			<cooldown>3.5</cooldown>
278: 			<cooldown>3</cooldown>
- **Lane impact:** L2: minor but concrete correction to the ledger-decimals claim's instruction that 'config must encode the integers 5/10/9' — the cooldown column is a float column. 3.5 s x 24 = 84 frames, so it is still frame-exact.

### `skills-meters/roll-dodge-is-75-85-95-in-web` — HELD [A2]

The Android string table's numeric effect copy is NOT web-true: Roll's cards say 60/80/100% dodge but the shipped web build rolls against 75/85/95.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3361-3376, with §1t120s0§.as:16 proving the skill id; contrast docs/gauntlet/L0/index/strings.json 7004/7005/7006`
- **Quote:** 3363:            _loc15_ = this.§1t4491s0§(§1t120s0§.§1t10127s0§);
3364:            if(_loc15_ == 1)      { _loc16_ = 75; }
3368:            else if(_loc15_ == 2) { _loc16_ = 85; }
3372:            else if(_loc15_ >= 3) { _loc16_ = 95; }
3376:            if(int(Math.random() * 100) < _loc16_)
---
§1t120s0§.as:16:      public static var §1t10127s0§:int = 1004;   // = Roll
---
strings.json 7004 -> '60% chance to dodge enemy attacks when rolling'
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** Cross-lane RULE CORRECTION for every downstream lane: the survey's parity rule 'Android XML is web-true, Android AS3 is not' has a third category it does not cover — the Android STRING TABLE, which is UI copy. Any number read out of a resolved <desc> must be labelled Android-sourced and re-checked against the web bundle. This is also the one place where 'a number that reads right, from a source one build off' already bit this survey twice.

### `skills-meters/skill-slot-base-is-web-sourced` — HELD [A2]

The 3-slot hotbar base is a web-build fact, not a string-table inference: getSkillSlotCount returns 3 + getStat(1008), and the Skill Slots+ skill's five levels read 4/5/6/7/8.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2742 (web) and reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2295 (android twin); reference/extracted/skilldata.xml skill 1008 level descs 7009-7013`
- **Quote:** web     2742:         return 3 + §1t9714s0§(1008);
android 2295:         return 3 + getStat(1008);
---
Skill Slots+ lvl 1..5 -> '4 skill slots' .. '8 skill slots'
- **Lane impact:** L8/ui-hud blocker ④: the hotbar is 3 slots at start, 8 fully invested, and the constant is identical in both builds so it carries no Android caveat. The survey reached the right answer from an Android-labelled string; this gives it a web cite.

### `skills-meters/slashusage-is-a-weapon-stat` — HELD [A2]

The meter's slash cost is a per-weapon itemdata field floored at 48, with an effective domain of {48, 72, 96} — so Light slashes cost {24, 36, 48} frames against a 144-frame visible bar.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2350-2358; reference/extracted/itemdata.xml:8044; docs/gauntlet/L0/index/itemdata.json -> itemdata/item/slashusage (count 106, distinct_values 3, numeric_range [24,96], sample_values ['24','72','96'])`
- **Quote:** 2353:         if(_loc1_ == null || _loc1_.slashusage < 48)
2355:            return 48;
2357:         return _loc1_.slashusage;
---
itemdata.xml:8044:		<slashusage>72</slashusage>
- **Lane impact:** L2/L9: the crit economy is weapon-dependent and codeable today — slashUsage comes from the equipped weapon, is clamped up to 48, and is then scaled x0.5 (Light) / x1.0 (Balanced, Reversed) / x1.5 (Heavy, Dual). Cross-lane hand-off to items-equipment: 106 items carry the field and it takes only three values.

### `skills-meters/spd-dead-in-web-meter` — HELD [A2]

baseReload (48 + SPD*6) is passed into the web player and never read again — SPD has zero effect on the Focus/crit meter in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276; §1t99s0§.as:103,191; only other reference is the copy-constructor §1t4904s0§.as:49`
- **Quote:** §1t1523s0§.as:2276:         return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
§1t99s0§.as:103:      internal var §1t4419s0§:int = 48;
§1t99s0§.as:191:         this.§1t4419s0§ = param7;
(grep -rn '§1t4419s0§' shs3_payload/scripts/ returns no read site)
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: do NOT port an SPD-scaled reload. Combined with the flat ++ fill and the flat 8*24 max, the meter is stat-independent; SPD touches only cooldowns (cap 600) and slash reach.

### `skills-meters/spd-does-not-touch-the-meter-in-web` — HELD [A2]

SPD has zero effect on the Focus/crit meter in v0.717: the 48 + SPD*6 base-reload value is computed and passed into the player but never read, and the meter fills a flat +1 per tick.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2274-2276 and §1t99s0§.as:103, :191, :1203-1205 (grep -rn '§1t4419s0§' over shs3_payload/scripts returns only those three sites plus §1t4904s0§.as:49)`
- **Quote:** 2276:          return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
---
 103:      internal var §1t4419s0§:int = 48;
 191:         this.§1t4419s0§ = param7;
---
1203:         if(this.§1t4414s0§ < this.§1t4415s0§)
1205:            ++this.§1t4414s0§;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: do NOT port Android's SPD-scaled reload. Fill rate is a constant 1 frame per tick to a constant 192 ceiling; SPD only affects skill cooldowns (cap 600) and slash reach. This closes the 'fill' third of ledger blocker ③, which no claim in the survey addressed.

### `skills-meters/speed-buff-premultiplies-spd` — HELD [A2]

The SPEED buff multiplies SPD by 1.5 BEFORE both the cooldown modifier and the base slash length are computed — so it silently moves the 600 cooldown cap and lengthens reach.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2287 (cooldown) and :2334-2341 (reach)`
- **Quote:** 2281:         var _loc1_:int = §1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§);
2282:         if(§1t9725s0§(§1t9455s0§))
2284:            _loc1_ *= 1.5;
2286:         return §1t9590s0§(_loc1_);
---
2336:         var _loc1_:int = §1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§);
2339:            _loc1_ *= 1.5;
2341:         return §1t9593s0§(_loc1_);
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2/L5/L10: the '150% SPEED' food buff is not cosmetic — it shortens every skill cooldown AND extends slash reach through the same SPD term, and under it the 600 cap bites at SPD 400. The buff family is an else-if chain (§1t99s0§.as:209-223), so exactly one is ever active.

### `skills-meters/web-kunai-ammo-gate-1-4-8` — HELD [A2]

The kunai/trap ammo mechanic on stat 2501 is present in the WEB bundle, not just Android, and the web build has an 8-ammo cost tier that Android lacks.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:266,270,319,323,347,351; hotbar display at §1t5184s0§.as:113; android has only two tiers at SkillManager.as:254/259, 308/313, 474/479`
- **Quote:** 266:                  if(§1t1523s0§.§1t9714s0§(2501) == 0)
270:                  §1t1523s0§.§1t9713s0§(2501,-1);
319:                  if(§1t1523s0§.§1t9714s0§(2501) < 4)
323:                  §1t1523s0§.§1t9713s0§(2501,-4);
347:                  if(§1t1523s0§.§1t9714s0§(2501) < 8)
351:                  §1t1523s0§.§1t9713s0§(2501,-8);
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: the ammo mechanic can be promoted from Android-caveated to web-v0.717 fact, and needs three cost tiers (1/4/8) rather than the one the survey cites. The hotbar shows floor(ammo/4) for the 4-cost skill.

### `skills-meters/web-maxreload-is-192` — HELD [A2]

The web v0.717 Focus/crit meter maximum is 192 frames (8 seconds), not the 120 frames (5s) the survey banked; 120 is the Android value.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249; corroborated at §1t4904s0§.as:77; android reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239`
- **Quote:** web  249:         this.§1t4415s0§ = 8 * 24;
web  §1t4904s0§.as:77:         §1t4415s0§ = 8 * 24;
android 239:         this.maxreload = 5 * 24;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: encode MAX_RELOAD = 192 frames. Usable range is 192-48 = 144 frames, a stance switch (48) costs one-third of it, and with the flat ++ fill at §1t99s0§.as:1203-1205 a cold-to-crit cycle is 192 ticks = 8s at 24fps. Blocker ③ is still closed, but with different numbers than the survey reports.

### `ui-hud/150-percent-damage-is-a-buff` — HELD [A2]

The "150% DAMAGE" line in the duel HUD is the timed BUFF_ATTACK consumable readout, not the stance modifier — the string is a literal in the client.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1428 (updateBuff); docs/gauntlet/L0/index/strings.json id 4132; corroborated in reference/frames/duel_dense/Nr4fQstqHDM_432.0.png crop (52,900)-(700,1080) x3`
- **Quote:** OverworldHUD.as:1402-1405 `else if(bufftype == StatsManager.BUFF_ATTACK) { buffstr = "150% DAMAGE"; }` (siblings "150% XP", "150% DEFENSE", "150% SPEED", "200% AP REGEN")  ·  strings.json 4132 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'  ·  in my HUD crop the two rows are visually distinct: "CANNOT CHANGE STANCE" sits in a brown pill under the bars, "150% DAMAGE" is a separate gold line below it.
- **Lane impact:** ui-hud gains a required buff-text slot (OverworldHUD.bufftext, htmlText, hidden when duration <= 0 or the stats button is hidden). Closes the "un-reconciled" caution the surveyor left on art-anim-audio-feel/hit-reaction-12-ticks, and closes it against the surveyor's own guess.

### `ui-hud/24fps-from-swf-headers` — HELD [A2]

The 24 fps that every millisecond figure in this lane depends on is provable from the SWF headers of both payloads, not from the conditional fallback the pass implicitly relied on.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf (SWF header parse: signature/version/rect/frameRate/frameCount)`
- **Quote:** shs3_payload_decoded.swf = CWS v17, stage rect 16000x13800 twips -> 800x690 px, frameRate 24.0, frameCount 6. shs3_android_payload_decoded.swf = CWS v26, stage rect 16000x9600 twips -> 800x480 px, frameRate 24.0, frameCount 6. (The only frameRate reference in the AS3 is Mobile.as:113-117, `if(GameEngine.getStageMC().frameRate == 0){ ... frameRate = 24; }`, which is a wake-from-sleep fallback, not the authored rate.)
- **Lane impact:** ui-hud lane: puts an A2 floor under every ms conversion in the lane (708 ms close shutter, 667 ms open shutter, 250/417 ms result-card beats, 0/792/2833/3625 ms duel intro, 12-frame damage popup). Cross-lane: combat-core and skills-meters convert frame counts to ms with the same constant and can now cite the header instead of inferring it. Also confirms both build stage rects in one place - web 800x690 authored canvas, android 800x480.

### `ui-hud/blackopen-shutter-is-16-frames` — HELD [A2]

The two black shutters are NOT symmetric: the closing shutter runs 17 frames (708 ms) because of an explicit counter gate, but the opening shutter has no gate and completes in 16 frames (667 ms).

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:93-108,159-162`
- **Quote:** `else if(this.transitionType == TRANSITION_BLACKOPEN){ this.blackup.y -= this.blackMovtSpeed; this.blackdown.y += this.blackMovtSpeed; this.blackMovtSpeed += 2; if(this.blackup.y <= -240){ this.blackup.y = -240; this.blackdown.y = 480; ... this.doAction(); } }` - no `counter` test anywhere in the branch. From startOpen (`blackup.y = 0; blackMovtSpeed = 0; counter = 0;`) displacement after n frames is n(n-1), so n=16 gives exactly 240 and the branch fires at frame 16. Simulation output: 'OPEN done at frame 16 y -240.0' vs 'CLOSE done at frame 17'.
- **Lane impact:** ui-hud lane: corrects this pass's claim ui-hud/transition-durations-exact, which asserts 17 frames for both shutters. A rebuild that ports 708 ms to the open shutter will be 41.7 ms slow on every room entry, node explore, teleport and rest - i.e. on essentially every world-exploration transition. Also invalidates the stated derivation (n-2)(n-1); the correct displacement law is n(n-1).

### `ui-hud/frame-to-stage-mapping-is-anisotropic` — HELD [A2]

The reference video's frame-to-stage mapping is anisotropic — x divides by 2.270 but y divides by 2.250 — and the fit branch in the shipped code explains exactly why.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:283-290, cross-checked against pillarbox measured on reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (cols 52->1867 w 1816, rows 0->1079) and all 240 reference/frames/broad_survey/*.jpg`
- **Quote:** `newScale = stageMC.stageHeight / originalHeight; offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2; offsetY = 0; fitWidth = false;` — the wide-container branch fits HEIGHT and pillarboxes. At 1080 px that is exactly 1080/480 = 2.250 vertical; the measured horizontal is 1816/800 = 2.270, a ~0.9 % stretch introduced by the re-encode (a true 2.250 fit would give 1800 px of content, not 1816).
- **Lane impact:** Cross-lane measuring convention. Any lane converting a frame Y with 2.270 is 1 % wrong — this lane's own claim 7 did exactly that and published (639.4, 446.0) against a code truth of (640, 450). The lane journal already states the correct rule at docs/gauntlet/L0/systems/ui-hud.md:31-32; the structured claim contradicted it.

### `ui-hud/friend-bar-is-structurally-unfilmable` — HELD [A2]

The 800x690 friend-bar layout cannot appear in any 16:9 capture: the game enables it only when the player's window aspect is at most 800/690 = 1.1594, so its absence from the reference videos is structural rather than a sampling accident.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:271-279 (web equivalent reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273), corroborated by my scan of 267 frames sampled across all 45 directories under reference/frames/`
- **Quote:** `var originalWidth:int = 800; var originalHeight:int = 480; var originalHeightWithBar:int = 690; var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar; var newAspectRatio:Number = stageMC.stageWidth / stageMC.stageHeight; if(newAspectRatio <= originalWithBarAspectRatio) { originalHeight = originalHeightWithBar; StatsManager.stageShowingFriendBar = true; ... friendpanel.init(); }` — 800/690 = 1.1594. Scan result: 236 full 1920x1080 frames, every one with content aspect >= 1.45, zero candidates below.
- **Lane impact:** ui-hud: upgrades claim ui-hud/690-friend-bar-never-filmed from PARTIAL (a 7-frame induction) to HELD with a code proof and a 267-frame scan. The practical conclusion is unchanged and correct - if the friend bar is built it must be labelled INFERRED-from-source, because no artifact anywhere shows it rendered.

### `ui-hud/interact-icon-manifest-found` — HELD [A2]

The InteractUI icon manifest is on disk and the id space is far smaller than assumed: only 20 distinct icon ids appear across the 139 references, and GenericActionButton resolves every one of them to a named MovieClip class.

- **Cite:** `reference/decompiled/shs3_android/scripts/GenericActionButton.as:262-345 and NodeUI.as:13-75, against reference/extracted/android/90_InteractUI_UIData.bin`
- **Quote:** `public function setInteractIcon(iconID:int) : * { ... switch(iconID){ case NodeUI.ACTION_LEAVE: this.image = new LeaveActionIcon(); break; case NodeUI.ACTION_LOOK: this.image = new LookActionIcon(); break; case NodeUI.ACTION_SHOP: case NodeUI.ACTION_BUY: case NodeUI.ACTION_SELL: this.image = new ShopActionIcon(); break; ... } }` with `ACTION_SHOP:int = 1` ... `ACTION_MEDAL:int = 31`. 25 case labels -> 22 named icon classes. Distinct ids actually used in the blob: 1,2,4,7,11,12,14,15,16,18,19,21,23,24,25,26,27,29,30,31 - all 20 covered. Frequency: 15=ACTION_BUY x42, 14=ACTION_LEAVE x22, 23=ACT
- **Lane impact:** ui-hud: refutes the 'no icon manifest for the 139 icon ids' half of claim ui-hud/hud-symbol-metrics and of the score rationale. Only the vector art is unexported; the id->class mapping is complete. Also feeds world-exploration and economy, since the same 20 action icons drive every town interaction menu in 90_InteractUI_UIData.bin.

### `ui-hud/pass1-fabricated-transunit-quote` — HELD [A2]

This lane's Pass-1 journal contains a verbatim XML quote that does not exist in the artifact it cites.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin vs docs/gauntlet/L0/systems/ui-hud.md:465`
- **Quote:** The journal reads `<trans-unit id="388" resname="388"><source>Game Paused</source></trans-unit>`. Substring test over the decoded blob: `'<trans-unit id="388" resname="388">' in d` -> False. The two real rows are `<trans-unit id="369" resname="388">\r\n<source>Condition: Poor</source>` and `<trans-unit id="388" resname="407">\r\n<source>Game Paused</source>`.
- **Lane impact:** ui-hud lane hygiene, and a cross-lane warning: §0 calls a fabricated cite the worst available outcome, and one is already banked in a journal. Pass 2 caught the downstream consequence (resname vs id keying) but not the fabrication itself. Any other lane that re-derived a string from a journal-quoted <trans-unit> line rather than from the blob should be re-checked against reference/extracted/android/118_Mobile_Lang_EN.bin directly.

### `ui-hud/reload-crit-meter-code-live-frame-absent` — PARTIAL [A2]

A third combat meter exists and is live in code -- a reload bar whose fill drives a 'Critical Hit' label at 100% -- but it renders in zero reference frames, so it is code-held and frame-absent, not recovered.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:48,60,102,259-262 and MCSPlayer.as:241,1168,3112,3272`
- **Quote:** `public var crittext:TextField;` (:48), `public var reloadbar:MovieClip;` (:60), `this.crittext.text = LangManager.getString(175);` (:102, resname 175 = 'Critical Hit'), and `updateReload(percentage:Number){ this.reloadbar.bar.scaleX = percentage; this.crittext.visible = percentage >= 1 && this.reloadbar.visible; }` (:259-262). Driven live from four MCSPlayer sites: `updateReload(this.reload / this.maxreload)` (:3112), `updateReload((this.reload - 24) / (this.maxreload - 24))` (:3272), `updateReload(this.tempreload / (this.maxreload - 24))` (:1168), `updateReload(0)` (:241). But `reloadbar.vis
- **Lane impact:** skills-meters and combat-core, flagged not banked. It contests the standing line 'OG has NO Critical meter (Focus buys evasion)', but my crop (0,910)-(700,1080) at 2x of duel_dense/Nr4fQstqHDM_428.0.png shows TWO bars only -- no third meter -- so THE FRAME WINS and the existing line survives. Treat as a lead: the widget is compiled in and driven by reload/maxreload with a -24 (one-second-at-24fps) offset, but nothing proves it was ever visible in v0.717.

### `ui-hud/resname-600-proves-pass1-read-the-id-column` — HELD [A2]

resname 600 is 'Special Control Point' while id 600 is 'Auto Slash Off' - direct proof that Pass 1 was reading the id column, which kills its 'different build revision' diagnosis and invalidates the resolution rule it left behind for every other lane.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin, trans-units id/resname 600 and 601, adjudicating docs/gauntlet/L0/systems/ui-hud.md:505-509`
- **Quote:** resname 600 = 'Special Control Point' | id 600 = 'Auto Slash Off'; resname 601 = 'Villages may be converted into towns that can function as a Command HQ if the territory comes under attack' | id 601 = 'Auto Slash On'
- **Overturns:** "The true strings for the mismatches are present at **different** ids — 600 "Auto Slash Off", 601 "Auto Slash On" … Rule for downstream lanes: ids below ~400 resolve directly; above that, resolve by **string search, then corroborate against `ui_strings.txt` or a frame** — never by id alone."
- **Lane impact:** Cross-lane. Pass 1 claim 17 is still live in the journal as guidance for other lanes and its rule is wrong. There is no build drift and no need for string search: resolve by resname, always, at every id. reference/extracted/android/118_Mobile_Lang_EN.bin is a single table read with two different keys.

### `ui-hud/shutter-is-asymmetric` — HELD [A2]

The black screen-shutter is asymmetric: closing takes 17 frames (708 ms) but opening takes 16 frames (667 ms), because only the close path is counter-gated.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:80-89 vs :95-106; 24.0 fps from the SWF headers of reference/decrypted/shs3_payload_decoded.swf and shs3_android_payload_decoded.swf`
- **Quote:** Close: `if(this.blackup.y >= 0){ ... if(this.counter >= 17){ this.doAction(); } }` (:83-89). Open: `if(this.blackup.y <= -240){ ... this.doAction(); }` (:98-106) — no counter test. Speed is applied before it increments (:80-82), so displacement after n frames is n(n-1), which equals 240 at n=16; the open path therefore fires at frame 16 and the close path holds one extra frame for the gate.
- **Lane impact:** L-ui-hud: corrects the lane's own transition-duration claim. A rebuild that plays both shutters at 17 frames will be 42 ms long on every screen entry.

### `ui-hud/skill-slot-widget-geometry-measured` — PARTIAL [A1]

The skill-slot widget's pixel geometry is not sealed in the symbol after all: the box is 49-50 game px square on a 60 game px pitch centred at y=450, and the code carries the matching hit-band edge at game y=420.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png — empty-box border measured in region (1430,930)-(1580,1080), mean-RGB>150, >=5 px per row/col; numeral centroids measured in rows 930-975 — cross-checked against reference/decompiled/shs3_android/scripts/BattleUI.as:339 and web §1t113s0§.as:451`
- **Quote:** Empty-box bright outer border: cols 1448->1559 (centre 1503.5), rows 961->1072 (centre 1016.5) = 112 x 112 video px. Numeral centres: '2' at 1641.0, '3' at 1777.5, pitch 136.5-137.5 px. At scale 2.25-2.27 that is a 49-50 game px box on a ~60 game px pitch. Code: `if(mousey > 420 * StatsManager.stageScale + StatsManager.stageOffsetY)` guards the eight-slot hit test - a 50 px box centred on y=450 spans 425-475, which is exactly why the band opens at 420.
- **Lane impact:** ui-hud: partially refutes claim ui-hud/hud-symbol-metrics ('HUD panel/bar/plaque pixel geometry ... remain ungrounded - I will not name any of them'). One HUD widget is now buildable from the frame plus code without any JPEXS export. The panel/bar/plaque chrome genuinely does remain symbol-locked - BattleUI.doResize (:929-936) only sets scaleX/scaleY/x/y on the whole clip - so the rest of that claim stands.

### `ui-hud/slot-strip-matches-all-three-constants` — HELD [A1]

Converted with the game's own fit routine rather than a single uniform scale, all three visible skill slots land on the shipped constants, and the y error collapses from 4 px to under 2 px.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (1380,920)-(1880,1080) upscaled 3x, plus per-column/row luminance extents and digit-glyph centroids over the full 1920x1080 frame`
- **Quote:** Measured in the frame: empty slot bright-border cols 1448->1560 (centre 1504.0), rows 960->1073 (centre 1016.5); digit '2' centroid x=1641.0, digit '3' centroid x=1777.5 (pitch 136.5 px). GameEngine.resizeHandler:267-307 gives offsetY=0 and newScale = stageHeight/480 = 2.25 for content wider than 800/480; horizontal offset/scale measured as x0=52, 1816/800 = 2.27. Converting: game x = 639.4 / 700.0 / 760.1 against `skillSlotButton.x = 760 - i * 60` = 640 / 700 / 760 for i = 2 / 1 / 0; game y = 1016.5/2.25 = 451.8 against `skillSlotButton.y = 450`.
- **Lane impact:** ui-hud lane: replaces the surveyor's non-reproducible row measurement (they report rows 952->1073, centre 1012.5; no threshold I tried reproduces 952) and its 4-px y error. It also supplies the correct frame<->stage conversion for the whole lane - offsetY=0 with vertical scale 1080/480 = 2.25, NOT a single uniform 2.270 - which every future A1 measurement in ui-hud and combat-core should use, since applying 2.270 vertically biases every stage-y by about -1.8%.

### `ui-hud/swf-header-24fps-and-stage-rects` — HELD [A3]

Byte-check of the SWF headers: the web payload's authored stage is 800x690, the android payload's is 800x480, and BOTH run at exactly 24.000 fps - which is the missing premise under every millisecond figure in this lane.

- **Cite:** `Header parse of reference/decrypted/shs3_payload_decoded.swf, shs3_android_payload_decoded.swf and shs3_binarydata_9_decrypted.swf (CWS signature, zlib body, RECT + frameRate + frameCount fields)`
- **Quote:** shs3_android_payload_decoded.swf  CWS v26  rect [0.0, 800.0, 0.0, 480.0]  fps=24.000  frames=6
shs3_payload_decoded.swf          CWS v17  rect [0.0, 800.0, 0.0, 690.0]  fps=24.000  frames=6
shs3_binarydata_9_decrypted.swf   CWS v10  rect [0.0, 800.0, 0.0, 690.0]  fps=24.000  frames=1
- **Lane impact:** ui-hud: claim ui-hud/transition-durations-exact asserts 708 ms and 1000 ms 'at the SWF's 24 fps' but cites no artifact for 24 fps; likewise claim ui-hud/result-cards-exact's 250/417 ms. This supplies it for both builds. It also shows the web build's AUTHORED stage is the with-friend-bar size while the LOGICAL stage is 800x480 in both (§1t1523s0§.as:104,106), which is what keeps the frame-vs-code geometry consistent.

### `ui-hud/swf-headers-24fps-and-stage-rects` — HELD [A3]

Both builds run at exactly 24 fps and the web SWF's native stage is 800x690 while the Android SWF's is 800x480 -- the byte-check that every frame-to-milliseconds conversion in this lane silently depends on.

- **Cite:** `SWF header byte-read of reference/decrypted/shs3_android_payload_decoded.swf, reference/decrypted/shs3_payload_decoded.swf, reference/preservation/shs3.swf`
- **Quote:** Parsed signature/version/RECT/frameRate from each header: ('shs3_android_payload_decoded.swf', 'CWS', 26, 21688592, 'stage 800.0x480.0', 'fps 24.0', 'frames 6'); ('shs3_payload_decoded.swf', 'CWS', 17, 11892061, 'stage 800.0x690.0', 'fps 24.0', 'frames 6'); ('shs3.swf', 'CWS', 10, 165252, 'stage 800.0x690.0', 'fps 24.0', 'frames 2').
- **Lane impact:** ui-hud lane: grounds claim 2's 708 ms / 1000 ms, claim 8's 250 ms / 417 ms and claim 11's VS/FIGHT beats, all of which asserted '24 fps' without a cite. Also sharpens claim 12: 800x690 is not an exotic branch, it is the web build's OWN stage rect -- the videos were captured with the friend bar suppressed by window aspect (GameEngine.as:275). Third: the 800x480 Android stage independently confirms ScreenTransition's shutter halves parking at +/-240.

### `ui-hud/web-battleui-diverges-from-android` — HELD [A2]

The web v0.717 BattleUI is a strictly larger class than the Android v0.682 one -- 1,344 lines vs 939 -- and calls eleven string ids that do not exist anywhere in the Android string table, so combat-HUD parity between the two builds is disproven, not merely unestablished.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:169-171,1269-1316 vs reference/decompiled/shs3_android/scripts/BattleUI.as (wc -l: 1344 vs 939)`
- **Quote:** Web: `_loc1_.x = 760 - _loc2_ * 60;` `_loc1_.y = 450;` (:170-171, identifying this as BattleUI, together with `getString(619)`/`getString(620)` on the autoslash labels at :161-162). Its getString id set is {45,126,175,184,208,419,420,421,619,620,713,868,960,11119,11120,11121,11122,11123,11124,11125,11126,11130,11131}; the Android class's is {45,126,175,184,208,419,420,421,619,620,713,868}. The 11 extras resolve to NOTHING in 118_Mobile_Lang_EN.bin (max numeric resname there = 9010). :1269-1316 is an 8-branch selector ending `_loc4_ = "<font color='#FF0000'>" + getString(11130) + "</font>";` wr
- **Lane impact:** Cross-lane, and it is the counter to this lane's own claim 7. Any lane that resolved a web-build string id through the Android blob must first check the id EXISTS there -- 11 do not in this one class. It also means the ui-hud lane's Android-sourced HUD behaviour is a lower bound on the web build's, not a match.

### `ui-hud/web-build-confirms-resname` — HELD [A2]

The WEB build proves the resname keying by itself, so the string-id correction carries no Android-build caveat at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/shs3_fla/PauseScreen_51.as:26`
- **Quote:** `this.loadingtext.text = §1t1521s0§.getString(407);` — in the obfuscated WEB decompile, whose §1t1521s0§ carries getString/getLanguage/CHINESE. Under the resname map 407 = 'Game Paused'; under the id attribute 407 = 'Search rocks'. Only one of those belongs on a pause screen.
- **Lane impact:** Cross-lane. Every lane that must re-derive a Mobile_Lang_EN id against strings.json resnames can now do so WITHOUT the 'Android v0.682 vs web v0.717 parity not established' caveat the surveyor attached — the web build performs the same lookup on the same key.

### `ui-hud/web-hud-status-lines-absent-from-android` — HELD [A1]

The web combat HUD carries two status lines under the HP/Chi bars -- a brown CANNOT CHANGE STANCE plaque and a yellow 150% DAMAGE line -- that have no counterpart in any Android artifact, so the frame overrules the Android decompile on combat-HUD parity.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png, crop (0,910)-(700,1080) upscaled 2x`
- **Quote:** Visible in the crop: circular portrait in a red ring with a straw kasa, a green bar reading 20/20, a blue bar reading 26/26, then a brown plaque reading CANNOT CHANGE STANCE and below it a yellow line reading 150% DAMAGE. The string 'cannot change stance' occurs in 0 of the 2,555 trans-units of reference/extracted/android/118_Mobile_Lang_EN.bin and in 0 Android scripts; '150% Damage' occurs only inside item description resname 4132 ('Eat this potato to get the 150% Damage buff.'), never as a HUD line; and reference/decompiled/shs3_android/scripts/BattleUI.as has no buff/status renderer at all 
- **Lane impact:** ui-hud lane: refutes claim 7's 'retires the android parity not established caveat for the combat HUD'. THE MEASUREMENT DOC (the Android decompile) AND THE FRAME DISAGREE, AND THE FRAME WINS. Also adds a HUD element the ledger's Ready bullet list omits: a buff/status readout strip.

### `ui-hud/web-payload-is-directly-citable` — HELD [A2]

The web v0.717 decompile at reference/decompiled/shs3_payload/scripts/ has obfuscated class names but intact numeric literals and public member names, so a grep for a distinctive constant identifies any HUD class and lets this lane cite the WEB build directly instead of inferring parity from Android.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171 (BattleUI), §1t5474s0§.as:46,49,53,105,136,147 (DialogBox), §1t6497s0§.as:89,113 (ScreenTransition), §1t1540s0§.as:271-273 (GameEngine.resizeHandler), §1t5186s0§.as:26 (WinUI), §1t1523s0§.as:104,106 (StatsManager)`
- **Quote:** §1t113s0§.as:170-171 `_loc1_.x = 760 - _loc2_ * 60;` / `_loc1_.y = 450;`; §1t6497s0§.as:89 `if(this.counter >= 17)` and :113 `this.white.alpha -= 1 / 24;`; §1t1540s0§.as:271-273 `_loc2_:int = 800; _loc3_:int = 480; _loc4_:int = 690;`; §1t1523s0§.as:104,106 `public static var stageWidth:int = 800;` / `public static var stageHeight:int = 480;`
- **Lane impact:** Cross-lane. Pass 1 claim 18 found the Rosetta METHOD but nobody applied it to the HUD; Pass 2 then built its headline parity argument (claim ui-hud/slot-geometry-frame-validated) on a frame inference that was never needed. Before any lane ships an Android-only number it should grep shs3_payload/scripts/ for the literal - a one-command check that just caught a real divergence (see web-vs-android-cooldown-rounding).

### `ui-hud/web-payload-logic-is-on-disk` — HELD [A2]

The web v0.717 payload's ActionScript is on disk as 612 identifier-mangled classes, so every Android-sourced constant in every lane can be checked against the web build directly -- the 'Android parity not established' caveat is dischargeable by grep, not by video re-passes.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (612 files matching §1t*s0§.as) — verified instances: §1t113s0§.as:170-171, §1t5474s0§.as:46,49,53,57,86,105,107,136,147, §1t6497s0§.as:89,100-103,113`
- **Quote:** Class and member names are mangled but numeric and string literals survive intact. `_loc1_.x = 760 - _loc2_ * 60;` / `_loc1_.y = 450;` (§1t113s0§.as:170-171) matches Android BattleUI.as:133-134. `this.button.x = 340;` (:46) `this.msgText.y = 187.5;` (:49) `this.msgText.y = 220;` (:53) `if(this.msgText.numLines <= 2)` (:57) `this.button.x = 270;` (:86) `this.button2.x = 425;` (:105) `if(this.msgText.numLines == 1)` (:107) — same values AND same line numbers as Android DialogBox.as. `if(this.counter >= 17)` (:89), `this.blackup.y = -240; this.blackdown.y = 480;` (:102-103), `this.white.alpha -= 
- **Lane impact:** Cross-lane tooling. Every lane currently hedging with 'this is the ANDROID build, clientVersion 0.682, parity not established' has a cheap, first-hand way to settle it: grep the mangled tree for the literal. It also means claim 7's video-measurement route to parity was unnecessary, and — per the sibling finding on §1t113s0§ — that the answer is not uniformly 'parity holds': the shared classes match exactly, but web BattleUI has 405 extra lines the Android build does not.

### `ui-hud/web-vs-android-cooldown-rounding` — HELD [A2]

The web v0.717 build rounds the skill-slot cooldown sweep with Math.ceil while the android v0.682 build truncates with int, so the shipped web sweep is 13 shade steps that reuse the disabled frame, not 12 steps with a 13th reserved frame.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226 vs reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220`
- **Quote:** WEB: `_loc1_ = Math.ceil(this.cooldown / this.cooldownmax * 12) + 1;`  ANDROID: `newframe = int(this.cooldown / this.cooldownmax * 12) + 1;`  Both preceded by an identical `--this.cooldown;` and followed by an identical `if(this.shade.currentFrame != newframe){ this.shade.gotoAndStop(newframe); }`.
- **Lane impact:** ui-hud: refutes claim ui-hud/skill-cooldown-12-step-quantised as written and destroys the 'retires the android parity caveat for the combat HUD' conclusion in claim ui-hud/slot-geometry-frame-validated. Cross-lane (skills-meters, combat-core): this is the first MEASURED counter-example to android/web parity, so Stage-0 finding S0-3's caveat must stay live and every Android-sourced tuning number needs a build label.

### `world-exploration/21-of-27-blobs-are-cross-build-identical` — HELD [A3]

Twenty-one of the twenty-seven web-payload bindata blobs are byte-identical to their Android counterparts, including all five NameGenerator tables, the QuestEngine trap-room file and fourteen MCSCharacter animation sets -- so the Stage-0b v0.682 caveat applies to AS3 constants, not to the data blobs.

- **Cite:** `md5 sweep of reference/extracted/bindata/*.bin (27 files) vs reference/extracted/android/*.bin (42 files)`
- **Quote:** 110_Mobile_MapBitmapData.bin == 92_1t4648s0.bin (272 B) | 84_QuestEngine_TrapRoomData.bin == 93_1t4647s0.bin (39,193 B) | 85_NameGenerator_MaleNames.bin == 94_1t4651s0.bin (3,618 B) | 86_NameGenerator_NobleFamilyNames.bin == 95_1t4649s0.bin (279 B) | 87_NameGenerator_SamuraiFamilyNames.bin == 96_1t4652s0.bin (289 B) | 88_NameGenerator_FemaleNames.bin == 97_1t4650s0.bin (2,094 B) | 89_NameGenerator_PlaceNames.bin == 98_1t4653s0.bin (5,698 B) | + 14 MCSCharacter_* animation sets (Deer, DualStance, Wolf, Goblin, HeavyStance, Boar, LightStance, Bear, Human2, ReversedStance, Horse, BalancedStance, 
- **Lane impact:** L1 world-exploration, and every lane that inherits the Stage-0b Android caveat. It refutes this journal's own cross-build-numeric-parity claim ('only the land mask is byte-proven identical') and its score rationale ('the one world artifact with proven cross-build parity'). Concretely it upgrades place-name-reproduced-from-payload: the PlaceNames table the generator reads is cross-build proven, so only the AS3 exception list is in doubt. It also hands L6 art-anim a fact worth its own claim -- 14 of the 19 web animation sets are byte-identical to the Android ones, so the Android animation data is not a port-specific rebuild.

### `world-exploration/ap-cap-formula-is-frame-confirmed` — HELD [A1]

The Android level+30 max-AP formula reproduces the web build's own HUD exactly -- the frame that was used to rule 'the 30 max must not be ported' shows a LEVEL 10 player with AP 30/40, and 10+30 = 40 -- so there is no frame-vs-payload conflict on AP cap, and the prior banked ruling that 'AP max is 40' (flat) is itself wrong.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg, crop (470,110)-(780,290) Lanczos x4 AND crop (300,0)-(1024,130) Lanczos x3 of the same frame; formula at reference/decompiled/shs3_android/scripts/InventoryUI.as:2409`
- **Quote:** Visible in crop (470,110)-(780,290): three stat bars reading 'HP 20 / 30', 'CHI 47 / 47', 'AP 30 / 40'. Visible in crop (300,0)-(1024,130) of the SAME frame: a gold diamond level badge reading '10', beside '26234 / 31400' captioned 'EXPERIENCE POINTS', and 'AVAILABLE STAT POINTS: 0'. Code: this.statsPanel.APadd.visible = StatsManager.getStat(StatsManager.STAT_MAXAP) < 20 + (charlevel + 10);
- **Lane impact:** L1 world-exploration and L10 economy. (1) It upgrades world-exploration/ap-regen-and-cap from A2 to A2+A1 -- the cap is FRAME-CONFIRMED, not merely code-sourced. (2) It partially overturns the banked claim economy/ap-and-token-caps-are-40 (docs/gauntlet/L0/CLAIMS.md:2288), which ruled 'AP max is 40' and 'the 30 max does not and must not be ported': AP max is neither 30 nor 40, it is level+30, and both observations are instances of it (30 = the level-1 creation initial at StatsManager.as:707-708, 40 = the level-10 ceiling). (3) It is a FOURTH frame-code agreement showing an Android v0.682 AS3 constant reproducing web v0.717 behaviour, which materially weakens the blanket 'every ported number is v0.682' discount. The duel-token half of CLAIMS.md:2288 is untouched and still needs its own check.

### `world-exploration/ap-zero-is-a-pose-not-a-death` — HELD [A2]

AP==0 in adventure mode does not kill or retreat the player — it swaps the idle animation to "tired"; outside adventure mode the same pose fires at HP <= maxhp/4.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1230 (+ MCSActor.as:116)`
- **Quote:** case IDLE_STATE:
   if(!GameEngine.isAdventureMode() && !StageManager.isRedFreeze() && getHP() <= maxhp / 4 || GameEngine.isAdventureMode() && this.controlledBy == 0 && StatsManager.getStat(StatsManager.STAT_AP) == 0)
   {
      startAnim(TIRED);
   }
   else
   {
      startAnim(IDLE_SHEATHED);
   }
---
internal static var TIRED:String = "tired";
- **Lane impact:** L1 world-exploration and L6 art-anim: CORRECTS the world-exploration journal's own lane_impact on claim ap-regen-and-cap, which reads this line as "a death/retreat condition". It is an idle-pose selector. grep for `STAT_AP) == 0` across all 559 android classes returns this single line — there is no AP-death rule anywhere. The portable rule is: adventure-mode idle has two poses (tired / idle_sheathed) gated on AP==0, and duel-mode idle has two poses gated on HP <= 25%. That is a real L6 animation-state finding the ledger does not carry.

### `world-exploration/farm-guaranteed-yield-is-harvest-two` — HELD [A2]

The farming guaranteed-yield rule is 'harvestedTimes == 1', i.e. the SECOND harvest, not the first -- the survey's 'first harvest guaranteed' would be ported wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:607, with the stat's identity fixed at :104-107`
- **Quote:** if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - StatsManager.getStat(1020))) == 0)
...
this.harvestedTimes = StatsManager.getStat(startingIndex + 2);
if(this.harvestedTimes > 50)
{
   this.harvestedTimes = 50;
}
- **Lane impact:** L1 world-exploration: corrects world-exploration/farming-tables. startingIndex+2 is the cumulative harvest counter (capped 50), which getPatchLevel(:457) maps to soil grade 1-6 at 10/20/30/40/50 -- Obj_VegePatch.as:78 mislabels the same stat 'soilLevel', which is probably what misled the survey. The guard is `== 1` exactly, not `== 0` and not `<= 1`, so a brand-new patch's first harvest rolls the normal 1/(10-farmSkill) dice (10% at skill 0) and only the next one is free. Oddly specific -- flag it as either an authored quirk or an original-code off-by-one when it lands in config/farming.ts, and label it v0.682.

### `world-exploration/frozen-town-levels-are-19-not-12` — HELD [A2]

Town levels are frozen for 19 territories, not the 12 explicitly listed ids — isNoChangeTown also returns true for every territory whose level is below LEVELSTART+5.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:393-400 + recomputation over reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Quote:** public function isNoChangeTown(territoryID:int) : Boolean
{
   if(territoryID == 1466699 || territoryID == 1503572 || territoryID == 1368424 || territoryID == 1540387)
   {
      return true;
   }
   var lvl:int = this.getTerritoryLevel(territoryID);
   return lvl < this.LEVELSTART + 5;
}
- **Lane impact:** L1 world-exploration and L11 meta-social: extends the journal's prosperity-thresholds claim, which lists only the 12 hard-coded ids. The real rule is a radius: any territory with level < 8, i.e. Manhattan distance <= 4 from (341,341). I counted these over the land mask myself — 19 territories (L3x1 + L4x2 + L5x4 + L6x5 + L7x7). So the starting region is a fixed, non-warrable tutorial zone by construction, and only the 716 outer territories have dynamic prosperity.

### `world-exploration/map-art-validates-projection` — HELD [A3]

Overlaying the 63x72 land mask on the reassembled map art at the code's own projection agrees on 652 of 735 land cells (88.7% by cell centre) and traces the coastline exactly, independently confirming the mask-to-screen transform.

- **Cite:** `my overlay of reference/extracted/bindata/92_1t4648s0.bin onto the 36-tile composite of reference/extracted/sprites/DefineSprite_*/1.png, transform cell (i,j) -> px (10i+80, 10j) derived from WorldMapUI.as:208 and :230`
- **Quote:** land cells over drawn land: 652 over sea: 83 agreement %: 88.7
- **Lane impact:** L1 world-exploration: the projection claim previously rested on two lines of code (WorldMapUI.as:208 getPixel(territoryx + 21 - 8, territoryy + 51) and :230 (terrx + 21) * 10 + 5). It now has a picture behind it. The 83 'misses' are coastline cells sampled at cell centre on a 10 px grid plus my own tile-assembly seams, not a transform error. Practical upshot for the port: a renderer can draw the OG map by blitting the 36 tiles at (i*80, j*80) and index territories with x = i_mask + 328, y = j_mask + 290.

### `world-exploration/minimap-x-is-quest-target` — HELD [A1]

The gold X on the frame_0020 minimap sits at sector (3,2), not (2,2) - and (3,2) is exactly the sector the player reaches in frame_0080, so the X is the active quest-target marker.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (395,38)-(505,148) Lanczos x9 -> 990x990; cross-read with frame_0080.jpg crops (0,30)-(300,80) x5 and (355,110)-(512,180) x7`
- **Quote:** In the x9 crop the column-label centres fall at x = 168/278/390/497/607/722 and the row-label centres at y = 172/280/388/497/605/718. The gold X sits at (483,390) = column 3, row 2. frame_0080 prints 'TERRITORY (24,52)' / 'SECTOR (3,2)' with the title bar 'KAKUCHI DOJO GATES' and the quest line 'SIDE QUEST: DEFEAT HATTORI'.
- **Lane impact:** L1 world-exploration and L4 ui-hud: corrects the surveyor's '~(2,2)' misread and upgrades the finding. The minimap's gold X is the quest destination, and frames 0020 and 0080 are a matched before/after pair for the same objective - a reusable behaviour cite for the minimap iconography Ready bullet. The same x9 crop also shows a sixth icon at (5,5) that the original quote omits (the journal lists only the (5,0) and (0,5) gates).

### `world-exploration/rock-deposit-never-clears` — HELD [A2]

A Rock deposit (oreType 1) is an unlimited faucet — the despawn is guarded on oreType != 1, so it can be mined for 2 AP indefinitely, unlike every other ore which is added to the dead list on first success.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:600 (doMine) + Obj_OreDeposit.as:79-86 (clearOre)`
- **Quote:** if(this.oreType != 1)
{
   (this.interactiveStageObjectHolder as Obj_OreDeposit).clearOre();
}
---
public function clearOre() : *
{
   gotoAndStop(1);
   StageManager.addToDeadList(objectName);
- **Lane impact:** L1 world-exploration and L2 economy: refines the journal's "'Respawn' is not a timer" line, which is right but incomplete. Combined with the 50% downgrade-to-Rock rule at Obj_OreDeposit.as:70, the real loop is: any non-Coal deposit has a 50% chance of yielding item 20059 ("Unusable rocks") AND staying on the map, so the node is farmable until the player rolls the real ore. That is an economy sink/faucet the ledger has no line for.

### `world-exploration/save-schema-has-three-timers` — HELD [A3]

The save schema is 20 data slots (ids 0-12, 14-19, 103) plus THREE timer slots (100/101/102), 23 distinct ids in total — slot 13 is never written and slot 103 is battle stats, not a timer.

- **Cite:** `$ grep -o 'saveUpdate([0-9]*' reference/decompiled/shs3_android/scripts/ | sort -u  +  QueryManagerBase.as:15`
- **Quote:** saveUpdate(0 … saveUpdate(12, saveUpdate(14 … saveUpdate(19, saveUpdate(100, saveUpdate(101, saveUpdate(102, saveUpdate(103
(no saveUpdate(13 anywhere)
---
internal static var DATASLOTS:int = 20;
- **Lane impact:** L1 world-exploration and every lane inheriting §6: corrects the journal's save-schema-recovered claim, which says "20 numbered data slots plus four timer slots" while its own enumeration lists only three timers, and the score rationale which says "24-slot". DATASLOTS:int = 20 at QueryManagerBase.as:15 is the literal the schema is sized on, and 103 (getBattleStatsString) is written next to slot 1 as a data slot. The headline — §6's "design a persistence schema" is false, it needs transcribing — is unaffected.

### `world-exploration/save-schema-is-23-slots` — HELD [A2]

The recovered save schema is 23 slots - 20 data and 3 timers - not the 24 / 'four timer slots' the journal states.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 (23 saveUpdate call sites) + NetworkManager.as:1870 (the saveUpdate definition, which is the 24th grep hit)`
- **Quote:** public function saveUpdate(saveIndex:int, savedata:String) : *
- **Lane impact:** L1 world-exploration: cosmetic correction to save-schema-recovered. Data slots are 0-12, 14-19 and 103 (= 20); timer slots are 100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn (= 3). Slot 13 is genuinely absent from the writer. The substantive claim - that the format is transcribable rather than designable, and that slot 10 is the packed world position - is unaffected.

### `world-exploration/stables-is-the-5ap-object` — HELD [A2]

The prior round's banked PARTIAL 'there is no 5-AP stable object' is wrong: the adjacent-town travel dialog is built by a function literally named initStablesButtons, and the action it fires costs 5 AP plus nodeLevel x 2 gold -- so the ledger's 'stable 5' entry is correct and merely omits the fare.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1680 (initStablesButtons) and :1720-1745 (travel); string ids 525/735 'Stables', 5061 'Stablehand' in docs/gauntlet/L0/index/strings.json`
- **Quote:** internal function initStablesButtons() : *
{
   ...
   var neighbourList:Array = NodeGenerator.instance.getAdjacentTerritories();
   ... if(territoryData.hasTown() && territoryData.isInBoundary())
}

internal function travel(nodeid:int) : *
{
   var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;
   ...
   if(!StatsManager.checkAP(5))
- **Lane impact:** L1 world-exploration and L10 economy: docs/gauntlet/L0/CLAIMS.md:2751 (world-exploration/ap-cost-table-stable-mislabelled, PARTIAL) should be marked SUPERSEDED. The ledger's Ready bullet 'stable 5' does not need downgrading to PARTIAL after all -- it needs the gold fare appended. The economy lane's 'section-1 line 79 stable 14c+5AP' reconciles cleanly as one level-7 observation of nodeLevel x 2 (7 x 2 = 14). The current survey reaches the right answer but never declares that it is reversing a banked claim, so the ledger of banked claims stays wrong unless this is recorded.

### `world-exploration/start-node-name-confirms-rng` — HELD [A2]

The payload's own string table independently confirms the NameGenerator reproduction: the start node's authored label resolves to "W Kasuta Forest", matching the LCG-derived town name "Kasuta" for territory 1397077.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:5-6 + docs/gauntlet/L0/index/strings.json id 1037`
- **Quote:** 		<id>8382465</id>
		<name>1037</name>
---
strings.json 1037 = 'W Kasuta Forest'
- **Lane impact:** L1 world-exploration: a second, independent artifact corroborating claim place-name-reproduced-from-payload. The surveyor derived "Kasuta" purely from re-running the LCG; the authored node file plus the XLIFF string table produce the same word from a completely different path, and also confirm the 'W' quadrant prefix is baked into authored names as well as generated ones. Also worth carrying: 8382465 appears three times in the node file (:5 as the start node id, :46 and :2731 as signpost destinations), so the start node is a routed hub, not an isolated spawn.

### `world-exploration/twelve-hour-crop-never-rots` — HELD [A2]

The 12-hour crop has no ROTTED state — its state machine is two-way (PLANTED, then READYFORHARVEST forever), unlike the 15-minute, 1-hour and 6-hour crops which all rot after a 900-second grace.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:131-140 (also duplicated at InteractUI_crops.as:158-168)`
- **Quote:** case 4:
   timePeriod = 12 * 60 * 60;
   if(QueryManager.instance.getServerTime() - plantTime < timePeriod)
   {
      vegState = PLANTED;
   }
   else
   {
      vegState = READYFORHARVEST;
   }
- **Lane impact:** L1 world-exploration: corrects the journal's farming-tables claim, which states a 15-minute grace before ROT across all four crop tiers. Three of four. The 12-hour crop is the safe overnight plant — it cannot be lost to inattention, which is a deliberate free-to-play design choice and exactly the kind of feel rule a port would silently get wrong if it applied the grace uniformly.

### `world-exploration/twelve-hour-crop-never-rots` — HELD [A2]

The 12-hour crop has no grace period and no ROTTED state - Obj_VegePatch case 4 falls straight through to READYFORHARVEST, so only the 15 min / 1 h / 6 h crops can rot.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:133-140 (web mirror: §1t8621s0§.as:138)`
- **Quote:** case 4:
   timePeriod = 12 * 60 * 60;
   if(QueryManager.instance.getServerTime() - plantTime < timePeriod)
   {
      vegState = PLANTED;
   }
   else
   {
      vegState = READYFORHARVEST;
   }
- **Lane impact:** L1 world-exploration: corrects the farming-tables claim, which states a 15-minute grace 'before ROT' for all four crop tiers. Three tiers, not four. Design consequence worth carrying into the port: the longest crop is also the only risk-free one, which is the opposite of the usual farming-sim gradient and is the kind of asymmetry a 'sensible' reimplementation would silently flatten.

### `world-exploration/web-third-placename-hardcode` — STILL_UNHELD [STILL_UNHELD]

The web v0.717 build may carry a third hardcoded territory-name exception ('Iwakuni') that the Android v0.682 getPlaceName does not, which would make the ported name generator emit the wrong name for at least one territory.

- **Lane impact:** L1 world-exploration: a porting hazard against world-exploration/place-name-reproduced-from-payload, logged as a lead because it rests on constant-pool adjacency rather than a quoted line of code. Evidence for: NameGenerator.as:136-144 hardcodes exactly two exceptions ('Ibamaya' for territoryID 1405272, 'Gokura' for 1524045), neither of which appears in 89_NameGenerator_PlaceNames.bin; the WEB payload's constant pool carries three capitalised place names adjacently at payload.xml:119264-119266 -- Ibamaya, Gokura, Iwakuni -- immediately after the nameending array and the 'replace' token used only by the name functions; and grep -rn Iwakuni over all 559 android classes returns 0 files. Evidence against my own hypothesis: 'Iwakuni' IS a normal row of the PlaceNames blob, sitting in a run of real Japanese cities (Hofu / Iwakuni / Kudamatsu / Mine / Nagato), so its presence in the blob is innocent -- but a blob row does not need to be an AS3 string constant. Separately confirmed and NOT in doubt: the web pool's namestarting and nameending runs match the android arrays in order and content with exactly the two absences a deduplicating pool predicts (Kiyo once instead of twice; 'i' and 'no' deduped), so the generator TABLES are cross-build consistent. Closing this needs a web-side NameGenerator decompile, which the repo does not hold.

## world-exploration — re-scored 85

All five ledger blockers are dead. ① world bounds/geography = a byte-exact 63x72 GIF land mask (735 land territories) plus a getPixel boundary test — and the mask is byte-identical (md5 13068dfa1a5cc5628720a25782f93fed) between web v0.717 and Android v0.682, so it is the one world artifact with proven cross-build parity. ② gather/mine/farm yield+whiff tables are exact code (hunt/fish 40% whiff with 3-tier loot; search whiff = 1-(skill+1)/10; mine 50% downgrade-to-Rock; farm 1/(10-skill)). ③ "day" is 86400 real seconds and governs ONLY quest expiry — AP (60 s) and crops (900/3600/21600/43200 s + 900 s grace) are separate clocks, so the blocker was mis-framed rather than merely open. ④ AP regen 1/60 s, start 30, cap level+30. ⑤ sector=node, node=ordered room list, room=side-scrolling stage of declared px width (98 rooms, 800-4000 px) — neither option the ledger offered. On top of that the coordinate law (nodeid = x<<12|y, territory = sector/6), the level gradient (|tx-341|+|ty-341|+3, real range 3..93), the 73-entry room-object enum, the prosperity thresholds and the 24-slot save schema are all recovered, and the world's place names were reproduced character-for-character from the payload RNG and matched against a video frame. Held back from 90+ by four honest negatives: the rendered world-map ART is inside an encrypted resource blob; numeric parity of the world constants vs v0.717 is inferred (string-pool only), not byte-proven; 119_Mobile_MapData.bin is an unexplained empty stub; and the node-level <search><chance> field has no located consumer. The Surface bullet is unchanged — src/config still contains zero world numbers — but that is now a porting task, not a research one.

### `world-exploration/ap-cost-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The real AP cost table is far larger than the ledger's three entries, and stables additionally charge (node level × 2) coins on top of 5 AP.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:361,384,395,414,427,460,535 + Obj_OreDeposit.as getAPUse + Obj_DirectionSign.as:20,106-108 + InteractUI.as:1723,1736`
- **Quote:** var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;
- **Overturns:** "AP cost table (pick 1 / search+mine 2 / stable 5)"
- **Lane impact:** L1 world-exploration: enter node 1 · world-map travel 5 · rest 1 (+100 HP/Chi) · camp 5 (+50 HP/Chi) · hunt 3 · fish 3 · search 2 · mine 2 · pick 1 · signpost 1 (0 inside a town interior room 14>roomid or roomid>=100, or a dojo) · quest step = per-step <ap>. The ledger's three entries are individually right but the table is 12 rows, and 'stable 5' omits the gold fare. The '4 travel methods' resolve to signpost / world-map / stables (adjacent-territory towns only, gated on hasTown() && isInBoundary()) / consumable teleport items (InventoryUI.as:980,1045; recall-to-start at :960,1067).

### `world-exploration/ap-regen-and-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ "AP regen rate + cap" is dead: AP regenerates 1 per 60 real seconds (doubled under BUFF_AP), starts at 30, and max-AP is capped at character level + 30.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158, :1100-1103, :707-708; InventoryUI.as:2409`
- **Quote:** internal static var APINTERVAL:int = 60;
- **Overturns:** "④ AP regen rate + cap."
- **Lane impact:** L1 world-exploration: closes blocker ④. Regen is timestamp-based (nextAPUpdate) so it accrues offline. Cap gate is `getStat(STAT_MAXAP) < 20 + (charlevel + 10)`. Gold faucet is 10 AP for 1 Gold (strings.json id 100; GetGoldPromptDialog.as:204). Also surfaces an uncatalogued feel rule: MCSPlayer.as:1230 makes AP==0 in adventure mode a death/retreat condition.

### `world-exploration/day-length-is-three-clocks` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is mis-framed, not merely open: there is no in-game day. AP runs on a 60-second clock, crops on absolute 900/3600/21600/43200-second clocks, and the literal 24 h (86400 s) governs only quest repeat-eligibility and daily rollover.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1184, :158; Obj_VegePatch.as:80-140; QueryManagerBase.as:105; InteractUI.as:1153`
- **Quote:** if(completedQuest.completedTime == 0 || completedQuest.completedTime < serverTimeVariable - 24 * 60 * 60)
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L1 world-exploration (and L11 meta-social): the blocker's premise — one shared day clock governing expiry, farming, AP regen and the war tick — is false. Three independent real-time clocks, all measured off QueryManager.getServerTime() in raw seconds. Same correction applies to §1 line 116, which repeats the single-clock framing.

### `world-exploration/farming-tables` — HELD [A2] ⚑ OVERTURNS LEDGER

Farming is fully tabled: crop grow times 15 min / 1 h / 6 h / 12 h with a 15-minute harvest grace before ROT, soil grade 1-6 at 10/20/30/40/50 cumulative harvests, yield chance 1/(10-farmSkill), and — uncatalogued anywhere in the project — harvesting spawns a one-enemy combat wave.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:80-140; InteractUI_crops.as:116-161, :457-481, :595-646`
- **Quote:** wave.init(new XMLList(<enemy><id>64</id><qty>1</qty><x>400</x></enemy>));
...
GameEngine.initBattleMode(-1,8,43,800,0,wavelist,150);
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L1 world-exploration: gracePeriod = 15*60 then ROTTED. Harvest roll `getStat(startingIndex+2) == 1 || int(Math.random() * (10 - getStat(1020))) == 0` — first harvest guaranteed, then 10% at skill 0. Crop dice over patchlevel picks items 2115/2116/2117/2118/2140/2141, so higher soil grade widens rather than improves the table. The harvest ambush uses enemy id 64 at x=400 on an 800-px stage, player entering at x=150, bg 43 — except at node 8402947 which uses bg 19.

### `world-exploration/gather-yield-whiff-tables` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② "gather/mine/farm yield + whiff" is dead: hunt and fish are 3 AP with a 40% whiff and a 30/20/10 three-tier loot split; search is 2 AP with whiff = 1-(skill+1)/10; mining is 2 AP with a flat 50% downgrade to plain Rock on any non-Coal deposit.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:424-490 (hunt/fish), Obj_Bush.as:47 (search), Obj_OreDeposit.as:70 (mine)`
- **Quote:** if(oreType != 2 && int(Math.random() * 2) != 0)
{
   OverworldHUD.getInstance().getNodeUI().runMine(1,this);
}
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L1 world-exploration: closes blocker ②. Hunt (3 AP, dice=int(rand*10)): 3/4/5→item 2112 'small game' 30%, 1/2→2113 'some game' 20%, 0→2114 'big game' 10%, 6-9→whiff 40%. Fish (3 AP) identical shape: items 2109/2110/2111. Search (2 AP, 24-frame bar): `int(Math.random()*10) <= getStat(1021)` → 10% at skill 0, +10pp per point. Ore ladder fully named from strings 652-659: 1 Rock/2 Coal/3 Iron/4 Tin/5 Copper/6 Silver/7 Titanium/8 Diamond (items 20059-20066), skill-1022 gates (8≥5, 7≥4, 6≥3, 5≥2, 3≥1), pickaxe item 13022 required, unbroken weapon required. 'Respawn' is not a timer — clearOre() calls StageManager.addToDeadList until room regeneration.

### `world-exploration/is-a-wxh-grid` — HELD [A2] ⚑ OVERTURNS LEDGER

§1's unknown-unknown "World-map topology/projection ... not a grid you can generate from W×H" is wrong — it is precisely a W×H grid, 63 wide by 72 tall, carrying a 1-bit land mask and rendered at 10 px per cell.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72) + WorldMapUI.as:230`
- **Quote:** this.playermarker.x = (terrx + TERRSHIFTX) * 10 + 5;
- **Overturns:** "- **World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** L1 world-exploration: retires one of §1's eight unknown-unknowns. The 'sparse geographic outline' intuition was right about the shape and wrong about the representation — which is exactly what made it look unrecoverable. Two lines of code plus one 272-byte GIF reproduce the whole projection.

### `world-exploration/prosperity-thresholds` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'prosperity ladder' the ledger lists as Ready is six numeric tiers at 0 / 500 / 1000 / 2000 / 4000 prosperity, with specific territories pinned to a fixed town level and never changing.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:782-804, :807-830; NodeGenerator.as:393-447`
- **Quote:** if(this.townProsperity == 0)
{
   return 0;
}
if(this.townProsperity < 500)
{
   return 1;
}
if(this.townProsperity < 1000)
{
   return 2;
}
if(this.townProsperity < 2000)
{
   return 3;
}
if(this.townProsperity < 4000)
{
   return 4;
}
return 5;
- **Overturns:** "**Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder."
- **Lane impact:** L1 world-exploration and L11 meta-social: 'prosperity ladder' was listed as Ready but carried no numbers. Pinned territories: ids 1466699, 1503572, 1368424, 1540387, 1413461, 1409366, 1401176, 1397081 → level 5; 1405270 → 4; 1401173 → 3; 1397077 and 1397078 → 0. Note 1409366 is the frame's Kakuchi and 1397077 is the start territory — pinned to level 0, i.e. no town at spawn.

### `world-exploration/save-schema-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

§6's claim that the save format is unrecoverable is wrong: the complete persistence schema is 20 numbered data slots plus four timer slots, each with a named serializer, and slot 10 is the world position.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187; QueryManagerBase.as:15; StatsManager.as:208,248,5073-5080`
- **Quote:** saveUpdate(10,StatsManager.getLocationString());
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L1 world-exploration (blocker 'save model') and every other lane that inherits §6. The topology half of the ledger sentence stands (Player.IO BigDB is dead); the save-format half is false. Slots: 0 playerlevel, 1 playerstats (+103 battlestats), 2 equipment, 3 skillstats, 4 inventory, 5 questitems, 6 intstats, 7 booleanstats, 8 activequest, 9 completedquest, 10 location, 11 taunt, 12 friendlist, 14 skillslots, 15 side, 16 playerdan, 17 stash, 18 options, 19 achievementstats, 100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn. STAT_LOCATION=19 holds the packed node id, STAT_LOCATION_ROOM=43 the room index. There is also a real offlineMode branch and a saveCharCookieData() local path. The schema needs transcribing, not designing.

### `world-exploration/sector-room-mapping` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ "sector↔room mapping rule" is dead, and the answer is neither option the ledger offered: a sector IS a node, a node owns an ordered list of rooms, and each room is one side-scrolling stage with a declared pixel width of 800-4000.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:8-18 + reference/decompiled/shs3_android/scripts/QuestEngine.as:1234-1240`
- **Quote:** 	<roomdata>
		<room>
			<id>0</id>
			<bg>4</bg>
			<width>800</width>
			<obj>
				<id>0</id>
				<x>750</x>
				<property>0,50,8386561,1,2,2,1</property>
			</obj>
		</room>
- **Overturns:** "⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."
- **Lane impact:** L1 world-exploration: closes blocker ⑤. Measured across the authored file: 44 nodes, 98 rooms, 94 with explicit <width>, min 800 max 4000 (modes 800×22, 1000×21, 1400×7, 1600×7) = 1 to 5 screens of scroll against the 800×480 native canvas. Rooms carry <bg> (30 distinct ids), optional <roomname> and optional <enterx>. Both town and wilderness nodes carry multi-room lists, so neither ledger option holds. Player position saves as the (STAT_LOCATION node, STAT_LOCATION_ROOM room) pair.

### `world-exploration/world-bounds-land-mask` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's #1 blocker "world bounds + geography" is dead: the world's boundary is a 63x72 GIF land mask embedded in the payload, holding exactly 735 land territories, and the boundary test is a single getPixel != 0 against it.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1206 + reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72)`
- **Quote:** return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L1 world-exploration: closes blocker ① outright. Decoding the GIF (PIL, two colours only: (0,0,0) sea / (255,255,255) land) yields 735 land pixels of 4536, bbox i∈[1,61] j∈[1,70], rendering as the Japanese archipelago. Pixel→territory map is i = x−328, j = y−290. WorldMapUI.as:230 fixes the projection at 10 px per territory, i.e. a 630×720 px world map. No Fandom scrape and no tracing required.

### `world-exploration/world-is-procedural` — HELD [A2] ⚑ OVERTURNS LEDGER

Only 44 nodes are hand-authored; every other node in the 26,460-sector world is generated deterministically from its own id, so the entire world is bit-reproducible offline from code we hold.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1123; TerritoryData.as:74, :86-99, :1054/:1488/:1550/:1597/:1671; RNG.as:64-66`
- **Quote:** return NodeGenerator.getInstance().generateNode(nodeID >> 12 & 0x0FFF,nodeID & 0x0FFF);
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L1 world-exploration: the ledger's close-path had the problem backwards — geography is code, not a wiki scrape. TerritoryData(id) runs generateSectors() (a ~430-line seeded road/route builder), and territory exits are pure functions of the id via `new RNG(territoryId)`. With the LCG seed=(seed*9301+49297)%233280 the whole world regenerates offline. Per-territory fixed features are node-id lists on TerritoryData:9-49 (dungeonList, controlPointList, pickableList, exitsList, hutList, animalSpawnList, dojoNode, templeNode, oniDenNode, graveyardNode, mercCampNode, townNode).

### `world-exploration/config-still-empty` — HELD [A3]

The Surface bullet is CONFIRMED unchanged: src/config still contains zero world numbers — no world.ts, no ap.ts, no farming.ts, no nodes.ts.

- **Cite:** `$ ls src/config/  (repo check, 2026-08-15)`
- **Quote:** CLAUDE.md ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts
- **Overturns:** "**Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules. Mining ore ladder + far-territory coords are sourced but missing from the digest."
- **Lane impact:** L1 world-exploration: the only ledger bullet in this block that survives audit intact. But its character changes — after this pass it is a porting task with a finished source list (this journal), not a measurement task.

### `world-exploration/coordinate-law` — HELD [A2]

The world coordinate law is fully specified in code: nodeid = sectorX<<12 | sectorY, territory = floor(sector/6), territorySector = sector mod 6 — so a territory is exactly a 6x6 block of 36 explorable nodes.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:298-302, :333; WarSelectUI.as:15-19`
- **Quote:** var sectorx:int = nodeid >> 12 & 0x0FFF;
var sectory:int = nodeid & 0x0FFF;
var territoryx:int = Math.floor(sectorx / 6);
var territoryy:int = Math.floor(sectory / 6);
- **Lane impact:** L1 world-exploration: 735 land territories × 36 sectors = 26,460 explorable nodes. Display offsets are constants TERRSHIFTX=21, TERRSHIFTY=51, WARMARKERSHIFTX=8.

### `world-exploration/cross-build-numeric-parity` — STILL_UNHELD [STILL_UNHELD]

Cross-build numeric parity for the world constants is not established: only the land mask is byte-proven identical across v0.717 and v0.682, so APINTERVAL=60, LEVELSTART=3, the crop timers and the AP costs remain Android v0.682 measurements.

- **Lane impact:** L1 world-exploration: the web payload's constant pool does prove the same procedural room builder ships in v0.717 (the <obj><id>N</id><x> templates, 'roomdata', 'procgenronin', 'aggrobandits', 'merccaptain' at payload.xml:118249-118266), but there is no web-side decompile of NodeGenerator/StatsManager — reference/decompiled/shs3_payload/scripts/ holds only display symbols, and grepping the 329 MB payload.xml for getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType returns nothing. Both android bundles report clientVersion 0.682. Every ported number must carry that label.

### `world-exploration/frame-confirms-6x6-grid` — HELD [A1]

A video frame shows the minimap as a 6x6 grid labelled 0-5 on both axes with the player marker at column 1 row 3, matching the HUD's own "SECTOR (1,3)" — independently confirming the floor(sector/6) / sector%6 law from the code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (360,10)-(512,120), Lanczos ×8 → 1216×880`
- **Quote:** Visible in the crop: a 6-column × 6-row minimap grid, columns labelled 0 1 2 3 4 5 across the top and rows 0 1 2 3 4 5 down the left, N/E/S/W compass letters, a white player triangle at column 1 / row 3, a gold up-arrow exit icon at (3,0), gold gate icons at (5,0) and (0,5), a gold X at ~(2,2), and a dashed white route outline. Below it the HUD prints TERRITORY (24,52) / SECTOR (1,3).
- **Lane impact:** L1 world-exploration: frame and payload AGREE — no frame-vs-doc conflict to adjudicate here. Confirms the territory board is 6×6 and the sector pair is the within-territory index. Two sibling frames (frame_0040.jpg 'INSIDE SECTOR (3,0)', frame_0080.jpg 'SECTOR (3,2)', crop (415,132)-(500,162) ×4) show the two label variants come from Minimap.as:103 vs Territorymap.as:113.

### `world-exploration/land-mask-version-parity` — HELD [A3]

The world land mask is byte-identical between the web v0.717 payload and the Android v0.682 build, so the Stage-0b Android caveat does not apply to the world geography.

- **Cite:** `md5 + cmp of reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Quote:** MD5 (reference/extracted/bindata/92_1t4648s0.bin) = 13068dfa1a5cc5628720a25782f93fed
MD5 (reference/extracted/android/110_Mobile_MapBitmapData.bin) = 13068dfa1a5cc5628720a25782f93fed
$ cmp ... && echo "BYTE-IDENTICAL"
BYTE-IDENTICAL
- **Lane impact:** L1 world-exploration: upgrades WX-01 from Android-only to cross-build proven. Also corrects Stage-0 finding S0-1, which catalogued web bindata 92 merely as "GIF89a 63x72 raster" — that raster IS the world.

### `world-exploration/level-gradient` — HELD [A2]

Content difficulty across the whole world is one formula: node level = |territoryX-341| + |territoryY-341| + 3, capped at 200 — which over the actual land mask yields a real range of 3 to 93.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:385-390 and :144`
- **Quote:** var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART;
if(lvl > 200)
{
   lvl = 200;
}
- **Lane impact:** L1 world-exploration and L9 enemies-ai: the entire difficulty geography, absent from the ledger. LEVELSTART=3. Territory counts by level: L3×1, L4×2, L5×4, L6×5, L7×7, L8×8, L9×10, L10×9, L11×10, L12×14. Cross-check: the frame's territory (24,52) → internal (344,342) → level 7, and the same frame shows a level-8 player.

### `world-exploration/map-art-unheld` — STILL_UNHELD [STILL_UNHELD]

The rendered world-map ART is not recovered — the 63x72 GIF is a 1-bit land/sea mask only, and the drawn map lives in an encrypted nested-SWF resource blob.

- **Lane impact:** L1 world-exploration: the topology is recovered, the picture is not. MapBG/WorldMapUI source their visuals from assets.swf, and the mobile art bundle 124_Mobile_ImageResource.bin (1.73 MB) is one of the five CWS nested-SWF blobs Stage-0b finding S0-5 marks held-but-encrypted, not opened. Must not be claimed as recovered.

### `world-exploration/mapdata-blob-empty` — STILL_UNHELD [STILL_UNHELD]

119_Mobile_MapData.bin is a 65-byte empty stub (<mapdata></mapdata>, zero children) even though Mobile_MapData.as, QuestEngine.getMapSquareID and XMLWorldMap all expect content — and I cannot say why.

- **Lane impact:** L1 world-exploration: possible Android-only stripping, possible dead subsystem. Whether the web v0.717 build shipped a populated mapdata is not established. Logged as a lead, not a finding.

### `world-exploration/place-name-reproduced-from-payload` — HELD [A1]

The territory name burned into the video frames ("KAKUCHI") is reproducible character-for-character from the payload's own LCG and name tables, proving every place name in the 26,460-node world is deterministically regenerable from the node id.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg + frame_0080.jpg, crop (20,40)-(180,64), Lanczos ×5; derivation from NameGenerator.as:145-166 and RNG.as:64-66`
- **Quote:** Frame title bars read verbatim: "W KAKUCHI MOUNTAIN PATH" (frame_0020, SECTOR (1,3)) and "KAKUCHI DOJO GATES" (frame_0080, SECTOR (3,2)), both at TERRITORY (24,52).
- **Lane impact:** L1 world-exploration: displayed (24,52) → internal territory (344,342) → territoryID 1409366 → getTownName2 → RNG(2818732) with seed=(seed*9301+49297)%233280 picks namestarting[73]="Ka" + nameending[19]="kuchi" = "Kakuchi". Exact match with the frame. The 'W' prefix is also generated (terrSector.x=1 ≤1 → string 401 = "W"), and frame_0080's sector (3,2) correctly emits no prefix. Same routine names the start territory (id 1397077) "Kasuta".

### `world-exploration/room-object-enum-and-node-graph` — HELD [A2]

The room-object type enum is fully recovered as 73 entries (ids 0-72 plus a nested-list id 100), and object id 0 — the signpost — is the node graph itself, accounting for 186 of the authored file's 343 objects.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameStage.as:683-920; Obj_DirectionSign.as:37-90; reference/extracted/android/112_Mobile_NodeData.bin:16`
- **Quote:** case 30:
   obj = new Obj_OreDeposit(objProperty,objName);
case 31:
   obj = new Obj_Hut(objProperty);
- **Lane impact:** L1 world-exploration: gives the ledger's 'node-based room graph + signposts' Ready bullet real content. Signpost property format decodes as destRoom,entryX,destNodeId,visible,compassDir(0=N,1=S,2=E,3=W),spriteFrame,arrowLabelId — worked example '0,50,8386561,1,2,2,1' = 'walk East to node 8386561, land in its room 0 at x=50'. Minimap icon enum is 24 values (NodeGenerator.as:34-82, ICON_NOTHING 0 … ICON_BEACH 23, ICON_OVERWRITENODE 100), which grounds the 'minimap iconography' Ready bullet.

### `world-exploration/search-chance-semantics` — STILL_UNHELD [STILL_UNHELD]

The node-level <search><id>20000</id><chance>5</chance> block's semantics are unknown: XMLWorldNode stores it in searchList and no consumer of searchList exists anywhere in the 559-class decompile.

- **Lane impact:** L1 world-exploration: exactly one such block exists in the whole authored node file. 'chance' in XMLLoot is a 0..1 fraction (Overworld.as:324 multiplies by 100), which would make the value 5 meaningless here. Dead field, alternate scale, or a consumer I failed to find — not claimed either way.

### `world-exploration/start-coords-derived` — HELD [A2]

The ledger's Ready bullet "(start 21,51 / 0,3)" is confirmed and now derivable: the character-creation literal STAT_LOCATION = 8382465 decodes to sector (2046,2049) → territory (341,341) → displayed TERRITORY (21,51), SECTOR (0,3).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:713 (+ decode via NodeGenerator.as:298-302, WarSelectUI.as:17-19)`
- **Quote:** setPlayerStats(STAT_LOCATION,8382465);
- **Overturns:** "**Ready:** territory/sector coord system (start 21,51 / 0,3)"
- **Lane impact:** L1 world-exploration: the Ready bullet was right but ungrounded. "21,51" is not an observed coordinate pair, it IS TERRSHIFTX/TERRSHIFTY — the world's level-3 origin territory (341,341) displays at (21,51) by construction. 8382465 is also the first node in 112_Mobile_NodeData.bin:5.
