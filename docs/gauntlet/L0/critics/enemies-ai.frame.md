# L0 CRITIC — enemies-ai — LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning, only its 20-claim output. Every
verdict below rests on an artifact **I** personally opened. Every frame was cropped and
upscaled before grading; the crop is stated on every visual verdict.

**Headline:** a strong unit. 20 claims — **16 survive**, **4 are refuted** (2 material,
2 minor), and the 1 self-reported STILL_UNHELD is honest and correct. **No fabricated
cites.** Every file, line number, count and verbatim quote I checked existed and said
what was claimed, with one garbled quote (R3). That is the important result and it
should be said plainly.

The two refutations that matter are both **over-reach on a universal**, not invention:
claim 2 manufactures a frame-vs-doc conflict that does not exist and misapplies §0's
standing invariant; claim 3's "every hostile" is false for elites and bosses.

⚠ **Frame geometry correction that affects every crop in this unit.** The frames under
`reference/frames/zFtCaTO0_1M/` are **1024×576, not 1080p**. §0's "the fighter is ~270 px
tall in a 1080p frame" does not apply here — the fighter is **~110–140 px** tall in these
files. I upscaled ×2 on full frames, ×3–×6 on crops. Any agent reusing the surveyor's
stated crop numbers on an assumed 1920-wide frame will crop the wrong region (this is
exactly how R1(a) happened).

---

## REFUTED — MATERIAL

### R1 · `enemies-ai/nameplate-level-4-bandit` — the "frame wins" invocation is manufactured

**My cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg`, the surveyor's
own crop `(340,320)→(900,480)` LANCZOS ×3, plus the full frame at ×2; and
`reference/decompiled/shs3_android/scripts/Obj_NPCAggro.as:30-37,76-82`.

Two failures, one cosmetic and one load-bearing.

**(a) The stated crop does not contain two of its own listed observations.** I reproduced
`(340,320)→(900,480)` ×3 exactly. It contains the two kasa-hatted bandits and the red
`BANDIT (4)` plates — and nothing else the quote lists. Measuring in the real 1024-space:

| listed as "visibly in the crop" | actual position | inside `(340,320)→(900,480)`? |
|---|---|---|
| red `BANDIT (4)` ×2 | x≈365–445, x≈745–840 | **yes** |
| gold `GUEST` | **x≈186–236** | no — left of x0=340 |
| `TERRITORY (22,51)` / `SECTOR (1,2)` | **y≈272–295** | no — above y0=320 |

Both absent items *are* real — I confirmed them on the full frame at ×2 — but under this
lens **the crop is the cite**, and the claim also places the player at "x≈430" when he is
at **x≈205**. That x≈430 is the giveaway: it is the position the player would occupy in a
1920-wide frame. The surveyor graded a 1024-wide image with 1080p arithmetic.

**(b) There is no frame-vs-doc disagreement, so §0's invariant does not apply.** The claim
asserts the frame's level 4 *disagrees* with `npcdata`'s authored `<lvl>10</lvl>`, that
"THE FRAME WINS over the npcdata statline on level", and that this "routes that bandit
through setLevel(4) and the ≤10 clamp to a real on-screen HP of 1." The source shows the
two numbers are not competing measurements of the same quantity:

```as3
// Obj_NPCAggro.as:30-37 — the overworld roamer's level comes from the ROOM OBJECT,
// not from npcdata
strArray = props.split(",");
var npcidstr:String = strArray[0];
if(strArray.length >= 2) { this.lvl = strArray[1]; }
...
// Obj_NPCAggro.as:81 — and this is literally the string on screen
this.npc.mcs.setDisplayName(this.npcname + " (" + this.lvl + ")", 10027008);
```

`npcdata`'s `<lvl>10</lvl>` is the **authored template level** — the denominator that
`NPC.setLevel()`'s `factor = lvl / this.level` divides by. The `(4)` is the **instantiated**
level, supplied per-placement by the room-object property string. `setLevel()` exists
precisely to convert one into the other. Nothing disagrees; nothing needs to win.

Invoking the standing invariant where no conflict exists is worse than not invoking it —
it spends the invariant's authority on a non-event, and it teaches the next reader that
`npcdata` is unreliable when it is not. **The invariant is for real conflicts. This is not
one.** (Where a real one exists, I flag it — see N1.)

Finally, "a real on-screen HP of 1" is **not visible in this or any frame**: no enemy HP
numeral is ever rendered (claim 3 says so itself). It is a code inference presented inside
an A1 quote as observed frame content. The mechanism is right; the artifact class is wrong.

**What survives:** the red all-caps `NAME (level)` plate, the gold `GUEST`, and the format
string. Those are real and I confirmed them — see N2, where I upgrade them from eyeballed
colour to exact hex.

---

### R2 · `enemies-ai/combat-hud-drops-the-nameplate` — "every hostile" is false for elites and bosses

**My cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg`, crops
`(560,300)→(1024,500)` and `(250,300)→(620,500)` LANCZOS ×3, plus full frame ×2; and
`reference/decompiled/shs3_android/scripts/MCSCharacter.as:1419-1437,1533-1556` +
`EnemyElite.as:26,114`.

**The observation is HELD — I verified it and it generalises further than the surveyor
showed.** The two stated crops reproduce faithfully: dungeon brick, full-screen red
near-death vignette, HUD `16/20` green / `15/15` blue / `CANNOT CHANGE STANCE` /
`AUTO SLASH OFF`, gold `GUEST` over a player mid-swing with a pickaxe, a bare-chested
bandit lunging from the left, and **five thin horizontal bars — four green, one dim tan at
far right — carrying no name, no level and no numerals.** The bar count and colours are
exactly right (the leftmost bar reads olive on the darkened full frame but is plainly green
at ×3). I also confirmed it is not dungeon-specific: `seg-10/frames/frame_0016.jpg`
(crop `(200,320)→(700,480)` ×4) shows an overworld archer taking a hit with **no plate and
no bar**, while gold `GUEST` persists.

**But the universal quantifier is wrong.** Elites and bosses carry a nameplate *during
combat*:

```as3
// EnemyElite.as:26  (class sets isBoss = true in its constructor)
mcs.setDisplayName(charname + " (" + lvl + ")", 16777215);   // 16777215 = #FFFFFF
// EnemyElite.as:114, EnemyKanjiGuardian.as:59, EnemyClone.as:81/85,
// EnemyPlayer.as:1339/1344 — same white name+(level) plate
```

`EnemySpearElite` is `ai` case 37 and `EnemyKanjiGuardian` is case 36 in the very dispatch
the surveyor cites in claim 5 — these are wave-spawned combat enemies. A recreation built
from claim 3 as written would strip the nameplate off every boss.

**And the stated mechanism is wrong.** It is not a mode switch. `MCSCharacter` gates the
name on the *string*, not on a UI state:

```as3
public function showHealthBar() : * {
   addChild(this.healthBar); this.healthBar.visible = true;
   if(this.displayName.text != "") { this.displayName.visible = true; }   // ← the gate
   if(this.displayName.y > this.healthBar.y) { this.displayName.y = this.healthBar.y; }
}
public function hideHealthBar() : * {
   this.healthBar.visible = false; this.displayName.visible = false;      // hides BOTH
}
```

Ordinary wave trash never has `setDisplayName()` called on it at all, so `text` stays `""`
and `showHealthBar()` silently leaves the plate hidden. Overworld roamers get
`hideHealthBar()` *then* `setDisplayName(...)`, which is why they show a name and no bar.
Same code path, opposite results, driven entirely by whether a name was ever assigned.
Full mechanism and the 60-px bar width in **N3**.

---

## REFUTED — MINOR

### R3 · `enemies-ai/engagement-ranges` — the `EnemySpear.as:192` quote is not verbatim

**My cite:** `reference/decompiled/shs3_android/scripts/EnemySpear.as:192` and `:204`.

Claimed as a verbatim quote of `:192`:

```
EnemySpear.as:192  if(playerX - mcs.x < 400 && mcs.y - playerY < 10 && int(Math.random() * 4) == 0)
```

Actual file contents:

```as3
:192   if(mcs.x - playerX < 400 && mcs.y - playerY < 10 && int(Math.random() * 4) == 0)
:204   if(playerX - mcs.x < 400 && mcs.y - playerY < 50 && int(Math.random() * 4) == 0)
```

The quote is a **hybrid**: the operand order (`playerX - mcs.x`) is from `:204`, the
`< 10` is from `:192`. The two lines are the facing-left / facing-right mirror pair and
their vertical bands genuinely differ (10 vs 50) — so the merge erases a real asymmetry.
Every *number* in the claim survives (400 px approach, 1-in-4 gate, and I re-verified
`aiCounterMax = 24` at `NPC.as:22`, `checkAITrigger` at `:285-294`, Wolf `100>d>50` /
`100–250` 1-in-3 at `EnemyWolf.as:255-260`, Archer `<100` at `EnemyArcher.as:202,219`).
Minor: content sound, quote not quotable.

### R4 · `enemies-ai/creature-and-boss-roster` — three of nine roster names contradict the supplied string table

**My cite:** `reference/extracted/npcdata.xml:1844, 2064, 2395` resolved through
`docs/gauntlet/L0/index/strings.json` (the table S0-3 resolved *for* this run).

All nine **statlines are exact** — I checked every cited line. The **names are not**:

| npcdata | `<name>` id | resolved string | claim says |
|---|---|---|---|
| id 67, lvl 15, hp 100 | 5056 | **"Wolf"** | "Wolf Alpha" |
| id 77, lvl 80, hp 40 | 5071 | **"Oni"** | "Ogre" |
| id 89, lvl 30, hp 150 | 5073 | **"Undead"** | "Zombie" |

(The other six check out: 5090 "Tadao", 5107 "Amaya", 5118 "Mad Cultist", 5119 "Guardian",
5058 "Hiroshi", 5011 "Bandit".) The surveyor substituted the **AS3 class** name
(`EnemyOgre`, `EnemyZombie`) for the **display** name. Ordinarily pedantic — but claims 2
and 3 just established that these strings are **rendered on screen in a nameplate**, so a
recreation authoring "Ogre (80)" over a mob the original labels "Oni (80)" is a visible
fidelity miss. S0-3 resolved this table precisely so it would not have to be guessed.

Second, smaller point: `hp 800` / `hp 1000` for the bosses are **floors, not fight HP** —
`EnemyElite.setLevel()` overwrites `maxhp` whenever its dynamic target exceeds it (N4).

---

## HELD — verified first-hand

Each re-derived from the artifact, not taken on trust.

| claim | what I ran / opened | result |
|---|---|---|
| `level-stat-formula` | `NPC.as:239-260` | **verbatim exact**, incl. `factor *= 0.9` at `lvl<=20`, `xp = lvl*2+20`, and the `lvl<=10 → 1/1/1` clamp. See N4 for the boss override. |
| `per-enemy-hp` | `grep -c` on `npcdata.xml`; lines 3121-3128 | `<hp>` **403**, `<attack>` **406**, `<defense>` **394**, `<npc>` **495**. Line cite exact. |
| `ai-id-to-class-map` | `NPCManager.as:516-634` | **38 `case` labels**, 0–37, exactly as quoted. |
| `one-statline-six-movesets` | `npcdata.xml:273-465` | ids 11–16 all `hp 15`; `<ai>` = 1,2,3,4,5,9 at lines 280/315/352/389/426/463. Exact. |
| `telegraph-active-recovery-frames` | counted `<anim ` across all 18 `*AnimationData.bin` | **471 total**, **158** in `99_MCSCharacter_Human…`. `heavyhorizontalslash_parta d=6 / _partb d=9 l="1" / _partc d=7`; `balanced… 4/9/7`. Exact. |
| `stagger-is-a-counter-not-an-anim` | `NPC.as:462`, `:296-299`; grep over human anim names | `gotHitCounter = 12`, `canHit(){return gotHitCounter==0}`. **Zero** stagger/flinch/gothit/hurt anims. PARTIAL is the right self-verdict. See N5. |
| `spawn-geometry` | `grep -c` on `questdata.xml`; `NPCManager.as:300-320` | `<wave>` **118**, `<enemy>` **169**, `<friend>` **70**. `checkNextWave()` gates on every `enemyList` entry dead. Exact. |
| `arrow-arc-physics` | `EnemyArcher.as:271-302`; `Projectile.as:8,22` | **verbatim exact**: `GRAVITY=3`, `0.866`, `fireY = mcs.y - 60`, `velYa += Math.random()*8 - 4`, `ttlMax = 48`, knockdown ladder `>50` 1-in-2 / `>20` 1-in-3 / `>10` 1-in-4. |
| `undead-rule-is-not-reflect` | `grep -ril reflect` over 559 classes → **0**; `EnemyZombie.as:493-518`; `NPC.as:451-453` | Held, and the premise-refutation is correct. Bonus: a hit on `PART_weapon` returns `damage = 0` outright — a parry the claim omits. |
| `shipped-config-hp150-is-stale` | `npx vitest run tests/config-values.test.ts` | **`Test Files 1 passed / Tests 57 passed`**; `ENEMY_BASE.hp: 1` at `tests/config-values.test.ts:466`; `git log -S"hp: 150"` → `335e615`. Exact. |
| `boss-names-are-procgen` | grep over `85/87/88_NameGenerator_*.bin` | "Hachisuka" ✓ and "Honda" ✓ in samurai family names, "Kano" ✓ male, "Shizuka" ✓ female. **"Zabuza" 0, "Hotaru" 0** across all of `reference/extracted/` + the Android tree. |
| `tengu-is-not-in-the-payload` | grep over 4 XMLs + `ui_strings.txt` + whole decompile | **0 everywhere.** I also checked `docs/gauntlet/L0/index/strings.json` (the surveyor did not) → **0**. Stronger than claimed: Tengu is absent from the resolved string table too. |
| `no-squad-coordination` | `NPCManager.as:1360-1390` | **verbatim exact**, incl. the `pos > -10 && pos < stageWidth + 10` bound. |
| `no-per-enemy-chi-or-speed` | `grep -c "<chi>\|<speed>" npcdata.xml`; `XMLNpc.as:150-182` | **0 and 0.** Defaults confirmed. A correct "this system does not exist" answer. |
| `kill-rewards-…` | `npcdata.xml:36-46`; `NPC.as:166-190, 94-126` | `<reward>` **66**, `<loot>` **131**; `calcXP` verbatim. Minor: `getGreyLevel()` has **four** branches (`<6`, `<40`, `<60`, else), not the one quoted. |
| `web-build-parity` | `ls shs3_payload/scripts \| wc -l` → **652**, `grep -ci enemy\|npc` → **0**; android **559**; `StatsManager.as:30` → `0.682` | Held. Honest and correct STILL_UNHELD. One qualification: the sentence "nothing on disk establishes that v0.717 kept these numbers" is now **false** — the frames are on disk and I used them to establish two (N1, N2). The surveyor's own escape clause ("or a frame measurement corroborates that specific number") anticipated this, so I do not score it as refuted. |

---

## NEW FINDINGS — what the surveyor missed

### N1 · A1 — floating damage numerals exist, and a v0.717 frame measures the `lvl<=10` clamp at **damage = 1**

**Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0018.jpg`, crop
`(450,300)→(900,470)` LANCZOS ×4; HUD strip `(30,480)→(330,560)` ×4 across frames
0013 / 0016 / 0017 / 0018 / 0019 / 0020.

A **black floating "1"** rises above the player at the instant of a hit, beside the gold
`GUEST`. The player HUD reads:

| frame | 0013 | 0016 | 0017 | **0018** | 0019 | 0020 |
|---|---|---|---|---|---|---|
| HP | 20/20 | 20/20 | 20/20 | **19/20** | 18/20 | 18/20 |

The HUD ticks 20→19 **on exactly the frame carrying the floating "1"**. So: floating damage
numerals are a real HUD element (black, above the damaged actor, not mentioned anywhere in
the ledger or the 20 claims), and a **level-4** roaming Bandit deals exactly **1** damage.

That is precisely what `NPC.as:253` predicts — `if(lvl <= 10) { this.damage = 1; … }` —
**measured from a web-build v0.717 frame against an Android v0.682 constant.** This is the
first frame-side corroboration of claim 1 and it materially reduces claim 20's dominant
residual risk *for this constant*. It also does honestly what R1(b) tried to do
rhetorically.

### N2 · A2 + A1 — the nameplate colour system is **five** colours, not two, and the frame confirms the AS3 constants

Claim 2 offers "hostile red / player gold". The source has five, and three are confirmed
frame-side by peak-saturation sampling (JPEG-smeared, so near-matches):

| role | AS3 constant | hex | frame peak I measured | where |
|---|---|---|---|---|
| hostile aggro roamer | `10027008` | `#990000` | `#8A0300` | `Obj_NPCAggro.as:78,81` · seg-10 f0013 |
| player | `16763904` | `#FFCC00` | `#EDC728` | `MCSPlayer.as:245` · seg-10 f0013 |
| procgen civilian | `39423` | `#0099FF` | `#1A97F4` | `Obj_NPCProcGen.as:51` · **seg-18 f0006** |
| elite / boss / clone / PvP | `16777215` | `#FFFFFF` | — | `EnemyElite.as:26,114`, `EnemyKanjiGuardian.as:59`, `EnemyClone.as:81` |
| quest-marked civilian | `12627019` | `#C0AC4B` | — | `Obj_NPCProcGen.as:60` |

The blue is not theoretical: `reference/frames/zFtCaTO0_1M/seg-18/frames/frame_0006.jpg`,
crop `(230,320)→(470,400)` LANCZOS ×6, shows two overlapping **blue** plates reading
`KAWASHI I…` and `…SUGU` flanking the gold `GUEST`. A recreation built on claim 2 alone
would paint townsfolk hostile-red.

This is also a **second independent web/Android parity corroboration**: v0.717 frames match
v0.682 colour constants to within JPEG error.

### N3 · A2 — the nameplate/health-bar coupling, and the bar is **60 px** at full HP

The mechanism behind both R1 and R2, worth banking as a unit:

- `hideHealthBar()` hides **bar and name together**.
- `showHealthBar()` re-shows the name **only if `displayName.text != ""`**.
- `setDisplayName(str, color)` with `str != ""` sets `displayName.y = healthBar.y` when the
  bar is visible, else `healthBar.y + 10` — so an un-barred overworld plate sits 10 px lower.
- `NPC.updateHealthBar()` calls `hideHealthBar()` at `HP <= 0`, `showHealthBar()` otherwise.
- **`MCSCharacter.updateHealthBar(fraction)` → `healthBar.bar.width = fraction * 60`.**
  The enemy HP bar is **60 px wide at full**, a hard number for the recreation that appears
  in no claim and no ledger row.

Cite: `MCSCharacter.as:1419-1447`, `NPC.as:1182-1194`, `Obj_NPCAggro.as:74-82`,
`Obj_NPCProcGen.as:49-51`.

### N4 · A2 — there is a **second** level→stat formula, and it is a dynamic rubber-band that rescales bosses off the *player's* stats

This is the largest thing missed, and it partly overturns ledger blocker ①'s framing
("*the* enemy level→stat formula"). `EnemyElite` (parent of the elite/boss branch,
`isBoss = true`, `aiCounterMax = 12`) **overrides `setLevel` entirely** — no `0.9` factor,
no `lvl<=10` clamp, `xp = lvl*5 + 45` not `lvl*2 + 20`:

```as3
// EnemyElite.as:22-75
var lvldiff:int = lvl - playerLVL;
var hitsToKillBoss:int   = 10 + lvldiff;   if(hitsToKillBoss <= 3)   hitsToKillBoss = 3;
var hitsToKillPlayer:int = 18 - lvldiff;   if(hitsToKillPlayer <= 0) hitsToKillPlayer = 1;
var playerhit:int = playerATK - defense;
if(playerLVL <= 10 && playerhit < 1)            playerhit = 1;
else if(playerLVL <= 20 && playerhit < playerLVL/8) playerhit = playerLVL/8;
else if(playerLVL <= 30 && playerhit < playerLVL/6) playerhit = playerLVL/6;
else if(playerhit < playerLVL/4)                    playerhit = playerLVL/4;
var bossHP:int = playerhit * hitsToKillBoss;
if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); updateHealthBar(); }
var bosshit:int = playerHP / hitsToKillPlayer;
var bossATK:int = bosshit + playerDEF;
```

Boss HP is set so the player needs `10 + lvlDiff` hits (floor 3); boss ATK is set so the
player dies in `18 - lvlDiff` hits (floor 1). Authored `<hp>` is only a floor.

**This is the missing source for the repo's own INFERRED derivation.**
`src/config/combat-sim.ts` documents `ENEMY_BASE` as *"B4 makes hp and minDamage DERIVED at
spawn from the player's own stats (`enemyHP = effPlayerDmg × K`) … the pre-scale floor the
source's `max(scaledBase, …)` compares against"* — and calls it INFERRED with a standing
veto. `bossHP = playerhit * hitsToKillBoss` **is** `effPlayerDmg × K`, and
`if(bossHP > maxhp)` **is** the `max()`. K is now known: `K = 10 + (enemyLvl − playerLvl)`,
floored at 3. That INFERRED comment can be promoted to A2 (labelled v0.682-ANDROID).

### N5 · A2 — eight death animations keyed to *how* the killing blow landed

`99_MCSCharacter_HumanAnimationData.bin` carries, with durations:
`death 38 · deathenemy 23 · deathinhalf 28 · deathnohead 31 · deathnohand 25 ·
deathbyarrow 21 · deathwitharrow 23 · deathdowned 7`.

Dismemberment-specific deaths — cut in half, beheaded, disarmed, arrow-killed. This is the
render-side partner of the `behead → damage *= 1.5` rule (claim 12) and of the archer
knockdown gate (claim 11), and it is a far richer death system than the single
`deathdowned 7` the surveyor reported. Bears on art-anim as much as on enemies-ai.

---

## Score

The surveyor scored **78** against the ledger's 34. I do not contest the direction — five
blockers really do resolve on disk and I verified each one. I would land **72–75** rather
than 78, for three reasons the surveyor did not price in:

1. **Blocker ① is closed on the trash roster but half-open on bosses.** N4 shows a second,
   rubber-banding formula the unit never mentions. Two formulas, one found.
2. **The nameplate work is less finished than claims 2–3 imply** — five colours not two, a
   mechanism that is a string-gate not a mode switch, and a bar width nobody had.
3. **The Android-parity discount is real but now over-charged.** N1 and N2 discharge it for
   two constants using v0.717 frames, which is the surveyor's own stated unlock condition.
   Parity is no longer a uniform tax on every number.

**No claim in this unit was fabricated, and that is worth more than the score.**
