# L0 CRITIC — `progression` — LENS 2 (HUNTER)

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened this pass. Frames were extracted by me with `ffmpeg` from
`reference/videos/zFtCaTO0_1M.mp4`; crops and scales are stated.

**Headline: the survey is unusually clean.** 17 of 19 claims survive with exact
cites. I could not refute a single substantive payload claim. The two verdicts I
*do* overturn are both **under-claims** — the surveyor's two honest "we don't have
it" answers are both recoverable, and I recovered them. That is exactly the failure
this lane exists to catch.

**Two material contaminants** made it through, both the same shape: an
**ANDROID-only** fact presented without a build label, inside a lane whose own
ruling is "port progression from the WEB payload."

---

## 1. Verification of the load-bearing cites

Every web (`shs3_payload`) line number the surveyor gave is **exact**. Android line
numbers drift by +1 in five places (harmless — the quoted text is verbatim and
inside the cited range).

| What | Cite I opened | Result |
|---|---|---|
| expArray, web | `§1t1523s0§.as:364` | 99 entries; `[11]=37400 [20]=108000 [40]=507300 [60]=1508800 [80]=4285800 [98]=29395800` |
| expArray, android | `StatsManager.as:78` | **byte-identical** (list compare in Python: `True`) |
| expArray, 2nd web copy | `§1t29s0§.as:28` | identical |
| per-point grants, web | `§1t5957s0§.as:3394,3406,3414,3422,3434,3443` | `+10 / +5 / addMaxAP(5) / +3 / +3 / +3` — exact |
| per-point grants, android | `InventoryUI.as:2417–2453` | `+5 / +5 / +1 / +1 / +1 / +1` — exact |
| per-stat caps | `§1t5957s0§.as:3341–3346` | exact, verbatim |
| start pools + respec | `§1t1523s0§.as:2559–2580` | exact (function ends 2580, not 2578) |
| SP closed form | `§1t1523s0§.as:2598` | exact |
| level-up grants | `§1t1523s0§.as:2074–2075` | exact |
| DEF flat, web | `§1t99s0§.as:3284–3291`, `:3484–3488` | exact |
| SPD reload / cooldown / reach, web | `§1t1523s0§.as:2276`, `:2289–2295`, `:2344–2347` | exact — clamp **600**, `/600` |
| SPD, android | `StatsManager.as:1841`, `:1855–1861`, `:1914–1917` | clamp **300**, `/300` — divergence real |
| quest XP | `questdata.xml:214–216`, `:411–413` | exact; my count: **69 rows, 100–3000** |
| skill gates | `skilldata.xml:257`, `:1640` | exact; my count: **33 gates, 3–80**; 52 `req/has/id` |
| test | `npx vitest run tests/xp.test.ts --reporter=verbose` | 11/11 pass; both quoted test names verbatim |

### The unlock ladder reproduces exactly
I rebuilt it independently from `skilldata.xml` joined to
`docs/gauntlet/L0/index/resolved_names.json`. It matches the surveyor's 33-gate
list **name for name, level for level** — L3 Roll … L80 Mass Shadow Clone. No drift.

### The frame arbitration holds
`ffmpeg -ss 1600`, `crop=iw*0.62:ih*0.42:iw*0.36:ih*0.10`, `scale=1.6× lanczos`.
Visibly in my crop: level badge **4**, gold bar **5110 / 5150** captioned EXPERIENCE
POINTS, **AVAILABLE STAT POINTS: 0**, HP **20/20** green, CHI **9/15** blue, AP
**15/30**, ATK **10**, DEF **10 + 13** (orange), SPD **4**, GOLD **3**; a second crop
(`crop=iw*0.62:ih*0.14:iw*0.36:ih*0.46`, 1.8×) shows **WEIGHT: 73 / 100**.
`-ss 655` shows level **3**, **2098 / 2950**, STAT POINTS 0.

`expArray[4] = 5150` ✓ and `expArray[3] = 2950` ✓ — **payload and frame agree**.

Budget check at level 4 (9 points earned, 0 available), recomputed by me:
- **web** magnitudes: `1 + 1 + 0 + 3 + 3 + 1 = 9` ✓
- **android** magnitudes: `2 + 1 + 0 + 9 + 9 + 3 = 24` ✗

The frame wins, and it picks WEB. Confirmed.

### Extrapolation error reproduced
I re-implemented `src/core/xp.ts`'s model and got the surveyor's divergences to the
decimal: L12 +0.9%, L20 +5.5%, L40 −15.5%, L60 −37.4%, **L80 −61.3%** (and L98
−91.6%, which they did not state).

---

## 2. What I overturn — both are UNDER-CLAIMS

### ⓐ `progression/levels-81-99` — STILL_UNHELD is **REFUTED**
The answer is in the web payload, and it is a clean negative.

```
§1t1523s0§.as:2042    var _loc5_:Boolean = false;              // consoleEnabled, CONSTANT-FOLDED
§1t1523s0§.as:2043    if(!_loc5_ && _loc4_ > §1t9470s0§) { … return false; }
§1t1523s0§.as:2019    return 1;                                 // getLevel() overflow
```
Android keeps a **live** `consoleEnabled` var (`StatsManager.as:336`, toggled at
`:586`/`OverworldHUD.as:2715`) and its `getLevel()` returns **99** on overflow
(`StatsManager.as:1596`). The **web build folds the flag to a literal `false`**, so
the `> levelCap` guard is unconditional with no bypass, and `getLevel()` wraps to
**1** instead of 99. In WEB v0.717 levels 81–99 are **unreachable by any path**.
No data row anywhere exceeds 80 (checked `itemdata`/`npcdata`/`questdata`: max
`minlvl` 79, max wave `lvl` 35, max friend `lvl` 80).

The surveyor's *operative* conclusion ("dead headroom, do not port") was already
right — only the "unknown" label was over-cautious. Severity: minor.

### ⓑ `progression/xp-from-gather-and-dungeon` — PARTIAL upgrades to **HELD (negative)**
This is not "a value we don't have." I enumerated **every** XP-granting call site in
both builds:

- **android**: `ConnectionPIO.as:643,647` · `InventoryUI.as:906` ·
  `LootDialog.as:251` · `NetworkManager.as:1268,1272,2818,2822` ·
  `Overworld.as:318` · `OverworldHUD.as:2137` · `XMLQuestOutcome.as:66`
- **web**: only two callers of `changeXP` (`§1t9576s0§`) exist —
  `§1t5957s0§.as:1257` (item-modifier XP) and `§1t6172s0§.as:322` (loot commit)

**There is no gather / mine / farm XP call site anywhere in either build.** Gathering
grants no XP of its own; XP from a gather loop can only arrive as a quest reward.
Code and frame agree — `A-04` line 32 ("XP bar unmoved at 2098/2950 … no XP awarded
from mining"). Dungeon XP is just the kill model (dungeon mobs are NPCs).
Blocker ④'s gather sub-clause is **answered**, not open.

---

## 3. Material corrections (claim text survives; the annotation does not)

### `progression/levelup-refill-and-cap` — two ANDROID-only facts, unlabeled
The claim itself is right and web-parallel (`§1t1523s0§.as:2072–2082` refills HP, Chi,
AP, duel tokens; `levelCap` 80 at `:362`). Its **lane_impact** is contaminated:

1. **`autoAssignStats` does not exist in WEB v0.717.** Web `levelUp` is eight
   statements with no `statBucket`; grepping the whole web payload for the six-stat
   array returns nothing. It is an android-port convenience feature. Porting it —
   *especially* with the android `+5/+5/+1/+1` magnitudes baked into it — would be a
   straight fidelity bug.
2. **The anti-cheat multi-level threshold differs**: web is `_loc6_ > 2`
   (`§1t1523s0§.as:2049`); android is `leveldiff >= 5` (`StatsManager.as:1625`).

Also: `changeStat(STAT_HGOLD, 5|20)` on rebirth is the **premium** currency
(`STAT_HGOLD = 12`), distinct from `STAT_GOLD = 11`. The frame labels it `GOLD: 3`
next to a separate `COINS`, so the surveyor's UI-facing word "gold" is correct — but
the stat id must be recorded, not the label.

### `progression/xp-income-model` — two wording defects
1. **"symmetric under/over-level scaling" is wrong.** Under-level is
   `×(1 + 0.05·Δ)`; over-level is `×(1 − Δ/zeroDifference())`. Those are not
   symmetric — the over-level side decays through a 13-band step table.
2. **"(duellist/PvP base)" on `lvl*5+45` is too narrow.** It is the class-level base
   for ~20 concrete enemy subclasses (`EnemyFox`, `EnemyWolf`, `EnemyBear`,
   `EnemyCivilian`, `EnemyOgre`, `EnemyStag`, `EnemyDeer`, `EnemyBoar`, `EnemyElite`,
   `EnemyNianMonster`, `EnemySpearElite`…). `level*2+20` is the generic `NPC` base.

### `progression/271-cap-explained` — provenance caveat
`1 + (80+10)*3 = 271` is exact and the formula is real. But I grepped the whole repo:
**"271" appears only at `REBUILD_READINESS.md:201` itself** — the ledger's number has
no upstream artifact. The identification is arithmetic inference, not a matched
source. It is almost certainly right; record it as *derived*, not *matched*.

---

## 4. New findings — things the surveyor did not have

1. **The WEB `calcXP` exists and is byte-parallel.** `§1t68s0§.as:113–129`
   (greyLevel), `:131–178` (zeroDifference), `:180–202` (calcXP). The entire
   XP-income model was cited android-only; the web sourcing risk is now closed.
2. **The 69 quest XP rewards sum to 79,890** — that alone lands a player at
   **level 17** (`expArray[17] = 80,300`) before a single mob kill. This *decisively*
   kills the ledger's stated rationale for blocker ② ("a solo build probably can't
   reach L11+ offline"). `itemdata.xml` also carries 142 `minlvl` rows spanning
   **0–79**.
3. **⚠ WEB has a stance-triangle *penalty* that android lacks.**
   `§1t99s0§.as:3788–3799`: favourable matchup `_loc5_ *= 1.2`, **unfavourable
   `else if … _loc5_ *= 0.9`**. Android `MCSPlayer.as:3701–3708` has only the ×1.2
   branch. A third concrete instance of "android is differently tuned" — and a direct
   gift to **L1 combat-core**.
4. **Elemental damage bypasses DEF entirely.** `§1t99s0§.as:3489` /
   `MCSPlayer.as:3418`: `setHP(getHP() - (damage + fire + wind + water + earth))` —
   defense is subtracted from the physical term *only*, and `behead` applies ×1.5
   *after* the min-damage floor (`MCSPlayer.as:3714–3717`). Completes the surveyor's
   DEF claim.
5. **An independent web corroboration of the per-point table.**
   `§1t5957s0§.as:3450–3457` audits total points spent as
   `(HP−10)/10 + (Chi−10)/5 + (AP−30)/5 + (ATK−1)/3 + (DEF−1)/3 + (SPD−1)/3`.
   The divisors *are* the per-point magnitudes and the subtrahends *are* the start
   pools — a second, structurally independent web witness for both.
6. **A second frame already confirms +3/point.**
   `docs/research/video-study/segments/A-02-…md:25` records ATK 4→7, DEF 4→7,
   SPD 1→4 while spending 3 points, and line 24 records `HP 20/20 · CHI 10/10 ·
   AP 30/30`. The segment flagged the ratio INFERRED; the payload closes it.
7. **`getLevel()` is an A2 witness for the cumulative-cap *semantics*.**
   `§1t1523s0§.as:2011–2013`: `if(expArray[q] > xp) return q;` — strictly-greater, so
   hitting a cap exactly finishes the level. `src/core/xp.ts` and
   `tests/xp.test.ts > … crosses to the next level exactly AT each cap` currently
   justify that from frames alone. It can be promoted to CONTRACT.
8. **`consoleEnabled` is constant-folded to `false` in the web build**
   (`§1t1523s0§.as:2042`). Every android guard written `!consoleEnabled && …` is
   unconditional in v0.717. This is a general decoding rule for the whole gauntlet,
   not just progression.

---

## 5. Verdict on the score

**88 is fair, arguably conservative.** Both of the surveyor's two stated unknowns
turn out to be answerable, and I answered them from the payload. On the evidence in
front of me, progression is closer to **93** — the only genuinely open item left is
the *historical* question of whether 81–99 was ever live in some build older than
v0.717, which no artifact in this repo can reach and which does not affect the
rebuild.

The two contaminants (§3) must be fixed before this lane feeds config, because both
would silently import android tuning into a web-targeted build.
