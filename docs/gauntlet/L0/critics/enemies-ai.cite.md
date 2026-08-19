# CITE-LENS REVIEW — unit `enemies-ai`

Reviewer: blind critic, LENS 1 (over-claiming / cite resolution).
Every verdict below was reached by opening the artifact myself. Frames were cropped
and upscaled before grading (crop stated per claim).

**Headline: this is an unusually well-cited survey.** 15 of 20 line-level cites resolve
byte-exactly, and four independently-derivable counts (471 anims, 403 hp rows, the ai
histogram, the wave/x/lvl/fatal counts) reproduce to the digit when recomputed from
scratch. Two claims are REFUTED — both for a false *actionable conclusion*, not a bad
cite. Three carry material corrections.

---

## REFUTED

### R1 — `enemies-ai/stagger-is-a-counter-not-an-anim` (MATERIAL)
Claim: *"there is NO stagger/flinch/gothit animation … the ledger asked for a mechanic
the source does not implement."*

**False.** A full flinch system exists and is wired to NPCs:

- `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin` →
  `<anim i="flinch" d="8">` and `<anim i="flinch_weapon" d="8">` (25 anims in this blob).
- `reference/decompiled/shs3_android/scripts/MCSActor.as:170,172,922` →
  `FLINCH_WEAPON:String = "flinch_weapon"` · `FLINCH:String = "flinch"` ·
  `FLINCH_STATE:int = 28`.
- `reference/decompiled/shs3_android/scripts/NPC.as:747-758` →
  ```
  public function doFlinch() : * {
     if(actionState == FLINCH_STATE || actionState == SLASH_STATE) { return; }
     this.prevActionState = actionState; this.prevAnim = mcs.animation;
     this.prevFrameCounter = mcs.frameCounter;
     actionState = FLINCH_STATE; startAnim(FLINCH_WEAPON); }
  ```
  plus `endFlinch()` which restores `prevActionState` / `prevAnim` / `prevFrameCounter`.

The surveyor searched only blob 99 (`HumanAnimationData`, 158 names). `flinch` lives in
blob 94 (`Human2AnimationData`). **Stagger is 8 frames, interruptible, state-preserving —
it is a CONTRACT-grade number the survey threw away.**

What survives: `gotHitCounter = 12` at `NPC.as:462` and `canHit(){ return gotHitCounter == 0 }`
at `NPC.as:296-299` — both verbatim-correct, and `canHit()` is the gate on 11 hit tests in
`NPCManager.as`. So the 12-frame lockout is held; the "no stagger anim" conclusion is not.

### R2 — `enemies-ai/combat-hud-drops-the-nameplate` (MATERIAL)
Claim: *"in active combat every hostile shows only a bare thin HP bar with no name, no
level and no numerals"*; lane_impact: *"A recreation that shows names+levels during
combat is wrong."*

**The frame observation is HELD — I re-cropped it and it is exactly as described.**
`reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg` (source is 1024×576, not
1080p), crops (560,300)→(1024,500) and (250,300)→(620,500), LANCZOS ×3: five thin
horizontal bars (four green, one dim tan at far right) over five hostiles, zero
nameplates, gold `GUEST` over the player only, `16/20` green / `15/15` blue /
`CANNOT CHANGE STANCE` / `AUTO SLASH OFF`.

**The generalisation is false.** Elites and guardians carry a white `NAME (lvl)`
nameplate in combat, set at spawn:

- `EnemyElite.as:114` → `mcs.setDisplayName(xml.name + " (" + level + ")",16777215);`
  (`16777215` = `0xFFFFFF`), also `EnemyElite.as:26` inside `setLevel`.
- `EnemyKanjiGuardian.as:59` → same, `0xFFFFFF`.
- `EnemyPlayer.as:776` → `setDisplayName(xml.name + " (" + level + ")", namecolor)`,
  `namecolor` = `16777215` or `10027008` (`EnemyPlayer.as:771,774`).

`ai` 29 (`EnemyElite`) appears on 10 npcdata rows and 36 (`EnemyKanjiGuardian`) on 1 —
these spawn through `NPCManager.createNPC` like any wave enemy.

**The real mechanism is not a mode switch — it is two spawner wrappers**, which is a
better finding than the one claimed (see N2).

---

## HELD, with material corrections

### C1 — `enemies-ai/level-stat-formula` — cite is byte-exact; the universal is not
`NPC.as:239-260` resolves exactly (`setLevel` opens at 239, `if(lvl <= 10)` at 253,
`xp = lvl * 2 + 20` at 252). Blocker ① is genuinely dead.

But **11 classes override `setLevel`** (`grep -l "override public function setLevel"` →
EnemyElite, EnemyOgre, EnemySpearElite, EnemyStag, EnemyPlayer, EnemyKanjiGuardian,
EnemyTrainingDummy, EnemyWolfAlpha, FriendlyElite, FriendlySpearElite, FriendlyArcher),
so `NPC.setLevel()` is the **trash-mob** formula, not *the* formula:

- `EnemyOgre.as:51-53` → `override public function setLevel(lvl:int) : * { }` — **empty.**
  The Ogre ignores level entirely. That is why npcdata:2064 (id 77, lvl **80**, hp **40**,
  attack 2000) is not a typo.
- `EnemyKanjiGuardian.as:48-59` / `EnemyElite.as:23-40` / `EnemyWolfAlpha.as:52+` →
  `factor = lvl/level` with **no ×0.9, no ≤10 clamp**, and `xp = lvl * 5 + 45`, followed by
  a player-relative `hitsToKillBoss` re-derivation.

A rebuild that ships only `NPC.setLevel()` clamps every boss under level 11 to 1/1/1 HP.

### C2 — `enemies-ai/telegraph-active-recovery-frames` — 471 confirmed; "every … three parts" is false
I recomputed independently: 18 `*AnimationData.bin` blobs, **471** `<anim … d="…">`,
blob 99 = **158**. Every duration quoted checks out verbatim
(`heavyhorizontalslash_parta` 6 / `_partb` 9 `l="1"` / `_partc` 7 · `balanced…` 4/9/7 ·
`lighthorizontalslash` 3 · `katanaattack` 10 · `stabattack` 14 · `downstab` 15 ·
`ninjaslash` 8 · `pullbackarrow` 9 · `pullbackarrow_full` 15 · `firearrow` 1 ·
`arrownormalpose` 22 · `gotlaunchedupwards_parta/b/c` 4/9/7 · `gotlauncheddowned` 18 ·
`downedup` 4 · `downedup2` 25 · `deathdowned` 7).

But the claim's own quote refutes its own universal: **`lighthorizontalslash` is a single
3-frame anim with no parts at all**, and the jump slashes ship **five** parts
(`balancedjumpslash_parta…parte`, `heavyjumpslash_parta…parte`,
`lightjumpslash_parta/b/c` = three). The part-count is per-move, not a fixed 3. A light
horizontal slash therefore has **no telegraph phase whatsoever** — which is the actual
mechanical reason light stance feels instant.

### C3 — `enemies-ai/nameplate-level-4-bandit` — frame HELD; crop and framing wrong
Re-cropped `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg` at the stated
(340,320)→(900,480) ×3 LANCZOS: red all-caps `BANDIT (4)`, right label two overlapping
copies, kasa-hatted hostiles. **Confirmed.** Three corrections:

1. The stated crop does **not** contain the gold `GUEST` label or the
   `TERRITORY (22,51) / SECTOR (1,2)` readout — both are outside it. They are in the full
   frame (I opened it). Attributing them to the crop is a §0 hygiene break.
2. `x≈430` for the player is a 2×-upscale coordinate. In the source 1024-wide frame the
   `GUEST` label sits at **x≈185–230**.
3. "the frame wins over npcdata" is **inapt** — there is no doc-vs-frame conflict here.
   `npcdata.xml:276 <lvl>10</lvl>` is the archetype base; the *placement* level comes from
   the room-object property string (`Obj_NPCAggro.as:36 this.lvl = strArray[1];`) and is
   carried to `NPCManager … actor.setLevel(lvl)` (`NPCManager.as:879,895,910,934`). Both
   numbers are correct at different layers. The STANDING INVARIANT should not be spent here.
   The "on-screen HP of 1" is an **inference** — no HP bar is visible on those bandits at
   all (see N2).

---

## HELD — verified line-by-line, no correction

| claim | what I opened | result |
|---|---|---|
| `per-enemy-hp` | `npcdata.xml:3121-3128` (`<npc>`3121, `<hp>1000</hp>`3125) + recomputed histogram | exact; hp 403 rows, top `1×42, 15×32, 30×26, 10×23, 40×19, 20×13, 150×11` reproduces to the digit |
| `ai-id-to-class-map` | `NPCManager.as:516-634` | `switch(xml.ai)` opens at 516; 38 `case` labels; see C4 for the class count |
| `one-statline-six-movesets` | `npcdata.xml:274-280, 315, 352, 389, 426, 463` | every line resolves; ai = 1,2,3,4,5,9 exactly as claimed |
| `engagement-ranges` | all 19 cited `file:line`s | **all 19 resolve to the quoted comparison.** One transcription flip: `EnemySpear.as:192` is `mcs.x - playerX < 400`, the `playerX - mcs.x` form is line 204 — both exist. `aiCounterMax=12` confirmed in EnemyElite/FriendlyElite/EnemyPlayer **and MCSPlayer.as:165** |
| `spawn-geometry` | `questdata.xml:77-88` + `NPCManager.as:300,374-412` + index recount | exact. My recount from `questdata.json`: `<x>` 97+49+2+12 = **160** (−400..2000); `<lvl>` 142+9+2+18 = **171** (1..80); `<fatal>` 16+59 = **75**; enemy 151+18 = **169**, friend 70, neutral 2. Every figure matches |
| `arrow-arc-physics` | `EnemyArcher.as:271-301`, `Projectile.as:8,22`, `ArrowProjectile.as:51-56`, `EnemyGoblinThrower.as:550-565` | verbatim. GRAVITY 3, ttlMax 48, `57.2727+180`, `Math.random()*8-4`, muzzle `y-60`, knockdown 1/2 · 1/3 · 1/4 gates. Rock solve is character-identical |
| `undead-rule-is-not-reflect` | `EnemyZombie.as:493-518`, `NPC.as:451-453`, `EnemyJiangSi.as:308-311`, `grep -ril reflect` | `grep -ril "reflect"` over the whole android tree (recursive) → **0 files**. `if(!behead){ damage /= 2; }` at 516-518; base `if(behead){ damage *= 1.5; }` at 451-453; JiangSi ×1.5 with no halving at 308-311. The blocker's premise is dead |
| `shipped-config-hp150-is-stale` | ran `npx vitest run tests/config-values.test.ts tests/enemyModel.test.ts` | `Test Files 2 passed (2) / Tests 71 passed (71)` (57+14). `ENEMY_BASE.hp: 1` asserted at `tests/config-values.test.ts:466-474`. `git log -S"hp: 150" -- src/config/combat-sim.ts` → `335e615 2026-07-26` |
| `boss-names-are-procgen` | decoded all three name blobs; `NameGenerator.as:96-103`; greps | Samurai family **36** entries (Hachisuka idx 6, Honda idx 10); male **398** (Kano idx 79); female **291** (Shizuka idx 225). `getSamuraiName` = `family + " " + (male|female)`. `Zabuza`, `Hotaru`, `"Hachisuka Kano"`, `"Honda Shizuka"` → **0** in payload.xml, strings.json and all 970 android `.as`. Cite nit: the quoted `this.name = NameGenerator…getSamuraiName` is at `XMLNpc.as:529`, not 527 |
| `tengu-is-not-in-the-payload` | greps + `NPCManager.as:628` + `npcdata.xml:4111-4116` | tengu = 0 in npcdata / itemdata / questdata / skilldata / ui_strings / payload.xml **and 0 files across the android tree**. Guardian: id 802, name 5119 → `"Guardian"` in `resolved_names.json`, lvl 10 hp 30 ai 36 |
| `creature-and-boss-roster` | `npcdata.xml:1844, 2064, 2395, 3442, 3842, 4072, 4111, 3121` + `:492, :535` | every block resolves: 67 lvl15/hp100/ai11 · 77 lvl80/hp40/ai23 · 89 lvl30/hp150/ai26 · 165 lvl10/hp200/ai37 · 186 lvl30/hp600/ai37 · 800 lvl23/hp800/ai35 = "Mad Cultist" · 802 = "Guardian" · 144 lvl80/hp1000 = "Hiroshi". Skills 96 blocks / 647 rows / ids 1000-1501 / lvl {1,2,3,5,10} — all match the index. `hammer`/`club` → 0 files. Nit: **36** `*Projectile.as`, not 39 |
| `no-squad-coordination` | `NPCManager.as:1360-1394` | `getNearestEnemy` opens at 1360; quote verbatim; no shared table |
| `no-per-enemy-chi-or-speed` | `grep -c "<chi>\|<speed>" npcdata.xml` → **0**; `XMLNpc.as:151-158, 174-181` | exact. Defaults chi 1 / speed 1 / hp 1 / attack 1 / defense 0 confirmed |
| `kill-rewards-close-two-economy-blockers` | `npcdata.xml:38-44`, `NPC.as:218, 799-855, 166-190, 94-105, 112-124` | every offset lands on the quoted code. Index confirms 66 `<reward>` / 131 `<loot>` / chance domain `{0.05,0.1,0.3,0.4,0.5,1}`. `calcXP` at 166, `getGreyLevel` at 94, `getZeroDifference` at 112 — verbatim |
| `web-build-parity` | `StatsManager.as:30` + per-bundle `find` | `clientVersion:Number = 0.682` **is** at line 30. Web `shs3_payload` = 1079 `.as`, **0** `Enemy*`/`NPC*`; android = 37. `shs3_stage2/3`, `shs3_loader`, `shs3_bin` also 0. **Correctly graded STILL_UNHELD** — this is the right call and the right residual risk |

### C4 — `ai-id-to-class-map` count nit (MINOR)
"34 named Enemy* classes plus 3 Friendly*" is wrong under either reading. Measured over
`NPCManager.as:516-634`: **38 cases → 35 distinct classes = 32 distinct `Enemy*` + 3
`Friendly*`** (`EnemyPlayer` appears at cases 0/9/14, `EnemySpearElite` at 28/37). The
"34" looks borrowed from the *34 distinct `<ai>` values in npcdata* — which is separately
correct and which I reproduced exactly: `1×56 2×48 3×52 4×47 5×48 6×3 7×6 8×2 9×73 11×1
12×1 13×1 14×15 17..25×1 26×8 27×1 28×24 29×10 30×8 31×1 32×2 33×2 34×3 35×1 36×1 37×2`,
425 rows. The structural claim (ai is a class index, not a difficulty tier; `AI_TIERS`
easy|normal|hard at `src/config/ai.ts:29` is the wrong shape) is fully HELD.

---

## NEW FINDINGS (missed by the surveyor)

- **N1 — the flinch/stagger contract.** See R1. `flinch`/`flinch_weapon` d=**8**,
  `FLINCH_STATE = 28`, `NPC.doFlinch()`/`endFlinch()` save-and-restore the interrupted
  animation frame counter. A2, `94_MCSCharacter_Human2AnimationData.bin` + `MCSActor.as:170,172,922` + `NPC.as:747-763`.
- **N2 — nameplate vs health bar is a SPAWNER split with exact hex colours.** A2:
  `Obj_NPCAggro.as:73` calls `hideHealthBar()` then `:80` sets
  `npcname + " (" + lvl + ")"` in `10027008` = **`0x990000`**. `MCSPlayer.as:245` sets the
  player's bare `charname` in `16763904` = **`0xFFCC00`** (no level). Friendlies
  (`FriendlyArcher.as:57`, `FriendlySpearElite.as:55`, `FriendlyElite.as:64`) also
  `0xFFCC00`, name only. Elites/guardians/duel opponents `0xFFFFFF`. Procgen townsfolk
  `Obj_NPCProcGen.as:51` `39423` = `0x0099FF`, `:60` `12627019` = `0xC0AC4B`.
  `MCSCharacter.as:1533` shows `setDisplayName("")` hides the plate, and it anchors to
  `healthBar.y` when the bar is visible. **Both frames corroborate exactly**: seg-10
  overworld = red plates, zero HP bars; seg-11 combat = HP bars, zero plates.
- **N3 — `EnemyOgre.setLevel()` is empty**, and 11 classes override `setLevel` with a
  no-clamp `xp = lvl*5 + 45` boss curve. See C1.
- **N4 — light stance has no telegraph.** `lighthorizontalslash` is one 3-frame anim; jump
  slashes are five parts. See C2.

---

## Score comment
78 is defensible but the *reasons* for the cap are partly wrong. Bullet (4) of the
rationale — "the 12-frame hit-lockout is a counter with no stagger animation and wants
frame-side confirmation" — is refuted: the stagger animation exists at 8 frames. That cap
reason should be replaced by the real one: **11 `setLevel` overrides and a boss XP curve
the survey did not model**, plus the light-stance part-count exception. Bullets (1)
(v0.682-vs-v0.717 parity), (2) (Tengu absent) and (3) (38 behaviours unwritten) all hold
under my own checks.
