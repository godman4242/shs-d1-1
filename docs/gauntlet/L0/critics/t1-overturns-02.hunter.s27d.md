# t1-overturns-02 — HUNTER LENS (blind critic s27d)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` · 7 claims · **7 judged, 0 skipped.**
Structured verdicts written FIRST to `docs/gauntlet/L0/critics/t1-overturns-02.hunter.s27d.json`.

**Headline: 0 of 7 refuted, 7 of 7 overturns upheld.** That is an unusual result for a
refute-by-default lens and I want to say plainly why it happened rather than let it read as a
rubber stamp: **all seven claims rest on decompiled AS3 from the target build**, and AS3 source is
the one artifact class in this corpus that does not degrade under scrutiny. There is nothing to
misread. Either `return _loc2_ * 1.3` is on line 3274 or it is not. I opened every cited line and
every one was verbatim. The refutable surface was in the *inferences* and the *impact claims*, and
that is where I found the defects — three of them, catalogued below, one material.

I also found **six unclaimed items**, including the single blocker the ledger itself calls
load-bearing for the whole combat model.

---

## 1. What I opened

Not one verdict here rests on another agent's summary. Per §3.2 I opened no
`critics/*.md` and no `sources/*.md`.

| Artifact | What I did with it |
|---|---|
| `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` | cropped x40-760 y920-1080, upscaled 2x LANCZOS, looked |
| `reference/frames/duel_frames/Nr4fQstqHDM_t435.0s.png` | same crop, same upscale, looked |
| `reference/decompiled/shs3_payload/scripts/§1t113s0§.as` | :110-111, :326-361 |
| `reference/decompiled/shs3_payload/scripts/§1t99s0§.as` | :183-199, :216-223, :3043-3070, :3091-3146, :3265-3326 |
| `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as` | :254, :2274-2296, :2326-2348, :2644-2659 |
| `reference/decompiled/shs3_payload/scripts/§1t401s0§.as` | :655-670, :1050-1075, :1948-2015 |
| `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as` | :2710-2760, :3013 |
| `reference/decompiled/shs3_android/scripts/StatsManager.as` | :216-224, :1835-1861, :1910-1930, :2201-2214 |
| `reference/decompiled/shs3_android/scripts/MCSPlayer.as` | :182-198, :215-227, :2955-3000, :3030-3081, :3240-3273 |
| `reference/decompiled/shs3_android/scripts/InteractUI.as` | :643-652, :1000-1150 |
| `reference/decompiled/shs3_android/scripts/BattleUI.as` | :102, :245-275 |
| `reference/decompiled/shs3_android/scripts/NPCManager.as` | :1695-1718 |
| `reference/decompiled/shs3_android/scripts/InventoryUI.as` | :2232 |
| `docs/gauntlet/L0/index/strings.json` | keys 175, 455-465, 845-853, 960, 4132 read directly |
| `docs/gauntlet/L0/index/resolved_names.json` | itemdata 20060-20066 |
| `docs/research/REBUILD_READINESS.md` | :70-100, :150-216, :240-247 in context |

My own six new findings were run through `scripts/gauntlet/citeLint.py`:
**6 RESOLVES · 0 BROKEN · 0 QUOTE_UNVERIFIED.**

---

## 2. The one that decides the packet — and THE FRAME WINS

`cannot-change-stance-is-the-focus-bars-low-end-label` is the claim I most wanted to kill, because
it overturns a ledger line that was written from **Kheshav's own first-hand LOOK** (RR:174-180,
"own eyes, not agent-reported"). Overturning a LOOK verdict deserves the hardest possible test.

It survives it, and it survives on the ledger's own terms.

**I cropped both frames myself.** x40-760, y920-1080 of a 1920x1080 frame, 2x LANCZOS.

* `Nr4fQstqHDM_428.0.png` — HP **20/20** green, **26/26** blue, and a third bar that is an
  **empty dark-brown track** carrying grey **"CANNOT CHANGE STANCE"**, with gold **"150% DAMAGE"**
  under it.
* `Nr4fQstqHDM_t435.0s.png` — same portrait, same red stance ring, same 20 and 26 maxima, same
  150% DAMAGE buff, HP now **19/20**. The third bar is **~40% filled WHITE and carries no text at
  all.**

Same fighter, same run, seven seconds apart. The label is not a property of v0.717. It is a
property of *that moment*.

The code says exactly why, and the code was opened, not assumed. `§1t113s0§.as:328` computes
`(param1 - 48) / (param2 - 48)`, clamps negatives to 0, and then branches: `:336-342` show the grey
`getString(960)` label **only** at fill == 0; `:344-347` **hide** it while `0 < fill < 1`;
`:348-359` swap to black `getString(175)` + `Snd_criticalDamage` at fill >= 1. I read
`strings.json["175"]` — `'Critical Hit'`. I checked for `"960"` — **genuinely absent** from the
2,533-entry v0.682 table, and android `BattleUI.updateReload` (:259-263) has no low-end label at
all. So the grey label is a web-v0.717 addition, and **the frame is what supplies its text.**
That is a nice inversion of the usual direction: the string table could not resolve it, and the
video did.

Both HUD branches were observed in the wild. That is as close to a controlled experiment as a dead
game allows.

**STANDING INVARIANT, SAID OUT LOUD:** the measurement doc and the frame disagree here, and
**THE FRAME WINS.** RR:178 recorded the label at one instant; RR:158 turned that instant into
"HARD-LOCKED in v0.717". The frame at t435.0s shows the label gone and the meter filling.

**The overturn is bigger than the finding claims.** RR:158 falls, and so does RR:159-160 —
*"The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"*. It does not.
`§1t99s0§.as:3048-3051` is `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` and the stance
cycler `§1t4472s0§` at `:3058-3063` returns early **only** if `reload < 48`. Its android twin is
`MCSPlayer.nextStance()` at :2975-2980, gated on `reload < maxreload / 6`. A Focus-gated in-combat
switch, on the battle actor class, in both builds. **The recreation was right and the ledger's
correction to it was wrong.**

One precondition the finding leaves unstated (minor): the label branch is additionally gated at
`:334` on `!§1t1540s0§.§1t9550s0§() && this.§1t5182s0§.visible`, a mode check I did not resolve.
The HUD contract should carry it.

---

## 3. Defects found — three, and why none of them is fatal

I am listing these prominently because a packet with zero refutations is worthless unless it says
what it *did* catch.

### 3a. MATERIAL — `regen +6/tick` would ship the wrong game

`the-focus-meter-contract-is-fully-recovered-in-web-v0717` ships **"regen +6/tick"** in its
`lane_impact`. Its `text` says "+6 per call", which is honest — but **the call site was never
opened.** I opened it.

`bonusReload()` has exactly **one** caller in the entire android bundle:

```
NPCManager.as:1709-1711   if(deathCount > 0) { StatsManager.getPlayer().bonusReload(); }
```

It sits inside the sweep at :1695-1706 that walks the enemy list, calls `checkDie()` on each, and
counts deaths. **Focus regen fires on a KILL, not on a tick.**

This is not pedantry. A per-tick trickle fills the meter while the player stands still; a kill-fed
meter does not. It changes what the resource *is*. It also explains the frames better than the
claim does: the bar sits at zero mid-fight at t428 and is 40% full at t435 *after kills* — a
per-tick regen would never sit empty through an active fight in the first place.

The Focus contract survives with that one field corrected. Filed as new finding **N2**.

### 3b. MINOR — a ledger pointer 40 lines off target

`dan-rank-is-mechanical-not-cosmetic` cites `REBUILD_READINESS.md:245` and its text says
"RR:245 blocker (3)". **RR:245 is the meta-social blocker list**, whose ③ is *"achievements list,
daily-reward table, token costs"*. The dan-rank blocker is **RR:205 ③**.

citeLint cannot catch this — 245 is a valid line in a real file, so it RESOLVES. But a rewrite
applied mechanically from the cite field would gut the wrong blocker in the wrong system. The
`ledger_text` field quotes the right sentence verbatim, so the target is recoverable, which is the
only reason this is minor rather than fatal. **Rewrite target: RR:205 ③, not RR:245 ③.**

### 3c. MINOR — two loose ends in the crit and forge claims

* The crit finding points its own caveat at "RR:159 blocker ⑤". RR:159 is the stance-lock
  paragraph; skills-meters blocker ⑤ is at **RR:195**. And the caveat is over-cautious anyway —
  see N3.
* The forge finding says it *"pairs with the reinforce finding already in this packet."* There is
  no reinforce finding in this packet. I went and read reinforce myself rather than let the
  cross-reference dangle — it turns out to be a *differently shaped* correction, so the assumption
  the phrase invites would have been wrong. See N4.
* The forge finding also lists the five ore names in display order while its cite lists ids in
  numeric order, so a careless reader pairs 20060 with Iron Ore. It is **20060 Coal**, 20061 Iron
  Ore, 20062 Tin Ore, 20063 Copper Ore, 20065 Titanium Ore. Verified against
  `strings.json["845"]/["846"]/["847"]`.

---

## 4. The overturn check, claim by claim

This is the section the tier exists for. **A finding can be true and still not overturn what it
points at.** One of the seven is in that grey zone and I am not going to paper over it.

| # | Claim | Overturn | Ledger line that actually falls |
|---|---|---|---|
| 1 | stance lock | **UPHELD, wider than claimed** | RR:158 **and** RR:159-160 |
| 2 | crit 1.3 / heavy def 0.8 | **UPHELD, but not the sentence it quotes** | RR:88, RR:190 ② |
| 3 | dan rank buys reach | **UPHELD** (target = RR:205 ③, not :245) | RR:205 ③ |
| 4 | forge is a formula | **UPHELD** | RR:80, and RR:214 / RR:216 inherit it |
| 5 | repair = nodeLevel x 10 | **UPHELD** | RR:215 ③ |
| 6 | SPD -> cooldown | **UPHELD** | RR:195 ④, RR:91, cooldown half of RR:200 ① |
| 7 | Focus contract | **UPHELD** | RR:195 ③, RR:190 ⑤, RR:89 |

### The grey zone: claim 2

`crit-1.3-and-heavy-defence-0.8` quotes RR:152-154 as the sentence it overturns. **That sentence
is not made false.** *"Keep `CRIT_MULT=1.3`"* is **confirmed** by
`§1t99s0§.as:3274 'return _loc2_ * 1.3 + this.§1t1243s0§;'` and by `_loc42_ = 1.3` in all three
stance branches of `§1t5957s0§.as` (:2727, :2736, :2745). Confirming a value is not overturning it.

I still ruled `overturn_upheld = true`, and the reason is specific: the ledger carries the crit
multiplier as an **open item in two other places**, and the finding names one of them.

* **RR:88**, KNOWN-UNKNOWNS: *"crit ×1.3 vs ×3 final read"* — now known. Falls.
* **RR:190 blocker ②**: *"crit 1.3 vs 3 final — read one crit popup."* — closes with no popup.
* **RR:154**: *"(Read a real OG crit popup to fully seal it.)"* — discharged.

**The rewrite must not say the 1.3 value was overturned.** It was *promoted* from wiki authority to
web-source CONTRACT. Same for Heavy-def 0.8, which RR:74 already carries as a KNOWN-KNOWN — an
evidence upgrade, not an overturn, and the finding says so itself.

That distinction matters at scale. 203 claimed overturns are about to rewrite this document, and if
"my evidence is better than the ledger's evidence" gets recorded as "the ledger was wrong", the
document loses the ability to say which of its own numbers were ever in doubt.

---

## 5. Six unclaimed findings

### N1 — the biggest combat blocker in the ledger closes, and two findings walked past it

RR:190 blocker ① calls the per-stance reach cap **"the one value the whole model needs"** and says
the wiki gives *"units of unknown scale"*. It is fully specified in web v0.717, in stage pixels.

Claim 3 read `§1t1523s0§.as:2346` for the dan term. Claim 6 read `:2295` for the cooldown. **The
reach formula is the function between them, at `:2344-2348`, and neither claimed it.**

```
§1t1523s0§.as:2334-2341   SPD_eff = STAT_SPEED + gear SPD, x1.5 while speed buff set
§1t1523s0§.as:2347        return int(120 + Math.floor(maxincrement * SPD_eff / (20 + SPD_eff)))
                          maxincrement = 90 + dan*5      -> 120 px floor, 210 px asymptote (dan 0)
§1t99s0§.as:3094          Light     = base * 1.4
§1t99s0§.as:3105          Balanced  = base * (1 + 0.02 * balancedMastery)
§1t99s0§.as:3116-3119     Heavy     = base * (0.5 + 0.04 * heavyMastery), hard floor 100 px
§1t99s0§.as:3142-3145     12223     = base * 1.0,  floor 100 px
§1t99s0§.as:221-223       BUFF_INJURED halves the base outright
```

**The units question is answered by the game's own UI.** The stats panel prints
`int(baseSlashLength * slashModifier)` as **"slash distance"** — android `InventoryUI.as:2232` in
plain names, web `§1t5957s0§.as:3013` with the identical structure. The number *is* the drawn
blade-path length in stage px.

Two independent cross-checks that this is the right function:

* multipliers **1.4 : 1.0 : 0.5** over a ~214 px base give **300 : 214 : 107** — the wiki's
  "300/200/100" to rounding;
* RR:156's independently-derived *"Heavy's reach also scales ×0.5→×0.9"* is exactly
  `0.5 + 0.04m` at m = 10.

The ledger's own numbers were right and it never knew where they came from. **RR:190 ① closes as
CONTRACT**, RR:88's "reach cap in px per stance" leaves KNOWN-UNKNOWNS, and the **"SPD range"** half
of RR:200 ① — which claim 6 explicitly left standing — closes too.

### N2 — Focus regen is on kill (see §3a)

### N3 — the crit proc rule is DETERMINISTIC, and claim 2 gave up too early

RR:195 blocker ⑤ says the proc rule is *"entirely absent"*. Claim 2 declines to settle it: *":3272
tests an equality between two obfuscated members, not a probability."*

**The members are not unknown, and the packet already contained what identifies them.** The
fifteen-parameter init at `§1t99s0§.as:183-199` maps one-for-one onto `MCSPlayer.as:182-198`, and
`§1t4478s0§`/`§1t4479s0§` are line-for-line `deductReloadBar()`/`bonusReload()` — android
`:3242-3244 'if(this.reload == this.maxreload) { this.reload = 0; }'` is the same statement as web
`:3295-3297`. So `§1t4414s0§ = reload`, `§1t4415s0§ = maxreload`, and `:3272` reads **"if the Focus
meter is FULL"**.

Crit is deterministic: a full meter guarantees ×1.3 on the next hit and is zeroed by the spend that
follows — exactly one crit per fill. `Math.random()` appears at `:3281` for the damage *range* roll
and **nowhere** in the crit path. The HUD confirms it is meant to be legible to the player:
`§1t113s0§.as:348-359` shows black "Critical Hit" + `Snd_criticalDamage` the moment fill >= 1. The
game *tells you* the crit is armed, which only makes sense for a deterministic rule.

This is the one place where claim 2's caution costs something: **RR:195 ⑤ was closeable and it said
it wasn't.**

### N4 — reinforce carries three material tiers, but its price really is a static

`InteractUI.as:1082-1138`. **The coin cost genuinely IS static** — `:1083 'cost = 5000;'`, no
formula, and all three display strings hard-code "Cost: 5000 coins". The material is not, and it
branches on the **weapon's** level, not the node's: `<30` -> 1x Silver Ore (20064), `<60` -> 1x
Titanium Ore (20065), else 1x Uncut Diamond (20066), with itemID 13022 forced to level 59 at
`:1098-1101`. Effect at `:1133 'weapon.uses = 0;'` — unbreakable, as the copy promises.

So RR:80's *"Reinforce 5000c+1 silver ore"* carries the lowest of three tiers — same defect as
forge — **but the price half survives here where it died for forge.** Do not unify the two rules:
Forge and Repair key on **node** level, Reinforce keys on **weapon** level. Parity caveat stated:
I could not confirm the 5000 web-side, so this row is v0.682 under S0-3.

### N5 — MAX_DAN_RANK=10 is CONTRACT, and RR:164 should be split not flipped

RR:164-165 demotes `MAX_DAN_RANK=10` to INFERRED because *"The only wiki datum is garbled"*. No
wiki needed: `§1t1523s0§.as:2653 'if(§1t7356s0§(§1t9426s0§) < 9)'` — **the WEB build's own rebirth
routine**, twinned at android `StatsManager.as:2209-2211`. Dan runs 0..9, ten rungs, and the string
table independently carries exactly ten consecutive titles, ids 455-464, `(初段)`…`(十段)`, with 465
= "Renshi" unrelated. Confirmed twice from two artifact kinds.

**What I am not claiming:** nothing here touches `tenthGold=100`. RR:165's *"film shows a flat +25
gold every rebirth"* is untouched and survives. Split RR:164 — promote the dan constant, leave the
gold one INFERRED.

### N6 — the S0-3 parity caveat is now discharged as "they differ", 4 for 4

S0-3 says web/android *"combat tuning parity is NOT established."* Judging this packet established
it, in the worst direction. Four divergences, all measured first-hand:

| | web v0.717 | android v0.682 |
|---|---|---|
| SPD -> cooldown cap | **600** | 300 |
| in-combat stance gate | **`reload < 48`** | `reload < maxreload / 6` (= 8 + SPD) |
| HUD reload zero point | **48** | 24 |
| reach mult L/B/H | **1.4 / 1+0.02m / 0.5+0.04m** | 1.5 / 1+0.005M / 0.5+0.005M |

The stance gate and the zero point only agree at SPD 40 and never, respectively. And note what the
third row *explains*: **only on web does the empty bar coincide with the stance gate at 48** — which
is precisely why only the web build can reuse the empty bar as the "CANNOT CHANGE STANCE" readout,
and why android's `BattleUI` carries no such label at all. The divergence and §2's finding are the
same fact seen twice.

Corollary for this lane's own rules: **an android combat constant asserted as web behaviour was
wrong four times out of four in the region I sampled.** Android v0.682 is superb as a *naming key*
for the obfuscated web symbols — it is what made this entire packet legible — and should never be
used as a *value source* for tuning.

---

## 6. Bottom line

* **7/7 judged, 0 skipped, 0 refuted, 7/7 overturns upheld** — one (claim 2) upheld against
  RR:88/RR:190 ② rather than against the sentence it quotes, and the rewrite must record that as an
  evidence *promotion*, not a reversal.
* **3 defects caught**: one material (`+6/tick` -> **on kill**), two minor (a ledger pointer 40
  lines off; a dangling cross-reference that turned out to be a different rule).
* **6 unclaimed findings**, including **RR:190 ①** — the blocker the ledger calls the one value the
  whole combat model needs — closing as CONTRACT in stage pixels.
* The frames did the deciding work on the only claim where frames were available, and they
  contradicted a measurement doc. **The frame won.**
