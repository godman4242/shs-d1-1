# enemies-ai — HUNTER CRITIC (blind)

Reviewer opened every artifact itself. No verdict below rests on the surveyor's text.
Headline: **the survey is unusually well-grounded on the Android build — 15 of 20 claims
survive verbatim re-derivation — but its single STILL_UNHELD is WRONG, and it is wrong in
the direction this lane exists to catch.** The web v0.717 gameplay code IS on disk. The
surveyor mistook *name obfuscation* for *code absence*.

---

## ⛔ FATAL — `enemies-ai/web-build-parity` is REFUTED

The claim: *"the web v0.717 payload decompile holds 652 classes and zero Enemy*/NPC*
gameplay classes, so nothing on disk establishes that v0.717 kept these numbers."*

The surveyor's method was `ls reference/decompiled/shs3_payload/scripts | grep -ci "enemy\|npc"` → 0.
That test cannot work: **the web build is name-obfuscated.** No class is *named* `Enemy`
anything. The gameplay code is all there, under `§…§` mangled names:

```
$ find reference/decompiled/shs3_payload -name "*§*.as" | wc -l
667
```

`reference/decompiled/shs3_payload/scripts/§1t68s0§.as` **is the web build's `NPC` class.**
Its `setLevel` is semantically identical to Android `NPC.as:239-260`:

```as3
// §1t68s0§.as:258-279  (WEB v0.717)
public function setLevel(param1:int) : *
{
   var _loc2_:Number = param1 / this.level;
   if(param1 <= 20) { _loc2_ *= 0.9; }
   this.level = param1;
   this.damage *= _loc2_;
   this.defense *= _loc2_;
   this.§1t3257s0§ *= _loc2_;          // maxhp
   this.§1t3308s0§(this.§1t3257s0§);   // setHP
   this.§1t3301s0§();                  // updateHealthBar
   this.xp = param1 * 2 + 20;
   if(param1 <= 10) { this.damage = 1; this.defense = 1; this.§1t3257s0§ = 1; … }
}
```

Further parity, measured this pass:

| constant | Android v0.682 | Web v0.717 | parity |
|---|---|---|---|
| `aiCounterMax = 24` | `NPC.as:22` | `§1t68s0§.as:22` (same line) | ✅ |
| hit lockout `= 12` | `NPC.as:462` | `§1t68s0§.as:483` | ✅ |
| `xp = lvl*2+20` | `NPC.as:252` | `§1t68s0§.as:271` | ✅ |
| `GRAVITY:Number = 3` | `Projectile.as:8` | `§1t128s0§.as:8` (same line) | ✅ |
| `ttlMax:int = 48` | `Projectile.as:22` | `§1t128s0§.as:22` (same line) | ✅ |
| `atan(velY/velX)*57.2727+180` | `ArrowProjectile.as:54` | `§1t137s0§.as:64` | ✅ |
| ai dispatch switch | `switch(xml.ai)` cases **0..37** | `switch(_loc6_.ai)` cases **0..38** | ⚠️ **diverges** |
| archer solve gravity | `Projectile.GRAVITY` always | overridden to **1.5** on knockdown | ⚠️ **diverges** |

**Consequence for the score.** The rationale caps the re-score at 78 with "(1) build parity
is unestablished and this is the dominant residual risk." That reason is now gone: parity is
*demonstrated* for every core constant, and where it breaks it breaks *measurably*. Item (1)
of the cap should be struck. Items (2) Tengu and (3) unwritten behaviour classes stand.

---

## ⚠️ MATERIAL — two claims marked HELD are wrong for the 1:1 target

### `enemies-ai/arrow-arc-physics` — the web archer halves gravity on knockdown shots

Android `EnemyArcher.as:277` computes the solve with `Projectile.GRAVITY` unconditionally,
then rolls `doLaunch` *afterwards*. The web build inverts the order and **overrides gravity**:

```as3
// §1t4542s0§.as:287-299  (WEB v0.717) — _loc1_ is the knockdown roll, computed FIRST
var _loc6_:Number = §1t128s0§.§1t12543s0§;   // Projectile.GRAVITY == 3
if(_loc1_) { _loc6_ = 1.5; }                 // ← NO ANDROID EQUIVALENT
var _loc7_:Number = _loc6_ * Math.abs(_loc4_ - _loc2_) / 0.866;
…
var _loc10_:Number = (_loc5_ - _loc3_ - 0.5 * _loc6_ * _loc9_ * _loc9_) / _loc9_;
```

Knockdown arrows in the game the videos show fly a **flatter, faster arc** than the claim's
"GRAVITY = 3" describes. The ±4 jitter, the 0.866 launch factor, the 60px muzzle offset and
the level-gated knockdown ladder (>50 1-in-2 · >20 1-in-3 · >10 1-in-4) are all confirmed
verbatim in both builds. Only the gravity term diverges.

### `enemies-ai/ai-id-to-class-map` — miscounted, and Android-only

Two defects:

1. **Arithmetic.** "instantiates 34 named `Enemy*` classes plus 3 `Friendly*`" implies 37.
   Measured on Android: **31 unique `Enemy*` + 3 `Friendly*` = 34 total** across 38 cases
   (`EnemyPlayer` ×3, `EnemyWolf` ×2, `EnemySpearElite` ×2 account for the 4 extra cases).
   The 34 is the *total*, not the `Enemy*` count.
2. **Wrong build.** The web v0.717 switch runs **cases 0..38 — 39 cases, 36 unique classes**:
   ```
   $ sed -n '615,732p' §1t1543s0§.as | grep -o "case [0-9]*:" | sort -u | wc -l
   39
   ```
   v0.717 carries **two more behaviour classes and one more ai id** than v0.682. A
   recreation scoped to "38 behaviours" under-builds the actual target.

The claim's *load-bearing* assertion — `<ai>` is a class index, not a difficulty tier, so the
shipped `AI_TIERS easy|normal|hard` models a shape the original does not have — **holds
in both builds.**

---

## ⚠️ MINOR — one A1 crop does not contain what it says it contains

`enemies-ai/nameplate-level-4-bandit` states crop `(340,320)→(900,480)` and reports the gold
`GUEST` label and the `TERRITORY (22,51) / SECTOR (1,2)` readout as visible in it.

I ran exactly that crop (LANCZOS ×3). It contains: `BANDIT (4)` in red all-caps at top-left,
one kasa-hatted bandit, two stacked bandits right under overlapping red labels. **No gold
GUEST. No HUD readout.** Measured from the full frame (`frame_0013.jpg` is **1024×576**, not
1080p):

- gold `GUEST` sits at **x≈189-232, y≈314-326** → left of the crop's x=340 edge
- `TERRITORY/SECTOR` sits at **x≈849-984, y≈273-286** → above the crop's y=320 edge
- the claim says "the player at x≈430" — **x≈430 is a *bandit*.** The player is at x≈205.

**The substance is correct and I confirmed it in the full frame**: hostiles carry a red
all-caps name + parenthesised level, the player carries a gold `GUEST`, and the frame's
level 4 does contradict `npcdata.xml:277 <hp>15</hp> / :276 <lvl>10</lvl>` — **the frame
wins**, routing that bandit through `setLevel(4)` and the ≤10 clamp to a real on-screen HP
of 1. Only the crop rectangle and the player x-coordinate are wrong. Corrected cite below.

### `enemies-ai/engagement-ranges` — one of eleven cites is a talk radius, not aggro

All 18 line cites reproduce **exactly** (Knife 50/50, Katana 100/100, Spear 400/400/100/50,
Shield 50/50/100, Ogre 100/40, Wolf 100>d>50 and 100-250 at 1-in-3, Archer 100/100, JiangSi
50, `aiCounterMax = 24`). One does not belong:

```as3
// Obj_NPCProcGen.as:131-136
override public function isInInteractRange(mc:MovieClip) : Boolean {
   if(this.questCompleted) { return false; }
   return abs(this.npc.mcs.x - mc.x) < 100;
}
```

That is a **quest-NPC talk radius gated on `questCompleted`** — "can I interact with this
NPC", not "do I aggro". Listing it as "overworld roamer trigger 100px" inside a set of
combat engagement distances mis-attributes it. Everything else in the claim stands.

---

## ✅ CONFIRMED — re-derived independently, no correction

| claim | what I ran |
|---|---|
| `level-stat-formula` | read `NPC.as:239-260` verbatim; **+ web parity above** |
| `per-enemy-hp` | `grep -c "<hp>"` → **403**; `npcdata.xml:3121-3128` exact (id 144, lvl 80, hp 1000) |
| `one-statline-six-movesets` | parsed ids 11-16 → identical statline, `<ai>` = 1,2,3,4,5,9; all six line cites exact |
| `telegraph-active-recovery-frames` | summed all 18 `*AnimationData.bin` → **471 exactly**; `99_Human` = **158**; `heavyhorizontalslash_parta/b/c` = 6 / 9 `l="1"` / 7 — every duration exact |
| `spawn-geometry` | 118 `<wave>`, **160 `<x>` inside wave blocks, range -400..2000**, 171 `<lvl>` range 1..80 — all reproduced; `questdata.xml:77-88` is precisely the quoted block |
| `undead-rule-is-not-reflect` | `grep -ril reflect` over the Android tree → **0 files**; behead switch + `damage /= 2` verbatim at `EnemyZombie.as:495-517`; `damage *= 1.5` at `NPC.as:451-453` |
| `shipped-config-hp150-is-stale` | ran both suites: **57 passed**, **14 passed**; assertion at `tests/config-values.test.ts:466-474` exact; `git log -S"hp: 150"` → **335e615 2026-07-26** |
| `boss-names-are-procgen` | parsed the tables myself: Hachisuka **idx 6**, Honda **idx 10** (36 surnames), Kano **idx 79**, Shizuka **idx 225** (291 female) |
| `creature-and-boss-roster` | all 7 npcdata line cites exact (67/5056 lvl15 hp100 · 77/5071 lvl80 hp40 · 89/5073 lvl30 hp150 · 165/5090 lvl10 hp200 · 186/5107 lvl30 hp600 · 800/5118 lvl23 hp800 · 802/5119 lvl10 hp30) |
| `no-squad-coordination` | `getNearestEnemy` at `NPCManager.as:1360` verbatim — per-NPC nearest-target, no shared table |
| `no-per-enemy-chi-or-speed` | `grep -c "<chi>"` → **0**; `grep -c "<speed>"` → **0**; `XMLNpc.as` defaults verbatim |
| `kill-rewards-…` | 66 `<reward>` / 131 `<loot>`; `calcXP` verbatim at `NPC.as:166-189`; loot dispatch verbatim at `NPC.as:~837-855` |
| `combat-hud-drops-the-nameplate` | **my own crops + full frame**: 5 thin bars (4 green + 1 dim tan far right), zero names, zero levels; gold `GUEST` the only fighter text; `16/20` · `15/15` · `CANNOT CHANGE STANCE` · `AUTO SLASH OFF` all present |

Minor descriptive slip on the last row: of the two bow-carrying figures at the right, only
the far-right one is kasa-hatted; the other is bare-chested and bare-headed. Does not touch
the claim.

---

## 🎯 HUNTER RESULT — Tengu: the under-claim hunt FAILED, so the survey is right

I tried hard to overturn `enemies-ai/tengu-is-not-in-the-payload`. Searched, all zero:

- all 5 extracted XMLs (`npcdata`, `itemdata`, `questdata`, `skilldata`) + `ui_strings.txt`
- **all 27 `reference/extracted/bindata/` files** (`strings` piped to grep)
- **all 42 `reference/extracted/android/` blobs**
- `shs1`, `shs2`, `shs3_bin`, `shs3_loader`, `shs3_stage2`, `shs3_stage3`, `shs3_payload`
- `docs/gauntlet/L0/index/strings.json` (the 2,533-entry table) and `resolved_names.json`
- `docs/gauntlet/L0/index/frames.json`

There is also **no Tengu animation blob** — the 18 `MCSCharacter_*AnimationData.bin` cover
Deer/DualStance/Guardian/Wolf/HumanSpear/Goblin/HeavyStance/Boar/LightStance/Ogre/Bear/
Skills/Human2/ReversedStance/Horse/BalancedStance/Undead/Human. `Guardian` is held
(`102_MCSCharacter_GuardianAnimationData.bin`, 16 anims; `NPCManager.as:628`; `npcdata.xml:4111`).

**`Tengu` in the ledger's Ready taxonomy is a ledger invention.** The survey's PARTIAL is
the correct answer and is now backed by an exhaustive negative rather than a five-file grep.

---

## 🔎 NEW — things the survey missed

**N1 · Part-specific death animations (A2).** The 158 human anims carry a dismemberment set
the survey never mentions while discussing behead: `deathnohead` d=31, `deathnohand` d=25,
`deathinhalf` d=28, `deathwitharrow` d=23, `deathbyarrow` d=21, alongside plain `death` d=38
and `deathenemy` d=23. This is the *visual* half of the `behead` ×1.5 / zombie head-gate
mechanic and it is fully authored. `99_MCSCharacter_HumanAnimationData.bin`.

**N2 · `stagger-is-a-counter` is under-claimed — it should be HELD, not PARTIAL.** I
independently confirmed all three legs: `gotHitCounter = 12` (`NPC.as:462`, and web
`§1t68s0§.as:483`), `canHit()` gating (`NPC.as:296-299`), and **zero** stagger/flinch/gothit
names among the 158 — only the launch chain, whose durations are all exact as quoted
(`gotlaunchedupwards` 4/9/7, `gotlauncheddowned` 18, `downedup` 4, `downedup2` 25,
`deathdowned` 7). An A2 cite is admissible under §0; "wants frame-side confirmation" is a
CONTRACT-stamping question, not a holding question.

**N3 · The survival-mode engine is in the wave code (A2).** `NPCManager.as:381-388`:
`if(currentWave >= waveCount) { if(endless && !StageManager.isSurviveCleanUp()) { currentWave -= 2; nextWave(); } }`
— an `endless` flag that rewinds and replays waves. This is the runtime behind Stage-0's
blob 119 `<survivalmodedata>`, the game mode absent from all 12 ledger systems.

**N4 · Friendlies scale to the *player's* level (A2).** `FriendlyArcher.as:58`,
`FriendlyElite.as:70`, `FriendlySpearElite.as:56` all call
`this.setLevel(StatsManager.getLevel())`. Enemies take an authored `<lvl>` override through
`NPCManager.createEnemy(…, lvl)`; allies take the player's. Different scaling rule per side.

---

## Score

The survey's 78 was capped by four things. **(1) is refuted** — parity is demonstrated, not
unestablished. **(2) Tengu stands** (I strengthened it). **(3) unwritten behaviour work
stands, but is bigger than stated** — 36 classes / 39 ai ids on the web build, not 34/38.
**(4) is under-claimed** — the stagger finding is fully A2-held.

Net: the evidence base is stronger than the survey credits, and the two divergences I found
(archer gravity 1.5, +1 ai case) are *specific and fixable*, not diffuse risk. **A re-score
above 78 is justified — but every ported number must now be labelled per-build, because
v0.682 and v0.717 provably differ in at least two places in this system alone.**
