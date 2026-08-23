# t1-overturns-01 — LENS 3 (contradiction) blind review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` · 7 findings · **7 judged, 0 skipped**
Structured verdicts: `docs/gauntlet/L0/critics/t1-overturns-01.contradiction.s27b.json` (written first)

**Result: 7 HELD, 0 refuted. All 7 overturns upheld.** Three previously-unheld findings surfaced,
two of which kill a *surviving corpus finding* rather than a ledger sentence — which is the whole
point of this lens.

---

## 1. The one contradiction that could have killed half the packet — and how it resolved

Findings 1 and 2 say in-combat stance switching is live code in web v0.717. `RR:158` says it is
**HARD-LOCKED**, and its stated evidence is the on-screen caption **"CANNOT CHANGE STANCE"**,
first-hand-confirmed by the ledger's own author at `RR:178`.

That is a real conflict between executable code and a frame, and the standing invariant says the
frame wins. So I opened the frame instead of arguing about it.

**`reference/frames/duel_dense/Nr4fQstqHDM_429.0.png`**, crop `(40,930)-(700,1070)` upscaled 3×
LANCZOS: the caption is not a banner. It is **text sitting inside the third HUD bar**, directly
under HP `20/20` (green) and `26/26` (blue).

Then I sampled the same bar across 32 combat frames (`combat_frames/` + `duel_frames/`, label strip
`(240,1010)-(530,1050)` at 2×). **The same bar reads three different things in one session:**

| frame | third bar |
|---|---|
| `combat_frames/Nr4fQstqHDM_t0130s.png` | `BALANCED STANCE` |
| `combat_frames/Nr4fQstqHDM_t0140s.png` | `CANNOT CHANGE STANCE` (in combat, enemies on screen) |
| `combat_frames/Nr4fQstqHDM_t0160s.png` | `HEAVY STANCE` |
| `combat_frames/Nr4fQstqHDM_t0435s.png` | **no caption at all**, bar ~41 % white-filled, player taking damage (red flash) |

A hard lock does not have three states. So I went looking for the code that draws it, and found it:

`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328`
```
var _loc3_:Number = (param1 - 48) / (param2 - 48);
```
…clamped to 0, then `:336-341` show the grey label **iff** ratio == 0, `:343-346` **hide** it while
0 < ratio < 1, and `:347-358` swap it to `getString(175)` = `"Critical Hit"` and fire
`Snd_criticalDamage` at ratio >= 1. The two label strings are built at `:110-111`.

**The bar's zero point IS 48 — the exact value `§1t4470s0§` gates the stance switch on.** The
caption the ledger read as a lock is the gate's *"not yet"*.

> **No frame-vs-doc conflict survives here.** The frame and the code agree; `RR:158` is a
> misreading of the frame, not a disagreement with it. I am recording that explicitly because the
> invariant obliges me to say so when it applies — and here it does not, in the ledger's favour.

Measured corroboration: the highest fill I found in any combat frame is 41.4 % (`t0435s`), i.e. the
sampled footage never reaches the crit threshold, so nothing in these frames can be cited against a
gate that opens at 48 and a crit that fires at max.

---

## 2. Verdicts

| # | claim | verdict | overturn | defect found |
|---|---|---|---|---|
| 1 | `combat-core/in-combat-stance-cycling-is-live-code-in-v0717` | **HELD** | upheld | minor: omits the `!§1t10074s0§` mid-gesture guard on the SPACE path |
| 2 | `combat-core/the-game-ships-a-loading-tip-…-change-stance-in-battle` | **HELD** | upheld | minor: "no battle-state flag anywhere" is true of the gate, not of the SPACE case |
| 3 | `hunter-s26c/deathnohead-is-31-frames-of-bone-transforms-not-a-name` | **HELD** | upheld | minor→material for porters: "17 nodes per frame" is wrong for 8 of 31 frames |
| 4 | `hunter-s26c/tenthgold-100-is-contract-and-the-dan-ladder-is-hard-capped` | **HELD** | upheld | minor: lane_impact says RR:245, the blocker is at RR:205 |
| 5 | `hunter-s26c/the-271-cap-is-the-web-per-stat-cap-at-level-80` | **HELD** | upheld | none |
| 6 | `hunter-s26c/web-19-field-save-schema-is-a-positional-twin` | **HELD** | upheld (partial, self-declared) | none |
| 7 | `hunter-s26c/web-crit-is-flat-1p3-and-the-proc-rule-is-deterministic` | **HELD** | upheld | none |

### Notes per claim

**1 & 2 — stance.** `§1t99s0§.as:3048-3051` and `:3058-3081` read exactly as quoted. The
light/balanced/heavy labels are not assumed: `§1t99s0§.as:27,:29,:31` declare `12220=0, 12221=1,
12222=2`, and the android twin `MCSPlayer.as:27` declares `LIGHT_STANCE:int = 0`, so the cycle order
is proven, not inferred. `GameEngine.as:584` is verbatim, and sits inside a `dice` chain whose
neighbours (`:588` number keys, `:592` drag-and-drop skills) are all battle-input tips. Build
labelling is correct under C2 — the tip is v0.682 corroboration, the gate value 48 is web source.

**3 — deathnohead.** citelint flagged `QUOTE_UNVERIFIED`; that is a **false negative** from CRLF
line endings plus the quote's ellipsis. I located the string verbatim at byte 434948. `d="31"`,
31 `<f>` blocks, 158 `<anim>` rows, all eight death variants present. Per **C1** the blob is plain
UTF-8-with-BOM, not UTF-16LE. The md5 join is *not* the circular diff **C2** forbids — `bindata/` is
the WEB payload side (S0-1) — and I recomputed both hashes.

**4 — tenthGold.** Every quoted line number is exact (`:2644`, `:2646`, `:2651`, `:2653`, `:2655`).
Constants verified independently: `§1t9426s0§ = 25` at `§1t1523s0§.as:254` = android `STAT_DAN = 25`
(`StatsManager.as:220`); `§1t9413s0§ = 12` = `STAT_HGOLD` (`StatsManager.as:194`). Ten rungs confirmed
at `strings.json["455"]` = `(初段)` through `["464"]` = `(十段)`.

**5 — the 271 cap.** All four formulas verbatim at `§1t5957s0§.as:3341-3346`. I closed the hole the
ledger's reading actually depends on: `RR:201` calls 271 "gear/rebirth-inclusive", which requires the
gate to read a gear-inclusive total. It does not — `StatsManager.as:3937-3952` dispatches a PLAYERSTAT
id straight to `getPlayerStats(id)`, with EQUIPMENT a separate id band at `:3954-3955`. The ceiling is
on the **base** stat, so the ledger is wrong about the mechanism, not merely the arithmetic.

**6 — save schema.** I counted both sides: web `§1t1832s0§.as:2815-2833` = 19 fields, android
`QueryManagerBase.as:2941-2959` = 19 fields, anchors aligned at positions 4/6/9/10 and the tail three.
The overturn is **partial and the finding says so** — `RR:351` bundles save-format with server-sim
topology; only the first clause falls. Upheld on that stated scope.

**7 — crit.** `:3258` carries the only `Math.random` in the function; `:3272-3274` gate the 1.3×
branch purely on `§1t4414s0§ == §1t4415s0§`. Deterministic. A third channel I found while judging
claim 1 corroborates it: `§1t113s0§.as:347-358` fires `Snd_criticalDamage` and swaps the caption to
`getString(175)` = `"Critical Hit"` on the same equality — UI bound to the same test, which a chance
roll could not produce.

---

## 3. What I compared each finding against (empty results are only credible with a full list)

Searched `LEDGER_EVIDENCE.md` / `LEDGER_EVIDENCE.json` **by cited artifact**, not by wording.

- **Stance (1, 2)** — 7 surviving neighbours under the `RR:158` header (`:143-173`) plus
  `newfind/cannot-change-stance-is-getstring-960` (`:1630`, `:3226`). All agree. One off-by-one exists
  in the corpus (`stance-switch-gate-is-48` says the caption fires *exactly* when the cycle refuses; at
  `reload == 48` the caption is on and the cycle **succeeds**) — neither packet finding repeats it.
- **Death anims (3)** — `NF-F/two-animation-blobs-are-md5-identical-web-to-android`,
  `NF-E/bindata-parity-map-21-of-27-identical`, `art-anim/severed-limb-death-variant-is-held`,
  `questdata/severed-limb-deaths`. Frame counts agree **exactly** with my own census
  (nohand 25 / nohead 31 / inhalf 28 / byarrow 21 / witharrow 23). **One live build-label conflict** →
  new finding below.
- **Dan (4)** — `skills-meters/dan-caps-at-9-and-the-100-gold-tier-is-real` (near-duplicate),
  `actionscript/dan-cap-and-post-rebirth-sp` (android-sourced; this finding upgrades it to web),
  the achievement-51 finding (`:820-822`), `rebirth/ledger-film-phantom-source` (`:823-826`). All agree.
- **271 (5)** — `progression/271-cap-explained` (9 critics, same `:3344` cite), the per-point grant
  table (`:879-880`), the AP-cap gift (`:1433`). **All consistent, and mutually reinforcing:** the cap
  coefficients `10/5/5/3/3/3` are the same six numbers as the per-point grants.
- **Save (6)** — `hunter-s26a/full-offline-save-schema-is-19-fields-in-both-builds`,
  `persistence/offline-save-schema-is-fourteen-fields-already-written` (**conflict**, settled below),
  `actionscript/save-schema`, `save-schema/dataslots-20-…`, `save-schema/is-android-only-evidence`
  (**not** a conflict — those describe the PIO server slot map, a different mechanism).
- **Crit (7)** — the three crit findings at `:313-319`, the proc finding at `:2758`, the stance-damage
  cluster at `:20-66`, the "Focus max = 192" finding. All consistent.

---

## 4. New findings (three)

### NF-1 `lens3/offline-save-write-branch-is-nineteen-not-fourteen` — kills a surviving finding
`persistence/offline-save-schema-is-fourteen-fields-already-written` (UPHELD) cites
`QueryManagerBase.as:2910-2925`. **That range stops at `booleanStats`.** The `else` branch runs
`:2912-:2930` and writes **nineteen**. The five it drops are `activeQuestList` `:2926`,
`completedQuestList` `:2927`, `playerlocation` `:2928`, `taunt` `:2929`, `friends` `:2930` — i.e. the
entire quest-progress and world-position half of the save. A recreation built to fourteen would
silently lose quest state and respawn position on every load. Confirmed twice: the delete twin
`:2941-2959` clears the same nineteen, and the web twin `§1t1832s0§.as:2815-2833` clears nineteen in
the identical order. **The fourteen is wrong.**

### NF-2 `lens3/severed-limb-blob-build-label-is-web-v0717-not-android` — resolves a build-label split
Three surviving findings describe the same 977,277 bytes. `art-anim/severed-limb-death-variant-is-held`
(3 critics) labels them **android v0.682**; `NF-F` and `NF-E` place them in the **web** payload.
Recomputed:
```
md5 reference/extracted/bindata/108_1t4635s0.bin                       bcfd658e79fafb41f52431afb7d10622
md5 reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin bcfd658e79fafb41f52431afb7d10622
```
977,277 bytes each. `bindata/` is the WEB side (S0-1), so this is genuine cross-build parity, not the
circular diff **C2** forbids. Correct label: **both builds**. The conservative "android v0.682" label is
the defective one and would leave `RR:240` blocker ⑤ nominally open on a technicality already
discharged by hash.

### NF-3 `lens3/human-anim-node-count-is-per-anim-not-a-fixed-rig` — corrects a surviving finding *and* claim 3
`art-anim-audio-feel/rig-is-19-nodes` (UPHELD) says "19 nodes per pose in the stance sets (**20 in the
human set**)". Census over all 158 `<anim>` rows in blob 108, counting `<n>` per `<f>`:

```
per-anim MAX node count:  20 → 2 anims · 19 → 130 · 18 → 10 · 17 → 13 · 13 → 3
anims whose per-frame node count VARIES within the clip: 44 of 158
```

"20 in the human set" is true of **2 of 158**. Worse for a fixed-rig renderer, 44 clips vary
frame-to-frame and several bottom out at **zero** `<n>` records (`heavyhorizontalslash_partc`,
`balancedhorizontalslash_partc`, `balancedjumpslash_parta`, `sheathesword`, `backstep`, `forwardstep`,
`katanajump`). The severance deaths are the sharpest case:

```
deathnohead  d=31  [17 ×23, then 1 ×8]      frame 23 in full: <n i="16" x="-188" y="-7" r="168"/>
deathnohand  d=25  [17 ×23, then 3 ×2]
deathinhalf  d=28  [17 ×28]                 (no sparse tail)
```

**A node record is a per-frame delta list, not a full skeleton pose.** A renderer that resets unlisted
joints each frame will tear the corpse apart on the tail of every dismemberment clip. This is also the
correction to packet claim 3's "17 node records per frame" — true of 23 of its 31 frames.

---

## 5. Honest limits

- Claims 4, 5 and 6 are near-duplicates of already-surviving findings (`dan-caps-at-9-…`,
  `progression/271-cap-explained` at 9 critics, `hunter-s26a/full-offline-save-schema-…`). Duplication
  is not a refutation ground, and in each case the packet version is the *more precise* of the pair
  (claim 6's `:2811-2833` beats the incumbent's short `:2813-2825`).
- `getString(960)` — the "CANNOT CHANGE STANCE" string — is **absent** from
  `docs/gauntlet/L0/index/strings.json`, which is the v0.682 table. It is a web-only string, resolvable
  only from film. That is consistent with **C2** and is why the label was never sourced from the payload.
- I did not open `critics/*.md` or `sources/*.md` (§3.2). Everything above is from the packet, the
  evidence index, `LEDGER_EVIDENCE`, and artifacts I opened myself.
