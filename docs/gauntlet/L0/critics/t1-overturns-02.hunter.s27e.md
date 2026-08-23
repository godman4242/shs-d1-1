# t1-overturns-02 — HUNTER LENS (blind critic s27e)

**Packet:** `docs/gauntlet/L0/worklist/t1-overturns-02.json` — 7 findings, all 7 judged, none skipped.
**Structured verdicts:** `docs/gauntlet/L0/critics/t1-overturns-02.hunter.s27e.json` (written FIRST, per the wall-#8/#9 insurance rule).
**Cite audit of my own work:** `scripts/gauntlet/citeLint.py` — 7/7 own_cite RESOLVE, 7/7 new_findings RESOLVE, 0 BROKEN, 0 QUOTE_UNVERIFIED.

## Headline

**Nothing in this packet is refuted, and every claimed overturn is upheld.** That is an unusual
result for a refute-by-default lens, and it happens for one reason: all seven findings rest on
decompiled AS3 that I could open and read line-for-line, and the web/Android twin pairs make the
obfuscated web identifiers checkable rather than guessable. I re-derived every formula from the
files themselves rather than from the findings' summaries.

The real yield of this review is on the **hunter** side. Three of the seven findings hedged
themselves into an under-claim, and I discharged all three. Two of the seven walked past bigger
prizes sitting in the same functions. **Seven new findings**, all cite-linted, four of which close
a ledger blocker outright.

## Verdicts — 7 judged, 0 refuted, 7 overturns upheld

| # | claim | refuted | overturn | defect found |
|---|---|---|---|---|
| 1 | base-slash-length-is-a-closed-formula | no | **upheld** | minor — mastery-10 mislabelled "9"; scale-factor caveat is an under-claim |
| 2 | crit-is-deterministic-at-full-focus | no | **upheld** | minor — "costs the entire bar" is slightly generous |
| 3 | max-dan-rank-10-is-CONTRACT | no | **upheld** | **material** — its tenthGold disclaimer is false, from inside its own cited range |
| 4 | reach-cap-in-stage-px-per-stance | no | **upheld** | minor — lane_impact typo `300/200/120` |
| 5 | reinforce-three-material-tiers | no | **upheld** | minor — parity caveat is an under-claim |
| 6 | rr-159-is-inverted | no | **upheld** | none — strongest finding in the packet |
| 7 | crit-proc-rule-is-deterministic | no | **upheld** | minor — `Math.random` cite points at the neighbouring function |

### What I actually opened

- `§1t1523s0§.as:2334-2348` — the slash-length pair, verbatim as quoted. `§1t9410s0§:220 = 8`
  (android `STAT_SPEED:186`), `§1t9426s0§:254 = 25` (android `STAT_DAN:220`), `§1t9413s0§:228 = 12`
  (android `STAT_HGOLD:194`). The android twin `StatsManager.as:1915-1919` is line-for-line identical.
- `§1t99s0§.as:3091-3155` — all five stance branches, the 100-px floors, the `-= 48` debit.
  `:183-199` maps position-for-position onto android `initPlayer` at `MCSPlayer.as:182-198`, which is
  what makes `§1t4420s0§ = baseSlashLength`, `§1t4414s0§ = reload`, `§1t4415s0§ = maxreload` a
  *derivation* rather than a guess.
- `§1t99s0§.as:3255-3325` — the damage roll, the crit branch, `deductReloadBar`, `bonusReload`.
- `§1t406s0§.as:944, :3064-3104` — the free out-of-combat stance cycle; android `OverworldHUD.as:3097-3110`
  is the same code with names, which is how I confirmed `§1t406s0§` is OverworldHUD and not a battle class.
- `§1t113s0§.as:110-111, :326-359, :468-480` — the reload bar, its two-state caption, and the stance button.
- `§1t401s0§.as:1086-1152` and android `InteractUI.as:1082-1138` — reinforce, both builds.
- `InputManager.as:106-108, :198, :231, :342-367` — the coordinate space the slash budget is spent in.
- **Frames, cropped and upscaled:** `duel_dense/Nr4fQstqHDM_428.0.png`,
  `combat_frames/Nr4fQstqHDM_t0170s.png / _t0445s.png / _t0505s.png / _t0530s.png`,
  `zFt_combat/zFtCaTO0_1M_t0320s.png / _t0335s.png` — crop `x100-760 y900-1060` of the 1920×1080
  frame, upscaled 1.5–2× LANCZOS. The fighter is ~270 px tall so the HUD text is unreadable at 1:1.

## THE FRAME WINS — and it wins against the ledger, not against the findings

RR:158 opens claim 4 with **"In-combat stance is HARD-LOCKED in v0.717 (\"CANNOT CHANGE STANCE\")"**,
and RR:174-180 records that caption as a first-hand LOOK verdict off
`reference/frames/duel_dense/Nr4fQstqHDM_428.0 → 431.5`. I opened that exact frame.

The caption is real. **The reading of it is wrong.** It is the Focus bar's zero-state label:

    §1t113s0§.as:328   var _loc3_:Number = (param1 - 48) / (param2 - 48);
    §1t113s0§.as:336   if(_loc3_ == 0)        -> grey  getString(960)   "CANNOT CHANGE STANCE"
    §1t113s0§.as:344   0 < _loc3_ < 1         -> hidden
    §1t113s0§.as:348   _loc3_ >= 1            -> black getString(175) "Critical Hit" + Snd_criticalDamage

One textfield, three states, and the `-48` offset is the *same* 48 the stance switch costs
(`§1t99s0§.as:3060` gate, `:3162` debit). The bar reads empty and the caption shows **precisely while
the switch is unaffordable** — which is a resource state, not a lock.

The frames say the same thing out loud, in both longplays:

- **Battle** (`Nr4fQstqHDM_t0445s`, `_t0505s`, `zFtCaTO0_1M_t0335s`) — HP and Chi bars above a
  **visibly empty third bar** captioned `CANNOT CHANGE STANCE`. No overworld `+` button on screen.
- **Overworld** (`Nr4fQstqHDM_t0170s`, `_t0530s`, `zFtCaTO0_1M_t0320s`) — that same slot reads
  `HEAVY STANCE` / `BALANCED STANCE`, with the `+` button and the `...` speech bubble visible. That
  is the OverworldHUD bust text, `getString(645)` / `getString(644)`.

Both longplays are early low-level fights, so the meter had never reached 48. **Where the ledger's
reading of a frame and the frame itself disagree, the frame wins — and here the frame, read with the
code that draws it, kills the whole of RR:158-160 item 4, not just the sentence finding 6 targeted.**

Corroboration that this is a v0.717-only HUD: `getString(960)` has **no entry** in the v0.682 string
table (ids 959/960/961 all absent from the 2,533-row `strings.json`), and android `BattleUI.as:259-263`
has no caption and no `-48` offset at all. The Android artifacts *could not* have explained that text.
This is the S0-3 parity caveat working correctly for once — as a signal, not just a warning.

## The three under-claims I discharged

**(a) "the unit-to-stage-px scale factor still wants one frame measurement"** — finding 1's closing
caveat, and the exact half finding 4 claimed and finding 1 refused. Closed from the input path, not
the inventory text: `MCSPlayer.as:3094` hands `slashLength` to `InputManager.setMaxDistance`,
`:198` loads it as `distanceLeft`, and `:355`/`:367` spend it in Euclidean units of the **descaled**
stage space (`:342-343` divide by `StatsManager.stageScale`), a space bounded at `:231` by the
literal `if(mouseY > 480)`. The number is a length in native 800×480 stage pixels **by construction**.
A 1080p capture is that space × 2.25. No measurement should be commissioned.

**(b) "I could not confirm the 5000 on the web side"** — finding 5's parity caveat. The web payload
carries the identical routine at `§1t401s0§.as:1086-1152`: same 5000, same `13022 -> 59` special case,
same `<30 / <60 / else` material tiers, same `weapon.uses = 0`. Reinforce is a WEB row.

**(c) "nothing here touches tenthGold=100"** — finding 3's disclaimer, and the one that matters.
It is false, and false from *inside the range it cited*. Seven lines above the dan cap it quoted:

    §1t1523s0§.as:2644   if(§1t7356s0§(§1t9426s0§) == 8)
    §1t1523s0§.as:2646      §1t9713s0§(§1t9413s0§,100);
    §1t1523s0§.as:2651   else §1t9713s0§(§1t9413s0§,25);

`§1t9413s0§:228 = 12 = STAT_HGOLD`. `dan == 8` is the rebirth that raises dan to 9 — the **tenth**
rank — and the announcement at `:2647` is pre-filled with the literal `"10"`. So RR:164-165 item 7
falls **whole**: both constants are CONTRACT and the "no 10th-rebirth tier" clause is struck. The
ledger's film observation isn't contradicted, it's incomplete — neither longplay reaches dan 8, so a
flat +25 is all that *could* have been filmed.

## The two prizes both findings walked past

**SPD → cooldown.** RR:195 blocker ④ is bare (`SPD→cooldown formula`), RR:90-91 lists it as a
KNOWN-UNKNOWN, RR:200 blocker ① asks to measure per-point deltas in a build. It sits **two functions
below** the slash-length getter that findings 1 and 4 both quoted:
`§1t1523s0§.as:2291-2295` — `if(param1 > 600) { param1 = 600; } return 1 - param1 / 600 * 0.5;`.
Android `StatsManager.as:1854-1860` names it `getSkillCooldownModifierVal` and **caps at 300, not 600** —
the web ramp is half as steep. Blocker ④ closes as CONTRACT.

**The whole Focus meter.** RR:195 blocker ③ (`Focus numerics (max/fill/switch-cost)`) and RR:190
blocker ⑤ (`Focus/crit gating rule — watch the Focus bar fill/consume`) are both fully in source:
max `8 * 24 = 192` (`§1t99s0§.as:249`), start 0 (`:250`), fill `+1`/tick (`:1203-1205`), slash debit
`slashUsage × {0.5 L, 1.0 B/Rev, 1.5 H/Dual}` (`:3299-3311`), `slashUsage = max(weapon.slashusage, 48)`
(`§1t1523s0§.as:2350-2358`), switch cost and gate 48 (`:3060`, `:3162`), bonus `+6` (`:3318-3324`),
crit gate `reload == maxreload` zeroed by the same hit, HUD `(reload-48)/(max-48)`. **Nobody needs to
watch a bar.** Android diverges on every one of those numbers (max 120, gate `max/6`, a two-branch
switch cost, `-24` HUD offset) — take the web set.

**And crit ×1.3.** RR:190 blocker ② says *"crit 1.3 vs 3 final — read one crit popup."* No popup
needed: `§1t99s0§.as:3274` is `return _loc2_ * 1.3 + this.§1t1243s0§;`, and the inventory panel
hard-codes the same `1.3` for all three stances at `§1t5957s0§.as:2727/:2736/:2745`. Android is **not**
1.3 (`MCSPlayer.as:3219-3221`: 1.5 Light / 1.2 otherwise) — the wiki's flat 1.3 matches the *web*
build specifically, which is a build-parity fact worth recording rather than a coincidence.

## Build divergences surfaced (all v0.717 must-take)

| quantity | web v0.717 | android v0.682 |
|---|---|---|
| Light reach mult | ×1.4 | ×1.5 |
| Balanced reach mult | `1 + 0.02·m` | `1 + 0.005·m` |
| Heavy reach mult | `0.5 + 0.04·m` | `0.5 + 0.005·m` |
| Focus max | `8 × 24 = 192` | `5 × 24 = 120` |
| stance gate / cost | `≥ 48` / flat `-48` | `≥ max/6` / two-branch |
| Focus HUD offset | `(r-48)/(max-48)` | `(r-24)/(max-24)` |
| crit mult | `×1.3` all stances | `×1.5` Light, `×1.2` other |
| cooldown cap | SPD 600 | SPD 300 |
| rebirth gold | 25, 100 on the 10th | 5, 20 on the 10th |

## Why nothing was refuted

I went in expecting to kill two or three. The reason none died: **every claim in this packet is an
AS3 quote, and AS3 quotes are falsifiable in one `awk`.** The obfuscated web identifiers are the only
soft spot, and the 15-parameter `initPlayer` twin closes that — a positional map of fifteen arguments
is not a coincidence you can talk yourself into. Where a finding overreached it overreached in
*caution*, not in confidence, which is the failure mode this lens is built to catch and the one that
costs the ledger real closed blockers.

The one thing I want on record as a live risk: findings 1/4 and 2/7 are **near-duplicate pairs**
aimed at the same two ledger sentences. Both pairs are individually sound, but whoever applies these
must merge them, or RR:190 ① and RR:195 ⑤ will each be struck twice and the web/android divergence
notes — which live in only one member of each pair — could be dropped with the "duplicate".
