# enemies-ai — HUNTER LENS review

Blind critic. Every verdict below rests on an artifact I opened myself.
Frames are **1024×576**, not 1080p (`PIL` size check) — noted because the §0 crop
guidance assumes 1080p and the surveyor's stated crop coordinates are affected.

---

## HEADLINE — the surveyor's single biggest under-claim

### The web v0.717 gameplay code IS on disk. It is symbol-obfuscated, not absent.

The surveyor's `enemies-ai/web-build-parity` marks build parity STILL_UNHELD and calls
it "the dominant residual risk", capping the score at 78. Its method was:

```
ls reference/decompiled/shs3_payload/scripts | grep -ci "enemy\|npc"   → 0
```

That is a **non-recursive `ls` against renamed symbols**. `find` shows 1079 `.as`
files under `shs3_payload`, of which **612 are obfuscated `§1tNNNsN§.as` classes**.
Numeric literals survive symbol obfuscation, so parity is directly checkable:

`reference/decompiled/shs3_payload/scripts/§1t68s0§.as` **is** the web NPC class:

```as3
// §1t68s0§.as:258-278  — WEB v0.717
public function setLevel(param1:int) : *
{
   var _loc2_:Number = param1 / this.level;
   if(param1 <= 20) { _loc2_ *= 0.9; }
   this.level = param1;
   this.damage *= _loc2_;
   this.defense *= _loc2_;
   this.§1t3257s0§ *= _loc2_;      // maxhp
   this.§1t3308s0§(this.§1t3257s0§);
   this.xp = param1 * 2 + 20;
   if(param1 <= 10) { this.damage = 1; this.defense = 1; this.§1t3257s0§ = 1; ... }
}
```

Parity table I measured (web `§1t68s0§.as` vs android `NPC.as`):

| constant | android v0.682 | web v0.717 | verdict |
|---|---|---|---|
| setLevel rescale + 0.9 @≤20 + 1/1/1 @≤10 | NPC.as:239-260 | §1t68s0§.as:258-278 | **identical** |
| `xp = lvl*2 + 20` | NPC.as:252 | §1t68s0§.as:270 | **identical** |
| aiCounterMax | `= 24` NPC.as:22 | `§1t3244s0§:int = 24` §1t68s0§.as:26 | **identical** |
| damage / defense defaults | `10` / `1` NPC.as:14,16 | `10` / `1` §1t68s0§.as:14,16 | **identical** |
| TTLMAX | `96` NPC.as:28 | `96` §1t68s0§.as:28 | **identical** |
| hit lockout | `gotHitCounter = 12` NPC.as:462 | `§1t3246s0§ = 12` §1t68s0§.as:483 | **identical** |
| boss xp curve `lvl*5 + 45` | EnemyElite.as | §1t4523s0§.as:61,77 + 8 more | **identical** |
| **arrow gravity** | **single `velY += GRAVITY`(3)** | **`1.5` for launch arrows / `3` otherwise** | **DIVERGES** |

So: parity is not unestablished — it is **established for eight constants and broken
for one**. The STILL_UNHELD verdict is refuted, and the residual-risk framing that
caps the score is built on a search artifact.

---

## HEADLINE — the level→stat formula is TWO systems, and the surveyor reported one

`grep -rn "setLevel(" reference/decompiled/shs3_android/scripts/*.as` returns
**11 `override public function setLevel`** declarations. The base `NPC.setLevel()`
the surveyor quotes is the **trash-mob path only**. The boss/elite path is a
completely different mechanism — a **player-relative rubber-band tuned to a hit
count**, not to absolute numbers:

```as3
// EnemyElite.as — override setLevel(lvl)
xp = lvl * 5 + 45;                                   // NOT lvl*2+20
var playerHP  = StatsManager.getPlayerStats(STAT_MAXHP)  + findBonusStat(STAT_MAXHP);
var playerDEF = StatsManager.getPlayerStats(STAT_DEFENSE)+ findBonusStat(STAT_DEFENSE);
var playerATK = StatsManager.getMinDamage() + StatsManager.getDamageRange()/2;
var lvldiff = lvl - StatsManager.getLevel();
var hitsToKillBoss   = 10 + lvldiff;   if(hitsToKillBoss   <= 3) hitsToKillBoss   = 3;
var hitsToKillPlayer = 18 - lvldiff;   if(hitsToKillPlayer <= 0) hitsToKillPlayer = 1;
var playerhit = playerATK - defense;
   if(playerLVL <= 10 && playerhit < 1)            playerhit = 1;
   else if(playerLVL <= 20 && playerhit < playerLVL/8) playerhit = playerLVL/8;
   else if(playerLVL <= 30 && playerhit < playerLVL/6) playerhit = playerLVL/6;
   else if(playerhit < playerLVL/4)                    playerhit = playerLVL/4;
var bossHP = playerhit * hitsToKillBoss;
   if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); updateHealthBar(); }
var bossATK = playerHP/hitsToKillPlayer + playerDEF;
   if(bossATK > minDamage) { minDamage = bossATK; }
if(lvl <= 5) { minDamage = 1; defense = 1; }          // clamp at 5, NOT 10
```

Variants: `EnemyKanjiGuardian` uses `hitsToKillBoss = 5 + 8 + lvldiff` (floor 5) and
`hitsToKillPlayer = 16 - lvldiff`; `EnemyWolfAlpha` uses `15 - lvldiff`;
`EnemySpearElite`/`EnemyPlayer` branch on `isBoss`/`isDuelist` and fall through to
`super.setLevel()` when false. **`EnemyOgre.setLevel` is an empty override** — the
Ogre never rescales at all. `EnemyStag` re-implements the base formula verbatim.
`EnemyTrainingDummy` repurposes `lvl` as a tutorial step index (`lvl==3 → maxhp = 8`).

Parity: the web build has the same boss path — `§1t4523s0§.as:77-80` reads the same
four player stats right after `xp = param1 * 5 + 45`.

**Consequence for the rebuild:** authored `<hp>` on a boss row is a **floor**, not the
boss's HP. "Hiroshi lvl80/hp1000" is overwritten at spawn by `playerhit ×
hitsToKillBoss` whenever that is larger. Porting the authored statlines as effective
stats — which two of the surveyor's claims instruct — produces the wrong difficulty
curve at every player level.

---

## HEADLINE — the stagger animation exists; the surveyor searched one blob

`enemies-ai/stagger-is-a-counter-not-an-anim` asserts *"there is NO stagger/flinch/
gothit animation among the 158 human anim names"*. That is false. It searched
`99_MCSCharacter_HumanAnimationData.bin`; the flinch lives in the **Human2** blob:

```
reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin
   <anim i="flinch_weapon" d="8">
   <anim i="flinch" d="8">
```

And it is a first-class action state, not an unused asset:

```as3
MCSActor.as:170  internal static var FLINCH_WEAPON:String = "flinch_weapon";
MCSActor.as:172  internal static var FLINCH:String        = "flinch";
MCSActor.as:922  internal static var FLINCH_STATE:int     = 28;

NPC.as:747-765
   public function doFlinch() : * {
      if(actionState == FLINCH_STATE || actionState == SLASH_STATE) return;  // slash is armour
      this.prevActionState = actionState;
      this.prevAnim        = mcs.animation;
      this.prevFrameCounter= mcs.frameCounter;
      actionState = FLINCH_STATE;
      startAnim(FLINCH_WEAPON);
   }
   public function endFlinch() : * {
      actionState = this.prevActionState;
      startAnim(this.prevAnim);
      mcs.frameCounter = this.prevFrameCounter;   // resumes the interrupted anim mid-frame
   }
```

Also referenced by `EnemyZombie.as:285,544`, `EnemyShield.as:117-118`,
`EnemyPlayer.as:1000`, `MCSPlayer.as:4311-4325` (player picks FLINCH vs FLINCH_WEAPON
by whether a weapon is held).

**Ledger blocker ③'s stagger half is HELD, not PARTIAL: 8 frames, state 28,
save/restore-with-frame-offset, and immune while `SLASH_STATE`.** This was the
surveyor's own stated reason #4 for capping the score.

---

## HEADLINE — the shipped web build's arrow physics is NOT single-gravity

`enemies-ai/arrow-arc-physics` states "GRAVITY = 3" as the arrow constant. True for
Android v0.682. **False for the shipped web v0.717 build**, which has a two-gravity
arrow model keyed on the knockdown roll:

```as3
// WEB §1t4542s0§.as:275-305 — roll FIRST, then solve with the chosen gravity
if(level > 50)      _loc1_ = int(Math.random()*2) > 0;
else if(level > 20) _loc1_ = int(Math.random()*3) == 0;
else if(level > 10) _loc1_ = int(Math.random()*4) == 0;
var _loc6_:Number = §1t128s0§.§1t12543s0§;   // = 3   (§1t128s0§.as:8)
if(_loc1_) { _loc6_ = 1.5; }                 // launch arrows fly on HALF gravity
var _loc7_ = _loc6_ * Math.abs(_loc4_-_loc2_) / 0.866;  ...

// WEB §1t137s0§.as:64-71 — integration matches the solve
rotation = Math.atan(velY/velX) * 57.2727 + 180;
if(this.§1t4425s0§) { velY += 1.5; } else { velY += §1t12543s0§; }
```

Android for comparison — one branch, and `grep -c "1\.5" ArrowProjectile.as` → **0**:

```as3
// ANDROID ArrowProjectile.as:55-56
rotation = Math.atan(velY/velX) * 57.2727 + 180;
velY += GRAVITY;
```

Android also rolls `doLaunch` **after** the solve (`EnemyArcher.as:286-300`), so it
cannot affect the trajectory; web rolls it **before**, so it does. Knockdown arrows
in the shipped game visibly float on a higher arc. A port using a fixed `GRAVITY = 3`
is wrong on exactly the arrows the player is meant to read and dodge.

---

## The nameplate rule is per-entity, not per-mode — and the source gives the exact hues

I opened both frames.

**seg-10 `frame_0013.jpg`**, my crop `(340,320)→(900,480)` LANCZOS ×3: two kasa-hatted
bandits under red all-caps `BANDIT (4)`; the right label is overlapping duplicates for
stacked bandits. **The gold `GUEST` and the `TERRITORY (22,51)/SECTOR (1,2)` HUD that
the surveyor lists as "visibly in the crop" are NOT in that crop** — on the full frame
`GUEST` sits at x≈205 (left of the crop's x=340) and TERRITORY/SECTOR at y≈272 (above
the crop's y=320). Both are in the *frame*, so the finding stands; the crop attribution
is wrong. Full frame also shows: 138 COINS, player badge **level 4**, XP 3714/5150,
20/20 green / 15/15 blue, HEAVY STANCE, "W TOSHIBARA FIELD".

Worth noting the surveyor missed: **the player is also level 4**, so the roamers here
are level-matched, not authored at 4. Confirmed elsewhere in the same system —
`FriendlyElite.as:70`, `FriendlyArcher.as:58`, `FriendlySpearElite.as:56` all call
`this.setLevel(StatsManager.getLevel())`.

**seg-11 `frame_0020.jpg`**, my crop `(250,300)→(1024,500)` ×2 and the full frame:
five thin horizontal HP bars (four green, one dim tan far right) over five hostiles,
**no name or level on any of them**; gold `GUEST` over the player mid-swing with a
pickaxe; two drawn-longbow archers at the right; brick interior, red near-death
vignette; HUD 16/20, 15/15, "CANNOT CHANGE STANCE", "AUTO SLASH OFF". The surveyor's
description is accurate.

But its *mechanism* — "the enemy readout is **mode-switched**" — is contradicted by
the source. Nameplates are decided **per entity at init**, and blanked explicitly:

```as3
// EnemyPlayer.as:768-810
if(this.isDuelist || this.isBoss) {
   namecolor = 16777215;                                   // 0xFFFFFF white
   if(this.side != 0 && this.side != StatsManager.getSide())
      namecolor = 10027008;                                // 0x990000 dark red
   mcs.setDisplayName(xml.name + " (" + level + ")", namecolor);
   ...
} else {
   mcs.setDisplayName("");                                 // field trash: no plate, ever
   minDamage = xml.attack;  damageRange = 0;               // and no damage variance
}
```

So the correct rules are: **format** `name + " (" + level + ")"`; **white 0xFFFFFF**
by default, **dark red 0x990000** only when the entity's `side` is non-zero *and*
differs from the player's side (hostile **faction**, not hostility); and **only bosses
and duelists get a plate at all**. A recreation that implements a combat-mode toggle
would be wrong. Same block also holds an unreported duelist stat band:
`isBoss && level>70 → ×1.25` dmg/hp, `isBoss && level>50 → ×1.2`, `level>30 → ×1.1`,
`level<10 → ×0.8`.

---

## Verified as stated (I re-derived each)

- **403 `<hp>` / 406 `<attack>` / 394 `<defense>`** rows — `grep -c` on `npcdata.xml`. ✅
- **ids 11-16 one statline, six AI** — `<lvl>10 <hp>15 <attack>24 <defense>20`,
  `<ai>` = 1,2,3,4,5,9. ✅
- **38-case dispatch** — read verbatim, `NPCManager.as:516-634`. ✅ (count nit below)
- **`<ai>` histogram** — 34 distinct values over 425 rows; every bucket the surveyor
  listed matches my `sort | uniq -c` exactly. ✅
- **118 `<wave>`, 75 `<fatal>`**, wave-0-on-ground / wave-N `posY - Math.random()*200`. ✅
- **Zombie head-gate** — `PART_hat/head/neck → behead`, `if(!behead) damage /= 2`;
  base `NPC.as:451-453 if(behead) damage *= 1.5`. `grep -ric reflect` over all Android
  scripts → **zero hits**. ✅ *Unreported extra rule:* hitting `PART_weapon` sets
  `damage = 0` and returns false.
- **No enemy Chi / speed** — `grep -c "<chi>\|<speed>" npcdata.xml` → **0**. ✅
- **No squad coordination** — `getNearestEnemy` read in full at `NPCManager.as:1360-1390`;
  independent nearest-live-target scan, `pos > -10 && pos < stageWidth + 10`, skips
  dead and `SKILL_UNDYING_STATE`. No shared aggro table. ✅
- **calcXP** — grey-level gate, `mobLevel - playerLevel > 3 → 0`, ±band, `elite ×2`. ✅
- **Loot dispatch** — `chance = loot.chance*100`, ids 0→1 coin, 1→5 coins, 2→quest,
  3→level-scaled random, else literal id. ✅
- **`hp: 150` is stale** — `npx vitest run tests/config-values.test.ts` → **57 passed**;
  `ENEMY_BASE` asserted at `tests/config-values.test.ts:466`. ✅
- **Bounty names are procgen** — `Hachisuka` and `Honda` both present in
  `87_NameGenerator_SamuraiFamilyNames.bin`; `Kano` in `85_MaleNames.bin`; `Shizuka`
  in `88_FemaleNames.bin`. ✅
- **Tengu** — I widened the hunt to `grep -ril "tengu" reference/` (**everything**:
  all XML, all 8 decompiled bundles, android blobs, index JSONs) → **zero files**.
  The STILL_UNHELD half is **correct and I am not refuting it**. Ledger line 219/221
  ("Tengu/Guardian", "Tengu Hotaru") is a ledger invention or v0.717-only. Ledger text
  quoted by the surveyor verified verbatim at `REBUILD_READINESS.md:218-221`. ✅

## Minor defects (not refutations)

1. `ai-id-to-class-map` says "34 named Enemy* classes plus 3 Friendly*". Measured:
   **31 distinct `Enemy*` + 3 `Friendly*` = 34 total** across 38 cases (`EnemyPlayer`
   is cases 0/9/14, `EnemySpearElite` is 28/37). The 34 is the total, mislabelled.
2. `engagement-ranges` quotes `EnemySpear.as:192` as
   `if(playerX - mcs.x < 400 && mcs.y - playerY < 10 ...)`. Line 192 is actually
   `mcs.x - playerX < 400 && mcs.y - playerY < 10`; the `playerX - mcs.x` form with
   `< 50` is line 204. Two lines spliced into one quote. Constants unaffected.
3. `engagement-ranges` calls `Obj_NPCProcGen.as:135` an "overworld roamer trigger".
   It is `isInInteractRange()`, gated on `if(this.questCompleted) return false` — a
   quest/talk radius, not aggro.
4. Frames are 1024×576. Any px measurement taken off them scales by 0.533 vs a 1080p
   source.

## Net effect on the score

The surveyor capped at 78 on four stated reasons. Three are now dead:
(1) build parity — **checkable and largely confirmed**, via the 612 obfuscated web
classes; (2) the 12-frame lockout wanting confirmation — **the flinch anim is 8 frames
and the state machine is fully written**; (4) partly, since the 38 behaviours are now
readable in *both* builds. Reason (2) (Tengu) survives intact.

Pulling the other way, and new: the boss rubber-band overrides mean the authored boss
statlines are floors, and the web arrow gravity diverges from the Android source every
number in this unit was taken from. Those are corrections, not gaps — they raise
confidence while changing what should be ported.
