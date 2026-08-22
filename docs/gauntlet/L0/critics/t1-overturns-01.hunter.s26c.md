# Blind critic — t1-overturns-01 — HUNTER LENS (s26c)

**Packet:** 24 claimed ledger overturns · **Judged:** 24 · **Skipped:** 0
**Refuted outright:** 0 · **Overturns knocked down:** 2 · **False sub-claims caught:** 2
**New findings:** 9

Every verdict rests on an artifact I opened myself. I did not read a single
`critics/*.md` or `sources/*.md`. Where a finding cited a line, I opened that line
and compared the bytes; where it cited a frame, I re-rendered the frame and looked;
where it cited a byte-check, I re-ran the byte-check from scratch.

---

## 1. Headline

This is an unusually clean packet. Every one of the 24 findings survives on the
evidence — 9 of them I attacked directly at the point most likely to break, and none
broke. What the hunter lens caught instead is **inflation at the edges**: two findings
claim a ledger overturn they do not earn, two carry a false or short sub-claim inside
an otherwise correct body, and three are filed against the wrong build.

The bigger yield is under-claiming. Six findings hedged with "web parity not checked"
or cited an android file for a web assertion. I went and closed those hedges, and in
three cases the target-build artifact turned out to be **stronger than the finding
itself realised** — most sharply on the "271 cap", which is not an arithmetic puzzle
at all but a literal constant in the web build.

---

## 2. The two overturns that do NOT stand

### NF-E/survival-mode-content-diverges-14-of-87-rows — overturn_upheld = FALSE
The finding is TRUE and I reproduced every number: 11,721 B vs 11,553 B, 39 `<wave>`
and 87 `<enemy>` on both sides, identical spawn-x histogram `{-50:49, 1650:37, -1650:1}`,
and exactly 14 differing rows. But its `ledger_text` is the **Stage-0 brief line S0-1**,
not a `REBUILD_READINESS.md` sentence — and the evidence *confirms* S0-1 (119 is
`<survivalmodedata>`, absent from all 12 ledger systems) rather than falsifying any part
of it. `grep -n -i survival docs/research/REBUILD_READINESS.md` returns nothing at all.
Its real target is another packet finding, which is a lane-internal correction, not a
ledger overturn.

It also carries a **flatly false clause**: "The unique-id sets are unequal in both
directions." I computed both differences — web-minus-android is empty, android-minus-web
is empty. Enemy 443 already appears elsewhere in the android blob. What web changed is
the alternation *pool* of the late waves, not the roster. And the enumerated rows
(73-76, 77-80, 81-84) cover twelve while the correct count of fourteen is stated one
sentence earlier: rows 85 and 86 are missing.

### progression/web-per-point-table-is-confirmed-on-camera-L3-to-L4 — overturn_upheld = FALSE
I re-ran the finding's own ffmpeg recipe and read both plates. Every value is on screen,
exactly as filed:

| | badge | XP | HP | CHI | AP | ATK | DEF | SPD | pts |
|---|---|---|---|---|---|---|---|---|---|
| `-ss 653.0` | 3 | 2098/2950 | 20/20 | 10/10 | 30/30 | 7 | 7 (+2) | 4 | 0 |
| `-ss 1600` | 4 | 5110/5150 | 20/20 | 9/15 | 15/30 | 10 | 10 (+13) | 4 | 0 |

Three points bought MAXCHI +5, ATK +3, DEF +3. Android's +1/+1 is ruled out on camera.
**But this corroborates RR:199, it does not falsify it.** The film agrees with "+5Chi"
and "+3-stat"; it says nothing whatever about "+1AP", because MAXAP reads 30 in both
plates — no AP point was spent across the level-up. The one term in that sentence that
is actually wrong for v0.717 is untouched here. That overturn belongs to
`progression/plus1ap-is-androids-manual-panel-not-a-typo`, and crediting it twice would
inflate the rewrite.

---

## 3. Overturns that stand, but must be SCOPED in the rewrite

Four sentences are conjunctions. One conjunct falls; the other must survive the edit.

| finding | falls | **survives — do not delete** |
|---|---|---|
| `hunter-s26a/per-enemy-xp-formula…` | "20+ samples show no XP formula either" | "coins-per-kill (`=8`) is an unconfirmed INFERRED seed" |
| `hunter-s26a/full-offline-save-schema…` | the **save-format** half of RR:351 | **server-sim topology** is still unrecoverable |
| `newfind`/`progression`/`hunter-s26a` mastery-10 | the **"mastery-9"** label | "**ceiling** values, **not base**" — and I confirmed it: m=0 in the same web switch yields 0.5 / 1.0 / 1.4, which is RR:156's level-1 Shugyosha line to the digit |
| both War-Room frame findings | `"moves per turn" reconciles as "per hour"` | `(36 = Private's rank threshold, not a turn cap)` — the frame *corroborates* this: 0/36 is a cumulative counter sitting beside a separate 3-per-turn allowance |

And one residual on audio: RR:348 falls for **13** named SFX. Thirty of the 43 web cue
names still have no PCM. The sentence should narrow, not vanish.

---

## 4. Build mislabels (correction C2 territory)

- `meta-social/war-room-frame-carries-rank-moves-and-clan-numbers` is filed **web v0.717**
  but cites the **android** `WarSelectUI.as` for its 10-px territory pitch. Closed: the
  web payload carries the same transform at `§1t7934s0§.as:299`.
- `hunter-s26a/per-enemy-xp-formula…` hedges "web parity not checked". Closed:
  `§1t68s0§.as:237` and `:271`.
- `payload/reinforce-has-three-material-tiers-not-two` is filed **android v0.682**.
  Closed: `§1t401s0§.as:664-688` is the line-for-line web twin.

---

## 5. Attacks that failed (i.e. the findings held under fire)

- **The 0.9 stance arm.** If android had the losing arm anywhere, `NF-A/web-stance-triangle-has-a-second-0p9-arm`
  died. `grep -rn '\*= 1\.2|\*= 0\.9'` over all 559 android scripts returns the x1.2
  triangle twice (`MCSPlayer.as:3703`, `EnemyClone.as:436`) and **zero** triangle 0.9 arms.
  The 0.9 hits in `FireBreathProjectile.as:27` and friends are a skill-**level** scale
  (`skilllevel == 2`), not the triangle. Held.
- **Defender-keying.** Web `§1t99s0§.as:3661` is `override public function §1t3277s0§(param1:MovieClip, param2:§1t67s0§) : Boolean`
  — the exact 2-arg signature of android `gotHit` at `MCSPlayer.as:3580` — and `:3754`
  assigns `param2.stance`. `this.stance` is the receiver. Held, structurally, not by assertion.
- **The audio decrypt.** I did not take correction C3 on trust. Raw blob opens
  `b'CWS~\xd0\x1coo'` (so a naive whole-file XOR fails, exactly as filed); key 111 from
  `resourceFileNameArray[2].charCodeAt(1)`; result `CWS` v17 filelen 29,631, inflating to
  29,623; 13 `DefineSound` tags, every one fmt 2 / rate 1 / 16-bit / mono; sample counts
  `8700, 7264, 31928, 2976, 9545, 8033, 5290, 6130, 3809, 17331, 5717, 4608, 3456` —
  identical, in order. SymbolClass identical.
- **The bindata census.** Re-hashed all 27 web blobs against all 42 android blobs:
  **21 of 27** byte-identical, differing set exactly `{100, 102, 111, 113, 114, 119}`,
  paired sizes matching to the byte. `114_1t4641s0.bin` opens as `<animdata>` with the ten
  named spider anims and `grep -rli spider reference/extracted/android/` returns nothing.
- **The dan clamp.** A `default:` case alone would be compatible with a higher underlying
  counter, which would have gutted `hunter-s26a/web-kanji-dan-display-path`. It is not a
  display artifact: `§1t1523s0§.as:2653-2655` hard-caps the dan stat itself.

---

## 6. New findings (9) — full detail in the JSON

The three that matter most:

**A. The "271 cap" is a literal web constant.** RR:201 calls it gear/rebirth-inclusive and
files it as "resolvable by arithmetic now". `§1t5957s0§.as:3344` gates the ATK add button on
`stat < 1 + (level + 10) * 3`. At the level cap of 80: `1 + 90*3 = **271**`, exactly. The same
block yields MAXHP 910, MAXCHI 460, MAXAP 480. Android's coefficients do not produce 271, which
is a second proof that 271 is a v0.717 datum. The ledger's 237-point-budget reasoning is
answering a question the code never asked.

**B. `tenthGold=100` is CONTRACT, and there IS a 10th-rebirth tier.** RR:164-165 says both
constants "should be INFERRED, not CONTRACT" and that film shows "a flat +25 gold every
rebirth, no 10th-rebirth tier". Web `§1t1523s0§.as:2644-2651`: `if(dan == 8) changeStat(HGOLD, 100)`
`else changeStat(HGOLD, 25)`. That is `tenthGold=100` and `+25` in one branch. `:2653-2655`
hard-caps the ladder at nine increments, i.e. ten rungs ending at 十段. Android pays 20/5
instead — a build split, so the 25/100 pair must not be ported from mobile.

**C. Crit closes two blockers at once.** `§1t99s0§.as:3272-3274`:
`if(Focus == maxFocus) return dmg * 1.3 + STAT_CRITICALDMG;`. RR:190 ② ("crit 1.3 vs 3 final")
resolves at **1.3 with an additive crit-damage stat** — exactly the mechanism RR:151-154
hypothesised for the "3x" folklore. RR:195 ⑤ ("crit **proc** rule — entirely absent") resolves
**deterministic**: the only RNG in the function is the base-damage roll. Android pays 1.2/1.5
instead, so a v0.717 target takes 1.3.

The other six: web XP-formula parity · web reinforce-tier parity · the survival-mode
id-set correction · the 19-field save schema as a **positional twin** in web · the
web-side War-Room 10-px pitch · and `deathnohead` as **31 frames × ~17 bone transforms**,
which raises RR:240 ⑤ from "the name exists" to "the keyframes are on disk".

---

## 7. Standing-invariant note

No measurement-doc-vs-frame conflict arose in this packet in the classic direction, but one
frame does beat a ledger sentence and I say so out loud: `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg`
reads **"RANK: RECRUIT (3 MOVES A TURN)"** in the game's own shipped copy. RR:246's
reconciliation of "moves per turn" as "per hour" is contradicted on camera. **The frame wins.**
