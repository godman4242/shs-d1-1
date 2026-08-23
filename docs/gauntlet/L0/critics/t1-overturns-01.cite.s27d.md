# t1-overturns-01 — blind cite-lens review (s27d)

**Packet:** 7 claims · **judged:** 7 · **skipped:** none
**Result:** 0 refuted · 7 survive · 1 survives but **fails to overturn the ledger line it names**
**New:** 5 findings, 1 of which overturns three MASTER_REFERENCE rows

---

## Headline

I expected to kill several of these. I killed none, and the reason is that the packet is
sitting on a resource nobody in it seems to have noticed they had: **`reference/decompiled/shs3_android/`
is an un-obfuscated twin of the web payload's combat class.** `§1t99s0§.as` and `MCSPlayer.as`
are the same file compiled from the same source with the symbols intact on one side. Aligning
the two `initPlayer` signatures names every opaque identifier the packet quotes, which meant I
could check each claim twice — once against the web bytes it cites, once against a build that
spells the variable out.

Every quoted line in the packet is verbatim. I byte-compared the five lines the machine audit
flagged and all five match character for character.

**Standing invariant, discharged out loud:** the frame and the code did **not** disagree here.
I opened `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png` myself, cropped `(0,920)-(620,1080)`
of the 1920×1080 frame and upscaled 3× (LANCZOS). Green `20/20`, blue `26/26`, and beneath them a
third bar that is **dark and completely unfilled**, with `CANNOT CHANGE STANCE` across it in grey
caps, and yellow `150% DAMAGE` sitting *below* the stack rather than in it. That is exactly the
`_loc3_ == 0` branch of `§1t113s0§.as:336-343`. The frame corroborates the code.

---

## The two QUOTE_UNVERIFIED flags were linter false negatives

Both flagged claims quoted correctly. I ran exact `strip()` comparisons:

| file:line | quoted text | match |
|---|---|---|
| `§1t99s0§.as:3272` | `if(this.§1t4414s0§ == this.§1t4415s0§)` | EXACT |
| `§1t99s0§.as:3274` | `return _loc2_ * 1.3 + this.§1t1243s0§;` | EXACT |
| `§1t99s0§.as:3050` | `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` | EXACT |
| `§1t99s0§.as:249`  | `this.§1t4415s0§ = 8 * 24;` | EXACT |
| `§1t99s0§.as:3060` | `if(this.§1t4414s0§ < 48)` | EXACT |

**Cause:** `scripts/gauntlet/citeLint.py:104` defines `QUOTED_SPAN_RE` over `"…"`, `“…”` and
`'…'` only. These two claims — and *only* these two in the packet — delimited with **backticks**.
Their quoted spans never became candidates, and the shingle fallback straddles the ` · `
separators and `file.as:NNNN` prefixes, so nothing landed. One token added to that regex fixes it.
This matters: the packet instruction makes QUOTE_UNVERIFIED the priority refute target, so a
cosmetic delimiter choice is currently steering critics into exactly the over-refutation §0 warns
against. Not applied — this lane may not touch files outside its journal.

---

## Verdicts

### 1. `cannot-change-stance-is-the-focus-bar-low-end-label-not-a-lock` — SURVIVES, overturn upheld

The strongest claim in the packet, and stronger than it argued. `§1t113s0§.as:110-111` holds two
captions for one widget — black `getString(175)`, grey `#BBBBBB` `getString(960)` — and `:326-361`
switches between them on `(v-48)/(max-48)`: grey-and-visible at 0, hidden in between, black plus
`Snd_criticalDamage` at ≥1. `strings.json["175"]` is `Critical Hit`, verbatim.

Its admission that **960 is absent** is true for a reason it didn't state: the android table skips
the entire 881–999 block (keys run `…877, 878, 879, 880, 1000, 1001…`). 960 is a **web-only ID**.

**The corroboration it missed.** `shs3_android/scripts/BattleUI.as:101-102` gives this widget exactly
*one* string — `this.crittext.text = LangManager.getString(175)` — and `:262` shows it only at
`percentage >= 1`. **v0.682 has no low-end caption at all.** A frame showing a grey caption on an
*empty* bar therefore cannot be the android build. It can only be the web two-state widget in its
zero branch. The ledger read a transient affordability message as a permanent state.

### 2. `focus-meter-numerics-are-fully-recovered-in-web-v0717` — SURVIVES, one label wrong (material)

Every numeric verified: max `8*24`, init 0, `+1` per tick, `-48` on switch, zero-at-full,
`/2 · ×1 · ×1.5` slash debits, `+6` clamped, `(v-48)/(max-48)` HUD.

**Naming vindicated, not muddled.** I nearly refuted this over "Focus" vs the code's `reload`.
`SkillManager.as:218-219` settles it: `case SKILL_FOCUS: owner.reload = owner.maxreload - 1;` —
and that skill is `skilldata.xml:283-297` id 1005, displayname `6008` = *"Focus"*, desc `6011` =
*"Instantly recharges your focus bar."* The Focus bar **is** `§1t4414s0§`. RR:195 blocker ③ is
genuinely answered.

**Defect (material).** `Balanced/Dual slashUsage, Heavy/Reversed slashUsage*1.5` has Dual and
Reversed **swapped** — see new finding 1. Would be ported wrong into `src/config`.

### 3. `stance-damage-ceiling-is-mastery-10-not-mastery-9` — SURVIVES, PARTIAL is the honest verdict

`m=0` → 0.5/1.0/1.4 = RR:156's level-1 row. `m=10` → 0.9/1.2/1.4 = RR:155's ceiling.
`m=9` → 0.86/1.18, matching neither. `strings.json["8131"]` verbatim.

**I patched its own parity hole.** It leans on an *android* string to settle a *web* cap — the live
S0-3 caveat. It doesn't need to: on the web side `§1t4421s0§/§1t4422s0§/§1t4423s0§` are declared
`:int = 0` at `:107-111`, are `initPlayer` params 12/13/14 (`:196-198`), and the web's own ability
gates at `:3223-3241` test `>= 3`, `>= 4`, `>= 5`. A low-integer scale hitting 0.9 at exactly 10 is
settled by **web code alone**.

**Defect (minor).** Calling android "a 0-100 mastery scale" is contradicted by android's own
`>=3/>=4/>=5` gates at `MCSPlayer.as:3166-3184`. Side remark about a build it says not to port.

### 4. `crit-1.3-is-sealed-in-the-web-payload` — SURVIVES, overturn upheld

Both quotes byte-exact. Literal `1.3`, conditioned on `meter == max`, no probability roll.

**Added force.** `MCSPlayer.as:3215-3221` shows the same slot carrying *different* values in
v0.682: `if(this.stance != LIGHT_STANCE){ return maxDamage * 1.2 + STAT_CRITICALDMG; }` then
`return maxDamage * 1.5 + STAT_CRITICALDMG;` — android excludes Light from crit entirely and uses
1.2/1.5. That makes the **web** cite load-bearing: porting from the android blob would have given
the wrong constant. It also identifies `§1t1243s0§` as `STAT_CRITICALDMG`, the additive term
RR:153 was groping at with "the per-stance crit-damage stat".

### 5. `stance-reach-is-asymmetric…hard-floor-of-100` — SURVIVES, but **overturn NOT upheld**

The one claim that is true and still fails. The evidence is real and doubly confirmed:
web `:3094` Light reach `× 1.4` **flat**, `:3105` Balanced `(1 + 0.2m·0.1)`, `:3116` Heavy
`(0.5 + 0.4m·0.1)` with `if < 100 → 100` at `:3117-3120`; android `:3030 / :3041 / :3052-3056`
mirrors all three including the identical 100 floor. The mirror-image structure holds, and
"300/200/100 cannot be a ceiling row off one base" is sound — 1.4/1.2/0.9 is not 3:2:1.

**But its stated overturn is against RR:156's `Heavy's reach also scales ×0.5→×0.9`, on the ground
that "m=1 gives 0.54". That is refuted by the web code itself:** `§1t4423s0§` is declared `:int = 0`
at `:111`. Mastery starts at **zero**, so the low endpoint is exactly ×0.5 and ×0.9 lands at m=10.
**RR:156 is correct as written** — every clause of it. The sentence that actually falls is RR:155's
reach *triple*. The claim aimed one line high. `overturn_upheld = false`.

### 6. `the-in-combat-stance-gate-is-reload-48-of-a-192-max` — SURVIVES, one sentence false (material)

Headline correct and quotes exact. Android confirms the mapping and the width: `:3004-3015` is
`LIGHT → BALANCED → HEAVY → LIGHT` on the non-console path; `:2965-2967` `canChangeStance` is the
actionState whitelist `§1t4469s0§` mirrors. RR:158's hard-lock falls.

**Defect (material).** *"the in-combat stance switch costs no Focus and no Chi"* is **wrong on the
Focus half**. `§1t99s0§.as:3160-3171` — a line this claim never opened, though its packet-mate did —
runs `if(§1t1525s0§.§1t9948s0§()){ this.§1t4414s0§ -= 48; }` inside `setStance`, and `§1t9948s0§` is
`StageManager.isBattle()` by exact positional correspondence with `MCSPlayer.as:3096-3114`. The
meter is **both the key and the toll**. The "no Chi" half is correct — I read all of `§1t4472s0§`
and `§1t3489s0§`.

### 7. `the-real-in-combat-stance-rule-is-actionstate-gate-AND-meter-48` — SURVIVES

Best-formed claim in the packet: it makes no quote it cannot back and states the rule positively so
it can be ported. `:3045` is exactly the six-state whitelist described, sixth conditional on
`§1t3251s0§`. `§1t113s0§.as:470-479` is exactly `Snd_smallClick` on success / `Snd_error` on refusal.
`BattleUI.as:275-284` routes the portrait-bust hit test to `stanceButtonClick` → `canChangeStance()`
→ `nextStance()`, confirming `§1t4470s0§`/`§1t4472s0§`. Cosmetic slop only: prose says `:3266-3268`
where `:3266` is a `break;` and the assignment is at `:3270` — its **cite field** says `:3266-3270`
and is right. To be complete this rule needs the **48 debit** added; the gate is half the contract.

---

## New findings

1. **`§1t12223s0§ = DUAL`, `§1t12224s0§ = REVERSED`** — not the reverse. Three independent signals
   agree: reach formula, `setStanceColor` index, and reload-debit grouping, all matched across the
   two builds. Full mapping: 12220 LIGHT · 12221 BALANCED · 12222 HEAVY · 12223 DUAL · 12224 REVERSED.

2. **The Focus bar IS the reload meter — and Replenish Focus stops one tick short.**
   `SkillManager.as:219` sets `reload = maxreload - 1`. **Minus one.** The skill deliberately does not
   grant the `meter == max` crit. A recreation that sets it to max hands the player a free critical hit.

3. **The in-combat stance switch COSTS 48 — so the recreation's Focus-gated switch was RIGHT.**
   `MASTER_REFERENCE:388`, `:390` and `:2099` all brand the recreation's Focus-gated mid-combat switch a
   divergence from the original; two are tagged `[CONTRACT]` and one `[CONTRACT/CONTRADICTION]`. All
   three fall, **in the recreation's favour**: v0.717 requires 48 and spends 48, gate and toll, a
   quarter-bar per switch, four switches from full. This *removes* a standing contradiction rather
   than adding one. Android must not be ported here — its threshold is `maxreload/6` = 20 of 120 and
   its debit is a two-branch rule, against the web's flat 48-and-48.

4. **A reusable obfuscated-symbol dictionary for the web combat core** (~25 symbols). This is the
   correct way to discharge the S0-3 parity caveat — not by diffing android XML against itself (C2),
   but by reading the **web** code with android as the dictionary and reporting the **web's** literals.

5. **citeLint QUOTE_UNVERIFIED false negative on backticks** (see above).

---

## Method note

I did not open `critics/` or `sources/`. Every verdict rests on files I opened myself:
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as` and `§1t113s0§.as`,
`reference/decompiled/shs3_android/scripts/{MCSPlayer,BattleUI,SkillManager}.as`,
`reference/extracted/skilldata.xml`, `docs/gauntlet/L0/index/strings.json`,
`docs/research/{REBUILD_READINESS,SHSD_MASTER_REFERENCE}.md`, and the frame
`reference/frames/duel_dense/Nr4fQstqHDM_429.0.png` cropped and upscaled by hand.
No file outside this journal path was modified.
