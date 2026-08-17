# GAUNTLET L0 — CITE-LENS CRITIC: **progression**

Blind critic pass, 2026-08-15. I did not see the surveyor's reasoning — only its
20 claims and the artifacts. Every verdict below rests on an artifact **I opened
myself**; where I could not re-derive a cite first-hand I would have refuted it.

**Bottom line: 0 refutations in 20 claims.** This is the cleanest unit I have
reviewed. Every file resolves, every line number lands within one line of where
the claim puts it, every quoted string appears verbatim, and the two arithmetic
arguments (the extrapolation error and the 9-point stat budget) both reproduce
exactly when recomputed from scratch. Three claims carry **minor** labelling
slips that do not touch their substance; I record them rather than refute them.

The score 88 is, if anything, conservative — see NEW-1, which removes the single
biggest caveat hanging over the unit.

---

## What I did first-hand

| Check | Command / artifact | Result |
|---|---|---|
| expArray, both builds | `python3` parse of `§1t1523s0§.as:364` and `StatsManager.as:78` | 99 entries each, **arrays compare equal** (`True`); [11]=37400 [20]=108000 [40]=507300 [60]=1508800 [80]=4285800 [98]=29395800 |
| extrapolation error | recomputed `31400 + (n−10)·5500 + 500·m(m+1)/2` | L20 113,900 · L40 428,900 · L60 943,900 · L80 1,658,900 → **−61.3 %** vs 4,285,800 |
| test suite | `npx vitest run tests/xp.test.ts` | `Test Files 1 passed (1) · Tests 11 passed (11)` |
| video A @ t=1600 s | own `ffmpeg -ss 1600 … crop=iw*0.62:ih*0.42:iw*0.36:ih*0.12, scale 1.6× lanczos` | level badge **4**, `5110 / 5150 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`, HP 20/20, CHI 9/15, AP 15/30, ATK 10, DEF 10 **+13** (orange), SPD 4, `WEIGHT: 73 / 100` |
| video A @ t=655 s | own `ffmpeg -ss 655 … crop=iw*0.55:ih*0.22:iw*0.42:ih*0.09, scale 1.8×` | level badge **3**, `2098 / 2950 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0` |
| unlock ladder | rebuilt all 33 `<lvlreq>` gates from `skilldata.xml` joined to `index/resolved_names.json` | **matches the claim name-for-name, level-for-level, all 33** |
| quest XP | `re.findall('<exp>')` over `questdata.xml` | 69 · `<quest>` 61 |
| SPD→damage | exhaustive `grep -n STAT_SPEED StatsManager.as` | 8 hits: reload, cooldown, slash-length, auto-assign bucket, two respec resets, one save-field list. **Never damage.** |

---

## Verdicts

All 20 **survive**. Notes below are ordered by how much they matter.

### The frame arbitration (claim `per-point-magnitudes`) is *stronger* than claimed

The surveyor rests it on one frame plus a 9-point budget fit. I found a **second,
independent frame confirmation it did not use for arithmetic**:

- `docs/research/video-study/segments/A-02-…md` line 25 records the level-3 panel
  *before and after* spending: `ATK 4→7, DEF 4+2→7+2, SPD 1→4` for **3 stat
  points** — i.e. +3 per point, and the note itself says so ("likely +1 stat
  point grants +3 to the underlying stat … treat as INFERRED").
- Reconciling that state (HP 20, Chi 10, AP 30, ATK 7, DEF 7, SPD 4) with the
  t=1600 s level-4 frame I extracted (HP 20, Chi **15**, AP 30, ATK **10**,
  DEF **10**, SPD 4): the delta is Chi +5, ATK +3, DEF +3 = **exactly the 3
  points level 4 grants**, at web magnitudes. Android magnitudes would need 8.
- And the A-02 level-3 state itself costs exactly 6 = (3−1)·3 from the start
  pools HP10/Chi10/AP30/ATK1/DEF1/SPD1.

Three independent budget closures, zero slack. **The frame wins and it matches
the WEB payload** — I confirm that out loud, as §0 requires. `shs3_android`
v0.682 is a decoder ring for symbol names, not a source of magnitudes.

### `271-cap-explained` — held, with the inference named

`1 + (80+10)·3 = 271` is exact, the formula is real at `§1t5957s0§.as:3344`, and
the reachability refutation stands on its own: from base ATK 1, each click adds
3 and the button shows while `ATK < 271`, so 90 clicks land **exactly** on 271
out of a 237-point budget. The ledger's "impossible in one stat" assumed +1 per
point and is dead. The one soft step is *identifying* the ledger's bare string
"271 cap" with this formula — the ledger carries no cite for 271 (I grepped;
line 201 is its only occurrence in `docs/research/`). The identification is an
arithmetic coincidence-free match, not a citation. Not refuted; named.

### `campaign-level-band` — data exact, conclusion inferential

142 `wave/enemy/lvl` rows at [2, 35], 9 `friend/lvl` at [25, 80], 18 roomobj rows
all 25 — all three verified against `index/questdata.json`. The step from that to
"L10 is a capture limit, not a content limit" is a sound inference, not an
artifact reading. It only has to kill the ledger's *stated reason* for blocker ②,
which it does; blocker ② is already dead by the expArray table anyway.

### `levels-81-99` — correct, respected STILL_UNHELD

I tried to break it and could not: max `<lvlreq>` in `skilldata.xml` is 80, and
`levelCap` gates XP credit (`LootDialog.as:644`) *and* level-up
(`StatsManager.as:1619` / web `§1t1523s0§.as:2043`). See NEW-5 for the one thing
that keeps the door genuinely ajar.

### Minor labelling slips (recorded, not refuted)

1. `start-pools-and-respec` cites android `StatsManager.as:2118-2138`; the
   function **signature** it quotes (`public static function unAssignStatPoints`)
   is at **:2117**. The range covers the whole body. Web `:2559-2578` is exact.
2. `ap-regen`'s inline sub-range `":1099-1103"` actually spans **:1100-:1105**
   (`:1099` is `timeDiff = timeVariable − nextAPUpdate`; `newAP = changeAP(diff)`
   is `:1105`). The claim's own `cite` field `:1090-1115` contains all of it, and
   `APINTERVAL:int = 60` at `:158` is exact.
3. `quest-xp-tabled` quotes `sample_values` as 10 items; the index holds 12. A
   truncated sample list, not a misquote — `count: 69`, `range [100.0, 3000.0]`
   are both exact.

Everything else lands on the nose, including several ranges I expected to drift:
`§1t99s0§.as:3284-3291` and `:3484-3488`, `§1t1523s0§.as:2074-2075`, `:2276`,
`:2295`, `:2344-2347`, `:2598`, `NPC.as:94-109` / `:112-164` / `:166-190` /
`:218` / `:252`, `ConnectionPIO.as:643`, `EnemyPlayer.as:1316`,
`LootDialog.as:640-642` / `:644`, `Overworld.as:318`, `XMLQuestOutcome.as:66`,
`InventoryUI.as:906`, `questdata.xml:214-216` / `:411-413`,
`skilldata.xml:257` / `:1640`, `doRebirth` `:2195-2231` with the Dan branch at
`:2201-2208` and the Dan<9 cap at `:2209`.

---

## New findings the surveyor missed

### NEW-1 — the XP-income model is WEB-parity, not android-only ⭐

`xp-income-model` cites **only** `shs3_android`. Given this unit's own proof that
the android build is differently tuned, that left the whole model under a parity
cloud. It should not be: the web build carries the same logic.

- `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:198`
  `_loc5_ = param3 * (1 + 0.05 * (param2 - param1));`
- `§1t68s0§.as:186-208` reproduces `calcXP` structurally line-for-line: grey-level
  early-return, `param2 - param1 > 3` return 0, symmetric under/over scaling,
  `if(param4) _loc5_ *= 2` elite doubling.
- `§1t68s0§.as:122` `return _loc1_ - Math.floor(_loc1_ / 10) - 5;` · `:126`
  `return _loc1_ - Math.floor(_loc1_ / 5) - 1;` · `:128` `return _loc1_ - 9;`
  — the grey-level ladder, identical.

**Consequence:** claim 14 upgrades from "android, parity unestablished" to
"confirmed in the shipped web v0.717 build". L4 blocker ④ and the L7 economy gift
both harden.

### NEW-2 — `autoAssignStats` is ANDROID-ONLY; do not port it

`levelup-refill-and-cap`'s lane_impact surfaces the round-robin auto-assign mode
from `StatsManager.as:1654-1687` with no build label. The **web** `levelUp`
(`§1t1523s0§.as:2073-2082`) has no such block — it runs `+1 SP · +3 stat ·
setStat(LEVEL) · fullHealth · AP refill · duel-token refill` and stops. It is a
mobile-only convenience feature.

The *rest* of that claim is web-confirmed and the surveyor undersold it: web
`:2078` refills AP from MAXAP and `:2079` refills duel tokens, and the levelCap
cheat-report exists in web too at `§1t1523s0§.as:2043`
(`if(!_loc5_ && _loc4_ > §1t9470s0§)`).

### NEW-3 — ⚠ the Stage-0 index's `first_lines` are LEAF-NAME scoped, not path scoped

Cross-cutting trap for **every** lane. `index/questdata.json` reports
`first_lines: [93, 226, 240, …]` identically for three *different* paths
(`wave/enemy/lvl`, `wave/friend/lvl`, `roomobj/property/obj/property/xml/wave/enemy/lvl`).
`questdata.xml:93` is none of them — I opened it: it is
`<neutral><id>118</id><qty>1</qty><x>2000</x><lvl>1</lvl></neutral>`.

`first_lines` tracks the first occurrences of the **leaf tag name**, so it is
only trustworthy when the leaf name is unique in the file (`<exp>` → [215, 412]
and `<lvlreq>` → [257, 286] are both correct for that reason). **Never cite an
index `first_lines` value as a path-specific line number without opening it.**
This unit did not — all four of its XML line cites were self-derived and all four
verified — but the next lane may not be so careful.

### NEW-4 — the android build's per-stat CAPS are drifted too, consistently

`InventoryUI.as:2407-2412`: `MAXHP < 10 + (charlevel+10)*5`, `MAXAP < 20 +
(charlevel+10)`, `ATTACK/DEFENSE/SPEED < charlevel + 10` — versus web's
`*10`, `30 + (L+10)*5`, `1 + (L+10)*3`. The caps scale **in lockstep with the
per-point magnitudes** in each build. This is independent corroboration that the
drift is a deliberate mobile re-tune of the whole stat economy, not decompiler
noise, and it confirms `per-stat-hard-caps` picked the right build. At android
L80 the ATK ceiling would be 90, not 271 — port the **web** formula.

### NEW-5 — `levelCap` is `const` in web but `var` in android

`§1t1523s0§.as:362` `public static const §1t9470s0§:int = 80;` versus
`StatsManager.as:76` `public static var levelCap:int = 80;`. The mobile build
could have its cap raised at runtime; the web build could not. This is the one
structural reason the 81–99 headroom question stays honestly open rather than
being closed as dead data — it strengthens, not weakens, the STILL_UNHELD call.

---

## Cross-lane gifts I independently confirmed

- **L1 combat-core blocker ①** ("reach cap in stage px per stance — the one value
  the whole model needs"). The SPD slash-length getter is the base, and the
  per-stance multipliers sit directly on top of it in `MCSPlayer.as`:
  `:3030` Light `= baseSlashLength * 1.5` · `:3041` Balanced
  `= base * (1 + 0.5*balancedMastery*0.01)` · `:3052` Heavy
  `= base * (0.5 + 0.5*heavyMastery*0.01)` with a **floor of 100** at `:3053-3055`
  · `:3078` default `= base`, floor 100 · consumed at `:3094`
  `InputManager.setMaxDistance(this.slashLength)`. Base is
  `120 + floor((90+Dan*5)·spd/(20+spd))` ⇒ floor 120, Dan-0 asymptote 210.
  This is a bigger gift than the surveyor claimed: it is the **complete** reach
  model, not just its base term.
- **DEF flat-subtraction** holds across every damage site, not just the one
  quoted: `MCSPlayer.as:3415` and `:3709`, `EnemyClone.as:221` and `:442` — all
  four are `damage -= getDefense()`, and the only modifier anywhere is the Heavy
  ×0.8. Corroborated by `index/resolved_names.json` skill 1002 "Heavy Stance
  Mastery", desc ending `Defense -20%`.
- **L10 world-exploration blocker ④ (AP regen)** — closed, and the cap is the
  MAXAP stat, itself capped at `30 + (level+10)*5` (web).

---

## Verdict

20/20 claims survive. 3 minor labelling slips. 5 new findings, one of which
(NEW-1) materially hardens the unit's largest blocker kill and one of which
(NEW-3) is a warning every other lane needs. I would not move the score down;
NEW-1 and NEW-4 argue for moving it up.
