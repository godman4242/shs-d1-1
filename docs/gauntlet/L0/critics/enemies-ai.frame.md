# L0 CRITIC — enemies-ai — LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning, only its output. Every verdict
below rests on an artifact **I** opened. Frames were cropped and upscaled before grading;
crops are stated.

**Headline:** the unit is unusually strong. 20 claims, 14 survive intact, 1 correctly
self-reports STILL_UNHELD. **5 are refuted** — one materially (a fabricated
frame-vs-doc conflict that misapplies the §0 "frame wins" invariant), one materially
(an over-generalised animation rule contradicted by the surveyor's own quote), three at
minor severity. No fabricated cites found: every file, line and number I checked existed
and said what was claimed. That is the important result.

Both A1 frames are real, both are 1024×576 (not 1080p — the fighter is ~140 px tall here,
so I upscaled ×3 on crops and ×2 on full frames).

---

## REFUTED — MATERIAL

### R1 · `enemies-ai/nameplate-level-4-bandit` — the "frame wins" invocation is manufactured, and the HP-1 chain is false

Two separate failures.

**(a) The stated crop does not contain two of its own observations.** I reproduced
`(340,320)→(900,480)` LANCZOS ×3 on `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg`
exactly. It contains the two kasa-hatted bandits and the red `BANDIT (4)` plates — and
nothing else the claim lists. The gold `GUEST` label sits at **x≈205** in 1024-space,
left of the crop's x0=340. `TERRITORY (22,51) / SECTOR (1,2)` sits at **y≈272–295**,
above the crop's y0=320. Both are true **of the frame** — I confirmed them at ×2 full-frame —
but neither is "visibly in the crop". Under this lens the crop *is* the cite.

**(b) The load-bearing half is refuted by code.** The claim asserts the frame's level 4
*disagrees* with npcdata's authored lvl 10, that the frame therefore wins, and that this
"routes that bandit through setLevel(4) and the ≤10 clamp to a real on-screen HP of 1."
There is no disagreement to resolve:

- `reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:34-37` — the level is read
  from the **room-object property string**, not from npcdata:
  `if(strArray.length >= 2) { this.lvl = strArray[1]; }`
- `Obj_NPCAggro.as:73-80` — it is a **display string only**, and the health bar is
  explicitly suppressed:
  `this.npc.mcs.hideHealthBar();`
  `if(this.lvl == 0) { setDisplayName(this.npcname, 10027008); } else { setDisplayName(this.npcname + " (" + this.lvl + ")", 10027008); }`
  (`10027008` = `0x990000`, dark red — the plate colour in the frame, now code-held.)
- `Obj_NPCAggro.as:62` spawns via `NPCManager.createRoomNPC(this.npcid,posX,posY,doChase)`.
  `NPCManager.as:671` — `createRoomNPC(npcID:int, x:int, y:int, doChase:Boolean = false)`.
  **No `lvl` parameter. `setLevel()` is never called on this path.**
- `setLevel()` has exactly four call sites, all wave/quest spawns:
  `NPCManager.as:879, 895, 910, 934` (`createEnemy` / `createFriend` / `createNeutral` /
  `createObjective`, each guarded by `if(lvl != 0)`).

So the `(4)` is a cosmetic per-placement override; the bandit keeps npcdata's lvl 10 /
hp 15 and the ≤10 clamp never fires. Invoking **THE FRAME WINS** where the source
explicitly authors the value is a misuse of the §0 invariant — it manufactures a conflict
in order to resolve it, which is the inverse of what the invariant is for.

**What survives:** red all-caps nameplate with parenthesised level; gold `GUEST` for the
player. Both verified by me at ×2 full-frame. The colour rule is now A2-held as well as A1-held.

### R2 · `enemies-ai/telegraph-active-recovery-frames` — "every stance attack ships as three named parts" is false, and its own quote says so

Every **duration** in this claim is exact — I re-parsed
`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` myself (158 `<anim>`)
and summed all 18 `*AnimationData.bin` to **471**, matching. `heavyhorizontalslash_parta` d=6,
`_partb` d=9 `l="1"`, `_partc` d=7; `balancedhorizontalslash` 4/9/7; `katanaattack` 10;
`stabattack` 14; `downstab` 15; `ninjaslash` 8; `pullbackarrow` 9; `pullbackarrow_full` 15;
`firearrow` 1; `arrownormalpose` 22. All verbatim.

The **rule** is wrong. My parse of the 158 human anims:

- Only **16 anim families** use `_part` decomposition (48 part-anims total).
- The part count is **not uniformly three**: `balancedjumpslash` and `heavyjumpslash` have
  **5**; `punchcombo` has **4**; `jutsu_ground`, `jutsu_punch`, `jutsu_blow`, `stomp`,
  `punchground` have **2**; the rest have 3.
- Many attacks have **no decomposition at all**: `lighthorizontalslash` (d=3, single),
  `downstab` (15), `stabattack` (14), `katanaattack` (10), `ninjaslash` (8),
  `holdshieldstabattack` (10), `downstab_up` (10).

`lighthorizontalslash:3` appears in the surveyor's own quote field, directly contradicting
the claim text above it. A port built on "every stance attack = parta/partb/partc" would
invent a three-phase light-stance slash and three-phase katana/stab attacks the source
does not have — the precise class of authoring error this gauntlet exists to catch.

The underlying finding — telegraph/active/recovery timing **is** authored, per-frame, and
blocker ③'s first half is dead — stands.

---

## REFUTED — MINOR

### R3 · `enemies-ai/ai-id-to-class-map` — class count overstated by 3; a second dispatch missed

I counted `NPCManager.as:516-636` myself: **38 `case` labels**, but only **34 distinct
classes** (`EnemyPlayer`×3, `EnemyWolf`×2, `EnemySpearElite`×2 are repeats). Of those 34,
**3 are `Friendly*`**, so it is **31 `Enemy*` + 3 `Friendly*`**, not the claimed
"34 named Enemy* classes plus 3 Friendly*" (=37). The score rationale's "38 behaviour
classes are unwritten work" is likewise 34.

Also missed: the 38-case switch is **not the only dispatch**. `NPCManager.as:671`
`createRoomNPC()` — the path every overworld enemy takes — runs its own independent
`if/else` chain on `xml.ai` (`ai==8` → `EnemyWolf`, `ai==11||16` → `EnemyWolfAlpha`,
`ai==12` → …). A recreation that models only the switch will miss the overworld branch.

Core structural point — `<ai>` indexes a behaviour class, not a difficulty tier, and the
shipped 3-tier `AI_TIERS` is the wrong *shape* — **holds**, and is the most valuable claim
in the unit.

### R4 · `enemies-ai/stagger-is-a-counter-not-an-anim` — `gotHitCounter` is i-frames, not a "hit-lockout"

The number is right (`NPC.as:462` `this.gotHitCounter = 12;`) and the negative half is
right — I confirmed **no** `stagger`/`flinch`/`gothit` anim among the 158 human names; only
the launch/knockdown chain (`gotlaunchedupwards_parta/b/c` 4/9/7, `gotlauncheddowned` 18,
`downedup` 4, `downedup2` 25, `deathdowned` 7). All verified.

But "hit-lockout" is the wrong mechanic. I grepped every `canHit()` call site: all eleven
are in **NPCManager's hit-detection**, in the form `!enemy.isDead() && enemy.canHit() &&
enemy.testHit(thing)` — `NPCManager.as:1222, 1263, 1325, 1414, 1434, 1454, 1494, 1513,
1534, 1564, 1579`. `gotHitCounter` gates whether the enemy **can be hit**, i.e. 12 frames
of damage immunity. It does not stop the enemy acting. A porter reading "hit-lockout"
implements an action lock — a real behavioural divergence. The `/ i-frames` hedge in
`lane_impact` is the correct reading; the claim text is not.

The surveyor's own `PARTIAL` verdict and its call for frame-side confirmation are honest
and correct.

### R5 · `enemies-ai/arrow-arc-physics` — the launch angle is not fixed at 30°

The solve is quoted exactly (`EnemyArcher.as:271-302`), `GRAVITY = 3` (`Projectile.as:8`),
`ttlMax = 48` (`Projectile.as:22`), `±4` scatter, and the knockdown gate (>50 → 1-in-2,
>20 → 1-in-3, >10 → 1-in-4, else never) are all verbatim-correct. I read all of them.

"A fixed 30° launch (0.866 = cos30)" is wrong. `0.866` only scales the **horizontal**
speed: `velA = sqrt(g·dx/0.866)`, `velXa = 0.866·velA = sqrt(0.866·g·dx)`. The vertical
component is then **solved** from the ballistic constraint to pass through the target
(`velYa = (targetY - fireY - 0.5·g·t²)/t`), so the true launch angle `atan(velYa/velXa)`
varies with range and height difference. Firing at a literal 30° reproduces neither the
trajectory nor the hit rate.

Minor: `rotation = atan(velY/velX)*57.2727+180` sits **inside** `if(breakable)`
(`ArrowProjectile.as:53`), not unconditionally.

---

## HELD — verified first-hand

| claim | what I opened | result |
|---|---|---|
| `level-stat-formula` | `NPC.as:239-260` | verbatim match incl. `×0.9` at ≤20, 1/1/1 clamp at ≤10, `xp = lvl*2+20` |
| `per-enemy-hp` | my `grep -c "<hp>"` → **403**; `npcdata.xml:3121-3128` | exact; attack 406, defense 394 also confirmed |
| `one-statline-six-movesets` | `npcdata.xml:273-465` | ids 11–15 identical (name 5011, lvl 10, hp 15) with `<ai>` 1,2,3,4,5. *I read through id 15; id 16/ai 9 not directly opened.* |
| `engagement-ranges` | `NPC.as:22`, `:285-294`; `EnemySpear.as:192`; `EnemyWolf.as:255,259`; `EnemyArcher.as:202,219` | constants and `aiCounterMax=24` confirmed. Trivial: quoted `playerX - mcs.x < 400`; line 192 is `mcs.x - playerX < 400` (the faceLeft branch). Constant holds. |
| `spawn-geometry` | my `grep -c "<wave>"` → **118**; `NPCManager.as:300-320` | `checkNextWave` gates on all `enemyList` dead — verbatim. **Strengthened below (N3).** |
| `undead-rule-is-not-reflect` | `EnemyZombie.as:494-518`; `NPC.as:451-453`; my `grep -ril reflect` → **0 files** | held. Premise-refutation is correct and saves a wasted measurement pass. |
| `no-squad-coordination` | `NPCManager.as:1360-1390` | verbatim match |
| `no-per-enemy-chi-or-speed` | my `grep -c` → `<chi>` 0, `<speed>` 0; `XMLNpc.as:157,181` | held; correctly framed as work *deleted*, not added |
| `creature-and-boss-roster` | all seven cited lines: `npcdata.xml:1844, 2064, 2395, 3442, 3842, 4072, 4111` | every statline exact (67/15/100, 77/80/40, 89/30/150, 165/10/200, 186/30/600, 800/23/800, 802/10/30), and each `<ai>` matches its claimed class in the switch |
| `kill-rewards…` | `NPC.as:166-190` (calcXP) verbatim; my `grep -c` → 66 `<reward>`, 131 `<loot>`; `NPC.as:799-830` | held |
| `boss-names-are-procgen` | decoded the three name bins myself (ASCII/CRLF): samurai **36** incl. `Hachisuka`,`Honda`; male **398** incl. `Kano`; female **291** incl. `Shizuka`; `XMLNpc.as:582-590` | held. Zabuza/Hotaru → 0. Prevents a real authoring error. |
| `shipped-config-hp150-is-stale` | ran `npx vitest run tests/config-values.test.ts` → **57 passed**; `tests/config-values.test.ts:466-474` asserts `hp: 1`; `git log -S"hp: 150"` → `335e615` | held |
| `tengu-is-not-in-the-payload` | my greps → 0 across all five extracted files, **0 of 559** android scripts | held — **and stronger than claimed**, see N6 |
| `web-build-parity` (STILL_UNHELD) | `ls shs3_payload/scripts` → **652**, `grep -ci "enemy\|npc"` → **0**; android 559; `StatsManager.as:30` → `0.682` | correct, honest, and the right thing to cap the score on. Endorsed. |

### `combat-hud-drops-the-nameplate` — core holds, two over-reads

I opened `seg-11/frames/frame_0020.jpg` at ×2 full and cropped `(560,300)→(1024,500)` ×3.
The core assertion — **in combat every hostile carries a bare thin HP bar with no name,
no level, no numerals; only the player keeps a gold `GUEST`** — is confirmed. HUD reads
16/20 green, 15/15 blue, `CANNOT CHANGE STANCE`, `AUTO SLASH OFF`. Not refuted.

Two corrections:

1. **"Two kasa-hatted archers with drawn longbows stand at the right" is wrong.** At ×3
   the near archer is **bare-headed** — visible topknot, no hat. Only the far-right archer
   wears a kasa. The figure between them wears a **rounded domed helmet** with a
   shield/armband and is not an archer at all. Two archers, one kasa.
2. **"five thin HP bars float above five separate hostiles" is an over-read.** The
   bar→hostile mapping is not resolvable at this resolution, and one bar sits beside the
   `GUEST` label. Compare `seg-10/frames/frame_0021.jpg` crop `(400,290)→(700,340)` ×6,
   where a green bar **directly abuts** the `GUEST` text. Bar ownership is undetermined.

The claim was also graded from a single frame. I corroborated it in a **second, independent
scene** — see N2/N3.

---

## NEW FINDINGS

**N1 — the nameplate/bar split is a spawn-path split, not a HUD mode switch.**
`Obj_NPCAggro.as:73-80` gives overworld roamers `hideHealthBar()` + a permanent
`setDisplayName(name + " (" + lvl + ")", 0x990000)`. Wave-spawned combat NPCs
(`NPCManager.createEnemy`) get the inverse: a bar, no name. The aggro object carries its
own `waveXML` (`Obj_NPCAggro.as:38-41`), so on trigger the billboard enemy is replaced by
a real wave. Code and frame agree exactly — which is why the "mode switch" reads correctly
on film. Model it as two spawn paths, not one HUD that toggles.

**N2 — the readout rule holds outside the dungeon.** Same bare-bar-no-name behaviour in
the outdoor field: `seg-10/frames/frame_0020.jpg` and `frame_0021.jpg`. The transition is
visible across `seg-10` frames 0013→0021: nameplates up (0013–0015, `BANDIT (4)` still
lit while the `PREPARE YOURSELF!` bubble fires) → combat → bars, no names.

**N3 — the drop-in-from-above spawn rule is VISIBLE ON FILM.** The surveyor asserted this
from AS3 only. `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0020.jpg`, crop
`(400,150)→(1024,470)` LANCZOS ×2: a blue-clad kasa-hatted enemy is **fully airborne**,
roughly a body-height above the reed line, mid-descent, with its green HP bar tracking
above it. Under this lens that promotes `posY - Math.random()*200` from A2-only to **A2+A1**
and makes it safe to stamp.

**N4 — `EnemyZombie` has a weapon-parry the claim missed.** Same switch,
`EnemyZombie.as:502-505`: a hit landing on `PART_weapon` sets `gotHitFlag = false`,
`damage = 0` and `return false` — the hit is eaten entirely. Sits alongside the
half-damage-unless-behead gate.

**N5 — the `<ai>` dispatch has two tables, not one.** See R3: `NPCManager.as:671`
`createRoomNPC()` dispatches independently of the 38-case switch.

**N6 — Tengu is absent from the *resolved* string table too.** The surveyor grepped the
raw XML, where names are numeric ids — leaving open the objection "Tengu is behind an id".
I closed it: `grep -ic tengu` over `docs/gauntlet/L0/index/strings.json` and
`resolved_names.json` (the 2,533-entry S0-3 table) → **0 and 0**. Tengu is not a hidden id.
The Ready-taxonomy bullet over-claims a faction. `Guardian` is real (`NPCManager.as:628`,
`npcdata.xml:4111` id 802 lvl 10 hp 30 ai 36, plus a dedicated 16-anim
`102_MCSCharacter_GuardianAnimationData.bin`).

---

## SCORE

**78 is defensible; I would land 74.** The blocker work is genuine — ①②④⑤ are dead and I
verified the artifacts behind each. But R1 removes the frame-side corroboration the score
leaned on for the level formula (the frame shows a *display* level, and the on-screen HP-1
consequence is unproven), and R2 turns the ③ animation win from "authored rule" into
"authored durations, no uniform rule". The four stated caps are the right four, and the
v0.682-vs-v0.717 parity risk is correctly identified as dominant — `shs3_payload/scripts`
really is 652 classes with **zero** Enemy*/NPC* gameplay code. Nothing here should be
stamped CONTRACT on Android bytecode alone. Label every ported value **v0.682-ANDROID**.
