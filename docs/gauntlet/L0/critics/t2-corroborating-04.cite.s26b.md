# BLIND CITE REVIEW — packet `t2-corroborating-04` (48 findings)

**Reviewer lane:** LENS 1, the cite lens. Hunting over-claiming.
**Packet:** `docs/gauntlet/L0/worklist/t2-corroborating-04.json` — 48 findings, all `overturns_ledger=false`.
**Judged:** 48 / 48. Skipped: none.
**Result:** 47 held, **1 refuted** (`economy/five-fold-redenomination-is-A2-grade`, material).
**New findings returned:** 6 (one of them STILL_UNHELD).

I opened an artifact for every one of the 48. No verdict below rests on another agent's prose; I did
not read `critics/*.md` or `sources/*.md`.

---

## 0. Headline

This is an unusually well-cited packet. Of 48 findings, **43 quoted their source verbatim at the exact
line they named**. The seven `QUOTE_UNVERIFIED` flags were all synthesis artefacts — the quote field
stitched several files together, so no single file contained the string — and in six of the seven every
component resolved when I checked it piece by piece. The seventh is the one I refuted, and the machine
was right to flag it.

The one refutation matters because the packet contains its own correction. Three findings in this same
packet (`cash-tier-redenomination-is-not-clean-5x`, `five-x-is-a-direction-not-a-multiplier`,
`5x-redenomination-is-a-code-fact`) report the IAP ladder honestly as "×5 on **four** of five tiers".
`five-fold-redenomination-is-A2-grade` reports it as "exactly ×5, **five for five**", and then issues a
porting rule on the strength of that. 400 / 75 = 5.333. I read both lines.

---

## 1. THE REFUTATION

### `economy/five-fold-redenomination-is-A2-grade` — REFUTED (material)

Three independent problems, all of them cite-lens problems.

**(a) The arithmetic is falsified by the lines it cites.**
`reference/decompiled/shs3_payload/scripts/§1t410s0§.as:140` sets `goldtext4` to **400**.
`reference/decompiled/shs3_android/scripts/PayUI.as:131` sets `goldtext4` to **75**.
400 / 75 = **5.333**, not 5. The quote's "exactly ×5, five for five" is a measurement that the cited
artifact does not support. Four tiers are exactly 5.00; the fifth is not.

**(b) MIS-CITED by one line.** The rebirth cite reads `StatsManager.as:2202/:2207`. Line 2202 is a bare
`{`; the payout is at `:2203` (`changeStat(STAT_HGOLD,20);`). The sibling claim
`5x-redenomination-is-a-code-fact` writes `:2203,2207` and is correct.

**(c) The porting rule is contradicted by artifacts I opened.** The lane_impact instructs: *"Every
heavenly-gold figure ported from a 0.682 artifact must be multiplied by 5 for a v0.717 target."*

- `reference/extracted/itemdata.xml` and `reference/extracted/android/111_Mobile_ItemData.bin` are the
  **same bytes** once the 40-byte declaration and one trailing CRLF are removed. Both md5
  `75d5344925e13de09924120b4136ae2a`. A byte-identical file cannot carry a per-build denomination.
- The web shop applies **no transform**: `§1t104s0§.as:94` assigns `param1.heavenlyprice` raw →
  `§1t61s0§.as:35` copies it → `§1t394s0§.as:78` prints `param2.toString()` into the gold badge.
- The 48:04 shop frame shows items **2208 and 2209 at badge 1** against an itemdata row of
  `<heavenlyprice>1</heavenlyprice>`. That is ×1, not ×5.

**What survives:** the *direction*. Web heavenly gold is roughly 5× finer than android, and the three
code witnesses are genuine witnesses. What must not enter the ledger is "five for five" and the
multiply-every-row rule. The packet already carries the correct version four times over, so refuting
this one costs the lane nothing.

---

## 2. HELD, and made stronger by my own check

Six findings I could push further than the claimant did.

**`combat-core/web-stance-switch-rule`.** The claim's one inferential link — *"48 is precisely the
meter's hidden display offset"* — is not an inference. The web HUD writer
`§1t113s0§.as:328` computes `var _loc3_:Number = (param1 - 48) / (param2 - 48);` and at `:336-342`
prints the CANNOT-CHANGE-STANCE string **exactly when that ratio is 0** — the same `raw < 48` predicate
as the switch guard at `§1t99s0§.as:3060`. I cropped
`reference/frames/session11/crit-focus/t1003.000.png` at (0,910)-(620,1080) 2×: HP 14/20 green, Chi 31/31
blue, third bar an empty brown track reading CANNOT CHANGE STANCE. Source and frame agree; no arbitration
needed. Returned as new finding #2.

**`enemies-ai/drop-in-spawn-is-on-film`.** A single still cannot distinguish a spawn from a jump. So I
pulled the neighbours at the identical crop: **frame_0019 has none of the three hostiles on screen**,
frame_0020 has all three with one still airborne and its HP bar tracking, frame_0021 has all three
grounded. That is a witnessed wave spawn, and it upgrades the finding rather than merely confirming it.
Returned as new finding #3.

**`enemies-ai/nameplate-colour-system-is-five-colours`.** I ran my own peak-saturation scans rather than
trusting the reported hexes. Blue in the seg-18 crop returns **#1A97F4** — the claim's number to the
digit. The BANDIT text region of seg-10 frame_0013 returns **#8A0300** — again exact. Gold returns
#ECC522 against the claimed #EDC728, inside JPEG noise. All five AS3 constants land (39423 / 10027008 /
16763904 / 16777215 / 12627019, each arithmetically the stated hex).

**`enemies-ai/android-ai-dispatch-is-38-cases-35-classes`.** I re-parsed both switch bodies instead of
accepting the count. Android `NPCManager.as:516-634`: 38 cases, 38 `new` sites, 35 distinct classes.
Web `§1t1543s0§.as:615-733`: 39 / 39 / 36, with the extra id at `:731-732` being
`case 38: _loc5_ = new §1t4551s0§();`. The claimed collisions are real — EnemyPlayer at cases 0/9/14,
EnemySpearElite at 28/37.

**`enemies-ai/category-11-skills-are-in-npcdata`.** Every number reproduces: 647 `<skill>`, 39 distinct
ids, and 1064×4 / 1065×4 / 1066×1 / 1067×1 / 1068×2 / 1500×5 / 1501×2. And "all seven category-11
skills" is precise, not loose — parsing `skilldata.xml`, the `<category>11</category>` set is exactly
`{1064,1065,1066,1067,1068,1500,1501}`.

**`economy/web-build-ships-no-game-data`.** Five sub-assertions, five verified. I mmap-scanned all
329,520,665 bytes of `payload.xml`: `heavenlyprice` occurs **once**, at byte 19403382; `itemdata` once at
19503662; **`skilldata` and `npcdata` zero times**. Bindata headers as described. All four disk XMLs
equal their android blobs modulo declaration + one newline. And `grep -c 50007 questdata.xml` = **0**
while `QuestLogUI.as:463` renders that loot id and the 21:35 frame prints "TOWN PROSPERITY: +10". That
last one is a real, independently reproducible web-vs-disk divergence.

---

## 3. HELD, with a correction that must ride along

### `economy/premium-price-exception-set` — HELD, two identifications overturned by the frame

I extracted t=2884s myself. **All sixteen badges match the quote row for row.** Three tiles at badge 1
against thirteen at 5/10/15/25/60 is directly visible, 2208 and 2209 are certain, and the conclusion
("read premium prices per item from frames, not by multiplying") is frame-proven. `outfits hp=12 → 60`
also checks out — item 2133 *Santa Outfit* is `<heavenlyprice>12</heavenlyprice>` and the blue-gift tile
reads 60.

**STANDING INVARIANT, SAID OUT LOUD: the frame wins over the PremiumData-order inference.**

1. `7034/4065 hp=3 → 15` is **wrong**. Hovering the two 15-gold apparel tiles in the same shop session
   names them **TRAINING HELMET** and **TRAINING GARMENT** — not Assassin Hood / Assassin Robes. Neither
   name exists in the 2,533-entry android string table, and neither has an itemdata row, so **no ratio
   can be computed for them in either direction**.
2. The third badge-1 tile is a **gold** skull, while the DUEL TOKENS counter in the same frame uses a
   **white/grey** skull. Calling it 2125 "10 Duel Tokens" is unproven — and it flatly contradicts
   `heavenlyprice-has-no-multiplier` in this same packet, which puts 2125 at badge **5**. Neither claim
   read a tooltip; both inferred from the android `121_Mobile_PremiumData.bin` order applied to a web
   frame, which is precisely the cross-build move that `no-web-itemdata-exists` and
   `web-build-ships-no-game-data` forbid three findings later.

Returned as new findings #1 and #6. #6 is **STILL_UNHELD** and stays that way until someone reads a
tooltip over a skull tile.

### `economy/no-web-itemdata-exists` — HELD, headline over-broad

Every cite is verbatim: thirteen `URLRequest` loads at `§1t1524s0§.as:334, 357, 388, 420, 453, 479, 505,
528, 554, 580, 606, 632, 658`, the lone literal at `:683`, and the android `[Embed]` at
`Mobile_ItemData.as:5`. But the headline sentence — *"The web v0.717 build ships NO data XML at all"* —
is false as a universal, and Stage-0's own S0-1 says so. I dumped the first 60 bytes of all 27 files in
`reference/extracted/bindata/`: nineteen are `<?xml version="1.0"?><animdata><anim i="…">`, 119 is
`<survivalmodedata>`, 93 is room-object defs, 94-98 are name tables, 92 is a GIF89a. The operative
clause and the lane_impact are correctly scoped to the four gameplay tables, so the finding stands —
but the headline must be narrowed before anyone quotes it. Returned as new finding #4.

### `economy/coin-faucet-set-now-cited` — HELD on citability, not on closure

All seven `addLootCoins` lines are verbatim. But "the faucet set is **closed**" does not survive its own
packet: quest turn-ins pay coins through `QuestLogUI.as:455-461` (`lootType == 0 || 11 → coinReward += qty`),
which none of the seven lines covers, and `quests-do-pay-coins` in this same packet frame-proves it at
35 coins. Citability holds; closure does not.

### `economy/quest-coins-are-the-biggest-early-faucet` — HELD, superlative unsupported

The frame reads verbatim "REWARD / 250 XP / 30 COINS / TOWN PROSPERITY: +5". Two notes. The questdata
row cited as backing carries `<exp>750</exp>`, not 250 — so "backed at" means *the same
`<reward><loot><id>0</id>` shape*, not the same quest. And "the largest single early-game coin payout in
the game" has no cite and is contradicted inside its own packet: the 21:35 quest pays **35**, and
`Obj_ChestGoodLoot.as:62` pays `Math.random()*lvl + lvl*5`, which passes 30 at node level 6.

### `economy/itemdata-line-identical-across-builds` — HELD, "0 hunks" is 1 hunk

I ran the diff. Stripping the 40-byte declaration, `diff` prints exactly **one** hunk: `10546c10546`
with `\ No newline at end of file`. The claim's "10,546 lines each" is right and its 42-byte
decomposition is exactly right (38-char declaration + CRLF = 40, plus a 2-byte trailing CRLF). The one
hunk is content-free and the claim's own byte accounting already discloses it. Not enough to fall.

---

## 4. Line-number nits that did NOT kill anything

Recorded so a later pass does not re-litigate them.

| finding | cited | actual |
|---|---|---|
| `slashlength-is-arc-length-not-radius` | `:362 distanceTravelled = Math.sqrt(...)` | line **361** (`:362` is `originalDistanceTravelled = …`); the cite range `:353-367` covers it |
| `nameplate-colour-system-is-five-colours` | `Obj_NPCAggro.as:78,81` | the `10027008` calls are at **:76** and **:80** |
| `nameplate-is-cosmetic-override` | `Obj_NPCAggro.as:62` | `createRoomNPC(...)` is at **:63** |
| `quests-do-pay-coins` | `QuestLogUI.as:454-465`, `:490-497` | the parse block starts at **:455**; the prosperity line is **:498** |
| `web-payload-is-cross-readable` | quotes DIVERGENCES.md | DIVERGENCES.md is absent from the cite field; the sentence is verbatim at **`docs/DIVERGENCES.md:514-520`** |
| `2208-is-the-gold-to-coin-sku` | "the filmed banknote tile" | no frame in the cite field; I confirmed it myself at t=2884s |
| `hitstokillplayer-has-three-bands` | three lower clamps 1/3/5 | correct for `hitsToKillBoss`; `EnemyPlayer`'s `hitsToKillPlayer` floor is **2** (`:103-106`), a fourth value the claim omits |

None of these is a cite that fails to resolve. They are transcription drift inside a resolving range.

---

## 5. Why so few refutations

Because I checked, and they held. A sample of what "held" meant here:

- `§1t99s0§.as:3094 / :3105 / :3116-3119` — the three stance reach curves, character for character, with
  the stance-slot mapping (`:27/29/31` → 0/1/2) independently matching `MCSPlayer.as:27/29/31`.
- `§1t128s0§.as:8` `= 3` and `Projectile.as:8` `GRAVITY:Number = 3`, with `§1t4539s0§.as:549-566` and
  `EnemyArcher.as:271-290` line-for-line the same ballistic solve — including the honest caveat that the
  web call passes no `doLaunch` flag.
- `§1t68s0§.as:116-128` and `NPC.as:97-109` — the grey-level ladder, identical. I counted the
  zero-difference branches myself: **twelve**, exactly as the claim's correction says.
- `TerritoryData.as:782-805`, `HistoryItem.as:373`, `NPCManager.as:381-388`, `MCSCharacter.as:1419-1447`
  and `:1533-1556` — all quoted verbatim, all present.
- `strings.json["850"]` and its frame twin at `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0042.jpg`
  — "COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE", with `strings.json["848"]`'s bare `[0]` as the
  control. Clean payload-plus-frame pair.
- `zFtCaTO0_1M/seg-10` HUD strip across frames 0013/0016/0017/0018/0019/0020: **20/20 · 20/20 · 20/20 ·
  19/20 · 18/20 · 18/20**, blue chi 15/15 throughout, and the drop lands on the same frame as the
  floating black "1". Frame-for-frame as claimed.

Over-refuting honest, verbatim work would have been the worse failure here.

---

## 6. New findings returned (6)

1. **`economy/premium-15g-apparel-tiles-are-training-gear-with-no-0682-row`** (A1, HELD) — the two
   15-gold apparel tiles are Training Helmet / Training Garment, tooltip-named, with no 0.682 row; Santa
   Hat 7067 and Santa Suit 4069 (`hp=3 → 15`) and Santa Outfit 2133 (`hp=12 → 60`) are the contrast and
   do follow ×5.
2. **`combat-core/cannot-change-stance-string-is-driven-by-the-48-offset`** (A2, HELD) — `§1t113s0§.as:328`
   `(raw - 48) / (max - 48)`, label printed at ratio 0.
3. **`enemies-ai/seg10-wave-spawn-is-witnessed-across-three-frames`** (A1, HELD) — 0019 empty → 0020
   airborne → 0021 grounded.
4. **`economy/web-build-does-embed-27-xml-data-blobs`** (A2, HELD) — narrows "ships no data XML at all".
5. **`economy/web-iap-usd-tiers-are-identical-to-android`** (A2, HELD) — `§1t410s0§.as:333-337` carries
   4.99 / 9.99 / 14.99 / 19.99 / 24.99, the same USD anchors as `PayUI.as:137-141`. Neither surveyed
   claim cites this line, though one asserts it. It is what makes the ×5 a pure redenomination.
6. **`economy/duel-token-badge-identity-is-still-unheld`** (A1, **STILL_UNHELD**) — the grey/gold skull
   split cannot be resolved from anything in this packet, and two of its findings answer it oppositely.

---

## 7. Accounting

- packet_size **48** · judged_count **48** · skipped **[]**
- refuted **1** (material) · held **47**
- new findings **6** (5 HELD, 1 STILL_UNHELD)
- Every verdict carries an `own_cite` naming an artifact I opened in this session.
