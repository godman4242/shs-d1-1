# CITE LENS — packet `t2-corroborating-01`, run s26d

**Packet size 48 · judged 48 · skipped 0 · refuted 1 · new findings 5.**
Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-01.cite.s26d.json` (written before this file).
My own cites machine-checked: `scripts/gauntlet/citeLint.py` → **53 claims · 53 RESOLVES · 0 BROKEN · 0 QUOTE_UNVERIFIED.**

---

## The headline

**One finding falls, and it falls to the file it cites.**
`hunter-s26a/war-room-battlefield-board-is-server-dimensioned` says the War-Room battlefield
board's dimensions "are not recoverable from the shipped blobs." They are, eleven lines above the
loop it quotes:

```
WarHexUI.as:175         this.ht = 6;
WarHexUI.as:176         this.wt = 6;
```

`grep -n "wt *=\|ht *=" WarHexUI.as` returns **exactly those two hits and nothing else in the file.**
The board is a hardcoded 6×6 hex grid, and the layout is hardcoded too — `:253 hex.x = 90 + xpos * 55;`
`:254 hex.y = 92 + ypos * 55;`, with the terrain layer on the same 55 px pitch at `:206-207`. The
pipe-delimited server string the finding quotes (`:231`, parsed at `:239` as a 7-field record) carries
per-hex **state** — xpos, ypos, owner, side, strength — not dimensions. The half that survives is the
uncontested half: the battlefield board is a different object from the 63×72 territory mask.

That converts into new finding **`s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid`**, which
**overturns REBUILD_READINESS ② "War-Room map topology (board/adjacency)"** — the board can be
specified today.

## Four findings whose numbers I had to correct

All four survive; none of them survives intact.

| finding | what the artifact actually says |
|---|---|
| `gauntlet-s26b/web-npcmanager-switch-is-the-name-mapping-anchor` | The web switch has **39** cases, 0..38 — not 38. `§1t1543s0§.as:731-732` is `case 38: _loc5_ = new §1t4551s0§();` and there is **no `default:`**, where android stops at case 37 and closes with `default: trace("createNPC error: ")` at `NPCManager.as:632-633`. Every named pair (ai 0, 2, 25, 36, 37) checks out, so the method is sound — but the order mapping is only valid for 0..37, and v0.717 carries an enemy AI slot v0.682 does not. |
| `enemies-ai/seg10-wave-spawn-is-witnessed-across-three-frames` | **THE FRAME WINS.** I opened `frame_0020.jpg` at crop (150,250)-(1024,500) ×2 LANCZOS: **four** actors carry green HP bars, not three — a blue-clad one at the far left behind the tree, a brown-shirted one, a bare-chested one, and the airborne one. The A1 conclusion (drop-in spawn, bar attached before landing, jump-attack excluded) is untouched; the head-count is not. |
| `combat-core/cannot-change-stance-string-is-driven-by-the-48-offset` | `§1t113s0§.as:329-332` clamps a negative ratio to 0, so `ratio == 0` is the predicate **raw ≤ 48**, while the gates at `§1t99s0§.as:3050` / `:3060` are **raw < 48**. At raw == 48 the bar reads empty and prints the string, and a stance switch is legal. The two predicates are one tick apart, not "the same". |
| `enemies-ai/npc-die-has-four-paths-before-the-seven-way-dice` | Six paths, not five. The enumeration skips `NPC.as:979 if(behead)` — the immediate sibling of the 7-way dice, giving `ENEMYDEATHNOHEAD` and its own 3-way emitter roll — and `:1084` is the **else arm** of `:977 if(!StatsManager.censored && this.fatal)`, a parallel branch, not a guard sitting ahead of `:1005`. |

## What I re-ran rather than re-read

The strongest findings in this packet are the ones I could execute, and every one of them
reproduced **to the byte**:

- **All five resource blobs decrypt.** I implemented `ResourceManager.decryptByteArray`
  (bytes 3..255, `i%11==0` swap with `i+256`, then XOR) and keyed it off
  `resourceFileNameArray[n].charCodeAt(1)`: 115 key 104 → 1,040,849 · 113 key 117 → 1,402,677 ·
  122 key 111 → 29,623 · 124 key 109 → 1,908,229 · 120 key 103 → 4,412,340, every one `CWS\x11`
  inflating cleanly. Exactly the claimed sizes. **C1's "key m=109" is the IMAGE key, confirmed.**
- **1,912 equipment symbols.** SWF tag parse of the inflated 115: 1,912 exported symbols and the
  prefix census matches slot for slot — torso/lowarm/uparm/pelvic 151 each, stomach 150, item 112,
  weapon 109, hat 96, calf/crotch/thigh 85 each, skill 79, hair 73, prop 60, mask 59, foot/foottop
  44 each, head 38, hand/neck 33 each, acc 8, achievement 5, plus complete bear/boar/deer/horse/wolf
  sets. The wolf sub-groupings (`backleg1-4_wolf_0..2` = 12, `frontleg` = 12, `tail1-3` = 9) also hold.
- **13 recovered SFX.** 122 decodes to 13 `DefineSound` tags whose SymbolClass names are exactly
  deflect, die1-3, slash1-3, punch, fart, hitmetal, goodkoto, refund, sumo — the 13 the audio finding
  names, against the 43 on `§1t88s0§.as:56`. 30 synth targets stands.
- **Survival mode.** web 11,721 B / md5 `f3dd117…` vs android 11,553 B / md5 `9905d24…`; both 39
  waves, 87 enemy rows, identical spawn-x histogram `{-50:49, 1650:37, -1650:1}`; **14** differing
  rows (0-indexed 73-86) mapping to waves 33-39 exactly; and **both unique-id set differences are
  empty** — so `hunter-s26c`'s correction to `NF-E` is right and must ride with it.
- **itemdata censuses.** 982 items; 19 rows carrying only `<id>` with exactly the claimed id list;
  166 stub rows; 177 type-9 rows with 122 carrying `<minlvl>` (155 of 982), range -4..79; 106
  `<slashusage>` rows `{72:70, 96:35, 24:1}` with the single sub-48 row at id 13031; exactly three
  1-3 damage weapons — Stick (w1), Bamboo (w1), Pickaxe (w10).
- **bindata parity.** 27 web / 42 android / 21 md5 matches, unmatched web set exactly
  `{100, 102, 111, 113, 114, 119}`, and the anim child counts (20 vs 18 · 51 vs 51 · 17 vs 16 ·
  26 vs 23 · 10 vs none) match to the byte size as well.
- **IAP.** android 10/25/40/55/75 gold vs web 50/125/200/275/400 — exactly ×5 on tiers 1-4 and
  400/75 = ×5.33 on tier 5, against identical USD anchors. The "bonus tier, not a broken multiplier"
  reading is arithmetic, and it is right.

## The three A1 findings I opened myself

**`coins-gold-hud-strip-correct-frame` — upheld, and the correction it makes is right.**
`frame_0029.jpg` top strip, crop (0,0)-(1024,52) ×2.2: silver coin **480** over **COINS**, a red **+**,
a gold coin **2** over **GOLD**, a red **GET GOLD** button, and at right a level badge **7** beside
**14901 / 16350** over **EXPERIENCE POINTS**. `frame_0027.jpg` whole: a **YOU RECEIVED** loot dialog
on a full-screen red freeze — coin +15, XP 510, three PANTS tiles, an OK button — **no HUD strip at
all.** THE FRAME WINS: bank frame_0029.

**`economy/premium-15g-apparel-tiles-are-training-gear-with-no-0682-row` — upheld on film.**
I sampled the tooltips myself (`fps=0.5` over t=2860-2922, crop 1100×220 at (1250,230)) and read
**TRAINING GARMENT / OWNED: 0 / LEVEL 7**, **TRAINING HELMET / OWNED: 0**, **SANTA SUIT**, **SANTA
HAT**, **WRIT OF RELEASE / badge 25**. A taller crop at t=2884 shows the mechanic lines `…NFUSED`
(SOUL-INFUSED) and `…M LEVELS UP AS YOU GAIN XP.` verbatim. String table: `training` returns only
Training Hall / Sword / Dummy; `soul-infused` and `levels up as you gain` return **zero**. The grid
also shows the Santa Outfit gift box at badge **60** = heavenlyprice 12 × 5. *One omission: the
TRAINING HELMET tile carries a LEVEL 9 badge the transcription leaves off.*

**`economy/duel-token-badge-identity-is-still-unheld` — a correct STILL_UNHELD, and I will not
over-refute it.** The t=2884 grid does split into two skull families exactly as described — three
GREY at badges 5/10/15 and two GOLD at 1 and 10 — and the top-bar counter really is a white/grey
skull in a green diamond reading **40/40 / DUEL TOKENS**. Payload side: 2125→"10 Duel Tokens" hp 1,
2126→"25 Duel Tokens" hp 2, 2127→"40 Duel Tokens" hp 3. Nothing in the frame names a skull tile.
STILL_UNHELD is the honest answer here.

## A trap for the next reader

`items-equipment/pickaxe-frame-payload-identity` quotes the tooltip as `DMG: 1 - 2 (EQ: 1 - 3)`,
which is verbatim — but the **next line of the same tooltip reads `WEIGHT: 1`**, and the Pickaxe row
(13022) carries `weight 10`. That is not a contradiction: the `WEIGHT: 1` belongs to the **hovered**
item (the one with DMG 1-2); the `(EQ: 1 - 3)` is the equipped weapon's range. Do not refute this
finding on that line.

## Findings that scope, rather than contradict, each other

Three findings in this packet are individually correct and jointly misleading if read in isolation:

- `items-equipment/roster-art-absent-from-both-exports` (21 identical part classes in each **script**
  export — verified) reads as "the roster art does not exist." It does exist: it is the 1,912 symbols
  in 115_Mobile_SHS3Resource.bin that two other findings in this same packet recover.
- `items-equipment/second-icon-art-family-item-and-acc` calls the icon manifest "a live art blocker."
  The `item####` (112) and `acc####` (8) families are in the recovered SWF. It is a **transcription**
  job, not an authoring one. (`187 / 982 = 19.0%` — "a fifth" is accurate.)
- `items-equipment/part-stack-is-23-not-27` calls PART_l_shoulder/r_shoulder/l_knee/r_knee "dead
  names." True inside `MCSCharacter`. **False on a quadruped:** MCSWolf allocates 49 slots and binds
  all four at `:184 / :188 / :193 / :197`.

## New findings (5)

1. **`s26d/web-npcmanager-ai-switch-has-39-cases-not-38`** — a 39th enemy AI slot in v0.717 with no
   v0.682 counterpart, and no `default:` arm. A fifth proven build divergence.
2. **`s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid`** — **overturns ledger ②.** 6×6 grid,
   55 px pitch, origin (90, 92). Only per-hex state is server-side.
3. **`s26d/seg10-frame0020-carries-four-hostiles-not-three`** — A1, the frame beats the count.
4. **`s26d/acc3007-has-no-symbol-in-the-shs3resource-export`** — the acc family is acc3000-3006 plus
   acc3008 (8 symbols) against 9 accessory rows in itemdata; one accessory renders as
   `AccessoryDummyIcon` (`MCSItem.as:232`). Also corrects the "acc3000-3008" shorthand two findings use.
5. **`s26d/focus-bar-reads-empty-one-tick-before-the-stance-gate-closes`** — the clamp, not the
   offset, is what makes the label predicate `raw ≤ 48` against a `raw < 48` gate.

## Minor mis-cites recorded but not fatal

`mcswolf-partlist-is-49-not-26`: `super();` is MCSWolf.as **:12** not :11 and `partList.push(mc);` is
**:18** not :17 (the cite range :9-19 contains both). · `web-stance-gate-is-artifact-backed`: the
android disjunction is MCSPlayer.as **:2967**, not :2966. · `nine-ui-boxes`: the `i < 9` loop is
InventoryUI.as **:461** not :460, and findBonusStat's loop head is StatsManager.as **:1943** with its
guard at **:1945**. · `paperdoll-ui-slot-mapping-resolved`: the quote ends on `SLOT_RING2` at **:535**,
one past the cited :520-533. · `NF-C`: the "census of every write to reload" lists 7 of 12 — the five
omissions (`:3104`, `:3249`, `:3253`, `:3257`, `:3270`) are all decrements or a clamp, so "no other
fill path" stands. · `placeholder-icon-art-set`: **11** `*DummyIcon.as` classes exist, not 8 (the
extras are Achievement, Consumable, Invalid) — 8 is right for what MCSItem instantiates. ·
`shs3resource-decrypts-1912-equipment-symbols`: "acc3000-3008" skips a hole at acc3007. ·
`sell-price-input-diverges-across-builds`: android `getWeight()` is not "raw weight" on its cached
branch — `Item.as:1568` returns `this.weight * this.getQuantity()`; the true divergence is the web's
extra `§1t478s0§` bonus term (`§1t17s0§.as:60`, no android analogue) plus quantity on the uncached
path. · `NF-I`: the third web path floors against `_loc3_`, not `param2`.
