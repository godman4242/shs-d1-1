# t1-overturns-01 — LENS 3 (CONTRADICTION) — blind judge s27d

Packet: `docs/gauntlet/L0/worklist/t1-overturns-01.json` · 7 findings · **7 judged, 0 skipped.**
Structured verdicts written FIRST to `docs/gauntlet/L0/critics/t1-overturns-01.contradiction.s27d.json`.

**Result: 6 survive, 1 refuted, 1 overturn denied, 5 new findings.**

All seven findings are A2 claims against two web-payload classes — `§1t99s0§.as` (the player
actor, 5,162 lines) and `§1t113s0§.as` (BattleUI, 1,344 lines). I opened both end to end over the
cited ranges, decoded the obfuscated symbols against the android's un-obfuscated `MCSPlayer.as`
twin, and then went to the frames.

---

## The single most important thing I found

**The "CANNOT CHANGE STANCE" caption disappears mid-fight, on film, in frames nobody has cited.**

`reference/frames/combat_frames/Nr4fQstqHDM_t0435s.png`, crop (150,930)-(620,1080) of 1920x1080
at 3x LANCZOS: HP **19/20** green, Chi **26/26** blue, and the third bar **~42% filled with a
white block** — with **no caption at all**, the yellow "150% DAMAGE" banner still below the stack,
screen flashed red from a hit just taken. `_t0430s.png` shows a thin white sliver, caption again
absent. `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png` — same longplay, same fight — shows the
bar **empty** and the caption **on**.

That is `§1t113s0§.as:336-343` (show the grey label at ratio == 0) and `:344-347` (hide it while
0 < ratio < 1) rendered on film. **THE FRAME WINS**, and it wins against the ledger:
`REBUILD_READINESS.md:158` says the caption "appears the instant a fight starts", and a caption
that comes and goes inside one battle cannot be that. `SHSD_MASTER_REFERENCE.md:388` and `:2099`
grade the hard lock **[CONTRACT]**; I opened both lines and both fall with it.

A second, unclaimed result from the same crop: `_t0425s.png` is the **overworld** HUD and has **no
third bar at all** — the slot under HP and Chi prints the words "HEAVY STANCE". The Focus bar is a
battle-only HUD element and the overworld reuses its slot as a stance-name readout.

---

## Verdicts

| # | claim | verdict | severity | overturn |
|---|---|---|---|---|
| 1 | `cite-s27b/cannot-change-stance-is-the-focus-bar-low-end-label-not-a-lock` | **survives** | minor | upheld |
| 2 | `cite-s27b/focus-meter-numerics-are-fully-recovered-in-web-v0717` | **survives** | minor | upheld |
| 3 | `cite-s27b/stance-damage-ceiling-is-mastery-10-not-mastery-9` | **survives** | minor | upheld |
| 4 | `combat-core/crit-1.3-is-sealed-in-the-web-payload-and-fires-at-full-reload` | **survives** | minor | upheld |
| 5 | `combat-core/stance-reach-is-asymmetric-with-damage-and-carries-a-hard-floor-of-100` | **survives** | material | **DENIED** |
| 6 | `combat-core/the-in-combat-stance-gate-is-reload-48-of-a-192-max` | **REFUTED** | material | (RR:158 falls anyway) |
| 7 | `combat-core/the-real-in-combat-stance-rule-is-actionstate-gate-AND-meter-48` | **survives** | minor | upheld |

### 1 — CANNOT CHANGE STANCE is the Focus bar's low-end label. **Survives.**
Every quoted line is verbatim: `:110` builds the black `getString(175)` label, `:111` the grey
`#BBBBBB` `getString(960)` one; `§1t5205s0§` at `:326-361` computes `(v-48)/(max-48)`, clamps at 0,
shows grey only at ratio 0, hides between, and swaps to black + `Snd_criticalDamage` at ratio >= 1.
`strings.json["175"]` = 'Critical Hit'; there is **no key "960"** — the finding's explanation (it is
the android v0.682 table, 960 is a web-only string) is right. The frame description matched my own
crop exactly, and the `t0430s`/`t0435s` pair above turns it from strong to decisive.

### 2 — Focus numerics fully recovered. **Survives, one sub-claim corrected.**
Verified: `:249` `8 * 24` = 192, `:250` init 0, `:1203-1205` +1/tick, `:3162` `-= 48`,
`:3318-3325` `+= 6` clamped, `§1t113s0§.as:328` the HUD normalisation. `RR:195` blocker ③ is dead.

**CORRECTION — Dual and Reversed are swapped.** The finding writes "Balanced/Dual slashUsage,
Heavy/Reversed slashUsage*1.5". `§1t99s0§.as:3299-3311` pairs `§1t12221s0§`+`§1t12224s0§` at x1.0
and `§1t12222s0§`+`§1t12223s0§` at x1.5; the android twin `MCSPlayer.as:3240-3263` has the identical
shape with **named** constants (BALANCED+REVERSED at x1, HEAVY+DUAL at x1.5) and `:27-35` fixes the
ids. Correct pairing: **Balanced + REVERSED x1.0, Heavy + DUAL x1.5.** The already-upheld
`LEDGER_EVIDENCE.md:540` says the same — this finding is the one out of step. Smaller: `:3295-3297`
does not branch, it zeroes **and then** debits (clamped at `:3312-3314`); drop the "otherwise".

### 3 — Mastery ceiling is 10, not 9. **Survives, two sub-claims corrected.**
`:3262` Light = `base*(0.5+0.4*m*0.1)`, `:3265` Balanced = `base*(1+0.2*m*0.1)`, `:3270` Heavy flat 1.4.
m=0 → 0.5/1.0/1.4 (RR:156's level-1 row); m=10 → **0.90/1.20/1.40** (RR:155's triple, exactly);
m=9 → 0.86/1.18, neither. Nine is also not the top rung: `skilldata.xml` gives skills 1000/1001/1002
exactly **ten** `<level><value>` rows 1..10 (lines 3-80, 82-159, 161-238) and `npcdata.xml:535`
ships elites at `<lvl>10</lvl>`.

**CORRECTION 1 — "on a 0-100 mastery scale" is wrong.** The android reads the same ten-level
ladder (`EnemyPlayer.as:758-760` → `xml.getMastery(1000/1001/1002)`) and gates its techniques at
`>= 3 / >= 4 / >= 5` in `MCSPlayer.as:3166-3184` — byte-for-byte the web's thresholds at
`§1t99s0§.as:3223-3241`. The divergence is in the **coefficient** (android 0.005/level, Heavy 1.5;
web 0.04/level, Heavy 1.4), not the domain. That is a stronger reason not to port it, not a weaker one.

**CORRECTION 2 — the string leg is weaker than claimed.** `strings.json["8131"]` sits among
achievement lines ("Reach Dan 10.", "Farming Level 5.") in the **android** table. An achievement
target is a milestone, and under C2 an android string cannot settle a web cap alone. The web-side
proof is the exact numeric fit at m=10; keep that as the argument.

### 4 — Crit 1.3 sealed in the web payload. **Survives.**
citelint's `QUOTE_NOT_LOCATED` is a **false alarm** — `:3272` `if(this.§1t4414s0§ == this.§1t4415s0§)`
and `:3274` `return _loc2_ * 1.3 + this.§1t1243s0§;` are both verbatim, inside `§1t4475s0§` whose
opener at `:3258` is `minDamage + Math.random() * damageRange`. RR:190 blocker ② ("read one crit
popup") is discharged from source. Note precisely what falls in RR:152-154: the **value 1.3 is
vindicated**, not reversed; what dies is its wiki-only basis and the open action item.

### 5 — Reach is asymmetric with damage. **Formulas hold; the named overturn is DENIED.**
Verified: `:3094` Light reach = `base * 1.4` with **no** mastery term; `:3105` Balanced =
`base*(1+0.2*m*0.1)`; `:3116` Heavy = `base*(0.5+0.4*m*0.1)` with the hard clamp
`if(§1t4417s0§ < 100) §1t4417s0§ = 100;` at `:3117-3120`. The "300/200/100 cannot be a ceiling row,
the ceiling multipliers are 1.4 / 1.20 / 0.90" point is right.

But `RR:156` — the sentence the finding names — **does not fall.** I read it: "A level-1 Shugyosha
does Light x0.5 / Balanced x1.0 / Heavy x1.4 (Heavy is fixed); Heavy's *reach* also scales
x0.5→x0.9" is exactly the m=0 and m=10 evaluation of those two formulas, and it is correct. The
finding's objection — that x0.5 is "the wrong low endpoint (m=1 gives 0.54)" — **is wrong**:
`§1t99s0§.as:107`, `:109` and `:111` declare the three mastery fields `internal var … :int = 0`, so
a character who never bought the skill sits at m=0 and Heavy reach is exactly 0.5 x base.

Route the finding to `RR:190` blocker ① instead — which its own lane_impact names, and which does
fall: three per-stance reach caps collapse to one base slash length times a stance multiplier.

### 6 — "The in-combat stance gate is reload 48 of a 192 max". **REFUTED.**
The numbers are right (`:3050`, `:249`, `:3060`, and the Light→Balanced→Heavy→Light cycle at
`:3064-3079` — I re-verified all of them). The claim then asserts:

> "the in-combat stance switch **costs no Focus and no Chi**: it needs the reload meter at 48/192 = 25%"

That is **false**. `§1t99s0§.as:3160-3166`, inside `§1t3489s0§` (setStance), is
`if(§1t1525s0§.§1t9948s0§()) { this.§1t4414s0§ -= 48; … }` — it **debits 48 from the very meter it
gates on**. `§1t9948s0§` is `isBattle` beyond doubt: the android twin `setStance`
(`MCSPlayer.as:3019-3105`) carries the same three guards in the same three places and each reads
`StageManager.isBattle()`. So the debit fires precisely **in** combat. And the meter **is** Focus —
the game's own skill card says "WHEN YOUR **FOCUS BAR** IS FULL" (see NF-2 below).

Refuting costs nothing: gate 48, max 192 and the three-stance cycle are banked seven times over at
`LEDGER_EVIDENCE.md:257-284` and survive in packet siblings #2 and #7, both of which I uphold.
`RR:158` still falls — on the frames and on the other findings, not on this one's framing.

### 7 — actionState gate AND meter >= 48. **Survives. This is the version to carry forward.**
`:3043-3046` is the six-state whitelist with `§1t11169s0§` requiring a matching previous state (the
android twin `MCSPlayer.as:2965-2967` names them IDLE/POSE/RUN/WALK/SKILL_CHICHARGE/FLINCH-with-prev).
`:3048-3051` is the gate; `:3058-3080` re-guards and cycles; `§1t113s0§.as:472-473` plays
`Snd_smallClick` and calls the cycle, `:478` plays `Snd_error` on refusal. **A hard lock does not
ship an error beep on its refusal branch.** Two notes, neither a refutation: the text's ":3266-3268"
is off by one (`:3266` is `break;`, the three cases are `:3267`/`:3268`/`:3269`, the body `:3270` —
the cite field's `:3266-3270` covers it), and it omits the -48 charge, which is incompleteness.

---

## Contradictions found and settled (LENS 3)

I searched by artifact, not by wording: every `LEDGER_EVIDENCE.md` entry citing `§1t99s0§.as` or
`§1t113s0§.as` (60 hits), plus the ledger-sentence groups at `:28-70`, `:205-218`, `:255-290`,
`:534-566`, `:640-661`, `:870-886`.

1. **#2 vs `[[NF-B/web-focus-numerics-diverge-from-android-on-four-constants]]` (`:540`)** — on the
   per-stance Focus drain pairing. **Settled against #2** via `MCSPlayer.as:27-35` + `:3240-3263`
   against `§1t99s0§.as:3293-3316`: Balanced+REVERSED x1.0, Heavy+DUAL x1.5.
2. **#6 vs `[[skills-meters/in-combat-stance-switch-is-real]]` (`:262-266`), `[[stance/in-combat-switch-is-live-in-web-battleui]]` (`:279-281`), `:540`, `:644` and `:3241`** — on whether the
   in-combat switch has a cost. **Settled against #6** via `§1t99s0§.as:3160-3166` under the
   isBattle guard. #6 refuted.
3. **#3 vs #5, inside my own packet** — on whether mastery 0 is reachable, i.e. whether `RR:156`'s
   x0.5 low endpoint is right. **Settled for #3** via the `:int = 0` declarations at
   `§1t99s0§.as:107/109/111`; `[[combat-core/mastery-caps-at-ten]]` (`:36`) independently agrees.
   #5's overturn denied.
4. **#3 vs `[[combat-core/v0717-stance-table]]` (`:54`)**, whose lane impact says m=9 "CONFIRMS the
   ledger's mastery-9 reading rather than overturning it". **Settled for #3**: 9 is the ninth of ten
   rungs, so it is not a ceiling at all, and 0.90/1.20 are exact where 0.86/1.18 are only roundable.
   Six other banked findings at `:28-70` already say mastery-10; that clause should be struck.
5. **#4 vs `[[frames/critical-evade-states-the-focus-gate]]` (`:659-661`)**, which calls the full bar
   "an evade gate, **not** a crit meter". **Both are true except that clause.** I opened the frame at
   the stated crop: it is a passive-skill card, and it never denies the crit. The web code carries
   both on one predicate — `§1t99s0§.as:3383-3388` (dodge at full meter if the stance passive is
   owned) alongside `:3272-3274` (x1.3). Strike "not a crit meter".
6. **Build-parity checks that are NOT contradictions (C2).** maxreload 192 web vs 120 android;
   gate 48 web vs `max/6` = 20 android; switch cost flat -48 web vs a graded clamp android; HUD
   offset 48 web vs 24 android; crit flat x1.3 web vs 1.5-Light/1.2-other android; Heavy damage 1.4
   web vs 1.5 android; Light reach x1.4 web vs x1.5 android. Two builds, both labelled. Every
   finding in this packet labels its build correctly, so none is defective on that ground.

**Nothing else in the corpus fights these findings.** That list is the evidence the empty result is
credible.

---

## New findings (5) — see the JSON for full text and cites

- **NF-S27D-1** [A1] `CANNOT CHANGE STANCE` proven transient on film (`combat_frames/t0430s`,
  `t0435s` vs `duel_dense/429.0`), **and** the Focus bar is battle-only — the overworld slot prints
  "HEAVY STANCE" (`t0425s`). Zero corpus hits for `t0435` or `HEAVY STANCE`.
- **NF-S27D-2** [A1] The third bar's in-game name is **FOCUS BAR** — skill card
  `zFtCaTO0_1M/seg-03/frames/frame_0013.jpg`, corroborated by `strings.json["6008"]`='Focus' /
  `["6011"]`='Instantly recharges your focus bar.' on skill 1005 (`skilldata.xml:283-297`). Code
  `reload` == Focus bar == the ledger's "Focus bar". There is no separate Focus resource in the
  combat classes. This closes the naming fork that split findings #2 and #6.
- **NF-S27D-3** [A2] **`RR:159` is inverted.** The only charge on the meter is `:3162`, inside the
  battle guard — so the **out-of-combat** switch is FREE and the **in-combat** one costs 48. I
  enumerated all 27 occurrences of `§1t4414s0§` in `§1t99s0§.as` to confirm it is the sole
  stance-switch debit. Zero corpus hits for `RR:159`.
- **NF-S27D-4** [A2] The **Critical Evade passive is in the web code**: `§1t99s0§.as:3383-3388` and
  `:3707` consume an incoming hit (`Snd_jump`, `return true`) when `reload == maxreload` **and** the
  stance's skill is owned — three passives, one per core stance. Zero corpus hits for `3383`,
  `10173`, `4491s0`. Closes RR:190 blocker ⑤ with a fuller rule than "crit at full".
- **NF-S27D-5** [A2] The five opaque web stance ids decode: `§1t12220s0§`=LIGHT(0),
  `12221`=BALANCED(1), `12222`=HEAVY(2), **`12223`=DUAL(3)**, **`12224`=REVERSED(4)**, pinned two
  independent ways (deductReloadBar grouping and the setStance reach/colour switch). Zero corpus
  hits for `12223`. This is a name mapping across builds, not a value port.
