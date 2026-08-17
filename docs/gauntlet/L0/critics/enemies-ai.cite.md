# CITE-LENS REVIEW — unit `enemies-ai`

Blind critic. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. §0 applies: no memory, no plausibility, no second-hand grading.

**Headline:** the survey is unusually well-cited — 13 of 20 claims resolve line-exact
with verbatim quotes. But **four claims are materially wrong**, and three of the four
are the ones that close ledger blockers. The single worst failure is a negative claim
(`stagger-is-a-counter-not-an-anim`) whose refutation sits ~290 lines below the
surveyor's own cite, **in the same file**.

Score comment: 78 is not defensible as written. Blockers ① and ③ are not closed the
way the survey says they are, and the residual risk it names (② web parity) is
mis-diagnosed. See §C.

---

## A. MATERIAL REFUTATIONS (4)

### A1 — `enemies-ai/stagger-is-a-counter-not-an-anim` — REFUTED, material
**Claim:** "there is NO stagger/flinch/gothit animation … the ledger asked for a
mechanic the source does not implement."

**The source implements it, in the surveyor's own cited file.**

`reference/decompiled/shs3_android/scripts/NPC.as:747-764`:
```as3
public function doFlinch() : *
{
   if(actionState == FLINCH_STATE || actionState == SLASH_STATE)
   {
      return;
   }
   this.prevActionState = actionState;
   this.prevAnim = mcs.animation;
   this.prevFrameCounter = mcs.frameCounter;
   actionState = FLINCH_STATE;
   startAnim(FLINCH_WEAPON);
}

public function endFlinch() : *
{
   actionState = this.prevActionState;
   startAnim(this.prevAnim);
   mcs.frameCounter = this.prevFrameCounter;
}
```
Supporting artifacts I opened:
- `MCSActor.as:922` — `internal static var FLINCH_STATE:int = 28;`
- `MCSActor.as:170,172` — `FLINCH_WEAPON:String = "flinch_weapon"` / `FLINCH:String = "flinch"`
- `reference/extracted/android/94_MCSCharacter_Human2AnimationData.bin` — the animations
  exist with durations: `('flinch_weapon','8')`, `('flinch','8')`
- `EnemyZombie.as:544` — `this.startAction(FLINCH_STATE);` on hit when not downed/airborne
- `EnemyShield.as:117-119` — `case FLINCH_WEAPON: case FLINCH: endFlinch();`
- `MCSPlayer.as:4309-4326` — the player's `doFlinch()` override

**Why the survey missed it:** it searched only the 158 names in
`99_MCSCharacter_HumanAnimationData.bin`. The flinch pair lives in the **94_Human2**
blob. The literal sentence "no flinch among the 158 human anim names" is true; the
conclusion drawn from it is false. A scoped-true premise carrying a false conclusion
is exactly what LENS 1 hunts.

**Consequence:** blocker ③'s stagger half is **HELD**, not "asked for a mechanic that
does not exist." It is an 8-frame flinch state with anim+frameCounter save/restore, and
it is *separate* from the 12-frame `gotHitCounter` i-frame lockout (which is correctly
cited — `NPC.as:462`, `NPC.as:296-299`, both verified line-exact). The survey conflated
two mechanisms into one and then deleted the wrong one.

---

### A2 — `enemies-ai/level-stat-formula` — REFUTED, material
**Claim:** "the enemy level→stat formula … **is** NPC.setLevel(): … applied identically
to damage, defense and maxhp, with a hard clamp to 1/1/1 at level ≤ 10 and xp = lvl*2+20."

`NPC.as:239-260` is quoted **correctly and line-exact** — I verified every line. The
error is the definite article. `setLevel` is **overridden in 11 subclasses**:

```
$ grep -rn "override public function setLevel" reference/decompiled/shs3_android/scripts/
FriendlyArcher.as:21   FriendlyElite.as:23    EnemySpearElite.as:32
EnemyTrainingDummy.as:23  EnemyWolfAlpha.as:52  EnemyStag.as:48
EnemyPlayer.as:57      FriendlySpearElite.as:19  EnemyOgre.as:51
EnemyElite.as:23       EnemyKanjiGuardian.as:48
```

They are not cosmetic variants:

| class | behaviour |
|---|---|
| `EnemyOgre.as:51-53` | **empty body** — the Oni ignores level entirely, keeps authored lvl80/hp40/attack2000 |
| `EnemyTrainingDummy.as:23-47` | not a stat formula at all — a tutorial state machine (`lvl==3 → maxhp = 8`, `TutorialUI.instance.setState(...)`) |
| `EnemyWolfAlpha.as:52-78` | **no ×0.9**, clamp at `lvl <= 5` and only damage/defense (**maxhp is not clamped**), `xp = lvl*5 + 45` |
| `EnemyElite.as:23-52` | `minDamage = damage*factor` (not `damage`), `xp = lvl*5+45`, then an inverse solve off **live player stats**: `hitsToKillBoss = 10 + lvldiff`, `hitsToKillPlayer = 18 - lvldiff` |
| `EnemyPlayer.as:57-86`, `EnemySpearElite.as:32-78` | same live-player inverse solve, gated on `isBoss`/`isDuelist` |
| `EnemyStag.as:48-70` | verbatim copy of the base |

`xp = lvl*5 + 45` fires in six classes (`EnemySpearElite.as:62,78`, `EnemyWolfAlpha.as:73`,
`EnemyPlayer.as:82`, `EnemyElite.as:34`, `EnemyKanjiGuardian.as:58`).

**Consequence:** blocker ① still dies — every formula is on disk — but it dies as
**≥5 distinct formulas**, not one, and the elite/boss family is balanced against the
*live player*, which is a different system class entirely. A recreation that ports
`NPC.setLevel()` alone gets every boss wrong. The survey's lane_impact ("retro-justifies
`ENEMY_BASE.hp = 1`") survives **only for field trash**; it is false for anything
routed through `EnemyElite`/`EnemyPlayer`/`EnemySpearElite`/`EnemyOgre`.

---

### A3 — `enemies-ai/telegraph-active-recovery-frames` — REFUTED, material
**Claim:** "every stance attack ships as three named parts."
(score_rationale ③ restates it harder: "every attack animation ships as parta/partb/partc".)

The 471 count is **exactly right** (I re-derived it: 18 `*AnimationData.bin` files,
`sum = 471`, with `99_` = 158). Every individual duration quoted is **exactly right** —
I checked all 15 (`heavyhorizontalslash_parta` d=6, `_partb` d=9 `l="1"`, `_partc` d=7,
`balanced…` 4/9/7, `lighthorizontalslash` 3, `katanaattack` 10, `stabattack` 14,
`downstab` 15, `ninjaslash` 8, `pullbackarrow` 9, `pullbackarrow_full` 15, `firearrow` 1,
`arrownormalpose` 22). Credit where due.

The structural universal is false. Measured from `99_…HumanAnimationData.bin`:
- only **16 of 158** anims have a `_parta` at all;
- `lighthorizontalslash` — a stance attack — is a **single anim, d=3**, no parts;
  so are `katanaattack` (10), `stabattack` (14), `ninjaslash` (8), `downstab` (15);
- `balancedjumpslash` and `heavyjumpslash` run **parta…parte — five parts**, not three.

Also flagged: "telegraph / active / recovery … authored **verbatim**" is an inference
dressed as a citation. No field in the XML is named telegraph/active/recovery. The
mapping is a reasonable *reading* of `parta`/`partb (l="1")`/`partc`, and I'd accept it
as a labelled INFERRED — not as "verbatim."

**Consequence:** blocker ③'s telegraph half is closed only for the ~5 multi-part heavy
and balanced swings. Light stance has **no three-phase structure to port**.

---

### A4 — `enemies-ai/web-build-parity` — verdict STILL_UNHELD is honest; the **reason is refuted**, material
**Claim:** "the web v0.717 payload decompile holds 652 classes and **zero Enemy*/NPC*
gameplay classes**, so nothing on disk establishes that v0.717 kept these numbers."

The name-absence is real (`ls … | grep -ci "enemy\|npc"` → 0, and 0 across the whole
1079-file tree, and no textual `NPCManager`/`EnemyArcher` anywhere). But it proves
nothing, because **the web payload is identifier-obfuscated**:

```
$ find reference/decompiled/shs3_payload -name "§*" -type f | wc -l
     667
$ grep -rn "0\.717" reference/decompiled/shs3_payload/
scripts/§1t1523s0§.as:36:      public static var §1t9323s0§:Number = 0.717;
```
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36` holds the version constant
in exactly the position `shs3_android/scripts/StatsManager.as:30` holds `0.682` — i.e.
**`§1t1523s0§` *is* the web `StatsManager`**. The gameplay classes are present under
`§1t…s0§` names, in `scripts/§1t51s0§/` and 667 sibling files.

**Consequence:** this inverts the survey's own framing of its dominant residual risk.
Web parity is not blocked by missing code — it is a **name-recovery job on 667
obfuscated classes, anchored by constants that already match**. That is tractable work
someone can schedule, not an unrecoverable gap. Leaving it described as "zero gameplay
code" would cause the board to skip a checkable lane.

(Also minor: "652 classes" is the top-level `ls` count; the tree holds 1079 `.as` files.)

---

## B. MINOR CORRECTIONS (7) — claims stand, details do not

| claim | what I found |
|---|---|
| `ai-id-to-class-map` | The 38-case switch at `NPCManager.as:516-634` is **exact**, and the `<ai>` histogram matches my re-derivation digit for digit (`1×56 2×48 3×52 4×47 5×48 6×3 7×6 8×2 9×73 14×15 26×8 28×24 29×10 30×8`, 34 distinct over 425 rows). But "**34** named Enemy* classes plus 3 Friendly*" is wrong: `grep -o 'new Enemy[A-Za-z0-9_]*' \| sort -u \| wc -l` → **32** distinct Enemy* + 3 Friendly* = **35** classes over 38 cases (`EnemyPlayer` ×3, `EnemySpearElite` ×2). The 34 looks borrowed from the *distinct `<ai>` value* count. |
| `nameplate-level-4-bandit` | The nameplate rule is **confirmed** — I cropped `seg-10/frames/frame_0013.jpg` (frame is 1024×576, not 1080p) at (340,320)→(900,480) LANCZOS ×3 and read red all-caps `BANDIT (4)` over both kasa-hatted hostiles, with the right-hand label doubled. **But the stated crop does not contain what the quote says it contains**: the gold `GUEST` label is at original **x≈205**, outside the crop's x-range — and original x≈430, where the quote places the player, is a **BANDIT**. `TERRITORY (22,51) / SECTOR (1,2)` is at y≈272-292, also outside the crop's y-range. Both exist in the full frame (I checked at 2×), neither is in the box the surveyor stated. §0 requires the stated crop to be the thing graded. |
| `combat-hud-drops-the-nameplate` | **Confirmed** on `seg-11/frames/frame_0020.jpg` — five thin HP bars (four green, one dim tan far right), zero names, zero levels, only gold `GUEST` over the player mid-pickaxe-swing. Same crop-box problem: `AUTO SLASH OFF` (y≈17-40) and `16/20` / `15/15` / `CANNOT CHANGE STANCE` (y≈500-540) both fall outside the two stated crops (y 300-500). Also only **one** of the two right-hand archers is kasa-hatted; the centre one is bare-headed. |
| `creature-and-boss-roster` | Every statline and line number is **exact** (I opened all 8 blocks). Three **names** are wrong — they are AI-class names, not the shipped string-table names. Per `docs/gauntlet/L0/index/resolved_names.json`: id 67 → **"Wolf"** (not "Wolf Alpha"), id 77 → **"Oni"** (not "Ogre"), id 89 → **"Undead"** (not "Zombie"). Hiroshi/Tadao/Amaya/Mad Cultist/Guardian all resolve correctly. This matters precisely *because* claim 2 established that the nameplate shows the name — a recreation built off this row would print "Ogre" where the OG prints "Oni". |
| `kill-rewards-close-two-economy-blockers` | The loot half is **flawless** — `npcdata.xml:38-44` line-exact, 66 `<reward>` / **131** `<loot>` occurrences (my first line-count of 100 was wrong; the surveyor is right), chance domain `{0.05,0.1,0.3,0.4,0.5,1}` exact, `NPC.as:799-855` and `calcXP` at `NPC.as:166-190` **verbatim to the character**, `getGreyLevel` 94-105 and `getZeroDifference` 112-124 correct. But "base xp = level\*2 + 20" is the **trash** curve only: six classes set `xp = lvl*5 + 45` (see A2). |
| `boss-names-are-procgen` | Substance **holds**: 87_SamuraiFamilyNames has 36 entries opening `Asai / Askikaga / Chosokabe / Date / Fukushima / Genji / Hachisuka(6) / Hattori / Heike / Hojo / Honda(10) / Hosokawa`; `Kano` is index 79 of 398 male names; `Shizuka` index 225 of 291 female; `zabuza|hotaru` → 0 across all XML, ui_strings, payload.xml, the script tree **and** `strings.json`; `hachisuka|shizuka` → 0 in `strings.json`, so they cannot be authored. **Mis-cite:** `XMLNpc.as:527` is `if(male)`. The `getSamuraiName` call is at **:529** (male) / **:541** (female). The bounty block is **:582-587**, not 581-586. |
| `engagement-ranges` | Ten of ten range constants resolve **line-exact** — Knife 181/200, Katana 167/179, Spear 192/204/225/227, Shield 204/216/265, Ogre 239/241, Wolf 255/259, Archer 202/219, JiangSi 192, ProcGen 135, `aiCounterMax:int = 24` at `NPC.as:22`, `checkAITrigger` at 285-294. Two nits: the quote attributed to `EnemySpear.as:192` reads `playerX - mcs.x < 400` but line 192 is `mcs.x - playerX < 400` (that operand order is line **204**); and "halved to 12 for **elites**" over-generalises — `aiCounterMax = 12` is set only in `EnemyElite.as:18`, `FriendlyElite.as:18`, `EnemyPlayer.as:52`, `MCSPlayer.as:165`. **`EnemySpearElite` keeps 24.** |

---

## C. CLAIMS THAT SURVIVED UNTOUCHED (9)

I opened the artifact for each; all resolve line-exact with the quoted text present and
saying what the claim says it says.

- **`per-enemy-hp`** — `npcdata.xml:3121-3128` is byte-for-byte the quoted block
  (3121 `<npc>`, 3122 `<id>144</id>` … 3128 `<defense>200</defense>`). 403 `<hp>` rows,
  range [1,1000], 406 `<attack>`, 394 `<defense>`. Histogram re-derived: `1×42, 15×32,
  30×26, 10×23, 40×19, 20×13, 150×11` — **identical**.
- **`one-statline-six-movesets`** — all six `<ai>` line numbers exact (275-280, 315,
  352, 389, 426, 463); ids 11-16 share `name 5011 / lvl 10 / hp 15 / attack 24 /
  defense 20`; 5011 resolves to **"Bandit"** in `resolved_names.json`. Strongest claim
  in the set.
- **`spawn-geometry`** — `questdata.xml:77-88` exact. I initially made the survey wrong
  here (raw `grep -c '<x>'` → 636) and **the survey was right**: the index is
  path-scoped — `wave/enemy/x` 97 (range **-400..2000**) + `wave/friend/x` 49 +
  `wave/neutral/x` 2 + `roomobj/…/wave/enemy/x` 12 = **160**. 118 `<wave>`, 171 `<lvl>`,
  75 `<fatal>`, 169 `<enemy>`, 70 `<friend>`, 2 `<neutral>` all confirmed.
  `NPCManager.as:374-412` drop-in rule and `:300-320` all-dead gate both exact.
- **`arrow-arc-physics`** — `EnemyArcher.as:271-302`, `Projectile.as:8` (GRAVITY=3),
  `:22` (ttlMax=48), `ArrowProjectile.as:51-56`, `EnemyGoblinThrower.as:555-565` all
  exact. I checked the "fixed 30°" reading algebraically: with `velXa = 0.866·√(3·dx/0.866)`
  and `velYa` solved for equal heights, `velYa/velXa = 0.5774 = tan 30°`. **The reading
  is correct.** Knockdown gates >50/>20/>10 → 1-in-2/3/4 exact. (Nit: the elided quote
  hides that `rotation` is inside `if(breakable)`; gravity applies in both branches.)
- **`undead-rule-is-not-reflect`** — `EnemyZombie.as:493-518` exact, `if(!behead){damage /= 2;}`
  at 517-518; `NPC.as:451-453` `if(behead){damage *= 1.5;}` exact; `EnemyJiangSi.as:308-311`
  exact. `grep -ric reflect` over the whole tree → **zero non-zero files**. The blocker's
  premise really is wrong, and this saves a wasted measurement pass.
- **`shipped-config-hp150-is-stale`** — I ran it: `npx vitest run tests/config-values.test.ts
  tests/enemyModel.test.ts` → `Test Files 2 passed (2) / Tests 71 passed (71)`; config-values
  alone 57. Assertion is at **exactly** `tests/config-values.test.ts:466-474`.
  `git log -S"hp: 150"` → `335e615 2026-07-26`, and `git show` confirms `-  hp: 150,`.
- **`tengu-is-not-in-the-payload`** — 0 in npcdata / itemdata / questdata / skilldata /
  ui_strings / payload.xml, 0 files in the script tree, **and 0 in `strings.json`**
  (which the survey did not check and which closes the last hole). Guardian confirmed at
  `NPCManager.as:628` + `npcdata.xml:4111` (id 802 → **"Guardian"** in resolved_names).
- **`no-squad-coordination`** — `NPCManager.as:1360` is `getNearestEnemy`; the ±10px
  stage-bounds filter and per-NPC independent query are exactly as quoted.
- **`no-per-enemy-chi-or-speed`** — `<chi>` 0, `<speed>` 0 in npcdata; `XMLNpc.as:150-182`
  is **exactly** the default block (`chi→1, attack→1, defense→0, speed→1`). A negative
  that deletes work; correctly framed.

---

## D. WHAT THIS DOES TO THE SCORE

The survey caps at 78 on four stated grounds. Two of them do not hold up and two new
ones appear:

- ~~"the 12-frame hit-lockout is a counter with no stagger animation"~~ → **dead**;
  the stagger exists (A1). Blocker ③'s stagger half is *closed*, not *absent*.
- ~~"v0.717 holds zero Enemy*/NPC* gameplay code"~~ → **dead**; the code is there,
  obfuscated, with an anchored version constant (A4). Parity is checkable work.
- **new:** blocker ① is closed by **≥5 formulas**, not one, and the elite/boss family
  balances against live player stats — a system the board has not scoped at all (A2).
- **new:** the three-phase telegraph model covers ~5 swings, not "every attack" (A3).
- retained and confirmed by me: Tengu greps to 0 everywhere including `strings.json`;
  the 35 behaviour classes are unwritten work.

Net: the *evidence position* is better than 78 in two places and worse in two others.
The board should not carry the "no stagger" or "no web gameplay code" lines forward.
