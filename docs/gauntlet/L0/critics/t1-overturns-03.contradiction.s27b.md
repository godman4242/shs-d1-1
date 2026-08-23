# t1-overturns-03 — LENS 3 (contradiction), blind re-judge

Packet: 7 findings. Judged: 7. Skipped: 0.
**1 REFUTED (material) · 6 HELD.** 5 new findings filed.

Structured verdicts: `docs/gauntlet/L0/critics/t1-overturns-03.contradiction.s27b.json` (written first).

---

## Headline

One claim in this packet is **half right and half wrong, and the wrong half is its own
headline**. Six others survive, four of them on frames I cropped and looked at myself.

The packet splits into three clusters, and the contradiction lens found a live collision
in exactly one of them.

| # | claim | verdict |
|---|---|---|
| 1 | `skills-meters/stance-mastery-domain-is-1-to-10-in-skilldata` | **REFUTED — material** |
| 2 | `ui-hud/battleui-carries-its-own-change-stance-button-in-both-builds` | HELD |
| 3 | `ui-hud/frame-proof-the-stance-label-hides-when-the-third-bar-fills` | HELD |
| 4 | `ui-hud/string-960-is-cannot-change-stance-frame-resolved` | HELD |
| 5 | `ui-hud/the-video-study-notes-misread-the-cannot-change-stance-slot` | HELD |
| 6 | `world/the-war-map-mask-and-pitch-are-web-side-too-parity-closed` | HELD |
| 7 | `world/the-war-map-mask-is-byte-identical-across-web-and-android` | HELD |

---

## 1. The mastery claim — ceiling right, floor wrong — REFUTED

Every sub-fact in this finding is verbatim true. I checked all of them:

- `reference/extracted/skilldata.xml:4-7` — `<id>1000</id>`, `<displayname>6000</displayname>`,
  `<passive>1</passive>`; ten `<level>` blocks with `<value>` 1..10.
- `docs/gauntlet/L0/index/strings.json["6000"]` = `'Light Stance Mastery'`.
- `reference/decompiled/shs3_android/scripts/StatsManager.as:740-742` — exactly
  `skillStats.push(new IntStat(1000,1));` / `(1001,1)` / `(1002,1)`.
- `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262` —
  `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);`
- `:3265` — `_loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);`

The arithmetic holds: m=10 → **0.90** and **1.20** exactly; m=9 → 0.86 and 1.18. So the
ledger's *"MASTERY-9 CEILING"* is dead and the overturn stands.

**But the inference `so mastery is 1-indexed with floor 1` does not follow, and it is false.**

- The seed at `:740-742` sits inside **`initNewPlayer`** (`StatsManager.as:689`). It is a
  fresh-save default, not an index base.
- NPCs read their mastery from `XMLNpc.getMastery`, which **ends `return 0;`** at
  `XMLNpc.as:685` when the npc carries no matching `<skill>` row.
- Census of `reference/extracted/npcdata.xml`: **495 `<npc>`, of which only 76 carry skill
  1000** (77 carry 1001, 79 carry 1002). So **419 npcs run this very curve at mastery 0.**
- `EnemyElite.as:89` literally declares `var balancedMastery:int = 0;` before its
  `getMastery` reads at `:103-105`.
- The web fighter class declares all three fields `= 0` at `§1t99s0§.as:107/:109/:111`.

### The collision

`floor 1` fights **five already-upheld findings** that evaluate this same curve at mastery 0:

- `[[combat-core/reach-table-is-mastery-zero-not-a-ceiling]]`
- `[[combat-core/stance-reach-is-mastery-zero-base]]`
- `[[combat-core/300-200-100-is-base-not-ceiling]]`
- `[[skills-meters/reach-triple-is-a-floor-not-a-ceiling]]`
- `[[skills-meters/stance-damage-ceiling-is-mastery-10]]` — which says **"M in 0..10"** outright

Both cannot be true. **I settled it against this finding**: m=0 is live for 85% of the
roster, so the mastery-0 reach reading stands.

**Not a build-parity split.** I checked (c) before declaring the contradiction: `XMLNpc` /
`StatsManager` are android v0.682 and `§1t99s0§` is web v0.717, and they **agree** — the
field is a plain int defaulting to 0 in both.

**Refuting costs nothing on the ceiling.** Mastery-10 is banked five separate ways already,
including one at 6 critics, plus `strings.json["8131"]` = `'Light Stance Mastery Level 10.'`
The ledger sentence still falls — on those siblings, not on this one. Corrected domain filed
as **NF-S27B-1**.

---

## 2-5. The stance-HUD cluster — all four HELD, on my own frames

### The frames

I cropped and upscaled five stills. All five say what the findings say.

**`Nr4fQstqHDM_428.0.png`**, crop (100,940)-(700,1080) @3× LANCZOS — portrait plus **three**
bars: green HP `20/20`, blue Chi `26/26`, and a third bar with an **entirely brown (empty)**
track carrying **CANNOT CHANGE STANCE** in pale grey. `150% DAMAGE` sits below it in
saturated yellow.

**`_432.5.png`** and **`_432.9.png`**, crop (240,1018)-(540,1052) @4× — same duel, that third
bar now has a **white fill block at its left edge**, growing between the two frames, and the
lettering is **gone**.

**`t1003.000.png`**, crop (0,820)-(660,1080) @3× — HP `14/20`, Chi `31/31`, third bar empty
with the grey caption.

**`t1082.100.png`**, same crop — HP `11/20`, Chi `31/47`, third bar part-filled white, **no
text**. I measured the fill instead of eyeballing it: at y=1034/1036/1038 the white run is
x=245..320 against a track spanning x=243..515 — **27.6%**. The finding said "about 28%".
Exact.

That is `§1t113s0§.as:336-342` (show at ratio 0) and `:344-347` (hide while filling)
rendered on film.

### The code

All cited lines are exact. `§1t113s0§.as:111` builds the grey string:

```
this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";
```

`:328` is `var _loc3_:Number = (param1 - 48) / (param2 - 48);`, and `:348-359` swaps to the
black `getString(175)` plus `Snd_criticalDamage` at ratio ≥ 1.

`strings.json` — the android v0.682 table — has **no key `960`**, while `175`='Critical Hit'
and `208`='Change Stance' are both present. Finding 4's web-only premise checks out.

### The obfuscation map (finding 2) — verified and extended

The android twin decodes the web fields positionally, line for line:

| web | android | proof |
|---|---|---|
| `§1t5169s0§` | `crittext` | web `:120-121` ≡ android `:101-102`, both `getString(175)` |
| `§1t5161s0§` | `changestancelabel` | web `:145-146` ≡ android `:109-110`, both `getString(208)` |
| `§1t5158s0§` | `battlemodebust` | web `:147-149` ≡ android `:111-113`, same three statements |
| `§1t5182s0§` | `reloadbar` | by **function**: `§1t5205s0§` sets `.bar.scaleX` from the reload ratio, as android `updateReload` does at `:261` |
| `§1t5215s0§` / `§1t5216s0§` | `showChangeStanceLabel` / `hideChangeStanceLabel` | web `:241-242`/`:542-549` ≡ android `:192-193`/`:432-439` — **new** |

citeLint's `QUOTE_NOT_LOCATED` on findings 2 and 4 is a false alarm: finding 2's quote splices
two sites with `//` (both halves verbatim), and finding 4's quote describes a frame, not a
file line. I confirmed both by opening the artifact.

### The contradiction I had to settle

Two findings **both already survive** and say opposite things about the same caption:

- `LEDGER_EVIDENCE.md:1630` — *"is **not** a lock notice, it is the reload/crit meter's own
  low-end label"*
- `LEDGER_EVIDENCE.md:160` — *"'CANNOT CHANGE STANCE' is a **literally true refusal**"*

I did not report tension. I opened the artifacts. **Both are true, because they are the same
constant written in two files:**

```
§1t113s0§.as:328   ratio = (reload - 48) / (maxreload - 48)   → caption shown iff ratio == 0, i.e. reload <= 48
§1t99s0§.as:3050   return §1t4469s0§() && this.§1t4414s0§ >= 48   → switch legal iff reload >= 48
§1t99s0§.as:3060   if(this.§1t4414s0§ < 48) return;
```

The two predicates are complements **except on one value**: at `reload == 48` the bar reads
0% and the caption is on screen *while the switch is legal*. That single-value overlap is a
shipped cosmetic off-by-one — not a disagreement between the findings. Filed as **NF-S27B-2**.

This makes findings 3/4/5's phrase *"not a battle-state lock"* a shade strong. It is not
grounds to refute: their target is the ledger's **unconditional** `HARD-LOCKED`, which is
dead either way.

### A false contradiction I checked and dismissed

Finding 2 is tagged `both`; finding 4's whole premise is that string 960 is **web-only**.
These do not fight. They concern **different fields** — `§1t5161s0§` (the `getString(208)`
button label, present in both builds) versus `§1t5169s0§` (the `getString(960)` ratio-0
caption, web-only). Both true.

### THE FRAME WINS OVER THE MEASUREMENT DOC (finding 5)

Saying it out loud as §0 requires. Every doc cite is verbatim:

- `B-11:7` — *"**Yellow text** under the bars: 'CANNOT CHANGE STANCE' and '150% DAMAGE'"*
- `B-11:45` — *"**Green bar** under HP fluctuated 4/20 → 2/20 → 3/20 … while label reads
  'CANNOT CHANGE STANCE' — reads as a stance-lock/special resource"*
- `B-11:71` — *"the small green \"X/20\" bar (stance-lock resource, label \"CANNOT CHANGE STANCE\")"*
- `A-16:23` — *"a plain **unlabeled blue bar**"*, *"a separate 20/20 resource"*

The film contradicts all four. In **two different duels** (`t1003.000.png` and
`Nr4fQstqHDM_428.0.png`) the caption is **pale grey/off-white** on its **own numeral-free
third bar**, with the saturated-yellow `150% DAMAGE` a separate line below. The colour
difference is unmistakable within a single crop.

The notes also have **HP and Chi swapped**. `B-11:7` calls the blue bar HP and the green
`X/20` bar a stamina meter — but `A-16:22` independently logs HP as `N/20` taking damage, and
my crops show the **blue maximum moving 31 → 47** across the run while the green stays `/20`.
Green = HP, blue = Chi. The code agrees: `§1t113s0§.as:111` is `#BBBBBB`, and `§1t5205s0§`
touches only `.bar.scaleX` at `:333` with no text field, while the numeric bars are written
by `§1t5201s0§`/`§1t5202s0§` at `:312-324`.

---

## 6-7. The war map — both HELD

### Byte-check, re-run rather than trusted

```
md5 92_1t4648s0.bin              = 13068dfa1a5cc5628720a25782f93fed
md5 110_Mobile_MapBitmapData.bin = 13068dfa1a5cc5628720a25782f93fed
xxd -l 16 (both) = 4749 4638 3961 3f00 4800   →  GIF89a, w=0x003f=63, h=0x0048=72
PIL census (both) = 735 × (255,255,255) + 3801 × (0,0,0) = 4536 = 63×72
```

The load-bearing half — that 92 is **web**-side, so this is not a file diffed against itself —
I verified independently of the filename: `§1t4648s0§.as:5` is
`[Embed(source="/_assets/92_1t4648s0.bin", mimeType="application/octet-stream")]`, an
obfuscated **web payload** class, and `bindata.json` lists it at 272 bytes, `image/gif`.

The C2 exemption is correctly argued. C2's circularity bites on the four data XMLs
(questdata / skilldata / npcdata / itemdata), which are android-sourced — **not** on a web
bindata file matched against an android blob.

### The web-side pitch (finding 6)

Exact, every line:

```
§1t7934s0§.as:15  public static var §1t12535s0§:int = 8;
             :17  ... §1t12536s0§:int = 21;
             :19  ... §1t12537s0§:int = 51;
             :232 return this.§1t7958s0§.getPixel(param1 + §1t12536s0§ - §1t12535s0§, param2 + §1t12537s0§) != 0;
             :299 _loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;
             :300 _loc11_.y = (_loc9_ + §1t12537s0§) * 10 + 8.8;
```

Android `WarSelectUI.as:15/:17/:19` = `WARMARKERSHIFTX=8` / `TERRSHIFTX=21` / `TERRSHIFTY=51`,
with the identical `getPixel` at `:173`. The mapid claim is the exact inverse of what the code
decodes at `:296-297`: `(_loc10_ >> 12 & 0x0FFF) - 341` and `(_loc10_ & 0x0FFF) - 341`.
`§1t6481s0§.as:17/:19/:21` repeats the three constants and `:263` the land test.

### Contradiction checked, and it was a mis-naming, not a conflict

`[[world/war-map-renders-at-10px-per-territory]]` (`LEDGER_EVIDENCE.md:3207-3209`) carries the
**same** `*10 + 4.5` / `*10 + 8.8` pitch but is tagged *"android v0.682 (the web twin is
§1t1524s0§)"*. Not a contradiction and not a build split — the values are identical, and
finding 6 **discharges** that android caveat from the web side.

The neighbour did mis-name the twin. `§1t1524s0§` is the **QuestEngine** twin (the same corpus
at `:420` puts the mask load there, `§1t1524s0§.as:697-702`). The **WarSelectUI** twin is
`§1t7934s0§` and the **WorldMapUI** twin is `§1t6481s0§`. Filed as **NF-S27B-5**.

Also consistent with banked `:2893`: `341 − 21 + 8 = 328` and `341 − 51 = 290` reproduce its
`pixel_x` / `pixel_y` transform exactly. Finding 7 is substantially a re-derivation of banked
`[[world/map-bitmap-is-held-byte-exact]]` and `[[meta-social/world-board-63x72-byte-identical]]`
— duplication is not a refutation ground, and it adds the C2 exemption argument.

---

## New findings filed (5)

| id | what it settles |
|---|---|
| **NF-S27B-1** | Mastery domain is **[0,10]**, not [1,10] — settles the packet-vs-corpus collision |
| **NF-S27B-2** | The caption and the stance gate are **one predicate** (48), diverging on one value — settles `:1630` vs `:160` |
| **NF-S27B-3** | The three-state Focus caption is **web-only**; android is two-state with a 24 dead zone |
| **NF-S27B-4** | `Change Stance` is a **hover tooltip on the portrait bust**, not a standing button |
| **NF-S27B-5** | The web WarSelectUI twin is **`§1t7934s0§`**, not `§1t1524s0§` |

## What I compared against

`docs/gauntlet/L0/LEDGER_EVIDENCE.md` groups at `:20-72` (mastery/stance tables, 11 findings),
`:143-170` (stance hard-lock, incl. `:152`, `:156`, `:158`, `:160`, `:163-170`),
`:491-511` (Focus/reload constants), `:545-553`, `:1621-1630`, `:1730`, `:2159-2166`,
`:3122-3127`, `:3176-3181`, `:3221`, and the world group at `:404-423`, `:1032-1039`,
`:2019-2022`, `:2888-2893`, `:3207-3209`.
