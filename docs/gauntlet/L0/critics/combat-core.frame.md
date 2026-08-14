# CRITIC — combat-core — LENS 4 (THE FRAME LENS)

Blind review. I did not see the surveyor's reasoning, only its claim list. Every verdict
below carries an artifact **I** opened. Crops are stated. All image work done with PIL
(no ImageMagick on this box); crop tuples are `(left, top, right, bottom)` in the raw
1920×1080 frame's own pixel coordinates, upscale factor given per crop.

## Headline

**17 of 20 claims survive. 3 fall (1 material, 2 minor).** The unit is unusually strong:
every A2 quote I pulled came back verbatim, and the two visual claims the surveyor
actually graded from frames (`150pct-damage-is-a-buff`, `crit-meter-exists-in-web-build`)
are correct — I reproduced both by eye.

What falls is exactly where a **document was trusted over a frame**:

1. **`mitigation-and-part-rule` — the damage-popup colour is WRONG and MIS-CITED.** The
   claim says popups spawn "in 0x990000" and that this *closes ui-hud blocker ③*. The
   frames say otherwise, and so does the source the surveyor didn't quote. **THE FRAME
   WINS.** (material)
2. **`crit-meter-fill-rate` — 5.8 s is 3 % low; the answer is 6.0 s.** The surveyor's
   track width (263 px) is wrong. I measured the track directly off a **full** bar:
   `x 245..512 = 268 px`. Rate 45.0 px/s ⇒ **5.96 s**, which is what three independent
   routes already say. (minor)
3. **`crit-gating` — "refill 48 + SPD·6" is dead code in v0.682.** `baseReload` is
   assigned and never read. The meter fills at a flat `++reload`; SPD does not touch it.
   (minor)

Nothing here is a SESSION-18 A4-D repeat — the surveyor did open frames. But it graded
one HUD element from AS3 while a frame that contradicts it sits in `damage-ttk/`.

---

## FRAME WORK I DID (own cites)

### F1 — the HUD, at 3× (settles `150pct-damage-is-a-buff`, and the third bar)

`reference/frames/session11/crit-focus/t1003.000.png`, crop `(0,900)-(640,1080)`, NEAREST ×3.

Visible: portrait ring (red), **green 14/20**, **blue 31/31**, a **third brown/empty bar
reading "CANNOT CHANGE STANCE"**, and below the bars **"150% DAMAGE" in gold**.
Exactly as claimed. HELD.

### F2 — the crit meter at 100 %, on a RAW frame (strengthens `crit-meter-exists-in-web-build`)

`reference/frames/session11/gap-focus-trigger/t2175.933.png` (1920×1080 raw frame),
crop `(100,940)-(620,1080)`, LANCZOS ×3.

Visible: **green 4/20**, **blue 47/47**, **third bar 100 % solid white with "CRITICAL HIT"
printed across it in the game's own brush face.**

> ⚠ The surveyor cited `gap-focus-trigger/m_nearfull.png` — an **1800×780 two-panel
> composite an earlier agent assembled**, not a raw frame. Its substance is right (I
> opened it too: upper panel bar ~97 % unlabelled, lower panel 100 % + "CRITICAL HIT",
> HP 11/20 · Chi 47/47 in both). But a raw 1920×1080 frame showing the same thing exists
> and should be the cite. **Swap the cite to `t2175.933.png`.**

### F3 — the track width, measured on the full bar (refutes the 5.8 s constant)

Same frame `t2175.933.png`. White-pixel extent over rows 1026–1049, x∈[200,600]:

```
bar white extent x 245 -> 512   width 268
```

The surveyor's `248..511 = 263 px` is 5 px short. Their stated validation ("HP 14/20 puts
the green edge at x=433 = 70.3 %") does not discriminate: `248+0.70·263 = 432.1` and
`245+0.70·268 = 432.6` both round into x=433. Measuring the **full** bar does.

### F4 — the fill rate, re-derived from the frames the surveyor used

Row y=1032, run-length scan of `crit-focus/*.png`, x∈[230,540]. I reproduce their fill
edges to ±1 px:

| frame | white run | edge | % of 268-px track |
|---|---|---|---|
| t1004.800 | 247→281 | 281 | 13.4 |
| t1005.000 | 247→290 | 290 | 16.8 |
| t1082.100 | 247→303 | 303 | 21.6 |
| t1082.900 | 247→339 | 339 | 35.1 |
| t3779.000 | 247→369 | 369 | 45.5 |

Rate from the long baseline: `(339−303)/0.8 s = 45.0 px/s` ⇒ **268/45.0 = 5.96 s**.

Third route: `gap-focus-trigger/focusbar_scan2_videoB_fps15.tsv` contains one complete
empty→full sweep — edge `247 @ t2170.000 → 512 @ t2176.000` = **6.000 s**.

Fourth route (already in the repo, which the surveyor did not reconcile with):
`docs/research/fidelity/session11-raw/crit-focus.txt` — *"EMPTY TO FULL = 6.00 s (three
independent 60fps regressions agreeing to 0.5%: 6.01 / 6.00 / 5.98 s)"*, and
`docs/research/fidelity/COMBAT_MEASUREMENTS.md` f-6 — *"Focus empty→full ≈ 5.9 s"*.

**Build 6.0 s, not 5.8 s.** The structural finding stands and is important: the android
v0.682 constants predict **4.00 s** (`maxreload = 5*24` MCSPlayer.as:239; displayed span
`tempreload/(maxreload-24)` = 96 ticks, MCSPlayer.as:1158-1168; `frameRate = 24`), and I
confirmed that `-24` is real, not an invention. 4.00 s vs 6.0 s ⇒ the web build's effective
tick is ~16 Hz on this axis. **THE FRAME WINS; the android number must not be promoted.**

### F5 — damage popups: TWO colours, not one (REFUTES a sub-claim)

`reference/frames/session11/damage-ttk/t1960.000.png`, crop `(760,500)-(900,620)`,
LANCZOS ×6. Over the player (name tag "GUEST", HP 14/20), a fading **"2"** whose modal
colour over the pale-blue sky is `(140,160,180)` / `(140,140,180)` — a **black glyph
fading by alpha**, no red channel dominance anywhere in the crop.

`reference/frames/session11/damage-ttk/t1961.900.png`, crop `(470,580)-(680,700)`,
LANCZOS ×5. Over **JINBEI (4)** (enemy, HP bar ~55 %), a **red "36"**, core pixels
`(163,14,0)` — consistent with 0x990000 after video compression.

The source agrees with the frames and disagrees with the claim:

```
MCSPlayer.as:3540-3547
   if(this.controlledBy == 0)  ProjectileManager.createFloatingText(mcs.x,mcs.y-100,damage.toString(),0);          // BLACK
   else                        ProjectileManager.createFloatingText(mcs.x,mcs.y-100,damage.toString(),10027008);   // 0x990000
```

and there are **four more** popup colours, none of them mentioned:
fire `16737792` = 0xFF6600, wind `13421772` = 0xCCCCCC, water `26367` = 0x0066FF,
earth `6697728` = 0x663300 (MCSPlayer.as:3551-3563, NPC.as:501-513), plus chi
`3394815` = 0x33CCFF (MCSPlayer.as:1633).

The single colour the surveyor quoted lives at **NPC.as:497**, which is *outside* the
cited range `NPC.as:386-462`. A HUD built to this claim would paint every hit the player
takes dark red. **ui-hud blocker ③ is not closed by one colour; it is closed by the
semantic** (black = taken by you, 0x990000 = dealt, element colours per element).
`docs/research/fidelity/session11-raw/damage-ttk.txt` already proved the semantic from
frames: *"the black number equals the player's HP loss on the same frame in 13 of 14 events"*.

### F6 — the drawn stroke: taper, thickness and colour CONFIRMED ON FRAME

The claim `reach-is-arclength` asserts the stroke "visibly tapers to zero thickness" but
cites only AS3. A frame settles it, so I opened one.

`reference/frames/session11/stance-reach/B_t862.667_HEAVY_thin-dark-tail-plus-bold-head.png`,
crop `(400,690)-(1020,820)`, LANCZOS ×3, plus the frame 67 ms earlier
`B_t862.600_HEAVY_bold-bright-red-head-only.png` at the identical crop.

- At **t862.600**: a single **bold** red bar over the enemy (≈x 840-940). No tail.
- At **t862.667**: the same bold segment, **plus a thin red line now extending left**
  across the whole crop.

So the stroke was drawn right→left, **thick where it started, thinning as it ran** —
exactly `lineStyle(thickness - thickness*((maxDistance-distanceLeft)/maxDistance), ...)`
at InputManager.as:352.

Measured thickness profile (red-pixel column heights, y∈[700,800]):

```
x=460: 2px   x=540: 5px   x=780: 4px   x=900: 13px   x=940: 18px
```

Modal stroke colour `(150,0,0)`; `10027008` = **0x990000** = `(153,0,0)`. ✔

**Bonus — this independently fixes the world→screen scale.** `thickness:int = 8`
(InputManager.as:57) rendering at a measured **18 screen px** gives **2.25 px per world
unit** = 1080/480. That is a frame-side confirmation of `StatsManager.stageWidth = 800`
/ `stageHeight = 480` (StatsManager.as:80,82), which is what `reach-cap`'s "800×480 world
units" rests on. Letterboxing measured on `crit-focus/t1003.000.png`: content spans
x 52..1867, full height 0..1079.

### F7 — NEW: a frame proves the damage roll is RANDOM and kills the legacy "crit 1.3"

`docs/research/fidelity/session11-raw/damage-ttk.txt` records red **27 / 30 / 36** landing
on JINBEI (4), *"same target, same stance, same fight, seconds apart"*, and infers
`36/27 = 1.333` might be the folkloric crit 1.3.

I checked the crit meter on those frames. Scanning row 1032 for a white fill run from
x=247 across every `damage-ttk/t19*.png`: **bar = 0 px (0 %) on all 18 frames**, and the
HUD crop of `t1961.900.png` `(100,940)-(620,1080)` ×3 reads **"CANNOT CHANGE STANCE"** —
i.e. `reload < maxreload/6` (MCSPlayer.as:2977). **The 36 was not a crit.**

⇒ 27/30/36 is a ±15 % *roll* spread on one target in one stance, which is precisely
`var baseDamage:int = this.minDamage + Math.random() * this.damageRange`
(MCSPlayer.as:3200). **Frame-side corroboration of `combat-core/damage-formula`, and the
"crit = 1.3" inference is dead by frame, not just by source.**

### F8 — NEW: a third android↔web divergence, frame-grounded

The web build prints **"CANNOT CHANGE STANCE"** on the reload bar (I read it on
`crit-focus/t1003.000.png` and `damage-ttk/t1961.900.png`). That string **does not exist**
in the android build's 2,533-entry table: `docs/gauntlet/L0/index/strings.json` has
`208: "Change Stance"` and `125: "Stance Restriction"`, and no entry matching
`cannot.*stance` at all (searched case-insensitively over every value).

This strengthens `build-version-parity`. Divergences now: (1) crit-meter period 4.00 s vs
6.0 s, (2) this UI string, and (3) — see below — the reach coefficients read against the
one lvl-1 frame we have.

### F9 — frames vs the reach formula: consistent, not contradicted

`stance-reach/` carries measured stroke spans in its filenames. Converting at 2.25 px/unit
(F6): BALANCED lvl-1 max **239 px ⇒ 106 world**; LIGHT late-game **553 px ⇒ 246 world**;
HEAVY **154-194 px ⇒ 68-86 world**. All three are *at or under* the formula's cap
(lvl-1 balanced = 124), which is what a cap predicts — a player need not draw to it. **No
frame contradicts `reach-cap` or `reach-stance-mults`.** The heavy readings sitting under
the 100-unit floor are also not a contradiction, for the same reason.

---

## RISK I AM FLAGGING BUT NOT REFUTING — the mastery domain

`reach-stance-mults` and `damage-formula` both hinge on `0.5 * mastery * 0.01` = **0.005
per point**. The surveyor reads the domain as 0-10 (skilldata.xml skill 1000 levels run
`<value>1</value>` … `<value>10</value>`, verified). But `0.5 %-per-point` is the idiom of
a **0-100** scale, and on a 0-10 scale the terms are nearly inert: at max mastery balanced
reach is only ×1.05 and heavy ×0.55 — permanently under its own 100 floor, i.e. the heavy
mastery term would never do anything at all. That is a strange thing to ship. Domain 0-10
is the better-evidenced reading and I am not overturning it, but **this is the single
assumption most likely to be wrong**, and it silently scales two whole tables. Worth one
frame measurement: a lvl-1 vs high-mastery balanced stroke at the same SPD.

---

## VERDICT TABLE

| claim | verdict | severity |
|---|---|---|
| reach-cap | stands | — |
| reach-stance-mults | stands | — |
| reach-is-arclength | stands — **upgraded to A1** (F6) | — |
| crit-multiplier | stands — frame-corroborated (F7) | — |
| crit-gating | **falls (part)** — "refill 48 + SPD·6" is dead code | minor |
| crit-meter-exists-in-web-build | stands — **re-cite to the raw frame** (F2) | — |
| crit-meter-fill-rate | **falls** — 5.8 s → **6.0 s** (F3/F4) | minor |
| multi-target-full-damage | stands | — |
| hit-registration-instant-at-endslash | stands | — |
| pass-through-dash | stands | — |
| gesture-classifier | stands | — |
| slash-type-map | stands | — |
| damage-formula | stands — frame-corroborated (F7) | — |
| mitigation-and-part-rule | **falls (part)** — popup colour / ui-hud ③ (F5) | material |
| heavy-def-0.8 | stands | — |
| stance-triangle | stands | — |
| early-ttk | stands | — |
| launch-unlock-levels | stands | — |
| 150pct-damage-is-a-buff | stands — I re-verified by eye (F1) | — |
| build-version-parity | stands — honest STILL_UNHELD, **strengthened** (F8) | — |

## Score

The surveyor said **78**. I'd hold it at **76** — the three corrections are small, but one
of them (popup colour) was a wrong HUD claim made from source with a contradicting frame
sitting in the repo, and a second (5.8 s) restated a number the repo already had, worse.
Everything else in this unit is unusually well-evidenced and the A2 quoting is honest.
