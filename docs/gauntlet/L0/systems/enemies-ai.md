# GAUNTLET L0 — system survey: **enemies-ai** (ledger score 34/100)

**Surveyor run:** 2026-08-13 · **Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20)
**Ledger block audited:** §2 scorecard row `enemies-ai | 34` (line 133) + §4 `### enemies-ai — 34` (line 218)

---

## 0. PROVENANCE CAVEAT — read before trusting any A2 cite below

Every ActionScript cite in this file comes from **`reference/decompiled/shs3_android_payload/scripts/`**,
not from the web v0.717 bundle. This is not a choice — it is forced:

```
$ ls reference/decompiled/shs3_payload/scripts/NPC.as
ls: reference/decompiled/shs3_payload/scripts/NPC.as: No such file or directory
```

The web `shs3_payload` bundle decompiles to 1,079 `.as` files that are **all asset stubs**
(`ColorPicker_backgroundSkin.as`, `hair6000.as`, `portrait_kojuro.as` …). Grepping it for
`enemy|npc|ai` returns exactly three files, none of them game logic. The **only** decompiled
source of the combat/AI code in this repo is the Android bundle (`shs3_android` and
`shs3_android_payload`, byte-identical for `NPCManager.as`).

Three checks say the AI code is shared, not a mobile fork:

1. `grep -c isMobile` on `NPC.as`, `NPCManager.as`, `EnemyArcher.as` → **0, 0, 0**. The enemy
   classes contain zero platform branches, while `StatsManager`/`Mobile` elsewhere are full of them.
2. `reference/extracted/npcdata.xml`'s `<ai>` domain is **1..37** (index `npcdata.json`,
   `numeric_range: [1.0, 37.0]`, 34 distinct). `NPCManager.createNPC`'s switch defines
   **case 0..37**. Perfect coverage, zero orphans in either direction.
3. `npcdata.xml` is the *shared* data file both builds load.

**Treat AS3 cites as build-family evidence, strong but one step removed from v0.717.**
Where a frame is available I lead with the frame.

---

## 1. CLAIMS

### C1 — `enemies-ai/level-stat-formula` — **OVERTURNS BLOCKER ①**

> **Ledger (§4 enemies-ai, blocker ①):** "① enemy **level→stat formula** (governs the whole
> roster's balance — absent, not just inferred)."

It is not absent. It is a named function.

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-259`

```as3
      public function setLevel(lvl:int) : *
      {
         var factor:Number = lvl / this.level;
         if(lvl <= 20)
         {
            factor *= 0.9;
         }
         this.level = lvl;
         this.damage *= factor;
         this.defense *= factor;
         maxhp *= factor;
         setHP(maxhp);
         this.updateHealthBar();
         this.xp = lvl * 2 + 20;
         if(lvl <= 10)
         {
            this.damage = 1;
            this.defense = 1;
            maxhp = 1;
            setHP(maxhp);
         }
      }
```

Verdict **HELD**. The formula is a *proportional rescale from the NPC's tabled base*, with a
0.9 handicap band below level 21 and a hard 1/1/1 clamp at level ≤10 — not a curve to be derived.

---

### C2 — `enemies-ai/setlevel-is-overridden` — **CORRECTS C1; the single most load-bearing nuance in this survey**

`NPC.setLevel` is **not** universal. Eleven classes override it:

**A2** — `grep -rn "override public function setLevel" reference/decompiled/shs3_android_payload/scripts/*.as`

```
EnemyOgre.as:51 · EnemyElite.as:23 · EnemyTrainingDummy.as:23 · EnemyWolfAlpha.as:52
EnemyPlayer.as:57 · FriendlyArcher.as:21 · EnemyKanjiGuardian.as:48 · FriendlyElite.as:23
EnemySpearElite.as:32 · EnemyStag.as:48 · FriendlySpearElite.as:19
```

So the 1/1/1 clamp binds **only the plain trash classes** (Knife, Katana, Archer, Spear, Shield,
Ninja, Civilian, Zombie, JiangSi, Goblin, Bear, Boar, Deer, Fox, Horse, VegePatch, GoblinThrower,
NianMonster, Wolf, Wolf2). Elites, player-shaped enemies, bosses, the Ogre, the Alpha Wolf, the
Stag, the Kanji Guardian and every Friendly use their own scaling. **Any rebuild that applies
`NPC.setLevel` to everything will produce 1-HP bosses.**

Verdict **HELD**.

---

### C3 — `enemies-ai/boss-ttk-rubber-band` — **the ledger does not know this system exists**

Elite/boss stats are **not** read from the table at all — they are back-solved at spawn from the
*player's live stats* to hit a target time-to-kill.

**A2** — `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:23-84` (verbatim, elided
only where noted)

```as3
      override public function setLevel(lvl:int) : *
      {
         var factor:Number = NaN;
         mcs.setDisplayName(charname + " (" + lvl + ")",16777215);
         factor = lvl / level;
         level = lvl;
         minDamage = damage * factor;
         defense *= factor;
         maxhp *= factor;
         setHP(maxhp);
         updateHealthBar();
         xp = lvl * 5 + 45;
         var playerHP:int = StatsManager.getPlayerStats(StatsManager.STAT_MAXHP) + StatsManager.findBonusStat(StatsManager.STAT_MAXHP);
         var playerDEF:int = StatsManager.getPlayerStats(StatsManager.STAT_DEFENSE) + StatsManager.findBonusStat(StatsManager.STAT_DEFENSE);
         var playerATK:int = StatsManager.getMinDamage() + StatsManager.getDamageRange() / 2;
         var playerLVL:int = StatsManager.getLevel();
         var lvldiff:int = lvl - playerLVL;
         var hitsToKillBoss:int = 10 + lvldiff;
         var hitsToKillPlayer:int = 18 - lvldiff;
         if(hitsToKillBoss <= 3)   { hitsToKillBoss = 3; }
         if(hitsToKillPlayer <= 0) { hitsToKillPlayer = 1; }
         var playerhit:int = playerATK - defense;
         if(playerLVL <= 10 && playerhit < 1)                    { playerhit = 1; }
         else if(playerLVL <= 20 && playerhit < playerLVL / 8)   { playerhit = playerLVL / 8; }
         else if(playerLVL <= 30 && playerhit < playerLVL / 6)   { playerhit = playerLVL / 6; }
         else if(playerhit < playerLVL / 4)                      { playerhit = playerLVL / 4; }
         var bossHP:int = playerhit * hitsToKillBoss;
         if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); updateHealthBar(); }
         var bosshit:int = playerHP / hitsToKillPlayer;
         var bossATK:int = bosshit + playerDEF;
         if(bossATK > minDamage) { minDamage = bossATK; }
         if(lvl <= 5) { minDamage = 1; defense = 1; }
      }
```

**Design intent, stated in the code:** a boss should take ~**10 hits** to kill (±level difference,
floor 3) and should need ~**18 hits** to kill the player (∓level difference, floor 1). `bossHP` and
`bossATK` are `max()`-merged over the tabled values, so the table is a *floor*, not the truth.

This also settles combat-core §4 blocker ③ ("early-mob HP + starter weapon DMG + hits-to-kill —
*read L1 bandit-fight popups in video A*"): no popup-reading is needed for the boss half.

Verdict **HELD**.

---

### C4 — `enemies-ai/per-enemy-hp` — **OVERTURNS BLOCKER ②**

> **Ledger (§4 enemies-ai, blocker ②):** "② per-enemy HP."

**A2** — `reference/extracted/npcdata.xml`, 403 explicit `<hp>` rows (index `npcdata.json`,
`npcdata/npc/hp: count 403, numeric_range [1.0, 1000.0]`). Sample, lines 22-29:

```xml
	<npc>
		<id>1</id>
		<name>5009</name>
		<lvl>3</lvl>
		<hp>1</hp>
		<ai>1</ai>
		<attack>3</attack>
		<defense>0</defense>
```

Measured HP histogram (my script over the file): **42 NPCs at hp 1**, then 2/5/6/7/8/9/10/15/20/28/30…
up to **hp 1000** (npc id 144, line 3121, lvl 80, ai 28, attack 200, defense 200).

Verdict **HELD**. Per-enemy HP is a 403-row table on disk, not a gap.

---

### C5 — `enemies-ai/pvp-dummy-surface` — **CONFIRMS the Surface bullet, and upgrades it from "notes" to A2**

> **Ledger (§4 enemies-ai, Surface):** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy**
> (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."

Both halves are now payload-verified.

**A2** — hp 150 is real but belongs to **level-60 `ai=9` (`EnemyPlayer`) duel NPCs**:
`reference/extracted/npcdata.xml` line 9512 → `id 651, name 5059, lvl 60, hp 150, attack 150, defense 168`
(same block repeats at lines 8477, 8571, 9606 …).

**A2** — field trash is hp 1: 42 NPCs carry `<hp>1</hp>`, and `NPC.as:255-259` clamps *every*
non-overriding class to `maxhp = 1` at level ≤10.

Verdict **HELD** (confirmation, not an overturn). "Every PvE number lives only in notes" is now false —
they live in `npcdata.xml`.

---

### C6 — `enemies-ai/telegraph-active-recovery` — **OVERTURNS BLOCKER ③ (first half)**

> **Ledger (§4 enemies-ai, blocker ③):** "③ telegraph/active/recovery + stagger frames."

The animation data splits every creature attack into exactly telegraph / active / recovery, with
integer frame counts.

**A2** — `reference/extracted/bindata/100_1t4627s0.bin` (an `<animdata>` XML; header verbatim:
`<?xml version="1.0"?>\r\n<animdata>\r\n<anim i="idle" d="1">`), anim list:

```
('ogre_idle','1') ('ogre_fidget','19') ('ogre_walk','24') ('ogre_run','22')
('ogre_swingdown','16') ('ogre_swingdownhit','5') ('ogre_swingdownend','11')
('ogre_swingup','13')   ('ogre_swinguphit','5')   ('ogre_swingupend','11')
```

→ Ogre down-swing = **16 f telegraph · 5 f active · 11 f recovery**.

Same triple in every creature file:
`111_…bin` guardian_swingdown **14** / swingdownhit **7** / swingdownend **11**;
`112_…bin` wolf_pounce_start **9** / mid **17** / end **7**, wolf_bite **16**;
`115_…bin` gob_pounce_start **11** / mid **13** / end **10**, gob_attack **27**, gob_throw **20**;
`114_…bin` spider_attackstart **7** / attackend **10**;
`107_…bin` zom_attack **20**, js_alert **12**, js_hop **7**, js_rise **40**;
`101_…bin` bear_attack **18**; `117_…bin` boar_attack **16**; `113_…bin` spear_lunge parta **7** /
partb **1** / partc **10**, spear_throw **22**, spear_flurry **25**.

Verdict **HELD**. Telegraph/active/recovery is fully tabled for all 19 animation sets.

---

### C7 — `enemies-ai/stagger-12-frames` — **OVERTURNS BLOCKER ③ (second half)**

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPC.as:462`

```as3
            this.gotHitCounter = 12;
```

set inside `gotHit()` immediately after HP is deducted, gated at the top by
`if(this.gotHitCounter > 0) { return false; }` (`NPC.as:388-390`) and exposed as
`public function canHit() : Boolean { return this.gotHitCounter == 0; }` (`NPC.as:296-299`).

→ **A universal 12-frame hit-lockout / i-frame window on every NPC**, decremented once per
`update()`. `EnemyZombie.as:522` repeats the same literal `gotHitCounter = 12`.

Verdict **HELD**.

---

### C8 — `enemies-ai/spawn-geometry` — **OVERTURNS BLOCKER ④ (spawn half)**

> **Ledger (§4 enemies-ai, blocker ④):** "④ aggro/leash/spawn geometry."

**A2 (data)** — `reference/extracted/questdata.xml:77-95`, one of **118 `<wave>` blocks**:

```xml
    <wave>
      <enemy>
        <id>1</id>
        <qty>1</qty>
        <x>750</x>
      </enemy>
      <enemy>
        <id>6</id>
        <qty>1</qty>
        <x>790</x>
        <fatal>0</fatal>
      </enemy>
      <neutral>
        <id>118</id>
        <qty>1</qty>
        <x>2000</x>
        <lvl>1</lvl>
      </neutral>
    </wave>
```

Spawn **x in stage pixels**, quantity, npc id, a `<fatal>` flag, `<neutral>`/`<friend>` sides, and a
per-wave `<lvl>` override (line 222-227 shows `<friend><id>144</id><qty>1</qty><x>700</x><lvl>80</lvl>`).

**A2 (rule)** — `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:400-412`

```as3
               if(currentWave == 0)
               {
                  createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY,npcHolder.getFatal(),npcHolder.getLvl());
               }
               else
               {
                  createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY - Math.random() * 200,npcHolder.getFatal(),npcHolder.getLvl());
               }
```

with `posY = StageManager.getGroundY()` for wave 0 and `posY = 0` for every later wave
(`NPCManager.as:394-399`). → **Wave 0 walks in on the ground; waves 1+ DROP IN from y = −0..200
above the top of the screen** and fall under `velY += 3` (`EnemyKnife.as:228-233`). Wave advance is
"all enemies dead" (`checkNextWave`, `NPCManager.as:300-320`).

The `<lvl>` override is what makes C3 fire: `createEnemy(..., lvl)` → `actor.setLevel(lvl)`.

Verdict **HELD**.

---

### C9 — `enemies-ai/aggro-rule` — CONFIRMS the "independent-aggro" Ready bullet and closes the aggro half of blocker ④

> **Ledger (§4 enemies-ai, Ready):** "independent-aggro (no coordination — closed)".

Correct, and now cited rather than asserted.

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:1360-1390`

```as3
      public static function getNearestEnemy(xpos:int, isEnemy:Boolean = false) : NPC
      {
         ...
         var stageWidth:int = StageManager.getGameStageWidth();
         for(var i:* = int(max - 1); i >= 0; i--)
         {
            enemy = targetList[i] as NPC;
            pos = enemy.getMapPosition();
            if(pos > -10 && pos < stageWidth + 10)
            {
               dist = Math.abs(xpos - pos);
               if(!enemy.isDead() && dist < maxdist && enemy.actionState != MCSActor.SKILL_UNDYING_STATE)
```

Refinements the ledger does not carry:
- Targeting is **1-D horizontal only** (`Math.abs(xpos - pos)`), never Euclidean.
- Targets are gated to **on-screen ±10 px** (`pos > -10 && pos < stageWidth + 10`).
- Targets in `SKILL_UNDYING_STATE` are skipped.
- Re-target cadence is a counter, not per-frame: `NPC.as:22 internal var aiCounterMax:int = 24;`
  (**every 24 frames**), overridden to **12** for `EnemyElite.as:18`, `EnemyPlayer.as:52`,
  `FriendlyElite.as:18`, `MCSPlayer.as:165`.

**There is no leash.** `grep -rniE "leash|returnhome|deaggro|forgetTarget|giveUp"` over all 970 Android
scripts returns **zero hits**, as does `aggro|chase|detect|sightrange|alert` over `NPC.as`. An enemy
targets the nearest on-screen opponent forever.

Verdict **HELD**.

---

### C10 — `enemies-ai/engagement-distance` — closes the last part of blocker ④ with literals

**A2** — `reference/decompiled/shs3_android_payload/scripts/EnemyKnife.as:140` and `:181`

```as3
               walkSpeed = Math.random() * 2 + 4;
...
                  if(mcs.x - playerX < 50 && mcs.y - playerY < 50)
```

→ Knife AI closes at **4–6 px/frame** and swings when the target is within **50 px on x AND 50 px
on y**; if the target `isDowned()` it enters `STAB_STATE` instead, which deals
`new Damage(damage * 2, level)` (`EnemyKnife.as:110-114`) — a **2× ground-stab finisher** the ledger
does not list at all.

Verdict **HELD**.

---

### C11 — `enemies-ai/undead-is-halving-not-reflect` — **OVERTURNS BLOCKER ⑤ (first half) AND CORRECTS THE MECHANIC'S IDENTITY**

> **Ledger (§4 enemies-ai, blocker ⑤):** "⑤ Undead damage-reflect probability; arrow arc physics."

There is **no damage reflect in this game.** `grep -rniE "reflect"` across all 970 Android scripts →
**zero hits**. The ledger is describing a mechanic that does not exist.

What undead actually have is a headshot-gated **50 % damage reduction**:

**A2** — `reference/decompiled/shs3_android_payload/scripts/EnemyZombie.as:510-521` (inside its
`override public function gotHit`)

```as3
            damage -= defense;
            if(damage < damageObj.getMinDamage())
            {
               damage = damageObj.getMinDamage();
            }
            if(!behead)
            {
               damage /= 2;
            }
```

Compare the base class at `NPC.as:449-455`, which has `if(behead) { damage *= 1.5; }` in the same
slot. So: **normal enemies take ×1.5 on a head/hat/neck hit; zombies take ×0.5 on everything that is
NOT a head/hat/neck hit.** That is the mechanical content of "undead take reduced damage — go for
the head", and it is deterministic, not probabilistic. There is no "probability" to measure.

Verdict **HELD**, and `overturns_ledger = true` on two counts: the mechanic is not a reflect, and it
is not probabilistic.

---

### C12 — `enemies-ai/arrow-arc-physics` — **OVERTURNS BLOCKER ⑤ (second half)**

**A2** — `reference/decompiled/shs3_android_payload/scripts/EnemyArcher.as:254-301`, with
`reference/decompiled/shs3_android_payload/scripts/Projectile.as:8`
(`internal static var GRAVITY:Number = 3;`)

```as3
      internal function fireArrow() : *
      {
         var fireX:int = mcs.x;
         var fireY:int = mcs.y - 60;
         var targetX:int = target.mcs.x;
         var targetY:int = target.mcs.y - 60;
         var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866;
         velA = Math.sqrt(velA);
         var velXa:Number = velA * 0.866;
         var t:Number = Math.abs(targetX - fireX) / velXa;
         var velYa:Number = (targetY - fireY - 0.5 * Projectile.GRAVITY * t * t) / t;
         if(fireX > targetX)
         {
            velXa = -velXa;
         }
         velYa += Math.random() * 8 - 4;
         var doLaunch:Boolean = false;
         if(level > 50)      { doLaunch = int(Math.random() * 2) > 0; }
         else if(level > 20) { doLaunch = int(Math.random() * 3) == 0; }
         else if(level > 10) { doLaunch = int(Math.random() * 4) == 0; }
         ProjectileManager.createArrow(fireX,fireY,velXa,velYa,damage,doLaunch,this);
         startAnim(ARROWFIRE);
      }
```

Fully specified: gravity **3 px/frame²**, muzzle at **shoulder height (y − 60)**, aim point also
y − 60, fixed launch geometry via the **0.866 = cos 30°** constant, exact closed-form ballistic
solve for `velYa`, a **±4 px/frame vertical miss jitter**, and a level-gated chance the arrow
*launches* the target on hit (**1/2 above lv50, 1/3 above lv20, 1/4 above lv10, never at or below
lv10**).

Verdict **HELD**.

---

### C13 — `enemies-ai/taxonomy-is-38-branches` — UNDER-CLAIM in the Ready bullet

> **Ledger (§4 enemies-ai, Ready):** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)
> with movesets incl. **the archer** (closed this pass)".

The real taxonomy is a hard 38-branch dispatch, not a four-family prose summary.

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:517-632`, `switch(xml.ai)`,
`case 0` … `case 37`:

```
0 EnemyPlayer(duelist)  1 EnemyKnife     2 EnemyArcher      3 EnemyKatana     4 EnemySpear
5 EnemyShield           6 EnemyNinja     7 EnemyCivilian    8 EnemyWolf       9 EnemyPlayer
10 EnemyWolf2          11 EnemyWolfAlpha 12 EnemyHorse     13 EnemyTrainingDummy
14 EnemyPlayer(isBoss) 15 EnemyPlayerGiant 16 EnemyNianMonster 17 EnemyBear   18 EnemyBoar
19 EnemyDeer           20 EnemyVegePatch 21 EnemyStag      22 EnemyGoblin    23 EnemyOgre
24 EnemyFox            25 EnemyGoblinThrower 26 EnemyZombie 27 EnemyJiangSi
28 EnemySpearElite     29 EnemyElite     30 FriendlyElite  31 FriendlySpearElite
32 EnemyCivilianOld    33 EnemyCivilianFemale 34 FriendlyArcher 35 EnemySorcererBoss
36 EnemyKanjiGuardian  37 EnemySpearElite(boss variant)
```

`EnemyPlayer(mcs, isDuelist, isBoss)` — `EnemyPlayer.as:40` — is what separates 0 / 9 / 14.
`XMLNpc.as:647` supplies the engine's own animal predicate:
`return this.ai == 8 || this.ai == 10 || this.ai == 11 || this.ai == 12 || this.ai == 16 || this.ai == 17 || this.ai == 18 || this.ai == 19 || this.ai == 21 || this.ai == 24;`

Live census over `npcdata.xml` (my script; 34 of the 38 branches actually referenced — 0, 10, 15, 16
are defined but unused by the table):

```
ai=1  56 Knife    ai=2  48 Archer   ai=3  52 Katana   ai=4  47 Spear   ai=5  48 Shield
ai=6   3 Ninja    ai=7   6 Civilian ai=8   2 Wolf     ai=9  73 Player  ai=11  1 WolfAlpha
ai=12  1 Horse    ai=13  1 Dummy    ai=14 15 BOSS     ai=17  1 Bear    ai=18  1 Boar
ai=19  1 Deer     ai=20  1 VegePatch ai=21 1 Stag     ai=22  1 Goblin  ai=23  1 Ogre
ai=24  1 Fox      ai=25  1 GoblinThrower ai=26 8 Zombie ai=27 1 JiangSi
ai=28 24 SpearElite ai=29 10 Elite  ai=30  8 FriendlyElite ai=31 1 FriendlySpearElite
ai=32  2 CivilianOld ai=33 2 CivilianFemale ai=34 3 FriendlyArcher
ai=35  1 SorcererBoss ai=36 1 KanjiGuardian ai=37 2 SpearElite(boss)
```

Verdict **HELD**. The ledger's summary omits Fox, Nian Monster, Jiang Si, Vege Patch, Goblin
Thrower, Stag, Horse, Training Dummy, Sorcerer Boss, Giant, and the entire **friendly-ally** side
(ai 30/31/34), which shares the same AI machinery.

---

### C14 — `enemies-ai/tengu-unsupported` — the Ready bullet names a family the payload does not contain

> **Ledger (§4 enemies-ai, Ready):** "full taxonomy (Humans/Undead/Oni/Animals + **Tengu**/Guardian)"
> **Ledger (§4 enemies-ai, Surface):** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza,
> **Tengu Hotaru**."

```
$ grep -rli "tengu" reference/decompiled/ reference/extracted/ui_strings.txt
(no output)
```

Zero hits across all 8 decompiled bundles and `ui_strings.txt`. There is no `EnemyTengu` class, no
tengu animation set among the 19 `<animdata>` files, and no tengu string. A "Tengu Hotaru" would
have to be an `EnemyElite`/`EnemyPlayer` wearing a mask, identified purely by a `<name>` string ID —
and those IDs are unresolvable (C16).

I cannot confirm and cannot refute it. **STILL_UNHELD.** The Ready bullet should not carry "Tengu"
as though it were established.

---

### C15 — `enemies-ai/nameplate-is-elite-only` — the Ready bullet is true but unqualified; **THE FRAME REFINES IT**

> **Ledger (§4 enemies-ai, Ready):** "nameplate (N)=level."

**A1** — `reference/frames/session24/reach-B-honda-duel/e11_wide_f0140_x780-1500_y560-900_x2.png`
(crop as filed: x 780–1500, y 560–900 of a 1920×1080 frame, upscaled ×2; I read it at that size).
Visibly in the crop: a **white all-caps nameplate reading `HONDA SHIZUKA (7)`**, and directly beneath
it a **health bar, ~45 % green on a dark-red track**, over a pink-clad female samurai in a straw kasa
mid-slash with a red blade trail. To its right, in **yellow**, the partial word `SOUN…` — the
player's own overhead name.

**A1 (negative control)** — `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
(crop x 520–1120, y 580–900, upscaled ×2.5). Three enemies — one kasa-wearing bandit bleeding out
prone, one purple-clad crouched, one khaki-clad spraying blood from the neck — and a blue Light-stance
blade arc across them. **None of the three carries a nameplate or a health bar.** The only overhead
text in the whole frame is the player's yellow `SOUND360TM`.

**A2 (mechanism)** — `grep -rn "setDisplayName"`:

```
EnemyElite.as:114        mcs.setDisplayName(xml.name + " (" + level + ")",16777215);
EnemyElite.as:26         mcs.setDisplayName(charname + " (" + lvl + ")",16777215);
EnemyPlayer.as:776       mcs.setDisplayName(xml.name + " (" + level + ")",namecolor);
EnemyKanjiGuardian.as:59 mcs.setDisplayName(this.charname + " (" + lvl + ")",16777215);
ChangeNameDialog.as:233  StatsManager.getPlayer().getMCS().setDisplayName(StatsManager.charname,16763904);
```

`16777215 = 0xFFFFFF` white (elite/boss/guardian) · `16763904 = 0xFFC300` gold (the player).
No trash class (`EnemyKnife`, `EnemyKatana`, `EnemyArcher`, `EnemySpear`, `EnemyShield`, …) ever
calls it, so `displayName.text == ""` and `MCSCharacter.showHealthBar()` at `MCSCharacter.as:1419-1430`
leaves the label hidden:

```as3
      public function showHealthBar() : *
      {
         addChild(this.healthBar);
         this.healthBar.visible = true;
         if(this.displayName.text != "")
         {
            this.displayName.visible = true;
         }
```

Geometry, free: `MCSCharacter.as:148` `this.healthBar.y = -120;` · `:158` `this.displayName.y = -120;` ·
`:1445` `this.healthBar.bar.width = fraction * 60;` → the bar is **60 px wide, 120 px above the
character origin**, name pinned to the same y.

**The frame and the code agree, and both refine the ledger:** the `(N)` nameplate exists only on
elites, player-shaped enemies, bosses and the Kanji Guardian. Verdict **PARTIAL** — the Ready bullet
is true but reads as universal, and the frames show it is not.

---

### C16 — `enemies-ai/string-table-LOCATED` — the run-wide blocker is no longer "not yet located"

The gauntlet's standing blocker: item/skill/npc `<name>` are numeric IDs into a string table that
"has NOT YET been located; `ui_strings.txt` is NOT it; `bindata/` is now EXHAUSTED as a candidate."

That is correct — and now explained. The table was **never in the SWF**.

**A2** — `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:147-150`

```as3
         if(xml.name.toString() != "")
         {
            this.name = LangManager.getString(xml.name);
         }
```

**A2** — `reference/decompiled/shs3_android_payload/scripts/LangManager.as` (`setLanguage`)

```as3
         var server:String = "./data/";
         ...
            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
            Locale.loadLanguageXML(id,onLanguageLoad);
```

The web build fetches **`./data/shs3_en.xml` from the server at runtime**. That server is dead, which
is why no amount of SWF archaeology will produce it. `bindata/` was never a candidate.

**But there is a live lead.** The Android build embeds an English fallback:

`reference/decompiled/shs3_android_payload/scripts/Mobile_Lang_EN.as` —
`[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]`
used at `Mobile.as:546-552` (`trace("loadLanguage: cache embedded"); this.writeFile(ByteArray(new Lang_EN()),fileId);`).

That `.bin` is **not on disk here** — `reference/extracted/bindata/` holds the *web* asset numbering
(92–119, all `<animdata>`/survival/name-generator per Stage-0 finding S0-1), a different set from the
Android `/_assets/` list (84–125, which includes `118_Mobile_Lang_EN.bin`, `125_Mobile_NpcData.bin`,
`116_Mobile_QuestData.bin`…).

Verdict **PARTIAL**: the table is **located and named** (`shs3_en.xml`, server-side; embedded copy
`118_Mobile_Lang_EN.bin` inside the Android package) but **not held**. Recommend a dedicated lane:
re-extract the Android APK/SWF's `_assets` and this blocker falls for *every* system at once.

---

### C17 — `enemies-ai/boss-names-live-in-the-frames-not-the-payload` — corrects the Surface bullet's close-path

> **Ledger (§4 enemies-ai, Surface):** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza,
> Tengu Hotaru."

The **payload cannot supply these names** (C16). The **frames can, and already did**: `HONDA SHIZUKA (7)`
is legible in `reference/frames/session24/reach-B-honda-duel/e11_wide_f0140_x780-1500_y560-900_x2.png`
(C15) — name *and* level, rendered by the live game.

Meanwhile the payload supplies what the frames cannot: the boss **stat lines**. All 19 boss-flagged
NPCs (`ai` ∈ {14, 35, 36, 37}) from `reference/extracted/npcdata.xml`, as `line ai id name lvl hp atk def`:

```
 495 14  17 5048 10  30  28  30      3234 14 151 5078  3  10   8   5
 538 14  18 5048 10  30  28  30      3442 37 165 5090 10 200  18  10
 798 14  25 5053 10  30  28  30      3467 14 166 5091  6  20  15  10
1001 14  32 5014 10  30  28  30      3487 14 167 5092  6  20  15  10
1216 14  39 5055 10  30  28  30      3842 37 186 5107 30 600  60  30
1466 14  46 5097 10  30  28  30      3982 14 195 5114  6  20  15  10
1905 14  70 5053 10  30  28  30      4002 14 196 5115  6  20  15  10
1926 14  71 5053 10  30  28  30      4072 35 800 5118 23 800   —  40
3085 14 142 5055 10  30  28  30      4111 36 802 5119 10  30  28  30
                                     4178 14 805 5120 10  30  28  30
```

Note this is **not** in tension with the frame's `HONDA SHIZUKA (7)` even though no row reads lvl 7:
per C8 the `<wave>` `<lvl>` overrides the table at spawn, and per C3 the boss's real HP/ATK are then
back-solved from the player. **Where the doc and the frame disagree, the frame wins — here they do
not disagree, because the table is a base and the frame shows the runtime value.**

Verdict **PARTIAL** — stats HELD (A2), names A1-only.

---

### C18 — `enemies-ai/projectile-set` — UNDER-CLAIM in the Ready bullet

> **Ledger (§4 enemies-ai, Ready):** "projectile set (arrows arc, oni rocks, bandit hammer)".

**A2** — `ls reference/decompiled/shs3_android_payload/scripts/ | grep -cE "Projectile\.as$|^Arrow"` → **38**.

Named: `Arrow, ArrowBouncing, ArrowDudProjectile, ArrowProjectile, BigEarthquake, BigFireBreath,
BigRock, BigTornado, BigWave, Boulder, ChargedShot, ChiBurst, ChiKick, ChiPunch, CleaveHit,
FireBreath, Fireball, Flashbang, GroundPunch, HeavenlySword, Kunai, LightningPunch, LogSmoke, Loot,
Part, PurpleExplosion, Rock, ShunpoHit, SlashWave, Text, Trap, Vegetable, VoidFireColumn, VoidSkull,
WaterSplash, WindKick, Windmill` (+ `Projectile` base).

Three named types in the ledger vs 38 classes on disk. Verdict **HELD**.

---

### C19 — `enemies-ai/enemy-movesets-are-tabled` — CONFIRMS the "movesets" Ready bullet with A2

**A2** — `reference/extracted/npcdata.xml:1040`, one row of **647 `<skill>` entries across 96 `<skills>` blocks**
(index `npcdata.json`: `npcdata/npc/skills/skill: count 647`, ids **1000–1501**, lvl ∈ {1,2,3,5,10}):

```xml
		<skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1007</id><lvl>1</lvl></skill><skill><id>1010</id><lvl>1</lvl></skill><skill><id>1012</id><lvl>1</lvl></skill><skill><id>1024</id><lvl>1</lvl></skill></skills>
```

These ids join `skilldata.xml` (75 skills × 182 level rows with `<chi>`, `<cooldown>`, `<value>`), and
`EnemyElite.as:150-157` shows the join being made at spawn:
`cooldownArray[skillList[i].getId()] = skilldata.getCooldown(skillList[i].getValue());`
Ids 1000/1001/1002 are the three **stance masteries** (`XMLNpc.getMastery(1000/1001/1002)`,
`EnemyElite.as:103-105`), not hotbar skills.

Verdict **HELD**. Movesets are per-NPC data with per-level cooldowns, not prose.

---

### C20 — `enemies-ai/reach-in-stage-px` — **CROSS-LANE: closes combat-core §4 blocker ① from this lane's files**

> **Ledger (§4 combat-core, blocker ①):** "① reach cap in **stage px** per stance (the one value the
> whole model needs; wiki gives 'units' of unknown scale) — *measure blade-FX tip-to-body span in
> Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"

No measurement is required. The AI's reach and the player's reach come from the same function, and I
found it while tracing how `EnemyElite` initialises.

**A2** — `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:100-102`

```as3
         var val:int = xml.speed;
         var maxincrement:int = 90;
         var baseSlashLength:int = 120 + Math.floor(maxincrement * val / (20 + val));
```

**A2** — `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1905-1919` (player side)

```as3
      internal static function getBaseSlashLength() : int
      {
         var speed:int = getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED);
         if(hasBuff(BUFF_SPEED))
         {
            speed *= 1.5;
         }
         return getBaseSlashLengthVal(speed);
      }
      
      internal static function getBaseSlashLengthVal(speed:int) : int
      {
         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
      }
```

**A2** — per-stance multiplier, `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3030-3081`

```as3
               this.slashLength = this.baseSlashLength * 1.5;                                    // Light
               this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01); // Balanced
               this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);  // Heavy
               if(this.slashLength < 100) { this.slashLength = 100; }                             // floor
```

then `MCSPlayer.as:3094` `InputManager.setMaxDistance(this.slashLength);` — **the drawn blade line's
maximum length IS the reach**, in stage pixels. `MCSPlayer.as:222` also shows
`BUFF_INJURED` halving it.

So: **base 120 px at speed 0**, rising asymptotically to **210 px** (+5 px per Dan rank), stance
multipliers Light **1.5×** / Balanced **1.0→1.5×** by mastery / Heavy **0.5→1.0×** by mastery, with a
hard **100 px floor**. `InventoryUI.as:2232` even prints it to the player:
`str += "slash distance: " + FONTCOLOR1 + int(baseSlashLength * slashModifier).toString() + FONTEND + " (" + stanceName + ")<br>";`

**This also puts §3 correction #3 in question.** The ledger says "the stance tables (dmg 0.9/1.2/1.4,
reach **300/200/100**) are MASTERY-9 CEILING values, not base." The multipliers 1.5 : 1.0 : 0.5 are
exactly 3 : 2 : 1 — i.e. **300/200/100 is the mastery-ZERO reading at `baseSlashLength = 200`**, and
mastery *raises* Balanced and Heavy toward Light, it does not lower them. I am flagging, not ruling:
resolving it needs the mastery scale (0–100 here vs "mastery-9" in the ledger) pinned down first.
Verdict **PARTIAL** on the §3 tension; **HELD** on the formulas themselves.

---

### C21 — `enemies-ai/xp-per-kill` — **CROSS-LANE: overturns an economy blocker**

> **Ledger (§4 economy, blocker ①):** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED
> seed**; 20+ samples show no XP formula either)."

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPC.as:218` (trash) and
`EnemyElite.as:33` (elites):

```as3
         this.xp = this.level * 2 + 20;     // NPC.as:218  (and NPC.as:247 on rescale)
         xp = lvl * 5 + 45;                 // EnemyElite.as:33
```

**A2** — the award curve, `reference/decompiled/shs3_android_payload/scripts/NPC.as:166-190`:

```as3
      public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
      {
         if(mobLevel <= getGreyLevel())          { return 0; }
         if(mobLevel - playerLevel > 3)          { return 0; }
         var finalXP:int = xp;
         if(playerLevel < mobLevel)      { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
         else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
         if(elite)                       { finalXP *= 2; }
         return finalXP;
      }
```

Both helper thresholds are literal step tables, not mysteries — `NPC.as:94-109` and `NPC.as:112-163`:

```as3
      internal static function getGreyLevel() : int          // mob at or below this awards 0 XP
      {
         var playerLevel:int = StatsManager.getLevel();
         if(playerLevel < 6)  { return 0; }
         if(playerLevel < 40) { return playerLevel - Math.floor(playerLevel / 10) - 5; }
         if(playerLevel < 60) { return playerLevel - Math.floor(playerLevel / 5) - 1; }
         return playerLevel - 9;
      }

      internal static function getZeroDifference() : int     // level gap at which XP hits zero
      {   // <8→5  <10→6  <12→7  <16→8  <20→9  <30→11  <40→12  <45→13
          //  <50→14 <55→15 <60→16 <80→17  else 17
```

XP per kill is therefore fully specified: base `lvl*2+20` (trash) or `lvl*5+45` (elite), **+5 % per
level the mob is above you**, linear decay of `1/getZeroDifference()` per level below, **zero** if the
mob is grey or more than 3 levels above you, **×2** for elites. Loot is separate and also tabled —
`npcdata.xml` carries **131 `<loot>` rows** with `<id>`, `<qty>` (1–5) and `<chance>`
(0.05 / 0.1 / 0.3 / 0.4 / 0.5 / 1.0); e.g. lines 38-44:

```xml
		<reward>
			<loot>
				<id>0</id>
				<qty>2</qty>
				<chance>0.5</chance>
			</loot>
		</reward>
```

Verdict **HELD**.

---

### C22 — `enemies-ai/enemy-damage-intake` — new numbers the ledger has nowhere

**A2** — `reference/decompiled/shs3_android_payload/scripts/NPC.as:386-462`, `gotHit()`:

- **Weapon-part hit is a no-op**: `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;`
  — striking the blade does nothing. (This is the parry the ledger never names.)
- **Head / hat / neck hit sets `behead = true`** → `if(behead) { damage *= 1.5; }` (`NPC.as:449-455`).
- **Elemental damage is mitigated per-element and floored at 1**, never at 0, if the source had any:
  `fireDamage = damageObj.fireDamage - this.STAT_FIREDEF; if(damageObj.fireDamage > 0 && fireDamage < 1) fireDamage = 1;` — ×4 (fire/water/wind/earth).
- **Physical mitigation is flat subtraction with a per-attack floor**:
  `damage -= this.defense; if(damage < damageObj.getMinDamage()) damage = damageObj.getMinDamage();`
- **Death-touch is a literal**: `if(damageObj.isDeathTouch()) { damage = 500; damageObj.launchType = Damage.LAUNCH_FLY; }`
- **Elemental cross-wiring** (`XMLNpc.as:190-206`): an NPC's `<fire>` value sets *both* `STAT_FIREATK`
  **and** `STAT_EARTHDEF`; `<wind>`→WINDATK+WATERDEF; `<water>`→WATERATK+FIREDEF; `<earth>`→EARTHATK+WINDDEF.
  That is the elemental counter-wheel, stated in code: fire ↔ water, wind ↔ earth.
- **Floating damage popups exist and have exact colours** (`EnemyZombie.as:548-560`, same pattern in
  `NPC.as`): physical `10027008` = `0x990000`, fire `16737792` = `0xFF7F00`, wind `13421772` = `0xCCCCCC`,
  water `26367` = `0x0066FF` — which also closes **ui-hud §4 blocker ③** ("floating damage/crit popups
  (absent from the ledger, confirmed to exist)").

Verdict **HELD**.

---

## 2. WHAT IS STILL UNHELD IN THIS SYSTEM

Honest list. Nothing below has an artifact.

- **Every NPC name.** `<name>` is a numeric ID (5000–5122) resolved by the dead server-side
  `shs3_en.xml` (C16). Only names legible in a frame are recoverable today.
- **"Tengu" as an enemy family** (C14) — zero hits anywhere.
- **Whether v0.717 (web) matches the Android AI byte-for-byte.** Argued strongly in §0, not proven.
  There is no A3 byte-check for this.
- **The `<ai>`→behaviour mapping for the 4 unused branches** (0, 10, 15, 16) — defined in code,
  never referenced by `npcdata.xml`, so their in-game role is inferred from the class name only.

---

## 3. RECOMMENDED LEDGER REWRITE FOR `### enemies-ai`

Score **34 → the blockers list is empty of measurement work.** All five numbered blockers are held
by artifacts on disk today; what remains is *transcription*, plus the one genuinely closed door
(names). A defensible re-score is **78**, capped below ~85 only by the name blocker and the
web-vs-Android provenance caveat.

- **Ready:** 38-branch AI enum with per-branch class; 495-NPC stat table (`lvl`/`hp`/`attack`/`defense`/
  `ai`/`scale`/elements); 647-row per-NPC moveset; 131-row loot table with drop chances; base
  level→stat rescale **and** the 11 class overrides; the elite/boss TTK back-solve; wave spawn x/y/qty/
  level-override geometry; nearest-on-screen targeting with a 24-frame (12 for elites) re-target tick
  and **no leash**; 12-frame universal hit-lockout; telegraph/active/recovery frame counts for all 19
  animation sets; full arrow ballistics; 38 projectile classes; elite-only `(N)` nameplate + 60 px
  health bar at y −120.
- **Blockers:** ① **all NPC names** — `shs3_en.xml` is server-side and dead; the only live path is
  re-extracting `118_Mobile_Lang_EN.bin` from the Android package. ② confirm the Android AS3 matches
  web v0.717 (needs a byte-check, not a survey).
- **Surface:** the elite TTK rubber-band (`hitsToKillBoss = 10 + lvldiff`) means **boss HP is not a
  constant** — any config that hard-codes boss HP is modelling the wrong system.
