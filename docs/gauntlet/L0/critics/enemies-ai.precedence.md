# enemies-ai — LENS 3 (PRECEDENCE) blind critic

**Unit:** enemies-ai · **Surveyor score:** 78 (ledger 34) · **Claims judged:** 20
**Verdict summary:** 14 survive · 6 refuted (1 fatal, 4 material, 1 minor) · 5 new findings

The surveyor's *numeric* work is unusually good. Every count I re-derived matched to the
unit: 403 `<hp>` / 406 `<attack>` / 394 `<defense>`; 425 `<ai>` rows over 34 distinct values
with the histogram exact (1×56 2×48 3×52 4×47 5×48 6×3 7×6 8×2 9×73 14×15 26×8 28×24
29×10 30×8); HP top-7 exact (1×42 15×32 30×26 10×23 40×19 20×13 150×11); 118 `<wave>` /
160 `<x>` / 171 `<lvl>` / 75 `<fatal>` / 169 `<enemy>` / 70 `<friend>` / 2 `<neutral>`;
471 `<anim>` across the 18 `*AnimationData.bin`, 158 in `99_Human`; 96 `<skills>` / 647
`<skill>` (needs `grep -o`, not `grep -c` — I checked). Twelve AS3 quotes are verbatim.

The failures are all of **one kind, and it is exactly this lens**: the surveyor treated a
*name-based* absence as a *fact-based* absence, and never opened the two repo documents that
already settled the questions it left open.

---

## ⛔ FATAL — the "dominant residual risk" does not exist

`enemies-ai/web-build-parity` (STILL_UNHELD) says:

> "the web v0.717 payload decompile holds 652 classes and zero Enemy*/NPC* gameplay classes,
> so nothing on disk establishes that v0.717 kept these numbers"
> cite: `` ls reference/decompiled/shs3_payload/scripts | grep -ci "enemy\|npc" `` → 0

**The web payload is NAME-OBFUSCATED, not gameplay-free.** Its class files are literally
called `§1t68s0§.as`, `§1t4542s0§.as`, `§1t137s0§.as`. A grep for the string "enemy" was
never going to hit. `§1t68s0§.as` **is** `NPC.as`, and AS3 keeps *public* member names through
obfuscation, so it is trivially identifiable:

| fact | android v0.682 | **web v0.717** |
|---|---|---|
| `setLevel` body | `NPC.as:239` `factor = lvl/this.level` · `if(lvl<=20) factor *= 0.9` | `§1t68s0§.as:258` `_loc2_ = param1/this.level` · `if(param1<=20) _loc2_ *= 0.9` |
| ≤10 hard clamp | `NPC.as:253-259` → 1/1/1 | `§1t68s0§.as:272-278` → `damage=1; defense=1; …=1` |
| xp base | `NPC.as:251` `lvl*2+20` | `§1t68s0§.as:270` `param1*2+20` |
| decision cadence | `NPC.as:22` `aiCounterMax:int = 24` | `§1t68s0§.as:22` `§1t3244s0§:int = 24` |
| hit lockout | `NPC.as:462` `gotHitCounter = 12` | `§1t68s0§.as:483` `§1t3246s0§ = 12` |
| grey level | `NPC.as:100` `pl - floor(pl/10) - 5` · `:113` `pl - 9` | `§1t68s0§.as:122` identical · `:128` identical |
| archer solve | `EnemyArcher.as:277` `GRAVITY*abs(Δx)/0.866` | `§1t4542s0§.as:295-297` identical |
| arrow rotation | `ArrowProjectile.as:54` `atan(velY/velX)*57.2727+180` | `§1t137s0§.as:64` identical |

**Every headline constant in this unit is confirmed present and unchanged in web v0.717.**
Parity is not "unestablished" — it is established, and it holds.

It gets worse for the claim. The repo has carried
`docs/research/fidelity/SOURCE_CONSTANTS.md` since 2026-07-25, whose own header reads
*"Build identified as v0.717 — the same build our video measurements came from. 189
constants extracted; 152 CONFIRMED · 37 CORRECTED · 0 REFUTED"* — mined **from this exact
`shs3_payload` decompile**. And the repo's standing lesson, written after a prior agent made
the identical error, is in `docs/research/IMPROVEMENTS_RESEARCH.md:776`:

> "SOURCE_CONSTANTS.md is a mandatory read before declaring any OG mechanic 'video-only
> ground truth'."

This is the third time this repo has been burned by a superseded absence-claim. It is now
the fourth.

**Consequence for the score.** The rationale caps 78 on four things; cap reason (1) is void
and cap reason (4) is refuted below. The label instruction — *"Label all ported values
v0.682-ANDROID"* — is wrong guidance and would put a false caveat on every number in the unit.

---

## ⛔ MATERIAL — the stagger blocker was closed before this run started

`enemies-ai/stagger-is-a-counter-not-an-anim` (PARTIAL) says there is
*"NO stagger/flinch/gothit animation among the 158 human anim names"*, that
*"the ledger asked for a mechanic the source does not implement"*, and that the finding
*"wants frame-side confirmation before being stamped CONTRACT"*.

Three artifacts overturn it, and they reconcile into one exact answer:

1. **A2 — the animation exists, in the same 18-blob set the claim measured.**
   `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin` holds
   `<anim i="flinch" d="8">` and `<anim i="flinch_weapon" d="8">`. The claim scanned only
   `99_Human`. (`91_Ogre` and `102_Guardian` also carry `*hit` anims.)
2. **CONTRACT-SRC, and it is v0.717.** `docs/research/fidelity/SOURCE_CONSTANTS.md:261`:
   `| stagger / poise | hyperarmor after **3** staggers (**5** if the attacker is in light stance) |`
   The source implements a *named stagger/poise system with hyperarmor thresholds*.
3. **A4 — the frame confirmation already exists.** `docs/research/fidelity/MOTION_MEASUREMENTS.md:24`:
   `| Hit stagger | **12 frames total: 4 upright + 8 bent-forward** | duel-strike-A: frames 036–047 after streak |`

**They are the same fact:** `gotHitCounter = 12` = 4 frames held + `flinch` d=8. The number,
the animation and the frame measurement agree to the frame. Blocker ③'s stagger half is
**CLOSED, not PARTIAL** — the surveyor was right that 12 is the number and wrong about
everything it concluded from the name-absence.

---

## ⛔ MATERIAL — the nameplate claim mis-applies "THE FRAME WINS"

`enemies-ai/nameplate-level-4-bandit`. I opened the frame myself
(`reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg`, 1024×576, crop
(340,320)→(900,480) LANCZOS ×3, plus the full frame at ×2). **The visual half is HELD**:
red all-caps `BANDIT (4)`, the right label two overlapping copies, gold `GUEST`, HUD
`TERRITORY (22,51)` / `SECTOR (1,2)`, `20/20` green, `15/15` blue, `HEAVY STANCE`,
`138 COINS`, XP badge `4` `3714/5150`, quest banner `W TOSHIBARA FIELD`.

The reasoning half is wrong on three counts:

1. **There is no doc-vs-frame conflict to resolve.** The `(4)` is not derived from npcdata
   at all — `Obj_NPCAggro.as:33-36,79` reads it out of the room-object `<property>` string:
   `strArray = props.split(","); … this.lvl = strArray[1]; … setDisplayName(this.npcname + " (" + this.lvl + ")", 10027008)`.
   A per-placement authored override. Code and frame **agree**. Invoking the standing
   invariant here devalues it for the cases where it actually bites.
2. **`Obj_NPCAggro` never calls `setLevel`.** It calls `NPCManager.createRoomNPC(...)`
   (`Obj_NPCAggro.as:63`), and `createRoomNPC` (`NPCManager.as:671`) has no `lvl` parameter —
   the four `setLevel` call sites are `createEnemy/Friend/Neutral/Objective`
   (`NPCManager.as:879,895,910,934`), each gated `if(lvl != 0)`. The overworld sprite keeps
   npcdata's statline. The clamp bites only in the battle the aggro *triggers*
   (`interact()` → `putInNPCHolder(this.npcid, …, this.lvl)` → wave spawn → `createEnemy(…,lvl)`).
3. **"a real on-screen HP of 1" is not on screen.** `Obj_NPCAggro.as:71` calls
   `this.npc.mcs.hideHealthBar()` — overworld roamers explicitly have no HP bar. Confirmed in
   my crop: neither bandit has one.

Also: the stated crop (340,320)→(900,480) does **not** contain the gold `GUEST` (x≈205) or
the `TERRITORY/SECTOR` readout (x≈850, y≈285). Those are real, but they are in the full frame,
not the cited crop. State the crop you actually read.

---

## ⛔ MATERIAL — "every hostile" is falsified by the boss path

`enemies-ai/combat-hud-drops-the-nameplate`. I opened
`reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg`, crop (250,280)→(1024,520)
LANCZOS ×2. **HELD as an observation**: five thin horizontal HP bars (four green, one dim
tan at far right) over five hostiles, **no name and no level on any of them**; gold `GUEST`
over the player mid-swing with a pickaxe; a bare-chested bandit lunging from the left; two
kasa-hatted archers with drawn longbows at the right; full-screen red near-death vignette.

But the universal is false. `EnemyPlayer.as:772-776`:

```
if(this.isDuelist || this.isBoss) {
   namecolor = 16777215;
   if(this.side != 0 && this.side != StatsManager.getSide()) { namecolor = 10027008; }
   mcs.setDisplayName(xml.name + " (" + level + ")", namecolor);
```

…and `EnemySpearElite.as:63` does the same. **Duelists and bosses DO carry a name + (level)
in combat** — white `0xFFFFFF`, or dark red `0x990000` when on the opposing side. The
lane_impact — *"A recreation that shows names+levels during combat is wrong"* — would build
the wrong boss HUD. The real rule is a two-tier one: trash = bare HP bar; boss/duelist =
name + (level) + HP bar.

---

## ⛔ MATERIAL — the "delete this work" conclusion is unsafe

`enemies-ai/no-per-enemy-chi-or-speed`. The **factual half is HELD** — I re-ran it:
`grep -c "<chi>" npcdata.xml` → 0, `grep -c "<speed>"` → 0, and `XMLNpc.as:157,181` default
both to 1. Good, positive finding.

The conclusion is not: *"Any recreation that gives enemies a Chi pool or a per-enemy speed
stat is inventing a system the original does not have — this deletes work rather than adding it."*

`EnemyPlayer.as:754-761` **consumes both**:

```
var baseReload:int = 48 + xml.speed * 6;
var val:int = xml.speed;
var maxincrement:int = 90;
var baseSlashLength:int = 120 + Math.floor(maxincrement * val / (20 + val));
…
initPlayer(xml.controlledBy, xml.currenthp, xml.hp, xml.currentchi, xml.chi, xml.defense,
           baseReload, xml.minDamage, xml.damageRange, baseSlashLength, …);
```

Speed drives the enemy's **reload cadence** and **slash-stroke length**; chi is passed in as
a real pool (and npcdata authors 647 `<skill>` rows, which cost chi). The stats are wired and
live — the shipped *data* simply never varies them from 1. Deleting the fields would delete
`48 + speed*6` and `120 + 90·s/(20+s)`, two derivations this project does not otherwise have.
Correct framing: **implement the stat, hardcode the datum at 1.**

---

## ⛔ MINOR — one mis-cited artifact inside a good claim

`enemies-ai/engagement-ranges`. Ten of eleven constants verified verbatim:
`NPC.as:22` `aiCounterMax = 24` and `:285-294` `checkAITrigger` ✅ ·
`EnemySpear.as:192` `< 400 && … && random*4==0` ✅, `:225-227` `<100` / `<50` stab ✅ ·
`EnemyWolf.as:255` `dist<100 && dist>50` ✅, `:259` `>=100 && <250 && random*3==0` ✅ ·
`EnemyArcher.as:202,219` `<100 → ATTACK_STATE` ✅.

The eleventh is a mis-read. `Obj_NPCProcGen.as:135` is **not** an "overworld roamer trigger":

```
override public function isInInteractRange(mc:MovieClip) : Boolean {
   if(this.questCompleted) { return false; }
   return abs(this.npc.mcs.x - mc.x) < 100;
}
```

`Obj_NPCProcGen` is a **quest-giver** stage object — the constructor calls
`hideHealthBar()`, sets `buttonMode = true`, and `interactClick()` runs
`QuestGenerator.generateRandomQuest(...)` behind `NodeUI.ACTION_TALK`. That 100 px is a
**talk radius**, not aggro. The aggro-side equivalent is `Obj_NPCAggro`, which has no
distance check at all — it fires on `interact()`.

---

## ✅ SURVIVED (verified first-hand)

| claim | how I checked |
|---|---|
| `level-stat-formula` | `NPC.as:239-260` read verbatim — matches quote exactly. **Strengthened**: identical in web v0.717 `§1t68s0§.as:258-279`. See NEW-1 for the override caveat. |
| `per-enemy-hp` | 403 `<hp>`, min 1 max 1000; histogram top-7 exact |
| `ai-id-to-class-map` | `NPCManager.as:516-634` read in full — 38 cases, 0…37, no gaps. See NEW-2 for the count correction. |
| `one-statline-six-movesets` | `npcdata.xml:273-465` — ids 11-16 all `name 5011 / lvl 10 / hp 15 / attack 24 / defense 20`, `<ai>` 1,2,3,4,5,9. Exact. |
| `telegraph-active-recovery-frames` | parsed all 18 blobs: 471 total, 158 human. `heavyhorizontalslash_parta` d=6 · `_partb` d=9 `l="1"` · `_partc` d=7 · balanced 4/9/7 · `lighthorizontalslash` 3 · `katanaattack` 10 · `stabattack` 14 · `downstab` 15 · `ninjaslash` 8 · `pullbackarrow` 9 · `_full` 15 · `firearrow` 1 · `arrownormalpose` 22. All exact. |
| `spawn-geometry` | 118/160/171/75/169/70/2 all exact; `NPCManager.as:374-412` + `:299-320` verbatim |
| `arrow-arc-physics` | `EnemyArcher.as:271-302` verbatim incl. the 50/33/25/0 % knockdown ladder; `Projectile.as:8` GRAVITY 3, `:22` ttlMax 48. Also present in web v0.717. |
| `undead-rule-is-not-reflect` | `EnemyZombie.as:494-518` verbatim; `grep -rli reflect` over 559 classes → **0 files**; `EnemyJiangSi.as:308-311` ×1.5, no halving |
| `boss-names-are-procgen` | decoded the .bin tables: `Hachisuka`+`Honda` in `87_SamuraiFamilyNames`, `Kano` in `85_MaleNames`, `Shizuka` in `88_FemaleNames`; `zabuza|hotaru` → 0 files repo-wide |
| `tengu-is-not-in-the-payload` | 0 in npcdata/itemdata/questdata/skilldata/ui_strings/payload **and** 0 files in the 559-class tree; Guardian at `NPCManager.as:628` + `npcdata.xml:4111` |
| `creature-and-boss-roster` | all eight statlines read at the cited lines — every one matches |
| `no-squad-coordination` | `NPCManager.as:1360-1390` verbatim |
| `shipped-config-hp150-is-stale` | ran `npx vitest run tests/config-values.test.ts` → **57 passed**; assertion at `tests/config-values.test.ts:466-474` is `hp: 1`; `git log -S"hp: 150"` → `335e615`. **Correct stale-catch — this is what the lens is for.** |
| `kill-rewards-close-two-economy-blockers` | `NPC.as:826-856` loot dispatch verbatim; `:166-186` calcXP; `:94-113` getGreyLevel; `:112-130` getZeroDifference; 66 `<reward>` / 131 `<loot>` |

---

## NEW FINDINGS

**NEW-1 — `setLevel` is not one formula; bosses use a different one (A2).**
11 classes override it: `EnemySpearElite`, `EnemyPlayer`, `EnemyElite`, `EnemyOgre`,
`EnemyWolfAlpha`, `EnemyStag`, `EnemyKanjiGuardian`, `EnemyTrainingDummy`, `FriendlyArcher`,
`FriendlyElite`, `FriendlySpearElite`. `EnemySpearElite.as:32-70`: the boss branch drops the
×0.9 **and the ≤10 clamp entirely**, and uses `xp = lvl * 5 + 45` (not `lvl*2+20`) before
running a `hitsToKillBoss` / `hitsToKillPlayer` solve against the live player's stats.
`EnemyPlayer.as:777-790` adds `lvl>70 → ×1.25` and `lvl>50 → ×1.2` on damage and maxhp.
Blocker ① is still dead, but "the formula" is singular in the claim and plural on disk.

**NEW-2 — the class count is 35, not 37.**
`NPCManager.as:516-634` instantiates **32 distinct `Enemy*` + 3 `Friendly*` = 35** classes
across 38 cases; `EnemyPlayer` serves cases 0/9/14 and `EnemySpearElite` serves 28/37. The
claim's "34 named Enemy* classes plus 3 Friendly*" over-counts by two.

**NEW-3 — the nameplate colour rule is five-valued, and gold ≠ "player" (A2).**
The claim adds "hostile red / player gold". The full set:
`#FFCC00` (16763904) = player **and friendlies** (`MCSPlayer.as:245`, `ChangeNameDialog.as:233`,
`FriendlyArcher.as:57`, `FriendlyElite.as:64`) · `#990000` (10027008) = hostile
(`Obj_NPCAggro.as:76,79`, `EnemyPlayer.as:774`) · `#FFFFFF` (16777215) = network/PvP player,
duelist, boss, clone (`EnemyPlayer.as:83,771,880`, `EnemyClone.as:81,85`) · `#0099FF` (39423)
= neutral procgen NPC (`Obj_NPCProcGen.as:51`) · `#C0AC4B` (12627019) = quest-marked NPC
(`Obj_NPCProcGen.as:60`). Signature: `MCSCharacter.as:1533 setDisplayName(str, color:uint)`.
A recreation that ships only red/gold gets the neutral and quest-marker states wrong.

**NEW-4 — the hit lockout decomposes exactly (A2 + A2 + A4).**
`gotHitCounter = 12` (`NPC.as:462`, web `§1t68s0§.as:483`) = **4 upright + 8 bent-forward**
(`MOTION_MEASUREMENTS.md:24`, frame-cited duel-strike-A 036–047) = 4 held + `flinch` d=8
(`94_MCSCharacter_Human2AnimationData.bin`). Three independent artifacts, one number.
Blocker ③ is fully closed, both halves.

**NEW-5 — a weapon-part hit deals ZERO and returns false (A2).**
`EnemyZombie.as:501-505`: `case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false;
damage = 0; return false;`. A blade that lands on the enemy's weapon is a no-op — no damage,
no hit flag, no lockout. This is the closest thing the game has to a block, it is
**geometric rather than stateful**, and it appears in no ledger bullet. Cross-lane into
combat-core; worth its own pass against `SOURCE_CONSTANTS.md §3.5` ("no counter/parry/riposte
mechanic at all"), which it does not contradict but does qualify.

---

## SCORE

The re-score of **78** is defensible in direction (34 is far too low — five blockers really
do resolve on disk) but its *reasons* are damaged. Cap reason (1), the "dominant residual
risk", is void: web v0.717 parity is established for every headline constant in this unit.
Cap reason (4), the stagger caveat, is refuted: it was already closed by a frame-cited row
and a CONTRACT-SRC row in this repo. Cap reasons (2) Tengu and (3) 38 unwritten behaviour
classes stand, and (3) is the honest one — 35 hand-written state machines is the real work.

On its own corrected logic the unit lands **higher than 78**, not lower. The right caveat to
carry forward is not "label everything v0.682-ANDROID" — it is **"diff the obfuscated
`shs3_payload` class before stamping CONTRACT, because it is there and it is readable."**
