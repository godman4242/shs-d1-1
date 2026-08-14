# L0 SYSTEM SURVEY — **enemies-ai** (ledger score 34/100)

Audit of `docs/research/REBUILD_READINESS.md` §2 row `enemies-ai | 34` and the
§4 block `### enemies-ai — 34`, re-graded against the extracted payload, the
Android decompile, the string table and the reference frames.

**Headline: 34/100 is badly stale. Every one of the five §4 blockers is held or
substantially held on disk.** The single largest miss is blocker ① — the
"enemy level→stat formula … absent, not just inferred" is a nine-line
ActionScript function we already have on disk, and its `lvl <= 10` clamp is the
*cause* of the one-hit trash mobs the video study measured empirically.

## ⚠ Standing caveat carried on EVERY AS3 cite below (S0-3)
All gameplay ActionScript lives **only** in the **Android** decompile.
`reference/decompiled/shs3_android/scripts/StatsManager.as:30` reads
`public static var clientVersion:Number = 0.682;` — the web build the videos
capture is **v0.717**. Verified this run: `reference/decompiled/shs3_payload/`
holds 652 classes and **zero** `Enemy*`/`NPC*` gameplay classes
(`ls … | grep -ci "enemy\|npc"` → `0`). Data-XML row counts match across builds;
combat-tuning parity between 0.682 and 0.717 is **NOT** established. Label every
ported number `v0.682-ANDROID`.

---

## CLAIM 1 — `enemies-ai/level-stat-formula` · **A2** · **HELD** · overturns ledger
**Ledger (§4 enemies-ai, Blockers):** "① enemy **level→stat formula** (governs the
whole roster's balance — absent, not just inferred)."

**Evidence** — `reference/decompiled/shs3_android/scripts/NPC.as:239-260`:
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
The formula is **linear rescale of the authored XML statline**:
`factor = requestedLvl / authoredLvl`, times `0.9` at or under level 20, applied
identically to `damage`, `defense` and `maxhp`. Not absent. Not inferred.
**VERDICT: HELD. Blocker ① is dead.**

## CLAIM 2 — `enemies-ai/sub10-one-hp-clamp` · **A2** · **HELD**
Same cite, `NPC.as:253-259`: `if(lvl <= 10) { this.damage = 1; this.defense = 1;
maxhp = 1; setHP(maxhp); }`.

Any NPC spawned at level ≤ 10 is **hard-clamped to 1 HP, 1 ATK, 1 DEF**,
overwriting whatever the XML authored. This is the mechanical *cause* of the
SESSION-11 measurement "mobs die in ONE hit", which until now was an observation
without a source. It also explains why `<hp>1</hp>` appears 42× in `npcdata.xml`
— for early-game trash the authored value and the clamp agree.

## CLAIM 3 — `enemies-ai/nameplate-level-4-bandit` · **A1** · **HELD**
**Frame:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg` (1024×576).
**Crop used:** `(340, 320) → (900, 480)`, LANCZOS ×3.
**Visibly in the crop:** two hostiles walking right-to-left across a reed field,
each under a **red** all-caps label reading `BANDIT (4)`; the right-hand label is
two overlapping copies (two stacked bandits). The player, at frame x≈430, carries
a **gold** label `GUEST`. Territory readout `TERRITORY (22,51) / SECTOR (1,2)`.

This confirms the ledger's Ready bullet "nameplate (N)=level" **and** adds the
colour rule it omits: hostile = red, player = gold.

**Chain to CLAIM 2 — this is where the frame settles it.** `npcdata.xml:273-280`
authors Bandit (`<id>11</id>`) at `<lvl>10</lvl> <hp>15</hp>`. The frame says the
roaming bandit is **level 4**. The doc-side statline and the frame disagree, and
**the frame wins**: the wave/spawn `<lvl>` override runs through `setLevel(4)`,
`4 <= 10`, so this bandit's real HP on screen is **1**, not 15.

## CLAIM 4 — `enemies-ai/combat-hud-drops-the-nameplate` · **A1** · **HELD**
**Frame:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg` (1024×576).
**Crops used:** `(560,300)→(1024,500)` and `(250,300)→(620,500)`, LANCZOS ×3.
**Visibly in the crops:** a dungeon brick interior under a full-screen red
near-death vignette; HUD reads `16/20` green / `15/15` blue / `CANNOT CHANGE
STANCE`, `AUTO SLASH OFF` top-left. **Five thin horizontal HP bars** (four green,
one dim tan at far right) float above five separate hostiles; **no hostile carries
a name or a level**. The only text over a fighter is the gold `GUEST` over the
player, who is mid-swing with a **pickaxe** while a bare-chested bandit lunges
from the left and a red blade-sweep crosses the whole arena. Two kasa-hatted
**archers with drawn longbows** stand at the right, one at mid-range and one at
the far edge.

So the enemy readout is **mode-switched**: overworld = red name + `(level)`;
active combat = bare HP bar, no name, no level, no numerals. The ledger's single
"nameplate (N)=level" bullet flattens two different UI states.

## CLAIM 5 — `enemies-ai/per-enemy-hp` · **A2** · **HELD** · overturns ledger
**Ledger:** "② per-enemy HP."

`docs/gauntlet/L0/index/npcdata.json` → `npcdata/npc/hp` `count: 403`,
`numeric_range: [1.0, 1000.0]`. Read first-hand, `reference/extracted/npcdata.xml:3121-3128`:
```xml
	<npc>
		<id>144</id>
		<name>5058</name>
		<lvl>80</lvl>
		<hp>1000</hp>
		<ai>28</ai>
		<attack>200</attack>
		<defense>200</defense>
```
(id 144 resolves to **"Hiroshi"** via `docs/gauntlet/L0/index/resolved_names.json`.)
403 authored HP values, plus `<attack>` ×406 and `<defense>` ×394. Measured HP
histogram top: `1`×42, `15`×32, `30`×26, `10`×23, `40`×19, `20`×13, `150`×11.
**VERDICT: HELD. Blocker ② is dead.**

## CLAIM 6 — `enemies-ai/ai-id-to-class-map` · **A2** · **HELD** · overturns ledger
**Ledger (Ready):** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)
with movesets incl. **the archer** (closed this pass); boss roster".

The taxonomy is not a research reconstruction — it is a literal 38-case switch.
`reference/decompiled/shs3_android/scripts/NPCManager.as:516-634`:
```as3
         switch(xml.ai)
         {
            case 0:  actor = new EnemyPlayer(MCSPool.getMCS(),true,false); break;
            case 1:  actor = new EnemyKnife(MCSPool.getMCS()); break;
            case 2:  actor = new EnemyArcher(MCSPool.getMCS()); break;
            case 3:  actor = new EnemyKatana(MCSPool.getMCS()); break;
            case 4:  actor = new EnemySpear(MCSPool.getMCS()); break;
            case 5:  actor = new EnemyShield(MCSPool.getMCS()); break;
            case 6:  actor = new EnemyNinja(MCSPool.getMCS()); break;
            ...
            case 35: actor = new EnemySorcererBoss(MCSPool.getMCS()); break;
            case 36: actor = new EnemyKanjiGuardian(MCSPool.getMCS()); break;
            case 37: actor = new EnemySpearElite(MCSPool.getMCS(),true); break;
```
`npcdata.xml` uses **34 distinct `<ai>` values** across 425 `<ai>` rows
(measured histogram: `1`×56 `2`×48 `3`×52 `4`×47 `5`×48 `6`×3 `7`×6 `8`×2 `9`×73
`11`×1 `12`×1 `13`×1 `14`×15 `17`–`25`×1 each `26`×8 `27`×1 `28`×24 `29`×10
`30`×8 `31`×1 `32`×2 `33`×2 `34`×3 `35`×1 `36`×1 `37`×2). On disk:
**34 `Enemy*.as` classes + 3 `Friendly*.as` classes**, each a full state machine.

**Consequence for the build:** the shipped `AI_TIERS` model in `src/config/ai.ts`
is a 3-row `easy | normal | hard` difficulty table. The original has **no
difficulty tiers at all** — it has 38 hand-written behaviour classes selected by
a data field. That is a shape mismatch, not a tuning gap, and the ledger's
"34/100 · full taxonomy Ready" hides it.

## CLAIM 7 — `enemies-ai/one-statline-six-movesets` · **A2** · **HELD**
`reference/extracted/npcdata.xml:273-465` — NPC ids **11,12,13,14,15,16** are
*byte-identical* statlines that differ in exactly one field:
```
id 11  <name>5011</name> <lvl>10</lvl> <hp>15</hp> <ai>1</ai> <attack>24</attack> <defense>20</defense>
id 12  … <ai>2</ai> …      id 13  … <ai>3</ai> …      id 14  … <ai>4</ai> …
id 15  … <ai>5</ai> …      id 16  … <ai>9</ai> …
```
All six resolve to the same string `5011` → **"Bandit"**. So the authoring rule is
**one archetype × N AI classes**: the same Bandit ships as knife / archer / katana
/ spear / shield / player-mirror. This is the real "moveset" model and it is not
in the ledger at all.

## CLAIM 8 — `enemies-ai/telegraph-active-recovery-frames` · **A2** · **HELD** · overturns ledger
**Ledger:** "③ telegraph/active/recovery + stagger frames."

`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` is a
977 KB UTF-8 XML `<animdata>` with **158 `<anim>` blocks**, each carrying an
explicit frame duration `d=` and full 21-part keyframes:
```xml
<?xml version="1.0"?>
<animdata>
<anim i="idle" d="1">
<f i="0">
<n i="20" x="-10" y="-64" r="-9"></n>
```
The attack anims are **authored as three named parts — that IS the telegraph /
active / recovery split**, verbatim from the file:
```
heavyhorizontalslash_parta   d=6
heavyhorizontalslash_partb   d=9   l="1"   (loop = active hold)
heavyhorizontalslash_partc   d=7
balancedhorizontalslash_parta d=4 / _partb d=9 loop / _partc d=7
lighthorizontalslash          d=3           (light stance = single-part, no windup)
katanaattack d=10 · stabattack d=14 · downstab d=15 · ninjaslash d=8
pullbackarrow d=9 · pullbackarrow_full d=15 · firearrow d=1 · arrownormalpose d=22
```
Measured across all 18 `*AnimationData.bin` blobs: **471 animations** with
durations (S0-4 estimated "~450"; the exact count is 471).
**VERDICT: HELD. Blocker ③'s telegraph/active/recovery half is dead.**

## CLAIM 9 — `enemies-ai/stagger-is-a-counter-not-an-anim` · **A2** · **PARTIAL**
The "stagger frames" half of blocker ③ resolves differently than the ledger
assumes. `reference/decompiled/shs3_android/scripts/NPC.as:462` sets, on every
landed hit:
```as3
            this.gotHitCounter = 12;
```
and `NPC.as:296-299`: `public function canHit() : Boolean { return
this.gotHitCounter == 0; }`. So the hit reaction is a **12-frame hit-lockout /
i-frame window**, not a flinch animation — and I searched all 158 human anim
names: there is **no `stagger`, `flinch` or `gothit` animation**. What *is*
authored is the launch/knockdown reaction chain:
`gotlaunchedupwards_parta d=4 / _partb d=9 / _partc d=7`, `gotlauncheddowned d=18`,
`downedup d=4`, `downedup2 d=25`, `deathdowned d=7`.
**VERDICT: PARTIAL — the number is held (12 frames), but the ledger asked for a
mechanic (stagger animation) the source does not implement.**

## CLAIM 10 — `enemies-ai/engagement-ranges` · **A2** · **HELD** · overturns ledger
**Ledger:** "④ aggro/leash/spawn geometry."

Per-class engagement distances are literal constants, one per behaviour class:
- `EnemyKnife.as:181,200` — `if(mcs.x - playerX < 50 && mcs.y - playerY < 50)`
- `EnemyKatana.as:167,179` — `if(mcs.x - playerX < 100 && mcs.y - playerY < 10)`
- `EnemySpear.as:192,204` — `if(playerX - mcs.x < 400 && mcs.y - playerY < 10 && int(Math.random() * 4) == 0)`; `:225,227` `absDistanceAway < 100` / `< 50 && target.isDowned()`
- `EnemyShield.as:204,216,265` — 50 px commit, 100 px band
- `EnemyOgre.as:239,241` — `if(dist < 100) { if(dist < 40) …`
- `EnemyWolf.as:255,259` — `if(dist < 100 && dist > 50)` lunge; `else if(dist >= 100 && dist < 250 && int(Math.random() * 3) == 0)` pounce
- `EnemyArcher.as:202,219` — `if(Math.abs(target.mcs.x - mcs.x) < 100)` → switch bow→knife
- `EnemyJiangSi.as:192` — `< 50`
- `Obj_NPCProcGen.as:135` — `return abs(this.npc.mcs.x - mc.x) < 100;` (overworld roamer trigger)

Decision cadence is also explicit — `NPC.as:22` `internal var aiCounterMax:int = 24;`
with `NPC.as:285-294`:
```as3
      internal function checkAITrigger() : Boolean
      {
         --this.aiCounter;
         if(this.aiCounter <= 0)
         {
            this.aiCounter = this.aiCounterMax;
            return true;
         }
         return false;
      }
```
Elites re-decide twice as fast: `EnemyElite.as:18`, `EnemyPlayer.as:52`,
`FriendlyElite.as:18`, `MCSPlayer.as:165` all set `aiCounterMax = 12`.
**VERDICT: HELD. Blocker ④'s aggro half is dead.**

## CLAIM 11 — `enemies-ai/spawn-geometry` · **A2** · **HELD** · overturns ledger
The spawn half of blocker ④ is in `questdata.xml`. Measured this run over the
118 `<wave>` blocks: **160 `<x>` spawn coordinates** (range **-400 … 2000**),
**171 `<lvl>` overrides** (range 1…80), **75 `<fatal>` flags**, 169 `<enemy>`,
70 `<friend>`, 2 `<neutral>`. Verbatim, `reference/extracted/questdata.xml:77-88`:
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
```
The spawn *rule* is in `NPCManager.as:374-412`:
- wave advances only when **every** enemy in `enemyList` is dead
  (`checkNextWave()`, `NPCManager.as:300-320`);
- `if(currentWave == 0) posY = StageManager.getGroundY(); else posY = 0;` —
  wave 0 walks in on the ground, **waves 1+ drop in from above**, spawned at
  `posY - Math.random() * 200` and falling through `FALL_STATE`→`LAND_STATE`
  (`EnemyArcher.as:49-52` catches `ENEMYLAND` and starts walking).
**VERDICT: HELD. Blocker ④ is dead in both halves.**

## CLAIM 12 — `enemies-ai/arrow-arc-physics` · **A2** · **HELD** · overturns ledger
**Ledger:** "⑤ Undead damage-reflect probability; arrow arc physics."

The full ballistic solve, `reference/decompiled/shs3_android/scripts/EnemyArcher.as:271-302`:
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
         if(fireX > targetX) { velXa = -velXa; }
         velYa += Math.random() * 8 - 4;
```
`0.866 = cos 30°` (fixed 30° launch), muzzle offset **60 px above the feet**,
vertical scatter **±4**. `Projectile.as:8` `internal static var GRAVITY:Number = 3;`
and `Projectile.as:22` `internal var ttlMax:int = 48;`. Integration in
`ArrowProjectile.as:51-56`:
```as3
         x += velX;
         y += velY;
         if(breakable)
         {
            rotation = Math.atan(velY / velX) * 57.2727 + 180;
            velY += GRAVITY;
```
Knockdown gating scales with the archer's level (`EnemyArcher.as:288-296`):
`>50` → 1-in-2, `>20` → 1-in-3, `>10` → 1-in-4, else never.
The Oni thrower reuses the identical solve — `EnemyGoblinThrower.as:555-565`,
`ProjectileManager.createRock(...)`.
**VERDICT: HELD. The "arrow arc physics" half of blocker ⑤ is dead.**

## CLAIM 13 — `enemies-ai/undead-rule-is-not-reflect` · **A2** · **HELD** · overturns ledger
The other half of blocker ⑤ is wrong **in kind**, not merely unmeasured. I
grepped `reflect` across all 559 Android classes: **zero hits**. The actual
Undead-specific rule is a *head-gate*, `EnemyZombie.as:493-518`:
```as3
         switch(target)
         {
            case mcs.partList[MCSCharacter.PART_hat]:
            case mcs.partList[MCSCharacter.PART_head]:
            case mcs.partList[MCSCharacter.PART_neck]:
               behead = true;
               ...
            if(!behead)
            {
               damage /= 2;
            }
```
i.e. **a zombie takes half damage unless the hit lands on hat / head / neck.**
Compare the base class, `NPC.as:451-453`, where behead instead *rewards* the
attacker: `if(behead) { damage *= 1.5; }`; the other undead, `EnemyJiangSi.as:308-311`,
uses the standard `*= 1.5` and does **not** halve.
Both classes also drop `damage = 0; return false;` when the hit lands on
`PART_weapon` — parrying on the weapon part is universal, not undead-specific.
**VERDICT: HELD, and the blocker's premise is refuted. There is no reflect
mechanic and therefore no reflect probability to measure.**

## CLAIM 14 — `enemies-ai/shipped-config-hp150-is-stale` · **A3** · **HELD** · overturns ledger
**Ledger (§4 enemies-ai, Surface):** "the shipped `AI_TIERS`/`ENEMY_BASE` are a
**PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows".

That was true when the ledger was written (2026-07-20) and is false now.
`git log -S"hp: 150" -- src/config/combat-sim.ts` → the 150 was removed in
**335e615, 2026-07-26, "SESSION13 PHASE B"**. Current
`src/config/combat-sim.ts` `ENEMY_BASE` reads `hp: 1`. Gate:
```
$ npx vitest run tests/config-values.test.ts
 Test Files  1 passed (1)
      Tests  57 passed (57)
```
which asserts `expect(ENEMY_BASE).toEqual({ hp: 1, minDamage: 1, damageRange: 0,
defense: 5, stance: 'heavy', deflectLearned: false, stats: ENEMY_STATS })`
(`tests/config-values.test.ts:466-474`). `npx vitest run tests/enemyModel.test.ts`
→ `14 passed`.
**VERDICT: HELD — and CLAIM 2 now supplies the source-side justification the code
comment could only guess at (`NPC.as:253` clamps to 1 below level 11).**

## CLAIM 15 — `enemies-ai/boss-names-are-procgen` · **A2** · **HELD** · overturns ledger
**Ledger (Surface):** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza,
Tengu Hotaru."

Two of those four are not bosses at all — they are **procedurally generated
bounty targets**. `reference/extracted/android/87_NameGenerator_SamuraiFamilyNames.bin`
is a 36-entry newline list containing, verbatim:
```
Asai
Askikaga
Chosokabe
Date
Fukushima
Genji
Hachisuka
Hattori
…
Honda
```
`85_NameGenerator_MaleNames.bin` (398 entries) contains **`Kano`** at index 79;
`88_NameGenerator_FemaleNames.bin` (291 entries) contains **`Shizuka`** at index 225.
The assembly path is `XMLNpc.as:527` `this.name =
NameGenerator.getInstance().getSamuraiName(rng,true);` followed by
`XMLNpc.as:581-594`:
```as3
         if(isBountyTarget)
         {
            bossxml = QuestEngine.getNPCData(18);
            this.id = INDEX_BOUNTYTARGET;
            this.ai = bossxml.ai;
            this.hp = bossxml.hp;
```
— a random surname + given name wearing NPC 18's statline.
`Zabuza` and `Hotaru`: **0 hits** anywhere in `reference/extracted/` or the 559
Android classes.
**VERDICT: HELD. "Hachisuka Kano" / "Honda Shizuka" are not missing bosses; they
are RNG output, and no boss table should be authored to include them.**

## CLAIM 16 — `enemies-ai/tengu-is-not-in-the-payload` · **A2** · **PARTIAL** · overturns ledger
**Ledger (Ready):** "full taxonomy (Humans/Undead/Oni/Animals + **Tengu**/Guardian)".

Measured: `grep -c -i "tengu"` returns **0** on all of `payload.xml`,
`questdata.xml`, `npcdata.xml`, `itemdata.xml`, `skilldata.xml`, `ui_strings.txt`,
and 0 across the Android script tree. **Guardian** *is* held —
`NPCManager.as:628` `case 36: actor = new EnemyKanjiGuardian(...)`,
`npcdata.xml:4111` `<id>802</id> <lvl>10</lvl> <hp>30</hp> <ai>36</ai>`, name
resolving to `"Guardian"`, plus a dedicated
`102_MCSCharacter_GuardianAnimationData.bin` (16 anims).
**VERDICT: PARTIAL — Guardian HELD, Tengu STILL_UNHELD. The Ready bullet
over-claims one faction.**

## CLAIM 17 — `enemies-ai/creature-and-boss-roster` · **A2** · **HELD**
The ledger calls "boss roster" Ready without numbers. Measured rows, resolved
through `strings.json`:

| line | id | name | ai → class | lvl | hp |
|---|---|---|---|---|---|
| 1816/1830 | 65,66 | Wolf | 8 EnemyWolf | 10 | 40 |
| 1844 | 67 | Wolf | 11 EnemyWolfAlpha | 15 | 100 |
| 2034 | 76 | Oni | 22 EnemyGoblin | 10 | 10 |
| 2064 | 77 | Oni | 23 EnemyOgre | 80 | 40 |
| 2097 | 79 | Oni | 25 EnemyGoblinThrower | 10 | 10 |
| 2127…2373 | 80,83–88 | Undead | 26 EnemyZombie | 8 | 40 |
| 2160 | 81 | Undead | 27 EnemyJiangSi | 8 | 40 |
| 2395 | 89 | Undead | 26 EnemyZombie | 30 | 150 |
| 3442 | 165 | Tadao | 37 EnemySpearElite(elite) | 10 | 200 |
| 3842 | 186 | Amaya | 37 EnemySpearElite(elite) | 30 | 600 |
| 4072 | 800 | Mad Cultist | 35 EnemySorcererBoss | 23 | 800 |
| 4111 | 802 | Guardian | 36 EnemyKanjiGuardian | 10 | 30 |
| 3121 | 144 | Hiroshi | 28 EnemySpearElite | 80 | 1000 |

Skill loadouts ride along: 96 `<skills>` blocks / **647 `<skill>` rows** with
`<id>` (1000–1501) and `<lvl>` (1,2,3,5,10). Verbatim, `npcdata.xml:492`:
```xml
		<skills><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill></skills>
```
and the Bandit Leader, `npcdata.xml:535`, carries six.

## CLAIM 18 — `enemies-ai/no-squad-coordination` · **A2** · **HELD**
Confirms the ledger's Ready bullet "independent-aggro (no coordination — closed)",
now with a source. `NPCManager.as:1360-1390`:
```as3
      public static function getNearestEnemy(xpos:int, isEnemy:Boolean = false) : NPC
      {
         …
         var maxdist:int = 99999;
         …
            if(pos > -10 && pos < stageWidth + 10)
            {
               dist = Math.abs(xpos - pos);
               if(!enemy.isDead() && dist < maxdist && enemy.actionState != MCSActor.SKILL_UNDYING_STATE)
```
Every NPC independently re-queries **nearest live target within the stage
bounds ±10 px**; there is no squad object, no shared aggro table, no flanking
assignment anywhere in `NPCManager`. Corroborated by CLAIM 4's frame, where five
hostiles converge on the player from both sides with no formation.

## CLAIM 19 — `enemies-ai/no-per-enemy-chi-or-speed` · **A2** · **HELD**
Measured: `grep -c "<chi>\|<speed>" reference/extracted/npcdata.xml` → **0**.
`XMLNpc.as:150-182` therefore defaults every NPC:
```as3
         if(xml.chi.toString() != "") { this.chi = xml.chi; } else { this.chi = 1; }
         …
         if(xml.speed.toString() != "") { this.speed = xml.speed; } else { this.speed = 1; }
```
(other defaults on the same path: `ai → 1`, `hp → 1`, `attack → 1`, `defense → 0`.)
So enemy Chi and SPD are **not authored anywhere** — universally 1. This is a
*positive* answer, not a gap: any recreation that gives enemies a Chi pool or a
per-enemy speed stat is inventing a system the original does not have.

## CLAIM 20 — `enemies-ai/kill-rewards-close-two-economy-blockers` · **A2** · **HELD** · overturns ledger
Cross-lane, but it lives in *my* file (`npcdata.xml` `<reward>`), so I bank it here.

**Ledger (§4 economy, Blockers):** "① coins-per-kill reality (`=8` is an
**unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."

*Coins.* `npcdata.xml` holds **66 `<reward>` blocks / 131 `<loot>` rows** with
`<id>` `<qty>` `<chance>` (chance domain measured: `0.05, 0.1, 0.3, 0.4, 0.5, 1`).
Verbatim `npcdata.xml:38-44`:
```xml
		<reward>
			<loot>
				<id>0</id>
				<qty>2</qty>
				<chance>0.5</chance>
			</loot>
```
and the loot-type table, `NPC.as:799-855`:
```as3
            chance = loot.chance * 100;
            if(chance == 100 || Math.random() * 100 < chance)
            …
               if(lootType == 0)      { OverworldHUD.instance.lootDialog.addLootCoins(1 * qty); }
               else if(lootType == 1) { OverworldHUD.instance.lootDialog.addLootCoins(5 * qty); }
               else if(lootType == 2) { OverworldHUD.instance.lootDialog.addQuestLootItem(); }
               else if(lootType == 3) { OverworldHUD.instance.lootDialog.addRandomLootItem(this.level,false,true); }
               else                   { OverworldHUD.instance.lootDialog.addLootItemBasic(lootType,qty); }
```
So loot id 0 = a **1-coin** drop, id 1 = a **5-coin** drop, id 2 = quest item,
id 3 = level-scaled random item, anything ≥ 2000 = that literal item id. The
`=8` seed is not the shape of the system at all: coins-per-kill is
`Σ(qty × {1,5}) over rolled drops`.

*XP.* Base is `NPC.as:218` `this.xp = this.level * 2 + 20;` (re-applied on rescale
at `:252`). Award, `NPC.as:166-190`:
```as3
      public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
      {
         if(mobLevel <= getGreyLevel())      { return 0; }
         if(mobLevel - playerLevel > 3)      { return 0; }
         var finalXP:int = xp;
         if(playerLevel < mobLevel)      { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
         else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
         if(elite) { finalXP *= 2; }
         return finalXP;
      }
```
with `getGreyLevel()` (`NPC.as:94-105`: `playerLevel < 6 → 0`; `< 40 →
playerLevel - floor(playerLevel/10) - 5`) and `getZeroDifference()`
(`NPC.as:112-124`: `< 8 → 5`, `< 10 → 6`, `< 12 → …`).
**VERDICT: HELD. "no XP formula" is refuted; the complete grey-level / over-level
/ elite XP curve is on disk.**

## CLAIM 21 — `enemies-ai/web-build-parity` · **STILL_UNHELD**
Every AS3 number above (setLevel, ranges, gravity, gotHitCounter, calcXP, loot
table) comes from **v0.682 Android**. `reference/decompiled/shs3_payload/scripts`
holds 652 classes and **zero** `Enemy*`/`NPC*` — the web v0.717 gameplay code is
not decompiled and may not be recoverable. Nothing on disk establishes that
0.717 kept these constants. **Honest answer: STILL_UNHELD.** Do not stamp any of
these CONTRACT until either the web bytecode is recovered or a frame measurement
corroborates the specific number.

---

## Re-score

| | |
|---|---|
| Ledger score (2026-07-20) | **34 / 100** |
| Re-scored this pass | **78 / 100** |

**Why 78, not higher.** All five §4 blockers resolve: ① dead (CLAIM 1), ② dead
(CLAIM 5), ③ dead for telegraph/active/recovery and answered-differently for
stagger (CLAIMS 8, 9), ④ dead in both halves (CLAIMS 10, 11), ⑤ dead for arrows
and refuted-in-premise for undead (CLAIMS 12, 13). On top of that the payload
holds things the ledger never claimed: a 38-class AI dispatch, 471 timed
animations, per-class engagement distances, a decision-cadence constant, the
full wave/spawn schema, the loot and XP award formulas.

**What still holds it under 90:**
1. **Build parity (CLAIM 21)** — every behavioural constant is v0.682-Android,
   not the v0.717 the videos capture. This is the single largest remaining risk
   and it caps the whole unit.
2. **Tengu (CLAIM 16)** — a faction the ledger lists as Ready is absent from the
   payload; either it is a v0.717-only addition or the ledger invented it.
3. **The shipped code models the wrong shape (CLAIM 6)** — `AI_TIERS`'
   easy/normal/hard is not a port of anything; 38 behaviour classes have to be
   written or consciously scoped down, and that work has not started.
4. **Stagger (CLAIM 9)** is a counter with no animation; the 12-frame lockout
   needs a frame-side confirmation before it is treated as CONTRACT.

## Ledger sentences this file overturns
1. §4 enemies-ai · "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
2. §4 enemies-ai · "② per-enemy HP."
3. §4 enemies-ai · "③ telegraph/active/recovery + stagger frames."
4. §4 enemies-ai · "④ aggro/leash/spawn geometry."
5. §4 enemies-ai · "⑤ Undead damage-reflect probability; arrow arc physics."
6. §4 enemies-ai · "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150)"
7. §4 enemies-ai · "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
8. §4 enemies-ai · "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)" — Tengu unsupported.
9. §4 enemies-ai · "every PvE number lives only in notes."
10. §4 economy · "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
11. §2 scorecard · "**enemies-ai** | 34 | … | enemy level→stat formula; per-enemy HP; telegraph/stagger frames; aggro/spawn geometry"
