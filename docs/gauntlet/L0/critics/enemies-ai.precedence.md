# enemies-ai — PRECEDENCE CRITIC (blind review)

Reviewer lens: **LENS 3 — precedence / stale-claiming.** Question asked of every claim:
does it import a doc statement that a later measurement, ruling, or frame overturned;
does it cite a doc where a frame would settle it directly; does it cite the *base* rule
where a *later override* wins?

Every verdict below was reached by opening the artifact myself. No verdict rests on the
surveyor's text.

---

## Headline

**The stale-doc failure mode this lens hunts is ABSENT from this unit.** 20 claims, and
not one imports a superseded ledger/measurement statement. 17 of 20 are A2 cites into
`reference/extracted/` or the Android decompile, 2 are A1 frames the surveyor actually
cropped, 1 is a live A3 test run. The one doc-derived claim
(`shipped-config-hp150-is-stale`) *corrects* a stale ledger line rather than importing it,
and the surveyor volunteered the `v0.682-ANDROID vs v0.717-web` parity gap as
`STILL_UNHELD` instead of hiding it. On my own lens this unit is clean.

**But a second, structurally identical failure showed up in its place: PRECEDENCE INSIDE
THE SOURCE.** Three claims cite an AS3 **base class** as if it were the whole rule, when a
**subclass override later in the same tree wins**. That is the same error shape as citing
`REBUILD_READINESS.md §3` after the 2026-07-25 measurement reversed it — the surveyor read
the first definition it found and stopped. Details in R1/R2/R3 below.

Net: **5 refuted (4 material, 1 minor), 15 held.** All five refutations are corrections to
otherwise real findings, not kills. The re-score of 78 is defensible in direction; the four
stated caps are honest. I would not move it much — the corrections cut mostly into blockers
③ and ① that the surveyor claimed as fully dead, which argues 78 is if anything slightly
generous, not too harsh.

---

## R1 — `level-stat-formula` — REFUTED (material). **ELEVEN classes override `setLevel`.**

`NPC.as:239-260` is quoted verbatim and is exactly right — I opened it. The failure is the
word "the". `NPC.setLevel()` is the **base**, not the formula:

```
$ grep -rn "function setLevel" reference/decompiled/shs3_android/scripts/*.as
EnemyKanjiGuardian.as:48   EnemyOgre.as:51   EnemySpearElite.as:32   EnemyStag.as:48
EnemyTrainingDummy.as:23   EnemyWolfAlpha.as:52   FriendlyArcher.as:21  FriendlyElite.as:23
EnemyElite.as:23           EnemyPlayer.as:57   FriendlySpearElite.as:19   NPC.as:239
```

What the overrides actually do (own reads):

| class | ×0.9 sub-21 | 1/1/1 clamp ≤10 | xp | note |
|---|---|---|---|---|
| `NPC` (base) | yes | **yes** | `lvl*2+20` | the claimed formula |
| `EnemyPlayer.as:57-88` | **no** | **no** | `lvl*5+45` if boss/duelist else `lvl*2+20` | `minDamage = damage * factor` |
| `EnemyElite.as:23-40` | **no** | **no** | `lvl*5+45` | + `hitsToKillBoss = 10 + lvldiff` autobalance |
| `EnemyKanjiGuardian.as:48-59` | **no** | **no** | `lvl*5+45` | + `hitsToKillBoss = 5 + 8 + lvldiff` |
| `EnemyOgre.as:51-53` | — | — | — | **the override is EMPTY — ogres do not level-scale at all** |

This matters most for `<ai>9` → `EnemyPlayer(false,false)`, which is the **largest single
bucket in `npcdata.xml` (73 of 425 rows** — I re-derived the histogram, it matches the
surveyor's). So the clamp the claim calls "a hard 1/1/1 clamp" does not apply to the most
common enemy in the file.

Consequence for the lane: the claim's own `lane_impact` — *"the lvl≤10 clamp is the
mechanical CAUSE of the SESSION-11 finding that mobs die in one hit, and it retro-justifies
`ENEMY_BASE.hp = 1`"* — **does not follow**, and it also contradicts the surveyor's own
claim 20: you cannot retro-justify a number measured off v0.717 video with a v0.682 Android
clamp that the surveyor itself declared unestablished for the web build.

Blocker ① is still substantially advanced. It is not dead; it is **twelve formulas, one of
which is a no-op.**

---

## R2 — `nameplate-level-4-bandit` — REFUTED (material). No doc/frame conflict existed.

I opened `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg` (note: the corpus
frame is **1024×576**, not 1080p) and the observation is real. I went further and sampled
the glyph pixels:

- `BANDIT (4)` core glyph pixels: **(138,3,0) / (133,4,0)** → 0x990000 after JPEG
- `GUEST` core glyph pixels: **(244,213,61) / (240,208,48)** → 0xFFCC00 after JPEG

Those land exactly on the AS3 constants: `EnemyPlayer.as:774 namecolor = 10027008`
(**0x990000**) and `MCSPlayer.as:245 setDisplayName(StatsManager.charname, 16763904)`
(**0xFFCC00**). Frame and payload agree to the constant. That is a *better* finding than
the one claimed, and I have banked it as `enemies-ai/nameplate-colour-table` below.

Three things are wrong with the claim as written:

1. **The stated crop does not contain what the quote says is in it.** Crop given:
   `(340,320)→(900,480)`. Measured positions in that frame: `GUEST` glyphs at
   **x 200-207, y 334-338**; `TERRITORY (22,51) / SECTOR (1,2)` at **x≈830-965, y≈270-290**.
   Both are outside the crop on the x- and y-axis respectively. §0 requires stating the crop
   *you used*; a quote that describes the whole frame under a narrower crop label is
   mis-cited.
2. **"the frame wins over npcdata, and that is what makes the 1-HP clamp bite" invents a
   conflict.** There is none to adjudicate. `npcdata`'s `<lvl>` is the authored base;
   `questdata` carries **171 `<lvl>` overrides spanning 1..80** (I re-derived from
   `docs/gauntlet/L0/index/questdata.json`), and `NPCManager.as:869-881
   createEnemy(...)` applies `actor.setLevel(lvl)` **only when `lvl != 0`**. A level-4
   Bandit is the designed path, not a measurement beating a document. Invoking the
   frame-wins invariant where the source already predicts the frame dilutes an invariant
   that exists for real conflicts.
3. **The asserted HP is wrong for the plausible class.** `npcdata` id 16 is a Bandit with
   `<ai>9</ai>` → `EnemyPlayer` → **no clamp**: hp 15 × (4/10) = **6**, not 1. The frame
   cannot distinguish ids 11-16, so no HP figure is derivable from it at all.

---

## R3 — `combat-hud-drops-the-nameplate` — REFUTED (material). It is per-CLASS, not per-MODE.

The observation holds and I confirmed it on a **second** frame the surveyor did not use:
`seg-11/frames/frame_0018.jpg` (2 frames earlier, normal dungeon lighting, no red wash) —
an archer and a ninja, bare green HP bar over the archer, no name on either, gold `GUEST`
sitting on the same baseline as the player's own bar. That last detail corroborates
`MCSCharacter.as:1542-1548` (`displayName.y = healthBar.y` when the bar is visible).

The **mechanism** is refuted. There is no mode switch:

- `grep -rn "setDisplayName" …/scripts/` over all **559** classes: the only `""` clears are
  `MCSActor.as:1096` / `MCSPlayer.as:3944` **`redFreeze()`** (a boss-freeze effect) and
  decorative tavern patrons in `BG_Loader.as`. **Nothing clears names on combat entry.**
- `EnemyElite.as:114` and `EnemyKanjiGuardian.as:59` set
  `xml.name + " (" + level + ")"` in **white (16777215)** during `init`/`setLevel` — i.e. in
  combat. `EnemyPlayer.as:776` does the same in white or 0x990000 by side.
- The plain classes — `EnemyKnife`, `EnemyKatana`, `EnemyArcher`, `EnemySpear`,
  `EnemyShield`, `EnemyZombie`, … — **never call `setDisplayName` anywhere.**

That is why the surveyor's *own* seg-10 overworld frame shows plated bandits (`ai 9` =
`EnemyPlayer`) — the same "mode" it says drops plates. The `lane_impact` guidance —
*"A recreation that shows names+levels during combat is wrong"* — is **actively harmful**:
it would strip the nameplate off every elite, boss, guardian and duelist.

---

## R4 — `one-statline-six-movesets` — REFUTED (material). They differ in more than `<ai>`.

The insight (one archetype × N AI classes) is right and valuable. "differing in exactly one
field, `<ai>`" is false. My own structural diff of the six `<npc>` blocks:

| id | `<ai>` | also differs |
|---|---|---|
| 11 | 1 knife | *(base)* `<weapon>13109` `<prop1>0` |
| 12 | 2 archer | `<weapon>13221` **`<prop1>2`** |
| 13 | 3 katana | `<weapon>` = **39-id random pool** `13100,13101,…,13011` |
| 14 | 4 spear | `<weapon>13220` |
| 15 | 5 shield | `<weapon>13107,13111` **`<prop1>1`** |
| 16 | 9 player-mirror | 39-id pool **+ a `<skills>` block** `1003 lvl1 / 1004 lvl5` |

The pairing swaps the **weapon and the prop slot** alongside the AI class, and the
player-mirror uniquely carries skills. A builder implementing "only `<ai>` changes" ships an
archer with no bow and a spearman with no spear — a visible 1:1 break, and precisely the
class of error this lane exists to prevent.

---

## R5 — `telegraph-active-recovery-frames` — REFUTED (material). The universal is false, and "active" is not authored.

Every number quoted is exactly right — I re-parsed all 18 `*AnimationData.bin` blobs:
**471 `<anim>` total, 158 in `99_MCSCharacter_HumanAnimationData.bin`**, and
`heavyhorizontalslash_parta 6 / _partb 9 l="1" / _partc 7`,
`balancedhorizontalslash 4/9/7`, `katanaattack 10`, `stabattack 14`, `downstab 15`,
`ninjaslash 8`, `pullbackarrow 9`, `pullbackarrow_full 15`, `firearrow 1`,
`arrownormalpose 22` all verbatim.

Two things are wrong:

1. **"every stance attack ships as three named parts" is false.** The canonical stance
   slashes are **four** parts (`heavy_horslash_parta/b/c/**partd**`, same for light,
   balanced, reversed, dual), two are **five** (`balancedjumpslash_parte`,
   `heavyjumpslash_parte`), **`lighthorizontalslash` d=3 has NO parts at all**, and every
   creature/weapon attack is a single anim (`katanaattack 10`, `stabattack 14`,
   `spear_swing 21`, `gob_attack 27`, `zom_attack 20`, `guardian_swingdown 14`,
   `bear_attack 18`, `boar_attack 16`). Measured: **157 of 471 anims carry `_part`**, i.e.
   two thirds of the library is unsegmented.
2. **Nothing in the animdata labels an active/damage window.** The blobs give
   `i=` (name), `d=` (duration), `l=` (loop) and 21-part keyframes — no hitbox, no
   damage-frame flag. `"_partb (looping = active hold)"` is the surveyor's inference, not an
   artifact statement. So blocker ③'s *telegraph* and *recovery* halves are strongly
   advanced; its **active** half is not closed by this artifact.

---

## Minor corrections (claims stand)

- **`ai-id-to-class-map`** — 38 cases confirmed, histogram reproduced exactly. But the
  count is **31 distinct `Enemy*` + 3 `Friendly*` = 34 distinct classes across 38 cases**
  (`EnemyPlayer` ×3 at cases 0/9/14, `EnemySpearElite` ×2 at 28/37) — not "34 `Enemy*` plus
  3 `Friendly*`". The "34" is the total, double-counted.
- **`creature-and-boss-roster`** (refuted, minor) — every **number** is exact (I checked all
  eight cited rows, plus `ai 26` ×8 = seven at lvl8/hp40 and one at lvl30/hp150; 96
  `<skills>` / 647 `<skill>`; skill ids 1000-1501; mastery set exactly {1,2,3,5,10}). But
  three rows are labelled with the **AI class name, not the string-table name**, which is
  the one thing S0-3 exists to stop: id 67 resolves to **"Wolf"** (class `EnemyWolfAlpha`),
  id 77 to **"Oni"** (class `EnemyOgre`), id 89 to **"Undead"** (class `EnemyZombie`).
  Shipping "Ogre" on screen where the game says "Oni" is a 1:1 break. Also
  `ls *Projectile*.as` = **38**, not 39.
- **`arrow-arc-physics`** — held in full, and there are in fact **two** integrators:
  `initArrow` sets `breakable = true` (the ballistic branch quoted), and `doBreak()` flips
  it false and hands the arrow to a tumbling branch (`rotation ±20/frame`,
  `velX = random*30-15`, `velY = -(random*5+5)`) that despawns off-stage instead of at
  ground. Additive, not a refutation.
- **`boss-names-are-procgen`** — held exactly (male 398 with `Kano` at index 79; female 291
  with `Shizuka` at 225; samurai family 36 with `Hachisuka` at 6 and `Honda` at 10;
  `Zabuza`/`Hotaru` = 0 across payload, decompile and `strings.json`). Small scope note:
  `getSamuraiName` drives **all** `NPCTYPE_SAMURAI` procgen, not only bounty targets;
  `isBountyTarget` merely swaps in NPC 18's statline — and NPC 18 resolves to **"Bandit
  Leader"**.
- **`stagger-is-a-counter-not-an-anim`** — held, and `PARTIAL` was the honest verdict. I
  independently enumerated the 158 human anim names: the hit-reaction set is exactly
  `gotlaunchedupwards_parta/b/c 4/9/7`, `gotlauncheddowned 18`, `gotlauncheddownedend 1`,
  `downed 23`, `downedup 4`, `downedup2 25`, `flipupfromdowned 21`, `deathdowned 7` — **no
  `gothit` / `flinch` / `stagger` anim exists.** Line cite drifts by one (`canHit` is
  297-300, not 296-299); `gotHitCounter = 12` is exactly `NPC.as:462`.

## Held clean (opened and reproduced)

`per-enemy-hp` (403/406/394 by my own `grep -c`) · `engagement-ranges` (all nine constants
plus `aiCounterMax 24` base / 12 in `EnemyElite`, `FriendlyElite`, `EnemyPlayer`,
`MCSPlayer`) · `spawn-geometry` (118 wave, wave-`<x>` = 12+97+49+2 = **160**, −400..2000,
171 `<lvl>` 1..80, 75 `<fatal>`, 169/70/2) · `undead-rule-is-not-reflect` (`reflect` = 0
across 559 classes; `EnemyZombie.as` `if(!behead) damage /= 2`; `NPC.as:453` ×1.5;
`EnemyJiangSi.as:310` ×1.5 with no halving) · `no-squad-coordination` ·
`no-per-enemy-chi-or-speed` (`<chi>` = 0, `<speed>` = 0; `XMLNpc.as` defaults
chi 1 / speed 1 / attack 1 / defense 0) · `kill-rewards-close-two-economy-blockers`
(66 `<reward>` / 131 `<loot>`; loot branch, `calcXP`, `getGreyLevel`, `getZeroDifference`
all verbatim; economy ledger line 215 quoted exactly) · `tengu-is-not-in-the-payload` (0
across six files + decompile + strings.json) · `shipped-config-hp150-is-stale` (**I ran it**:
`npx vitest run tests/config-values.test.ts tests/enemyModel.test.ts` → *Test Files 2
passed / Tests 71 passed*; assertion `hp: 1` at `tests/config-values.test.ts:466-474`;
`git log -S"hp: 150"` → `335e615`) · `web-build-parity` (652 files in
`shs3_payload/scripts`, **0** matching `enemy|npc`; `StatsManager.as:30` clientVersion
0.682) — a correct and valuable `STILL_UNHELD`.

---

## New finding banked

**`enemies-ai/nameplate-colour-table` (A1 + A2, HELD).** The nameplate is a **five-value
colour table keyed by relationship, not a two-value hostile/player rule**, and frame and
payload agree on the constants:

| colour | value | who | cite |
|---|---|---|---|
| gold `0xFFCC00` | 16763904 | player **and all three `Friendly*` classes** | `MCSPlayer.as:245`, `FriendlyArcher.as:57`, `FriendlyElite.as:64`, `FriendlySpearElite.as:55` |
| white `0xFFFFFF` | 16777215 | elites, Kanji Guardian, same-side duelists/bosses | `EnemyElite.as:114`, `EnemyKanjiGuardian.as:59`, `EnemyPlayer.as:771` |
| dark red `0x990000` | 10027008 | opposing-side duelist/boss | `EnemyPlayer.as:774` |
| blue `0x0099FF` | 39423 | procgen quest-giver | `Obj_NPCProcGen.as:51` |
| khaki `0xC0AC4B` | 12627019 | **marked** quest-giver (also gets `showIcon(2)`) | `Obj_NPCProcGen.as:60` |

Frame check (`seg-10/frames/frame_0013.jpg`, glyph-pixel sample): `BANDIT (4)` = (138,3,0);
`GUEST` = (244,213,61). Format is literally `name + " (" + lvl + ")"`. Plain mob classes get
**no** plate at all. This replaces the ledger's single `nameplate (N)=level` bullet **and**
the surveyor's "hostile red / player gold" simplification.
