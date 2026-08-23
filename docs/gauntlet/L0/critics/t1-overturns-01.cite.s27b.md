# t1-overturns-01 — CITE LENS (blind critic, s27b)

**Packet:** 7 claims, all flagged `overturns_ledger=true`.
**Judged:** 7. **Skipped:** 0. **Refuted:** 0. **Overturns upheld:** 7.

That is an uncomfortable result for a lens whose job is to default to `refuted=true`, so I state
plainly what made it come out this way: **six of seven claims cite decompiled ActionScript, and
ActionScript either says the thing or it does not.** There is no room for an inference dressed as a
citation when the cite is a line of executable code and the quote is byte-exact. I checked every
line number, every quoted string, and — where a claim leaned on an obfuscated symbol meaning
something — I re-derived the symbol mapping from the constant tables myself instead of accepting it.
Three claims carry an imprecision I have written into the verdict. None of them is a mis-cite.

---

## The one that mattered: RR:158 did not lose to code. It lost to its own frame.

Two claims (`in-combat-stance-cycling…`, `the-game-ships-a-loading-tip…`) both attack RR:158's
`In-combat stance is HARD-LOCKED in v0.717 ("CANNOT CHANGE STANCE")`. The code half verified
trivially — `§1t99s0§.as:3058-3081` is a four-branch stance cycler, `:3050` is verbatim
`return this.§1t4469s0§() && this.§1t4414s0§ >= 48;`, and it has two in-combat callers
(`§1t113s0§.as:473`, the HUD button; `§1t1541s0§.as:609`, the SPACE key). A third hit for
`§1t4472s0§` at `§1t406s0§.as:3064` is a **different class's** method with the same obfuscated slot
name — it opens a mail popup — so "exactly two callers" is right.

But RR:158's authority never came from code. It came from a **frame**, and §0 says the frame wins.
So I went and opened the frame.

`reference/frames/duel_dense/Nr4fQstqHDM_429.0.png`, crop `(0,920)-(620,1080)` of the 1920×1080
frame, upscaled 3×: under the green `20/20` HP bar and the blue `26/26` bar there is a **third bar**,
dark and unfilled, printing `CANNOT CHANGE STANCE` in grey caps. The yellow `150% DAMAGE` Potato-Dog
buff sits *below* the bar stack, not inside it. So the text is not a buff-strip entry. It is
**painted inside the meter**.

Then the code names that widget. `§1t113s0§.as:326-361`:

```
:328   var _loc3_:Number = (param1 - 48) / (param2 - 48);
:336   if(_loc3_ == 0)          -> htmlText = §1t5204s0§   (grey, getString(960))
:344   else if 0 < _loc3_ < 1   -> label.visible = false
:348   else if(_loc3_ >= 1)     -> htmlText = §1t5203s0§   (black, getString(175) = "Critical Hit")
                                 + Snd_criticalDamage
```

The bar is normalized so **48 is zero**. At or below 48 it prints the grey caption. `getString(960)`
is missing from `strings.json` — that table is the **Android** build's 2,533 entries and has no 960 —
which is precisely why nobody had matched the frame text to the code before.

**So the frame and the code never disagreed.** The frame shows a Focus meter parked at/below 48
telling the player they cannot afford a switch *right now*, on a bar whose switch costs exactly 48
(`§1t99s0§.as:3162`, `this.§1t4414s0§ -= 48;`) out of a max of 192 (`:249`, `8 * 24`). The ledger read
a transient affordability message as a permanent state. RR:158, `SHSD_MASTER_REFERENCE.md:388` and
`:2099` all fall, and the recreation's Focus-gated in-combat switch turns out to be **the original, at
the original threshold** — not a divergence to be labelled.

I filed that reconciliation as a new finding rather than folding it into the two claims, because
neither claim made it and it is the piece that actually closes the argument.

On the loading-tip claim I hunted the one thing that could have sunk it: the extra flag in the SPACE
gate, `if(!§1t10074s0§ && _loc2_.§1t4470s0§())`. It is **not** a battle-state flag —
`§1t1541s0§.as:191` sets it true inside the MouseDown handler that seeds the gesture canvas, `:217`
clears it on MouseUp. It means "a slash gesture is mid-drag". The claim's "no battle-state flag
anywhere" survives. The claim also labels its own build split honestly (tip is Android v0.682, gate
and handler are web v0.717), so the S0-3 parity caveat is disclosed rather than buried, and the
web-side half stands without the tip.

---

## The QUOTE_UNVERIFIED one: I found the quote

`deathnohead-is-31-frames-of-bone-transforms` was the packet's only machine-flagged claim. The quote
is there. `reference/extracted/bindata/108_1t4635s0.bin` is UTF-8-BOM XML rooted at `<animdata>`;
`grep -c '<anim '` returns **158**; `<anim i="deathnohead" d="31">` is present verbatim; the block is
16,531 chars with **exactly 31** `<f>` elements numbered 0–30; and frame 0 opens with exactly the two
quoted node records, in the quoted order. All eight death anims exist — death 38, deathenemy 23,
deathnohand 25, deathnohead 31, deathwitharrow 23, deathbyarrow 21, deathdowned 7, deathinhalf 28.

The md5-identity claim also holds: both `108_1t4635s0.bin` and
`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` hash `bcfd658e79fafb41f52431afb7d10622`.
**This is not the C2 circularity trap** — 108 is a genuine web bindata file (S0-1: 100–118 are the web
`<animdata>` blobs), so the match is a real cross-build parity result, not a file diffed against itself.

One imprecision: "about seventeen node records" per frame is exact for frames 0–22 and **wrong for
frames 23–30, which carry exactly one node, `i="16"`**. So "per-frame x/y/rotation for every bone" is
literally false for the last eight frames. That detail actually *supports* the substance — after the
body settles, only node 16 keeps moving, which is the severed head's own trajectory. I upheld the
overturn, but flagged that it should enter the ledger as **"keyframes recovered"**, not "nothing left
to catalogue": the blob gives bone transforms, not the detached-limb artwork.

---

## Symbol mappings I re-derived rather than accepted

Three claims turn on "this obfuscated constant equals that Android stat". I checked all of them.

| Claim | Asserted | Verified against |
|---|---|---|
| tenthGold | `§1t9413s0§` = STAT_HGOLD | `§1t1523s0§.as:228` = 12 vs `StatsManager.as:194` = 12 ✓ |
| dan cap | `§1t9426s0§` = STAT_DAN | `§1t1523s0§.as:254` = 25 vs `StatsManager.as:220` = 25 ✓ |
| 271 cap | `§1t9411s0§` = STAT_LEVEL, `§1t9408s0§` = STAT_ATTACK | web 1/4/6/10/14 vs android MAXHP 1 / MAXCHI 4 / ATTACK 6 / LEVEL 10 / MAXAP 14 — index-for-index ✓ |
| save schema | 12 obfuscated field names | positional alignment across two 19-field lists, plus `§1t6928s0§` = skillSlots corroborated at `§1t1523s0§.as:2660-2662` (`new Vector.<§1t57s0§>(8)`) ✓ |

All four hold. On the 271 cap the un-obfuscated `statsPanel.HPadd` at `§1t5957s0§.as:3347` anchors the
whole block, and the arithmetic is right: L80 → ATK/DEF/SPD < `1+90*3` = **271**, MAXHP 910,
MAXCHI 460, MAXAP 480, with Android producing 90 instead. RR:201's "gear/rebirth-inclusive,
237-point budget" is simply the wrong story about a hard-coded point-buy ceiling.

On the save schema I counted both lists myself: 19 fields each, `playerLevel` at 4, `equipment` at 6,
`inventory` at 9, `stash` at 10, `playerlocation`/`taunt`/`friends` at 17/18/19. Flagged over-reach:
this is the **delete** routine, so it recovers field names and order, **not** the per-field value
encoding. "Something to transcribe" is true of the schema's shape, not yet of its serialization. The
claim is right that RR:351 is a compound sentence and only the save-format half falls — it asks for a
split rather than a deletion, which is the honest call.

Two small errors worth carrying into the rewrite, neither fatal:

- **tenthGold**: the ten dan rungs are `strings.json["455"]='(初段)'` … `["464"]='(十段)'`. The claim
  said "456-464", which is nine IDs for ten rungs. The cited entry `["464"]` resolves and does say
  十段, so this is a range typo, not a mis-cite.
- **crit**: RR:153 hypothesised the "3×" folklore as 1.3× *compounded* with a per-stance crit-damage
  stat. The code is 1.3× **plus an additive stat**. "Exactly the mechanism RR:151-154 hypothesised"
  overstates it slightly.

The crit claim itself is airtight. `§1t99s0§.as:3255-3277`: the only RNG is the base roll at `:3258`;
`:3272-3274` is `if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }`.
Deterministic at full Focus, flat 1.3, additive crit-damage stat. Android pays 1.2/1.5 and must not be
ported. Independent HUD corroboration: `§1t113s0§.as:348-358` fires `Snd_criticalDamage` and prints
`"Critical Hit"` at exactly the same condition.

---

## New findings (3)

1. **`focus-meter-numerics-are-fully-recovered-in-web-v0717`** — RR:195 blocker ③ "Focus numerics
   (max/fill/switch-cost)" is not a blocker. Max 192 (`8*24`), starts 0, fills +1/tick, switch costs
   48, full-meter slash zeroes it, per-stance slash debit ×0.5 / ×1.0 / ×1.5, a flat +6 refill, and a
   `(v-48)/(max-48)` HUD normalization. All in `§1t99s0§.as` and `§1t113s0§.as:328`.

2. **`cannot-change-stance-is-the-focus-bar-low-end-label-not-a-lock`** — the reconciliation above.
   Kills the last defence of RR:158 by re-reading its own frame, and hands the HUD lane a spec.

3. **`stance-damage-ceiling-is-mastery-10-not-mastery-9`** (PARTIAL) — `§1t99s0§.as:3259-3271` gives
   the formula: Light `0.5 + 0.4·m·0.1`, Balanced `1 + 0.2·m·0.1`, Heavy flat `1.4`. At m=0 that is
   0.5/1.0/1.4 (RR:156's level-1 row ✓); at m=**10** it is 0.9/1.2/1.4 (RR:155's ceiling table ✓); at
   m=9 it is 0.86/1.18, which matches neither. `strings.json["8131"]` = "Light Stance Mastery Level
   10." settles the cap independently. RR:155-156's table is right; its **"MASTERY-9" label is off by
   one**, and so is the standing note in project memory. The damage half stops being an INFERRED table
   and becomes a formula, dissolving RR:157's "model the curve or decide-and-flag" fork. The **reach**
   half (300/200/100) is untouched by this function and stays a blocker.
