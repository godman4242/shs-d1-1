# t1-overturns-02 — LENS 3 (CONTRADICTION) — blind critic s27d

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` · 7 findings · **7 judged, 0 skipped**
Result: **6 upheld (all minor), 1 REFUTED (fatal)** · 5 new findings banked.

I opened no critic prose and no source survey (§3.2). Every verdict below rests on a file
I opened myself.

---

## THE HEADLINE: one finding in this packet fights five upheld ones, and it loses

`hunter-s27b/the-focus-meter-contract-is-fully-recovered-in-web-v0717` is **REFUTED, fatal.**
It claims to close two blockers with a five-part contract. Three of the five parts are wrong,
and its `lane_impact` would ship them straight into config.

| it says | the artifact says | where I read it |
|---|---|---|
| `maxFocus = 48 + SPD*6` | `maxreload = 8*24 = 192`, flat, no SPD term | `§1t99s0§.as:249`; every `§1t4415s0§ =` in the bundle |
| `regen +6/tick` | regen is `++` = **+1**/tick; the +6 is a **kill bonus** | `§1t99s0§.as:1203-1205` vs `:3320` |
| stance switch "costs nothing" | flat **−48** inside the battle guard | `§1t99s0§.as:3162` |
| spend = slashUsage ×{0.5, 1, 1.5} | ✅ holds | `§1t99s0§.as:3299-3310` |
| full meter consumed by its crit | ✅ holds | `§1t99s0§.as:3295-3297` |

**The capacity error is a field mix-up, not a build divergence.** `48 + (SPD+gearSPD)*6` is
`baseReload`, and `baseReload` is *dead*. Android `MCSPlayer.as` contains exactly three
occurrences of the identifier — the declaration `internal var baseReload:int = 48;` (:105),
the `initPlayer` parameter (:182), and the assignment `this.baseReload = baseReload;` (:190).
Nothing reads it. `maxreload` is a different field, assigned flat at `MCSPlayer.as:239`
(`5*24`) and `§1t99s0§.as:249` (`8*24`). The web path is identical in shape: `§1t1523s0§.as:2268`
passes `§1t9588s0§()` as the 7th argument of the 15-arg `initPlayer` twin at `§1t99s0§.as:183`.

**C2 was checked and does not rescue it.** The field is dead in *both* builds and the +6 is a
kill bonus in *both* builds, so this is not v0.682-vs-v0.717 — it is one variable read as
another. That matters: the build-parity excuse is the most common way a wrong number survives
this lane, and it is unavailable here.

**The +6 is a kill bonus, proved on the WEB side.** `§1t4479s0§` (the `+= 6` function) has
exactly one caller in the whole web bundle — `§1t1543s0§.as:2049` — and its context is the
verbatim twin of `NPCManager.as:1708-1711`:

```
web    :2047 if(_loc4_ > 0)              android  :1708 if(deathCount > 0)
       :2049   ...§1t4479s0§();                   :1711   StatsManager.getPlayer().bonusReload();
       :2051 §1t10200s0§... += _loc4_;            :1713 totalKilled += deathCount;
```

So `_loc4_` = deathCount, `§1t4479s0§` = bonusReload, `§1t1543s0§` = NPCManager. Shipping that
as the tick regen would run the crit meter **six times fast**.

Contradicted by: `[[skills-meters/maxreload-is-192]]`, `[[combat-core/web-maxreload-192-and-48-offset]]`,
`[[combat-core/crit-meter-is-6-seconds]]`, `[[skills-meters/focus-fill-rate-plus-one-per-frame]]`,
`[[hunter/focus-plus6-is-a-kill-bonus]]`, `[[NF-A/...recharge-is-plus-one]]`,
`[[NF-B/web-focus-numerics-diverge...]]`, and `[[progression/spd-scaling]]` — which names
`48 + spd*6` correctly as *"slash reload"*, not maxFocus. Nothing is lost by killing this
finding: its two surviving parts are already independently upheld.

`overturn_upheld = false`. RR:195 ③ and RR:190 ⑤ *do* fall — on those findings' numbers, not
on these.

---

## The six that held

**1 · `cannot-change-stance-is-the-focus-bars-low-end-label`** — HELD on my own eyes.
I cropped both frames myself, `(40,920)-(760,1080)` at 2× LANCZOS.
`duel_dense/Nr4fQstqHDM_428.0.png`: green 20/20, blue 26/26, third bar an **empty** dark-gold
track with pale-grey `CANNOT CHANGE STANCE`, yellow `150% DAMAGE` beneath.
`duel_frames/Nr4fQstqHDM_t435.0s.png`, same player, same run, 7 s later: 19/20, 26/26, third
bar a **white fill with no text at all**. Pixel-scanned at row 1035: white spans x=245–357
inside a track of x=245–513 (taken from the full 26/26 Chi bar at row 1008) = **42 %**. The
finding's "roughly 40 %" is accurate.
Code side: `§1t113s0§.as:328` is verbatim `(param1 - 48) / (param2 - 48)`; `:111` builds the
grey label as `#BBBBBB` + `getString(960)`; `strings.json` has `["175"] = 'Critical Hit'` and
**no key 960** in the 2,533-entry v0.682 table — a web-only string, which is why it was never
sourced. `§1t99s0§.as:3050` is verbatim `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;`.
**THE FRAME WINS over the measurement inference**: RR:158's "HARD-LOCKED" describes a transient
zero-Focus readout. Minor only because it re-derives already-upheld ground; the new artifact is
the t435.0s frame. One nit: it says the label shows "while reload ≤ 48" but the gate opens at
`>= 48`, so at raw 48 the caption is on screen while the switch is already legal.

**2 · `crit-1.3-and-heavy-defence-0.8`** — HELD, every line exact. `§1t99s0§.as:3274` verbatim
`return _loc2_ * 1.3 + this.§1t1243s0§;`. My grep over `§1t5957s0§.as` puts `_loc42_ = 1.3` at
**exactly** 2727 / 2736 / 2745 and `_loc47_ = 0.8` at **exactly** 2746 and *only* there (the
light and balanced branches set it to 1 at :2728 and :2737), with application at **exactly**
2751-2752. I found a second web site for the 0.8 the finding missed: `§1t99s0§.as:3288`
`return defense * 0.8;`. **Two defects the rewrite must not inherit:** it cites "RR:159 blocker ⑤"
— :159 is prose, the crit-proc blocker is at **:195** — and its "the crit PROC rule is still
open" caveat is *superseded*: an equality test IS deterministic, and
`[[combat-core/full-reload-crit-is-1p3-in-v0717]]` already closed it.

**3 · `dan-rank-is-mechanical-not-cosmetic`** — TRUE, but **its ledger anchor is mis-cited.**
Evidence is exact: `§1t1523s0§.as:2346` verbatim `90 + §1t7356s0§(§1t9426s0§) * 5`, `:254`
verbatim `§1t9426s0§:int = 25`, android `StatsManager.as:220` `STAT_DAN:int = 25` and `:1917`
inside a function whose **plain name is `getBaseSlashLengthVal`** — which proves the reach
identification rather than inferring it. I found the cap myself: `:2653 if(...§1t9426s0§) < 9)`
→ `:2655` increment → `:2659` announces rank `(DAN + 1)`, so DAN 0–9 maps 1-based onto exactly
ten titles. `strings.json["455"]`–`["464"]` are 初段…十段 — **ten**; 465-467 are Renshi/Kyoshi/
Hanshi, separate shogo titles. The finding's warning to cite 455-464 (not 456-464) is correct.
**But** it cites `REBUILD_READINESS.md:245` three times. I opened :245 — it is the war-room/meta
blocker list. The quoted sentence *"③ Dan-rank count/titles (garbled source)."* is at **:205**.
citeLint passed it only because 245 ≤ 378 lines. Overturn upheld **against line 205**.

**4 · `forge-cost-is-a-node-level-formula`** — HELD, every line number resolves to the claimed
content: node read at 1954, clamp `>80 → 80` at 1955-58, `* 100` at 1959, tiers at 1968/1980/1993;
android `InteractUI.as:1003`/`:1008` exact. Materials match the strings three ways:
2×20061 = "2 Iron Ore" (845), 1×20062+2×20063 = "1 Tin Ore, 2 Copper Ore" (846), 2×20061+2×20060+1×20065
= "2 Iron Ore, 2 Coal, 1 Titanium Ore" (847).
**Contradiction trap opened and cleared:** the reinforce findings say that service keys on
**weapon** level. I read `§1t401s0§.as:664-689` myself — reinforce takes `_loc3_.getLevel()` off
the equipped weapon at a flat 5000; forge takes `getCurrentNodeLevel()`. Two services, two keys,
both true. `[[economy/minus-70-is-repair-not-artifact]]` (A1) independently confirms the
inference from film: "FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS" — 700 = 7 × 100.

**5 · `repair-weapon-cost-is-node-level-times-ten`** — HELD. The odd-looking coincidence in the
cite is real: web `§1t401s0§.as:1058` and android `InteractUI.as:1058` are the same line number
in both builds. Menu copy exact at web :662 / android :647 against `strings.json["848"]`.
Five upheld findings already give this number, including an A1 film read of "COST: 70 COINS" at
a node the forge dialog labels "(LEVEL 7)" — zero contradiction, and minor precisely because the
blocker was already closed. What it adds: android :1075 shows repair is a durability **reset**
(`uses → 1`), not a restore-to-new.

**6 · `spd-to-cooldown-is-a-web-formula`** — HELD, and the divergence is real: web `600`
(`§1t1523s0§.as:2291`/`:2295`) against android `300` (`StatsManager.as:1856`/`:1860`, grep-exact).
I confirmed the build stamp first-hand at `StatsManager.as:30`
`public static var clientVersion:Number = 0.682;`. **This is the C2 trap handled correctly** —
the finding labels both builds instead of presenting 600 vs 300 as a conflict.
`[[progression/spd-scaling]]` (9 critics) states the identical thing off the identical lines.

---

## Contradiction sweep — what I compared against

Searched `LEDGER_EVIDENCE.md` (3,574 lines) **by cited artifact**, not by wording:
`§1t113s0§`, `§1t99s0§:3050/3272/3295/3320`, `§1t1523s0§:2276/2291/2346`, `§1t401s0§:1058/1954`,
`StatsManager.as:1841/1856/1917`, `MCSPlayer.as`, `InteractUI.as`, plus the terms
*reload · slashUsage · focus · maxreload · forge · repair · reinforce · node level · dan · 90 + · crit · 1.3 · 0.8*.

Neighbours found and settled: **1** vs the six ui-hud/stance findings at L188-285 (all agree);
**2** vs `[[combat-core/full-reload-crit-is-1p3-in-v0717]]` + L877/L1918/L1999 (agree on 1.3,
*disagree* on whether the proc rule is open — settled: closed, deterministic);
**3** vs `[[progression/spd-scaling]]`, `[[combat-core/reach-table-is-mastery-zero-not-a-ceiling]]`,
`[[rebirth/dan-achievements-prove-ten]]`, `[[skills-meters/dan-caps-at-9...]]` (all agree, ten rungs);
**4** vs the two reinforce findings + `[[economy/minus-70-is-repair-not-artifact]]` (false
contradiction, different keys); **5** vs four repair findings (agree);
**6** vs `[[progression/spd-scaling]]` and `[[progression/def-mitigation-is-flat]]` (agree);
**7** vs eight Focus/meter findings — **live contradiction, finding 7 loses.**

## New findings banked (5)

1. `rr245-is-the-wrong-anchor-for-the-dan-rank-blocker` — the sentence is at RR:**205**; :245 is
   the war-room list. citeLint structurally cannot catch this — it checks the number, not the text.
2. `maxreload-192-has-two-web-assignments-not-one` — `[[skills-meters/maxreload-is-192]]`'s
   *"ONLY assignment"* is false: `§1t99s0§.as:249` **and** `§1t4904s0§.as:77`, both `8*24`. The
   second identifies `§1t4904s0§` = **EnemyClone** (twin of `EnemyClone.as:75-78`), so the Shadow
   Clone carries its own 192-tick Focus meter starting at 0 — inside the dead zone.
3. `48-plus-spd6-is-baseReload-and-it-is-dead-in-both-builds` — stated positively so the next
   packet cannot re-derive it wrong.
4. `the-plus6-is-a-kill-bonus-in-the-web-bundle-too` — discharges the android caveat on
   `[[hunter/focus-plus6-is-a-kill-bonus]]`; banks `§1t1543s0§` = NPCManager.
5. `the-crit-proc-rule-is-closed-not-open` — do not let finding 2's caveat re-open RR:195 ⑤.
